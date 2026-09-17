import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import EmailVerification from "@/models/EmailVerification";
import { sendVerificationEmail } from "@/lib/mailer";

const OTP_EXPIRY = 10 * 60 * 1000;
const RESEND_COOLDOWN = 60 * 1000;

function generateOTP() {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
}

function hashOTP(otp: string) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists. Please log in.",
        },
        { status: 409 }
      );
    }

    const verification =
      await EmailVerification.findOne({
        email,
      });

    if (!verification) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification request not found. Please register again.",
        },
        { status: 404 }
      );
    }

    const elapsed =
      Date.now() -
      verification.lastSentAt.getTime();

    if (elapsed < RESEND_COOLDOWN) {
      const seconds = Math.ceil(
        (RESEND_COOLDOWN - elapsed) / 1000
      );

      return NextResponse.json(
        {
          success: false,
          message: `Please wait ${seconds} seconds before requesting another code.`,
        },
        { status: 429 }
      );
    }

    const otp = generateOTP();

    verification.otpHash = hashOTP(otp);
    verification.expiresAt = new Date(
      Date.now() + OTP_EXPIRY
    );
    verification.attempts = 0;
    verification.lastSentAt = new Date();

    await verification.save();

    try {
      await sendVerificationEmail(
        verification.email,
        verification.name,
        otp
      );
    } catch (emailError) {
      console.error(
        "RESEND EMAIL ERROR:",
        emailError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send the verification email.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "A new verification code has been sent.",
    });
  } catch (error) {
    console.error(
      "RESEND VERIFICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to resend verification code.",
      },
      { status: 500 }
    );
  }
}