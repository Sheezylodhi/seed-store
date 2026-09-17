
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  LogOut,
  MessageSquareText,
  UserRound,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to logout.");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      alert("Unable to logout. Please try again.");
    }
  }

  return (
    <>
      {/* Main Website Navbar */}
      <Navbar />

      <main className="min-h-screen bg-[#f7f5ee] text-[#20352a]">
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          {/* Account Header */}
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#8a958d]">
              SeedStore
            </p>

            <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-[#294b39] sm:text-5xl">
              My Account
            </h1>
          </div>

          {/* Account Navigation */}
          <nav className="mb-10 flex items-center gap-2 overflow-x-auto border-b border-[#dfe3dc] pb-3">
            <AccountLink
              href="/account"
              label="Overview"
              icon={<UserRound size={16} />}
            />

            <AccountLink
              href="/account/orders"
              label="Orders"
              icon={<ClipboardList size={16} />}
            />

            <AccountLink
              href="/account/reviews"
              label="Reviews"
              icon={<MessageSquareText size={16} />}
            />

            <AccountLink
              href="/account/profile"
              label="Profile"
              icon={<UserRound size={16} />}
            />

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="ml-auto flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[#8b5b5b] transition hover:bg-[#f5e9e9] hover:text-[#7a3f3f]"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>

          {/* Page Content */}
          <section>{children}</section>
        </div>
      </main>

      {/* Main Website Footer */}
      <Footer />
    </>
  );
}

function AccountLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[#68766d] transition hover:bg-white hover:text-[#294b39]"
    >
      {icon}
      {label}
    </Link>
  );
}

