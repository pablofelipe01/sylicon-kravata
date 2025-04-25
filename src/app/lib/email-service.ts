import nodemailer from 'nodemailer';

type EmailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

/**
 * Configura el transporte de correo electrónico
 * Cambia la configuración según tu proveedor de correo
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

/**
 * Envía un correo electrónico
 */
export async function sendEmail({ to, subject, text, html }: EmailParams): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: `"Sylicon Support" <${process.env.EMAIL_FROM || 'syliconservicioalcliente@gmail.com'}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Envía una notificación al usuario cuando crea un ticket
 */
export async function sendTicketConfirmationEmail(
  email: string,
  ticketNumber: string,
  tipoProblema: string
): Promise<boolean> {
  const subject = `[Sylicon] Confirmación de ticket #${ticketNumber}`;
  
  const text = `
    Hola,

    Hemos recibido tu solicitud con el número de ticket: ${ticketNumber}

    Problema reportado: ${tipoProblema}

    Nuestro equipo de soporte revisará tu caso y te contactará a la brevedad posible. 
    Guarda este número de ticket para futuras referencias.

    Gracias por tu paciencia.

    Equipo de Soporte Sylicon
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(90deg, #3A8D8C 0%, #8CCA6E 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Ticket de Soporte</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee;">
        <p>Hola,</p>
        <p>Hemos recibido tu solicitud con el número de ticket:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; font-size: 18px; font-weight: bold;">
          ${ticketNumber}
        </div>
        <p><strong>Problema reportado:</strong> ${tipoProblema}</p>
        <p>Nuestro equipo de soporte revisará tu caso y te contactará a la brevedad posible. Guarda este número de ticket para futuras referencias.</p>
        <p>Gracias por tu paciencia.</p>
        <p>Equipo de Soporte Sylicon</p>
      </div>
      <div style="text-align: center; padding: 10px; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} Sylicon. Todos los derechos reservados.
      </div>
    </div>
  `;
  
  return sendEmail({ to: email, subject, text, html });
}

/**
 * Envía una notificación al equipo de soporte sobre un nuevo ticket
 */
export async function sendSupportNotificationEmail(
  ticketNumber: string,
  tipoProblema: string,
  externalId: string | null,
  documento: string | null,
  correo: string | null,
  comentarios: string
): Promise<boolean> {
  const subject = `[NUEVO TICKET] #${ticketNumber} - ${tipoProblema}`;
  
  const text = `
    Nuevo ticket de soporte:
    
    Número: ${ticketNumber}
    Tipo de problema: ${tipoProblema}
    ${externalId ? `External ID: ${externalId}` : ''}
    ${documento ? `Documento: ${documento}` : ''}
    ${correo ? `Correo: ${correo}` : ''}
    
    Comentarios:
    ${comentarios}
    
    Accede al panel de administración para gestionar este ticket.
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #3A8D8C; padding: 15px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Nuevo Ticket de Soporte</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee;">
        <p style="font-size: 16px; margin-bottom: 20px;"><strong>Número de ticket:</strong> ${ticketNumber}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 8px 12px; font-weight: bold;">Tipo de problema:</td>
            <td style="padding: 8px 12px;">${tipoProblema}</td>
          </tr>
          ${externalId ? `
          <tr>
            <td style="padding: 8px 12px; font-weight: bold;">External ID:</td>
            <td style="padding: 8px 12px;">${externalId}</td>
          </tr>
          ` : ''}
          ${documento ? `
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 8px 12px; font-weight: bold;">Documento:</td>
            <td style="padding: 8px 12px;">${documento}</td>
          </tr>
          ` : ''}
          ${correo ? `
          <tr>
            <td style="padding: 8px 12px; font-weight: bold;">Correo:</td>
            <td style="padding: 8px 12px;">${correo}</td>
          </tr>
          ` : ''}
        </table>
        
        <div style="margin-top: 20px;">
          <h3 style="font-size: 16px; margin-bottom: 10px;">Comentarios:</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3A8D8C;">
            ${comentarios.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="margin-top: 25px; text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/support" 
             style="background-color: #3A8D8C; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
            Gestionar Ticket
          </a>
        </div>
      </div>
    </div>
  `;
  
  // Enviar al correo de soporte configurado en variables de entorno
  const supportEmail = process.env.SUPPORT_EMAIL || '';
  return sendEmail({ to: supportEmail, subject, text, html });
}