/**
 * Plantilla de correo electrónico profesional y responsiva.
 * @param {string} contentHTML - El contenido HTML generado desde el editor del frontend.
 * @returns {string} - El HTML completo y estilizado del correo.
 */
const createProfessionalEmail = (contentHTML) => {
    const companyName = "ERP Dicilo";
    const companyAddress = "Tu Dirección, Ciudad, País";
    const currentYear = new Date().getFullYear();

    // Usamos estilos en línea para máxima compatibilidad con clientes de correo.
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email de ${companyName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding: 20px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #dddddd;">
                        
                        <tr>
                            <td align="center" style="background-color: #0056b3; padding: 20px 0;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${companyName}</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 30px 25px; color: #333333; font-size: 16px; line-height: 1.6;">
                                ${contentHTML}
                                </td>
                        </tr>

                        <tr>
                            <td align="center" style="background-color: #f0f0f0; padding: 20px 25px; border-top: 1px solid #dddddd;">
                                <p style="margin: 0; color: #888888; font-size: 12px;">
                                    © ${currentYear} ${companyName}. Todos los derechos reservados.<br>
                                    ${companyAddress}
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

module.exports = { createProfessionalEmail };
