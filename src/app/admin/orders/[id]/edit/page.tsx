"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
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
  Clock3,
  Truck,
  User,
  X,
  XCircle,
  Trash2,
  AlertTriangle,
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
    verifiedBy?: string;
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
    cancelledBy?: string;
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

function dateInputValue(date?: string) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

export default function AdminOrderEditPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [orderStatus, setOrderStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [shippingFirstName, setShippingFirstName] = useState("");
  const [shippingLastName, setShippingLastName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingApartment, setShippingApartment] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingApartment, setBillingApartment] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [billingPhone, setBillingPhone] = useState("");

  const [adminNotes, setAdminNotes] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");

  const [transactionId, setTransactionId] = useState("");
  const [gateway, setGateway] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [failureReason, setFailureReason] = useState("");

  const [trackingNote, setTrackingNote] = useState("");
  const [trackingLocation, setTrackingLocation] = useState("");

  const [cancellationReason, setCancellationReason] = useState("");

  const [copiedValue, setCopiedValue] = useState("");
  const [downloadingProof, setDownloadingProof] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
const [cancelling, setCancelling] = useState(false);
const [cancelReasonModal, setCancelReasonModal] = useState("");

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

        setOrderStatus(data.orderStatus || "pending");
        setPaymentStatus(data.paymentStatus || "pending");

        setCustomerFirstName(data.customerInfo?.firstName || "");
        setCustomerLastName(data.customerInfo?.lastName || "");
        setCustomerPhone(data.customerInfo?.phone || "");
        setCustomerEmail(data.customerInfo?.email || "");

        setShippingFirstName(data.shippingAddress?.firstName || "");
        setShippingLastName(data.shippingAddress?.lastName || "");
        setShippingAddress(data.shippingAddress?.address || "");
        setShippingApartment(data.shippingAddress?.apartment || "");
        setShippingCity(data.shippingAddress?.city || "");
        setShippingState(data.shippingAddress?.state || "");
        setShippingPostalCode(data.shippingAddress?.postalCode || "");
        setShippingCountry(data.shippingAddress?.country || "");
        setShippingPhone(data.shippingAddress?.phone || "");

        setBillingSameAsShipping(
          data.billingAddressSameAsShipping ?? true
        );

        setBillingFirstName(data.billingAddress?.firstName || "");
        setBillingLastName(data.billingAddress?.lastName || "");
        setBillingAddress(data.billingAddress?.address || "");
        setBillingApartment(data.billingAddress?.apartment || "");
        setBillingCity(data.billingAddress?.city || "");
        setBillingState(data.billingAddress?.state || "");
        setBillingPostalCode(data.billingAddress?.postalCode || "");
        setBillingCountry(data.billingAddress?.country || "");
        setBillingPhone(data.billingAddress?.phone || "");

        setAdminNotes(data.adminNotes || "");
        setCustomerNotes(data.customerNotes || "");

        setCourier(data.shipping?.courier || "");
        setTrackingNumber(data.shipping?.trackingNumber || "");

        setEstimatedDeliveryDate(
          dateInputValue(data.shipping?.estimatedDeliveryDate)
        );

        setTransactionId(data.payment?.transactionId || "");
        setGateway(data.payment?.gateway || "");
        setReferenceNumber(data.payment?.referenceNumber || "");
        setFailureReason(data.payment?.failureReason || "");

        setCancellationReason(
          data.cancellation?.reason || ""
        );

        const latestTracking =
          data.trackingHistory?.[
            data.trackingHistory.length - 1
          ];

        setTrackingNote("");
        setTrackingLocation("");

        if (latestTracking) {
          setTrackingLocation(latestTracking.location || "");
        }
      } catch (error) {
        console.error(error);

        setMessageType("error");
        setMessage("Failed to load order.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadOrder();
    }
  }, [id]);

  const timeline = useMemo(() => {
    if (!order?.trackingHistory) return [];

    return [...order.trackingHistory].reverse();
  }, [order]);

  const totalQuantity =
    order?.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) || 0;

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

  async function downloadPaymentProof() {
    if (!order?.payment?.screenshotUrl) return;

    try {
      setDownloadingProof(true);

      const response = await fetch(
        order.payment.screenshotUrl
      );

      if (!response.ok) {
        throw new Error(
          "Failed to download payment proof."
        );
      }

      const blob = await response.blob();

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = blobUrl;
      link.download = `payment-proof-${order.orderNumber}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(error);

      setMessageType("error");
      setMessage(
        "Unable to download payment proof."
      );
    } finally {
      setDownloadingProof(false);
    }
  }

  async function saveChanges() {
    if (!order) return;

    try {
      setSaving(true);
      setMessage("");

      const shipping: Record<string, any> = {
        courier: courier.trim(),
        trackingNumber: trackingNumber.trim(),
      };

      if (estimatedDeliveryDate) {
        shipping.estimatedDeliveryDate =
          new Date(
            `${estimatedDeliveryDate}T12:00:00`
          ).toISOString();
      } else {
        shipping.estimatedDeliveryDate = undefined;
      }

      const payment: Record<string, any> = {
        transactionId: transactionId.trim(),
        gateway: gateway.trim(),
        referenceNumber: referenceNumber.trim(),
      };

      if (failureReason.trim()) {
        payment.failureReason =
          failureReason.trim();
      } else {
        payment.failureReason = undefined;
      }

      const payload = {
        orderStatus,
        paymentStatus,

        adminNotes,
        customerNotes,

        customerInfo: {
          firstName: customerFirstName.trim(),
          lastName: customerLastName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim(),
        },

        shippingAddress: {
          firstName: shippingFirstName.trim(),
          lastName: shippingLastName.trim(),
          address: shippingAddress.trim(),
          apartment: shippingApartment.trim(),
          city: shippingCity.trim(),
          state: shippingState.trim(),
          postalCode: shippingPostalCode.trim(),
          country: shippingCountry.trim(),
          phone: shippingPhone.trim(),
        },

        billingAddressSameAsShipping:
          billingSameAsShipping,

        billingAddress: billingSameAsShipping
          ? undefined
          : {
              firstName: billingFirstName.trim(),
              lastName: billingLastName.trim(),
              address: billingAddress.trim(),
              apartment: billingApartment.trim(),
              city: billingCity.trim(),
              state: billingState.trim(),
              postalCode: billingPostalCode.trim(),
              country: billingCountry.trim(),
              phone: billingPhone.trim(),
            },

        shipping,
        payment,

        trackingNote:
          trackingNote.trim() || undefined,

        location:
          trackingLocation.trim() || undefined,

        cancellationReason:
          cancellationReason.trim() || undefined,
      };

      const response = await fetch(
        `/api/admin/orders/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update order"
        );
      }

      const updatedOrder: Order =
        result.data.order;

      setOrder(updatedOrder);

      setOrderStatus(
        updatedOrder.orderStatus
      );

      setPaymentStatus(
        updatedOrder.paymentStatus
      );

      setCustomerFirstName(
        updatedOrder.customerInfo?.firstName || ""
      );

      setCustomerLastName(
        updatedOrder.customerInfo?.lastName || ""
      );

      setCustomerPhone(
        updatedOrder.customerInfo?.phone || ""
      );

      setCustomerEmail(
        updatedOrder.customerInfo?.email || ""
      );

      setShippingFirstName(
        updatedOrder.shippingAddress?.firstName || ""
      );

      setShippingLastName(
        updatedOrder.shippingAddress?.lastName || ""
      );

      setShippingAddress(
        updatedOrder.shippingAddress?.address || ""
      );

      setShippingApartment(
        updatedOrder.shippingAddress?.apartment || ""
      );

      setShippingCity(
        updatedOrder.shippingAddress?.city || ""
      );

      setShippingState(
        updatedOrder.shippingAddress?.state || ""
      );

      setShippingPostalCode(
        updatedOrder.shippingAddress?.postalCode || ""
      );

      setShippingCountry(
        updatedOrder.shippingAddress?.country || ""
      );

      setShippingPhone(
        updatedOrder.shippingAddress?.phone || ""
      );

      setBillingSameAsShipping(
        updatedOrder.billingAddressSameAsShipping ?? true
      );

      setBillingFirstName(
        updatedOrder.billingAddress?.firstName || ""
      );

      setBillingLastName(
        updatedOrder.billingAddress?.lastName || ""
      );

      setBillingAddress(
        updatedOrder.billingAddress?.address || ""
      );

      setBillingApartment(
        updatedOrder.billingAddress?.apartment || ""
      );

      setBillingCity(
        updatedOrder.billingAddress?.city || ""
      );

      setBillingState(
        updatedOrder.billingAddress?.state || ""
      );

      setBillingPostalCode(
        updatedOrder.billingAddress?.postalCode || ""
      );

      setBillingCountry(
        updatedOrder.billingAddress?.country || ""
      );

      setBillingPhone(
        updatedOrder.billingAddress?.phone || ""
      );

      setAdminNotes(
        updatedOrder.adminNotes || ""
      );

      setCustomerNotes(
        updatedOrder.customerNotes || ""
      );

      setCourier(
        updatedOrder.shipping?.courier || ""
      );

      setTrackingNumber(
        updatedOrder.shipping?.trackingNumber || ""
      );

      setEstimatedDeliveryDate(
        dateInputValue(
          updatedOrder.shipping?.estimatedDeliveryDate
        )
      );

      setTransactionId(
        updatedOrder.payment?.transactionId || ""
      );

      setGateway(
        updatedOrder.payment?.gateway || ""
      );

      setReferenceNumber(
        updatedOrder.payment?.referenceNumber || ""
      );

      setFailureReason(
        updatedOrder.payment?.failureReason || ""
      );

      setCancellationReason(
        updatedOrder.cancellation?.reason || ""
      );

      setTrackingNote("");
      setTrackingLocation("");

      setMessageType("success");
      setMessage(
        result.message ||
          "Order updated successfully."
      );
    } catch (error: any) {
      console.error(error);

      setMessageType("error");
      setMessage(
        error?.message ||
          "Failed to update order."
      );
    } finally {
      setSaving(false);
    }
  }

  async function cancelOrder() {
  if (!order) return;

  const reason = cancelReasonModal.trim();

  if (!reason) {
    setMessageType("error");
    setMessage("Please enter a cancellation reason.");
    return;
  }

  try {
    setCancelling(true);
    setMessage("");

    const response = await fetch(
      `/api/admin/orders/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: "cancelled",
          cancellationReason: reason,
          trackingNote: `Order cancelled by admin: ${reason}`,
          location: trackingLocation.trim() || undefined,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to cancel order"
      );
    }

    const updatedOrder: Order = result.data.order;

    setOrder(updatedOrder);

    setOrderStatus(
      updatedOrder.orderStatus || "cancelled"
    );

    setCancellationReason(
      updatedOrder.cancellation?.reason || reason
    );

    setCancelReasonModal("");
    setShowCancelModal(false);

    setMessageType("success");
    setMessage(
      result.message ||
        "Order cancelled successfully."
    );
  } catch (error: any) {
    console.error(error);

    setMessageType("error");
    setMessage(
      error?.message ||
        "Failed to cancel order."
    );
  } finally {
    setCancelling(false);
  }
}

  async function deleteOrder() {
    try {
      setDeleting(true);
      setMessage("");

      const response = await fetch(
        `/api/admin/orders/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete order"
        );
      }

      router.push("/admin/orders");
      router.refresh();
    } catch (error: any) {
      console.error(error);

      setDeleting(false);
      setShowDeleteModal(false);

      setMessageType("error");
      setMessage(
        error?.message ||
          "Failed to delete order."
      );
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
              The order you are trying to edit could not be loaded.
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

  return (
    <>
      <div className="min-h-screen bg-white px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">

          {/* =====================================================
              HEADER
          ===================================================== */}
          <section className="relative mb-6 overflow-hidden rounded-[30px] bg-[#10291d] shadow-[0_22px_65px_rgba(16,41,29,0.16)]">

            <div className="pointer-events-none absolute -right-24 -top-32 h-[380px] w-[380px] rounded-full bg-[#315c42]/40 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-40 left-[38%] h-[330px] w-[330px] rounded-full bg-[#c5dda8]/10 blur-3xl" />

            <div className="relative p-5 sm:p-7 lg:p-8">

              <div className="mb-7 flex flex-wrap items-center gap-2 text-xs font-medium">
                <Link
                  href="/admin/orders"
                  className="text-white/45 transition hover:text-white"
                >
                  Orders
                </Link>

                <span className="text-white/20">
                  /
                </span>

                <Link
                  href={`/admin/orders/${order._id}`}
                  className="text-white/45 transition hover:text-white"
                >
                  #{order.orderNumber}
                </Link>

                <span className="text-white/20">
                  /
                </span>

                <span className="text-white/75">
                  Edit
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
                          Order Management
                        </p>

                        <span className="h-1 w-1 rounded-full bg-white/20" />

                        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                          Editing
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
                        Update order details, customer information,
                        payment, shipping and delivery information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">

                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    View Order
                  </Link>

                  <div
                    className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold ${statusClass(
                      orderStatus
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${statusDotClass(
                        orderStatus
                      )}`}
                    />

                    {orderStatusLabels[orderStatus] ||
                      orderStatus}
                  </div>
                </div>
              </div>

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
                    {paymentMethods[
                      order.paymentMethod
                    ] || order.paymentMethod}
                  </p>
                </div>

                <div className="bg-white/[0.045] p-4 backdrop-blur-sm">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                    Last Updated
                  </p>

                  <p className="mt-1.5 text-sm font-bold text-white">
                    {formatDateTime(order.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              MESSAGE
          ===================================================== */}
          {message && (
            <div
              className={`mb-6 flex items-center justify-between gap-4 rounded-[20px] border px-4 py-3.5 shadow-sm ${
                messageType === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <div className="flex items-center gap-3">
                {messageType === "error" ? (
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

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">

            {/* ===================================================
                LEFT
            =================================================== */}
            <main className="min-w-0 space-y-6">

              {/* ORDER ITEMS - READ ONLY */}
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

                  <span className="w-fit rounded-xl bg-[#f7f9f6] px-3 py-2 text-[11px] font-semibold text-[#718078]">
                    Products are managed from catalog
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="flex gap-4 p-5 sm:p-6"
                    >
                      <div className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-[20px] border border-slate-200 bg-[#f5f7f4] sm:h-[94px] sm:w-[94px]">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
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
                          </div>

                          <div className="shrink-0 sm:text-right">
                            <p className="text-base font-bold text-[#10291d]">
                              {formatPrice(
                                item.price *
                                  item.quantity
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

                <div className="border-t border-slate-100 bg-[#fafcf9] px-5 py-6 sm:px-7">
                  <div className="ml-auto max-w-md space-y-3">

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Subtotal
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatPrice(order.subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Discount
                      </span>

                      <span className="font-semibold text-emerald-600">
                        -{formatPrice(order.discount)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Delivery
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatPrice(
                          order.deliveryCharge
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-slate-200 pt-4">
                      <span className="font-bold text-slate-800">
                        Grand Total
                      </span>

                      <span className="text-xl font-bold text-[#10291d]">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* CUSTOMER EDIT */}
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-7">

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

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                  <Field
                    label="First Name"
                    value={customerFirstName}
                    onChange={setCustomerFirstName}
                  />

                  <Field
                    label="Last Name"
                    value={customerLastName}
                    onChange={setCustomerLastName}
                  />

                  <Field
                    label="Phone"
                    value={customerPhone}
                    onChange={setCustomerPhone}
                  />

                  <Field
                    label="Email Address"
                    value={customerEmail}
                    onChange={setCustomerEmail}
                    type="email"
                  />
                </div>
              </section>

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

                <div className="mt-7 grid gap-5 sm:grid-cols-2">

                  <Field
                    label="First Name"
                    value={shippingFirstName}
                    onChange={setShippingFirstName}
                  />

                  <Field
                    label="Last Name"
                    value={shippingLastName}
                    onChange={setShippingLastName}
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="Address"
                      value={shippingAddress}
                      onChange={setShippingAddress}
                    />
                  </div>

                  <Field
                    label="Apartment / Suite"
                    value={shippingApartment}
                    onChange={setShippingApartment}
                  />

                  <Field
                    label="City"
                    value={shippingCity}
                    onChange={setShippingCity}
                  />

                  <Field
                    label="State / Province"
                    value={shippingState}
                    onChange={setShippingState}
                  />

                  <Field
                    label="Postal Code"
                    value={shippingPostalCode}
                    onChange={setShippingPostalCode}
                  />

                  <Field
                    label="Country"
                    value={shippingCountry}
                    onChange={setShippingCountry}
                  />

                  <Field
                    label="Phone"
                    value={shippingPhone}
                    onChange={setShippingPhone}
                  />
                </div>
              </section>

              {/* BILLING ADDRESS */}
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-7">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

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

                  <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-[#f7f9f6] px-3 py-2 text-[10px] font-bold text-slate-600">

                    <input
                      type="checkbox"
                      checked={billingSameAsShipping}
                      onChange={(e) =>
                        setBillingSameAsShipping(
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-slate-300 accent-[#315c42]"
                    />

                    Same as shipping
                  </label>
                </div>

                {!billingSameAsShipping && (
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">

                    <Field
                      label="First Name"
                      value={billingFirstName}
                      onChange={setBillingFirstName}
                    />

                    <Field
                      label="Last Name"
                      value={billingLastName}
                      onChange={setBillingLastName}
                    />

                    <div className="sm:col-span-2">
                      <Field
                        label="Address"
                        value={billingAddress}
                        onChange={setBillingAddress}
                      />
                    </div>

                    <Field
                      label="Apartment / Suite"
                      value={billingApartment}
                      onChange={setBillingApartment}
                    />

                    <Field
                      label="City"
                      value={billingCity}
                      onChange={setBillingCity}
                    />

                    <Field
                      label="State / Province"
                      value={billingState}
                      onChange={setBillingState}
                    />

                    <Field
                      label="Postal Code"
                      value={billingPostalCode}
                      onChange={setBillingPostalCode}
                    />

                    <Field
                      label="Country"
                      value={billingCountry}
                      onChange={setBillingCountry}
                    />

                    <Field
                      label="Phone"
                      value={billingPhone}
                      onChange={setBillingPhone}
                    />
                  </div>
                )}

                {billingSameAsShipping && (
                  <div className="mt-6 flex items-center gap-3 rounded-[20px] border border-dashed border-slate-200 bg-[#fafcf9] p-5">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                      <Check className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Billing address matches shipping
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        No separate billing address will be stored.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* NOTES */}
              <div className="grid gap-6 lg:grid-cols-2">

                <EditableTextarea
                  label="Customer Notes"
                  eyebrow="Customer"
                  value={customerNotes}
                  onChange={setCustomerNotes}
                  placeholder="Customer notes..."
                  rows={6}
                />

                <EditableTextarea
                  label="Admin Notes"
                  eyebrow="Internal"
                  value={adminNotes}
                  onChange={setAdminNotes}
                  placeholder="Internal notes for your team..."
                  rows={6}
                />
              </div>

              {/* TRACKING HISTORY */}
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-7">

                <div className="flex items-center gap-3.5">

                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#10291d] text-[#c5dda8]">
                    <Truck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                      History
                    </p>

                    <h2 className="mt-1 text-base font-bold text-[#17231c]">
                      Tracking Timeline
                    </h2>
                  </div>
                </div>

                <div className="mt-7">

                  {timeline.length === 0 ? (
                    <div className="rounded-[22px] border border-dashed border-slate-200 bg-[#fafcf9] p-8 text-center">
                      <ClockIcon />
                      <p className="mt-3 text-sm font-bold text-slate-600">
                        No tracking history yet
                      </p>
                    </div>
                  ) : (
                    <div className="relative">

                      <div className="absolute bottom-5 left-[19px] top-5 w-px bg-slate-200" />

                      <div className="space-y-8">

                        {timeline.map(
                          (history, index) => (
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

                              <div className="min-w-0 flex-1">

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
                                    ] ||
                                      history.status}
                                  </span>

                                  <span className="text-[10px] text-slate-400">
                                    {formatDateTime(
                                      history.createdAt
                                    )}
                                  </span>
                                </div>

                                {history.note && (
                                  <p className="mt-3 text-sm leading-6 text-slate-600">
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
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </main>

            {/* ===================================================
                RIGHT SIDE
            =================================================== */}
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
                        Changes are saved to the order database.
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                      <Save className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">

                  {/* ORDER STATUS */}
                  <SelectField
                    label="Order Status"
                    value={orderStatus}
                    onChange={setOrderStatus}
                    options={orderStatuses.map(
                      (status) => ({
                        value: status,
                        label:
                          orderStatusLabels[
                            status
                          ] || status,
                      })
                    )}
                  />

                  {/* PAYMENT STATUS */}
                  <SelectField
                    label="Payment Status"
                    value={paymentStatus}
                    onChange={setPaymentStatus}
                    options={paymentStatuses.map(
                      (status) => ({
                        value: status,
                        label:
                          paymentStatusLabels[
                            status
                          ] || status,
                      })
                    )}
                  />

                  {/* TRACKING UPDATE */}
                  <div className="border-t border-slate-100 pt-5">

                    <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Activity Update
                    </p>

                    <div className="space-y-5">

                      <EditableTextarea
                        label="Tracking Note"
                        value={trackingNote}
                        onChange={setTrackingNote}
                        placeholder="Example: Parcel handed over to courier..."
                        rows={4}
                      />

                      <Field
                        label="Location"
                        value={trackingLocation}
                        onChange={setTrackingLocation}
                        placeholder="Example: Karachi"
                      />
                    </div>
                  </div>

                  {/* CANCELLATION */}
                  {orderStatus === "cancelled" && (
                    <div className="border-t border-slate-100 pt-5">

                      <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.18em] text-red-400">
                        Cancellation
                      </p>

                      <EditableTextarea
                        label="Cancellation Reason"
                        value={cancellationReason}
                        onChange={setCancellationReason}
                        placeholder="Enter cancellation reason..."
                        rows={4}
                      />
                    </div>
                  )}

                  <div className="rounded-[20px] border border-[#dce5dd] bg-[#fafcf9] p-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                        <Check className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#17231c]">
                          Customer notifications
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-slate-400">
                          Relevant customer-facing changes will be
                          emailed after saving. The original order
                          confirmation will not be sent again.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={saveChanges}
                    disabled={saving}
                    className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#10291d] px-5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(16,41,29,0.18)] transition hover:bg-[#193b29] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
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

                  <Field
                    label="Courier"
                    value={courier}
                    onChange={setCourier}
                    placeholder="e.g. TCS, Leopards, M&P"
                  />

                  <Field
                    label="Tracking Number"
                    value={trackingNumber}
                    onChange={setTrackingNumber}
                    placeholder="Enter tracking number"
                    mono
                    action={
                      trackingNumber ? (
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
                          {copiedValue ===
                          "tracking" ? (
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
                      ) : null
                    }
                  />

                  <Field
                    label="Estimated Delivery"
                    type="date"
                    value={estimatedDeliveryDate}
                    onChange={setEstimatedDeliveryDate}
                  />

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
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                        Delivered On
                      </p>

                      <p className="mt-1.5 text-sm font-bold text-emerald-800">
                        {formatDateTime(
                          order.shipping.deliveredAt
                        )}
                      </p>
                    </div>
                  )}
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

                  <div className="rounded-[20px] border border-slate-100 bg-[#fafcf9] p-4">

                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Payment Method
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {paymentMethods[
                        order.paymentMethod
                      ] || order.paymentMethod}
                    </p>
                  </div>

                  <Field
                    label="Transaction ID"
                    value={transactionId}
                    onChange={setTransactionId}
                    mono
                  />

                  <Field
                    label="Gateway"
                    value={gateway}
                    onChange={setGateway}
                  />

                  <Field
                    label="Reference Number"
                    value={referenceNumber}
                    onChange={setReferenceNumber}
                    mono
                  />

                  {(paymentStatus === "failed" ||
                    order.payment?.failureReason) && (
                    <EditableTextarea
                      label="Failure Reason"
                      value={failureReason}
                      onChange={setFailureReason}
                      placeholder="Explain why the payment failed..."
                      rows={4}
                    />
                  )}

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
                          href={
                            order.payment.screenshotUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold text-[#315c42] transition hover:bg-[#edf3e9]"
                        >
                          Open
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>

                      <div className="mt-4 overflow-hidden rounded-[22px] border border-slate-200 bg-[#f5f7f4]">
                        <img
                          src={
                            order.payment.screenshotUrl
                          }
                          alt="Payment proof"
                          className="max-h-[360px] w-full object-contain"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={
                          downloadPaymentProof
                        }
                        disabled={
                          downloadingProof
                        }
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
                </div>
              </section>

              {/* DANGER ZONE */}
              {/* ============================================================
    DANGER ZONE
============================================================ */}
<section className="overflow-hidden rounded-[30px] border border-red-200 bg-white">

  <div className="border-b border-red-100 bg-red-50 px-5 py-5 sm:px-6">

    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
        <AlertTriangle className="h-4 w-4" />
      </div>

      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-400">
          Danger Zone
        </p>

        <h2 className="mt-1 text-sm font-bold text-red-900">
          Order Actions
        </h2>
      </div>
    </div>
  </div>

  <div className="space-y-6 p-5 sm:p-6">

    {/* CANCEL ORDER */}
    {orderStatus !== "cancelled" ? (
      <div>

        <div className="rounded-[20px] border border-orange-100 bg-orange-50 p-4">

          <div className="flex gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
              <XCircle className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-bold text-orange-900">
                Cancel this order
              </p>

              <p className="mt-1 text-[10px] leading-5 text-orange-700/70">
                Cancelling the order will mark it as cancelled
                and record the cancellation reason.
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setCancelReasonModal(
              cancellationReason || ""
            );
            setShowCancelModal(true);
          }}
          disabled={saving || deleting}
          className="mt-4 flex h-[48px] w-full items-center justify-center gap-2 rounded-[18px] border border-orange-200 bg-orange-50 text-sm font-bold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <XCircle className="h-4 w-4" />
          Cancel Order
        </button>

      </div>
    ) : (
      /* ALREADY CANCELLED */
      <div className="rounded-[20px] border border-red-100 bg-red-50 p-4">

        <div className="flex items-start gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
            <XCircle className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-red-900">
              Order Cancelled
            </p>

            <p className="mt-1 text-[10px] leading-5 text-red-700/70">
              This order has already been cancelled.
            </p>

            {cancellationReason && (
              <div className="mt-3 rounded-xl bg-white/70 p-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-red-400">
                  Reason
                </p>

                <p className="mt-1.5 text-xs leading-5 text-red-800">
                  {cancellationReason}
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    )}

    {/* DIVIDER */}
    <div className="border-t border-slate-100" />

    {/* DELETE ORDER */}
    <div>

      <div className="rounded-[20px] border border-red-100 bg-red-50 p-4">

        <div className="flex gap-3">

          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

          <div>
            <p className="text-xs font-bold text-red-900">
              Permanently delete this order
            </p>

            <p className="mt-1 text-[10px] leading-5 text-red-700/70">
              This permanently removes the order and all of its
              stored information from the database.
            </p>
          </div>

        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setShowDeleteModal(true)
        }
        disabled={saving || cancelling}
        className="mt-4 flex h-[48px] w-full items-center justify-center gap-2 rounded-[18px] border border-red-200 bg-red-50 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 className="h-4 w-4" />
        Delete Order
      </button>

    </div>

  </div>
</section>
            </aside>
          </div>
        </div>
      </div>

      {/* ===========================================================
    CANCEL ORDER MODAL
=========================================================== */}
{showCancelModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

    <div className="w-full max-w-md overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.25)]">

      {/* HEADER */}
      <div className="bg-[#10291d] p-6 sm:p-7">

        <div className="flex items-start justify-between gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-red-400/10 text-red-300">
            <XCircle className="h-5 w-5" />
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCancelModal(false)
            }
            disabled={cancelling}
            className="rounded-xl p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <h2 className="mt-6 text-xl font-bold text-white">
          Cancel Order?
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/45">
          You are about to cancel order{" "}
          <span className="font-bold text-white">
            #{order.orderNumber}
          </span>
          . The customer will be notified about this
          customer-facing order update.
        </p>

      </div>

      {/* BODY */}
      <div className="p-6 sm:p-7">

        <div className="rounded-[20px] border border-orange-100 bg-orange-50 p-4">

          <div className="flex gap-3">

            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

            <p className="text-xs leading-5 text-orange-700">
              Please provide a reason for cancelling this order.
              This reason will be stored with the order.
            </p>

          </div>

        </div>

        <div className="mt-5">

          <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Cancellation Reason
          </label>

          <textarea
            value={cancelReasonModal}
            onChange={(e) =>
              setCancelReasonModal(
                e.target.value
              )
            }
            rows={5}
            placeholder="Example: Customer requested cancellation..."
            disabled={cancelling}
            className="w-full resize-y rounded-[20px] border border-slate-200 bg-[#fafcf9] p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5 disabled:cursor-not-allowed disabled:opacity-60"
          />

        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">

          <button
            type="button"
            onClick={() =>
              setShowCancelModal(false)
            }
            disabled={cancelling}
            className="h-[50px] rounded-[17px] border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Keep Order
          </button>

          <button
            type="button"
            onClick={cancelOrder}
            disabled={
              cancelling ||
              !cancelReasonModal.trim()
            }
            className="flex h-[50px] items-center justify-center gap-2 rounded-[17px] bg-red-600 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Confirm Cancellation
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  </div>
)}

      {/* ===========================================================
          DELETE MODAL
      =========================================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.25)]">

            <div className="bg-[#10291d] p-6 sm:p-7">

              <div className="flex items-start justify-between gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-red-400/10 text-red-300">
                  <Trash2 className="h-5 w-5" />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                  disabled={deleting}
                  className="rounded-xl p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h2 className="mt-6 text-xl font-bold text-white">
                Delete Order?
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/45">
                You are about to permanently delete order{" "}
                <span className="font-bold text-white">
                  #{order.orderNumber}
                </span>
                . All order information will be removed from
                the database.
              </p>
            </div>

            <div className="p-6 sm:p-7">

              <div className="rounded-[20px] border border-red-100 bg-red-50 p-4">

                <div className="flex gap-3">

                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                  <p className="text-xs leading-5 text-red-700">
                    This action is permanent and cannot be undone.
                    Make sure you really want to remove this order.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                  disabled={deleting}
                  className="h-[50px] rounded-[17px] border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Keep Order
                </button>

                <button
                  type="button"
                  onClick={deleteOrder}
                  disabled={deleting}
                  className="flex h-[50px] items-center justify-center gap-2 rounded-[17px] bg-red-600 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ===============================================================
   REUSABLE FIELD
================================================================ */

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  mono = false,
  action,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  mono?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">

        <label className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </label>

        {action}
      </div>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className={`h-[50px] w-full rounded-[18px] border border-slate-200 bg-[#fafcf9] px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5 ${
          mono ? "font-mono text-xs" : ""
        }`}
      />
    </div>
  );
}

/* ===============================================================
   TEXTAREA
================================================================ */

function EditableTextarea({
  label,
  eyebrow,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string;
  eyebrow?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.045)] sm:p-7">

      <div className="flex items-center gap-3.5">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#10291d]">
          <FileText className="h-5 w-5" />
        </div>

        <div>
          {eyebrow && (
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-1 text-base font-bold text-[#17231c]">
            {label}
          </h2>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        rows={rows}
        placeholder={placeholder}
        className="mt-6 w-full resize-y rounded-[22px] border border-slate-200 bg-[#fafcf9] p-5 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
      />
    </section>
  );
}

/* ===============================================================
   SELECT
================================================================ */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="h-[52px] w-full cursor-pointer appearance-none rounded-[18px] border border-slate-200 bg-[#fafcf9] px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/5"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ClockIcon() {
  return (
    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm ring-1 ring-slate-100">
      <Clock3 className="h-5 w-5" />
    </div>
  );
}