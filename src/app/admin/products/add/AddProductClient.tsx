"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  DollarSign,
  ImageIcon,
  Layers,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  Type,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import ProductImageUploader from "@/components/admin/ProductImageUploader";

type Category = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

type Variant = {
  packSize: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  sku: string;
  isActive: boolean;
};

const PRODUCT_TYPES = [
  "Phase 1",
  "Phase 2",
  "Complete Pack",
  "Single Seed",
];

const slugify = (
  value: string
) => {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    )
    .replace(
      /^-|-$/g,
      ""
    );
};
const splitLines = (value: string): string[] => {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};
const emptyVariant =
  (): Variant => ({
    packSize: "",
    price: "",
    compareAtPrice: "",
    stock: "0",
    sku: "",
    isActive: true,
  });

export default function AddProductClient() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [imagesUploading, setImagesUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [slugEdited, setSlugEdited] =
    useState(false);

  const [description, setDescription] =
    useState("");

  const [shortDescription, setShortDescription] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [productType, setProductType] =
    useState("Single Seed");

  const [images, setImages] =
    useState<string[]>([]);

  const [price, setPrice] =
    useState("");

  const [compareAtPrice, setCompareAtPrice] =
    useState("");

  const [stock, setStock] =
    useState("0");

  const [sku, setSku] =
    useState("");

  const [useVariants, setUseVariants] =
    useState(false);

  const [variants, setVariants] =
    useState<Variant[]>([]);

  /* =========================
     DELIVERY
  ========================= */

  const [deliveryType, setDeliveryType] =
    useState<"free" | "paid">(
      "free"
    );

  const [deliveryCharge, setDeliveryCharge] =
    useState("");

  const [ingredients, setIngredients] =
    useState("");

  const [benefits, setBenefits] =
    useState("");

  const [howToUse, setHowToUse] =
    useState("");

  const [seoTitle, setSeoTitle] =
    useState("");

  const [seoDescription, setSeoDescription] =
    useState("");

  const [seoKeywords, setSeoKeywords] =
    useState("");

  const [isFeatured, setIsFeatured] =
    useState(false);

  const [isActive, setIsActive] =
    useState(true);

  /* =========================
     LOAD CATEGORIES
  ========================= */

  useEffect(() => {
    const loadCategories =
      async () => {
        try {
          setLoadingCategories(
            true
          );

          const response =
            await fetch(
              "/api/admin/products",
              {
                credentials:
                  "include",
                cache: "no-store",
              }
            );

          const result =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.message ||
                "Failed to load categories."
            );
          }

          setCategories(
            result.data
              ?.categories || []
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load categories."
          );
        } finally {
          setLoadingCategories(
            false
          );
        }
      };

    loadCategories();
  }, []);

  /* =========================
     AUTO SLUG
  ========================= */

  useEffect(() => {
    if (!slugEdited) {
      setSlug(
        slugify(name)
      );
    }
  }, [
    name,
    slugEdited,
  ]);

  /* =========================
     VARIANTS
  ========================= */

  const addVariant = () => {
    setVariants(
      (current) => [
        ...current,
        emptyVariant(),
      ]
    );
  };

  const removeVariant = (
    index: number
  ) => {
    setVariants(
      (current) =>
        current.filter(
          (_, i) =>
            i !== index
        )
    );
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value:
      | string
      | boolean
  ) => {
    setVariants(
      (current) =>
        current.map(
          (
            variant,
            i
          ) =>
            i === index
              ? {
                  ...variant,
                  [field]:
                    value,
                }
              : variant
        )
    );
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit =
    async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (imagesUploading) {
        setError(
          "Please wait until all images finish uploading."
        );
        return;
      }

      if (!name.trim()) {
        setError(
          "Product name is required."
        );
        return;
      }

      if (!category) {
        setError(
          "Please select a category."
        );
        return;
      }

      if (!productType) {
        setError(
          "Please select a product type."
        );
        return;
      }

      if (
        !useVariants &&
        !price.trim()
      ) {
        setError(
          "Price is required for a simple product."
        );
        return;
      }

      if (
        !useVariants &&
        !sku.trim()
      ) {
        setError(
          "SKU is required for a simple product."
        );
        return;
      }

      if (
        useVariants &&
        variants.length ===
          0
      ) {
        setError(
          "Add at least one variant."
        );
        return;
      }

      if (useVariants) {
        for (
          let i = 0;
          i <
          variants.length;
          i++
        ) {
          const variant =
            variants[i];

          if (
            !variant.price.trim()
          ) {
            setError(
              `Variant ${
                i + 1
              } price is required.`
            );
            return;
          }

          if (
            !variant.sku.trim()
          ) {
            setError(
              `Variant ${
                i + 1
              } SKU is required.`
            );
            return;
          }
        }
      }

      /* =========================
         DELIVERY VALIDATION
      ========================= */

      let finalDeliveryCharge = 0;

      if (
        deliveryType ===
        "paid"
      ) {
        const charge =
          Number(
            deliveryCharge
          );

        if (
          !deliveryCharge.trim() ||
          !Number.isFinite(
            charge
          ) ||
          charge < 0
        ) {
          setError(
            "Please enter a valid delivery charge."
          );
          return;
        }

        finalDeliveryCharge =
          charge;
      }

      /*
        IMPORTANT:

        Always send both delivery fields.

        FREE:
        deliveryType = "free"
        deliveryCharge = 0

        PAID:
        deliveryType = "paid"
        deliveryCharge = entered amount
      */

      const finalDeliveryType =
        deliveryType === "paid"
          ? "paid"
          : "free";

      try {
        setSaving(true);

        const payload = {
          name:
            name.trim(),

          slug:
            slug.trim() ||
            slugify(name),

          category,

          productType,

          shortDescription:
            shortDescription.trim(),

          description:
            description.trim(),

          images:
            images
              .map(
                (image) =>
                  image.trim()
              )
              .filter(Boolean),

          price:
            !useVariants &&
            price.trim()
              ? Number(price)
              : undefined,

          compareAtPrice:
            !useVariants &&
            compareAtPrice.trim()
              ? Number(
                  compareAtPrice
                )
              : undefined,

          stock:
            !useVariants
              ? Number(stock) ||
                0
              : undefined,

          sku:
            !useVariants
              ? sku
                  .trim()
                  .toUpperCase()
              : undefined,

          variants:
            useVariants
              ? variants.map(
                  (
                    variant
                  ) => ({
                    packSize:
                      variant.packSize.trim() ||
                      undefined,

                    price:
                      Number(
                        variant.price
                      ),

                    compareAtPrice:
                      variant.compareAtPrice.trim()
                        ? Number(
                            variant.compareAtPrice
                          )
                        : undefined,

                    stock:
                      Number(
                        variant.stock
                      ) || 0,

                    sku:
                      variant.sku
                        .trim()
                        .toUpperCase(),

                    isActive:
                      variant.isActive,
                  })
                )
              : [],

          /* =========================
             DELIVERY
          ========================= */

          deliveryType:
            finalDeliveryType,

          deliveryCharge:
            finalDeliveryCharge,

          /* =========================
             PRODUCT DETAILS
          ========================= */

          ingredients:
            splitLines(
              ingredients
            ),

          benefits:
            splitLines(
              benefits
            ),

          howToUse:
            splitLines(
              howToUse
            ),

          /* =========================
             VISIBILITY
          ========================= */

          isFeatured,

          isActive,

          /* =========================
             SEO
          ========================= */

          seo: {
            title:
              seoTitle.trim(),

            description:
              seoDescription.trim(),

            keywords:
              seoKeywords
                .split(",")
                .map(
                  (
                    item
                  ) =>
                    item.trim()
                )
                .filter(
                  Boolean
                ),
          },
        };

        /*
          DEBUG

          Ye browser console mein
          exact delivery payload
          show karega.
        */

        console.log(
          "PRODUCT DELIVERY PAYLOAD:",
          {
            deliveryType:
              payload.deliveryType,

            deliveryCharge:
              payload.deliveryCharge,
          }
        );

        const response =
          await fetch(
            "/api/admin/products",
            {
              method: "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                payload
              ),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to create product."
          );
        }

        /*
          Verify what API returned
          back to frontend.
        */

        console.log(
          "PRODUCT CREATED:",
          {
            deliveryType:
              result.product
                ?.deliveryType,

            deliveryCharge:
              result.product
                ?.deliveryCharge,
          }
        );

        setSuccess(
          "Product created successfully."
        );

        window.setTimeout(
          () => {
            window.location.href =
              "/admin/products";
          },
          700
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create product."
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <div className="min-h-full bg-[#f7f9f6] text-[#17231c]">
      <div className="mx-auto w-full max-w-[1500px] px-4 pb-24 pt-5 sm:px-6 lg:px-10 xl:px-12">
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-7"
        >
          {/* =====================================================
              LUXURY HEADER
          ====================================================== */}

          <header className="relative overflow-hidden rounded-[30px] bg-[#10291d] shadow-[0_24px_70px_rgba(16,41,29,0.18)]">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-28 -top-36 h-[390px] w-[390px] rounded-full border border-white/[0.06]" />

              <div className="absolute -right-3 -top-20 h-[275px] w-[275px] rounded-full border border-white/[0.05]" />

              <div className="absolute -bottom-40 left-[35%] h-[440px] w-[440px] rounded-full bg-[#315c42]/25 blur-3xl" />

              <div className="absolute bottom-0 left-0 h-px w-[48%] bg-gradient-to-r from-transparent via-[#b9d39e]/40 to-transparent" />

              <div className="absolute right-10 top-9 grid grid-cols-5 gap-2 opacity-20">
                {Array.from({
                  length: 25,
                }).map(
                  (_, index) => (
                    <span
                      key={
                        index
                      }
                      className="h-1 w-1 rounded-full bg-[#c5dda8]"
                    />
                  )
                )}
              </div>
            </div>

            <div className="relative px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
              <div className="flex flex-col gap-9 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <Link
                    href="/admin/products"
                    className="group mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-[10px] font-black uppercase tracking-[0.19em] text-white/65 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
                  >
                    <ArrowLeft
                      className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
                    />

                    Back to Products
                  </Link>

                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px w-9 bg-[#b9d39e]" />

                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#b9d39e]">
                      Catalog Management
                    </span>
                  </div>

                  <h1 className="text-[40px] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-[50px] lg:text-[60px]">
                    Add New Product
                  </h1>

                  <p className="mt-5 max-w-xl text-[13px] leading-7 text-white/50 sm:text-[14px]">
                    Create a refined product
                    listing with structured
                    content, pricing,
                    inventory, delivery and
                    search metadata.
                  </p>
                </div>

                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center xl:flex-col xl:items-end">
                  <div className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-[#b9d39e]/20 bg-[#b9d39e]/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#c5dda8] xl:self-end">
                    <Sparkles className="h-3 w-3" />

                    New Catalog Entry
                  </div>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      imagesUploading
                    }
                    className="group inline-flex h-[56px] items-center justify-center gap-3 rounded-[17px] bg-[#c5dda8] px-7 text-[11px] font-black uppercase tracking-[0.13em] text-[#173321] shadow-[0_14px_35px_rgba(197,221,168,0.12)] transition-all hover:-translate-y-0.5 hover:bg-[#d2e6b9] hover:shadow-[0_20px_42px_rgba(197,221,168,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="h-4 w-4 transition-transform group-hover:scale-105" />

                    {imagesUploading
                      ? "Uploading Images..."
                      : saving
                      ? "Saving..."
                      : "Publish Product"}
                  </button>
                </div>
              </div>
            </div>

            <div className="relative border-t border-white/[0.08] bg-black/[0.08] px-6 py-3.5 sm:px-8 lg:px-10">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                <span>01 Identity</span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span>02 Pricing</span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span>03 Fulfilment</span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span>04 Assets</span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span>05 SEO</span>
              </div>
            </div>
          </header>

          {/* =====================================================
              ALERTS
          ====================================================== */}

          {error && (
            <div className="overflow-hidden rounded-[20px] border border-red-200 bg-white shadow-[0_10px_30px_rgba(100,20,20,0.05)]">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-red-50 text-red-600">
                  <span className="text-sm font-black">
                    !
                  </span>
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-red-500">
                    Publishing Error
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="overflow-hidden rounded-[20px] border border-[#d3e3ce] bg-white shadow-[0_10px_30px_rgba(16,41,29,0.05)]">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#eaf3e5] text-[#315c42]">
                  <Check
                    className="h-4 w-4"
                    strokeWidth={3}
                  />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#315c42]">
                    Published
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-[#5d6b62]">
                    {success}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================
              MAIN GRID
          ====================================================== */}

          <div className="grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
            {/* ===================================================
                LEFT COLUMN
            ==================================================== */}

            <div className="space-y-7">
              {/* =================================================
                  BASIC INFORMATION
              ================================================== */}

              <section className={sectionClass}>
                <SectionHeader
                  number="01"
                  icon={
                    <Type className="h-[18px] w-[18px]" />
                  }
                  eyebrow="Product Identity"
                  title="Basic Information"
                  description="Define the core identity customers will see across the storefront."
                />

                <div className="space-y-6 p-5 sm:p-7 lg:p-8">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Field
                      label="Product Name"
                      required
                    >
                      <input
                        value={name}
                        onChange={(e) =>
                          setName(
                            e.target.value
                          )
                        }
                        placeholder="e.g. Premium Phase 1 Seeds"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Product Slug">
                      <div className="relative">
                        <input
                          value={slug}
                          onChange={(e) => {
                            setSlugEdited(
                              true
                            );

                            setSlug(
                              slugify(
                                e.target.value
                              )
                            );
                          }}
                          placeholder="premium-phase-1-seeds"
                          className={`${inputClass} pr-4 font-mono text-[12px] tracking-wide`}
                        />

                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-[#edf3ea] px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-[#55705e]">
                          URL
                        </span>
                      </div>
                    </Field>
                  </div>

                  <Field label="Short Description">
                    <input
                      value={
                        shortDescription
                      }
                      onChange={(e) =>
                        setShortDescription(
                          e.target.value
                        )
                      }
                      placeholder="Short product description..."
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      value={
                        description
                      }
                      onChange={(e) =>
                        setDescription(
                          e.target.value
                        )
                      }
                      rows={6}
                      placeholder="Write something about this product..."
                      className={
                        textareaClass
                      }
                    />
                  </Field>
                </div>
              </section>

              {/* =================================================
                  PRICING
              ================================================== */}

              <section className={sectionClass}>
                <SectionHeader
                  number="02"
                  icon={
                    <DollarSign className="h-[18px] w-[18px]" />
                  }
                  eyebrow="Commercial"
                  title="Pricing & Inventory"
                  description="Control pricing, stock levels and product variants."
                />

                <div className="p-5 sm:p-7 lg:p-8">
                  <div className="mb-7 rounded-[22px] border border-[#dfe7dd] bg-[#f4f7f3] p-1.5">
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setUseVariants(
                            false
                          );

                          setVariants(
                            []
                          );
                        }}
                        className={`relative h-[52px] rounded-[16px] text-[10px] font-black uppercase tracking-[0.14em] transition-all ${
                          !useVariants
                            ? "bg-[#10291d] text-white shadow-[0_8px_22px_rgba(16,41,29,0.16)]"
                            : "text-[#6e7c73] hover:bg-white/70 hover:text-[#315c42]"
                        }`}
                      >
                        <span className="relative z-10">
                          Simple Product
                        </span>

                        {!useVariants && (
                          <span className="absolute right-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#c5dda8]" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setUseVariants(
                            true
                          )
                        }
                        className={`relative h-[52px] rounded-[16px] text-[10px] font-black uppercase tracking-[0.14em] transition-all ${
                          useVariants
                            ? "bg-[#10291d] text-white shadow-[0_8px_22px_rgba(16,41,29,0.16)]"
                            : "text-[#6e7c73] hover:bg-white/70 hover:text-[#315c42]"
                        }`}
                      >
                        <span className="relative z-10">
                          Use Variants
                        </span>

                        {useVariants && (
                          <span className="absolute right-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#c5dda8]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {!useVariants ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <Field
                        label="Selling Price"
                        required
                      >
                        <PriceInput
                          value={
                            price
                          }
                          onChange={
                            setPrice
                          }
                          placeholder="2500"
                        />
                      </Field>

                      <Field label="Compare-at Price">
                        <PriceInput
                          value={
                            compareAtPrice
                          }
                          onChange={
                            setCompareAtPrice
                          }
                          placeholder="3000"
                        />
                      </Field>

                      <Field label="Stock">
                        <input
                          type="number"
                          min="0"
                          value={
                            stock
                          }
                          onChange={(e) =>
                            setStock(
                              e.target.value
                            )
                          }
                          placeholder="100"
                          className={
                            inputClass
                          }
                        />
                      </Field>

                      <Field
                        label="SKU"
                        required
                      >
                        <div className="relative">
                          <div className="pointer-events-none absolute left-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#edf3ea] text-[#315c42]">
                            <Tag className="h-3.5 w-3.5" />
                          </div>

                          <input
                            value={
                              sku
                            }
                            onChange={(e) =>
                              setSku(
                                e.target.value.toUpperCase()
                              )
                            }
                            placeholder="SEED-001"
                            className={`${inputClass} pl-[54px] font-mono text-[12px] uppercase tracking-[0.08em]`}
                          />
                        </div>
                      </Field>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {variants.length ===
                      0 ? (
                        <div className="relative overflow-hidden rounded-[26px] border border-dashed border-[#cbd9c7] bg-[#f9fbf8] px-6 py-14 text-center">
                          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b9d39e] to-transparent" />

                          <div className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-[20px] bg-[#10291d] text-[#c5dda8] shadow-[0_12px_28px_rgba(16,41,29,0.12)]">
                            <Layers className="h-6 w-6" />
                          </div>

                          <p className="mt-5 text-[13px] font-black uppercase tracking-[0.12em] text-[#26362d]">
                            No Variants Yet
                          </p>

                          <p className="mx-auto mt-2 max-w-sm text-[12px] leading-6 text-[#7e8a82]">
                            Add individual pack sizes
                            such as 100g, 250g or 1kg
                            with their own pricing and
                            inventory.
                          </p>

                          <button
                            type="button"
                            onClick={
                              addVariant
                            }
                            className="mt-6 inline-flex h-11 items-center gap-2 rounded-[14px] bg-[#10291d] px-5 text-[10px] font-black uppercase tracking-[0.13em] text-white shadow-[0_10px_24px_rgba(16,41,29,0.14)] transition-all hover:-translate-y-0.5 hover:bg-[#173a28]"
                          >
                            <Plus className="h-4 w-4" />
                            Add First Variant
                          </button>
                        </div>
                      ) : (
                        <>
                          {variants.map(
                            (
                              variant,
                              index
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="group relative overflow-hidden rounded-[26px] border border-[#dfe7dd] bg-[#fbfcfa] p-5 transition-all hover:border-[#c7d7c4] hover:bg-white hover:shadow-[0_14px_38px_rgba(16,41,29,0.06)] sm:p-6"
                              >
                                <div className="absolute left-0 top-0 h-full w-1 bg-[#315c42] opacity-70" />

                                <div className="mb-6 flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#10291d] text-[9px] font-black text-[#c5dda8]">
                                      {String(
                                        index +
                                          1
                                      ).padStart(
                                        2,
                                        "0"
                                      )}
                                    </div>

                                    <div>
                                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#315c42]">
                                        Product Variant
                                      </p>

                                      <p className="mt-1 text-[11px] text-[#89948d]">
                                        Pack configuration
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeVariant(
                                        index
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-[12px] border border-red-100 bg-red-50 text-red-500 transition-all hover:bg-red-100 hover:text-red-600"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                  <Field label="Pack Size">
                                    <input
                                      value={
                                        variant.packSize
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateVariant(
                                          index,
                                          "packSize",
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                      placeholder="250g"
                                      className={
                                        inputClass
                                      }
                                    />
                                  </Field>

                                  <Field label="Price">
                                    <PriceInput
                                      value={
                                        variant.price
                                      }
                                      onChange={(
                                        value
                                      ) =>
                                        updateVariant(
                                          index,
                                          "price",
                                          value
                                        )
                                      }
                                      placeholder="2500"
                                    />
                                  </Field>

                                  <Field label="Compare Price">
                                    <PriceInput
                                      value={
                                        variant.compareAtPrice
                                      }
                                      onChange={(
                                        value
                                      ) =>
                                        updateVariant(
                                          index,
                                          "compareAtPrice",
                                          value
                                        )
                                      }
                                      placeholder="3000"
                                    />
                                  </Field>

                                  <Field label="Stock">
                                    <input
                                      type="number"
                                      min="0"
                                      value={
                                        variant.stock
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateVariant(
                                          index,
                                          "stock",
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                      className={
                                        inputClass
                                      }
                                    />
                                  </Field>

                                  <Field label="SKU">
                                    <input
                                      value={
                                        variant.sku
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateVariant(
                                          index,
                                          "sku",
                                          e
                                            .target
                                            .value.toUpperCase()
                                        )
                                      }
                                      placeholder="SEED-250"
                                      className={`${inputClass} font-mono text-[12px] uppercase tracking-[0.08em]`}
                                    />
                                  </Field>

                                  <Field label="Variant Status">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateVariant(
                                          index,
                                          "isActive",
                                          !variant.isActive
                                        )
                                      }
                                      className={`flex h-[56px] w-full items-center justify-between rounded-[17px] border px-4 transition-all ${
                                        variant.isActive
                                          ? "border-[#cbdcc6] bg-[#eff5ec]"
                                          : "border-[#dfe5df] bg-[#fbfcfa]"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <span
                                          className={`h-2 w-2 rounded-full ${
                                            variant.isActive
                                              ? "bg-[#315c42]"
                                              : "bg-[#b8c1ba]"
                                          }`}
                                        />

                                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#536158]">
                                          {variant.isActive
                                            ? "Active"
                                            : "Inactive"}
                                        </span>
                                      </div>

                                      <span
                                        className={`relative h-6 w-11 rounded-full transition-all ${
                                          variant.isActive
                                            ? "bg-[#315c42]"
                                            : "bg-[#cbd2cc]"
                                        }`}
                                      >
                                        <span
                                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                                            variant.isActive
                                              ? "left-6"
                                              : "left-1"
                                          }`}
                                        />
                                      </span>
                                    </button>
                                  </Field>
                                </div>
                              </div>
                            )
                          )}

                          <button
                            type="button"
                            onClick={
                              addVariant
                            }
                            className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#d7e1d5] bg-white px-5 text-[10px] font-black uppercase tracking-[0.13em] text-[#4f6257] transition-all hover:border-[#b9cdb5] hover:bg-[#f4f8f2] hover:text-[#315c42]"
                          >
                            <Plus className="h-4 w-4" />
                            Add Another Variant
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  DELIVERY
              ================================================== */}

              <section className={sectionClass}>
                <SectionHeader
                  number="03"
                  icon={
                    <Truck className="h-[18px] w-[18px]" />
                  }
                  eyebrow="Fulfilment"
                  title="Delivery Settings"
                  description="Choose how delivery charges should be handled for this product."
                />

                <div className="p-5 sm:p-7 lg:p-8">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* FREE */}

                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryType(
                          "free"
                        );

                        setDeliveryCharge(
                          ""
                        );
                      }}
                      className={`group relative overflow-hidden rounded-[24px] border p-5 text-left transition-all ${
                        deliveryType ===
                        "free"
                          ? "border-[#10291d] bg-[#10291d] shadow-[0_16px_36px_rgba(16,41,29,0.14)]"
                          : "border-[#dfe7dd] bg-[#fbfcfa] hover:border-[#bdcdbb] hover:bg-white hover:shadow-[0_10px_28px_rgba(16,41,29,0.05)]"
                      }`}
                    >
                      {deliveryType ===
                        "free" && (
                        <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#315c42]/35 blur-2xl" />
                      )}

                      <div className="relative flex items-start justify-between">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${
                            deliveryType ===
                            "free"
                              ? "bg-white/10 text-[#c5dda8]"
                              : "bg-[#edf3ea] text-[#315c42]"
                          }`}
                        >
                          <Truck className="h-5 w-5" />
                        </div>

                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                            deliveryType ===
                            "free"
                              ? "border-[#c5dda8] bg-[#c5dda8] text-[#173321]"
                              : "border-[#c7d0c8] bg-transparent text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </div>
                      </div>

                      <div className="relative mt-6">
                        <p
                          className={`text-[11px] font-black uppercase tracking-[0.16em] ${
                            deliveryType ===
                            "free"
                              ? "text-white"
                              : "text-[#26352d]"
                          }`}
                        >
                          Free Delivery
                        </p>

                        <p
                          className={`mt-2 text-[12px] leading-5 ${
                            deliveryType ===
                            "free"
                              ? "text-white/45"
                              : "text-[#7c8780]"
                          }`}
                        >
                          Customers won't pay an
                          additional delivery charge.
                        </p>
                      </div>
                    </button>

                    {/* PAID */}

                    <button
                      type="button"
                      onClick={() =>
                        setDeliveryType(
                          "paid"
                        )
                      }
                      className={`group relative overflow-hidden rounded-[24px] border p-5 text-left transition-all ${
                        deliveryType ===
                        "paid"
                          ? "border-[#10291d] bg-[#10291d] shadow-[0_16px_36px_rgba(16,41,29,0.14)]"
                          : "border-[#dfe7dd] bg-[#fbfcfa] hover:border-[#bdcdbb] hover:bg-white hover:shadow-[0_10px_28px_rgba(16,41,29,0.05)]"
                      }`}
                    >
                      {deliveryType ===
                        "paid" && (
                        <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#315c42]/35 blur-2xl" />
                      )}

                      <div className="relative flex items-start justify-between">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${
                            deliveryType ===
                            "paid"
                              ? "bg-white/10 text-[#c5dda8]"
                              : "bg-[#edf3ea] text-[#315c42]"
                          }`}
                        >
                          <DollarSign className="h-5 w-5" />
                        </div>

                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                            deliveryType ===
                            "paid"
                              ? "border-[#c5dda8] bg-[#c5dda8] text-[#173321]"
                              : "border-[#c7d0c8] bg-transparent text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </div>
                      </div>

                      <div className="relative mt-6">
                        <p
                          className={`text-[11px] font-black uppercase tracking-[0.16em] ${
                            deliveryType ===
                            "paid"
                              ? "text-white"
                              : "text-[#26352d]"
                          }`}
                        >
                          Paid Delivery
                        </p>

                        <p
                          className={`mt-2 text-[12px] leading-5 ${
                            deliveryType ===
                            "paid"
                              ? "text-white/45"
                              : "text-[#7c8780]"
                          }`}
                        >
                          Set a specific delivery charge
                          for this product.
                        </p>
                      </div>
                    </button>
                  </div>

                  {deliveryType ===
                    "paid" && (
                    <div className="mt-5 rounded-[24px] border border-[#dce6de] bg-[#f6f9f5] p-5">
                      <Field
                        label="Delivery Charge"
                        required
                      >
                        <PriceInput
                          value={
                            deliveryCharge
                          }
                          onChange={
                            setDeliveryCharge
                          }
                          placeholder="250"
                        />
                      </Field>

                      <div className="mt-4 flex items-start gap-3 rounded-[16px] border border-[#e0e9de] bg-white px-4 py-3.5">
                        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#315c42]" />

                        <p className="text-[11px] leading-5 text-[#718078]">
                          Customers will be
                          charged{" "}
                          <span className="font-black text-[#26352d]">
                            Rs.{" "}
                            {deliveryCharge ||
                              "0"}
                          </span>{" "}
                          when this product requires
                          delivery.
                        </p>
                      </div>
                    </div>
                  )}

                  {deliveryType ===
                    "free" && (
                    <div className="mt-5 flex items-center gap-3 rounded-[18px] border border-[#dfe9dc] bg-[#f5f9f3] px-4 py-3.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#10291d] text-[#c5dda8]">
                        <Truck className="h-3.5 w-3.5" />
                      </div>

                      <p className="text-[11px] text-[#66736b]">
                        This product is configured
                        with{" "}
                        <span className="font-black text-[#315c42]">
                          free delivery
                        </span>
                        .
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  IMAGES
              ================================================== */}

              <section className={sectionClass}>
                <SectionHeader
                  number="04"
                  icon={
                    <ImageIcon className="h-[18px] w-[18px]" />
                  }
                  eyebrow="Visual Assets"
                  title="Product Images"
                  description="Upload polished imagery that represents the product across your storefront."
                />

                <div className="p-5 sm:p-7 lg:p-8">
                  <div className="rounded-[25px] border border-[#dfe7dd] bg-[#f8faf7] p-4 sm:p-5">
                    <ProductImageUploader
                      value={images}
                      onChange={
                        setImages
                      }
                      maxImages={8}
                      onUploadingChange={
                        setImagesUploading
                      }
                    />
                  </div>

                  {imagesUploading && (
                    <div className="mt-4 flex items-center gap-3 rounded-[17px] border border-[#d5e4d0] bg-[#edf5e9] px-4 py-3">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#315c42]" />

                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#315c42]">
                        Uploading Images...
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  PRODUCT DETAILS
              ================================================== */}

              <section className={sectionClass}>
                <SectionHeader
                  number="05"
                  icon={
                    <Type className="h-[18px] w-[18px]" />
                  }
                  eyebrow="Product Story"
                  title="Product Details"
                  description="Add structured content using one item per line."
                />

                <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 md:grid-cols-3 lg:p-8">
                  <Field label="Ingredients">
                    <textarea
                      value={
                        ingredients
                      }
                      onChange={(e) =>
                        setIngredients(
                          e.target.value
                        )
                      }
                      rows={7}
                      placeholder={
                        "Flax seeds\nPumpkin seeds\nSesame seeds"
                      }
                      className={
                        textareaClass
                      }
                    />
                  </Field>

                  <Field label="Benefits">
                    <textarea
                      value={
                        benefits
                      }
                      onChange={(e) =>
                        setBenefits(
                          e.target.value
                        )
                      }
                      rows={7}
                      placeholder={
                        "Supports cycle health\nRich in nutrients\nDaily wellness"
                      }
                      className={
                        textareaClass
                      }
                    />
                  </Field>

                  <Field label="How to Use">
                    <textarea
                      value={
                        howToUse
                      }
                      onChange={(e) =>
                        setHowToUse(
                          e.target.value
                        )
                      }
                      rows={7}
                      placeholder={
                        "One spoon daily\nAdd to smoothies\nAdd to porridge"
                      }
                      className={
                        textareaClass
                      }
                    />
                  </Field>
                </div>
              </section>
            </div>

            {/* ===================================================
                RIGHT SIDEBAR
            ==================================================== */}

            <div className="space-y-7 xl:sticky xl:top-6 xl:self-start">
              {/* =================================================
                  ORGANIZATION
              ================================================== */}

              <section className={sectionClass}>
                <SectionHeader
                  number="06"
                  icon={
                    <Layers className="h-[18px] w-[18px]" />
                  }
                  eyebrow="Catalog"
                  title="Organization"
                  description="Place the product in the correct catalog structure."
                  compact
                />

                <div className="space-y-5 p-5 sm:p-6">
                  <Field
                    label="Category"
                    required
                  >
                    <PremiumSelect
                      value={
                        category
                      }
                      onChange={
                        setCategory
                      }
                      disabled={
                        loadingCategories
                      }
                    >
                      <option value="">
                        {loadingCategories
                          ? "Loading..."
                          : "Select Category"}
                      </option>

                      {categories
                        .filter(
                          (
                            item
                          ) =>
                            item.isActive
                        )
                        .map(
                          (
                            item
                          ) => (
                            <option
                              key={
                                item._id
                              }
                              value={
                                item._id
                              }
                            >
                              {
                                item.name
                              }
                            </option>
                          )
                        )}
                    </PremiumSelect>
                  </Field>

                  <Field
                    label="Product Type"
                    required
                  >
                    <PremiumSelect
                      value={
                        productType
                      }
                      onChange={
                        setProductType
                      }
                    >
                      {PRODUCT_TYPES.map(
                        (
                          type
                        ) => (
                          <option
                            key={
                              type
                            }
                            value={
                              type
                            }
                          >
                            {type}
                          </option>
                        )
                      )}
                    </PremiumSelect>
                  </Field>
                </div>
              </section>

              {/* =================================================
                  SEO
              ================================================== */}

              <section className={sectionClass}>
                <SectionHeader
                  number="07"
                  icon={
                    <Search className="h-[18px] w-[18px]" />
                  }
                  eyebrow="Discoverability"
                  title="SEO Settings"
                  description="Shape how the product appears in search results."
                  compact
                />

                <div className="space-y-5 p-5 sm:p-6">
                  <Field label="SEO Title">
                    <input
                      value={
                        seoTitle
                      }
                      onChange={(e) =>
                        setSeoTitle(
                          e.target.value
                        )
                      }
                      maxLength={
                        200
                      }
                      placeholder="Product SEO title"
                      className={
                        inputClass
                      }
                    />
                  </Field>

                  <Field label="SEO Description">
                    <textarea
                      value={
                        seoDescription
                      }
                      onChange={(e) =>
                        setSeoDescription(
                          e.target.value
                        )
                      }
                      maxLength={
                        320
                      }
                      rows={5}
                      placeholder="Search engine description..."
                      className={
                        textareaClass
                      }
                    />
                  </Field>

                  <Field label="Keywords">
                    <input
                      value={
                        seoKeywords
                      }
                      onChange={(e) =>
                        setSeoKeywords(
                          e.target.value
                        )
                      }
                      placeholder="seeds, premium seeds, phase 1"
                      className={
                        inputClass
                      }
                    />
                  </Field>
                </div>
              </section>

              {/* =================================================
                  VISIBILITY
              ================================================== */}

              <section className={sectionClass}>
                <SectionHeader
                  number="08"
                  icon={
                    <ShieldCheck className="h-[18px] w-[18px]" />
                  }
                  eyebrow="Publishing"
                  title="Visibility"
                  description="Control storefront visibility and merchandising."
                  compact
                />

                <div className="space-y-3 p-5 sm:p-6">
                  <VisibilityToggle
                    label="Active Product"
                    description="Visible to customers"
                    checked={
                      isActive
                    }
                    onChange={() =>
                      setIsActive(
                        !isActive
                      )
                    }
                  />

                  <VisibilityToggle
                    label="Featured Product"
                    description="Show in featured sections"
                    checked={
                      isFeatured
                    }
                    onChange={() =>
                      setIsFeatured(
                        !isFeatured
                      )
                    }
                  />
                </div>
              </section>

              {/* =================================================
                  PUBLISHING COMMAND CENTER
              ================================================== */}

              <div className="relative overflow-hidden rounded-[30px] bg-[#10291d] shadow-[0_22px_55px_rgba(16,41,29,0.17)]">
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/[0.06]" />

                <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-[#315c42]/25 blur-3xl" />

                <div className="relative p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#c5dda8] text-[#173321] shadow-[0_8px_22px_rgba(0,0,0,0.12)]">
                        <Save className="h-[17px] w-[17px]" />
                      </div>

                      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#b9d39e]">
                        Ready to Publish
                      </p>

                      <h3 className="mt-2 text-[19px] font-semibold tracking-[-0.025em] text-white">
                        Final Product Setup
                      </h3>

                      <p className="mt-2 text-[11px] leading-5 text-white/40">
                        Review the key settings before
                        sending this product live.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/[0.08] pt-5">
                    <SummaryRow
                      label="Visibility"
                      value={
                        isActive
                          ? "Active"
                          : "Hidden"
                      }
                      positive={
                        isActive
                      }
                    />

                    <SummaryRow
                      label="Pricing"
                      value={
                        useVariants
                          ? `${variants.length} Variant${
                              variants.length !==
                              1
                                ? "s"
                                : ""
                            }`
                          : "Simple"
                      }
                    />

                    <SummaryRow
                      label="Delivery"
                      value={
                        deliveryType ===
                        "free"
                          ? "Free"
                          : deliveryCharge
                          ? `Rs. ${deliveryCharge}`
                          : "Paid"
                      }
                    />

                    <SummaryRow
                      label="Featured"
                      value={
                        isFeatured
                          ? "Yes"
                          : "No"
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      imagesUploading
                    }
                    className="mt-6 flex h-[55px] w-full items-center justify-center gap-3 rounded-[16px] bg-[#c5dda8] text-[10px] font-black uppercase tracking-[0.16em] text-[#173321] shadow-[0_12px_30px_rgba(0,0,0,0.13)] transition-all hover:-translate-y-0.5 hover:bg-[#d2e6b9] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />

                    {imagesUploading
                      ? "Uploading Images..."
                      : saving
                      ? "Saving..."
                      : "Publish Product"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              BOTTOM ACTION BAR
          ====================================================== */}

          <div className="overflow-hidden rounded-[28px] border border-[#dfe7dd] bg-white shadow-[0_12px_40px_rgba(16,41,29,0.045)]">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
              <div className="flex items-center gap-4">
                <div className="hidden h-10 w-10 items-center justify-center rounded-[13px] bg-[#edf3ea] text-[#315c42] sm:flex">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#315c42]">
                    Catalog Entry
                  </p>

                  <p className="mt-1 text-[11px] text-[#7c8780]">
                    Your product will be added to the
                    catalog once published.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Link
                  href="/admin/products"
                  className="inline-flex h-[52px] items-center justify-center rounded-[16px] border border-[#dfe6dc] bg-[#fafbf9] px-6 text-[10px] font-black uppercase tracking-[0.14em] text-[#657169] transition-all hover:border-[#c9d5c5] hover:bg-white hover:text-[#315c42]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    imagesUploading
                  }
                  className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-[16px] bg-[#10291d] px-7 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-[0_10px_28px_rgba(16,41,29,0.14)] transition-all hover:-translate-y-0.5 hover:bg-[#173a28] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />

                  {imagesUploading
                    ? "Uploading Images..."
                    : saving
                    ? "Saving..."
                    : "Publish Product"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================================================================
   PRESENTATIONAL COMPONENTS
================================================================ */

function SectionHeader({
  number,
  icon,
  eyebrow,
  title,
  description,
  compact = false,
}: {
  number: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden border-b border-[#e8ede6] ${
        compact
          ? "px-5 py-5 sm:px-6"
          : "px-5 py-6 sm:px-7 lg:px-8"
      }`}
    >
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#f5f8f3] to-transparent opacity-70" />

      <div className="relative flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#10291d] text-[#c5dda8] shadow-[0_9px_22px_rgba(16,41,29,0.13)]">
            {icon}
          </div>

          <span className="absolute -bottom-1.5 -right-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#c5dda8] px-1 text-[7px] font-black text-[#173321]">
            {number}
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-[0.24em] text-[#77916f]">
              {eyebrow}
            </span>

            <span className="h-px w-5 bg-[#c5dda8]" />
          </div>

          <h2 className="mt-1.5 text-[18px] font-bold tracking-[-0.03em] text-[#1d2b23]">
            {title}
          </h2>

          <p className="mt-1.5 max-w-2xl text-[11px] leading-5 text-[#7d8780]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#68756d]">
        {label}

        {required && (
          <span className="text-[#315c42]">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function PriceInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#edf3ea] text-[#315c42]">
        <span className="text-[9px] font-black">
          Rs
        </span>
      </div>

      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={placeholder}
        className={`${inputClass} pl-[54px]`}
      />
    </div>
  );
}

function PremiumSelect({
  value,
  onChange,
  disabled,
  children,
}: {
  value: string;
  onChange: (
    value: string
  ) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-[#edf3ea] text-[#315c42]">
        <Layers className="h-3.5 w-3.5" />
      </div>

      <select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        disabled={disabled}
        className={`${selectClass} pl-[54px] pr-11`}
      >
        {children}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718078]" />
    </div>
  );
}

function VisibilityToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full items-center justify-between gap-4 rounded-[20px] border p-4 text-left transition-all ${
        checked
          ? "border-[#cfdfc9] bg-[#f1f6ee]"
          : "border-[#e2e7e1] bg-[#fbfcfa] hover:border-[#cbd8c8] hover:bg-white"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${
            checked
              ? "bg-[#10291d] text-[#c5dda8]"
              : "bg-[#edf1ed] text-[#859089]"
          }`}
        >
          {checked ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#34423a]">
            {label}
          </p>

          <p className="mt-1.5 text-[10px] leading-5 text-[#7d8780]">
            {description}
          </p>
        </div>
      </div>

      <span
        className={`relative h-7 w-[50px] shrink-0 rounded-full transition-all ${
          checked
            ? "bg-[#315c42]"
            : "bg-[#d3dad4]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_7px_rgba(0,0,0,0.15)] transition-all ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function SummaryRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] py-3 last:border-0">
      <span className="text-[10px] font-medium text-white/38">
        {label}
      </span>

      <div className="flex items-center gap-2">
        {positive && (
          <span className="h-1.5 w-1.5 rounded-full bg-[#c5dda8]" />
        )}

        <span
          className={`text-[10px] font-bold ${
            positive
              ? "text-[#c5dda8]"
              : "text-white/70"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   LUXURY DESIGN SYSTEM
================================================================ */

const sectionClass =
  "overflow-hidden rounded-[30px] border border-[#e0e8de] bg-white shadow-[0_14px_48px_rgba(16,41,29,0.045)]";

const inputClass =
  "h-[56px] w-full rounded-[17px] border border-[#dfe7dd] bg-[#fbfcfa] px-4 text-[13px] font-medium text-[#26352d] outline-none transition-all placeholder:text-[#a1aaa4] hover:border-[#d4dfd2] focus:border-[#769676] focus:bg-white focus:ring-4 focus:ring-[#b9d39e]/20 focus:shadow-[0_8px_25px_rgba(16,41,29,0.045)] disabled:cursor-not-allowed disabled:opacity-60";

const textareaClass =
  "w-full resize-y rounded-[17px] border border-[#dfe7dd] bg-[#fbfcfa] px-4 py-3.5 text-[13px] font-medium leading-6 text-[#26352d] outline-none transition-all placeholder:text-[#a1aaa4] hover:border-[#d4dfd2] focus:border-[#769676] focus:bg-white focus:ring-4 focus:ring-[#b9d39e]/20 focus:shadow-[0_8px_25px_rgba(16,41,29,0.045)]";

const selectClass =
  "h-[56px] w-full appearance-none rounded-[17px] border border-[#dfe7dd] bg-[#fbfcfa] text-[13px] font-semibold text-[#26352d] outline-none transition-all hover:border-[#d4dfd2] focus:border-[#769676] focus:bg-white focus:ring-4 focus:ring-[#b9d39e]/20 focus:shadow-[0_8px_25px_rgba(16,41,29,0.045)] disabled:cursor-not-allowed disabled:opacity-60";