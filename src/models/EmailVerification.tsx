import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IEmailVerification extends Document {
  email: string;
  name: string;
  phone?: string;
  passwordHash: string;

  otpHash: string;

  expiresAt: Date;

  attempts: number;
  lastSentAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationSchema =
  new Schema<IEmailVerification>(
    {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        trim: true,
      },

      passwordHash: {
        type: String,
        required: true,
      },

      otpHash: {
        type: String,
        required: true,
      },

      expiresAt: {
        type: Date,
        required: true,
        index: true,
      },

      attempts: {
        type: Number,
        default: 0,
      },

      lastSentAt: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

EmailVerificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const EmailVerification: Model<IEmailVerification> =
  mongoose.models.EmailVerification ||
  mongoose.model<IEmailVerification>(
    "EmailVerification",
    EmailVerificationSchema
  );

export default EmailVerification;