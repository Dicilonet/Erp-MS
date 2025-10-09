

/**
 * @file Firebase Cloud Functions para el ERP DICILO
 * Versión final, limpia y con todos los módulos.
 */

// --- Dependencias ---
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const {
  onCall,
  onRequest,
  HttpsError,
} = require('firebase-functions/v2/https');
const { getFirestore, FieldValue, addDoc } = require('firebase-admin/firestore');
const { initializeApp } = require('firebase-admin/app');
const { setGlobalOptions } = require('firebase-functions/v2');
const { getAuth } = require('firebase-admin/auth');
const { defineSecret } = require('firebase-functions/params');
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
setGlobalOptions({ region: 'europe-west1', secrets: [GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI, smtpPassDefault, smtpPassAccounting, smtpPassMedia, smtpPassNoreply] });

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
      `Enviando email desde ${mailOptions.from} a: ${emailPayload.to} con asunto: "${emailPayload.subject}"`
    );
    const info = await transporter.sendMail(mailOptions);
    console.log(
      'Email enviado con éxito a través de Nodemailer.',
      JSON.stringify(info)
    );
    return info;
  } catch (error) {
    console.error('Excepción al enviar email con Nodemailer:', error);
    throw new HttpsError(
      'internal',
      'Ocurrió una excepción inesperada en el servicio de correo.'
    );
  }
};

/**
 * Función auxiliar para validar emails
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Procesa una solicitud de envío de correo genérico.
 */
exports.sendEmail = onCall(
  {
    region: 'europe-west1',
    secrets: [
      smtpPassDefault,
      smtpPassAccounting,
      smtpPassMedia,
      smtpPassNoreply,
    ],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'El usuario debe estar autenticado.'
      );
    }

    const { to, cc, bcc, subject, body, attachments, fromAccount } =
      request.data;
    if (!to || !subject || !body || !isValidEmail(to)) {
      throw new HttpsError(
        'invalid-argument',
        'Datos de correo inválidos o incompletos.'
      );
    }

    const emailPayload = {
      to: to,
      cc: cc,
      bcc: bcc,
      subject,
      html: body,
      attachments: attachments,
    };

    await sendEmailWithNodemailer(emailPayload, fromAccount || 'default');

    return { success: true, message: 'Correo enviado correctamente.' };
  }
);

/**
 * Crea una oferta como borrador o la envía directamente.
 */
exports.createOffer = onCall(
  { region: 'europe-west1', secrets: [smtpPassAccounting] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'El usuario debe estar autenticado.'
      );
    }

    const {
      customerId,
      items,
      notes,
      issueDate,
      expiryDate,
      documentTitle,
      introductoryText,
      sendEmail,
    } = request.data;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      throw new HttpsError(
        'invalid-argument',
        'Datos incompletos para crear la oferta.'
      );
    }

    try {
      const customerRef = db.collection('customers').doc(customerId);
      const customerDoc = await customerRef.get();
      if (!customerDoc.exists) {
        throw new HttpsError('not-found', 'Cliente no encontrado.');
      }
      const customerData = customerDoc.data();
      if (
        sendEmail &&
        (!customerData.contactEmail || !isValidEmail(customerData.contactEmail))
      ) {
        throw new HttpsError(
          'failed-precondition',
          'El cliente no tiene un email de contacto válido para el envío.'
        );
      }

      const offerCounterRef = db.collection('counters').doc('offers');
      const offerNumber = await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(offerCounterRef);
        const year = new Date().getFullYear();
        let newCount;
        if (!counterDoc.exists || counterDoc.data().year !== year) {
          newCount = 1;
          transaction.set(offerCounterRef, { count: newCount, year: year });
        } else {
          newCount = counterDoc.data().count + 1;
          transaction.update(offerCounterRef, { count: newCount });
        }
        return `OFERTA-${year}-${String(newCount).padStart(3, '0')}`;
      });

      let subtotal = 0;
      let totalTax = 0;
      let totalTaxRate = 0; // Para calcular el tipo de impuesto promedio

      const processedItems = items.map((item, index) => {
        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        const discount = Number(item.discount) || 0;
        const taxRate = Number(item.taxRate) || 0;

        if (quantity <= 0 || price < 0) {
          throw new HttpsError(
            'invalid-argument',
            `Item ${index + 1} con valores inválidos.`
          );
        }

        const itemSubtotal = quantity * price * (1 - discount / 100);
        const itemTax = itemSubtotal * (taxRate / 100);
        subtotal += itemSubtotal;
        totalTax += itemTax;

        return {
          ...item,
          total: Number(itemSubtotal.toFixed(2)),
          taxRate: taxRate,
        };
      });

      if (subtotal > 0) {
        totalTaxRate = totalTax / subtotal || 0;
      }

      const total = subtotal + totalTax;

      const offerRef = db.collection(`customers/${customerId}/offers`).doc();

      const offerData = {
        offerNumber,
        customerId,
        customerName: customerData.name,
        status: sendEmail ? 'Enviada' : 'Borrador',
        documentTitle: documentTitle || 'Oferta',
        introductoryText: introductoryText || '',
        items: processedItems,
        notes: notes || '',
        issueDate: issueDate || new Date().toISOString(),
        expiryDate: expiryDate || new Date().toISOString(),
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(totalTax.toFixed(2)),
        taxRate: totalTaxRate,
        total: Number(total.toFixed(2)),
        createdAt: new Date().toISOString(),
        createdBy: request.auth.uid,
        offerId: offerRef.id,
      };

      await offerRef.set(offerData);

      if (sendEmail) {
        await db.collection(`customers/${customerId}/interactions`).add({
          type: 'Oferta',
          summary: `Se envió la oferta ${offerNumber} por un total de ${total.toFixed(
            2
          )}€`,
          date: new Date().toISOString(),
          createdBy: request.auth?.uid || 'system',
        });

        const formatDate = (dateString) =>
          new Date(dateString).toLocaleDateString('es-ES');
        const formatCurrency = (amount) =>
          new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
          }).format(amount);
        const trackingPixelUrl = `https://europe-west1-erp-dicilo.cloudfunctions.net/trackEmailOpen?offerId=${offerRef.id}&customerId=${customerId}`;

        const emailBody = `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h1 style="color: #333;">${
                      documentTitle || 'Oferta'
                    } ${offerNumber}</h1>
                    <p><strong>Fecha:</strong> ${formatDate(issueDate)}</p>
                    <p><strong>Válida hasta:</strong> ${formatDate(
                      expiryDate
                    )}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p>${(introductoryText || '').replace(/\n/g, '<br>')}</p>
                    <br>
                    <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse: collapse;">
                        <thead style="background-color: #f8f9fa;">
                            <tr>
                                <th>Artículo</th>
                                <th style="text-align: right;">Cant.</th>
                                <th style="text-align: right;">P. Unit.</th>
                                <th style="text-align: right;">Dto.</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${processedItems
                              .map(
                                (item) => `
                                <tr>
                                    <td>${item.description}</td>
                                    <td style="text-align: right;">${
                                      item.quantity
                                    } ${item.unit}</td>
                                    <td style="text-align: right;">${formatCurrency(
                                      item.price
                                    )}</td>
                                    <td style="text-align: right;">${
                                      item.discount
                                    }%</td>
                                    <td style="text-align: right;"><strong>${formatCurrency(
                                      item.total
                                    )}</strong></td>
                                </tr>`
                              )
                              .join('')}
                        </tbody>
                    </table>
                    <div style="margin-top: 20px; padding-top: 20px; text-align: right;">
                        <p>Subtotal: ${formatCurrency(subtotal)}</p>
                        <p>+ Impuestos: ${formatCurrency(totalTax)}</p>
                        <h3 style="margin-top: 10px;"><strong>Total: ${formatCurrency(
                          total
                        )}</strong></h3>
                    </div>
                    ${
                      notes
                        ? `<div style="margin-top:20px; padding:10px; border-top: 1px solid #eee;"><p><strong>Notas:</strong><br>${notes.replace(
                            /\n/g,
                            '<br>'
                          )}</p></div>`
                        : ''
                    }
                    <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">Gracias por su interés.</p>
                    <img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />
                </div>`;

        await sendEmailWithNodemailer(
          {
            to: customerData.contactEmail,
            subject: `Su oferta de DICILO - Nº ${offerNumber}`,
            html: emailBody,
          },
          'accounting'
        ); // Usa la cuenta de contabilidad
      }

      return { success: true, offerNumber, offerId: offerRef.id };
    } catch (error) {
      console.error('Error al crear la oferta:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError('internal', 'No se pudo crear la oferta.');
    }
  }
);

