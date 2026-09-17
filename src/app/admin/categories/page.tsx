"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  FolderTree,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

type FilterType = "all" | "active" | "inactive";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     LOAD CATEGORIES
  ====================================================== */

  const loadCategories = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load categories."
        );
      }

      setCategories(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load categories."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* =====================================================
     FILTER
  ====================================================== */

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query) ||
        category.description
          ?.toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && category.isActive) ||
        (filter === "inactive" && !category.isActive);

      return matchesSearch && matchesFilter;
    });
  }, [categories, search, filter]);

  /* =====================================================
     STATS
  ====================================================== */

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCategories = categories.filter(
    (category) => !category.isActive
  ).length;

  /* =====================================================
     TOGGLE STATUS
  ====================================================== */

  const handleToggleStatus = async (
    category: Category
  ) => {
    try {
      setUpdatingId(category._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/categories/${category._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !category.isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update category status."
        );
      }

      setCategories((current) =>
        current.map((item) =>
          item._id === category._id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item
        )
      );

      setSuccess(
        `${category.name} is now ${
          !category.isActive ? "active" : "inactive"
        }.`
      );

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update category status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* =====================================================
     DELETE
  ====================================================== */

  const handleDelete = async () => {
    if (!deleteId || deleting) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/admin/categories/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete category."
        );
      }

      setCategories((current) =>
        current.filter(
          (category) => category._id !== deleteId
        )
      );

      setDeleteId(null);

      setSuccess("Category deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete category."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =====================================================
     DATE
  ====================================================== */

  const formatDate = (date: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
                  <FolderTree
                    size={14}
                    className="text-[#c5dda8]"
                  />
                </div>

                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#a8b8ad]">
                  Catalog management
                </p>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.055em] text-white sm:text-[38px]">
                Categories
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#a6b6ac]">
                Manage your product categories, visibility and
                catalog organization from one place.
              </p>
            </div>

            <Link
              href="/admin/categories/new"
              className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-[#c5dda8]/20 bg-[#c5dda8] px-5 text-xs font-bold uppercase tracking-[0.1em] text-[#173522] shadow-[0_12px_30px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d0e4b8] hover:shadow-[0_16px_35px_rgba(0,0,0,0.18)]"
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              Add Category
            </Link>
          </div>
        </div>

        {/* =====================================================
            STATS
        ====================================================== */}

        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          {/* Total */}

          <div className="rounded-[22px] border border-[#dfe7df] bg-white p-5 shadow-[0_12px_35px_rgba(16,41,29,0.045)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                  Total categories
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#26352c]">
                  {totalCategories}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf3e9]">
                <FolderTree className="h-5 w-5 text-[#315c42]" />
              </div>
            </div>
          </div>

          {/* Active */}

          <div className="rounded-[22px] border border-[#dfe7df] bg-white p-5 shadow-[0_12px_35px_rgba(16,41,29,0.045)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                  Active
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#26352c]">
                  {activeCategories}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf5ec]">
                <CheckCircle2 className="h-5 w-5 text-[#45634f]" />
              </div>
            </div>
          </div>

          {/* Inactive */}

          <div className="rounded-[22px] border border-[#dfe7df] bg-white p-5 shadow-[0_12px_35px_rgba(16,41,29,0.045)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                  Inactive
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#26352c]">
                  {inactiveCategories}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4f1ef]">
                <XCircle className="h-5 w-5 text-[#7a655b]" />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            ALERTS
        ====================================================== */}

        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#efd3cf] bg-[#fff8f6] px-4 py-3.5 text-sm text-[#a05244] shadow-[0_10px_30px_rgba(160,82,68,0.05)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fbeceb]">
              <AlertTriangle className="h-4 w-4" />
            </div>

            <span className="flex-1">{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#a05244] transition hover:bg-[#f7e6e2]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#dbe8da] bg-[#f4faf3] px-4 py-3.5 text-sm text-[#45634f] shadow-[0_10px_30px_rgba(16,41,29,0.04)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f2e6]">
              <CheckCircle2 className="h-4 w-4" />
            </div>

            <span>{success}</span>
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
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search categories, slug or description..."
                className="h-12 w-full rounded-xl border border-[#e3e9e2] bg-[#fafcf9] pl-14 pr-4 text-sm font-medium text-[#26352c] outline-none transition-all placeholder:text-[#a1aaa4] hover:border-[#d5dfd5] focus:border-[#91a993] focus:bg-white focus:ring-4 focus:ring-[#10291d]/5"
              />
            </div>

            {/* Filter */}

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
                value={filter}
                onChange={(e) =>
                  setFilter(
                    e.target.value as FilterType
                  )
                }
                className="h-[54px] w-full appearance-none rounded-[17px] border border-[#dfe7de] bg-white pl-[52px] pr-12 text-[13px] font-semibold tracking-[-0.01em] text-[#26382d] outline-none shadow-[0_3px_12px_rgba(16,41,29,0.035),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 hover:border-[#cbd8ca] hover:shadow-[0_6px_20px_rgba(16,41,29,0.07)] focus:border-[#718f76] focus:bg-[#fcfdfb] focus:shadow-[0_8px_25px_rgba(16,41,29,0.08)] focus:ring-4 focus:ring-[#10291d]/[0.045]"
              >
                <option value="all">
                  All Categories
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-[#e3eae2] bg-[#f8faf7] text-[#65766a] shadow-sm">
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Refresh */}

            <button
              type="button"
              onClick={() => loadCategories(true)}
              disabled={refreshing}
              className="inline-flex h-[54px] items-center justify-center gap-2 rounded-[17px] border border-[#dfe7df] bg-white px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#536158] shadow-[0_3px_12px_rgba(16,41,29,0.035)] transition-all duration-300 hover:border-[#cbd8ca] hover:bg-[#f7faf6] hover:text-[#10291d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>
          </div>
        </div>

        {/* =====================================================
            CATEGORY TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-[0_20px_60px_rgba(16,41,29,0.065)]">
          {loading ? (
            <LoadingState />
          ) : filteredCategories.length === 0 ? (
            <EmptyState
              search={search}
              filter={filter}
            />
          ) : (
            <>
              {/* =================================================
                  DESKTOP
              ================================================== */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[#e8ede7] bg-[#f9fbf8] text-left">
                      <th className="px-6 py-4.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Category
                      </th>

                      <th className="px-5 py-4.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Slug
                      </th>

                      <th className="px-5 py-4.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Status
                      </th>

                      <th className="px-5 py-4.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Created
                      </th>

                      <th className="px-6 py-4.5 text-right text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a958e]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCategories.map(
                      (category) => (
                        <tr
                          key={category._id}
                          className="group border-b border-[#edf1ed] last:border-0 transition-all duration-200 hover:bg-[#fafcf9]"
                        >
                          {/* Category */}

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3.5">
                              <CategoryImage
                                category={category}
                              />

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="max-w-[300px] truncate text-sm font-bold tracking-[-0.015em] text-[#26352c]">
                                    {category.name}
                                  </p>
                                </div>

                                {category.description && (
                                  <p className="mt-1.5 max-w-[320px] truncate text-[10px] font-medium text-[#9aa49e]">
                                    {category.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Slug */}

                          <td className="px-5 py-5">
                            <span className="inline-flex rounded-lg bg-[#f3f6f2] px-2.5 py-1.5 text-[10px] font-bold text-[#69776e]">
                              /{category.slug}
                            </span>
                          </td>

                          {/* Status */}

                          <td className="px-5 py-5">
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleStatus(
                                  category
                                )
                              }
                              disabled={
                                updatingId ===
                                category._id
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.06em] transition ${
                                category.isActive
                                  ? "border-[#dbe8da] bg-[#edf6ed] text-[#45634f] hover:bg-[#e5f1e4]"
                                  : "border-[#e5e6e4] bg-[#f4f5f3] text-[#7d8580] hover:bg-[#eceeec]"
                              }`}
                            >
                              {updatingId ===
                              category._id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : category.isActive ? (
                                <span className="relative flex h-3 w-3 items-center justify-center">
                                  <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#71917a]/25" />

                                  <CheckCircle2 className="relative h-3 w-3" />
                                </span>
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}

                              {category.isActive
                                ? "Active"
                                : "Inactive"}
                            </button>
                          </td>

                          {/* Date */}

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2 text-xs font-medium text-[#718078]">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f3f6f2]">
                                <CalendarDays className="h-3.5 w-3.5 text-[#7c8b80]" />
                              </div>

                              {formatDate(
                                category.createdAt
                              )}
                            </div>
                          </td>

                          {/* Actions */}

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-1.5">
                              <Link
                                href={`/admin/categories/${category._id}`}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e0e7df] bg-white text-[#536158] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#aebfaf] hover:bg-[#f5f8f4] hover:text-[#10291d]"
                                title="View category"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>

                              <Link
                                href={`/admin/categories/${category._id}/edit`}
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-[#7a877f] transition-all duration-200 hover:border-[#dce5dc] hover:bg-[#f3f7f2] hover:text-[#10291d]"
                                title="Edit category"
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteId(
                                    category._id
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-[#a58b87] transition-all duration-200 hover:border-[#f0d8d4] hover:bg-[#fff5f3] hover:text-[#b14f42]"
                                title="Delete category"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE
              ================================================== */}

              <div className="divide-y divide-[#edf0eb] md:hidden">
                {filteredCategories.map(
                  (category) => (
                    <div
                      key={category._id}
                      className="bg-white p-4.5 transition-colors hover:bg-[#fcfdfb]"
                    >
                      <div className="flex gap-3.5">
                        <CategoryImage
                          category={category}
                          mobile
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#26352c]">
                                {category.name}
                              </p>

                              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.06em] text-[#919b95]">
                                /{category.slug}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleStatus(
                                  category
                                )
                              }
                              disabled={
                                updatingId ===
                                category._id
                              }
                              className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.05em] ${
                                category.isActive
                                  ? "border-[#dbe8da] bg-[#edf6ed] text-[#45634f]"
                                  : "border-[#e5e6e4] bg-[#f4f5f3] text-[#7d8580]"
                              }`}
                            >
                              {updatingId ===
                              category._id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : category.isActive ? (
                                "Active"
                              ) : (
                                "Inactive"
                              )}
                            </button>
                          </div>

                          {category.description && (
                            <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#7c8880]">
                              {category.description}
                            </p>
                          )}

                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f3f6f2]">
                              <CalendarDays className="h-3.5 w-3.5 text-[#7c8b80]" />
                            </div>

                            <span className="text-[10px] font-medium text-[#8c9790]">
                              {formatDate(
                                category.createdAt
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile actions */}

                      <div className="mt-4 flex justify-end gap-2 border-t border-[#edf1ed] pt-4">
                        <Link
                          href={`/admin/categories/${category._id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#e0e7df] bg-white px-3 text-[10px] font-bold uppercase tracking-[0.07em] text-[#536158] shadow-sm transition hover:border-[#aebfaf] hover:text-[#10291d]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>

                        <Link
                          href={`/admin/categories/${category._id}/edit`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#dce5dc] bg-[#f5f8f4] px-3 text-[10px] font-bold uppercase tracking-[0.07em] text-[#536158] transition hover:bg-[#edf3e9] hover:text-[#10291d]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteId(
                              category._id
                            )
                          }
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#f0d8d4] bg-[#fff8f6] px-3 text-[10px] font-bold uppercase tracking-[0.07em] text-[#a05244] transition hover:bg-[#fff0ed]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>

        {/* =====================================================
            RESULT COUNT
        ====================================================== */}

        {!loading &&
          filteredCategories.length > 0 && (
            <div className="mt-4 flex items-center justify-between px-1 text-xs text-[#89948d]">
              <span>
                Showing{" "}
                <span className="font-semibold text-[#536158]">
                  {filteredCategories.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#536158]">
                  {categories.length}
                </span>{" "}
                categories
              </span>
            </div>
          )}
      </div>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {deleteId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          {/* Backdrop */}

          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={() => {
              if (!deleting) {
                setDeleteId(null);
              }
            }}
            className="absolute inset-0 cursor-default bg-[#10291d]/55 backdrop-blur-md"
          />

          {/* Modal */}

          <div className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-[0_35px_100px_rgba(16,41,29,0.28)]">
            {/* Danger accent */}

            <div className="h-1.5 w-full bg-[#a94d40]" />

            <div className="p-6 sm:p-7">
              {/* Icon */}

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f0d8d4] bg-[#fff4f1]">
                <Trash2 className="h-6 w-6 text-[#b14f42]" />
              </div>

              {/* Content */}

              <div className="mt-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#a05244]">
                  Permanent action
                </p>

                <h2 className="mt-2 text-xl font-bold tracking-[-0.035em] text-[#26352c]">
                  Delete this category?
                </h2>

                <p className="mt-2.5 text-sm leading-6 text-[#7b8780]">
                  This category will be permanently removed
                  from your catalog. This action cannot be
                  undone.
                </p>
              </div>

              {/* Warning */}

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#f0e1dd] bg-[#fff9f7] p-3.5">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#b14f42]" />

                <p className="text-[11px] leading-5 text-[#8d625b]">
                  If products are currently assigned to this
                  category, the system may prevent deletion to
                  protect your catalog data.
                </p>
              </div>

              {/* Actions */}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setDeleteId(null)}
                  className="h-11 flex-1 rounded-xl border border-[#dfe7df] bg-white px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#536158] transition-all hover:border-[#cbd7cc] hover:bg-[#f7faf6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#a94d40] px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_10px_25px_rgba(169,77,64,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#963f34] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   CATEGORY IMAGE
========================================================= */

function CategoryImage({
  category,
  mobile = false,
}: {
  category: Category;
  mobile?: boolean;
}) {
  const size = mobile
    ? "h-14 w-14"
    : "h-14 w-14";

  if (!category.image) {
    return (
      <div
        className={`relative flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#dfe8df] bg-[#edf3e9] text-[#5e7565] shadow-sm`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />

        <FolderTree className="relative h-5 w-5" />
      </div>
    );
  }

  return (
    <div
      className={`relative ${size} shrink-0 overflow-hidden rounded-2xl border border-[#e3e9e2] bg-[#f3f5f2] shadow-sm`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="divide-y divide-[#edf0eb]">
      {/* Header skeleton */}

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

              <div className="hidden h-8 w-20 animate-pulse rounded-xl bg-[#edf1ec] md:block" />

              <div className="hidden h-3 w-20 animate-pulse rounded bg-[#f0f3ef] lg:block" />
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
  filter,
}: {
  search: string;
  filter: FilterType;
}) {
  const hasFilters =
    search.trim() || filter !== "all";

  return (
    <div className="relative overflow-hidden px-6 py-20 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#edf3e9] blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#dfe8df] bg-[#f0f5ed] shadow-[0_12px_30px_rgba(16,41,29,0.06)]">
          <FolderTree className="h-6 w-6 text-[#52705c]" />
        </div>

        <div className="mx-auto mt-5 max-w-md">
          <h3 className="text-base font-bold tracking-[-0.02em] text-[#33443a]">
            {hasFilters
              ? "No categories found"
              : "Your categories are empty"}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#89948d]">
            {hasFilters
              ? "Try a different search term or change the category filter."
              : "Create your first category to start organizing your products."}
          </p>

          {!hasFilters && (
            <Link
              href="/admin/categories/new"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#10291d] px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_10px_25px_rgba(16,41,29,0.14)] transition-all hover:-translate-y-0.5 hover:bg-[#173b29]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Category
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}