import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Order from "@/models/Order";

import {
  sendOrderManagementUpdateEmail,
} from "@/lib/mailer";

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

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
};

function clean(value: any) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function same(value1: any, value2: any) {
  return clean(value1) === clean(value2);
}

function normalizeAddress(address: any) {
  if (!address) {
    return null;
  }

  return {
    firstName: clean(address.firstName),
    lastName: clean(address.lastName),
    address: clean(address.address),
    apartment: clean(address.apartment),
    city: clean(address.city),
    state: clean(address.state),
    postalCode: clean(address.postalCode),
    country: clean(address.country),
    phone: clean(address.phone),
  };
}

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

    const { id } = await context.params;

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
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
    const admin = await requireAdmin();

    await connectDB();

    const { id } = await context.params;

    const body = await request.json();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    /*
     * ============================================================
     * SAVE OLD VALUES BEFORE CHANGES
     * ============================================================
     */

    const oldOrderStatus =
      order.orderStatus;

    const oldPaymentStatus =
      order.paymentStatus;

    const oldCourier =
      order.shipping?.courier || "";

    const oldTrackingNumber =
      order.shipping?.trackingNumber || "";

    const oldEstimatedDeliveryDate =
      order.shipping?.estimatedDeliveryDate
        ? new Date(
            order.shipping.estimatedDeliveryDate
          ).toISOString()
        : "";

    const oldTransactionId =
      order.payment?.transactionId || "";

    const oldGateway =
      order.payment?.gateway || "";

    const oldReferenceNumber =
      order.payment?.referenceNumber || "";

    const oldCustomerInfo = {
      firstName:
        order.customerInfo?.firstName || "",
      lastName:
        order.customerInfo?.lastName || "",
      phone:
        order.customerInfo?.phone || "",
      email:
        order.customerInfo?.email || "",
    };

    const oldShippingAddress =
      normalizeAddress(
        order.shippingAddress
      );

    const oldBillingAddress =
      normalizeAddress(
        order.billingAddress
      );

    const oldBillingSame =
      order.billingAddressSameAsShipping;

    const oldCancellationReason =
      clean(
        order.cancellation?.reason
      );

    /*
     * ============================================================
     * VALIDATION
     * ============================================================
     */

    if (
      body.orderStatus !== undefined &&
      !ORDER_STATUSES.includes(
        body.orderStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status",
        },
        { status: 400 }
      );
    }

    if (
      body.paymentStatus !== undefined &&
      !PAYMENT_STATUSES.includes(
        body.paymentStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment status",
        },
        { status: 400 }
      );
    }

    /*
     * ============================================================
     * BASIC ORDER STATUS
     * ============================================================
     */

    if (body.orderStatus !== undefined) {
      order.orderStatus =
        body.orderStatus;
    }

    /*
     * ============================================================
     * PAYMENT STATUS
     * ============================================================
     */

    if (body.paymentStatus !== undefined) {
      order.paymentStatus =
        body.paymentStatus;
    }

    /*
     * ============================================================
     * ADMIN NOTES
     *
     * Admin-only. Does NOT trigger customer email.
     * ============================================================
     */

    if (body.adminNotes !== undefined) {
      order.adminNotes =
        body.adminNotes;
    }

    /*
     * ============================================================
     * CUSTOMER NOTES
     *
     * Saved in DB but does NOT trigger customer email.
     * ============================================================
     */

    if (body.customerNotes !== undefined) {
      (order as any).customerNotes =
        body.customerNotes;
    }

    /*
     * ============================================================
     * CUSTOMER INFORMATION
     * ============================================================
     */

    if (body.customerInfo) {
      order.customerInfo = {
        ...(order.customerInfo || {}),
        ...body.customerInfo,
      };
    }

    /*
     * ============================================================
     * SHIPPING ADDRESS
     * ============================================================
     */

    if (body.shippingAddress) {
      order.shippingAddress = {
        ...(order.shippingAddress || {}),
        ...body.shippingAddress,
      };
    }

    /*
     * ============================================================
     * BILLING ADDRESS
     * ============================================================
     */

    if (
      body.billingAddressSameAsShipping !==
      undefined
    ) {
      order.billingAddressSameAsShipping =
        Boolean(
          body.billingAddressSameAsShipping
        );
    }

    if (
      body.billingAddress !== undefined
    ) {
      if (
        body.billingAddressSameAsShipping
      ) {
        order.billingAddress =
          undefined;
      } else {
        order.billingAddress = {
          ...(order.billingAddress || {}),
          ...body.billingAddress,
        };
      }
    }

    /*
     * ============================================================
     * SHIPPING DETAILS
     * ============================================================
     */

    if (body.shipping !== undefined) {
      order.shipping = {
        ...(order.shipping || {}),
        ...body.shipping,
      };
    }

    /*
     * ============================================================
     * PAYMENT DETAILS
     * ============================================================
     */

    if (body.payment !== undefined) {
      order.payment = {
        ...(order.payment || {}),
        ...body.payment,
      };
    }

    /*
     * ============================================================
     * PAYMENT MARKED PAID
     * ============================================================
     */

    if (
      body.paymentStatus === "paid"
    ) {
      if (!order.payment) {
        order.payment = {};
      }

      order.payment.paidAt =
        order.payment.paidAt ||
        new Date();

      if (
        admin &&
        typeof admin === "object" &&
        "_id" in admin
      ) {
        order.payment.verifiedBy =
          (admin as any)._id;
      }
    }

    /*
     * ============================================================
     * PAYMENT FAILED
     * ============================================================
     */

    if (
      body.paymentStatus === "failed"
    ) {
      if (!order.payment) {
        order.payment = {};
      }

      order.payment.failureReason =
        clean(
          body.failureReason
        ) ||
        order.payment.failureReason ||
        "Payment proof could not be verified.";
    }

    /*
     * ============================================================
     * STATUS / SHIPPING CHANGE DETECTION
     * ============================================================
     */

    const newCourier =
      clean(order.shipping?.courier);

    const newTrackingNumber =
      clean(
        order.shipping?.trackingNumber
      );

    const newEstimatedDeliveryDate =
      order.shipping
        ?.estimatedDeliveryDate
        ? new Date(
            order.shipping.estimatedDeliveryDate
          ).toISOString()
        : "";

    const statusChanged =
      body.orderStatus !== undefined &&
      body.orderStatus !==
        oldOrderStatus;

    const courierChanged =
      !same(
        oldCourier,
        newCourier
      );

    const trackingChanged =
      !same(
        oldTrackingNumber,
        newTrackingNumber
      );

    const deliveryDateChanged =
      oldEstimatedDeliveryDate !==
      newEstimatedDeliveryDate;

    const hasTrackingNote =
      clean(body.trackingNote);

    const hasTrackingLocation =
      clean(body.location);

    /*
     * ============================================================
     * CANCELLATION
     * ============================================================
     */

    const isCancelling =
      body.orderStatus === "cancelled" &&
      oldOrderStatus !== "cancelled";

    const cancellationReason =
      clean(
        body.cancellationReason
      );

    if (
      body.orderStatus ===
      "cancelled"
    ) {
      const finalCancellationReason =
        cancellationReason ||
        oldCancellationReason ||
        "Cancelled by admin";

      order.cancellation = {
        reason:
          finalCancellationReason,

        cancelledAt:
          isCancelling
            ? new Date()
            : order.cancellation
                ?.cancelledAt ||
              new Date(),

        cancelledBy:
          order.cancellation
            ?.cancelledBy ||
          (
            admin &&
            typeof admin === "object" &&
            "_id" in admin
              ? (admin as any)._id
              : undefined
          ),
      };
    }

    /*
     * ============================================================
     * IF ORDER MOVED AWAY FROM CANCELLED
     * ============================================================
     */

    const reopeningCancelledOrder =
      body.orderStatus &&
      body.orderStatus !==
        "cancelled" &&
      oldOrderStatus ===
        "cancelled";

    if (reopeningCancelledOrder) {
      order.cancellation =
        undefined;
    }

    /*
     * ============================================================
     * TRACKING HISTORY
     *
     * Add history when:
     * - status changes
     * - courier changes
     * - tracking number changes
     * - estimated delivery changes
     * - manual tracking note is added
     * ============================================================
     */

    if (
      statusChanged ||
      courierChanged ||
      trackingChanged ||
      deliveryDateChanged ||
      hasTrackingNote
    ) {
      if (!order.trackingHistory) {
        order.trackingHistory = [];
      }

      let historyNote = "";

      /*
       * Cancellation gets its own clear
       * tracking history message.
       */
      if (isCancelling) {
        historyNote =
          cancellationReason
            ? `Order cancelled by admin: ${cancellationReason}`
            : "Order cancelled by admin";
      } else if (hasTrackingNote) {
        historyNote =
          clean(body.trackingNote);
      } else if (statusChanged) {
        historyNote =
          `Order status changed from ${
            STATUS_LABELS[
              oldOrderStatus
            ] ||
            oldOrderStatus
          } to ${
            STATUS_LABELS[
              body.orderStatus
            ] ||
            body.orderStatus
          }`;
      } else if (trackingChanged) {
        historyNote =
          newTrackingNumber
            ? `Tracking number updated to ${newTrackingNumber}`
            : "Tracking number removed";
      } else if (courierChanged) {
        historyNote =
          newCourier
            ? `Courier updated to ${newCourier}`
            : "Courier removed";
      } else if (
        deliveryDateChanged
      ) {
        historyNote =
          newEstimatedDeliveryDate
            ? `Estimated delivery updated to ${new Date(
                newEstimatedDeliveryDate
              ).toLocaleDateString(
                "en-PK",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}`
            : "Estimated delivery date removed";
      }

      order.trackingHistory.push({
        status:
          body.orderStatus ||
          order.orderStatus,

        note:
          historyNote ||
          "Order information updated",

        location:
          hasTrackingLocation ||
          undefined,

        createdAt:
          new Date(),
      });
    }

    /*
     * ============================================================
     * SHIPPED TIMESTAMP
     * ============================================================
     */

    if (
      body.orderStatus === "shipped" &&
      oldOrderStatus !== "shipped"
    ) {
      if (!order.shipping) {
        order.shipping = {};
      }

      order.shipping.shippedAt =
        order.shipping.shippedAt ||
        new Date();
    }

    /*
     * ============================================================
     * DELIVERED TIMESTAMP
     * ============================================================
     */

    if (
      body.orderStatus === "delivered" &&
      oldOrderStatus !== "delivered"
    ) {
      if (!order.shipping) {
        order.shipping = {};
      }

      order.shipping.deliveredAt =
        order.shipping.deliveredAt ||
        new Date();
    }

    /*
     * ============================================================
     * CUSTOMER-FACING CHANGE DETECTION
     * ============================================================
     */

    const newCustomerInfo = {
      firstName:
        order.customerInfo?.firstName ||
        "",
      lastName:
        order.customerInfo?.lastName ||
        "",
      phone:
        order.customerInfo?.phone ||
        "",
      email:
        order.customerInfo?.email ||
        "",
    };

    const newShippingAddress =
      normalizeAddress(
        order.shippingAddress
      );

    const newBillingAddress =
      normalizeAddress(
        order.billingAddress
      );

    const customerInfoChanged =
      !same(
        oldCustomerInfo.firstName,
        newCustomerInfo.firstName
      ) ||
      !same(
        oldCustomerInfo.lastName,
        newCustomerInfo.lastName
      ) ||
      !same(
        oldCustomerInfo.phone,
        newCustomerInfo.phone
      ) ||
      !same(
        oldCustomerInfo.email,
        newCustomerInfo.email
      );

    const shippingAddressChanged =
      JSON.stringify(
        oldShippingAddress
      ) !==
      JSON.stringify(
        newShippingAddress
      );

    const billingAddressChanged =
      JSON.stringify(
        oldBillingAddress
      ) !==
      JSON.stringify(
        newBillingAddress
      ) ||
      oldBillingSame !==
        order.billingAddressSameAsShipping;

    const paymentDetailsChanged =
      !same(
        oldTransactionId,
        order.payment
          ?.transactionId
      ) ||
      !same(
        oldGateway,
        order.payment?.gateway
      ) ||
      !same(
        oldReferenceNumber,
        order.payment
          ?.referenceNumber
      );

    const paymentStatusChanged =
      oldPaymentStatus !==
      order.paymentStatus;

    /*
     * Cancellation is meaningful only when:
     * - order becomes cancelled
     * - cancellation reason changes while already cancelled
     */
    const cancellationChanged =
      isCancelling ||
      (
        order.orderStatus === "cancelled" &&
        !same(
          oldCancellationReason,
          order.cancellation?.reason
        )
      );

    /*
     * Moving away from cancelled is also
     * a customer-facing status change,
     * already covered by statusChanged.
     */

    const meaningfulChange =
      statusChanged ||
      paymentStatusChanged ||
      courierChanged ||
      trackingChanged ||
      deliveryDateChanged ||
      paymentDetailsChanged ||
      customerInfoChanged ||
      shippingAddressChanged ||
      billingAddressChanged ||
      cancellationChanged;

    /*
     * ============================================================
     * SAVE
     * ============================================================
     */

    await order.save();

    /*
     * ============================================================
     * CUSTOMER EMAIL
     *
     * Important:
     * This is NOT the original order confirmation email.
     *
     * It only sends for meaningful customer-facing changes.
     *
     * Admin notes and customer notes do NOT trigger it.
     * ============================================================
     */

    if (
      meaningfulChange &&
      order.customerInfo?.email
    ) {
      try {
        await sendOrderManagementUpdateEmail({
          order,

          changes: {
            statusChanged,
            paymentStatusChanged,
            courierChanged,
            trackingChanged,
            deliveryDateChanged,
            paymentDetailsChanged,
            customerInfoChanged,
            shippingAddressChanged,
            billingAddressChanged,

            /*
             * This allows the mailer to show
             * cancellation-specific information.
             */
            cancellationChanged,
          },
        } as any);
      } catch (emailError) {
        /*
         * Email failure should NOT make
         * the database update fail.
         */
        console.error(
          "Order update email failed:",
          emailError
        );
      }
    }

    /*
     * ============================================================
     * RESPONSE MESSAGE
     * ============================================================
     */

    let message =
      "Order saved successfully.";

    if (isCancelling) {
      message =
        "Order cancelled successfully.";
    } else if (meaningfulChange) {
      message =
        "Order updated successfully. Customer notification sent for relevant changes.";
    } else {
      message =
        "Order saved successfully. No customer notification was needed.";
    }

    return NextResponse.json({
      success: true,
      message,

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

/*
 * ================================================================
 * DELETE ORDER
 * ================================================================
 */

export async function DELETE(
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

    const { id } = await context.params;

    const order =
      await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    await Order.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message:
        "Order deleted successfully",
    });
  } catch (error: any) {
    console.error(
      "Admin order DELETE error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to delete order",
      },
      { status: 500 }
    );
  }
}