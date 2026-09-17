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

function hashPassword(password: string) {
  return crypto
    .createHash("sha256")
    .update(
      password + process.env.PASSWORD_PEPPER
    )
    .digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const name = String(body.name || "").trim();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    const phone = String(body.phone || "").trim();

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your full name.",
        },
        { status: 400 }
      );
    }

    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (phone.length > 30) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is too long.",
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
            "An account with this email already exists. Please log in instead.",
        },
        { status: 409 }
      );
    }

    const existingVerification =
      await EmailVerification.findOne({
        email,
      });

    if (existingVerification) {
      const elapsed =
        Date.now() -
        existingVerification.lastSentAt.getTime();

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

      await EmailVerification.deleteOne({
        _id: existingVerification._id,
      });
    }

    const otp = generateOTP();
    const otpHash = hashOTP(otp);

    const passwordHash = hashPassword(password);

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY
    );

    await EmailVerification.create({
      email,
      name,
      phone: phone || undefined,
      passwordHash,
      otpHash,
      expiresAt,
      attempts: 0,
      lastSentAt: new Date(),
    });

    try {
      await sendVerificationEmail(
        email,
        name,
        otp
      );
    } catch (emailError) {
      console.error(
        "VERIFICATION EMAIL ERROR:",
        emailError
      );

      await EmailVerification.deleteOne({
        email,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not send the verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message:
        "Verification code sent to your email.",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to start registration. Please try again.",
      },
      { status: 500 }
    );
  }
}