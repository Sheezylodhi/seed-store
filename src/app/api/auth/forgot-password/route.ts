import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { sendPasswordResetEmail } from "@/lib/mailer";

const RESET_TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes

const RESET_COOLDOWN = 60 * 1000; // 1 minute

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

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    /*
     * Basic validation
     */
    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    /*
     * IMPORTANT:
     *
     * We intentionally return the same response whether
     * the email exists or not.
     *
     * This prevents account/email enumeration.
     */

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists for this email, a password reset link has been sent.",
      });
    }

    /*
     * Disabled accounts should not receive reset links.
     *
     * Still return the same generic response.
     */
    if (!user.isActive) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists for this email, a password reset link has been sent.",
      });
    }

    /*
     * Prevent repeated reset emails every few seconds.
     */
    const recentReset =
      await PasswordReset.findOne({
        userId: user._id,
        createdAt: {
          $gte: new Date(
            Date.now() - RESET_COOLDOWN
          ),
        },
      });

    if (recentReset) {
      /*
       * Still don't reveal account-specific details.
       */
      return NextResponse.json({
        success: true,
        message:
          "If an account exists for this email, a password reset link has been sent.",
      });
    }

    /*
     * Invalidate older unused reset links.
     */
    await PasswordReset.updateMany(
      {
        userId: user._id,
        used: false,
      },
      {
        $set: {
          used: true,
        },
      }
    );

    /*
     * Generate a cryptographically secure token.
     */
    const rawToken =
      crypto.randomBytes(32).toString("hex");

    /*
     * Store ONLY the hash in MongoDB.
     */
    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date(
      Date.now() + RESET_TOKEN_EXPIRY
    );

    await PasswordReset.create({
      userId: user._id,
      email: user.email,
      tokenHash,
      expiresAt,
      used: false,
    });

    /*
     * Build reset URL.
     */
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "http://localhost:3000";

    const resetUrl =
      `${baseUrl}/reset-password?token=${encodeURIComponent(
        rawToken
      )}`;

    /*
     * Send email.
     */
    try {
      await sendPasswordResetEmail(
        user.email,
        user.name,
        resetUrl
      );
    } catch (emailError) {
      console.error(
        "PASSWORD RESET EMAIL ERROR:",
        emailError
      );

      /*
       * Remove token if email could not be sent.
       */
      await PasswordReset.deleteOne({
        tokenHash,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not send the reset email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account exists for this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}