import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

/*
|--------------------------------------------------------------------------
| SITE URL
|--------------------------------------------------------------------------
|
| Add this to .env.local:
|
| NEXT_PUBLIC_SITE_URL=https://yourdomain.com
|
*/

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

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

/* -------------------------------------------------------
   Small helper for safe HTML email content
------------------------------------------------------- */

function escapeHtml(value: string) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] || character
  );
}

/* -------------------------------------------------------
   Helper: format PKR
------------------------------------------------------- */

function formatPKR(value: number) {
  return Number(value || 0).toLocaleString("en-PK");
}

/* -------------------------------------------------------
   Helper: payment method label
------------------------------------------------------- */

function getPaymentLabel(paymentMethod: string) {
  switch (paymentMethod) {
    case "cod":
      return "Cash on Delivery";

    case "bank_transfer":
      return "Bank Transfer";

    case "jazzcash":
      return "JazzCash";

    case "easypaisa":
      return "EasyPaisa";

    default:
      return paymentMethod;
  }
}

/* -------------------------------------------------------
   Helper: payment status label
------------------------------------------------------- */

function getPaymentStatusLabel(paymentStatus: string) {
  switch (paymentStatus) {
    case "pending":
      return "Pending Verification";

    case "paid":
      return "Paid";

    case "failed":
      return "Payment Failed";

    case "refunded":
      return "Refunded";

    default:
      return paymentStatus;
  }
}

/* -------------------------------------------------------
   Helper: order view URL
------------------------------------------------------- */

function getOrderViewUrl(orderNumber: string) {
  return `${SITE_URL}/order-confirmation?order=${encodeURIComponent(
    orderNumber
  )}`;
}

/* -------------------------------------------------------
   EMAIL VERIFICATION
------------------------------------------------------- */

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
        <body
          style="
            margin:0;
            padding:0;
            background:#f8f6ef;
            font-family:Arial,Helvetica,sans-serif;
          "
        >
          <div
            style="
              max-width:600px;
              margin:40px auto;
              background:#ffffff;
              border-radius:20px;
              overflow:hidden;
              border:1px solid #e8e5dc;
            "
          >
            <div
              style="
                background:#234636;
                padding:32px;
                text-align:center;
              "
            >
              <h1
                style="
                  margin:0;
                  color:#ffffff;
                  font-size:28px;
                "
              >
                SeedStore
              </h1>
            </div>

            <div style="padding:40px 32px;">
              <h2
                style="
                  margin:0 0 20px;
                  color:#234636;
                  font-size:24px;
                "
              >
                Verify your email
              </h2>

              <p
                style="
                  color:#555;
                  line-height:1.7;
                "
              >
                Hi ${escapeHtml(firstName)},
              </p>

              <p
                style="
                  color:#555;
                  line-height:1.7;
                "
              >
                Thanks for creating your SeedStore account.
                Use the verification code below to complete
                your registration.
              </p>

              <div
                style="
                  margin:30px 0;
                  text-align:center;
                "
              >
                <div
                  style="
                    display:inline-block;
                    background:#f4f1e8;
                    color:#234636;
                    padding:18px 30px;
                    border-radius:14px;
                    font-size:32px;
                    font-weight:700;
                    letter-spacing:8px;
                  "
                >
                  ${escapeHtml(otp)}
                </div>
              </div>

              <p
                style="
                  color:#777;
                  font-size:14px;
                  line-height:1.6;
                "
              >
                This code will expire in 10 minutes.
              </p>

              <p
                style="
                  color:#777;
                  font-size:14px;
                  line-height:1.6;
                "
              >
                If you did not request this verification code,
                you can safely ignore this email.
              </p>
            </div>

            <div
              style="
                padding:24px 32px;
                background:#faf9f5;
                text-align:center;
              "
            >
              <p
                style="
                  margin:0;
                  color:#999;
                  font-size:13px;
                "
              >
                © ${new Date().getFullYear()} SeedStore
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

