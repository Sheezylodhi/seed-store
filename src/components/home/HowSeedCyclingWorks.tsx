"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CircleCheck,
  Droplets,
  Leaf,
  Moon,
  Sprout,
  Sun,
} from "lucide-react";

const phaseOnePoints = [
  {
    title: "Controls Estrogen",
    text: "Flax seeds contain natural plant compounds that help keep your estrogen at the right level—raising it if it’s too low, or binding to excess estrogen to sweep it away.",
  },
  {
    title: "Builds Strong Eggs",
    text: "Pumpkin seeds supply zinc, which helps your ovaries grow healthy eggs and readies your body to make progesterone later.",
  },
  {
    title: "Cools Inflammation",
    text: "Rich in Omega-3 fatty acids, this blend reduces inner body inflammation that causes painful period cramps and acne.",
  },
];

const phaseTwoPoints = [
  {
    title: "Boosts Progesterone",
    text: "Sesame seeds provide Vitamin E, which encourages your body to produce progesterone—the calming hormone needed to hold a pregnancy and prevent PMS.",
  },
  {
    title: "Cleans Out Spent Hormones",
    text: "Sunflower seeds carry selenium, a mineral that helps your liver flush out used hormones so they don't linger in your body.",
  },
  {
    title: "Soothes Mind & Body",
    text: "High in natural magnesium, this combination relaxes tight muscles, reduces belly bloating, and keeps your mood steady.",
  },
];

