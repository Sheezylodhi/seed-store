import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";

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

    // Get currently logged-in user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to view this order.",
        },
        { status: 401 }
      );
    }

    const { orderNumber } = await params;

    /*
      Find the order belonging to the logged-in customer.

      We check both:
      1. customer ObjectId
      2. customer email

      This also supports older orders where the
      customer ObjectId may not have been saved.
    */
    const order = await Order.findOne({
      orderNumber,
      $or: [
        {
          customer: user.id,
        },
        {
          "customerInfo.email": user.email.toLowerCase(),
        },
      ],
    }).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,

      order: {
        id: order._id.toString(),

        orderNumber: order.orderNumber,

        /*
          Customer
        */
        customerInfo: order.customerInfo,

        /*
          Shipping address
        */
        shippingAddress: order.shippingAddress,

        /*
          Billing address
        */
        billingAddress: order.billingAddress,

        billingAddressSameAsShipping:
          order.billingAddressSameAsShipping,

        /*
          Products
        */
        items: (order.items || []).map(
          (item: any) => ({
            id: item._id?.toString(),

            product:
              item.product?.toString(),

            variantId:
              item.variantId?.toString(),

            name: item.name,

            packSize: item.packSize,

            sku: item.sku,

            price: item.price,

            quantity: item.quantity,

            image: item.image,
          })
        ),

        /*
          Pricing
        */
        subtotal: order.subtotal,

        discount: order.discount,

        deliveryCharge:
          order.deliveryCharge,

        total: order.total,

        /*
          Coupon
        */
        coupon: order.coupon
          ? {
              code: order.coupon.code,
              discount: order.coupon.discount,
            }
          : undefined,

        /*
          Payment
        */
        paymentMethod:
          order.paymentMethod,

        paymentStatus:
          order.paymentStatus,

        /*
          Payment details

          Only expose customer-safe information.
        */
        payment: order.payment
          ? {
              transactionId:
                order.payment.transactionId,

              gateway:
                order.payment.gateway,

              referenceNumber:
                order.payment.referenceNumber,

              paidAt:
                order.payment.paidAt,

              failureReason:
                order.payment.failureReason,
            }
          : undefined,

        /*
          Main order status
        */
        orderStatus:
          order.orderStatus,

        /*
          Shipping / courier
        */
        shipping: order.shipping
          ? {
              courier:
                order.shipping.courier,

              trackingNumber:
                order.shipping.trackingNumber,

              estimatedDeliveryDate:
                order.shipping
                  .estimatedDeliveryDate,

              shippedAt:
                order.shipping.shippedAt,

              deliveredAt:
                order.shipping.deliveredAt,
            }
          : undefined,

        /*
          Tracking history
        */
        trackingHistory: (
          order.trackingHistory || []
        ).map((tracking: any) => ({
          status: tracking.status,

          note: tracking.note,

          location:
            tracking.location,

          createdAt:
            tracking.createdAt,
        })),

        /*
          Customer note
        */
        notes: order.notes,

        /*
          Cancellation
        */
        cancellation: order.cancellation
          ? {
              reason:
                order.cancellation.reason,

              cancelledAt:
                order.cancellation
                  .cancelledAt,
            }
          : undefined,

        /*
          Timestamps
        */
        createdAt: order.createdAt,

        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "SINGLE ACCOUNT ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load order.",
      },
      { status: 500 }
    );
  }
}