/**
 * Actualiza una oferta existente, principalmente para guardar borradores o enviarlos.
 */
exports.updateOffer = onCall(
  { region: 'europe-west1', secrets: [smtpPassAccounting] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'El usuario debe estar autenticado.'
      );
    }

    const {
      offerId,
      customerId,
      items,
      notes,
      issueDate,
      expiryDate,
      documentTitle,
      introductoryText,
      sendEmail,
    } = request.data;

    if (
      !offerId ||
      !customerId ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new HttpsError(
        'invalid-argument',
        'Datos incompletos para actualizar la oferta.'
      );
    }

    const offerRef = db
      .collection(`customers/${customerId}/offers`)
      .doc(offerId);

    try {
      const offerDoc = await offerRef.get();
      if (!offerDoc.exists) {
        throw new HttpsError('not-found', 'La oferta no fue encontrada.');
      }
      if (offerDoc.data().status !== 'Borrador') {
        throw new HttpsError(
          'failed-precondition',
          'Solo se pueden editar ofertas en estado de borrador.'
        );
      }

      const customerRef = db.collection('customers').doc(customerId);
      const customerDoc = await customerRef.get();
      const customerData = customerDoc.data();
      if (
        sendEmail &&
        (!customerData.contactEmail || !isValidEmail(customerData.contactEmail))
      ) {
        throw new HttpsError(
          'failed-precondition',
          'El cliente no tiene un email de contacto válido para el envío.'
        );
      }

      let subtotal = 0;
      let totalTax = 0;
      let totalTaxRate = 0;

      const processedItems = items.map((item) => {
        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        const discount = Number(item.discount) || 0;
        const taxRate = Number(item.taxRate) || 0;

        const itemSubtotal = quantity * price * (1 - discount / 100);
        const itemTax = itemSubtotal * (taxRate / 100);
        subtotal += itemSubtotal;
        totalTax += itemTax;

        return { ...item, total: Number(itemSubtotal.toFixed(2)), taxRate };
      });

      if (subtotal > 0) {
        totalTaxRate = totalTax / subtotal || 0;
      }

      const total = subtotal + totalTax;

      const offerData = {
        status: sendEmail ? 'Enviada' : 'Borrador',
        documentTitle: documentTitle || 'Oferta',
        introductoryText: introductoryText || '',
        items: processedItems,
        notes: notes || '',
        issueDate: new Date(issueDate).toISOString(),
        expiryDate: new Date(expiryDate).toISOString(),
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(totalTax.toFixed(2)),
        taxRate: totalTaxRate,
        total: Number(total.toFixed(2)),
        updatedAt: new Date().toISOString(),
        updatedBy: request.auth.uid,
      };

      await offerRef.update(offerData);

      if (sendEmail) {
        await db.collection(`customers/${customerId}/interactions`).add({
          type: 'Oferta',
          summary: `Se envió la oferta ${
            offerDoc.data().offerNumber
          } por un total de ${total.toFixed(2)}€`,
          date: new Date().toISOString(),
          createdBy: request.auth?.uid || 'system',
        });

        const formatDate = (dateString) =>
          new Date(dateString).toLocaleDateString('es-ES');
        const formatCurrency = (amount) =>
          new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
          }).format(amount);
        const trackingPixelUrl = `https://europe-west1-erp-dicilo.cloudfunctions.net/trackEmailOpen?offerId=${offerId}&customerId=${customerId}`;

        const emailBody = `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h1 style="color: #333;">${documentTitle || 'Oferta'} ${
          offerDoc.data().offerNumber
        }</h1>
                    <p><strong>Fecha:</strong> ${formatDate(issueDate)}</p>
                    <p><strong>Válida hasta:</strong> ${formatDate(
                      expiryDate
                    )}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p>${(introductoryText || '').replace(/\n/g, '<br>')}</p>
                    <br>
                    <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse: collapse;">
                        <thead style="background-color: #f8f9fa;">
                            <tr>
                                <th>Artículo</th>
                                <th style="text-align: right;">Cant.</th>
                                <th style="text-align: right;">P. Unit.</th>
                                <th style="text-align: right;">Dto.</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${processedItems
                              .map(
                                (item) => `
                                <tr>
                                    <td>${item.description}</td>
                                    <td style="text-align: right;">${
                                      item.quantity
                                    } ${item.unit}</td>
                                    <td style="text-align: right;">${formatCurrency(
                                      item.price
                                    )}</td>
                                    <td style="text-align: right;">${
                                      item.discount
                                    }%</td>
                                    <td style="text-align: right;"><strong>${formatCurrency(
                                      item.total
                                    )}</strong></td>
                                </tr>`
                              )
                              .join('')}
                        </tbody>
                    </table>
                    <div style="margin-top: 20px; padding-top: 20px; text-align: right;">
                        <p>Subtotal: ${formatCurrency(subtotal)}</p>
                        <p>+ Impuestos: ${formatCurrency(totalTax)}</p>
                        <h3 style="margin-top: 10px;"><strong>Total: ${formatCurrency(
                          total
                        )}</strong></h3>
                    </div>
                    ${
                      notes
                        ? `<div style="margin-top:20px; padding:10px; border-top: 1px solid #eee;"><p><strong>Notas:</strong><br>${notes.replace(
                            /\n/g,
                            '<br>'
                          )}</p></div>`
                        : ''
                    }
                    <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">Gracias por su interés.</p>
                    <img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />
                </div>`;

        await sendEmailWithNodemailer(
          {
            to: customerData.contactEmail,
            subject: `Su oferta de DICILO - Nº ${offerDoc.data().offerNumber}`,
            html: emailBody,
          },
          'accounting'
        );
      }

      return { success: true, offerNumber: offerDoc.data().offerNumber };
    } catch (error) {
      console.error('Error al actualizar la oferta:', error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError('internal', 'No se pudo actualizar la oferta.');
    }
  }
);

