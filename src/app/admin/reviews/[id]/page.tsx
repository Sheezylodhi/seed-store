"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  Mail,
  MessageSquare,
  Package,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

interface Review {
  _id: string;

  product?: {
    _id: string;
    name: string;
    slug?: string;
    images?: string[];
    price?: number;
    sku?: string;
  };

  customer?: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  };

  name: string;
  email?: string;
  rating: number;
  title?: string;
  comment: string;

  isApproved: boolean;
  isPublished: boolean;
  isVerifiedPurchase: boolean;

  createdAt: string;
  updatedAt: string;

  adminReply?: {
    message: string;
    repliedAt?: string;
    repliedBy?: {
      name?: string;
      email?: string;
    };
  };
}

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [reviewId, setReviewId] = useState("");

  const [review, setReview] = useState<Review | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isApproved, setIsApproved] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isVerifiedPurchase, setIsVerifiedPurchase] =
    useState(false);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [adminReply, setAdminReply] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    params.then((value) => {
      setReviewId(value.id);
    });
  }, [params]);

  const loadReview = async () => {
    if (!reviewId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/reviews/${reviewId}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load review"
        );
      }

      const data = result.data as Review;

      setReview(data);

      setIsApproved(data.isApproved);
      setIsPublished(data.isPublished);
      setIsVerifiedPurchase(
        data.isVerifiedPurchase
      );

      setRating(data.rating);
      setTitle(data.title || "");
      setComment(data.comment);
      setAdminReply(
        data.adminReply?.message || ""
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReview();
  }, [reviewId]);

  const saveReview = async () => {
    if (!reviewId) return;

    if (isPublished && !isApproved) {
      setFeedback({
        type: "error",
        message:
          "You must approve the review before publishing it.",
      });

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/reviews/${reviewId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isApproved,
            isPublished,
            isVerifiedPurchase,
            rating,
            title,
            comment,
            adminReply,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save review"
        );
      }

      setReview(result.data);

      setFeedback({
        type: "success",
        message: "Review updated successfully.",
      });
    } catch (error) {
      console.error(error);

      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update review",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/reviews/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete review"
        );
      }

      window.location.href = "/admin/reviews";
    } catch (error) {
      console.error(error);

      setDeleteModal(false);

      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete review",
      });

      setSaving(false);
    }
  };

  /* ========================================================= */
  /* LOADING */
  /* ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-[1550px]">
          <div className="relative overflow-hidden rounded-[30px] bg-[#10291d] px-6 py-16 text-center text-white shadow-[0_24px_70px_rgba(16,41,29,0.14)] md:px-10 md:py-24">
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#315c42]/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#c5dda8]/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
                <RefreshCw
                  size={26}
                  className="animate-spin text-[#c5dda8]"
                />
              </div>

              <p className="mt-5 text-sm font-semibold text-white">
                Loading review
              </p>

              <p className="mt-1 text-xs text-white/45">
                Preparing customer feedback workspace...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================= */
  /* NOT FOUND */
  /* ========================================================= */

  if (!review) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-[1550px]">
          <div className="relative overflow-hidden rounded-[30px] border border-[#e1e9e2] bg-white px-6 py-20 text-center shadow-[0_20px_60px_rgba(16,41,29,0.06)] md:py-28">
            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-red-100/50 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-400">
                <XCircle size={28} />
              </div>

              <h1 className="mt-5 text-xl font-semibold text-[#10291d]">
                Review not found
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718078]">
                The review may have been removed or the
                requested review could not be loaded.
              </p>

              <Link
                href="/admin/reviews"
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-[#10291d] px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(16,41,29,0.16)] transition hover:-translate-y-0.5 hover:bg-[#183c29]"
              >
                <ArrowLeft size={16} />
                Back to Reviews
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

        {/* ===================================================== */}
        {/* PREMIUM HERO */}
        {/* ===================================================== */}

        <section className="relative overflow-hidden rounded-[30px] bg-[#10291d] px-5 py-6 text-white shadow-[0_24px_70px_rgba(16,41,29,0.14)] md:px-8 md:py-8">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#315c42]/45 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 left-1/3 h-80 w-80 rounded-full bg-[#c5dda8]/10 blur-3xl" />
          <div className="pointer-events-none absolute right-[24%] top-1/2 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl" />

          <div className="relative z-10">
            {/* Breadcrumb */}
            <div className="mb-7 flex items-center gap-2 text-xs font-medium text-white/45">
              <Link
                href="/admin"
                className="transition hover:text-white"
              >
                Dashboard
              </Link>

              <span>/</span>

              <Link
                href="/admin/reviews"
                className="transition hover:text-white"
              >
                Reviews
              </Link>

              <span>/</span>

              <span className="text-white/80">
                Details
              </span>
            </div>

            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              <div className="flex min-w-0 items-start gap-4 md:gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] shadow-inner md:h-16 md:w-16">
                  <MessageSquare
                    size={25}
                    className="text-[#c5dda8]"
                  />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#c5dda8]">
                      Review Details
                    </span>

                    {isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#c5dda8]/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#c5dda8]">
                        <ShieldCheck size={11} />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <h1 className="truncate text-2xl font-semibold tracking-[-0.035em] md:text-4xl">
                    {title || "Customer Review"}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50">
                    <span>
                      Submitted {formatDateTime(review.createdAt)}
                    </span>

                    <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />

                    <span>
                      Reviewer:{" "}
                      <span className="font-semibold text-white/75">
                        {review.name}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={loadReview}
                  disabled={loading || saving}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.12] disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={
                      loading ? "animate-spin" : ""
                    }
                  />
                  Refresh
                </button>

                <button
                  onClick={() => setDeleteModal(true)}
                  disabled={saving}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-300/10 bg-red-500/10 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-500/15 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>

            {/* Hero information strip */}
            <div className="mt-8 grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] sm:grid-cols-3">
              <HeroInfo
                label="Rating"
                value={`${rating}.0 / 5`}
                icon={
                  <Star
                    size={15}
                    className="fill-[#d6a928] text-[#d6a928]"
                  />
                }
              />

              <HeroInfo
                label="Approval"
                value={isApproved ? "Approved" : "Pending"}
                icon={
                  isApproved ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <Clock3 size={15} />
                  )
                }
              />

              <HeroInfo
                label="Publication"
                value={
                  isPublished
                    ? "Published"
                    : "Unpublished"
                }
                icon={
                  isPublished ? (
                    <Eye size={15} />
                  ) : (
                    <EyeOff size={15} />
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* MAIN GRID */}
        {/* ===================================================== */}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_390px]">

          {/* =================================================== */}
          {/* MAIN COLUMN */}
          {/* =================================================== */}

          <main className="min-w-0 space-y-6">

            {/* PRODUCT */}
            <section className="rounded-[28px] border border-[#e1e9e2] bg-white p-5 shadow-[0_18px_55px_rgba(16,41,29,0.055)] md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#849189]">
                    Associated Product
                  </span>

                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#10291d]">
                    Product
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4ee] text-[#315c42]">
                  <Package size={18} />
                </div>
              </div>

              {review.product ? (
                <Link
                  href={`/admin/products/${review.product._id}`}
                  className="group mt-5 flex items-center gap-4 rounded-2xl border border-[#e3ebe4] bg-[#f9fbf9] p-4 transition hover:border-[#c7d7ca] hover:bg-[#f5f9f5]"
                >
                  {review.product.images?.[0] ? (
                    <img
                      src={review.product.images[0]}
                      alt={review.product.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-[#dce6de] md:h-[72px] md:w-[72px]"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#315c42] md:h-[72px] md:w-[72px]">
                      <Package size={24} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#89968e]">
                      Product receiving feedback
                    </p>

                    <h3 className="mt-1 truncate text-base font-bold text-[#10291d] md:text-lg">
                      {review.product.name}
                    </h3>

                    {review.product.sku && (
                      <p className="mt-1 text-xs text-[#819087]">
                        SKU:{" "}
                        <span className="font-semibold">
                          {review.product.sku}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dce6de] bg-white text-[#53655b] transition group-hover:border-[#315c42] group-hover:bg-[#10291d] group-hover:text-white sm:flex">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ) : (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/70 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-500">
                    <XCircle size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-red-600">
                      Product removed
                    </p>

                    <p className="mt-0.5 text-xs text-red-500/80">
                      This review is no longer linked to an
                      existing product.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* REVIEW EDITOR */}
            <section className="overflow-hidden rounded-[28px] border border-[#e1e9e2] bg-white shadow-[0_18px_55px_rgba(16,41,29,0.055)]">
              <div className="border-b border-[#e6ece7] px-5 py-5 md:px-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#849189]">
                      Customer Feedback
                    </span>

                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#10291d]">
                      Review Content
                    </h2>
                  </div>

                  <div className="inline-flex items-center gap-2 self-start rounded-xl bg-[#fff9e8] px-3 py-2">
                    <Stars rating={rating} />

                    <span className="text-xs font-bold text-[#7d641c]">
                      {rating}.0
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-5 md:p-7">

                {/* Rating */}
                <div>
                  <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#849189]">
                    Rating
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                      value={rating}
                      onChange={(e) =>
                        setRating(
                          Number(e.target.value)
                        )
                      }
                      className="h-12 w-full rounded-xl border border-[#dce6de] bg-[#fbfdfb] px-3 text-sm font-semibold text-[#304238] outline-none transition focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/[0.06] sm:w-40"
                    >
                      <option value={5}>
                        5 Stars
                      </option>
                      <option value={4}>
                        4 Stars
                      </option>
                      <option value={3}>
                        3 Stars
                      </option>
                      <option value={2}>
                        2 Stars
                      </option>
                      <option value={1}>
                        1 Star
                      </option>
                    </select>

                    <div className="flex h-12 items-center rounded-xl border border-[#e6ece7] bg-[#f8fbf8] px-4">
                      <Stars
                        rating={rating}
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#849189]">
                    Review Title
                  </label>

                  <input
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    placeholder="Write a clear review title..."
                    className="h-12 w-full rounded-xl border border-[#dce6de] bg-[#fbfdfb] px-4 text-sm font-medium text-[#10291d] outline-none transition placeholder:text-[#9aa69f] focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/[0.06]"
                  />
                </div>

                {/* Comment */}
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#849189]">
                      Review Comment
                    </label>

                    <span className="text-[10px] text-[#9aa69f]">
                      {comment.length} characters
                    </span>
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    rows={9}
                    placeholder="Customer review..."
                    className="w-full resize-y rounded-2xl border border-[#dce6de] bg-[#fbfdfb] p-4 text-sm leading-7 text-[#304238] outline-none transition placeholder:text-[#9aa69f] focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/[0.06]"
                  />
                </div>
              </div>
            </section>

            {/* ADMIN RESPONSE */}
            <section className="rounded-[28px] border border-[#e1e9e2] bg-white p-5 shadow-[0_18px_55px_rgba(16,41,29,0.055)] md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10291d] text-[#c5dda8]">
                  <MessageSquare size={18} />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#849189]">
                    Brand Communication
                  </span>

                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#10291d]">
                    Admin Response
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-[#7b8981]">
                    Respond professionally to the customer's
                    feedback.
                  </p>
                </div>
              </div>

              <textarea
                value={adminReply}
                onChange={(e) =>
                  setAdminReply(e.target.value)
                }
                rows={6}
                placeholder="Write a professional response to the customer..."
                className="mt-6 w-full resize-y rounded-2xl border border-[#dce6de] bg-[#fbfdfb] p-4 text-sm leading-7 text-[#304238] outline-none transition placeholder:text-[#9aa69f] focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/[0.06]"
              />

              {review.adminReply?.repliedAt && (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#819087]">
                  <Clock3 size={13} />

                  Last replied{" "}
                  {formatDateTime(
                    review.adminReply.repliedAt
                  )}

                  {review.adminReply.repliedBy?.name && (
                    <>
                      <span>•</span>
                      {review.adminReply.repliedBy.name}
                    </>
                  )}
                </div>
              )}
            </section>
          </main>

          {/* =================================================== */}
          {/* SIDEBAR */}
          {/* =================================================== */}

          <aside className="space-y-6">

            {/* MODERATION */}
            <section className="rounded-[28px] border border-[#e1e9e2] bg-white p-5 shadow-[0_18px_55px_rgba(16,41,29,0.055)] md:p-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#849189]">
                Moderation
              </span>

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#10291d]">
                Review Controls
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#7b8981]">
                Manage how this review is handled and displayed.
              </p>

              <div className="mt-6 space-y-3">
                {/* Approval */}
                <button
                  onClick={() =>
                    setIsApproved(!isApproved)
                  }
                  className={`group flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                    isApproved
                      ? "border-[#cde5d1] bg-[#f1f8f2]"
                      : "border-[#eadfbe] bg-[#fffaf0]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isApproved
                          ? "bg-[#e0f1e3] text-[#28713d]"
                          : "bg-[#fff1cd] text-[#936d16]"
                      }`}
                    >
                      {isApproved ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Clock3 size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#10291d]">
                        Approval
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-[#718078]">
                        {isApproved
                          ? "Review has been approved"
                          : "Waiting for approval"}
                      </p>
                    </div>
                  </div>

                  <Toggle
                    active={isApproved}
                  />
                </button>

                {/* Publication */}
                <button
                  disabled={!isApproved}
                  onClick={() =>
                    setIsPublished(
                      !isPublished
                    )
                  }
                  className={`group flex w-full items-center justify-between rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${
                    isPublished
                      ? "border-[#ccdff0] bg-[#f1f6fb]"
                      : "border-[#dce6de] bg-[#fbfdfb]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isPublished
                          ? "bg-[#e5eff8] text-[#315e9d]"
                          : "bg-[#edf1ee] text-[#718078]"
                      }`}
                    >
                      {isPublished ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#10291d]">
                        Publication
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-[#718078]">
                        {isPublished
                          ? "Visible on product page"
                          : "Hidden from customers"}
                      </p>
                    </div>
                  </div>

                  <Toggle
                    active={isPublished}
                    blue
                  />
                </button>

                {/* Verified */}
                <button
                  onClick={() =>
                    setIsVerifiedPurchase(
                      !isVerifiedPurchase
                    )
                  }
                  className={`group flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                    isVerifiedPurchase
                      ? "border-[#cde5d1] bg-[#f1f8f2]"
                      : "border-[#dce6de] bg-[#fbfdfb]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isVerifiedPurchase
                          ? "bg-[#e0f1e3] text-[#28713d]"
                          : "bg-[#edf1ee] text-[#718078]"
                      }`}
                    >
                      <ShieldCheck size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#10291d]">
                        Verified Purchase
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-[#718078]">
                        Customer purchased this product
                      </p>
                    </div>
                  </div>

                  <Toggle
                    active={isVerifiedPurchase}
                  />
                </button>
              </div>

              {/* Save */}
              <button
                onClick={saveReview}
                disabled={saving}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#10291d] text-sm font-bold text-white shadow-[0_12px_28px_rgba(16,41,29,0.16)] transition hover:-translate-y-0.5 hover:bg-[#183c29] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={16} />
                )}

                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>
            </section>

            {/* REVIEWER */}
            <section className="rounded-[28px] border border-[#e1e9e2] bg-white p-5 shadow-[0_18px_55px_rgba(16,41,29,0.055)] md:p-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#849189]">
                Reviewer
              </span>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#10291d] text-white shadow-[0_8px_20px_rgba(16,41,29,0.12)]">
                  <UserRound size={19} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#10291d]">
                    {review.name}
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#819087]">
                    {review.customer
                      ? "Registered Customer"
                      : "Guest Reviewer"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <InfoRow
                  icon={<Mail size={15} />}
                  label="Email"
                  value={
                    review.email ||
                    review.customer?.email ||
                    "Not provided"
                  }
                />

                <InfoRow
                  icon={<Phone size={15} />}
                  label="Phone"
                  value={
                    review.customer?.phone ||
                    "Not provided"
                  }
                />

                <InfoRow
                  icon={<Clock3 size={15} />}
                  label="Submitted"
                  value={formatDateTime(
                    review.createdAt
                  )}
                />
              </div>
            </section>

            {/* CURRENT STATE */}
            <section className="rounded-[28px] border border-[#e1e9e2] bg-white p-5 shadow-[0_18px_55px_rgba(16,41,29,0.055)] md:p-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#849189]">
                Review Snapshot
              </span>

              <h2 className="mt-1 text-lg font-semibold text-[#10291d]">
                Current State
              </h2>

              <div className="mt-5 space-y-2.5">
                <StatusRow
                  label="Approval"
                  value={
                    isApproved
                      ? "Approved"
                      : "Pending"
                  }
                  positive={isApproved}
                />

                <StatusRow
                  label="Publication"
                  value={
                    isPublished
                      ? "Published"
                      : "Unpublished"
                  }
                  positive={isPublished}
                />

                <StatusRow
                  label="Purchase"
                  value={
                    isVerifiedPurchase
                      ? "Verified"
                      : "Not Verified"
                  }
                  positive={
                    isVerifiedPurchase
                  }
                />
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DELETE MODAL */}
      {/* ========================================================= */}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07140d]/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.22)]">
            <div className="p-6 md:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Trash2 size={21} />
              </div>

              <h3 className="mt-5 text-xl font-semibold tracking-tight text-[#10291d]">
                Delete this review?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#718078]">
                This review will be permanently removed from
                your system. This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={() =>
                    setDeleteModal(false)
                  }
                  disabled={saving}
                  className="h-11 rounded-xl border border-[#dce6de] px-5 text-sm font-bold text-[#304238] transition hover:bg-[#f7faf7] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteReview}
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={15} />
                      Delete Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FEEDBACK TOAST */}
      {/* ========================================================= */}

      {feedback && (
        <div className="fixed bottom-5 right-5 z-[60] w-[calc(100%-40px)] max-w-sm">
          <div className="flex items-start gap-3 rounded-2xl border border-[#dce6de] bg-white p-4 shadow-[0_20px_60px_rgba(16,41,29,0.16)]">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                feedback.type === "success"
                  ? "bg-[#e8f5eb] text-[#28713d]"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <XCircle size={18} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#10291d]">
                {feedback.type === "success"
                  ? "Changes saved"
                  : "Action needs attention"}
              </p>

              <p className="mt-1 text-xs leading-5 text-[#718078]">
                {feedback.message}
              </p>
            </div>

            <button
              onClick={() => setFeedback(null)}
              className="text-[#94a099] transition hover:text-[#10291d]"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================= */
/* HERO INFO */
/* ============================================================= */

function HeroInfo({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 md:px-5 md:py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-white/80">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ============================================================= */
/* TOGGLE */
/* ============================================================= */

function Toggle({
  active,
  blue = false,
}: {
  active: boolean;
  blue?: boolean;
}) {
  return (
    <span
      className={`relative h-6 w-11 shrink-0 rounded-full p-1 transition ${
        active
          ? blue
            ? "bg-[#315e9d]"
            : "bg-[#315c42]"
          : "bg-[#dfe6e1]"
      }`}
    >
      <span
        className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          active
            ? "translate-x-5"
            : "translate-x-0"
        }`}
      />
    </span>
  );
}

/* ============================================================= */
/* STARS */
/* ============================================================= */

function Stars({
  rating,
  size = 18,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-[#d6a928] text-[#d6a928]"
              : "text-[#d5ddd7]"
          }
        />
      ))}
    </div>
  );
}

/* ============================================================= */
/* INFO ROW */
/* ============================================================= */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf4ee] text-[#52655a]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#89958d]">
          {label}
        </p>

        <p className="mt-1 break-all text-xs font-semibold leading-5 text-[#304238]">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ============================================================= */
/* STATUS ROW */
/* ============================================================= */

function StatusRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#e8eee9] bg-[#f8fbf8] px-3.5 py-3">
      <span className="text-xs font-semibold text-[#718078]">
        {label}
      </span>

      <span
        className={`inline-flex items-center gap-1.5 text-xs font-bold ${
          positive
            ? "text-[#28713d]"
            : "text-[#936d16]"
        }`}
      >
        {positive ? (
          <CheckCircle2 size={13} />
        ) : (
          <XCircle size={13} />
        )}

        {value}
      </span>
    </div>
  );
}