import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your name.",
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your email.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!message || message.length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a message.",
        },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name cannot exceed 100 characters.",
        },
        { status: 400 }
      );
    }

    if (email.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "Email cannot exceed 150 characters.",
        },
        { status: 400 }
      );
    }

    if (phone.length > 30) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number cannot exceed 30 characters.",
        },
        { status: 400 }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject cannot exceed 200 characters.",
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "Message cannot exceed 5000 characters.",
        },
        { status: 400 }
      );
    }

    /**
     * Try to associate the message with an existing customer.
     * Guest users simply remain without a customer reference.
     */
    const customer = await User.findOne({
      email,
      role: "customer",
    })
      .select("_id")
      .lean();

    const contactMessage = await ContactMessage.create({
      ...(customer?._id ? { customer: customer._id } : {}),
      name,
      email,
      ...(phone ? { phone } : {}),
      ...(subject ? { subject } : {}),
      message,
      status: "new",
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been sent successfully. We'll get back to you soon.",
        data: {
          id: contactMessage._id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}