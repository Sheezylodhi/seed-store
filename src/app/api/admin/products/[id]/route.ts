import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import Product from "@/models/Product";
import Category from "@/models/Category";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

/* =========================
   GET SINGLE PRODUCT
========================= */

export async function GET(
  _request: NextRequest,
  { params }: Context
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const product =
      await Product.findById(id)
        .populate("category", "name slug")
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

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load product.",
      },
      { status: 500 }
    );
  }
}

/* =========================
   UPDATE PRODUCT
========================= */

export async function PATCH(
  request: NextRequest,
  { params }: Context
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const product =
      await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    /* =========================
       BASIC INFORMATION
    ========================= */

    if (body.name !== undefined) {
      product.name = String(body.name).trim();
    }

    if (body.slug !== undefined) {
      const slug = String(body.slug)
        .trim()
        .toLowerCase();

      const duplicate =
        await Product.findOne({
          slug,
          _id: {
            $ne: id,
          },
        }).lean();

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another product already uses this slug.",
          },
          { status: 409 }
        );
      }

      product.slug = slug;
    }

    /* =========================
       CATEGORY
    ========================= */

    if (body.category !== undefined) {
      if (
        !mongoose.Types.ObjectId.isValid(
          body.category
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid category.",
          },
          { status: 400 }
        );
      }

      const categoryExists =
        await Category.exists({
          _id: body.category,
          isActive: true,
        });

      if (!categoryExists) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Category does not exist or is inactive.",
          },
          { status: 400 }
        );
      }

      product.category =
        body.category;
    }

    /* =========================
       PRODUCT TYPE
    ========================= */

    if (body.productType !== undefined) {
      const allowed = [
        "Phase 1",
        "Phase 2",
        "Complete Pack",
        "Single Seed",
      ];

      if (
        !allowed.includes(
          body.productType
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid product type.",
          },
          { status: 400 }
        );
      }

      product.productType =
        body.productType;
    }

    /* =========================
       DESCRIPTIONS
    ========================= */

    if (
      body.shortDescription !== undefined
    ) {
      product.shortDescription =
        String(
          body.shortDescription
        ).trim();
    }

    if (body.description !== undefined) {
      product.description =
        String(body.description).trim();
    }

    /* =========================
       IMAGES
    ========================= */

    if (Array.isArray(body.images)) {
      product.images =
        body.images
          .filter(
            (image: unknown) =>
              typeof image === "string" &&
              image.trim()
          )
          .map((image: string) =>
            image.trim()
          );
    }

    /* =========================
       SIMPLE PRODUCT PRICING
    ========================= */

    if (body.price !== undefined) {
      product.price =
        body.price === "" ||
        body.price === null
          ? undefined
          : Number(body.price);
    }

    if (
      body.compareAtPrice !== undefined
    ) {
      product.compareAtPrice =
        body.compareAtPrice === "" ||
        body.compareAtPrice === null
          ? undefined
          : Number(
              body.compareAtPrice
            );
    }

    if (body.stock !== undefined) {
      product.stock =
        body.stock === "" ||
        body.stock === null
          ? 0
          : Number(body.stock);
    }

    if (body.sku !== undefined) {
      product.sku =
        body.sku === "" ||
        body.sku === null
          ? undefined
          : String(body.sku)
              .trim()
              .toUpperCase();
    }

    /* =========================
       VARIANTS
    ========================= */

    if (Array.isArray(body.variants)) {
      product.variants =
        body.variants.map(
          (
            variant: {
              packSize?: string;
              price: number | string;
              compareAtPrice?:
                | number
                | string;
              stock?: number | string;
              sku?: string;
              isActive?: boolean;
            }
          ) => ({
            packSize:
              variant.packSize?.trim() ||
              undefined,

            price: Number(
              variant.price
            ),

            compareAtPrice:
              variant.compareAtPrice !==
                undefined &&
              variant.compareAtPrice !==
                ""
                ? Number(
                    variant.compareAtPrice
                  )
                : undefined,

            stock:
              Number(variant.stock) ||
              0,

            sku: String(
              variant.sku || ""
            )
              .trim()
              .toUpperCase(),

            isActive:
              variant.isActive !== false,
          })
        );
    }

    /* =========================
       PRODUCT DETAILS
    ========================= */

    if (
      Array.isArray(body.ingredients)
    ) {
      product.ingredients =
        cleanArray(
          body.ingredients
        );
    }

    if (
      Array.isArray(body.benefits)
    ) {
      product.benefits =
        cleanArray(
          body.benefits
        );
    }

    if (
      Array.isArray(body.howToUse)
    ) {
      product.howToUse =
        cleanArray(
          body.howToUse
        );
    }

    /* =========================
       DELIVERY SETTINGS
    ========================= */

    if (
      body.deliveryType !== undefined
    ) {
      const allowedDeliveryTypes = [
        "free",
        "paid",
      ];

      if (
        !allowedDeliveryTypes.includes(
          body.deliveryType
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid delivery type.",
          },
          { status: 400 }
        );
      }

      product.deliveryType =
        body.deliveryType;
    }

    if (
      body.deliveryCharge !== undefined
    ) {
      const deliveryCharge =
        body.deliveryCharge === "" ||
        body.deliveryCharge === null
          ? 0
          : Number(body.deliveryCharge);

      if (
        !Number.isFinite(
          deliveryCharge
        ) ||
        deliveryCharge < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Delivery charge must be a valid non-negative number.",
          },
          { status: 400 }
        );
      }

      product.deliveryCharge =
        deliveryCharge;
    }

    /* =========================
       VISIBILITY
    ========================= */

    if (
      body.isFeatured !== undefined
    ) {
      product.isFeatured =
        Boolean(body.isFeatured);
    }

    if (
      body.isActive !== undefined
    ) {
      product.isActive =
        Boolean(body.isActive);
    }

    /* =========================
       SEO
    ========================= */

    if (body.seo) {
      product.seo = {
        title:
          typeof body.seo.title ===
          "string"
            ? body.seo.title.trim() ||
              undefined
            : undefined,

        description:
          typeof body.seo.description ===
          "string"
            ? body.seo.description.trim() ||
              undefined
            : undefined,

        keywords: cleanArray(
          body.seo.keywords
        ),
      };
    }

    /* =========================
       SAVE
    ========================= */

    await product.save();

    const updated =
      await Product.findById(id)
        .populate(
          "category",
          "name slug"
        )
        .lean();

    return NextResponse.json({
      success: true,
      message:
        "Product updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE PRODUCT
========================= */

export async function DELETE(
  _request: NextRequest,
  { params }: Context
) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const product =
      await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

/* =========================
   CLEAN ARRAY
========================= */

function cleanArray(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is string =>
        typeof item === "string"
    )
    .map((item) => item.trim())
    .filter(Boolean);
}