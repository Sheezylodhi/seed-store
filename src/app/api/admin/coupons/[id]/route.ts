import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import Coupon from "@/models/Coupon";

function getCouponState(coupon: any) {
  const now = new Date();

  if (!coupon.isActive) {
    return "inactive";
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) <= now) {
    return "expired";
  }

  if (
    coupon.usageLimit !== undefined &&
    coupon.usageLimit !== null &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    return "used";
  }

  return "active";
}

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coupon ID",
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findById(id).lean();

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: {
        ...coupon,
        state: getCouponState(coupon),
      },
    });
  } catch (error: any) {
    console.error("GET coupon error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch coupon",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coupon ID",
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (body.code !== undefined) {
      const code = String(body.code)
        .trim()
        .toUpperCase();

      if (!/^[A-Z0-9_-]+$/.test(code)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Coupon code can only contain letters, numbers, hyphens, and underscores",
          },
          { status: 400 }
        );
      }

      const duplicate = await Coupon.findOne({
        code,
        _id: { $ne: id },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "Another coupon already uses this code",
          },
          { status: 409 }
        );
      }

      coupon.code = code;
    }

    if (body.discountType !== undefined) {
      if (
        body.discountType !== "percentage" &&
        body.discountType !== "fixed"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid discount type",
          },
          { status: 400 }
        );
      }

      coupon.discountType = body.discountType;
    }

    if (body.discountValue !== undefined) {
      const value = Number(body.discountValue);

      if (!Number.isFinite(value) || value <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Discount value must be greater than 0",
          },
          { status: 400 }
        );
      }

      coupon.discountValue = value;
    }

    if (
      coupon.discountType === "percentage" &&
      coupon.discountValue > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Percentage discount cannot exceed 100%",
        },
        { status: 400 }
      );
    }

    if (body.minimumOrderAmount !== undefined) {
      const value =
        body.minimumOrderAmount === ""
          ? undefined
          : Number(body.minimumOrderAmount);

      if (
        value !== undefined &&
        (!Number.isFinite(value) || value < 0)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid minimum order amount",
          },
          { status: 400 }
        );
      }

      coupon.minimumOrderAmount = value;
    }

    if (body.maximumDiscountAmount !== undefined) {
      const value =
        body.maximumDiscountAmount === ""
          ? undefined
          : Number(body.maximumDiscountAmount);

      if (
        value !== undefined &&
        (!Number.isFinite(value) || value < 0)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid maximum discount amount",
          },
          { status: 400 }
        );
      }

      coupon.maximumDiscountAmount = value;
    }

    if (body.usageLimit !== undefined) {
      const value =
        body.usageLimit === ""
          ? undefined
          : Number(body.usageLimit);

      if (
        value !== undefined &&
        (!Number.isFinite(value) || value < 1)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Usage limit must be at least 1",
          },
          { status: 400 }
        );
      }

      if (
        value !== undefined &&
        value < coupon.usedCount
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Usage limit cannot be lower than the number of coupons already used",
          },
          { status: 400 }
        );
      }

      coupon.usageLimit = value;
    }

    if (body.expiresAt !== undefined) {
      const value =
        body.expiresAt === ""
          ? undefined
          : new Date(body.expiresAt);

      if (
        value !== undefined &&
        Number.isNaN(value.getTime())
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid expiry date",
          },
          { status: 400 }
        );
      }

      coupon.expiresAt = value;
    }

    if (body.isActive !== undefined) {
      coupon.isActive = Boolean(body.isActive);
    }

    // usedCount is intentionally NOT editable from admin.
    // It should increase only when an order successfully uses the coupon.

    await coupon.save();

    return NextResponse.json({
      success: true,
      message: "Coupon updated successfully",
      coupon: {
        ...coupon.toObject(),
        state: getCouponState(coupon),
      },
    });
  } catch (error: any) {
    console.error("PATCH coupon error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to update coupon",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid coupon ID",
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon not found",
        },
        { status: 404 }
      );
    }

    await Coupon.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE coupon error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to delete coupon",
      },
      { status: 500 }
    );
  }
}