import { NextRequest, NextResponse } from "next/server";

import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import ContactMessage from "@/models/ContactMessage";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message ID.",
        },
        { status: 400 }
      );
    }

    const message =
      await ContactMessage.findById(id)
        .populate(
          "customer",
          "name email phone isActive createdAt"
        )
        .populate(
          "adminReply.repliedBy",
          "name email"
        )
        .lean();

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact message not found.",
        },
        { status: 404 }
      );
    }

    /* Automatically mark new message as read */

    if (message.status === "new") {
      await ContactMessage.findByIdAndUpdate(
        id,
        {
          $set: {
            status: "read",
          },
        }
      );

      message.status = "read";
    }

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error(
      "ADMIN_CONTACT_MESSAGE_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load contact message.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const admin = await requireAdmin();

    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existing =
      await ContactMessage.findById(id);

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact message not found.",
        },
        { status: 404 }
      );
    }

    const update: Record<string, any> = {};

    /* STATUS */

    if (body.status !== undefined) {
      const allowedStatuses = [
        "new",
        "read",
        "replied",
        "closed",
      ];

      if (
        !allowedStatuses.includes(body.status)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid message status.",
          },
          { status: 400 }
        );
      }

      update.status = body.status;
    }

    /* ADMIN REPLY */

    if (body.reply !== undefined) {
      const reply = String(body.reply || "").trim();

      if (!reply) {
        return NextResponse.json(
          {
            success: false,
            message: "Reply cannot be empty.",
          },
          { status: 400 }
        );
      }

      if (reply.length > 5000) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Reply cannot exceed 5000 characters.",
          },
          { status: 400 }
        );
      }

      let adminId: any = undefined;

      if (
        admin &&
        typeof admin === "object"
      ) {
        adminId =
          (admin as any)._id ||
          (admin as any).id;
      }

      update.adminReply = {
        message: reply,
        repliedBy: adminId,
        repliedAt: new Date(),
      };

      update.status = "replied";
    }

    /* REMOVE REPLY */

    if (body.clearReply === true) {
      update.$unset = {
        adminReply: 1,
      };

      if (
        body.status === undefined
      ) {
        update.status = "read";
      }
    }

    const updated =
      await ContactMessage.findByIdAndUpdate(
        id,
        update,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "adminReply.repliedBy",
          "name email"
        )
        .lean();

    return NextResponse.json({
      success: true,
      message:
        "Contact message updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error(
      "ADMIN_CONTACT_MESSAGE_PATCH_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update contact message.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message ID.",
        },
        { status: 400 }
      );
    }

    const deleted =
      await ContactMessage.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact message not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Contact message deleted successfully.",
    });
  } catch (error) {
    console.error(
      "ADMIN_CONTACT_MESSAGE_DELETE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete contact message.",
      },
      { status: 500 }
    );
  }
}