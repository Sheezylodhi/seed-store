
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Sprout,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const shopLinks = [
  { label: "All Seeds", href: "/shop" },
  { label: "Paste Seeds", href: "/shop?category=paste-seeds" },
  { label: "Non-Paste Seeds", href: "/shop?category=non-paste-seeds" },
  { label: "Best Sellers", href: "/shop?sort=best-sellers" },
];

const usefulLinks = [
  { label: "Our Story", href: "/our-story" },
  { label: "Benefits", href: "/#benefits" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact Us", href: "/contact" },
];

const policyLinks = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const webMashLabsUrl = "https://webmashlabs.com/";

// Replace these with your actual social profile URLs.
const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[17px] w-[17px]">
        <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H8v3h2.4v8h3.1Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-[17px] w-[17px]"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-[17px] w-[17px]"
      >
        <path d="M20 11.5a8 8 0 0 1-11.8 7.1L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" />
        <path d="M8.5 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.7c.5 1 1.3 1.8 2.3 2.3l.7-.5c.2-.1.4-.1.6 0l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1 .3-1.5.1-1.4-.4-2.8-1.2-4-2.4-1.2-1.2-2-2.6-2.4-4-.2-.5-.1-1.1.1-1.5Z" />
      </svg>
    ),
  },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-[13px] leading-6 text-[#aab8ad] transition-colors duration-200 hover:text-[#f8f6ef]"
      >
        <span className="relative">
          {children}
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#b8ce9e] transition-all duration-300 group-hover:w-full" />
        </span>
      </Link>
    </li>
  );
}

export default function Footer() {
   const [mobileOpen, setMobileOpen] = useState(false);
  const handleMobileLinkClick = () => {
    setMobileOpen(false);
  };
  return (
    <footer className="relative overflow-hidden bg-[#182f24] text-[#f8f6ef]">
      {/* Subtle background details */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-44 h-[440px] w-[440px] rounded-full bg-[#315c45]/20 blur-[110px]" />
        <div className="absolute -bottom-52 -right-28 h-[420px] w-[420px] rounded-full bg-[#8ba894]/[0.07] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        {/* Main footer */}
        <div className="grid gap-12 border-b border-white/[0.09] py-14 sm:py-16 lg:grid-cols-[1.45fr_0.8fr_0.9fr_0.9fr] lg:gap-12 lg:py-20">
          {/* Brand */}
          <div className="max-w-[370px]">
                  <Link
  href="/"
  className="group flex items-center gap-3"
  onClick={handleMobileLinkClick}
>
  <div className="relative h-30 w-35 shrink-0 transition-transform duration-300 group-hover:scale-105">
    <Image
      src="/seedra-logo-footer.webp"
      alt="Seedra Logo"
      fill
      sizes="90px"
      className="rounded-full object-contain"
      priority
    />
  </div>
</Link>

            <p className="mt-6 max-w-[340px] text-[13px] leading-7 text-[#b0bdb2]">
              Carefully selected seeds, thoughtfully prepared for a
              simpler and better growing journey. Discover quality seeds
              made for people who care about what they grow.
            </p>

            <div className="mt-7 flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] text-[#b6c4b8] transition duration-300 hover:-translate-y-0.5 hover:border-[#b8ce9e]/50 hover:bg-[#315c45] hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <nav aria-label="Shop links">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e2e9df]">
              Shop
            </h2>
            <ul className="mt-6 space-y-3">
              {shopLinks.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </nav>

          {/* Explore */}
          <nav aria-label="Explore links">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e2e9df]">
              Explore
            </h2>
            <ul className="mt-6 space-y-3">
              {usefulLinks.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </nav>

          {/* Information */}
          <nav aria-label="Policy links">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e2e9df]">
              Information
            </h2>
            <ul className="mt-6 space-y-3">
              {policyLinks.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </nav>
        </div>

        {/* Contact information */}
        <div className="flex flex-col gap-6 border-b border-white/[0.09] py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
            <a
              href="mailto:hello@seedra.com"
              className="group flex items-center gap-2.5 text-xs text-[#aab8ad] transition hover:text-white"
            >
              <Mail
                size={15}
                strokeWidth={1.5}
                className="text-[#b8ce9e]"
              />
              hello@seedra.com
            </a>

            <a
              href="tel:+923000000000"
              className="group flex items-center gap-2.5 text-xs text-[#aab8ad] transition hover:text-white"
            >
              <Phone
                size={15}
                strokeWidth={1.5}
                className="text-[#b8ce9e]"
              />
              +92 300 0000000
            </a>

            <span className="flex items-center gap-2.5 text-xs text-[#aab8ad]">
              <MapPin
                size={15}
                strokeWidth={1.5}
                className="text-[#b8ce9e]"
              />
              Pakistan
            </span>
          </div>

          <Link
            href="/contact"
            className="group inline-flex w-fit items-center gap-3 border-b border-[#78936b] pb-2 text-xs font-semibold text-[#e2e9df] transition hover:border-[#d0dfc3] hover:text-white"
          >
            Get in Touch
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#9aab9e]">
            © {new Date().getFullYear()} Seedra. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-[#9aab9e]">
            <span>Quality Seeds</span>
            <span className="h-1 w-1 rounded-full bg-[#78936b]" />
            <span>Carefully Packed</span>
            <span className="h-1 w-1 rounded-full bg-[#78936b]" />
            <span>Nationwide Delivery</span>
          </div>

          {/* Agency credit */}
          <p className="text-[11px] text-[#9aab9e]">
            Designed &amp; Developed by{" "}
            <a
              href={webMashLabsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#dce8d2] underline decoration-[#78936b]/70 underline-offset-4 transition hover:text-white hover:decoration-[#dce8d2]"
              aria-label="WebMash Labs — website development agency"
            >
              WebMash Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}