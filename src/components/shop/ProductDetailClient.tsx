"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Expand,
  Loader2,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/WishlistButton";

import type { Product } from "@/app/shop/[slug]/page";

/* =========================================================
   HELPERS
========================================================= */

const formatPrice = (price: number) =>
  `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

function Stars({
  rating,
  size = 15,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          strokeWidth={1.5}
          fill={
            star <= Math.round(rating)
              ? "currentColor"
              : "none"
          }
          className="text-[#315c45]"
        />
      ))}
    </div>
  );
}

/* =========================================================
   RELATED PRODUCT
========================================================= */

function RelatedProduct({
  product,
}: {
  product: Product;
}) {
  const activeVariant = product.variants?.find(
    (variant) => variant.isActive !== false
  );

  const price =
    activeVariant?.price ?? product.price;

  const compareAtPrice =
    activeVariant?.compareAtPrice ??
    product.compareAtPrice;

  const wishlistProduct = {
    id: product.id,
    name: product.name,
    category: product.category || "Seeds",
    price: formatPrice(price),
    oldPrice:
      compareAtPrice &&
      compareAtPrice > price
        ? formatPrice(compareAtPrice)
        : null,
    image: product.images?.[0] || "",
    rating: product.rating || 0,
    reviews: product.reviewCount || 0,
    badge: product.badge || null,
    href: `/shop/${product.slug}`,
  };

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[26px] bg-[#efede4]">
        <Link
          href={`/shop/${product.slug}`}
          className="block"
        >
          <div className="aspect-[0.9] overflow-hidden">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[#858980]">
                No image
              </div>
            )}
          </div>
        </Link>

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[#234636] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white">
            {product.badge}
          </span>
        )}

        <div className="absolute right-3 top-3">
          <WishlistButton
            productId={product.id}
            product={wishlistProduct}
            size="sm"
          />
        </div>

        <Link
          href={`/shop/${product.slug}`}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#315c45] opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100"
        >
          <ArrowRight
            size={15}
            className="-rotate-45"
          />
        </Link>
      </div>

      <Link href={`/shop/${product.slug}`}>
        <div className="pt-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8b8e85]">
            {product.type}
          </p>

          <h3 className="mt-1.5 text-[16px] font-semibold leading-snug text-[#234636]">
            {product.name}
          </h3>

          <div className="mt-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#315c45]">
                {formatPrice(price)}
              </span>

              {compareAtPrice &&
                compareAtPrice > price && (
                  <span className="text-[11px] text-[#999d94] line-through">
                    {formatPrice(compareAtPrice)}
                  </span>
                )}
            </div>

            {product.reviewCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-[#777b73]">
                <Star
                  size={11}
                  fill="currentColor"
                  className="text-[#315c45]"
                />
                {product.rating}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

/* =========================================================
   IMAGE LIGHTBOX
========================================================= */

function ImageLightbox({
  images,
  activeImage,
  setActiveImage,
  onClose,
}: {
  images: string[];
  activeImage: number;
  setActiveImage: (index: number) => void;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        setActiveImage(
          (activeImage + 1) % images.length
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveImage(
          (activeImage - 1 + images.length) %
            images.length
        );
      }

      if (event.key === "+") {
        setZoom((current) =>
          Math.min(3, current + 0.25)
        );
      }

      if (event.key === "-") {
        setZoom((current) =>
          Math.max(1, current - 0.25)
        );
      }

      if (event.key === "0") {
        setZoom(1);
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKey
      );
    };
  }, [
    activeImage,
    images.length,
    onClose,
    setActiveImage,
  ]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const zoomIn = () => {
    setZoom((current) =>
      Math.min(3, current + 0.25)
    );
  };

  const zoomOut = () => {
    setZoom((current) =>
      Math.max(1, current - 0.25)
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-[#111713]/95 backdrop-blur-xl"
        onWheel={(event) => {
          if (event.deltaY < 0) {
            zoomIn();
          } else {
            zoomOut();
          }
        }}
      >
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Product gallery
            </span>

            <span className="hidden text-xs text-white/40 sm:block">
              {activeImage + 1} / {images.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            aria-label="Close gallery"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex h-full items-center justify-center overflow-hidden px-5 py-24 sm:px-20">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${images[activeImage]}-${activeImage}`}
              src={images[activeImage]}
              alt={`Product image ${activeImage + 1}`}
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: zoom,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="max-h-[78vh] max-w-[90vw] select-none object-contain"
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveImage(
                  (activeImage -
                    1 +
                    images.length) %
                    images.length
                )
              }
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition hover:bg-white/10 sm:left-7"
              aria-label="Previous image"
            >
              <ArrowLeft size={17} />
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveImage(
                  (activeImage + 1) %
                    images.length
                )
              }
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition hover:bg-white/10 sm:right-7"
              aria-label="Next image"
            >
              <ArrowRight size={17} />
            </button>
          </>
        )}

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#18201b]/90 p-1.5 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>

          <span className="min-w-[54px] text-center text-[10px] font-semibold text-white/60">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>

          <span className="mx-1 h-5 w-px bg-white/10" />

          <button
            type="button"
            onClick={() => setZoom(1)}
            className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[10px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-5 right-5 hidden max-w-[300px] gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#18201b]/90 p-2 backdrop-blur-xl lg:flex">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => {
                  setActiveImage(index);
                  setZoom(1);
                }}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition ${
                  activeImage === index
                    ? "border-white"
                    : "border-white/10 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* =========================================================
   PRODUCT DETAIL SKELETON
========================================================= */

export function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#f8f6ef]">
      <div className="mx-auto max-w-[1280px] px-5 pb-24 pt-32 sm:px-8 lg:px-10">
        <div className="h-4 w-56 animate-pulse rounded bg-[#e7e3d8]" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <div className="aspect-square animate-pulse rounded-[32px] bg-[#e7e3d8]" />

            <div className="mt-4 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-square animate-pulse rounded-2xl bg-[#e7e3d8]"
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-4 w-28 animate-pulse rounded bg-[#e7e3d8]" />

            <div className="h-16 w-4/5 animate-pulse rounded bg-[#e7e3d8]" />

            <div className="h-5 w-52 animate-pulse rounded bg-[#e7e3d8]" />

            <div className="h-12 w-40 animate-pulse rounded bg-[#e7e3d8]" />

            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-[#e7e3d8]" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-[#e7e3d8]" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-[#e7e3d8]" />
            </div>

            <div className="h-24 animate-pulse rounded-2xl bg-[#e7e3d8]" />

            <div className="h-16 animate-pulse rounded-xl bg-[#e7e3d8]" />

            <div className="h-16 animate-pulse rounded-xl bg-[#e7e3d8]" />
          </div>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [activeImage, setActiveImage] =
    useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [cartAdded, setCartAdded] =
    useState(false);

  const [buying, setBuying] =
    useState(false);

  const [lightboxOpen, setLightboxOpen] =
    useState(false);

  const [openSection, setOpenSection] =
    useState<string | null>("description");

  /* =======================================================
     REVIEW FORM
  ======================================================= */

  const [reviewName, setReviewName] =
    useState("");

  const [reviewEmail, setReviewEmail] =
    useState("");

  const [reviewRating, setReviewRating] =
    useState(5);

  const [reviewTitle, setReviewTitle] =
    useState("");

  const [reviewComment, setReviewComment] =
    useState("");

  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);

  const [reviewMessage, setReviewMessage] =
    useState("");

  const [reviewError, setReviewError] =
    useState("");

  const [showReviewForm, setShowReviewForm] =
    useState(false);

  const {
    addToCart,
    openCart,
  } = useCart();

  /* =======================================================
     VARIANT
  ======================================================= */

  const initialVariant =
    product.variants?.find(
      (variant) =>
        variant.id ===
        product.defaultVariantId
    ) ||
    product.variants?.find(
      (variant) => variant.stock > 0
    ) ||
    product.variants?.[0];

  const [
    selectedVariantId,
    setSelectedVariantId,
  ] = useState(
    initialVariant?.id || ""
  );

  const selectedVariant =
    product.variants?.find(
      (variant) =>
        variant.id === selectedVariantId
    ) || initialVariant;

  const selectedPrice =
    selectedVariant?.price ??
    product.price ??
    0;

  const selectedCompareAtPrice =
    selectedVariant?.compareAtPrice ??
    product.compareAtPrice;

  const selectedStock =
    selectedVariant?.stock ??
    product.stock ??
    0;

  const selectedPackSize =
    selectedVariant?.packSize ||
    "Standard";

  const savings =
    selectedCompareAtPrice &&
    selectedCompareAtPrice >
      selectedPrice
      ? selectedCompareAtPrice -
        selectedPrice
      : 0;

  const totalPrice =
    selectedPrice * quantity;

  const isOutOfStock =
    selectedStock <= 0;

  /* =======================================================
     IMAGE SAFETY
  ======================================================= */

  const safeImages =
    product.images?.length > 0
      ? product.images
      : ["/placeholder-product.jpg"];

  /* =======================================================
     WISHLIST DATA
  ======================================================= */

  const wishlistProduct = useMemo(
    () => ({
      id: product.id,
      name: product.name,
      category:
        product.category || "Seeds",
      price: formatPrice(selectedPrice),
      oldPrice:
        selectedCompareAtPrice &&
        selectedCompareAtPrice >
          selectedPrice
          ? formatPrice(
              selectedCompareAtPrice
            )
          : null,
      image:
        product.images?.[0] || "",
      rating: product.rating || 0,
      reviews:
        product.reviewCount || 0,
      badge: product.badge || null,
      href: `/shop/${product.slug}`,
    }),
    [
      product,
      selectedPrice,
      selectedCompareAtPrice,
    ]
  );

  /* =======================================================
     CART
  ======================================================= */

  const createCartItem = () => {
    const deliveryType: "paid" | "free" =
      product.deliveryType === "paid"
        ? "paid"
        : "free";

    return {
      /*
       * IMPORTANT:
       * `id` is the unique cart-line ID.
       * It is NOT necessarily the MongoDB Product ID.
       */
      id: selectedVariant
        ? `${product.id}-${selectedVariant.id}`
        : product.id,

      /*
       * IMPORTANT:
       * This is the real MongoDB Product `_id`.
       * The checkout API uses this field
       * to find the product.
       */
      productId: product.id,

      /*
       * IMPORTANT:
       * This is the selected MongoDB variant `_id`.
       */
      variantId:
        selectedVariant?.id || null,

      slug: product.slug,
      name: product.name,
      image: product.images?.[0] || "",
      productType: product.type,

      packSize: selectedPackSize,

      price: selectedPrice,
      quantity,

      deliveryType,

      deliveryCharge:
        deliveryType === "paid"
          ? Number(
              product.deliveryCharge
            ) || 0
          : 0,

      ...(selectedCompareAtPrice
        ? {
            oldPrice:
              selectedCompareAtPrice,
          }
        : {}),
    };
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const cartItem = createCartItem();

    addToCart(cartItem);

    setCartAdded(true);

    openCart();

    window.setTimeout(() => {
      setCartAdded(false);
    }, 2200);
  };

  const buyNow = () => {
    if (isOutOfStock) return;

    setBuying(true);

    const cartItem = createCartItem();

    addToCart(cartItem);

    window.setTimeout(() => {
      window.location.href =
        "/checkout";
    }, 350);
  };

  /* =======================================================
     SUBMIT REVIEW
  ======================================================= */

  const handleReviewSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setReviewMessage("");
    setReviewError("");

    const name = reviewName.trim();
    const email = reviewEmail.trim();
    const title = reviewTitle.trim();
    const comment = reviewComment.trim();

    if (!name) {
      setReviewError(
        "Please enter your name."
      );
      return;
    }

    if (name.length < 2) {
      setReviewError(
        "Name must be at least 2 characters."
      );
      return;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      setReviewError(
        "Please enter a valid email address."
      );
      return;
    }

    if (
      reviewRating < 1 ||
      reviewRating > 5
    ) {
      setReviewError(
        "Please select a rating."
      );
      return;
    }

    if (!comment) {
      setReviewError(
        "Please write your review."
      );
      return;
    }

    if (comment.length < 5) {
      setReviewError(
        "Review must contain at least 5 characters."
      );
      return;
    }

    setReviewSubmitting(true);

    try {
      const response = await fetch(
        "/api/shop/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            name,
            email: email || undefined,
            rating: reviewRating,
            title: title || undefined,
            comment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to submit your review."
        );
      }

      setReviewMessage(
        "Thank you! Your review has been submitted and is awaiting approval."
      );

      setReviewName("");
      setReviewEmail("");
      setReviewRating(5);
      setReviewTitle("");
      setReviewComment("");

      setShowReviewForm(false);
    } catch (error) {
      console.error(
        "Review submission error:",
        error
      );

      setReviewError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  /* =======================================================
     QUANTITY
  ======================================================= */

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    if (isOutOfStock) return;

    setQuantity((current) =>
      Math.min(
        10,
        selectedStock,
        current + 1
      )
    );
  };

  /* =======================================================
     ACCORDION
  ======================================================= */

  const toggleSection = (
    section: string
  ) => {
    setOpenSection((current) =>
      current === section
        ? null
        : section
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6ef] text-[#252923]">

      {/* LIGHTBOX */}

      {lightboxOpen && (
        <ImageLightbox
          images={safeImages}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          onClose={() =>
            setLightboxOpen(false)
          }
        />
      )}

      {/* BREADCRUMB */}

      <section className="mx-auto max-w-[1280px] px-5 pt-28 sm:px-8 lg:px-10 lg:pt-32">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[10px] font-medium text-[#8b8e85]"
        >
          <Link
            href="/"
            className="transition hover:text-[#315c45]"
          >
            Home
          </Link>

          <span className="text-[#c1beb4]">
            /
          </span>

          <Link
            href="/shop"
            className="transition hover:text-[#315c45]"
          >
            Shop
          </Link>

          {product.category && (
            <>
              <span className="text-[#c1beb4]">
                /
              </span>

              <Link
                href={`/shop?category=${product.categorySlug}`}
                className="transition hover:text-[#315c45]"
              >
                {product.category}
              </Link>
            </>
          )}

          <span className="text-[#c1beb4]">
            /
          </span>

          <span className="max-w-[220px] truncate font-semibold text-[#315c45]">
            {product.name}
          </span>
        </nav>
      </section>

      {/* HERO */}

      <section className="mx-auto max-w-[1280px] px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pb-28 lg:pt-10">
        <div className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 xl:gap-24">

          {/* GALLERY */}

          <div className="lg:sticky lg:top-24">

            <div className="group relative overflow-hidden rounded-[34px] border border-[#e4e0d5] bg-[#eeece3] shadow-[0_30px_80px_rgba(35,70,54,0.09)]">

              <div className="absolute left-5 top-5 z-20 flex items-center gap-2">
                {product.badge && (
                  <span className="rounded-full bg-[#234636] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.18em] text-white shadow-lg">
                    {product.badge}
                  </span>
                )}

                {selectedCompareAtPrice &&
                  selectedCompareAtPrice >
                    selectedPrice && (
                    <span className="rounded-full border border-white/70 bg-white/90 px-3.5 py-2 text-[8px] font-bold uppercase tracking-[0.14em] text-[#a6473b] backdrop-blur">
                      Special Price
                    </span>
                  )}
              </div>

              <div className="absolute right-5 top-5 z-20">
                <WishlistButton
                  productId={product.id}
                  product={wishlistProduct}
                  size="lg"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setLightboxOpen(true)
                }
                className="block w-full cursor-zoom-in"
                aria-label="Open product gallery"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${safeImages[activeImage]}-${activeImage}`}
                    src={
                      safeImages[
                        activeImage
                      ]
                    }
                    alt={`${product.name} product image`}
                    initial={{
                      opacity: 0,
                      scale: 1.025,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.45,
                    }}
                    className="aspect-square w-full object-cover"
                  />
                </AnimatePresence>
              </button>

              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3.5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#315c45] shadow-sm backdrop-blur">
                <Expand size={12} />
                View larger
              </div>

              <div className="absolute bottom-5 right-5 rounded-full border border-white/60 bg-white/90 px-3.5 py-2.5 text-[9px] font-semibold text-[#315c45] shadow-sm backdrop-blur">
                {activeImage + 1} /{" "}
                {safeImages.length}
              </div>
            </div>

            {safeImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {safeImages
                  .slice(0, 8)
                  .map(
                    (
                      image,
                      index
                    ) => {
                      const active =
                        activeImage ===
                        index;

                      return (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() => {
                            setActiveImage(
                              index
                            );
                          }}
                          className={`group relative overflow-hidden rounded-[18px] border-2 bg-[#efede4] transition-all duration-300 ${
                            active
                              ? "border-[#315c45] shadow-[0_8px_25px_rgba(35,70,54,0.12)]"
                              : "border-transparent hover:border-[#cbd5ca]"
                          }`}
                        >
                          <img
                            src={image}
                            alt=""
                            loading="lazy"
                            className={`aspect-square w-full object-cover transition duration-500 ${
                              active
                                ? "scale-[1.02]"
                                : "group-hover:scale-[1.05]"
                            }`}
                          />

                          {active && (
                            <span className="absolute inset-x-2 bottom-2 h-0.5 rounded-full bg-[#315c45]" />
                          )}
                        </button>
                      );
                    }
                  )}
              </div>
            )}

            <p className="mt-4 text-center text-[9px] font-medium uppercase tracking-[0.14em] text-[#999d94]">
              Click the main image to inspect it in detail
            </p>
          </div>

          {/* PRODUCT INFORMATION */}

          <div className="lg:pt-1">

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-[#e4eee3] px-3.5 py-2 text-[8px] font-bold uppercase tracking-[0.17em] text-[#315c45]">
                {product.type}
              </span>

              {product.category && (
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8b8e85]">
                  {product.category}
                </span>
              )}
            </div>

            <h1 className="mt-6 max-w-[700px] font-serif text-[43px] leading-[0.98] tracking-[-0.04em] text-[#234636] sm:text-5xl lg:text-[62px]">
              {product.name}
            </h1>

            {product.subtitle && (
              <p className="mt-5 max-w-[610px] text-[15px] leading-7 text-[#727870]">
                {product.subtitle}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {product.reviewCount > 0 ? (
                <>
                  <div className="flex items-center gap-2.5">
                    <Stars
                      rating={
                        product.rating
                      }
                    />

                    <span className="text-sm font-semibold text-[#234636]">
                      {product.rating.toFixed(
                        1
                      )}
                    </span>
                  </div>

                  <span className="h-4 w-px bg-[#d9d5ca]" />

                  <a
                    href="#reviews"
                    className="text-xs font-medium text-[#747970] underline decoration-[#c9c6bc] underline-offset-4 transition hover:text-[#315c45]"
                  >
                    {product.reviewCount}{" "}
                    {product.reviewCount ===
                    1
                      ? "customer review"
                      : "customer reviews"}
                  </a>
                </>
              ) : (
                <span className="text-xs text-[#858980]">
                  No reviews yet
                </span>
              )}
            </div>

            <div className="mt-8 rounded-[24px] border border-[#ddd9ce] bg-white p-5 shadow-[0_15px_40px_rgba(35,70,54,0.045)] sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#999d94]">
                    Current price
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="font-serif text-[36px] tracking-[-0.025em] text-[#234636]">
                      {formatPrice(
                        selectedPrice
                      )}
                    </span>

                    {selectedCompareAtPrice &&
                      selectedCompareAtPrice >
                        selectedPrice && (
                        <span className="pb-1 text-sm text-[#9b9e96] line-through">
                          {formatPrice(
                            selectedCompareAtPrice
                          )}
                        </span>
                      )}
                  </div>
                </div>

                {savings > 0 && (
                  <div className="rounded-2xl bg-[#edf3e9] px-4 py-3 text-right">
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#6d766d]">
                      You save
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#315c45]">
                      {formatPrice(
                        savings
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {product.overview && (
              <div className="mt-7">
                <p className="max-w-[650px] whitespace-pre-line text-[14px] leading-8 text-[#676e67]">
                  {product.overview}
                </p>
              </div>
            )}

            <div className="my-8 h-px bg-[#dedad0]" />

            {/* PACK SIZE */}

            {product.variants?.length >
              0 && (
              <div>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b8e85]">
                      Choose your option
                    </p>

                    <h2 className="mt-1 font-serif text-xl text-[#234636]">
                      Pack size
                    </h2>
                  </div>

                  <span className="text-xs font-semibold text-[#315c45]">
                    {selectedPackSize}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {product.variants.map(
                    (variant) => {
                      const active =
                        selectedVariantId ===
                        variant.id;

                      const unavailable =
                        variant.stock <=
                        0;

                      return (
                        <button
                          key={
                            variant.id
                          }
                          type="button"
                          disabled={
                            unavailable
                          }
                          onClick={() => {
                            setSelectedVariantId(
                              variant.id
                            );

                            setQuantity(
                              1
                            );
                          }}
                          className={`relative min-h-[78px] rounded-[17px] border px-3 py-3 text-left transition-all duration-300 ${
                            unavailable
                              ? "cursor-not-allowed border-[#e5e1d8] bg-[#f5f3ed] opacity-55"
                              : active
                                ? "border-[#315c45] bg-[#315c45] text-white shadow-[0_12px_30px_rgba(49,92,69,0.16)]"
                                : "border-[#d8d4c9] bg-white text-[#315c45] hover:-translate-y-0.5 hover:border-[#315c45] hover:shadow-sm"
                          }`}
                        >
                          <span className="block text-sm font-bold">
                            {variant.packSize ||
                              "Standard"}
                          </span>

                          <span
                            className={`mt-2 block text-[10px] ${
                              active
                                ? "text-white/70"
                                : "text-[#858980]"
                            }`}
                          >
                            {unavailable
                              ? "Out of stock"
                              : formatPrice(
                                  variant.price
                                )}
                          </span>

                          {active &&
                            !unavailable && (
                              <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                                <Check
                                  size={
                                    11
                                  }
                                />
                              </span>
                            )}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* STOCK */}

            <div className="mt-6 flex items-center justify-between rounded-[18px] border border-[#dfe2da] bg-[#f7faf5] px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isOutOfStock
                      ? "bg-red-400"
                      : selectedStock <=
                          5
                        ? "bg-amber-400"
                        : "bg-[#5c8c6d]"
                  }`}
                />

                <div>
                  <p className="text-xs font-bold text-[#39423b]">
                    {isOutOfStock
                      ? "Currently unavailable"
                      : selectedStock <=
                          5
                        ? `Only ${selectedStock} left`
                        : "In stock and ready to order"}
                  </p>

                  {!isOutOfStock && (
                    <p className="mt-0.5 text-[9px] text-[#8a9088]">
                      Selected option:{" "}
                      {selectedPackSize}
                    </p>
                  )}
                </div>
              </div>

              {selectedVariant?.sku && (
                <span className="hidden text-[9px] font-medium uppercase tracking-[0.1em] text-[#999d94] sm:block">
                  SKU{" "}
                  {selectedVariant.sku}
                </span>
              )}
            </div>

            {/* QUANTITY */}

            <div className="mt-7 flex items-end justify-between gap-5">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b8e85]">
                  Quantity
                </p>

                <div className="flex h-13 items-center overflow-hidden rounded-[15px] border border-[#d7d4ca] bg-white">
                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                    className="flex h-full w-12 items-center justify-center text-[#315c45] transition hover:bg-[#edf2eb] disabled:opacity-30"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="flex w-12 justify-center text-sm font-bold text-[#234636]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      isOutOfStock ||
                      quantity >=
                        Math.min(
                          10,
                          selectedStock
                        )
                    }
                    className="flex h-full w-12 items-center justify-center text-[#315c45] transition hover:bg-[#edf2eb] disabled:opacity-30"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#999d94]">
                  Order total
                </p>

                <p className="mt-1 font-serif text-2xl tracking-[-0.02em] text-[#234636]">
                  {formatPrice(
                    totalPrice
                  )}
                </p>
              </div>
            </div>

            {/* CTA */}

            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_155px]">
              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  isOutOfStock
                }
                className={`group relative flex h-[62px] items-center justify-center gap-2 overflow-hidden rounded-[16px] text-sm font-bold text-white shadow-[0_14px_35px_rgba(35,70,54,0.15)] transition-all duration-300 ${
                  isOutOfStock
                    ? "cursor-not-allowed bg-[#aaa9a1] shadow-none"
                    : cartAdded
                      ? "bg-[#234636]"
                      : "bg-[#315c45] hover:-translate-y-0.5 hover:bg-[#234636] hover:shadow-[0_18px_42px_rgba(35,70,54,0.22)]"
                }`}
              >
                {isOutOfStock ? (
                  "Out of Stock"
                ) : cartAdded ? (
                  <>
                    <Check size={18} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={buyNow}
                disabled={
                  buying ||
                  isOutOfStock
                }
                className="flex h-[62px] items-center justify-center gap-2 rounded-[16px] border border-[#315c45] bg-white text-sm font-bold text-[#315c45] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f1f5ef] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {buying ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#315c45] border-t-transparent" />
                ) : (
                  <>
                    Buy Now
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* WISHLIST */}

            <div className="mt-3">
              <div className="flex items-center justify-center">
                <WishlistButton
                  productId={product.id}
                  product={wishlistProduct}
                  size="sm"
                  className="border-transparent bg-transparent shadow-none hover:bg-[#edf2eb]"
                />

                <span className="-ml-1 text-xs font-semibold text-[#315c45]">
                  Save to Wishlist
                </span>
              </div>
            </div>

            {/* TRUST */}

            <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-[20px] border border-[#dedbd1] bg-white">
              <div className="flex flex-col items-center gap-2 border-r border-[#e4e1d8] px-3 py-5 text-center">
                <Truck
                  size={19}
                  strokeWidth={1.5}
                  className="text-[#315c45]"
                />

                <span className="text-[8px] font-bold uppercase leading-4 tracking-[0.1em] text-[#646b64]">
                  Nationwide
                  <br />
                  Delivery
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 border-r border-[#e4e1d8] px-3 py-5 text-center">
                <ShieldCheck
                  size={19}
                  strokeWidth={1.5}
                  className="text-[#315c45]"
                />

                <span className="text-[8px] font-bold uppercase leading-4 tracking-[0.1em] text-[#646b64]">
                  Quality
                  <br />
                  Assured
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 px-3 py-5 text-center">
                <PackageCheck
                  size={19}
                  strokeWidth={1.5}
                  className="text-[#315c45]"
                />

                <span className="text-[8px] font-bold uppercase leading-4 tracking-[0.1em] text-[#646b64]">
                  Carefully
                  <br />
                  Packed
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-[9px] leading-5 text-[#999d94]">
              Product information is provided
              for general product guidance.
              Please review final packaging
              instructions before launch.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCT DETAILS */}

      <section className="border-y border-[#e1ddd3] bg-white">
        <div className="mx-auto max-w-[1120px] px-5 py-20 sm:px-8 lg:py-28">

          <div className="max-w-[720px]">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#315c45]">
              Product information
            </p>

            <h2 className="mt-4 font-serif text-[38px] leading-tight tracking-[-0.035em] text-[#234636] sm:text-5xl">
              Designed to tell you everything important.
            </h2>

            <p className="mt-5 max-w-[650px] text-sm leading-7 text-[#777d76]">
              Explore the product description,
              ingredients, benefits, usage guidance
              and specifications in one place.
            </p>
          </div>

          <div className="mt-14">

            {/* DESCRIPTION */}

            {product.overview && (
              <div className="border-t border-[#ddd9ce]">
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(
                      "description"
                    )
                  }
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#999d94]">
                      01
                    </p>

                    <h3 className="mt-1 font-serif text-2xl text-[#234636]">
                      Product overview
                    </h3>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f4ef] text-[#315c45]">
                    <ChevronDown
                      size={17}
                      className={`transition-transform ${
                        openSection ===
                        "description"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </span>
                </button>

                <AnimatePresence
                  initial={false}
                >
                  {openSection ===
                    "description" && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[850px] whitespace-pre-line pb-8 text-sm leading-8 text-[#686f68]">
                        {product.overview}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* INGREDIENTS */}

            {product.ingredients?.length >
              0 && (
              <div className="border-t border-[#ddd9ce]">
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(
                      "ingredients"
                    )
                  }
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#999d94]">
                      02
                    </p>

                    <h3 className="mt-1 font-serif text-2xl text-[#234636]">
                      Ingredients
                    </h3>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f4ef] text-[#315c45]">
                    <ChevronDown
                      size={17}
                      className={`transition-transform ${
                        openSection ===
                        "ingredients"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </span>
                </button>

                <AnimatePresence
                  initial={false}
                >
                  {openSection ===
                    "ingredients" && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-3 pb-8 sm:grid-cols-2">
                        {product.ingredients.map(
                          (
                            ingredient,
                            index
                          ) => (
                            <div
                              key={`${ingredient}-${index}`}
                              className="flex items-center gap-4 rounded-[17px] border border-[#e5e2d8] bg-[#faf9f5] p-4"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4eee3] text-[10px] font-bold text-[#315c45]">
                                {String(
                                  index +
                                    1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              <span className="text-sm font-semibold text-[#465047]">
                                {
                                  ingredient
                                }
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* BENEFITS */}

            {product.benefits?.length >
              0 && (
              <div className="border-t border-[#ddd9ce]">
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(
                      "benefits"
                    )
                  }
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#999d94]">
                      03
                    </p>

                    <h3 className="mt-1 font-serif text-2xl text-[#234636]">
                      Product benefits
                    </h3>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f4ef] text-[#315c45]">
                    <ChevronDown
                      size={17}
                      className={`transition-transform ${
                        openSection ===
                        "benefits"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </span>
                </button>

                <AnimatePresence
                  initial={false}
                >
                  {openSection ===
                    "benefits" && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-3 pb-8 sm:grid-cols-2">
                        {product.benefits.map(
                          (
                            benefit,
                            index
                          ) => (
                            <div
                              key={`${benefit}-${index}`}
                              className="flex gap-4 rounded-[17px] border border-[#e5e2d8] bg-[#faf9f5] p-4"
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#315c45] text-white">
                                <Check size={14} />
                              </span>

                              <p className="pt-1 text-sm leading-6 text-[#59615a]">
                                {benefit}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* HOW TO USE */}

            {product.howToUse?.length >
              0 && (
              <div className="border-t border-[#ddd9ce]">
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(
                      "howToUse"
                    )
                  }
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#999d94]">
                      04
                    </p>

                    <h3 className="mt-1 font-serif text-2xl text-[#234636]">
                      How to use
                    </h3>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f4ef] text-[#315c45]">
                    <ChevronDown
                      size={17}
                      className={`transition-transform ${
                        openSection ===
                        "howToUse"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </span>
                </button>

                <AnimatePresence
                  initial={false}
                >
                  {openSection ===
                    "howToUse" && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="max-w-[850px] space-y-4 pb-8">
                        {product.howToUse.map(
                          (
                            step,
                            index
                          ) => (
                            <div
                              key={`${step}-${index}`}
                              className="flex gap-4"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#315c45] text-[10px] font-bold text-white">
                                {String(
                                  index +
                                    1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              <p className="pt-1 text-sm leading-7 text-[#626a62]">
                                {step}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* PRODUCT INFORMATION */}

            <div className="border-y border-[#ddd9ce]">
              <button
                type="button"
                onClick={() =>
                  toggleSection(
                    "details"
                  )
                }
                className="flex w-full items-center justify-between gap-6 py-7 text-left"
              >
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#999d94]">
                    05
                  </p>

                  <h3 className="mt-1 font-serif text-2xl text-[#234636]">
                    Product specifications
                  </h3>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f4ef] text-[#315c45]">
                  <ChevronDown
                    size={17}
                    className={`transition-transform ${
                      openSection ===
                      "details"
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </span>
              </button>

              <AnimatePresence
                initial={false}
              >
                {openSection ===
                  "details" && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-x-10 pb-8 sm:grid-cols-2">
                      <div className="border-b border-[#eeeae0] py-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#999d94]">
                          Product type
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#234636]">
                          {product.type}
                        </p>
                      </div>

                      <div className="border-b border-[#eeeae0] py-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#999d94]">
                          Category
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#234636]">
                          {product.category ||
                            "—"}
                        </p>
                      </div>

                      {product.sku && (
                        <div className="border-b border-[#eeeae0] py-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#999d94]">
                            SKU
                          </p>

                          <p className="mt-1 text-sm font-semibold text-[#234636]">
                            {product.sku}
                          </p>
                        </div>
                      )}

                      <div className="border-b border-[#eeeae0] py-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#999d94]">
                          Available sizes
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#234636]">
                          {product.sizes?.join(
                            " / "
                          ) ||
                            "Standard"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}

      <section
        id="reviews"
        className="border-b border-[#e2ded3] bg-[#f8f6ef]"
      >
        <div className="mx-auto max-w-[1120px] px-5 py-20 sm:px-8 lg:py-28">

          <div className="grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-20">

            <div className="lg:sticky lg:top-28 lg:self-start">

              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#315c45]">
                Customer feedback
              </p>

              <div className="mt-5 flex items-end gap-3">
                <span className="font-serif text-7xl leading-none tracking-[-0.05em] text-[#234636]">
                  {product.rating > 0
                    ? product.rating.toFixed(1)
                    : "—"}
                </span>

                {product.reviewCount > 0 && (
                  <span className="pb-1 text-sm text-[#858980]">
                    / 5
                  </span>
                )}
              </div>

              {product.reviewCount > 0 && (
                <div className="mt-4">
                  <Stars
                    rating={product.rating}
                    size={16}
                  />
                </div>
              )}

              <p className="mt-4 max-w-[250px] text-sm leading-7 text-[#747970]">
                {product.reviewCount > 0
                  ? `Based on ${product.reviewCount} published customer ${
                      product.reviewCount ===
                      1
                        ? "review"
                        : "reviews"
                    }.`
                  : "No published customer reviews yet."}
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(
                    (current) => !current
                  );

                  setReviewMessage("");
                  setReviewError("");
                }}
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#315c45] px-5 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#234636]"
              >
                <Star
                  size={14}
                  strokeWidth={1.8}
                />

                {showReviewForm
                  ? "Close Review Form"
                  : "Write a Review"}
              </button>
            </div>

            <div>

              {reviewMessage && (
                <div className="mb-8 flex gap-4 rounded-[20px] border border-[#d7e4d5] bg-[#edf5eb] p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#315c45] text-white">
                    <Check size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#234636]">
                      Review submitted
                    </p>

                    <p className="mt-1 text-xs leading-6 text-[#687068]">
                      {reviewMessage}
                    </p>
                  </div>
                </div>
              )}

              {reviewError && (
                <div className="mb-8 rounded-[20px] border border-[#ead7d2] bg-[#fff7f5] p-5">
                  <p className="text-sm font-bold text-[#9b5147]">
                    Unable to submit review
                  </p>

                  <p className="mt-1 text-xs leading-6 text-[#7d6d68]">
                    {reviewError}
                  </p>
                </div>
              )}

              <AnimatePresence initial={false}>
                {showReviewForm && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="mb-10 overflow-hidden"
                  >
                    <div className="rounded-[26px] border border-[#ddd9ce] bg-white p-6 shadow-[0_15px_40px_rgba(35,70,54,0.045)] sm:p-8">

                      <div className="max-w-[650px]">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#315c45]">
                          Share your experience
                        </p>

                        <h3 className="mt-3 font-serif text-3xl tracking-[-0.025em] text-[#234636]">
                          What do you think?
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-[#747970]">
                          Tell us what you think about this
                          product. You do not need an account
                          or a previous purchase to leave a
                          review.
                        </p>

                        <p className="mt-2 text-[11px] leading-6 text-[#999d94]">
                          Reviews are checked before they appear
                          publicly.
                        </p>
                      </div>

                      <form
                        onSubmit={
                          handleReviewSubmit
                        }
                        className="mt-8 space-y-6"
                      >

                        <div className="grid gap-5 sm:grid-cols-2">

                          <div>
                            <label
                              htmlFor="review-name"
                              className="mb-2 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#777d76]"
                            >
                              Your name *
                            </label>

                            <input
                              id="review-name"
                              type="text"
                              value={reviewName}
                              onChange={(event) =>
                                setReviewName(
                                  event.target.value
                                )
                              }
                              placeholder="Your name"
                              maxLength={100}
                              disabled={
                                reviewSubmitting
                              }
                              className="h-12 w-full rounded-[14px] border border-[#dcd9cf] bg-[#faf9f5] px-4 text-sm text-[#234636] outline-none transition placeholder:text-[#aaa9a1] focus:border-[#315c45] focus:bg-white"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="review-email"
                              className="mb-2 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#777d76]"
                            >
                              Email
                              <span className="ml-1 normal-case tracking-normal text-[#aaa9a1]">
                                (optional)
                              </span>
                            </label>

                            <input
                              id="review-email"
                              type="email"
                              value={reviewEmail}
                              onChange={(event) =>
                                setReviewEmail(
                                  event.target.value
                                )
                              }
                              placeholder="you@example.com"
                              maxLength={150}
                              disabled={
                                reviewSubmitting
                              }
                              className="h-12 w-full rounded-[14px] border border-[#dcd9cf] bg-[#faf9f5] px-4 text-sm text-[#234636] outline-none transition placeholder:text-[#aaa9a1] focus:border-[#315c45] focus:bg-white"
                            />
                          </div>

                        </div>

                        <div>
                          <label className="mb-3 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#777d76]">
                            Your rating *
                          </label>

                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(
                              (star) => {
                                const active =
                                  star <=
                                  reviewRating;

                                return (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      setReviewRating(
                                        star
                                      )
                                    }
                                    disabled={
                                      reviewSubmitting
                                    }
                                    aria-label={`Rate ${star} out of 5`}
                                    className="rounded-full p-1 text-[#315c45] transition-transform hover:scale-110 disabled:opacity-50"
                                  >
                                    <Star
                                      size={25}
                                      strokeWidth={
                                        1.5
                                      }
                                      fill={
                                        active
                                          ? "currentColor"
                                          : "none"
                                      }
                                    />
                                  </button>
                                );
                              }
                            )}

                            <span className="ml-2 text-xs font-semibold text-[#747970]">
                              {reviewRating}/5
                            </span>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="review-title"
                            className="mb-2 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#777d76]"
                          >
                            Review title
                            <span className="ml-1 normal-case tracking-normal text-[#aaa9a1]">
                              (optional)
                            </span>
                          </label>

                          <input
                            id="review-title"
                            type="text"
                            value={reviewTitle}
                            onChange={(event) =>
                              setReviewTitle(
                                event.target.value
                              )
                            }
                            placeholder="Give your review a short title"
                            maxLength={150}
                            disabled={
                              reviewSubmitting
                            }
                            className="h-12 w-full rounded-[14px] border border-[#dcd9cf] bg-[#faf9f5] px-4 text-sm text-[#234636] outline-none transition placeholder:text-[#aaa9a1] focus:border-[#315c45] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="review-comment"
                            className="mb-2 block text-[9px] font-bold uppercase tracking-[0.14em] text-[#777d76]"
                          >
                            Your review *
                          </label>

                          <textarea
                            id="review-comment"
                            value={reviewComment}
                            onChange={(event) =>
                              setReviewComment(
                                event.target.value
                              )
                            }
                            placeholder="Tell us about your experience..."
                            maxLength={2000}
                            rows={6}
                            disabled={
                              reviewSubmitting
                            }
                            className="w-full resize-none rounded-[14px] border border-[#dcd9cf] bg-[#faf9f5] px-4 py-3.5 text-sm leading-7 text-[#234636] outline-none transition placeholder:text-[#aaa9a1] focus:border-[#315c45] focus:bg-white"
                          />

                          <div className="mt-2 flex justify-end">
                            <span className="text-[9px] text-[#aaa9a1]">
                              {reviewComment.length}/2000
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">

                          <button
                            type="submit"
                            disabled={
                              reviewSubmitting
                            }
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#315c45] px-6 text-xs font-bold text-white shadow-[0_12px_30px_rgba(49,92,69,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#234636] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {reviewSubmitting ? (
                              <>
                                <Loader2
                                  size={15}
                                  className="animate-spin"
                                />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send size={15} />
                                Submit Review
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowReviewForm(
                                false
                              );
                              setReviewError("");
                            }}
                            disabled={
                              reviewSubmitting
                            }
                            className="h-12 rounded-[14px] border border-[#d7d4ca] bg-white px-6 text-xs font-bold text-[#315c45] transition hover:bg-[#f5f4ee] disabled:opacity-50"
                          >
                            Cancel
                          </button>

                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {product.reviews?.length > 0 ? (
                <div className="border-t border-[#dedad0]">

                  {product.reviews.map(
                    (review, index) => (
                      <motion.article
                        key={review.id}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.45,
                          delay:
                            index * 0.05,
                        }}
                        className="border-b border-[#dedad0] py-8"
                      >

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div>
                            <Stars
                              rating={
                                review.rating
                              }
                              size={14}
                            />

                            {review.title && (
                              <h3 className="mt-3 text-base font-bold text-[#234636]">
                                {review.title}
                              </h3>
                            )}
                          </div>

                          <time className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#999d94]">
                            {review.date}
                          </time>
                        </div>

                        <p className="mt-4 max-w-[760px] text-sm leading-8 text-[#687068]">
                          {review.text}
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4eee3] font-serif text-sm font-medium text-[#315c45]">
                            {review.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-bold text-[#234636]">
                                {review.name}
                              </p>

                              {review.isVerifiedPurchase && (
                                <span className="rounded-full bg-[#e4eee3] px-2 py-1 text-[7px] font-bold uppercase tracking-[0.1em] text-[#315c45]">
                                  Verified purchase
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 text-[9px] text-[#969990]">
                              Customer review
                            </p>
                          </div>
                        </div>

                        {review.adminReply && (
                          <div className="mt-6 rounded-[17px] border border-[#dce5d9] bg-white p-5 sm:ml-12">
                            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#315c45]">
                              Response from Seedra
                            </p>

                            <p className="mt-2 text-sm leading-7 text-[#687068]">
                              {
                                review
                                  .adminReply
                                  .message
                              }
                            </p>
                          </div>
                        )}

                      </motion.article>
                    )
                  )}

                </div>
              ) : (
                <div className="rounded-[24px] border border-[#ddd9ce] bg-white p-8 sm:p-10">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf3e9] text-[#315c45]">
                    <Star size={19} />
                  </div>

                  <h3 className="mt-5 font-serif text-2xl text-[#234636]">
                    Be the first to review
                  </h3>

                  <p className="mt-3 max-w-[500px] text-sm leading-7 text-[#747970]">
                    This product does not have any
                    published customer reviews yet.
                    Be the first to share your
                    experience.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(true);

                      window.setTimeout(() => {
                        document
                          .getElementById(
                            "reviews"
                          )
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }, 50);
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#315c45] px-5 py-2.5 text-xs font-bold text-[#315c45] transition hover:bg-[#edf3e9]"
                  >
                    <Star size={14} />
                    Write the first review
                  </button>

                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}

      {relatedProducts?.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#315c45]">
                  Continue exploring
                </p>

                <h2 className="mt-4 font-serif text-[40px] tracking-[-0.035em] text-[#234636] sm:text-5xl">
                  You may also like
                </h2>
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#315c45]"
              >
                View all products
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
              {relatedProducts.map(
                (item) => (
                  <RelatedProduct
                    key={item.id}
                    product={item}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* MOBILE STICKY CART */}

      <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-[#dedad0] bg-white/95 p-3 shadow-[0_-15px_40px_rgba(35,70,54,0.1)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-[650px] items-center gap-3">

          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-[#858980]">
              {selectedPackSize}
            </p>

            <p className="mt-0.5 truncate text-sm font-bold text-[#234636]">
              {product.name}
            </p>

            <p className="mt-0.5 text-sm font-bold text-[#315c45]">
              {formatPrice(
                totalPrice
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleAddToCart
            }
            disabled={
              isOutOfStock
            }
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#315c45] px-5 text-xs font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-[#aaa9a1]"
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : cartAdded ? (
              <>
                <Check size={15} />
                Added
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      <div className="h-24 lg:hidden" />
    </main>
  );
}