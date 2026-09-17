"use client";

import {
  ImagePlus,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
} from "react";

type ProductImageUploaderProps = {
  value: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  onUploadingChange?: (uploading: boolean) => void;
};

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ProductImageUploader({
  value,
  onChange,
  maxImages = 8,
  onUploadingChange,
}: ProductImageUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [uploadingIndex, setUploadingIndex] =
    useState(0);

  const [uploadingTotal, setUploadingTotal] =
    useState(0);

  const [error, setError] =
    useState("");

  const uploadFiles = async (
    files: File[]
  ) => {
    if (uploading) {
      return;
    }

    setError("");

    const availableSlots =
      maxImages - value.length;

    if (availableSlots <= 0) {
      setError(
        `You can upload up to ${maxImages} images.`
      );
      return;
    }

    const selectedFiles =
      files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      setError(
        `Only ${availableSlots} more image${
          availableSlots === 1
            ? ""
            : "s"
        } can be uploaded.`
      );
    }

    const invalidType =
      selectedFiles.find(
        (file) =>
          !ALLOWED_TYPES.includes(
            file.type
          )
      );

    if (invalidType) {
      setError(
        "Only JPG, PNG, WEBP and GIF images are allowed."
      );
      return;
    }

    const oversizedFile =
      selectedFiles.find(
        (file) =>
          file.size > MAX_FILE_SIZE
      );

    if (oversizedFile) {
      setError(
        `"${oversizedFile.name}" is larger than 5MB.`
      );
      return;
    }

    if (
      selectedFiles.length === 0
    ) {
      return;
    }

    setUploading(true);
    setUploadingIndex(0);
    setUploadingTotal(
      selectedFiles.length
    );

    onUploadingChange?.(true);

    let currentImages = [
      ...value,
    ];

    try {
      for (
        let index = 0;
        index < selectedFiles.length;
        index++
      ) {
        setUploadingIndex(index + 1);

        const formData =
          new FormData();

        formData.append(
          "file",
          selectedFiles[index]
        );

        const response =
          await fetch(
            "/api/admin/upload",
            {
              method: "POST",
              credentials:
                "include",
              body: formData,
            }
          );

        let result: any;

        try {
          result =
            await response.json();
        } catch {
          throw new Error(
            "Invalid response from upload server."
          );
        }

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Image upload failed."
          );
        }

        const uploadedUrl =
          result.data?.secure_url ||
          result.data?.url;

        if (!uploadedUrl) {
          throw new Error(
            "Upload succeeded but no image URL was returned."
          );
        }

        currentImages = [
          ...currentImages,
          uploadedUrl,
        ];

        onChange(
          currentImages
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Image upload failed."
      );
    } finally {
      setUploading(false);
      setUploadingIndex(0);
      setUploadingTotal(0);

      onUploadingChange?.(
        false
      );

      if (inputRef.current) {
        inputRef.current.value =
          "";
      }
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files =
      event.target.files;

    if (!files) {
      return;
    }

    uploadFiles(
      Array.from(files)
    );
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setDragActive(false);

    if (uploading) {
      return;
    }

    const files =
      event.dataTransfer.files;

    if (!files?.length) {
      return;
    }

    uploadFiles(
      Array.from(files)
    );
  };

  const removeImage = (
    index: number
  ) => {
    if (uploading) {
      return;
    }

    const updatedImages =
      value.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );

    onChange(updatedImages);
    setError("");
  };

  const openFilePicker = () => {
    if (
      uploading ||
      value.length >= maxImages
    ) {
      return;
    }

    inputRef.current?.click();
  };

  return (
    <div className="space-y-5">
      {/* UPLOAD AREA */}

      <div
        onClick={
          openFilePicker
        }
        onDragOver={(event) => {
          event.preventDefault();

          if (!uploading) {
            setDragActive(
              true
            );
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();

          if (!uploading) {
            setDragActive(
              true
            );
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();

          if (
            event.currentTarget ===
            event.target
          ) {
            setDragActive(
              false
            );
          }
        }}
        onDrop={
          handleDrop
        }
        className={[
          "group rounded-3xl border-2 border-dashed p-8 text-center transition",
          uploading
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer",
          dragActive
            ? "border-[#10291d] bg-[#edf3e9]"
            : "border-[#d8e0d8] bg-[#fafcf9] hover:border-[#aebbb0] hover:bg-[#f5f8f4]",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          disabled={
            uploading ||
            value.length >=
              maxImages
          }
          onChange={
            handleFileChange
          }
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3e9] text-[#10291d] transition group-hover:scale-105">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <h3 className="mt-4 text-sm font-bold text-[#26352c]">
          {uploading
            ? `Uploading image ${uploadingIndex} of ${uploadingTotal}`
            : "Upload product images"}
        </h3>

        <p className="mt-1 text-sm text-[#718078]">
          {uploading
            ? "Please wait while the image is uploaded."
            : "Drag & drop images here or click to browse from your PC"}
        </p>

        <p className="mt-3 text-xs font-medium text-[#89948d]">
          JPG, PNG, WEBP or GIF •
          Maximum 5MB each •{" "}
          {value.length}/{maxImages}{" "}
          images
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* IMAGE PREVIEWS */}

      {value.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8a958e]">
              Uploaded Images
            </p>

            <p className="text-xs font-semibold text-[#89948d]">
              {value.length} /{" "}
              {maxImages}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {value.map(
              (
                image,
                index
              ) => (
                <div
                  key={`${image}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-[#e4e9e3] bg-[#f7f9f6]"
                >
                  <img
                    src={image}
                    alt={`Product image ${
                      index + 1
                    }`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  {/* MAIN IMAGE */}

                  {index === 0 && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-[#10291d] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                      Main Image
                    </span>
                  )}

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={(
                      event
                    ) => {
                      event.stopPropagation();
                      removeImage(
                        index
                      );
                    }}
                    disabled={
                      uploading
                    }
                    aria-label={`Remove image ${
                      index + 1
                    }`}
                    className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#66736b] opacity-0 shadow-sm transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ADD MORE */}

      {value.length > 0 &&
        value.length <
          maxImages &&
        !uploading && (
          <button
            type="button"
            onClick={
              openFilePicker
            }
            className="inline-flex items-center gap-2 rounded-xl border border-[#dfe6df] bg-white px-4 py-2.5 text-xs font-bold text-[#526158] transition hover:border-[#b9c6ba] hover:bg-[#f3f6f2]"
          >
            <ImagePlus className="h-4 w-4" />
            Add More Images
          </button>
        )}
    </div>
  );
}