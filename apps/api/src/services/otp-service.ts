import { v4 as uuidv4 } from "uuid";
import { db, userOtpsTable } from "@repo/db";
import { sendHTMLEmail } from "./send-mail.js";
import crypto from "crypto";
import { env } from "../lib/env.js";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createOTPEmailHTML = (otp: string) => {
  return `
    <!doctype html>
<html lang="und" dir="auto" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>Security Verification - jashan.dev</title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      #outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }
    </style>
    <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
    <style type="text/css">
      .mj-outlook-group-fix { width:100% !important; }
    </style>
    <![endif]-->
    
      <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet" type="text/css">
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700);
        </style>
      <!--<![endif]-->

    
    
    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
.mj-column-per-85 { width:85% !important; max-width: 85%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }
.moz-text-html .mj-column-per-85 { width:85% !important; max-width: 85%; }
    </style>
    
  
    
    
    
  </head>
  <body style="word-spacing:normal;background-color:#FFFFFF;">
    
    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Your one-time verification code for jashan.dev</div>
  
    
      <div aria-label="Security Verification - jashan.dev" aria-roledescription="email" style="background-color:#FFFFFF;" role="article" lang="und" dir="auto">
        
      
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div style="margin:0px auto;max-width:600px;">
        
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-top:40px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
            
      <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
        
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
        <tbody>
          
              <tr>
                <td align="center" class="brand-text" style="letter-spacing: -0.5px; font-size: 0px; padding: 10px 25px; word-break: break-word;">
                  
      <div style="font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:20px;font-weight:700;line-height:1.5;text-align:center;color:#000000;">jashan.dev</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div style="margin:0px auto;max-width:600px;">
        
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:510px;" ><![endif]-->
            
      <div class="mj-column-per-85 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
        
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
        <tbody>
          
              <tr>
                <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:16px;word-break:break-word;">
                  
      <div style="font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:24px;font-weight:700;line-height:1.5;text-align:center;color:#000000;">Email Verification Required</div>
    
                </td>
              </tr>
            
              <tr>
                <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:20px;word-break:break-word;">
                  
      <div style="font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.5;text-align:center;color:#333333;">The following one-time password (OTP) has been generated to verify your email address. This code is valid for 10 minutes and can only be used once.</div>
    
                </td>
              </tr>
            
              <tr>
                <td align="center" style="font-size:0px;padding:10px 0;word-break:break-word;">
                  
      <div style="font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:36px;font-weight:800;letter-spacing:6px;line-height:1.5;text-align:center;color:#000000;">${otp}</div>
    
                </td>
              </tr>
            
              <tr>
                <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;word-break:break-word;">
                  
      <div style="font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:14px;line-height:1.5;text-align:center;color:#555555;"><strong>Security Warning:</strong> For your protection, do not share this code with anyone. jashan.dev representatives will never ask for this code via email, phone, or chat. If you did not request this verification, please disregard this message; your account security remains intact.</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div style="margin:0px auto;max-width:600px;">
        
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:0;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:510px;" ><![endif]-->
            
      <div class="mj-column-per-85 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
        
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
        <tbody>
          
              <tr>
                <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                  
      <p style="border-top:solid 1px #EEEEEE;font-size:1px;margin:0px auto;width:100%;">
      </p>
      
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #EEEEEE;font-size:1px;margin:0px auto;width:460px;" role="presentation" width="460px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
    
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
    
      
      <div style="margin:0px auto;max-width:600px;">
        
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:40px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:510px;" ><![endif]-->
            
      <div class="mj-column-per-85 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
        
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
        <tbody>
          
              <tr>
                <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                  
      <div style="font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:12px;line-height:18px;text-align:center;color:#999999;">© 2024 jashan.dev. This is an automated transactional message.<br>
          123 Developer Parkway, San Francisco, CA 94107<br>
          <a href="https://jashan.dev/privacy" class="footer-link" style="color: #666666; text-decoration: underline;">Privacy Policy</a> | <a href="mailto:support@jashan.dev" class="footer-link" style="color: #666666; text-decoration: underline;">Support</a></div>
    
                </td>
              </tr>
            
              <tr>
                <td align="center" style="font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;">
                  
      <div style="font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:center;color:#BBBBBB;">This email was sent to complete a requested security action on jashan.dev.</div>
    
                </td>
              </tr>
            
        </tbody>
      </table>
    
      </div>
    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    
      
      <!--[if mso | IE]></td></tr></table><![endif]-->
    
    
      </div>
    
  </body>
</html>
  `;
};

export const createOTPRecord = async (
  userId: string,
  modelId: string,
  otp: string,
) => {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes
  const hashedOtp = hashOTP(otp);

  await db.insert(userOtpsTable).values({
    id: uuidv4(),
    user_id: userId,
    otp: hashedOtp,
    verification_key: modelId,
    used: false,
    otp_type: "MAIL_VALIDATION",
    expires_at: expiresAt,
  });

  return modelId;
};

export const sendVerificationEmail = async (email: string, otp: string) => {
  const html = createOTPEmailHTML(otp);

  const res = await sendHTMLEmail({
    html,
    to: [email],
    subject: "OTP to verify your test mail",
  });
  console.log(res);
};

export const hashOTP = (otp: string) => {
  return crypto.createHmac("sha256", env.HMAC_SECRET).update(otp).digest("hex");
};

export const verifyOTP = (otp: string, hash: string) => {
  const hashedOtp = hashOTP(otp);

  if (hash.length !== hashedOtp.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(hashedOtp, "hex"),
  );
};
