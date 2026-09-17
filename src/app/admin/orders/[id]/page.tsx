"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Package,
  Phone,
  Save,
  ShoppingBag,
  Truck,
  User,
  X,
  XCircle,
} from "lucide-react";

type Order = {
  _id: string;
  orderNumber: string;

  customerInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };

  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };

  billingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };

  billingAddressSameAsShipping: boolean;

  items: {
    product: string;
    variantId?: string;
    name: string;
    packSize?: string;
    sku?: string;
    price: number;
    quantity: number;
    image?: string;
  }[];

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
    screenshotUrl?: string;
    screenshotPublicId?: string;
    submittedAt?: string;
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

  trackingHistory?: {
    status: string;
    note?: string;
    location?: string;
    createdAt: string;
  }[];

  customerNotes?: string;
  adminNotes?: string;

  cancellation?: {
    reason?: string;
    cancelledAt?: string;
  };

  createdAt: string;
  updatedAt: string;
};

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const orderStatusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentStatuses = [
  "pending",
  "processing",
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
];

const paymentStatusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
};

const paymentMethods: Record<string, string> = {
  cod: "Cash on Delivery",
  card: "Card",
  bank_transfer: "Bank Transfer",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

function formatPrice(value: number) {
  return `₨${Number(value || 0).toLocaleString("en-PK")}`;
}

function formatDate(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date?: string) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status: string) {
  switch (status) {
    case "delivered":
    case "paid":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "cancelled":
    case "failed":
    case "refunded":
      return "border-red-200 bg-red-50 text-red-700";

    case "processing":
    case "confirmed":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "shipped":
    case "out_for_delivery":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function statusDotClass(status: string) {
  switch (status) {
    case "delivered":
    case "paid":
      return "bg-emerald-500";

    case "cancelled":
    case "failed":
    case "refunded":
      return "bg-red-500";

    case "processing":
    case "confirmed":
      return "bg-blue-500";

    case "shipped":
    case "out_for_delivery":
      return "bg-indigo-500";

    default:
      return "bg-amber-500";
  }
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloadingProof, setDownloadingProof] = useState(false);

  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [adminNotes, setAdminNotes] = useState("");

  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] =
    useState("");

  const [trackingNote, setTrackingNote] = useState("");
  const [location, setLocation] = useState("");

  const [transactionId, setTransactionId] = useState("");
  const [gateway, setGateway] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  const [message, setMessage] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [cancellationReason, setCancellationReason] = useState("");

  const [copiedValue, setCopiedValue] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setMessage("");

        const response = await fetch(`/api/admin/orders/${id}`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Order not found");
        }

        const data: Order = result.data.order;

        setOrder(data);

        setOrderStatus(data.orderStatus);
        setPaymentStatus(data.paymentStatus);

        setAdminNotes(data.adminNotes || "");

        setCourier(data.shipping?.courier || "");
        setTrackingNumber(data.shipping?.trackingNumber || "");

        setEstimatedDeliveryDate(
          data.shipping?.estimatedDeliveryDate
            ? new Date(data.shipping.estimatedDeliveryDate)
                .toISOString()
                .split("T")[0]
            : ""
        );

        setTransactionId(data.payment?.transactionId || "");
        setGateway(data.payment?.gateway || "");
        setReferenceNumber(data.payment?.referenceNumber || "");
      } catch (error) {
        console.error(error);
        setMessage("Failed to load order.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadOrder();
    }
  }, [id]);

  const hasUnsavedChanges = useMemo(() => {
    if (!order) return false;

    const savedEstimatedDate = order.shipping?.estimatedDeliveryDate
      ? new Date(order.shipping.estimatedDeliveryDate)
          .toISOString()
          .split("T")[0]
      : "";

    return (
      orderStatus !== order.orderStatus ||
      paymentStatus !== order.paymentStatus ||
      adminNotes !== (order.adminNotes || "") ||
      courier !== (order.shipping?.courier || "") ||
      trackingNumber !== (order.shipping?.trackingNumber || "") ||
      estimatedDeliveryDate !== savedEstimatedDate ||
      transactionId !== (order.payment?.transactionId || "") ||
      gateway !== (order.payment?.gateway || "") ||
      referenceNumber !== (order.payment?.referenceNumber || "") ||
      trackingNote.trim() !== "" ||
      location.trim() !== ""
    );
  }, [
    order,
    orderStatus,
    paymentStatus,
    adminNotes,
    courier,
    trackingNumber,
    estimatedDeliveryDate,
    transactionId,
    gateway,
    referenceNumber,
    trackingNote,
    location,
  ]);

  async function saveChanges() {
    if (!hasUnsavedChanges || saving) return;

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          adminNotes,

          shipping: {
            courier: courier || undefined,
            trackingNumber: trackingNumber || undefined,
            estimatedDeliveryDate: estimatedDeliveryDate
              ? new Date(estimatedDeliveryDate)
              : undefined,
          },

          payment: {
            transactionId: transactionId || undefined,
            gateway: gateway || undefined,
            referenceNumber: referenceNumber || undefined,
          },

          trackingNote: trackingNote || undefined,
          location: location || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update order"
        );
      }

      const updatedOrder: Order = result.data.order;

      setOrder(updatedOrder);

      setOrderStatus(updatedOrder.orderStatus);
      setPaymentStatus(updatedOrder.paymentStatus);

      setAdminNotes(updatedOrder.adminNotes || "");

      setCourier(updatedOrder.shipping?.courier || "");
      setTrackingNumber(
        updatedOrder.shipping?.trackingNumber || ""
      );

      setEstimatedDeliveryDate(
        updatedOrder.shipping?.estimatedDeliveryDate
          ? new Date(updatedOrder.shipping.estimatedDeliveryDate)
              .toISOString()
              .split("T")[0]
          : ""
      );

      setTransactionId(
        updatedOrder.payment?.transactionId || ""
      );

      setGateway(updatedOrder.payment?.gateway || "");

      setReferenceNumber(
        updatedOrder.payment?.referenceNumber || ""
      );

      setTrackingNote("");
      setLocation("");

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error(error);

      setMessage(
        error?.message || "Failed to update order."
      );
    } finally {
      setSaving(false);
    }
  }

  async function cancelOrder() {
    const reason = cancellationReason.trim();

    if (!reason) return;

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: "cancelled",
          cancellationReason: reason,
          trackingNote: reason,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to cancel order"
        );
      }

      setOrder(result.data.order);
      setOrderStatus("cancelled");

      setCancellationReason("");
      setShowCancelModal(false);

      setTrackingNote("");
      setLocation("");

      setMessage("Order cancelled successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error: any) {
      console.error(error);

      setMessage(
        error?.message || "Failed to cancel order."
      );
    } finally {
      setSaving(false);
    }
  }

  async function downloadPaymentProof() {
    if (!order?.payment?.screenshotUrl) return;

    try {
      setDownloadingProof(true);
      setMessage("");

      const response = await fetch(
        order.payment.screenshotUrl
      );

      if (!response.ok) {
        throw new Error(
          "Failed to download payment proof."
        );
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `payment-proof-${order.orderNumber}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(
        "Payment proof download failed:",
        error
      );

      setMessage(
        "Unable to download payment proof. Please try again."
      );
    } finally {
      setDownloadingProof(false);
    }
  }

  async function copyValue(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);

      setCopiedValue(key);

      setTimeout(() => {
        setCopiedValue("");
      }, 1500);
    } catch {
      setCopiedValue("");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#10291d] shadow-[0_18px_45px_rgba(16,41,29,0.18)]">
            <div className="absolute inset-1 rounded-[18px] border border-white/10" />

            <Loader2 className="h-6 w-6 animate-spin text-[#c5dda8]" />
          </div>

          <p className="mt-5 text-sm font-semibold text-[#536158]">
            Loading order workspace...
          </p>

          <p className="mt-1 text-xs text-[#89948d]">
            Preparing order information
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="bg-[#10291d] px-6 py-8 text-center sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-red-400/10 text-red-300">
              <XCircle className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-white">
              Order not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/50">
              The order you are trying to access could not be
              loaded.
            </p>
          </div>

          <div className="p-6 text-center sm:p-8">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#10291d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#193b29]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const timeline = order.trackingHistory
    ? [...order.trackingHistory].reverse()
    : [];

  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const customerName = `${order.customerInfo.firstName} ${order.customerInfo.lastName}`;

  return (
    <div className="min-h-screen bg-white px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">

        {/* =========================================================
            TOP HEADER
        ========================================================= */}
        <section className="relative mb-6 overflow-hidden rounded-[30px] bg-[#10291d] shadow-[0_22px_65px_rgba(16,41,29,0.16)]">
          <div className="pointer-events-none absolute -right-24 -top-32 h-[380px] w-[380px] rounded-full bg-[#315c42]/40 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 left-[38%] h-[330px] w-[330px] rounded-full bg-[#c5dda8]/10 blur-3xl" />

          <div className="pointer-events-none absolute right-[25%] top-1/2 h-24 w-24 rounded-full border border-white/5" />

          <div className="relative p-5 sm:p-7 lg:p-8">

            {/* Breadcrumb */}
            <div className="mb-7 flex flex-wrap items-center gap-2 text-xs font-medium">
              <Link
                href="/admin/orders"
                className="text-white/45 transition hover:text-white"
              >
                Orders
              </Link>

              <span className="text-white/20">/</span>

              <span className="text-white/75">
                #{order.orderNumber}
              </span>
            </div>

            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.08] text-[#c5dda8] shadow-inner backdrop-blur">
                    <Package className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#c5dda8]">
                        Order Workspace
                      </p>

                      <span className="h-1 w-1 rounded-full bg-white/20" />

                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[34px]">
                        #{order.orderNumber}
                      </h1>

                      <button
                        type="button"
                        onClick={() =>
                          copyValue(
                            order.orderNumber,
                            "order"
                          )
                        }
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 text-[10px] font-semibold text-white/45 transition hover:bg-white/10 hover:text-white"
                      >
                        {copiedValue === "order" ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                      Manage the complete order from one
                      workspace — status, payment, delivery,
                      customer details and internal operations.
                    </p>
                  </div>
                </div>
              </div>

              {/* HEADER ACTIONS */}
              <div className="flex flex-wrap items-center gap-3">

                {/* Current status */}
                <div
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold ${statusClass(
                    order.orderStatus
                  )}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusDotClass(
                      order.orderStatus
                    )}`}
                  />

                  {orderStatusLabels[order.orderStatus] ||
                    order.orderStatus}
                </div>

                {/* SINGLE SAVE BUTTON */}
                <button
                  type="button"
                  onClick={saveChanges}
                  disabled={saving || !hasUnsavedChanges}
                  className={`group inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold transition ${
                    hasUnsavedChanges
                      ? "bg-[#c5dda8] text-[#10291d] shadow-[0_12px_30px_rgba(197,221,168,0.18)] hover:bg-[#d5e8bd] hover:shadow-[0_15px_35px_rgba(197,221,168,0.25)]"
                      : "cursor-not-allowed bg-white/10 text-white/35"
                  } disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : hasUnsavedChanges ? (
                    <>
                      <Save className="h-4 w-4 transition group-hover:scale-110" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Saved
                    </>
                  )}
                </button>

                {/* CANCEL */}
                {order.orderStatus !== "cancelled" &&
                  order.orderStatus !== "delivered" && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowCancelModal(true)
                      }
                      disabled={saving}
                      className="inline-flex min-h-[50px] items-center gap-2 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/20 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel Order
                    </button>
                  )}
              </div>
            </div>

            {/* Header metrics */}
            <div className="mt-8 grid gap-px overflow-hidden rounded-[22px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">

              <div className="bg-white/[0.045] p-4 backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Order Total
                </p>

                <p className="mt-1.5 text-xl font-bold text-white">
                  {formatPrice(order.total)}
                </p>
              </div>

              <div className="bg-white/[0.045] p-4 backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Items
                </p>

                <p className="mt-1.5 text-xl font-bold text-white">
                  {totalQuantity}

                  <span className="ml-1.5 text-xs font-medium text-white/35">
                    units
                  </span>
                </p>
              </div>

              <div className="bg-white/[0.045] p-4 backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Payment
                </p>

                <p className="mt-1.5 truncate text-sm font-bold text-white">
                  {paymentMethods[order.paymentMethod] ||
                    order.paymentMethod}
                </p>
              </div>

              <div className="bg-white/[0.045] p-4 backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Placed
                </p>

                <p className="mt-1.5 text-sm font-bold text-white">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            ERROR / GENERAL MESSAGE
        ========================================================= */}
        {message && (
          <div
            className={`mb-6 flex items-center justify-between gap-4 rounded-[20px] border px-4 py-3.5 shadow-sm ${
              message.toLowerCase().includes("unable") ||
              message.toLowerCase().includes("failed")
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.toLowerCase().includes("unable") ||
              message.toLowerCase().includes("failed") ? (
                <XCircle className="h-5 w-5 shrink-0" />
              ) : (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              )}

              <span className="text-sm font-semibold">
                {message}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="rounded-lg p-1 transition hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =========================================================
            WORKSPACE
        ========================================================= */}
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">

          {/* =======================================================
              LEFT CONTENT
          ======================================================= */}
          <main className="min-w-0 space-y-6">

            {/* ORDER ITEMS */}
            <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.045)]">

              <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#10291d]">
                    <ShoppingBag className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                      Order Contents
                    </p>

                    <h2 className="mt-1 text-base font-bold text-[#17231c]">
                      Ordered Products
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-[#f7f9f6] px-3 py-2 text-[11px] font-semibold text-[#718078]">
                    {order.items.length}{" "}
                    {order.items.length === 1
                      ? "product"
                      : "products"}
                  </span>

                  <span className="rounded-xl bg-[#edf3e9] px-3 py-2 text-[11px] font-bold text-[#315c42]">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.product}-${index}`}
                    className="group flex gap-4 p-5 transition hover:bg-[#fbfcfa] sm:p-6"
                  >
                    <div className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-[20px] border border-slate-200 bg-[#f5f7f4] sm:h-[94px] sm:w-[94px]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="h-7 w-7 text-slate-300" />
                        </div>
                      )}

                      <div className="absolute bottom-1.5 right-1.5 flex h-6 min-w-6 items-center justify-center rounded-lg bg-[#10291d]/90 px-1.5 text-[9px] font-bold text-white backdrop-blur">
                        ×{item.quantity}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-[#17231c] sm:text-[15px]">
                            {item.name}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {item.packSize && (
                              <span className="rounded-lg bg-[#edf3e9] px-2.5 py-1 text-[10px] font-bold text-[#315c42]">
                                {item.packSize}
                              </span>
                            )}

                            {item.sku && (
                              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                                SKU {item.sku}
                              </span>
                            )}
                          </div>

                          {item.variantId && (
                            <p className="mt-3 text-[10px] text-slate-400">
                              Variant ID: {item.variantId}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 sm:text-right">
                          <p className="text-base font-bold text-[#10291d]">
                            {formatPrice(
                              item.price * item.quantity
                            )}
                          </p>

                          <p className="mt-1 text-[11px] font-medium text-slate-400">
                            {formatPrice(item.price)} ×{" "}
                            {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice summary */}
              <div className="border-t border-slate-100 bg-[#fafcf9] px-5 py-6 sm:px-7">
                <div className="ml-auto max-w-md">

                  <div className="space-y-3">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-slate-500">
                        Subtotal
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatPrice(order.subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-slate-500">
                        Discount
                      </span>

                      <span className="font-semibold text-emerald-600">
                        -{formatPrice(order.discount)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-slate-500">
                        Delivery
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatPrice(order.deliveryCharge)}
                      </span>
                    </div>

                    {order.coupon && (
                      <div className="flex justify-between gap-4 text-sm">
                        <span className="text-slate-500">
                          Coupon{" "}
                          <span className="font-bold text-[#315c42]">
                            {order.coupon.code}
                          </span>
                        </span>

                        <span className="font-semibold text-emerald-600">
                          -{formatPrice(order.coupon.discount)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Grand Total
                      </p>

                      <p className="mt-1 text-2xl font-bold tracking-tight text-[#10291d]">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10291d] text-[#c5dda8] shadow-lg shadow-[#10291d]/10">
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CUSTOMER */}
            <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-7">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#10291d] text-[#c5dda8]">
                    <User className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                      Customer
                    </p>

                    <h2 className="mt-1 text-base font-bold text-[#17231c]">
                      Customer Information
                    </h2>
                  </div>
                </div>

                <span className="w-fit rounded-xl bg-[#edf3e9] px-3 py-2 text-[10px] font-bold text-[#315c42]">
                  Order Customer
                </span>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">

                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#edf3e9] text-xl font-bold text-[#315c42]">
                  {getInitials(
                    order.customerInfo.firstName,
                    order.customerInfo.lastName
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Full Name
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-slate-900">
                      {customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Phone
                    </p>

                    <a
                      href={`tel:${order.customerInfo.phone}`}
                      className="mt-1.5 inline-flex items-center gap-2 text-sm font-bold text-[#315c42] transition hover:text-[#10291d]"
                    >
                      <Phone className="h-4 w-4" />
                      {order.customerInfo.phone}
                    </a>
                  </div>

                  {order.customerInfo.email && (
                    <div className="sm:col-span-2">
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Email Address
                      </p>

                      <p className="mt-1.5 break-all text-sm font-medium text-slate-700">
                        {order.customerInfo.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ADDRESSES */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* SHIPPING ADDRESS */}
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-7">

                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#10291d]">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                      Delivery
                    </p>

                    <h2 className="mt-1 text-base font-bold text-[#17231c]">
                      Shipping Address
                    </h2>
                  </div>
                </div>

                <address className="mt-6 not-italic rounded-[22px] border border-slate-100 bg-[#fafcf9] p-5 text-sm leading-7 text-slate-600">

                  <strong className="text-slate-900">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </strong>

                  <br />

                  {order.shippingAddress.address}

                  {order.shippingAddress.apartment && (
                    <>
                      <br />
                      {order.shippingAddress.apartment}
                    </>
                  )}

                  <br />

                  {order.shippingAddress.city}
                  {order.shippingAddress.state
                    ? `, ${order.shippingAddress.state}`
                    : ""}
                  {order.shippingAddress.postalCode
                    ? ` ${order.shippingAddress.postalCode}`
                    : ""}

                  <br />

                  {order.shippingAddress.country ||
                    "Pakistan"}

                  {order.shippingAddress.phone && (
                    <>
                      <br />

                      <span className="font-medium text-slate-400">
                        {order.shippingAddress.phone}
                      </span>
                    </>
                  )}
                </address>
              </section>

              {/* BILLING ADDRESS */}
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-7">

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#10291d]">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                        Billing
                      </p>

                      <h2 className="mt-1 text-base font-bold text-[#17231c]">
                        Billing Address
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {order.billingAddressSameAsShipping ||
                  !order.billingAddress ? (
                    <div className="flex min-h-[160px] flex-col items-center justify-center rounded-[22px] border border-dashed border-slate-200 bg-[#fafcf9] px-5 text-center">

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#315c42] shadow-sm ring-1 ring-slate-100">
                        <Check className="h-5 w-5" />
                      </div>

                      <p className="mt-3 text-sm font-bold text-slate-800">
                        Same as shipping address
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        No separate billing address was provided.
                      </p>
                    </div>
                  ) : (
                    <address className="not-italic rounded-[22px] border border-slate-100 bg-[#fafcf9] p-5 text-sm leading-7 text-slate-600">

                      <strong className="text-slate-900">
                        {order.billingAddress.firstName}{" "}
                        {order.billingAddress.lastName}
                      </strong>

                      <br />

                      {order.billingAddress.address}

                      {order.billingAddress.apartment && (
                        <>
                          <br />
                          {order.billingAddress.apartment}
                        </>
                      )}

                      <br />

                      {order.billingAddress.city}
                      {order.billingAddress.state
                        ? `, ${order.billingAddress.state}`
                        : ""}
                      {order.billingAddress.postalCode
                        ? ` ${order.billingAddress.postalCode}`
                        : ""}

                      <br />

                      {order.billingAddress.country ||
                        "Pakistan"}
                    </address>
                  )}
                </div>
              </section>
            </div>

            {/* NOTES */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* CUSTOMER NOTES */}
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-7">

                <div className="flex items-center gap-3.5">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                      Customer
                    </p>

                    <h2 className="mt-1 text-base font-bold text-[#17231c]">
                      Customer Notes
                    </h2>
                  </div>
                </div>

                <div className="mt-6 min-h-[130px] rounded-[22px] border border-slate-100 bg-[#fafcf9] p-5">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {order.customerNotes ||
                      "No customer notes were provided with this order."}
                  </p>
                </div>
              </section>

              {/* ADMIN NOTES */}
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-7">

                <div className="flex items-center gap-3.5">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#10291d]">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                      Internal
                    </p>

                    <h2 className="mt-1 text-base font-bold text-[#17231c]">
                      Admin Notes
                    </h2>
                  </div>
                </div>

                <textarea
                  value={adminNotes}
                  onChange={(e) =>
                    setAdminNotes(e.target.value)
                  }
                  rows={5}
                  placeholder="Add internal notes for your team..."
                  className="mt-6 w-full resize-none rounded-[22px] border border-slate-200 bg-[#fafcf9] p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                />

                <p className="mt-2 text-[10px] text-slate-400">
                  These notes are for internal use only.
                </p>
              </section>
            </div>

            {/* TIMELINE */}
            <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-7">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3.5">

                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#10291d] text-[#c5dda8]">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                      Activity
                    </p>

                    <h2 className="mt-1 text-base font-bold text-[#17231c]">
                      Order Timeline
                    </h2>
                  </div>
                </div>

                {timeline.length > 0 && (
                  <span className="w-fit rounded-xl bg-[#f7f9f6] px-3 py-2 text-[10px] font-bold text-slate-500">
                    {timeline.length} updates
                  </span>
                )}
              </div>

              <div className="mt-8">

                {timeline.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-slate-200 bg-[#fafcf9] p-10 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm ring-1 ring-slate-100">
                      <Clock3 className="h-5 w-5" />
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-600">
                      No tracking history yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Status updates will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="relative">

                    <div className="absolute bottom-5 left-[19px] top-5 w-px bg-slate-200" />

                    <div className="space-y-8">
                      {timeline.map((history, index) => (
                        <div
                          key={`${history.createdAt}-${index}`}
                          className="relative flex gap-4"
                        >
                          <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                              index === 0
                                ? "bg-[#10291d] text-[#c5dda8]"
                                : "bg-[#edf3e9] text-[#315c42]"
                            }`}
                          >
                            {index === 0 ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-current" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1 pb-1">

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                              <span
                                className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClass(
                                  history.status
                                )}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${statusDotClass(
                                    history.status
                                  )}`}
                                />

                                {orderStatusLabels[
                                  history.status
                                ] || history.status}
                              </span>

                              <span className="text-[10px] font-medium text-slate-400">
                                {formatDateTime(
                                  history.createdAt
                                )}
                              </span>
                            </div>

                            {history.note && (
                              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                {history.note}
                              </p>
                            )}

                            {history.location && (
                              <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400">
                                <MapPin className="h-3 w-3" />
                                {history.location}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* CANCELLATION */}
            {order.cancellation && (
              <section className="overflow-hidden rounded-[28px] border border-red-200 bg-red-50">

                <div className="border-b border-red-100 bg-red-100/40 px-5 py-5 sm:px-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
                      <XCircle className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-400">
                        Order Status
                      </p>

                      <h2 className="mt-1 text-base font-bold text-red-900">
                        Order Cancelled
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7">

                  <p className="text-sm leading-7 text-red-700">
                    {order.cancellation.reason ||
                      "No cancellation reason was provided."}
                  </p>

                  {order.cancellation.cancelledAt && (
                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-400">
                      Cancelled on{" "}
                      {formatDateTime(
                        order.cancellation.cancelledAt
                      )}
                    </p>
                  )}
                </div>
              </section>
            )}
          </main>

          {/* =======================================================
              RIGHT CONTROL PANEL
          ======================================================= */}
          <aside className="space-y-6 xl:sticky xl:top-5">

            {/* CONTROL CENTER */}
            <section className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.07)]">

              <div className="relative overflow-hidden bg-[#10291d] p-5 sm:p-6">

                <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#315c42]/40 blur-2xl" />

                <div className="relative flex items-start justify-between gap-4">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c5dda8]">
                      Control Center
                    </p>

                    <h2 className="mt-1.5 text-lg font-bold text-white">
                      Update Order
                    </h2>

                    <p className="mt-1 text-[11px] leading-5 text-white/40">
                      Edit order controls and save everything together.
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      hasUnsavedChanges
                        ? "bg-amber-400/10 text-amber-300"
                        : "bg-emerald-400/10 text-emerald-300"
                    }`}
                  >
                    {hasUnsavedChanges ? (
                      <Clock3 className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                </div>

                <div className="relative mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2.5">

                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      hasUnsavedChanges
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />

                  <span className="text-[10px] font-semibold text-white/50">
                    {hasUnsavedChanges
                      ? "You have unsaved changes"
                      : "All changes saved"}
                  </span>
                </div>
              </div>

              <div className="space-y-6 p-5 sm:p-6">

                {/* ORDER STATUS */}
                <div>

                  <div className="mb-2.5 flex items-end justify-between gap-3">

                    <label className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Order Status
                    </label>

                    <span className="text-[9px] font-medium text-slate-400">
                      Current:{" "}
                      {orderStatusLabels[order.orderStatus]}
                    </span>
                  </div>

                  <div className="relative">

                    <select
                      value={orderStatus}
                      onChange={(e) =>
                        setOrderStatus(e.target.value)
                      }
                      className="h-[52px] w-full appearance-none rounded-[18px] border border-slate-200 bg-[#fafcf9] px-4 pr-11 text-sm font-bold text-slate-800 outline-none transition hover:border-slate-300 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {orderStatusLabels[status]}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* PAYMENT STATUS */}
                <div>

                  <div className="mb-2.5 flex items-end justify-between gap-3">

                    <label className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Payment Status
                    </label>

                    <span className="text-[9px] font-medium text-slate-400">
                      Current:{" "}
                      {paymentStatusLabels[
                        order.paymentStatus
                      ] || order.paymentStatus}
                    </span>
                  </div>

                  <div className="relative">

                    <select
                      value={paymentStatus}
                      onChange={(e) =>
                        setPaymentStatus(e.target.value)
                      }
                      className="h-[52px] w-full appearance-none rounded-[18px] border border-slate-200 bg-[#fafcf9] px-4 pr-11 text-sm font-bold text-slate-800 outline-none transition hover:border-slate-300 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {paymentStatusLabels[status]}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* TRACKING UPDATE */}
                <div className="border-t border-slate-100 pt-6">

                  <div className="mb-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Activity Update
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Add a note and location to the next tracking event.
                    </p>
                  </div>

                  <div className="space-y-4">

                    <div>
                      <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Tracking Note
                      </label>

                      <textarea
                        value={trackingNote}
                        onChange={(e) =>
                          setTrackingNote(e.target.value)
                        }
                        rows={3}
                        placeholder="e.g. Package handed over to courier..."
                        className="w-full resize-none rounded-[18px] border border-slate-200 bg-[#fafcf9] p-3.5 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                      />
                    </div>

                    <div>

                      <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Location
                      </label>

                      <div className="relative">

                        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <input
                          value={location}
                          onChange={(e) =>
                            setLocation(e.target.value)
                          }
                          placeholder="e.g. Karachi Warehouse"
                          className="h-[50px] w-full rounded-[18px] border border-slate-200 bg-[#fafcf9] pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SAVE INFORMATION */}
                <div className="border-t border-slate-100 pt-6">

                  <div className="rounded-[18px] border border-slate-100 bg-[#fafcf9] p-3.5">
                    <div className="flex items-start gap-3">

                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          hasUnsavedChanges
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {hasUnsavedChanges ? (
                          <Clock3 className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          {hasUnsavedChanges
                            ? "Changes ready to save"
                            : "Order is fully saved"}
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-slate-400">
                          Use the single Save Changes button in
                          the header to apply all updates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SHIPPING */}
            <section className="rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-6">

              <div className="flex items-center gap-3.5">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#10291d]">
                  <Truck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                    Fulfillment
                  </p>

                  <h2 className="mt-1 text-base font-bold text-[#17231c]">
                    Shipping Details
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-5">

                <div>
                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Courier
                  </label>

                  <input
                    value={courier}
                    onChange={(e) =>
                      setCourier(e.target.value)
                    }
                    placeholder="e.g. TCS, Leopards"
                    className="h-[50px] w-full rounded-[18px] border border-slate-200 bg-[#fafcf9] px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                  />
                </div>

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Tracking Number
                    </label>

                    {trackingNumber && (
                      <button
                        type="button"
                        onClick={() =>
                          copyValue(
                            trackingNumber,
                            "tracking"
                          )
                        }
                        className="inline-flex items-center gap-1 text-[9px] font-bold text-[#315c42]"
                      >
                        {copiedValue === "tracking" ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <input
                    value={trackingNumber}
                    onChange={(e) =>
                      setTrackingNumber(e.target.value)
                    }
                    placeholder="Tracking number"
                    className="h-[50px] w-full rounded-[18px] border border-slate-200 bg-[#fafcf9] px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                  />
                </div>

                <div>

                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Estimated Delivery
                  </label>

                  <input
                    type="date"
                    value={estimatedDeliveryDate}
                    onChange={(e) =>
                      setEstimatedDeliveryDate(
                        e.target.value
                      )
                    }
                    className="h-[50px] w-full rounded-[18px] border border-slate-200 bg-[#fafcf9] px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">

                  {order.shipping?.shippedAt && (
                    <div className="rounded-[18px] border border-indigo-100 bg-indigo-50 p-4">

                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-500">
                        Shipped On
                      </p>

                      <p className="mt-1.5 text-sm font-bold text-indigo-800">
                        {formatDateTime(
                          order.shipping.shippedAt
                        )}
                      </p>
                    </div>
                  )}

                  {order.shipping?.deliveredAt && (
                    <div className="rounded-[18px] border border-emerald-100 bg-emerald-50 p-4">

                      <div className="flex items-center gap-2">

                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                          Delivered On
                        </p>
                      </div>

                      <p className="mt-1.5 text-sm font-bold text-emerald-800">
                        {formatDateTime(
                          order.shipping.deliveredAt
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* PAYMENT */}
            <section className="rounded-[30px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-6">

              <div className="flex items-center gap-3.5">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#10291d]">
                  <CreditCard className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                    Transaction
                  </p>

                  <h2 className="mt-1 text-base font-bold text-[#17231c]">
                    Payment Details
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-5">

                {/* Method */}
                <div className="rounded-[20px] border border-slate-100 bg-[#fafcf9] p-4">

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Payment Method
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">

                    <p className="text-sm font-bold text-slate-900">
                      {paymentMethods[order.paymentMethod] ||
                        order.paymentMethod}
                    </p>

                    <span
                      className={`rounded-lg border px-2 py-1 text-[9px] font-bold ${statusClass(
                        order.paymentStatus
                      )}`}
                    >
                      {paymentStatusLabels[
                        order.paymentStatus
                      ] || order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Transaction */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Transaction ID
                    </label>

                    {transactionId && (
                      <button
                        type="button"
                        onClick={() =>
                          copyValue(
                            transactionId,
                            "transaction"
                          )
                        }
                        className="inline-flex items-center gap-1 text-[9px] font-bold text-[#315c42]"
                      >
                        {copiedValue === "transaction" ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <input
                    value={transactionId}
                    onChange={(e) =>
                      setTransactionId(e.target.value)
                    }
                    placeholder="Transaction ID"
                    className="h-[50px] w-full rounded-[18px] border border-slate-200 bg-[#fafcf9] px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                  />
                </div>

                {/* Gateway */}
                <div>

                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Gateway
                  </label>

                  <input
                    value={gateway}
                    onChange={(e) =>
                      setGateway(e.target.value)
                    }
                    placeholder="e.g. JazzCash"
                    className="h-[50px] w-full rounded-[18px] border border-slate-200 bg-[#fafcf9] px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                  />
                </div>

                {/* Reference */}
                <div>

                  <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Reference Number
                  </label>

                  <input
                    value={referenceNumber}
                    onChange={(e) =>
                      setReferenceNumber(e.target.value)
                    }
                    placeholder="Reference number"
                    className="h-[50px] w-full rounded-[18px] border border-slate-200 bg-[#fafcf9] px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
                  />
                </div>

                {/* Payment proof */}
                {order.payment?.screenshotUrl && (
                  <div className="border-t border-slate-100 pt-6">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          Payment Proof
                        </p>

                        {order.payment.submittedAt && (
                          <p className="mt-1 text-[10px] text-slate-400">
                            Submitted{" "}
                            {formatDateTime(
                              order.payment.submittedAt
                            )}
                          </p>
                        )}
                      </div>

                      <a
                        href={order.payment.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold text-[#315c42] transition hover:bg-[#edf3e9]"
                      >
                        Open
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div className="group relative mt-4 overflow-hidden rounded-[22px] border border-slate-200 bg-[#f5f7f4]">

                      <img
                        src={order.payment.screenshotUrl}
                        alt="Payment proof"
                        className="max-h-[360px] w-full object-contain"
                      />

                      <a
                        href={order.payment.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl bg-[#10291d]/90 px-3 py-2 text-[10px] font-bold text-white opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Proof
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={downloadPaymentProof}
                      disabled={downloadingProof}
                      className="mt-3 flex h-[48px] w-full items-center justify-center gap-2 rounded-[18px] border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {downloadingProof ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download Payment Proof
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Paid */}
                {order.payment?.paidAt && (
                  <div className="rounded-[20px] border border-emerald-100 bg-emerald-50 p-4">

                    <div className="flex items-center gap-2">

                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                        Payment Received
                      </p>
                    </div>

                    <p className="mt-2 text-sm font-bold text-emerald-800">
                      {formatDateTime(order.payment.paidAt)}
                    </p>
                  </div>
                )}

                {/* Failure */}
                {order.payment?.failureReason && (
                  <div className="rounded-[20px] border border-red-100 bg-red-50 p-4">

                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-red-500">
                      Failure Reason
                    </p>

                    <p className="mt-2 text-sm leading-6 text-red-700">
                      {order.payment.failureReason}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* =========================================================
          CANCEL MODAL
      ========================================================= */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07130d]/65 px-4 py-6 backdrop-blur-md">

          <div
            className="absolute inset-0"
            onClick={() => {
              if (!saving) {
                setShowCancelModal(false);
                setCancellationReason("");
              }
            }}
          />

          <div className="relative w-full max-w-[480px] overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_35px_120px_rgba(0,0,0,0.25)]">

            <div className="relative overflow-hidden bg-[#10291d] px-6 py-7">

              <div className="pointer-events-none absolute -right-14 -top-20 h-48 w-48 rounded-full bg-red-400/10 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">

                <div className="flex items-center gap-3.5">

                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-red-400/10 text-red-300">
                    <XCircle className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-300/60">
                      Destructive Action
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                      Cancel Order
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!saving) {
                      setShowCancelModal(false);
                      setCancellationReason("");
                    }
                  }}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/50 transition hover:bg-white/15 hover:text-white disabled:opacity-40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative mt-6 rounded-[18px] border border-white/10 bg-white/[0.05] p-4">

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Order
                </p>

                <p className="mt-1 text-sm font-bold text-white">
                  #{order.orderNumber}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7">

              <p className="text-sm leading-6 text-slate-500">
                Cancelling this order will change its status to
                cancelled. Please record a reason for your team.
              </p>

              <label className="mt-6 mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Cancellation Reason
              </label>

              <textarea
                autoFocus
                value={cancellationReason}
                onChange={(e) =>
                  setCancellationReason(e.target.value)
                }
                rows={5}
                placeholder="e.g. Customer requested cancellation..."
                className="w-full resize-none rounded-[20px] border border-slate-200 bg-[#fafcf9] p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
              />

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => {
                    if (!saving) {
                      setShowCancelModal(false);
                      setCancellationReason("");
                    }
                  }}
                  disabled={saving}
                  className="h-12 rounded-[16px] border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Keep Order
                </button>

                <button
                  type="button"
                  onClick={cancelOrder}
                  disabled={
                    saving || !cancellationReason.trim()
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] bg-red-600 px-5 text-sm font-bold text-white shadow-lg shadow-red-600/10 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}

                  {saving
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SUCCESS MODAL
      ========================================================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#07130d]/70 px-4 py-6 backdrop-blur-md">

          <div
            className="absolute inset-0"
            onClick={() => {
              setShowSuccessModal(false);
              router.push("/admin/orders");
            }}
          />

          <div className="relative w-full max-w-[460px] overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_35px_120px_rgba(0,0,0,0.28)]">

            {/* MODAL HEADER */}
            <div className="relative overflow-hidden bg-[#10291d] px-6 py-8 text-center sm:px-8">

              <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#315c42]/50 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-24 -left-16 h-44 w-44 rounded-full bg-[#c5dda8]/10 blur-3xl" />

              <div className="relative mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-[26px] border border-emerald-300/20 bg-emerald-400/10 shadow-[0_15px_40px_rgba(16,185,129,0.08)]">

                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[20px] bg-emerald-400/15">
                  <CheckCircle2 className="h-7 w-7 text-emerald-300" />
                </div>
              </div>

              <p className="relative mt-6 text-[9px] font-bold uppercase tracking-[0.24em] text-[#c5dda8]">
                Update Complete
              </p>

              <h2 className="relative mt-2 text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                Order Updated Successfully
              </h2>

              <p className="relative mx-auto mt-3 max-w-sm text-sm leading-6 text-white/45">
                All changes for this order have been saved successfully.
              </p>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 sm:p-7">

              <div className="rounded-[22px] border border-slate-100 bg-[#fafcf9] p-4">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Updated Order
                    </p>

                    <p className="mt-1.5 text-sm font-bold text-[#17231c]">
                      #{order.orderNumber}
                    </p>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold ${statusClass(
                      order.orderStatus
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${statusDotClass(
                        order.orderStatus
                      )}`}
                    />

                    {orderStatusLabels[order.orderStatus] ||
                      order.orderStatus}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                  <Check className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Everything is up to date
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    You can return to the orders list to continue
                    managing other orders.
                  </p>
                </div>
              </div>

              {/* OK BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/admin/orders");
                }}
                className="mt-7 flex h-[54px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#10291d] text-sm font-bold text-white shadow-[0_14px_30px_rgba(16,41,29,0.15)] transition hover:bg-[#193b29] hover:shadow-[0_18px_35px_rgba(16,41,29,0.2)]"
              >
                <Check className="h-4 w-4 text-[#c5dda8]" />

                OK, Back to Orders

                <ArrowLeft className="ml-1 h-4 w-4 rotate-180 text-white/50" />
              </button>

              <p className="mt-3 text-center text-[9px] font-medium text-slate-400">
                Click OK to return to the orders dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}