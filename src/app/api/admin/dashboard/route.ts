import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Review from "@/models/Review";
import ContactMessage from "@/models/ContactMessage";

export async function GET() {
  try {
    await requireAdmin();

    await connectDB();

    const [
      totalProducts,
      totalCustomers,
      totalOrders,
      pendingOrders,
      pendingReviews,
      unreadMessages,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments({
        isActive: true,
      }),

      User.countDocuments({
        role: "customer",
        isActive: true,
      }),

      Order.countDocuments(),

      Order.countDocuments({
        orderStatus: "pending",
      }),

      Review.countDocuments({
        isApproved: false,
      }),

      ContactMessage.countDocuments({
        status: "new",
      }),

      Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .select(
          "orderNumber customerInfo total orderStatus paymentStatus createdAt"
        )
        .lean(),
    ]);

    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $nin: ["cancelled"],
          },
          paymentStatus: {
            $in: ["paid"],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$total",
          },
        },
      },
    ]);

    const revenue =
      revenueResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalCustomers,
          totalOrders,
          pendingOrders,
          pendingReviews,
          unreadMessages,
          revenue,
        },

        recentOrders,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN_DASHBOARD_ERROR:",
      error
    );

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load dashboard.",
      },
      { status: 500 }
    );
  }
}