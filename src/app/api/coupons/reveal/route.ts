import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

function calculateDiscount(
  coupon: any,
  subtotal: number
) {
  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount =
      (subtotal * coupon.discountValue) / 100;

    if (
      coupon.maximumDiscountAmount !== undefined &&
      coupon.maximumDiscountAmount !== null
    ) {
      discount = Math.min(
        discount,
        coupon.maximumDiscountAmount
      );
    }
  }

  if (coupon.discountType === "fixed") {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, subtotal);

  return Math.max(Math.round(discount), 0);
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const subtotal = Number(body.subtotal);

    if (
      !Number.isFinite(subtotal) ||
      subtotal < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid cart subtotal",
        },
        { status: 400 }
      );
    }

    /**
     * Coupons already successfully used
     * in this browser.
     *
     * This is only a UX restriction.
     * The database usageLimit/usedCount
     * remains the real authority.
     */
    const usedCouponCodes = Array.isArray(
      body.usedCouponCodes
    )
      ? body.usedCouponCodes
          .map((code: unknown) =>
            String(code).trim().toUpperCase()
          )
          .filter(Boolean)
      : [];

    const now = new Date();

    const query: any = {
      isActive: true,

      $and: [
        {
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: now } },
          ],
        },

        {
          $or: [
            { usageLimit: { $exists: false } },
            { usageLimit: null },
            {
              $expr: {
                $lt: ["$usedCount", "$usageLimit"],
              },
            },
          ],
        },

        {
          $or: [
            {
              minimumOrderAmount: {
                $exists: false,
              },
            },
            {
              minimumOrderAmount: null,
            },
            {
              minimumOrderAmount: {
                $lte: subtotal,
              },
            },
          ],
        },
      ],
    };

    /**
     * Don't reveal a coupon that this browser
     * has already successfully used.
     */
    if (usedCouponCodes.length > 0) {
      query.code = {
        $nin: usedCouponCodes,
      };
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .lean();

    if (!coupons.length) {
      return NextResponse.json({
        success: true,
        coupon: null,
        message: "No coupon available for this cart",
      });
    }

    const eligibleCoupons = coupons
      .map((coupon: any) => {
        const discountAmount =
          calculateDiscount(
            coupon,
            subtotal
          );

        return {
          id: String(coupon._id),
          code: coupon.code,
          discountType:
            coupon.discountType,
          discountValue:
            coupon.discountValue,
          minimumOrderAmount:
            coupon.minimumOrderAmount,
          maximumDiscountAmount:
            coupon.maximumDiscountAmount,
          discountAmount,
          createdAt: coupon.createdAt,
        };
      })
      .filter(
        (coupon) =>
          coupon.discountAmount > 0
      )
      .sort((a, b) => {
        if (
          b.discountAmount !==
          a.discountAmount
        ) {
          return (
            b.discountAmount -
            a.discountAmount
          );
        }

        return (
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
        );
      });

    const bestCoupon =
      eligibleCoupons[0];

    if (!bestCoupon) {
      return NextResponse.json({
        success: true,
        coupon: null,
        message:
          "No coupon available for this cart",
      });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: bestCoupon.id,
        code: bestCoupon.code,
        discountType:
          bestCoupon.discountType,
        discountValue:
          bestCoupon.discountValue,
        minimumOrderAmount:
          bestCoupon.minimumOrderAmount,
        maximumDiscountAmount:
          bestCoupon.maximumDiscountAmount,
        discountAmount:
          bestCoupon.discountAmount,
      },
    });
  } catch (error: any) {
    console.error(
      "POST /api/coupons/reveal error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to reveal coupon",
      },
      { status: 500 }
    );
  }
}