

/**
 * @file Firebase Cloud Functions para el ERP DICILO
 * Versión final, limpia y con todos los módulos.
 */

// --- Dependencias ---
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const { setGlobalOptions } = require("firebase-functions/v2");
const { getAuth } = require('firebase-admin/auth');
const { defineSecret } = require("firebase-functions/params");
const { createProfessionalEmail } = require('./emailTemplate');


// Define los secretos que tu código necesitará
const smtpPassDefault = defineSecret('SMTP_PASS_DEFAULT');
const smtpPassAccounting = defineSecret('SMTP_PASS_ACCOUNTING');
const smtpPassMedia = defineSecret('SMTP_PASS_MEDIA');
const smtpPassNoreply = defineSecret('SMTP_PASS_NOREPLY');


// Carga la configuración local y las plantillas
const config = require('./config');
const planTemplates = require('./planTemplates');
const { serviceCatalogData } = require('./service-catalog-data');


// --- Inicialización y Configuración GLOBAL ---
initializeApp();
const db = getFirestore();
const auth = getAuth();
setGlobalOptions({ region: "europe-west1" });


/**
 * Función que se dispara cuando se crea un nuevo documento de cliente.
 * Lee el 'planId' y genera automáticamente la lista de servicios/entregables.
 */
exports.onCustomerCreate = onDocumentCreated({document: "customers/{customerId}", region: 'europe-west1'}, async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
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
    const servicesCollectionRef = db.collection(`customers/${customerId}/customerServices`);

    servicesToCreate.forEach((serviceTemplate) => {
        const newServiceRef = servicesCollectionRef.doc(serviceTemplate.serviceId);
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        
        let nextDueDate = null;
        
        const frequencyString = serviceTemplate.frequency.toString();
        if ((frequencyString.includes('mes') || frequencyString.includes('año')) && serviceTemplate.status === 'Pendiente') {
            nextDueDate = nextMonth.toISOString();
        }

        batch.set(newServiceRef, { ...serviceTemplate, nextDueDate: nextDueDate });
    });
    
    // --- Añadir la estructura de serviceUsage por defecto ---
    const customerRef = db.collection('customers').doc(customerId);
    batch.update(customerRef, {
        serviceUsage: {
            socialPosts_monthly: { used: 0, limit: 60 },
            kiCourses_yearly: { used: 0, limit: 4 }
        }
    });

    try {
        await batch.commit();
        console.log(`Se crearon ${servicesToCreate.length} servicios para el cliente ${customerId}`);
    } catch (error) {
        console.error(`Error al crear servicios para el cliente ${customerId}:`, error);
    }
});


/**
 * Función auxiliar para enviar emails con Nodemailer y SMTP personalizado.
 * @param {object} emailPayload - Datos del correo a enviar (to, subject, html, etc.).
 * @param {string} [accountType='default'] - El tipo de cuenta a usar ('accounting', 'media', 'noreply').
 * @returns {Promise<object>} - Respuesta de Nodemailer.
 */
const sendEmailWithNodemailer = async (emailPayload, accountType = 'default') => {
    // Lazy load nodemailer to avoid deployment timeouts
    const nodemailer = require('nodemailer');

    const smtpConfig = config.smtp.default;
    const accountConfig = config.smtp.accounts[accountType] || config.smtp.accounts.noreply;

    let password;
    switch (accountType) {
        case 'accounting': password = smtpPassAccounting.value(); break;
        case 'media': password = smtpPassMedia.value(); break;
        case 'noreply': password = smtpPassNoreply.value(); break;
        default: password = smtpPassDefault.value();
    }
    
    if (!accountConfig) {
        console.error(`Configuración de cuenta de email no encontrada para: ${accountType}`);
        throw new HttpsError("internal", `La cuenta de correo '${accountType}' no está configurada.`);
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
        console.log(`Enviando email desde ${mailOptions.from} a: ${emailPayload.to} con asunto: "${emailPayload.subject}"`);
        const info = await transporter.sendMail(mailOptions);
        console.log("Email enviado con éxito a través de Nodemailer.", JSON.stringify(info));
        return info;
    } catch (error) {
        console.error("Excepción al enviar email con Nodemailer:", error);
        throw new HttpsError("internal", "Ocurrió una excepción inesperada en el servicio de correo.");
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
exports.sendEmail = onCall({region: 'europe-west1', secrets: [smtpPassDefault, smtpPassAccounting, smtpPassMedia, smtpPassNoreply]}, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "El usuario debe estar autenticado.");
    }
    
    const { to, cc, bcc, subject, body, attachments, fromAccount } = request.data;
    if (!to || !subject || !body || !isValidEmail(to)) {
        throw new HttpsError("invalid-argument", "Datos de correo inválidos o incompletos.");
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
    
    return { success: true, message: "Correo enviado correctamente." };
});

/**
 * Crea una oferta como borrador o la envía directamente.
 */
