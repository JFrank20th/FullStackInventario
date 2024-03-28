//using Microsoft.Analytics.Interfaces;
//using Microsoft.Analytics.Types.Sql;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace Inventarios.Class
{
    public class EmailService
    {
        private readonly string correoRemitente;
        private readonly string contraseñaRemitente; // Si es necesario autenticarse en el servidor SMTP

        public EmailService(string correoRemitente, string contraseñaRemitente)
        {
            this.correoRemitente = correoRemitente;
            this.contraseñaRemitente = contraseñaRemitente;
        }

        public bool EnviarCorreo(string destinatario, string asunto, string cuerpo, byte[] adjunto, string nombreAdjunto, string cc = null, string cco = null)
        {
            try
            {
                using (MailMessage correo = new MailMessage())
                {
                    correo.From = new MailAddress(correoRemitente);

                    AgregarDestinatarios(correo.To, destinatario);
                    AgregarDestinatarios(correo.CC, cc);
                    AgregarDestinatarios(correo.Bcc, cco);

                    correo.Subject = asunto;
                    correo.Body = cuerpo;
                    correo.IsBodyHtml = true;

                    // Adjuntar el archivo PDF al correo
                    correo.Attachments.Add(new Attachment(new MemoryStream(adjunto), nombreAdjunto, "application/pdf"));

                    using (SmtpClient smtp = new SmtpClient())
                    {
                        ConfigurarSmtp(smtp);

                        // Envío del correo electrónico
                        smtp.Send(correo);
                    }
                    return true;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private void AgregarDestinatarios(MailAddressCollection collection, string direcciones)
        {
            if (!string.IsNullOrEmpty(direcciones))
            {
                foreach (var direccion in direcciones.Split(';'))
                {
                    collection.Add(direccion.Trim());
                }
            }
        }

        private void ConfigurarSmtp(SmtpClient smtp)
        {
            smtp.Host = "smtp.gmail.com";
            smtp.Port = 587;
            smtp.EnableSsl = true;

            // Configuración de credenciales (si es necesario)
            smtp.Credentials = new NetworkCredential(correoRemitente, contraseñaRemitente);
        }
    }
}