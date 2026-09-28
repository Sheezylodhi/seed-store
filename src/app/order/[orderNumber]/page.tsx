import crypto from "crypto";
import Link from "next/link";

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    orderNumber: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

function hashGuestAccessToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function formatPKR(amount: number) {
  return `PKR ${Number(amount || 0).toLocaleString()}`;
}

function formatDate(date: Date | string | undefined) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString(
    "en-PK",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function formatDateTime(
  date: Date | string | undefined
) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleString(
    "en-PK",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Order Placed";

    case "confirmed":
      return "Confirmed";

    case "processing":
      return "Processing";

    case "shipped":
      return "Shipped";

    case "out_for_delivery":
      return "Out for Delivery";

    case "delivered":
      return "Delivered";

    case "cancelled":
      return "Cancelled";

    default:
      return status
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        );
  }
}

function getStatusDescription(status: string) {
  switch (status) {
    case "pending":
      return "Your order has been received and is waiting for confirmation.";

    case "confirmed":
      return "Your order has been confirmed and will be prepared shortly.";

    case "processing":
      return "Your order is being prepared for dispatch.";

    case "shipped":
      return "Your order has been handed over to the courier.";

    case "out_for_delivery":
      return "Your order is on its way to you.";

    case "delivered":
      return "Your order has been delivered successfully.";

    case "cancelled":
      return "This order has been cancelled.";

    default:
      return "Your order is being processed.";
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "delivered":
      return {
        wrapper:
          "bg-emerald-50 border-emerald-200",
        icon:
          "bg-emerald-700 text-white",
        text:
          "text-emerald-800",
      };

    case "cancelled":
      return {
        wrapper:
          "bg-red-50 border-red-200",
        icon:
          "bg-red-600 text-white",
        text:
          "text-red-800",
      };

    case "shipped":
    case "out_for_delivery":
      return {
        wrapper:
          "bg-blue-50 border-blue-200",
        icon:
          "bg-blue-700 text-white",
        text:
          "text-blue-800",
      };

    default:
      return {
        wrapper:
          "bg-[#f1f5f0] border-[#dce6de]",
        icon:
          "bg-[#234636] text-white",
        text:
          "text-[#234636]",
      };
  }
}

