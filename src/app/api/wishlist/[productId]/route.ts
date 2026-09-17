import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

import Wishlist from "@/models/Wishlist";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await requireAuth();

    await connectDB();

    const { productId } = await context.params;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    if (!/^[a-f\d]{24}$/i.test(productId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      {
        user: user.id,
      },
      {
        $pull: {
          products: productId,
        },
      },
      {
        new: true,
      }
    ).lean();

    return NextResponse.json({
      success: true,
      wishlisted: false,
      count: wishlist?.products?.length || 0,
      message: "Product removed from wishlist.",
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to manage your wishlist.",
        },
        { status: 401 }
      );
    }

    console.error(
      "DELETE /api/wishlist/[productId] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove product.",
      },
      { status: 500 }
    );
  }
}