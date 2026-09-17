"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Eye,
  Filter,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Truck,
  X,
  XCircle,
} from "lucide-react";

type Order = {
  _id: string;
  orderNumber: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
    packSize?: string;
    sku?: string;
  }[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

type Stats = {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  revenue: number;
};

const orderStatusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
};

const paymentMethodLabels: Record<string, string> = {
  cod: "Cash on Delivery",
  card: "Card",
  bank_transfer: "Bank Transfer",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

function formatPrice(value: number) {
  return `₨${Number(value || 0).toLocaleString("en-PK")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderStatusClass(status: string) {
  switch (status) {
    case "pending":
      return "border-[#ead9a7] bg-[#fffaf0] text-[#97731b]";

    case "confirmed":
      return "border-[#cbdcf0] bg-[#f3f8fd] text-[#376a9a]";

    case "processing":
      return "border-[#ddd3ef] bg-[#f8f5fc] text-[#73539d]";

    case "shipped":
    case "out_for_delivery":
      return "border-[#d2d8ed] bg-[#f5f7fc] text-[#52659d]";

    case "delivered":
      return "border-[#cbe3d2] bg-[#f2faf4] text-[#3f7d50]";

    case "cancelled":
      return "border-[#edd0d0] bg-[#fdf5f5] text-[#a45656]";

    default:
      return "border-[#dce3dd] bg-[#f7f9f7] text-[#657068]";
  }
}

function getPaymentStatusClass(status: string) {
  switch (status) {
    case "paid":
      return "bg-[#eef8f1] text-[#3f7d50]";

    case "failed":
    case "cancelled":
    case "refunded":
      return "bg-[#fdf1f1] text-[#a45656]";

    case "processing":
      return "bg-[#f1f6fb] text-[#416f99]";

    default:
      return "bg-[#fff8e9] text-[#97731b]";
  }
}

function getOrderStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return Clock3;

    case "confirmed":
      return CheckCircle2;

    case "processing":
      return Package;

    case "shipped":
    case "out_for_delivery":
      return Truck;

    case "delivered":
      return CheckCircle2;

    case "cancelled":
      return XCircle;

    default:
      return Package;
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search) params.set("search", search);
      if (status) params.set("orderStatus", status);
      if (paymentStatus) params.set("paymentStatus", paymentStatus);
      if (paymentMethod) params.set("paymentMethod", paymentMethod);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      params.set("page", String(page));
      params.set("limit", "20");

      const response = await fetch(
        `/api/admin/orders?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load orders");
      }

      setOrders(result.data.orders || []);
      setStats(result.data.stats);
      setTotalPages(result.data.pagination.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    search,
    status,
    paymentStatus,
    paymentMethod,
    from,
    to,
    page,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchOrders]);

  function clearFilters() {
    setSearch("");
    setStatus("");
    setPaymentStatus("");
    setPaymentMethod("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  const activeFilters = useMemo(() => {
    return [
      status,
      paymentStatus,
      paymentMethod,
      from,
      to,
    ].filter(Boolean).length;
  }, [
    status,
    paymentStatus,
    paymentMethod,
    from,
    to,
  ]);

  const hasAnyFilter =
    Boolean(search) ||
    Boolean(status) ||
    Boolean(paymentStatus) ||
    Boolean(paymentMethod) ||
    Boolean(from) ||
    Boolean(to);

  const statCards = [
    {
      title: "Total orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      accent: "bg-[#edf3e9] text-[#315c42]",
    },
    {
      title: "Awaiting action",
      value: stats.pendingOrders,
      icon: Clock3,
      accent: "bg-[#fff7e8] text-[#98751f]",
    },
    {
      title: "Processing",
      value: stats.processingOrders,
      icon: Package,
      accent: "bg-[#f5f0fb] text-[#75559d]",
    },
    {
      title: "In transit",
      value: stats.shippedOrders,
      icon: Truck,
      accent: "bg-[#f0f4fb] text-[#52679e]",
    },
    {
      title: "Delivered",
      value: stats.deliveredOrders,
      icon: CheckCircle2,
      accent: "bg-[#edf8f0] text-[#3f7d50]",
    },
    {
      title: "Cancelled",
      value: stats.cancelledOrders,
      icon: XCircle,
      accent: "bg-[#fcf1f1] text-[#a45656]",
    },
  ];

  return (
    <div className="relative min-h-full overflow-hidden bg-white">
    

      <div className="relative mx-auto max-w-[1680px] px-4 pb-16 pt-5 sm:px-6 lg:px-8 xl:px-10">
        {/* =========================================================
            HEADER
        ========================================================= */}
        <section className="relative mb-5 overflow-hidden rounded-[32px] bg-[#10291d] shadow-[0_30px_90px_rgba(16,41,29,0.20)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-32 h-[380px] w-[380px] rounded-full border border-white/[0.06]" />
            <div className="absolute right-20 top-10 h-[220px] w-[220px] rounded-full bg-[#315c42]/30 blur-3xl" />
            <div className="absolute -bottom-40 left-[35%] h-[420px] w-[420px] rounded-full bg-[#c5dda8]/[0.06] blur-3xl" />
            <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#c5dda8]/20 to-transparent" />
          </div>

          <div className="relative px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
            <div className="mb-7 flex items-center gap-2 text-[11px] font-medium text-white/40">
              <Link
                href="/admin"
                className="transition hover:text-white/80"
              >
                Dashboard
              </Link>

              <span className="text-white/20">/</span>

              <span className="text-[#c5dda8]/80">
                Order Management
              </span>
            </div>

            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[19px] border border-white/10 bg-white/[0.07] shadow-inner">
                    <ShoppingBag className="h-6 w-6 text-[#c5dda8]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c5dda8]" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#c5dda8]/70">
                        Commerce operations
                      </p>
                    </div>

                    <h1 className="mt-1 text-[34px] font-semibold tracking-[-0.055em] text-white sm:text-[42px]">
                      Orders
                    </h1>
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-white/45 sm:text-[15px]">
                  A focused workspace for tracking customer orders,
                  payments, fulfillment and delivery.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 sm:block">
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/30">
                    Gross revenue
                  </p>

                  <p className="mt-1 text-base font-bold tracking-[-0.02em] text-white">
                    {formatPrice(stats.revenue)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchOrders}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#c5dda8] px-5 text-sm font-bold text-[#10291d] shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition duration-200 hover:bg-[#d4e8bd] active:scale-[0.98] disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {/* Header intelligence */}
            <div className="mt-8 grid grid-cols-2 border-t border-white/[0.08] pt-6 sm:grid-cols-4">
              <div className="border-r border-white/[0.08] pr-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Total
                </p>
                <p className="mt-1.5 text-xl font-semibold text-white">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="border-r border-white/[0.08] px-4 sm:pl-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Pending
                </p>
                <p className="mt-1.5 text-xl font-semibold text-[#e3d6a5]">
                  {stats.pendingOrders}
                </p>
              </div>

              <div className="border-r border-white/[0.08] px-4 sm:pl-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Processing
                </p>
                <p className="mt-1.5 text-xl font-semibold text-[#c5dda8]">
                  {stats.processingOrders}
                </p>
              </div>

              <div className="pl-4 sm:pl-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Delivered
                </p>
                <p className="mt-1.5 text-xl font-semibold text-[#b8d9c0]">
                  {stats.deliveredOrders}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            STATS STRIP
        ========================================================= */}
        <section className="mb-5 overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-[0_15px_50px_rgba(16,41,29,0.055)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className={`group relative p-5 transition duration-300 hover:bg-[#fbfcfa] ${
                    index !== statCards.length - 1
                      ? "border-b border-[#e9eee9] sm:border-r lg:border-b-0"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-[13px] ${stat.accent}`}
                    >
                      <Icon className="h-[17px] w-[17px]" />
                    </div>

                    <ArrowRight className="h-3.5 w-3.5 text-[#c7cec8] opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b968f]">
                    {stat.title}
                  </p>

                  <p className="mt-1 text-[25px] font-semibold tracking-[-0.045em] text-[#17231c]">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#e9eee9] px-5 py-3.5 sm:px-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#8b968f]">
              <span>
                Revenue{" "}
                <strong className="font-bold text-[#315c42]">
                  {formatPrice(stats.revenue)}
                </strong>
              </span>

              <span className="hidden h-3 w-px bg-[#dfe5df] sm:block" />

              <span>
                {stats.deliveredOrders} successfully delivered
              </span>

              <span className="hidden h-3 w-px bg-[#dfe5df] sm:block" />

              <span>
                {stats.cancelledOrders} cancelled
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================
            FILTER COMMAND CENTER
        ========================================================= */}
        <section className="mb-5 overflow-hidden rounded-[28px] border border-[#dce5dd] bg-white shadow-[0_18px_55px_rgba(16,41,29,0.065)]">
          {/* Search row */}
          <div className="border-b border-[#e9eee9] p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#89958d]" />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by order number, customer name, phone or email..."
                  className="h-[52px] w-full rounded-[17px] border border-[#dce5dd] bg-[#f7f9f6] pl-11 pr-12 text-sm font-medium text-[#17231c] outline-none transition placeholder:text-[#9aa49e] focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/[0.06]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#89958d] transition hover:bg-[#edf3e9] hover:text-[#10291d]"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setFiltersOpen((value) => !value)}
                className={`inline-flex h-[52px] items-center justify-center gap-2 rounded-[17px] border px-5 text-sm font-bold transition ${
                  filtersOpen || activeFilters > 0
                    ? "border-[#315c42] bg-[#10291d] text-white shadow-[0_8px_25px_rgba(16,41,29,0.12)]"
                    : "border-[#dce5dd] bg-white text-[#536158] hover:border-[#b9c8ba] hover:bg-[#f8faf7]"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />

                Filters

                {activeFilters > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c5dda8] px-1.5 text-[10px] font-black text-[#10291d]">
                    {activeFilters}
                  </span>
                )}

                <ChevronDown
                  className={`ml-1 h-4 w-4 transition ${
                    filtersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {hasAnyFilter && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[17px] px-4 text-sm font-semibold text-[#718078] transition hover:bg-[#f3f6f2] hover:text-[#10291d]"
                >
                  <X className="h-3.5 w-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Advanced filters */}
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ${
              filtersOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="bg-[#fbfcfa] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                      <Filter className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#89948d]">
                        Refine results
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-[#536158]">
                        Narrow down your order list
                      </p>
                    </div>
                  </div>

                  {activeFilters > 0 && (
                    <span className="text-[10px] font-semibold text-[#89948d]">
                      {activeFilters} filter
                      {activeFilters !== 1 ? "s" : ""} active
                    </span>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {/* Order status */}
                  <label className="group">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#89948d]">
                      Order status
                    </span>

                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value);
                          setPage(1);
                        }}
                        className="h-12 w-full appearance-none rounded-[15px] border border-[#dce5dd] bg-white px-4 pr-10 text-sm font-semibold text-[#536158] outline-none transition hover:border-[#c7d3c8] focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.06]"
                      >
                        <option value="">All order statuses</option>

                        {Object.entries(orderStatusLabels).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#89958d]" />
                    </div>
                  </label>

                  {/* Payment status */}
                  <label>
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#89948d]">
                      Payment status
                    </span>

                    <div className="relative">
                      <select
                        value={paymentStatus}
                        onChange={(e) => {
                          setPaymentStatus(e.target.value);
                          setPage(1);
                        }}
                        className="h-12 w-full appearance-none rounded-[15px] border border-[#dce5dd] bg-white px-4 pr-10 text-sm font-semibold text-[#536158] outline-none transition hover:border-[#c7d3c8] focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.06]"
                      >
                        <option value="">All payment statuses</option>

                        {Object.entries(paymentStatusLabels).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#89958d]" />
                    </div>
                  </label>

                  {/* Payment method */}
                  <label>
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#89948d]">
                      Payment method
                    </span>

                    <div className="relative">
                      <select
                        value={paymentMethod}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                          setPage(1);
                        }}
                        className="h-12 w-full appearance-none rounded-[15px] border border-[#dce5dd] bg-white px-4 pr-10 text-sm font-semibold text-[#536158] outline-none transition hover:border-[#c7d3c8] focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.06]"
                      >
                        <option value="">All payment methods</option>

                        {Object.entries(paymentMethodLabels).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          )
                        )}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#89958d]" />
                    </div>
                  </label>

                  {/* Date range */}
                  <div>
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#89948d]">
                      Date range
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aa49e]" />

                        <input
                          type="date"
                          value={from}
                          onChange={(e) => {
                            setFrom(e.target.value);
                            setPage(1);
                          }}
                          className="h-12 w-full rounded-[15px] border border-[#dce5dd] bg-white pl-9 pr-2 text-xs font-semibold text-[#536158] outline-none transition focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.06]"
                          aria-label="From date"
                        />
                      </div>

                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aa49e]" />

                        <input
                          type="date"
                          value={to}
                          onChange={(e) => {
                            setTo(e.target.value);
                            setPage(1);
                          }}
                          className="h-12 w-full rounded-[15px] border border-[#dce5dd] bg-white pl-9 pr-2 text-xs font-semibold text-[#536158] outline-none transition focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.06]"
                          aria-label="To date"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active filter summary */}
                {activeFilters > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#e7ece7] pt-4">
                    <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aa49e]">
                      Active
                    </span>

                    {status && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#edf3e9] px-2.5 py-1.5 text-[10px] font-bold text-[#315c42]">
                        {orderStatusLabels[status]}
                        <button
                          type="button"
                          onClick={() => {
                            setStatus("");
                            setPage(1);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {paymentStatus && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f1f6fb] px-2.5 py-1.5 text-[10px] font-bold text-[#416f99]">
                        {paymentStatusLabels[paymentStatus]}
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentStatus("");
                            setPage(1);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {paymentMethod && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f0fb] px-2.5 py-1.5 text-[10px] font-bold text-[#75559d]">
                        {paymentMethodLabels[paymentMethod]}
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMethod("");
                            setPage(1);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {from && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f7f5] px-2.5 py-1.5 text-[10px] font-bold text-[#657068]">
                        From {from}
                        <button
                          type="button"
                          onClick={() => {
                            setFrom("");
                            setPage(1);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}

                    {to && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f7f5] px-2.5 py-1.5 text-[10px] font-bold text-[#657068]">
                        To {to}
                        <button
                          type="button"
                          onClick={() => {
                            setTo("");
                            setPage(1);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            ORDER LIST
        ========================================================= */}
        <section className="overflow-hidden rounded-[30px] border border-[#dce5dd] bg-white shadow-[0_22px_70px_rgba(16,41,29,0.075)]">
          {/* List heading */}
          <div className="border-b border-[#e8eee8] px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#10291d] text-[#c5dda8] shadow-[0_8px_20px_rgba(16,41,29,0.12)]">
                  <ShoppingBag className="h-[18px] w-[18px]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-bold tracking-[-0.02em] text-[#17231c]">
                      Order directory
                    </h2>

                    {!loading && (
                      <span className="rounded-md bg-[#edf3e9] px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#315c42]">
                        {orders.length} results
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-[#89948d]">
                    Customer orders and fulfillment activity
                  </p>
                </div>
              </div>

              {!loading && orders.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="hidden text-right sm:block">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#a0aaa3]">
                      Current page
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-[#536158]">
                      {page} / {totalPages}
                    </p>
                  </div>

                  <div className="h-8 w-px bg-[#e3e9e3] hidden sm:block" />

                  <div className="flex items-center gap-2 rounded-xl bg-[#f6f8f5] px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5c8b68]" />
                    <span className="text-[10px] font-bold text-[#718078]">
                      Live data
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center px-6">
              <div className="relative">
                <div className="flex h-[70px] w-[70px] items-center justify-center rounded-[22px] bg-[#edf3e9] text-[#10291d]">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>

                <div className="absolute -inset-2 rounded-[26px] border border-[#dce8dc]" />
              </div>

              <p className="mt-6 text-sm font-bold text-[#536158]">
                Loading order directory
              </p>

              <p className="mt-1.5 text-xs text-[#9aa49e]">
                Syncing the latest commerce data...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-[74px] w-[74px] items-center justify-center rounded-[24px] bg-[#edf3e9] text-[#315c42]">
                <AlertCircle className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-xl font-semibold tracking-[-0.025em] text-[#17231c]">
                No matching orders
              </h3>

              <p className="mt-2 max-w-[430px] text-sm leading-6 text-[#89948d]">
                Nothing in the order directory matches your current
                search and filter criteria.
              </p>

              {hasAnyFilter && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#10291d] px-5 text-sm font-bold text-white transition hover:bg-[#193a29]"
                >
                  Clear all filters
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <>
              {/* =====================================================
                  DESKTOP TABLE
              ===================================================== */}
              <div className="hidden overflow-x-auto xl:block">
                <table className="w-full min-w-[1250px]">
                  <thead>
                    <tr className="border-b border-[#e7ece7] bg-[#fafcf9]">
                      <th className="px-7 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-[#8b968f]">
                        Order
                      </th>

                      <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-[#8b968f]">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-[#8b968f]">
                        Basket
                      </th>

                      <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-[#8b968f]">
                        Amount
                      </th>

                      <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-[#8b968f]">
                        Payment
                      </th>

                      <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-[#8b968f]">
                        Fulfillment
                      </th>

                      <th className="px-5 py-4 text-left text-[9px] font-black uppercase tracking-[0.16em] text-[#8b968f]">
                        Created
                      </th>

                      <th className="px-7 py-4 text-right text-[9px] font-black uppercase tracking-[0.16em] text-[#8b968f]">
                        Open
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#edf1ed]">
                    {orders.map((order) => {
                      const customerName = `${order.customerInfo.firstName} ${order.customerInfo.lastName}`;

                      const totalItems = order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      );

                      const StatusIcon = getOrderStatusIcon(
                        order.orderStatus
                      );

                      return (
                        <tr
                          key={order._id}
                          className="group transition duration-200 hover:bg-[#fbfcfa]"
                        >
                          {/* Order */}
                          <td className="px-7 py-5">
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="block"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border border-[#dce5dd] bg-white text-[#315c42] shadow-sm transition group-hover:border-[#c7d8c8] group-hover:bg-[#edf3e9]">
                                  <ShoppingBag className="h-4 w-4" />
                                </div>

                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-black tracking-[-0.015em] text-[#10291d]">
                                      #{order.orderNumber}
                                    </span>

                                    <ArrowRight className="h-3 w-3 text-[#9da8a0] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                                  </div>

                                  <p className="mt-1 text-[10px] font-medium text-[#9aa49e]">
                                    {order.items.length} product
                                    {order.items.length !== 1
                                      ? "s"
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </td>

                          {/* Customer */}
                          <td className="px-5 py-5">
                            <p className="text-[13px] font-bold text-[#26352c]">
                              {customerName}
                            </p>

                            <p className="mt-1 text-[11px] font-medium text-[#89948d]">
                              {order.customerInfo.phone}
                            </p>

                            {order.customerInfo.email && (
                              <p className="mt-0.5 max-w-[190px] truncate text-[10px] text-[#a0aaa3]">
                                {order.customerInfo.email}
                              </p>
                            )}
                          </td>

                          {/* Basket */}
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#f0f5ef] text-[#315c42]">
                                <Package className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-[13px] font-bold text-[#26352c]">
                                  {totalItems} item
                                  {totalItems !== 1 ? "s" : ""}
                                </p>

                                <p className="mt-1 max-w-[200px] truncate text-[10px] text-[#9aa49e]">
                                  {order.items
                                    .map((item) => item.name)
                                    .join(", ")}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-5">
                            <p className="text-[14px] font-black tracking-[-0.02em] text-[#17231c]">
                              {formatPrice(order.total)}
                            </p>

                            {order.discount > 0 && (
                              <p className="mt-1 text-[10px] font-bold text-[#5d8768]">
                                − {formatPrice(order.discount)}
                              </p>
                            )}
                          </td>

                          {/* Payment */}
                          <td className="px-5 py-5">
                            <p className="text-[11px] font-bold text-[#536158]">
                              {paymentMethodLabels[
                                order.paymentMethod
                              ] || order.paymentMethod}
                            </p>

                            <span
                              className={`mt-2 inline-flex rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.07em] ${getPaymentStatusClass(
                                order.paymentStatus
                              )}`}
                            >
                              {paymentStatusLabels[
                                order.paymentStatus
                              ] || order.paymentStatus}
                            </span>
                          </td>

                          {/* Fulfillment */}
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-[10px] border px-3 py-2 text-[10px] font-bold ${getOrderStatusClass(
                                order.orderStatus
                              )}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />

                              {orderStatusLabels[
                                order.orderStatus
                              ] || order.orderStatus}
                            </span>
                          </td>

                          {/* Created */}
                          <td className="whitespace-nowrap px-5 py-5">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-3.5 w-3.5 text-[#a1aaa4]" />

                              <div>
                                <p className="text-[11px] font-semibold text-[#536158]">
                                  {formatDateTime(order.createdAt)}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="px-7 py-5 text-right">
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce5dd] bg-white px-3.5 text-[11px] font-bold text-[#536158] shadow-sm transition hover:border-[#315c42] hover:bg-[#edf3e9] hover:text-[#10291d]"
                              aria-label={`View order ${order.orderNumber}`}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* =====================================================
                  TABLET
              ===================================================== */}
              <div className="hidden divide-y divide-[#edf1ed] md:block xl:hidden">
                {orders.map((order) => {
                  const customerName = `${order.customerInfo.firstName} ${order.customerInfo.lastName}`;

                  const totalItems = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );

                  const StatusIcon = getOrderStatusIcon(
                    order.orderStatus
                  );

                  return (
                    <Link
                      href={`/admin/orders/${order._id}`}
                      key={order._id}
                      className="block p-5 transition hover:bg-[#fbfcfa]"
                    >
                      <div className="grid grid-cols-[1.3fr_1fr_1fr_auto] items-center gap-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                            <ShoppingBag className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-black text-[#10291d]">
                              #{order.orderNumber}
                            </p>

                            <p className="mt-1 text-[11px] text-[#89948d]">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-[#26352c]">
                            {customerName}
                          </p>

                          <p className="mt-1 text-[10px] text-[#89948d]">
                            {order.customerInfo.phone}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-black text-[#17231c]">
                            {formatPrice(order.total)}
                          </p>

                          <p className="mt-1 text-[10px] text-[#89948d]">
                            {totalItems} item
                            {totalItems !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-[10px] border px-3 py-2 text-[10px] font-bold ${getOrderStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {orderStatusLabels[
                            order.orderStatus
                          ] || order.orderStatus}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* =====================================================
                  MOBILE
              ===================================================== */}
              <div className="divide-y divide-[#edf1ed] md:hidden">
                {orders.map((order) => {
                  const customerName = `${order.customerInfo.firstName} ${order.customerInfo.lastName}`;

                  const totalItems = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );

                  const StatusIcon = getOrderStatusIcon(
                    order.orderStatus
                  );

                  return (
                    <Link
                      href={`/admin/orders/${order._id}`}
                      key={order._id}
                      className="block p-5 transition active:bg-[#f7faf6]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#10291d] text-[#c5dda8]">
                            <ShoppingBag className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-[#10291d]">
                                #{order.orderNumber}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-[11px] text-[#89948d]">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-[#9aa49e]" />
                      </div>

                      <div className="mt-5 rounded-[17px] bg-[#f8faf7] p-4">
                        <p className="text-[13px] font-bold text-[#26352c]">
                          {customerName}
                        </p>

                        <p className="mt-1 text-[11px] text-[#89948d]">
                          {order.customerInfo.phone}
                        </p>

                        {order.customerInfo.email && (
                          <p className="mt-0.5 truncate text-[10px] text-[#a0aaa3]">
                            {order.customerInfo.email}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#a0aaa3]">
                            Order value
                          </p>

                          <p className="mt-1 text-lg font-black tracking-[-0.025em] text-[#10291d]">
                            {formatPrice(order.total)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#a0aaa3]">
                            Items
                          </p>

                          <p className="mt-1 text-lg font-black tracking-[-0.025em] text-[#17231c]">
                            {totalItems}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1ed] pt-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-[10px] border px-3 py-1.5 text-[10px] font-bold ${getOrderStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />

                          {orderStatusLabels[
                            order.orderStatus
                          ] || order.orderStatus}
                        </span>

                        <span
                          className={`rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.06em] ${getPaymentStatusClass(
                            order.paymentStatus
                          )}`}
                        >
                          {paymentStatusLabels[
                            order.paymentStatus
                          ] || order.paymentStatus}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-[#9aa49e]">
                          {paymentMethodLabels[
                            order.paymentMethod
                          ] || order.paymentMethod}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#315c42]">
                          Open order
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* =========================================================
              PAGINATION
          ========================================================= */}
          {!loading && orders.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-[#e7ece7] bg-[#fafcf9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <p className="text-[11px] font-medium text-[#89948d]">
                  Order directory
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#536158]">
                  Page{" "}
                  <span className="font-black text-[#10291d]">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-black text-[#10291d]">
                    {totalPages}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((p) => Math.max(1, p - 1))
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce5dd] bg-white text-[#536158] transition hover:border-[#315c42] hover:bg-[#edf3e9] hover:text-[#10291d] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex h-10 min-w-[42px] items-center justify-center rounded-xl bg-[#10291d] px-3 text-xs font-black text-white shadow-[0_6px_18px_rgba(16,41,29,0.14)]">
                  {page}
                </div>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce5dd] bg-white text-[#536158] transition hover:border-[#315c42] hover:bg-[#edf3e9] hover:text-[#10291d] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}