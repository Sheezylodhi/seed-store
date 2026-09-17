
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { connectDB } from "@/lib/db";
import ProductModel from "@/models/Product";
import Review from "@/models/Review";

import ProductDetailClient from "@/components/shop/ProductDetailClient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";

/* =========================================================
   PAGE CONFIG
========================================================= */

export const revalidate = 60;

/* =========================================================
   TYPES
========================================================= */

export type ProductReview = {
  id: string;
  name: string;
  title: string;
  text: string;
  rating: number;
  date: string;
  isVerifiedPurchase: boolean;
  adminReply?: {
    message: string;
    repliedAt?: string;
  };
};

export type ProductVariant = {
  id: string;
  packSize: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  isActive: boolean;
};

export type ProductSEO = {
  title?: string;
  description?: string;
  keywords?: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;

  subtitle: string;
  overview: string;

  /* =======================================================
     DELIVERY
  ======================================================= */

  deliveryType: "free" | "paid";
  deliveryCharge: number;

  type:
    | "Phase 1"
    | "Phase 2"
    | "Complete Pack"
    | "Single Seed";

  category: string;
  categorySlug: string;

  badge?: string;

  price: number;
  compareAtPrice?: number;

  stock: number;
  sku?: string;

  images: string[];

  variants: ProductVariant[];

  sizes: string[];
  defaultVariantId?: string;

  ingredients: string[];
  benefits: string[];
  howToUse: string[];

  rating: number;
  reviewCount: number;

  reviews: ProductReview[];

  isFeatured: boolean;
  createdAt: string;

  seo?: ProductSEO;
};

/* =========================================================
   HELPERS
========================================================= */

function getBasePrice(product: any): number {
  const activeVariants = (product.variants || [])
    .filter(
      (variant: any) =>
        variant.isActive !== false
    )
    .sort(
      (a: any, b: any) =>
        Number(a.price || 0) -
        Number(b.price || 0)
    );

  if (typeof product.price === "number") {
    return product.price;
  }

  return activeVariants[0]?.price ?? 0;
}

function getBaseCompareAtPrice(
  product: any
): number | undefined {
  const activeVariants = (product.variants || [])
    .filter(
      (variant: any) =>
        variant.isActive !== false
    )
    .sort(
      (a: any, b: any) =>
        Number(a.price || 0) -
        Number(b.price || 0)
    );

  if (
    typeof product.compareAtPrice ===
    "number"
  ) {
    return product.compareAtPrice;
  }

  return activeVariants[0]?.compareAtPrice;
}

function getTotalStock(
  product: any
): number {
  if (typeof product.stock === "number") {
    return product.stock;
  }

  return (product.variants || [])
    .filter(
      (variant: any) =>
        variant.isActive !== false
    )
    .reduce(
      (
        total: number,
        variant: any
      ) =>
        total +
        (Number(variant.stock) || 0),
      0
    );
}

function getBadge(product: any) {
  if (product.isFeatured) {
    return "FEATURED";
  }

  const compareAtPrice =
    getBaseCompareAtPrice(product);

  const price =
    getBasePrice(product);

  if (
    typeof compareAtPrice === "number" &&
    compareAtPrice > price
  ) {
    return "SPECIAL OFFER";
  }

  return undefined;
}

/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