/**
 * Actualiza el estado de una oferta (ej: Aceptada, Rechazada).
 */
exports.updateOfferStatus = onCall(
  { region: 'europe-west1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'El usuario debe estar autenticado.'
      );
    }

    const { customerId, offerId, newStatus } = request.data;
    if (!customerId || !offerId || !newStatus) {
      throw new HttpsError(
        'invalid-argument',
        'Datos incompletos para actualizar el estado.'
      );
    }

    const validStatuses = ['Aceptada', 'Rechazada', 'Vencida'];
    if (!validStatuses.includes(newStatus)) {
      throw new HttpsError('invalid-argument', 'El nuevo estado no es válido.');
    }

    const offerRef = db
      .collection(`customers/${customerId}/offers`)
      .doc(offerId);

    try {
      await offerRef.update({
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      return {
        success: true,
        message: `Estado de la oferta actualizado a ${newStatus}.`,
      };
    } catch (error) {
      console.error('Error al actualizar estado de la oferta:', error);
      throw new HttpsError(
        'internal',
        'No se pudo actualizar el estado de la oferta.'
      );
    }
  }
);

/**
 * Endpoint HTTP para el seguimiento de la apertura de correos electrónicos.
 */
exports.trackEmailOpen = onRequest(
  { region: 'europe-west1', cors: true },
  async (req, res) => {
    const { offerId, customerId } = req.query;

    if (!offerId || !customerId) {
      return res.status(400).send('Faltan parámetros de seguimiento.');
    }

    try {
      const offerRef = db
        .collection('customers')
        .doc(customerId)
        .collection('offers')
        .doc(offerId);
      const offerDoc = await offerRef.get();

      if (offerDoc.exists && offerDoc.data().status === 'Enviada') {
        await offerRef.update({ status: 'Visto' });
        console.log(`Oferta ${offerId} marcada como 'Visto'.`);
      }
    } catch (error) {
      console.error('Error en el píxel de seguimiento:', error);
    }

    // Devolver una imagen de 1x1 píxel transparente
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Content-Type', 'image/gif');
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    res.send(pixel);
  }
);

// --- Lógica de Gestión de Equipos ---
exports.createInternalUser = onCall(
  { region: 'europe-west1' },
  async (request) => {
    // 1. Verificación de permisos
    if (request.auth?.token?.role !== 'superadmin') {
      throw new HttpsError(
        'permission-denied',
        'Solo un superadmin puede crear usuarios internos.'
      );
    }

    // 2. Validación de datos de entrada
    const { email, password, fullName, country, whatsapp, role } = request.data;
    if (!email || !password || !fullName || !country || !whatsapp || !role) {
      throw new HttpsError(
        'invalid-argument',
        'Faltan datos para crear el usuario.'
      );
    }

    // 3. Bloque Try/Catch
    try {
      const userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: fullName,
      });

      await auth.setCustomUserClaims(userRecord.uid, { role: role });

      const userProfile = {
        email: email,
        role: role,
        profile: {
          fullName: fullName,
          country: country,
          whatsapp: whatsapp,
          photoUrl: '',
          memberSince: new Date().toISOString(),
          acquisitionChannel: 'Interno',
        },
        accessibleModules: [],
      };

      await db.collection('users').doc(userRecord.uid).set(userProfile);

      return { success: true, uid: userRecord.uid };
    } catch (error) {
      console.error('Error al crear usuario interno:', error);

      const errorMapping = {
        'auth/email-already-exists': {
          code: 'already-exists',
          message: 'El email proporcionado ya está en uso.',
        },
        'auth/invalid-password': {
          code: 'invalid-argument',
          message: 'La contraseña no cumple los requisitos de Firebase.',
        },
        'auth/invalid-email': {
          code: 'invalid-argument',
          message: 'El formato del email no es válido.',
        },
      };

      const firebaseError = errorMapping[error.code];
      if (firebaseError) {
        throw new HttpsError(firebaseError.code, firebaseError.message);
      }

      throw new HttpsError(
        'internal',
        `Ocurrió un error inesperado: ${error.message}`
      );
    }
  }
);

// Reemplaza tu función updateUserPermissions existente con esta versión
exports.updateUserPermissions = onCall(
  { region: 'europe-west1' },
  async (request) => {
    // 1. Verificación de permisos del Superadmin
    if (request.auth?.token?.role !== 'superadmin') {
      throw new HttpsError(
        'permission-denied',
        'Solo un superadmin puede actualizar permisos.'
      );
    }

    // 2. Validación de datos de entrada
    const { userId, modules } = request.data;
    if (!userId || !Array.isArray(modules)) {
      throw new HttpsError(
        'invalid-argument',
        'Se requiere el ID del usuario y una lista de módulos.'
      );
    }

    try {
      const userRef = db.collection('users').doc(userId);

      // 3. Actualizar el documento en Firestore usando el método UPDATE
      // --- ESTA ES LA CORRECCIÓN ---
      await userRef.update({
        accessibleModules: modules,
      });

      console.log(
        `Permisos actualizados para el usuario ${userId}: ${modules.join(', ')}`
      );

      // 4. Devolver una respuesta exitosa
      return {
        success: true,
        message: `Permisos para ${userId} actualizados correctamente.`,
      };
    } catch (error) {
      console.error('Error al actualizar los permisos del usuario:', error);
      if (error.code === 'not-found') {
        throw new HttpsError(
          'not-found',
          `El usuario con ID ${userId} no fue encontrado.`
        );
      }
      throw new HttpsError(
        'internal',
        'Ocurrió un error inesperado al actualizar los permisos.'
      );
    }
  }
);

exports.getDashboardData = onCall(
  { region: 'europe-west1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }

    // Solo un superadmin puede ver estos datos
    if (request.auth.token.role !== 'superadmin') {
      return { success: true, collaborators: [], teamOffice: [] };
    }

    try {
      // Hacemos ambas peticiones a la base de datos al mismo tiempo
      const collaboratorsQuery = db
        .collection('users')
        .where('role', '==', 'colaborador')
        .get();
      const teamOfficeQuery = db
        .collection('users')
        .where('role', '==', 'teamoffice')
        .get();

      const [collaboratorsSnapshot, teamOfficeSnapshot] = await Promise.all([
        collaboratorsQuery,
        teamOfficeQuery,
      ]);

      const collaborators = collaboratorsSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      const teamOffice = teamOfficeSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));

      return { success: true, collaborators, teamOffice };
    } catch (error) {
      console.error('Error al obtener los datos del dashboard:', error);
      throw new HttpsError(
        'internal',
        'No se pudieron cargar los datos del equipo.'
      );
    }
  }
);

