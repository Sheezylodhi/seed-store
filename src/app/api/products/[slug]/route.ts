import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    const { slug } = await context.params;

    await connectDB();

    const product = await Product.findOne({
      slug,
      isActive: true,
    })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================================================
       REVIEWS
    ========================================================= */

    const reviewStats = await Review.aggregate([
      {
        $match: {
          product: product._id,
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

    const stats = reviewStats[0] || {
      averageRating: 0,
      reviewCount: 0,
    };

    /* =========================================================
       REVIEWS LIST
    ========================================================= */

    const reviews = await Review.find({
      product: product._id,
      isApproved: true,
      isPublished: true,
    })
      .select(
        "name rating title comment isVerifiedPurchase createdAt"
      )
      .sort({
        createdAt: -1,
      })
      .limit(20)
      .lean();

    /* =========================================================
       RELATED PRODUCTS
    ========================================================= */

    const relatedProducts = await Product.find({
      _id: {
        $ne: product._id,
      },
      category: product.category,
      isActive: true,
    })
      .select(
        "name slug productType shortDescription images price compareAtPrice stock variants isFeatured"
      )
      .limit(8)
      .lean();

    /* =========================================================
       FALLBACK RELATED PRODUCTS
       If same category doesn't have enough products
    ========================================================= */

    let finalRelatedProducts = relatedProducts;

    if (relatedProducts.length < 4) {
      const existingIds = [
        product._id,
        ...relatedProducts.map((item) => item._id),
      ];

      const fallbackProducts = await Product.find({
        _id: {
          $nin: existingIds,
        },
        isActive: true,
      })
        .select(
          "name slug productType shortDescription images price compareAtPrice stock variants isFeatured"
        )
        .sort({
          createdAt: -1,
        })
        .limit(8 - relatedProducts.length)
        .lean();

      finalRelatedProducts = [
        ...relatedProducts,
        ...fallbackProducts,
      ];
    }

    /* =========================================================
       RESPONSE
    ========================================================= */

    return NextResponse.json({
      success: true,

      product: {
        ...product,

        category:
          product.category &&
          typeof product.category === "object" &&
          "name" in product.category &&
          "slug" in product.category
            ? {
                _id: product.category._id,
                name: product.category.name,
                slug: product.category.slug,
              }
            : null,

        rating: Number(
          Number(stats.averageRating || 0).toFixed(1)
        ),

        reviewCount: stats.reviewCount || 0,

        reviews: reviews.map((review) => ({
          id: review._id.toString(),
          name: review.name,
          rating: review.rating,
          title: review.title || "",
          text: review.comment,
          verifiedPurchase:
            review.isVerifiedPurchase,
          date: review.createdAt,
        })),
      },

      relatedProducts: finalRelatedProducts,
    });
  } catch (error) {
    console.error(
      "GET /api/products/[slug] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      {
        status: 500,
      }
    );
  }
}