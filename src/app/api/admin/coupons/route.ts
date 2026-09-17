import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "all";

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 10, 1),
      100
    );

    const query: any = {};

    if (search) {
      query.code = {
        $regex: search,
        $options: "i",
      };
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const filteredCoupons = coupons.filter((coupon: any) => {
      if (status === "all") return true;

      return getCouponState(coupon) === status;
    });

    const total = filteredCoupons.length;

    const startIndex = (page - 1) * limit;
    const paginatedCoupons = filteredCoupons.slice(
      startIndex,
      startIndex + limit
    );

    const now = new Date();

    const totalCoupons = coupons.length;

    const activeCoupons = coupons.filter(
      (coupon: any) =>
        coupon.isActive &&
        (!coupon.expiresAt ||
          new Date(coupon.expiresAt) > now) &&
        (!coupon.usageLimit ||
          coupon.usedCount < coupon.usageLimit)
    ).length;

    const expiredCoupons = coupons.filter(
      (coupon: any) =>
        coupon.expiresAt &&
        new Date(coupon.expiresAt) <= now
    ).length;

    const usedCoupons = coupons.filter(
      (coupon: any) => coupon.usedCount > 0
    ).length;

    const usedUpCoupons = coupons.filter(
      (coupon: any) =>
        coupon.usageLimit &&
        coupon.usedCount >= coupon.usageLimit
    ).length;

    return NextResponse.json({
      success: true,
      coupons: paginatedCoupons.map((coupon: any) => ({
        ...coupon,
        state: getCouponState(coupon),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        usedCoupons,
        usedUpCoupons,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/coupons error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch coupons",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();

    const code = String(body.code || "")
      .trim()
      .toUpperCase();

    const discountType = body.discountType;

    const discountValue = Number(body.discountValue);

    const minimumOrderAmount =
      body.minimumOrderAmount !== undefined &&
      body.minimumOrderAmount !== ""
        ? Number(body.minimumOrderAmount)
        : undefined;

    const maximumDiscountAmount =
      body.maximumDiscountAmount !== undefined &&
      body.maximumDiscountAmount !== ""
        ? Number(body.maximumDiscountAmount)
        : undefined;

    const usageLimit =
      body.usageLimit !== undefined &&
      body.usageLimit !== ""
        ? Number(body.usageLimit)
        : undefined;

    const expiresAt =
      body.expiresAt
        ? new Date(body.expiresAt)
        : undefined;

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon code is required",
        },
        { status: 400 }
      );
    }

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

    if (
      discountType !== "percentage" &&
      discountType !== "fixed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid discount type",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(discountValue) ||
      discountValue <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Discount value must be greater than 0",
        },
        { status: 400 }
      );
    }

    if (
      discountType === "percentage" &&
      discountValue > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Percentage discount cannot exceed 100%",
        },
        { status: 400 }
      );
    }

    if (
      minimumOrderAmount !== undefined &&
      (!Number.isFinite(minimumOrderAmount) ||
        minimumOrderAmount < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid minimum order amount",
        },
        { status: 400 }
      );
    }

    if (
      maximumDiscountAmount !== undefined &&
      (!Number.isFinite(maximumDiscountAmount) ||
        maximumDiscountAmount < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid maximum discount amount",
        },
        { status: 400 }
      );
    }

    if (
      usageLimit !== undefined &&
      (!Number.isFinite(usageLimit) ||
        usageLimit < 1)
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
      expiresAt &&
      Number.isNaN(expiresAt.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid expiry date",
        },
        { status: 400 }
      );
    }

    if (expiresAt && expiresAt <= new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Expiry date must be in the future",
        },
        { status: 400 }
      );
    }

    const existingCoupon = await Coupon.findOne({
      code,
    });

    if (existingCoupon) {
      return NextResponse.json(
        {
          success: false,
          message: "A coupon with this code already exists",
        },
        { status: 409 }
      );
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscountAmount,
      usageLimit,
      usedCount: 0,
      expiresAt,
      isActive:
        body.isActive !== undefined
          ? Boolean(body.isActive)
          : true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Coupon created successfully",
        coupon,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/admin/coupons error:", error);

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon code already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to create coupon",
      },
      { status: 500 }
    );
  }
}