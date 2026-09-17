"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

type OrderItem = {
  id?: string;
  product?: string;
  variantId?: string;
  name: string;
  packSize?: string;
  sku?: string;
  price: number;
  quantity: number;
  image?: string;
};

type TrackingEvent = {
  status: string;
  note?: string;
  location?: string;
  createdAt: string;
};

type Order = {
  id: string;
  orderNumber: string;

  customerInfo: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };

  shippingAddress: {
    firstName?: string;
    lastName?: string;
    address: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };

  billingAddress?: {
    firstName?: string;
    lastName?: string;
    address: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };

  billingAddressSameAsShipping: boolean;

  items: OrderItem[];

  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;

  coupon?: {
    code: string;
    discount: number;
  };

  paymentMethod: string;
  paymentStatus: string;

  payment?: {
    transactionId?: string;
    gateway?: string;
    referenceNumber?: string;
    paidAt?: string;
    failureReason?: string;
  };

  orderStatus: string;

  shipping?: {
    courier?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };

  trackingHistory: TrackingEvent[];

  notes?: string;

  cancellation?: {
    reason?: string;
    cancelledBy?: string;
    cancelledAt?: string;
  };

  createdAt: string;
  updatedAt: string;
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{
    orderNumber: string;
  }>;
}) {
  const [order, setOrder] = useState<Order | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [orderNumber, setOrderNumber] =
    useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const { orderNumber } = await params;

        setOrderNumber(orderNumber);

        const response = await fetch(
          `/api/account/orders/${encodeURIComponent(
            orderNumber
          )}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(
            data.message ||
              "Unable to load this order."
          );

          return;
        }

        setOrder(data.order);
      } catch (error) {
        console.error(
          "ORDER DETAIL LOAD ERROR:",
          error
        );

        setError(
          "Something went wrong while loading this order."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [params]);

  if (loading) {
    return (
      <div className="rounded-[30px] border border-[#dfe3dc] bg-white p-8">
        <div className="animate-pulse space-y-5">
          <div className="h-5 w-32 rounded bg-[#edf0eb]" />
          <div className="h-10 w-64 rounded bg-[#edf0eb]" />
          <div className="h-32 rounded-[24px] bg-[#edf0eb]" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-[30px] border border-[#dfe3dc] bg-white px-6 py-16 text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8eeee] text-[#a05d5d]">
          <XCircle size={24} />
        </div>

        <h2 className="mt-5 font-serif text-3xl text-[#294b39]">
          Order not found
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8a928c]">
          {error ||
            "We couldn't find the order you're looking for."}
        </p>

        <Link
          href="/account/orders"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#294b39] px-6 py-3 text-xs font-semibold text-white"
        >
          <ArrowLeft size={14} />
          Back to orders
        </Link>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="rounded-[32px] bg-[#294b39] p-7 text-white sm:p-9">

        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/55 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to orders
        </Link>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-white/45">
              Order details
            </p>

            <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
              #{order.orderNumber}
            </h1>

            <p className="mt-2 text-xs text-white/50">
              Placed on{" "}
              {formatDate(order.createdAt)}
            </p>
          </div>

          <OrderStatus
            status={order.orderStatus}
            dark
          />

        </div>

      </section>

      {/* =================================================
          ORDER TRACKING
      ================================================= */}

      <section className="rounded-[30px] border border-[#dfe3dc] bg-white p-6 shadow-[0_18px_60px_rgba(34,58,45,0.04)] sm:p-8">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
            <Truck size={18} />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a928c]">
              Delivery
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#294b39]">
              Track your order
            </h2>
          </div>

        </div>

        <div className="mt-8">
          <TrackingTimeline
            currentStatus={order.orderStatus}
            history={order.trackingHistory}
          />
        </div>

        {order.shipping && (
          <div className="mt-8 grid gap-4 border-t border-[#edf0eb] pt-6 sm:grid-cols-3">

            {order.shipping.courier && (
              <InfoBox
                label="Courier"
                value={order.shipping.courier}
              />
            )}

            {order.shipping.trackingNumber && (
              <InfoBox
                label="Tracking number"
                value={
                  order.shipping.trackingNumber
                }
              />
            )}

            {order.shipping
              .estimatedDeliveryDate && (
              <InfoBox
                label="Estimated delivery"
                value={formatDate(
                  order.shipping
                    .estimatedDeliveryDate
                )}
              />
            )}

          </div>
        )}

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">

        {/* LEFT */}
        <div className="space-y-6">

          {/* ITEMS */}

          <section className="overflow-hidden rounded-[30px] border border-[#dfe3dc] bg-white shadow-[0_18px_60px_rgba(34,58,45,0.04)]">

            <div className="border-b border-[#edf0eb] px-6 py-6 sm:px-8">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a928c]">
                Your purchase
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[#294b39]">
                Order items
              </h2>

            </div>

            <div className="divide-y divide-[#edf0eb]">

              {order.items.map((item) => (
                <div
                  key={
                    item.id ||
                    `${item.name}-${item.quantity}`
                  }
                  className="flex gap-4 px-6 py-6 sm:px-8"
                >

                  {/* IMAGE */}

                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[18px] bg-[#f1f3ed] sm:h-24 sm:w-24">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#829087]">
                        <Package size={22} />
                      </div>
                    )}

                  </div>

                  {/* INFO */}

                  <div className="min-w-0 flex-1">

                    <h3 className="text-sm font-semibold text-[#294b39]">
                      {item.name}
                    </h3>

                    {item.packSize && (
                      <p className="mt-1 text-xs text-[#8a928c]">
                        {item.packSize}
                      </p>
                    )}

                    {item.sku && (
                      <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[#a0a7a1]">
                        SKU: {item.sku}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3">

                      <span className="rounded-full bg-[#f1f4ef] px-3 py-1 text-[10px] font-semibold text-[#52745d]">
                        Qty {item.quantity}
                      </span>

                      <span className="text-xs text-[#8a928c]">
                        PKR{" "}
                        {item.price.toLocaleString()}{" "}
                        each
                      </span>

                    </div>

                  </div>

                  {/* PRICE */}

                  <div className="shrink-0 text-right">

                    <p className="text-sm font-semibold text-[#294b39]">
                      PKR{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* SHIPPING ADDRESS */}

          <section className="rounded-[30px] border border-[#dfe3dc] bg-white p-6 shadow-[0_18px_60px_rgba(34,58,45,0.04)] sm:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
                <MapPin size={18} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a928c]">
                  Delivery address
                </p>

                <h2 className="mt-1 text-lg font-semibold text-[#294b39]">
                  Shipping information
                </h2>
              </div>

            </div>

            <AddressBlock
              address={order.shippingAddress}
            />

          </section>

          {/* CUSTOMER NOTE */}

          {order.notes && (
            <section className="rounded-[30px] border border-[#dfe3dc] bg-white p-6 sm:p-8">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a928c]">
                Order note
              </p>

              <p className="mt-3 text-sm leading-6 text-[#68766d]">
                {order.notes}
              </p>

            </section>
          )}

          {/* CANCELLATION */}

          {order.cancellation && (
            <section className="rounded-[30px] border border-[#ead8d5] bg-[#fff8f7] p-6 sm:p-8">

              <div className="flex items-center gap-3">

                <XCircle
                  size={18}
                  className="text-[#a05d5d]"
                />

                <h2 className="text-sm font-semibold text-[#7f514b]">
                  Order cancelled
                </h2>

              </div>

              {order.cancellation.reason && (
                <p className="mt-3 text-sm leading-6 text-[#8d6963]">
                  {order.cancellation.reason}
                </p>
              )}

              {order.cancellation
                .cancelledAt && (
                <p className="mt-2 text-xs text-[#aa8a84]">
                  Cancelled on{" "}
                  {formatDate(
                    order.cancellation
                      .cancelledAt
                  )}
                </p>
              )}

            </section>
          )}

        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          {/* ORDER SUMMARY */}

          <section className="rounded-[30px] border border-[#dfe3dc] bg-white p-6 shadow-[0_18px_60px_rgba(34,58,45,0.04)] sm:p-7">

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a928c]">
              Payment
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#294b39]">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">

              <SummaryRow
                label="Subtotal"
                value={`PKR ${order.subtotal.toLocaleString()}`}
              />

              {order.discount > 0 && (
                <SummaryRow
                  label="Discount"
                  value={`- PKR ${order.discount.toLocaleString()}`}
                  green
                />
              )}

              <SummaryRow
                label="Delivery"
                value={
                  order.deliveryCharge === 0
                    ? "Free"
                    : `PKR ${order.deliveryCharge.toLocaleString()}`
                }
              />

              <div className="border-t border-[#edf0eb] pt-4">

                <div className="flex items-center justify-between">

                  <span className="font-semibold text-[#294b39]">
                    Total
                  </span>

                  <span className="text-lg font-semibold text-[#294b39]">
                    PKR{" "}
                    {order.total.toLocaleString()}
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* PAYMENT INFO */}

          <section className="rounded-[30px] border border-[#dfe3dc] bg-white p-6 shadow-[0_18px_60px_rgba(34,58,45,0.04)] sm:p-7">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
                <CreditCard size={17} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a928c]">
                  Payment
                </p>

                <h2 className="mt-1 text-lg font-semibold text-[#294b39]">
                  Payment details
                </h2>
              </div>

            </div>

            <div className="mt-6 space-y-4">

              <InfoBox
                label="Method"
                value={formatPaymentMethod(
                  order.paymentMethod
                )}
              />

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9aa19b]">
                  Status
                </p>

                <div className="mt-2">
                  <PaymentStatus
                    status={
                      order.paymentStatus
                    }
                  />
                </div>
              </div>

              {order.payment?.gateway && (
                <InfoBox
                  label="Gateway"
                  value={
                    order.payment.gateway
                  }
                />
              )}

              {order.payment
                ?.referenceNumber && (
                <InfoBox
                  label="Reference"
                  value={
                    order.payment
                      .referenceNumber
                  }
                />
              )}

            </div>

          </section>

          {/* CUSTOMER */}

          <section className="rounded-[30px] border border-[#dfe3dc] bg-white p-6 shadow-[0_18px_60px_rgba(34,58,45,0.04)] sm:p-7">

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a928c]">
              Customer
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#294b39]">
              Contact information
            </h2>

            <div className="mt-5 space-y-2 text-sm text-[#68766d]">

              <p>
                {order.customerInfo.firstName}{" "}
                {order.customerInfo.lastName}
              </p>

              {order.customerInfo.email && (
                <p className="break-all text-xs">
                  {order.customerInfo.email}
                </p>
              )}

              <p className="text-xs">
                {order.customerInfo.phone}
              </p>

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   TRACKING TIMELINE
===================================================== */

function TrackingTimeline({
  currentStatus,
  history,
}: {
  currentStatus: string;
  history: TrackingEvent[];
}) {
  const steps = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];

  if (currentStatus === "cancelled") {
    return (
      <div className="rounded-[22px] border border-[#ead8d5] bg-[#fff8f7] p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6e8e5] text-[#a05d5d]">
            <XCircle size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#7f514b]">
              Order cancelled
            </p>

            <p className="mt-1 text-xs text-[#aa8a84]">
              This order will not be delivered.
            </p>
          </div>

        </div>

        {history.length > 0 && (
          <div className="mt-5 space-y-3 border-t border-[#f0dfdc] pt-5">

            {history.map((event, index) => (
              <TrackingHistoryItem
                key={`${event.status}-${index}`}
                event={event}
              />
            ))}

          </div>
        )}

      </div>
    );
  }

  const currentIndex =
    steps.indexOf(currentStatus);

  return (
    <div>

      <div className="hidden items-start justify-between md:flex">

        {steps.map((step, index) => {

          const completed =
            currentIndex >= index;

          const isCurrent =
            currentIndex === index;

          return (
            <div
              key={step}
              className="relative flex flex-1 flex-col items-center"
            >

              {index < steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-4 h-[2px] w-full ${
                    currentIndex > index
                      ? "bg-[#52745d]"
                      : "bg-[#e5e9e3]"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  completed
                    ? "border-[#52745d] bg-[#52745d] text-white"
                    : "border-[#dfe3dc] bg-white text-[#b0b7b1]"
                } ${
                  isCurrent
                    ? "ring-4 ring-[#edf2eb]"
                    : ""
                }`}
              >
                {completed ? (
                  <Check size={14} />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </div>

              <p
                className={`mt-3 text-center text-[10px] font-semibold ${
                  completed
                    ? "text-[#52745d]"
                    : "text-[#9aa19b]"
                }`}
              >
                {formatStatus(step)}
              </p>

            </div>
          );
        })}

      </div>

      {/* Mobile */}

      <div className="space-y-3 md:hidden">

        {steps.map((step, index) => {

          const completed =
            currentIndex >= index;

          return (
            <div
              key={step}
              className="flex items-center gap-3"
            >

              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  completed
                    ? "bg-[#52745d] text-white"
                    : "bg-[#edf0eb] text-[#a0a7a1]"
                }`}
              >
                {completed ? (
                  <Check size={14} />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </div>

              <span
                className={`text-xs font-semibold ${
                  completed
                    ? "text-[#52745d]"
                    : "text-[#9aa19b]"
                }`}
              >
                {formatStatus(step)}
              </span>

            </div>
          );
        })}

      </div>

      {/* Actual history */}

      {history.length > 0 && (
        <div className="mt-8 border-t border-[#edf0eb] pt-6">

          <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8a928c]">
            Order updates
          </p>

          <div className="space-y-4">

            {[...history]
              .reverse()
              .map((event, index) => (
                <TrackingHistoryItem
                  key={`${event.status}-${index}`}
                  event={event}
                />
              ))}

          </div>

        </div>
      )}

    </div>
  );
}

/* =====================================================
   TRACKING HISTORY ITEM
===================================================== */

function TrackingHistoryItem({
  event,
}: {
  event: TrackingEvent;
}) {
  return (
    <div className="flex gap-3">

      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
        <Check size={13} />
      </div>

      <div className="min-w-0">

        <div className="flex flex-wrap items-center gap-2">

          <p className="text-xs font-semibold text-[#294b39]">
            {formatStatus(event.status)}
          </p>

          <span className="text-[10px] text-[#a0a7a1]">
            {formatDateTime(
              event.createdAt
            )}
          </span>

        </div>

        {event.note && (
          <p className="mt-1 text-xs leading-5 text-[#68766d]">
            {event.note}
          </p>
        )}

        {event.location && (
          <p className="mt-1 text-[10px] text-[#9aa19b]">
            {event.location}
          </p>
        )}

      </div>

    </div>
  );
}

/* =====================================================
   ORDER STATUS
===================================================== */

function OrderStatus({
  status,
  dark = false,
}: {
  status: string;
  dark?: boolean;
}) {
  const config: Record<
    string,
    {
      label: string;
      icon: React.ReactNode;
    }
  > = {
    pending: {
      label: "Pending",
      icon: <Clock3 size={12} />,
    },

    confirmed: {
      label: "Confirmed",
      icon: <CheckCircle2 size={12} />,
    },

    processing: {
      label: "Processing",
      icon: <Package size={12} />,
    },

    shipped: {
      label: "Shipped",
      icon: <Truck size={12} />,
    },

    out_for_delivery: {
      label: "Out for delivery",
      icon: <Truck size={12} />,
    },

    delivered: {
      label: "Delivered",
      icon: <CheckCircle2 size={12} />,
    },

    cancelled: {
      label: "Cancelled",
      icon: <XCircle size={12} />,
    },
  };

  const current =
    config[status] || {
      label: formatStatus(status),
      icon: <Clock3 size={12} />,
    };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] ${
        dark
          ? "bg-white/10 text-white"
          : "bg-[#edf2eb] text-[#52745d]"
      }`}
    >
      {current.icon}
      {current.label}
    </span>
  );
}

