"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, CircleHelp } from "lucide-react";

const faqs = [
  {
    question: "What is seed cycling?",
    answer:
      "Seed cycling is a natural practice where you consume specific seeds during different phases of your menstrual cycle to support hormone balance.",
  },
  {
    question: "What is Seedra?",
    answer:
      "Seedra is a doctor-formulated blend created by Dr. Hira. We take away the hassle of seed cycling by sourcing organic seeds, perfecting the blend ratios, and freshly grinding them into ready-to-use Phase 1 and Phase 2 jars delivered to your door.",
  },
  {
    question: "How do I take Seedra blends?",
    answer:
      "Take 1 spoon daily. You can easily stir it into yogurt, oatmeal, smoothies, warm porridge, or sprinkle it over salads and soups.",
  },
  {
    question: "When do I switch from Phase 1 to Phase 2?",
    answer:
      "Phase 1 (Follicular Support): Take every day from Day 1 of your period until Day 14 (until you ovulate).\n\nPhase 2 (Luteal Support): Take every day from Day 15 until your next period starts.",
  },
  {
    question: "What if my periods are irregular or missing?",
    answer:
      "If you have an irregular or missing cycle, follow the phases of the moon: start Phase 1 on the New Moon for 14 days, then switch to Phase 2 on the Full Moon for 14 days. This helps reset your body's natural cycle rhythm.",
  },
  {
    question: "Why are the seeds ground instead of whole?",
    answer:
      "Whole seeds have a tough outer shell that often passes through your stomach undigested. We freshly grind our seeds in small batches so your body can easily absorb all the essential vitamins, healthy oils, and minerals.",
  },
  {
    question: "How does Seedra help with PCOS?",
    answer:
      "Seedra provides essential nutrients like zinc, magnesium, selenium, and Omega-3 fats that help calm body-wide inflammation, improve insulin sensitivity, reduce hormonal acne, and regulate irregular periods naturally.",
  },
  {
    question: "Can seed cycling help with fertility and conceiving?",
    answer:
      "Yes. By balancing key hormones like estrogen and progesterone, seed cycling supports a healthy womb lining, promotes regular egg release, and prepares your reproductive system for pregnancy.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "Hormones need time to adjust. While many women notice fewer cramps and better mood within 1–2 weeks, it typically takes 2–3 full menstrual cycles (about 60–90 days) of daily consistency to see significant changes in cycle regularity and skin health.",
  },
  {
    question: "Are there any side effects?",
    answer:
      "Seedra is made from 100% natural, food-grade organic seeds. However, because ground seeds are high in natural fiber, you might notice light changes in digestion during the first few days if your body isn't used to fiber.",
  },
  {
    question: "How should I store my Seedra packs?",
    answer:
      "Store your packs in a cool, dry place away from direct sunlight. To preserve the fresh essential oils, airtight the jars tightly or keeping it in the refrigerator after opening is recommended.",
  },
];

