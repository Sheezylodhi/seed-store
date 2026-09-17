"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  FolderPlus,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

import CategoryImageUploader from "@/components/admin/CategoryImageUploader";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AddCategoryClient() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter a category name.");
      return;
    }

    if (name.trim().length < 2) {
      setError(
        "Category name must be at least 2 characters."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/admin/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            slug,
            description: description.trim(),
            image,
            isActive,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create category."
        );
      }

      setSuccess("Category created successfully.");

      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create category."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-[#f7f9f6]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/admin/categories"
            className="font-medium text-[#718078] transition hover:text-[#10291d]"
          >
            Categories
          </Link>

          <ChevronRight className="h-4 w-4 text-[#aeb7b0]" />

          <span className="font-semibold text-[#17231c]">
            Add Category
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#dfe8dc] bg-[#edf3e9] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#10291d]">
              <Sparkles className="h-3.5 w-3.5" />
              Catalog Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#17231c] sm:text-4xl">
              Create Category
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718078]">
              Create a clean, SEO-friendly product category
              for your seed store.
            </p>
          </div>

          <Link
            href="/admin/categories"
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#dfe5df] bg-white px-4 py-3 text-sm font-semibold text-[#26352c] shadow-sm transition hover:border-[#10291d] hover:text-[#10291d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Check className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Main */}
            <div className="space-y-6">
              {/* Basic Information */}
              <section className="rounded-[28px] border border-[#e4e9e3] bg-white p-6 shadow-[0_10px_40px_rgba(16,41,29,0.04)] sm:p-7">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#10291d]">
                    <FolderPlus className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#17231c]">
                      Basic Information
                    </h2>

                    <p className="text-sm text-[#89948d]">
                      Define the category details.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#26352c]">
                      Category Name
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="e.g. Vegetable Seeds"
                      maxLength={100}
                      className="h-12 w-full rounded-2xl border border-[#dfe5df] bg-[#fbfcfa] px-4 text-sm text-[#17231c] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#10291d] focus:bg-white focus:ring-4 focus:ring-[#edf3e9]"
                    />

                    <div className="mt-2 flex justify-between text-xs text-[#9aa49e]">
                      <span>
                        Choose a clear customer-friendly name.
                      </span>

                      <span>{name.length}/100</span>
                    </div>
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#26352c]">
                      URL Slug
                    </label>

                    <div className="flex overflow-hidden rounded-2xl border border-[#dfe5df] bg-[#fbfcfa] focus-within:border-[#10291d] focus-within:ring-4 focus-within:ring-[#edf3e9]">
                      <div className="flex items-center border-r border-[#e4e9e3] px-4 text-xs font-medium text-[#89948d]">
                        /category/
                      </div>

                      <input
                        value={slug}
                        readOnly
                        className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm font-medium text-[#17231c] outline-none"
                      />
                    </div>

                    <p className="mt-2 text-xs text-[#89948d]">
                      Automatically generated from the category
                      name.
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#26352c]">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      rows={5}
                      maxLength={500}
                      placeholder="Describe what customers can find in this category..."
                      className="w-full resize-none rounded-2xl border border-[#dfe5df] bg-[#fbfcfa] px-4 py-3 text-sm leading-6 text-[#17231c] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#10291d] focus:bg-white focus:ring-4 focus:ring-[#edf3e9]"
                    />

                    <div className="mt-2 flex justify-end text-xs text-[#9aa49e]">
                      {description.length}/500
                    </div>
                  </div>
                </div>
              </section>

              {/* Image */}
              <section className="rounded-[28px] border border-[#e4e9e3] bg-white p-6 shadow-[0_10px_40px_rgba(16,41,29,0.04)] sm:p-7">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#17231c]">
                    Category Image
                  </h2>

                  <p className="mt-1 text-sm text-[#89948d]">
                    Add a strong visual for category cards and
                    category pages.
                  </p>
                </div>

                <CategoryImageUploader
                  value={image}
                  onChange={setImage}
                />
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Visibility */}
              <section className="rounded-[28px] border border-[#e4e9e3] bg-white p-6 shadow-[0_10px_40px_rgba(16,41,29,0.04)]">
                <h2 className="text-lg font-bold text-[#17231c]">
                  Visibility
                </h2>

                <p className="mt-1 text-sm text-[#89948d]">
                  Control whether customers can see this
                  category.
                </p>

                <div className="mt-6 rounded-2xl border border-[#e4e9e3] bg-[#fafcf9] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#26352c]">
                        Active Category
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#89948d]">
                        Active categories can be displayed on
                        the storefront.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setIsActive((current) => !current)
                      }
                      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                        isActive
                          ? "bg-[#10291d]"
                          : "bg-[#cbd3cd]"
                      }`}
                      aria-label="Toggle category status"
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                          isActive
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isActive
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />

                    {isActive ? (
                      <span className="text-emerald-700">
                        Visible / Active
                      </span>
                    ) : (
                      <span className="text-[#718078]">
                        Hidden / Inactive
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* SEO */}
              <section className="rounded-[28px] border border-[#e4e9e3] bg-white p-6 shadow-[0_10px_40px_rgba(16,41,29,0.04)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#10291d]">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#17231c]">
                      SEO Ready
                    </h2>

                    <p className="text-xs text-[#89948d]">
                      Clean category URLs
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-[#f6f9f5] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#89948d]">
                    Preview
                  </p>

                  <p className="mt-2 break-all text-sm font-medium text-[#10291d]">
                    /category/
                    {slug || "your-category"}
                  </p>
                </div>
              </section>

              {/* Actions */}
              <section className="rounded-[28px] border border-[#10291d] bg-[#10291d] p-5 shadow-[0_15px_45px_rgba(16,41,29,0.15)]">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-white">
                    Ready to publish?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/60">
                    Your category will be available in the
                    admin catalog immediately.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-[#10291d] transition hover:bg-[#f1f5ef] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Category
                    </>
                  )}
                </button>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}