"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Edit3,
  Percent,
  Save,
  ShieldCheck,
  Tag,
  Trash2,
  TrendingUp,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  updatedAt: string;
};

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

export default function CouponDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  const [coupon, setCoupon] = useState<Coupon | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscountAmount: "",
    usageLimit: "",
    expiresAt: "",
    isActive: true,
  });

  const [feedback, setFeedback] =
    useState<Feedback>(null);

  const [deleteModal, setDeleteModal] =
    useState(false);

  async function fetchCoupon() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/coupons/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch coupon"
        );
      }

      const item = data.coupon;

      setCoupon(item);

      setForm({
        code: item.code || "",
        discountType:
          item.discountType || "percentage",
        discountValue:
          item.discountValue?.toString() || "",
        minimumOrderAmount:
          item.minimumOrderAmount?.toString() || "",
        maximumDiscountAmount:
          item.maximumDiscountAmount?.toString() || "",
        usageLimit:
          item.usageLimit?.toString() || "",
        expiresAt: item.expiresAt
          ? toDateTimeLocal(item.expiresAt)
          : "",
        isActive: item.isActive,
      });
    } catch (error: any) {
      showFeedback(
        "error",
        error?.message || "Failed to load coupon"
      );

      window.setTimeout(() => {
        router.push("/admin/coupons");
      }, 1200);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchCoupon();
    }
  }, [id]);

  function updateField(
    field: string,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveCoupon() {
    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/coupons/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update coupon"
        );
      }

      setCoupon(data.coupon);

      showFeedback(
        "success",
        "Coupon updated successfully"
      );
    } catch (error: any) {
      showFeedback(
        "error",
        error?.message ||
          "Failed to update coupon"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCoupon() {
    if (!coupon) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/coupons/${id}`,
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

      setDeleteModal(false);

      showFeedback(
        "success",
        `${coupon.code} has been deleted`
      );

      window.setTimeout(() => {
        router.push("/admin/coupons");
      }, 700);
    } catch (error: any) {
      showFeedback(
        "error",
        error?.message ||
          "Failed to delete coupon"
      );
    } finally {
      setDeleting(false);
    }
  }

  async function copyCode() {
    if (!coupon) return;

    try {
      await navigator.clipboard.writeText(
        coupon.code
      );

      showFeedback(
        "success",
        "Coupon code copied to clipboard"
      );
    } catch {
      showFeedback(
        "error",
        "Unable to copy coupon code"
      );
    }
  }

  function showFeedback(
    type: "success" | "error",
    message: string
  ) {
    setFeedback({
      type,
      message,
    });

    window.setTimeout(() => {
      setFeedback(null);
    }, 3200);
  }

  if (loading) {
    return <LoadingState />;
  }

  if (!coupon) {
    return null;
  }

  const usagePercentage = coupon.usageLimit
    ? Math.min(
        (coupon.usedCount /
          coupon.usageLimit) *
          100,
        100
      )
    : 0;

  const remainingUses = coupon.usageLimit
    ? Math.max(
        coupon.usageLimit - coupon.usedCount,
        0
      )
    : null;

  return (
    <div className="min-h-screen bg-white text-[#10291d]">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        {/* =====================================================
            TOP NAVIGATION
        ====================================================== */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/coupons"
            className="group inline-flex w-fit items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-[#627369] transition hover:bg-[#f1f6f2] hover:text-[#10291d]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Coupons
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/coupons"
              className="hidden rounded-xl border border-[#dce7de] bg-white px-4 py-2.5 text-xs font-bold text-[#5d7064] transition hover:bg-[#f4f8f4] sm:inline-flex"
            >
              All Campaigns
            </Link>

            <button
              type="button"
              onClick={() => setDeleteModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-xs font-bold text-red-600 transition hover:border-red-200 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="relative mb-6 overflow-hidden rounded-[32px] bg-[#10291d] shadow-[0_24px_75px_rgba(16,41,29,0.16)]">
          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#315c42]/45 blur-3xl" />
          <div className="absolute -bottom-36 left-[42%] h-96 w-96 rounded-full bg-[#c5dda8]/10 blur-3xl" />
          <div className="absolute right-[32%] top-12 h-40 w-40 rounded-full bg-white/[0.035] blur-3xl" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            {/* Breadcrumb */}
            <div className="mb-7 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9eb2a5]">
              <span>Marketing</span>
              <span className="text-white/20">/</span>
              <span>Coupons</span>
              <span className="text-white/20">/</span>
              <span className="text-[#c5dda8]">
                Campaign
              </span>
            </div>

            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] border border-white/10 bg-white/[0.07] shadow-inner">
                    <Tag
                      size={27}
                      className="text-[#c5dda8]"
                    />

                    <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-[3px] border-[#10291d] bg-[#c5dda8]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="break-all text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl lg:text-[46px] lg:leading-none">
                        {coupon.code}
                      </h1>

                      <button
                        type="button"
                        onClick={copyCode}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#b6c7bc] transition hover:bg-white/[0.12] hover:text-white"
                        title="Copy coupon code"
                      >
                        <Copy size={15} />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusBadge
                        state={coupon.state}
                        dark
                      />

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold text-[#c5d3ca]">
                        <CalendarDays size={12} />
                        Created{" "}
                        {formatDate(coupon.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-6 max-w-2xl text-sm leading-6 text-[#aebfb5]">
                  Review campaign performance, update
                  promotional rules, and control the
                  availability of this coupon from one
                  place.
                </p>
              </div>

              {/* Discount Highlight */}
              <div className="shrink-0 rounded-[25px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm sm:min-w-[220px]">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#9db1a4]">
                  <Percent size={13} />
                  Campaign Value
                </div>

                <p className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#c5dda8]">
                  {coupon.discountType ===
                  "percentage"
                    ? `${coupon.discountValue}%`
                    : `₨${coupon.discountValue.toLocaleString()}`}
                </p>

                <p className="mt-1 text-xs font-medium text-[#aebfb5]">
                  {coupon.discountType ===
                  "percentage"
                    ? "Percentage discount"
                    : "Fixed amount discount"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            METRICS
        ====================================================== */}

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Times Used"
            value={coupon.usedCount.toLocaleString()}
            description={
              remainingUses !== null
                ? `${remainingUses.toLocaleString()} uses remaining`
                : "Unlimited campaign usage"
            }
            icon={<Users size={18} />}
          />

          <MetricCard
            label="Usage Limit"
            value={
              coupon.usageLimit
                ? coupon.usageLimit.toLocaleString()
                : "Unlimited"
            }
            description={
              coupon.usageLimit
                ? `${Math.round(
                    usagePercentage
                  )}% of limit consumed`
                : "No usage restriction"
            }
            icon={<TrendingUp size={18} />}
            accent
          />

          <MetricCard
            label="Minimum Order"
            value={
              coupon.minimumOrderAmount
                ? `₨${coupon.minimumOrderAmount.toLocaleString()}`
                : "None"
            }
            description="Minimum cart requirement"
            icon={<Tag size={18} />}
          />

          <MetricCard
            label="Expiration"
            value={
              coupon.expiresAt
                ? formatDate(coupon.expiresAt)
                : "Never"
            }
            description={
              coupon.expiresAt
                ? formatDateTime(coupon.expiresAt)
                : "No expiry configured"
            }
            icon={<CalendarDays size={18} />}
          />
        </section>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* ===================================================
              LEFT / EDIT WORKSPACE
          ==================================================== */}

          <section className="overflow-hidden rounded-[28px] border border-[#dfe9e1] bg-white shadow-[0_16px_55px_rgba(16,41,29,0.065)]">
            <div className="border-b border-[#e8eee9] p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#315c42]">
                  <Edit3 size={17} />
                </div>

                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[#10291d]">
                    Campaign Configuration
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[#7c8b82]">
                    Adjust the promotional rules and
                    availability for this coupon.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Coupon Code */}
                <Field
                  label="Coupon Code"
                  hint="Public promotional code"
                >
                  <div className="relative">
                    <Tag
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#87978d]"
                    />

                    <input
                      value={form.code}
                      onChange={(e) =>
                        updateField(
                          "code",
                          e.target.value
                            .toUpperCase()
                            .replace(
                              /[^A-Z0-9_-]/g,
                              ""
                            )
                        )
                      }
                      className={`${inputClass} pl-11 font-bold tracking-[0.08em]`}
                      placeholder="SUMMER25"
                    />
                  </div>
                </Field>

                {/* Discount Type */}
                <Field
                  label="Discount Type"
                  hint="How the discount is calculated"
                >
                  <div className="relative">
                    <Percent
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#87978d]"
                    />

                    <select
                      value={form.discountType}
                      onChange={(e) =>
                        updateField(
                          "discountType",
                          e.target.value
                        )
                      }
                      className={`${inputClass} appearance-none pl-11`}
                    >
                      <option value="percentage">
                        Percentage
                      </option>

                      <option value="fixed">
                        Fixed Amount
                      </option>
                    </select>

                    <ChevronRight
                      size={15}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#829188]"
                    />
                  </div>
                </Field>

                {/* Discount Value */}
                <Field
                  label="Discount Value"
                  hint={
                    form.discountType ===
                    "percentage"
                      ? "Maximum 100%"
                      : "Amount in PKR"
                  }
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#829188]">
                      {form.discountType ===
                      "percentage"
                        ? "%"
                        : "₨"}
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      max={
                        form.discountType ===
                        "percentage"
                          ? "100"
                          : undefined
                      }
                      value={form.discountValue}
                      onChange={(e) =>
                        updateField(
                          "discountValue",
                          e.target.value
                        )
                      }
                      className={`${inputClass} pl-11 font-semibold`}
                      placeholder="25"
                    />
                  </div>
                </Field>

                {/* Minimum Order */}
                <Field
                  label="Minimum Order Amount"
                  hint="Optional cart requirement"
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#829188]">
                      ₨
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.minimumOrderAmount
                      }
                      onChange={(e) =>
                        updateField(
                          "minimumOrderAmount",
                          e.target.value
                        )
                      }
                      placeholder="None"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                {/* Maximum Discount */}
                <Field
                  label="Maximum Discount"
                  hint="Optional cap on discount"
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#829188]">
                      ₨
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        form.maximumDiscountAmount
                      }
                      onChange={(e) =>
                        updateField(
                          "maximumDiscountAmount",
                          e.target.value
                        )
                      }
                      placeholder="None"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                {/* Usage Limit */}
                <Field
                  label="Usage Limit"
                  hint="Leave empty for unlimited"
                >
                  <div className="relative">
                    <Users
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#87978d]"
                    />

                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={form.usageLimit}
                      onChange={(e) =>
                        updateField(
                          "usageLimit",
                          e.target.value
                        )
                      }
                      placeholder="Unlimited"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                {/* Expiry */}
                <Field
                  label="Expiry Date"
                  hint="Optional campaign deadline"
                >
                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#87978d]"
                    />

                    <input
                      type="datetime-local"
                      value={form.expiresAt}
                      onChange={(e) =>
                        updateField(
                          "expiresAt",
                          e.target.value
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>

                {/* Status */}
                <Field
                  label="Campaign Status"
                  hint="Control coupon availability"
                >
                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "isActive",
                        !form.isActive
                      )
                    }
                    className={`group flex h-12 w-full items-center justify-between rounded-2xl border px-4 transition-all ${
                      form.isActive
                        ? "border-emerald-200 bg-emerald-50/70 hover:border-emerald-300 hover:bg-emerald-50"
                        : "border-[#dce4de] bg-[#f8faf8] hover:border-[#cbd8ce]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                          form.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {form.isActive ? (
                          <CheckCircle2
                            size={16}
                          />
                        ) : (
                          <XCircle size={16} />
                        )}
                      </span>

                      <span
                        className={`text-sm font-bold ${
                          form.isActive
                            ? "text-emerald-700"
                            : "text-slate-600"
                        }`}
                      >
                        {form.isActive
                          ? "Campaign Active"
                          : "Campaign Inactive"}
                      </span>
                    </div>

                    <span
                      className={`relative h-6 w-11 rounded-full p-1 transition-colors ${
                        form.isActive
                          ? "bg-[#315c42]"
                          : "bg-[#cbd5ce]"
                      }`}
                    >
                      <span
                        className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                          form.isActive
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </span>
                  </button>
                </Field>
              </div>

              {/* =================================================
                  SYSTEM NOTE
              ================================================== */}

              <div className="mt-7 overflow-hidden rounded-[22px] border border-[#dce7de] bg-[#f8fbf8]">
                <div className="flex gap-3 p-4 sm:p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9f2ea] text-[#315c42]">
                    <ShieldCheck size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#24382b]">
                      Automated campaign tracking
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#7b8a80]">
                      The{" "}
                      <strong className="font-bold text-[#53665b]">
                        used count
                      </strong>{" "}
                      is managed automatically by the
                      order system. It should only increase
                      after a successful order applies this
                      coupon.
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================== */}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#edf1ee] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/admin/coupons"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#dce7de] bg-white px-5 text-sm font-bold text-[#617268] transition hover:bg-[#f5f8f5] hover:text-[#10291d]"
                >
                  Cancel
                </Link>

                <button
                  type="button"
                  onClick={saveCoupon}
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#10291d] px-7 text-sm font-bold text-white shadow-[0_10px_25px_rgba(16,41,29,0.14)] transition-all hover:-translate-y-0.5 hover:bg-[#193d2b] hover:shadow-[0_14px_30px_rgba(16,41,29,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* ===================================================
              RIGHT / CAMPAIGN INTELLIGENCE
          ==================================================== */}

          <aside className="space-y-6">
            {/* Usage Intelligence */}
            <section className="overflow-hidden rounded-[28px] border border-[#dfe9e1] bg-white shadow-[0_14px_45px_rgba(16,41,29,0.06)]">
              <div className="border-b border-[#e9efea] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4ee] text-[#315c42]">
                    <TrendingUp size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#10291d]">
                      Campaign Usage
                    </h3>

                    <p className="mt-0.5 text-[11px] text-[#849289]">
                      Redemption performance
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-black tracking-[-0.04em] text-[#10291d]">
                      {coupon.usedCount}
                    </p>

                    <p className="mt-1 text-xs text-[#829188]">
                      {coupon.usageLimit
                        ? `of ${coupon.usageLimit} total uses`
                        : "redemptions"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-black text-[#315c42]">
                      {coupon.usageLimit
                        ? `${Math.round(
                            usagePercentage
                          )}%`
                        : "∞"}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#8c9a91]">
                      Consumed
                    </p>
                  </div>
                </div>

                {coupon.usageLimit ? (
                  <>
                    <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#e9efea]">
                      <div
                        className="h-full rounded-full bg-[#315c42] transition-all duration-500"
                        style={{
                          width: `${usagePercentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-[#8a998f]">
                      <span>
                        {coupon.usedCount} used
                      </span>

                      <span>
                        {remainingUses} remaining
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mt-5 rounded-2xl bg-[#f5f9f5] p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#52665a]">
                      <Zap
                        size={14}
                        className="text-[#315c42]"
                      />
                      Unlimited redemption capacity
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Campaign Rules */}
            <section className="overflow-hidden rounded-[28px] border border-[#dfe9e1] bg-white shadow-[0_14px_45px_rgba(16,41,29,0.06)]">
              <div className="border-b border-[#e9efea] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4ee] text-[#315c42]">
                    <Tag size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#10291d]">
                      Campaign Rules
                    </h3>

                    <p className="mt-0.5 text-[11px] text-[#849289]">
                      Current coupon conditions
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#edf1ee]">
                <RuleRow
                  label="Discount"
                  value={
                    coupon.discountType ===
                    "percentage"
                      ? `${coupon.discountValue}%`
                      : `₨${coupon.discountValue.toLocaleString()}`
                  }
                  icon={<Percent size={14} />}
                />

                <RuleRow
                  label="Minimum order"
                  value={
                    coupon.minimumOrderAmount
                      ? `₨${coupon.minimumOrderAmount.toLocaleString()}`
                      : "No minimum"
                  }
                  icon={<Tag size={14} />}
                />

                <RuleRow
                  label="Maximum discount"
                  value={
                    coupon.maximumDiscountAmount
                      ? `₨${coupon.maximumDiscountAmount.toLocaleString()}`
                      : "No cap"
                  }
                  icon={<TrendingUp size={14} />}
                />

                <RuleRow
                  label="Usage limit"
                  value={
                    coupon.usageLimit
                      ? coupon.usageLimit.toLocaleString()
                      : "Unlimited"
                  }
                  icon={<Users size={14} />}
                />

                <RuleRow
                  label="Expires"
                  value={
                    coupon.expiresAt
                      ? formatDate(coupon.expiresAt)
                      : "Never"
                  }
                  icon={<CalendarDays size={14} />}
                />
              </div>
            </section>

            {/* System Information */}
            <section className="rounded-[28px] border border-[#dfe9e1] bg-[#f8fbf8] p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#315c42] shadow-sm">
                  <Clock3 size={16} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#607369]">
                    Last Updated
                  </p>

                  <p className="mt-1.5 text-sm font-bold text-[#24382b]">
                    {formatDateTime(
                      coupon.updatedAt
                    )}
                  </p>

                  <p className="mt-2 text-[11px] leading-5 text-[#849289]">
                    Changes to this campaign are
                    synchronized with the store coupon
                    system.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {deleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07130d]/60 px-4 py-6 backdrop-blur-md">
          <div className="w-full max-w-[440px] overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_35px_110px_rgba(0,0,0,0.24)]">
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Trash2 size={21} />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteModal(false)
                  }
                  disabled={deleting}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#829188] transition hover:bg-[#f2f6f3] hover:text-[#10291d]"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="mt-6 text-xl font-bold tracking-tight text-[#10291d]">
                Delete this campaign?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#718077]">
                This will permanently remove{" "}
                <span className="font-bold text-[#10291d]">
                  {coupon.code}
                </span>{" "}
                from your coupon system. This action
                cannot be undone.
              </p>

              <div className="mt-5 rounded-2xl border border-[#e5ebe6] bg-[#f8fbf8] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8c9a91]">
                      Campaign
                    </p>

                    <p className="mt-1 font-bold tracking-[0.06em] text-[#10291d]">
                      {coupon.code}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8c9a91]">
                      Discount
                    </p>

                    <p className="mt-1 font-bold text-[#315c42]">
                      {coupon.discountType ===
                      "percentage"
                        ? `${coupon.discountValue}%`
                        : `₨${coupon.discountValue.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteModal(false)
                  }
                  disabled={deleting}
                  className="rounded-xl border border-[#dce7de] px-5 py-3 text-sm font-bold text-[#53665b] transition hover:bg-[#f5f8f5] disabled:opacity-50"
                >
                  Keep Coupon
                </button>

                <button
                  type="button"
                  onClick={deleteCoupon}
                  disabled={deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={15} />

                  {deleting
                    ? "Deleting..."
                    : "Delete Permanently"}
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
          <div className="flex items-start gap-3 rounded-[20px] border border-white/10 bg-[#10291d] p-4 text-white shadow-[0_20px_60px_rgba(16,41,29,0.25)]">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
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
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#a8bbae]">
                {feedback.type === "success"
                  ? "Success"
                  : "Action failed"}
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
   STATUS BADGE
============================================================ */

function StatusBadge({
  state,
  dark = false,
}: {
  state: Coupon["state"];
  dark?: boolean;
}) {
  const styles = {
    active: dark
      ? "border-emerald-300/20 bg-emerald-400/10 text-[#c5dda8]"
      : "border-emerald-200 bg-emerald-50 text-emerald-700",

    inactive: dark
      ? "border-white/10 bg-white/[0.06] text-[#c3cec7]"
      : "border-slate-200 bg-slate-100 text-slate-600",

    expired: dark
      ? "border-red-300/20 bg-red-400/10 text-red-200"
      : "border-red-200 bg-red-50 text-red-700",

    used: dark
      ? "border-amber-300/20 bg-amber-400/10 text-amber-200"
      : "border-amber-200 bg-amber-50 text-amber-700",
  };

  const labels = {
    active: "Active",
    inactive: "Inactive",
    expired: "Expired",
    used: "Used Up",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold ${styles[state]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[state]}
    </span>
  );
}

/* ============================================================
   METRIC CARD
============================================================ */

function MetricCard({
  label,
  value,
  description,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[23px] border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(16,41,29,0.07)] ${
        accent
          ? "border-[#cfded1] bg-[#f8fbf8]"
          : "border-[#dfe9e1] bg-white"
      }`}
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#edf4ee] blur-2xl transition-transform duration-500 group-hover:scale-125" />

      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce8df] bg-[#edf4ee] text-[#315c42]">
          {icon}
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a998f]">
          {label}
        </p>

        <p className="mt-1 truncate text-[24px] font-black tracking-[-0.04em] text-[#10291d]">
          {value}
        </p>

        <p className="mt-1 text-[11px] font-medium text-[#829188]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-end justify-between gap-3">
        <label className="text-sm font-bold text-[#31483a]">
          {label}
        </label>

        {hint && (
          <span className="hidden text-[10px] font-medium text-[#9aa79f] sm:block">
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

/* ============================================================
   RULE ROW
============================================================ */

function RuleRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f1] text-[#60766a]">
          {icon}
        </div>

        <span className="text-xs font-medium text-[#7a8980]">
          {label}
        </span>
      </div>

      <span className="truncate text-right text-xs font-bold text-[#263a2e]">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   INPUT
============================================================ */

const inputClass =
  "h-12 w-full rounded-2xl border border-[#dce7de] bg-[#fbfdfb] px-4 text-sm font-medium text-[#20352a] outline-none transition-all placeholder:text-[#a0aca4] hover:border-[#cbd9ce] focus:border-[#6e907a] focus:bg-white focus:ring-4 focus:ring-[#eaf2ec]";

/* ============================================================
   LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mb-5 h-10 w-40 animate-pulse rounded-xl bg-[#edf4ee]" />

        <div className="relative mb-6 overflow-hidden rounded-[32px] bg-[#10291d] p-8 sm:p-10">
          <div className="animate-pulse">
            <div className="h-3 w-28 rounded-full bg-white/10" />
            <div className="mt-7 h-12 max-w-sm rounded-2xl bg-white/10" />
            <div className="mt-4 h-4 max-w-xl rounded-full bg-white/10" />
            <div className="mt-2 h-4 max-w-md rounded-full bg-white/10" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-[23px] bg-[#f1f6f2]"
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="h-[600px] animate-pulse rounded-[28px] bg-[#f5f8f5]" />
          <div className="space-y-6">
            <div className="h-64 animate-pulse rounded-[28px] bg-[#f5f8f5]" />
            <div className="h-72 animate-pulse rounded-[28px] bg-[#f5f8f5]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DATE HELPERS
============================================================ */

function formatDate(date?: string) {
  if (!date) return "Never";

  return new Date(date).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatDateTime(date?: string) {
  if (!date) return "Never";

  return new Date(date).toLocaleString(
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

/* ============================================================
   DATETIME LOCAL
============================================================ */

function toDateTimeLocal(date: string) {
  const value = new Date(date);

  const offset =
    value.getTimezoneOffset() * 60000;

  return new Date(
    value.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
}