import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export interface ISession extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },

    userAgent: {
      type: String,
      maxlength: 1000,
    },

    ipAddress: {
      type: String,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * MongoDB automatically removes expired sessions.
 */
SessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const Session: Model<ISession> =
  mongoose.models.Session ||
  mongoose.model<ISession>("Session", SessionSchema);

export default Session;