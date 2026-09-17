"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserCircle,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  onMenuClick: () => void;
};

export default function AdminTopbar({
  onMenuClick,
}: Props) {
  const router = useRouter();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.replace("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-[76px]
        items-center justify-between
        border-b border-white/[0.08]
        bg-[#10291d]
        px-4
        shadow-[0_8px_30px_rgba(7,19,13,0.12)]
        sm:px-6
        lg:px-8
      "
    >
      {/* =========================
          LEFT
      ========================== */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            border border-white/[0.10]
            bg-white/[0.05]
            text-white/75
            transition-all duration-200
            hover:border-white/[0.16]
            hover:bg-white/[0.10]
            hover:text-white
            active:scale-95
            lg:hidden
          "
        >
          <Menu
            size={19}
            strokeWidth={1.9}
          />
        </button>

        {/* Page Context */}
        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b9d39e]" />

            <p
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.22em]
                text-white/40
              "
            >
              Administration
            </p>
          </div>

          <p className="mt-1 text-[13px] font-bold text-white/90">
            Store management
          </p>
        </div>
      </div>

      {/* =========================
          RIGHT
      ========================== */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* =========================
            SEARCH
        ========================== */}
        <button
          type="button"
          className="
            group hidden h-10
            items-center gap-2.5
            rounded-xl
            border border-white/[0.10]
            bg-white/[0.045]
            px-3
            text-white/45
            transition-all duration-200
            hover:border-white/[0.16]
            hover:bg-white/[0.09]
            hover:text-white/80
            md:flex
          "
        >
          <Search
            size={16}
            strokeWidth={1.8}
            className="
              transition-transform duration-200
              group-hover:scale-105
            "
          />

          <span className="text-[11px] font-medium">
            Search
          </span>

          <kbd
            className="
              ml-3
              rounded-md
              border border-white/[0.08]
              bg-white/[0.06]
              px-1.5
              py-0.5
              text-[9px]
              font-semibold
              text-white/35
            "
          >
            /
          </kbd>
        </button>

        {/* =========================
            NOTIFICATIONS
        ========================== */}
        <button
          type="button"
          aria-label="Notifications"
          className="
            group relative
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            border border-white/[0.10]
            bg-white/[0.045]
            text-white/65
            transition-all duration-200
            hover:border-white/[0.16]
            hover:bg-white/[0.09]
            hover:text-white
            active:scale-95
          "
        >
          <Bell
            size={17}
            strokeWidth={1.8}
            className="
              transition-transform duration-200
              group-hover:-rotate-6
            "
          />

          {/* Notification */}
          <span
            className="
              absolute right-[8px] top-[7px]
              h-[6px] w-[6px]
              rounded-full
              bg-[#b9d39e]
              ring-2 ring-[#10291d]
            "
          />
        </button>

        {/* =========================
            PROFILE
        ========================== */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                (current) => !current
              )
            }
            className="
              group flex h-10
              items-center gap-2
              rounded-xl
              border border-white/[0.10]
              bg-white/[0.045]
              px-2
              transition-all duration-200
              hover:border-white/[0.16]
              hover:bg-white/[0.09]
              sm:px-2.5
            "
          >
            {/* Avatar */}
            <div
              className="
                relative flex h-8 w-8
                items-center justify-center
                overflow-hidden
                rounded-[10px]
                bg-[#315c42]
                shadow-[0_4px_12px_rgba(0,0,0,0.16)]
              "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#52755d] to-[#183a28]" />

              <UserCircle
                size={17}
                strokeWidth={1.7}
                className="
                  relative z-10
                  text-[#d0e3bb]
                "
              />
            </div>

            {/* User Info */}
            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-bold text-white/90">
                Admin
              </p>

              <p className="mt-0.5 text-[9px] font-medium text-white/40">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={14}
              strokeWidth={1.8}
              className={`
                hidden
                text-white/40
                transition-transform duration-200
                sm:block
                ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />
          </button>

          {/* =========================
              PROFILE DROPDOWN
          ========================== */}
          {profileOpen && (
            <div
              className="
                absolute right-0 top-[50px]
                w-[255px]
                overflow-hidden
                rounded-[17px]
                border border-[#dfe8e1]
                bg-white
                p-2
                shadow-[0_20px_55px_rgba(7,19,13,0.22)]
              "
            >
              {/* Profile Header */}
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[12px]
                  bg-[#10291d]
                  px-3.5
                  py-3.5
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute -right-5 -top-8
                    h-24 w-24
                    rounded-full
                    bg-[#b9d39e]/10
                    blur-2xl
                  "
                />

                <div className="relative flex items-center gap-3">
                  <div
                    className="
                      flex h-9 w-9
                      shrink-0
                      items-center justify-center
                      rounded-[10px]
                      bg-white/[0.09]
                      ring-1 ring-white/[0.08]
                    "
                  >
                    <UserCircle
                      size={18}
                      strokeWidth={1.7}
                      className="text-[#c5dda8]"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-white">
                      Administrator
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#b9d39e]" />

                      <p className="text-[9px] font-medium text-white/50">
                        Active session
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Session */}
              <div
                className="
                  mx-1 mt-2
                  flex items-center gap-2
                  rounded-lg
                  bg-[#f0f5f1]
                  px-2.5
                  py-2
                  text-[9px]
                  font-semibold
                  text-[#6d7d73]
                "
              >
                <ShieldCheck
                  size={13}
                  strokeWidth={1.8}
                  className="text-[#527d5c]"
                />

                Secure admin session
              </div>

              {/* Account Settings */}
              <Link
                href="/admin/settings"
                onClick={() =>
                  setProfileOpen(false)
                }
                className="
                  group mt-2
                  flex h-10
                  items-center gap-3
                  rounded-xl
                  px-3
                  text-[12px]
                  font-semibold
                  text-[#65736a]
                  transition-all
                  hover:bg-[#f0f5f1]
                  hover:text-[#10291d]
                "
              >
                <span
                  className="
                    flex h-7 w-7
                    items-center justify-center
                    rounded-lg
                    bg-[#f2f5f2]
                    transition-colors
                    group-hover:bg-[#e3eee4]
                  "
                >
                  <Settings
                    size={14}
                    strokeWidth={1.8}
                    className="
                      text-[#718077]
                      group-hover:text-[#315c42]
                    "
                  />
                </span>

                <span className="flex-1">
                  Account settings
                </span>

                <ChevronDown
                  size={13}
                  className="
                    -rotate-90
                    text-[#a0aaa4]
                    group-hover:text-[#315c42]
                  "
                />
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="
                  group mt-1
                  flex h-10 w-full
                  items-center gap-3
                  rounded-xl
                  px-3
                  text-left
                  text-[12px]
                  font-semibold
                  text-[#8d6565]
                  transition-all
                  hover:bg-[#fff3f2]
                  hover:text-[#a33f3f]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <span
                  className="
                    flex h-7 w-7
                    items-center justify-center
                    rounded-lg
                    bg-[#fff6f5]
                    transition-colors
                    group-hover:bg-[#ffe9e7]
                  "
                >
                  <LogOut
                    size={14}
                    strokeWidth={1.8}
                    className="
                      transition-transform duration-200
                      group-hover:translate-x-0.5
                    "
                  />
                </span>

                <span>
                  {loggingOut
                    ? "Signing out..."
                    : "Sign out"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

