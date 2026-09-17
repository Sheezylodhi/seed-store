import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Category from "@/models/Category";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET ALL CATEGORIES
export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const categories = await Category.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch categories.",
      },
      { status: 500 }
    );
  }
}

// CREATE CATEGORY
export async function POST(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();

    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const image = String(body.image || "").trim();
    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : true;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required.",
        },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid category slug could not be generated.",
        },
        { status: 400 }
      );
    }

    const existingName = await Category.findOne({
      name: {
        $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (existingName) {
      return NextResponse.json(
        {
          success: false,
          message: "A category with this name already exists.",
        },
        { status: 409 }
      );
    }

    const existingSlug = await Category.findOne({ slug });

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "A category with this slug already exists.",
        },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      description: description || undefined,
      image: image || undefined,
      isActive,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create category.",
      },
      { status: 500 }
    );
  }
}