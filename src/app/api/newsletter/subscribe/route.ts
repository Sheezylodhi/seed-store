import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const ADMIN_EMAIL =
  process.env.NEWSLETTER_ADMIN_EMAIL || SMTP_USER;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
        },
        { status: 400 }
      );
    }

    // Basic server-side email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (
      !SMTP_HOST ||
      !SMTP_USER ||
      !SMTP_PASSWORD ||
      !ADMIN_EMAIL
    ) {
      console.error("Newsletter SMTP configuration is missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Newsletter service is temporarily unavailable.",
        },
        { status: 500 }
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

    const submittedAt = new Date().toLocaleString("en-PK", {
      timeZone: "Asia/Karachi",
      dateStyle: "medium",
      timeStyle: "short",
    });

    await transporter.sendMail({
      from: `"SeedStore Newsletter" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: "New Newsletter Subscriber — SeedStore",
      text: `
New newsletter subscription

Customer Email:
${email}

Subscribed At:
${submittedAt}

The customer has subscribed to receive growing tips, product updates and special offers from SeedStore.
      `.trim(),

      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background:#f4f5f0;font-family:Arial,Helvetica,sans-serif;color:#24352c;">
            <div style="max-width:620px;margin:40px auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e4e8e1;">

              <!-- Header -->
              <div style="background:#10291d;padding:30px 34px;">
                <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#b8ce9e;font-weight:700;">
                  SeedStore
                </div>

                <h1 style="margin:12px 0 0;font-size:26px;line-height:1.25;color:#ffffff;font-weight:600;">
                  New Newsletter Subscriber
                </h1>

                <p style="margin:9px 0 0;color:#cbd7ce;font-size:13px;line-height:1.6;">
                  Someone just joined your SeedStore newsletter.
                </p>
              </div>

              <!-- Content -->
              <div style="padding:34px;">

                <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#7c887f;font-weight:700;margin-bottom:9px;">
                  Customer Email
                </div>

                <div style="background:#f6f7f3;border:1px solid #e5e9e2;border-radius:12px;padding:16px 18px;font-size:16px;color:#10291d;font-weight:600;">
                  ${email}
                </div>

                <div style="height:24px;"></div>

                <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#7c887f;font-weight:700;margin-bottom:9px;">
                  Subscribed At
                </div>

                <div style="font-size:14px;color:#39483f;">
                  ${submittedAt}
                </div>

                <div style="height:28px;"></div>

                <div style="height:1px;background:#e8ebe6;"></div>

                <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#68746c;">
                  This customer subscribed through the newsletter form on your SeedStore website.
                  You can reply directly to this email address if needed.
                </p>

              </div>

              <!-- Footer -->
              <div style="padding:20px 34px;background:#fafbf8;border-top:1px solid #e8ebe6;">
                <p style="margin:0;font-size:11px;color:#89938c;">
                  SeedStore Newsletter System
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to subscribe right now. Please try again.",
      },
      { status: 500 }
    );
  }
}