
"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";

import {
  useWishlist,
  WishlistProduct,
} from "@/components/WishlistProvider";

interface WishlistButtonProps {
  productId: string;
  product?: WishlistProduct;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function WishlistButton({
  productId,
  product,
  size = "md",
  className = "",
}: WishlistButtonProps) {
  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();

  const [loading, setLoading] = useState(false);

  const wishlisted = isWishlisted(
    String(productId)
  );

  const handleWishlist = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (loading) return;

    setLoading(true);

    try {
      await toggleWishlist(
        String(productId),
        product
      );
    } finally {
      setLoading(false);
    }
  };

  const sizes = {
    sm: {
      button: "h-9 w-9",
      icon: 16,
    },
    md: {
      button: "h-11 w-11",
      icon: 19,
    },
    lg: {
      button: "h-12 w-12",
      icon: 21,
    },
  };

  const currentSize = sizes[size];

  return (
    <button
      type="button"
      aria-label={
        wishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      title={
        wishlisted
          ? "Remove from wishlist"
          : "Add to wishlist"
      }
      onClick={handleWishlist}
      disabled={loading}
      className={`
        ${currentSize.button}
        ${className}
        group
        relative
        flex
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        backdrop-blur-md
        transition-all
        duration-300
        ${
          wishlisted
            ? "border-[#e8cfc9] bg-[#fff7f5] text-[#a6473b] shadow-[0_8px_24px_rgba(166,71,59,0.12)]"
            : "border-white/80 bg-white/90 text-[#59635c] shadow-[0_8px_24px_rgba(16,41,29,0.08)] hover:border-[#d8e4d9] hover:bg-[#f7faf6] hover:text-[#a6473b] hover:shadow-[0_10px_30px_rgba(16,41,29,0.12)]"
        }
        disabled:cursor-not-allowed
        disabled:opacity-70
      `}
    >
      {loading ? (
        <Loader2
          size={currentSize.icon}
          className="animate-spin"
        />
      ) : (
        <Heart
          size={currentSize.icon}
          strokeWidth={1.8}
          fill={
            wishlisted
              ? "currentColor"
              : "none"
          }
          className="transition-transform duration-300 group-hover:scale-110"
        />
      )}

      {wishlisted && (
        <span className="absolute inset-0 rounded-full ring-1 ring-[#a6473b]/10" />
      )}
    </button>
  );
}

