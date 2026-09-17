import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import Product from "@/models/Product";
import Category from "@/models/Category";

const productTypes = [
  "Phase 1",
  "Phase 2",
  "Complete Pack",
  "Single Seed",
] as const;

const deliveryTypes = [
  "free",
  "paid",
] as const;

type IProductVariantPayload = {
  packSize?: string;
  price: number | string;
  compareAtPrice?: number | string;
  stock?: number | string;
  sku?: string;
  isActive?: boolean;
};

/* =========================
   GET PRODUCTS
========================= */

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search")?.trim() || "";

    const status =
      searchParams.get("status") || "all";

    const page = Math.max(
      Number(searchParams.get("page") || 1),
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit") || 10),
        1
      ),
      100
    );

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          sku: {
            $regex: search,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    if (status === "featured") {
      filter.isFeatured = true;
    }

    const skip = (page - 1) * limit;

    const [
      products,
      total,
      categories,
    ] = await Promise.all([
      Product.find(filter)
        .populate(
          "category",
          "name slug"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(filter),

      Category.find({
        isActive: true,
      })
        .select(
          "_id name slug isActive"
        )
        .sort({
          name: 1,
        })
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        categories,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(
            total / limit
          ),
        },
      },
    });
  } catch (error) {
    console.error(
      "GET ADMIN PRODUCTS ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to load products";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status:
          message
            .toLowerCase()
            .includes("unauthorized")
            ? 401
            : message
                .toLowerCase()
                .includes("forbidden")
            ? 403
            : 500,
      }
    );
  }
}

/* =========================
   CREATE PRODUCT
========================= */

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      slug,
      category,
      productType,
      shortDescription,
      description,
      images,
      price,
      compareAtPrice,
      stock,
      sku,
      variants,
      deliveryType,
      deliveryCharge,
      ingredients,
      benefits,
      howToUse,
      isFeatured,
      isActive,
      seo,
    } = body;

    // =========================
    // BASIC VALIDATION
    // =========================

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (!slug?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category is required.",
        },
        { status: 400 }
      );
    }

    if (!productType) {
      return NextResponse.json(
        {
          success: false,
          message: "Product type is required.",
        },
        { status: 400 }
      );
    }

    // =========================
    // DELIVERY
    // =========================

    const finalDeliveryType =
      deliveryType === "paid"
        ? "paid"
        : "free";

    let finalDeliveryCharge = 0;

    if (finalDeliveryType === "paid") {
      const parsedCharge =
        Number(deliveryCharge);

      if (
        deliveryCharge === undefined ||
        deliveryCharge === null ||
        deliveryCharge === "" ||
        !Number.isFinite(parsedCharge) ||
        parsedCharge < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A valid delivery charge is required for paid delivery.",
          },
          { status: 400 }
        );
      }

      finalDeliveryCharge = parsedCharge;
    }

    // =========================
    // DEBUG
    // =========================

    console.log(
      "=============================="
    );

    console.log(
      "DELIVERY FROM FRONTEND:",
      {
        deliveryType,
        deliveryCharge,
      }
    );

    console.log(
      "DELIVERY FINAL:",
      {
        finalDeliveryType,
        finalDeliveryCharge,
      }
    );

    // =========================
    // CREATE PRODUCT
    // =========================

    const product = await Product.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),

      category,

      productType,

      shortDescription:
        shortDescription?.trim() || "",

      description:
        description?.trim() || "",

      images: Array.isArray(images)
        ? images
        : [],

      price:
        price !== undefined &&
        price !== null &&
        price !== ""
          ? Number(price)
          : undefined,

      compareAtPrice:
        compareAtPrice !== undefined &&
        compareAtPrice !== null &&
        compareAtPrice !== ""
          ? Number(compareAtPrice)
          : undefined,

      stock:
        stock !== undefined &&
        stock !== null &&
        stock !== ""
          ? Number(stock)
          : undefined,

      sku: sku?.trim() || undefined,

      variants:
        Array.isArray(variants)
          ? variants
          : [],

      // =========================
      // DELIVERY
      // =========================

      deliveryType:
        finalDeliveryType,

      deliveryCharge:
        finalDeliveryCharge,

      ingredients:
        Array.isArray(ingredients)
          ? ingredients
          : [],

      benefits:
        Array.isArray(benefits)
          ? benefits
          : [],

      howToUse:
        Array.isArray(howToUse)
          ? howToUse
          : [],

      isFeatured:
        Boolean(isFeatured),

      isActive:
        isActive === undefined
          ? true
          : Boolean(isActive),

      seo: {
        title:
          seo?.title?.trim() || "",

        description:
          seo?.description?.trim() || "",

        keywords:
          Array.isArray(
            seo?.keywords
          )
            ? seo.keywords
            : [],
      },
    });

    // =========================
    // VERIFY SAVED DATA
    // =========================

    console.log(
      "DELIVERY SAVED:",
      {
        deliveryType:
          product.deliveryType,

        deliveryCharge:
          product.deliveryCharge,
      }
    );

    console.log(
      "=============================="
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Product created successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    if (
      error?.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A product with this slug already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to create product.",
      },
      { status: 500 }
    );
  }
}

/* =========================
   HELPERS
========================= */

function cleanStringArray(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (
        item
      ): item is string =>
        typeof item ===
        "string"
    )
    .map(
      (item) =>
        item.trim()
    )
    .filter(Boolean);
}