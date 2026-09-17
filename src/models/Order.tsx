import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

/* =====================================================
   ORDER ITEM
===================================================== */

export interface IOrderItem {
  _id?: Types.ObjectId;

  // Original product reference
  product: Types.ObjectId;

  // Selected product variant
  variantId?: Types.ObjectId;

  // Product information snapshot
  // These values should NOT change when product changes later.
  name: string;
  packSize?: string;
  sku?: string;
  price: number;
  quantity: number;
  image?: string;
}

/* =====================================================
   ADDRESS
===================================================== */

export interface IAddress {
  firstName?: string;
  lastName?: string;
  address: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
}

/* =====================================================
   CUSTOMER INFORMATION
===================================================== */

export interface ICustomerInfo {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
}

/* =====================================================
   TRACKING HISTORY
===================================================== */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface IOrderTrackingHistory {
  status: OrderStatus;
  note?: string;
  location?: string;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
}

/* =====================================================
   PAYMENT
===================================================== */

export type PaymentMethod =
  | "cod"
  | "card"
  | "bank_transfer"
  | "jazzcash"
  | "easypaisa";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

/* =====================================================
   ORDER
===================================================== */

export interface IOrder extends Document {
  // Human-readable order number
  orderNumber: string;

  // Registered customer
  // Optional for guest checkout
  customer?: Types.ObjectId;

  // Customer snapshot
  customerInfo: ICustomerInfo;

  // Where order should be delivered
  shippingAddress: IAddress;

  // Billing / payment address
  // Can be different from shipping address.
  billingAddress?: IAddress;

  // Whether billing address is same as shipping
  billingAddressSameAsShipping: boolean;

  // Ordered products
  items: IOrderItem[];

  // Pricing
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;

  // Coupon information
  coupon?: {
    code: string;
    discount: number;
  };

  // Payment information
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  // Online / manual payment information
  payment?: {
    // Gateway transaction ID
    transactionId?: string;

    // cod / bank_transfer / jazzcash / easypaisa
    gateway?: string;

    // Customer-provided transaction/reference number
    referenceNumber?: string;

    // Cloudinary payment screenshot
    screenshotUrl?: string;

    // Cloudinary public ID
    screenshotPublicId?: string;

    // When customer submitted payment proof
    submittedAt?: Date;

    // When admin verified payment
    paidAt?: Date;

    // Admin who verified the payment
    verifiedBy?: Types.ObjectId;

    // Reason if payment was rejected/failed
    failureReason?: string;
  };

  // Main order status
  orderStatus: OrderStatus;

  // Shipping / courier information
  shipping?: {
    courier?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
  };

  // Complete tracking history
  trackingHistory: IOrderTrackingHistory[];

  // Customer notes
  notes?: string;

  // Admin/internal notes
  adminNotes?: string;

  // Cancellation information
  cancellation?: {
    reason?: string;
    cancelledBy?: Types.ObjectId;
    cancelledAt?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

/* =====================================================
   ORDER ITEM SCHEMA
===================================================== */

const OrderItemSchema =
  new Schema<IOrderItem>(
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [
          true,
          "Product is required",
        ],
      },

      variantId: {
        type: Schema.Types.ObjectId,
      },

      // Product name snapshot
      name: {
        type: String,
        required: [
          true,
          "Product name is required",
        ],
        trim: true,
        maxlength: [
          200,
          "Product name cannot exceed 200 characters",
        ],
      },

      // Optional because some products may not have
      // weight or pack size.
      packSize: {
        type: String,
        trim: true,
        maxlength: [
          50,
          "Pack size cannot exceed 50 characters",
        ],
      },

      // SKU snapshot
      sku: {
        type: String,
        trim: true,
        uppercase: true,
        maxlength: [
          100,
          "SKU cannot exceed 100 characters",
        ],
      },

      // Price at time of purchase
      price: {
        type: Number,
        required: [
          true,
          "Item price is required",
        ],
        min: [
          0,
          "Price cannot be negative",
        ],
      },

      quantity: {
        type: Number,
        required: [
          true,
          "Quantity is required",
        ],
        min: [
          1,
          "Quantity must be at least 1",
        ],
      },

      // Product image snapshot
      image: {
        type: String,
        trim: true,
      },
    },
    {
      _id: true,
    }
  );

