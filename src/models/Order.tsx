
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
  product: Types.ObjectId;
  variantId?: Types.ObjectId;
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
   REMINDER STATUS
===================================================== */

export type ReminderStatus =
  | "pending"
  | "sending"
  | "sent"
  | "failed"
  | "skipped";

/* =====================================================
   ORDER
===================================================== */

export interface IOrder extends Document {
  orderNumber: string;
  customer?: Types.ObjectId;
  customerInfo: ICustomerInfo;
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  billingAddressSameAsShipping: boolean;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;

  coupon?: {
    code: string;
    discount: number;
  };

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  payment?: {
    transactionId?: string;
    gateway?: string;
    referenceNumber?: string;
    screenshotUrl?: string;
    screenshotPublicId?: string;
    submittedAt?: Date;
    paidAt?: Date;
    verifiedBy?: Types.ObjectId;
    failureReason?: string;
  };

  orderStatus: OrderStatus;

  shipping?: {
    courier?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
  };

  trackingHistory: IOrderTrackingHistory[];
  notes?: string;
  adminNotes?: string;

  cancellation?: {
    reason?: string;
    cancelledBy?: Types.ObjectId;
    cancelledAt?: Date;
  };

  // First reminder
  reminderDueAt?: Date;
  reminderStatus: ReminderStatus;
  reminderSentAt?: Date;
  reminderAttempts: number;

  // Final follow-up
  followUpDueAt?: Date;
  followUpStatus: ReminderStatus;
  followUpSentAt?: Date;
  followUpAttempts: number;

  createdAt: Date;
  updatedAt: Date;
}

/* =====================================================
   ORDER ITEM SCHEMA
===================================================== */

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    variantId: {
      type: Schema.Types.ObjectId,
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },

    packSize: {
      type: String,
      trim: true,
      maxlength: [50, "Pack size cannot exceed 50 characters"],
    },

    sku: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [100, "SKU cannot exceed 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: [0, "Price cannot be negative"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },

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

const AddressSchema = new Schema<IAddress>(
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
      required: [true, "Address is required"],
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
    },

    apartment: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    city: {
      type: String,
      required: [true, "City is required"],
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
          message: "Invalid tracking status",
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

const PaymentSchema = new Schema(
  {
    transactionId: {
      type: String,
      trim: true,
      index: true,
    },

    gateway: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    referenceNumber: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    screenshotUrl: {
      type: String,
      trim: true,
    },

    screenshotPublicId: {
      type: String,
      trim: true,
    },

    submittedAt: {
      type: Date,
    },

    paidAt: {
      type: Date,
    },

    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

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

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
      index: true,
      trim: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    customerInfo: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxlength: 100,
      },

      lastName: {
        type: String,
        required: [true, "Last name is required"],
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
        required: [true, "Phone number is required"],
        trim: true,
        maxlength: 30,
      },
    },

    shippingAddress: {
      type: AddressSchema,
      required: [true, "Shipping address is required"],
    },

    billingAddress: {
      type: AddressSchema,
    },

    billingAddressSameAsShipping: {
      type: Boolean,
      default: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },

    deliveryCharge: {
      type: Number,
      required: [true, "Delivery charge is required"],
      min: [0, "Delivery charge cannot be negative"],
    },

    total: {
      type: Number,
      required: [true, "Total is required"],
      min: [0, "Total cannot be negative"],
    },

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
        message: "Invalid payment method",
      },
      required: true,
      default: "cod",
    },

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
        message: "Invalid payment status",
      },
      required: true,
      default: "pending",
      index: true,
    },

    payment: {
      type: PaymentSchema,
    },

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
        message: "Invalid order status",
      },
      required: true,
      default: "pending",
      index: true,
    },

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

    trackingHistory: {
      type: [TrackingHistorySchema],
      default: [],
    },

    // First reminder
    reminderDueAt: {
      type: Date,
      default: undefined,
    },

    reminderStatus: {
      type: String,
      enum: ["pending", "sending", "sent", "failed", "skipped"],
      default: "pending",
      required: true,
    },

    reminderSentAt: {
      type: Date,
      default: undefined,
    },

    reminderAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Final follow-up
    followUpDueAt: {
      type: Date,
      default: undefined,
    },

    followUpStatus: {
      type: String,
      enum: ["pending", "sending", "sent", "failed", "skipped"],
      default: "pending",
      required: true,
    },

    followUpSentAt: {
      type: Date,
      default: undefined,
    },

    followUpAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Customer notes cannot exceed 1000 characters"],
    },

    adminNotes: {
      type: String,
      trim: true,
      maxlength: [2000, "Admin notes cannot exceed 2000 characters"],
    },

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

OrderSchema.index({
  reminderStatus: 1,
  reminderDueAt: 1,
  orderStatus: 1,
});

OrderSchema.index({
  followUpStatus: 1,
  followUpDueAt: 1,
  orderStatus: 1,
});

/* =====================================================
   MODEL
===================================================== */

if (process.env.NODE_ENV === "development" && mongoose.models.Order) {
  mongoose.deleteModel("Order");
}

const Order: Model<IOrder> =
  mongoose.models.Order as Model<IOrder> ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;