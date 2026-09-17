"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  ImageIcon,
  Layers,
  Plus,
  Save,
  Tag,
  Trash2,
  Type,
  Truck,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";

import ProductImageUploader from "@/components/admin/ProductImageUploader";

type Category = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

type Variant = {
  _id?: string;
  packSize: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  sku: string;
  isActive: boolean;
};

type ProductResponse = {
  _id: string;
  name: string;
  slug: string;

  category:
    | string
    | {
        _id: string;
        name: string;
        slug: string;
      };

  productType:
    | "Phase 1"
    | "Phase 2"
    | "Complete Pack"
    | "Single Seed";

  shortDescription?: string;
  description?: string;

  images?: string[];

  price?: number;
  compareAtPrice?: number;
  stock?: number;
  sku?: string;

  variants?: {
    _id?: string;
    packSize?: string;
    price: number;
    compareAtPrice?: number;
    stock?: number;
    sku: string;
    isActive?: boolean;
  }[];

  deliveryType?: "free" | "paid";
  deliveryCharge?: number;

  ingredients?: string[];
  benefits?: string[];
  howToUse?: string[];

  isFeatured?: boolean;
  isActive?: boolean;

  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

const PRODUCT_TYPES = [
  "Phase 1",
  "Phase 2",
  "Complete Pack",
  "Single Seed",
] as const;

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const emptyVariant = (): Variant => ({
  packSize: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  sku: "",
  isActive: true,
});

export default function EditProductPage() {
  const params = useParams();

  const productId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [loading, setLoading] = useState(true);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [imagesUploading, setImagesUploading] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [name, setName] = useState("");

  const [slug, setSlug] = useState("");

  const [slugEdited, setSlugEdited] = useState(false);

  const [description, setDescription] =
    useState("");

  const [shortDescription, setShortDescription] =
    useState("");

  const [category, setCategory] = useState("");

  const [productType, setProductType] = useState<
    (typeof PRODUCT_TYPES)[number]
  >("Single Seed");

  const [images, setImages] =
    useState<string[]>([]);

  const [price, setPrice] = useState("");

  const [compareAtPrice, setCompareAtPrice] =
    useState("");

  const [stock, setStock] = useState("0");

  const [sku, setSku] = useState("");

  const [useVariants, setUseVariants] =
    useState(false);

  const [variants, setVariants] =
    useState<Variant[]>([]);

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

  const [deliveryType, setDeliveryType] =
    useState<"free" | "paid">("free");

  const [deliveryCharge, setDeliveryCharge] =
    useState("0");

  const [isFeatured, setIsFeatured] =
    useState(false);

  const [isActive, setIsActive] =
    useState(true);

  /* =========================
     LOAD CATEGORIES
  ========================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await fetch(
          "/api/admin/products",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load categories."
          );
        }

        setCategories(
          result.data?.categories || []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  /* =========================
     LOAD PRODUCT
  ========================= */

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/products/${encodeURIComponent(
            productId
          )}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load product."
          );
        }

        const product: ProductResponse =
          result.data;

        /* BASIC */

        setName(product.name || "");

        setSlug(product.slug || "");

        setShortDescription(
          product.shortDescription || ""
        );

        setDescription(
          product.description || ""
        );

        /* CATEGORY */

        if (
          typeof product.category ===
          "string"
        ) {
          setCategory(product.category);
        } else {
          setCategory(
            product.category?._id || ""
          );
        }

        /* PRODUCT TYPE */

        if (
          PRODUCT_TYPES.includes(
            product.productType
          )
        ) {
          setProductType(
            product.productType
          );
        }

        /* IMAGES */

        setImages(
          Array.isArray(product.images)
            ? product.images
            : []
        );

        /* VARIANTS */

        const productVariants =
          Array.isArray(product.variants)
            ? product.variants
            : [];

        if (productVariants.length > 0) {
          setUseVariants(true);

          setVariants(
            productVariants.map(
              (variant) => ({
                _id: variant._id,

                packSize:
                  variant.packSize || "",

                price:
                  variant.price !==
                  undefined
                    ? String(
                        variant.price
                      )
                    : "",

                compareAtPrice:
                  variant.compareAtPrice !==
                  undefined
                    ? String(
                        variant.compareAtPrice
                      )
                    : "",

                stock:
                  variant.stock !==
                  undefined
                    ? String(
                        variant.stock
                      )
                    : "0",

                sku:
                  variant.sku || "",

                isActive:
                  variant.isActive !==
                  false,
              })
            )
          );
        } else {
          setUseVariants(false);
          setVariants([]);

          setPrice(
            product.price !== undefined
              ? String(product.price)
              : ""
          );

          setCompareAtPrice(
            product.compareAtPrice !==
              undefined
              ? String(
                  product.compareAtPrice
                )
              : ""
          );

          setStock(
            product.stock !== undefined
              ? String(product.stock)
              : "0"
          );

          setSku(product.sku || "");
        }

        /* PRODUCT DETAILS */

        setIngredients(
          Array.isArray(product.ingredients)
            ? product.ingredients.join("\n")
            : ""
        );

        setBenefits(
          Array.isArray(product.benefits)
            ? product.benefits.join("\n")
            : ""
        );

        setHowToUse(
          Array.isArray(product.howToUse)
            ? product.howToUse.join("\n")
            : ""
        );

        /* SEO */

        setSeoTitle(
          product.seo?.title || ""
        );

        setSeoDescription(
          product.seo?.description || ""
        );

        setSeoKeywords(
          Array.isArray(
            product.seo?.keywords
          )
            ? product.seo.keywords.join(
                ", "
              )
            : ""
        );

        /* DELIVERY */

        const loadedDeliveryType =
          product.deliveryType === "paid"
            ? "paid"
            : "free";

        setDeliveryType(
          loadedDeliveryType
        );

        setDeliveryCharge(
          loadedDeliveryType === "paid"
            ? String(
                Number(
                  product.deliveryCharge
                ) || 0
              )
            : "0"
        );

        /* VISIBILITY */

        setIsFeatured(
          Boolean(product.isFeatured)
        );

        setIsActive(
          product.isActive !== false
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  /* =========================
     AUTO SLUG
  ========================= */

  useEffect(() => {
    if (!slugEdited && name) {
      setSlug(slugify(name));
    }
  }, [name, slugEdited]);

  /* =========================
     VARIANTS
  ========================= */

  const addVariant = () => {
    setVariants((current) => [
      ...current,
      emptyVariant(),
    ]);
  };

  const removeVariant = (
    index: number
  ) => {
    setVariants((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  };

  const updateVariant = (
    index: number,
    field: keyof Variant,
    value: string | boolean
  ) => {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!productId) {
      setError("Product ID is missing.");
      return;
    }

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
      variants.length === 0
    ) {
      setError(
        "Add at least one variant."
      );
      return;
    }

    if (useVariants) {
      for (
        let i = 0;
        i < variants.length;
        i++
      ) {
        const variant = variants[i];

        if (!variant.price.trim()) {
          setError(
            `Variant ${
              i + 1
            } price is required.`
          );
          return;
        }

        if (!variant.sku.trim()) {
          setError(
            `Variant ${
              i + 1
            } SKU is required.`
          );
          return;
        }
      }
    }

    if (deliveryType === "paid") {
      if (!deliveryCharge.trim()) {
        setError(
          "Please enter a delivery charge for paid delivery."
        );
        return;
      }

      const parsedCharge =
        Number(deliveryCharge);

      if (
        !Number.isFinite(
          parsedCharge
        ) ||
        parsedCharge < 0
      ) {
        setError(
          "Delivery charge must be a valid non-negative number."
        );
        return;
      }
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),

        slug:
          slug.trim() ||
          slugify(name),

        category,

        productType,

        shortDescription:
          shortDescription.trim(),

        description:
          description.trim(),

        images: images
          .map((image) =>
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
            ? Number(stock) || 0
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
                (variant) => ({
                  ...(variant._id
                    ? {
                        _id: variant._id,
                      }
                    : {}),

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

                  sku: variant.sku
                    .trim()
                    .toUpperCase(),

                  isActive:
                    variant.isActive,
                })
              )
            : [],

        ingredients:
          splitLines(ingredients),

        benefits:
          splitLines(benefits),

        howToUse:
          splitLines(howToUse),

        /* DELIVERY */

        deliveryType:
          deliveryType === "paid"
            ? "paid"
            : "free",

        deliveryCharge:
          deliveryType === "paid"
            ? Number(
                deliveryCharge
              ) || 0
            : 0,

        /* VISIBILITY */

        isFeatured,

        isActive,

        /* SEO */

        seo: {
          title:
            seoTitle.trim(),

          description:
            seoDescription.trim(),

          keywords:
            seoKeywords
              .split(",")
              .map(
                (item) =>
                  item.trim()
              )
              .filter(Boolean),
        },
      };

      const response =
        await fetch(
          `/api/admin/products/${encodeURIComponent(
            productId
          )}`,
          {
            method: "PATCH",
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
            "Failed to update product."
        );
      }

      setSuccess(
        "Product updated successfully."
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
          : "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="min-h-full bg-white">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-[#dfe7df] border-t-[#10291d]" />

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#526158]">
              Loading product
            </p>

            <p className="mt-2 text-xs text-[#89948d]">
              Preparing your product workspace
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white">
      <div className="mx-auto max-w-[1500px] px-4 pb-24 pt-5 sm:px-6 lg:px-10 lg:pt-8 xl:px-12">
        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >
          {/* =========================
              LUXURY HEADER
          ========================= */}

          <header className="relative overflow-hidden rounded-[30px] bg-[#10291d] p-6 shadow-[0_25px_70px_rgba(16,41,29,0.15)] sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#315c42]/45 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-36 right-28 h-72 w-72 rounded-full border border-white/[0.07]" />

            <div className="pointer-events-none absolute right-10 top-10 h-24 w-24 rounded-full border border-[#b9d39e]/10" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <Link
                  href="/admin/products"
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/65 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to products
                </Link>

                <div className="mb-3 flex items-center gap-2">
                  <span className="h-px w-8 bg-[#b9d39e]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b9d39e]">
                    Catalog / Product Editor
                  </span>
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-[44px]">
                  Edit Product
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-[15px]">
                  Refine product information,
                  pricing, inventory and
                  storefront presentation.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[270px]">
                <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.055] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b9d39e] text-[#10291d]">
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">
                        Workspace
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-white">
                        Product Settings
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#b9d39e]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#b9d39e]">
                    Live
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    imagesUploading
                  }
                  className="inline-flex h-[54px] items-center justify-center gap-2 rounded-[17px] bg-[#c5dda8] px-6 text-sm font-bold text-[#173321] shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition hover:bg-[#d4e8bc] hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />

                  {imagesUploading
                    ? "Uploading Images..."
                    : saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </header>

          {/* =========================
              ALERTS
          ========================= */}

          {error && (
            <div className="flex items-start gap-3 rounded-[20px] border border-red-200/80 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(150,50,40,0.05)]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                !
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red-500">
                  Attention Required
                </p>

                <p className="mt-1 text-sm font-medium leading-6 text-red-700">
                  {error}
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-[20px] border border-[#cfe2c8] bg-white px-5 py-4 shadow-[0_10px_30px_rgba(16,41,29,0.05)]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf5e8] text-[#315c42]">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#53745e]">
                  Saved Successfully
                </p>

                <p className="mt-1 text-sm font-medium leading-6 text-[#31553d]">
                  {success}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
            {/* =========================
                LEFT
            ========================= */}

            <div className="space-y-7 lg:col-span-2">
              {/* BASIC */}

              <section className={sectionClass}>
                <SectionHeader
                  icon={Type}
                  eyebrow="01 / Product Identity"
                  title="Basic Information"
                  description="Define the core product content shown across your store."
                />

                <div className="space-y-6">
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
                      className={inputClass}
                    />

                    <p className="mt-2 text-[10px] font-medium text-[#9aa49e]">
                      Used as the product URL.
                    </p>
                  </Field>

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
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      value={description}
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

              {/* PRICING */}

              <section className={sectionClass}>
                <SectionHeader
                  icon={DollarSign}
                  eyebrow="02 / Commercial"
                  title="Pricing & Inventory"
                  description="Control product pricing, stock and variant structure."
                />

                <div className="rounded-[19px] border border-[#e2e9e0] bg-[#f4f7f2] p-1.5">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUseVariants(
                          false
                        );

                        setVariants([]);
                      }}
                      className={`flex items-center justify-center gap-2 rounded-[14px] px-4 py-3.5 text-[12px] font-bold transition ${
                        !useVariants
                          ? "bg-[#10291d] text-white shadow-[0_8px_22px_rgba(16,41,29,0.16)]"
                          : "text-[#748078] hover:bg-white/70 hover:text-[#31553d]"
                      }`}
                    >
                      <DollarSign className="h-4 w-4" />
                      Simple Product
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setUseVariants(
                          true
                        )
                      }
                      className={`flex items-center justify-center gap-2 rounded-[14px] px-4 py-3.5 text-[12px] font-bold transition ${
                        useVariants
                          ? "bg-[#10291d] text-white shadow-[0_8px_22px_rgba(16,41,29,0.16)]"
                          : "text-[#748078] hover:bg-white/70 hover:text-[#31553d]"
                      }`}
                    >
                      <Layers className="h-4 w-4" />
                      Use Variants
                    </button>
                  </div>
                </div>

                {!useVariants ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field
                      label="Selling Price"
                      required
                    >
                      <MoneyInput>
                        <input
                          type="number"
                          min="0"
                          value={price}
                          onChange={(e) =>
                            setPrice(
                              e.target.value
                            )
                          }
                          placeholder="2500"
                          className={`${inputClass} pl-14`}
                        />
                      </MoneyInput>
                    </Field>

                    <Field label="Compare-at Price">
                      <MoneyInput>
                        <input
                          type="number"
                          min="0"
                          value={
                            compareAtPrice
                          }
                          onChange={(e) =>
                            setCompareAtPrice(
                              e.target.value
                            )
                          }
                          placeholder="3000"
                          className={`${inputClass} pl-14`}
                        />
                      </MoneyInput>
                    </Field>

                    <Field label="Stock">
                      <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) =>
                          setStock(
                            e.target.value
                          )
                        }
                        placeholder="100"
                        className={inputClass}
                      />
                    </Field>

                    <Field
                      label="SKU"
                      required
                    >
                      <input
                        value={sku}
                        onChange={(e) =>
                          setSku(
                            e.target.value.toUpperCase()
                          )
                        }
                        placeholder="SEED-001"
                        className={`${inputClass} uppercase`}
                      />
                    </Field>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {variants.length ===
                    0 ? (
                      <div className="rounded-[24px] border border-dashed border-[#cfdace] bg-[#f9fbf8] px-5 py-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#10291d] text-[#c5dda8] shadow-[0_10px_25px_rgba(16,41,29,0.12)]">
                          <Tag className="h-6 w-6" />
                        </div>

                        <p className="mt-5 text-sm font-bold text-[#26352c]">
                          No variants added
                        </p>

                        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#89948d]">
                          Add packs such as
                          100g, 250g or 1kg
                          to give customers
                          multiple purchase
                          options.
                        </p>

                        <button
                          type="button"
                          onClick={
                            addVariant
                          }
                          className="mt-5 inline-flex items-center gap-2 rounded-[14px] bg-[#10291d] px-5 py-3 text-xs font-bold text-white shadow-[0_10px_24px_rgba(16,41,29,0.14)] transition hover:bg-[#193b29]"
                        >
                          <Plus className="h-4 w-4" />
                          Add Variant
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
                                variant._id ||
                                index
                              }
                              className="rounded-[24px] border border-[#dfe7de] bg-[#fbfcfa] p-5 shadow-[0_8px_28px_rgba(16,41,29,0.035)] transition hover:border-[#cbd8cd] hover:shadow-[0_12px_34px_rgba(16,41,29,0.055)] sm:p-6"
                            >
                              <div className="mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#10291d] text-[#c5dda8]">
                                    <Tag className="h-4 w-4" />
                                  </div>

                                  <div>
                                    <p className="text-sm font-bold text-[#26352c]">
                                      Variant{" "}
                                      {index +
                                        1}
                                    </p>

                                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#9aa49e]">
                                      Product option
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
                                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eadfdd] bg-white text-[#9b837f] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                  <MoneyInput>
                                    <input
                                      type="number"
                                      min="0"
                                      value={
                                        variant.price
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateVariant(
                                          index,
                                          "price",
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                      placeholder="2500"
                                      className={`${inputClass} pl-14`}
                                    />
                                  </MoneyInput>
                                </Field>

                                <Field label="Compare Price">
                                  <MoneyInput>
                                    <input
                                      type="number"
                                      min="0"
                                      value={
                                        variant.compareAtPrice
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateVariant(
                                          index,
                                          "compareAtPrice",
                                          e
                                            .target
                                            .value
                                        )
                                      }
                                      placeholder="3000"
                                      className={`${inputClass} pl-14`}
                                    />
                                  </MoneyInput>
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
                                    className={`${inputClass} uppercase`}
                                  />
                                </Field>

                                <Field label="Status">
                                  <label className="group flex h-[54px] cursor-pointer items-center justify-between rounded-[16px] border border-[#dfe7de] bg-white px-4 transition hover:border-[#cbd8cd]">
                                    <span className="text-xs font-semibold text-[#526158]">
                                      Active Variant
                                    </span>

                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={
                                          variant.isActive
                                        }
                                        onChange={(
                                          e
                                        ) =>
                                          updateVariant(
                                            index,
                                            "isActive",
                                            e
                                              .target
                                              .checked
                                          )
                                        }
                                        className="peer sr-only"
                                      />

                                      <span className="block h-7 w-12 rounded-full bg-[#dfe7df] transition peer-checked:bg-[#10291d]" />

                                      <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_7px_rgba(16,41,29,0.18)] transition peer-checked:translate-x-5" />
                                    </div>
                                  </label>
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
                          className="inline-flex items-center gap-2 rounded-[15px] border border-[#cfdace] bg-white px-5 py-3 text-xs font-bold text-[#31553d] shadow-[0_5px_18px_rgba(16,41,29,0.035)] transition hover:border-[#10291d] hover:bg-[#f6f9f4]"
                        >
                          <Plus className="h-4 w-4" />
                          Add Another Variant
                        </button>
                      </>
                    )}
                  </div>
                )}
              </section>

              {/* IMAGES */}

              <section className={sectionClass}>
                <SectionHeader
                  icon={ImageIcon}
                  eyebrow="03 / Visual Assets"
                  title="Product Images"
                  description="Manage the visual presentation of this product."
                />

                <div className="rounded-[24px] border border-[#e3eae1] bg-[#fafcf9] p-3 sm:p-4">
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
              </section>

              {/* CONTENT */}

              <section className={sectionClass}>
                <SectionHeader
                  icon={Type}
                  eyebrow="04 / Product Content"
                  title="Product Details"
                  description="Add structured information customers can use before purchasing."
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <Field label="Ingredients">
                    <textarea
                      value={ingredients}
                      onChange={(e) =>
                        setIngredients(
                          e.target.value
                        )
                      }
                      rows={7}
                      placeholder="One item per line..."
                      className={
                        textareaClass
                      }
                    />
                  </Field>

                  <Field label="Benefits">
                    <textarea
                      value={benefits}
                      onChange={(e) =>
                        setBenefits(
                          e.target.value
                        )
                      }
                      rows={7}
                      placeholder="One benefit per line..."
                      className={
                        textareaClass
                      }
                    />
                  </Field>

                  <Field label="How to Use">
                    <textarea
                      value={howToUse}
                      onChange={(e) =>
                        setHowToUse(
                          e.target.value
                        )
                      }
                      rows={7}
                      placeholder="One instruction per line..."
                      className={
                        textareaClass
                      }
                    />
                  </Field>
                </div>
              </section>
            </div>

            {/* =========================
                RIGHT
            ========================= */}

            <div className="space-y-7">
              {/* ORGANIZATION */}

              <section className={sectionClass}>
                <SectionHeader
                  icon={Layers}
                  eyebrow="05 / Organization"
                  title="Organization"
                  description="Structure where this product belongs."
                />

                <div className="space-y-5">
                  <Field
                    label="Category"
                    required
                  >
                    <SelectWrap>
                      <select
                        value={category}
                        onChange={(e) =>
                          setCategory(
                            e.target.value
                          )
                        }
                        disabled={
                          loadingCategories
                        }
                        className={
                          selectClass
                        }
                      >
                        <option value="">
                          {loadingCategories
                            ? "Loading..."
                            : "Select Category"}
                        </option>

                        {categories
                          .filter(
                            (item) =>
                              item.isActive ||
                              item._id ===
                                category
                          )
                          .map(
                            (item) => (
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
                      </select>
                    </SelectWrap>
                  </Field>

                  <Field
                    label="Product Type"
                    required
                  >
                    <SelectWrap>
                      <select
                        value={
                          productType
                        }
                        onChange={(e) =>
                          setProductType(
                            e.target
                              .value as (typeof PRODUCT_TYPES)[number]
                          )
                        }
                        className={
                          selectClass
                        }
                      >
                        {PRODUCT_TYPES.map(
                          (type) => (
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
                      </select>
                    </SelectWrap>
                  </Field>
                </div>
              </section>

              {/* DELIVERY */}

              <section className={sectionClass}>
                <SectionHeader
                  icon={Truck}
                  eyebrow="06 / Fulfilment"
                  title="Delivery Settings"
                  description="Choose how delivery should be charged for this product."
                />

                <div className="grid grid-cols-2 gap-2 rounded-[19px] border border-[#e1e8df] bg-[#f3f6f2] p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryType(
                        "free"
                      );
                      setDeliveryCharge(
                        "0"
                      );
                    }}
                    className={`rounded-[14px] px-3 py-3.5 text-xs font-bold transition ${
                      deliveryType ===
                      "free"
                        ? "bg-[#10291d] text-white shadow-[0_8px_22px_rgba(16,41,29,0.16)]"
                        : "text-[#718078] hover:bg-white/70"
                    }`}
                  >
                    Free Delivery
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryType(
                        "paid"
                      );

                      if (
                        !deliveryCharge ||
                        deliveryCharge ===
                          "0"
                      ) {
                        setDeliveryCharge(
                          ""
                        );
                      }
                    }}
                    className={`rounded-[14px] px-3 py-3.5 text-xs font-bold transition ${
                      deliveryType ===
                      "paid"
                        ? "bg-[#10291d] text-white shadow-[0_8px_22px_rgba(16,41,29,0.16)]"
                        : "text-[#718078] hover:bg-white/70"
                    }`}
                  >
                    Paid Delivery
                  </button>
                </div>

                {deliveryType ===
                "free" ? (
                  <div className="rounded-[21px] border border-[#cfe0c8] bg-[#f2f7ee] p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dcebd3] text-[#315c42]">
                        <Truck className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#234636]">
                          Free delivery
                          enabled
                        </p>

                        <p className="mt-1.5 text-xs leading-5 text-[#65756b]">
                          Customers will
                          not be charged
                          a delivery fee
                          for this
                          product.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Field label="Delivery Charge">
                    <MoneyInput>
                      <input
                        type="number"
                        min="0"
                        value={
                          deliveryCharge
                        }
                        onChange={(e) =>
                          setDeliveryCharge(
                            e.target
                              .value
                          )
                        }
                        placeholder="250"
                        className={`${inputClass} pl-14`}
                      />
                    </MoneyInput>

                    <p className="mt-2 text-[10px] font-medium leading-5 text-[#89948d]">
                      This charge will
                      apply when this
                      product is selected.
                    </p>
                  </Field>
                )}
              </section>

              {/* SEO */}

              <section className={sectionClass}>
                <SectionHeader
                  icon={Tag}
                  eyebrow="07 / Discovery"
                  title="SEO Settings"
                  description="Optional information for search engines."
                />

                <div className="mb-5 rounded-[19px] border border-[#dfe9db] bg-[#f5f8f3] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10291d] text-[#c5dda8]">
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#53745e]">
                        Search Discovery
                      </p>

                      <p className="mt-1 text-xs text-[#748078]">
                        Improve how this
                        product appears
                        in search.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <Field label="SEO Title">
                    <input
                      value={seoTitle}
                      onChange={(e) =>
                        setSeoTitle(
                          e.target.value
                        )
                      }
                      maxLength={200}
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
                      maxLength={320}
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

              {/* VISIBILITY */}

              <section className={sectionClass}>
                <SectionHeader
                  icon={ShieldCheck}
                  eyebrow="08 / Storefront"
                  title="Visibility"
                  description="Control how this product appears to customers."
                />

                <div className="space-y-3">
                  <ToggleRow
                    title="Active Product"
                    description="Visible to customers"
                    checked={isActive}
                    onChange={
                      setIsActive
                    }
                  />

                  <ToggleRow
                    title="Featured Product"
                    description="Show in featured sections"
                    checked={
                      isFeatured
                    }
                    onChange={
                      setIsFeatured
                    }
                  />
                </div>
              </section>

              {/* PREMIUM SIDE NOTE */}

              <div className="relative overflow-hidden rounded-[27px] bg-[#10291d] p-6 shadow-[0_18px_45px_rgba(16,41,29,0.13)]">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#315c42]/50 blur-2xl" />

                <div className="relative">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#c5dda8] text-[#10291d]">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b9d39e]">
                    Product Workspace
                  </p>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    Ready to refine?
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/50">
                    Keep your product
                    information polished,
                    consistent and ready
                    for your storefront.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c5dda8]" />
                    Changes are saved when
                    you publish
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================
              BOTTOM ACTION
          ========================= */}

          <div className="relative overflow-hidden rounded-[25px] bg-[#10291d] p-3 shadow-[0_18px_50px_rgba(16,41,29,0.12)] sm:p-4">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#315c42]/35 blur-3xl" />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="px-2 sm:px-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b9d39e]">
                  Product Editor
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Review your changes before
                  saving.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Link
                  href="/admin/products"
                  className="inline-flex h-12 items-center justify-center rounded-[15px] border border-white/10 bg-white/[0.05] px-6 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    imagesUploading
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[15px] bg-[#c5dda8] px-7 text-sm font-bold text-[#173321] shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition hover:bg-[#d4e8bc] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />

                  {imagesUploading
                    ? "Uploading Images..."
                    : saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   PREMIUM UI COMPONENTS
========================= */

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#10291d] text-[#c5dda8] shadow-[0_8px_22px_rgba(16,41,29,0.12)]">
          <Icon className="h-[18px] w-[18px]" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#7e8b82]">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-[17px] font-semibold tracking-[-0.01em] text-[#17231c]">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-[#89948d]">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6 h-px bg-[#edf1ec]" />
    </div>
  );
}