/* =====================================================
   ADDRESS SCHEMA
===================================================== */

const AddressSchema =
  new Schema<IAddress>(
    {
      firstName: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      lastName: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      address: {
        type: String,
        required: [
          true,
          "Address is required",
        ],
        trim: true,
        maxlength: [
          500,
          "Address cannot exceed 500 characters",
        ],
      },

      apartment: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      city: {
        type: String,
        required: [
          true,
          "City is required",
        ],
        trim: true,
        maxlength: 100,
      },

      state: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      postalCode: {
        type: String,
        trim: true,
        maxlength: 20,
      },

      country: {
        type: String,
        trim: true,
        default: "Pakistan",
        maxlength: 100,
      },

      phone: {
        type: String,
        trim: true,
        maxlength: 30,
      },
    },
    {
      _id: false,
    }
  );

/* =====================================================
   TRACKING HISTORY SCHEMA
===================================================== */

const TrackingHistorySchema =
  new Schema<IOrderTrackingHistory>(
    {
      status: {
        type: String,
        enum: {
          values: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled",
          ],
          message:
            "Invalid tracking status",
        },
        required: true,
      },

      note: {
        type: String,
        trim: true,
        maxlength: 500,
      },

      location: {
        type: String,
        trim: true,
        maxlength: 200,
      },

      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      _id: true,
    }
  );

/* =====================================================
   PAYMENT SCHEMA
===================================================== */

const PaymentSchema =
  new Schema(
    {
      // Gateway transaction ID
      transactionId: {
        type: String,
        trim: true,
        index: true,
      },

      // Payment method / gateway
      gateway: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      // Customer-provided reference number
      referenceNumber: {
        type: String,
        trim: true,
        maxlength: 150,
      },

      // Cloudinary screenshot URL
      screenshotUrl: {
        type: String,
        trim: true,
      },

      // Cloudinary public ID
      screenshotPublicId: {
        type: String,
        trim: true,
      },

      // When customer submitted proof
      submittedAt: {
        type: Date,
      },

      // When admin verified payment
      paidAt: {
        type: Date,
      },

      // Admin who verified payment
      verifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      // Payment rejection/failure reason
      failureReason: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    },
    {
      _id: false,
    }
  );

/* =====================================================
   ORDER SCHEMA
===================================================== */