/* -------------------------------------------------------
   PASSWORD RESET EMAIL
------------------------------------------------------- */

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string
) {
  const firstName = escapeHtml(
    name.split(" ")[0] || "there"
  );

  const safeResetUrl = escapeHtml(resetUrl);

  await transporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: "Reset your SeedStore password",

    text: `Hi ${name.split(" ")[0] || "there"},

We received a request to reset your SeedStore password.

Use the link below to create a new password:

${resetUrl}

This password reset link will expire in 30 minutes and can only be used once.

If you did not request a password reset, you can safely ignore this email.

SeedStore`,

    html: `
      <!DOCTYPE html>
      <html>
        <body
          style="
            margin:0;
            padding:0;
            background:#f8f6ef;
            font-family:Arial,Helvetica,sans-serif;
          "
        >
          <div
            style="
              max-width:600px;
              margin:40px auto;
              background:#ffffff;
              border-radius:20px;
              overflow:hidden;
              border:1px solid #e8e5dc;
            "
          >
            <div
              style="
                background:#234636;
                padding:32px;
                text-align:center;
              "
            >
              <h1
                style="
                  margin:0;
                  color:#ffffff;
                  font-size:28px;
                  font-weight:700;
                "
              >
                SeedStore
              </h1>
            </div>

            <div style="padding:40px 32px;">
              <h2
                style="
                  margin:0 0 20px;
                  color:#234636;
                  font-size:24px;
                "
              >
                Reset your password
              </h2>

              <p
                style="
                  color:#555;
                  line-height:1.7;
                  margin:0 0 16px;
                "
              >
                Hi ${firstName},
              </p>

              <p
                style="
                  color:#555;
                  line-height:1.7;
                  margin:0 0 24px;
                "
              >
                We received a request to reset your SeedStore
                password. Click the button below to create
                a new password.
              </p>

              <div
                style="
                  text-align:center;
                  margin:32px 0;
                "
              >
                <a
                  href="${safeResetUrl}"
                  style="
                    display:inline-block;
                    background:#315c42;
                    color:#ffffff;
                    text-decoration:none;
                    padding:15px 28px;
                    border-radius:12px;
                    font-size:16px;
                    font-weight:700;
                  "
                >
                  Reset my password
                </a>
              </div>

              <div
                style="
                  background:#f4f1e8;
                  border-radius:14px;
                  padding:18px 20px;
                  margin:28px 0;
                "
              >
                <p
                  style="
                    margin:0;
                    color:#555;
                    font-size:14px;
                    line-height:1.6;
                  "
                >
                  🔒 This password reset link expires in
                  <strong>30 minutes</strong> and can only
                  be used once.
                </p>
              </div>

              <p
                style="
                  color:#777;
                  font-size:14px;
                  line-height:1.6;
                  margin:24px 0 0;
                "
              >
                If the button doesn't work, copy and paste
                this link into your browser:
              </p>

              <p
                style="
                  word-break:break-all;
                  color:#315c42;
                  font-size:13px;
                  line-height:1.6;
                "
              >
                ${safeResetUrl}
              </p>

              <p
                style="
                  color:#777;
                  font-size:14px;
                  line-height:1.6;
                  margin-top:24px;
                "
              >
                If you did not request a password reset,
                you can safely ignore this email.
              </p>
            </div>

            <div
              style="
                padding:24px 32px;
                background:#faf9f5;
                text-align:center;
              "
            >
              <p
                style="
                  margin:0;
                  color:#999;
                  font-size:13px;
                "
              >
                © ${new Date().getFullYear()} SeedStore
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

/* -------------------------------------------------------
   ORDER CONFIRMATION EMAIL - CUSTOMER
------------------------------------------------------- */

export async function sendOrderConfirmationEmail(
  email: string,
  order: {
    orderNumber: string;
    customerName: string;

    items: {
      name: string;
      packSize?: string;
      price: number;
      quantity: number;
      image?: string;
    }[];

    subtotal: number;
    discount: number;
    deliveryCharge: number;
    total: number;

    paymentMethod: string;
    paymentStatus: string;

    shippingAddress?: {
      address?: string;
      apartment?: string;
      city?: string;
      postalCode?: string;
      country?: string;
    };
  }
) {
  const customerName = order.customerName || "there";
  const customerNameSafe = escapeHtml(customerName);

  const orderNumberSafe = escapeHtml(
    order.orderNumber
  );

  const orderViewUrl = getOrderViewUrl(
    order.orderNumber
  );

  const paymentLabel = getPaymentLabel(
    order.paymentMethod
  );

  const paymentStatusLabel =
    getPaymentStatusLabel(
      order.paymentStatus
    );

  const safeUrl = escapeHtml(orderViewUrl);

  /*
  |--------------------------------------------------------------------------
  | PRODUCT IMAGE CID ATTACHMENTS
  |--------------------------------------------------------------------------
  |
  | Instead of relying on the email client loading an external
  | Cloudinary image URL, we attach each product image inline
  | and reference it using cid: inside the HTML email.
  |
  */

  const emailTimestamp = Date.now();

  const customerImageAttachments = order.items
    .map((item, index) => {
      if (
        typeof item.image !== "string" ||
        !item.image.trim()
      ) {
        return null;
      }

      const cid = `seedstore-product-${index}-${emailTimestamp}@seedstore`;

      return {
        filename: `product-${index + 1}.jpg`,
        path: item.image.trim(),
        cid,
      };
    })
    .filter(
      (
        attachment
      ): attachment is {
        filename: string;
        path: string;
        cid: string;
      } => Boolean(attachment)
    );

  const itemsHtml = order.items
    .map((item, index) => {
      const name = escapeHtml(item.name);

      const packSize = item.packSize
        ? escapeHtml(item.packSize)
        : "";

      const quantity = Number(
        item.quantity || 0
      );

      const price = Number(
        item.price || 0
      );

      const lineTotal =
        price * quantity;

      const image =
        typeof item.image === "string" &&
        item.image.trim()
          ? item.image.trim()
          : "";

      const imageAttachment =
        image
          ? customerImageAttachments.find(
              (attachment) =>
                attachment.cid.startsWith(
                  `seedstore-product-${index}-`
                )
            )
          : null;

      return `
        <tr>
          <td style="padding:0 0 16px;">
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                border:1px solid #e6e8e2;
                border-radius:14px;
                background:#ffffff;
              "
            >
              <tr>

                <td
                  width="84"
                  valign="middle"
                  style="padding:12px;"
                >
                  ${
                    imageAttachment
                      ? `
                        <img
                          src="cid:${imageAttachment.cid}"
                          alt="${name}"
                          width="64"
                          height="64"
                          style="
                            display:block;
                            width:64px;
                            height:64px;
                            object-fit:cover;
                            border-radius:10px;
                            border:1px solid #e5e7e2;
                            background:#f5f3ec;
                          "
                        />
                      `
                      : `
                        <div
                          style="
                            width:64px;
                            height:64px;
                            border-radius:10px;
                            background:#f4f1e8;
                            text-align:center;
                            line-height:64px;
                            color:#315c42;
                            font-size:20px;
                            font-weight:700;
                          "
                        >
                          S
                        </div>
                      `
                  }
                </td>

                <td
                  valign="middle"
                  style="
                    padding:12px 6px 12px 0;
                  "
                >
                  <div
                    style="
                      font-size:14px;
                      line-height:1.4;
                      font-weight:700;
                      color:#234636;
                    "
                  >
                    ${name}
                  </div>

                  ${
                    packSize
                      ? `
                        <div
                          style="
                            font-size:12px;
                            color:#7b817c;
                            margin-top:4px;
                          "
                        >
                          ${packSize}
                        </div>
                      `
                      : ""
                  }

                  <div
                    style="
                      font-size:12px;
                      color:#7b817c;
                      margin-top:5px;
                    "
                  >
                    Qty ${quantity} × PKR ${formatPKR(price)}
                  </div>
                </td>

                <td
                  width="105"
                  align="right"
                  valign="middle"
                  style="
                    padding:12px 14px 12px 4px;
                    white-space:nowrap;
                  "
                >
                  <div
                    style="
                      font-size:14px;
                      font-weight:700;
                      color:#234636;
                    "
                  >
                    PKR ${formatPKR(lineTotal)}
                  </div>
                </td>

              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join("");

  const itemsText = order.items
    .map(
      (item) =>
        `${item.name}${
          item.packSize
            ? ` (${item.packSize})`
            : ""
        } × ${
          item.quantity
        } = PKR ${formatPKR(
          Number(item.price) *
            Number(item.quantity)
        )}`
    )
    .join("\n");

  const addressParts = [
    order.shippingAddress?.address,
    order.shippingAddress?.apartment,
    order.shippingAddress?.city,
    order.shippingAddress?.postalCode,
    order.shippingAddress?.country,
  ].filter(Boolean);

  const shippingAddressHtml =
    addressParts.length
      ? addressParts
          .map((part) =>
            escapeHtml(String(part))
          )
          .join("<br>")
      : "Shipping address provided at checkout";

  const shippingAddressText =
    addressParts.length
      ? addressParts.join(", ")
      : "Shipping address provided at checkout";

  await transporter.sendMail({
    from: SMTP_FROM,
    to: email,

    /*
    |--------------------------------------------------------------------------
    | INLINE PRODUCT IMAGES
    |--------------------------------------------------------------------------
    */

    attachments:
      customerImageAttachments,

    subject: `Your SeedStore order ${order.orderNumber} is confirmed`,

    text: `Hi ${customerName},

Thank you for shopping with SeedStore. Your order has been received successfully.

ORDER ${order.orderNumber}

ITEMS

${itemsText}

ORDER SUMMARY

Subtotal: PKR ${formatPKR(
      order.subtotal
    )}

${
  order.discount > 0
    ? `Discount: - PKR ${formatPKR(
        order.discount
      )}\n`
    : ""
}Delivery: ${
      order.deliveryCharge > 0
        ? `PKR ${formatPKR(
            order.deliveryCharge
          )}`
        : "Free"
    }

Total: PKR ${formatPKR(
      order.total
    )}

PAYMENT

Method: ${paymentLabel}

Status: ${paymentStatusLabel}

SHIPPING

${shippingAddressText}

View your order:

${orderViewUrl}

Thank you for choosing SeedStore.

SeedStore`,

    html: `
<!DOCTYPE html>
<html>

<head>
  <meta
    http-equiv="Content-Type"
    content="text/html; charset=UTF-8"
  />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Order ${orderNumberSafe} — SeedStore
  </title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f3f1eb;
    font-family:Arial,Helvetica,sans-serif;
    color:#303833;
  "
>

  <div
    style="
      display:none;
      max-height:0;
      overflow:hidden;
      opacity:0;
      color:transparent;
    "
  >
    Your SeedStore order
    ${orderNumberSafe}
    has been confirmed. View your order details and items.
  </div>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width:100%;
      background:#f3f1eb;
    "
  >
    <tr>

      <td
        align="center"
        style="
          padding:28px 12px 40px;
        "
      >

        <table
          width="620"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            max-width:620px;
            background:#ffffff;
            border:1px solid #e4e4dd;
          "
        >

          <!-- BRAND HEADER -->

          <tr>

            <td
              style="
                background:#234636;
                padding:28px 32px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td>

                    <div
                      style="
                        font-size:24px;
                        line-height:1.2;
                        font-weight:700;
                        color:#ffffff;
                        letter-spacing:-0.4px;
                      "
                    >
                      SeedStore
                    </div>

                    <div
                      style="
                        font-size:11px;
                        line-height:1.5;
                        color:#dce8df;
                        margin-top:5px;
                        letter-spacing:1.2px;
                      "
                    >
                      NATURAL • SIMPLE • BETTER
                    </div>

                  </td>

                  <td
                    align="right"
                    valign="middle"
                  >

                    <div
                      style="
                        font-size:11px;
                        color:#dce8df;
                      "
                    >
                      ORDER CONFIRMATION
                    </div>

                  </td>

                </tr>

              </table>

            </td>

          </tr>

          <!-- SUCCESS BANNER -->

          <tr>

            <td
              style="
                padding:30px 32px 10px;
              "
            >

              <div
                style="
                  display:inline-block;
                  background:#eaf3ec;
                  border:1px solid #d8e8dc;
                  border-radius:999px;
                  padding:7px 11px;
                  color:#315c42;
                  font-size:11px;
                  font-weight:700;
                  letter-spacing:.5px;
                "
              >
                ✓ ORDER CONFIRMED
              </div>

              <h1
                style="
                  margin:17px 0 8px;
                  font-size:27px;
                  line-height:1.25;
                  color:#234636;
                  letter-spacing:-.5px;
                "
              >
                Thank you for your order,
                ${customerNameSafe}!
              </h1>

              <p
                style="
                  margin:0;
                  color:#68706a;
                  font-size:14px;
                  line-height:1.7;
                "
              >
                We’ve received your order and are getting it
                ready. We’ll keep you updated as it moves
                through the next steps.
              </p>

            </td>

          </tr>

          <!-- ORDER META -->

          <tr>

            <td
              style="
                padding:22px 32px 4px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td
                    width="50%"
                    valign="top"
                    style="
                      padding:16px;
                      background:#f7f5ee;
                      border:1px solid #ece9df;
                    "
                  >

                    <div
                      style="
                        font-size:10px;
                        color:#8a8f89;
                        font-weight:700;
                        letter-spacing:1px;
                      "
                    >
                      ORDER NUMBER
                    </div>

                    <div
                      style="
                        margin-top:7px;
                        font-size:16px;
                        font-weight:700;
                        color:#234636;
                      "
                    >
                      ${orderNumberSafe}
                    </div>

                  </td>

                  <td
                    width="50%"
                    valign="top"
                    style="
                      padding:16px;
                      background:#ffffff;
                      border:1px solid #ece9df;
                    "
                  >

                    <div
                      style="
                        font-size:10px;
                        color:#8a8f89;
                        font-weight:700;
                        letter-spacing:1px;
                      "
                    >
                      PAYMENT
                    </div>

                    <div
                      style="
                        margin-top:7px;
                        font-size:14px;
                        font-weight:700;
                        color:#234636;
                      "
                    >
                      ${escapeHtml(paymentLabel)}
                    </div>

                    <div
                      style="
                        margin-top:4px;
                        font-size:11px;
                        color:#747b76;
                      "
                    >
                      ${escapeHtml(
                        paymentStatusLabel
                      )}
                    </div>

                  </td>

                </tr>

              </table>

            </td>

          </tr>

          <!-- CTA -->

          <tr>

            <td
              align="center"
              style="
                padding:22px 32px 8px;
              "
            >

              <a
                href="${safeUrl}"
                style="
                  display:inline-block;
                  background:#315c42;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 25px;
                  border-radius:8px;
                  font-size:14px;
                  font-weight:700;
                "
              >
                View Your Order
              </a>

            </td>

          </tr>

          <!-- ITEMS -->

          <tr>

            <td
              style="
                padding:28px 32px 0;
              "
            >

              <div
                style="
                  font-size:17px;
                  font-weight:700;
                  color:#234636;
                  margin-bottom:14px;
                "
              >
                Your order
              </div>

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tbody>
                  ${itemsHtml}
                </tbody>

              </table>

            </td>

          </tr>

          <!-- SUMMARY -->

          <tr>

            <td
              style="
                padding:4px 32px 0;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background:#f8f7f2;
                  border:1px solid #ebe9e1;
                "
              >

                <tr>

                  <td style="padding:20px;">

                    <div
                      style="
                        font-size:15px;
                        font-weight:700;
                        color:#234636;
                        margin-bottom:12px;
                      "
                    >
                      Order summary
                    </div>

                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >

                      <tr>

                        <td
                          style="
                            padding:5px 0;
                            color:#777d78;
                            font-size:13px;
                          "
                        >
                          Subtotal
                        </td>

                        <td
                          align="right"
                          style="
                            padding:5px 0;
                            color:#444b46;
                            font-size:13px;
                          "
                        >
                          PKR ${formatPKR(
                            order.subtotal
                          )}
                        </td>

                      </tr>

                      ${
                        order.discount > 0
                          ? `
                            <tr>

                              <td
                                style="
                                  padding:5px 0;
                                  color:#315c42;
                                  font-size:13px;
                                "
                              >
                                Discount
                              </td>

                              <td
                                align="right"
                                style="
                                  padding:5px 0;
                                  color:#315c42;
                                  font-size:13px;
                                "
                              >
                                - PKR ${formatPKR(
                                  order.discount
                                )}
                              </td>

                            </tr>
                          `
                          : ""
                      }

                      <tr>

                        <td
                          style="
                            padding:5px 0;
                            color:#777d78;
                            font-size:13px;
                          "
                        >
                          Delivery
                        </td>

                        <td
                          align="right"
                          style="
                            padding:5px 0;
                            color:#444b46;
                            font-size:13px;
                          "
                        >
                          ${
                            order.deliveryCharge > 0
                              ? `PKR ${formatPKR(
                                  order.deliveryCharge
                                )}`
                              : "Free"
                          }
                        </td>

                      </tr>

                      <tr>

                        <td
                          colspan="2"
                          style="
                            padding-top:12px;
                            border-top:1px solid #deded7;
                          "
                        ></td>

                      </tr>

                      <tr>

                        <td
                          style="
                            padding-top:3px;
                            color:#234636;
                            font-size:16px;
                            font-weight:700;
                          "
                        >
                          Total
                        </td>

                        <td
                          align="right"
                          style="
                            padding-top:3px;
                            color:#234636;
                            font-size:18px;
                            font-weight:700;
                          "
                        >
                          PKR ${formatPKR(
                            order.total
                          )}
                        </td>

                      </tr>

                    </table>

                  </td>

                </tr>

              </table>

            </td>

          </tr>

          <!-- SHIPPING -->

          <tr>

            <td
              style="
                padding:22px 32px 0;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td
                    width="50%"
                    valign="top"
                    style="
                      padding-right:8px;
                    "
                  >

                    <div
                      style="
                        font-size:10px;
                        font-weight:700;
                        color:#8a8f89;
                        letter-spacing:1px;
                        margin-bottom:8px;
                      "
                    >
                      SHIPPING TO
                    </div>

                    <div
                      style="
                        font-size:13px;
                        line-height:1.7;
                        color:#555d57;
                      "
                    >
                      ${shippingAddressHtml}
                    </div>

                  </td>

                  <td
                    width="50%"
                    valign="top"
                    style="
                      padding-left:8px;
                    "
                  >

                    <div
                      style="
                        font-size:10px;
                        font-weight:700;
                        color:#8a8f89;
                        letter-spacing:1px;
                        margin-bottom:8px;
                      "
                    >
                      PAYMENT METHOD
                    </div>

                    <div
                      style="
                        font-size:13px;
                        line-height:1.7;
                        color:#555d57;
                      "
                    >
                      ${escapeHtml(
                        paymentLabel
                      )}

                      <br>

                      <span
                        style="
                          color:#7b817c;
                        "
                      >
                        ${escapeHtml(
                          paymentStatusLabel
                        )}
                      </span>

                    </div>

                  </td>

                </tr>

              </table>

            </td>

          </tr>

          <!-- SECOND CTA -->

          <tr>

            <td
              style="
                padding:28px 32px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background:#234636;
                "
              >

                <tr>

                  <td
                    style="
                      padding:22px 24px;
                    "
                  >

                    <div
                      style="
                        font-size:15px;
                        font-weight:700;
                        color:#ffffff;
                      "
                    >
                      Need to check your order?
                    </div>

                    <div
                      style="
                        font-size:12px;
                        line-height:1.6;
                        color:#dce8df;
                        margin-top:5px;
                      "
                    >
                      Open your order details anytime
                      using the button below.
                    </div>

                  </td>

                  <td
                    align="right"
                    valign="middle"
                    style="
                      padding:22px 24px 22px 8px;
                    "
                  >

                    <a
                      href="${safeUrl}"
                      style="
                        display:inline-block;
                        background:#ffffff;
                        color:#234636;
                        text-decoration:none;
                        padding:11px 15px;
                        border-radius:7px;
                        font-size:12px;
                        font-weight:700;
                      "
                    >
                      Order Details
                    </a>

                  </td>

                </tr>

              </table>

            </td>

          </tr>

          <!-- FOOTER -->

          <tr>

            <td
              align="center"
              style="
                padding:24px 30px;
                background:#faf9f5;
                border-top:1px solid #ece9e1;
              "
            >

              <div
                style="
                  font-size:14px;
                  font-weight:700;
                  color:#234636;
                "
              >
                SeedStore
              </div>

              <div
                style="
                  font-size:11px;
                  line-height:1.7;
                  color:#969b96;
                  margin-top:6px;
                "
              >
                Thank you for choosing SeedStore.
              </div>

              <div
                style="
                  font-size:10px;
                  color:#b0b4b0;
                  margin-top:8px;
                "
              >
                © ${new Date().getFullYear()}
                SeedStore. All rights reserved.
              </div>

            </td>

          </tr>

        </table>

      </td>

    </tr>

  </table>

</body>

</html>
`,
  });
}

