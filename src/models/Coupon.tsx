  import mongoose, {
    Document,
    Model,
    Schema,
  } from "mongoose";

  /* COUPON */
  export interface ICoupon extends Document {
    code: string;

    discountType: "percentage" | "fixed";
    discountValue: number;

    minimumOrderAmount?: number;
    maximumDiscountAmount?: number;

    usageLimit?: number;
    usedCount: number;

    expiresAt?: Date;

    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
  }

  /* COUPON SCHEMA */
  const CouponSchema = new Schema<ICoupon>(
    {
      /* COUPON CODE */
      code: {
        type: String,
        required: [true, "Coupon code is required"],
        unique: true,
        uppercase: true,
        trim: true,
        minlength: [
          3,
          "Coupon code must be at least 3 characters",
        ],
        maxlength: [
          50,
          "Coupon code cannot exceed 50 characters",
        ],
        match: [
          /^[A-Z0-9_-]+$/,
          "Coupon code can only contain letters, numbers, hyphens, and underscores",
        ],
      },

      /* DISCOUNT TYPE */
      discountType: {
        type: String,
        enum: {
          values: ["percentage", "fixed"],
          message:
            "Discount type must be percentage or fixed",
        },
        required: [true, "Discount type is required"],
      },

      /* DISCOUNT VALUE */
      discountValue: {
        type: Number,
        required: [true, "Discount value is required"],
        min: [
          0,
          "Discount value cannot be negative",
        ],
      },

      /* MINIMUM ORDER AMOUNT */
      minimumOrderAmount: {
        type: Number,
        min: [
          0,
          "Minimum order amount cannot be negative",
        ],
      },

      /* MAXIMUM DISCOUNT AMOUNT */
      maximumDiscountAmount: {
        type: Number,
        min: [
          0,
          "Maximum discount amount cannot be negative",
        ],
      },

      /* USAGE LIMIT */
      usageLimit: {
        type: Number,
        min: [
          1,
          "Usage limit must be at least 1",
        ],
      },

      /* USED COUNT */
      usedCount: {
        type: Number,
        default: 0,
        min: [
          0,
          "Used count cannot be negative",
        ],
      },

      /* EXPIRY DATE */
      expiresAt: {
        type: Date,
      },

      /* ACTIVE / INACTIVE */
      isActive: {
        type: Boolean,
        default: true,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

  /* INDEXES */

  /* Active coupons + expiry lookup */
  CouponSchema.index({
    isActive: 1,
    expiresAt: 1,
  });

  /* Latest coupons first */
  CouponSchema.index({
    createdAt: -1,
  });

  /*
  * Prevent model re-compilation
  * during Next.js hot reload.
  */
  const Coupon: Model<ICoupon> =
    mongoose.models.Coupon ||
    mongoose.model<ICoupon>(
      "Coupon",
      CouponSchema
    );

  export default Coupon;