exports.createOffer = onCall({region: 'europe-west1', secrets: [smtpPassAccounting]}, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "El usuario debe estar autenticado.");
    }

    const { customerId, items, notes, issueDate, expiryDate, documentTitle, introductoryText, sendEmail } = request.data;
    
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
        throw new HttpsError("invalid-argument", "Datos incompletos para crear la oferta.");
    }
    
    try {
        const customerRef = db.collection('customers').doc(customerId);
        const customerDoc = await customerRef.get();
        if (!customerDoc.exists) {
            throw new HttpsError("not-found", "Cliente no encontrado.");
        }
        const customerData = customerDoc.data();
        if (sendEmail && (!customerData.contactEmail || !isValidEmail(customerData.contactEmail))) {
            throw new HttpsError("failed-precondition", "El cliente no tiene un email de contacto válido para el envío.");
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
                throw new HttpsError("invalid-argument", `Item ${index + 1} con valores inválidos.`);
            }

            const itemSubtotal = quantity * price * (1 - discount / 100);
            const itemTax = itemSubtotal * (taxRate / 100);
            subtotal += itemSubtotal;
            totalTax += itemTax;
            
            return { ...item, total: Number(itemSubtotal.toFixed(2)), taxRate: taxRate };
        });

        if(subtotal > 0) {
            totalTaxRate = (totalTax / subtotal) || 0;
        }

        const total = subtotal + totalTax;
        
        const offerRef = db.collection(`customers/${customerId}/offers`).doc();

        const offerData = {
            offerNumber, customerId, customerName: customerData.name, 
            status: sendEmail ? 'Enviada' : 'Borrador',
            documentTitle: documentTitle || 'Oferta',
            introductoryText: introductoryText || '',
            items: processedItems, notes: notes || '', 
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
                type: 'Oferta', summary: `Se envió la oferta ${offerNumber} por un total de ${total.toFixed(2)}€`,
                date: new Date().toISOString(), createdBy: request.auth?.uid || 'system',
            });
            
            const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-ES');
            const formatCurrency = (amount) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
            const trackingPixelUrl = `https://europe-west1-erp-dicilo.cloudfunctions.net/trackEmailOpen?offerId=${offerRef.id}&customerId=${customerId}`;
            
            const emailBody = `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h1 style="color: #333;">${documentTitle || 'Oferta'} ${offerNumber}</h1>
                    <p><strong>Fecha:</strong> ${formatDate(issueDate)}</p>
                    <p><strong>Válida hasta:</strong> ${formatDate(expiryDate)}</p>
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
                            ${processedItems.map(item => `
                                <tr>
                                    <td>${item.description}</td>
                                    <td style="text-align: right;">${item.quantity} ${item.unit}</td>
                                    <td style="text-align: right;">${formatCurrency(item.price)}</td>
                                    <td style="text-align: right;">${item.discount}%</td>
                                    <td style="text-align: right;"><strong>${formatCurrency(item.total)}</strong></td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                    <div style="margin-top: 20px; padding-top: 20px; text-align: right;">
                        <p>Subtotal: ${formatCurrency(subtotal)}</p>
                        <p>+ Impuestos: ${formatCurrency(totalTax)}</p>
                        <h3 style="margin-top: 10px;"><strong>Total: ${formatCurrency(total)}</strong></h3>
                    </div>
                    ${notes ? `<div style="margin-top:20px; padding:10px; border-top: 1px solid #eee;"><p><strong>Notas:</strong><br>${notes.replace(/\n/g, '<br>')}</p></div>` : ''}
                    <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">Gracias por su interés.</p>
                    <img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />
                </div>`;
            
            await sendEmailWithNodemailer({
                to: customerData.contactEmail,
                subject: `Su oferta de DICILO - Nº ${offerNumber}`,
                html: emailBody,
            }, 'accounting'); // Usa la cuenta de contabilidad
        }

        return { success: true, offerNumber, offerId: offerRef.id };

    } catch (error) {
        console.error("Error al crear la oferta:", error);
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError("internal", "No se pudo crear la oferta.");
    }
});


/**
 * Actualiza una oferta existente, principalmente para guardar borradores o enviarlos.
 */
exports.updateOffer = onCall({region: 'europe-west1', secrets: [smtpPassAccounting]}, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "El usuario debe estar autenticado.");
    }

    const { offerId, customerId, items, notes, issueDate, expiryDate, documentTitle, introductoryText, sendEmail } = request.data;
    
    if (!offerId || !customerId || !items || !Array.isArray(items) || items.length === 0) {
        throw new HttpsError("invalid-argument", "Datos incompletos para actualizar la oferta.");
    }

    const offerRef = db.collection(`customers/${customerId}/offers`).doc(offerId);

    try {
        const offerDoc = await offerRef.get();
        if (!offerDoc.exists) {
            throw new HttpsError("not-found", "La oferta no fue encontrada.");
        }
        if (offerDoc.data().status !== 'Borrador') {
            throw new HttpsError("failed-precondition", "Solo se pueden editar ofertas en estado de borrador.");
        }

        const customerRef = db.collection('customers').doc(customerId);
        const customerDoc = await customerRef.get();
        const customerData = customerDoc.data();
        if (sendEmail && (!customerData.contactEmail || !isValidEmail(customerData.contactEmail))) {
            throw new HttpsError("failed-precondition", "El cliente no tiene un email de contacto válido para el envío.");
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
            totalTaxRate = (totalTax / subtotal) || 0;
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
                type: 'Oferta', summary: `Se envió la oferta ${offerDoc.data().offerNumber} por un total de ${total.toFixed(2)}€`,
                date: new Date().toISOString(), createdBy: request.auth?.uid || 'system',
            });
            
            const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-ES');
            const formatCurrency = (amount) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
            const trackingPixelUrl = `https://europe-west1-erp-dicilo.cloudfunctions.net/trackEmailOpen?offerId=${offerId}&customerId=${customerId}`;
            
            const emailBody = `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h1 style="color: #333;">${documentTitle || 'Oferta'} ${offerDoc.data().offerNumber}</h1>
                    <p><strong>Fecha:</strong> ${formatDate(issueDate)}</p>
                    <p><strong>Válida hasta:</strong> ${formatDate(expiryDate)}</p>
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
                            ${processedItems.map(item => `
                                <tr>
                                    <td>${item.description}</td>
                                    <td style="text-align: right;">${item.quantity} ${item.unit}</td>
                                    <td style="text-align: right;">${formatCurrency(item.price)}</td>
                                    <td style="text-align: right;">${item.discount}%</td>
                                    <td style="text-align: right;"><strong>${formatCurrency(item.total)}</strong></td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                    <div style="margin-top: 20px; padding-top: 20px; text-align: right;">
                        <p>Subtotal: ${formatCurrency(subtotal)}</p>
                        <p>+ Impuestos: ${formatCurrency(totalTax)}</p>
                        <h3 style="margin-top: 10px;"><strong>Total: ${formatCurrency(total)}</strong></h3>
                    </div>
                    ${notes ? `<div style="margin-top:20px; padding:10px; border-top: 1px solid #eee;"><p><strong>Notas:</strong><br>${notes.replace(/\n/g, '<br>')}</p></div>` : ''}
                    <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">Gracias por su interés.</p>
                    <img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />
                </div>`;
            
            await sendEmailWithNodemailer({
                to: customerData.contactEmail,
                subject: `Su oferta de DICILO - Nº ${offerDoc.data().offerNumber}`,
                html: emailBody,
            }, 'accounting');
        }

        return { success: true, offerNumber: offerDoc.data().offerNumber };

    } catch (error) {
        console.error("Error al actualizar la oferta:", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError("internal", "No se pudo actualizar la oferta.");
    }
});


/**
 * Actualiza el estado de una oferta (ej: Aceptada, Rechazada).
 */
exports.updateOfferStatus = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "El usuario debe estar autenticado.");
    }

    const { customerId, offerId, newStatus } = request.data;
    if (!customerId || !offerId || !newStatus) {
        throw new HttpsError("invalid-argument", "Datos incompletos para actualizar el estado.");
    }

    const validStatuses = ['Aceptada', 'Rechazada', 'Vencida'];
    if (!validStatuses.includes(newStatus)) {
        throw new HttpsError("invalid-argument", "El nuevo estado no es válido.");
    }

    const offerRef = db.collection(`customers/${customerId}/offers`).doc(offerId);

    try {
        await offerRef.update({ status: newStatus, updatedAt: new Date().toISOString() });
        return { success: true, message: `Estado de la oferta actualizado a ${newStatus}.` };
    } catch (error) {
        console.error("Error al actualizar estado de la oferta:", error);
        throw new HttpsError("internal", "No se pudo actualizar el estado de la oferta.");
    }
});


/**
 * Endpoint HTTP para el seguimiento de la apertura de correos electrónicos.
 */
exports.trackEmailOpen = onRequest({ region: 'europe-west1', cors: true }, async (req, res) => {
    const { offerId, customerId } = req.query;

    if (!offerId || !customerId) {
        return res.status(400).send('Faltan parámetros de seguimiento.');
    }

    try {
        const offerRef = db.collection('customers').doc(customerId).collection('offers').doc(offerId);
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
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.send(pixel);
});



// --- Lógica de Gestión de Equipos ---
exports.createInternalUser = onCall({region: 'europe-west1'}, async (request) => {
    // 1. Verificación de permisos
    if (request.auth?.token?.role !== 'superadmin') {
        throw new HttpsError('permission-denied', 'Solo un superadmin puede crear usuarios internos.');
    }

    // 2. Validación de datos de entrada
    const { email, password, fullName, country, whatsapp, role } = request.data;
    if (!email || !password || !fullName || !country || !whatsapp || !role) {
        throw new HttpsError('invalid-argument', 'Faltan datos para crear el usuario.');
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
            'auth/email-already-exists': { code: 'already-exists', message: 'El email proporcionado ya está en uso.' },
            'auth/invalid-password': { code: 'invalid-argument', message: 'La contraseña no cumple los requisitos de Firebase.' },
            'auth/invalid-email': { code: 'invalid-argument', message: 'El formato del email no es válido.' }
        };

        const firebaseError = errorMapping[error.code];
        if (firebaseError) {
            throw new HttpsError(firebaseError.code, firebaseError.message);
        }

        throw new HttpsError('internal', `Ocurrió un error inesperado: ${error.message}`);
    }
});


// Reemplaza tu función updateUserPermissions existente con esta versión
exports.updateUserPermissions = onCall({region: 'europe-west1'}, async (request) => {
    // 1. Verificación de permisos del Superadmin
    if (request.auth?.token?.role !== 'superadmin') {
        throw new HttpsError('permission-denied', 'Solo un superadmin puede actualizar permisos.');
    }

    // 2. Validación de datos de entrada
    const { userId, modules } = request.data;
    if (!userId || !Array.isArray(modules)) {
        throw new HttpsError('invalid-argument', 'Se requiere el ID del usuario y una lista de módulos.');
    }

    try {
        const userRef = db.collection('users').doc(userId);

        // 3. Actualizar el documento en Firestore usando el método UPDATE
        // --- ESTA ES LA CORRECCIÓN ---
        await userRef.update({
            accessibleModules: modules
        });

        console.log(`Permisos actualizados para el usuario ${userId}: ${modules.join(', ')}`);

        // 4. Devolver una respuesta exitosa
        return { success: true, message: `Permisos para ${userId} actualizados correctamente.` };

    } catch (error) {
        console.error('Error al actualizar los permisos del usuario:', error);
        if (error.code === 'not-found') {
            throw new HttpsError('not-found', `El usuario con ID ${userId} no fue encontrado.`);
        }
        throw new HttpsError('internal', 'Ocurrió un error inesperado al actualizar los permisos.');
    }
});


exports.getDashboardData = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }

    // Solo un superadmin puede ver estos datos
    if (request.auth.token.role !== 'superadmin') {
        return { success: true, collaborators: [], teamOffice: [] };
    }

    try {
        // Hacemos ambas peticiones a la base de datos al mismo tiempo
        const collaboratorsQuery = db.collection('users').where('role', '==', 'colaborador').get();
        const teamOfficeQuery = db.collection('users').where('role', '==', 'teamoffice').get();

        const [collaboratorsSnapshot, teamOfficeSnapshot] = await Promise.all([collaboratorsQuery, teamOfficeQuery]);

        const collaborators = collaboratorsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        const teamOffice = teamOfficeSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

        return { success: true, collaborators, teamOffice };

    } catch (error) {
        console.error("Error al obtener los datos del dashboard:", error);
        throw new HttpsError('internal', 'No se pudieron cargar los datos del equipo.');
    }
});

/**
 * Permite a un usuario autenticado actualizar su propio perfil.
 */
exports.updateUserProfile = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado para actualizar tu perfil.');
    }

    const { uid } = request.auth;
    const { fullName, language } = request.data;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
        throw new HttpsError('invalid-argument', 'El nombre completo es inválido.');
    }
    if (language && !['en', 'es', 'de'].includes(language)) {
         throw new HttpsError('invalid-argument', 'El idioma seleccionado no es válido.');
    }

    try {
        const userRef = db.collection('users').doc(uid);
        const authUserPromise = auth.updateUser(uid, { displayName: fullName });

        const firestoreUpdateData = {
            profile: {
                fullName: fullName,
                preferredLanguage: language,
            }
        };

        const firestoreUserPromise = userRef.set(firestoreUpdateData, { merge: true });
        
        await Promise.all([authUserPromise, firestoreUserPromise]);

        console.log(`Perfil actualizado para el usuario ${uid}`);
        return { success: true, message: 'Perfil actualizado correctamente.' };

    } catch (error) {
        console.error(`Error al actualizar el perfil para el usuario ${uid}:`, error);
        throw new HttpsError('internal', 'Ocurrió un error inesperado al actualizar el perfil.');
    }
});
    

// --- Funciones Administrativas ---
exports.setSuperAdminRole = onCall({region: 'europe-west1'}, async (request) => {
    const { email } = request.data;
    const superAdminEmail = config.superadmin_email; // Usamos el email desde el archivo de configuración

    // Para la primera vez, el usuario que se está registrando no tendrá un rol.
    // Permitimos que CUALQUIERA que se registre con el email de superadmin se auto-promocione.
    // En un entorno de producción, esta lógica debería ser más segura.
    if (request.auth?.token?.role !== 'superadmin' && email !== superAdminEmail) {
        console.log(`Intento no autorizado para asignar rol por ${request.auth?.token?.email || 'un usuario no autenticado'}`);
        throw new HttpsError('permission-denied', 'Solo un superadmin puede asignar roles, o debes usar el email de superadmin en el registro.');
    }

    try {
        const user = await auth.getUserByEmail(email);
        await auth.setCustomUserClaims(user.uid, { role: 'superadmin' });
        console.log(`Éxito: Rol 'superadmin' asignado a ${email}.`);
        return { success: true, message: `¡Éxito! ${email} ha sido nombrado superadmin.` };
    } catch (error) {
        console.error(`Error al asignar rol de superadmin a ${email}:`, error);
        throw new HttpsError('internal', `No se pudo asignar el rol: ${error.message}`);
    }
});

// --- NUEVAS FUNCIONES PARA GESTIÓN DE CLIENTES DEL ERP ---

// Función para obtener los clientes que ya están en el ERP
exports.getErpCustomers = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }
    const snapshot = await db.collection('customers').get();
    const customersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, customers: customersList };
});

// Función para SINCRONIZAR: trae solo los nuevos desde 'businesses'
exports.syncNewCustomersFromWebsite = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth?.token?.role) {
        throw new HttpsError('permission-denied', 'No tienes permisos para sincronizar.');
    }

    try {
        const sourceSnapshot = await db.collection('businesses').get();
        const erpSnapshot = await db.collection('customers').get();
        
        const erpCustomers = new Map(erpSnapshot.docs.map(doc => [doc.id, doc.data()]));
        const erpOriginalIds = new Set(Array.from(erpCustomers.values()).map(data => data.originalId).filter(Boolean));
        const erpEmails = new Set(Array.from(erpCustomers.values()).map(data => data.contactEmail?.toLowerCase()).filter(Boolean));
        const erpNames = new Set(Array.from(erpCustomers.values()).map(data => data.name?.toLowerCase()).filter(Boolean));

        const newDocsToCopy = sourceSnapshot.docs.filter(doc => {
            const businessData = doc.data();
            return !erpOriginalIds.has(doc.id) &&
                   !(businessData.email && erpEmails.has(businessData.email.toLowerCase())) &&
                   !(businessData.name && erpNames.has(businessData.name.toLowerCase()));
        });
        
        if (newDocsToCopy.length === 0) {
            return { success: true, newCount: 0, message: "No se encontraron clientes nuevos para añadir." };
        }

        const batch = db.batch();
        newDocsToCopy.forEach(doc => {
            const businessData = doc.data();
            const newCustomerRef = db.collection('customers').doc();
            
            const newCustomerData = {
                name: businessData.name || 'Nombre no disponible',
                contactEmail: businessData.email || `no-email-${newCustomerRef.id}@example.com`,
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
                assignedTo: null,
                createdAtErp: new Date().toISOString(),
                serviceUsage: {
                    socialPosts_monthly: { used: 0, limit: 60 },
                    kiCourses_yearly: { used: 0, limit: 4 }
                }
            };
            batch.set(newCustomerRef, newCustomerData);
        });
        
        await batch.commit();
        return { success: true, newCount: newDocsToCopy.length };

    } catch (error) {
        console.error("--- ERROR DURANTE LA SINCRONIZACIÓN ---:", error);
        throw new HttpsError('internal', `Ocurrió un error inesperado durante la sincronización: ${error.message}`);
    }
});


// Función para ASIGNAR un cliente a un colaborador
exports.assignCustomerToCollaborator = onCall({region: 'europe-west1'}, async (request) => {
    if (request.auth?.token?.role !== 'superadmin') {
        throw new HttpsError('permission-denied', 'Solo un superadmin puede asignar clientes.');
    }

    const { customerId, collaboratorId } = request.data;
    if (!customerId || !collaboratorId) {
        throw new HttpsError('invalid-argument', 'Faltan datos para la asignación.');
    }

    await db.collection('customers').doc(customerId).update({
        assignedTo: collaboratorId
    });

    return { success: true };
});

// Función para que los COLABORADORES vean SUS clientes
exports.getAssignedCustomers = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }
    const uid = request.auth.uid;
    const snapshot = await db.collection('customers').where('assignedTo', '==', uid).get();
    const customersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, customers: customersList };
});


// --- Lógica para el Módulo de Marketing ---
exports.createMarketingEvent = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth?.token?.role) {
        throw new HttpsError('permission-denied', 'No tienes permisos para crear eventos.');
    }

    const { projectId, customerId, assetId, scheduledDate, finalContent } = request.data;
    if (!customerId || !assetId || !scheduledDate || !finalContent || !projectId) {
        throw new HttpsError('invalid-argument', 'Faltan datos para programar el evento.');
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
            const serviceUsage = customerData.serviceUsage?.socialPosts_monthly || { used: 0, limit: 0 };
            
            if (serviceUsage.used >= serviceUsage.limit) {
                throw new HttpsError('failed-precondition', 'El cliente ha alcanzado su límite de posts mensuales.');
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
                'serviceUsage.socialPosts_monthly.used': serviceUsage.used + 1
            });
        });
        
        console.log(`Evento de marketing creado con ID: ${eventRef.id} para el proyecto ${projectId}`);
        return { success: true, eventId: eventRef.id };

    } catch (error) {
        console.error("Error al crear el evento de marketing:", error);
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError('internal', 'No se pudo guardar el evento en la base de datos.');
    }
});


// --- Lógica de Gestión de Proyectos ---

/**
 * Crea un nuevo proyecto en la base de datos.
 */
exports.createProject = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado para realizar esta acción.');
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
    if (!projectName || !clientName || !projectType || !startDate || !endDate || !projectOwner || !phases) {
        throw new HttpsError('invalid-argument', 'Faltan datos esenciales para crear el proyecto.');
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
        console.error("Error al crear el proyecto:", error);
        throw new HttpsError('internal', 'No se pudo guardar el proyecto en la base de datos.');
    }
});

/**
 * Actualiza un proyecto existente en la base de datos.
 */
exports.updateProject = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }

    const { projectId, data } = request.data;
    if (!projectId || !data) {
        throw new HttpsError('invalid-argument', 'Faltan el ID del proyecto y los datos a actualizar.');
    }

    try {
        const projectRef = db.collection('projects').doc(projectId);
        
        const projectDoc = await projectRef.get();
        if (!projectDoc.exists) {
            throw new HttpsError('not-found', 'El proyecto no fue encontrado.');
        }

        const projectData = projectDoc.data();
        if (!projectData.assignedTeam?.includes(request.auth.uid) && request.auth.token.role !== 'superadmin') {
            throw new HttpsError('permission-denied', 'No tienes permiso para editar este proyecto.');
        }
        
        // Asegurarse de que el assignedTeam se actualice correctamente si cambia el owner
        const updateData = { ...data };
        if (data.projectOwner && !projectData.assignedTeam?.includes(data.projectOwner)) {
            // Mantener al equipo existente y añadir al nuevo owner si no está
            updateData.assignedTeam = [...new Set([...(projectData.assignedTeam || []), data.projectOwner])];
        }
        if (data.startDate) updateData.startDate = new Date(data.startDate).toISOString();
        if (data.endDate) updateData.endDate = new Date(data.endDate).toISOString();


        await projectRef.update(updateData);
        
        console.log(`Proyecto ${projectId} actualizado con éxito.`);
        return { success: true, message: 'Proyecto actualizado correctamente.' };

    } catch (error) {
        console.error("Error al actualizar el proyecto:", error);
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError('internal', 'No se pudo actualizar el proyecto.');
    }
});

/**
 * Elimina un proyecto y todas sus tareas asociadas.
 */
exports.deleteProject = onCall({region: 'europe-west1'}, async (request) => {
    if (request.auth?.token?.role !== 'superadmin') {
        throw new HttpsError('permission-denied', 'Solo un superadmin puede eliminar proyectos.');
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
        tasksSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Eliminar el proyecto principal
        await projectRef.delete();

        console.log(`Proyecto ${projectId} y sus tareas han sido eliminados.`);
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        if (error.code === 'not-found') {
            throw new HttpsError('not-found', 'El proyecto no fue encontrado.');
        }
        throw new HttpsError('internal', 'No se pudo eliminar el proyecto.');
    }
});


/**
 * Crea una nueva tarea dentro de un proyecto.
 */
exports.createTask = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Debes estar autenticado.');

    const { projectId, phaseId, taskName, description, assignedTo, dueDate, priority } = request.data;
    if (!projectId || !phaseId || !taskName || !assignedTo || !dueDate) {
        throw new HttpsError('invalid-argument', 'Faltan datos para crear la tarea.');
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
        const taskRef = await db.collection(`projects/${projectId}/tasks`).add(newTask);
        return { success: true, taskId: taskRef.id };
    } catch (error) {
        console.error("Error al crear la tarea:", error);
        throw new HttpsError('internal', 'No se pudo crear la tarea.');
    }
});


/**
 * Actualiza los detalles de una tarea existente (nombre, descripción, etc.).
 */
exports.updateTask = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }

    // Obtenemos todos los datos necesarios desde el frontend
    const { projectId, taskId, data } = request.data;
    if (!projectId || !taskId || !data) {
        throw new HttpsError('invalid-argument', 'Faltan datos para actualizar la tarea.');
    }

    try {
        const taskRef = db.collection('projects').doc(projectId).collection('tasks').doc(taskId);
        
        // Creamos un objeto con los datos a actualizar para tener más control
        const updateData = {
            taskName: data.taskName,
            description: data.description || '',
            assignedTo: data.assignedTo,
            priority: data.priority,
            status: data.status,
            dueDate: new Date(data.dueDate).toISOString()
        };

        // Actualizamos el documento en Firestore
        await taskRef.update(updateData);
        
        console.log(`Tarea ${taskId} del proyecto ${projectId} actualizada con éxito.`);
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar la tarea:", error);
        throw new HttpsError('internal', 'No se pudo actualizar la tarea.');
    }
});



/**
 * Actualiza el estado de una tarea (al arrastrarla en el Kanban).
 */
exports.updateTaskStatus = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Debes estar autenticado.');

    const { projectId, taskId, newStatus } = request.data;
    if (!projectId || !taskId || !newStatus) {
        throw new HttpsError('invalid-argument', 'Faltan datos para actualizar la tarea.');
    }

    try {
        const taskRef = db.collection('projects').doc(projectId).collection('tasks').doc(taskId);
        await taskRef.update({ status: newStatus });
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar el estado de la tarea:", error);
        throw new HttpsError('internal', 'No se pudo actualizar la tarea.');
    }
});
    
/**
 * Endpoint HTTP para recibir y crear un nuevo cliente desde DiciloSearch.
 * Protegido por una clave de API secreta.
 */
exports.receiveNewCustomer = onRequest({ region: 'europe-west1', cors: true }, async (req, res) => {
    // 1. Verificación de seguridad con la clave secreta
    const expectedApiKey = config.dicilosearch.api_token; 
    const providedApiKey = req.get('x-api-key');

    if (!expectedApiKey || providedApiKey !== expectedApiKey) {
        console.error("Clave de API para DiciloSearch inválida o faltante.");
        res.status(403).send({ error: 'Acceso denegado' });
        return;
    }

    // 2. Solo aceptamos peticiones de tipo POST
    if (req.method !== 'POST') {
        res.status(405).send({ error: 'Método no permitido' });
        return;
    }

    // 3. Validación de los datos del cliente que llegan en el cuerpo
    const customerDataFromSearch = req.body;
    if (!customerDataFromSearch || !customerDataFromSearch.name || !customerDataFromSearch.contactEmail) {
        res.status(400).send({ error: 'Petición incorrecta: Faltan datos esenciales del cliente.' });
        return;
    }

    // 4. Creación del cliente en la colección 'customers' de Firestore
    try {
        const newCustomerData = {
            name: customerDataFromSearch.name,
            contactEmail: customerDataFromSearch.contactEmail,
            category: customerDataFromSearch.category || 'Sin categoría',
            description: customerDataFromSearch.description || 'Cliente registrado desde DiciloSearch.',
            planId: customerDataFromSearch.planId || 'plan_privatkunde',
            paymentCycle: 'anual',
            country: 'DE',
            location: customerDataFromSearch.location || '',
            fullAddress: customerDataFromSearch.address || '',
            coordinates: { 
                latitude: customerDataFromSearch.coords?.latitude || 0, 
                longitude: customerDataFromSearch.coords?.longitude || 0,
            },
            phone: customerDataFromSearch.phone || '',
            website: customerDataFromSearch.website || '',
            logoUrl: customerDataFromSearch.imageUrl || '',
            rating: customerDataFromSearch.rating || 0,
            status: 'activo',
            registrationDate: new Date().toISOString(),
            originalId: customerDataFromSearch.id,
            source: 'dicilosearch',
            erpStatus: 'nuevo',
            assignedTo: null,
            createdAtErp: new Date().toISOString(),
        };

        const docRef = await db.collection('customers').add(newCustomerData);
        console.log(`Cliente recibido desde DiciloSearch y creado con ID: ${docRef.id}`);
        
        res.status(201).send({ success: true, customerId: docRef.id });

    } catch (error) {
        console.error("Error al guardar el cliente recibido de DiciloSearch:", error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});


// --- Lógica para el Módulo de Artículos (Productos y Servicios) ---

/**
 * Crea un nuevo artículo (producto o servicio) en la base de datos.
 */
exports.createArticle = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }

    const { articleNumber, name, description, type, unit, priceNet, taxRate } = request.data;
    if (!articleNumber || !name || !type || !unit || priceNet == null || taxRate == null) {
        throw new HttpsError('invalid-argument', 'Faltan datos esenciales para crear el artículo.');
    }

    try {
        const articleData = {
            ...request.data,
            priceGross: priceNet * (1 + taxRate / 100),
            createdAt: new Date().toISOString(),
            createdBy: request.auth?.uid || 'system',
        };

        const docRef = await db.collection('articles').add(articleData);
        
        console.log(`Artículo '${name}' creado con ID: ${docRef.id}`);
        return { success: true, articleId: docRef.id, article: { ...articleData, articleId: docRef.id } };

    } catch (error) {
        console.error("Error al crear el artículo:", error);
        throw new HttpsError('internal', 'No se pudo guardar el artículo en la base de datos.');
    }
});


/**
 * Actualiza un artículo existente.
 */
exports.updateArticle = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }
    const { articleId, data } = request.data;
    if (!articleId || !data) {
        throw new HttpsError('invalid-argument', 'Falta el ID del artículo y los datos a actualizar.');
    }

    try {
        const articleRef = db.collection('articles').doc(articleId);
        
        // Comprobar si el artículo existe
        const doc = await articleRef.get();
        if (!doc.exists) {
            throw new HttpsError('not-found', 'El artículo no fue encontrado.');
        }

        const updateData = {
            ...data,
            priceGross: data.priceNet * (1 + data.taxRate / 100),
            updatedAt: new Date().toISOString(),
            updatedBy: request.auth.uid,
        };

        await articleRef.update(updateData);
        console.log(`Artículo ${articleId} actualizado.`);
        return { success: true, article: { ...updateData, articleId: articleId } };
    } catch (error) {
        console.error("Error al actualizar el artículo:", error);
        if (error instanceof HttpsError) {
            throw error;
        }
        throw new HttpsError('internal', 'No se pudo actualizar el artículo.');
    }
});


/**
 * Obtiene todos los artículos de la base de datos.
 */
exports.getArticles = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }

    try {
        const snapshot = await db.collection('articles').orderBy('createdAt', 'desc').get();
        const articlesList = snapshot.docs.map(doc => ({ ...doc.data(), articleId: doc.id }));
        return { success: true, articles: articlesList };
    } catch (error) {
        console.error("Error al obtener los artículos:", error);
        throw new HttpsError('internal', 'No se pudieron cargar los artículos.');
    }
});
    

// --- Lógica del Chat Interno ---

exports.getOrCreateConversation = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }

    const { otherUserUid } = request.data;
    if (!otherUserUid) {
        throw new HttpsError('invalid-argument', 'Se necesita el UID del otro usuario.');
    }
    const currentUserUid = request.auth.uid;
    
    // Crear un ID de conversación consistente para evitar duplicados
    const conversationId = [currentUserUid, otherUserUid].sort().join('_');
    const conversationRef = db.collection('conversations').doc(conversationId);
    const conversationSnap = await conversationRef.get();
    
    if (conversationSnap.exists) {
        return { conversationId };
    } else {
        const currentUserDoc = await db.collection('users').doc(currentUserUid).get();
        const otherUserDoc = await db.collection('users').doc(otherUserUid).get();

        if (!currentUserDoc.exists || !otherUserDoc.exists) {
            throw new HttpsError('not-found', 'No se encontró uno de los usuarios.');
        }
        
        const participants = [
            { uid: currentUserUid, name: currentUserDoc.data().profile.fullName },
            { uid: otherUserUid, name: otherUserDoc.data().profile.fullName }
        ];

        await conversationRef.set({
            participants,
            participantUids: [currentUserUid, otherUserUid], // Para queries
            status: 'abierta', // Estado inicial por defecto
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        return { conversationId };
    }
});

exports.sendMessage = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }
    const { conversationId, text } = request.data;
    if (!conversationId || !text) {
        throw new HttpsError('invalid-argument', 'Faltan datos para enviar el mensaje.');
    }

    const senderId = request.auth.uid;
    const senderDoc = await db.collection('users').doc(senderId).get();
    if(!senderDoc.exists) {
         throw new HttpsError('not-found', 'No se encontró el remitente.');
    }
    
    const senderName = senderDoc.data().profile.fullName;

    const message = {
        text,
        senderId,
        senderName,
        timestamp: FieldValue.serverTimestamp(),
    };

    const conversationRef = db.collection('conversations').doc(conversationId);
    await conversationRef.collection('messages').add(message);
    await conversationRef.update({
        lastMessage: { text, timestamp: FieldValue.serverTimestamp() },
        updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
});

exports.updateConversationStatus = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    }

    const { conversationId, status } = request.data;
    if (!conversationId || !status) {
        throw new HttpsError('invalid-argument', 'Faltan datos para actualizar el estado.');
    }
    
    const validStatuses = ['abierta', 'en proceso', 'cerrada'];
    if (!validStatuses.includes(status)) {
        throw new HttpsError('invalid-argument', 'El estado proporcionado no es válido.');
    }

    try {
        const conversationRef = db.collection('conversations').doc(conversationId);
        await conversationRef.update({
            status: status,
            updatedAt: FieldValue.serverTimestamp(),
        });
        return { success: true, message: 'Estado de la conversación actualizado.' };
    } catch (error) {
        console.error("Error actualizando estado de la conversación:", error);
        throw new HttpsError('internal', 'No se pudo actualizar el estado de la conversación.');
    }
});

exports.cleanupDuplicateCustomers = onCall({ region: 'europe-west1' }, async (request) => {
    if (request.auth?.token?.role !== 'superadmin') {
        throw new HttpsError('permission-denied', 'Solo un superadmin puede ejecutar esta acción.');
    }

    try {
        console.log("Iniciando limpieza de clientes duplicados...");
        const customersSnapshot = await db.collection('customers').get();
        const customers = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const uniqueCustomers = new Map();
        const duplicatesToDelete = [];

        for (const customer of customers) {
            // Clave única basada en nombre y email (ignorando mayúsculas/minúsculas y espacios)
            const nameKey = (customer.name || '').toLowerCase().trim();
            const emailKey = (customer.contactEmail || '').toLowerCase().trim();
            const key = `${nameKey}_${emailKey}`;

            if (uniqueCustomers.has(key)) {
                // Si ya existe, este es un duplicado. Marcarlo para eliminación.
                duplicatesToDelete.push(customer.id);
            } else {
                // Si no existe, este es el primer registro (el que se conservará).
                uniqueCustomers.set(key, customer.id);
            }
        }

        console.log(`Se encontraron ${duplicatesToDelete.length} clientes duplicados para eliminar.`);

        if (duplicatesToDelete.length > 0) {
            const batch = db.batch();
            duplicatesToDelete.forEach(docId => {
                batch.delete(db.collection('customers').doc(docId));
            });
            await batch.commit();
            console.log(`Se eliminaron ${duplicatesToDelete.length} documentos duplicados.`);
        }

        return {
            success: true,
            deletedCount: duplicatesToDelete.length,
            message: `Limpieza completada. Se eliminaron ${duplicatesToDelete.length} clientes duplicados.`
        };
    } catch (error) {
        console.error("Error durante la limpieza de duplicados:", error);
        throw new HttpsError('internal', `Ocurrió un error inesperado durante la limpieza: ${error.message}`);
    }
});

exports.deleteCustomer = onCall({region: 'europe-west1'}, async (request) => {
    if (request.auth?.token?.role !== 'superadmin') {
        throw new HttpsError('permission-denied', 'Solo un superadmin puede eliminar clientes.');
    }

    const { customerId } = request.data;
    if (!customerId) {
        throw new HttpsError('invalid-argument', 'Se requiere el ID del cliente.');
    }

    try {
        const customerRef = db.collection('customers').doc(customerId);
        console.log(`Iniciando eliminación del cliente ${customerId}...`);

        const subcollections = ['interactions', 'offers', 'customerServices'];
        for (const sub of subcollections) {
            const snapshot = await customerRef.collection(sub).get();
            if (!snapshot.empty) {
                console.log(`Eliminando ${snapshot.size} documentos de la subcolección ${sub}...`);
                const batch = db.batch();
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }
        }

        await customerRef.delete();
        console.log(`Cliente ${customerId} eliminado con éxito.`);

        return { success: true, message: 'Cliente y todos sus datos asociados eliminados.' };
    } catch (error) {
        console.error(`Error al eliminar cliente ${customerId}:`, error);
        throw new HttpsError('internal', 'No se pudo eliminar el cliente.');
    }
});


/**
 * Función Invocable para sembrar/restaurar el catálogo de servicios.
 * Limpia la colección 'programs' y la vuelve a llenar con los datos de `service-catalog-data.js`.
 */
exports.seedServiceCatalog = onCall({region: 'europe-west1'}, async (request) => {
    // Solo los superadmins pueden ejecutar esta función.
    if (request.auth?.token?.role !== 'superadmin') {
        throw new HttpsError('permission-denied', 'Solo un superadmin puede ejecutar esta acción.');
    }

    try {
        console.log("Iniciando la siembra del catálogo de servicios...");
        const programsRef = db.collection("programs");
        const snapshot = await programsRef.get();

        const batch = db.batch();

        // 1. Borrar todos los documentos existentes para evitar duplicados.
        if (!snapshot.empty) {
            console.log(`Eliminando ${snapshot.size} documentos existentes del catálogo...`);
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
        }

        // 2. Añadir todos los programas desde el archivo de datos.
        console.log(`Añadiendo ${serviceCatalogData.length} nuevos programas al catálogo...`);
        serviceCatalogData.forEach(program => {
            const docRef = programsRef.doc(); // Crea una referencia con un ID automático.
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(program.url).hostname}&sz=32`;
            batch.set(docRef, { ...program, logo: faviconUrl });
        });

        // 3. Ejecutar el batch.
        await batch.commit();
        
        const successMessage = `Catálogo restaurado con éxito. Se eliminaron ${snapshot.size} documentos y se añadieron ${serviceCatalogData.length}.`;
        console.log(successMessage);
        
        return { success: true, message: successMessage };

    } catch (error) {
        console.error("Error fatal durante la siembra del catálogo:", error);
        throw new HttpsError('internal', `Ocurrió un error inesperado durante la siembra: ${error.message}`);
    }
});


