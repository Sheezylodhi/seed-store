"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  Edit3,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Save,
  ShoppingBag,
  ShieldCheck,
  Truck,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
}

interface Stats {
  totalOrders: number;
  totalSpent: number;
  deliveredOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

const formatPrice = (value: number) =>
  `₨${Number(value || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  })}`;

const formatDate = (date: string) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date: string) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [customerId, setCustomerId] = useState("");

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [stats, setStats] = useState<Stats | null>(
    null
  );

  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error"
  >("success");

  useEffect(() => {
    params.then((value) => {
      setCustomerId(value.id);
    });
  }, [params]);

  const loadCustomer = async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `/api/admin/customers/${customerId}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load customer"
        );
      }

      setCustomer(result.data.customer);
      setStats(result.data.stats);
      setOrders(result.data.orders || []);

      setName(result.data.customer.name);
      setPhone(result.data.customer.phone || "");
      setIsActive(
        result.data.customer.isActive
      );
    } catch (error) {
      console.error(error);

      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load customer"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  const saveCustomer = async () => {
    if (!customerId) return;

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        `/api/admin/customers/${customerId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone,
            isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update customer"
        );
      }

      setCustomer(result.data);
      setEditMode(false);

      setMessageType("success");
      setMessage(
        "Customer information has been updated successfully."
      );
    } catch (error) {
      console.error(error);

      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update customer"
      );
    } finally {
      setSaving(false);
    }
  };

  const closeMessage = () => {
    setMessage("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-[1550px]">
          <div className="overflow-hidden rounded-[30px] border border-[#e2e9e3] bg-white shadow-[0_20px_60px_rgba(16,41,29,0.055)]">
            <div className="relative overflow-hidden bg-[#10291d] px-6 py-10 sm:px-10">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#315c42]/40 blur-3xl" />

              <div className="relative">
                <div className="h-3 w-28 animate-pulse rounded-full bg-white/10" />
                <div className="mt-5 h-10 w-64 animate-pulse rounded-xl bg-white/10" />
                <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-white/[0.07]" />
              </div>
            </div>

            <div className="grid gap-5 p-5 md:p-8 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-[24px] bg-[#f2f6f2]"
                />
              ))}
            </div>

            <div className="px-5 pb-8 md:px-8">
              <div className="flex min-h-[280px] items-center justify-center rounded-[26px] border border-[#e6ece7] bg-[#fbfdfb]">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#315c42]">
                    <RefreshCw
                      size={22}
                      className="animate-spin"
                    />
                  </div>

                  <p className="mt-4 text-sm font-bold text-[#17231c]">
                    Loading customer profile
                  </p>

                  <p className="mt-1 text-xs text-[#89968e]">
                    Preparing account and order history...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer || !stats) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-[1550px]">
          <div className="flex min-h-[600px] items-center justify-center rounded-[30px] border border-[#e2e9e3] bg-white shadow-[0_20px_60px_rgba(16,41,29,0.055)]">
            <div className="px-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-red-50 text-red-500">
                <UserX size={34} />
              </div>

              <p className="mt-6 text-xl font-bold tracking-tight text-[#10291d]">
                Customer not found
              </p>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#718078]">
                We couldn't find the customer profile
                you're looking for.
              </p>

              <Link
                href="/admin/customers"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-2xl bg-[#10291d] px-5 text-sm font-bold text-white shadow-[0_12px_25px_rgba(16,41,29,0.12)] transition hover:bg-[#193c29]"
              >
                <ArrowLeft size={16} />
                Back to Customers
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1550px] space-y-6">

        {/* =====================================================
            PREMIUM HERO
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[32px] bg-[#10291d] shadow-[0_24px_70px_rgba(16,41,29,0.13)]">
          <div className="pointer-events-none absolute -right-28 -top-36 h-[420px] w-[420px] rounded-full bg-[#315c42]/45 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 left-[28%] h-[360px] w-[360px] rounded-full bg-[#c5dda8]/10 blur-3xl" />

          <div className="pointer-events-none absolute right-[32%] top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/[0.025] blur-2xl" />

          <div className="relative p-5 sm:p-7 lg:p-9">
            {/* Breadcrumb */}
            <div className="mb-7 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
              <Link
                href="/admin"
                className="transition hover:text-[#c5dda8]"
              >
                Dashboard
              </Link>

              <span className="text-white/15">/</span>

              <Link
                href="/admin/customers"
                className="transition hover:text-[#c5dda8]"
              >
                Customers
              </Link>

              <span className="text-white/15">/</span>

              <span className="text-white/65">
                Profile
              </span>
            </div>

            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              {/* Identity */}
              <div className="min-w-0">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1 rounded-[23px] bg-[#c5dda8]/10 blur-sm" />

                    <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-[21px] border border-white/10 bg-white/[0.08] text-lg font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)] sm:h-[76px] sm:w-[76px] sm:rounded-[23px] sm:text-xl">
                      {getInitials(customer.name)}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#c5dda8]/15 bg-[#c5dda8]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#c5dda8]">
                        <ShieldCheck size={11} />
                        Customer Profile
                      </span>

                      <StatusPill
                        active={customer.isActive}
                        dark
                      />
                    </div>

                    <h1 className="mt-3 max-w-[700px] truncate text-3xl font-bold tracking-[-0.045em] text-white sm:text-4xl lg:text-[44px]">
                      {customer.name}
                    </h1>

                    <p className="mt-2 flex items-center gap-2 text-sm text-white/45">
                      <Mail size={14} />
                      <span className="truncate">
                        {customer.email}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={loadCustomer}
                  disabled={loading || saving}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-bold text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={
                      loading
                        ? "animate-spin"
                        : ""
                    }
                  />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setEditMode(
                      (value) => !value
                    )
                  }
                  className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold transition ${
                    editMode
                      ? "border border-white/15 bg-white text-[#10291d] hover:bg-[#f1f5ef]"
                      : "bg-[#c5dda8] text-[#10291d] shadow-[0_12px_30px_rgba(197,221,168,0.14)] hover:bg-[#d5e8bd]"
                  }`}
                >
                  {editMode ? (
                    <X size={16} />
                  ) : (
                    <Edit3 size={16} />
                  )}

                  {editMode
                    ? "Close Edit"
                    : "Edit Customer"}
                </button>
              </div>
            </div>

            {/* Hero Meta */}
            <div className="mt-8 grid gap-3 border-t border-white/[0.08] pt-6 sm:grid-cols-3">
              <HeroMeta
                icon={<CalendarIcon />}
                label="Customer Since"
                value={formatDate(
                  customer.createdAt
                )}
              />

              <HeroMeta
                icon={<ShoppingBag size={15} />}
                label="Total Orders"
                value={stats.totalOrders.toLocaleString()}
              />

              <HeroMeta
                icon={<Package size={15} />}
                label="Lifetime Value"
                value={formatPrice(
                  stats.totalSpent
                )}
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            EDIT WORKSPACE
        ===================================================== */}

        {editMode && (
          <section className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_18px_55px_rgba(16,41,29,0.065)]">
            <div className="flex flex-col gap-4 border-b border-[#edf2ed] bg-[#fbfdfb] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10291d] text-[#c5dda8]">
                  <Edit3 size={17} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#89968e]">
                    Account Management
                  </p>

                  <h2 className="mt-0.5 text-lg font-bold tracking-tight text-[#10291d]">
                    Edit Customer
                  </h2>
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#dfe8e1] bg-white px-3 py-2 text-[10px] font-bold text-[#718078]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#315c42]" />
                Changes are saved to the customer account
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <Field
                label="Full Name"
                value={name}
                onChange={setName}
                icon={<CircleUserRound size={16} />}
              />

              <Field
                label="Phone"
                value={phone}
                onChange={setPhone}
                icon={<Phone size={16} />}
              />

              <div className="lg:min-w-[230px]">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#7d8b82]">
                  Account Status
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setIsActive(
                      (value) => !value
                    )
                  }
                  className={`flex h-12 w-full items-center justify-between rounded-2xl border px-4 text-sm font-bold transition ${
                    isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    />

                    {isActive
                      ? "Active Account"
                      : "Inactive Account"}
                  </span>

                  <span className="text-[10px] uppercase tracking-wider opacity-60">
                    Toggle
                  </span>
                </button>
              </div>

              <div className="lg:col-span-3">
                <div className="flex flex-col gap-4 rounded-2xl border border-[#e7eee8] bg-[#f9fcf9] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                      <Mail size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#89968e]">
                        Email Address
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-[#25382c]">
                        {customer.email}
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#9aa59e]">
                        Email is read-only from admin.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={saveCustomer}
                    disabled={saving}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#10291d] px-6 text-sm font-bold text-white shadow-[0_12px_28px_rgba(16,41,29,0.12)] transition hover:bg-[#193c29] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={16} />

                    {saving
                      ? "Saving Changes..."
                      : "Save Customer"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            PROFILE + PERFORMANCE
        ===================================================== */}

        <section className="grid gap-6 xl:grid-cols-[390px_1fr]">

          {/* PROFILE CARD */}
          <div className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_15px_50px_rgba(16,41,29,0.05)]">
            <div className="relative overflow-hidden bg-[#f8fbf8] px-6 py-6">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#edf3e9] blur-2xl" />

              <div className="relative flex items-center gap-4">
                <Avatar
                  name={customer.name}
                  large
                />

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#89968e]">
                    Account
                  </p>

                  <h2 className="mt-1 truncate text-lg font-bold text-[#10291d]">
                    Profile Information
                  </h2>

                  <div className="mt-2">
                    <StatusPill
                      active={customer.isActive}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-0 px-6">
              <InfoRow
                icon={<CircleUserRound size={16} />}
                label="Full Name"
                value={customer.name}
              />

              <InfoRow
                icon={<Mail size={16} />}
                label="Email Address"
                value={customer.email}
              />

              <InfoRow
                icon={<Phone size={16} />}
                label="Phone Number"
                value={
                  customer.phone ||
                  "Not provided"
                }
              />

              <InfoRow
                icon={<Clock3 size={16} />}
                label="Joined"
                value={formatDateTime(
                  customer.createdAt
                )}
              />

              <InfoRow
                icon={<RefreshCw size={16} />}
                label="Last Updated"
                value={formatDateTime(
                  customer.updatedAt
                )}
                last
              />
            </div>

            <div className="mx-6 mb-6 mt-2 rounded-2xl border border-[#e6eee7] bg-[#f9fcf9] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                  <ShieldCheck size={16} />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#25382c]">
                    Account Status
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#89968e]">
                    {customer.isActive
                      ? "This customer can currently access and use their account."
                      : "This customer account is currently inactive."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <CustomerStat
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingBag size={18} />}
              tone="dark"
            />

            <CustomerStat
              title="Total Spent"
              value={formatPrice(
                stats.totalSpent
              )}
              icon={<Package size={18} />}
              tone="green"
            />

            <CustomerStat
              title="Delivered"
              value={stats.deliveredOrders}
              icon={<CheckCircle2 size={18} />}
              tone="green"
            />

            <CustomerStat
              title="Pending"
              value={stats.pendingOrders}
              icon={<Clock3 size={18} />}
              tone="amber"
            />

            <CustomerStat
              title="Shipped"
              value={stats.shippedOrders}
              icon={<Truck size={18} />}
              tone="blue"
            />

            <CustomerStat
              title="Cancelled"
              value={stats.cancelledOrders}
              icon={<X size={18} />}
              tone="red"
            />

            {/* AOV */}
            <div className="group relative col-span-2 overflow-hidden rounded-[25px] border border-[#dfe8e1] bg-[#10291d] p-5 shadow-[0_15px_45px_rgba(16,41,29,0.08)] md:col-span-3">
              <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#315c42]/40 blur-2xl transition group-hover:scale-110" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c5dda8]/65">
                    Customer Value
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">
                    {formatPrice(
                      stats.averageOrderValue
                    )}
                  </p>

                  <p className="mt-1 text-[11px] text-white/40">
                    Average order value across this customer's purchase history
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.06] text-[#c5dda8]">
                  <Package size={22} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ORDER HISTORY
        ===================================================== */}

        <section className="overflow-hidden rounded-[30px] border border-[#dfe8e1] bg-white shadow-[0_18px_55px_rgba(16,41,29,0.055)]">

          {/* Header */}
          <div className="relative overflow-hidden border-b border-[#e9efe9] bg-[#fbfdfb] px-5 py-6 sm:px-7">
            <div className="pointer-events-none absolute -right-10 -top-20 h-40 w-40 rounded-full bg-[#edf3e9] blur-3xl" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#10291d] text-[#c5dda8] shadow-[0_8px_20px_rgba(16,41,29,0.1)]">
                  <ShoppingBag size={18} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#89968e]">
                    Customer History
                  </p>

                  <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[#10291d]">
                    Order History
                  </h2>

                  <p className="mt-1 text-[11px] text-[#89968e]">
                    Complete purchase activity for this customer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-xl border border-[#dfe8e1] bg-white px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#718078] shadow-sm">
                  {orders.length}{" "}
                  {orders.length === 1
                    ? "Order"
                    : "Orders"}
                </div>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[21px] bg-[#edf3e9] text-[#89968e]">
                <ShoppingBag size={28} />
              </div>

              <p className="mt-5 text-sm font-bold text-[#17231c]">
                No orders yet
              </p>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#89968e]">
                This customer has not placed any
                orders yet.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1120px]">
                  <thead>
                    <tr className="border-b border-[#edf2ed] bg-[#f8fbf8] text-left">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#819087]">
                        Order
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#819087]">
                        Products
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#819087]">
                        Total
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#819087]">
                        Payment
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#819087]">
                        Status
                      </th>

                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#819087]">
                        Date
                      </th>

                      <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.16em] text-[#819087]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#edf2ed]">
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="group transition hover:bg-[#fbfdfb]"
                      >
                        {/* ORDER */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42] transition group-hover:bg-[#10291d] group-hover:text-[#c5dda8]">
                              <Package size={15} />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-[#10291d]">
                                #{order.orderNumber}
                              </p>

                              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#9aa59e]">
                                Order
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* PRODUCTS */}
                        <td className="px-6 py-5">
                          <div className="max-w-[310px]">
                            <p className="truncate text-sm font-semibold text-[#34453a]">
                              {order.items
                                .map(
                                  (item) =>
                                    `${item.name} × ${item.quantity}`
                                )
                                .join(", ")}
                            </p>

                            <div className="mt-2 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#315c42]" />

                              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#89968e]">
                                {order.items.length}{" "}
                                {order.items.length ===
                                1
                                  ? "Product"
                                  : "Products"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* TOTAL */}
                        <td className="px-6 py-5">
                          <p className="text-base font-bold tracking-tight text-[#10291d]">
                            {formatPrice(
                              order.total
                            )}
                          </p>

                          <p className="mt-1 text-[10px] text-[#9aa59e]">
                            Order total
                          </p>
                        </td>

                        {/* PAYMENT */}
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold capitalize text-[#34453a]">
                            {order.paymentMethod.replace(
                              "_",
                              " "
                            )}
                          </p>

                          <PaymentBadge
                            status={
                              order.paymentStatus
                            }
                          />
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          <OrderStatusBadge
                            status={
                              order.orderStatus
                            }
                          />
                        </td>

                        {/* DATE */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs font-medium text-[#68766d]">
                            <Clock3
                              size={13}
                              className="text-[#9aa69e]"
                            />

                            {formatDate(
                              order.createdAt
                            )}
                          </div>
                        </td>

                        {/* ACTION */}
                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="group/order inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce7dd] bg-white px-4 text-xs font-bold text-[#10291d] shadow-sm transition hover:border-[#bfcfc2] hover:bg-[#f3f8f3] hover:shadow-md"
                          >
                            View Order

                            <ArrowRight
                              size={14}
                              className="transition-transform group-hover/order:translate-x-0.5"
                            />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE ORDERS */}
              <div className="space-y-3 p-4 lg:hidden">
                {orders.map((order) => (
                  <Link
                    key={order._id}
                    href={`/admin/orders/${order._id}`}
                    className="group block overflow-hidden rounded-[22px] border border-[#e1e9e2] bg-white transition hover:border-[#cbd9ce] hover:shadow-[0_12px_30px_rgba(16,41,29,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-[#edf2ed] bg-[#fbfdfb] p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10291d] text-[#c5dda8]">
                          <Package size={15} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#10291d]">
                            #{order.orderNumber}
                          </p>

                          <p className="mt-1 text-[10px] text-[#89968e]">
                            {formatDate(
                              order.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      <OrderStatusBadge
                        status={
                          order.orderStatus
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4">
                      <MobileOrderStat
                        label="Total"
                        value={formatPrice(
                          order.total
                        )}
                      />

                      <MobileOrderStat
                        label="Products"
                        value={`${order.items.length}`}
                      />

                      <MobileOrderStat
                        label="Payment"
                        value={order.paymentMethod.replace(
                          "_",
                          " "
                        )}
                      />

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#89968e]">
                          Payment Status
                        </p>

                        <div className="mt-1">
                          <PaymentBadge
                            status={
                              order.paymentStatus
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#edf2ed] px-4 py-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aa59e]">
                        Open order details
                      </span>

                      <span className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#10291d] px-3.5 text-xs font-bold text-white">
                        View
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* =====================================================
          MESSAGE MODAL
      ===================================================== */}

      {message && (
        <MessageModal
          type={messageType}
          message={message}
          onClose={closeMessage}
        />
      )}
    </div>
  );
}

/* =========================================================
   HERO META
========================================================= */

function HeroMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c5dda8]/10 text-[#c5dda8]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-bold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   CALENDAR ICON
========================================================= */

function CalendarIcon() {
  return (
    <div className="text-[13px] font-bold">
      <span className="relative flex h-4 w-4 items-center justify-center rounded-[4px] border border-current">
        <span className="absolute left-0 right-0 top-[3px] border-t border-current" />
      </span>
    </div>
  );
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name: string) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C"
  );
}

/* =========================================================
   AVATAR
========================================================= */

function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-[#315c42]/10 bg-[#10291d] font-bold text-white shadow-[0_10px_25px_rgba(16,41,29,0.12)] ${
        large
          ? "h-[68px] w-[68px] rounded-[21px] text-lg"
          : "h-11 w-11 rounded-[15px] text-xs"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#315c42] via-[#193c29] to-[#10291d]" />

      <div className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 rounded-full bg-[#c5dda8]/10 blur-xl" />

      <span className="relative">
        {getInitials(name)}
      </span>
    </div>
  );
}

/* =========================================================
   STATUS PILL
========================================================= */

function StatusPill({
  active,
  dark = false,
}: {
  active: boolean;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] ${
        active
          ? dark
            ? "border-emerald-300/10 bg-emerald-300/10 text-[#c5dda8]"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
          : dark
          ? "border-red-300/10 bg-red-300/10 text-red-200"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? dark
              ? "bg-[#c5dda8]"
              : "bg-emerald-500"
            : "bg-red-500"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 py-4 ${
        last
          ? ""
          : "border-b border-[#edf2ed]"
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#89968e]">
          {label}
        </p>

        <p className="mt-1 break-all text-sm font-semibold leading-5 text-[#25382c]">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#7d8b82]">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a978f]">
            {icon}
          </div>
        )}

        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className={`h-12 w-full rounded-2xl border border-[#dce7dd] bg-white text-sm font-semibold text-[#10291d] outline-none transition placeholder:text-[#a1aaa5] focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.07] ${
            icon
              ? "pl-11 pr-4"
              : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   CUSTOMER STAT
========================================================= */

function CustomerStat({
  title,
  value,
  icon,
  tone = "dark",
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: "dark" | "green" | "amber" | "blue" | "red";
}) {
  const toneClasses = {
    dark: {
      icon: "bg-[#10291d] text-[#c5dda8]",
      dot: "bg-[#315c42]",
    },
    green: {
      icon: "bg-[#edf7ef] text-[#28713d]",
      dot: "bg-emerald-500",
    },
    amber: {
      icon: "bg-[#fff7e5] text-[#a06f16]",
      dot: "bg-amber-500",
    },
    blue: {
      icon: "bg-[#edf3ff] text-[#315e9d]",
      dot: "bg-blue-500",
    },
    red: {
      icon: "bg-[#fdf0f0] text-[#a04444]",
      dot: "bg-red-500",
    },
  };

  const current =
    toneClasses[tone];

  return (
    <div className="group relative overflow-hidden rounded-[25px] border border-[#dfe8e1] bg-white p-5 shadow-[0_12px_38px_rgba(16,41,29,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-[#cbd9ce] hover:shadow-[0_18px_45px_rgba(16,41,29,0.07)]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#edf3e9] opacity-0 blur-2xl transition group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-[15px] ${current.icon}`}
        >
          {icon}
        </div>

        <span
          className={`mt-1 h-2 w-2 rounded-full ${current.dot}`}
        />
      </div>

      <div className="relative mt-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#89968e]">
          {title}
        </p>

        <p className="mt-1 truncate text-[25px] font-bold tracking-[-0.035em] text-[#10291d]">
          {typeof value === "number"
            ? value.toLocaleString()
            : value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT BADGE
========================================================= */

function PaymentBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
    failed:
      "border-red-200 bg-red-50 text-red-700",
    cancelled:
      "border-red-200 bg-red-50 text-red-700",
    refunded:
      "border-purple-200 bg-purple-50 text-purple-700",
    partially_refunded:
      "border-purple-200 bg-purple-50 text-purple-700",
    processing:
      "border-blue-200 bg-blue-50 text-blue-700",
    pending:
      "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`mt-1 inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[9px] font-bold capitalize ${
        styles[status] ||
        "border-[#e1e8e2] bg-[#f4f7f4] text-[#68766d]"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />

      {status.replace("_", " ")}
    </span>
  );
}

/* =========================================================
   ORDER STATUS BADGE
========================================================= */

function OrderStatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    pending:
      "border-amber-200 bg-amber-50 text-amber-700",
    confirmed:
      "border-blue-200 bg-blue-50 text-blue-700",
    processing:
      "border-indigo-200 bg-indigo-50 text-indigo-700",
    shipped:
      "border-cyan-200 bg-cyan-50 text-cyan-700",
    out_for_delivery:
      "border-cyan-200 bg-cyan-50 text-cyan-700",
    delivered:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    cancelled:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[9px] font-bold capitalize ${
        styles[status] ||
        "border-[#e1e8e2] bg-[#f4f7f4] text-[#68766d]"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />

      {status.replace("_", " ")}
    </span>
  );
}

/* =========================================================
   MOBILE ORDER STAT
========================================================= */

function MobileOrderStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#89968e]">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold capitalize text-[#10291d]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   MESSAGE MODAL
========================================================= */

function MessageModal({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  const success = type === "success";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07150e]/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[430px] overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_30px_90px_rgba(16,41,29,0.22)]">
        <div className="relative overflow-hidden bg-[#10291d] px-6 py-7 text-center">
          <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#315c42]/45 blur-3xl" />

          <div
            className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-[21px] ${
              success
                ? "bg-[#c5dda8] text-[#10291d]"
                : "bg-red-400/15 text-red-200"
            }`}
          >
            {success ? (
              <Check
                size={28}
                strokeWidth={2.5}
              />
            ) : (
              <X
                size={28}
                strokeWidth={2.5}
              />
            )}
          </div>

          <p className="relative mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            {success
              ? "Update Complete"
              : "Action Failed"}
          </p>

          <h3 className="relative mt-1 text-xl font-bold tracking-tight text-white">
            {success
              ? "Customer Updated"
              : "Something went wrong"}
          </h3>
        </div>

        <div className="p-6">
          <p className="text-center text-sm leading-6 text-[#68766d]">
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#10291d] px-5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(16,41,29,0.12)] transition hover:bg-[#193c29]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}