import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Invalid password"),
});

/*
 * ---------------------------------------------------------
 * Legacy password support
 *
 * Older customer accounts may have passwords stored using:
 *
 * SHA-256(password + PASSWORD_PEPPER)
 *
 * New / reset passwords use bcrypt.
 * ---------------------------------------------------------
 */
function hashLegacyPassword(password: string): string {
  const pepper = process.env.PASSWORD_PEPPER || "";

  return crypto
    .createHash("sha256")
    .update(password + pepper)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your email and password.",
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    await connectDB();

    /*
     * Password is select:false in the User model,
     * therefore explicitly include it.
     */
    const user = await User.findOne({
      email,
    }).select("+password");

    /*
     * Same generic error for:
     * - account not found
     * - wrong password
     */
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    /*
     * Disabled accounts cannot login.
     */
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "This account is currently unavailable.",
        },
        { status: 403 }
      );
    }

    /*
     * ---------------------------------------------------------
     * PASSWORD CHECK
     * ---------------------------------------------------------
     *
     * Google-created users may not have a password.
     *
     * Therefore we MUST check that password exists before
     * passing it to bcrypt.compare().
     *
     * This also fixes the Vercel TypeScript error caused by:
     *
     * user.password
     *
     * being typed as string | undefined.
     * ---------------------------------------------------------
     */

    let passwordMatch = false;

    if (
      typeof user.password === "string" &&
      user.password.length > 0
    ) {
      try {
        passwordMatch = await bcrypt.compare(
          password,
          user.password
        );
      } catch (error) {
        console.error(
          "BCRYPT_COMPARE_ERROR:",
          error
        );

        passwordMatch = false;
      }
    }

    /*
     * ---------------------------------------------------------
     * LEGACY SHA-256 PASSWORD SUPPORT
     * ---------------------------------------------------------
     *
     * If bcrypt didn't match, check the old SHA-256
     * + PASSWORD_PEPPER password format.
     * ---------------------------------------------------------
     */

    let usedLegacyPassword = false;

    if (!passwordMatch) {
      const legacyHash =
        hashLegacyPassword(password);

      if (
        typeof user.password === "string" &&
        legacyHash === user.password
      ) {
        passwordMatch = true;
        usedLegacyPassword = true;
      }
    }

    /*
     * ---------------------------------------------------------
     * PASSWORD INVALID
     * ---------------------------------------------------------
     */

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    /*
     * ---------------------------------------------------------
     * UPGRADE LEGACY PASSWORD TO BCRYPT
     * ---------------------------------------------------------
     *
     * Once an old account successfully logs in,
     * replace its legacy SHA-256 password with bcrypt.
     *
     * Future logins will use bcrypt directly.
     * ---------------------------------------------------------
     */

    if (usedLegacyPassword) {
      const newPasswordHash =
        await bcrypt.hash(password, 12);

      await User.updateOne(
        {
          _id: user._id,
        },
        {
          $set: {
            password: newPasswordHash,
          },
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * CREATE SECURE DATABASE-BACKED SESSION
     * ---------------------------------------------------------
     */

    await createSession(
      user._id.toString(),
      request
    );

    /*
     * ---------------------------------------------------------
     * RETURN AUTHENTICATED USER
     * ---------------------------------------------------------
     *
     * Role always comes from MongoDB.
     * The client cannot choose the role.
     * ---------------------------------------------------------
     */

    return NextResponse.json({
      success: true,

      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

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