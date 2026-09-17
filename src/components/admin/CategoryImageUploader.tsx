"use client";

import { useRef, useState } from "react";
import {
  ImagePlus,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";

interface CategoryImageUploaderProps {
  value: string;
  onChange: (image: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}
export default function CategoryImageUploader({
  value,
  onChange,
  onUploadingChange,
}: CategoryImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WEBP and GIF images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size cannot exceed 5MB.");
      return;
    }

    try {
      setUploading(true);
      onUploadingChange?.(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", "categories");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Image upload failed.");
      }

      onChange(result.data.secure_url || result.data.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image."
      );
    } finally {
      setUploading(false);
       onUploadingChange?.(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div className="space-y-4">
      {!value ? (
        <div
          onDragOver={(event) => {
            event.preventDefault();

            if (!uploading) {
              setDragActive(true);
            }
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() =>
            !uploading && inputRef.current?.click()
          }
          className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition ${
            dragActive
              ? "border-[#10291d] bg-[#edf3e9]"
              : "border-[#dfe6df] bg-[#fafcf9] hover:border-[#b8c5bb] hover:bg-[#f6f9f5]"
          } ${
            uploading
              ? "cursor-not-allowed opacity-70"
              : ""
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            disabled={uploading}
            onChange={handleFileChange}
          />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#10291d]">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <UploadCloud className="h-6 w-6" />
            )}
          </div>

          <h4 className="mt-4 text-sm font-semibold text-[#17231c]">
            {uploading
              ? "Uploading category image..."
              : "Drop category image here"}
          </h4>

          <p className="mt-1 text-sm text-[#718078]">
            {uploading
              ? "Please wait while the image is uploaded."
              : "or click to browse from your computer"}
          </p>

          <p className="mt-3 text-xs font-medium text-[#89948d]">
            JPG, PNG, WEBP or GIF • Maximum 5MB
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-[#e4e9e3] bg-white">
          <div className="aspect-[16/9] w-full bg-[#f5f8f4]">
            <img
              src={value}
              alt="Category preview"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute left-3 top-3 rounded-full bg-[#10291d] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Category Image
          </div>

          <button
            type="button"
            onClick={() => onChange("")}
            disabled={uploading}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#536158] shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            aria-label="Remove category image"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-between gap-3 border-t border-[#edf0eb] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#17231c]">
                Image uploaded
              </p>

              <p className="text-xs text-[#89948d]">
                This image will be used for the category.
              </p>
            </div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#dfe6df] bg-white px-3.5 py-2 text-xs font-semibold text-[#10291d] transition hover:border-[#10291d]"
            >
              <ImagePlus className="h-4 w-4" />
              Replace
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            hidden
            disabled={uploading}
            onChange={handleFileChange}
          />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}