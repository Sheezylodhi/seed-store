import crypto from "crypto";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";

const SESSION_COOKIE =
  process.env.SESSION_COOKIE_NAME || "seedstore_session";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(
  userId: string,
  request?: Request
) {
  await connectDB();

  const token = generateToken();
  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION
  );

  await Session.create({
    user: userId,
    tokenHash,
    expiresAt,
    userAgent: request?.headers.get("user-agent") || undefined,
    ipAddress:
      request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request?.headers.get("x-real-ip") ||
      undefined,
  });

  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: expiresAt,
    path: "/",
  });

  return expiresAt;
}

export async function getCurrentUser() {
  try {
    await connectDB();

    const cookieStore = await cookies();

    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) {
      return null;
    }

    const tokenHash = hashToken(token);

    const session = await Session.findOne({
      tokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!session) {
      return null;
    }

    const user = await User.findOne({
      _id: session.user,
      isActive: true,
    })
      .select("_id name email phone role isActive")
      .lean();

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      sessionId: session._id.toString(),
    };
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function destroyCurrentSession() {
  await connectDB();

  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = hashToken(token);

    await Session.updateOne(
      {
        tokenHash,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      }
    );
  }

  cookieStore.delete(SESSION_COOKIE);
}