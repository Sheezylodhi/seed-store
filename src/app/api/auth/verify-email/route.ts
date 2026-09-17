import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import EmailVerification from "@/models/EmailVerification";
import { createSession } from "@/lib/auth";

const MAX_ATTEMPTS = 5;

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

    const otp = String(body.otp || "")
      .trim();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter the 6-digit code.",
        },
        { status: 400 }
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
            "Verification request not found or has expired. Please register again.",
        },
        { status: 404 }
      );
    }

    if (
      verification.expiresAt.getTime() <
      Date.now()
    ) {
      await EmailVerification.deleteOne({
        _id: verification._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "This verification code has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    if (
      verification.attempts >= MAX_ATTEMPTS
    ) {
      await EmailVerification.deleteOne({
        _id: verification._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Too many incorrect attempts. Please register again.",
        },
        { status: 429 }
      );
    }

    const incomingHash = hashOTP(otp);

    const valid =
      incomingHash === verification.otpHash;

    if (!valid) {
      verification.attempts += 1;
      await verification.save();

      const remaining =
        MAX_ATTEMPTS - verification.attempts;

      return NextResponse.json(
        {
          success: false,
          message:
            remaining > 0
              ? `Incorrect verification code. ${remaining} attempts remaining.`
              : "Too many incorrect attempts. Please register again.",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      await EmailVerification.deleteOne({
        _id: verification._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists. Please log in.",
        },
        { status: 409 }
      );
    }

    const user = await User.create({
      name: verification.name,
      email: verification.email,
      password: verification.passwordHash,
      phone: verification.phone,
      role: "customer",
      isActive: true,
    });

    await EmailVerification.deleteOne({
      _id: verification._id,
    });

    await createSession(
      user._id.toString(),
      request
    );

    return NextResponse.json({
      success: true,
      message:
        "Email verified successfully. Your account has been created.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "VERIFY EMAIL ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to verify your email. Please try again.",
      },
      { status: 500 }
    );
  }
}