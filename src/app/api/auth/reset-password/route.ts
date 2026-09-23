import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";

const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "Reset token is required."),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters."
    )
    .max(128, "Password is too long."),

  confirmPassword: z
    .string()
    .min(
      8,
      "Please confirm your password."
    )
    .max(128, "Password is too long."),
});

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const result =
      resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid password.",
        },
        { status: 400 }
      );
    }

    const {
      token,
      password,
      confirmPassword,
    } = result.data;

    /*
     * Password confirmation
     */
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    /*
     * Hash incoming token and search DB.
     */
    const tokenHash = hashToken(token);

    const resetRequest =
      await PasswordReset.findOne({
        tokenHash,
        used: false,
      });

    if (!resetRequest) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link is invalid or has already been used.",
        },
        { status: 400 }
      );
    }

    /*
     * Check expiry.
     */
    if (
      resetRequest.expiresAt.getTime() <
      Date.now()
    ) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset link has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    /*
     * Find user.
     */
    const user = await User.findById(
      resetRequest.userId
    );

    if (!user) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to reset this account. Please request a new link.",
        },
        { status: 400 }
      );
    }

    /*
     * Do not allow disabled accounts to change password.
     */
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This account is currently unavailable.",
        },
        { status: 403 }
      );
    }

    /*
     * Hash new password with bcrypt.
     *
     * This also upgrades old SHA-256 accounts to bcrypt
     * when they use Forgot Password.
     */
    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    user.password = passwordHash;

    await user.save();

    /*
     * Mark this token as used.
     */
    await PasswordReset.updateOne(
      {
        _id: resetRequest._id,
      },
      {
        $set: {
          used: true,
        },
      }
    );

    /*
     * Invalidate all other reset links for this user.
     */
    await PasswordReset.updateMany(
      {
        userId: user._id,
        _id: {
          $ne: resetRequest._id,
        },
        used: false,
      },
      {
        $set: {
          used: true,
        },
      }
    );

    /*
     * IMPORTANT:
     *
     * We do NOT automatically log the user in.
     * They must sign in with their new password.
     */
    return NextResponse.json({
      success: true,
      message:
        "Your password has been reset successfully.",
    });
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to reset your password. Please try again.",
      },
      { status: 500 }
    );
  }
}