const OrderSchema =
  new Schema<IOrder>(
    {
      /* =================================================
         ORDER NUMBER
      ================================================= */

      orderNumber: {
        type: String,
        required: [
          true,
          "Order number is required",
        ],
        unique: true,
        index: true,
        trim: true,
      },

      /* =================================================
         CUSTOMER
      ================================================= */

      customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },

      customerInfo: {
        firstName: {
          type: String,
          required: [
            true,
            "First name is required",
          ],
          trim: true,
          maxlength: 100,
        },

        lastName: {
          type: String,
          required: [
            true,
            "Last name is required",
          ],
          trim: true,
          maxlength: 100,
        },

        email: {
          type: String,
          lowercase: true,
          trim: true,
          maxlength: 150,

          match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address",
          ],
        },

        phone: {
          type: String,
          required: [
            true,
            "Phone number is required",
          ],
          trim: true,
          maxlength: 30,
        },
      },

      /* =================================================
         SHIPPING ADDRESS
      ================================================= */

      shippingAddress: {
        type: AddressSchema,
        required: [
          true,
          "Shipping address is required",
        ],
      },

      /* =================================================
         BILLING / PAYMENT ADDRESS
      ================================================= */

      billingAddress: {
        type: AddressSchema,
      },

      billingAddressSameAsShipping: {
        type: Boolean,
        default: true,
      },

      /* =================================================
         ORDER ITEMS
      ================================================= */

      items: {
        type: [OrderItemSchema],
        required: true,

        validate: {
          validator: (
            items: IOrderItem[]
          ) => {
            return items.length > 0;
          },

          message:
            "Order must contain at least one item",
        },
      },

      /* =================================================
         PRICING
      ================================================= */

      subtotal: {
        type: Number,
        required: [
          true,
          "Subtotal is required",
        ],
        min: [
          0,
          "Subtotal cannot be negative",
        ],
      },

      discount: {
        type: Number,
        default: 0,
        min: [
          0,
          "Discount cannot be negative",
        ],
      },

      deliveryCharge: {
        type: Number,
        required: [
          true,
          "Delivery charge is required",
        ],
        min: [
          0,
          "Delivery charge cannot be negative",
        ],
      },

      total: {
        type: Number,
        required: [
          true,
          "Total is required",
        ],
        min: [
          0,
          "Total cannot be negative",
        ],
      },

      /* =================================================
         COUPON
      ================================================= */

      coupon: {
        code: {
          type: String,
          trim: true,
          uppercase: true,
        },

        discount: {
          type: Number,
          min: 0,
        },
      },

      /* =================================================
         PAYMENT METHOD
      ================================================= */

      paymentMethod: {
        type: String,

        enum: {
          values: [
            "cod",
            "card",
            "bank_transfer",
            "jazzcash",
            "easypaisa",
          ],

          message:
            "Invalid payment method",
        },

        required: true,
        default: "cod",
      },

      /* =================================================
         PAYMENT STATUS
      ================================================= */

      paymentStatus: {
        type: String,

        enum: {
          values: [
            "pending",
            "processing",
            "paid",
            "failed",
            "cancelled",
            "refunded",
            "partially_refunded",
          ],

          message:
            "Invalid payment status",
        },

        required: true,
        default: "pending",
        index: true,
      },

      /* =================================================
         ONLINE / MANUAL PAYMENT DETAILS
      ================================================= */

      payment: {
        type: PaymentSchema,
      },

      /* =================================================
         ORDER STATUS
      ================================================= */

      orderStatus: {
        type: String,

        enum: {
          values: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled",
          ],

          message:
            "Invalid order status",
        },

        required: true,
        default: "pending",
        index: true,
      },

      /* =================================================
         SHIPPING / DELIVERY
      ================================================= */

      shipping: {
        courier: {
          type: String,
          trim: true,
          maxlength: 100,
        },

        trackingNumber: {
          type: String,
          trim: true,
          maxlength: 150,
          index: true,
        },

        estimatedDeliveryDate: {
          type: Date,
        },

        shippedAt: {
          type: Date,
        },

        deliveredAt: {
          type: Date,
        },
      },

      /* =================================================
         TRACKING HISTORY
      ================================================= */

      trackingHistory: {
        type: [TrackingHistorySchema],
        default: [],
      },

      /* =================================================
         CUSTOMER NOTES
      ================================================= */

      notes: {
        type: String,
        trim: true,
        maxlength: [
          1000,
          "Customer notes cannot exceed 1000 characters",
        ],
      },

      /* =================================================
         ADMIN NOTES
      ================================================= */

      adminNotes: {
        type: String,
        trim: true,
        maxlength: [
          2000,
          "Admin notes cannot exceed 2000 characters",
        ],
      },

      /* =================================================
         CANCELLATION
      ================================================= */

      cancellation: {
        reason: {
          type: String,
          trim: true,
          maxlength: 500,
        },

        cancelledBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },

        cancelledAt: {
          type: Date,
        },
      },
    },

    {
      timestamps: true,
    }
  );

/* =====================================================
   INDEXES
===================================================== */

OrderSchema.index({
  createdAt: -1,
});

OrderSchema.index({
  orderStatus: 1,
  createdAt: -1,
});

OrderSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

OrderSchema.index({
  customer: 1,
  createdAt: -1,
});

OrderSchema.index({
  "shipping.trackingNumber": 1,
});

/* =====================================================
   MODEL
===================================================== */

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>(
    "Order",
    OrderSchema
  );

export default Order;