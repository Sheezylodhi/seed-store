import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

function hashGuestToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ orderNumber: string }>;
  }
) {
  try {
    await connectDB();

    const { orderNumber } = await params;

    const token = request.nextUrl.searchParams.get("token");

    if (!orderNumber || !token) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order tracking link.",
        },
        { status: 400 }
      );
    }

    const tokenHash = hashGuestToken(token);

    const order = await Order.findOne({
      orderNumber,
      guestAccessTokenHash: tokenHash,
      guestAccessTokenExpiresAt: {
        $gt: new Date(),
      },
    })
      .select(
        "+guestAccessTokenHash +guestAccessTokenExpiresAt"
      )
      .lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This order tracking link is invalid or has expired.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,

      order: {
        id: order._id.toString(),

        orderNumber: order.orderNumber,

        customerInfo: order.customerInfo,

        shippingAddress: order.shippingAddress,

        billingAddress: order.billingAddress,

        billingAddressSameAsShipping:
          order.billingAddressSameAsShipping,

        items: (order.items || []).map((item: any) => ({
          id: item._id?.toString(),

          product: item.product?.toString(),

          variantId: item.variantId?.toString(),

          name: item.name,

          packSize: item.packSize,

          sku: item.sku,

          price: item.price,

          quantity: item.quantity,

          image: item.image,
        })),

        subtotal: order.subtotal,

        discount: order.discount,

        deliveryCharge: order.deliveryCharge,

        total: order.total,

        coupon: order.coupon
          ? {
              code: order.coupon.code,
              discount: order.coupon.discount,
            }
          : undefined,

        paymentMethod: order.paymentMethod,

        paymentStatus: order.paymentStatus,

        /**
         * Customer-safe payment information only.
         *
         * Screenshot URL/public ID and admin information
         * are deliberately NOT exposed here.
         */
        payment: order.payment
          ? {
              transactionId:
                order.payment.transactionId,

              gateway: order.payment.gateway,

              referenceNumber:
                order.payment.referenceNumber,

              paidAt: order.payment.paidAt,
            }
          : undefined,

        orderStatus: order.orderStatus,

        shipping: order.shipping
          ? {
              courier: order.shipping.courier,

              trackingNumber:
                order.shipping.trackingNumber,

              estimatedDeliveryDate:
                order.shipping.estimatedDeliveryDate,

              shippedAt: order.shipping.shippedAt,

              deliveredAt: order.shipping.deliveredAt,
            }
          : undefined,

        trackingHistory: (
          order.trackingHistory || []
        ).map((tracking: any) => ({
          status: tracking.status,

          note: tracking.note,

          location: tracking.location,

          createdAt: tracking.createdAt,
        })),

        notes: order.notes,

        cancellation: order.cancellation
          ? {
              reason: order.cancellation.reason,

              cancelledAt:
                order.cancellation.cancelledAt,
            }
          : undefined,

        createdAt: order.createdAt,

        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "GUEST ORDER LOOKUP ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load your order.",
      },
      { status: 500 }
    );
  }
}