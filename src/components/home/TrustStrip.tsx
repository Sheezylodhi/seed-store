"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Box,
  Leaf,
  Truck,
  Sparkles,
} from "lucide-react";

const trustItems = [
  {
    icon: Leaf,
    title: "Premium Quality",
    description: "Carefully selected seeds",
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-50",
    iconBorder: "border-emerald-100",
  },
  {
    icon: Box,
    title: "Carefully Packed",
    description: "Packed fresh with care",
    iconColor: "text-amber-700",
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-100",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Delivered across Pakistan",
    iconColor: "text-blue-700",
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-100",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assured",
    description: "Products you can trust",
    iconColor: "text-violet-700",
    iconBg: "bg-violet-50",
    iconBorder: "border-violet-100",
  },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Why shop with us"
      className="relative overflow-hidden border-b border-[#e5e1d7] bg-[#fbfaf6]"
    >
      {/* =====================================================
          TOP MICRO LABEL
      ====================================================== */}

      <div className="mx-auto flex max-w-[1380px] items-center gap-3 px-5 pt-5 sm:px-8 lg:px-10">
        <span className="h-px w-8 bg-[#b7c5b5]" />

        

        <span className="h-px flex-1 bg-[#e5e1d7]" />
      </div>

      {/* =====================================================
          MOVING TRUST TRACK
      ====================================================== */}

      <div className="relative mt-2 overflow-hidden">

        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#fbfaf6] to-transparent sm:w-24" />

        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#fbfaf6] to-transparent sm:w-24" />

        <motion.div
          className="flex w-max"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{
            animationPlayState: "paused",
          }}
        >
          {/* First set */}
          <div className="flex">

            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <TrustItem
                  key={`first-${item.title}`}
                  item={item}
                  Icon={Icon}
                />
              );
            })}

          </div>

          {/* Duplicate set for seamless loop */}
          <div className="flex">

            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <TrustItem
                  key={`second-${item.title}`}
                  item={item}
                  Icon={Icon}
                />
              );
            })}

          </div>
        </motion.div>
      </div>

      {/* Bottom spacing */}
      <div className="h-2 sm:h-3" />
    </section>
  );
}

/* =========================================================
   TRUST ITEM
========================================================= */

function TrustItem({
  item,
  Icon,
}: {
  item: (typeof trustItems)[number];
  Icon: typeof Leaf;
}) {
  return (
    <div
      className="
        group relative flex
        w-[285px] shrink-0
        items-center gap-4
        border-r border-[#e5e1d7]
        px-7 py-5
        sm:w-[330px]
        sm:px-9
        sm:py-6
      "
    >
      {/* =================================================
          ICON
      ================================================== */}

      <div
        className={`
          relative flex
          h-12 w-12 shrink-0
          items-center justify-center
          rounded-2xl
          border
          ${item.iconBg}
          ${item.iconBorder}
          shadow-[0_4px_16px_rgba(35,70,54,0.05)]
          transition-all duration-300
          group-hover:-translate-y-1
          group-hover:scale-[1.03]
          group-hover:shadow-[0_8px_24px_rgba(35,70,54,0.09)]
          sm:h-[52px] sm:w-[52px]
        `}
      >
        <Icon
          size={22}
          strokeWidth={1.7}
          className={`
            ${item.iconColor}
            transition-transform
            duration-300
            group-hover:scale-110
          `}
        />

        {/* Small notification dot */}
        <span
          className={`
            absolute
            -right-1
            -top-1
            h-2
            w-2
            rounded-full
            border-2
            border-[#fbfaf6]
            ${item.iconColor.replace("text-", "bg-")}
          `}
        />
      </div>

      {/* =================================================
          TEXT
      ================================================== */}

      <div className="min-w-0">

        <p
          className="
            text-[12px]
            font-semibold
            tracking-[-0.01em]
            text-[#234636]
            sm:text-[13px]
          "
        >
          {item.title}
        </p>

        <p
          className="
            mt-1
            text-[10px]
            leading-[1.5]
            text-[#7b817b]
            sm:text-[11px]
          "
        >
          {item.description}
        </p>

      </div>

      {/* =================================================
          HOVER ACCENT
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-7
          right-7
          h-px
          origin-left
          scale-x-0
          bg-[#8da58e]
          transition-transform
          duration-500
          group-hover:scale-x-100
        "
      />
    </div>
  );
}