"use client";

import Image from "next/image";

import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

import type { CartItem as CartItemType } from "@/types/cart";

type Props = {
  item: CartItemType;
};

export default function CartItem({ item }: Props) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const itemTotal =
    item.price * item.quantity;

  return (
    <article className="group relative border-b border-[#e3dfd4] py-7 first:pt-0 last:border-b-0">
      <div className="flex gap-5 sm:gap-6">
        {/* Product image */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#ede8dc] sm:h-36 sm:w-36">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="144px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Product info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7c8579]">
                {item.productType}
              </p>

              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#234636] sm:text-xl">
                {item.name}
              </h3>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() =>
                removeFromCart(item.id)
              }
              aria-label={`Remove ${item.name}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e3dfd4] text-[#747970] transition-all hover:border-[#d3c9b8] hover:bg-[#f5f1e8] hover:text-[#9a4b42]"
            >
              <Trash2
                size={16}
                strokeWidth={1.7}
              />
            </button>
          </div>

          {/* Variant */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#747970]">
            <span>
              Pack:{" "}
              <strong className="font-medium text-[#3e463e]">
                {item.packSize}
              </strong>
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-[#b7b5ac] sm:block" />

            <span>
              Unit price:{" "}
              <strong className="font-medium text-[#3e463e]">
                Rs. {item.price.toLocaleString()}
              </strong>
            </span>
          </div>

          {/* Bottom controls */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            {/* Quantity */}
            <div className="flex h-10 items-center rounded-full border border-[#dcd8cd] bg-white">
              <button
                type="button"
                onClick={() =>
                  decreaseQuantity(item.id)
                }
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center text-[#536055] transition-colors hover:text-[#234636]"
              >
                <Minus
                  size={14}
                  strokeWidth={1.8}
                />
              </button>

              <span className="min-w-8 text-center text-sm font-semibold text-[#234636]">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  increaseQuantity(item.id)
                }
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center text-[#536055] transition-colors hover:text-[#234636]"
              >
                <Plus
                  size={14}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            {/* Total */}
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#8a8f87]">
                Item total
              </p>

              <p className="mt-1 text-base font-semibold text-[#234636] sm:text-lg">
                Rs. {itemTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}