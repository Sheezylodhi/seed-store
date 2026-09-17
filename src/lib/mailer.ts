import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM =
  process.env.SMTP_FROM || SMTP_USER;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
  console.warn(
    "SMTP environment variables are not fully configured."
  );
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(
  email: string,
  name: string,
  otp: string
) {
  const firstName = name.split(" ")[0] || "there";

  await transporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: "Verify your SeedStore account",
    text: `Hi ${firstName},

Your SeedStore verification code is:

${otp}

This code will expire in 10 minutes.

If you did not create this account, you can safely ignore this email.

SeedStore`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f8f6ef;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e8e5dc;">
            
            <div style="background:#234636;padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;">
                SeedStore
              </h1>
            </div>

            <div style="padding:40px 32px;">
              <h2 style="margin-top:0;color:#234636;">
                Verify your email
              </h2>

              <p style="color:#555;line-height:1.7;">
                Hi ${firstName},
              </p>

              <p style="color:#555;line-height:1.7;">
                Thanks for creating your SeedStore account.
                Use the verification code below to complete your registration.
              </p>

              <div style="margin:30px 0;text-align:center;">
                <div style="
                  display:inline-block;
                  background:#f4f1e8;
                  color:#234636;
                  padding:18px 30px;
                  border-radius:14px;
                  font-size:32px;
                  font-weight:700;
                  letter-spacing:8px;
                ">
                  ${otp}
                </div>
              </div>

              <p style="color:#777;font-size:14px;line-height:1.6;">
                This code will expire in 10 minutes.
              </p>

              <p style="color:#777;font-size:14px;line-height:1.6;">
                If you did not request this verification code,
                you can safely ignore this email.
              </p>
            </div>

            <div style="padding:24px 32px;background:#faf9f5;text-align:center;">
              <p style="margin:0;color:#999;font-size:13px;">
                © ${new Date().getFullYear()} SeedStore
              </p>
            </div>

          </div>
        </body>
      </html>
    `,
  });
}