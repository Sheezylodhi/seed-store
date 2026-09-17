"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  ShoppingBag,
  UserRound,
  X,
  ArrowUpRight,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Our Story",
    href: "/our-story",
  },
  {
    label: "Benefits",
    href: "/#benefits",
  },
  {
    label: "How It Works",
    href: "/#how-it-works",
  },
  {
    label: "Reviews",
    href: "/#reviews",
  },
  {
    label: "FAQ",
    href: "/#faq",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const { openCart, totalItems } = useCart();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const response = await fetch(
          "/api/account/profile",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!mounted) return;

        setIsLoggedIn(response.ok);
      } catch {
        if (!mounted) return;

        setIsLoggedIn(false);
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const handleMobileLinkClick = () => {
    setMobileOpen(false);
  };

  const handleMobileCartClick = () => {
    setMobileOpen(false);
    openCart();
  };

  return (
    <>
      {/* =========================================================
          ANNOUNCEMENT BAR
      ========================================================= */}
      <div className="relative z-[60] overflow-hidden bg-[#234636]">
        <div className="mx-auto flex min-h-[34px] max-w-[1380px] items-center justify-center px-4">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-white">
            FREE DELIVERY
          </p>
        </div>
      </div>

      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-[#10291d]/8 bg-[#fafcf9]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[76px] items-center justify-between">

            {/* =====================================================
                LOGO
            ===================================================== */}
            <Link
              href="/"
              className="group flex items-center gap-3"
              onClick={handleMobileLinkClick}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10291d] transition-transform duration-300 group-hover:scale-105">
                <span className="text-[15px] font-semibold tracking-[-0.04em] text-white">
                  S
                </span>
              </div>

              <div className="leading-none">
                <div className="text-[18px] font-semibold tracking-[-0.04em] text-[#10291d]">
                  Seedra
                </div>

                <div className="mt-1 text-[8px] font-medium uppercase tracking-[0.28em] text-[#10291d]/50">
                  Better Seeds
                </div>
              </div>
            </Link>

            {/* =====================================================
                DESKTOP NAVIGATION
            ===================================================== */}
            <nav className="hidden items-center gap-7 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative text-[12px] font-medium text-[#10291d]/65 transition-colors duration-300 hover:text-[#10291d]"
                >
                  {item.label}

                  <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#10291d] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* =====================================================
                DESKTOP ACTIONS
            ===================================================== */}
            <div className="hidden items-center gap-2 lg:flex">

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-[#10291d]/10 text-[#10291d]/70 transition-all duration-300 hover:border-[#10291d]/20 hover:bg-[#edf3e9] hover:text-[#10291d]"
              >
                <Heart
                  size={17}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </Link>

              {/* Account */}
              

              {/* ===================================================
                  AUTH ACTIONS
              =================================================== */}
              {!checkingAuth && (
                <>
                  {!isLoggedIn ? (
                    <>
                      {/* Login */}
                      <Link
                        href="/login"
                        className="ml-1 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#10291d]/70 transition-colors duration-300 hover:text-[#10291d]"
                      >
                        Login
                      </Link>

                      {/* Register */}
                      <Link
                        href="/register"
                        className="group flex h-10 items-center gap-2 rounded-full bg-[#10291d] px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#234636]"
                      >
                        Create Account

                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.8}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    </>
                  ) : (
                    /* Logged-in Account */
                    <Link
                      href="/account"
                      className="ml-1 flex h-10 items-center gap-2 rounded-full bg-[#edf3e9] px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#10291d] transition-all duration-300 hover:bg-[#dfeadf]"
                    >
                      <UserRound
                        size={14}
                        strokeWidth={1.8}
                      />

                      Account
                    </Link>
                  )}
                </>
              )}

              {/* Cart */}
              <button
                type="button"
                onClick={openCart}
                aria-label="Open shopping cart"
                className="group relative ml-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#edf3e9] text-[#10291d] transition-all duration-300 hover:bg-[#dfeadf]"
              >
                <ShoppingBag
                  size={18}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#10291d] px-1 text-[9px] font-bold text-white ring-2 ring-[#fafcf9]">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* =====================================================
                MOBILE ACTIONS
            ===================================================== */}
            <div className="flex items-center gap-2 lg:hidden">

              {/* Mobile Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#10291d]/10 text-[#10291d]"
              >
                <Heart
                  size={17}
                  strokeWidth={1.7}
                />
              </Link>

              {/* Mobile Cart */}
              <button
                type="button"
                onClick={openCart}
                aria-label="Open shopping cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#edf3e9] text-[#10291d]"
              >
                <ShoppingBag
                  size={17}
                  strokeWidth={1.8}
                />

                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#10291d] px-1 text-[8px] font-bold text-white ring-2 ring-[#fafcf9]">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu */}
              <button
                type="button"
                onClick={() =>
                  setMobileOpen((current) => !current)
                }
                aria-label={
                  mobileOpen
                    ? "Close menu"
                    : "Open menu"
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10291d] text-white"
              >
                {mobileOpen ? (
                  <X
                    size={19}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Menu
                    size={19}
                    strokeWidth={1.8}
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
            MOBILE MENU
        ========================================================= */}
        <div
          className={`overflow-hidden border-t border-[#10291d]/8 bg-[#fafcf9] transition-all duration-500 lg:hidden ${
            mobileOpen
              ? "max-h-[760px] opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-[1380px] px-5 pb-7 pt-5">

            {/* Navigation */}
            <nav className="divide-y divide-[#10291d]/8">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleMobileLinkClick}
                  className="flex items-center justify-between py-4 text-[14px] font-medium text-[#10291d]"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[9px] font-semibold tracking-[0.15em] text-[#10291d]/30">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    {item.label}
                  </span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.7}
                    className="text-[#10291d]/40"
                  />
                </Link>
              ))}
            </nav>

            {/* =====================================================
                MOBILE AUTH ACTIONS
            ===================================================== */}
            {!checkingAuth && (
              <>
                {!isLoggedIn ? (
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={handleMobileLinkClick}
                      className="flex h-12 items-center justify-center rounded-full border border-[#10291d]/12 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#10291d]"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={handleMobileLinkClick}
                      className="flex h-12 items-center justify-center rounded-full bg-[#10291d] text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
                    >
                      Create Account
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/account"
                    onClick={handleMobileLinkClick}
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#10291d] text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
                  >
                    <UserRound
                      size={15}
                      strokeWidth={1.7}
                    />

                    Account
                  </Link>
                )}
              </>
            )}

            {/* =====================================================
                MOBILE UTILITY ACTIONS
            ===================================================== */}
            <div className="mt-3 grid grid-cols-2 gap-3">
            

              <Link
                href="/wishlist"
                onClick={handleMobileLinkClick}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#edf3e9] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#10291d]"
              >
                <Heart
                  size={15}
                  strokeWidth={1.7}
                />

                Wishlist
              </Link>
            </div>

            {/* Mobile Cart */}
            <button
              type="button"
              onClick={handleMobileCartClick}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#10291d]/12 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#10291d]"
            >
              <ShoppingBag
                size={15}
                strokeWidth={1.7}
              />

              Cart

              {totalItems > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#10291d] px-1.5 text-[9px] font-bold text-white">
                  {totalItems > 99
                    ? "99+"
                    : totalItems}
                </span>
              )}
            </button>

            {/* Mobile Brand Note */}
            <div className="mt-7 border-t border-[#10291d]/8 pt-5">
              <p className="max-w-[320px] text-[11px] leading-5 text-[#10291d]/45">
                Better seeds for better routines, healthier
                growth, and a more rewarding gardening
                experience.
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}