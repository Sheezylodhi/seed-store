"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Edit3,
  Eye,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  productType: string;
  images: string[];
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  sku?: string;
  variants: {
    price: number;
    stock: number;
    sku: string;
    isActive: boolean;
  }[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
};

const formatPrice = (value?: number) => {
  if (value === undefined || value === null) {
    return "—";
  }

  return `PKR ${value.toLocaleString("en-PK")}`;
};

export default function ProductListClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleting, setDeleting] = useState("");
  const [deleteProductId, setDeleteProductId] = useState<string | null>(
    null
  );

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      params.set("status", status);
      params.set("page", String(page));
      params.set("limit", "10");

      const response = await fetch(
        `/api/admin/products?${params.toString()}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        window.location.href = "/";
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load products."
        );
      }

      setProducts(result.data.products || []);
      setCategories(result.data.categories || []);
      setTotalPages(result.data.pagination?.pages || 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    const timer = window.setTimeout(loadProducts, 250);

    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  /* =====================================================
     DELETE PRODUCT
  ====================================================== */

  const deleteProduct = async () => {
    if (!deleteProductId || deleting) {
      return;
    }

    try {
      setDeleting(deleteProductId);
      setError("");

      const response = await fetch(
        `/api/admin/products/${deleteProductId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete product."
        );
      }

      // Close custom modal after successful delete
      setDeleteProductId(null);

      // Refresh products
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete product."
      );
    } finally {
      setDeleting("");
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-white">
      <div className="relative mx-auto max-w-[1550px] px-4 pb-12 pt-5 sm:px-6 lg:px-8 xl:px-10">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative mb-6 overflow-hidden rounded-[30px] border border-[#dbe5dc] bg-[#10291d] shadow-[0_25px_70px_rgba(16,41,29,0.12)]">
          {/* Decorative circles */}

          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/[0.055]" />

          <div className="pointer-events-none absolute -right-2 -top-12 h-44 w-44 rounded-full border border-white/[0.045]" />

          <div className="pointer-events-none absolute bottom-[-100px] left-[35%] h-60 w-60 rounded-full bg-[#315c42]/20 blur-3xl" />

          <div className="pointer-events-none absolute right-[25%] top-1/2 h-32 w-32 rounded-full bg-[#b9d39e]/[0.05] blur-2xl" />

          <div className="relative flex flex-col justify-between gap-7 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08]">
                  <Package
                    size={14}
                    className="text-[#c5dda8]"
                  />
                </div>

                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#a8b8ad]">
                  Catalog management
                </p>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.055em] text-white sm:text-[38px]">
                Products
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#a6b6ac]">
                Manage your catalog, pricing, inventory and
                product visibility from one place.
              </p>
            </div>

            <Link
              href="/admin/products/add"
              className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-[#c5dda8]/20 bg-[#c5dda8] px-5 text-xs font-bold uppercase tracking-[0.1em] text-[#173522] shadow-[0_12px_30px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d0e4b8] hover:shadow-[0_16px_35px_rgba(0,0,0,0.18)]"
            >
              <Plus
                className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
              />

              Add Product
            </Link>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#efd3cf] bg-[#fff8f6] px-4 py-3.5 text-sm text-[#a05244] shadow-[0_10px_30px_rgba(160,82,68,0.05)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fbeceb]">
              <XCircle className="h-4 w-4" />
            </div>

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-lg text-[#a05244] transition hover:bg-[#f7e6e2]"
            >
              ×
            </button>
          </div>
        )}

        {/* =====================================================
            FILTER / SEARCH COMMAND BAR
        ====================================================== */}

        <div className="relative mb-5 overflow-hidden rounded-[24px] border border-[#dfe7df] bg-white p-3 shadow-[0_16px_45px_rgba(16,41,29,0.055)]">
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#edf3e9]/70 blur-3xl" />

          <div className="relative flex flex-col gap-3 lg:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <div className="pointer-events-none absolute left-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#edf3e9]">
                <Search className="h-3.5 w-3.5 text-[#52705c]" />
              </div>

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products, SKU or slug..."
                className="h-12 w-full rounded-xl border border-[#e3e9e2] bg-[#fafcf9] pl-14 pr-4 text-sm font-medium text-[#26352c] outline-none transition-all placeholder:text-[#a1aaa4] hover:border-[#d5dfd5] focus:border-[#91a993] focus:bg-white focus:ring-4 focus:ring-[#10291d]/5"
              />
            </div>

            {/* Status */}

            <div className="relative lg:w-[230px]">
              <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef4eb] text-[#315c42]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 6h16" />
                    <path d="M7 12h10" />
                    <path d="M10 18h4" />
                  </svg>
                </div>
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="h-[54px] w-full appearance-none rounded-[17px] border border-[#dfe7de] bg-white pl-[52px] pr-12 text-[13px] font-semibold tracking-[-0.01em] text-[#26382d] outline-none shadow-[0_3px_12px_rgba(16,41,29,0.035),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 hover:border-[#cbd8ca] hover:shadow-[0_6px_20px_rgba(16,41,29,0.07)] focus:border-[#718f76] focus:bg-[#fcfdfb] focus:shadow-[0_8px_25px_rgba(16,41,29,0.08)] focus:ring-4 focus:ring-[#10291d]/[0.045]"
              >
                <option value="all">All Products</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="featured">Featured</option>
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-[#e3eae2] bg-[#f8faf7] text-[#65766a] shadow-sm">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PRODUCT TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-[0_20px_60px_rgba(16,41,29,0.065)]">
          {loading ? (
            <LoadingState />
          ) : products.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <>
              {/* DESKTOP */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[980px]">
                  <thead>
                    <tr className="border-b border-[#e8ede7] bg-[#f9fbf8] text-left">
                      <th className="px-6 py-4.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Product
                      </th>

                      <th className="px-5 py-4.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Category
                      </th>

                      <th className="px-5 py-4.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Price
                      </th>

                      <th className="px-5 py-4.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Stock
                      </th>

                      <th className="px-5 py-4.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Status
                      </th>

                      <th className="px-6 py-4.5 text-right text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <ProductRow
                        key={product._id}
                        product={product}
                        deleting={deleting}
                        onDelete={(id) =>
                          setDeleteProductId(id)
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="divide-y divide-[#edf0eb] md:hidden">
                {products.map((product) => (
                  <MobileProductCard
                    key={product._id}
                    product={product}
                    deleting={deleting}
                    onDelete={(id) =>
                      setDeleteProductId(id)
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* =====================================================
            PAGINATION
        ====================================================== */}

        {!loading &&
          products.length > 0 &&
          totalPages > 1 && (
            <div className="mt-5 flex flex-col gap-3 rounded-[22px] border border-[#dfe7df] bg-white p-3.5 shadow-[0_12px_35px_rgba(16,41,29,0.045)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf3e9]">
                  <Package
                    size={13}
                    className="text-[#52705c]"
                  />
                </div>

                <p className="text-xs font-semibold text-[#69766e]">
                  Page{" "}
                  <span className="text-[#26352c]">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="text-[#26352c]">
                    {totalPages}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((value) => value - 1)
                  }
                  className="rounded-xl border border-[#dfe7df] bg-white px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#536158] transition-all hover:border-[#bfcfc1] hover:bg-[#f7faf6] disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((value) => value + 1)
                  }
                  className="rounded-xl bg-[#10291d] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(16,41,29,0.12)] transition-all hover:-translate-y-0.5 hover:bg-[#173b29] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        {/* =====================================================
            DELETE MODAL
        ====================================================== */}

        {deleteProductId && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            {/* Backdrop */}

            <button
              type="button"
              aria-label="Close delete confirmation"
              onClick={() => {
                if (!deleting) {
                  setDeleteProductId(null);
                }
              }}
              className="absolute inset-0 cursor-default bg-[#10291d]/55 backdrop-blur-md"
            />

            {/* Modal */}

            <div className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-[0_35px_100px_rgba(16,41,29,0.28)]">
              {/* Top danger accent */}

              <div className="h-1.5 w-full bg-[#a94d40]" />

              <div className="p-6 sm:p-7">
                {/* Icon */}

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f0d8d4] bg-[#fff4f1]">
                  <Trash2 className="h-6 w-6 text-[#b14f42]" />
                </div>

                {/* Text */}

                <div className="mt-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a05244]">
                    Permanent action
                  </p>

                  <h2 className="mt-2 text-xl font-bold tracking-[-0.035em] text-[#26352c]">
                    Delete this product?
                  </h2>

                  <p className="mt-2.5 text-sm leading-6 text-[#7b8780]">
                    This product will be permanently removed
                    from your catalog. This action cannot be
                    undone.
                  </p>
                </div>

                {/* Warning */}

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#f0e1dd] bg-[#fff9f7] p-3.5">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#b14f42]" />

                  <p className="text-[11px] leading-5 text-[#8d625b]">
                    Product information, variants and
                    associated catalog data may no longer be
                    available after deletion.
                  </p>
                </div>

                {/* Buttons */}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    disabled={Boolean(deleting)}
                    onClick={() =>
                      setDeleteProductId(null)
                    }
                    className="h-11 flex-1 rounded-xl border border-[#dfe7df] bg-white px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#536158] transition-all hover:border-[#cbd7cc] hover:bg-[#f7faf6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={Boolean(deleting)}
                    onClick={deleteProduct}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#a94d40] px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_10px_25px_rgba(169,77,64,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#963f34] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {deleting ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   DESKTOP ROW
========================================================= */

function ProductRow({
  product,
  deleting,
  onDelete,
}: {
  product: Product;
  deleting: string;
  onDelete: (id: string) => void;
}) {
  const price = product.variants.length
    ? Math.min(
        ...product.variants.map(
          (variant) => variant.price
        )
      )
    : product.price;

  const stock = product.variants.length
    ? product.variants.reduce(
        (total, variant) =>
          total + variant.stock,
        0
      )
    : product.stock ?? 0;

  return (
    <tr className="group border-b border-[#edf1ed] last:border-0 transition-all duration-200 hover:bg-[#fafcf9]">
      {/* Product */}

      <td className="px-6 py-5">
        <div className="flex items-center gap-3.5">
          <ProductImage product={product} />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="max-w-[290px] truncate text-sm font-bold tracking-[-0.015em] text-[#26352c]">
                {product.name}
              </p>

              {product.isFeatured && (
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#f7f0dc]">
                  <Star className="h-3 w-3 fill-[#9a782e] text-[#9a782e]" />
                </span>
              )}
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9aa49e]">
                {product.sku ||
                  `${product.variants.length} variant(s)`}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Category */}

      <td className="px-5 py-5">
        <div>
          <p className="text-xs font-semibold text-[#536158]">
            {product.category?.name ||
              "Uncategorized"}
          </p>

          <p className="mt-1.5 inline-flex rounded-md bg-[#f3f6f2] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c8980]">
            {product.productType}
          </p>
        </div>
      </td>

      {/* Price */}

      <td className="px-5 py-5">
        <p className="text-sm font-bold tracking-[-0.015em] text-[#26352c]">
          {formatPrice(price)}
        </p>

        {product.compareAtPrice &&
          product.compareAtPrice > price! && (
            <p className="mt-1 text-[10px] text-[#9ca59f] line-through">
              {formatPrice(
                product.compareAtPrice
              )}
            </p>
          )}
      </td>

      {/* Stock */}

      <td className="px-5 py-5">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[11px] font-bold ${
              stock > 0
                ? "bg-[#edf5ec] text-[#45634f]"
                : "bg-[#fbeceb] text-[#a05244]"
            }`}
          >
            {stock}
          </span>

          <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#a0aaa4]">
            units
          </span>
        </div>
      </td>

      {/* Status */}

      <td className="px-5 py-5">
        <StatusBadge active={product.isActive} />
      </td>

      {/* Actions */}

      <td className="px-6 py-5">
        <div className="flex justify-end gap-1.5">
          <Link
            href={`/admin/products/${product._id}/edit`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-[#7a877f] transition-all duration-200 hover:border-[#dce5dc] hover:bg-[#f3f7f2] hover:text-[#10291d]"
            title="Edit"
          >
            <Edit3 className="h-4 w-4" />
          </Link>

          <Link
            href={`/admin/products/${product._id}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0e7df] bg-white text-[#536158] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#aebfaf] hover:bg-[#f5f8f4] hover:text-[#10291d]"
            title="View product"
          >
            <Eye size={16} />
          </Link>

          <button
            type="button"
            onClick={() =>
              onDelete(product._id)
            }
            disabled={
              deleting === product._id
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-[#a58b87] transition-all duration-200 hover:border-[#f0d8d4] hover:bg-[#fff5f3] hover:text-[#b14f42] disabled:cursor-not-allowed disabled:opacity-35"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function MobileProductCard({
  product,
  deleting,
  onDelete,
}: {
  product: Product;
  deleting: string;
  onDelete: (id: string) => void;
}) {
  const price = product.variants.length
    ? Math.min(
        ...product.variants.map(
          (variant) => variant.price
        )
      )
    : product.price;

  const stock = product.variants.length
    ? product.variants.reduce(
        (total, variant) =>
          total + variant.stock,
        0
      )
    : product.stock ?? 0;

  return (
    <div className="bg-white p-4.5 transition-colors hover:bg-[#fcfdfb]">
      <div className="flex gap-3.5">
        <ProductImage product={product} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-bold text-[#26352c]">
                  {product.name}
                </p>

                {product.isFeatured && (
                  <Star className="h-3.5 w-3.5 shrink-0 fill-[#9a782e] text-[#9a782e]" />
                )}
              </div>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.06em] text-[#919b95]">
                {product.category?.name ||
                  "Uncategorized"}
              </p>
            </div>

            <StatusBadge
              active={product.isActive}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-[#f2f5f1] px-2.5 py-1.5 text-[11px] font-bold text-[#35463b]">
              {formatPrice(price)}
            </span>

            <span
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${
                stock > 0
                  ? "bg-[#edf5ec] text-[#45634f]"
                  : "bg-[#fbeceb] text-[#a05244]"
              }`}
            >
              Stock: {stock}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2 border-t border-[#edf1ed] pt-4">
        <Link
          href={`/admin/products/${product._id}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#e0e7df] bg-white px-3 text-[10px] font-bold uppercase tracking-[0.07em] text-[#536158] shadow-sm transition hover:border-[#aebfaf] hover:text-[#10291d]"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Link>

        <Link
          href={`/admin/products/${product._id}/edit`}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#dce5dc] bg-[#f5f8f4] px-3 text-[10px] font-bold uppercase tracking-[0.07em] text-[#536158] transition hover:bg-[#edf3e9] hover:text-[#10291d]"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </Link>

        <button
          type="button"
          onClick={() =>
            onDelete(product._id)
          }
          disabled={
            deleting === product._id
          }
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#f0d8d4] bg-[#fff8f6] px-3 text-[10px] font-bold uppercase tracking-[0.07em] text-[#a05244] transition hover:bg-[#fff0ed] disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   IMAGE
========================================================= */

function ProductImage({
  product,
}: {
  product: Product;
}) {
  const image = product.images?.[0];

  if (!image) {
    return (
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#dfe8df] bg-[#edf3e9] text-[#5e7565] shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />

        <Package className="relative h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#e3e9e2] bg-[#f3f5f2] shadow-sm">
      <img
        src={image}
        alt={product.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dbe8da] bg-[#edf6ed] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#45634f]">
      <span className="relative flex h-3 w-3 items-center justify-center">
        <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#71917a]/25" />

        <CheckCircle2 className="relative h-3 w-3" />
      </span>

      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e6e4] bg-[#f4f5f3] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.06em] text-[#7d8580]">
      <XCircle className="h-3 w-3" />
      Inactive
    </span>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="divide-y divide-[#edf0eb]">
      <div className="flex items-center justify-between border-b border-[#edf0eb] bg-[#f9fbf8] px-6 py-4">
        <div className="h-2.5 w-24 animate-pulse rounded bg-[#e3e9e2]" />

        <div className="h-2.5 w-20 animate-pulse rounded bg-[#e8ede7]" />
      </div>

      {Array.from({ length: 7 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-6 py-5"
          >
            <div className="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-[#edf1ec]" />

            <div className="flex flex-1 items-center justify-between gap-8">
              <div className="space-y-2">
                <div className="h-3 w-48 animate-pulse rounded bg-[#e9eee8]" />

                <div className="h-2.5 w-28 animate-pulse rounded bg-[#f0f3ef]" />
              </div>

              <div className="hidden h-3 w-24 animate-pulse rounded bg-[#f0f3ef] lg:block" />

              <div className="hidden h-3 w-20 animate-pulse rounded bg-[#f0f3ef] lg:block" />

              <div className="hidden h-8 w-20 animate-pulse rounded-xl bg-[#edf1ec] md:block" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({
  search,
}: {
  search: string;
}) {
  return (
    <div className="relative overflow-hidden px-6 py-20 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#edf3e9] blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#dfe8df] bg-[#f0f5ed] shadow-[0_12px_30px_rgba(16,41,29,0.06)]">
          <Package className="h-6 w-6 text-[#52705c]" />
        </div>

        <div className="mx-auto mt-5 max-w-md">
          <h3 className="text-base font-bold tracking-[-0.02em] text-[#33443a]">
            {search
              ? "No products found"
              : "Your catalog is empty"}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#89948d]">
            {search
              ? "Try a different product name, SKU or slug."
              : "Create your first product to start building your catalog."}
          </p>

          {!search && (
            <Link
              href="/admin/products/add"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#10291d] px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_10px_25px_rgba(16,41,29,0.14)] transition-all hover:-translate-y-0.5 hover:bg-[#173b29]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Product
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}