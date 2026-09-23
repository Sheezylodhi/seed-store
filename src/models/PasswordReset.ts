import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const PasswordResetSchema =
  new Schema<IPasswordReset>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      expiresAt: {
        type: Date,
        required: true,
        index: true,
      },

      used: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
    }
  );

/*
 * Automatically remove expired reset records.
 */
PasswordResetSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const PasswordReset: Model<IPasswordReset> =
  mongoose.models.PasswordReset ||
  mongoose.model<IPasswordReset>(
    "PasswordReset",
    PasswordResetSchema
  );

export default PasswordReset;