"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  XCircle,
  X,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug?: string;
  images?: string[];
  price?: number;
}

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Review {
  _id: string;
  product?: Product;
  customer?: Customer;
  name: string;
  email?: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  isPublished: boolean;
  isVerifiedPurchase: boolean;
  createdAt: string;
  adminReply?: {
    message: string;
    repliedAt?: string;
  };
}

interface Stats {
  totalReviews: number;
  pendingReviews: number;
  publishedReviews: number;
  verifiedReviews: number;
  averageRating: string;
  ratingBreakdown: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("all");
  const [approval, setApproval] = useState("all");
  const [publication, setPublication] = useState("all");
  const [verified, setVerified] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      params.set("rating", rating);
      params.set("approval", approval);
      params.set("publication", publication);
      params.set("verified", verified);
      params.set("page", String(page));
      params.set("limit", "10");

      const response = await fetch(
        `/api/admin/reviews?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load reviews"
        );
      }

      setReviews(result.data.reviews);
      setStats(result.data.stats);
      setTotalPages(
        result.data.pagination.totalPages || 1
      );
    } catch (error) {
      console.error(error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [
    page,
    rating,
    approval,
    publication,
    verified,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadReviews();
  };

  const updateReview = async (
    reviewId: string,
    data: Record<string, unknown>
  ) => {
    try {
      setActionLoading(reviewId);

      const response = await fetch(
        `/api/admin/reviews/${reviewId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update review"
        );
      }

      await loadReviews();

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
      setActionLoading(null);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      setActionLoading(reviewId);

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

      setDeleteTarget(null);

      await loadReviews();

