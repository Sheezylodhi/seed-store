import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import Review from "@/models/Review";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const rating = searchParams.get("rating") || "all";
    const approval = searchParams.get("approval") || "all";
    const publication = searchParams.get("publication") || "all";
    const verified = searchParams.get("verified") || "all";
    const productId = searchParams.get("productId") || "all";

    const page = Math.max(
      Number(searchParams.get("page") || "1"),
      1
    );

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") || "10"), 1),
      100
    );

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (search) {
      const regex = new RegExp(search, "i");

      const matchingProducts = await Product.find({
        $or: [
          { name: regex },
          { slug: regex },
        ],
      })
        .select("_id")
        .lean();

      const productIds = matchingProducts.map(
        (product) => product._id
      );

      filter.$or = [
        { name: regex },
        { email: regex },
        { title: regex },
        { comment: regex },
        ...(productIds.length > 0
          ? [{ product: { $in: productIds } }]
          : []),
      ];
    }

    if (rating !== "all") {
      const ratingNumber = Number(rating);

      if (
        Number.isInteger(ratingNumber) &&
        ratingNumber >= 1 &&
        ratingNumber <= 5
      ) {
        filter.rating = ratingNumber;
      }
    }

    if (approval === "approved") {
      filter.isApproved = true;
    }

    if (approval === "pending") {
      filter.isApproved = false;
    }

    if (publication === "published") {
      filter.isPublished = true;
    }

    if (publication === "unpublished") {
      filter.isPublished = false;
    }

    if (verified === "verified") {
      filter.isVerifiedPurchase = true;
    }

    if (verified === "unverified") {
      filter.isVerifiedPurchase = false;
    }

    if (productId !== "all") {
      filter.product = productId;
    }

    const [
      reviews,
      totalReviews,
      pendingReviews,
      publishedReviews,
      verifiedReviews,
      ratingStats,
      productStats,
    ] = await Promise.all([
      Review.find(filter)
        .populate({
          path: "product",
          select: "name slug images price",
        })
        .populate({
          path: "customer",
          select: "name email phone",
        })
        .populate({
          path: "adminReply.repliedBy",
          select: "name email",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Review.countDocuments(filter),

      Review.countDocuments({
        ...filter,
        isApproved: false,
      }),

      Review.countDocuments({
        ...filter,
        isPublished: true,
      }),

      Review.countDocuments({
        ...filter,
        isVerifiedPurchase: true,
      }),

      Review.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: null,
            averageRating: {
              $avg: "$rating",
            },
            total: {
              $sum: 1,
            },
            fiveStar: {
              $sum: {
                $cond: [{ $eq: ["$rating", 5] }, 1, 0],
              },
            },
            fourStar: {
              $sum: {
                $cond: [{ $eq: ["$rating", 4] }, 1, 0],
              },
            },
            threeStar: {
              $sum: {
                $cond: [{ $eq: ["$rating", 3] }, 1, 0],
              },
            },
            twoStar: {
              $sum: {
                $cond: [{ $eq: ["$rating", 2] }, 1, 0],
              },
            },
            oneStar: {
              $sum: {
                $cond: [{ $eq: ["$rating", 1] }, 1, 0],
              },
            },
          },
        },
      ]),

      Review.aggregate([
        {
          $group: {
            _id: "$product",
            totalReviews: {
              $sum: 1,
            },
            averageRating: {
              $avg: "$rating",
            },
            publishedReviews: {
              $sum: {
                $cond: ["$isPublished", 1, 0],
              },
            },
            pendingReviews: {
              $sum: {
                $cond: [
                  { $eq: ["$isApproved", false] },
                  1,
                  0,
                ],
              },
            },
            verifiedReviews: {
              $sum: {
                $cond: ["$isVerifiedPurchase", 1, 0],
              },
            },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            totalReviews: 1,
            averageRating: 1,
            publishedReviews: 1,
            pendingReviews: 1,
            verifiedReviews: 1,
            product: {
              _id: "$product._id",
              name: "$product.name",
              slug: "$product.slug",
            },
          },
        },
        {
          $sort: {
            totalReviews: -1,
          },
        },
      ]),
    ]);

    const stats = ratingStats[0] || {
      averageRating: 0,
      total: 0,
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
    };

    const [
      allReviewsCount,
      allPendingCount,
      allPublishedCount,
      allVerifiedCount,
    ] = await Promise.all([
      Review.countDocuments({}),
      Review.countDocuments({ isApproved: false }),
      Review.countDocuments({ isPublished: true }),
      Review.countDocuments({ isVerifiedPurchase: true }),
    ]);

    return NextResponse.json({
      success: true,

      data: {
        reviews,

        pagination: {
          page,
          limit,
          total: totalReviews,
          totalPages: Math.ceil(totalReviews / limit),
        },

        stats: {
          totalReviews: allReviewsCount,
          pendingReviews: allPendingCount,
          publishedReviews: allPublishedCount,
          verifiedReviews: allVerifiedCount,
          averageRating: Number(
            stats.averageRating || 0
          ).toFixed(1),

          ratingBreakdown: {
            fiveStar: stats.fiveStar || 0,
            fourStar: stats.fourStar || 0,
            threeStar: stats.threeStar || 0,
            twoStar: stats.twoStar || 0,
            oneStar: stats.oneStar || 0,
          },
        },

        productStats,
      },
    });
  } catch (error) {
    console.error("Admin reviews GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load reviews",
      },
      {
        status: 500,
      }
    );
  }
}