using Business;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Cors;

namespace Inventarios.Class
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ApplicationAuthProvider : OAuthAuthorizationServerProvider
    {
        public ApiBusiness Bussines = new ApiBusiness(Properties.Settings.Default.Conexion);

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            try
            {
                //Encriptar el password
                string PasswordAES = AES.EncryptAES(context.Password);
                bool Valid = Bussines.GetLoginToken(context.UserName, PasswordAES);

                //bool Valid = true;
                if (Valid)
                {
                    var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                    identity.AddClaim(new Claim("Username", context.UserName));
                    identity.AddClaim(new Claim("Password", PasswordAES));
                    context.Validated(identity);
                }
                else
                {
                    context.SetError("invalid_grant", "Usuario o Contraseña incorrectos.");
                    return;
                }

            }
            catch (Exception)
            {
                context.SetError("invalid_grant", "Usuario o Contraseña incorrectos.");
                return;
            }
        }

    }
}