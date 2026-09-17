"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Edit3,
  Eye,
  Percent,
  Plus,
  Search,
  Tag,
  Trash2,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";

type Coupon = {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  state: "active" | "inactive" | "expired" | "used";
  createdAt: string;
};

type Stats = {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  usedCoupons: number;
  usedUpCoupons: number;
};

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    usedCoupons: 0,
    usedUpCoupons: 0,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchCoupons() {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "10");

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status !== "all") {
        params.set("status", status);
      }

      const response = await fetch(
        `/api/admin/coupons?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch coupons"
        );
      }

      setCoupons(data.coupons || []);
      setStats(
        data.stats || {
          totalCoupons: 0,
          activeCoupons: 0,
          expiredCoupons: 0,
          usedCoupons: 0,
          usedUpCoupons: 0,
        }
      );

      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error: any) {
      showFeedback(
        "error",
        error?.message || "Failed to load coupons"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCoupons();
  }, [page, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCoupons();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  function showFeedback(
    type: "success" | "error",
    message: string
  ) {
    setFeedback({ type, message });

    window.setTimeout(() => {
      setFeedback(null);
    }, 3200);
  }

  async function toggleCoupon(coupon: Coupon) {
    try {
      const response = await fetch(
        `/api/admin/coupons/${coupon._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !coupon.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update coupon"
        );
      }

      showFeedback(
        "success",
        coupon.isActive
          ? `${coupon.code} has been deactivated`
          : `${coupon.code} is now active`
      );

      fetchCoupons();
    } catch (error: any) {
      showFeedback(
        "error",
        error?.message || "Failed to update coupon"
      );
    }
  }

  async function deleteCoupon() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/coupons/${deleteTarget._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to delete coupon"
        );
      }

      showFeedback(
        "success",
        `${deleteTarget.code} has been deleted`
      );

      setDeleteTarget(null);
      fetchCoupons();
    } catch (error: any) {
      showFeedback(
        "error",
        error?.message || "Failed to delete coupon"
      );
    } finally {
      setDeleting(false);
    }
  }

  function formatDiscount(coupon: Coupon) {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    }

    return `₨${coupon.discountValue.toLocaleString()}`;
  }

  function formatDate(date?: string) {
    if (!date) return "No expiry";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusStyle(state: Coupon["state"]) {
    if (state === "active") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (state === "expired") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    if (state === "used") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  function getStatusLabel(state: Coupon["state"]) {
    if (state === "active") return "Active";
    if (state === "expired") return "Expired";
    if (state === "used") return "Used Up";

    return "Inactive";
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);

      showFeedback(
        "success",
        `Coupon ${code} copied to clipboard`
      );
    } catch {
      showFeedback(
        "error",
        "Unable to copy coupon code"
      );
    }
  }

  const activeRate =
    stats.totalCoupons > 0
      ? Math.round(
          (stats.activeCoupons / stats.totalCoupons) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-white text-[#10291d]">
      <div className="mx-auto max-w-[1540px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        {/* =====================================================
            PREMIUM HERO
        ====================================================== */}
        <section className="relative mb-7 overflow-hidden rounded-[30px] bg-[#10291d] shadow-[0_24px_70px_rgba(16,41,29,0.16)]">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#315c42]/40 blur-3xl" />
          <div className="absolute -bottom-32 left-[38%] h-80 w-80 rounded-full bg-[#c5dda8]/10 blur-3xl" />
          <div className="absolute right-[28%] top-8 h-32 w-32 rounded-full bg-white/[0.035] blur-2xl" />

          <div className="relative z-10 flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#b8cbbd]">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07]">
                  <Tag size={15} />
                </span>

                Marketing
                <span className="text-white/30">/</span>
                Coupons
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-[46px] lg:leading-[1.05]">
                Coupon
                <span className="text-[#c5dda8]"> Intelligence.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#b8c8bd] sm:text-[15px]">
                Create, monitor and manage your store&apos;s
                promotional campaigns from one refined workspace.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-xs font-medium text-[#dbe6df]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c5dda8]" />
                  {stats.activeCoupons} active campaigns
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-xs font-medium text-[#dbe6df]">
                  <Activity size={13} />
                  {stats.usedCoupons} redemptions tracked
                </div>
              </div>
            </div>

            <Link
              href="/admin/coupons/new"
              className="group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-[#c5dda8] px-5 py-3.5 text-sm font-bold text-[#10291d] shadow-[0_10px_30px_rgba(197,221,168,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4e8bd] hover:shadow-[0_14px_35px_rgba(197,221,168,0.22)]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#10291d]/10">
                <Plus size={15} />
              </span>
              Create Coupon
              <ChevronRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>

        {/* =====================================================
            INTELLIGENCE STATS
        ====================================================== */}
        <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Coupons"
            value={stats.totalCoupons}
            icon={<Tag size={18} />}
            description="All campaigns"
          />

          <StatCard
            title="Active"
            value={stats.activeCoupons}
            icon={<CheckCircle2 size={18} />}
            description={`${activeRate}% currently active`}
            accent
          />

          <StatCard
            title="Used"
            value={stats.usedCoupons}
            icon={<Activity size={18} />}
            description="With redemptions"
          />

          <StatCard
            title="Used Up"
            value={stats.usedUpCoupons}
            icon={<Users size={18} />}
            description="Reached usage limit"
          />

          <StatCard
            title="Expired"
            value={stats.expiredCoupons}
            icon={<Clock3 size={18} />}
            description="No longer valid"
          />
        </section>

        {/* =====================================================
            DIRECTORY / MAIN WORKSPACE
        ====================================================== */}
        <section className="overflow-hidden rounded-[28px] border border-[#dfe9e1] bg-white shadow-[0_16px_55px_rgba(16,41,29,0.07)]">
          {/* Workspace Header */}
          <div className="border-b border-[#e8eee9] p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf4ee] text-[#315c42]">
                    <Zap size={17} />
                  </div>

                  <div>
                    <h2 className="text-base font-bold tracking-tight text-[#10291d]">
                      Campaign Directory
                    </h2>

                    <p className="mt-0.5 text-xs text-[#7b8a80]">
                      Search and manage your promotional codes
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-[330px]">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#829289]"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search coupon code..."
                    className="h-11 w-full rounded-2xl border border-[#dce7de] bg-[#fbfdfb] pl-11 pr-10 text-sm font-medium text-[#10291d] outline-none transition-all placeholder:text-[#9aaa9f] hover:border-[#cbd9ce] focus:border-[#6e907a] focus:bg-white focus:ring-4 focus:ring-[#eaf2ec]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-lg text-[#819087] transition hover:bg-[#edf4ee] hover:text-[#10291d]"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="flex overflow-x-auto rounded-2xl border border-[#dce7de] bg-[#f8fbf8] p-1">
                  {[
                    ["all", "All"],
                    ["active", "Active"],
                    ["inactive", "Inactive"],
                    ["expired", "Expired"],
                    ["used", "Used Up"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setStatus(value);
                        setPage(1);
                      }}
                      className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                        status === value
                          ? "bg-[#10291d] text-white shadow-sm"
                          : "text-[#65766b] hover:bg-white hover:text-[#10291d]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1120px]">
              <thead>
                <tr className="border-b border-[#e9efea] bg-[#fbfdfb] text-left">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#829188]">
                    Coupon
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#829188]">
                    Discount
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#829188]">
                    Minimum Order
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#829188]">
                    Usage
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#829188]">
                    Expiry
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#829188]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-[#829188]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf1ee]">
                {loading ? (
                  <LoadingTable />
                ) : coupons.length === 0 ? (
                  <EmptyTable />
                ) : (
                  coupons.map((coupon) => (
                    <CouponRow
                      key={coupon._id}
                      coupon={coupon}
                      onCopy={copyCode}
                      onToggle={toggleCoupon}
                      onDelete={setDeleteTarget}
                      formatDiscount={formatDiscount}
                      formatDate={formatDate}
                      getStatusStyle={getStatusStyle}
                      getStatusLabel={getStatusLabel}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-[#edf1ee] lg:hidden">
            {loading ? (
              <div className="px-5 py-20 text-center">
                <div className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-[#edf4ee]">
                  <Tag size={20} className="text-[#315c42]" />
                </div>

                <p className="mt-4 text-sm font-medium text-[#75857b]">
                  Loading campaigns...
                </p>
              </div>
            ) : coupons.length === 0 ? (
              <div className="px-5 py-20 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ee] text-[#315c42]">
                  <Tag size={23} />
                </div>

                <h3 className="mt-4 text-base font-bold text-[#10291d]">
                  No coupons found
                </h3>

                <p className="mt-1 text-sm text-[#7b8a80]">
                  Try changing your search or create a new campaign.
                </p>

                <Link
                  href="/admin/coupons/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#10291d] px-4 py-2.5 text-xs font-bold text-white"
                >
                  <Plus size={14} />
                  Create Coupon
                </Link>
              </div>
            ) : (
              coupons.map((coupon) => (
                <MobileCouponCard
                  key={coupon._id}
                  coupon={coupon}
                  onCopy={copyCode}
                  onToggle={toggleCoupon}
                  onDelete={setDeleteTarget}
                  formatDiscount={formatDiscount}
                  formatDate={formatDate}
                  getStatusStyle={getStatusStyle}
                  getStatusLabel={getStatusLabel}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-[#e8eee9] bg-[#fcfefc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium text-[#7b8a80]">
                  Showing page{" "}
                  <span className="font-bold text-[#10291d]">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#10291d]">
                    {totalPages}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((value) => Math.max(value - 1, 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7de] bg-white text-[#53665b] transition hover:border-[#b9cbbd] hover:bg-[#f1f6f2] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>

                <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#10291d] px-3 text-xs font-bold text-white">
                  {page}
                </div>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((value) =>
                      Math.min(value + 1, totalPages)
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7de] bg-white text-[#53665b] transition hover:border-[#b9cbbd] hover:bg-[#f1f6f2] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07130d]/55 px-4 py-6 backdrop-blur-md">
          <div className="w-full max-w-[440px] overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.22)]">
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Trash2 size={21} />
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#7d8d83] transition hover:bg-[#f1f5f2] hover:text-[#10291d]"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="mt-6 text-xl font-bold tracking-tight text-[#10291d]">
                Delete coupon?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#718077]">
                You are about to permanently remove{" "}
                <span className="font-bold text-[#10291d]">
                  {deleteTarget.code}
                </span>
                . This action cannot be undone.
              </p>

              <div className="mt-5 rounded-2xl border border-[#e6ece7] bg-[#f8fbf8] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a998f]">
                      Coupon
                    </p>

                    <p className="mt-1 font-bold tracking-wide text-[#10291d]">
                      {deleteTarget.code}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a998f]">
                      Discount
                    </p>

                    <p className="mt-1 font-bold text-[#315c42]">
                      {formatDiscount(deleteTarget)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="rounded-xl border border-[#dce7de] px-5 py-3 text-sm font-bold text-[#53665b] transition hover:bg-[#f5f8f5] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={deleteCoupon}
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={15} />
                  {deleting ? "Deleting..." : "Delete Coupon"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FEEDBACK TOAST
      ====================================================== */}
      {feedback && (
        <div className="fixed bottom-5 right-5 z-[120] w-[calc(100%-40px)] max-w-[390px]">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#10291d] p-4 text-white shadow-[0_18px_55px_rgba(16,41,29,0.24)]">
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                feedback.type === "success"
                  ? "bg-[#c5dda8] text-[#10291d]"
                  : "bg-red-500/15 text-red-300"
              }`}
            >
              {feedback.type === "success" ? (
                <Check size={16} />
              ) : (
                <XCircle size={16} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#a9bdb0]">
                {feedback.type === "success"
                  ? "Success"
                  : "Something went wrong"}
              </p>

              <p className="mt-1 text-sm leading-5 text-[#edf4ee]">
                {feedback.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-white/40 transition hover:text-white"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DESKTOP COUPON ROW
============================================================ */

function CouponRow({
  coupon,
  onCopy,
  onToggle,
  onDelete,
  formatDiscount,
  formatDate,
  getStatusStyle,
  getStatusLabel,
}: {
  coupon: Coupon;
  onCopy: (code: string) => void;
  onToggle: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
  formatDiscount: (coupon: Coupon) => string;
  formatDate: (date?: string) => string;
  getStatusStyle: (state: Coupon["state"]) => string;
  getStatusLabel: (state: Coupon["state"]) => string;
}) {
  const usagePercentage = coupon.usageLimit
    ? Math.min(
        (coupon.usedCount / coupon.usageLimit) * 100,
        100
      )
    : 0;

  return (
    <tr className="group transition-colors hover:bg-[#fcfefc]">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#dce8df] bg-[#edf4ee] text-[#315c42] transition group-hover:border-[#cbdccc] group-hover:bg-[#e7f0e8]">
            <Tag size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-[0.04em] text-[#10291d]">
                {coupon.code}
              </span>

              <button
                type="button"
                onClick={() => onCopy(coupon.code)}
                className="flex h-6 w-6 items-center justify-center rounded-lg text-[#94a199] transition hover:bg-[#edf4ee] hover:text-[#315c42]"
                title="Copy coupon code"
              >
                <Copy size={13} />
              </button>
            </div>

            <p className="mt-1 text-[11px] text-[#8a998f]">
              Created {formatDate(coupon.createdAt)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f6f2] text-[#315c42]">
            {coupon.discountType === "percentage" ? (
              <Percent size={15} />
            ) : (
              <span className="text-xs font-black">₨</span>
            )}
          </div>

          <div>
            <p className="font-bold text-[#10291d]">
              {formatDiscount(coupon)}
            </p>

            <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#91a097]">
              {coupon.discountType === "percentage"
                ? "Percentage"
                : "Fixed amount"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <p className="text-sm font-semibold text-[#314238]">
          {coupon.minimumOrderAmount
            ? `₨${coupon.minimumOrderAmount.toLocaleString()}`
            : "No minimum"}
        </p>

        {coupon.maximumDiscountAmount && (
          <p className="mt-1 text-[10px] text-[#8a998f]">
            Max ₨
            {coupon.maximumDiscountAmount.toLocaleString()}
          </p>
        )}
      </td>

      <td className="px-6 py-5">
        <div className="min-w-[120px]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-[#10291d]">
              {coupon.usedCount}
            </span>

            <span className="text-[11px] font-medium text-[#8a998f]">
              {coupon.usageLimit
                ? `/ ${coupon.usageLimit}`
                : "/ ∞"}
            </span>
          </div>

          {coupon.usageLimit && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e9efea]">
              <div
                className="h-full rounded-full bg-[#315c42] transition-all"
                style={{
                  width: `${usagePercentage}%`,
                }}
              />
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-[#5f7065]">
          <CalendarDays size={15} className="text-[#839289]" />
          {formatDate(coupon.expiresAt)}
        </div>
      </td>

      <td className="px-6 py-5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${getStatusStyle(
            coupon.state
          )}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {getStatusLabel(coupon.state)}
        </span>
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end gap-1.5">
          <Link
            href={`/admin/coupons/${coupon._id}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce7de] bg-white text-[#65766b] transition hover:border-[#c3d3c6] hover:bg-[#f1f6f2] hover:text-[#10291d]"
            title="View coupon"
          >
            <Eye size={15} />
          </Link>

          <Link
            href={`/admin/coupons/${coupon._id}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce7de] bg-white text-[#65766b] transition hover:border-[#c3d3c6] hover:bg-[#f1f6f2] hover:text-[#10291d]"
            title="Edit coupon"
          >
            <Edit3 size={15} />
          </Link>

          <button
            type="button"
            onClick={() => onToggle(coupon)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
              coupon.isActive
                ? "border-amber-200 bg-white text-amber-700 hover:bg-amber-50"
                : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
            }`}
            title={
              coupon.isActive
                ? "Deactivate"
                : "Activate"
            }
          >
            {coupon.isActive ? (
              <XCircle size={15} />
            ) : (
              <CheckCircle2 size={15} />
            )}
          </button>

          <button
            type="button"
            onClick={() => onDelete(coupon)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Delete coupon"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ============================================================
   MOBILE COUPON CARD
============================================================ */

function MobileCouponCard({
  coupon,
  onCopy,
  onToggle,
  onDelete,
  formatDiscount,
  formatDate,
  getStatusStyle,
  getStatusLabel,
}: {
  coupon: Coupon;
  onCopy: (code: string) => void;
  onToggle: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
  formatDiscount: (coupon: Coupon) => string;
  formatDate: (date?: string) => string;
  getStatusStyle: (state: Coupon["state"]) => string;
  getStatusLabel: (state: Coupon["state"]) => string;
}) {
  const usagePercentage = coupon.usageLimit
    ? Math.min(
        (coupon.usedCount / coupon.usageLimit) * 100,
        100
      )
    : 0;

  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#dce8df] bg-[#edf4ee] text-[#315c42]">
            <Tag size={19} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-bold tracking-[0.04em] text-[#10291d]">
                {coupon.code}
              </span>

              <button
                type="button"
                onClick={() => onCopy(coupon.code)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[#8b9a91] hover:bg-[#edf4ee] hover:text-[#315c42]"
              >
                <Copy size={13} />
              </button>
            </div>

            <p className="mt-1 text-lg font-black tracking-tight text-[#315c42]">
              {formatDiscount(coupon)}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[10px] font-bold ${getStatusStyle(
            coupon.state
          )}`}
        >
          {getStatusLabel(coupon.state)}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-[#e4ebe5] bg-[#f9fbf9] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a998f]">
              Usage
            </p>

            <p className="mt-1 text-sm font-bold text-[#10291d]">
              {coupon.usedCount}
              {coupon.usageLimit
                ? ` / ${coupon.usageLimit}`
                : " / ∞"}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a998f]">
              Expires
            </p>

            <p className="mt-1 text-sm font-semibold text-[#52645a]">
              {formatDate(coupon.expiresAt)}
            </p>
          </div>
        </div>

        {coupon.usageLimit && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e4ebe5]">
            <div
              className="h-full rounded-full bg-[#315c42]"
              style={{
                width: `${usagePercentage}%`,
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <InfoBox
          label="Min. Order"
          value={
            coupon.minimumOrderAmount
              ? `₨${coupon.minimumOrderAmount.toLocaleString()}`
              : "None"
          }
        />

        <InfoBox
          label="Type"
          value={
            coupon.discountType === "percentage"
              ? "Percentage"
              : "Fixed"
          }
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/admin/coupons/${coupon._id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#10291d] py-3 text-xs font-bold text-white transition hover:bg-[#193d2b]"
        >
          <Edit3 size={14} />
          Manage Coupon
        </Link>

        <button
          type="button"
          onClick={() => onToggle(coupon)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#dce7de] bg-white text-[#5e7165] transition hover:bg-[#f1f6f2]"
          title={
            coupon.isActive
              ? "Deactivate"
              : "Activate"
          }
        >
          {coupon.isActive ? (
            <XCircle size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}
        </button>

        <button
          type="button"
          onClick={() => onDelete(coupon)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:bg-red-50"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  icon,
  description,
  accent = false,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[22px] border p-5 transition-all duration-300 hover:-translate-y-0.5 ${
        accent
          ? "border-[#cfded1] bg-[#f8fbf8]"
          : "border-[#e0e9e1] bg-white"
      } shadow-[0_8px_30px_rgba(16,41,29,0.045)] hover:shadow-[0_14px_40px_rgba(16,41,29,0.075)]`}
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#edf4ee] opacity-60 blur-2xl transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce8df] bg-[#edf4ee] text-[#315c42]">
          {icon}
        </div>

        {accent && (
          <span className="flex items-center gap-1 rounded-full bg-[#e7f1df] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#41624b]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#315c42]" />
            Live
          </span>
        )}
      </div>

      <div className="relative mt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#8a998f]">
          {title}
        </p>

        <p className="mt-1 text-[27px] font-black tracking-[-0.04em] text-[#10291d]">
          {value.toLocaleString()}
        </p>

        <p className="mt-1 text-[11px] font-medium text-[#829188]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   INFO BOX
============================================================ */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e4ebe5] bg-[#f9fbf9] p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a998f]">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-[#24382b]">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingTable() {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-20">
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-[#edf4ee] text-[#315c42]">
            <Tag size={22} />
          </div>

          <p className="mt-4 text-sm font-semibold text-[#65766b]">
            Loading coupon campaigns...
          </p>

          <p className="mt-1 text-xs text-[#9aa79f]">
            Preparing your campaign directory
          </p>
        </div>
      </td>
    </tr>
  );
}

/* ============================================================
   EMPTY
============================================================ */

function EmptyTable() {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-20">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#dce8df] bg-[#edf4ee] text-[#315c42]">
            <Tag size={25} />
          </div>

          <h3 className="mt-5 text-lg font-bold tracking-tight text-[#10291d]">
            No coupon campaigns found
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#7b8a80]">
            There are no campaigns matching your current
            search or filter. Create a new coupon to get
            started.
          </p>

          <Link
            href="/admin/coupons/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#10291d] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#193d2b]"
          >
            <Plus size={14} />
            Create Coupon
          </Link>
        </div>
      </td>
    </tr>
  );
}