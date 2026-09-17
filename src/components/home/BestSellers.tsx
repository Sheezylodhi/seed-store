"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Heart,
  ShoppingBag,
  Star,
  Sparkles,
} from "lucide-react";

import WishlistButton from "@/components/WishlistButton";
import { useCart } from "@/context/CartContext";

interface ProductVariant {
  id?: string;
  packSize?: string;
  price?: number;
  compareAtPrice?: number | null;
  stock?: number;
  sku?: string;
  isActive?: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;

  category: string;
  categorySlug?: string;
  productType?: string;

  shortDescription?: string;

  image: string;
  images?: string[];

  price: number;
  compareAtPrice?: number | null;

  stock: number;
  sku?: string;

  /* =====================================================
     DELIVERY
  ===================================================== */

  deliveryType?: "free" | "paid";
  deliveryCharge?: number;

  rating: number;
  reviews: number;

  badge?: string | null;

  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;

  soldQuantity?: number;

  href: string;

  variants?: ProductVariant[];
}

/* =====================================================
FORMAT PRICE
===================================================== */

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PK").format(
    Math.round(price)
  );
}

/* =====================================================
STARS
===================================================== */

function Stars({
  rating,
  reviews,
}: {
  rating: number;
  reviews: number;
}) {
  if (rating <= 0 || reviews <= 0) {
    return (
      <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/55">
        No reviews yet
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-[2px]">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= Math.round(rating)
                ? "fill-[#d6b06a] text-[#d6b06a]"
                : "text-white/30"
            }`}
            strokeWidth={1.4}
          />
        ))}
      </div>

      <span className="text-[9px] font-medium text-white/80">
        {rating.toFixed(1)}
      </span>

      <span className="text-[8px] text-white/50">
        ({reviews})
      </span>
    </div>
  );
}

/* =====================================================
PRODUCT BADGE
===================================================== */

function ProductBadge({
  badge,
}: {
  badge?: string | null;
}) {
  if (!badge) return null;

  const isBestSeller = badge === "BEST SELLER";
  const isNew = badge === "NEW ARRIVAL";
  const isSale = badge === "SALE";

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] backdrop-blur-xl ${
        isBestSeller
          ? "border-white/20 bg-[#10291d]/85 text-white"
          : isNew
          ? "border-white/30 bg-white/15 text-white"
          : isSale
          ? "border-[#e5c99f]/30 bg-[#8b6030]/75 text-white"
          : "border-white/25 bg-white/15 text-white"
      }`}
    >
      {isNew && (
        <Sparkles
          className="h-3 w-3"
          strokeWidth={1.7}
        />
      )}

      {badge}
    </span>
  );
}

/* =====================================================
VARIANT INFO
===================================================== */

function VariantInfo({
  variants,
}: {
  variants?: ProductVariant[];
}) {
  const activeVariants =
    variants?.filter(
      (variant) =>
        variant.isActive !== false &&
        variant.packSize &&
        variant.packSize.trim() !== ""
    ) || [];

  if (activeVariants.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[7px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Available
      </span>

      {activeVariants.map((variant, index) => (
        <span
          key={
            variant.id ||
            `${variant.packSize}-${index}`
          }
          className="border border-white/20 bg-white/10 px-2 py-1 text-[8px] font-medium text-white/80 backdrop-blur-md"
        >
          {variant.packSize}
        </span>
      ))}
    </div>
  );
}

/* =====================================================
VARIANT PRICE RANGE
===================================================== */

function VariantPriceInfo({
  variants,
}: {
  variants?: ProductVariant[];
}) {
  const activeVariants =
    variants?.filter(
      (variant) =>
        variant.isActive !== false &&
        typeof variant.price === "number"
    ) || [];

  if (activeVariants.length <= 1) {
    return null;
  }

  const prices = activeVariants
    .map((variant) => Number(variant.price))
    .filter(
      (price) =>
        Number.isFinite(price) && price > 0
    );

  if (prices.length <= 1) {
    return null;
  }

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return null;
  }

  return (
    <p className="mt-1 text-[7px] font-medium uppercase tracking-[0.12em] text-white/45">
      Rs. {formatPrice(minPrice)} – Rs.{" "}
      {formatPrice(maxPrice)}
    </p>
  );
}

