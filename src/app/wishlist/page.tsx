
"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import {
  ArrowRight,
  Check,
  Heart,
  Loader2,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import WishlistButton from "@/components/WishlistButton";
import {
  useWishlist,
  WishlistProduct,
} from "@/components/WishlistProvider";

export default function WishlistPage() {
  const {
    wishlistProducts,
    wishlistCount,
    loading,
    removeWishlist,
  } = useWishlist();

  const [removingId, setRemovingId] =
    useState<string | null>(null);

  /* =====================================================
     REMOVE PRODUCT
  ====================================================== */

  const handleRemove = (
    productId: string
  ) => {
    setRemovingId(productId);

    removeWishlist(productId);

    setTimeout(() => {
      setRemovingId(null);
    }, 250);
  };

  /* =====================================================
     PRICE HELPERS
  ====================================================== */

  const getNumericPrice = (
    price?: string
  ) => {
    if (!price) return 0;

    return Number(
      price.replace(/[^\d]/g, "")
    );
  };

  const getNumericOldPrice = (
    price?: string | null
  ) => {
    if (!price) return 0;

    return Number(
      price.replace(/[^\d]/g, "")
    );
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-PK").format(
      price
    );

  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafcf9]">
        
        <section className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 lg:px-10">
          <div className="animate-pulse">
            <div className="h-4 w-28 rounded-full bg-[#e7ede6]" />

            <div className="mt-5 h-12 max-w-md rounded-2xl bg-[#e7ede6]" />

            <div className="mt-4 h-5 max-w-xl rounded-full bg-[#e7ede6]" />
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] border border-[#e5ebe3] bg-white"
                >
                  <div className="aspect-[4/4.4] animate-pulse bg-[#edf2eb]" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-20 rounded-full bg-[#e7ede6]" />

                    <div className="h-6 w-3/4 rounded-full bg-[#e7ede6]" />

                    <div className="h-5 w-1/3 rounded-full bg-[#e7ede6]" />
                  </div>
                </div>
              )
            )}
          </div>
        </section>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafcf9]">
        <Navbar />
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-[#e7ece5] bg-[#f3f7f1]">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#dce9d9]/70 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#e8eee4]/80 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-24 sm:px-8 lg:px-10 lg:pb-20 lg:pt-32">
          <div className="max-w-3xl">
            {/* LABEL */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dce6da] bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#607064] shadow-sm">
              <Heart
                size={13}
                strokeWidth={2}
                fill="currentColor"
              />

              Your Collection
            </div>

            {/* HEADING */}

            <h1 className="font-serif text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-[#10291d] sm:text-6xl lg:text-7xl">
              Things worth
              <span className="block italic text-[#56715b]">
                growing.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#667269] sm:text-base">
              Keep your favorite seeds close.
              Your saved products will stay here
              until you're ready to grow.
            </p>

            {/* COUNT */}

            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-[#304d38]">
              <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-[#10291d] px-2 text-white">
                {wishlistCount}
              </span>

              {wishlistCount === 1
                ? "saved product"
                : "saved products"}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {wishlistProducts.length === 0 ? (
          <div className="relative overflow-hidden rounded-[36px] border border-[#e3e9e1] bg-white px-6 py-20 text-center shadow-[0_20px_70px_rgba(16,41,29,0.05)] sm:px-10">
            <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#edf4eb] blur-3xl" />

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f1f6ef] text-[#66806a]">
              <Heart
                size={34}
                strokeWidth={1.5}
              />
            </div>

            <div className="relative mx-auto mt-7 max-w-md">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#829084]">
                Your wishlist is waiting
              </p>

              <h2 className="mt-3 font-serif text-3xl font-medium tracking-[-0.025em] text-[#10291d] sm:text-4xl">
                Nothing saved yet.
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#707a72]">
                Discover something you love and
                tap the heart. We'll keep it here
                for your next visit.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#10291d] px-7 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(16,41,29,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#193a29]"
              >
                Explore Seeds
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* =================================================
                HEADER
            ================================================== */}

            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7b887d]">
                  Saved for later
                </p>

                <h2 className="mt-2 font-serif text-3xl font-medium tracking-[-0.025em] text-[#10291d] sm:text-4xl">
                  Your favorites
                </h2>
              </div>

              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#405846]"
              >
                Continue shopping

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* =================================================
                PRODUCT GRID
            ================================================== */}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistProducts.map(
                (product) => {
                  const price =
                    getNumericPrice(
                      product.price
                    );

                  const oldPrice =
                    getNumericOldPrice(
                      product.oldPrice
                    );

                  const hasDiscount =
                    oldPrice > price;

                  const image =
                    product.image ||
                    "/images/placeholder-product.jpg";

                  const stock =
                    product.id === "1" ||
                    product.id === "2" ||
                    product.id === "3" ||
                    product.id === "4"
                      ? 1
                      : 1;

                  return (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-[28px] border border-[#e2e9e1] bg-white shadow-[0_12px_45px_rgba(16,41,29,0.045)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(16,41,29,0.09)]"
                    >
                      {/* IMAGE */}

                      <div className="relative aspect-[4/4.5] overflow-hidden bg-[#f0f4ee]">
                        <Link
                          href={product.href}
                          className="absolute inset-0 z-0"
                        >
                          <Image
                            src={image}
                            alt={`${product.name} - ${product.category}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                            unoptimized
                          />
                        </Link>

                        {/* IMAGE OVERLAY */}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#10291d]/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* BADGES */}

                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                          {product.badge && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#314b38] shadow-sm backdrop-blur-md">
                              <Sparkles size={11} />

                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* WISHLIST */}

                        <div className="absolute right-4 top-4 z-10">
                          <WishlistButton
                            productId={String(
                              product.id
                            )}
                            product={
                              product
                            }
                            size="md"
                          />
                        </div>

                        {/* STOCK */}

                        <div className="absolute bottom-4 left-4">
                          {stock > 0 ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[#416049] shadow-sm backdrop-blur-md">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#668d6c]" />

                              In stock
                            </span>
                          ) : (
                            <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[#8b5148] shadow-sm backdrop-blur-md">
                              Out of stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* =================================================
                          INFO
                      ================================================== */}

                      <div className="p-5">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#91a095]">
                            Saved favorite
                          </p>

                          <Link
                            href={product.href}
                            className="mt-1 block"
                          >
                            <h3 className="line-clamp-2 font-serif text-[21px] font-medium leading-tight tracking-[-0.02em] text-[#183223] transition-colors hover:text-[#5c7a62]">
                              {product.name}
                            </h3>
                          </Link>
                        </div>

                        {/* DESCRIPTION */}

                        <p className="mt-3 line-clamp-2 min-h-[40px] text-[12px] leading-5 text-[#7b857d]">
                          {product.category}
                        </p>

                        {/* PRICE */}

                        <div className="mt-5 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9aa49c]">
                              Price
                            </p>

                            <div className="mt-1 flex items-baseline gap-2">
                              <span className="text-xl font-bold tracking-[-0.02em] text-[#10291d]">
                                ₨
                                {formatPrice(
                                  price
                                )}
                              </span>

                              {hasDiscount && (
                                <span className="text-xs text-[#a2aaa3] line-through">
                                  ₨
                                  {formatPrice(
                                    oldPrice
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {product.rating && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#64806a]">
                              <span className="text-[#c9a94e]">
                                ★
                              </span>

                              {product.rating}
                            </span>
                          )}
                        </div>

                        {/* ACTIONS */}

                        <div className="mt-5 flex gap-2">
                          <Link
                            href={product.href}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#10291d] text-xs font-semibold text-white transition-all duration-300 hover:bg-[#193a29]"
                          >
                            View Product

                            <ArrowRight
                              size={14}
                            />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemove(
                                String(
                                  product.id
                                )
                              )
                            }
                            disabled={
                              removingId ===
                              String(
                                product.id
                              )
                            }
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e3e9e2] bg-[#f8faf7] text-[#7b857d] transition-all hover:border-[#ecd8d4] hover:bg-[#fff7f5] hover:text-[#a6473b] disabled:opacity-60"
                            aria-label="Remove from wishlist"
                          >
                            {removingId ===
                            String(
                              product.id
                            ) ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={16}
                                strokeWidth={
                                  1.8
                                }
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>

            {/* =================================================
                BOTTOM TRUST CARD
            ================================================== */}

            <div className="mt-12 overflow-hidden rounded-[28px] border border-[#e1e9df] bg-[#f2f6f0]">
              <div className="flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#4e6b55] shadow-sm">
                    <ShoppingBag
                      size={20}
                      strokeWidth={1.7}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#233d2b]">
                      Your favorites are saved
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#738076]">
                      Come back anytime and
                      continue where you left off.
                    </p>
                  </div>
                </div>

                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#3e5d46]"
                >
                  Explore more

                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </>
        )}
      </section>
      <Footer/>
    </main>
  );
}

