
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import {
  sendOrderReminderEmail,
  sendOrderFinalFollowUpEmail,
} from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type JobType = "reminder" | "followup";

async function processDueOrders(type: JobType, now: Date) {
  const isReminder = type === "reminder";

  const dueField = isReminder ? "reminderDueAt" : "followUpDueAt";
  const statusField = isReminder ? "reminderStatus" : "followUpStatus";
  const attemptsField = isReminder ? "reminderAttempts" : "followUpAttempts";
  const sentAtField = isReminder ? "reminderSentAt" : "followUpSentAt";

  const dueOrders = await Order.find({
    [dueField]: { $lte: now },
    [statusField]: { $in: ["pending", "failed"] },
    orderStatus: { $ne: "cancelled" },
    "customerInfo.email": { $exists: true, $ne: "" },
  })
    .sort({ [dueField]: 1 })
    .limit(50)
    .select("_id orderNumber customerInfo items reminderDueAt followUpDueAt")
    .lean();

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const candidate of dueOrders) {
    const order = await Order.findOneAndUpdate(
      {
        _id: candidate._id,
        [dueField]: { $lte: now },
        [statusField]: { $in: ["pending", "failed"] },
        orderStatus: { $ne: "cancelled" },
      },
      {
        $set: { [statusField]: "sending" },
        $inc: { [attemptsField]: 1 },
      },
      { new: true }
    );

    if (!order) {
      skipped++;
      continue;
    }

    try {
      const email = order.customerInfo?.email?.trim();

      if (!email) {
        await Order.updateOne(
          { _id: order._id, [statusField]: "sending" },
          { $set: { [statusField]: "skipped" } }
        );
        skipped++;
        continue;
      }

      const firstName = order.customerInfo?.firstName ?? "";
      const lastName = order.customerInfo?.lastName ?? "";
      const name = `${firstName} ${lastName}`.trim() || "there";

      const emailOrder = {
        orderNumber: order.orderNumber,
        customerName: name,
        items: order.items.map((item) => ({
          name: item.name,
          packSize: item.packSize,
          quantity: item.quantity,
        })),
      };

      if (isReminder) {
        await sendOrderReminderEmail(email, name, emailOrder);
      } else {
        await sendOrderFinalFollowUpEmail(email, name, emailOrder);
      }

      await Order.updateOne(
        { _id: order._id, [statusField]: "sending" },
        {
          $set: {
            [statusField]: "sent",
            [sentAtField]: new Date(),
          },
        }
      );

      sent++;
    } catch (error) {
      console.error(
        `Seedra ${type} failed for order ${order.orderNumber}:`,
        error
      );

      await Order.updateOne(
        { _id: order._id, [statusField]: "sending" },
        { $set: { [statusField]: "failed" } }
      );

      failed++;
    }
  }

  return {
    processed: dueOrders.length,
    sent,
    failed,
    skipped,
  };
}

export async function GET(request: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET;

    if (!secret) {
      return NextResponse.json(
        { success: false, message: "CRON_SECRET is not configured." },
        { status: 500 }
      );
    }

    if (request.headers.get("authorization") !== `Bearer ${secret}`) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    await connectDB();

    const now = new Date();

    const reminder = await processDueOrders("reminder", now);
    const followup = await processDueOrders("followup", now);

    return NextResponse.json({
      success: true,
      message: "Seedra email jobs completed.",
      reminder,
      followup,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Seedra cron error:", error);

    return NextResponse.json(
      { success: false, message: "Reminder job failed." },
      { status: 500 }
    );
  }
}