/* =====================================================
PRODUCT SKELETON
===================================================== */

function ProductSkeleton({
  large = false,
}: {
  large?: boolean;
}) {
  return (
    <div
      className={`animate-pulse overflow-hidden bg-[#e8ece6] ${
        large ? "h-[620px]" : "h-[390px]"
      }`}
    >
      <div className="h-full w-full bg-[#dfe5dd]" />
    </div>
  );
}

/* =====================================================
MAIN
===================================================== */

export default function BestSellers() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [addedProductId, setAddedProductId] =
    useState<string | null>(null);

  const {
    addToCart,
    openCart,
  } = useCart();

  /* =====================================================
  LOAD PRODUCTS
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          "/api/home/products",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data = await response.json();

        if (!mounted) return;

        if (
          data.success &&
          Array.isArray(data.products)
        ) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Homepage products error:",
          error
        );

        if (mounted) {
          setError(true);
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
  ADD TO CART
  ===================================================== */

  function handleAddToCart(
    product: Product
  ) {
    if (product.stock <= 0) {
      return;
    }

    const activeVariant =
      product.variants?.find(
        (variant) =>
          variant.isActive !== false &&
          (variant.stock ?? 0) > 0
      ) ??
      product.variants?.find(
        (variant) =>
          variant.isActive !== false
      );

    const packSize =
      activeVariant?.packSize ||
      "Standard";

    const cartPrice =
      activeVariant?.price &&
      activeVariant.price > 0
        ? activeVariant.price
        : product.price;

    const cartOldPrice =
      activeVariant?.compareAtPrice &&
      activeVariant.compareAtPrice >
        cartPrice
        ? activeVariant.compareAtPrice
        : product.compareAtPrice &&
          product.compareAtPrice >
            cartPrice
        ? product.compareAtPrice
        : undefined;

    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      productType:
        product.productType ||
        "Seed Product",
      packSize,
      price: cartPrice,
      oldPrice: cartOldPrice,
      quantity: 1,

      /* =================================================
         DELIVERY
      ================================================= */

      deliveryType:
        product.deliveryType === "paid"
          ? "paid"
          : "free",

      deliveryCharge:
        product.deliveryType === "paid"
          ? Number(product.deliveryCharge) || 0
          : 0,
    });

    setAddedProductId(product.id);

    openCart();

    window.setTimeout(() => {
      setAddedProductId((current) =>
        current === product.id
          ? null
          : current
      );
    }, 1400);
  }

  /* =====================================================
  LOADING
  ===================================================== */

  if (loading) {
    return (
      <section className="bg-[#f8f7f2] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-5 h-2.5 w-32 animate-pulse bg-[#e1e6df]" />

            <div className="h-10 w-80 animate-pulse bg-[#e1e6df]" />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <ProductSkeleton large />

            <div className="grid gap-5 sm:grid-cols-2">
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* =====================================================
  EMPTY / ERROR
  ===================================================== */

  if (
    error ||
    products.length === 0
  ) {
    return (
      <section className="bg-[#f8f7f2] py-20">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="text-sm font-medium text-[#68756b]">
            Products will appear here soon.
          </p>
        </div>
      </section>
    );
  }

  const featuredProduct = products[0];

  const secondaryProducts =
    products.slice(1, 4);

  return (
    <section className="relative overflow-hidden bg-[#f8f7f2] py-20 lg:py-28">
      {/* =================================================
      BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-[#e7eee4]/80 blur-[110px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#eee6d8]/80 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* =================================================
        HEADER
        ================================================= */}

        <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end lg:mb-14">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#82977f]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#687c68]">
                Customer Favorites
              </span>

              <span className="h-px w-10 bg-[#82977f]" />
            </div>

            <h2 className="max-w-2xl text-[38px] font-semibold leading-[1.02] tracking-[-0.055em] text-[#10291d] sm:text-5xl lg:text-[58px]">
              Seeds chosen
              <span className="block font-serif font-normal italic text-[#315c45]">
                again & again.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#737b73]">
              Discover our most loved selections,
              freshly added products and carefully
              curated favorites from the collection.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-3 border-b border-[#aeb8ad] pb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#10291d] transition hover:border-[#10291d]"
          >
            Explore collection

            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.7}
            />
          </Link>
        </div>

        {/* =================================================
        PRODUCTS
        ================================================= */}

        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          {/* =================================================
          FEATURED CARD
          ================================================= */}

          <motion.article
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
            }}
            className="group relative overflow-hidden bg-[#10291d]"
          >
            <Link
              href={featuredProduct.href}
              className="block"
            >
              <div className="relative h-[560px] overflow-hidden sm:h-[620px]">
                {/* IMAGE */}

                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />

                {/* LUXURY OVERLAYS */}

                <div className="absolute inset-0 bg-gradient-to-t from-[#06130c] via-[#10291d]/25 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-r from-[#06130c]/25 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#06130c]/80 via-transparent to-transparent" />

                {/* BADGE */}

                <div className="absolute left-6 top-6 z-10">
                  <ProductBadge
                    badge={
                      featuredProduct.badge
                    }
                  />
                </div>

                {/* WISHLIST */}

                <div
                  className="absolute right-6 top-6 z-10"
                  onClick={(event) =>
                    event.preventDefault()
                  }
                >
                  <WishlistButton
                    productId={
                      featuredProduct.id
                    }
                    product={{
                      id: featuredProduct.id,
                      name:
                        featuredProduct.name,
                      category:
                        featuredProduct.category,
                      price: `Rs.${formatPrice(
                        featuredProduct.price
                      )}`,
                      oldPrice:
                        featuredProduct.compareAtPrice
                          ? `Rs.${formatPrice(
                              featuredProduct.compareAtPrice
                            )}`
                          : null,
                      image:
                        featuredProduct.image,
                      rating:
                        featuredProduct.rating,
                      reviews:
                        featuredProduct.reviews,
                      badge:
                        featuredProduct.badge,
                      href:
                        featuredProduct.href,
                    }}
                    size="md"
                  />
                </div>

                {/* CONTENT OVER IMAGE */}

                <div className="absolute bottom-0 left-0 right-0 z-10 p-7 sm:p-9">
                  <div className="max-w-xl">
                    <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.28em] text-white/50">
                      {featuredProduct.category}
                    </p>

                    <h3 className="text-3xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-4xl lg:text-[43px]">
                      {featuredProduct.name}
                    </h3>

                    {/* RATING */}

                    <div className="mt-4">
                      <Stars
                        rating={
                          featuredProduct.rating
                        }
                        reviews={
                          featuredProduct.reviews
                        }
                      />
                    </div>

                    {/* VARIANTS */}

                    <VariantInfo
                      variants={
                        featuredProduct.variants
                      }
                    />

                    {/* PRICE + ADD BUTTON */}

                    <div className="mt-5 flex items-end justify-between gap-5">
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-[28px]">
                            Rs.{" "}
                            {formatPrice(
                              featuredProduct.price
                            )}
                          </span>

                          {featuredProduct.compareAtPrice &&
                            featuredProduct.compareAtPrice >
                              featuredProduct.price && (
                              <span className="text-sm text-white/40 line-through">
                                Rs.{" "}
                                {formatPrice(
                                  featuredProduct.compareAtPrice
                                )}
                              </span>
                            )}
                        </div>

                        <VariantPriceInfo
                          variants={
                            featuredProduct.variants
                          }
                        />
                      </div>

                      {/* WHITE ICON BUTTON */}

                      <motion.button
                        type="button"
                        whileHover={{
                          scale: 1.06,
                        }}
                        whileTap={{
                          scale: 0.92,
                        }}
                        disabled={
                          featuredProduct.stock <=
                          0
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          handleAddToCart(
                            featuredProduct
                          );
                        }}
                        aria-label={`Add ${featuredProduct.name} to cart`}
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white text-[#10291d] shadow-[0_12px_35px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-[#f2f5ef] disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-14 ${
                          addedProductId ===
                          featuredProduct.id
                            ? "bg-[#dce9dd]"
                            : ""
                        }`}
                      >
                        {addedProductId ===
                        featuredProduct.id ? (
                          <Check
                            className="h-5 w-5"
                            strokeWidth={2}
                          />
                        ) : (
                          <ShoppingBag
                            className="h-5 w-5"
                            strokeWidth={1.6}
                          />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>

          {/* =================================================
          SECONDARY CARDS
          ================================================= */}

          <div className="grid gap-5 sm:grid-cols-2">
            {secondaryProducts.map(
              (product, index) => (
                <motion.article
                  key={product.id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.12,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                  }}
                  className="group relative overflow-hidden bg-[#10291d]"
                >
                  <Link
                    href={product.href}
                    className="block"
                  >
                    <div className="relative h-[390px] overflow-hidden sm:h-[330px] lg:h-[365px]">
                      {/* IMAGE */}

                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.07]"
                      />

                      {/* OVERLAY */}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#06130c] via-[#10291d]/15 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#06130c]/75 via-transparent to-transparent" />

                      {/* BADGE */}

                      <div className="absolute left-4 top-4 z-10">
                        <ProductBadge
                          badge={
                            product.badge
                          }
                        />
                      </div>

                      {/* WISHLIST */}

                      <div
                        className="absolute right-4 top-4 z-10"
                        onClick={(event) =>
                          event.preventDefault()
                        }
                      >
                        <WishlistButton
                          productId={
                            product.id
                          }
                          product={{
                            id: product.id,
                            name:
                              product.name,
                            category:
                              product.category,
                            price: `Rs.${formatPrice(
                              product.price
                            )}`,
                            oldPrice:
                              product.compareAtPrice
                                ? `Rs.${formatPrice(
                                    product.compareAtPrice
                                  )}`
                                : null,
                            image:
                              product.image,
                            rating:
                              product.rating,
                            reviews:
                              product.reviews,
                            badge:
                              product.badge,
                            href:
                              product.href,
                          }}
                          size="sm"
                        />
                      </div>

                      {/* CONTENT */}

                      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-6">
                        <p className="mb-2 text-[7px] font-semibold uppercase tracking-[0.25em] text-white/45">
                          {product.category}
                        </p>

                        <h3 className="line-clamp-2 min-h-[42px] text-[18px] font-semibold leading-[1.18] tracking-[-0.03em] text-white">
                          {product.name}
                        </h3>

                        {/* RATING */}

                        <div className="mt-3">
                          <Stars
                            rating={
                              product.rating
                            }
                            reviews={
                              product.reviews
                            }
                          />
                        </div>

                        {/* VARIANTS */}

                        <VariantInfo
                          variants={
                            product.variants
                          }
                        />

                        {/* PRICE + BUTTON */}

                        <div className="mt-4 flex items-end justify-between gap-4">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-semibold tracking-[-0.025em] text-white">
                                Rs.{" "}
                                {formatPrice(
                                  product.price
                                )}
                              </span>

                              {product.compareAtPrice &&
                                product.compareAtPrice >
                                  product.price && (
                                <span className="text-[9px] text-white/40 line-through">
                                  Rs.{" "}
                                  {formatPrice(
                                    product.compareAtPrice
                                  )}
                                </span>
                              )}
                            </div>

                            <VariantPriceInfo
                              variants={
                                product.variants
                              }
                            />
                          </div>

                          {/* WHITE ICON BUTTON */}

                          <motion.button
                            type="button"
                            whileHover={{
                              scale: 1.08,
                            }}
                            whileTap={{
                              scale: 0.92,
                            }}
                            disabled={
                              product.stock <=
                              0
                            }
                            onClick={(event) => {
                              event.preventDefault();
                              handleAddToCart(
                                product
                              );
                            }}
                            aria-label={`Add ${product.name} to cart`}
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white text-[#10291d] shadow-[0_10px_25px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-[#f2f5ef] disabled:cursor-not-allowed disabled:opacity-40 ${
                              addedProductId ===
                              product.id
                                ? "bg-[#dce9dd]"
                                : ""
                            }`}
                          >
                            {addedProductId ===
                            product.id ? (
                              <Check
                                className="h-4 w-4"
                                strokeWidth={2}
                              />
                            ) : (
                              <ShoppingBag
                                className="h-4 w-4"
                                strokeWidth={1.6}
                              />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              )
            )}

            {/* EMPTY */}

            {secondaryProducts.length ===
              0 && (
              <div className="flex min-h-[300px] items-center justify-center bg-[#10291d] sm:col-span-2">
                <div className="text-center">
                  <Heart
                    className="mx-auto h-7 w-7 text-white/40"
                    strokeWidth={1.3}
                  />

                  <p className="mt-4 text-sm text-white/50">
                    More products coming soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}