/**
 * Permite a un usuario autenticado actualizar su propio perfil.
 */
exports.updateUserProfile = onCall(
  { region: 'europe-west1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'Debes estar autenticado para actualizar tu perfil.'
      );
    }

    const { uid } = request.auth;
    const { fullName, language } = request.data;

    if (
      !fullName ||
      typeof fullName !== 'string' ||
      fullName.trim().length < 3
    ) {
      throw new HttpsError(
        'invalid-argument',
        'El nombre completo es inválido.'
      );
    }
    if (language && !['en', 'es', 'de'].includes(language)) {
      throw new HttpsError(
        'invalid-argument',
        'El idioma seleccionado no es válido.'
      );
    }

    try {
      const userRef = db.collection('users').doc(uid);
      const authUserPromise = auth.updateUser(uid, { displayName: fullName });

      const firestoreUpdateData = {
        profile: {
          fullName: fullName,
          preferredLanguage: language,
        },
      };

      const firestoreUserPromise = userRef.set(firestoreUpdateData, {
        merge: true,
      });

      await Promise.all([authUserPromise, firestoreUserPromise]);

      console.log(`Perfil actualizado para el usuario ${uid}`);
      return { success: true, message: 'Perfil actualizado correctamente.' };
    } catch (error) {
      console.error(
        `Error al actualizar el perfil para el usuario ${uid}:`,
        error
      );
      throw new HttpsError(
        'internal',
        'Ocurrió un error inesperado al actualizar el perfil.'
      );
    }
  }
);

// --- Funciones Administrativas ---
exports.setSuperAdminRole = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const { email } = request.data;
    const superAdminEmail = config.superadmin_email; // Usamos el email desde el archivo de configuración

    // Para la primera vez, el usuario que se está registrando no tendrá un rol.
    // Permitimos que CUALQUIERA que se registre con el email de superadmin se auto-promocione.
    // En un entorno de producción, esta lógica debería ser más segura.
    if (
      request.auth?.token?.role !== 'superadmin' &&
      email !== superAdminEmail
    ) {
      console.log(
        `Intento no autorizado para asignar rol por ${
          request.auth?.token?.email || 'un usuario no autenticado'
        }`
      );
      throw new HttpsError(
        'permission-denied',
        'Solo un superadmin puede asignar roles, o debes usar el email de superadmin en el registro.'
      );
    }

    try {
      const user = await auth.getUserByEmail(email);
      await auth.setCustomUserClaims(user.uid, { role: 'superadmin' });
      console.log(`Éxito: Rol 'superadmin' asignado a ${email}.`);
      return {
        success: true,
        message: `¡Éxito! ${email} ha sido nombrado superadmin.`,
      };
    } catch (error) {
      console.error(`Error al asignar rol de superadmin a ${email}:`, error);
      throw new HttpsError(
        'internal',
        `No se pudo asignar el rol: ${error.message}`
      );
    }
  }
);

exports.updateCustomer = onCall({ region: 'europe-west1' }, async (request) => {
    if (request.auth?.token?.role !== 'superadmin' && request.auth?.token?.role !== 'colaborador') {
        throw new HttpsError('permission-denied', 'No tienes permiso para realizar esta acción.');
    }
    const { customerId, data } = request.data;
    if (!customerId || !data) {
        throw new HttpsError('invalid-argument', 'Faltan datos para actualizar el cliente.');
    }
    try {
        const customerRef = db.collection('customers').doc(customerId);
        await customerRef.update(data);
        return { success: true, message: 'Cliente actualizado correctamente.' };
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        throw new HttpsError('internal', 'No se pudo actualizar el cliente.');
    }
});


// --- NUEVAS FUNCIONES PARA GESTIÓN DE CLIENTES DEL ERP ---
exports.syncNewCustomersFromWebsite = onCall(
  { region: 'europe-west1' },
  async (request) => {
    if (request.auth?.token?.role !== 'superadmin') {
      throw new HttpsError(
        'permission-denied',
        'Solo los superadmins pueden sincronizar clientes.'
      );
    }

    try {
      const sourceSnapshot = await db.collection('businesses').get();
      const erpSnapshot = await db.collection('customers').get();

      const erpEmails = new Set(erpSnapshot.docs.map(doc => doc.data().contactEmail?.toLowerCase()).filter(Boolean));
      const erpNames = new Set(erpSnapshot.docs.map(doc => doc.data().name?.toLowerCase()).filter(Boolean));
      const erpOriginalIds = new Set(erpSnapshot.docs.map(doc => doc.data().originalId).filter(Boolean));
      
      const newDocsToCopy = sourceSnapshot.docs.filter(doc => {
        const data = doc.data();
        const email = data.email?.toLowerCase();
        const name = data.name?.toLowerCase();
        return !erpOriginalIds.has(doc.id) && (!email || !erpEmails.has(email)) && (!name || !erpNames.has(name));
      });


      if (newDocsToCopy.length === 0) {
        return {
          success: true,
          newCount: 0,
          message: 'No se encontraron clientes nuevos para añadir.',
        };
      }

      const batch = db.batch();
      newDocsToCopy.forEach((doc) => {
        const businessData = doc.data();
        const newCustomerRef = db.collection('customers').doc();

        const newCustomerData = {
          name: businessData.name || 'Nombre no disponible',
          contactEmail:
            businessData.email || `no-email-${newCustomerRef.id}@example.com`,
          category: businessData.category || 'Sin categoría',
          description: businessData.description || 'Cliente sincronizado.',
          planId: 'plan_privatkunde',
          paymentCycle: 'anual',
          country: 'DE',
          location: businessData.location || 'Ubicación no disponible',
          fullAddress: businessData.address || 'Dirección no disponible',
          coordinates: {
            latitude: businessData.coords?.latitude || 0,
            longitude: businessData.coords?.longitude || 0,
          },
          phone: businessData.phone || 'N/A',
          website: businessData.website || '',
          logoUrl: businessData.imageUrl || '',
          rating: businessData.rating || 0,
          status: 'activo',
          registrationDate: new Date().toISOString(),
          originalId: doc.id,
          erpStatus: 'nuevo',
          accountManager: null, // Asignar explícitamente null
          createdAtErp: FieldValue.serverTimestamp(),
          serviceUsage: {
            socialPosts_monthly: { used: 0, limit: 60 },
            kiCourses_yearly: { used: 0, limit: 4 },
          },
        };
        batch.set(newCustomerRef, newCustomerData);
      });

      await batch.commit();
      return { success: true, newCount: newDocsToCopy.length };
    } catch (error) {
      console.error('--- ERROR DURANTE LA SINCRONIZACIÓN ---:', error);
      throw new HttpsError(
        'internal',
        `Ocurrió un error inesperado durante la sincronización: ${error.message}`
      );
    }
  }
);