// --- Funciones de Geomarketing (NUEVA VERSIÓN MEJORADA) ---

exports.getBusinessesInArea = onCall({region: 'europe-west1', timeoutSeconds: 60}, async (request) => {
    const axios = require('axios');
    const { zoneName } = request.data;
    if (!zoneName) {
        throw new HttpsError('invalid-argument', 'Se requiere un nombre de zona.');
    }

    try {
        // 1. Obtener datos geoespaciales y el areaId de Nominatim
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(zoneName)}&format=json&polygon_geojson=1&limit=1`;
        const nominatimResponse = await axios.get(nominatimUrl, { headers: { 'User-Agent': 'DiciloERP/1.0' } });

        if (!nominatimResponse.data || nominatimResponse.data.length === 0) {
            return { success: false, message: 'No se encontraron datos para la zona.' };
        }
        
        const zoneData = nominatimResponse.data[0];
        const areaId = parseInt(zoneData.osm_id) + 3600000000;

        // 2. Usar el areaId para una búsqueda precisa en Overpass
        const overpassQuery = `
            [out:json][timeout:50];
            area(${areaId})->.searchArea;
            (
                node["shop"](area.searchArea);
                way["shop"](area.searchArea);
                relation["shop"](area.searchArea);
                node["amenity"](area.searchArea);
                way["amenity"](area.searchArea);
                relation["amenity"](area.searchArea);
            );
            out body;
            >;
            out skel qt;
        `;

        const overpassUrl = 'https://overpass-api.de/api/interpreter';
        const overpassResponse = await axios.post(overpassUrl, overpassQuery, { 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
        });

        const elements = overpassResponse.data.elements;
        
        // 3. Procesar y enriquecer los datos de Overpass
        const nodes = new Map(elements.filter(e => e.type === 'node').map(node => [node.id, node]));
        let businesses = elements
            .map(el => {
                if (el.type === 'way' && el.nodes?.length > 0) {
                    const firstNode = nodes.get(el.nodes[0]);
                    if (firstNode) return { ...el, lat: firstNode.lat, lon: firstNode.lon };
                }
                return el;
            })
            .filter(el => el.lat && el.lon && el.tags?.name)
            .map(el => {
                const tags = el.tags || {};
                return {
                    id: el.id,
                    name: tags.name,
                    lat: el.lat,
                    lon: el.lon,
                    crmStatus: 'neutro', // Estatus por defecto
                    tags: {
                        fullAddress: [tags['addr:street'], tags['addr:housenumber'], ',', tags['addr:postcode'], tags['addr:city']].filter(Boolean).join(' ').replace(' ,', ','),
                        website: tags.website || tags['contact:website'] || null,
                        phone: tags.phone || tags['contact:phone'] || null,
                        email: tags.email || tags['contact:email'] || null,
                    }
                };
            });
            
        // 4. Enriquecer con datos del CRM (Firestore)
        const allCustomersSnapshot = await db.collection('customers').get();
        const customersByWebsite = new Map();
        const customersByName = new Map();

        allCustomersSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.website) {
                // Normaliza la URL para mejorar la coincidencia
                try {
                    const normalizedUrl = new URL(data.website).hostname.replace(/^www\./, '');
                    customersByWebsite.set(normalizedUrl, data.status || 'prospecto');
                } catch (e) {
                    // Ignora URLs inválidas en la base de datos
                }
            }
            if (data.name) {
                customersByName.set(data.name.toLowerCase().trim(), data.status || 'prospecto');
            }
        });

        businesses = businesses.map(biz => {
            let status = 'neutro';
            if (biz.tags.website) {
                 try {
                    const normalizedUrl = new URL(biz.tags.website).hostname.replace(/^www\./, '');
                    if (customersByWebsite.has(normalizedUrl)) {
                       status = customersByWebsite.get(normalizedUrl);
                    }
                 } catch (e) {
                     // Ignora si la URL del negocio es inválida
                 }
            }
            if (status === 'neutro' && biz.name) {
                const nameKey = biz.name.toLowerCase().trim();
                if (customersByName.has(nameKey)) {
                    status = customersByName.get(nameKey);
                }
            }
            return { ...biz, crmStatus: status };
        });


        return { 
            success: true, 
            geojson: zoneData.geojson, 
            center: [parseFloat(zoneData.lat), parseFloat(zoneData.lon)],
            businesses
        };

    } catch (error) {
        console.error('Error en getBusinessesInArea:', error);
        throw new HttpsError('internal', 'No se pudo obtener la información de negocios para la zona.');
    }
});


exports.saveProspectAsCustomer = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "El usuario debe estar autenticado.");
    }
    const { businessData } = request.data;
    if (!businessData || !businessData.name) {
        throw new HttpsError("invalid-argument", "Datos del negocio incompletos.");
    }

    try {
        const newCustomerData = {
            name: businessData.name,
            contactEmail: businessData.tags.email || `no-email-${businessData.id}@example.com`,
            category: 'Prospecto Geomarketing',
            description: `Prospecto importado desde el módulo de Geomarketing. ID de OpenStreetMap: ${businessData.id}`,
            planId: 'plan_privatkunde',
            paymentCycle: 'anual',
            country: 'DE', // Asumimos DE por defecto, se puede mejorar
            location: businessData.tags.fullAddress || 'Ubicación no disponible',
            fullAddress: businessData.tags.fullAddress || 'Dirección no disponible',
            coordinates: { 
                latitude: businessData.lat, 
                longitude: businessData.lon,
            },
            phone: businessData.tags.phone || 'N/A',
            website: businessData.tags.website || '',
            logoUrl: '',
            rating: 0,
            status: 'prospecto', // Se guarda como prospecto
            registrationDate: new Date().toISOString(),
            originalId: `osm-${businessData.id}`,
            source: 'geomarketing',
            erpStatus: 'prospecto',
            assignedTo: null,
            createdAtErp: new Date().toISOString(),
        };

        const docRef = await db.collection('customers').add(newCustomerData);
        
        return { success: true, customerId: docRef.id };

    } catch (error) {
        console.error("Error al guardar el prospecto:", error);
        throw new HttpsError('internal', 'No se pudo guardar el prospecto como cliente.');
    }
});


// --- Lógica para el Módulo de Cupones ---
exports.createCouponBatch = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Debe estar autenticado.');

    const { count, value_text, bg_image_url, title, subtitle, terms, expires_at, month_key } = request.data;
    const MAX_PER_MONTH = 600;

    if (!count || count <= 0) throw new HttpsError('invalid-argument', 'La cantidad debe ser mayor que cero.');

    try {
        const couponsRef = db.collection('coupons');
        const counterRef = db.collection('counters').doc(`coupons_${month_key}`);

        const { createdCount } = await db.runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            let currentCount = counterDoc.exists ? counterDoc.data().count : 0;
            
            if (currentCount + count > MAX_PER_MONTH) {
                throw new HttpsError('failed-precondition', `Tope mensual excedido. Creados: ${currentCount}, Límite: ${MAX_PER_MONTH}`);
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
            
            transaction.set(counterRef, { count: currentCount + count }, { merge: true });
            return { createdCount: count };
        });

        return { success: true, createdCount };

    } catch (error) {
        console.error("Error creando lote de cupones:", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'No se pudo crear el lote de cupones.');
    }
});

exports.createSingleCoupon = onCall({region: 'europe-west1', secrets: [smtpPassNoreply]}, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Debe estar autenticado.');
    
    const { recipientName, senderName, value_text, bg_image_url, title, terms, expires_at } = request.data;

    if (!recipientName || !senderName || !value_text || !title) {
        throw new HttpsError('invalid-argument', 'Faltan datos para crear el cupón individual.');
    }

    try {
        const date = new Date();
        const timestamp = date.getTime();
        const newCode = `IND-${timestamp.toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        const newCouponData = {
            code: newCode,
            month_key: `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`,
            title: title,
            subtitle: `Para: ${recipientName}`, // Subtítulo construido en el backend
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
        
        const couponRef = await db.collection('coupons').add(newCouponData);

        const emailBody = `
            <h2>Nuevo Cupón Individual Generado</h2>
            <p>Se ha generado un nuevo cupón personalizado desde el ERP.</p>
            <ul>
                <li><strong>Código:</strong> ${newCouponData.code}</li>
                <li><strong>Para:</strong> ${newCouponData.recipientName}</li>
                <li><strong>De:</strong> ${newCouponData.senderName}</li>
                <li><strong>Valor:</strong> ${newCouponData.value_text}</li>
                <li><strong>Fecha de Creación:</strong> ${new Date().toLocaleString('es-ES')}</li>
            </ul>
            <p>Este es un registro automático. No es necesario responder a este correo.</p>
        `;

        await sendEmailWithNodemailer({
            to: config.smtp.accounts.noreply.auth.user, // Envía al admin
            subject: `Nuevo Cupón Individual Generado: ${newCouponData.code}`,
            html: emailBody,
        }, 'noreply');

        return { success: true, coupon: { ...newCouponData, id: couponRef.id } };

    } catch (error) {
        console.error("Error creando cupón individual:", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'No se pudo crear el cupón individual.');
    }
});


exports.redeemCoupon = onCall({region: 'europe-west1'}, async (request) => {
    const { p_code, p_name, p_contact, p_channel } = request.data;
    if (!p_code || !p_name || !p_contact || !p_channel) {
        throw new HttpsError('invalid-argument', 'Faltan datos para canjear el cupón.');
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
               throw new HttpsError('failed-precondition', 'Este cupón ya fue canjeado');
           }
           
           if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
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

    } catch(error) {
       console.error("Error al canjear el cupón:", error);
       if (error instanceof HttpsError) throw error;
       throw new HttpsError('internal', 'Ocurrió un error al intentar canjear el cupón.');
    }
});

