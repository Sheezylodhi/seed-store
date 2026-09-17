import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";

export async function GET() {
  try {
    const user = await requireAuth();

    await connectDB();

    const wishlist = await Wishlist.findOne({
      user: user.id,
    })
      .populate({
        path: "products",
        model: Product,
        match: {
          isActive: true,
        },
        select:
          "_id name slug images price compareAtPrice stock variants shortDescription isFeatured isActive createdAt",
      })
      .lean();

    if (!wishlist) {
      return NextResponse.json({
        success: true,
        products: [],
        productIds: [],
        count: 0,
      });
    }

    const products = (wishlist.products || []).filter(Boolean);

    const productIds = products.map((product: any) =>
      product._id.toString()
    );

    return NextResponse.json({
      success: true,
      products,
      productIds,
      count: products.length,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to view your wishlist.",
        },
        { status: 401 }
      );
    }

    console.error("GET /api/wishlist error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load wishlist.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();

    await connectDB();

    const body = await request.json();

    const productId = body?.productId;

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

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    let wishlist = await Wishlist.findOne({
      user: user.id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: user.id,
        products: [productId],
      });

      return NextResponse.json({
        success: true,
        action: "added",
        wishlisted: true,
        count: 1,
        message: "Added to wishlist.",
      });
    }

    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );

      await wishlist.save();

      return NextResponse.json({
        success: true,
        action: "removed",
        wishlisted: false,
        count: wishlist.products.length,
        message: "Removed from wishlist.",
      });
    }

    wishlist.products.push(product._id);

    await wishlist.save();

    return NextResponse.json({
      success: true,
      action: "added",
      wishlisted: true,
      count: wishlist.products.length,
      message: "Added to wishlist.",
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "Please login to add products to your wishlist.",
        },
        { status: 401 }
      );
    }

    console.error("POST /api/wishlist error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update wishlist.",
      },
      { status: 500 }
    );
  }
}