export default function HowSeedCyclingWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="seed-cycling-heading"
      className="relative overflow-hidden bg-[#f7f5ee] py-24 sm:py-28 lg:py-36"
    >
      {/* ─────────────────────────────────
          LUXURY BACKGROUND DETAILS
      ───────────────────────────────── */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 top-10 h-[520px] w-[520px] rounded-full bg-[#dfe9df]/60 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-56 bottom-0 h-[520px] w-[520px] rounded-full bg-[#ebe4d4]/70 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[32%] h-64 w-64 -translate-x-1/2 rounded-full bg-white/40 blur-[90px]"
      />

      <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        {/* ─────────────────────────────────
            HEADER
        ───────────────────────────────── */}

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <span className="h-px w-10 bg-[#315c45]/50 sm:w-14" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#315c45] sm:text-[11px]">
              Seed Cycling Guide
            </span>

            <span className="h-px w-10 bg-[#315c45]/50 sm:w-14" />
          </motion.div>

          <motion.h2
            id="seed-cycling-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              font-serif
              text-[38px]
              font-medium
              leading-[1.05]
              tracking-[-0.035em]
              text-[#1f3b2d]
              sm:text-5xl
              lg:text-[62px]
            "
          >
            How Seed Cycling Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.65,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-[14px]
              leading-7
              text-[#666d65]
              sm:text-[15px]
              sm:leading-7
            "
          >
            Seed cycling matches the natural rhythm of your menstrual cycle,
            using different seeds in each half to feed your body the exact
            nutrients it needs at the exact right time.
          </motion.p>
        </div>

        {/* ─────────────────────────────────
            CYCLE TIMELINE
        ───────────────────────────────── */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-14 max-w-5xl sm:mt-16"
        >
          <div className="relative grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6">
            {/* Phase 1 Timeline Card */}
            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[24px]
                border
                border-[#d9e2d6]
                bg-white/85
                p-5
                shadow-[0_18px_50px_rgba(35,70,54,0.06)]
                backdrop-blur-sm
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-[0_24px_60px_rgba(35,70,54,0.1)]
                sm:p-6
              "
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-[#315c45]" />

              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#edf2eb]
                    ring-1
                    ring-[#d9e2d6]
                  "
                >
                  <Sun
                    size={23}
                    strokeWidth={1.5}
                    className="text-[#315c45]"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#315c45]">
                    Phase 1
                  </p>

                  <p className="mt-1 text-[15px] font-semibold text-[#234636]">
                    Days 1–14
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#7a8078]">
                    Period → Ovulation
                  </p>
                </div>
              </div>

              <div className="absolute right-5 top-5 text-[#e8ede5]">
                <Sun size={44} strokeWidth={0.8} />
              </div>
            </div>

            {/* Center Connector */}
            <div className="flex justify-center sm:flex-col sm:items-center">
              <div className="hidden h-px w-12 bg-[#cbd6ca] sm:block" />

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#d5ded3]
                  bg-[#f7f5ee]
                  text-[#7e9781]
                "
              >
                <ArrowRight
                  size={15}
                  strokeWidth={1.5}
                  className="hidden sm:block"
                />

                <ArrowDown
                  size={15}
                  strokeWidth={1.5}
                  className="sm:hidden"
                />
              </div>

              <div className="hidden h-px w-12 bg-[#cbd6ca] sm:block" />
            </div>

            {/* Phase 2 Timeline Card */}
            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[24px]
                border
                border-[#d9e2d6]
                bg-white/85
                p-5
                shadow-[0_18px_50px_rgba(35,70,54,0.06)]
                backdrop-blur-sm
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-[0_24px_60px_rgba(35,70,54,0.1)]
                sm:p-6
              "
            >
              <div className="absolute right-0 top-0 h-full w-1 bg-[#8b8066]" />

              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#f0eee6]
                    ring-1
                    ring-[#ded9c9]
                  "
                >
                  <Moon
                    size={23}
                    strokeWidth={1.5}
                    className="text-[#6e6857]"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6e6857]">
                    Phase 2
                  </p>

                  <p className="mt-1 text-[15px] font-semibold text-[#234636]">
                    Days 15–28
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#7a8078]">
                    Ovulation → Period
                  </p>
                </div>
              </div>

              <div className="absolute right-5 top-5 text-[#ebe8dd]">
                <Moon size={42} strokeWidth={0.8} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─────────────────────────────────
            PHASE CARDS
        ───────────────────────────────── */}

        <div className="mt-16 grid gap-7 lg:mt-20 lg:grid-cols-2 lg:gap-8">
          <PhaseCard
            number="01"
            icon={Sun}
            title="Phase 1: Days 1–14"
            subtitle="From period start until ovulation"
            dailyGoal="1 tsp of Phase 1"
            seedLabel="Flax + Pumpkin Seeds"
            points={phaseOnePoints}
            delay={0.1}
          />

          <PhaseCard
            number="02"
            icon={Moon}
            title="Phase 2: Days 15–28"
            subtitle="From ovulation until your next period"
            dailyGoal="1 tsp of Phase 2"
            seedLabel="Sesame + Sunflower Seeds"
            points={phaseTwoPoints}
            delay={0.18}
          />
        </div>

        {/* ─────────────────────────────────
            WHY GROUND SEEDS
        ───────────────────────────────── */}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.7,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            mt-8
            overflow-hidden
            rounded-[30px]
            border
            border-[#d6dfd4]
            bg-[#e8efe6]
            shadow-[0_20px_60px_rgba(35,70,54,0.055)]
          "
        >
          {/* Decorative Background */}
          <div
            aria-hidden="true"
            className="
              absolute
              -right-20
              -top-20
              h-60
              w-60
              rounded-full
              border
              border-[#ccd9ca]
              bg-[#f2f5ee]/60
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              -bottom-24
              -left-20
              h-52
              w-52
              rounded-full
              bg-[#dce7da]/70
              blur-2xl
            "
          />

          <div className="relative grid gap-8 p-7 sm:p-9 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10 lg:p-12">
            {/* Icon */}
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-[20px]
                border
                border-[#cbd8c9]
                bg-[#f6f8f3]
                shadow-[0_8px_25px_rgba(35,70,54,0.06)]
              "
            >
              <Sprout
                size={28}
                strokeWidth={1.4}
                className="text-[#315c45]"
              />
            </div>

            {/* Text */}
            <div className="max-w-4xl">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#315c45]">
                Better Preparation
              </p>

              <h3
                className="
                  font-serif
                  text-[28px]
                  font-medium
                  leading-tight
                  tracking-[-0.025em]
                  text-[#234636]
                  sm:text-3xl
                "
              >
                Why Ground Seeds Work Best
              </h3>

              <p
                className="
                  mt-3
                  max-w-3xl
                  text-[14px]
                  leading-7
                  text-[#626b62]
                  sm:text-[15px]
                "
              >
                Whole seeds often pass through your digestive system
                completely undigested. Grinding the seeds breaks open their
                tough outer shell, unlocking the healthy oils, minerals, and
                vitamins so your stomach can easily absorb every bit of
                nutrition.
              </p>
            </div>

            {/* Decorative Leaf */}
            <div
              aria-hidden="true"
              className="
                hidden
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                border
                border-[#ccd8ca]
                bg-[#f0f4ed]/80
                lg:flex
              "
            >
              <Leaf
                size={39}
                strokeWidth={1}
                className="text-[#8da58e]"
              />
            </div>
          </div>
        </motion.div>

        {/* ─────────────────────────────────
            BOTTOM NOTE
        ───────────────────────────────── */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="mx-auto mt-9 flex max-w-3xl items-center justify-center gap-2.5 text-center"
        >
          <CircleCheck
            size={15}
            strokeWidth={1.7}
            className="shrink-0 text-[#315c45]"
          />

          <p className="text-[11px] leading-5 text-[#7a8078]">
            Seed cycling is a nutritional wellness practice. Individual
            experiences may vary.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────
   PREMIUM PHASE CARD
───────────────────────────────── */

function PhaseCard({
  number,
  icon: Icon,
  title,
  subtitle,
  dailyGoal,
  seedLabel,
  points,
  delay,
}: {
  number: string;
  icon: typeof Sun;
  title: string;
  subtitle: string;
  dailyGoal: string;
  seedLabel: string;
  points: {
    title: string;
    text: string;
  }[];
  delay: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-[#d9ddd4]
        bg-white
        shadow-[0_20px_65px_rgba(35,70,54,0.055)]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:shadow-[0_28px_75px_rgba(35,70,54,0.1)]
      "
    >
      {/* Top Accent */}
      <div className="h-1.5 w-full bg-[#315c45]" />

      {/* Header */}
      <div className="relative px-6 pb-7 pt-7 sm:px-8 sm:pb-8 sm:pt-8 lg:px-9">
        {/* Large Number */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-7
            top-2
            select-none
            font-serif
            text-[100px]
            font-medium
            leading-none
            tracking-[-0.08em]
            text-[#f1f3ed]
            transition-all
            duration-500
            group-hover:text-[#e9eee6]
            sm:right-8
            sm:text-[110px]
          "
        >
          {number}
        </span>

        <div className="relative z-10 flex items-start justify-between gap-5">
          {/* Phase Icon */}
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-[18px]
              bg-[#edf2eb]
              ring-1
              ring-[#d9e2d7]
              shadow-sm
            "
          >
            <Icon
              size={24}
              strokeWidth={1.5}
              className="text-[#315c45]"
            />
          </div>

          {/* Daily Goal */}
          <div
            className="
              rounded-full
              border
              border-[#d8e1d6]
              bg-[#f5f7f2]
              px-3.5
              py-2
              text-[10px]
              font-semibold
              tracking-[0.02em]
              text-[#315c45]
              shadow-sm
            "
          >
            {dailyGoal}
          </div>
        </div>

        <div className="relative z-10 mt-7">
          {/* Seed Label */}
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#315c45]" />

            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#315c45]">
              {seedLabel}
            </p>
          </div>

          <h3
            className="
              mt-3
              font-serif
              text-[29px]
              font-medium
              leading-tight
              tracking-[-0.025em]
              text-[#203d2e]
              sm:text-[32px]
            "
          >
            {title}
          </h3>

          <p className="mt-2.5 text-[13px] leading-6 text-[#777e76] sm:text-sm">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-[#e8e9e2] sm:mx-8 lg:mx-9" />

      {/* Benefit Points */}
      <div className="px-6 py-7 sm:px-8 sm:py-8 lg:px-9 lg:py-9">
        <div className="space-y-7">
          {points.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: delay + index * 0.06,
              }}
              className="group/point flex gap-4"
            >
              {/* Number/Icon */}
              <div className="relative shrink-0">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#dce4d9]
                    bg-[#f1f4ee]
                    transition-all
                    duration-300
                    group-hover/point:border-[#c7d6c5]
                    group-hover/point:bg-[#e8efe6]
                  "
                >
                  <span className="text-[10px] font-bold text-[#315c45]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="min-w-0 pt-0.5">
                <h4
                  className="
                    text-[14px]
                    font-semibold
                    leading-5
                    tracking-[-0.005em]
                    text-[#294234]
                    sm:text-[15px]
                  "
                >
                  {point.title}
                </h4>

                <p
                  className="
                    mt-2
                    text-[13px]
                    leading-[1.75]
                    text-[#737a72]
                    sm:text-[13.5px]
                  "
                >
                  {point.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Luxury Accent */}
      <div
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-0
          h-[3px]
          w-full
          origin-left
          scale-x-0
          bg-[#315c45]
          transition-transform
          duration-500
          group-hover:scale-x-100
        "
      />

      {/* Corner Decorative Circle */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-20
          -right-20
          h-40
          w-40
          rounded-full
          border
          border-[#edf0e9]
          transition-transform
          duration-700
          group-hover:scale-125
        "
      />
    </motion.article>
  );
}