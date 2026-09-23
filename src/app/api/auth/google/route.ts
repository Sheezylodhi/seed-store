import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createSession } from "@/lib/auth";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const credential =
      typeof body?.credential === "string"
        ? body.credential.trim()
        : "";

    if (!credential) {
      return NextResponse.json(
        {
          success: false,
          message: "Google authentication failed.",
        },
        { status: 400 }
      );
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      console.error(
        "GOOGLE_CLIENT_ID is missing from environment variables."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Google login is not configured.",
        },
        { status: 500 }
      );
    }

    /*
     * Verify the ID token with Google.
     *
     * This checks that the token:
     * - was issued by Google
     * - is intended for our application
     * - is still valid
     */
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Google account information.",
        },
        { status: 401 }
      );
    }

    const googleId = payload.sub;
    const email = payload.email?.trim().toLowerCase();
    const name =
      payload.name?.trim() ||
      payload.given_name?.trim() ||
      "Google User";

    /*
     * We require a verified Google email.
     */
    if (!googleId || !email || payload.email_verified !== true) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your Google account email could not be verified.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    /*
     * ---------------------------------------------------------
     * 1. First try to find the account by Google ID.
     * ---------------------------------------------------------
     */
    let user = await User.findOne({
      googleId,
    });

    /*
     * ---------------------------------------------------------
     * 2. If Google ID is not linked yet, check email.
     *
     * This allows an existing email/password customer to use
     * Google login with the same verified email.
     * ---------------------------------------------------------
     */
    if (!user) {
      user = await User.findOne({
        email,
      });

      if (user) {
        /*
         * Existing account found.
         *
         * If this Google account is not linked yet, link it.
         *
         * The Google email has already been verified above.
         */
        if (user.googleId && user.googleId !== googleId) {
          return NextResponse.json(
            {
              success: false,
              message:
                "This email is already linked to another Google account.",
            },
            { status: 409 }
          );
        }

        user.googleId = googleId;

        /*
         * Don't replace the customer's existing name.
         * Don't replace their password.
         * Don't change their role.
         */
        await user.save();
      }
    }

    /*
     * ---------------------------------------------------------
     * 3. New Google customer.
     * ---------------------------------------------------------
     */
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,

        /*
         * IMPORTANT:
         * Google-created accounts are always customers.
         */
        role: "customer",

        isActive: true,
      });
    }

    /*
     * ---------------------------------------------------------
     * 4. Check account status.
     * ---------------------------------------------------------
     */
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This account is currently unavailable.",
        },
        { status: 403 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 5. Create our normal database-backed session.
     *
     * Google authentication is finished at this point.
     * From here onward the app uses the same session system
     * as normal email/password login.
     * ---------------------------------------------------------
     */
    await createSession(
      user._id.toString(),
      request
    );

    /*
     * IMPORTANT:
     * Role comes from MongoDB.
     * Google cannot choose or modify it.
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
    console.error("GOOGLE_LOGIN_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to sign in with Google. Please try again.",
      },
      { status: 500 }
    );
  }
}