import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import ContactMessage from "@/models/ContactMessage";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const status =
      searchParams.get("status") || "all";

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit")) || 10,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    /* SEARCH */

    if (search) {
      const regex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { subject: regex },
        { message: regex },
      ];
    }

    /* STATUS */

    if (
      ["new", "read", "replied", "closed"].includes(
        status
      )
    ) {
      query.status = status;
    }

    const [
      messages,
      total,
      newMessages,
      readMessages,
      repliedMessages,
      closedMessages,
    ] = await Promise.all([
      ContactMessage.find(query)
        .populate(
          "customer",
          "name email phone"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      ContactMessage.countDocuments(query),

      ContactMessage.countDocuments({
        ...query,
        status: "new",
      }),

      ContactMessage.countDocuments({
        ...query,
        status: "read",
      }),

      ContactMessage.countDocuments({
        ...query,
        status: "replied",
      }),

      ContactMessage.countDocuments({
        ...query,
        status: "closed",
      }),
    ]);

    const totalPages = Math.ceil(
      total / limit
    );

    return NextResponse.json({
      success: true,

      data: messages,

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      stats: {
        totalMessages: total,
        newMessages,
        readMessages,
        repliedMessages,
        closedMessages,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN_CONTACT_MESSAGES_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load contact messages.",
      },
      { status: 500 }
    );
  }
}