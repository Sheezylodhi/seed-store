"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Leaf,
} from "lucide-react";

const socialPosts = [
  {
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=85",
    alt: "Fresh green leaves and natural plants",
  },
  {
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=700&q=85",
    alt: "Fresh organic produce",
  },
  {
    image:
      "https://images.unsplash.com/photo-1592982537447-6f2a6a0a4f6a?auto=format&fit=crop&w=700&q=85",
    alt: "Natural seeds and plants",
  },
  {
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=700&q=85",
    alt: "Young plant growing from soil",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=700&q=85",
    alt: "Fresh vegetables and natural produce",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523742810-6b3c8f0d9c8b?auto=format&fit=crop&w=700&q=85",
    alt: "Green plant leaves",
  },
];

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SocialMedia() {
  return (
    <section
      id="social-media"
      aria-labelledby="social-heading"
      className="overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 lg:flex-row lg:items-end">
          <div className="max-w-[650px]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center gap-3"
            >
              <InstagramIcon />
              
              

              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#315c45]">
                Follow Our Journey
              </span>
            </motion.div>

            <motion.h2
              id="social-heading"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-serif text-3xl leading-tight tracking-[-0.02em] text-[#234636] sm:text-4xl lg:text-[46px]"
            >
              Growing Together
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 max-w-[570px] text-sm leading-7 text-[#747970] sm:text-[15px]"
            >
              Follow us for simple wellness tips, seed cycling inspiration,
              daily routines, and a closer look at the Seedra journey.
            </motion.p>
          </div>

          {/* Instagram CTA */}
          <motion.a
            href="#"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -2 }}
            className="
              inline-flex w-fit items-center gap-2
              rounded-full border border-[#d5ddd3]
              bg-[#f8f6ef]
              px-5 py-3
              text-xs font-semibold
              text-[#315c45]
              transition-all duration-300
              hover:border-[#315c45]
              hover:bg-[#315c45]
              hover:text-white
            "
          >
            <InstagramIcon />
            Follow Us
            <ArrowUpRight size={15} strokeWidth={1.8} />
          </motion.a>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:gap-4">
          {socialPosts.map((post, index) => (
            <motion.a
              key={post.image}
              href="#"
              aria-label={`View Seedra social post ${index + 1}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.06,
              }}
              className="group relative block overflow-hidden rounded-xl sm:rounded-2xl"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={post.image}
                  alt={post.alt}
                  loading="lazy"
                  className="
                    h-full w-full object-cover
                    transition-transform duration-700
                    ease-out
                    group-hover:scale-105
                  "
                />

                {/* Overlay */}
                <div
                  className="
                    absolute inset-0
                    bg-[#234636]/0
                    transition-all duration-300
                    group-hover:bg-[#234636]/45
                  "
                />

                {/* Instagram icon */}
                <div
                  className="
                    absolute inset-0
                    flex items-center justify-center
                    opacity-0
                    transition-all duration-300
                    group-hover:opacity-100
                  "
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#315c45] shadow-lg">
                    <InstagramIcon />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom Brand Line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex items-center justify-center gap-3 sm:mt-12"
        >
          <Leaf
            size={15}
            strokeWidth={1.5}
            className="text-[#8da58e]"
          />

          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#747970]">
            Better Seeds · Better Routine · Better Growth
          </p>

          <Leaf
            size={15}
            strokeWidth={1.5}
            className="text-[#8da58e]"
          />
        </motion.div>
      </div>
    </section>
  );
}