exports.cleanupDuplicateCustomers = onCall(
  { region: 'europe-west1' },
  async (request) => {
    if (request.auth?.token?.role !== 'superadmin') {
      throw new HttpsError(
        'permission-denied',
        'Solo un superadmin puede ejecutar esta acción.'
      );
    }

    try {
      console.log('Iniciando limpieza de clientes duplicados...');
      const customersSnapshot = await db.collection('customers').get();
      
      const customersByEmail = {};
      const customersByName = {};
      const duplicatesToDelete = new Set();

      customersSnapshot.docs.forEach(doc => {
          const customer = { id: doc.id, ...doc.data() };
          const email = customer.contactEmail?.toLowerCase().trim();
          const name = customer.name?.toLowerCase().trim();

          if (email && email !== '') {
              if (customersByEmail[email]) {
                  duplicatesToDelete.add(customer.id);
              } else {
                  customersByEmail[email] = customer.id;
              }
          }
          
          if (name && name !== '') {
             if (customersByName[name] && customersByName[name] !== customersByEmail[email]) {
                 duplicatesToDelete.add(customer.id);
             } else if (!customersByName[name]) {
                 customersByName[name] = customer.id;
             }
          }
      });
      
      const duplicateIds = Array.from(duplicatesToDelete);
      console.log(`Se encontraron ${duplicateIds.length} clientes duplicados para eliminar.`);

      if (duplicateIds.length > 0) {
        const batch = db.batch();
        duplicateIds.forEach((docId) => {
          batch.delete(db.collection('customers').doc(docId));
        });
        await batch.commit();
        console.log(`Se eliminaron ${duplicateIds.length} documentos duplicados.`);
      }

      return {
        success: true,
        deletedCount: duplicateIds.length,
        message: `Limpieza completada. Se eliminaron ${duplicateIds.length} clientes duplicados.`,
      };
    } catch (error) {
      console.error('Error durante la limpieza de duplicados:', error);
      throw new HttpsError(
        'internal',
        `Ocurrió un error inesperado durante la limpieza: ${error.message}`
      );
    }
  }
);

exports.deleteCustomer = onCall({ region: 'europe-west1' }, async (request) => {
  if (request.auth?.token?.role !== 'superadmin') {
    throw new HttpsError(
      'permission-denied',
      'Solo un superadmin puede eliminar clientes.'
    );
  }

  const { customerId } = request.data;
  if (!customerId) {
    throw new HttpsError('invalid-argument', 'Se requiere el ID del cliente.');
  }

  try {
    const customerRef = db.collection('customers').doc(customerId);
    console.log(`Iniciando eliminación del cliente ${customerId}...`);

    const subcollections = ['interactions', 'offers', 'customerServices', 'metrics'];
    for (const sub of subcollections) {
      const snapshot = await customerRef.collection(sub).get();
      if (!snapshot.empty) {
        console.log(
          `Eliminando ${snapshot.size} documentos de la subcolección ${sub}...`
        );
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }
    }

    await customerRef.delete();
    console.log(`Cliente ${customerId} eliminado con éxito.`);

    return {
      success: true,
      message: 'Cliente y todos sus datos asociados eliminados.',
    };
  } catch (error) {
    console.error(`Error al eliminar cliente ${customerId}:`, error);
    throw new HttpsError('internal', 'No se pudo eliminar el cliente.');
  }
});


// --- Lógica para el Módulo de Marketing ---
exports.createMarketingEvent = onCall(
  { region: 'europe-west1' },
  async (request) => {
    if (!request.auth?.token?.role) {
      throw new HttpsError(
        'permission-denied',
        'No tienes permisos para crear eventos.'
      );
    }

    const { projectId, customerId, assetId, scheduledDate, finalContent } =
      request.data;
    if (
      !customerId ||
      !assetId ||
      !scheduledDate ||
      !finalContent ||
      !projectId
    ) {
      throw new HttpsError(
        'invalid-argument',
        'Faltan datos para programar el evento.'
      );
    }

    try {
      const customerRef = db.collection('customers').doc(customerId);
      const eventRef = db.collection('marketingSchedule').doc();

      // Usar una transacción para asegurar la atomicidad
      await db.runTransaction(async (transaction) => {
        const customerDoc = await transaction.get(customerRef);
        if (!customerDoc.exists) {
          throw new HttpsError('not-found', 'Cliente no encontrado.');
        }

        const customerData = customerDoc.data();
        // Asegurarse de que la estructura serviceUsage y socialPosts_monthly existen.
        const serviceUsage = customerData.serviceUsage?.socialPosts_monthly || {
          used: 0,
          limit: 0,
        };

        if (serviceUsage.used >= serviceUsage.limit) {
          throw new HttpsError(
            'failed-precondition',
            'El cliente ha alcanzado su límite de posts mensuales.'
          );
        }

        const newEvent = {
          projectId: projectId,
          customerId: customerId,
          assetId: assetId,
          scheduledDate: new Date(scheduledDate),
          status: 'programado',
          assignedTo: request.auth.uid,
          finalContent: finalContent,
          createdAt: new Date().toISOString(),
        };

        transaction.set(eventRef, newEvent);
        // Actualización atómica del contador
        transaction.update(customerRef, {
          'serviceUsage.socialPosts_monthly.used': serviceUsage.used + 1,
        });
      });

      console.log(
        `Evento de marketing creado con ID: ${eventRef.id} para el proyecto ${projectId}`
      );
      return { success: true, eventId: eventRef.id };
    } catch (error) {
      console.error('Error al crear el evento de marketing:', error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError(
        'internal',
        'No se pudo guardar el evento en la base de datos.'
      );
    }
  }
);

// --- Lógica de Gestión de Proyectos ---
exports.createProject = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'Debes estar autenticado para realizar esta acción.'
    );
  }

  // Extraemos todos los datos necesarios del formulario
  const {
    projectName,
    projectType,
    clientName,
    customerId,
    status,
    startDate,
    endDate,
    budget,
    projectOwner,
    phases,
  } = request.data;

  // Validación de datos esenciales
  if (
    !projectName ||
    !clientName ||
    !projectType ||
    !startDate ||
    !endDate ||
    !projectOwner ||
    !phases
  ) {
    throw new HttpsError(
      'invalid-argument',
      'Faltan datos esenciales para crear el proyecto.'
    );
  }

  try {
    const newProject = {
      projectName: projectName,
      projectType: projectType,
      clientName: clientName,
      customerId: customerId || null, // Guardamos null si es un cliente externo
      status: status || 'Planificación',
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      budget: budget || 0,
      assignedTeam: [...new Set([projectOwner, request.auth.uid])],
      projectOwner: projectOwner,
      phases: phases || [],
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('projects').add(newProject);
    console.log(`Proyecto '${projectName}' creado con ID: ${docRef.id}`);

    return { success: true, projectId: docRef.id };
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    throw new HttpsError(
      'internal',
      'No se pudo guardar el proyecto en la base de datos.'
    );
  }
});


