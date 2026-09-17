"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Leaf,
  Sprout,
} from "lucide-react";

const categories = [
  {
    title: "Paste Seeds",
    description:
      "Explore our collection of carefully selected paste seeds for your next growing project.",
    image:
      "https://images.unsplash.com/photo-1592982537447-6f2a6a0a4f6a?auto=format&fit=crop&w=1200&q=85",
    icon: Sprout,
    href: "/shop?category=paste-seeds",
  },
  {
    title: "Non-Paste Seeds",
    description:
      "Discover more seed varieties selected for growers looking for quality and reliable results.",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=85",
    icon: Leaf,
    href: "/shop?category=non-paste-seeds",
  },
];

export default function Categories() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="bg-[#f8f6ef] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 lg:flex-row lg:items-end">

          <div className="max-w-[650px]">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="h-px w-8 bg-[#315c45]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#315c45]">
                Explore Our Collection
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              id="categories-heading"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: 0.05,
              }}
              className="font-serif text-[38px] font-medium leading-[1.08] tracking-[-0.035em] text-[#234636] sm:text-[48px] lg:text-[56px]"
            >
              Find the Right Seeds
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: 0.12,
              }}
              className="mt-4 max-w-[570px] text-sm leading-7 text-[#747970] sm:text-[15px]"
            >
              Explore our collection and find quality seeds for
              your next growing journey.
            </motion.p>
          </div>

          {/* View all */}
          <motion.a
            href="/shop"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="group inline-flex w-fit items-center gap-2 border-b border-[#315c45]/40 pb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#315c45] transition-colors duration-300 hover:border-[#315c45]"
          >
            View All Seeds

            <ArrowUpRight
              size={15}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </motion.a>
        </div>

        {/* =====================================================
            CATEGORY CARDS
        ====================================================== */}
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">

          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.a
                key={category.title}
                href={category.href}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: "-70px",
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative block overflow-hidden rounded-[24px] bg-[#234636] sm:rounded-[28px]"
              >
                {/* Image */}
                <div className="relative aspect-[1.15] overflow-hidden sm:aspect-[1.35] lg:aspect-[1.45]">

                  <img
                    src={category.image}
                    alt={`${category.title} - Seed collection`}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="
                      h-full w-full object-cover
                      transition-transform duration-[1000ms]
                      ease-out
                      group-hover:scale-[1.055]
                    "
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172b20]/90 via-[#234636]/25 to-transparent" />

                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-[#315c45]/0 transition-colors duration-500 group-hover:bg-[#315c45]/10" />

                  {/* =================================================
                      TOP ICON
                  ================================================== */}
                  <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white/15 sm:left-6 sm:top-6">
                    <Icon
                      size={18}
                      strokeWidth={1.6}
                    />
                  </div>

                  {/* =================================================
                      CARD CONTENT
                  ================================================== */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">

                    <div className="max-w-[500px]">

                      <h3 className="font-serif text-[30px] font-medium leading-tight tracking-[-0.025em] text-white sm:text-[36px]">
                        {category.title}
                      </h3>

                      <p className="mt-2 max-w-[430px] text-xs leading-6 text-white/70 sm:text-sm">
                        {category.description}
                      </p>

                      {/* Explore */}
                      <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                        <span className="border-b border-white/40 pb-1 transition-colors duration-300 group-hover:border-white">
                          Explore Collection
                        </span>

                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.8}
                          className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* =====================================================
            FUTURE CATEGORY NOTE
        ====================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 flex items-center justify-center gap-2 text-center"
        >
          <span className="h-1 w-1 rounded-full bg-[#8da58e]" />

          <p className="text-[10px] uppercase tracking-[0.16em] text-[#8a8e86]">
            More seed varieties coming soon
          </p>

          <span className="h-1 w-1 rounded-full bg-[#8da58e]" />
        </motion.div>
      </div>
    </section>
  );
}