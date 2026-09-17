
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import User from "@/models/User";
import Order from "@/models/Order";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const ACTIVE_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
];

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;

    /* =====================================================
       VALIDATE CUSTOMER ID
    ===================================================== */

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid customer ID",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       GET CUSTOMER
    ===================================================== */

    const customer = await User.findOne({
      _id: id,
      role: "customer",
    })
      .select(
        "name email phone role isActive createdAt updatedAt"
      )
      .lean();

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       CUSTOMER EMAIL
       
       We use email as a fallback because some existing
       orders may not have the customer ObjectId saved.
    ===================================================== */

    const customerEmail = String(
      customer.email || ""
    )
      .trim()
      .toLowerCase();

    /* =====================================================
       GET ALL CUSTOMER ORDERS
       
       MATCH BY:

       1. customer ObjectId
       OR
       2. customerInfo.email

       This makes both old and new orders work.
    ===================================================== */

    const orderConditions: Record<string, unknown>[] = [
      {
        customer: customer._id,
      },
    ];

    if (customerEmail) {
      orderConditions.push({
        "customerInfo.email": customerEmail,
      });
    }

    const orders = await Order.find({
      $or: orderConditions,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    /* =====================================================
       ORDER STATS
    ===================================================== */

    const totalOrders = orders.length;

    const deliveredOrders = orders.filter(
      (order) =>
        order.orderStatus === "delivered"
    ).length;

    const pendingOrders = orders.filter(
      (order) =>
        ACTIVE_ORDER_STATUSES.includes(
          order.orderStatus
        )
    ).length;

    const shippedOrders = orders.filter(
      (order) =>
        [
          "shipped",
          "out_for_delivery",
        ].includes(order.orderStatus)
    ).length;

    const cancelledOrders = orders.filter(
      (order) =>
        order.orderStatus === "cancelled"
    ).length;

    /* =====================================================
       TOTAL SPENT
       
       Cancelled orders are NOT counted.
    ===================================================== */

    const totalSpent = orders.reduce(
      (sum, order) => {
        if (
          order.orderStatus === "cancelled"
        ) {
          return sum;
        }

        return (
          sum +
          Number(order.total || 0)
        );
      },
      0
    );

    /* =====================================================
       VALID ORDERS FOR AVERAGE

       Cancelled orders excluded.
    ===================================================== */

    const paidOrValidOrders =
      orders.filter(
        (order) =>
          order.orderStatus !==
          "cancelled"
      ).length;

    const averageOrderValue =
      paidOrValidOrders > 0
        ? totalSpent /
          paidOrValidOrders
        : 0;

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        data: {
          customer,

          stats: {
            totalOrders,
            totalSpent,
            deliveredOrders,
            pendingOrders,
            shippedOrders,
            cancelledOrders,
            averageOrderValue,
          },

          orders,
        },
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Admin customer detail GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load customer",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   UPDATE CUSTOMER
========================================================= */

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;

    /* =====================================================
       VALIDATE ID
    ===================================================== */

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid customer ID",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       REQUEST BODY
    ===================================================== */

    const body = await request.json();

    const updateData: Record<
      string,
      unknown
    > = {};

    /* =====================================================
       NAME
    ===================================================== */

    if (
      typeof body.name === "string"
    ) {
      const cleanName =
        body.name.trim();

      if (cleanName) {
        updateData.name =
          cleanName;
      }
    }

    /* =====================================================
       PHONE
    ===================================================== */

    if (
      typeof body.phone === "string"
    ) {
      updateData.phone =
        body.phone.trim();
    }

    /* =====================================================
       ACTIVE STATUS
    ===================================================== */

    if (
      typeof body.isActive ===
      "boolean"
    ) {
      updateData.isActive =
        body.isActive;
    }

    /* =====================================================
       UPDATE CUSTOMER
    ===================================================== */

    const customer =
      await User.findOneAndUpdate(
        {
          _id: id,
          role: "customer",
        },
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .select(
          "name email phone role isActive createdAt updatedAt"
        )
        .lean();

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Customer updated successfully",

      data: customer,
    });
  } catch (error) {
    console.error(
      "Admin customer PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update customer",
      },
      {
        status: 500,
      }
    );
  }
}

