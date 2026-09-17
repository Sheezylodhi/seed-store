"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function EmptyCart() {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#e1ddd2] bg-white px-6 py-16 sm:px-10 sm:py-20">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#edf2eb] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#f1eee5] blur-3xl" />

      <div className="relative mx-auto max-w-xl text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#edf2eb]"
        >
          <ShoppingBag
            size={31}
            strokeWidth={1.4}
            className="text-[#315c45]"
          />
        </motion.div>

        {/* Small label */}
        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#dfe5dc] bg-[#f8faf7] px-3.5 py-1.5">
          <Sparkles
            size={12}
            strokeWidth={1.7}
            className="text-[#315c45]"
          />

          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#315c45]">
            Your cart is waiting
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#234636] sm:text-5xl">
          Your cart is empty
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#747970]">
          You haven&apos;t added anything yet. Explore our carefully
          selected seed blends and find the right products for your
          routine.
        </p>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-[#315c45] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#234636]"
          >
            Explore Products

            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Trust points */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-[#e8e4da] pt-7">
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#858980]">
            Quality Selected
          </span>

          <span className="h-1 w-1 rounded-full bg-[#b8bdb4]" />

          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#858980]">
            Carefully Packed
          </span>

          <span className="h-1 w-1 rounded-full bg-[#b8bdb4]" />

          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#858980]">
            Nationwide Delivery
          </span>
        </div>
      </div>
    </section>
  );
}