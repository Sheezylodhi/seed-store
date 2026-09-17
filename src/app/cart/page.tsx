"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

export default function CartPage() {
  const { items, totalItems } = useCart();

  return (
    <main className="min-h-screen bg-[#f8f6ef]">
      {/* Hero */}
      <section className="border-b border-[#e4dfd4] bg-[#f8f6ef] pt-32 sm:pt-36">
        <div className="mx-auto max-w-[1380px] px-5 pb-12 sm:px-8 lg:px-10 lg:pb-16">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-xs font-medium text-[#6e766d] transition-colors hover:text-[#315c45]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />

            Continue shopping
          </Link>

          <div className="mt-9 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles
                  size={14}
                  className="text-[#315c45]"
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718071]">
                  Your Selection
                </span>
              </div>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-[#234636] sm:text-5xl lg:text-6xl">
                Your Cart
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#747970] sm:text-base">
                Everything you've selected, gathered
                together and ready for the next step.
              </p>
            </div>

            {items.length > 0 && (
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-[#dcd8cd] bg-white px-4 py-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#edf2eb] text-xs font-semibold text-[#315c45]">
                  {totalItems}
                </span>

                <span className="text-xs font-medium text-[#586158]">
                  {totalItems === 1
                    ? "item in your bag"
                    : "items in your bag"}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cart */}
      <section className="mx-auto max-w-[1380px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_420px]">
              {/* Products */}
              <div className="overflow-hidden rounded-[28px] border border-[#e0dbcf] bg-white px-5 py-7 sm:px-8 sm:py-8">
                <div className="mb-6 flex items-center justify-between border-b border-[#e8e3d8] pb-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c8579]">
                      Selected products
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-[#234636]">
                      Your bag
                    </h2>
                  </div>

                  <Leaf
                    size={20}
                    strokeWidth={1.4}
                    className="text-[#7b957e]"
                  />
                </div>

                <div>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                    />
                  ))}
                </div>
              </div>

              {/* Summary */}
              <CartSummary />
            </div>

            {/* Bottom trust */}
            <div className="mt-8 grid gap-px overflow-hidden rounded-[24px] border border-[#e0dbcf] bg-[#e0dbcf] sm:grid-cols-3">
              <div className="bg-white px-6 py-6">
                <p className="text-xs font-semibold text-[#315c45]">
                  Carefully selected
                </p>

                <p className="mt-1 text-xs leading-5 text-[#7b8179]">
                  Quality-focused products for your
                  growing journey.
                </p>
              </div>

              <div className="bg-white px-6 py-6">
                <p className="text-xs font-semibold text-[#315c45]">
                  Packed with care
                </p>

                <p className="mt-1 text-xs leading-5 text-[#7b8179]">
                  Your order is prepared with attention
                  to every detail.
                </p>
              </div>

              <div className="bg-white px-6 py-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={17}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-[#315c45]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-[#315c45]">
                      Secure shopping
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#7b8179]">
                      A simple and secure checkout
                      experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}