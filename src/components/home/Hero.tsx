"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  /* =====================================================
      HERO IMAGES
      Replace these paths with your own images.
      
      Put your images inside:
      /public/images/hero/

      Example:
      hero-1.jpg
      hero-2.jpg
      hero-3.jpg
  ====================================================== */

  const heroImages = [
    "/images/hero/hero-1.jpeg",
    "/images/hero/hero-2.jpeg",
    "/images/hero/hero-3.jpeg",
  ];

  const [currentImage, setCurrentImage] =
    useState(0);

  /* =====================================================
      AUTOMATIC SLIDER
      Changes image every 5 seconds
  ====================================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        (prev + 1) % heroImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative min-h-[calc(100vh-110px)] overflow-hidden bg-[#234636]">

      {/* =====================================================
          BACKGROUND IMAGE SLIDER
      ====================================================== */}

      <div className="absolute inset-0">

        <AnimatePresence mode="sync">

          <motion.img
            key={currentImage}
            src={heroImages[currentImage]}
            alt="Fresh green plants and natural growing environment"
            initial={{
              opacity: 0,
              scale: 1.04,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
            }}
            transition={{
              opacity: {
                duration: 1.2,
                ease: "easeInOut",
              },
              scale: {
                duration: 5,
                ease: "linear",
              },
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />

        </AnimatePresence>

      </div>

      {/* =====================================================
          DARK CINEMATIC OVERLAY
      ====================================================== */}

      <div className="absolute inset-0 bg-[#172b20]/55" />

      {/* =====================================================
          LEFT GRADIENT FOR TEXT READABILITY
      ====================================================== */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#172b20]/90 via-[#172b20]/60 to-transparent" />

      {/* =====================================================
          BOTTOM FADE
      ====================================================== */}

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#172b20]/50 to-transparent" />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-110px)] max-w-[1380px] items-center px-5 py-20 sm:px-8 lg:px-10">

        <div className="max-w-[720px]">

          {/* =====================================================
              EYEBROW
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="mb-7 flex items-center gap-3"
          >

            <span className="h-px w-10 bg-[#c9d8c7]" />

            <span className="text-[10px] font-semibold tracking-[0.25em] text-[#dce7dc] sm:text-[11px]">
              PREMIUM SEEDS FOR BETTER GROWTH
            </span>

          </motion.div>

          {/* =====================================================
              MAIN HEADING
          ====================================================== */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-serif text-[48px] font-medium leading-[1.02] tracking-[-0.04em] text-white sm:text-[64px] lg:text-[78px] xl:text-[86px]"
          >
            Grow Better.
            <br />

            <span className="text-[#dce7dc]">
              Start With
            </span>

            <br />

            Better Seeds.
          </motion.h1>

          {/* =====================================================
              DESCRIPTION
          ====================================================== */}

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
            className="mt-7 max-w-[570px] text-[15px] leading-7 text-white/75 sm:text-base sm:leading-8"
          >
            Discover carefully selected seeds made for growers
            who value quality, freshness and better results.
          </motion.p>

          {/* =====================================================
              CTA
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.5,
            }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >

            {/* PRIMARY CTA */}

            <a
              href="/shop"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#234636] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f8f6ef] hover:shadow-xl"
            >
              Shop Seeds

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            {/* SECONDARY CTA */}

            <a
              href="#categories"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/15"
            >
              Explore Categories

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

          </motion.div>

          {/* =====================================================
              TRUST POINTS
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.75,
            }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-6"
          >

            {[
              "Carefully Selected",
              "Carefully Packed",
              "Nationwide Delivery",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs text-white/75"
              >

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                  <Check
                    size={12}
                    className="text-[#dce7dc]"
                  />
                </span>

                {item}

              </div>
            ))}

          </motion.div>

        </div>

      </div>

      {/* =====================================================
          SLIDER INDICATORS
      ====================================================== */}

      <div className="absolute bottom-8 right-6 z-20 flex items-center gap-2 sm:right-10">

        {heroImages.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() =>
              setCurrentImage(index)
            }
            aria-label={`Go to slide ${
              index + 1
            }`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              currentImage === index
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}

      </div>

      {/* =====================================================
          BOTTOM SCROLL INDICATOR
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          delay: 1.2,
        }}
        className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 sm:flex"
      >

        <span className="text-[9px] font-medium uppercase tracking-[0.25em]">
          Explore
        </span>

        <motion.div
          animate={{
            y: [0, 5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown size={18} />
        </motion.div>

      </motion.div>

      {/* =====================================================
          SUBTLE DECORATIVE CIRCLES
      ====================================================== */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full border border-white/10" />

      <div className="pointer-events-none absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full border border-white/10" />

    </section>
  );
}