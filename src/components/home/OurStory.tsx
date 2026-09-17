"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Leaf,
  Sprout,
} from "lucide-react";
import Link from "next/link";

const storyPoints = [
  "Carefully selected seeds",
  "Packed with attention to quality",
  "Made for growers who care about better results",
];

export default function OurStory() {
  return (
    <section
      id="our-story"
      aria-labelledby="our-story-heading"
      className="relative overflow-hidden bg-[#fbfaf6] py-24 sm:py-28 lg:py-36"
    >
      {/* ─────────────────────────────────
          BACKGROUND DETAILS
      ───────────────────────────────── */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-48
          top-10
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#e8eee5]/70
          blur-[110px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-48
          bottom-0
          h-[520px]
          w-[520px]
          rounded-full
          bg-[#eee8da]/70
          blur-[110px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-80
          w-80
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/60
          blur-[100px]
        "
      />

      <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        {/* ─────────────────────────────────
            MAIN CONTENT
        ───────────────────────────────── */}

        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20 xl:gap-28">
          {/* ═══════════════════════════════
              IMAGE SIDE — SLIDE FROM LEFT
          ═══════════════════════════════ */}

          <motion.div
            initial={{
              opacity: 0,
              x: -70,
              scale: 0.97,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              margin: "-120px",
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              mx-auto
              w-full
              max-w-[610px]
              lg:mx-0
            "
          >
            {/* Outer frame */}
            <div
              className="
                relative
                rounded-[34px]
                border
                border-[#dfe4db]
                bg-[#f0f3ed]
                p-2
                shadow-[0_30px_90px_rgba(35,70,54,0.10)]
                sm:p-3
              "
            >
              {/* Image wrapper */}
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[27px]
                  bg-[#e6ece3]
                "
              >
                <div className="aspect-[0.91] w-full">
                  <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="
            h-full
            w-full
            object-cover
            scale-[1.03]
          "
        >
          <source
            src="/videos/final-cta.mp4"
            type="video/mp4"
          />
        </video>
                </div>

                {/* Image overlay */}
                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#14271d]/45
                    via-transparent
                    to-[#ffffff]/5
                  "
                />

                {/* Image top label */}
                <div
                  className="
                    absolute
                    left-5
                    top-5
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/25
                    bg-[#193126]/35
                    px-3.5
                    py-2
                    backdrop-blur-md
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white">
                    Our Story
                  </span>
                </div>

                {/* Image bottom statement */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
                  <p className="max-w-[280px] font-serif text-xl leading-tight tracking-[-0.02em] text-white sm:text-2xl">
                    Quality starts with the seed.
                  </p>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════
                FLOATING QUALITY CARD
            ═══════════════════════════════ */}

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
                x: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                duration: 0.65,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute
                -bottom-7
                right-3
                z-20
                flex
                max-w-[270px]
                items-center
                gap-3.5
                rounded-[20px]
                border
                border-[#dce3d9]
                bg-[#fffefa]/95
                px-4
                py-3.5
                shadow-[0_20px_55px_rgba(35,70,54,0.15)]
                backdrop-blur-xl
                sm:-right-5
                sm:px-5
                sm:py-4
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-[14px]
                  bg-[#edf2eb]
                  ring-1
                  ring-[#dce5da]
                "
              >
                <Leaf
                  size={20}
                  strokeWidth={1.5}
                  className="text-[#315c45]"
                />
              </div>

              <div>
                <p className="text-[12px] font-semibold text-[#234636]">
                  Grown with care
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#747970]">
                  Quality starts with the seed
                </p>
              </div>
            </motion.div>

            {/* Decorative vertical line */}
            <div
              aria-hidden="true"
              className="
                absolute
                -bottom-12
                left-8
                h-20
                w-px
                bg-gradient-to-b
                from-[#315c45]/60
                to-transparent
                sm:-left-5
                sm:bottom-4
              "
            />

            {/* Decorative circle */}
            <div
              aria-hidden="true"
              className="
                absolute
                -right-6
                -top-6
                -z-10
                h-28
                w-28
                rounded-full
                border
                border-[#dce5da]
                sm:-right-10
                sm:-top-10
                sm:h-36
                sm:w-36
              "
            />
          </motion.div>

          {/* ═══════════════════════════════
              CONTENT SIDE — SLIDE FROM RIGHT
          ═══════════════════════════════ */}

          <motion.div
            initial={{
              opacity: 0,
              x: 70,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              margin: "-120px",
            }}
            transition={{
              duration: 0.9,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-[670px]"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.25,
              }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="h-px w-10 bg-[#315c45]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#315c45]">
                Our Story
              </span>
            </motion.div>

            {/* Heading */}
            <h2
              id="our-story-heading"
              className="
                max-w-[650px]
                font-serif
                text-[40px]
                font-medium
                leading-[1.04]
                tracking-[-0.04em]
                text-[#203d2e]
                sm:text-[50px]
                lg:text-[58px]
              "
            >
              Better Growth
              <br />
              <span className="text-[#718171]">
                Starts With Better Seeds.
              </span>
            </h2>

            {/* Heading underline detail */}
            <div className="mt-7 flex items-center gap-3">
              <span className="h-px w-14 bg-[#315c45]/50" />

              <span className="h-1 w-1 rounded-full bg-[#315c45]" />

              <span className="h-px w-5 bg-[#315c45]/30" />
            </div>

            {/* Intro */}
            <p
              className="
                mt-7
                max-w-xl
                text-[15px]
                leading-[1.9]
                text-[#5f675f]
                sm:text-base
              "
            >
              We believe every growing journey starts with one simple
              decision: choosing the right seed. That is why we focus on
              bringing together carefully selected seeds for people who want
              quality, consistency, and a better growing experience.
            </p>

            {/* Second Paragraph */}
            <p
              className="
                mt-5
                max-w-xl
                text-[14px]
                leading-[1.9]
                text-[#747970]
                sm:text-[15px]
              "
            >
              From selection to packing, every step is approached with care.
              Our goal is simple — make quality seeds easier to discover,
              easier to choose, and easier to grow with.
            </p>

            {/* ═══════════════════════════════
                STORY POINTS
            ═══════════════════════════════ */}

            <div className="mt-9 max-w-xl">
              <div className="space-y-3">
                {storyPoints.map((point, index) => (
                  <motion.div
                    key={point}
                    initial={{
                      opacity: 0,
                      x: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                      margin: "-50px",
                    }}
                    transition={{
                      duration: 0.55,
                      delay: 0.2 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                      group
                      flex
                      items-center
                      gap-4
                      rounded-[17px]
                      border
                      border-[#e5e7e0]
                      bg-white/65
                      px-4
                      py-3.5
                      transition-all
                      duration-300
                      hover:border-[#d5dfd2]
                      hover:bg-white
                      hover:shadow-[0_10px_30px_rgba(35,70,54,0.05)]
                    "
                  >
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#edf2eb]
                        ring-1
                        ring-[#dce5da]
                        transition-all
                        duration-300
                        group-hover:bg-[#315c45]
                      "
                    >
                      <Check
                        size={14}
                        strokeWidth={2}
                        className="
                          text-[#315c45]
                          transition-colors
                          duration-300
                          group-hover:text-white
                        "
                      />
                    </span>

                    <span className="text-[13px] font-medium text-[#4e584f] sm:text-sm">
                      {point}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════
                CTA
            ═══════════════════════════════ */}

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/our-story"
                className="
                  group
                  relative
                  inline-flex
                  items-center
                  gap-3
                  overflow-hidden
                  rounded-full
                  bg-[#315c45]
                  px-6
                  py-3.5
                  text-xs
                  font-semibold
                  text-white
                  shadow-[0_12px_30px_rgba(49,92,69,0.18)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#234636]
                  hover:shadow-[0_18px_38px_rgba(49,92,69,0.22)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#315c45]
                  focus:ring-offset-2
                "
              >
                <span className="relative z-10">
                  Discover Our Story
                </span>

                <span
                  className="
                    relative
                    z-10
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-white/15
                  "
                >
                  <ArrowRight
                    size={14}
                    strokeWidth={1.8}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                    "
                  />
                </span>
              </Link>

              <div className="flex items-center gap-2.5">
                <Sprout
                  size={17}
                  strokeWidth={1.5}
                  className="text-[#8da58e]"
                />

                <span className="text-[11px] font-medium tracking-wide text-[#858b84]">
                  From seed to growth
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════
            BOTTOM BRAND STATEMENT
        ═══════════════════════════════ */}

        <motion.div
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
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-24
            border-t
            border-[#e4e3dc]
            pt-9
            sm:mt-28
            sm:pt-10
          "
        >
          <div className="grid gap-7 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-10">
            {/* Quality */}
            <div className="flex items-center gap-3.5">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#dce5da]
                  bg-[#edf2eb]
                "
              >
                <Leaf
                  size={18}
                  strokeWidth={1.5}
                  className="text-[#315c45]"
                />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#315c45]">
                  Quality First
                </p>

                <p className="mt-1 text-[10px] text-[#858b84]">
                  Selected with care
                </p>
              </div>
            </div>

            {/* Center Line */}
            <div className="hidden h-px bg-[#e4e3dc] sm:block" />

            {/* Statement */}
            <p className="max-w-sm text-left text-[12px] leading-6 text-[#858b84] sm:text-right">
              Simple choices. Better seeds. A more thoughtful way to grow.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}