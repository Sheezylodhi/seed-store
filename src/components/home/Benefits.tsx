
"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Apple,
  BatteryCharging,
  Droplets,
  Flower2,
  HeartPulse,
  Leaf,
  Moon,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
} from "lucide-react";

const keyBenefits = [
  {
    icon: Activity,
    title: "PCOS Support",
    text: "Helps make irregular periods more predictable and eases unwanted hair growth or skin breakouts.",
  },
  {
    icon: HeartPulse,
    title: "PMS & Pain Relief",
    text: "Essential minerals like magnesium lessen belly cramps, reduce bloating, and smooth out mood swings.",
  },
  {
    icon: Flower2,
    title: "Natural Fertility Support",
    text: "Helps build a healthy womb lining, supports regular egg release, and boosts key pregnancy-preparatory hormones—making it easier for your body to conceive.",
  },
  {
    icon: Sparkles,
    title: "Better Cycle Health",
    text: "Prepares your body for healthier, more balanced cycles over time.",
  },
  {
    icon: BatteryCharging,
    title: "Steady Energy & Digestion",
    text: "Plant fiber and healthy fats prevent blood sugar crashes, keeping your energy steady all day.",
  },
];

export default function Benefits() {
  return (
    <section
      id="benefits"
      aria-labelledby="benefits-heading"
      className="relative overflow-hidden bg-[#f8f6ef] py-24 sm:py-28 lg:py-36"
    >
      {/* ─────────────────────────────────
          LUXURY BACKGROUND
      ───────────────────────────────── */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-56
          top-0
          h-[600px]
          w-[600px]
          rounded-full
          bg-[#e5ede3]/70
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-56
          bottom-0
          h-[600px]
          w-[600px]
          rounded-full
          bg-[#eee8da]/70
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[38%]
          h-[420px]
          w-[420px]
          -translate-x-1/2
          rounded-full
          bg-white/50
          blur-[110px]
        "
      />

      {/* Fine decorative ring */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          top-[18%]
          h-72
          w-72
          rounded-full
          border
          border-[#dce4d8]/70
        "
      />

      <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        {/* ═══════════════════════════════
            HEADER
        ═══════════════════════════════ */}

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <span className="h-px w-10 bg-[#315c45]/55 sm:w-16" />

            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#315c45] sm:text-[11px]">
              Why Seed Cycling
            </span>

            <span className="h-px w-10 bg-[#315c45]/55 sm:w-16" />
          </motion.div>

          <motion.h2
            id="benefits-heading"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.75,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              font-serif
              text-[40px]
              font-medium
              leading-[1.04]
              tracking-[-0.04em]
              text-[#203d2e]
              sm:text-[50px]
              lg:text-[60px]
            "
          >
            Benefits That Work With
            <br />
            <span className="text-[#718071]">
              Your Natural Rhythm
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.65,
              delay: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-[14px]
              leading-[1.9]
              text-[#747970]
              sm:text-[15px]
            "
          >
            Seed cycling uses four simple seeds—flax, pumpkin, sesame, and
            sunflower—to naturally support your body through the two halves
            of your cycle.
          </motion.p>
        </div>

        {/* ═══════════════════════════════
            PHASE INTRODUCTION
        ═══════════════════════════════ */}

        <div className="relative mt-20 sm:mt-24">
          {/* Vertical center line */}
          <div
            aria-hidden="true"
            className="
              absolute
              bottom-0
              left-1/2
              top-0
              hidden
              w-px
              -translate-x-1/2
              bg-gradient-to-b
              from-transparent
              via-[#d6ddd2]
              to-transparent
              lg:block
            "
          />

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-0">
            {/* PHASE 1 */}
            <motion.div
              initial={{
                opacity: 0,
                x: -70,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: "-100px",
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                lg:pr-14
                xl:pr-20
              "
            >
              <PhaseBlock
                icon={Sun}
                phase="Phase 1"
                label="First Half"
                title="Follicular Phase"
                days="Days 1–14"
                description="The first half of your cycle, beginning with the start of your period and continuing through ovulation."
                seeds="Flax + Pumpkin"
                align="left"
              />
            </motion.div>

            {/* PHASE 2 */}
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
                margin: "-100px",
              }}
              transition={{
                duration: 0.9,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                relative
                lg:pl-14
                xl:pl-20
              "
            >
              <PhaseBlock
                icon={Moon}
                phase="Phase 2"
                label="Second Half"
                title="Luteal Phase"
                days="Days 15–28"
                description="The second half of your cycle, beginning after ovulation and continuing until your next period."
                seeds="Sesame + Sunflower"
                align="right"
              />
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════
            KEY BENEFITS INTRO
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
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            mt-24
            border-t
            border-[#dedfd7]
            pt-12
            sm:mt-28
            sm:pt-14
          "
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-9 bg-[#315c45]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#315c45]">
                  Key Benefits
                </span>
              </div>

              <h3
                className="
                  font-serif
                  text-[32px]
                  font-medium
                  leading-[1.08]
                  tracking-[-0.03em]
                  text-[#234636]
                  sm:text-[40px]
                "
              >
                A Simple Daily Ritual,
                <br />
                <span className="text-[#788678]">
                  Better Support Over Time.
                </span>
              </h3>
            </div>

            <p
              className="
                max-w-md
                text-sm
                leading-7
                text-[#747970]
                lg:pb-1
                lg:text-right
              "
            >
              Four seeds. Two phases. One simple routine designed around the
              natural rhythm of your cycle.
            </p>
          </div>
        </motion.div>

        {/* ═══════════════════════════════
            BENEFITS — EDITORIAL LAYOUT
        ═══════════════════════════════ */}

        <div className="mt-12">
          <div className="border-t border-[#dedfd7]">
            {keyBenefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.article
                  key={benefit.title}
                  initial={{
                    opacity: 0,
                    y: 30,
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
                    duration: 0.65,
                    delay: index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    group
                    relative
                    grid
                    gap-6
                    border-b
                    border-[#dedfd7]
                    py-7
                    sm:grid-cols-[80px_250px_1fr]
                    sm:items-start
                    sm:gap-8
                    sm:py-9
                    lg:grid-cols-[100px_280px_1fr]
                    lg:gap-10
                    lg:py-10
                  "
                >
                  {/* Number */}
                  <div className="flex items-center gap-4 sm:block">
                    <span
                      className="
                        font-serif
                        text-[42px]
                        font-medium
                        leading-none
                        tracking-[-0.05em]
                        text-[#dfe5dc]
                        transition-colors
                        duration-500
                        group-hover:text-[#b8c8b7]
                        sm:text-[52px]
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#d9e2d7]
                        bg-[#f0f3ed]
                        transition-all
                        duration-500
                        group-hover:border-[#b9cdb9]
                        group-hover:bg-[#e7eee5]
                        sm:mt-4
                      "
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.5}
                        className="
                          text-[#315c45]
                          transition-transform
                          duration-500
                          group-hover:scale-110
                        "
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="sm:pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9aa198]">
                      Benefit {String(index + 1).padStart(2, "0")}
                    </p>

                    <h4
                      className="
                        mt-2
                        font-serif
                        text-[23px]
                        font-medium
                        leading-tight
                        tracking-[-0.02em]
                        text-[#294234]
                        transition-colors
                        duration-300
                        group-hover:text-[#315c45]
                        sm:text-[25px]
                      "
                    >
                      {benefit.title}
                    </h4>
                  </div>

                  {/* Description */}
                  <div className="relative sm:pt-1">
                    <p
                      className="
                        max-w-2xl
                        text-[13px]
                        leading-[1.85]
                        text-[#70776f]
                        sm:text-[14px]
                        lg:text-[15px]
                        lg:leading-[1.8]
                      "
                    >
                      {benefit.text}
                    </p>

                    {/* Hover arrow */}
                    <div
                      aria-hidden="true"
                      className="
                        mt-4
                        flex
                        items-center
                        gap-2
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-[#315c45]
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-1
                        group-hover:opacity-100
                      "
                    >
                      <span className="h-px w-6 bg-[#315c45]" />
                      Natural support
                    </div>
                  </div>

                  {/* Hover side accent */}
                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      bottom-0
                      left-0
                      top-0
                      w-0.5
                      origin-bottom
                      scale-y-0
                      bg-[#315c45]
                      transition-transform
                      duration-500
                      group-hover:scale-y-100
                    "
                  />
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════
            FOUR SEEDS — PREMIUM FOOTER
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
            delay: 0.1,
          }}
          className="
            relative
            mt-14
            overflow-hidden
            border
            border-[#d9e1d7]
            bg-[#e8efe6]
            px-6
            py-8
            sm:px-9
            sm:py-9
            lg:px-11
          "
        >
          {/* Decorative circles */}
          <div
            aria-hidden="true"
            className="
              absolute
              -right-16
              -top-20
              h-48
              w-48
              rounded-full
              border
              border-[#cad8c8]
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              -right-3
              -top-9
              h-28
              w-28
              rounded-full
              border
              border-[#d2ded0]
            "
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            {/* Left */}
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#ccd9ca]
                  bg-[#f5f7f2]
                "
              >
                <Leaf
                  size={21}
                  strokeWidth={1.4}
                  className="text-[#315c45]"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#315c45]">
                  The Four Seeds
                </p>

                <p className="mt-1.5 max-w-md text-sm leading-6 text-[#626b62]">
                  Four simple seeds form the foundation of the seed cycling
                  routine.
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="grid grid-cols-2 gap-x-7 gap-y-4 sm:grid-cols-4 lg:gap-8">
              <SeedName name="Flax" phase="Phase 1" />
              <SeedName name="Pumpkin" phase="Phase 1" />
              <SeedName name="Sesame" phase="Phase 2" />
              <SeedName name="Sunflower" phase="Phase 2" />
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════
            DISCLAIMER
        ═══════════════════════════════ */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            delay: 0.2,
          }}
          className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-2.5 text-center"
        >
          <ShieldCheck
            size={14}
            strokeWidth={1.6}
            className="mt-0.5 shrink-0 text-[#7f8e80]"
          />

          <p className="text-[10px] leading-5 text-[#858b84]">
            Seed cycling is a nutritional wellness practice. Individual
            experiences may vary.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════
   PHASE BLOCK
═══════════════════════════════ */

function PhaseBlock({
  icon: Icon,
  phase,
  label,
  title,
  days,
  description,
  seeds,
  align,
}: {
  icon: typeof Sun;
  phase: string;
  label: string;
  title: string;
  days: string;
  description: string;
  seeds: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`
        group
        relative
        ${
          align === "right"
            ? "lg:text-left"
            : "lg:text-right"
        }
      `}
    >
      <div
        className={`
          flex
          items-center
          gap-4
          ${
            align === "right"
              ? "lg:flex-row"
              : "lg:flex-row-reverse"
          }
        `}
      >
        {/* Icon */}
        <div
          className="
            flex
            h-16
            w-16
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#d4dfd2]
            bg-[#edf2eb]
            shadow-[0_10px_30px_rgba(35,70,54,0.06)]
            transition-all
            duration-500
            group-hover:scale-105
            group-hover:border-[#b9cbb8]
            group-hover:bg-[#e6eee4]
          "
        >
          <Icon
            size={25}
            strokeWidth={1.4}
            className="text-[#315c45]"
          />
        </div>

        <div>
          <div
            className={`
              flex
              items-center
              gap-2
              ${
                align === "left"
                  ? "lg:justify-end"
                  : "lg:justify-start"
              }
            `}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#315c45]">
              {phase}
            </span>

            <span className="h-1 w-1 rounded-full bg-[#9aae9a]" />

            <span className="text-[10px] uppercase tracking-[0.15em] text-[#8b938a]">
              {label}
            </span>
          </div>

          <div
            className={`
              mt-2
              flex
              items-center
              gap-3
              ${
                align === "left"
                  ? "lg:justify-end"
                  : "lg:justify-start"
              }
            `}
          >
            <span className="text-[11px] font-semibold text-[#315c45]">
              {days}
            </span>

            <span className="h-px w-8 bg-[#cdd8cc]" />
          </div>
        </div>
      </div>

      {/* Main typography */}
      <div className="mt-8">
        <h3
          className="
            font-serif
            text-[35px]
            font-medium
            leading-[1.05]
            tracking-[-0.035em]
            text-[#203d2e]
            sm:text-[42px]
            lg:text-[46px]
          "
        >
          {title}
        </h3>

        <p
          className={`
            mt-4
            max-w-xl
            text-[13px]
            leading-7
            text-[#70776f]
            sm:text-[14px]
            ${
              align === "left"
                ? "lg:ml-auto"
                : ""
            }
          `}
        >
          {description}
        </p>
      </div>

      {/* Seed signature */}
      <div
        className={`
          mt-7
          flex
          items-center
          gap-3
          ${
            align === "left"
              ? "lg:justify-end"
              : "lg:justify-start"
          }
        `}
      >
        <span className="h-px w-8 bg-[#315c45]/50" />

        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#315c45]">
          {seeds}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   SEED NAME
═══════════════════════════════ */

function SeedName({
  name,
  phase,
}: {
  name: string;
  phase: string;
}) {
  return (
    <div className="group flex items-center gap-3">
      <span className="h-1.5 w-1.5 rounded-full bg-[#315c45] transition-transform duration-300 group-hover:scale-125" />

      <div>
        <p className="text-[12px] font-semibold text-[#315c45]">
          {name}
        </p>

        <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-[#858d84]">
          {phase}
        </p>
      </div>
    </div>
  );
}

