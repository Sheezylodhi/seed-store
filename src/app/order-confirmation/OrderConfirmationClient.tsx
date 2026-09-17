"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Home,
  Loader2,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

type OrderItem = {
  product: string;
  variantId?: string;
  name: string;
  packSize?: string;
  sku?: string;
  price: number;
  quantity: number;
  image?: string;
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
    gateway?: string;
    screenshotUrl?: string;
    submittedAt?: string;
    paidAt?: string;
  };

  orderStatus: string;

  trackingHistory: {
    status: string;
    note?: string;
    location?: string;
    createdAt: string;
  }[];

  notes?: string;

  createdAt: string;
};

const statusSteps = [
  {
    key: "pending",
    label: "Order placed",
    description: "We've received your order.",
    icon: Check,
  },
  {
    key: "confirmed",
    label: "Order confirmed",
    description: "Your order has been confirmed.",
    icon: Check,
  },
  {
    key: "processing",
    label: "Being prepared",
    description: "Your seeds are being carefully packed.",
    icon: Package,
  },
  {
    key: "shipped",
    label: "On the way",
    description: "Your order has left our facility.",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Your order has arrived.",
    icon: Check,
  },
];

function formatCurrency(value: number) {
  return `PKR ${Number(value || 0).toLocaleString()}`;
}