function normalizeProduct(
  product: any,
  reviewStats?: {
    rating: number;
    reviewCount: number;
  }
): Product {
  const activeVariants: ProductVariant[] =
    (product.variants || [])
      .filter(
        (variant: any) =>
          variant.isActive !== false
      )
      .map(
        (variant: any) => ({
          id:
            variant._id?.toString() ||
            "",

          packSize:
            variant.packSize || "",

          price:
            Number(variant.price) || 0,

          compareAtPrice:
            typeof variant.compareAtPrice ===
            "number"
              ? variant.compareAtPrice
              : undefined,

          stock:
            Number(variant.stock) || 0,

          sku:
            variant.sku || "",

          isActive:
            variant.isActive !== false,
        })
      );

  const sortedVariants = [
    ...activeVariants,
  ].sort(
    (a, b) =>
      a.price - b.price
  );

  const cheapestVariant =
    sortedVariants[0];

  const price =
    typeof product.price === "number"
      ? product.price
      : cheapestVariant?.price ?? 0;

  const compareAtPrice =
    typeof product.compareAtPrice ===
    "number"
      ? product.compareAtPrice
      : cheapestVariant?.compareAtPrice;

  const stock =
    getTotalStock(product);

  const category =
    product.category &&
    typeof product.category ===
      "object"
      ? product.category
      : null;

  return {
    id: product._id.toString(),

    slug: product.slug,

    name: product.name,

    subtitle:
      product.shortDescription ||
      product.productType ||
      "",

    overview:
      product.description ||
      product.shortDescription ||
      "",

    /* =====================================================
       DELIVERY
    ===================================================== */

    deliveryType:
      product.deliveryType === "paid"
        ? "paid"
        : "free",

    deliveryCharge:
      product.deliveryType === "paid"
        ? Number(product.deliveryCharge) || 0
        : 0,

    type: product.productType,

    category:
      category?.name || "Seeds",

    categorySlug:
      category?.slug || "",

    badge:
      getBadge(product),

    price,

    compareAtPrice,

    stock,

    sku:
      product.sku || undefined,

    images:
      Array.isArray(product.images)
        ? product.images
        : [],

    variants:
      activeVariants,

    sizes:
      activeVariants
        .map(
          (variant) =>
            variant.packSize
        )
        .filter(Boolean),

    defaultVariantId:
      cheapestVariant?.id,

    ingredients:
      Array.isArray(
        product.ingredients
      )
        ? product.ingredients
        : [],

    benefits:
      Array.isArray(
        product.benefits
      )
        ? product.benefits
        : [],

    howToUse:
      Array.isArray(
        product.howToUse
      )
        ? product.howToUse
        : [],

    /*
     * IMPORTANT:
     * These values come from ONLY approved
     * + published reviews.
     */
    rating:
      reviewStats?.rating ?? 0,

    reviewCount:
      reviewStats?.reviewCount ?? 0,

    reviews: [],

    isFeatured:
      Boolean(
        product.isFeatured
      ),

    createdAt:
      product.createdAt
        ? new Date(
            product.createdAt
          ).toISOString()
        : new Date().toISOString(),

    seo: {
      title:
        product.seo?.title ||
        undefined,

      description:
        product.seo?.description ||
        undefined,

      keywords:
        Array.isArray(
          product.seo?.keywords
        )
          ? product.seo.keywords
          : [],
    },
  };
}

/* =========================================================
   GET PRODUCT DATA
========================================================= */

async function getProductData(
  slug: string
) {
  await connectDB();

  /* =======================================================
     PRODUCT
  ======================================================= */

  const productDoc =
    await ProductModel.findOne({
      slug,
      isActive: true,
    })
      .select(
        [
          "name",
          "slug",
          "category",
          "productType",
          "shortDescription",
          "description",
          "images",
          "price",
          "compareAtPrice",
          "stock",
          "sku",
          "variants",

          /* DELIVERY */
          "deliveryType",
          "deliveryCharge",

          "ingredients",
          "benefits",
          "howToUse",
          "isFeatured",
          "createdAt",
          "seo",
        ].join(" ")
      )
      .populate(
        "category",
        "name slug"
      )
      .lean();

  if (!productDoc) {
    return null;
  }

  /* =======================================================
     APPROVED + PUBLISHED REVIEWS ONLY
  ======================================================= */

  const reviews =
    await Review.find({
      product:
        productDoc._id,

      /*
       * A review must satisfy BOTH conditions
       * before it becomes visible publicly.
       */
      isApproved: true,
      isPublished: true,
    })
      .sort({
        createdAt: -1,
      })
      .select(
        [
          "name",
          "rating",
          "title",
          "comment",
          "isVerifiedPurchase",
          "adminReply",
          "createdAt",
        ].join(" ")
      )
      .lean();

  /* =======================================================
     CALCULATE RATING
  ======================================================= */

  const reviewCount =
    reviews.length;

  const totalRating =
    reviews.reduce(
      (
        sum: number,
        review: any
      ) =>
        sum +
        Number(
          review.rating || 0
        ),
      0
    );

  const averageRating =
    reviewCount > 0
      ? totalRating /
        reviewCount
      : 0;

  const reviewStats = {
    rating:
      Number(
        averageRating.toFixed(1)
      ),

    reviewCount,
  };

  /* =======================================================
     NORMALIZE PRODUCT
  ======================================================= */

  const product =
    normalizeProduct(
      productDoc,
      reviewStats
    );

  /* =======================================================
     NORMALIZE REVIEWS
  ======================================================= */

  product.reviews =
    reviews.map(
      (review: any) => ({
        id:
          review._id.toString(),

        name:
          review.name,

        title:
          review.title ||
          "Customer Review",

        text:
          review.comment,

        rating:
          Number(
            review.rating
          ) || 0,

        /*
         * Example:
         * Sep 14, 2026
         */
        date:
          review.createdAt
            ? new Date(
                review.createdAt
              ).toLocaleDateString(
                "en-PK",
                {
                  month:
                    "short",

                  day:
                    "numeric",

                  year:
                    "numeric",
                }
              )
            : "",

        isVerifiedPurchase:
          Boolean(
            review.isVerifiedPurchase
          ),

        /*
         * Admin reply is optional.
         */
        adminReply:
          review.adminReply
            ?.message
            ? {
                message:
                  review
                    .adminReply
                    .message,

                repliedAt:
                  review
                    .adminReply
                    .repliedAt
                    ? new Date(
                        review
                          .adminReply
                          .repliedAt
                      ).toISOString()
                    : undefined,
              }
            : undefined,
      })
    );

  /* =======================================================
     RELATED PRODUCTS
  ======================================================= */

  const relatedDocs =
    await ProductModel.find({
      isActive: true,

      _id: {
        $ne:
          productDoc._id,
      },

      $or: [
        {
          category:
            productDoc.category?._id ||
            productDoc.category,
        },

        {
          productType:
            productDoc.productType,
        },
      ],
    })
      .select(
        [
          "name",
          "slug",
          "category",
          "productType",
          "shortDescription",
          "description",
          "images",
          "price",
          "compareAtPrice",
          "stock",
          "sku",
          "variants",

          /* DELIVERY */
          "deliveryType",
          "deliveryCharge",

          "isFeatured",
          "createdAt",
        ].join(" ")
      )
      .populate(
        "category",
        "name slug"
      )
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .limit(4)
      .lean();

  const relatedProducts =
    relatedDocs.map(
      (item: any) =>
        normalizeProduct(item)
    );

  return {
    product,
    relatedProducts,
  };
}