exports.adminRedeemCoupon = onCall({ region: 'europe-west1' }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes estar autenticado para realizar esta acción.');
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
                throw new HttpsError('failed-precondition', 'Este cupón ya fue canjeado.');
            }
            
            if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
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

    } catch(error) {
       console.error("Error al canjear el cupón por admin:", error);
       if (error instanceof HttpsError) throw error;
       throw new HttpsError('internal', 'Error al canjear el cupón.');
    }
});

exports.deleteAllCoupons = onCall({ region: 'europe-west1' }, async (request) => {
    if (request.auth?.token?.role !== 'superadmin') {
        throw new HttpsError('permission-denied', 'Solo un superadmin puede ejecutar esta acción.');
    }

    try {
        const couponsRef = db.collection('coupons');
        const snapshot = await couponsRef.get();

        if (snapshot.empty) {
            return { success: true, deletedCount: 0, message: 'No hay cupones para borrar.' };
        }

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Opcional pero recomendado: Resetear el contador del mes actual.
        const monthKey = new Date().toISOString().slice(0, 7).replace('-', '');
        const counterRef = db.collection('counters').doc(`coupons_${monthKey}`);
        batch.delete(counterRef); // O podrías usar .set({ count: 0 })
        
        await batch.commit();

        return { success: true, deletedCount: snapshot.size, message: `Se eliminaron ${snapshot.size} cupones y se reseteó el contador.` };
    } catch (error) {
        console.error("Error al borrar todos los cupones:", error);
        throw new HttpsError('internal', 'Ocurrió un error al borrar los cupones.');
    }
});
    
exports.publishSocialPost = onCall({region: 'europe-west1'}, async (request) => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Debes estar autenticado.');
    const { imageBase64, caption, networks } = request.data;
    
    if (!imageBase64 || !caption || !networks) {
        throw new HttpsError('invalid-argument', 'Faltan datos para la publicación.');
    }

    // Aquí iría la lógica para llamar al webhook de n8n
    // const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    // ...
    console.log("Simulando publicación en:", networks.join(', '));
    console.log("Caption:", caption);
    
    return { success: true, message: "Publicación enviada al gestor de redes." };
});


    
