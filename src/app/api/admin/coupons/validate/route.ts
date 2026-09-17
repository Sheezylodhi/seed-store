import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body = await request.json();

    const code = String(body.code || "")
      .trim()
      .toUpperCase();

    const subtotal = Number(body.subtotal);

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a coupon code",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(subtotal) ||
      subtotal <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order subtotal",
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({
      code,
      isActive: true,
    }).lean();

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or inactive coupon",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    if (
      coupon.expiresAt &&
      new Date(coupon.expiresAt) <= now
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "This coupon has expired",
        },
        { status: 400 }
      );
    }

    if (
      coupon.usageLimit !== undefined &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This coupon has reached its usage limit",
        },
        { status: 400 }
      );
    }

    if (
      coupon.minimumOrderAmount !== undefined &&
      subtotal < coupon.minimumOrderAmount
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order amount is ₨${coupon.minimumOrderAmount.toLocaleString()}`,
        },
        { status: 400 }
      );
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount =
        (subtotal * coupon.discountValue) /
        100;

      if (
        coupon.maximumDiscountAmount !==
          undefined &&
        discount >
          coupon.maximumDiscountAmount
      ) {
        discount =
          coupon.maximumDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(
      discount,
      subtotal
    );

    const finalTotal = Math.max(
      subtotal - discount,
      0
    );

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discount,
      subtotal,
      total: finalTotal,
    });
  } catch (error: any) {
    console.error(
      "POST /api/coupons/validate error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to validate coupon",
      },
      { status: 500 }
    );
  }
}