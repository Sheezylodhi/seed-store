import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

/* CONTACT MESSAGE */

export type ContactMessageStatus =
  | "new"
  | "read"
  | "replied"
  | "closed";

export interface IContactMessage extends Document {
  customer?: Types.ObjectId;

  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;

  status: ContactMessageStatus;

  adminReply?: {
    message: string;
    repliedBy?: Types.ObjectId;
    repliedAt?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

/* CONTACT MESSAGE SCHEMA */

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    /* LOGGED-IN CUSTOMER */
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    /* CUSTOMER NAME */
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [
        100,
        "Name cannot exceed 100 characters",
      ],
    },

    /* CUSTOMER EMAIL */
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      maxlength: [
        150,
        "Email cannot exceed 150 characters",
      ],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    /* PHONE */
    phone: {
      type: String,
      trim: true,
      maxlength: [
        30,
        "Phone number cannot exceed 30 characters",
      ],
    },

    /* SUBJECT */
    subject: {
      type: String,
      trim: true,
      maxlength: [
        200,
        "Subject cannot exceed 200 characters",
      ],
    },

    /* CUSTOMER MESSAGE */
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [
        5,
        "Message must be at least 5 characters",
      ],
      maxlength: [
        5000,
        "Message cannot exceed 5000 characters",
      ],
    },

    /* MESSAGE STATUS */
    status: {
      type: String,
      enum: {
        values: [
          "new",
          "read",
          "replied",
          "closed",
        ],
        message: "Invalid contact message status",
      },
      default: "new",
      required: true,
      index: true,
    },

    /* ADMIN REPLY */
    adminReply: {
      message: {
        type: String,
        trim: true,
        maxlength: [
          5000,
          "Admin reply cannot exceed 5000 characters",
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

/* INDEXES */

ContactMessageSchema.index({
  createdAt: -1,
});

ContactMessageSchema.index({
  status: 1,
  createdAt: -1,
});

ContactMessageSchema.index({
  customer: 1,
  createdAt: -1,
});

ContactMessageSchema.index({
  email: 1,
  createdAt: -1,
});

/* PREVENT MODEL RE-COMPILATION */

const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>(
    "ContactMessage",
    ContactMessageSchema
  );

export default ContactMessage;