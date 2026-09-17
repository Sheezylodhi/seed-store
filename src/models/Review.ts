import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

/* =====================================================
   REVIEW
===================================================== */

export interface IReview extends Document {
  // Product being reviewed
  product: Types.ObjectId;

  // Registered customer
  // Optional because guest reviews can be supported later.
  customer?: Types.ObjectId;

  // Customer information snapshot
  name: string;
  email?: string;

  // Review
  rating: number;
  title?: string;
  comment: string;

  // Moderation
  isApproved: boolean;
  isPublished: boolean;

  // Whether customer actually purchased
  // this product.
  isVerifiedPurchase: boolean;

  // Admin response
  adminReply?: {
    message: string;
    repliedBy?: Types.ObjectId;
    repliedAt?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

/* =====================================================
   REVIEW SCHEMA
===================================================== */

const ReviewSchema = new Schema<IReview>(
  {
    /* =================================================
       PRODUCT
    ================================================= */

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
      index: true,
    },

    /* =================================================
       CUSTOMER
    ================================================= */

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    /* =================================================
       CUSTOMER INFORMATION
    ================================================= */

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [
        2,
        "Name must be at least 2 characters",
      ],
      maxlength: [
        100,
        "Name cannot exceed 100 characters",
      ],
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

    /* =================================================
       RATING
    ================================================= */

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    /* =================================================
       REVIEW TITLE
    ================================================= */

    title: {
      type: String,
      trim: true,
      maxlength: [
        150,
        "Review title cannot exceed 150 characters",
      ],
    },

    /* =================================================
       REVIEW COMMENT
    ================================================= */

    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [
        5,
        "Review must contain at least 5 characters",
      ],
      maxlength: [
        2000,
        "Review cannot exceed 2000 characters",
      ],
    },

    /* =================================================
       MODERATION
    ================================================= */

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* =================================================
       VERIFIED PURCHASE
    ================================================= */

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* =================================================
       ADMIN REPLY
    ================================================= */

    adminReply: {
      message: {
        type: String,
        trim: true,
        maxlength: [
          1000,
          "Admin reply cannot exceed 1000 characters",
        ],
      },

      repliedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      repliedAt: {
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

// Product reviews
ReviewSchema.index({
  product: 1,
  createdAt: -1,
});

// Published reviews for product page
ReviewSchema.index({
  product: 1,
  isPublished: 1,
  createdAt: -1,
});

// Admin moderation
ReviewSchema.index({
  isApproved: 1,
  isPublished: 1,
  createdAt: -1,
});

// Customer's reviews
ReviewSchema.index({
  customer: 1,
  createdAt: -1,
});

/* =====================================================
   MODEL
===================================================== */

const Review: Model<IReview> =
  mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);

export default Review;