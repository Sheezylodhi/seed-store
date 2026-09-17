"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ArrowUpRight } from "lucide-react";

import { useWishlist } from "@/components/WishlistProvider";

export default function WishlistFloatingButton() {
  const {
    wishlistCount,
    loading,
  } = useWishlist();

  return (
    <AnimatePresence>
      {!loading && wishlistCount > 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 30,
            scale: 0.9,
          }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed bottom-5 right-5 z-[100] sm:bottom-7 sm:right-7"
        >
          <Link
            href="/wishlist"
            aria-label={`Open wishlist with ${wishlistCount} saved ${
              wishlistCount === 1
                ? "product"
                : "products"
            }`}
            className="group flex items-center gap-3 rounded-full border border-[#d9e3d8] bg-[#fffdf8]/95 px-3 py-3 shadow-[0_18px_50px_rgba(16,41,29,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(16,41,29,0.22)]"
          >
            {/* HEART */}

            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#234636] text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Heart
                size={19}
                strokeWidth={1.7}
                fill="currentColor"
              />

              {/* COUNT */}

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#fffdf8] bg-[#a6473b] px-1 text-[9px] font-bold text-white">
                {wishlistCount > 99
                  ? "99+"
                  : wishlistCount}
              </span>
            </span>

            {/* TEXT */}

            <span className="hidden pr-1 sm:block">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8a8e86]">
                Saved for later
              </span>

              <span className="mt-0.5 block font-serif text-[16px] font-medium text-[#234636]">
                My Wishlist
              </span>
            </span>

            {/* ARROW */}

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4ed] text-[#315c45] transition-all duration-300 group-hover:bg-[#234636] group-hover:text-white">
              <ArrowUpRight
                size={14}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

