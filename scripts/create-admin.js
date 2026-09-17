const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

/* ADMIN DETAILS */
const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "zaib@gmail.com";
const ADMIN_PASSWORD = "zaib123";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected.");

    /* CHECK IF ADMIN ALREADY EXISTS */
    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log(
        `Admin already exists with email: ${ADMIN_EMAIL}`
      );

      await mongoose.disconnect();
      return;
    }

    /* HASH PASSWORD */
    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      12
    );

    /* CREATE ADMIN */
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("");
    console.log("=================================");
    console.log("       ADMIN CREATED SUCCESSFULLY");
    console.log("=================================");
    console.log("");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log("");
    console.log("Admin password was hashed before saving.");
    console.log("");
    
    await mongoose.disconnect();

    console.log("MongoDB disconnected.");
  } catch (error) {
    console.error("");
    console.error("Failed to create admin.");
    console.error(error);
    console.error("");

    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();
