"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Filter,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
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
  role: "customer" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  orderStats: {
    totalOrders: number;
    totalSpent: number;
    deliveredOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
  };
}

interface Stats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  newCustomers: number;
}

const formatPrice = (value: number) =>
  `₨${Number(value || 0).toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  })}`;

const formatDate = (date: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    newCustomers: 0,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status !== "all") {
        params.set("status", status);
      }

      params.set("page", String(page));
      params.set("limit", "10");

      const response = await fetch(
        `/api/admin/customers?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load customers"
        );
      }

      const customerList = result.data?.customers || [];
      const pagination = result.data?.pagination || {};
      const apiStats = result.data?.stats || {};

      setCustomers(customerList);

      setStats({
        totalCustomers: Number(apiStats.totalCustomers || 0),
        activeCustomers: Number(apiStats.activeCustomers || 0),
        inactiveCustomers: Number(apiStats.inactiveCustomers || 0),
        newCustomers: Number(apiStats.newCustomers || 0),
      });

      setTotalResults(Number(pagination.total || 0));

      setTotalPages(
        Math.max(Number(pagination.totalPages || 1), 1)
      );
    } catch (error) {
      console.error("Admin customers page error:", error);

      setCustomers([]);
      setTotalResults(0);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (page !== 1) {
      setPage(1);
      return;
    }

    loadCustomers();
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);

    setTimeout(() => {
      loadCustomers();
    }, 0);
  };

  const hasFilters = search.trim() !== "" || status !== "all";

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-[1600px] space-y-7 p-4 md:p-6 lg:p-8">

        {/* =====================================================
            HERO / HEADER
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[32px] bg-[#10291d] shadow-[0_24px_70px_rgba(16,41,29,0.14)]">

          {/* Ambient decoration */}
          <div className="pointer-events-none absolute -right-28 -top-36 h-[440px] w-[440px] rounded-full bg-[#315c42]/45 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 left-[28%] h-[390px] w-[390px] rounded-full bg-[#c5dda8]/[0.08] blur-3xl" />

          <div className="pointer-events-none absolute right-[30%] top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-9">

            {/* Breadcrumb */}
            <div className="mb-7 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
              <Link
                href="/admin"
                className="transition hover:text-[#c5dda8]"
              >
                Dashboard
              </Link>

              <span className="text-white/15">/</span>

              <span className="text-white/65">
                Customers
              </span>
            </div>

            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">

              {/* Main heading */}
              <div className="flex min-w-0 items-start gap-4">

                <div className="hidden h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[21px] border border-white/10 bg-white/[0.065] text-[#c5dda8] shadow-inner sm:flex">
                  <Users className="h-7 w-7" strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5dda8]">
                    Customer Management
                  </p>

                  <h1 className="mt-2 text-[34px] font-bold tracking-[-0.045em] text-white sm:text-[42px]">
                    Customer Directory
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                    A complete overview of your customer base,
                    account activity and purchasing relationship.
                  </p>
                </div>
              </div>

              {/* Header right */}
              <div className="flex flex-col gap-3 sm:flex-row xl:pb-1">

                <div className="flex min-h-[54px] items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.055] px-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c5dda8]/10 text-[#c5dda8]">
                    <CircleUserRound
                      size={17}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Customer Base
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-white">
                      {stats.totalCustomers.toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={loadCustomers}
                  disabled={loading}
                  className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-[18px] bg-[#c5dda8] px-5 text-sm font-bold text-[#10291d] shadow-[0_14px_35px_rgba(197,221,168,0.13)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d7e9c0] hover:shadow-[0_18px_42px_rgba(197,221,168,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />

                  Refresh
                </button>
              </div>
            </div>

            {/* Header bottom metrics */}
            <div className="mt-8 grid grid-cols-2 border-t border-white/[0.08] pt-6 sm:grid-cols-4">

              <HeroMetric
                label="Total Accounts"
                value={stats.totalCustomers}
              />

              <HeroMetric
                label="Active"
                value={stats.activeCustomers}
                positive
              />

              <HeroMetric
                label="Inactive"
                value={stats.inactiveCustomers}
              />

              <HeroMetric
                label="New · 30 Days"
                value={stats.newCustomers}
                positive
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            PREMIUM STATS
        ===================================================== */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            eyebrow="Customer Base"
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<Users size={19} strokeWidth={1.8} />}
            description="All registered accounts"
            index="01"
          />

          <StatCard
            eyebrow="Account Health"
            title="Active Customers"
            value={stats.activeCustomers}
            icon={<UserCheck size={19} strokeWidth={1.8} />}
            description="Currently active accounts"
            positive
            index="02"
          />

          <StatCard
            eyebrow="Account Health"
            title="Inactive Customers"
            value={stats.inactiveCustomers}
            icon={<UserX size={19} strokeWidth={1.8} />}
            description="Currently inactive accounts"
            index="03"
          />

          <StatCard
            eyebrow="Recent Growth"
            title="New Customers"
            value={stats.newCustomers}
            icon={<Activity size={19} strokeWidth={1.8} />}
            description="Registered in last 30 days"
            positive
            index="04"
          />
        </section>

        {/* =====================================================
            SEARCH / FILTER COMMAND CARD
        ===================================================== */}

        <section className="overflow-hidden rounded-[30px] border border-[#dfe8e1] bg-white shadow-[0_18px_55px_rgba(16,41,29,0.055)]">

          {/* Card header */}
          <div className="flex flex-col gap-4 border-b border-[#edf2ed] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#10291d] text-[#c5dda8] shadow-[0_8px_20px_rgba(16,41,29,0.10)]">
                <Filter size={18} strokeWidth={1.8} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold tracking-[-0.01em] text-[#17231c]">
                    Customer Search & Filters
                  </p>

                  {hasFilters && (
                    <span className="inline-flex h-5 items-center rounded-md bg-[#e8f2e8] px-2 text-[9px] font-bold uppercase tracking-[0.08em] text-[#315c42]">
                      Active
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-[11px] text-[#89968e]">
                  Find customer accounts by identity or account status.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa59e]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#315c42]" />
              {totalResults.toLocaleString()} Records
            </div>
          </div>

          {/* Search controls */}
          <form
            onSubmit={handleSearch}
            className="p-4 sm:p-5 lg:p-6"
          >
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_230px_auto_auto]">

              {/* Search */}
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#718078]">
                  <Search
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by customer name, email or phone..."
                  className="h-[54px] w-full rounded-[17px] border border-[#dce6de] bg-[#fafcfb] pl-11 pr-11 text-sm font-medium text-[#17231c] outline-none transition duration-200 placeholder:text-[#9aa59e] hover:border-[#cbd8ce] focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/[0.06]"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#8c9890] transition hover:bg-[#edf3ed] hover:text-[#315c42]"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status filter */}
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex -translate-y-1/2 items-center text-[#718078]">
                  <Activity
                    size={15}
                    strokeWidth={1.8}
                  />
                </div>

                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="h-[54px] w-full appearance-none rounded-[17px] border border-[#dce6de] bg-[#fafcfb] pl-10 pr-11 text-sm font-semibold text-[#24362b] outline-none transition hover:border-[#cbd8ce] focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/[0.06]"
                >
                  <option value="all">
                    All Customers
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#819087]"
                />
              </div>

              {/* Search */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-[54px] items-center justify-center gap-2 rounded-[17px] bg-[#10291d] px-7 text-sm font-bold text-white shadow-[0_10px_25px_rgba(16,41,29,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#193c29] hover:shadow-[0_15px_32px_rgba(16,41,29,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search
                  size={16}
                  strokeWidth={2}
                />

                Search
              </button>

              {/* Clear */}
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex h-[54px] items-center justify-center gap-2 rounded-[17px] border border-[#dce6de] bg-white px-5 text-sm font-bold text-[#536158] transition hover:border-[#c7d5ca] hover:bg-[#f7faf7] hover:text-[#10291d]"
                >
                  <X size={15} />
                  Clear
                </button>
              )}
            </div>

            {/* Filter summary */}
            {hasFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">

                <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9aa59e]">
                  Applied:
                </span>

                {search.trim() && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-[#dce7dd] bg-[#f7faf7] px-3 py-2 text-[10px] font-bold text-[#315c42]">
                    <Search size={11} />
                    “{search.trim()}”
                  </span>
                )}

                {status !== "all" && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-[#dce7dd] bg-[#f7faf7] px-3 py-2 text-[10px] font-bold capitalize text-[#315c42]">
                    <Activity size={11} />
                    {status}
                  </span>
                )}
              </div>
            )}
          </form>
        </section>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="overflow-hidden rounded-[25px] border border-red-200 bg-red-50">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-red-100 text-red-600">
                  <X size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-red-900">
                    Unable to load customers
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={loadCustomers}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-700 px-4 text-xs font-bold text-white transition hover:bg-red-800"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* =====================================================
            RESULT CONTEXT
        ===================================================== */}

        {!loading && !error && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#edf3e9] text-[#315c42]">
                <Users size={13} />
              </div>

              <p className="text-xs text-[#718078]">
                Displaying{" "}
                <span className="font-bold text-[#17231c]">
                  {customers.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#17231c]">
                  {totalResults}
                </span>{" "}
                customer accounts
              </p>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex w-fit items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#315c42] transition hover:text-[#10291d]"
              >
                <X size={12} />
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* =====================================================
            DESKTOP CUSTOMER DIRECTORY
        ===================================================== */}

        <section className="hidden overflow-hidden rounded-[30px] border border-[#dfe8e1] bg-white shadow-[0_20px_60px_rgba(16,41,29,0.065)] lg:block">

          {/* Table heading */}
          <div className="flex items-center justify-between border-b border-[#eaf0eb] bg-[#fcfefc] px-6 py-5 lg:px-7">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#10291d] text-[#c5dda8]">
                <Users
                  size={17}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-sm font-bold tracking-[-0.01em] text-[#17231c]">
                  Customer Accounts
                </p>

                <p className="mt-0.5 text-[10px] text-[#89968e]">
                  Profiles, order activity and account intelligence
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="h-1.5 w-1.5 rounded-full bg-[#5b9b68]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#819087]">
                Live Directory
              </span>

              <span className="ml-1 rounded-lg border border-[#dfe8e1] bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#536158]">
                {totalResults.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1220px]">

              <thead>
                <tr className="border-b border-[#e9efe9] bg-[#f8fbf8] text-left">

                  <th className="px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#819087]">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#819087]">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#819087]">
                    Order Activity
                  </th>

                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#819087]">
                    Lifetime Value
                  </th>

                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#819087]">
                    Account
                  </th>

                  <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-[#819087]">
                    Joined
                  </th>

                  <th className="px-7 py-4 text-right text-[9px] font-bold uppercase tracking-[0.18em] text-[#819087]">
                    Profile
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf2ed]">

                {loading ? (
                  <LoadingRows />
                ) : customers.length === 0 ? (
                  <EmptyTable />
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="group transition duration-200 hover:bg-[#fbfdfb]"
                    >

                      {/* CUSTOMER */}
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-3.5">

                          <Avatar name={customer.name} />

                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold tracking-[-0.01em] text-[#17231c]">
                              {customer.name}
                            </p>

                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#315c42]" />

                              <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#89968e]">
                                {customer.role === "admin"
                                  ? "Administrator"
                                  : "Customer"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="px-6 py-5">
                        <div className="space-y-2">

                          <div className="flex max-w-[270px] items-center gap-2.5 text-xs font-semibold text-[#425148]">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f1] text-[#718078]">
                              <Mail size={12} />
                            </div>

                            <span className="truncate">
                              {customer.email}
                            </span>
                          </div>

                          {customer.phone ? (
                            <div className="flex items-center gap-2.5 text-[10px] font-medium text-[#89968e]">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f7f9f7] text-[#89968e]">
                                <Phone size={11} />
                              </div>

                              <span>
                                {customer.phone}
                              </span>
                            </div>
                          ) : (
                            <span className="pl-9 text-[10px] text-[#a2ada6]">
                              No phone number
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ORDER ACTIVITY */}
                      <td className="px-6 py-5">
                        <OrderSummary
                          stats={customer.orderStats}
                        />
                      </td>

                      {/* LIFETIME VALUE */}
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-[17px] font-bold tracking-[-0.035em] text-[#10291d]">
                            {formatPrice(
                              customer.orderStats.totalSpent
                            )}
                          </p>

                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-[#a8b4ac]" />

                            <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#9aa59e]">
                              Lifetime spend
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ACCOUNT */}
                      <td className="px-6 py-5">
                        <StatusBadge
                          active={customer.isActive}
                        />
                      </td>

                      {/* JOINED */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2.5">

                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f3f6f3] text-[#89968e]">
                            <Clock3 size={12} />
                          </div>

                          <div>
                            <p className="text-[11px] font-bold text-[#536158]">
                              {formatDate(customer.createdAt)}
                            </p>

                            <p className="mt-0.5 text-[9px] uppercase tracking-[0.08em] text-[#a0aaa3]">
                              Registered
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-7 py-5 text-right">
                        <Link
                          href={`/admin/customers/${customer._id}`}
                          className="group/action inline-flex h-10 items-center gap-2 rounded-xl border border-[#d9e4db] bg-white px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#10291d] shadow-[0_5px_14px_rgba(16,41,29,0.035)] transition duration-200 hover:border-[#b9cbbb] hover:bg-[#f5f9f5] hover:shadow-[0_8px_18px_rgba(16,41,29,0.07)]"
                        >
                          View Profile

                          <ArrowRight
                            size={13}
                            className="transition-transform duration-200 group-hover/action:translate-x-0.5"
                          />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* =====================================================
            MOBILE
        ===================================================== */}

        <div className="space-y-4 lg:hidden">

          {loading ? (
            <div className="rounded-[28px] border border-[#dfe8e1] bg-white p-12 text-center shadow-[0_15px_45px_rgba(16,41,29,0.05)]">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#edf3e9] text-[#315c42]">
                <RefreshCw
                  size={22}
                  className="animate-spin"
                />
              </div>

              <p className="mt-5 text-sm font-bold text-[#17231c]">
                Loading customer directory
              </p>

              <p className="mt-1 text-xs text-[#89968e]">
                Preparing your customer data...
              </p>
            </div>
          ) : customers.length === 0 ? (
            <div className="rounded-[28px] border border-[#dfe8e1] bg-white p-12 text-center shadow-[0_15px_45px_rgba(16,41,29,0.05)]">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[21px] bg-[#edf3e9] text-[#89968e]">
                <CircleUserRound size={30} />
              </div>

              <p className="mt-5 text-sm font-bold text-[#17231c]">
                No customers found
              </p>

              <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-[#89968e]">
                No customer accounts match your current search
                or filter criteria.
              </p>
            </div>
          ) : (
            customers.map((customer) => (
              <Link
                key={customer._id}
                href={`/admin/customers/${customer._id}`}
                className="group block overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_15px_45px_rgba(16,41,29,0.055)] transition duration-300 hover:border-[#c9d7cc] hover:shadow-[0_20px_55px_rgba(16,41,29,0.09)]"
              >

                {/* Mobile identity header */}
                <div className="relative overflow-hidden bg-[#10291d] p-5">

                  <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#315c42]/40 blur-3xl" />

                  <div className="relative flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <Avatar name={customer.name} />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {customer.name}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-white/45">
                          {customer.email}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#c5dda8]" />

                          <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/45">
                            {customer.role === "admin"
                              ? "Administrator"
                              : "Customer"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge
                      active={customer.isActive}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 gap-3 border-b border-[#edf2ed] p-5 sm:grid-cols-2">

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                      <Mail size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#a0aaa3]">
                        Email
                      </p>

                      <p className="mt-1 truncate text-[11px] font-semibold text-[#425148]">
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f4f7f4] text-[#718078]">
                      <Phone size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#a0aaa3]">
                        Phone
                      </p>

                      <p className="mt-1 truncate text-[11px] font-semibold text-[#425148]">
                        {customer.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order intelligence */}
                <div className="bg-[#fafcf9] p-5">

                  <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#10291d] text-[#c5dda8]">
                        <ShoppingBag size={14} />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#718078]">
                          Customer Activity
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#a0aaa3]">
                          Order relationship
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#a0aaa3]">
                        Lifetime
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-[#10291d]">
                        {formatPrice(
                          customer.orderStats.totalSpent
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                    <MobileMetric
                      label="Orders"
                      value={customer.orderStats.totalOrders}
                    />

                    <MobileMetric
                      label="Delivered"
                      value={customer.orderStats.deliveredOrders}
                      positive
                    />

                    <MobileMetric
                      label="Pending"
                      value={customer.orderStats.pendingOrders}
                    />

                    <MobileMetric
                      label="Cancelled"
                      value={customer.orderStats.cancelledOrders}
                    />

                    <MobileMetric
                      label="Joined"
                      value={formatDate(customer.createdAt)}
                    />

                    <MobileMetric
                      label="Account"
                      value={
                        customer.isActive
                          ? "Active"
                          : "Inactive"
                      }
                      positive={customer.isActive}
                    />
                  </div>
                </div>

                {/* Mobile action */}
                <div className="flex items-center justify-between border-t border-[#edf2ed] px-5 py-4">

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#a0aaa3]">
                      Customer Profile
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#68766d]">
                      View complete account details
                    </p>
                  </div>

                  <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#10291d] px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-white transition group-hover:bg-[#193c29]">
                    View

                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        <section className="flex flex-col gap-4 rounded-[26px] border border-[#dfe8e1] bg-white px-5 py-4 shadow-[0_12px_40px_rgba(16,41,29,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
              <Users size={14} />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-[#718078]">
                Page{" "}
                <span className="font-bold text-[#17231c]">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#17231c]">
                  {totalPages}
                </span>
              </p>

              {!loading && totalResults > 0 && (
                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.08em] text-[#a0aaa3]">
                  {totalResults.toLocaleString()} total customers
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled={loading || page <= 1}
              onClick={() =>
                setPage((value) => Math.max(value - 1, 1))
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7dd] bg-white text-[#10291d] transition hover:border-[#c4d3c7] hover:bg-[#f1f6f1] disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex h-10 min-w-[76px] items-center justify-center rounded-xl bg-[#10291d] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_7px_18px_rgba(16,41,29,0.10)]">
              {page} / {totalPages}
            </div>

            <button
              type="button"
              disabled={loading || page >= totalPages}
              onClick={() =>
                setPage((value) =>
                  Math.min(value + 1, totalPages)
                )
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7dd] bg-white text-[#10291d] transition hover:border-[#c4d3c7] hover:bg-[#f1f6f1] disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =====================================================
   HERO METRIC
===================================================== */

function HeroMetric({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: number;
  positive?: boolean;
}) {
  return (
    <div className="border-r border-white/[0.07] px-3 first:pl-0 last:border-r-0 sm:px-5">
      <div className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            positive ? "bg-[#c5dda8]" : "bg-white/25"
          }`}
        />

        <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-white/35">
          {label}
        </p>
      </div>

      <p className="mt-1.5 text-lg font-bold tracking-[-0.025em] text-white sm:text-xl">
        {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  eyebrow,
  title,
  value,
  icon,
  description,
  positive = false,
  index,
}: {
  eyebrow: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  positive?: boolean;
  index: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[25px] border border-[#dfe8e1] bg-white p-5 shadow-[0_12px_38px_rgba(16,41,29,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-[#cbd9ce] hover:shadow-[0_18px_48px_rgba(16,41,29,0.075)]">

      {/* Hover glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#edf3e9] opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#edf3e9] text-[#315c42] transition duration-300 group-hover:bg-[#10291d] group-hover:text-[#c5dda8]">
          {icon}
        </div>

        <span className="text-[9px] font-bold tracking-[0.14em] text-[#c0c9c3]">
          {index}
        </span>
      </div>

      <div className="relative mt-5">

        <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#a0aaa3]">
          {eyebrow}
        </p>

        <div className="mt-1 flex items-end justify-between gap-3">

          <p className="text-[27px] font-bold tracking-[-0.045em] text-[#10291d]">
            {Number(value || 0).toLocaleString()}
          </p>

          <div
            className={`mb-1.5 h-1.5 w-1.5 rounded-full ${
              positive ? "bg-[#5b9b68]" : "bg-[#a7b2aa]"
            }`}
          />
        </div>

        <p className="mt-1 text-[10px] font-medium text-[#89968e]">
          {title}
        </p>

        <div className="mt-4 h-px w-full bg-[#edf2ed]" />

        <p className="mt-3 text-[9px] font-medium text-[#a0aaa3]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =====================================================
   AVATAR
===================================================== */

function Avatar({
  name,
}: {
  name: string;
}) {
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[15px] border border-white/10 bg-[#10291d] text-xs font-bold text-white shadow-[0_8px_20px_rgba(16,41,29,0.13)]">

      <div className="absolute inset-0 bg-gradient-to-br from-[#315c42] via-[#1c4931] to-[#10291d]" />

      <div className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-[#c5dda8]/10 blur-lg" />

      <span className="relative tracking-[0.04em]">
        {initials}
      </span>
    </div>
  );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.06em] ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.10)]"
            : "bg-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

/* =====================================================
   ORDER SUMMARY
===================================================== */

function OrderSummary({
  stats,
}: {
  stats: Customer["orderStats"];
}) {
  return (
    <div className="min-w-[210px]">

      <div className="flex items-center gap-2">

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#edf3e9] text-[#315c42]">
          <ShoppingBag size={13} />
        </div>

        <span className="text-sm font-bold tracking-[-0.02em] text-[#10291d]">
          {stats.totalOrders}
        </span>

        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#89968e]">
          Total Orders
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5">

        <OrderPill
          icon={<CheckCircle2 size={10} />}
          value={stats.deliveredOrders}
          className="border-emerald-100 bg-emerald-50 text-emerald-700"
        />

        <OrderPill
          icon={<Clock3 size={10} />}
          value={stats.pendingOrders}
          className="border-amber-100 bg-amber-50 text-amber-700"
        />

        <OrderPill
          icon={<X size={10} />}
          value={stats.cancelledOrders}
          className="border-red-100 bg-red-50 text-red-700"
        />
      </div>
    </div>
  );
}

/* =====================================================
   ORDER PILL
===================================================== */

function OrderPill({
  icon,
  value,
  className,
}: {
  icon: React.ReactNode;
  value: number;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[9px] font-bold ${className}`}
    >
      {icon}
      {value}
    </span>
  );
}

/* =====================================================
   MOBILE METRIC
===================================================== */

function MobileMetric({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string | number;
  positive?: boolean;
}) {
  return (
    <div className="rounded-[15px] border border-[#e8eee9] bg-white px-3.5 py-3">

      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#9aa59e]">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-bold ${
          positive
            ? "text-[#28713d]"
            : "text-[#10291d]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   LOADING ROWS
===================================================== */

function LoadingRows() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((item) => (
        <tr key={item}>
          <td colSpan={7} className="px-7 py-4">

            <div className="flex items-center gap-4">

              <div className="h-11 w-11 animate-pulse rounded-[15px] bg-[#eef3ef]" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-40 animate-pulse rounded bg-[#eef3ef]" />
                <div className="h-2.5 w-24 animate-pulse rounded bg-[#f4f7f4]" />
              </div>

              <div className="hidden h-10 w-48 animate-pulse rounded-xl bg-[#f4f7f4] xl:block" />

              <div className="hidden h-10 w-28 animate-pulse rounded-xl bg-[#f4f7f4] md:block" />

              <div className="hidden h-10 w-24 animate-pulse rounded-xl bg-[#f4f7f4] lg:block" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

/* =====================================================
   EMPTY TABLE
===================================================== */

function EmptyTable() {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-24 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[21px] bg-[#edf3e9] text-[#89968e]">
          <CircleUserRound size={30} />
        </div>

        <p className="mt-5 text-sm font-bold tracking-[-0.01em] text-[#17231c]">
          No customers found
        </p>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#89968e]">
          No customer accounts match your current search
          or filter criteria.
        </p>
      </td>
    </tr>
  );
}