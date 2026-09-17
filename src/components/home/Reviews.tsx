"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useState } from "react";

type Review = {
  text: string;
  name: string;
  tag: string;
};

const reviews: Review[] = [
  {
    text: "Seedra use kartay hue 2 mahine ho gaye hain, mere periods regular ho gaye hain aur cramps bhi pehle se bohot kam hain.",
    name: "Seedra Customer",
    tag: "Cycle Care",
  },
  {
    text: "Dr. Hira ka shukriya! Pehle seeds ko daily grind karna bohot mushkil tha, lekin yeh tayar blend bohot easy aur convenient hai.",
    name: "Seedra Customer",
    tag: "Easy Routine",
  },
  {
    text: "Meri PCOS ki wajah se face par acne thi, Phase 1 aur Phase 2 blend lene ke baad skin bohot saaf ho gayi hai.",
    name: "Seedra Customer",
    tag: "Daily Wellness",
  },
  {
    text: "Best product for PCOS! Taste bhi bohot acha hai, main daily subah yogurt mein mix karke leti hoon.",
    name: "Seedra Customer",
    tag: "Easy To Use",
  },
  {
    text: "Pehle PMS ke dauran bohot mood swings aur severe bloating hoti thi, ab kafi relax feel karti hoon.",
    name: "Seedra Customer",
    tag: "PMS Support",
  },
  {
    text: "Infertility issue ki wajah se doctor ne seed cycling recommend ki thi. Seedra ne kaam bohot aasan kar diya hai.",
    name: "Seedra Customer",
    tag: "Seed Cycling",
  },
  {
    text: "Bohat hi zabardast product hai. Taste natural hai aur 1st month mein hi results nazar aana shuru ho gaye hain.",
    name: "Seedra Customer",
    tag: "Daily Routine",
  },
  {
    text: "Mujhe periods ki dates hamesha delay hoti thin, lekin ab 2 months se bilkul exact time par aa rahe hain.",
    name: "Seedra Customer",
    tag: "Cycle Care",
  },
  {
    text: "Grinding aur daily proportion ka tension khatam hogya! Packaging bohot achi hai aur product fresh hoti hai. Recommended.",
    name: "Seedra Customer",
    tag: "Product Quality",
  },
  {
    text: "Seedra ke use se meri daily energy levels bohot improve hui hain, ab din bhar thakawat nahi hoti.",
    name: "Seedra Customer",
    tag: "Daily Wellness",
  },
  {
    text: "Period pain ke liye pehle har bar painkiller leni padti thi, ab bina tablet ke pain manage ho jata hai.",
    name: "Seedra Customer",
    tag: "Period Care",
  },
  {
    text: "Pure natural ingredients hain, koi side effect nahi hua. Har ladki ko PCOS ke liye try karna chahiye.",
    name: "Seedra Customer",
    tag: "Natural Ingredients",
  },
  {
    text: "Mera weight management aur bloating bohot bahtar ho gaya hai. Phase 2 blend bohot soothing hai.",
    name: "Seedra Customer",
    tag: "Phase 2",
  },
  {
    text: "Dr. Hira ki formulation sach mein kaam karti hai. Meri irregular cycle ab regular rhythm mein aa gayi hai.",
    name: "Seedra Customer",
    tag: "Cycle Care",
  },
  {
    text: "Quality top class hai! Packaging open karte hi fresh seeds ki khushbu aati hai.",
    name: "Seedra Customer",
    tag: "Product Quality",
  },
  {
    text: "PCOS symptoms jaise hair fall aur facial hair kafi hadd tak control ho gaye hain. Strongly recommended!",
    name: "Seedra Customer",
    tag: "Daily Wellness",
  },
  {
    text: "Conceive karne ke liye try kar rahi thi, seed cycling se hormone balance hue aur results bohot positive hain ..lets hope for the best",
    name: "Seedra Customer",
    tag: "Seed Cycling",
  },
  {
    text: "Acha aur authentic product hai. Price bhi result ke hisab se bilkul reasonable hai.",
    name: "Seedra Customer",
    tag: "Product Quality",
  },
  {
    text: "Main ise roz morning smoothie mein dalti hoon. Simple, healthy aur hassle-free routine ban gaya hai.",
    name: "Seedra Customer",
    tag: "Easy Routine",
  },
  {
    text: "Seedra ne meri life aasan kar di. Ab mujhe roz seed ratios measure karne ki zaroorat nahi padti.",
    name: "Seedra Customer",
    tag: "Easy Routine",
  },
];

