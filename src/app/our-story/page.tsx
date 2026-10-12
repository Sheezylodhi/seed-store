
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Heart,
  Leaf,
  ShieldCheck,
  Sprout,
  Sparkles,
  Target,
  Eye,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";

const values = [
  {
    number: "01",
    icon: Leaf,
    title: "Thoughtfully Selected",
    description:
      "Every choice begins with care. We focus on bringing together products that fit naturally into a more thoughtful lifestyle.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Quality Comes First",
    description:
      "We believe quality should never be an afterthought. It guides the way we approach our products, presentation, and customer experience.",
  },
  {
    number: "03",
    icon: Heart,
    title: "Care in Every Detail",
    description:
      "From discovering the right product to making it part of your routine, we want every interaction with SEEDRA to feel considered.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-[#fafbf7] text-[#18372a]">
        {/* HERO */}
        <section className="relative isolate">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(184,206,158,0.25),_transparent_48%)]" />

          <div className="mx-auto grid min-h-[660px] max-w-[1440px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-16 lg:py-20">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dce6d4] bg-white/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#557453] shadow-sm sm:text-xs">
                <Sprout size={15} />
                A little more about us
              </div>

              <h1 className="font-serif text-[clamp(3.3rem,7vw,6.7rem)] leading-[0.98] tracking-[-0.055em] text-[#18372a]">
                Good things
                <br />
                <span className="font-normal italic text-[#6d8b60]">
                  begin with
                </span>
                <br />
                thoughtful choices.
              </h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-[#69756b] sm:text-lg sm:leading-9">
                At SEEDRA by Dr. Hira, we believe a healthier life begins with
                the little things we choose every day. Our story is about
                bringing together quality-focused products with care, purpose,
                and a genuine appreciation for well-being.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#234636] px-7 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(35,70,54,0.17)] transition duration-300 hover:-translate-y-1 hover:bg-[#18372a]"
                >
                  Explore our collection
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#our-beliefs"
                  className="inline-flex items-center gap-2 px-3 py-3 text-sm font-medium text-[#526a54] transition hover:text-[#18372a]"
                >
                  What we believe
                  <ArrowDownRight size={16} />
                </a>
              </div>

              <div className="mt-12 flex items-center gap-4 border-t border-[#e5e9df] pt-6">
                <div className="flex -space-x-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#fafbf7] bg-[#e5eddc] text-[#557453]">
                    <Leaf size={17} />
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#fafbf7] bg-[#f0e8d8] text-[#8a7954]">
                    <Heart size={16} />
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#fafbf7] bg-[#dce8d4] text-[#315c42]">
                    <Sprout size={17} />
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#234636]">
                    Made with intention
                  </p>
                  <p className="mt-1 text-xs text-[#7b867b]">
                    Thoughtful products, a more mindful everyday.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[590px]">
              <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full border border-[#cbd9bf] sm:-right-7 sm:-top-7 sm:h-44 sm:w-44" />
              <div className="absolute -bottom-6 -left-5 h-32 w-32 rounded-full bg-[#e9efdf] sm:-bottom-8 sm:-left-8 sm:h-44 sm:w-44" />

              <div className="relative z-10 overflow-hidden rounded-t-[48%] rounded-b-[25px] border-[7px] border-white shadow-[0_30px_80px_rgba(35,70,54,0.13)] sm:rounded-t-[48%] sm:rounded-b-[30px] sm:border-[10px]">
                <Image
                  src="/images/hero/hero-1.jpeg"
                  alt="Fresh, thoughtfully prepared natural ingredients"
                  width={1200}
                  height={1450}
                  priority
                  className="h-[440px] w-full object-cover sm:h-[570px]"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#142b1d]/55 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-5 right-5 text-white sm:bottom-9 sm:left-8 sm:right-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.27em] text-white/75 sm:text-xs">
                    SEEDRA by Dr. Hira
                  </p>
                  <p className="mt-2 max-w-sm font-serif text-3xl leading-tight sm:text-4xl">
                    A little care can go a long way.
                  </p>
                </div>
              </div>

              <div className="absolute -left-2 top-20 z-20 flex max-w-[190px] items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_15px_40px_rgba(24,55,42,0.12)] backdrop-blur sm:-left-10 sm:top-28">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf3e7] text-[#426746]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#234636]">
                    Quality first
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#7b867b]">
                    Care in every choice
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 right-2 z-20 rounded-2xl border border-[#e7ebdf] bg-white px-5 py-4 shadow-[0_12px_35px_rgba(24,55,42,0.09)] sm:-right-5 sm:bottom-9">
                <p className="font-serif text-2xl italic text-[#315c42]">
                  Grow with care.
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#889184]">
                  The SEEDRA philosophy
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section
          id="our-beliefs"
          className="border-y border-[#e8ece3] bg-white"
        >
          <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20 lg:px-12 lg:py-28">
            <div>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#6d8b60]">
                <span className="h-px w-8 bg-[#9cb48d]" />
                Our story
              </p>

              <h2 className="mt-6 max-w-md font-serif text-4xl leading-[1.13] tracking-[-0.035em] text-[#18372a] sm:text-5xl lg:text-[3.6rem]">
                Wellness starts with the choices we make.
              </h2>

              <div className="mt-8 h-px w-20 bg-[#b8ce9e]" />

              <p className="mt-5 text-sm leading-7 text-[#7b867b]">
                Thoughtfully chosen. Carefully considered. Made for everyday
                life.
              </p>
            </div>

            <div className="space-y-6 text-[15px] leading-8 text-[#687469] sm:text-base sm:leading-9">
              <p>
                At <strong className="font-semibold text-[#234636]">SEEDRA by Dr. Hira</strong>,
                we believe that a healthier life begins with thoughtful
                choices. Whether it is nurturing growth, supporting everyday
                wellness, or discovering products that complement a healthier
                lifestyle, we believe that small steps can make a meaningful
                difference.
              </p>

              <p>
                Our journey is built around bringing together carefully
                selected products that reflect our commitment to quality, care,
                and well-being. From seeds and nutrition to health and wellness
                essentials, our goal is to make it easier for you to discover
                products that support your journey toward a healthier
                lifestyle.
              </p>

              <p>
                We believe that everyone&apos;s journey is unique, and the
                choices we make every day matter. That is why we strive to
                offer products with care, keeping quality, trust, and your
                well-being at the heart of everything we do.
              </p>

              <div className="flex items-center gap-3 border-l-2 border-[#9cb48d] bg-[#f7f9f3] px-5 py-4">
                <Sprout className="shrink-0 text-[#557453]" size={22} />
                <p className="font-serif text-lg italic leading-7 text-[#315c42] sm:text-xl">
                  Better choices do not have to be complicated. They just have
                  to begin somewhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="relative bg-[#f2f5ed]">
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#e4ecd9] blur-3xl" />

          <div className="relative mx-auto max-w-[1280px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6d8b60]">
                What guides us
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.04em] text-[#18372a] sm:text-5xl lg:text-6xl">
                The values behind every choice.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#718071] sm:text-base sm:leading-8">
                A meaningful brand is built on more than products. It is built
                on the principles that shape every decision along the way.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16 lg:gap-6">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <article
                    key={value.number}
                    className="group relative overflow-hidden rounded-[26px] border border-[#e3e9dc] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c7d7ba] hover:shadow-[0_22px_55px_rgba(35,70,54,0.08)] sm:p-9"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3e7] text-[#426746] transition duration-300 group-hover:bg-[#234636] group-hover:text-white">
                        <Icon size={24} strokeWidth={1.6} />
                      </div>

                      <span className="font-serif text-3xl text-[#d9e3d0]">
                        {value.number}
                      </span>
                    </div>

                    <h3 className="mt-8 font-serif text-2xl text-[#234636] sm:text-[1.7rem]">
                      {value.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-[#748074]">
                      {value.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#6d8b60]">
                      <Check size={15} />
                      A principle we stand by
                    </div>

                    <div className="absolute -bottom-12 -right-12 h-28 w-28 rounded-full border border-[#e6ecdf] transition duration-500 group-hover:scale-125" />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* MISSION */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-28">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -left-3 -top-3 h-full w-full rounded-[28px] border border-[#dce6d4] sm:-left-5 sm:-top-5" />

              <div className="relative overflow-hidden rounded-[25px]">
                <Image
                  src="/images/hero/hero-2.jpeg"
                  alt="Natural seeds and fresh plants representing thoughtful growth"
                  width={1200}
                  height={1000}
                  className="h-[350px] w-full object-cover transition duration-700 hover:scale-[1.03] sm:h-[470px]"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#173725]/65 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 sm:bottom-9 sm:left-9">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/75">
                    Our purpose
                  </p>
                  <p className="mt-2 max-w-sm font-serif text-3xl leading-tight text-white sm:text-4xl">
                    Making thoughtful choices feel simple.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf3e7] text-[#426746]">
                <Target size={25} strokeWidth={1.5} />
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-[#6d8b60]">
                What we work towards
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-[1.12] tracking-[-0.04em] text-[#18372a] sm:text-5xl lg:text-[3.7rem]">
                Our Mission
                <br />
                <span className="italic text-[#6d8b60]">
                  Care in every choice.
                </span>
              </h2>

              <p className="mt-7 text-base leading-8 text-[#6e796e]">
                Our mission is to make quality-focused products for growth,
                nutrition, and wellness more accessible to everyone. We aim to
                help people make informed, thoughtful choices by offering
                carefully selected products that complement their everyday
                lives and support their pursuit of well-being.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Make thoughtful product discovery easier.",
                  "Keep quality and care at the heart of our approach.",
                  "Support everyday routines with considered choices.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#edf3e7] text-[#426746]">
                      <Check size={14} />
                    </span>
                    <p className="text-sm leading-6 text-[#526a54]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VISION */}
        <section className="relative overflow-hidden bg-[#18372a] text-white">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/[0.08]" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/[0.08]" />
          <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#315c42]/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1280px] gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20 lg:px-12 lg:py-28">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-[#b8ce9e]">
                <Eye size={26} strokeWidth={1.5} />
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-[#b8ce9e]">
                Where we hope to go
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-[1.12] tracking-[-0.04em] sm:text-5xl lg:text-[3.7rem]">
                Our Vision
                <br />
                <span className="italic text-[#b8ce9e]">
                  Growing with purpose.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/70">
                Our vision is to become a trusted name in seeds, nutrition, and
                wellness by building a brand that people can rely on for
                quality, care, and consistency. We aspire to inspire healthier
                choices, encourage mindful living, and grow alongside our
                community by continuously exploring products that bring value
                to everyday life.
              </p>

              <Link
                href="/shop"
                className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#dce9cf] px-7 py-4 text-sm font-semibold text-[#18372a] transition duration-300 hover:-translate-y-1 hover:bg-white"
              >
                Shop SEEDRA
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[30px] border border-white/10 sm:-inset-6" />

              <div className="relative overflow-hidden rounded-[25px]">
                <Image
                  src="/images/hero/hero-3.jpeg"
                  alt="Green leaves growing in natural light"
                  width={1200}
                  height={1100}
                  className="h-[360px] w-full object-cover sm:h-[480px]"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#10291d]/75 via-transparent to-[#10291d]/10" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                    <Sprout size={21} className="text-[#dce9cf]" />
                  </div>
                  <p className="max-w-md font-serif text-3xl leading-tight sm:text-4xl">
                    A healthier lifestyle, one thoughtful step at a time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRAND PROMISE */}
        <section className="bg-[#f7f9f3]">
          <div className="mx-auto max-w-[1050px] px-5 py-20 text-center sm:px-8 sm:py-28">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#dce6d4] bg-white text-[#557453] shadow-sm">
              <Sprout size={29} strokeWidth={1.4} />
            </div>

            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6d8b60] sm:text-xs">
              A note from SEEDRA
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl font-serif text-4xl leading-[1.12] tracking-[-0.045em] text-[#18372a] sm:text-5xl lg:text-7xl">
              Thoughtful choices
              <br />
              <span className="italic text-[#6d8b60]">
                for a healthier you.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#718071] sm:text-base sm:leading-8">
              Every journey looks a little different. We are here to make
              discovering products for your everyday wellness feel a little
              simpler, a little more considered, and a little more personal.
            </p>

            <div className="mx-auto mt-8 h-px w-16 bg-[#b8ce9e]" />

            <p className="mt-7 font-serif text-2xl italic text-[#315c42] sm:text-3xl">
              SEEDRA by Dr. Hira
            </p>

            <Link
              href="/shop"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#234636] px-8 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(35,70,54,0.15)] transition duration-300 hover:-translate-y-1 hover:bg-[#18372a]"
            >
              Find your next favourite
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}