/* =====================================================
   PAYMENT STATUS
===================================================== */

function PaymentStatus({
  status,
}: {
  status: string;
}) {
  const isPaid = status === "paid";
  const isFailed =
    status === "failed" ||
    status === "cancelled";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] ${
        isPaid
          ? "bg-[#eaf4eb] text-[#3f7650]"
          : isFailed
          ? "bg-[#fbeeee] text-[#a05d5d]"
          : "bg-[#fff7df] text-[#9a7418]"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

/* =====================================================
   ADDRESS
===================================================== */

function AddressBlock({
  address,
}: {
  address: Order["shippingAddress"];
}) {
  return (
    <div className="mt-6 rounded-[22px] bg-[#f7f8f4] p-5">

      {(address.firstName ||
        address.lastName) && (
        <p className="text-sm font-semibold text-[#294b39]">
          {address.firstName}{" "}
          {address.lastName}
        </p>
      )}

      <p className="mt-2 text-sm leading-6 text-[#68766d]">
        {address.address}

        {address.apartment && (
          <>
            <br />
            {address.apartment}
          </>
        )}

        <br />

        {address.city}

        {address.state && (
          <>
            , {address.state}
          </>
        )}

        {address.postalCode && (
          <>
            {" "}
            {address.postalCode}
          </>
        )}

        {address.country && (
          <>
            <br />
            {address.country}
          </>
        )}
      </p>

      {address.phone && (
        <p className="mt-3 text-xs text-[#8a928c]">
          Phone: {address.phone}
        </p>
      )}

    </div>
  );
}

/* =====================================================
   SUMMARY ROW
===================================================== */

function SummaryRow({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-xs text-[#8a928c]">
        {label}
      </span>

      <span
        className={`text-sm font-medium ${
          green
            ? "text-[#52745d]"
            : "text-[#294b39]"
        }`}
      >
        {value}
      </span>

    </div>
  );
}

/* =====================================================
   INFO BOX
===================================================== */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9aa19b]">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-[#294b39]">
        {value}
      </p>

    </div>
  );
}

/* =====================================================
   HELPERS
===================================================== */

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatPaymentMethod(method: string) {
  const methods: Record<string, string> = {
    cod: "Cash on Delivery",
    card: "Card",
    bank_transfer: "Bank Transfer",
    jazzcash: "JazzCash",
    easypaisa: "Easypaisa",
  };

  return (
    methods[method] ||
    formatStatus(method)
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-PK",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString(
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