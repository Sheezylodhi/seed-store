import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import {connectDB} from "@/lib/db";
import Review from "@/models/Review";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      productId,
      name,
      email,
      rating,
      title,
      comment,
    } = body;

    // -----------------------------
    // Basic validation
    // -----------------------------

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product.",
        },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your name.",
        },
        { status: 400 }
      );
    }

    if (
      !rating ||
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a rating between 1 and 5.",
        },
        { status: 400 }
      );
    }

    if (
      !comment ||
      typeof comment !== "string" ||
      comment.trim().length < 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please write a little more about your experience.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Normalize optional fields
    // -----------------------------

    const cleanName = name.trim();
    const cleanEmail =
      typeof email === "string" && email.trim()
        ? email.trim().toLowerCase()
        : undefined;

    const cleanTitle =
      typeof title === "string" && title.trim()
        ? title.trim()
        : undefined;

    const cleanComment = comment.trim();

    // -----------------------------
    // Create review
    // -----------------------------

    const review = await Review.create({
      product: new mongoose.Types.ObjectId(productId),

      // Guest reviews are allowed.
      // No customer/user is required.
      customer: undefined,

      name: cleanName,
      email: cleanEmail,

      rating,
      title: cleanTitle,
      comment: cleanComment,

      // IMPORTANT:
      // Review must be approved by admin before appearing.
      isApproved: false,
      isPublished: false,

      // Guest/unverified by default.
      isVerifiedPurchase: false,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you! Your review has been submitted and is awaiting approval.",
        reviewId: review._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/shop/reviews error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while submitting your review.",
      },
      { status: 500 }
    );
  }
}