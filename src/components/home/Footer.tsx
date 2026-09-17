"use client";

import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const shopLinks = [
  { label: "All Seeds", href: "/shop" },
  { label: "Paste Seeds", href: "/shop?category=paste-seeds" },
  { label: "Non-Paste Seeds", href: "/shop?category=non-paste-seeds" },
  { label: "Best Sellers", href: "/shop?sort=best-sellers" },
];

const usefulLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Benefits", href: "/benefits" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

const policyLinks = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

/* Social Icons */

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H8v3h2.4v8h3.1Z" />
    </svg>
  );
}

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
      <circle
        cx="17.5"
        cy="6.5"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function WhatsAppIcon() {
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
      <path d="M20 11.5a8 8 0 0 1-11.8 7.1L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" />
      <path d="M8.5 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.7c.5 1 1.3 1.8 2.3 2.3l.7-.5c.2-.1.4-.1.6 0l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1 .3-1.5.1-1.4-.4-2.8-1.2-4-2.4-1.2-1.2-2-2.6-2.4-4-.2-.5-.1-1.1.1-1.5Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#182f24] text-[#f8f6ef]">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-40 h-[480px] w-[480px] rounded-full bg-[#315c45]/20 blur-[120px]" />

        <div className="absolute -bottom-48 right-[-8%] h-[500px] w-[500px] rounded-full bg-[#8ba894]/[0.07] blur-[130px]" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.025] lg:block" />
      </div>

      {/* Main Footer */}
      <div className="relative border-t border-white/[0.07]">
        <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
          <div className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10 lg:py-24">

            {/* Brand */}
            <div className="max-w-[370px]">
              <Link
                href="/"
                aria-label="Seedra home"
                className="inline-block"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.1] bg-[#315c45] shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
                    <span className="font-serif text-lg text-white">
                      S
                    </span>
                  </span>

                  <div>
                    <span className="block font-serif text-[27px] font-semibold leading-none tracking-[-0.04em] text-[#f8f6ef]">
                      Seedra
                    </span>

                    <span className="mt-1.5 block text-[8px] font-medium uppercase tracking-[0.22em] text-[#9caf9f]">
                      Better Seeds
                    </span>
                  </div>
                </div>
              </Link>

              <p className="mt-7 max-w-[340px] text-sm leading-7 text-[#aab8ad]">
                Carefully selected seeds, thoughtfully prepared for a
                simpler and better growing journey. Discover quality seeds
                made for people who care about what they grow.
              </p>

              {/* Social Icons */}
              <div className="mt-7 flex items-center gap-2.5">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full
                    border border-white/[0.09]
                    bg-white/[0.045]
                    text-[#aebeb2]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-[#8ba894]/40
                    hover:bg-[#315c45]
                    hover:text-white
                  "
                >
                  <FacebookIcon />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full
                    border border-white/[0.09]
                    bg-white/[0.045]
                    text-[#aebeb2]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-[#8ba894]/40
                    hover:bg-[#315c45]
                    hover:text-white
                  "
                >
                  <InstagramIcon />
                </a>

                <a
                  href="#"
                  aria-label="WhatsApp"
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-full
                    border border-white/[0.09]
                    bg-white/[0.045]
                    text-[#aebeb2]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-[#8ba894]/40
                    hover:bg-[#315c45]
                    hover:text-white
                  "
                >
                  <WhatsAppIcon />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dce5de]">
                Shop
              </h2>

              <ul className="mt-6 space-y-3.5">
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-[13px] text-[#9fac9f] transition-colors duration-200 hover:text-[#f8f6ef]"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#9caf9f] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore */}
            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dce5de]">
                Explore
              </h2>

              <ul className="mt-6 space-y-3.5">
                {usefulLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-[13px] text-[#9fac9f] transition-colors duration-200 hover:text-[#f8f6ef]"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#9caf9f] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#dce5de]">
                Information
              </h2>

              <ul className="mt-6 space-y-3.5">
                {policyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-[13px] text-[#9fac9f] transition-colors duration-200 hover:text-[#f8f6ef]"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#9caf9f] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Row */}
          <div className="border-t border-white/[0.08] py-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
                <a
                  href="mailto:hello@seedra.com"
                  className="group flex items-center gap-2.5 text-[11px] text-[#9fac9f] transition-colors hover:text-[#f8f6ef]"
                >
                  <Mail
                    size={14}
                    strokeWidth={1.5}
                    className="text-[#8eaa98] transition-colors group-hover:text-[#c4d3c8]"
                  />
                  hello@seedra.com
                </a>

                <a
                  href="tel:+923000000000"
                  className="group flex items-center gap-2.5 text-[11px] text-[#9fac9f] transition-colors hover:text-[#f8f6ef]"
                >
                  <Phone
                    size={14}
                    strokeWidth={1.5}
                    className="text-[#8eaa98] transition-colors group-hover:text-[#c4d3c8]"
                  />
                  +92 300 0000000
                </a>

                <span className="flex items-center gap-2.5 text-[11px] text-[#9fac9f]">
                  <MapPin
                    size={14}
                    strokeWidth={1.5}
                    className="text-[#8eaa98]"
                  />
                  Pakistan
                </span>
              </div>

              <Link
                href="/contact"
                className="
                  group inline-flex w-fit items-center gap-3
                  rounded-full
                  border border-white/[0.1]
                  bg-white/[0.045]
                  px-5 py-2.5
                  text-[11px] font-semibold
                  text-[#dce5de]
                  transition-all duration-300
                  hover:border-white/[0.18]
                  hover:bg-white/[0.09]
                  hover:text-white
                "
              >
                Get in Touch

                <ArrowRight
                  size={13}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/[0.07] bg-[#12271e]">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p className="text-[10px] text-[#718278]">
            © {new Date().getFullYear()} Seedra. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#718278]">
            <span>Quality Seeds</span>

            <span className="h-1 w-1 rounded-full bg-[#536b5b]" />

            <span>Carefully Packed</span>

            <span className="h-1 w-1 rounded-full bg-[#536b5b]" />

            <span>Nationwide Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}