export default async function GuestOrderPage({
  params,
  searchParams,
}: PageProps) {
  try {
    await connectDB();

    const { orderNumber } = await params;
    const { token } = await searchParams;

    /*
    |--------------------------------------------------------------------------
    | TOKEN VALIDATION
    |--------------------------------------------------------------------------
    */

    const cleanToken =
      typeof token === "string"
        ? token.trim()
        : "";

    if (
      !cleanToken ||
      cleanToken.length < 32
    ) {
      return <InvalidOrderLink />;
    }

    /*
    |--------------------------------------------------------------------------
    | HASH TOKEN
    |--------------------------------------------------------------------------
    */

    const tokenHash =
      hashGuestAccessToken(
        cleanToken
      );

    /*
    |--------------------------------------------------------------------------
    | FIND GUEST ORDER
    |--------------------------------------------------------------------------
    |
    | Only guest orders with:
    | - matching order number
    | - matching token hash
    | - unexpired token
    |
    | can be viewed here.
    |
    */

    const order =
      await Order.findOne({
        orderNumber,

        guestAccessTokenHash:
          tokenHash,

        guestAccessTokenExpiresAt: {
          $gt: new Date(),
        },
      })
        .select(
          "-guestAccessTokenHash -guestAccessTokenExpiresAt -adminNotes"
        )
        .lean();

    if (!order) {
      return <InvalidOrderLink expired />;
    }

    /*
    |--------------------------------------------------------------------------
    | SAFE DATA
    |--------------------------------------------------------------------------
    */

    const currentStatus =
      order.orderStatus ||
      "pending";

    const statusClasses =
      getStatusClasses(
        currentStatus
      );

    const trackingHistory =
      Array.isArray(
        order.trackingHistory
      )
        ? order.trackingHistory
        : [];

    return (
      <main className="min-h-screen bg-[#f8f6ef] text-[#17271f]">
        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}

        <header className="border-b border-[#dfe6df] bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
            <Link
              href="/"
              className="group"
            >
              <div className="text-xl font-semibold tracking-[-0.03em] text-[#234636]">
                Seedra
              </div>

              <div className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-[#747970]">
                Wellness Seeds
              </div>
            </Link>

            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#747970]">
                Guest Order
              </p>

              <p className="mt-1 text-sm font-semibold text-[#234636]">
                {order.orderNumber}
              </p>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* CONTENT */}
        {/* ================================================================ */}

        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
          {/* ============================================================ */}
          {/* ORDER HEADER */}
          {/* ============================================================ */}

          <section className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm text-[#747970]">
              <Link
                href="/"
                className="transition hover:text-[#234636]"
              >
                Home
              </Link>

              <span>/</span>

              <span>Order Tracking</span>
            </div>

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#747970]">
                  Thank you for your order
                </p>

                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#234636] sm:text-4xl">
                  Order {order.orderNumber}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687169]">
                  You can use this secure page to
                  view your order details and track
                  its progress without signing in.
                </p>
              </div>

              <div className="shrink-0">
                <p className="text-right text-xs text-[#747970]">
                  Order placed
                </p>

                <p className="mt-1 text-sm font-medium text-[#234636]">
                  {formatDate(
                    order.createdAt
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* STATUS CARD */}
          {/* ============================================================ */}

          <section
            className={`mb-8 rounded-3xl border p-6 sm:p-8 ${statusClasses.wrapper}`}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${statusClasses.icon}`}
              >
                {currentStatus ===
                "delivered" ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M5 12.5 9.5 17 19 7.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : currentStatus ===
                  "cancelled" ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="m7 7 10 10M17 7 7 17"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M12 7v5l3 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                    />
                  </svg>
                )}
              </div>

              <div>
                <p
                  className={`text-xl font-semibold ${statusClasses.text}`}
                >
                  {getStatusLabel(
                    currentStatus
                  )}
                </p>

                <p
                  className={`mt-1 text-sm leading-6 ${statusClasses.text} opacity-80`}
                >
                  {getStatusDescription(
                    currentStatus
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* TRACKING TIMELINE */}
          {/* ============================================================ */}

          {trackingHistory.length >
            0 && (
            <section className="mb-8 rounded-3xl border border-[#dfe6df] bg-white p-6 shadow-[0_12px_40px_rgba(35,70,54,0.04)] sm:p-8">
              <div className="mb-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#747970]">
                  Order progress
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#234636]">
                  Tracking updates
                </h2>
              </div>

              <div className="space-y-0">
                {trackingHistory.map(
                  (
                    history: any,
                    index: number
                  ) => {
                    const isLast =
                      index ===
                      trackingHistory.length -
                        1;

                    return (
                      <div
                        key={`${history.status}-${history.createdAt}-${index}`}
                        className="relative flex gap-4 pb-7 last:pb-0"
                      >
                        {!isLast && (
                          <div className="absolute left-[15px] top-8 h-[calc(100%-12px)] w-px bg-[#dfe6df]" />
                        )}

                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            index ===
                            0
                              ? "bg-[#234636] text-white"
                              : "border border-[#d7e1d9] bg-[#f8f6ef] text-[#234636]"
                          }`}
                        >
                          {index ===
                          0 ? (
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                d="M5 12.5 9.5 17 19 7.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                            <p className="text-sm font-semibold text-[#234636]">
                              {getStatusLabel(
                                history.status
                              )}
                            </p>

                            <p className="text-xs text-[#8a908b]">
                              {formatDateTime(
                                history.createdAt
                              )}
                            </p>
                          </div>

                          {history.note && (
                            <p className="mt-1 text-sm leading-6 text-[#687169]">
                              {
                                history.note
                              }
                            </p>
                          )}

                          {history.location && (
                            <p className="mt-1 text-xs text-[#8a908b]">
                              {history.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* ============================================================ */}
          {/* TWO COLUMN */}
          {/* ============================================================ */}

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* ========================================================== */}
            {/* LEFT */}
            {/* ========================================================== */}

            <div className="space-y-8">
              {/* ======================================================== */}
              {/* ITEMS */}
              {/* ======================================================== */}

              <section className="rounded-3xl border border-[#dfe6df] bg-white p-6 shadow-[0_12px_40px_rgba(35,70,54,0.04)] sm:p-8">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#747970]">
                      Your purchase
                    </p>

                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#234636]">
                      Order items
                    </h2>
                  </div>

                  <p className="text-sm text-[#747970]">
                    {order.items?.length ||
                      0}{" "}
                    {order.items?.length ===
                    1
                      ? "item"
                      : "items"}
                  </p>
                </div>

                <div className="divide-y divide-[#edf0ed]">
                  {(order.items ||
                    []
                  ).map(
                    (
                      item: any,
                      index: number
                    ) => (
                      <div
                        key={
                          item._id
                            ? String(
                                item._id
                              )
                            : `${item.name}-${index}`
                        }
                        className="flex gap-4 py-5 first:pt-0 last:pb-0"
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f4f5ef]">
                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#9aa39b]">
                              <svg
                                viewBox="0 0 24 24"
                                className="h-7 w-7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="8"
                                />

                                <path d="M8 12h8M12 8v8" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row">
                            <div>
                              <h3 className="text-sm font-semibold text-[#234636]">
                                {
                                  item.name
                                }
                              </h3>

                              {item.packSize && (
                                <p className="mt-1 text-xs text-[#747970]">
                                  {
                                    item.packSize
                                  }
                                </p>
                              )}

                              {item.sku && (
                                <p className="mt-1 text-[11px] text-[#969c97]">
                                  SKU:{" "}
                                  {
                                    item.sku
                                  }
                                </p>
                              )}
                            </div>

                            <p className="text-sm font-semibold text-[#234636]">
                              {formatPKR(
                                Number(
                                  item.price ||
                                    0
                                ) *
                                  Number(
                                    item.quantity ||
                                      0
                                  )
                              )}
                            </p>
                          </div>

                          <p className="mt-2 text-xs text-[#747970]">
                            {formatPKR(
                              Number(
                                item.price ||
                                  0
                              )
                            )}{" "}
                            ×{" "}
                            {Number(
                              item.quantity ||
                                0
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>

              {/* ======================================================== */}
              {/* SHIPPING */}
              {/* ======================================================== */}

              <section className="rounded-3xl border border-[#dfe6df] bg-white p-6 shadow-[0_12px_40px_rgba(35,70,54,0.04)] sm:p-8">
                <div className="mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#747970]">
                    Delivery
                  </p>

                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#234636]">
                    Shipping details
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8a908b]">
                      Customer
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#234636]">
                      {
                        order
                          .customerInfo
                          ?.firstName
                      }{" "}
                      {
                        order
                          .customerInfo
                          ?.lastName
                      }
                    </p>

                    {order.customerInfo
                      ?.email && (
                      <p className="mt-1 break-all text-sm text-[#687169]">
                        {
                          order
                            .customerInfo
                            .email
                        }
                      </p>
                    )}

                    {order.customerInfo
                      ?.phone && (
                      <p className="mt-1 text-sm text-[#687169]">
                        {
                          order
                            .customerInfo
                            .phone
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8a908b]">
                      Shipping address
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#234636]">
                      {
                        order
                          .shippingAddress
                          ?.firstName
                      }{" "}
                      {
                        order
                          .shippingAddress
                          ?.lastName
                      }
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#687169]">
                      {
                        order
                          .shippingAddress
                          ?.address
                      }

                      {order
                        .shippingAddress
                        ?.apartment && (
                        <>
                          <br />
                          {
                            order
                              .shippingAddress
                              .apartment
                          }
                        </>
                      )}

                      <br />

                      {
                        order
                          .shippingAddress
                          ?.city
                      }

                      {order
                        .shippingAddress
                        ?.postalCode && (
                        <>
                          ,{" "}
                          {
                            order
                              .shippingAddress
                              .postalCode
                          }
                        </>
                      )}

                      <br />

                      {
                        order
                          .shippingAddress
                          ?.country
                      }
                    </p>
                  </div>
                </div>

                {/* ====================================================== */}
                {/* COURIER */}
                {/* ====================================================== */}

                {order.shipping && (
                  <div className="mt-7 border-t border-[#edf0ed] pt-6">
                    <div className="grid gap-5 sm:grid-cols-3">
                      {order.shipping
                        .courier && (
                        <div>
                          <p className="text-xs text-[#8a908b]">
                            Courier
                          </p>

                          <p className="mt-1 text-sm font-medium text-[#234636]">
                            {
                              order
                                .shipping
                                .courier
                            }
                          </p>
                        </div>
                      )}

                      {order.shipping
                        .trackingNumber && (
                        <div>
                          <p className="text-xs text-[#8a908b]">
                            Tracking number
                          </p>

                          <p className="mt-1 break-all text-sm font-medium text-[#234636]">
                            {
                              order
                                .shipping
                                .trackingNumber
                            }
                          </p>
                        </div>
                      )}

                      {order.shipping
                        .estimatedDeliveryDate && (
                        <div>
                          <p className="text-xs text-[#8a908b]">
                            Estimated delivery
                          </p>

                          <p className="mt-1 text-sm font-medium text-[#234636]">
                            {formatDate(
                              order
                                .shipping
                                .estimatedDeliveryDate
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* ======================================================== */}
              {/* NOTE */}
              {/* ======================================================== */}

              {order.notes && (
                <section className="rounded-3xl border border-[#dfe6df] bg-white p-6 shadow-[0_12px_40px_rgba(35,70,54,0.04)] sm:p-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#747970]">
                    Order note
                  </p>

                  <p className="mt-3 text-sm leading-7 text-[#687169]">
                    {order.notes}
                  </p>
                </section>
              )}
            </div>

            {/* ========================================================== */}
            {/* RIGHT / SUMMARY */}
            {/* ========================================================== */}

            <aside className="lg:sticky lg:top-6 lg:self-start">
              <section className="rounded-3xl bg-[#234636] p-6 text-white shadow-[0_20px_60px_rgba(35,70,54,0.15)] sm:p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                  Order summary
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                  Payment details
                </h2>

                <div className="mt-7 space-y-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-white/65">
                      Subtotal
                    </span>

                    <span className="font-medium">
                      {formatPKR(
                        Number(
                          order.subtotal ||
                            0
                        )
                      )}
                    </span>
                  </div>

                  {Number(
                    order.discount || 0
                  ) > 0 && (
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-white/65">
                        Discount
                      </span>

                      <span className="font-medium text-[#dcebdc]">
                        -
                        {formatPKR(
                          Number(
                            order.discount ||
                              0
                          )
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-white/65">
                      Delivery
                    </span>

                    <span className="font-medium">
                      {Number(
                        order.deliveryCharge ||
                          0
                      ) > 0
                        ? formatPKR(
                            Number(
                              order.deliveryCharge ||
                                0
                            )
                          )
                        : "Free"}
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-sm text-white/65">
                        Total
                      </span>

                      <span className="text-2xl font-semibold tracking-[-0.03em]">
                        {formatPKR(
                          Number(
                            order.total ||
                              0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ====================================================== */}
                {/* PAYMENT */}
                {/* ====================================================== */}

                <div className="mt-7 rounded-2xl bg-white/8 p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                    Payment method
                  </p>

                  <p className="mt-2 text-sm font-medium capitalize">
                    {String(
                      order.paymentMethod ||
                        "cod"
                    ).replace(
                      /_/g,
                      " "
                    )}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-white/50">
                      Payment status
                    </span>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium capitalize">
                      {String(
                        order.paymentStatus ||
                          "pending"
                      ).replace(
                        /_/g,
                        " "
                      )}
                    </span>
                  </div>
                </div>

                {/* ====================================================== */}
                {/* GUEST NOTICE */}
                {/* ====================================================== */}

                <div className="mt-5 flex gap-3 border-t border-white/10 pt-5">
                  <div className="mt-0.5 shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 text-white/60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <rect
                        x="4"
                        y="10"
                        width="16"
                        height="10"
                        rx="2"
                      />

                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </div>

                  <p className="text-[11px] leading-5 text-white/50">
                    This is your secure guest
                    order page. Keep the order
                    link from your email safe.
                  </p>
                </div>
              </section>

              {/* ====================================================== */}
              {/* BACK HOME */}
              {/* ====================================================== */}

              <Link
                href="/"
                className="mt-4 flex w-full items-center justify-center rounded-2xl border border-[#dfe6df] bg-white px-5 py-3.5 text-sm font-medium text-[#234636] transition hover:border-[#234636] hover:bg-[#f8f6ef]"
              >
                Continue shopping
              </Link>
            </aside>
          </div>

          {/* ============================================================ */}
          {/* FOOTER NOTE */}
          {/* ============================================================ */}

          <div className="mt-10 border-t border-[#dfe6df] pt-7 text-center">
            <p className="text-xs leading-5 text-[#8a908b]">
              Need help with your order? Contact
              Seedra support and mention your order
              number{" "}
              <span className="font-medium text-[#234636]">
                {order.orderNumber}
              </span>
              .
            </p>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error(
      "GUEST ORDER PAGE ERROR:",
      error
    );

    return <InvalidOrderLink />;
  }
}

/*
|--------------------------------------------------------------------------
| INVALID / EXPIRED LINK
|--------------------------------------------------------------------------
*/

function InvalidOrderLink({
  expired = false,
}: {
  expired?: boolean;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6ef] px-5 py-12">
      <div className="w-full max-w-md text-center">
        <Link
          href="/"
          className="inline-block text-2xl font-semibold tracking-[-0.04em] text-[#234636]"
        >
          Seedra
        </Link>

        <div className="mt-10 rounded-3xl border border-[#dfe6df] bg-white p-8 shadow-[0_20px_60px_rgba(35,70,54,0.06)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f1f5f0] text-[#234636]">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <rect
                x="4"
                y="10"
                width="16"
                height="10"
                rx="2"
              />

              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-[#234636]">
            {expired
              ? "Order link expired"
              : "Invalid order link"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#687169]">
            {expired
              ? "This guest order link is no longer valid. Please use the latest order email or contact support for assistance."
              : "This order link is incomplete or invalid. Please open the tracking link directly from your Seedra order email."}
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center justify-center rounded-2xl bg-[#234636] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#315c45]"
          >
            Back to Seedra
          </Link>
        </div>
      </div>
    </main>
  );
}