/* =========================================================
   SEO METADATA
========================================================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } =
    await params;

  const data =
    await getProductData(slug);

  if (!data) {
    return {
      title:
        "Product Not Found",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { product } =
    data;

  const title =
    product.seo?.title ||
    `${product.name} | Premium Seeds`;

  const description =
    product.seo?.description ||
    product.overview ||
    `Shop ${product.name} from Seedra.`;

  const keywords =
    product.seo?.keywords ||
    [];

  const image =
    product.images[0];

  return {
    title,

    description,

    keywords,

    alternates: {
      canonical:
        `/shop/${product.slug}`,
    },

    openGraph: {
      title,

      description,

      type: "website",

      url:
        `/shop/${product.slug}`,

      images: image
        ? [
            {
              url: image,

              width: 1400,

              height: 1400,

              alt:
                product.name,
            },
          ]
        : [],
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,

      images: image
        ? [image]
        : [],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

/* =========================================================
   PAGE
========================================================= */

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const data =
    await getProductData(slug);

  if (!data) {
    notFound();
  }

  const {
    product,
    relatedProducts,
  } = data;

  /* =======================================================
     PRODUCT JSON-LD
  ======================================================= */

  const offers =
    product.variants.length > 0
      ? {
          "@type":
            "AggregateOffer",

          priceCurrency:
            "PKR",

          lowPrice:
            Math.min(
              ...product.variants.map(
                (variant) =>
                  variant.price
              )
            ),

          highPrice:
            Math.max(
              ...product.variants.map(
                (variant) =>
                  variant.price
              )
            ),

          offerCount:
            product.variants.length,

          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",

          url:
            `/shop/${product.slug}`,
        }
      : {
          "@type": "Offer",

          priceCurrency:
            "PKR",

          price:
            product.price,

          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",

          url:
            `/shop/${product.slug}`,
        };

  const productSchema: Record<
    string,
    any
  > = {
    "@context":
      "https://schema.org",

    "@type":
      "Product",

    name:
      product.name,

    description:
      product.overview,

    image:
      product.images,

    category:
      product.category,

    ...(product.sku
      ? {
          sku:
            product.sku,
        }
      : {}),

    offers,
  };

  /* =======================================================
     REVIEW SCHEMA
  ======================================================= */

  if (
    product.rating > 0 &&
    product.reviewCount > 0
  ) {
    productSchema.aggregateRating =
      {
        "@type":
          "AggregateRating",

        ratingValue:
          product.rating,

        reviewCount:
          product.reviewCount,

        bestRating: 5,

        worstRating: 1,
      };

    /*
     * Only published reviews reach here,
     * so these are safe to expose in JSON-LD.
     */
    if (
      product.reviews.length >
      0
    ) {
      productSchema.review =
        product.reviews.map(
          (review) => ({
            "@type":
              "Review",

            author: {
              "@type":
                "Person",

              name:
                review.name,
            },

            name:
              review.title,

            datePublished:
              review.date,

            reviewBody:
              review.text,

            reviewRating: {
              "@type":
                "Rating",

              ratingValue:
                review.rating,

              bestRating: 5,

              worstRating: 1,
            },
          })
        );
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              productSchema
            ),
        }}
      />

      <ProductDetailClient
        product={
          product
        }
        relatedProducts={
          relatedProducts
        }
      />

      <Footer />
    </>
  );
}

