import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    // Get currently logged-in customer
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to view your orders.",
        },
        { status: 401 }
      );
    }

    /*
      We match orders using:

      1. customer ID
      2. OR customer's email

      This also helps if some older orders were created
      without the customer ObjectId but contain the email.
    */
    const orders = await Order.find({
      $or: [
        {
          customer: user.id,
        },
        {
          "customerInfo.email": user.email.toLowerCase(),
        },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,

      customer: {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },

      orders: orders.map((order: any) => ({
        id: order._id.toString(),

        orderNumber: order.orderNumber,

        customerInfo: {
          firstName: order.customerInfo?.firstName,
          lastName: order.customerInfo?.lastName,
          email: order.customerInfo?.email,
          phone: order.customerInfo?.phone,
        },

        items: (order.items || []).map((item: any) => ({
          product: item.product?.toString(),
          variantId: item.variantId?.toString(),

          name: item.name,
          packSize: item.packSize,
          sku: item.sku,

          price: item.price,
          quantity: item.quantity,

          image: item.image,
        })),

        itemCount: (order.items || []).reduce(
          (sum: number, item: any) =>
            sum + item.quantity,
          0
        ),

        subtotal: order.subtotal,
        discount: order.discount,
        deliveryCharge: order.deliveryCharge,
        total: order.total,

        coupon: order.coupon
          ? {
              code: order.coupon.code,
              discount: order.coupon.discount,
            }
          : null,

        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,

        orderStatus: order.orderStatus,

        shippingAddress: order.shippingAddress,

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
          : null,

        trackingHistory: (
          order.trackingHistory || []
        ).map((tracking: any) => ({
          status: tracking.status,
          note: tracking.note,
          location: tracking.location,
          createdAt: tracking.createdAt,
        })),

        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
    });
  } catch (error) {
    console.error(
      "ACCOUNT ORDERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load your orders.",
      },
      { status: 500 }
    );
  }
}