function formatDate(date: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-PK", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Only converts the database value into a customer-friendly label.
 * The actual payment method always comes from order.paymentMethod.
 */
function getPaymentMethodLabel(method: string) {
  switch (method) {
    case "cod":
      return "Cash on Delivery";

    case "bank_transfer":
      return "Bank Transfer";

    case "jazzcash":
      return "JazzCash";

    case "easypaisa":
      return "Easypaisa";

    case "card":
      return "Card Payment";

    default:
      return method
        ? method
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "Payment";
  }
}

function isManualPayment(method: string) {
  return ["bank_transfer", "jazzcash", "easypaisa"].includes(method);
}

function getPaymentStatusLabel(
  paymentMethod: string,
  paymentStatus: string
) {
  if (paymentStatus === "paid") {
    return "Payment confirmed";
  }

  if (paymentStatus === "failed") {
    return "Payment failed";
  }

  if (paymentStatus === "cancelled") {
    return "Payment cancelled";
  }

  if (paymentStatus === "refunded") {
    return "Payment refunded";
  }

  if (paymentMethod === "cod") {
    return "Payment due on delivery";
  }

  if (isManualPayment(paymentMethod)) {
    return "Verification pending";
  }

  return "Payment pending";
}

function getPaymentDescription(order: Order) {
  const method = order.paymentMethod;
  const status = order.paymentStatus;

  if (status === "paid") {
    return (
      <>
        Your payment of{" "}
        <strong className="font-semibold text-[#43564b]">
          {formatCurrency(order.total)}
        </strong>{" "}
        has been verified successfully. Thank you for completing your
        payment.
      </>
    );
  }

  if (status === "failed") {
    return (
      <>
        We couldn't verify the payment for this order yet. Our team may
        contact you if any additional information is required.
      </>
    );
  }

  if (status === "cancelled") {
    return (
      <>
        This payment has been cancelled. Please contact us if you need
        assistance with this order.
      </>
    );
  }

  if (method === "cod") {
    return (
      <>
        No payment has been taken online. Your total of{" "}
        <strong className="font-semibold text-[#43564b]">
          {formatCurrency(order.total)}
        </strong>{" "}
        will be collected when your order arrives.
      </>
    );
  }

  if (isManualPayment(method)) {
    return (
      <>
        We've received your payment proof. Your payment will remain
        pending until our team verifies the submitted screenshot.
      </>
    );
  }

  return (
    <>
      Your selected payment method is{" "}
      <strong className="font-semibold text-[#43564b]">
        {getPaymentMethodLabel(method)}
      </strong>
      .
    </>
  );
}

function getStatusIndex(status: string) {
  const index = statusSteps.findIndex(
    (step) => step.key === status
  );

  if (index !== -1) return index;

  if (status === "out_for_delivery") {
    return 3;
  }

  return 0;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();

  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderNumber) {
      setError("No order number was provided.");
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/orders?order=${encodeURIComponent(orderNumber)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load your order."
          );
        }

        setOrder(data.order);
      } catch (error) {
        console.error("Order confirmation error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderNumber]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !order) {
    return <ErrorState message={error} />;
  }

  const currentStatusIndex = getStatusIndex(order.orderStatus);

  const itemCount = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const paymentMethodLabel = getPaymentMethodLabel(
    order.paymentMethod
  );

  const paymentStatusLabel = getPaymentStatusLabel(
    order.paymentMethod,
    order.paymentStatus
  );

  const manualPayment = isManualPayment(order.paymentMethod);

  return (
    <main className="min-h-screen bg-[#f7f5ee] text-[#20352a]">
      {/* HEADER */}

      <header className="border-b border-[#dfdfd6] bg-[#f7f5ee]/95">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-[-0.04em] text-[#203f30]"
          >
            Seed<span className="italic text-[#52745d]">Store</span>
          </Link>

          <Link
            href="/shop"
            className="group hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#45634f] transition hover:text-[#203f30] sm:flex"
          >
            Continue shopping

            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </header>

      {/* MAIN */}

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1180px]">
          {/* Breadcrumb */}

          <div className="mb-8 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#899089]">
            <span>Checkout</span>

            <ChevronRight size={12} />

            <span className="text-[#52745d]">
              Order confirmed
            </span>
          </div>

          {/* HERO */}

          <div className="relative overflow-hidden rounded-[34px] border border-[#d9dfd8] bg-[#203f30] px-6 py-10 text-white shadow-[0_25px_80px_rgba(31,61,46,0.12)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <div className="pointer-events-none absolute -right-28 -top-36 h-[420px] w-[420px] rounded-full border border-white/[0.07]" />

            <div className="pointer-events-none absolute -right-10 -top-20 h-[300px] w-[300px] rounded-full border border-white/[0.05]" />

            <div className="pointer-events-none absolute -bottom-40 -left-20 h-[300px] w-[300px] rounded-full bg-white/[0.025] blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#294b39]">
                    <Check
                      size={20}
                      strokeWidth={2.4}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/45">
                      Order successfully placed
                    </p>

                    <p className="mt-1 text-xs font-medium text-white/75">
                      Thank you for choosing SeedStore.
                    </p>
                  </div>
                </div>

                <h1 className="mt-9 max-w-2xl font-serif text-4xl leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-[58px]">
                  Your order is
                  <span className="block italic text-[#b9cbbd]">
                    officially in.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">
                  We've received everything we need. We'll
                  carefully prepare your order and contact you
                  before dispatch.
                </p>
              </div>

              {/* ORDER NUMBER */}

              <div className="min-w-[230px] rounded-[24px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-sm lg:text-right">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Order number
                </p>

                <p className="mt-3 break-all font-mono text-lg font-semibold tracking-[0.04em] text-white">
                  {order.orderNumber}
                </p>

                <div className="mt-5 flex items-center gap-2 text-[10px] text-white/45 lg:justify-end">
                  <Clock3 size={13} />

                  {formatDate(order.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* ORDER PROGRESS */}

          <section className="mt-6 rounded-[30px] border border-[#dfe3dc] bg-white p-6 shadow-[0_18px_60px_rgba(34,58,45,0.05)] sm:p-8 lg:p-10">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8a928c]">
                  Order journey
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#20352a]">
                  We're taking it from here.
                </h2>
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#52745d]">
                {order.orderStatus.replaceAll("_", " ")}
              </span>
            </div>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute left-[8%] right-[8%] top-5 hidden h-px bg-[#e3e7e2] sm:block" />

                <div
                  className="absolute left-[8%] top-5 hidden h-px bg-[#52745d] transition-all sm:block"
                  style={{
                    width: `${
                      currentStatusIndex === 0
                        ? 0
                        : (currentStatusIndex /
                            (statusSteps.length - 1)) *
                          84
                    }%`,
                  }}
                />

                <div className="grid gap-6 sm:grid-cols-5">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;

                    const completed =
                      index <= currentStatusIndex;

                    const active =
                      index === currentStatusIndex;

                    return (
                      <div
                        key={step.key}
                        className="relative flex items-center gap-4 sm:flex-col sm:text-center"
                      >
                        <div
                          className={[
                            "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition",
                            completed
                              ? "border-[#52745d] bg-[#52745d] text-white"
                              : "border-[#dce1dc] bg-[#fafbf9] text-[#a0a8a1]",
                            active
                              ? "ring-4 ring-[#52745d]/10"
                              : "",
                          ].join(" ")}
                        >
                          <Icon
                            size={16}
                            strokeWidth={2}
                          />
                        </div>

                        <div>
                          <p
                            className={[
                              "text-xs font-semibold",
                              completed
                                ? "text-[#20352a]"
                                : "text-[#8b938d]",
                            ].join(" ")}
                          >
                            {step.label}
                          </p>

                          <p className="mt-1 text-[10px] leading-5 text-[#8a928c] sm:mx-auto sm:max-w-[150px]">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* CONTENT GRID */}

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_390px]">
            {/* LEFT */}

            <div className="space-y-6">
              {/* ITEMS */}

              <section className="overflow-hidden rounded-[30px] border border-[#dfe3dc] bg-white shadow-[0_18px_60px_rgba(34,58,45,0.04)]">
                <div className="flex items-center justify-between border-b border-[#edf0eb] px-6 py-6 sm:px-8">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a928c]">
                      Your purchase
                    </p>

                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em]">
                      {itemCount}{" "}
                      {itemCount === 1 ? "item" : "items"}
                    </h2>
                  </div>

                  <ShoppingBag
                    size={19}
                    strokeWidth={1.5}
                    className="text-[#52745d]"
                  />
                </div>

                <div className="divide-y divide-[#edf0eb]">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.product}-${item.variantId || index}`}
                      className="flex gap-4 px-6 py-6 sm:px-8"
                    >
                      <div className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-[18px] bg-[#f2f3ed]">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="82px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package
                              size={20}
                              className="text-[#91a096]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row">
                          <div>
                            <h3 className="text-sm font-semibold leading-5 text-[#26382e]">
                              {item.name}
                            </h3>

                            {item.packSize && (
                              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8b948d]">
                                {item.packSize}
                              </p>
                            )}
                          </div>

                          <p className="text-sm font-semibold text-[#294b39]">
                            {formatCurrency(
                              item.price * item.quantity
                            )}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-[10px] text-[#8a928c]">
                          <span>
                            Qty{" "}
                            <strong className="text-[#4d5d53]">
                              {item.quantity}
                            </strong>
                          </span>

                          <span className="h-1 w-1 rounded-full bg-[#c5cbc5]" />

                          <span>
                            {formatCurrency(item.price)} each
                          </span>

                          {item.sku && (
                            <>
                              <span className="hidden h-1 w-1 rounded-full bg-[#c5cbc5] sm:block" />

                              <span className="hidden sm:block">
                                SKU {item.sku}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* DELIVERY DETAILS */}

              <section className="rounded-[30px] border border-[#dfe3dc] bg-white p-6 shadow-[0_18px_60px_rgba(34,58,45,0.04)] sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
                    <MapPin size={17} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a928c]">
                      Delivery
                    </p>

                    <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em]">
                      Shipping details
                    </h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#949b95]">
                      Recipient
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#304238]">
                      {order.customerInfo.firstName}{" "}
                      {order.customerInfo.lastName}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs text-[#7b847d]">
                      <Phone size={13} />

                      {order.customerInfo.phone}
                    </div>

                    {order.customerInfo.email && (
                      <p className="mt-2 break-all text-xs text-[#7b847d]">
                        {order.customerInfo.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#949b95]">
                      Address
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#536159]">
                      {order.shippingAddress.address}

                      {order.shippingAddress.apartment && (
                        <>
                          <br />
                          {order.shippingAddress.apartment}
                        </>
                      )}

                      <br />
                      {order.shippingAddress.city}

                      {order.shippingAddress.postalCode &&
                        `, ${order.shippingAddress.postalCode}`}
                    </p>
                  </div>
                </div>
              </section>

              {/* PAYMENT */}

              <section className="rounded-[30px] border border-[#dfe3dc] bg-white p-6 shadow-[0_18px_60px_rgba(34,58,45,0.04)] sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
                      <ShieldCheck size={18} />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a928c]">
                        Payment
                      </p>

                      <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em]">
                        {paymentMethodLabel}
                      </h2>
                    </div>
                  </div>

                  <span
                    className={[
                      "inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-[0.14em]",
                      order.paymentStatus === "paid"
                        ? "bg-[#edf3ed] text-[#52745d]"
                        : order.paymentStatus === "failed" ||
                          order.paymentStatus === "cancelled"
                        ? "bg-[#f6ece8] text-[#9b6654]"
                        : "bg-[#f4f0e5] text-[#8b7650]",
                    ].join(" ")}
                  >
                    {order.paymentStatus === "paid" ? (
                      <Check size={12} />
                    ) : (
                      <Clock3 size={12} />
                    )}

                    {paymentStatusLabel}
                  </span>
                </div>

                <p className="mt-6 max-w-2xl text-xs leading-6 text-[#7b847d]">
                  {getPaymentDescription(order)}
                </p>

                {manualPayment &&
                  order.paymentStatus !== "paid" &&
                  order.paymentStatus !== "failed" &&
                  order.paymentStatus !== "cancelled" && (
                    <div className="mt-6 rounded-[20px] border border-[#e2e7e1] bg-[#f8faf7] p-5">
                      <div className="flex gap-3">
                        <Clock3
                          size={17}
                          className="mt-0.5 shrink-0 text-[#52745d]"
                        />

                        <div>
                          <p className="text-xs font-semibold text-[#3d5045]">
                            Payment verification in progress
                          </p>

                          <p className="mt-2 text-[10px] leading-5 text-[#7d877f]">
                            Your payment screenshot has been
                            submitted successfully. Our team will
                            verify it before marking the payment as
                            paid.
                          </p>

                          {order.payment?.submittedAt && (
                            <p className="mt-3 text-[10px] font-medium text-[#8a928c]">
                              Proof submitted{" "}
                              {formatDate(
                                order.payment.submittedAt
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              </section>
            </div>

            {/* RIGHT — SUMMARY */}

            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className="overflow-hidden rounded-[30px] border border-[#d8dfd7] bg-white shadow-[0_22px_70px_rgba(34,58,45,0.08)]">
                <div className="bg-[#294b39] px-6 py-7 text-white sm:px-7">
                  <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-white/45">
                    Order total
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-5">
                    <p className="text-3xl font-semibold tracking-[-0.05em]">
                      {formatCurrency(order.total)}
                    </p>

                    <span className="pb-1 text-right text-[9px] font-semibold uppercase tracking-[0.13em] text-white/45">
                      {paymentMethodLabel}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="space-y-4">
                    <SummaryRow
                      label="Subtotal"
                      value={formatCurrency(order.subtotal)}
                    />

                    {order.discount > 0 && (
                      <SummaryRow
                        label={
                          order.coupon?.code
                            ? `Discount (${order.coupon.code})`
                            : "Discount"
                        }
                        value={`− ${formatCurrency(
                          order.discount
                        )}`}
                        positive
                      />
                    )}

                    <SummaryRow
                      label="Delivery"
                      value={
                        order.deliveryCharge === 0
                          ? "FREE"
                          : formatCurrency(
                              order.deliveryCharge
                            )
                      }
                    />
                  </div>

                  <div className="my-6 h-px bg-[#e9ece7]" />

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#929a94]">
                        Total payable
                      </p>

                      <p className="mt-1 text-[10px] text-[#929a94]">
                        {order.paymentStatus === "paid"
                          ? "Payment confirmed"
                          : order.paymentMethod === "cod"
                          ? "Cash on delivery"
                          : "Payment verification pending"}
                      </p>
                    </div>

                    <p className="text-2xl font-semibold tracking-[-0.04em] text-[#294b39]">
                      {formatCurrency(order.total)}
                    </p>
                  </div>

                  <div className="mt-7 rounded-[20px] border border-[#e1e6df] bg-[#f8faf7] p-4">
                    <div className="flex gap-3">
                      <Truck
                        size={17}
                        className="mt-0.5 shrink-0 text-[#52745d]"
                      />

                      <div>
                        <p className="text-xs font-semibold text-[#3d5045]">
                          Standard delivery
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-[#7d877f]">
                          We'll contact you before dispatch.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/shop"
                    className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#294b39] text-xs font-semibold text-white transition hover:bg-[#203f30]"
                  >
                    Continue shopping

                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>

              {/* ORDER DATE */}

              <div className="mt-4 rounded-[24px] border border-[#dfe3dc] bg-white px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#969e98]">
                      Placed
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#4b5a51]">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#969e98]">
                      Time
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#4b5a51]">
                      {formatTime(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* FOOTER REASSURANCE */}

          <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-[28px] border border-[#dfe3dc] bg-white px-6 py-6 text-center sm:flex-row sm:px-8 sm:text-left">
            <div>
              <p className="text-sm font-semibold text-[#304238]">
                Need help with your order?
              </p>

              <p className="mt-1 text-xs text-[#858e87]">
                Keep your order number handy when contacting us.
              </p>
            </div>

            <div className="rounded-full bg-[#f1f4ef] px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.08em] text-[#52745d]">
              {order.orderNumber}
            </div>
          </div>

          {/* TRUST */}

          <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
            <TrustItem text="Carefully packed" />
            <TrustItem text="Quality selected" />
            <TrustItem text="Nationwide delivery" />
            <TrustItem text="Secure checkout" />
          </div>
        </div>
      </section>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-[#818a83]">{label}</span>

      <span
        className={
          positive
            ? "font-semibold text-[#52745d]"
            : "font-medium text-[#4b5a51]"
        }
      >
        {value}
      </span>
    </div>
  );
}

function TrustItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.13em] text-[#8a928c]">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e8eee7] text-[#52745d]">
        <Check size={9} strokeWidth={2.5} />
      </span>

      {text}
    </div>
  );
}

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ee] px-5">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9eee8]">
          <Loader2
            size={23}
            className="animate-spin text-[#52745d]"
          />
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7e8981]">
          Loading your order
        </p>

        <p className="mt-2 font-serif text-2xl italic text-[#294b39]">
          Just a moment...
        </p>
      </div>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#f7f5ee] px-5 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-[32px] border border-[#dfe3dc] bg-white p-10 text-center shadow-[0_20px_70px_rgba(34,58,45,0.07)] sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3ece7] text-[#9b6654]">
            <Package size={25} />
          </div>

          <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.22em] text-[#8c948e]">
            Order unavailable
          </p>

          <h1 className="mt-3 font-serif text-4xl tracking-[-0.04em] text-[#294b39]">
            We couldn't find that order.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#7c857e]">
            {message ||
              "The order may no longer be available or the order number may be incorrect."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#294b39] px-7 text-xs font-semibold text-white"
            >
              <ShoppingBag size={15} />
              Browse shop
            </Link>

            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#d9ded8] px-7 text-xs font-semibold text-[#52745d]"
            >
              <Home size={15} />
              Back home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}