import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import Review from "@/models/Review";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        {
          status: 400,
        }
      );
    }

    const review = await Review.findById(id)
      .populate({
        path: "product",
        select: "name slug images price sku",
      })
      .populate({
        path: "customer",
        select: "name email phone",
      })
      .populate({
        path: "adminReply.repliedBy",
        select: "name email",
      })
      .lean();

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Admin review GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load review",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const admin = await requireAdmin();
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
        },
        {
          status: 404,
        }
      );
    }

    if (typeof body.isApproved === "boolean") {
      review.isApproved = body.isApproved;

      if (!body.isApproved) {
        review.isPublished = false;
      }
    }

    if (typeof body.isPublished === "boolean") {
      if (body.isPublished && !review.isApproved) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A review must be approved before it can be published.",
          },
          {
            status: 400,
          }
        );
      }

      review.isPublished = body.isPublished;
    }

    if (
      typeof body.rating === "number" &&
      body.rating >= 1 &&
      body.rating <= 5
    ) {
      review.rating = body.rating;
    }

    if (typeof body.title === "string") {
      review.title = body.title.trim();
    }

    if (typeof body.comment === "string") {
      review.comment = body.comment.trim();
    }

    if (typeof body.name === "string") {
      review.name = body.name.trim();
    }

    if (typeof body.email === "string") {
      review.email = body.email.trim().toLowerCase();
    }

    if (typeof body.isVerifiedPurchase === "boolean") {
      review.isVerifiedPurchase =
        body.isVerifiedPurchase;
    }

   if (typeof body.adminReply === "string") {
  const reply = body.adminReply.trim();

  if (reply) {
    review.adminReply = {
      message: reply,
      repliedBy: admin?.id
        ? new mongoose.Types.ObjectId(admin.id)
        : undefined,
      repliedAt: new Date(),
    };
  } else {
    review.adminReply = undefined;
  }
}

    await review.save();

    const updatedReview = await Review.findById(id)
      .populate({
        path: "product",
        select: "name slug images price sku",
      })
      .populate({
        path: "customer",
        select: "name email phone",
      })
      .populate({
        path: "adminReply.repliedBy",
        select: "name email",
      })
      .lean();

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Admin review PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update review",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review ID",
        },
        {
          status: 400,
        }
      );
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Admin review DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete review",
      },
      {
        status: 500,
      }
    );
  }
}