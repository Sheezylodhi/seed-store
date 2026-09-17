"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Boxes,
  ChevronRight,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  Users,
  X,
  Leaf,
  Loader2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Store",
    items: [
      {
        name: "Products",
        href: "/admin/products",
        icon: ShoppingBag,
      },
      {
        name: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
      {
        name: "Orders",
        href: "/admin/orders",
        icon: ClipboardList,
      },
      {
        name: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
    ],
  },
  {
    label: "Engagement",
    items: [
      {
        name: "Reviews",
        href: "/admin/reviews",
        icon: Star,
      },
      {
        name: "Coupons",
        href: "/admin/coupons",
        icon: Tag,
      },
      {
        name: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
      },
    ],
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({
  open,
  onClose,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        router.replace("/login");
        router.refresh();
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT_ERROR:", error);

      router.replace("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* =========================
          MOBILE BACKDROP
      ========================== */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-[#050d08]/70
            backdrop-blur-[5px]
            lg:hidden
          "
        />
      )}

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[294px] flex-col
          overflow-hidden

          border-r border-white/[0.07]

          bg-[#10291d]

          shadow-[20px_0_60px_rgba(3,12,7,0.28)]

          transition-transform duration-300
          ease-[cubic-bezier(0.16,1,0.3,1)]

          lg:translate-x-0

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =========================
            AMBIENT BACKGROUND
        ========================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="
              absolute -left-24 -top-24
              h-72 w-72
              rounded-full
              bg-[#8cab70]/[0.075]
              blur-[90px]
            "
          />

          <div
            className="
              absolute -right-32 top-[35%]
              h-80 w-80
              rounded-full
              bg-[#315c42]/[0.10]
              blur-[100px]
            "
          />

          <div
            className="
              absolute -bottom-32 left-0
              h-72 w-72
              rounded-full
              bg-[#07130d]/60
              blur-[80px]
            "
          />
        </div>

        {/* =========================
            BRAND HEADER
        ========================== */}

        <div className="relative shrink-0">
          <div className="border-b border-white/[0.07]">
            <div className="relative flex h-[92px] items-center justify-between px-5">
              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className="group flex items-center gap-3.5"
              >
                {/* PREMIUM LOGO */}
                <div
                  className="
                    relative flex h-12 w-12 shrink-0
                    items-center justify-center
                    overflow-hidden
                    rounded-[16px]

                    border border-[#b9d39e]/[0.16]

                    bg-[#081a10]

                    shadow-[0_10px_35px_rgba(0,0,0,0.28)]

                    transition-all duration-300

                    group-hover:-translate-y-0.5
                    group-hover:border-[#b9d39e]/[0.28]
                    group-hover:shadow-[0_14px_40px_rgba(0,0,0,0.35)]
                  "
                >
                  {/* Inner gradient */}
                  <div
                    className="
                      absolute inset-0
                      bg-gradient-to-br
                      from-[#3d694d]
                      via-[#173a27]
                      to-[#07130d]
                    "
                  />

                  {/* Glow */}
                  <div
                    className="
                      absolute -right-4 -top-4
                      h-12 w-12
                      rounded-full
                      bg-[#c5dda8]/20
                      blur-xl
                    "
                  />

                  {/* Icon */}
                  <Leaf
                    size={21}
                    strokeWidth={1.65}
                    className="
                      relative z-10
                      text-[#d1e5b8]
                      drop-shadow-[0_2px_8px_rgba(197,221,168,0.20)]
                    "
                  />

                  {/* Bottom shine */}
                  <div
                    className="
                      absolute bottom-0 left-1/2
                      h-[2px] w-7
                      -translate-x-1/2
                      rounded-full
                      bg-[#b9d39e]/40
                      blur-[1px]
                    "
                  />
                </div>

                {/* BRAND TEXT */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className="
                        text-[15px]
                        font-black
                        tracking-[0.20em]
                        text-white
                      "
                    >
                      SEEDSTORE
                    </p>

                    <Sparkles
                      size={11}
                      strokeWidth={1.8}
                      className="text-[#b9d39e]/70"
                    />
                  </div>

                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span
                      className="
                        h-1.5 w-1.5
                        rounded-full
                        bg-[#b9d39e]
                        shadow-[0_0_8px_rgba(185,211,158,0.55)]
                      "
                    />

                    <p
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.24em]
                        text-white/40
                      "
                    >
                      Admin Console
                    </p>
                  </div>
                </div>
              </Link>

              {/* MOBILE CLOSE */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-[11px]

                  border border-white/[0.08]
                  bg-white/[0.045]

                  text-white/45

                  transition-all duration-200

                  hover:border-white/[0.15]
                  hover:bg-white/[0.09]
                  hover:text-white

                  active:scale-95

                  lg:hidden
                "
              >
                <X size={17} strokeWidth={1.9} />
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            NAVIGATION
        ========================== */}

        <div
          className="
            relative flex-1
            overflow-y-auto
            px-3.5
            py-6

            [scrollbar-width:thin]
            [scrollbar-color:#315c42_transparent]
          "
        >
          {navigation.map((section, sectionIndex) => (
            <div
              key={section.label}
              className={
                sectionIndex !== 0
                  ? "mt-8"
                  : ""
              }
            >
              {/* SECTION HEADER */}

              <div className="mb-2.5 flex items-center gap-2.5 px-2.5">
                <span
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.25em]
                    text-[#c5dda8]/40
                  "
                >
                  {section.label}
                </span>

                <div className="h-px flex-1 bg-white/[0.055]" />
              </div>

              {/* ITEMS */}

              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    pathname.startsWith(
                      `${item.href}/`
                    );

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        group relative flex h-[50px]
                        items-center gap-3
                        rounded-[16px]
                        px-2.5

                        text-[13px]
                        font-semibold

                        transition-all duration-250
                        ease-[cubic-bezier(0.16,1,0.3,1)]

                        ${
                          active
                            ? `
                              bg-[#f8faf6]
                              text-[#10291d]

                              shadow-[0_10px_30px_rgba(0,0,0,0.20)]

                              ring-1
                              ring-white/[0.12]
                            `
                            : `
                              text-white/55

                              hover:bg-white/[0.055]
                              hover:text-white
                            `
                        }
                      `}
                    >
                      {/* ACTIVE GLOW */}

                      {active && (
                        <>
                          <span
                            className="
                              absolute
                              -left-1
                              top-1/2
                              h-7
                              w-[3px]
                              -translate-y-1/2
                              rounded-full
                              bg-[#b9d39e]
                              shadow-[0_0_12px_rgba(185,211,158,0.65)]
                            "
                          />

                          <span
                            className="
                              pointer-events-none
                              absolute
                              inset-0
                              rounded-[16px]
                              bg-gradient-to-r
                              from-[#ffffff]/[0.10]
                              to-transparent
                            "
                          />
                        </>
                      )}

                      {/* ICON CONTAINER */}

                      <span
                        className={`
                          relative z-10
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-[11px]

                          transition-all duration-250

                          ${
                            active
                              ? `
                                bg-[#e9f0e6]
                                shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]
                              `
                              : `
                                border border-white/[0.035]
                                bg-white/[0.025]

                                group-hover:border-white/[0.07]
                                group-hover:bg-white/[0.075]
                              `
                          }
                        `}
                      >
                        <Icon
                          size={17}
                          strokeWidth={
                            active ? 2.1 : 1.75
                          }
                          className={`
                            transition-all duration-250

                            ${
                              active
                                ? `
                                  text-[#315c42]
                                  drop-shadow-[0_2px_5px_rgba(49,92,66,0.15)]
                                `
                                : `
                                  text-white/40
                                  group-hover:text-[#c5dda8]
                                  group-hover:scale-105
                                `
                            }
                          `}
                        />
                      </span>

                      {/* LABEL */}

                      <span
                        className="
                          relative z-10
                          flex-1
                          tracking-[-0.01em]
                        "
                      >
                        {item.name}
                      </span>

                      {/* ACTIVE ARROW */}

                      {active && (
                        <span
                          className="
                            relative z-10
                            flex h-6 w-6
                            items-center justify-center
                            rounded-full
                            bg-[#e7eee4]
                          "
                        >
                          <ChevronRight
                            size={13}
                            strokeWidth={2.2}
                            className="text-[#315c42]"
                          />
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* =========================
            BOTTOM AREA
        ========================== */}

        <div
          className="
            relative shrink-0
            border-t border-white/[0.07]
            bg-[#0c2116]/90
            p-3.5
          "
        >
          {/* =========================
              VIEW STORE CARD
          ========================== */}

          <Link
            href="/"
            onClick={onClose}
            className="
              group relative
              mb-3
              flex items-center gap-3
              overflow-hidden

              rounded-[16px]

              border border-[#b9d39e]/[0.10]
              bg-gradient-to-br
              from-[#315c42]/35
              to-[#10291d]/20

              px-3
              py-3

              transition-all duration-250

              hover:-translate-y-0.5
              hover:border-[#b9d39e]/[0.20]
              hover:from-[#315c42]/45
              hover:to-[#10291d]/30

              hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)]
            "
          >
            {/* Card glow */}

            <div
              className="
                pointer-events-none
                absolute -right-8 -top-8
                h-20 w-20
                rounded-full
                bg-[#b9d39e]/[0.08]
                blur-2xl
              "
            />

            {/* Icon */}

            <div
              className="
                relative z-10
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-[11px]

                border border-[#b9d39e]/[0.10]
                bg-[#b9d39e]/[0.08]

                text-[#c5dda8]

                transition-all duration-250

                group-hover:bg-[#b9d39e]/[0.14]
                group-hover:border-[#b9d39e]/[0.18]
              "
            >
              <Boxes
                size={16}
                strokeWidth={1.8}
              />
            </div>

            {/* Text */}

            <div className="relative z-10 min-w-0 flex-1">
              <p
                className="
                  text-[11px]
                  font-bold
                  text-white/90
                "
              >
                View Store
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[9px]
                  font-medium
                  text-white/35
                "
              >
                Open customer storefront
              </p>
            </div>

            <ArrowUpRight
              size={14}
              className="
                relative z-10
                text-white/30

                transition-all duration-250

                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
                group-hover:text-[#c5dda8]
              "
            />
          </Link>

          {/* =========================
              SETTINGS
          ========================== */}

          <Link
            href="/admin/settings"
            onClick={onClose}
            className="
              group flex h-[42px]
              items-center gap-3
              rounded-[12px]
              px-3

              text-[12px]
              font-semibold
              text-white/45

              transition-all duration-200

              hover:bg-white/[0.055]
              hover:text-white
            "
          >
            <span
              className="
                flex h-7 w-7
                items-center justify-center
                rounded-[9px]
                bg-white/[0.035]

                transition-all duration-200

                group-hover:bg-white/[0.075]
              "
            >
              <Settings
                size={15}
                strokeWidth={1.8}
                className="
                  text-white/35
                  transition-all duration-300
                  group-hover:rotate-45
                  group-hover:text-[#c5dda8]
                "
              />
            </span>

            <span className="flex-1">
              Settings
            </span>

            <ChevronRight
              size={13}
              className="
                text-white/20
                transition-all duration-200
                group-hover:translate-x-0.5
                group-hover:text-white/45
              "
            />
          </Link>

          {/* =========================
              LOGOUT
          ========================== */}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="
              group flex h-[42px] w-full
              items-center gap-3
              rounded-[12px]
              px-3

              text-left
              text-[12px]
              font-semibold
              text-white/40

              transition-all duration-200

              hover:bg-red-400/[0.055]
              hover:text-red-300

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <span
              className="
                flex h-7 w-7
                items-center justify-center
                rounded-[9px]
                bg-white/[0.025]

                transition-all duration-200

                group-hover:bg-red-400/[0.08]
              "
            >
              {loggingOut ? (
                <Loader2
                  size={15}
                  className="animate-spin text-white/50"
                />
              ) : (
                <LogOut
                  size={15}
                  strokeWidth={1.8}
                  className="
                    transition-transform duration-200
                    group-hover:translate-x-0.5
                    group-hover:text-red-300
                  "
                />
              )}
            </span>

            <span>
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