      setFeedback({
        type: "success",
        message: "Review permanently deleted.",
      });
    } catch (error) {
      console.error(error);

      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete review",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1550px] space-y-6">

        {/* ========================================================= */}
        {/* HERO */}
        {/* ========================================================= */}

        <section className="relative overflow-hidden rounded-[30px] bg-[#10291d] px-5 py-6 text-white shadow-[0_24px_70px_rgba(16,41,29,0.14)] md:px-8 md:py-8">
          {/* Decorative lights */}
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#315c42]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#c5dda8]/10 blur-3xl" />
          <div className="pointer-events-none absolute right-[20%] top-1/2 h-28 w-28 rounded-full bg-white/[0.04] blur-2xl" />

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

              <span className="text-white/80">
                Reviews
              </span>
            </div>

            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c5dda8]">
                  <MessageSquare size={13} />
                  Customer Experience
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.035em] md:text-5xl">
                  Reviews Management
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 md:text-[15px]">
                  Review, moderate and manage customer feedback
                  across your Seedra products from one refined
                  workspace.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={loadReviews}
                  disabled={loading}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.12] disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={
                      loading ? "animate-spin" : ""
                    }
                  />
                  Refresh
                </button>

                <div className="hidden h-11 items-center gap-2 rounded-xl border border-[#c5dda8]/20 bg-[#c5dda8]/10 px-4 text-sm font-semibold text-[#c5dda8] sm:inline-flex">
                  <Star
                    size={15}
                    className="fill-[#c5dda8]"
                  />
                  {stats?.averageRating || "0.0"} / 5
                </div>
              </div>
            </div>

            {/* Hero mini metrics */}
            <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] sm:grid-cols-4">
              <HeroMetric
                label="Total Reviews"
                value={stats?.totalReviews ?? 0}
              />

              <HeroMetric
                label="Pending"
                value={stats?.pendingReviews ?? 0}
              />

              <HeroMetric
                label="Published"
                value={stats?.publishedReviews ?? 0}
              />

              <HeroMetric
                label="Verified"
                value={stats?.verifiedReviews ?? 0}
              />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RATING INTELLIGENCE */}
        {/* ========================================================= */}

        {stats && (
          <section className="overflow-hidden rounded-[28px] border border-[#e1e9e2] bg-white shadow-[0_18px_55px_rgba(16,41,29,0.055)]">
            <div className="border-b border-[#e7ede8] px-5 py-5 md:px-7">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#829088]">
                  Customer Sentiment
                </span>

                <h2 className="text-xl font-semibold tracking-tight text-[#10291d]">
                  Rating Intelligence
                </h2>

                <p className="text-sm text-[#7a8980]">
                  A quick view of how customers are rating
                  their experience.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-[300px_1fr]">
              {/* Overall */}
              <div className="border-b border-[#e7ede8] bg-[#f7faf7] p-6 lg:border-b-0 lg:border-r md:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#849189]">
                  Overall Rating
                </p>

                <div className="mt-5 flex items-end gap-3">
                  <span className="text-5xl font-semibold tracking-[-0.05em] text-[#10291d]">
                    {stats.averageRating}
                  </span>

                  <span className="pb-2 text-sm text-[#829088]">
                    / 5.0
                  </span>
                </div>

                <div className="mt-4">
                  <Stars
                    rating={Number(stats.averageRating)}
                    size={17}
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-[#7a8980]">
                  Based on {stats.totalReviews.toLocaleString()}{" "}
                  customer reviews.
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 p-6 md:p-8">
                <RatingBar
                  rating={5}
                  count={stats.ratingBreakdown.fiveStar}
                  total={stats.totalReviews}
                />

                <RatingBar
                  rating={4}
                  count={stats.ratingBreakdown.fourStar}
                  total={stats.totalReviews}
                />

                <RatingBar
                  rating={3}
                  count={stats.ratingBreakdown.threeStar}
                  total={stats.totalReviews}
                />

                <RatingBar
                  rating={2}
                  count={stats.ratingBreakdown.twoStar}
                  total={stats.totalReviews}
                />

                <RatingBar
                  rating={1}
                  count={stats.ratingBreakdown.oneStar}
                  total={stats.totalReviews}
                />
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* FILTER WORKSPACE */}
        {/* ========================================================= */}

        <section className="rounded-[28px] border border-[#e1e9e2] bg-white p-5 shadow-[0_18px_55px_rgba(16,41,29,0.055)] md:p-6">
          <div className="mb-5 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#849189]">
              Review Directory
            </span>

            <h2 className="text-xl font-semibold tracking-tight text-[#10291d]">
              Find & Filter Feedback
            </h2>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_repeat(4,minmax(135px,0.35fr))_auto]">
            <form
              onSubmit={handleSearch}
              className="relative"
            >
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#89978f]"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search product, customer or review..."
                className="h-12 w-full rounded-xl border border-[#dce6de] bg-[#fbfdfb] pl-11 pr-4 text-sm font-medium text-[#10291d] outline-none transition placeholder:text-[#9aa69f] focus:border-[#315c42] focus:bg-white focus:ring-4 focus:ring-[#315c42]/[0.06]"
              />
            </form>

            <FilterSelect
              value={rating}
              onChange={(value) => {
                setRating(value);
                setPage(1);
              }}
              options={[
                ["all", "All Ratings"],
                ["5", "★★★★★ 5"],
                ["4", "★★★★ 4"],
                ["3", "★★★ 3"],
                ["2", "★★ 2"],
                ["1", "★ 1"],
              ]}
            />

            <FilterSelect
              value={approval}
              onChange={(value) => {
                setApproval(value);
                setPage(1);
              }}
              options={[
                ["all", "All Approval"],
                ["pending", "Pending"],
                ["approved", "Approved"],
              ]}
            />

            <FilterSelect
              value={publication}
              onChange={(value) => {
                setPublication(value);
                setPage(1);
              }}
              options={[
                ["all", "All Publication"],
                ["published", "Published"],
                ["unpublished", "Unpublished"],
              ]}
            />

            <FilterSelect
              value={verified}
              onChange={(value) => {
                setVerified(value);
                setPage(1);
              }}
              options={[
                ["all", "All Purchases"],
                ["verified", "Verified Purchase"],
                ["unverified", "Unverified"],
              ]}
            />

            <button
              onClick={handleSearch}
              className="h-12 rounded-xl bg-[#10291d] px-6 text-sm font-bold text-white shadow-[0_10px_25px_rgba(16,41,29,0.16)] transition hover:-translate-y-0.5 hover:bg-[#183c29] active:translate-y-0"
            >
              Search
            </button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* REVIEW DIRECTORY */}
        {/* ========================================================= */}

        <section className="overflow-hidden rounded-[28px] border border-[#e1e9e2] bg-white shadow-[0_18px_55px_rgba(16,41,29,0.055)]">
          {/* Section heading */}
          <div className="flex flex-col gap-4 border-b border-[#e6ece7] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#849189]">
                Customer Feedback
              </span>

              <div className="mt-1 flex items-center gap-3">
                <h2 className="text-xl font-semibold tracking-tight text-[#10291d]">
                  All Reviews
                </h2>

                <span className="inline-flex min-w-8 items-center justify-center rounded-lg bg-[#edf4ee] px-2.5 py-1 text-xs font-bold text-[#31583d]">
                  {stats?.totalReviews || 0}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#87948c]">
              Showing page{" "}
              <span className="font-bold text-[#304238]">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#304238]">
                {totalPages}
              </span>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1180px]">
              <thead className="border-b border-[#e6ece7] bg-[#f8fbf8]">
                <tr className="text-left text-[10px] font-bold uppercase tracking-[0.16em] text-[#7b8981]">
                  <th className="px-6 py-4">
                    Review
                  </th>

                  <th className="px-5 py-4">
                    Product
                  </th>

                  <th className="px-5 py-4">
                    Rating
                  </th>

                  <th className="px-5 py-4">
                    Customer
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#edf2ed]">
                {loading ? (
                  <LoadingRows />
                ) : reviews.length === 0 ? (
                  <EmptyReviews />
                ) : (
                  reviews.map((review) => (
                    <ReviewRow
                      key={review._id}
                      review={review}
                      actionLoading={actionLoading}
                      onUpdate={updateReview}
                      onDelete={() =>
                        setDeleteTarget(review._id)
                      }
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet */}
          <div className="divide-y divide-[#e8eee9] lg:hidden">
            {loading ? (
              <div className="px-5 py-16">
                <LoadingMobile />
              </div>
            ) : reviews.length === 0 ? (
              <div className="px-5 py-16">
                <EmptyMobile />
              </div>
            ) : (
              reviews.map((review) => (
                <MobileReviewCard
                  key={review._id}
                  review={review}
                  actionLoading={actionLoading}
                  onUpdate={updateReview}
                  onDelete={() =>
                    setDeleteTarget(review._id)
                  }
                />
              ))
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* PAGINATION */}
        {/* ========================================================= */}

        <div className="flex flex-col gap-4 rounded-[24px] border border-[#e1e9e2] bg-white px-5 py-4 shadow-[0_12px_40px_rgba(16,41,29,0.04)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#718078]">
            Page{" "}
            <strong className="text-[#10291d]">
              {page}
            </strong>{" "}
            of{" "}
            <strong className="text-[#10291d]">
              {totalPages}
            </strong>
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() =>
                setPage((value) =>
                  Math.max(value - 1, 1)
                )
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce6de] bg-white text-[#304238] transition hover:border-[#315c42] hover:bg-[#f5f9f5] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft size={17} />
            </button>

            <button
              disabled={page >= totalPages}
              onClick={() =>
                setPage((value) =>
                  Math.min(
                    value + 1,
                    totalPages
                  )
                )
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce6de] bg-white text-[#304238] transition hover:border-[#315c42] hover:bg-[#f5f9f5] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION */}
      {/* ========================================================= */}

      {deleteTarget && (
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
                    setDeleteTarget(null)
                  }
                  className="h-11 rounded-xl border border-[#dce6de] px-5 text-sm font-bold text-[#304238] transition hover:bg-[#f7faf7]"
                >
                  Cancel
                </button>

                <button
                  disabled={
                    actionLoading === deleteTarget
                  }
                  onClick={() =>
                    deleteReview(deleteTarget)
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {actionLoading === deleteTarget ? (
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
                  ? "Action completed"
                  : "Something went wrong"}
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
/* HERO METRIC */
/* ============================================================= */

function HeroMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="border-b border-white/10 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 md:px-5 md:py-4">
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>

      <p className="mt-1.5 text-xl font-semibold tracking-tight text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

/* ============================================================= */
/* FILTER SELECT */
/* ============================================================= */

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 rounded-xl border border-[#dce6de] bg-white px-3 text-sm font-medium text-[#304238] outline-none transition hover:border-[#b9cabe] focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.06]"
    >
      {options.map(([optionValue, label]) => (
        <option
          key={optionValue}
          value={optionValue}
        >
          {label}
        </option>
      ))}
    </select>
  );
}

/* ============================================================= */
/* REVIEW ROW */
/* ============================================================= */

function ReviewRow({
  review,
  actionLoading,
  onUpdate,
  onDelete,
}: {
  review: Review;
  actionLoading: string | null;
  onUpdate: (
    reviewId: string,
    data: Record<string, unknown>
  ) => void;
  onDelete: () => void;
}) {
  const busy = actionLoading === review._id;

  return (
    <tr className="group transition hover:bg-[#fbfdfb]">
      {/* Review */}
      <td className="max-w-[330px] px-6 py-5 align-top">
        <Link
          href={`/admin/reviews/${review._id}`}
          className="block"
        >
          <div className="flex items-center gap-2">
            <Stars rating={review.rating} />

            {review.isVerifiedPurchase && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#edf5ef] px-2 py-1 text-[9px] font-bold text-[#28713d]">
                <ShieldCheck size={10} />
                Verified
              </span>
            )}
          </div>

          {review.title && (
            <p className="mt-2.5 truncate text-sm font-bold text-[#10291d] transition group-hover:text-[#315c42]">
              {review.title}
            </p>
          )}

          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#718078]">
            {review.comment}
          </p>
        </Link>
      </td>

      {/* Product */}
      <td className="px-5 py-5 align-top">
        {review.product ? (
          <Link
            href={`/admin/products/${review.product._id}`}
            className="group/product flex max-w-[230px] items-center gap-3"
          >
            {review.product.images?.[0] ? (
              <img
                src={review.product.images[0]}
                alt={review.product.name}
                className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-[#dce6de]"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#315c42]">
                <MessageSquare size={16} />
              </div>
            )}

            <span className="truncate text-sm font-semibold text-[#304238] transition group-hover/product:text-[#315c42]">
              {review.product.name}
            </span>
          </Link>
        ) : (
          <span className="inline-flex rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-500">
            Product removed
          </span>
        )}
      </td>

      {/* Rating */}
      <td className="px-5 py-5 align-top">
        <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#fff9e8] px-2.5 py-2">
          <Star
            size={13}
            className="fill-[#d6a928] text-[#d6a928]"
          />

          <span className="text-xs font-bold text-[#7d641c]">
            {review.rating}.0
          </span>
        </div>
      </td>

      {/* Customer */}
      <td className="px-5 py-5 align-top">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#10291d]">
            <UserRound size={15} />
          </div>

          <div className="max-w-[165px]">
            <p className="truncate text-sm font-semibold text-[#304238]">
              {review.name}
            </p>

            <p className="mt-0.5 truncate text-[10px] text-[#87948c]">
              {review.email ||
                review.customer?.email ||
                "No email"}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-5 align-top">
        <div className="flex flex-col items-start gap-1.5">
          <ApprovalBadge
            approved={review.isApproved}
          />

          <PublicationBadge
            published={review.isPublished}
          />
        </div>
      </td>

      {/* Date */}
      <td className="px-5 py-5 align-top">
        <span className="text-xs font-medium text-[#718078]">
          {formatDate(review.createdAt)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-5 align-top">
        <div className="flex items-center justify-end gap-1.5">
          {!review.isApproved ? (
            <button
              disabled={busy}
              onClick={() =>
                onUpdate(review._id, {
                  isApproved: true,
                })
              }
              title="Approve review"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#e8f5eb] px-3 text-[11px] font-bold text-[#28713d] transition hover:bg-[#dcefe0] disabled:opacity-50"
            >
              <CheckCircle2 size={14} />
              Approve
            </button>
          ) : (
            <button
              disabled={busy}
              onClick={() =>
                onUpdate(review._id, {
                  isPublished:
                    !review.isPublished,
                })
              }
              title={
                review.isPublished
                  ? "Unpublish"
                  : "Publish"
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#dce6de] bg-white px-3 text-[11px] font-bold text-[#304238] transition hover:border-[#315c42] hover:bg-[#f7faf7] disabled:opacity-50"
            >
              {review.isPublished ? (
                <>
                  <EyeOff size={14} />
                  Hide
                </>
              ) : (
                <>
                  <Eye size={14} />
                  Publish
                </>
              )}
            </button>
          )}

          <Link
            href={`/admin/reviews/${review._id}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#dce6de] bg-white px-3 text-[11px] font-bold text-[#10291d] transition hover:border-[#315c42] hover:bg-[#f7faf7]"
          >
            View
            <ArrowRight size={13} />
          </Link>

          <button
            disabled={busy}
            onClick={onDelete}
            title="Delete review"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:opacity-50"
          >
            {busy ? (
              <RefreshCw
                size={14}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ============================================================= */
/* MOBILE REVIEW CARD */
/* ============================================================= */

function MobileReviewCard({
  review,
  actionLoading,
  onUpdate,
  onDelete,
}: {
  review: Review;
  actionLoading: string | null;
  onUpdate: (
    reviewId: string,
    data: Record<string, unknown>
  ) => void;
  onDelete: () => void;
}) {
  const busy = actionLoading === review._id;

  return (
    <div className="p-5">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/admin/reviews/${review._id}`}
          className="min-w-0 flex-1"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Stars rating={review.rating} />

            {review.isVerifiedPurchase && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#edf5ef] px-2 py-1 text-[9px] font-bold text-[#28713d]">
                <ShieldCheck size={10} />
                Verified
              </span>
            )}
          </div>

          {review.title && (
            <h3 className="mt-2 text-sm font-bold text-[#10291d]">
              {review.title}
            </h3>
          )}

          <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-[#718078]">
            {review.comment}
          </p>
        </Link>

        <span className="shrink-0 rounded-xl bg-[#fff9e8] px-2.5 py-2 text-xs font-bold text-[#7d641c]">
          {review.rating}.0
        </span>
      </div>

      {/* Product */}
      <div className="mt-5 rounded-2xl border border-[#e4ebe5] bg-[#f9fbf9] p-3">
        {review.product ? (
          <Link
            href={`/admin/products/${review.product._id}`}
            className="flex items-center gap-3"
          >
            {review.product.images?.[0] ? (
              <img
                src={review.product.images[0]}
                alt={review.product.name}
                className="h-11 w-11 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf4ee] text-[#315c42]">
                <MessageSquare size={16} />
              </div>
            )}

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#89968e]">
                Product
              </p>

              <p className="mt-0.5 truncate text-sm font-semibold text-[#304238]">
                {review.product.name}
              </p>
            </div>
          </Link>
        ) : (
          <span className="text-xs font-bold text-red-500">
            Product removed
          </span>
        )}
      </div>

      {/* Customer + date */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#89968e]">
            Customer
          </p>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf4ee] text-[#10291d]">
              <UserRound size={14} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#304238]">
                {review.name}
              </p>

              <p className="truncate text-[10px] text-[#87948c]">
                {review.email ||
                  review.customer?.email ||
                  "No email"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#89968e]">
            Date
          </p>

          <p className="mt-3 text-xs font-semibold text-[#304238]">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 flex flex-wrap gap-2">
        <ApprovalBadge
          approved={review.isApproved}
        />

        <PublicationBadge
          published={review.isPublished}
        />
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-[#e7ede8] pt-4">
        {!review.isApproved ? (
          <button
            disabled={busy}
            onClick={() =>
              onUpdate(review._id, {
                isApproved: true,
              })
            }
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#e8f5eb] px-3.5 text-xs font-bold text-[#28713d] disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            Approve
          </button>
        ) : (
          <button
            disabled={busy}
            onClick={() =>
              onUpdate(review._id, {
                isPublished:
                  !review.isPublished,
              })
            }
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#dce6de] px-3.5 text-xs font-bold text-[#304238] disabled:opacity-50"
          >
            {review.isPublished ? (
              <>
                <EyeOff size={14} />
                Hide
              </>
            ) : (
              <>
                <Eye size={14} />
                Publish
              </>
            )}
          </button>
        )}

        <Link
          href={`/admin/reviews/${review._id}`}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#10291d] px-3.5 text-xs font-bold text-white"
        >
          View Review
          <ArrowRight size={13} />
        </Link>

        <button
          disabled={busy}
          onClick={onDelete}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 disabled:opacity-50"
        >
          {busy ? (
            <RefreshCw
              size={14}
              className="animate-spin"
            />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </div>
    </div>
  );
}

/* ============================================================= */
/* RATING BAR */
/* ============================================================= */

function RatingBar({
  rating,
  count,
  total,
}: {
  rating: number;
  count: number;
  total: number;
}) {
  const percentage =
    total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="grid grid-cols-[42px_1fr_42px] items-center gap-3">
      <div className="flex items-center gap-1 text-xs font-bold text-[#516158]">
        <span>{rating}</span>
        <Star
          size={11}
          className="fill-[#d6a928] text-[#d6a928]"
        />
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#edf1ed]">
        <div
          className="h-full rounded-full bg-[#d6a928] transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <span className="text-right text-xs font-semibold text-[#819087]">
        {count}
      </span>
    </div>
  );
}

/* ============================================================= */
/* STARS */
/* ============================================================= */

function Stars({
  rating,
  size = 13,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-[#d6a928] text-[#d6a928]"
              : "text-[#d7dfd9]"
          }
        />
      ))}
    </div>
  );
}

/* ============================================================= */
/* BADGES */
/* ============================================================= */

function ApprovalBadge({
  approved,
}: {
  approved: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${
        approved
          ? "bg-[#e8f5eb] text-[#28713d]"
          : "bg-[#fff5dc] text-[#936d16]"
      }`}
    >
      {approved ? (
        <CheckCircle2 size={11} />
      ) : (
        <RefreshCw size={11} />
      )}

      {approved ? "Approved" : "Pending"}
    </span>
  );
}

function PublicationBadge({
  published,
}: {
  published: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${
        published
          ? "bg-[#edf3ff] text-[#315e9d]"
          : "bg-[#f1f4f2] text-[#718078]"
      }`}
    >
      {published ? (
        <Eye size={11} />
      ) : (
        <EyeOff size={11} />
      )}

      {published ? "Published" : "Unpublished"}
    </span>
  );
}

/* ============================================================= */
/* LOADING */
/* ============================================================= */

function LoadingRows() {
  return (
    <>
      {[1, 2, 3, 4].map((item) => (
        <tr key={item}>
          <td colSpan={7} className="px-6 py-3">
            <div className="h-16 animate-pulse rounded-xl bg-[#f4f7f4]" />
          </td>
        </tr>
      ))}
    </>
  );
}

function LoadingMobile() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-40 animate-pulse rounded-2xl bg-[#f4f7f4]"
        />
      ))}
    </div>
  );
}

/* ============================================================= */
/* EMPTY STATES */
/* ============================================================= */

function EmptyReviews() {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ee] text-[#315c42]">
          <MessageSquare size={23} />
        </div>

        <p className="mt-4 text-sm font-bold text-[#10291d]">
          No reviews found
        </p>

        <p className="mt-1 text-xs text-[#819087]">
          Try changing your search or filters.
        </p>
      </td>
    </tr>
  );
}

function EmptyMobile() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4ee] text-[#315c42]">
        <MessageSquare size={23} />
      </div>

      <p className="mt-4 text-sm font-bold text-[#10291d]">
        No reviews found
      </p>

      <p className="mt-1 text-xs text-[#819087]">
        Try changing your search or filters.
      </p>
    </div>
  );
}