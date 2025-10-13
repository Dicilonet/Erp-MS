/**
 * @file Firebase Cloud Functions para el ERP DICILO
 * Versión final, limpia y con todos los módulos.
 */

// --- Dependencias ---
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue, addDoc } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const { setGlobalOptions } = require("firebase-functions/v2");
const { getAuth } = require('firebase-admin/auth');
const { defineSecret } = require("firebase-functions/params");
const { createProfessionalEmail } = require('./emailTemplate');
const { google } = require('googleapis');


// Define los secretos que tu código necesitará
const smtpPassDefault = defineSecret('SMTP_PASS_DEFAULT');
const smtpPassAccounting = defineSecret('SMTP_PASS_ACCOUNTING');
const smtpPassMedia = defineSecret('SMTP_PASS_MEDIA');
const smtpPassNoreply = defineSecret('SMTP_PASS_NOREPLY');

// --- Nuevos Secretos para la API de Gmail ---
const GMAIL_CLIENT_ID = defineSecret("GMAIL_CLIENT_ID");
const GMAIL_CLIENT_SECRET = defineSecret("GMAIL_CLIENT_SECRET");
const GMAIL_REDIRECT_URI = defineSecret("GMAIL_REDIRECT_URI");


// Carga la configuración local y las plantillas
const config = require('./config');
const planTemplates = require('./planTemplates');
const { serviceCatalogData } = require('./service-catalog-data');

// --- Inicialización y Configuración GLOBAL ---
initializeApp();
const db = getFirestore();
const auth = getAuth();
setGlobalOptions({ region: "europe-west1", secrets: [GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI, smtpPassDefault, smtpPassAccounting, smtpPassMedia, smtpPassNoreply] });

// --- Lógica para Gmail ---
const createOAuth2Client = () => {
    return new google.auth.OAuth2(
        GMAIL_CLIENT_ID.value(),
        GMAIL_CLIENT_SECRET.value(),
        GMAIL_REDIRECT_URI.value()
    );
};

exports.gmail_auth_start = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'El usuario debe estar autenticado.');
    }
    
    const oauth2Client = createOAuth2Client();
    
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // Importante para obtener un refresh token cada vez
        scope: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth.userinfo.email',
        ],
        state: request.auth.uid, // Pasamos el UID del usuario para identificarlo en el callback
    });

    return { authUrl };
});


exports.gmail_auth_callback = onRequest({ cors: true }, async (req, res) => {
    const { code, state: uid } = req.query;

    if (!code || !uid) {
        res.status(400).send('Faltan el código de autorización o el UID del usuario.');
        return;
    }

    try {
        const oauth2Client = createOAuth2Client();
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Obtenemos el email de la cuenta de Google
        const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email;
        
        if (!email) {
            throw new Error("No se pudo obtener el email de la cuenta de Google.");
        }

        // Guardar los tokens de forma segura en una subcolección del usuario
        const connectionData = {
            userId: uid,
            type: 'gmail',
            accountEmail: email,
            tokens: tokens, // Contiene access_token, refresh_token, etc.
            createdAt: FieldValue.serverTimestamp()
        };

        const connectionRef = db.collection('users').doc(uid).collection('connections').doc(email);
        await connectionRef.set(connectionData);

        // Redirigir al usuario de vuelta a la aplicación
        res.redirect('/communications/email?status=success');

    } catch (error) {
        console.error('Error en el callback de Gmail:', error);
        res.redirect('/communications/email?status=error');
    }
});


exports.gmail_api_proxy = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'El usuario debe estar autenticado.');
    }
    const { uid } = request.auth;
    const { action, params, accountEmail } = request.data;
    
    // Obtener tokens para el usuario y la cuenta especificada
    const connectionRef = db.collection('users').doc(uid).collection('connections').doc(accountEmail);
    const connectionSnap = await connectionRef.get();

    if (!connectionSnap.exists) {
        throw new HttpsError('not-found', 'No se encontró una conexión de Gmail para este usuario y cuenta.');
    }

    const connectionData = connectionSnap.data();
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials(connectionData.tokens);

    // Refrescar el token si es necesario (la librería lo hace automáticamente)
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    try {
        switch (action) {
            case 'listMessages':
                const listResponse = await gmail.users.messages.list({
                    userId: 'me',
                    maxResults: params?.maxResults || 15,
                    labelIds: params?.labelIds || ['INBOX'],
                });
                return listResponse.data;
            
            // Aquí se añadirían más casos: 'getMessage', 'sendMessage', etc.

            default:
                throw new HttpsError('invalid-argument', 'Acción de API no válida.');
        }
    } catch(error) {
        console.error("Error en el proxy de la API de Gmail:", error);
        throw new HttpsError('internal', 'Error al comunicarse con la API de Gmail.');
    }
});