exports.updateProject = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
  }

  const { projectId, data } = request.data;
  if (!projectId || !data) {
    throw new HttpsError(
      'invalid-argument',
      'Faltan el ID del proyecto y los datos a actualizar.'
    );
  }

  try {
    const projectRef = db.collection('projects').doc(projectId);

    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) {
      throw new HttpsError('not-found', 'El proyecto no fue encontrado.');
    }

    const projectData = projectDoc.data();
    if (
      !projectData.assignedTeam?.includes(request.auth.uid) &&
      request.auth.token.role !== 'superadmin'
    ) {
      throw new HttpsError(
        'permission-denied',
        'No tienes permiso para editar este proyecto.'
      );
    }

    // Asegurarse de que el assignedTeam se actualice correctamente si cambia el owner
    const updateData = { ...data };
    if (
      data.projectOwner &&
      !projectData.assignedTeam?.includes(data.projectOwner)
    ) {
      // Mantener al equipo existente y añadir al nuevo owner si no está
      updateData.assignedTeam = [
        ...new Set([...(projectData.assignedTeam || []), data.projectOwner]),
      ];
    }
    if (data.startDate)
      updateData.startDate = new Date(data.startDate).toISOString();
    if (data.endDate) updateData.endDate = new Date(data.endDate).toISOString();

    await projectRef.update(updateData);

    console.log(`Proyecto ${projectId} actualizado con éxito.`);
    return { success: true, message: 'Proyecto actualizado correctamente.' };
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'No se pudo actualizar el proyecto.');
  }
});

exports.deleteProject = onCall({ region: 'europe-west1' }, async (request) => {
  if (request.auth?.token?.role !== 'superadmin') {
    throw new HttpsError(
      'permission-denied',
      'Solo un superadmin puede eliminar proyectos.'
    );
  }
  const { projectId } = request.data;
  if (!projectId) {
    throw new HttpsError('invalid-argument', 'Falta el ID del proyecto.');
  }

  try {
    const projectRef = db.collection('projects').doc(projectId);
    const tasksRef = projectRef.collection('tasks');

    // Eliminar todas las tareas de la subcolección en un batch
    const tasksSnapshot = await tasksRef.get();
    const batch = db.batch();
    tasksSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Eliminar el proyecto principal
    await projectRef.delete();

    console.log(`Proyecto ${projectId} y sus tareas han sido eliminados.`);
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    if (error.code === 'not-found') {
      throw new HttpsError('not-found', 'El proyecto no fue encontrado.');
    }
    throw new HttpsError('internal', 'No se pudo eliminar el proyecto.');
  }
});

exports.createTask = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth)
    throw new HttpsError('unauthenticated', 'Debes estar autenticado.');

  const {
    projectId,
    phaseId,
    taskName,
    description,
    assignedTo,
    dueDate,
    priority,
  } = request.data;
  if (!projectId || !phaseId || !taskName || !assignedTo || !dueDate) {
    throw new HttpsError(
      'invalid-argument',
      'Faltan datos para crear la tarea.'
    );
  }

  try {
    const newTask = {
      taskName,
      description: description || '',
      assignedTo, // UID del colaborador
      dueDate: new Date(dueDate).toISOString(),
      status: 'Pendiente',
      priority: priority || 'Media',
      projectId: projectId,
      phaseId: phaseId,
      createdAt: new Date().toISOString(),
      createdBy: request.auth.uid,
    };
    const taskRef = await db
      .collection(`projects/${projectId}/tasks`)
      .add(newTask);
    return { success: true, taskId: taskRef.id };
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    throw new HttpsError('internal', 'No se pudo crear la tarea.');
  }
});

exports.updateTask = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
  }

  // Obtenemos todos los datos necesarios desde el frontend
  const { projectId, taskId, data } = request.data;
  if (!projectId || !taskId || !data) {
    throw new HttpsError(
      'invalid-argument',
      'Faltan datos para actualizar la tarea.'
    );
  }

  try {
    const taskRef = db
      .collection('projects')
      .doc(projectId)
      .collection('tasks')
      .doc(taskId);

    // Creamos un objeto con los datos a actualizar para tener más control
    const updateData = {
      taskName: data.taskName,
      description: data.description || '',
      assignedTo: data.assignedTo,
      priority: data.priority,
      status: data.status,
      dueDate: new Date(data.dueDate).toISOString(),
    };

    // Actualizamos el documento en Firestore
    await taskRef.update(updateData);

    console.log(
      `Tarea ${taskId} del proyecto ${projectId} actualizada con éxito.`
    );
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    throw new HttpsError('internal', 'No se pudo actualizar la tarea.');
  }
});

exports.updateTaskStatus = onCall(
  { region: 'europe-west1' },
  async (request) => {
    if (!request.auth)
      throw new HttpsError('unauthenticated', 'Debes estar autenticado.');

    const { projectId, taskId, newStatus } = request.data;
    if (!projectId || !taskId || !newStatus) {
      throw new HttpsError(
        'invalid-argument',
        'Faltan datos para actualizar la tarea.'
      );
    }

    try {
      const taskRef = db
        .collection('projects')
        .doc(projectId)
        .collection('tasks')
        .doc(taskId);
      await taskRef.update({ status: newStatus });
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      throw new HttpsError('internal', 'No se pudo actualizar la tarea.');
    }
  }
);


// --- Lógica para el Módulo de Cupones ---
exports.createCouponBatch = onCall(
  { region: 'europe-west1' },
  async (request) => {
    if (!request.auth)
      throw new HttpsError('unauthenticated', 'Debe estar autenticado.');

    const {
      count,
      value_text,
      bg_image_url,
      title,
      subtitle,
      terms,
      expires_at,
      month_key,
    } = request.data;
    const MAX_PER_MONTH = 600;

    if (!count || count <= 0)
      throw new HttpsError(
        'invalid-argument',
        'La cantidad debe ser mayor que cero.'
      );

    try {
      const couponsRef = db.collection('coupons');
      const counterRef = db.collection('counters').doc(`coupons_${month_key}`);

      const { createdCount } = await db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let currentCount = counterDoc.exists ? counterDoc.data().count : 0;

        if (currentCount + count > MAX_PER_MONTH) {
          throw new HttpsError(
            'failed-precondition',
            `Tope mensual excedido. Creados: ${currentCount}, Límite: ${MAX_PER_MONTH}`
          );
        }

        for (let i = 0; i < count; i++) {
          const serial = currentCount + i + 1;
          const newCode = `DI-${month_key}-${String(serial).padStart(4, '0')}`;

          const newCouponRef = couponsRef.doc();
          transaction.set(newCouponRef, {
            code: newCode,
            month_key: month_key,
            title: title,
            subtitle: subtitle,
            value_text: value_text,
            bg_image_url: bg_image_url || null,
            terms: terms || null,
            expires_at: expires_at || null,
            status: 'active',
            created_by: request.auth.uid,
            created_at: FieldValue.serverTimestamp(),
          });
        }

        transaction.set(
          counterRef,
          { count: currentCount + count },
          { merge: true }
        );
        return { createdCount: count };
      });

      return { success: true, createdCount };
    } catch (error) {
      console.error('Error creando lote de cupones:', error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError('internal', 'No se pudo crear el lote de cupones.');
    }
  }
);

