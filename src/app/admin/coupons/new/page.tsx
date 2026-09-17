"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Layers3,
  Percent,
  Save,
  ShieldCheck,
  Sparkles,
  Tag,
  TicketPercent,
  Trash2,
  Users,
  X,
  Zap,
} from "lucide-react";

export default function NewCouponPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

  function updateField(field: string, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function copyCode() {
    if (!form.code) return;

    try {
      await navigator.clipboard.writeText(form.code);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setFeedback({
        type: "error",
        message: "Unable to copy the coupon code.",
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setFeedback(null);

      const response = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create coupon");
      }

      setFeedback({
        type: "success",
        message: "Coupon created successfully. Opening coupon details...",
      });

      window.setTimeout(() => {
        router.push(`/admin/coupons/${data.coupon._id}`);
      }, 700);
    } catch (error: any) {
      setFeedback({
        type: "error",
        message: error?.message || "Failed to create coupon",
      });
    } finally {
      setLoading(false);
    }
  }

  const discountLabel =
    form.discountType === "percentage"
      ? `${form.discountValue || "0"}%`
      : `${form.discountValue || "0"} PKR`;

  const ruleCount = useMemo(() => {
    let count = 0;

    if (form.minimumOrderAmount) count++;
    if (form.maximumDiscountAmount) count++;
    if (form.usageLimit) count++;
    if (form.expiresAt) count++;

    return count;
  }, [
    form.minimumOrderAmount,
    form.maximumDiscountAmount,
    form.usageLimit,
    form.expiresAt,
  ]);

  return (
    <div className="min-h-screen bg-white px-4 py-5 text-[#10291d] sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-[1480px]">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-xs font-medium text-[#829188] sm:text-sm">
          <Link
            href="/admin/coupons"
            className="transition hover:text-[#10291d]"
          >
            Coupons
          </Link>

          <ChevronRight size={14} />

          <span className="text-[#315c42]">Create</span>
        </div>

        {/* Luxury Hero */}
        <section className="relative mb-6 overflow-hidden rounded-[30px] bg-[#10291d] px-5 py-7 text-white shadow-[0_24px_70px_rgba(16,41,29,0.16)] sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#315c42]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-[38%] h-64 w-64 rounded-full bg-[#c5dda8]/10 blur-3xl" />
          <div className="pointer-events-none absolute right-[18%] top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border border-white/5" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#c5dda8]">
                <Sparkles size={13} />
                Campaign Studio
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-[42px]">
                Create a new coupon
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
                Build a polished discount campaign with clear rules,
                controlled usage, and a customer-ready redemption code.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] sm:flex">
                <TicketPercent
                  size={29}
                  strokeWidth={1.7}
                  className="text-[#c5dda8]"
                />
              </div>

              <Link
                href="/admin/coupons"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-semibold text-white/80 transition hover:bg-white/[0.11] hover:text-white"
              >
                <ArrowLeft size={16} />
                Back to Coupons
              </Link>
            </div>
          </div>

          {/* Hero bottom metrics */}
          <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:flex sm:items-center sm:gap-8">
            <HeroMetric
              icon={<TicketPercent size={15} />}
              label="Campaign"
              value={form.code || "Draft"}
            />

            <HeroMetric
              icon={<Percent size={15} />}
              label="Discount"
              value={discountLabel}
            />

            <HeroMetric
              icon={<Layers3 size={15} />}
              label="Rules"
              value={`${ruleCount} configured`}
            />

            <HeroMetric
              icon={<ShieldCheck size={15} />}
              label="Status"
              value={form.isActive ? "Active" : "Inactive"}
            />
          </div>
        </section>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-sm ${
              feedback.type === "success"
                ? "border-[#cfe1d3] bg-[#f1f7f2] text-[#28563a]"
                : "border-red-100 bg-red-50 text-red-700"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {feedback.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <X size={18} />
              )}
            </div>

            <p className="flex-1 text-sm font-medium">
              {feedback.message}
            </p>

            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="shrink-0 opacity-60 transition hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Coupon Details */}
              <section className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_12px_45px_rgba(16,41,29,0.045)]">
                <SectionHeader
                  icon={<Tag size={19} />}
                  eyebrow="01 / Identity"
                  title="Coupon details"
                  description="Define the code and the core discount customers will receive."
                />

                <div className="p-5 sm:p-7 lg:p-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Coupon Code"
                      required
                      hint="Use letters, numbers, hyphens or underscores."
                      icon={<Tag size={16} />}
                    >
                      <div className="relative">
                        <input
                          value={form.code}
                          onChange={(e) =>
                            updateField(
                              "code",
                              e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9_-]/g, "")
                            )
                          }
                          placeholder="WELCOME10"
                          maxLength={50}
                          className={`${inputClass} pr-12 font-semibold tracking-[0.08em]`}
                          required
                        />

                        {form.code && (
                          <button
                            type="button"
                            onClick={copyCode}
                            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#708178] transition hover:bg-[#edf3e9] hover:text-[#10291d]"
                            title="Copy coupon code"
                          >
                            {copied ? (
                              <Check size={15} />
                            ) : (
                              <Copy size={15} />
                            )}
                          </button>
                        )}
                      </div>
                    </Field>

                    <Field
                      label="Discount Type"
                      required
                      hint="Choose between percentage or fixed amount."
                      icon={<Percent size={16} />}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <ChoiceButton
                          active={
                            form.discountType === "percentage"
                          }
                          onClick={() =>
                            updateField(
                              "discountType",
                              "percentage"
                            )
                          }
                          icon={<Percent size={15} />}
                          label="Percentage"
                        />

                        <ChoiceButton
                          active={form.discountType === "fixed"}
                          onClick={() =>
                            updateField("discountType", "fixed")
                          }
                          icon={<Tag size={15} />}
                          label="Fixed"
                        />
                      </div>
                    </Field>

                    <Field
                      label={
                        form.discountType === "percentage"
                          ? "Discount Percentage"
                          : "Discount Amount"
                      }
                      required
                      hint={
                        form.discountType === "percentage"
                          ? "Maximum allowed is 100%."
                          : "Enter the discount amount in PKR."
                      }
                      icon={
                        form.discountType === "percentage" ? (
                          <Percent size={16} />
                        ) : (
                          <Tag size={16} />
                        )
                      }
                    >
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max={
                            form.discountType === "percentage"
                              ? "100"
                              : undefined
                          }
                          step="0.01"
                          value={form.discountValue}
                          onChange={(e) =>
                            updateField(
                              "discountValue",
                              e.target.value
                            )
                          }
                          placeholder={
                            form.discountType === "percentage"
                              ? "10"
                              : "500"
                          }
                          className={`${inputClass} pr-16`}
                          required
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#74847a]">
                          {form.discountType === "percentage"
                            ? "%"
                            : "PKR"}
                        </span>
                      </div>
                    </Field>
                  </div>
                </div>
              </section>

              {/* Usage Rules */}
              <section className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_12px_45px_rgba(16,41,29,0.045)]">
                <SectionHeader
                  icon={<ShieldCheck size={19} />}
                  eyebrow="02 / Rules"
                  title="Usage rules"
                  description="Set the boundaries that control how this campaign can be redeemed."
                />

                <div className="p-5 sm:p-7 lg:p-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Minimum Order Amount"
                      hint="Leave empty for no minimum order."
                      icon={<Tag size={16} />}
                    >
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.minimumOrderAmount}
                          onChange={(e) =>
                            updateField(
                              "minimumOrderAmount",
                              e.target.value
                            )
                          }
                          placeholder="2000"
                          className={`${inputClass} pr-16`}
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#829188]">
                          PKR
                        </span>
                      </div>
                    </Field>

                    <Field
                      label="Maximum Discount"
                      hint="Recommended for percentage campaigns."
                      icon={<Percent size={16} />}
                    >
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.maximumDiscountAmount}
                          onChange={(e) =>
                            updateField(
                              "maximumDiscountAmount",
                              e.target.value
                            )
                          }
                          placeholder="1000"
                          className={`${inputClass} pr-16`}
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#829188]">
                          PKR
                        </span>
                      </div>
                    </Field>

                    <Field
                      label="Usage Limit"
                      hint="Leave empty to allow unlimited usage."
                      icon={<Users size={16} />}
                    >
                      <div className="relative">
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
                          placeholder="100"
                          className={`${inputClass} pr-20`}
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#829188]">
                          USES
                        </span>
                      </div>
                    </Field>

                    <Field
                      label="Expiry Date"
                      hint="Leave empty for a coupon without an expiry."
                      icon={<CalendarDays size={16} />}
                    >
                      <div className="relative">
                        <CalendarDays
                          size={16}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#829188]"
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
                  </div>

                  {/* Rule summary */}
                  <div className="mt-7 rounded-2xl border border-[#dfe9e1] bg-[#f8fbf8] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f0e9] text-[#315c42]">
                        <ShieldCheck size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#20382a]">
                          Campaign protection
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#7b8b81]">
                          {ruleCount === 0
                            ? "No additional restrictions configured. This coupon will use the core discount settings."
                            : `${ruleCount} additional ${
                                ruleCount === 1
                                  ? "restriction is"
                                  : "restrictions are"
                              } configured for this campaign.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Status */}
              <section className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_12px_45px_rgba(16,41,29,0.045)]">
                <SectionHeader
                  icon={<Zap size={19} />}
                  eyebrow="03 / Availability"
                  title="Campaign status"
                  description="Choose whether customers should be able to use this coupon immediately."
                />

                <div className="p-5 sm:p-7 lg:p-8">
                  <button
                    type="button"
                    onClick={() =>
                      updateField("isActive", !form.isActive)
                    }
                    className={`group flex w-full items-center justify-between gap-5 rounded-2xl border p-4 text-left transition sm:p-5 ${
                      form.isActive
                        ? "border-[#cfe0d3] bg-[#f2f7f3]"
                        : "border-[#e1e7e2] bg-[#fafbfa]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          form.isActive
                            ? "bg-[#315c42] text-[#c5dda8]"
                            : "bg-[#e8ece9] text-[#718078]"
                        }`}
                      >
                        {form.isActive ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Clock3 size={20} />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#20382a]">
                          {form.isActive
                            ? "Coupon is active"
                            : "Coupon is inactive"}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#7d8c83]">
                          {form.isActive
                            ? "Customers can use this coupon as soon as it is created."
                            : "The coupon will be created but won't be available for customers."}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                        form.isActive
                          ? "bg-[#315c42]"
                          : "bg-[#cbd4cd]"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-all ${
                          form.isActive ? "left-6" : "left-1"
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6">
              {/* Live Preview */}
              <section className="overflow-hidden rounded-[28px] border border-[#d9e4dc] bg-[#edf3e9] shadow-[0_12px_45px_rgba(16,41,29,0.06)]">
                <div className="border-b border-[#d7e2d9] px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#718477]">
                        Live preview
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-[#10291d]">
                        Customer view
                      </h2>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#315c42] shadow-sm">
                      <Sparkles size={16} />
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {/* Coupon ticket */}
                  <div className="relative overflow-hidden rounded-[24px] bg-[#10291d] p-5 text-white shadow-[0_18px_45px_rgba(16,41,29,0.18)]">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#315c42] blur-2xl" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#c5dda8]">
                          <TicketPercent size={19} />
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                            form.isActive
                              ? "bg-[#c5dda8] text-[#10291d]"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {form.isActive ? "Active" : "Draft"}
                        </span>
                      </div>

                      <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                        Discount code
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-3">
                        <p className="truncate text-2xl font-bold tracking-[0.06em] text-white">
                          {form.code || "COUPONCODE"}
                        </p>

                        {form.code && (
                          <button
                            type="button"
                            onClick={copyCode}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/70 transition hover:bg-white/15 hover:text-white"
                          >
                            {copied ? (
                              <Check size={15} />
                            ) : (
                              <Copy size={15} />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-white/40">
                            Customer saves
                          </p>

                          <p className="mt-1 text-xl font-bold text-[#c5dda8]">
                            {discountLabel}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wider text-white/40">
                            Rules
                          </p>

                          <p className="mt-1 text-sm font-semibold text-white/75">
                            {ruleCount} active
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview rules */}
                  <div className="mt-4 space-y-2">
                    {form.minimumOrderAmount && (
                      <PreviewRule
                        label="Minimum order"
                        value={`${form.minimumOrderAmount} PKR`}
                      />
                    )}

                    {form.maximumDiscountAmount && (
                      <PreviewRule
                        label="Maximum discount"
                        value={`${form.maximumDiscountAmount} PKR`}
                      />
                    )}

                    {form.usageLimit && (
                      <PreviewRule
                        label="Usage limit"
                        value={`${form.usageLimit} uses`}
                      />
                    )}

                    {form.expiresAt && (
                      <PreviewRule
                        label="Expires"
                        value={formatPreviewDate(form.expiresAt)}
                      />
                    )}

                    {ruleCount === 0 && (
                      <div className="rounded-xl border border-[#d8e4da] bg-white/60 px-3 py-3 text-xs text-[#77877d]">
                        No additional usage restrictions have been added.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Campaign Snapshot */}
              <section className="rounded-[28px] border border-[#dfe8e1] bg-white p-5 shadow-[0_12px_45px_rgba(16,41,29,0.045)] sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                    <Layers3 size={18} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#87958c]">
                      Snapshot
                    </p>

                    <h3 className="mt-0.5 text-base font-bold text-[#20382a]">
                      Campaign summary
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <SummaryRow
                    label="Coupon"
                    value={form.code || "Not set"}
                    mono={Boolean(form.code)}
                  />

                  <SummaryRow
                    label="Discount"
                    value={discountLabel}
                  />

                  <SummaryRow
                    label="Minimum order"
                    value={
                      form.minimumOrderAmount
                        ? `${form.minimumOrderAmount} PKR`
                        : "No minimum"
                    }
                  />

                  <SummaryRow
                    label="Usage"
                    value={
                      form.usageLimit
                        ? `${form.usageLimit} uses`
                        : "Unlimited"
                    }
                  />

                  <SummaryRow
                    label="Availability"
                    value={form.isActive ? "Active" : "Inactive"}
                    valueClass={
                      form.isActive
                        ? "text-[#315c42]"
                        : "text-[#78867e]"
                    }
                  />
                </div>
              </section>

              {/* Trust note */}
              <div className="rounded-[24px] border border-[#dce7de] bg-[#f8faf8] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e7f0e9] text-[#315c42]">
                    <ShieldCheck size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#294032]">
                      Ready for checkout
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#829087]">
                      Your configured rules will be stored with the coupon
                      and applied through the existing checkout flow.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-7 rounded-[28px] border border-[#dfe8e1] bg-white p-4 shadow-[0_12px_45px_rgba(16,41,29,0.045)] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    form.isActive
                      ? "bg-[#e9f2eb] text-[#315c42]"
                      : "bg-[#f0f2f0] text-[#78867e]"
                  }`}
                >
                  {form.isActive ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Clock3 size={18} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-[#263b2e]">
                    {form.isActive
                      ? "Coupon will be active immediately"
                      : "Coupon will be created as inactive"}
                  </p>

                  <p className="mt-0.5 text-xs text-[#89968e]">
                    Review your settings before publishing the campaign.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Link
                  href="/admin/coupons"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#dce7de] bg-white px-6 text-sm font-semibold text-[#53675b] transition hover:border-[#cbd9cf] hover:bg-[#f7faf7] hover:text-[#10291d]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#10291d] px-7 text-sm font-bold text-white shadow-[0_10px_24px_rgba(16,41,29,0.15)] transition hover:-translate-y-0.5 hover:bg-[#193d2b] hover:shadow-[0_14px_30px_rgba(16,41,29,0.2)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                      Creating campaign...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Create Coupon
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        {icon}
        {label}
      </div>

      <p className="mt-1 truncate text-sm font-semibold text-white/80">
        {value}
      </p>
    </div>
  );
}

