"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Star,
  Verified,
} from "lucide-react";

type ReviewProduct = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

type AdminReply = {
  message: string;
  repliedAt?: string;
};

type Review = {
  id: string;
  product: ReviewProduct | null;
  name: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  isPublished: boolean;
  isVerifiedPurchase: boolean;
  adminReply: AdminReply | null;
  createdAt: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getReviewStatus(review: Review) {
  if (review.isPublished) {
    return {
      label: "Published",
      icon: <CheckCircle2 size={14} />,
      className:
        "bg-[#edf5ee] text-[#315c45] border-[#d8e7da]",
    };
  }

  if (review.isApproved) {
    return {
      label: "Approved",
      icon: <CheckCircle2 size={14} />,
      className:
        "bg-[#f2f4ed] text-[#68766d] border-[#dfe4dc]",
    };
  }

  return {
    label: "Under review",
    icon: <Clock3 size={14} />,
    className:
      "bg-[#faf5e8] text-[#8b7650] border-[#eee2c5]",
  };
}

function RatingStars({
  rating,
  size = 16,
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
          fill={star <= rating ? "currentColor" : "none"}
          className={
            star <= rating
              ? "text-[#c59b55]"
              : "text-[#d5d9d2]"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/account/reviews",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load reviews."
          );
        }

        setReviews(data.reviews || []);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load reviews."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  const stats = useMemo(() => {
    if (!reviews.length) {
      return {
        total: 0,
        average: "0.0",
        verified: 0,
      };
    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );

    const verified = reviews.filter(
      (review) => review.isVerifiedPurchase
    ).length;

    return {
      total: reviews.length,
      average: (totalRating / reviews.length).toFixed(1),
      verified,
    };
  }, [reviews]);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-40 animate-pulse rounded-[28px] bg-white" />

        <div className="h-32 animate-pulse rounded-[24px] bg-white" />

        <div className="h-72 animate-pulse rounded-[28px] bg-white" />

        <div className="h-72 animate-pulse rounded-[28px] bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-[#eadbd5] bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8eeee] text-[#9a6257]">
          <MessageSquareText size={24} />
        </div>

        <h2 className="mt-5 font-serif text-2xl text-[#294b39]">
          We couldn't load your reviews
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7a847d]">
          {error}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-[#294b39] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3b2c]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[32px] border border-[#e1e4dc] bg-white px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-[#718077]">
            <MessageSquareText size={17} />

            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Your voice
            </span>
          </div>

          <h2 className="mt-3 font-serif text-3xl tracking-[-0.035em] text-[#294b39] sm:text-4xl">
            Your reviews
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#77827a] sm:text-[15px]">
            A place to see the experiences you've shared
            with SeedStore and any replies from our team.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#eef3eb]" />
        <div className="pointer-events-none absolute -bottom-24 right-20 h-40 w-40 rounded-full bg-[#f5f0df]" />
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-[#e1e4dc] bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a958d]">
            Reviews written
          </p>

          <div className="mt-3 flex items-end gap-2">
            <span className="font-serif text-3xl text-[#294b39]">
              {stats.total}
            </span>

            <span className="pb-1 text-sm text-[#8a958d]">
              {stats.total === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e1e4dc] bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a958d]">
            Average rating
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className="font-serif text-3xl text-[#294b39]">
              {stats.average}
            </span>

            <RatingStars rating={Math.round(Number(stats.average))} />
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e1e4dc] bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a958d]">
            Verified purchases
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className="font-serif text-3xl text-[#294b39]">
              {stats.verified}
            </span>

            <Verified
              size={19}
              className="text-[#315c45]"
            />
          </div>
        </div>
      </section>

      {/* Empty state */}
      {reviews.length === 0 ? (
        <section className="rounded-[30px] border border-dashed border-[#d6ddd5] bg-white px-6 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef3eb] text-[#315c45]">
            <MessageSquareText size={26} />
          </div>

          <h2 className="mt-5 font-serif text-2xl text-[#294b39]">
            No reviews yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7b867e]">
            Once you've reviewed a SeedStore product,
            your review and any response from our team will
            appear here.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#294b39] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3b2c]"
          >
            Explore products
            <ArrowRight size={16} />
          </Link>
        </section>
      ) : (
        <section className="space-y-5">
          {reviews.map((review) => {
            const status = getReviewStatus(review);

            return (
              <article
                key={review.id}
                className="overflow-hidden rounded-[30px] border border-[#e1e4dc] bg-white"
              >
                <div className="p-6 sm:p-7 lg:p-8">
                  {/* Product + status */}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      {review.product?.image ? (
                        <img
                          src={review.product.image}
                          alt={
                            review.product.name ||
                            "Product"
                          }
                          className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#eef3eb] text-[#315c45]">
                          <MessageSquareText size={21} />
                        </div>
                      )}

                      <div className="min-w-0">
                        {review.product ? (
                          <Link
                            href={`/products/${review.product.slug}`}
                            className="line-clamp-1 text-base font-semibold text-[#294b39] transition hover:text-[#315c45]"
                          >
                            {review.product.name}
                          </Link>
                        ) : (
                          <p className="text-base font-semibold text-[#294b39]">
                            Product unavailable
                          </p>
                        )}

                        <p className="mt-1 text-xs text-[#8a958d]">
                          Reviewed on{" "}
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${status.className}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <RatingStars rating={review.rating} />

                    <span className="text-xs font-medium text-[#8a958d]">
                      {review.rating}/5
                    </span>

                    {review.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f6f0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#315c45]">
                        <Verified size={13} />
                        Verified purchase
                      </span>
                    )}
                  </div>

                  {/* Review */}
                  <div className="mt-5 max-w-3xl">
                    {review.title && (
                      <h3 className="font-serif text-xl text-[#294b39]">
                        {review.title}
                      </h3>
                    )}

                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#66736a]">
                      {review.comment}
                    </p>
                  </div>

                  {/* Admin reply */}
                  {review.adminReply && (
                    <div className="mt-7 rounded-[22px] bg-[#f5f7f2] p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7b887f]">
                            SeedStore team
                          </p>

                          <h4 className="mt-1 text-sm font-semibold text-[#294b39]">
                            Our response
                          </h4>
                        </div>

                        {review.adminReply.repliedAt && (
                          <span className="text-xs text-[#909990]">
                            {formatDate(
                              review.adminReply.repliedAt
                            )}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm leading-6 text-[#66736a]">
                        {review.adminReply.message}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}