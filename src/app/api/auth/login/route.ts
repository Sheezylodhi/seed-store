
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Invalid password"),
});

/*
 * Legacy password support
 *
 * Your older customer accounts may have passwords stored
 * using SHA-256 + PASSWORD_PEPPER instead of bcrypt.
 *
 * New passwords should use bcrypt.
 */
function hashLegacyPassword(password: string) {
  const pepper = process.env.PASSWORD_PEPPER || "";

  return crypto
    .createHash("sha256")
    .update(password + pepper)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your email and password.",
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    await connectDB();

    /*
     * Password is select:false in the User model,
     * therefore we explicitly include it here.
     */
    const user = await User.findOne({
      email,
    }).select("+password");

    /*
     * Same error for non-existing email and wrong password.
     */
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    /*
     * Do not allow disabled accounts to login.
     */
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "This account is currently unavailable.",
        },
        { status: 403 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 1. Try normal bcrypt password verification.
     * ---------------------------------------------------------
     */
    let passwordMatch = false;

    try {
      passwordMatch = await bcrypt.compare(
        password,
        user.password
      );
    } catch {
      passwordMatch = false;
    }

    /*
     * ---------------------------------------------------------
     * 2. Legacy SHA-256 password support.
     *
     * This allows older customer accounts to login if their
     * password was created using the old SHA-256 + pepper flow.
     * ---------------------------------------------------------
     */
    let usedLegacyPassword = false;

    if (!passwordMatch) {
      const legacyHash = hashLegacyPassword(password);

      if (legacyHash === user.password) {
        passwordMatch = true;
        usedLegacyPassword = true;
      }
    }

    /*
     * Password is incorrect.
     */
    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 3. Automatically upgrade legacy password to bcrypt.
     *
     * After the customer's first successful login, their old
     * SHA-256 password is replaced with a bcrypt hash.
     *
     * Next login will use bcrypt normally.
     * ---------------------------------------------------------
     */
    if (usedLegacyPassword) {
      const newPasswordHash = await bcrypt.hash(
        password,
        12
      );

      await User.updateOne(
        {
          _id: user._id,
        },
        {
          $set: {
            password: newPasswordHash,
          },
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * 4. Create secure database-backed session.
     * ---------------------------------------------------------
     *
     * The actual session token is stored in an httpOnly cookie
     * by createSession().
     *
     * The browser never receives the raw session token.
     */
    await createSession(
      user._id.toString(),
      request
    );

    /*
     * ---------------------------------------------------------
     * 5. Return authenticated user information.
     *
     * IMPORTANT:
     * The role comes from MongoDB.
     * The client cannot choose or modify it.
     * ---------------------------------------------------------
     */
    return NextResponse.json({
      success: true,

      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