function SectionHeader({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 border-b border-[#e6ece7] px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#89978f]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-[-0.02em] text-[#193226]">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-[#829087] sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-[#30473a]">
        {icon && (
          <span className="text-[#6d8275]">
            {icon}
          </span>
        )}

        <span>
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </span>
      </label>

      {children}

      {hint && (
        <p className="mt-2 text-[11px] leading-4 text-[#8b9991]">
          {hint}
        </p>
      )}
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${
        active
          ? "border-[#315c42] bg-[#edf3e9] text-[#234832] shadow-[0_4px_15px_rgba(49,92,66,0.08)]"
          : "border-[#dce6de] bg-[#fbfdfb] text-[#718077] hover:border-[#c6d5ca] hover:bg-[#f7faf7]"
      }`}
    >
      <span
        className={
          active ? "text-[#315c42]" : "text-[#87958d]"
        }
      >
        {icon}
      </span>

      {label}
    </button>
  );
}

function PreviewRule({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#d9e4da] bg-white/65 px-3.5 py-3">
      <span className="text-xs text-[#78887e]">
        {label}
      </span>

      <span className="text-right text-xs font-bold text-[#31513d]">
        {value}
      </span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  mono,
  valueClass = "text-[#30473a]",
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#edf1ed] pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-[#829087]">
        {label}
      </span>

      <span
        className={`max-w-[58%] truncate text-right text-xs font-bold ${valueClass} ${
          mono ? "tracking-[0.08em]" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function formatPreviewDate(value: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const inputClass =
  "h-12 w-full rounded-xl border border-[#dce7de] bg-[#fbfdfb] px-4 text-sm text-[#20352a] outline-none transition duration-200 placeholder:text-[#a1aca5] hover:border-[#cbd9cf] focus:border-[#6f927b] focus:bg-white focus:ring-4 focus:ring-[#eaf2ec]";