exports.createSingleCoupon = onCall(
  { region: 'europe-west1', secrets: [smtpPassNoreply] },
  async (request) => {
    if (!request.auth)
      throw new HttpsError('unauthenticated', 'Debe estar autenticado.');

    const {
      recipientName,
      senderName,
      value_text,
      bg_image_url,
      title,
      terms,
      expires_at,
    } = request.data;

    if (!recipientName || !senderName || !value_text || !title) {
      throw new HttpsError(
        'invalid-argument',
        'Faltan datos para crear el cupón individual.'
      );
    }

    try {
      const date = new Date();
      const timestamp = date.getTime();
      const newCode = `IND-${timestamp.toString().slice(-6)}-${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}`;

      const newCouponData = {
        code: newCode,
        month_key: `${date.getFullYear()}${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`,
        title: title,
        value_text: value_text,
        bg_image_url: bg_image_url || null,
        terms: terms || null,
        expires_at: expires_at || null,
        status: 'active',
        created_by: request.auth.uid,
        created_at: FieldValue.serverTimestamp(),
        isIndividual: true,
        recipientName: recipientName,
        senderName: senderName,
      };

      const couponRef = await addDoc(db.collection('coupons'), newCouponData);

      const emailBody = `
            <h2>Nuevo Cupón Individual Generado</h2>
            <p>Se ha generado un nuevo cupón personalizado desde el ERP.</p>
            <ul>
                <li><strong>Código:</strong> ${newCouponData.code}</li>
                <li><strong>Para:</strong> ${newCouponData.recipientName}</li>
                <li><strong>De:</strong> ${newCouponData.senderName}</li>
                <li><strong>Valor:</strong> ${newCouponData.value_text}</li>
                <li><strong>Fecha de Creación:</strong> ${new Date().toLocaleString(
                  'es-ES'
                )}</li>
            </ul>
            <p>Este es un registro automático. No es necesario responder a este correo.</p>
        `;

      await sendEmailWithNodemailer(
        {
          to: config.smtp.accounts.noreply.auth.user, // Envía al admin
          subject: `Nuevo Cupón Individual Generado: ${newCouponData.code}`,
          html: emailBody,
        },
        'noreply'
      );

      return { success: true, coupon: { ...newCouponData, id: couponRef.id } };
    } catch (error) {
      console.error('Error creando cupón individual:', error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError('internal', 'No se pudo crear el cupón individual.');
    }
  }
);

exports.redeemCoupon = onCall({ region: 'europe-west1' }, async (request) => {
  const { p_code, p_name, p_contact, p_channel } = request.data;
  if (!p_code || !p_name || !p_contact || !p_channel) {
    throw new HttpsError(
      'invalid-argument',
      'Faltan datos para canjear el cupón.'
    );
  }

  try {
    const couponsRef = db.collection('coupons');
    const q = couponsRef.where('code', '==', p_code).limit(1);

    const redeemedCoupon = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(q);
      if (snapshot.empty) {
        throw new HttpsError('not-found', 'Cupón no encontrado');
      }

      const couponDoc = snapshot.docs[0];
      const couponData = couponDoc.data();

      if (couponData.status === 'redeemed') {
        throw new HttpsError(
          'failed-precondition',
          'Este cupón ya fue canjeado'
        );
      }

      if (
        couponData.expires_at &&
        new Date(couponData.expires_at) < new Date()
      ) {
        transaction.update(couponDoc.ref, { status: 'expired' });
        throw new HttpsError('failed-precondition', 'Cupón vencido');
      }

      const updateData = {
        status: 'redeemed',
        redeemed_at: FieldValue.serverTimestamp(),
        redeemer_name: p_name,
        redeemer_contact: p_contact,
        redeemer_channel: p_channel,
      };

      transaction.update(couponDoc.ref, updateData);

      return { ...couponData, ...updateData, id: couponDoc.id };
    });

    return { success: true, coupon: redeemedCoupon };
  } catch (error) {
    console.error('Error al canjear el cupón:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError(
      'internal',
      'Ocurrió un error al intentar canjear el cupón.'
    );
  }
});

exports.adminRedeemCoupon = onCall(
  { region: 'europe-west1' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'Debes estar autenticado para realizar esta acción.'
      );
    }
    const { code } = request.data;
    if (!code) {
      throw new HttpsError('invalid-argument', 'Falta el código del cupón.');
    }

    try {
      const couponsRef = db.collection('coupons');
      const q = couponsRef.where('code', '==', code).limit(1);

      const redeemedCoupon = await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(q);
        if (snapshot.empty) {
          throw new HttpsError('not-found', 'Cupón no encontrado.');
        }

        const couponDoc = snapshot.docs[0];
        const couponData = couponDoc.data();

        if (couponData.status === 'redeemed') {
          throw new HttpsError(
            'failed-precondition',
            'Este cupón ya fue canjeado.'
          );
        }

        if (
          couponData.expires_at &&
          new Date(couponData.expires_at) < new Date()
        ) {
          transaction.update(couponDoc.ref, { status: 'expired' });
          throw new HttpsError('failed-precondition', 'Cupón vencido.');
        }

        const updateData = {
          status: 'redeemed',
          redeemed_at: FieldValue.serverTimestamp(),
          redeemed_by_admin: request.auth.uid, // Guardamos el ID del admin
        };

        transaction.update(couponDoc.ref, updateData);

        return { ...couponData, ...updateData, id: couponDoc.id };
      });

      return { success: true, coupon: redeemedCoupon };
    } catch (error) {
      console.error('Error al canjear el cupón por admin:', error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError('internal', 'Error al canjear el cupón.');
    }
  }
);


exports.saveCustomerMetrics = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }

    const { customerId, metrics } = request.data;
    if (!customerId || !Array.isArray(metrics)) {
        throw new HttpsError('invalid-argument', 'Faltan datos para guardar las métricas.');
    }

    try {
        const metricsRef = db.collection(`customers/${customerId}/metrics`);
        
        const newMetricRecord = {
            createdAt: FieldValue.serverTimestamp(),
            createdBy: request.auth.uid,
            responses: metrics,
        };

        await addDoc(metricsRef, newMetricRecord);
        
        return { success: true };

    } catch (error) {
        console.error("Error al guardar las métricas del cliente:", error);
        throw new HttpsError('internal', 'No se pudieron guardar las métricas.');
    }
});


exports.submitRecommendation = onCall({ region: 'europe-west1' }, async (request) => {
    const { lang, clientId, ...formData } = request.data;

    // Validación básica
    if (!clientId || !formData.recommenderName || !formData.recommenderEmail) {
        throw new HttpsError('invalid-argument', 'Faltan datos esenciales.');
    }

    try {
        const recommendationData = {
            ...formData,
            clientId,
            createdAt: FieldValue.serverTimestamp(),
            status: 'pending', // pendiente, aceptada, rechazada
            language: lang,
        };

        await addDoc(db.collection('recommendations'), recommendationData);
        
        // Opcional: enviar un correo de notificación
        // await sendEmailWithNodemailer(...)

        return { success: true };

    } catch (error) {
        console.error("Error al guardar la recomendación:", error);
        throw new HttpsError('internal', 'No se pudo procesar la recomendación.');
    }
});

