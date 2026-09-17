"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Mail,
  ShieldCheck,
  Truck,
  Leaf,
} from "lucide-react";

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
    setEmail("");
  };

  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-heading"
      className="
        relative
        isolate
        min-h-[760px]
        overflow-hidden
        bg-[#173528]
        py-24
        sm:py-28
        lg:min-h-[820px]
        lg:py-32
      "
    >
      {/* =========================================================
          BACKGROUND VIDEO
          
          Put your video here:
          /public/videos/final-cta.mp4
      ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
      >
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

      {/* =========================================================
          CINEMATIC VIDEO OVERLAYS
      ========================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-[#10271d]/55
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-gradient-to-b
          from-[#10271d]/85
          via-[#173528]/55
          to-[#10271d]/90
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-gradient-to-r
          from-[#10271d]/80
          via-transparent
          to-[#10271d]/75
        "
      />

      {/* Soft center glow */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -z-10
          h-[500px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#a9bdaa]/10
          blur-[130px]
        "
      />

      {/* =========================================================
          LUXURY FRAME
      ========================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-4
          rounded-[28px]
          border
          border-white/[0.08]
          sm:inset-6
          sm:rounded-[34px]
          lg:inset-8
        "
      />

      {/* Corner details */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-8
          top-8
          h-10
          w-10
          border-l
          border-t
          border-[#c9d7c9]/25
          sm:left-12
          sm:top-12
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-8
          top-8
          h-10
          w-10
          border-r
          border-t
          border-[#c9d7c9]/25
          sm:right-12
          sm:top-12
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-8
          left-8
          h-10
          w-10
          border-b
          border-l
          border-[#c9d7c9]/25
          sm:bottom-12
          sm:left-12
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-8
          right-8
          h-10
          w-10
          border-b
          border-r
          border-[#c9d7c9]/25
          sm:bottom-12
          sm:right-12
        "
      />

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div
        className="
          relative
          mx-auto
          flex
          min-h-[700px]
          max-w-[1180px]
          flex-col
          justify-center
          px-8
          sm:px-12
          lg:min-h-[740px]
          lg:px-16
        "
      >
        {/* =======================================================
            MAIN HERO
        ======================================================== */}

        <div className="mx-auto max-w-[900px] text-center">
          {/* Eyebrow */}

          <motion.div
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
              margin: "-60px",
            }}
            transition={{
              duration: 0.7,
            }}
            className="
              mb-7
              flex
              items-center
              justify-center
              gap-4
            "
          >
            <span className="h-px w-10 bg-[#a9bdaa]/70 sm:w-16" />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.34em]
                text-[#d2ddd3]
                sm:text-[10px]
              "
            >
              Start Your Seed Journey
            </span>

            <span className="h-px w-10 bg-[#a9bdaa]/70 sm:w-16" />
          </motion.div>

          {/* Small mark */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
              delay: 0.08,
            }}
            className="
              mx-auto
              mb-6
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[#c9d7c9]/25
              bg-white/[0.04]
            "
          >
            <Leaf
              size={14}
              strokeWidth={1.3}
              className="text-[#c9d7c9]"
            />
          </motion.div>

          {/* Heading */}

          <motion.h2
            id="final-cta-heading"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: "-60px",
            }}
            transition={{
              duration: 0.8,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              font-serif
              text-[42px]
              leading-[1.02]
              tracking-[-0.045em]
              text-white
              sm:text-[58px]
              lg:text-[76px]
            "
          >
            Better Seeds.
            <br />
            <span className="text-[#c9d7c9]">
              A Better Way to Grow.
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
              margin: "-60px",
            }}
            transition={{
              duration: 0.7,
              delay: 0.18,
            }}
            className="
              mx-auto
              mt-7
              max-w-[620px]
              text-[13px]
              leading-7
              text-[#d0d9d2]
              sm:text-[15px]
              sm:leading-7
            "
          >
            Discover carefully selected seeds and make quality part of your
            growing journey. Simple choices, thoughtfully prepared.
          </motion.p>

          {/* =====================================================
              CTA BUTTONS
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: "-60px",
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
            }}
            className="
              mt-9
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:flex-row
            "
          >
            <a
              href="/shop"
              className="
                group
                inline-flex
                min-w-[155px]
                items-center
                justify-center
                gap-3
                rounded-full
                bg-[#f5f6f1]
                px-7
                py-4
                text-[11px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-[#234636]
                shadow-[0_16px_45px_rgba(0,0,0,0.18)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
                hover:shadow-[0_20px_55px_rgba(0,0,0,0.24)]
              "
            >
              Shop Seeds

              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-[#234636]
                  text-white
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                "
              >
                <ArrowRight
                  size={13}
                  strokeWidth={2}
                />
              </span>
            </a>

            <a
              href="#faq"
              className="
                inline-flex
                min-w-[155px]
                items-center
                justify-center
                rounded-full
                border
                border-white/25
                bg-white/[0.035]
                px-7
                py-4
                text-[11px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-white
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-white/45
                hover:bg-white/[0.08]
              "
            >
              Have Questions?
            </a>
          </motion.div>
        </div>

        {/* =======================================================
            NEWSLETTER
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-50px",
          }}
          transition={{
            duration: 0.7,
            delay: 0.3,
          }}
          className="
            mx-auto
            mt-16
            w-full
            max-w-[850px]
            border-t
            border-white/15
            pt-6
            sm:mt-20
            sm:pt-7
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:gap-8
            "
          >
            {/* Newsletter intro */}

            <div className="flex items-center gap-3.5">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/15
                  bg-white/[0.05]
                "
              >
                <Mail
                  size={17}
                  strokeWidth={1.5}
                  className="text-[#c9d7c9]"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  Stay in the loop
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-[#b6c3b9]">
                  Get helpful growing tips, product updates and special offers.
                </p>
              </div>
            </div>

            {/* Newsletter form */}

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="
                  flex
                  w-full
                  flex-col
                  gap-2
                  sm:max-w-[390px]
                  sm:flex-row
                "
              >
                <label
                  htmlFor="newsletter-email"
                  className="sr-only"
                >
                  Email address
                </label>

                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="
                    min-w-0
                    flex-1
                    rounded-full
                    border
                    border-white/15
                    bg-black/10
                    px-5
                    py-3.5
                    text-xs
                    text-white
                    outline-none
                    backdrop-blur-sm
                    placeholder:text-[#91a197]
                    transition-all
                    duration-300
                    focus:border-[#c9d7c9]/60
                    focus:bg-black/15
                  "
                />

                <button
                  type="submit"
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#a9bdaa]
                    px-5
                    py-3.5
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.06em]
                    text-[#234636]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#c9d7c9]
                  "
                >
                  Subscribe

                  <ArrowRight
                    size={14}
                    strokeWidth={1.8}
                  />
                </button>
              </form>
            ) : (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="
                  flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-[#a9bdaa]/20
                  bg-[#a9bdaa]/10
                  px-5
                  py-3
                "
              >
                <span
                  className="
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-[#a9bdaa]
                  "
                >
                  <Check
                    size={12}
                    strokeWidth={2.5}
                    className="text-[#234636]"
                  />
                </span>

                <span className="text-xs font-medium text-[#d2ddd3]">
                  You're on the list. Thank you!
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* =======================================================
            TRUST ROW
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-40px",
          }}
          transition={{
            duration: 0.6,
            delay: 0.38,
          }}
          className="
            mt-9
            flex
            flex-col
            items-center
            justify-center
            gap-4
            sm:flex-row
            sm:gap-7
            lg:gap-9
          "
        >
          {/* Carefully Selected */}

          <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.08em] text-[#b6c3b9]">
            <Leaf
              size={13}
              strokeWidth={1.4}
              className="text-[#a9bdaa]"
            />
            Carefully Selected
          </div>

          <span className="hidden h-3 w-px bg-white/15 sm:block" />

          {/* Delivery */}

          <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.08em] text-[#b6c3b9]">
            <Truck
              size={13}
              strokeWidth={1.4}
              className="text-[#a9bdaa]"
            />
            Nationwide Delivery
          </div>

          <span className="hidden h-3 w-px bg-white/15 sm:block" />

          {/* Quality */}

          <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.08em] text-[#b6c3b9]">
            <ShieldCheck
              size={13}
              strokeWidth={1.4}
              className="text-[#a9bdaa]"
            />
            Quality Focused
          </div>
        </motion.div>
      </div>

      {/* =========================================================
          TOP / BOTTOM CINEMATIC FADES
      ========================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-24
          bg-gradient-to-b
          from-[#10271d]/50
          to-transparent
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-28
          bg-gradient-to-t
          from-[#10271d]/65
          to-transparent
        "
      />
    </section>
  );
}