export default function Reviews() {
  const [isPaused, setIsPaused] = useState(false);

  /*
   * Two separate rows.
   * This keeps the reviews staggered so the same cards
   * don't appear beside each other in both rows.
   */
  const rowOne: Review[] = reviews.filter(
    (_review: Review, index: number) => index % 2 === 0
  );

  const rowTwo: Review[] = reviews.filter(
    (_review: Review, index: number) => index % 2 !== 0
  );

  /*
   * Duplicate both rows for a seamless infinite loop.
   */
  const rowOneLoop: Review[] = [...rowOne, ...rowOne];
  const rowTwoLoop: Review[] = [...rowTwo, ...rowTwo];

  const pauseSlider = () => {
    setIsPaused(true);
  };

  const resumeSlider = () => {
    setIsPaused(false);
  };

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="
        relative
        overflow-hidden
        bg-[#f8f6ef]
        py-20
        sm:py-24
        lg:py-28
      "
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-40
          top-20
          h-80
          w-80
          rounded-full
          bg-[#e8eee5]
          opacity-50
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-10
          h-80
          w-80
          rounded-full
          bg-[#eee9dd]
          opacity-60
          blur-3xl
        "
      />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">

          {/* Eyebrow */}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              margin: "-70px",
            }}
            transition={{
              duration: 0.55,
            }}
            className="
              mb-5
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span className="h-px w-8 bg-[#315c45]" />

            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-[#315c45]
              "
            >
              Customer Reviews
            </span>

            <span className="h-px w-8 bg-[#315c45]" />
          </motion.div>

          {/* Heading */}

          <motion.h2
            id="reviews-heading"
            initial={{
              opacity: 0,
              y: 18,
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
              delay: 0.05,
            }}
            className="
              font-serif
              text-3xl
              font-medium
              leading-[1.12]
              tracking-[-0.025em]
              text-[#234636]
              sm:text-4xl
              lg:text-[48px]
            "
          >
            Loved by Women
            <br />

            <span className="text-[#6f806f]">
              on Their Wellness Journey
            </span>
          </motion.h2>

          {/* Description */}

          <motion.p
            initial={{
              opacity: 0,
              y: 14,
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
              duration: 0.6,
              delay: 0.12,
            }}
            className="
              mx-auto
              mt-5
              max-w-xl
              text-sm
              leading-7
              text-[#747970]
              sm:text-[15px]
            "
          >
            See what customers are saying about making seed cycling a
            simpler part of their daily routine.
          </motion.p>
        </div>

        {/* =====================================================
            RATING SUMMARY
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="
            mx-auto
            mt-8
            flex
            w-fit
            items-center
            gap-3
            rounded-full
            border
            border-[#dce3d9]
            bg-white/80
            px-5
            py-3
            shadow-sm
          "
        >
          {/* Real filled stars */}

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map(
              (_star: unknown, index: number) => (
                <Star
                  key={index}
                  size={18}
                  strokeWidth={1.2}
                  fill="currentColor"
                  className="text-[#315c45]"
                />
              )
            )}
          </div>

          <span className="h-5 w-px bg-[#d3dbd1]" />

          <span
            className="
              text-[11px]
              font-semibold
              tracking-wide
              text-[#526055]
            "
          >
            Customer Experiences
          </span>
        </motion.div>
      </div>

      {/* =====================================================
          TWO ROW INFINITE SLIDER
      ====================================================== */}

      <div
        className="
          relative
          mt-12
          sm:mt-14
          lg:mt-16
        "
        onMouseEnter={pauseSlider}
        onMouseLeave={resumeSlider}
      >

        {/* =================================================
            LEFT FADE
        ================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            z-20
            h-full
            w-12
            bg-gradient-to-r
            from-[#f8f6ef]
            to-transparent
            sm:w-24
            lg:w-40
          "
        />

        {/* =================================================
            RIGHT FADE
        ================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            z-20
            h-full
            w-12
            bg-gradient-to-l
            from-[#f8f6ef]
            to-transparent
            sm:w-24
            lg:w-40
          "
        />

        {/* =================================================
            ROW 1
        ================================================== */}

        <ReviewSliderRow
          reviews={rowOneLoop}
          duration={75}
          isPaused={isPaused}
          onCardEnter={pauseSlider}
          onCardLeave={resumeSlider}
        />

        {/* =================================================
            ROW 2
        ================================================== */}

        <div className="mt-4 sm:mt-5">
          <ReviewSliderRow
            reviews={rowTwoLoop}
            duration={85}
            isPaused={isPaused}
            onCardEnter={pauseSlider}
            onCardLeave={resumeSlider}
          />
        </div>
      </div>

      {/* =====================================================
          PAUSED INDICATOR
      ====================================================== */}

      <motion.div
        animate={{
          opacity: isPaused ? 1 : 0,
          y: isPaused ? 0 : 4,
        }}
        transition={{
          duration: 0.2,
        }}
        className="
          pointer-events-none
          mt-5
          flex
          h-5
          items-center
          justify-center
          gap-2
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#315c45]" />

        <span
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-[#747970]
          "
        >
          Slider Paused
        </span>
      </motion.div>

      {/* =====================================================
          DISCLAIMER
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[1380px]
          px-5
          sm:px-8
          lg:px-10
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="
            mx-auto
            mt-10
            max-w-2xl
            border-t
            border-[#e2dfd7]
            pt-6
            text-center
          "
        >
          <p
            className="
              text-[10px]
              leading-5
              text-[#858b84]
              sm:text-[11px]
            "
          >
            Customer experiences are individual and may vary. These
            testimonials reflect personal experiences and are not a substitute
            for professional medical advice.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   INFINITE SLIDER ROW
========================================================= */

function ReviewSliderRow({
  reviews,
  duration,
  isPaused,
  onCardEnter,
  onCardLeave,
}: {
  reviews: Review[];
  duration: number;
  isPaused: boolean;
  onCardEnter: () => void;
  onCardLeave: () => void;
}) {
  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="
          flex
          w-max
          gap-4
          px-3
          py-3
          will-change-transform
          sm:gap-5
          sm:px-5
          lg:gap-6
          lg:px-8
        "
        animate={
          isPaused
            ? {
                x: undefined,
              }
            : {
                x: ["0%", "-50%"],
              }
        }
        transition={{
          x: {
            duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          },
        }}
      >
        {reviews.map(
          (review: Review, index: number) => (
            <ReviewCard
              key={`${review.text}-${index}`}
              review={review}
              onMouseEnter={onCardEnter}
              onMouseLeave={onCardLeave}
            />
          )
        )}
      </motion.div>
    </div>
  );
}

/* =========================================================
   REVIEW CARD
========================================================= */

function ReviewCard({
  review,
  onMouseEnter,
  onMouseLeave,
}: {
  review: Review;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="
        group
        relative
        flex
        min-h-[300px]
        w-[290px]
        shrink-0
        flex-col
        rounded-[24px]
        border
        border-[#dfe2da]
        bg-white
        p-6
        shadow-[0_10px_35px_rgba(35,70,54,0.045)]
        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-[#cbd7c9]
        hover:shadow-[0_18px_45px_rgba(35,70,54,0.09)]

        sm:min-h-[315px]
        sm:w-[360px]
        sm:p-7

        lg:min-h-[325px]
        lg:w-[400px]
        lg:p-8
      "
    >
      {/* =================================================
          TOP
      ================================================== */}

      <div className="flex items-start justify-between gap-4">

        {/* Quote icon */}

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#edf2eb]
            transition-all
            duration-300
            group-hover:bg-[#e4ede2]
          "
        >
          <Quote
            size={19}
            strokeWidth={1.4}
            className="text-[#315c45]"
          />
        </div>

        {/* Review tag */}

        <span
          className="
            max-w-[150px]
            rounded-full
            border
            border-[#dce4d9]
            bg-[#f6f8f4]
            px-3
            py-1.5
            text-right
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.06em]
            text-[#526055]
          "
        >
          {review.tag}
        </span>
      </div>

      {/* =================================================
          STARS
      ================================================== */}

      <div className="mt-5 flex items-center gap-1">
        {Array.from({ length: 5 }).map(
          (_star: unknown, index: number) => (
            <Star
              key={index}
              size={19}
              strokeWidth={1.1}
              fill="currentColor"
              className="
                text-[#315c45]
                transition-transform
                duration-300
                group-hover:scale-105
              "
            />
          )
        )}
      </div>

      {/* =================================================
          REVIEW TEXT
      ================================================== */}

      <p
        className="
          mt-5
          flex-1
          text-[13px]
          leading-6
          text-[#5f675f]
          sm:text-[14px]
          sm:leading-[1.75]
        "
      >
        “{review.text}”
      </p>

      {/* =================================================
          CUSTOMER
      ================================================== */}

      <div
        className="
          mt-6
          flex
          items-center
          gap-3
          border-t
          border-[#e9e8e1]
          pt-5
        "
      >
        {/* Avatar */}

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#315c45]
            font-serif
            text-sm
            font-medium
            text-white
          "
        >
          S
        </div>

        {/* Customer info */}

        <div>
          <p
            className="
              text-xs
              font-semibold
              text-[#2d4033]
            "
          >
            {review.name}
          </p>

          <p
            className="
              mt-0.5
              text-[10px]
              text-[#8a9088]
            "
          >
            Customer Experience
          </p>
        </div>
      </div>

      {/* =================================================
          HOVER ACCENT
      ================================================== */}

      <span
        aria-hidden="true"
        className="
          absolute
          bottom-0
          left-6
          right-6
          h-0.5
          origin-left
          scale-x-0
          rounded-full
          bg-[#315c45]
          transition-transform
          duration-300
          group-hover:scale-x-100
        "
      />
    </article>
  );
}