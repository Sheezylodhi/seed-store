import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Order from "@/models/Order";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
];

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } =
      await context.params;

    const order =
      await Order.findById(
        id
      ).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error: any) {
    console.error(
      "Admin order GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to fetch order",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const admin =
      await requireAdmin();

    await connectDB();

    const { id } =
      await context.params;

    const body =
      await request.json();

    const order =
      await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order not found",
        },
        { status: 404 }
      );
    }

    const oldOrderStatus =
      order.orderStatus;

    /*
     * -------------------------
     * VALIDATE ORDER STATUS
     * -------------------------
     */

    if (
      body.orderStatus !==
        undefined &&
      !ORDER_STATUSES.includes(
        body.orderStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid order status",
        },
        { status: 400 }
      );
    }

    /*
     * -------------------------
     * VALIDATE PAYMENT STATUS
     * -------------------------
     */

    if (
      body.paymentStatus !==
        undefined &&
      !PAYMENT_STATUSES.includes(
        body.paymentStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid payment status",
        },
        { status: 400 }
      );
    }

    /*
     * -------------------------
     * ORDER STATUS
     * -------------------------
     */

    if (
      body.orderStatus !==
      undefined
    ) {
      order.orderStatus =
        body.orderStatus;
    }

    /*
     * -------------------------
     * PAYMENT STATUS
     * -------------------------
     */

    if (
      body.paymentStatus !==
      undefined
    ) {
      order.paymentStatus =
        body.paymentStatus;
    }

    /*
     * -------------------------
     * ADMIN NOTES
     * -------------------------
     */

    if (
      body.adminNotes !==
      undefined
    ) {
      order.adminNotes =
        body.adminNotes;
    }

    /*
     * -------------------------
     * CUSTOMER NOTES
     * -------------------------
     *
     * Only keep this if your
     * Order model contains
     * customerNotes.
     */

    if (
      body.customerNotes !==
      undefined &&
      "customerNotes" in
        (order as any)
    ) {
      (order as any)
        .customerNotes =
        body.customerNotes;
    }

    /*
     * -------------------------
     * SHIPPING
     * -------------------------

/*
 * -------------------------
 * SHIPPING
 * -------------------------
 */

if (
  body.shipping !==
  undefined
) {
  order.shipping = {
    ...(order.shipping || {}),
    ...body.shipping,
  };
}

/*
 * -------------------------
 * PAYMENT DETAILS
 * -------------------------
 */

if (
  body.payment !==
  undefined
) {
  order.payment = {
    ...(order.payment || {}),
    ...body.payment,
  };
}



    /*
     * -------------------------
     * PAYMENT VERIFIED
     * -------------------------
     */

    if (
      body.paymentStatus ===
      "paid"
    ) {
      if (!order.payment) {
        order.payment = {};
      }

      order.payment.paidAt =
        order.payment.paidAt ||
        new Date();

      /*
       * requireAdmin() may return
       * the admin user depending
       * on your auth implementation.
       */
      if (
        admin &&
        typeof admin ===
          "object" &&
        "_id" in admin
      ) {
        order.payment.verifiedBy =
          (admin as any)._id;
      }
    }

    /*
     * -------------------------
     * PAYMENT REJECTED
     * -------------------------
     */

    if (
      body.paymentStatus ===
      "failed"
    ) {
      if (!order.payment) {
        order.payment = {};
      }

      order.payment.failureReason =
        body.failureReason ||
        order.payment
          .failureReason ||
        "Payment proof could not be verified.";
    }

    /*
     * -------------------------
     * ORDER TRACKING
     * -------------------------
     */

    if (
      body.orderStatus &&
      body.orderStatus !==
        oldOrderStatus
    ) {
      if (
        !order.trackingHistory
      ) {
        order.trackingHistory =
          [];
      }

      order.trackingHistory.push({
        status:
          body.orderStatus,

        note:
          body.trackingNote ||
          `Order status changed from ${oldOrderStatus} to ${body.orderStatus}`,

        location:
          body.location ||
          undefined,

        createdAt:
          new Date(),
      });

      /*
       * SHIPPED
       */

      if (
        body.orderStatus ===
        "shipped"
      ) {
        if (!order.shipping) {
          order.shipping = {};
        }

        order.shipping.shippedAt =
          new Date();
      }

      /*
       * DELIVERED
       */

      if (
        body.orderStatus ===
        "delivered"
      ) {
        if (!order.shipping) {
          order.shipping = {};
        }

        order.shipping.deliveredAt =
          new Date();
      }
    }

    /*
     * -------------------------
     * CANCELLATION
     * -------------------------
     */

    if (
      body.orderStatus ===
      "cancelled"
    ) {
      order.cancellation = {
        reason:
          body.cancellationReason ||
          order.cancellation
            ?.reason ||
          "Cancelled by admin",

        cancelledAt:
          new Date(),

        cancelledBy:
          order.cancellation
            ?.cancelledBy,
      };
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message:
        "Order updated successfully",
      data: {
        order,
      },
    });
  } catch (error: any) {
    console.error(
      "Admin order PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to update order",
      },
      { status: 500 }
    );
  }
}