function MoneyInput({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[9px] bg-[#edf3e9] text-[10px] font-bold text-[#31553d]">
        Rs.
      </div>

      {children}
    </div>
  );
}

function SelectWrap({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718078]" />
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between rounded-[20px] border border-[#e1e8df] bg-[#fbfcfa] p-4 transition hover:border-[#cbd8cd] hover:bg-white hover:shadow-[0_8px_24px_rgba(16,41,29,0.04)]">
      <div>
        <p className="text-sm font-semibold text-[#26352c]">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-5 text-[#89948d]">
          {description}
        </p>
      </div>

      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) =>
            onChange(
              e.target.checked
            )
          }
          className="peer sr-only"
        />

        <span className="block h-7 w-12 rounded-full bg-[#dfe7df] transition peer-checked:bg-[#10291d]" />

        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-[0_2px_7px_rgba(16,41,29,0.18)] transition peer-checked:translate-x-5" />
      </div>
    </label>
  );
}

/* =========================
   HELPERS
========================= */

function splitLines(
  value: string
): string[] {
  return value
    .split("\n")
    .map((item) =>
      item.trim()
    )
    .filter(Boolean);
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
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#7e8b82]">
        {label}

        {required && (
          <span className="ml-1 text-[#b24b43]">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

/* =========================
   PREMIUM CLASSES
========================= */

const sectionClass =
  "rounded-[28px] border border-[#e0e7df] bg-white p-5 shadow-[0_14px_45px_rgba(16,41,29,0.045)] transition-shadow sm:p-7";

const inputClass =
  "h-[54px] w-full rounded-[16px] border border-[#dfe7de] bg-[#fbfcfa] px-4 text-[13px] font-medium text-[#26352c] outline-none transition duration-200 placeholder:text-[#a3aca6] hover:border-[#cdd8cf] focus:border-[#6f8b78] focus:bg-white focus:ring-4 focus:ring-[#b9d39e]/25 focus:shadow-[0_8px_24px_rgba(16,41,29,0.06)]";

const textareaClass =
  "w-full resize-y rounded-[16px] border border-[#dfe7de] bg-[#fbfcfa] px-4 py-4 text-[13px] font-medium leading-6 text-[#26352c] outline-none transition duration-200 placeholder:text-[#a3aca6] hover:border-[#cdd8cf] focus:border-[#6f8b78] focus:bg-white focus:ring-4 focus:ring-[#b9d39e]/25 focus:shadow-[0_8px_24px_rgba(16,41,29,0.06)]";

const selectClass =
  "h-[54px] w-full cursor-pointer appearance-none rounded-[16px] border border-[#dfe7de] bg-[#fbfcfa] px-4 pr-11 text-[13px] font-medium text-[#26352c] outline-none transition duration-200 hover:border-[#cdd8cf] focus:border-[#6f8b78] focus:bg-white focus:ring-4 focus:ring-[#b9d39e]/25 focus:shadow-[0_8px_24px_rgba(16,41,29,0.06)]";