/**
 * Función que se dispara cuando se crea un nuevo documento de cliente.
 * Lee el 'planId' y genera automáticamente la lista de servicios/entregables.
 */
exports.onCustomerCreate = onDocumentCreated(
  { document: 'customers/{customerId}', region: 'europe-west1' },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return;
    }

    const customerData = snapshot.data();
    const customerId = event.params.customerId;
    const planId = customerData.planId;

    console.log(`Cliente nuevo creado: ${customerId} con plan: ${planId}`);

    const servicesToCreate = planTemplates[planId];
    if (!servicesToCreate || servicesToCreate.length === 0) {
      console.log(`No hay plantilla de servicios para el plan: ${planId}`);
      return;
    }

    const batch = db.batch();
    const servicesCollectionRef = db.collection(
      `customers/${customerId}/customerServices`
    );

    servicesToCreate.forEach((serviceTemplate) => {
      const newServiceRef = servicesCollectionRef.doc(
        serviceTemplate.serviceId
      );
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      let nextDueDate = null;

      const frequencyString = serviceTemplate.frequency.toString();
      if (
        (frequencyString.includes('mes') || frequencyString.includes('año')) &&
        serviceTemplate.status === 'Pendiente'
      ) {
        nextDueDate = nextMonth.toISOString();
      }

      batch.set(newServiceRef, {
        ...serviceTemplate,
        nextDueDate: nextDueDate,
      });
    });

    // --- Añadir la estructura de serviceUsage por defecto ---
    const customerRef = db.collection('customers').doc(customerId);
    batch.update(customerRef, {
      serviceUsage: {
        socialPosts_monthly: { used: 0, limit: 60 },
        kiCourses_yearly: { used: 0, limit: 4 },
      },
    });

    try {
      await batch.commit();
      console.log(
        `Se crearon ${servicesToCreate.length} servicios para el cliente ${customerId}`
      );
    } catch (error) {
      console.error(
        `Error al crear servicios para el cliente ${customerId}:`,
        error
      );
    }
  }
);

/**
 * Función auxiliar para enviar emails con Nodemailer y SMTP personalizado.
 * @param {object} emailPayload - Datos del correo a enviar (to, subject, html, etc.).
 * @param {string} [accountType='default'] - El tipo de cuenta a usar ('accounting', 'media', 'noreply').
 * @returns {Promise<object>} - Respuesta de Nodemailer.
 */
const sendEmailWithNodemailer = async (
  emailPayload,
  accountType = 'default'
) => {
  // Lazy load nodemailer to avoid deployment timeouts
  const nodemailer = require('nodemailer');

  const smtpConfig = config.smtp.default;
  const accountConfig =
    config.smtp.accounts[accountType] || config.smtp.accounts.noreply;

  let password;
  switch (accountType) {
    case 'accounting':
      password = smtpPassAccounting.value();
      break;
    case 'media':
      password = smtpPassMedia.value();
      break;
    case 'noreply':
      password = smtpPassNoreply.value();
      break;
    default:
      password = smtpPassDefault.value();
  }

  if (!accountConfig) {
    console.error(
      `Configuración de cuenta de email no encontrada para: ${accountType}`
    );
    throw new HttpsError(
      'internal',
      `La cuenta de correo '${accountType}' no está configurada.`
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: accountConfig.auth.user,
      pass: password, // Usamos la contraseña cargada desde el Secret Manager
    },
  });

  const finalHtml = createProfessionalEmail(emailPayload.html);

  const mailOptions = {
    from: accountConfig.from,
    ...emailPayload,
    html: finalHtml, // Usamos el HTML final con la plantilla
  };

  try {
    console.log(
      `Enviando email desde ${mailOptions.from} a: ${emailPayload.to} con asunto: "${emailPayload.subject}"