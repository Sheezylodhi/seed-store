"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Eye,
  FileText,
  ImageIcon,
  Layers3,
  Package,
  Search,
  Star,
  Tag,
  CheckCircle2,
  XCircle,
  Boxes,
  Trash2,
} from "lucide-react";

type Variant = {
  _id?: string;
  packSize?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  isActive: boolean;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  category:
    | {
        _id: string;
        name: string;
        slug: string;
      }
    | string;
  productType:
    | "Phase 1"
    | "Phase 2"
    | "Complete Pack"
    | "Single Seed";
  shortDescription?: string;
  description?: string;
  images: string[];

  price?: number;
  compareAtPrice?: number;
  stock?: number;
  sku?: string;

  variants: Variant[];

  ingredients: string[];
  benefits: string[];
  howToUse: string[];

  isFeatured: boolean;
  isActive: boolean;

  seo: {
    title?: string;
    description?: string;
    keywords: string[];
  };

  createdAt: string;
  updatedAt: string;
};

function formatPrice(value?: number) {
  if (value === undefined || value === null) return "—";

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCategoryName(category: Product["category"]) {
  if (!category) return "Uncategorized";

  if (typeof category === "string") {
    return category;
  }

  return category.name;
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="group relative overflow-hidden rounded-[28px] border border-[#e1e8e1] bg-white p-5 shadow-[0_16px_45px_rgba(16,41,29,0.055)] transition duration-300 hover:border-[#d5dfd5] hover:shadow-[0_20px_55px_rgba(16,41,29,0.075)] sm:p-7">
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-[#b9d39e]/[0.045] blur-2xl" />

      <div className="relative mb-6 flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[#10291d] text-[#c5dda8] shadow-[0_8px_20px_rgba(16,41,29,0.13)]">
          <Icon size={18} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#91a096]">
            Product Details
          </p>

          <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-[#17231c]">
            {title}
          </h2>
        </div>
      </div>

      <div className="relative">{children}</div>
    </section>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#89948d]">
        {label}
      </p>

      <div className="text-sm font-medium leading-6 text-[#26352c]">
        {value || "—"}
      </div>
    </div>
  );
}

function EmptyValue({ text = "Not added" }: { text?: string }) {
  return <span className="text-[#a0aaa4]">{text}</span>;
}

export default function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/admin/products/${id}`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load product");
        }

        setProduct(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const deleteProduct = async () => {
    if (!product || deleting) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/admin/products/${product._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.error ||
            "Failed to delete product."
        );
      }

      window.location.href = "/admin/products";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete product."
      );

      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1500px] pb-20">
          <Link
            href="/admin/products"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dfe7df] bg-white px-4 py-2.5 text-xs font-bold text-[#536158] shadow-[0_5px_18px_rgba(16,41,29,0.04)] transition hover:border-[#315c42] hover:text-[#10291d]"
          >
            <ArrowLeft size={15} />
            Back to Products
          </Link>

          <div className="relative overflow-hidden rounded-[32px] border border-[#e4e9e3] bg-white px-6 py-16 text-center shadow-[0_20px_60px_rgba(16,41,29,0.06)] sm:px-10">
            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-red-100/40 blur-3xl" />

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-red-50 text-red-500 shadow-sm">
              <XCircle size={32} strokeWidth={1.7} />
            </div>

            <p className="relative mt-6 text-[10px] font-bold uppercase tracking-[0.24em] text-[#9aa49e]">
              Catalog / Error
            </p>

            <h1 className="relative mt-2 text-2xl font-semibold tracking-[-0.025em] text-[#17231c]">
              Product Not Found
            </h1>

            <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-[#718078]">
              {error || "This product could not be found."}
            </p>

            <Link
              href="/admin/products"
              className="relative mt-7 inline-flex items-center justify-center rounded-[15px] bg-[#10291d] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(16,41,29,0.15)] transition hover:-translate-y-0.5 hover:bg-[#193b29]"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const hasVariants = product.variants?.length > 0;

  const totalVariantStock = hasVariants
    ? product.variants.reduce(
        (total, variant) => total + variant.stock,
        0
      )
    : product.stock ?? 0;

  const startingPrice = hasVariants
    ? Math.min(
        ...product.variants.map((variant) => variant.price)
      )
    : product.price;

  return (
    <main className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
      <div className="mx-auto max-w-[1500px] pb-24">
        {/* Header */}
        <header className="relative mb-7 overflow-hidden rounded-[32px] bg-[#10291d] p-6 shadow-[0_24px_70px_rgba(16,41,29,0.16)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#315c42]/45 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 right-24 h-64 w-64 rounded-full border border-white/[0.07]" />

          <div className="pointer-events-none absolute right-12 top-12 h-24 w-24 rounded-full border border-[#c5dda8]/10" />

          <div className="relative">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <Link
                  href="/admin/products"
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-semibold text-white/65 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft size={14} />
                  Back to Products
                </Link>

                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#b9d39e]/15 bg-[#b9d39e]/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#c5dda8]">
                    Catalog / Product
                  </span>

                  {product.isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b9d39e]/15 bg-[#b9d39e]/10 px-3 py-1.5 text-[10px] font-semibold text-[#c5dda8]">
                      <CheckCircle2 size={12} />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-white/55">
                      <XCircle size={12} />
                      Inactive
                    </span>
                  )}

                  {product.isFeatured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9bf68]/20 bg-[#d9bf68]/10 px-3 py-1.5 text-[10px] font-semibold text-[#e6cf7c]">
                      <Star size={12} />
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-[44px] lg:leading-[1.05]">
                  {product.name}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-[15px]">
                  Product details, pricing, inventory, content and search
                  information — all in one place.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href={`/admin/products/${product._id}/edit`}
                  className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[15px] border border-white/10 bg-white/[0.055] px-5 text-sm font-bold text-white shadow-sm backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10"
                >
                  <Edit3 size={16} />
                  Edit Product
                </Link>

                <a
                  href={`/store/${product.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[15px] bg-[#c5dda8] px-5 text-sm font-bold text-[#173321] shadow-[0_10px_28px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:bg-[#d1e7b7]"
                >
                  <Eye size={16} />
                  View Store
                </a>

                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[15px] border border-[#f0d8d4]/20 bg-[#a84d42]/90 px-5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:bg-[#b45549]"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Product overview */}
        <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            icon={Tag}
            label="Category"
            value={getCategoryName(product.category)}
            eyebrow="Organization"
          />

          <OverviewCard
            icon={Package}
            label="Starting Price"
            value={formatPrice(startingPrice)}
            eyebrow="Pricing"
          />

          <OverviewCard
            icon={Boxes}
            label="Stock"
            value={
              <>
                {totalVariantStock}
                {hasVariants && (
                  <span className="ml-1.5 text-xs font-medium text-[#89948d]">
                    units
                  </span>
                )}
              </>
            }
            eyebrow="Inventory"
          />

          <OverviewCard
            icon={Layers3}
            label="Product Type"
            value={product.productType}
            eyebrow="Classification"
          />
        </div>

        <div className="grid gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(350px,0.85fr)]">
          {/* Left */}
          <div className="space-y-7">
            <SectionCard icon={FileText} title="Basic Information">
              <div className="space-y-6">
                <InfoItem label="Product Name" value={product.name} />

                <div className="grid gap-6 sm:grid-cols-2">
                  <InfoItem label="Slug" value={product.slug} />

                  <InfoItem
                    label="Product Type"
                    value={product.productType}
                  />
                </div>

                <div className="h-px bg-[#edf1ec]" />

                <InfoItem
                  label="Short Description"
                  value={
                    product.shortDescription ? (
                      <div className="rounded-[17px] border border-[#e7ece6] bg-[#fafcf9] p-4 text-sm leading-6 text-[#536158]">
                        {product.shortDescription}
                      </div>
                    ) : (
                      <EmptyValue />
                    )
                  }
                />

                <InfoItem
                  label="Description"
                  value={
                    product.description ? (
                      <div className="rounded-[17px] border border-[#e7ece6] bg-[#fafcf9] p-4 text-sm leading-7 text-[#536158]">
                        <p className="whitespace-pre-line">
                          {product.description}
                        </p>
                      </div>
                    ) : (
                      <EmptyValue />
                    )
                  }
                />
              </div>
            </SectionCard>

            {/* Pricing */}
            <SectionCard icon={Package} title="Pricing & Inventory">
              {hasVariants ? (
                <div className="space-y-4">
                  {product.variants.map((variant, index) => (
                    <div
                      key={variant._id || index}
                      className="relative overflow-hidden rounded-[22px] border border-[#e1e8e1] bg-[#fafcf9] p-5 shadow-[0_8px_28px_rgba(16,41,29,0.035)] transition hover:border-[#d2ddd3] hover:bg-white"
                    >
                      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#b9d39e]/[0.06] blur-2xl" />

                      <div className="relative mb-5 flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#10291d] text-[#c5dda8]">
                            <Package size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#26352c]">
                              {variant.packSize ||
                                `Variant ${index + 1}`}
                            </p>

                            <p className="mt-1 truncate font-mono text-[10px] font-medium tracking-wide text-[#89948d]">
                              SKU: {variant.sku}
                            </p>
                          </div>
                        </div>

                        {variant.isActive ? (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#eaf2e6] px-3 py-1.5 text-[10px] font-bold text-[#31553d]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#53745e]" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#f0f2f0] px-3 py-1.5 text-[10px] font-bold text-[#718078]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#9aa49e]" />
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="relative grid grid-cols-2 gap-5 rounded-[17px] border border-[#e6ece5] bg-white p-4 sm:grid-cols-3">
                        <InfoItem
                          label="Price"
                          value={
                            <span className="text-[#10291d]">
                              {formatPrice(variant.price)}
                            </span>
                          }
                        />

                        <InfoItem
                          label="Compare Price"
                          value={
                            variant.compareAtPrice
                              ? formatPrice(variant.compareAtPrice)
                              : "—"
                          }
                        />

                        <InfoItem
                          label="Stock"
                          value={variant.stock}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricBox
                    label="Price"
                    value={formatPrice(product.price)}
                    highlighted
                  />

                  <MetricBox
                    label="Compare Price"
                    value={
                      product.compareAtPrice
                        ? formatPrice(product.compareAtPrice)
                        : "—"
                    }
                  />

                  <MetricBox
                    label="Stock"
                    value={product.stock ?? "—"}
                  />

                  <MetricBox
                    label="SKU"
                    value={
                      product.sku || (
                        <EmptyValue text="Not assigned" />
                      )
                    }
                  />
                </div>
              )}
            </SectionCard>

            {/* Images */}
            <SectionCard icon={ImageIcon} title="Product Images">
              {product.images?.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {product.images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="group/image relative overflow-hidden rounded-[22px] border border-[#e1e8e1] bg-[#f5f7f4] shadow-[0_8px_25px_rgba(16,41,29,0.04)]"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={image}
                          alt={`${product.name} image ${
                            index + 1
                          }`}
                          className="h-full w-full object-cover transition duration-700 group-hover/image:scale-[1.045]"
                        />
                      </div>

                      <div className="absolute left-3 top-3 flex h-8 min-w-8 items-center justify-center rounded-full border border-white/20 bg-[#10291d]/75 px-2 text-[10px] font-bold text-white shadow-lg backdrop-blur-md">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#dce3dc] bg-[#fafcf9] py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#edf3e9] text-[#899e8d]">
                    <ImageIcon size={26} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-[#536158]">
                    No product images added
                  </p>

                  <p className="mt-1 text-xs text-[#9aa49e]">
                    Product imagery has not been configured yet.
                  </p>
                </div>
              )}
            </SectionCard>

            {/* Product content */}
            <div className="grid gap-6 sm:grid-cols-3">
              <ListCard
                title="Ingredients"
                eyebrow="01"
                items={product.ingredients}
              />

              <ListCard
                title="Benefits"
                eyebrow="02"
                items={product.benefits}
              />

              <ListCard
                title="How To Use"
                eyebrow="03"
                items={product.howToUse}
              />
            </div>
          </div>

          {/* Right */}
          <div className="space-y-7">
            <SectionCard icon={Tag} title="Organization">
              <div className="space-y-5">
                <InfoItem
                  label="Category"
                  value={getCategoryName(product.category)}
                />

                <InfoItem
                  label="Product Type"
                  value={product.productType}
                />

                <div className="h-px bg-[#edf1ec]" />

                <InfoItem
                  label="Status"
                  value={
                    product.isActive ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#edf3e9] px-3 py-1.5 text-xs font-bold text-[#31553d]">
                        <CheckCircle2 size={14} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f1f2f1] px-3 py-1.5 text-xs font-bold text-[#718078]">
                        <XCircle size={14} />
                        Inactive
                      </span>
                    )
                  }
                />

                <InfoItem
                  label="Featured"
                  value={
                    product.isFeatured ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#fff7df] px-3 py-1.5 text-xs font-bold text-[#8b6b16]">
                        <Star size={14} />
                        Featured Product
                      </span>
                    ) : (
                      "No"
                    )
                  }
                />
              </div>
            </SectionCard>

            {/* SEO */}
            <SectionCard icon={Search} title="SEO Information">
              <div className="space-y-5">
                <InfoItem
                  label="SEO Title"
                  value={
                    product.seo?.title ? (
                      <div className="rounded-[16px] border border-[#e5ebe4] bg-[#fafcf9] p-3.5">
                        {product.seo.title}
                      </div>
                    ) : (
                      <EmptyValue />
                    )
                  }
                />

                <InfoItem
                  label="SEO Description"
                  value={
                    product.seo?.description ? (
                      <div className="rounded-[16px] border border-[#e5ebe4] bg-[#fafcf9] p-3.5 text-sm leading-6 text-[#536158]">
                        {product.seo.description}
                      </div>
                    ) : (
                      <EmptyValue />
                    )
                  }
                />

                <InfoItem
                  label="Keywords"
                  value={
                    product.seo?.keywords?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {product.seo.keywords.map(
                          (keyword, index) => (
                            <span
                              key={`${keyword}-${index}`}
                              className="rounded-full border border-[#dce7d9] bg-[#edf3e9] px-3 py-1.5 text-[11px] font-semibold text-[#31553d]"
                            >
                              {keyword}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <EmptyValue />
                    )
                  }
                />
              </div>
            </SectionCard>

            {/* Product Meta */}
            <SectionCard
              icon={Layers3}
              title="Product Information"
            >
              <div className="space-y-5">
                <InfoItem
                  label="Product ID"
                  value={
                    <div className="rounded-[16px] border border-[#e5ebe4] bg-[#fafcf9] p-3.5">
                      <span className="block break-all font-mono text-[10px] leading-5 text-[#536158]">
                        {product._id}
                      </span>
                    </div>
                  }
                />

                <div className="h-px bg-[#edf1ec]" />

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                  <InfoItem
                    label="Created"
                    value={formatDate(product.createdAt)}
                  />

                  <InfoItem
                    label="Last Updated"
                    value={formatDate(product.updatedAt)}
                  />
                </div>
              </div>
            </SectionCard>

            {/* SEO Preview */}
            <section className="relative overflow-hidden rounded-[28px] border border-[#d8e4d7] bg-[#f4f8f1] p-5 shadow-[0_16px_45px_rgba(16,41,29,0.055)] sm:p-7">
              <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#b9d39e]/30 blur-3xl" />

              <div className="relative mb-6 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#10291d] text-[#c5dda8] shadow-[0_8px_20px_rgba(16,41,29,0.13)]">
                  <Search size={18} />
                </div>

                <div>
                  <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#718078]">
                    Search Discovery
                  </p>

                  <h2 className="text-[17px] font-semibold text-[#17231c]">
                    Search Preview
                  </h2>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[21px] border border-[#dce7d9] bg-white p-5 shadow-[0_8px_25px_rgba(16,41,29,0.045)]">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#53745e]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9aa49e]">
                    Organic Search Result
                  </span>
                </div>

                <p className="truncate text-[18px] font-semibold tracking-[-0.015em] text-[#1a5f2a]">
                  {product.seo?.title || product.name}
                </p>

                <p className="mt-1.5 truncate text-[11px] font-medium text-[#718078]">
                  /products/{product.slug}
                </p>

                <div className="my-4 h-px bg-[#edf1ec]" />

                <p className="line-clamp-4 text-sm leading-6 text-[#718078]">
                  {product.seo?.description ||
                    product.shortDescription ||
                    "No SEO description added for this product."}
                </p>
              </div>
            </section>

            {/* Quick status */}
            <section className="relative overflow-hidden rounded-[28px] bg-[#10291d] p-6 shadow-[0_18px_50px_rgba(16,41,29,0.13)]">
              <div className="pointer-events-none absolute -bottom-16 -right-12 h-40 w-40 rounded-full bg-[#315c42]/50 blur-3xl" />

              <div className="relative">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#b9d39e]">
                  Product Status
                </p>

                <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">
                  {product.isActive
                    ? "Currently visible in catalog"
                    : "Currently hidden from catalog"}
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/50">
                  {product.isFeatured
                    ? "This product is also marked as a featured item."
                    : "This product is not currently marked as featured."}
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      product.isActive
                        ? "bg-[#b9d39e]"
                        : "bg-white/30"
                    }`}
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/65">
                    {product.isActive ? "Live" : "Inactive"}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="mt-8 rounded-[28px] bg-[#10291d] p-3 shadow-[0_20px_55px_rgba(16,41,29,0.12)] sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="hidden pl-3 sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b9d39e]">
                Catalog Management
              </p>

              <p className="mt-1 text-xs text-white/45">
                Review or update this product whenever needed.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/admin/products"
                className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[15px] border border-white/10 bg-white/[0.055] px-5 text-sm font-bold text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft size={15} />
                Back to Products
              </Link>

              <Link
                href={`/admin/products/${product._id}/edit`}
                className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[15px] bg-[#c5dda8] px-5 text-sm font-bold text-[#173321] shadow-[0_8px_22px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:bg-[#d1e7b7]"
              >
                <Edit3 size={16} />
                Edit Product
              </Link>

              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[15px] border border-[#f0d8d4]/20 bg-[#a84d42] px-5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(16,41,29,0.12)] transition hover:-translate-y-0.5 hover:bg-[#b45549]"
              >
                <Trash2 size={16} />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          DELETE CONFIRMATION MODAL
          ========================================================= */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-product-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#07130d]/65 backdrop-blur-md"
            onClick={() => {
              if (!deleting) {
                setDeleteModalOpen(false);
              }
            }}
          />

          {/* Modal */}
          <div className="relative w-full max-w-[470px] overflow-hidden rounded-[28px] border border-[#e3e9e3] bg-white shadow-[0_35px_100px_rgba(5,20,12,0.28)]">
            {/* Decorative Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#b9d39e]/25 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-[#f1d9d5]/35 blur-3xl" />

            <div className="relative p-6 sm:p-7">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[#fff3f1] text-[#a84d42] ring-1 ring-[#f0d8d4]">
                  <Trash2 size={20} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a17670]">
                    Catalog Management
                  </p>

                  <h3
                    id="delete-product-title"
                    className="mt-1.5 text-[20px] font-semibold tracking-[-0.025em] text-[#17231c]"
                  >
                    Delete Product?
                  </h3>

                  <p className="mt-2 text-[13px] leading-5 text-[#7b8780]">
                    Are you sure you want to permanently delete this
                    product? This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Product Preview */}
              <div className="mt-6 rounded-[20px] border border-[#e4ebe3] bg-[#f8faf7] p-4">
                <div className="flex items-center gap-3.5">
                  {/* Image */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[15px] border border-[#dfe7dc] bg-white shadow-sm">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#6c8273]">
                        <Package
                          size={20}
                          strokeWidth={1.7}
                        />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#9aa49e]">
                      Selected Product
                    </p>

                    <p className="mt-1 truncate text-[14px] font-bold text-[#26352c]">
                      {product.name}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="truncate text-[10px] text-[#9aa49e]">
                        /{product.slug}
                      </span>

                      <span className="h-1 w-1 shrink-0 rounded-full bg-[#c5cec7]" />

                      <span className="shrink-0 text-[10px] font-medium text-[#89948d]">
                        {getCategoryName(product.category)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="mt-4 flex gap-3 rounded-[17px] border border-[#f0dfdc] bg-[#fff8f6] px-4 py-3.5">
                <XCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-[#ad5146]"
                  strokeWidth={1.8}
                />

                <div>
                  <p className="text-[11px] font-bold text-[#8e4e46]">
                    Permanent deletion
                  </p>

                  <p className="mt-0.5 text-[10px] leading-5 text-[#9b6b64]">
                    This product will be removed from the admin
                    catalog and storefront permanently.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                {/* Cancel */}
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteModalOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#dce4dc] bg-white px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#59675e] transition duration-200 hover:border-[#cbd7cc] hover:bg-[#f8faf7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* Confirm Delete */}
                <button
                  type="button"
                  disabled={deleting}
                  onClick={deleteProduct}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#a84d42] px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_25px_rgba(168,77,66,0.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#963f35] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {deleting ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} strokeWidth={2} />
                      Delete Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function OverviewCard({
  icon: Icon,
  label,
  value,
  eyebrow,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  eyebrow: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-[#e1e8e1] bg-white p-5 shadow-[0_12px_35px_rgba(16,41,29,0.045)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d4ded5] hover:shadow-[0_18px_45px_rgba(16,41,29,0.07)]">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#b9d39e]/[0.08] blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#10291d] text-[#c5dda8] shadow-[0_8px_18px_rgba(16,41,29,0.12)]">
          <Icon size={18} strokeWidth={1.8} />
        </div>

        <span className="pt-1 text-[8px] font-bold uppercase tracking-[0.2em] text-[#a0aaa4]">
          {eyebrow}
        </span>
      </div>

      <div className="relative mt-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#89948d]">
          {label}
        </p>

        <p className="mt-1.5 truncate text-[16px] font-bold tracking-[-0.01em] text-[#26352c]">
          {value}
        </p>
      </div>
    </div>
  );
}

function MetricBox({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div className="rounded-[19px] border border-[#e4eae3] bg-[#fafcf9] p-4 transition hover:border-[#d5dfd5] hover:bg-white">
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#89948d]">
        {label}
      </p>

      <div
        className={`mt-2 text-[16px] font-bold ${
          highlighted
            ? "text-[#10291d]"
            : "text-[#26352c]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  eyebrow,
}: {
  title: string;
  items: string[];
  eyebrow: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-[#e1e8e1] bg-white p-5 shadow-[0_12px_35px_rgba(16,41,29,0.045)] sm:p-6">
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-[#b9d39e]/[0.055] blur-2xl" />

      <div className="relative mb-5 flex items-start justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#91a096]">
            Content
          </p>

          <h2 className="mt-1 text-[16px] font-semibold tracking-[-0.015em] text-[#17231c]">
            {title}
          </h2>
        </div>

        <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#edf3e9] text-[9px] font-bold text-[#31553d]">
          {eyebrow}
        </span>
      </div>

      {items?.length ? (
        <ul className="relative space-y-2.5">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex gap-3 rounded-[13px] border border-transparent bg-[#fafcf9] px-3 py-2.5 text-[13px] leading-5 text-[#536158] transition hover:border-[#e3eae2] hover:bg-white"
            >
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#53745e]" />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-[15px] border border-dashed border-[#dce3dc] bg-[#fafcf9] px-4 py-5 text-center">
          <p className="text-xs text-[#9aa49e]">
            Not added
          </p>
        </div>
      )}
    </section>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#f7f9f6] px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
      <div className="mx-auto max-w-[1500px] pb-20">
        <div className="mb-7 overflow-hidden rounded-[32px] bg-[#10291d] p-6 shadow-[0_24px_70px_rgba(16,41,29,0.12)] sm:p-8 lg:p-10">
          <div className="h-9 w-32 animate-pulse rounded-full bg-white/10" />

          <div className="mt-8 h-5 w-40 animate-pulse rounded bg-white/10" />

          <div className="mt-3 h-12 w-80 max-w-full animate-pulse rounded-xl bg-white/10" />

          <div className="mt-4 h-5 w-[500px] max-w-full animate-pulse rounded bg-white/10" />
        </div>

        <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-[24px] border border-[#e4e9e3] bg-white shadow-[0_10px_30px_rgba(16,41,29,0.03)]"
            />
          ))}
        </div>

        <div className="grid gap-7 xl:grid-cols-[minmax(0,1.55fr)_minmax(350px,0.85fr)]">
          <div className="space-y-7">
            <div className="h-[430px] animate-pulse rounded-[28px] bg-white" />
            <div className="h-[350px] animate-pulse rounded-[28px] bg-white" />
            <div className="h-[400px] animate-pulse rounded-[28px] bg-white" />
          </div>

          <div className="space-y-7">
            <div className="h-[300px] animate-pulse rounded-[28px] bg-white" />
            <div className="h-[380px] animate-pulse rounded-[28px] bg-white" />
            <div className="h-[330px] animate-pulse rounded-[28px] bg-white" />
            <div className="h-[330px] animate-pulse rounded-[28px] bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}