import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to view your reviews.",
        },
        { status: 401 }
      );
    }

    const reviews = await Review.find({
      customer: user.id,
    })
      .populate("product", "name slug images")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,

      reviews: reviews.map((review: any) => ({
        id: review._id.toString(),

        product: review.product
          ? {
              id: review.product._id.toString(),
              name: review.product.name,
              slug: review.product.slug,
              image:
                review.product.images?.[0] || "",
            }
          : null,

        name: review.name,
        rating: review.rating,
        title: review.title || "",
        comment: review.comment,

        isApproved: Boolean(review.isApproved),

        isPublished: Boolean(review.isPublished),

        isVerifiedPurchase: Boolean(
          review.isVerifiedPurchase
        ),

        adminReply: review.adminReply
          ? {
              message: review.adminReply.message,
              repliedAt: review.adminReply.repliedAt,
            }
          : null,

        createdAt: review.createdAt,
      })),
    });
  } catch (error) {
    console.error("ACCOUNT REVIEWS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load reviews.",
      },
      { status: 500 }
    );
  }
}