/* -------------------------------------------------------
   NEW ORDER EMAIL - ADMIN
------------------------------------------------------- */

export async function sendNewOrderAdminEmail(
  adminEmail: string,
  order: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;

    items: {
      name: string;
      packSize?: string;
      price: number;
      quantity: number;
      image?: string;
    }[];

    subtotal: number;
    discount: number;
    deliveryCharge: number;
    total: number;

    paymentMethod: string;
    paymentStatus: string;

    address: string;
    city: string;
  }
) {
  const itemsHtml = order.items
    .map((item) => {
      const itemImage = item.image
        ? escapeHtml(item.image)
        : "";

      return `
        <tr>

          <td
            style="
              padding:15px 0;
              border-bottom:1px solid #eeeeee;
            "
          >

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >

              <tr>

                ${
                  itemImage
                    ? `
                      <td
                        width="64"
                        valign="middle"
                        style="
                          padding-right:13px;
                        "
                      >

                        <img
                          src="${itemImage}"
                          alt="${escapeHtml(
                            item.name
                          )}"
                          width="56"
                          height="56"
                          style="
                            display:block;
                            width:56px;
                            height:56px;
                            object-fit:cover;
                            border-radius:10px;
                            border:1px solid #e7e4dc;
                          "
                        />

                      </td>
                    `
                    : ""
                }

                <td valign="middle">

                  <div
                    style="
                      color:#234636;
                      font-size:14px;
                      font-weight:700;
                    "
                  >
                    ${escapeHtml(
                      item.name
                    )}
                  </div>

                  ${
                    item.packSize
                      ? `
                        <div
                          style="
                            color:#888;
                            font-size:12px;
                            margin-top:4px;
                          "
                        >
                          ${escapeHtml(
                            item.packSize
                          )}
                        </div>
                      `
                      : ""
                  }

                </td>

                <td
                  align="right"
                  valign="middle"
                >

                  <div
                    style="
                      color:#234636;
                      font-size:13px;
                      font-weight:700;
                      white-space:nowrap;
                    "
                  >
                    PKR ${formatPKR(
                      Number(item.price) *
                        Number(item.quantity)
                    )}
                  </div>

                  <div
                    style="
                      color:#999;
                      font-size:11px;
                      margin-top:4px;
                    "
                  >
                    Qty: ${Number(
                      item.quantity
                    )}
                  </div>

                </td>

              </tr>

            </table>

          </td>

        </tr>
      `;
    })
    .join("");

  const paymentLabel =
    getPaymentLabel(
      order.paymentMethod
    );

  const paymentStatusLabel =
    getPaymentStatusLabel(
      order.paymentStatus
    );

  const itemsText = order.items
    .map(
      (item) =>
        `${item.name}${
          item.packSize
            ? ` (${item.packSize})`
            : ""
        } x ${item.quantity} = PKR ${formatPKR(
          Number(item.price) *
            Number(item.quantity)
        )}`
    )
    .join("\n");

  await transporter.sendMail({
    from: SMTP_FROM,
    to: adminEmail,

    subject:
      `New Order ${order.orderNumber} — SeedStore`,

    text: `New SeedStore order received.

ORDER

${order.orderNumber}

CUSTOMER

${order.customerName}

${order.customerEmail}

${order.customerPhone}

ITEMS

${itemsText}

ORDER TOTAL

Subtotal: PKR ${formatPKR(
      order.subtotal
    )}

${
  order.discount > 0
    ? `Discount: - PKR ${formatPKR(
        order.discount
      )}\n`
    : ""
}Delivery: ${
      order.deliveryCharge > 0
        ? `PKR ${formatPKR(
            order.deliveryCharge
          )}`
        : "Free"
    }

Total: PKR ${formatPKR(
      order.total
    )}

PAYMENT

Method: ${paymentLabel}

Status: ${paymentStatusLabel}

DELIVERY ADDRESS

${order.address}

${order.city}`,

    html: `
      <!DOCTYPE html>

      <html>

        <head>

          <meta
            http-equiv="Content-Type"
            content="text/html; charset=UTF-8"
          />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

        </head>

        <body
          style="
            margin:0;
            padding:0;
            background:#f4f2ec;
            font-family:Arial,Helvetica,sans-serif;
            color:#444444;
          "
        >

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              background:#f4f2ec;
            "
          >

            <tr>

              <td
                align="center"
                style="
                  padding:36px 15px;
                "
              >

                <table
                  width="600"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    width:100%;
                    max-width:600px;
                    background:#ffffff;
                    border-radius:20px;
                    overflow:hidden;
                    border:1px solid #e5e2d9;
                  "
                >

                  <!-- HEADER -->

                  <tr>

                    <td
                      style="
                        background:#234636;
                        padding:28px 30px;
                      "
                    >

                      <div
                        style="
                          color:#ffffff;
                          font-size:24px;
                          font-weight:700;
                        "
                      >
                        New Order Received
                      </div>

                      <div
                        style="
                          color:#dce8df;
                          font-size:12px;
                          margin-top:6px;
                        "
                      >
                        SeedStore Admin Notification
                      </div>

                    </td>

                  </tr>

                  <!-- CONTENT -->

                  <tr>

                    <td
                      style="
                        padding:32px;
                      "
                    >

                      <!-- ORDER -->

                      <div
                        style="
                          background:#f4f1e8;
                          border-radius:14px;
                          padding:18px 20px;
                        "
                      >

                        <div
                          style="
                            color:#8a8a83;
                            font-size:10px;
                            font-weight:700;
                            letter-spacing:1px;
                            margin-bottom:7px;
                          "
                        >
                          ORDER NUMBER
                        </div>

                        <div
                          style="
                            color:#234636;
                            font-size:20px;
                            font-weight:700;
                          "
                        >
                          ${escapeHtml(
                            order.orderNumber
                          )}
                        </div>

                      </div>

                      <!-- CUSTOMER -->

                      <h3
                        style="
                          margin:28px 0 12px;
                          color:#234636;
                          font-size:16px;
                        "
                      >
                        Customer
                      </h3>

                      <div
                        style="
                          color:#555555;
                          font-size:14px;
                          line-height:1.8;
                        "
                      >

                        <strong
                          style="
                            color:#234636;
                          "
                        >
                          ${escapeHtml(
                            order.customerName
                          )}
                        </strong>

                        <br>

                        ${escapeHtml(
                          order.customerEmail
                        )}

                        <br>

                        ${escapeHtml(
                          order.customerPhone
                        )}

                      </div>

                      <!-- ADDRESS -->

                      <h3
                        style="
                          margin:28px 0 12px;
                          color:#234636;
                          font-size:16px;
                        "
                      >
                        Delivery Address
                      </h3>

                      <div
                        style="
                          background:#faf9f5;
                          border-radius:12px;
                          padding:15px 17px;
                          color:#555555;
                          font-size:14px;
                          line-height:1.7;
                        "
                      >

                        ${escapeHtml(
                          order.address
                        )}

                        <br>

                        ${escapeHtml(
                          order.city
                        )}

                      </div>

                      <!-- ITEMS -->

                      <h3
                        style="
                          margin:28px 0 12px;
                          color:#234636;
                          font-size:16px;
                        "
                      >
                        Order Items
                      </h3>

                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                      >

                        <tbody>
                          ${itemsHtml}
                        </tbody>

                      </table>

                      <!-- SUMMARY -->

                      <div
                        style="
                          margin-top:24px;
                          padding:18px;
                          background:#faf9f5;
                          border-radius:14px;
                        "
                      >

                        <table
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                        >

                          <tr>

                            <td
                              style="
                                padding:5px 0;
                                color:#777;
                                font-size:14px;
                              "
                            >
                              Subtotal
                            </td>

                            <td
                              align="right"
                              style="
                                color:#555;
                                font-size:14px;
                              "
                            >
                              PKR ${formatPKR(
                                order.subtotal
                              )}
                            </td>

                          </tr>

                          ${
                            order.discount > 0
                              ? `
                                <tr>

                                  <td
                                    style="
                                      padding:5px 0;
                                      color:#315c42;
                                      font-size:14px;
                                    "
                                  >
                                    Discount
                                  </td>

                                  <td
                                    align="right"
                                    style="
                                      color:#315c42;
                                      font-size:14px;
                                    "
                                  >
                                    - PKR ${formatPKR(
                                      order.discount
                                    )}
                                  </td>

                                </tr>
                              `
                              : ""
                          }

                          <tr>

                            <td
                              style="
                                padding:5px 0;
                                color:#777;
                                font-size:14px;
                              "
                            >
                              Delivery
                            </td>

                            <td
                              align="right"
                              style="
                                color:#555;
                                font-size:14px;
                              "
                            >
                              ${
                                order.deliveryCharge >
                                0
                                  ? `PKR ${formatPKR(
                                      order.deliveryCharge
                                    )}`
                                  : "Free"
                              }
                            </td>

                          </tr>

                          <tr>

                            <td
                              colspan="2"
                              style="
                                padding-top:12px;
                                border-top:1px solid #deded8;
                              "
                            ></td>

                          </tr>

                          <tr>

                            <td
                              style="
                                color:#234636;
                                font-size:17px;
                                font-weight:700;
                              "
                            >
                              Total
                            </td>

                            <td
                              align="right"
                              style="
                                color:#234636;
                                font-size:18px;
                                font-weight:700;
                              "
                            >
                              PKR ${formatPKR(
                                order.total
                              )}
                            </td>

                          </tr>

                        </table>

                      </div>

                      <!-- PAYMENT -->

                      <div
                        style="
                          margin-top:20px;
                          padding:17px 18px;
                          border:1px solid #e5e7e2;
                          border-radius:14px;
                        "
                      >

                        <div
                          style="
                            color:#8a8a83;
                            font-size:10px;
                            font-weight:700;
                            letter-spacing:1px;
                          "
                        >
                          PAYMENT
                        </div>

                        <div
                          style="
                            margin-top:8px;
                            color:#234636;
                            font-size:14px;
                            font-weight:700;
                          "
                        >
                          ${escapeHtml(
                            paymentLabel
                          )}
                        </div>

                        <div
                          style="
                            margin-top:6px;
                            color:#777;
                            font-size:13px;
                          "
                        >
                          Status:
                          ${escapeHtml(
                            paymentStatusLabel
                          )}
                        </div>

                      </div>

                    </td>

                  </tr>

                  <!-- FOOTER -->

                  <tr>

                    <td
                      align="center"
                      style="
                        padding:22px 30px;
                        background:#faf9f5;
                        border-top:1px solid #eeeae1;
                      "
                    >

                      <div
                        style="
                          color:#999;
                          font-size:12px;
                        "
                      >
                        SeedStore Admin Notification
                      </div>

                    </td>

                  </tr>

                </table>

              </td>

            </tr>

          </table>

        </body>

      </html>
    `,
  });
}