// --- Funciones de Geomarketing (NUEVA VERSIÓN MEJORADA) ---

exports.getBusinessesInArea = onCall({region: 'europe-west1', timeoutSeconds: 60}, async (request) => {
    const axios = require('axios');
    const { zoneName } = request.data;
    if (!zoneName) {
        throw new HttpsError('invalid-argument', 'Se requiere un nombre de zona o códigos postales.');
    }

    // Separa la búsqueda por comas para manejar múltiples zonas/códigos postales
    const zones = zoneName.split(',').map(z => z.trim()).filter(Boolean);
    if (zones.length === 0) {
        throw new HttpsError('invalid-argument', 'La consulta de búsqueda está vacía.');
    }

    try {
        const allBusinesses = new Map();
        let combinedGeoJson = { type: 'FeatureCollection', features: [] };
        let firstCenter = null;

        // Búsqueda de todos los clientes en el CRM
        const allCustomersSnapshot = await db.collection('customers').get();
        const customersByWebsite = new Map();
        const customersByName = new Map();
        allCustomersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.website) {
                try {
                    const normalizedUrl = new URL(data.website).hostname.replace(/^www\./, '');
                    customersByWebsite.set(normalizedUrl, data.status || 'prospecto');
                } catch (e) {}
            }
            if (data.name) {
                customersByName.set(data.name.toLowerCase().trim(), data.status || 'prospecto');
            }
        });


        for (const zone of zones) {
            const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(zone)}&format=json&polygon_geojson=1&limit=1`;
            const nominatimResponse = await axios.get(nominatimUrl, { headers: { 'User-Agent': 'DiciloERP/1.0' } });

            if (!nominatimResponse.data || nominatimResponse.data.length === 0) {
                console.warn(`No se encontraron datos para la zona: ${zone}`);
                continue; // Salta a la siguiente zona si no se encuentra
            }

            const zoneData = nominatimResponse.data[0];
            if (!firstCenter) {
                firstCenter = [parseFloat(zoneData.lat), parseFloat(zoneData.lon)];
            }
            if (zoneData.geojson) {
                combinedGeoJson.features.push({
                    type: "Feature",
                    properties: { name: zone },
                    geometry: zoneData.geojson
                });
            }
            
            const areaId = parseInt(zoneData.osm_id) + 3600000000;
            const overpassQuery = `[out:json][timeout:50]; area(${areaId})->.searchArea; (node["shop"](area.searchArea); way["shop"](area.searchArea); relation["shop"](area.searchArea); node["amenity"](area.searchArea); way["amenity"](area.searchArea); relation["amenity"](area.searchArea);); out body; >; out skel qt;`;
            const overpassUrl = 'https://overpass-api.de/api/interpreter';
            const overpassResponse = await axios.post(overpassUrl, overpassQuery, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            
            const elements = overpassResponse.data.elements;
            const nodes = new Map(elements.filter(e => e.type === 'node').map(node => [node.id, node]));

            elements.map(el => {
                if (el.type === 'way' && el.nodes?.length > 0) {
                    const firstNode = nodes.get(el.nodes[0]);
                    if (firstNode) return { ...el, lat: firstNode.lat, lon: firstNode.lon };
                }
                return el;
            }).filter(el => el.lat && el.lon && el.tags?.name).forEach(el => {
                if (!allBusinesses.has(el.id)) {
                    const tags = el.tags || {};
                    let status = 'neutro';
                    if (tags.website) {
                         try {
                            const normalizedUrl = new URL(tags.website).hostname.replace(/^www\./, '');
                            if (customersByWebsite.has(normalizedUrl)) status = customersByWebsite.get(normalizedUrl);
                         } catch (e) {}
                    }
                    if (status === 'neutro' && tags.name) {
                        const nameKey = tags.name.toLowerCase().trim();
                        if (customersByName.has(nameKey)) status = customersByName.get(nameKey);
                    }

                    allBusinesses.set(el.id, {
                        id: el.id,
                        name: tags.name,
                        lat: el.lat,
                        lon: el.lon,
                        crmStatus: status,
                        tags: {
                            fullAddress: [tags['addr:street'], tags['addr:housenumber'], ',', tags['addr:postcode'], tags['addr:city']].filter(Boolean).join(' ').replace(' ,', ','),
                            website: tags.website || tags['contact:website'] || null,
                            phone: tags.phone || tags['contact:phone'] || null,
                            email: tags.email || tags['contact:email'] || null,
                        }
                    });
                }
            });
        }

        if (allBusinesses.size === 0) {
            return { success: false, message: 'No se encontraron negocios para las zonas especificadas.' };
        }

        return { 
            success: true, 
            geojson: combinedGeoJson, 
            center: firstCenter,
            businesses: Array.from(allBusinesses.values())
        };

    } catch (error) {
        console.error('Error en getBusinessesInArea:', error);
        throw new HttpsError('internal', 'No se pudo obtener la información de negocios para la zona.');
    }
});
    

    
exports.updateLandingPageContent = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'El usuario debe estar autenticado.');
    }

    const { customerId, content } = request.data;
    if (!customerId || !content) {
        throw new HttpsError('invalid-argument', 'Faltan datos para actualizar el contenido.');
    }

    try {
        const contentRef = db.collection('customers').doc(customerId).collection('landingPageContent').doc('main');
        await contentRef.set(content, { merge: true });
        
        return { success: true };

    } catch (error) {
        console.error("Error guardando contenido de landing page:", error);
        throw new HttpsError('internal', 'No se pudo guardar el contenido.');
    }
});
    
exports.submitPublicContactForm = onCall({ cors: true }, async (request) => {
    const { email, companyName } = request.data;

    if (!email || !companyName) {
        throw new HttpsError('invalid-argument', 'Email y nombre de empresa son requeridos.');
    }
    
    // Aquí podrías añadir el lead a una colección 'leads' en Firestore
    // o enviarlo a un webhook de un CRM externo.
    console.log(`Nuevo lead recibido de la landing page: ${companyName} (${email})`);

    // Podríamos también enviar un email de notificación
    // await sendEmailWithNodemailer(...)

    return { success: true, message: 'Lead recibido correctamente.' };
});

    
exports.updateLandingPageContent = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'El usuario debe estar autenticado.');
    }

    const { customerId, content } = request.data;
    if (!customerId || !content) {
        throw new HttpsError('invalid-argument', 'Faltan datos para actualizar el contenido.');
    }

    try {
        const contentRef = db.collection('customers').doc(customerId).collection('landingPageContent').doc('main');
        await contentRef.set(content, { merge: true });
        
        return { success: true };

    } catch (error) {
        console.error("Error guardando contenido de landing page:", error);
        throw new HttpsError('internal', 'No se pudo guardar el contenido.');
    }
});