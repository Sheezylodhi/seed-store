"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  FolderTree,
  Loader2,
  Save,
  Sparkles,
  ImageIcon,
  Link2,
  FileText,
  Eye,
  CircleCheck,
} from "lucide-react";

import CategoryImageUploader from "@/components/admin/CategoryImageUploader";

interface CategoryFormProps {
  mode: "create" | "edit";
  categoryId?: string;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

const initialForm: FormData = {
  name: "",
  slug: "",
  description: "",
  image: "",
  isActive: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export default function CategoryForm({
  mode,
  categoryId,
}: CategoryFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<FormData>(initialForm);
  const [slugTouched, setSlugTouched] = useState(false);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !categoryId) return;

    const loadCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/categories/${categoryId}`,
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

        const category = result.data;

        setForm({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          image: category.image || "",
          isActive: category.isActive ?? true,
        });

        setSlugTouched(true);
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
  }, [mode, categoryId]);

  const updateName = (value: string) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
  };

  const updateSlug = (value: string) => {
    setSlugTouched(true);

    setForm((current) => ({
      ...current,
      slug: slugify(value),
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    const finalSlug = slugify(form.slug || form.name);

    if (!finalSlug) {
      setError("Please enter a valid category name or slug.");
      return;
    }

    if (form.description.length > 500) {
      setError("Description cannot exceed 500 characters.");
      return;
    }

    if (imageUploading) {
      setError("Please wait for the image upload to finish.");
      return;
    }

    setSaving(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/categories"
          : `/api/admin/categories/${categoryId}`;

      const response = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: finalSlug,
          description: form.description.trim(),
          image: form.image,
          isActive: form.isActive,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Failed to ${
              mode === "create" ? "create" : "update"
            } category.`
        );
      }

      setSuccess(
        mode === "create"
          ? "Category created successfully."
          : "Category updated successfully."
      );

      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f9f6] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-[1550px] items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#10291d] text-white shadow-[0_20px_55px_rgba(16,41,29,0.18)]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>

            <p className="mt-5 text-sm font-semibold text-[#536158]">
              Loading category
            </p>

            <p className="mt-1 text-xs text-[#89948d]">
              Preparing your category workspace...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9f6] text-[#17231c]">
      {/* Top breadcrumb */}
      <div className="border-b border-[#dfe7df] bg-white">
        <div className="mx-auto flex max-w-[1550px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-[#89948d] sm:text-sm">
            <Link
              href="/admin"
              className="shrink-0 transition hover:text-[#10291d]"
            >
              Dashboard
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
              {mode === "create" ? "New Category" : "Edit Category"}
            </span>
          </div>

          <Link
            href="/admin/categories"
            className="hidden shrink-0 items-center gap-2 rounded-xl border border-[#dfe7df] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#536158] transition hover:border-[#10291d] hover:text-[#10291d] sm:inline-flex"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to categories
          </Link>
        </div>
      </div>

      {/* Premium Header */}
      <section className="px-4 pb-5 pt-5 sm:px-6 lg:px-8 xl:px-10">
        <div className="relative mx-auto max-w-[1550px] overflow-hidden rounded-[30px] border border-[#dbe5dc] bg-[#10291d] shadow-[0_28px_85px_rgba(16,41,29,0.15)]">
          {/* Decorative lights */}
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#c5dda8]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-[35%] h-96 w-96 rounded-full bg-[#315c45]/35 blur-3xl" />
          <div className="pointer-events-none absolute right-[30%] top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:px-12 lg:py-10 xl:px-14">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-[#c5dda8] shadow-inner">
                  <FolderTree className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5dda8]">
                    Catalog management
                  </p>

                  <h1 className="mt-1 text-2xl font-semibold tracking-[-0.045em] text-white sm:text-3xl lg:text-[34px]">
                    {mode === "create"
                      ? "Create category"
                      : "Edit category"}
                  </h1>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/55 sm:text-[15px]">
                {mode === "create"
                  ? "Create a polished, discoverable category for your seed collection."
                  : "Refine the category details, visibility and presentation of your seed collection."}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-semibold text-white/65">
                <Sparkles className="h-4 w-4 text-[#c5dda8]" />
                Premium catalog
              </div>

              <div
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold ${
                  form.isActive
                    ? "border-[#c5dda8]/20 bg-[#c5dda8]/10 text-[#c5dda8]"
                    : "border-white/10 bg-white/[0.05] text-white/45"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    form.isActive
                      ? "bg-[#c5dda8]"
                      : "bg-white/30"
                  }`}
                />
                {form.isActive ? "Published" : "Draft"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="mx-auto max-w-[1550px] px-4 pb-14 pt-1 sm:px-6 lg:px-8 lg:pb-20 xl:px-10">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
            {/* LEFT */}
            <div className="space-y-5">
              {/* Basic Information */}
              <section className="overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-[0_16px_55px_rgba(16,41,29,0.045)]">
                <div className="border-b border-[#edf1ed] px-6 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#10291d]">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#89948d]">
                        Category information
                      </p>

                      <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-[#17231c]">
                        Basic details
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6 sm:p-7">
                  {/* Name */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between gap-3">
                      <label className="text-sm font-semibold text-[#26352c]">
                        Category name
                      </label>

                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#a0aaa3]">
                        Required
                      </span>
                    </div>

                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        updateName(e.target.value)
                      }
                      placeholder="e.g. Vegetable Seeds"
                      maxLength={100}
                      className="h-14 w-full rounded-2xl border border-[#dfe6df] bg-[#f8faf7] px-4 text-sm font-medium text-[#17231c] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#10291d] focus:bg-white focus:ring-4 focus:ring-[#10291d]/5"
                    />

                    <p className="mt-2 text-xs text-[#89948d]">
                      Use a clear name customers can instantly understand.
                    </p>
                  </div>

                  {/* Slug */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between gap-3">
                      <label className="text-sm font-semibold text-[#26352c]">
                        URL slug
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setSlugTouched(false);

                          setForm((current) => ({
                            ...current,
                            slug: slugify(current.name),
                          }));
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#536158] transition hover:text-[#10291d]"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Generate from name
                      </button>
                    </div>

                    <div className="flex h-14 items-center overflow-hidden rounded-2xl border border-[#dfe6df] bg-[#f8faf7] transition focus-within:border-[#10291d] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#10291d]/5">
                      <div className="flex h-full items-center border-r border-[#e7ece7] px-4 text-sm text-[#89948d]">
                        <Link2 className="mr-2 h-4 w-4" />
                        /
                      </div>

                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) =>
                          updateSlug(e.target.value)
                        }
                        placeholder="vegetable-seeds"
                        maxLength={120}
                        className="h-full min-w-0 flex-1 bg-transparent px-3 pr-4 text-sm font-medium text-[#17231c] outline-none placeholder:text-[#a0aaa3]"
                      />
                    </div>

                    <p className="mt-2 text-xs text-[#89948d]">
                      This becomes the public URL for this category.
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between gap-3">
                      <label className="text-sm font-semibold text-[#26352c]">
                        Description
                      </label>

                      <span
                        className={`text-[11px] font-semibold ${
                          form.description.length > 450
                            ? "text-amber-600"
                            : "text-[#9aa49e]"
                        }`}
                      >
                        {form.description.length}/500
                      </span>
                    </div>

                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          description: e.target.value,
                        }))
                      }
                      rows={6}
                      maxLength={500}
                      placeholder="Write a short, useful description about this seed category..."
                      className="w-full resize-none rounded-2xl border border-[#dfe6df] bg-[#f8faf7] px-4 py-3.5 text-sm leading-6 text-[#17231c] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#10291d] focus:bg-white focus:ring-4 focus:ring-[#10291d]/5"
                    />

                    <div className="mt-2 flex items-center gap-2 text-xs text-[#89948d]">
                      <CircleCheck className="h-3.5 w-3.5 text-[#315c45]" />
                      Keep it concise and relevant to the category.
                    </div>
                  </div>
                </div>
              </section>

              {/* Image */}
              <section className="overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-[0_16px_55px_rgba(16,41,29,0.045)]">
                <div className="border-b border-[#edf1ed] px-6 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#10291d]">
                      <ImageIcon className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#89948d]">
                        Visual identity
                      </p>

                      <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-[#17231c]">
                        Category image
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="mb-6">
                    <p className="text-sm leading-6 text-[#718078]">
                      Choose a clean, high-quality image that visually
                      represents this seed collection.
                    </p>
                  </div>

                  <CategoryImageUploader
                    value={form.image}
                    onChange={(image) =>
                      setForm((current) => ({
                        ...current,
                        image,
                      }))
                    }
                    onUploadingChange={setImageUploading}
                  />
                </div>
              </section>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="space-y-5 xl:sticky xl:top-5 xl:self-start">
              {/* Publishing */}
              <section className="overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-[0_16px_55px_rgba(16,41,29,0.045)]">
                <div className="border-b border-[#edf1ed] px-6 py-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#89948d]">
                    Visibility
                  </p>

                  <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-[#17231c]">
                    Publishing status
                  </h2>
                </div>

                <div className="p-5">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        isActive: !current.isActive,
                      }))
                    }
                    className={`group flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                      form.isActive
                        ? "border-[#cbdacb] bg-[#edf3e9]"
                        : "border-[#e4e9e3] bg-[#f8faf7]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                          form.isActive
                            ? "bg-[#10291d] text-white shadow-[0_8px_20px_rgba(16,41,29,0.15)]"
                            : "bg-[#e7ece7] text-[#89948d]"
                        }`}
                      >
                        {form.isActive ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#26352c]">
                          {form.isActive ? "Active" : "Inactive"}
                        </p>

                        <p className="mt-0.5 text-xs text-[#718078]">
                          {form.isActive
                            ? "Visible to customers"
                            : "Hidden from customers"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`h-6 w-11 rounded-full p-1 transition ${
                        form.isActive
                          ? "bg-[#10291d]"
                          : "bg-[#cbd3cd]"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${
                          form.isActive ? "translate-x-5" : ""
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </section>

              {/* Live Preview */}
              <section className="relative overflow-hidden rounded-[28px] border border-[#dbe5dc] bg-[#10291d] text-white shadow-[0_22px_70px_rgba(16,41,29,0.15)]">
                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#c5dda8]/10 blur-3xl" />

                <div className="relative p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08]">
                        <Eye className="h-3.5 w-3.5 text-[#c5dda8]" />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                          Live preview
                        </p>

                        <p className="mt-0.5 text-xs font-semibold text-white/75">
                          Customer view
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                        form.isActive
                          ? "bg-[#c5dda8]/10 text-[#c5dda8]"
                          : "bg-white/[0.06] text-white/35"
                      }`}
                    >
                      {form.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.05]">
                    <div className="relative aspect-[4/3]">
                      {form.image ? (
                        <>
                          <img
                            src={form.image}
                            alt={
                              form.name || "Category preview"
                            }
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#10291d]/65 via-transparent to-transparent" />

                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/55">
                              Seed Collection
                            </p>

                            <p className="mt-1 text-lg font-semibold tracking-[-0.025em] text-white">
                              {form.name || "Category name"}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                            <FolderTree className="h-6 w-6 text-white/25" />
                          </div>

                          <p className="mt-3 text-xs text-white/30">
                            Category image preview
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c5dda8]">
                      Category
                    </p>

                    <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.035em]">
                      {form.name || "Category name"}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-white/35">
                      <Link2 className="h-3 w-3" />
                      /{form.slug || "category-slug"}
                    </div>

                    {form.description && (
                      <p className="mt-4 line-clamp-3 text-xs leading-5 text-white/50">
                        {form.description}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Save Card */}
              <section className="overflow-hidden rounded-[28px] border border-[#dfe7df] bg-white shadow-[0_16px_55px_rgba(16,41,29,0.045)]">
                <div className="p-5 sm:p-6">
                  {error && (
                    <div className="mb-4 rounded-2xl border border-[#efd3cf] bg-[#fff8f6] px-4 py-3.5 text-sm leading-5 text-[#a6463a]">
                      <div className="flex gap-2.5">
                        <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c65b4e]" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 rounded-2xl border border-[#cbdacb] bg-[#edf6ed] px-4 py-3.5 text-sm leading-5 text-[#315c45]">
                      <div className="flex items-center gap-2.5">
                        <Check className="h-4 w-4 shrink-0" />
                        <span>{success}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={saving || imageUploading}
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#10291d] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(16,41,29,0.12)] transition hover:bg-[#193a29] hover:shadow-[0_14px_32px_rgba(16,41,29,0.17)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving || imageUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />

                        {imageUploading
                          ? "Uploading image..."
                          : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 transition-transform group-hover:scale-105" />

                        {mode === "create"
                          ? "Create category"
                          : "Save changes"}
                      </>
                    )}
                  </button>

                  <Link
                    href="/admin/categories"
                    className="mt-2 flex h-12 items-center justify-center rounded-2xl px-4 text-sm font-semibold text-[#718078] transition hover:bg-[#f5f7f4] hover:text-[#17231c]"
                  >
                    Cancel
                  </Link>
                </div>
              </section>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}