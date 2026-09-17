"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Filter,
  Loader2,
  ShoppingBag,
  Sprout,
  Package,
  Sparkles,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  images: string[];
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  isFeatured?: boolean;
  isActive: boolean;
  category: string | Category;
  variants?: {
    _id?: string;
    packSize?: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    sku: string;
    isActive: boolean;
  }[];
}

export default function CategoryDetailPage() {
  const params = useParams();

  const id = params?.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/categories/${encodeURIComponent(id)}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load category."
          );
        }

        setCategory(result.data.category);
        setProducts(result.data.products || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load category."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  const getProductPrice = (product: Product) => {
    if (
      product.price !== undefined &&
      product.price !== null
    ) {
      return product.price;
    }

    const activeVariant = product.variants?.find(
      (variant) => variant.isActive
    );

    return activeVariant?.price ?? 0;
  };

  const getComparePrice = (product: Product) => {
    if (
      product.compareAtPrice !== undefined &&
      product.compareAtPrice !== null
    ) {
      return product.compareAtPrice;
    }

    const activeVariant = product.variants?.find(
      (variant) => variant.isActive
    );

    return activeVariant?.compareAtPrice;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f6] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-[1550px] items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#10291d] text-white shadow-[0_18px_45px_rgba(16,41,29,0.16)]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>

            <p className="mt-5 text-sm font-semibold text-[#536158]">
              Loading category
            </p>

            <p className="mt-1 text-xs text-[#89948d]">
              Preparing the collection for you...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="min-h-screen bg-[#f7f9f6] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-[1550px] items-center justify-center">
          <div className="w-full max-w-[520px] overflow-hidden rounded-[30px] border border-[#dfe7df] bg-white shadow-[0_25px_80px_rgba(16,41,29,0.08)]">
            <div className="bg-[#10291d] px-6 py-7 text-white sm:px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <Sprout className="h-6 w-6" />
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5dda8]">
                Collection
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                Category not found
              </h1>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-sm leading-6 text-[#718078]">
                {error ||
                  "This category is no longer available or could not be found."}
              </p>

              <Link
                href="/admin/categories"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#10291d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#193a29]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to categories
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9f6] text-[#17231c]">
      {/* Top Navigation / Breadcrumb */}
      <div className="border-b border-[#dfe7df] bg-white">
        <div className="mx-auto flex max-w-[1550px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-[#89948d] sm:text-sm">
            <Link
              href="/"
              className="shrink-0 transition hover:text-[#10291d]"
            >
              Home
            </Link>

            <ChevronRight className="h-3.5 w-3.5 shrink-0" />

            <Link
              href="/admin/categories"
              className="shrink-0 transition hover:text-[#10291d]"
            >
              Categories
            </Link>

            <ChevronRight className="h-3.5 w-3.5 shrink-0" />

            <span className="truncate font-semibold text-[#10291d]">
              {category.name}
            </span>
          </div>

          <Link
            href="/admin/categories"
            className="hidden shrink-0 items-center gap-2 rounded-xl border border-[#dfe7df] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#536158] transition hover:border-[#10291d] hover:text-[#10291d] sm:inline-flex"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All categories
          </Link>
        </div>
      </div>

      {/* Category Hero */}
      <section className="px-4 pb-6 pt-5 sm:px-6 lg:px-8 xl:px-10">
        <div className="relative mx-auto max-w-[1550px] overflow-hidden rounded-[30px] border border-[#dbe5dc] bg-[#10291d] shadow-[0_25px_80px_rgba(16,41,29,0.14)]">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#c5dda8]/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 left-[38%] h-80 w-80 rounded-full bg-[#315c45]/35 blur-3xl" />
          <div className="pointer-events-none absolute right-[32%] top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/[0.025] blur-2xl" />

          <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
            {/* Hero Content */}
            <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14 xl:px-16">
              <Link
                href="/admin/categories"
                className="mb-7 inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-xs font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All categories
              </Link>

              <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5dda8]">
                <Sprout className="h-3.5 w-3.5" />
                Seed Collection
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                {category.name}
              </h1>

              {category.description && (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base lg:text-[17px]">
                  {category.description}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs font-semibold text-white/75">
                  <CheckCircle2 className="h-4 w-4 text-[#c5dda8]" />
                  Quality focused
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-xs font-semibold text-white/75">
                  <ShoppingBag className="h-4 w-4 text-[#c5dda8]" />
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"}
                </div>

                {category.isActive && (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[#c5dda8]/20 bg-[#c5dda8]/10 px-3.5 py-2.5 text-xs font-semibold text-[#c5dda8]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c5dda8]" />
                    Active collection
                  </div>
                )}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative min-h-[300px] overflow-hidden border-t border-white/10 lg:min-h-[500px] lg:border-l lg:border-t-0">
              {category.image ? (
                <>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-[#10291d]/50 via-transparent to-transparent lg:from-[#10291d]/65 lg:via-[#10291d]/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10291d]/45 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/15 bg-[#10291d]/45 px-4 py-3 backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
                        Collection
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {category.name}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#c5dda8]">
                      <Sprout className="h-4 w-4" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center bg-gradient-to-br from-[#193a29] to-[#10291d] lg:min-h-[500px]">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/10 bg-white/[0.06]">
                      <Sprout className="h-9 w-9 text-[#c5dda8]" />
                    </div>

                    <p className="mt-4 text-xs font-semibold text-white/40">
                      {category.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="mx-auto max-w-[1550px] px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pb-20 xl:px-10">
        {/* Section Header */}
        <div className="mb-6 flex flex-col gap-5 rounded-[24px] border border-[#dfe7df] bg-white p-5 shadow-[0_15px_50px_rgba(16,41,29,0.045)] sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3e9] text-[#10291d]">
                <Package className="h-4 w-4" />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#89948d]">
                Shop collection
              </p>
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#17231c] sm:text-3xl">
              Products in {category.name}
            </h2>

            <p className="mt-1.5 text-sm text-[#89948d]">
              Explore the available products from this seed collection.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl bg-[#f1f5f0] px-3.5 py-2.5 text-xs font-semibold text-[#536158] sm:flex">
              <ShoppingBag className="h-4 w-4 text-[#10291d]" />
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dfe6df] bg-white px-4 py-2.5 text-sm font-semibold text-[#536158] transition hover:border-[#10291d] hover:text-[#10291d]"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-[0_20px_65px_rgba(16,41,29,0.05)]">
            <div className="mx-auto max-w-xl px-6 py-20 text-center sm:py-24">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#edf3e9] text-[#10291d]">
                <ShoppingBag className="h-7 w-7" />
              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#89948d]">
                Collection empty
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#17231c]">
                No products yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#718078]">
                Products for this category will appear here once they
                are available.
              </p>

              <Link
                href="/admin/categories"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#10291d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#193a29]"
              >
                Browse other categories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const price = getProductPrice(product);
                const comparePrice = getComparePrice(product);

                return (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="group overflow-hidden rounded-[24px] border border-[#dfe7df] bg-white shadow-[0_12px_40px_rgba(16,41,29,0.045)] transition duration-300 hover:-translate-y-1 hover:border-[#cbd8cd] hover:shadow-[0_24px_65px_rgba(16,41,29,0.10)]"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-[#edf3e9]">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#edf3e9] to-[#e3ece3]">
                          <Sprout className="h-14 w-14 text-[#91a094]" />
                        </div>
                      )}

                      {/* Image Overlay */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#10291d]/25 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#10291d]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur-md">
                          <Sparkles className="h-3 w-3 text-[#c5dda8]" />
                          Featured
                        </div>
                      )}

                      {/* Inactive Badge */}
                      {!product.isActive && (
                        <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                          Unavailable
                        </div>
                      )}
                    </div>

                    {/* Product Content */}
                    <div className="p-5">
                      <div className="min-h-[76px]">
                        <h3 className="line-clamp-1 text-[15px] font-semibold tracking-[-0.015em] text-[#17231c] transition group-hover:text-[#10291d]">
                          {product.name}
                        </h3>

                        {product.shortDescription ? (
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#718078]">
                            {product.shortDescription}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-[#a0aaa3]">
                            Seed collection product
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#edf1ed] pt-4">
                        <div>
                          <p className="text-lg font-bold tracking-[-0.02em] text-[#10291d]">
                            PKR {price.toLocaleString()}
                          </p>

                          {comparePrice &&
                            comparePrice > price && (
                              <p className="mt-0.5 text-[11px] font-medium text-[#9aa49e] line-through">
                                PKR {comparePrice.toLocaleString()}
                              </p>
                            )}
                        </div>

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#dfe7df] bg-white text-[#536158] transition duration-300 group-hover:border-[#10291d] group-hover:bg-[#10291d] group-hover:text-white">
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Collection CTA */}
            <div className="mt-8 flex flex-col gap-4 rounded-[24px] border border-[#dbe5dc] bg-[#10291d] px-5 py-5 shadow-[0_18px_55px_rgba(16,41,29,0.09)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#c5dda8]">
                  <Sprout className="h-4.5 w-4.5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Looking for something else?
                  </p>
                  <p className="mt-0.5 text-xs text-white/45">
                    Explore the rest of our seed collections.
                  </p>
                </div>
              </div>

              <Link
                href="/admin/categories"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#c5dda8] px-4 py-2.5 text-xs font-bold text-[#10291d] transition hover:bg-[#d2e5bb]"
              >
                Browse categories
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}