type OrderManagementEmailChanges = {
  statusChanged?: boolean;
  paymentStatusChanged?: boolean;
  courierChanged?: boolean;
  trackingChanged?: boolean;
  deliveryDateChanged?: boolean;
  paymentDetailsChanged?: boolean;
  customerInfoChanged?: boolean;
  shippingAddressChanged?: boolean;
  billingAddressChanged?: boolean;
  cancellationChanged?: boolean;
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  card: "Card",
  bank_transfer: "Bank Transfer",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

function mailerFormatPrice(value: number) {
  return `₨${Number(value || 0).toLocaleString(
    "en-PK"
  )}`;
}

function mailerFormatDate(date?: string | Date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function mailerFormatDateTime(
  date?: string | Date
) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export async function sendOrderManagementUpdateEmail({
  order,
  changes,
}: {
  order: any;
  changes: OrderManagementEmailChanges;
}) {
  const customerEmail =
    order?.customerInfo?.email;

  if (!customerEmail) {
    return;
  }

  const customerName =
    `${order?.customerInfo?.firstName || ""} ${
      order?.customerInfo?.lastName || ""
    }`.trim() || "Customer";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const orderUrl =
    `${siteUrl}/order-confirmation?order=${encodeURIComponent(
      order.orderNumber
    )}`;

  const changedSections: string[] = [];

  if (changes.statusChanged) {
    changedSections.push(`
      <div style="margin-bottom:18px;padding:18px;border:1px solid #e4ebe5;border-radius:14px;background:#fafcf9;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#89948d;margin-bottom:7px;">
          Order Status
        </div>
        <div style="font-size:16px;font-weight:700;color:#17231c;">
          ${
            ORDER_STATUS_LABELS[
              order.orderStatus
            ] || order.orderStatus
          }
        </div>
      </div>
    `);
  }

  if (changes.paymentStatusChanged) {
    changedSections.push(`
      <div style="margin-bottom:18px;padding:18px;border:1px solid #e4ebe5;border-radius:14px;background:#fafcf9;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#89948d;margin-bottom:7px;">
          Payment Status
        </div>
        <div style="font-size:16px;font-weight:700;color:#17231c;">
          ${
            PAYMENT_STATUS_LABELS[
              order.paymentStatus
            ] ||
            order.paymentStatus
          }
        </div>
      </div>
    `);
  }

  if (
    changes.courierChanged ||
    changes.trackingChanged ||
    changes.deliveryDateChanged
  ) {
    changedSections.push(`
      <div style="margin-bottom:18px;padding:18px;border:1px solid #e4ebe5;border-radius:14px;background:#fafcf9;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#89948d;margin-bottom:12px;">
          Delivery Information
        </div>

        ${
          order.shipping?.courier
            ? `
              <div style="margin-bottom:10px;">
                <div style="font-size:11px;color:#89948d;">Courier</div>
                <div style="margin-top:3px;font-size:14px;font-weight:700;color:#17231c;">
                  ${escapeHtml(
                    order.shipping.courier
                  )}
                </div>
              </div>
            `
            : ""
        }

        ${
          order.shipping?.trackingNumber
            ? `
              <div style="margin-bottom:10px;">
                <div style="font-size:11px;color:#89948d;">Tracking Number</div>
                <div style="margin-top:3px;font-size:14px;font-weight:700;color:#17231c;">
                  ${escapeHtml(
                    order.shipping
                      .trackingNumber
                  )}
                </div>
              </div>
            `
            : ""
        }

        ${
          order.shipping
            ?.estimatedDeliveryDate
            ? `
              <div>
                <div style="font-size:11px;color:#89948d;">Estimated Delivery</div>
                <div style="margin-top:3px;font-size:14px;font-weight:700;color:#17231c;">
                  ${mailerFormatDate(
                    order.shipping
                      .estimatedDeliveryDate
                  )}
                </div>
              </div>
            `
            : ""
        }
      </div>
    `);
  }

  if (changes.paymentDetailsChanged) {
    changedSections.push(`
      <div style="margin-bottom:18px;padding:18px;border:1px solid #e4ebe5;border-radius:14px;background:#fafcf9;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#89948d;margin-bottom:12px;">
          Payment Information
        </div>

        <div style="font-size:13px;color:#17231c;">
          ${
            PAYMENT_METHOD_LABELS[
              order.paymentMethod
            ] ||
            order.paymentMethod ||
            "Payment"
          }
        </div>

        ${
          order.payment?.transactionId
            ? `
              <div style="margin-top:9px;font-size:12px;color:#536158;">
                Transaction ID:
                <strong style="color:#17231c;">
                  ${escapeHtml(
                    order.payment.transactionId
                  )}
                </strong>
              </div>
            `
            : ""
        }

        ${
          order.payment?.referenceNumber
            ? `
              <div style="margin-top:6px;font-size:12px;color:#536158;">
                Reference:
                <strong style="color:#17231c;">
                  ${escapeHtml(
                    order.payment.referenceNumber
                  )}
                </strong>
              </div>
            `
            : ""
        }
      </div>
    `);
  }

  if (
    changes.customerInfoChanged ||
    changes.shippingAddressChanged ||
    changes.billingAddressChanged
  ) {
    changedSections.push(`
      <div style="margin-bottom:18px;padding:18px;border:1px solid #e4ebe5;border-radius:14px;background:#fafcf9;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#89948d;margin-bottom:12px;">
          Order Information Updated
        </div>

        ${
          changes.customerInfoChanged
            ? `
              <div style="margin-bottom:8px;font-size:13px;color:#536158;">
                Your customer information has been updated.
              </div>
            `
            : ""
        }

        ${
          changes.shippingAddressChanged
            ? `
              <div style="margin-bottom:8px;font-size:13px;color:#536158;">
                Your shipping address has been updated.
              </div>
            `
            : ""
        }

        ${
          changes.billingAddressChanged
            ? `
              <div style="font-size:13px;color:#536158;">
                Your billing address has been updated.
              </div>
            `
            : ""
        }
      </div>
    `);
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Update #${escapeHtml(
    order.orderNumber
  )}</title>
</head>

<body style="margin:0;padding:0;background:#f5f7f4;font-family:Arial,Helvetica,sans-serif;color:#17231c;">

  <div style="padding:35px 15px;">

    <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e4ebe5;">

      <!-- HEADER -->

      <div style="background:#10291d;padding:34px 30px;">

        <div style="font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#c5dda8;">
          Seedra
        </div>

        <h1 style="margin:12px 0 0;font-size:27px;line-height:1.2;color:#ffffff;">
          Order Update
        </h1>

        <p style="margin:9px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,.55);">
          There has been an update to your order.
        </p>
      </div>

      <!-- CONTENT -->

      <div style="padding:30px;">

        <p style="margin:0 0 7px;font-size:15px;color:#536158;">
          Hi ${escapeHtml(customerName)},
        </p>

        <p style="margin:0 0 25px;font-size:14px;line-height:1.7;color:#718078;">
          Your order
          <strong style="color:#17231c;">
            #${escapeHtml(
              order.orderNumber
            )}
          </strong>
          has been updated.
        </p>

        ${changedSections.join("")}

        <div style="margin-top:25px;padding:20px;border-radius:16px;background:#edf3e9;">

          <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#315c42;">
            Order Total
          </div>

          <div style="margin-top:6px;font-size:23px;font-weight:700;color:#10291d;">
            ${mailerFormatPrice(
              order.total
            )}
          </div>

          <div style="margin-top:5px;font-size:11px;color:#718078;">
            Updated ${mailerFormatDateTime(
              order.updatedAt ||
                new Date()
            )}
          </div>

        </div>

        <div style="margin-top:28px;text-align:center;">

          <a
            href="${orderUrl}"
            style="display:inline-block;padding:14px 22px;border-radius:12px;background:#10291d;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;"
          >
            View Your Order
          </a>

        </div>

        <p style="margin:28px 0 0;font-size:11px;line-height:1.7;color:#9aa39e;text-align:center;">
          If you have any questions about your order, please contact our support team.
        </p>

      </div>

      <!-- FOOTER -->

      <div style="padding:20px 30px;background:#fafcf9;border-top:1px solid #edf1ed;text-align:center;">

        <p style="margin:0;font-size:11px;color:#9aa39e;">
          Thank you for choosing Seedra.
        </p>

      </div>

    </div>

  </div>

</body>
</html>
`;

  await transporter.sendMail({
    from: SMTP_FROM,
    to: customerEmail,
    subject: `Order #${order.orderNumber} has been updated`,
    html,
  });
}

