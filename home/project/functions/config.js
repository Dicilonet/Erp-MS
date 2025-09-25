/**
 * @file Archivo de Configuración para Cloud Functions
 *
 * ¡IMPORTANTE!
 * En un entorno de producción real, gestiona estos valores como secretos o variables de entorno.
 * Para Firebase Studio, este es un método práctico para gestionar la configuración.
 *
 * INSTRUCCIONES:
 * Rellena los valores de abajo con tus propias credenciales.
 */

const config = {
    /**
     * Email del primer superadministrador.
     * La primera persona que se registre con este email obtendrá automáticamente los permisos de superadmin.
     */
    superadmin_email: "superadmin@dicilo.net",

    /**
     * Configuración para el envío de correos con Nodemailer y un servidor SMTP.
     */
    smtp: {
        // Configuración por defecto del servidor SMTP
        default: {
            host: "mail.agenturserver.de",
            port: 465,
            secure: true, // true para el puerto 465, false para otros
            auth: {
                // El usuario se define por cuenta, la contraseña viene de Secret Manager
                user: "central-erp@dicilo.net"
            }
        },
        // Cuentas de correo específicas para diferentes propósitos
        accounts: {
            noreply: { from: '"ERP Dicilo" <no-reply@dicilo.net>', auth: { user: "no-reply@dicilo.net" } },
            accounting: { from: '"Buchhaltung - ERP Dicilo" <buchhaltung@dicilo.net>', auth: { user: "buchhaltung@dicilo.net" } },
            media: { from: '"Medien - ERP Dicilo" <medien@dicilo.net>', auth: { user: "medien@dicilo.net" } },
        }
    },

    /**
     * Configuración para la API de DiciloSearch
     */
    dicilosearch: {
        // Pega aquí tu token de API para el servicio ficticio DiciloSearch
        api_token: process.env.DICILOSEARCH_API_TOKEN || "un-token-de-prueba"
    },

    /**
     * Otras claves de API
     */
    website: {
        // Clave de API para la comunicación con el sitio web, si es necesario
        api_key: "LA-CLAVE-SECRETA-QUE-TE-DIERON"
    }
};

module.exports = config;