export default function FAQ() {
  const leftFAQs = faqs.slice(0, 6);
  const rightFAQs = faqs.slice(6);

  const [leftOpenIndex, setLeftOpenIndex] = useState<number | null>(null);
  const [rightOpenIndex, setRightOpenIndex] = useState<number | null>(null);

  const toggleLeftFAQ = (index: number) => {
    setLeftOpenIndex((current) => (current === index ? null : index));
  };

  const toggleRightFAQ = (index: number) => {
    setRightOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="
        relative
        overflow-hidden
        bg-[#f8f6ef]
        py-24
        sm:py-28
        lg:py-36
      "
    >
      {/* =====================================================
          LUXURY BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-40
          top-10
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#a9bdaa]/10
          blur-[110px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#315c45]/[0.045]
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
          h-[280px]
          w-[280px]
          -translate-x-1/2
          rounded-full
          bg-white/50
          blur-[90px]
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-[1280px]
          px-5
          sm:px-8
          lg:px-10
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mx-auto mb-16 max-w-[850px] text-center sm:mb-20 lg:mb-24">
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
              margin: "-60px",
            }}
            transition={{
              duration: 0.6,
            }}
            className="
              mb-6
              flex
              items-center
              justify-center
              gap-4
            "
          >
            <span className="h-px w-10 bg-[#315c45]/50 sm:w-14" />

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.32em]
                text-[#315c45]
                sm:text-[10px]
              "
            >
              Frequently Asked Questions
            </span>

            <span className="h-px w-10 bg-[#315c45]/50 sm:w-14" />
          </motion.div>

          <motion.h2
            id="faq-heading"
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
              margin: "-60px",
            }}
            transition={{
              duration: 0.75,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              font-serif
              text-[38px]
              leading-[1.08]
              tracking-[-0.035em]
              text-[#234636]
              sm:text-5xl
              lg:text-[64px]
            "
          >
            Everything You Need to Know
          </motion.h2>

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
              duration: 0.65,
              delay: 0.12,
            }}
            className="
              mx-auto
              mt-6
              max-w-[650px]
              text-[13px]
              leading-7
              text-[#747970]
              sm:text-[15px]
            "
          >
            Have questions about seed cycling, Seedra blends, or how to make
            them part of your daily routine? Find simple answers below.
          </motion.p>

          {/* Small decorative mark */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
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
              delay: 0.25,
            }}
            className="
              mx-auto
              mt-8
              h-1
              w-1
              rounded-full
              bg-[#315c45]
            "
          />
        </div>

        {/* =====================================================
            FAQ EDITORIAL AREA
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-x-14
            lg:grid-cols-2
            lg:gap-x-20
          "
        >
          {/* ===================================================
              LEFT
          ==================================================== */}

          <div className="border-t border-[#d8d7ce]">
            {leftFAQs.map((faq, index) => {
              const isOpen = leftOpenIndex === index;

              return (
                <FAQItem
                  key={faq.question}
                  faq={faq}
                  index={index}
                  displayIndex={index + 1}
                  isOpen={isOpen}
                  onToggle={() => toggleLeftFAQ(index)}
                />
              );
            })}
          </div>

          {/* ===================================================
              RIGHT
          ==================================================== */}

          <div className="border-t border-[#d8d7ce]">
            {rightFAQs.map((faq, index) => {
              const isOpen = rightOpenIndex === index;

              return (
                <FAQItem
                  key={faq.question}
                  faq={faq}
                  index={index}
                  displayIndex={index + 7}
                  isOpen={isOpen}
                  onToggle={() => toggleRightFAQ(index)}
                />
              );
            })}
          </div>
        </div>

        {/* =====================================================
            BOTTOM NOTE
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
            margin: "-40px",
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="
            mx-auto
            mt-16
            max-w-[900px]
            border-t
            border-[#d8d7ce]
            pt-7
            sm:mt-20
          "
        >
          <div
            className="
              flex
              items-start
              gap-4
              sm:gap-5
            "
          >
            {/* Icon */}

            <div
              className="
                mt-0.5
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#cfd8cf]
                bg-[#edf2eb]
                text-[#315c45]
              "
            >
              <CircleHelp
                size={16}
                strokeWidth={1.6}
              />
            </div>

            <p
              className="
                max-w-[780px]
                text-[11px]
                leading-6
                text-[#747970]
                sm:text-xs
                sm:leading-6
              "
            >
              Seed cycling is a nutritional wellness practice and individual
              experiences may vary. If you have a medical condition, are
              pregnant, or are taking medication, consult a qualified
              healthcare professional before making changes to your diet or
              wellness routine.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =============================================================
   FAQ ITEM
============================================================= */

function FAQItem({
  faq,
  index,
  displayIndex,
  isOpen,
  onToggle,
}: {
  faq: {
    question: string;
    answer: string;
  };
  index: number;
  displayIndex: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
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
        margin: "-40px",
      }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.045, 0.25),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        group
        border-b
        border-[#d8d7ce]
      "
    >
      {/* =====================================================
          QUESTION
      ====================================================== */}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${displayIndex}`}
        className="
          relative
          flex
          w-full
          items-center
          gap-4
          py-6
          text-left
          outline-none
          sm:py-7
          lg:py-8
        "
      >
        {/* Active accent */}

        <motion.span
          animate={{
            height: isOpen ? 34 : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="
            absolute
            left-0
            top-1/2
            w-px
            -translate-y-1/2
            bg-[#315c45]
          "
        />

        {/* Number */}

        <span
          className={`
            flex
            w-8
            shrink-0
            items-center
            justify-center
            pt-0.5
            font-serif
            text-[11px]
            tracking-[0.08em]
            transition-colors
            duration-300
            sm:w-10
            ${
              isOpen
                ? "text-[#315c45]"
                : "text-[#a4a69f] group-hover:text-[#315c45]"
            }
          `}
        >
          {String(displayIndex).padStart(2, "0")}
        </span>

        {/* Question */}

        <span
          className={`
            min-w-0
            flex-1
            pr-2
            text-[14px]
            font-medium
            leading-6
            transition-colors
            duration-300
            sm:text-[15px]
            lg:text-base
            ${
              isOpen
                ? "text-[#234636]"
                : "text-[#39473f] group-hover:text-[#234636]"
            }
          `}
        >
          {faq.question}
        </span>

        {/* Premium Arrow */}

        <span
          className={`
            relative
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            transition-all
            duration-300
            ${
              isOpen
                ? "border-[#315c45] bg-[#315c45] text-white"
                : "border-[#d7d9d1] bg-transparent text-[#315c45] group-hover:border-[#315c45]"
            }
          `}
        >
          <ChevronDown
            size={16}
            strokeWidth={1.7}
            className={`
              transition-transform
              duration-300
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </span>
      </button>

      {/* =====================================================
          ANSWER
      ====================================================== */}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${displayIndex}`}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.25,
              },
            }}
          >
            <div
              className="
                grid
                grid-cols-[32px_1fr]
                gap-4
                pb-7
                sm:grid-cols-[40px_1fr]
                sm:gap-4
                sm:pb-8
              "
            >
              {/* Empty alignment column */}

              <div />

              {/* Answer content */}

              <div className="max-w-[560px]">
                {faq.answer
                  .split("\n\n")
                  .map(
                    (
                      paragraph: string,
                      paragraphIndex: number
                    ) => (
                      <motion.p
                        key={paragraphIndex}
                        initial={{
                          opacity: 0,
                          y: 6,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.35,
                          delay: paragraphIndex * 0.06,
                        }}
                        className={`
                          text-[13px]
                          leading-7
                          text-[#747970]
                          sm:text-sm
                          sm:leading-7
                          ${
                            paragraphIndex > 0
                              ? "mt-4"
                              : ""
                          }
                        `}
                      >
                        {paragraph}
                      </motion.p>
                    )
                  )}

                {/* Tiny luxury detail */}

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    text-[#315c45]
                  "
                >
                  <span className="h-px w-7 bg-[#315c45]/40" />

                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.6}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}