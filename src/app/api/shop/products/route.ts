import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import "@/models/Category";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: true,
    })
      .select(
        "name slug category productType shortDescription description images price compareAtPrice stock sku variants deliveryType deliveryCharge isFeatured createdAt"
      )
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    if (!products.length) {
      return NextResponse.json({
        success: true,
        products: [],
      });
    }

    const productIds = products.map(
      (product) => product._id
    );

    const reviews = await Review.aggregate([
      {
        $match: {
          product: {
            $in: productIds,
          },
          isApproved: true,
          isPublished: true,
        },
      },
      {
        $group: {
          _id: "$product",
          averageRating: {
            $avg: "$rating",
          },
          reviewCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const reviewMap = new Map(
      reviews.map((review) => [
        review._id.toString(),
        {
          rating: Number(
            review.averageRating.toFixed(1)
          ),
          reviews: review.reviewCount,
        },
      ])
    );

    const formattedProducts = products.map(
      (product) => {
        const activeVariants = (
          product.variants || []
        )
          .filter(
            (variant: any) =>
              variant.isActive !== false
          )
          .map((variant: any) => ({
            id: variant._id?.toString(),
            packSize:
              variant.packSize || "",
            price: variant.price,
            compareAtPrice:
              variant.compareAtPrice,
            stock: variant.stock ?? 0,
            sku: variant.sku || "",
            isActive:
              variant.isActive !== false,
          }));

        const sortedVariants = [
          ...activeVariants,
        ].sort(
          (a, b) => a.price - b.price
        );

        const cheapestVariant =
          sortedVariants[0];

        const finalPrice =
          typeof product.price ===
          "number"
            ? product.price
            : cheapestVariant?.price ??
              0;

        const finalCompareAtPrice =
          typeof product.compareAtPrice ===
          "number"
            ? product.compareAtPrice
            : cheapestVariant?.compareAtPrice;

        const finalStock =
          typeof product.stock ===
          "number"
            ? product.stock
            : activeVariants.length
              ? activeVariants.reduce(
                  (
                    total: number,
                    variant: {
                      stock: number;
                    }
                  ) =>
                    total +
                    (variant.stock ||
                      0),
                  0
                )
              : 0;

        const reviewStats =
          reviewMap.get(
            product._id.toString()
          );

        const category =
          product.category &&
          typeof product.category ===
            "object" &&
          "name" in product.category &&
          "slug" in product.category
            ? {
                id:
                  "_id" in product.category
                    ? product.category._id?.toString()
                    : undefined,
                name:
                  product.category.name,
                slug:
                  product.category.slug,
              }
            : null;

        return {
          id: product._id.toString(),

          name: product.name,

          slug: product.slug,

          deliveryType:
            product.deliveryType ===
            "paid"
              ? "paid"
              : "free",

          deliveryCharge:
            product.deliveryType ===
            "paid"
              ? Number(
                  product.deliveryCharge
                ) || 0
              : 0,

          category,

          type: product.productType,

          description:
            product.shortDescription ||
            product.description ||
            "",

          price: finalPrice,

          oldPrice:
            finalCompareAtPrice,

          rating:
            reviewStats?.rating ?? 0,

          reviews:
            reviewStats?.reviews ?? 0,

          images:
            product.images || [],

          image:
            product.images?.[0] || "",

          stock: finalStock,

          variants:
            activeVariants,

          weights:
            activeVariants
              .map(
                (variant) =>
                  variant.packSize
              )
              .filter(Boolean),

          featured:
            Boolean(
              product.isFeatured
            ),

          createdAt:
            product.createdAt,
        };
      }
    );

    return NextResponse.json(
      {
        success: true,
        products:
          formattedProducts,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error(
      "SHOP PRODUCTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load shop products",
        products: [],
      },
      {
        status: 500,
      }
    );
  }
}