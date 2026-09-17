"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Check,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  createdAt?: string;
};

function formatDate(date?: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(
    null
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/account/profile",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load profile."
          );
        }

        setUser(data.user);
        setName(data.user.name || "");
        setPhone(data.user.phone || "");
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2) {
      setError(
        "Name must be at least 2 characters."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/account/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            phone: trimmedPhone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update profile."
        );
      }

      setUser((previous) =>
        previous
          ? {
              ...previous,
              name: data.user.name,
              phone: data.user.phone || "",
            }
          : data.user
      );

      setName(data.user.name);
      setPhone(data.user.phone || "");

      setSuccess(
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-[30px] bg-white" />

        <div className="h-[420px] animate-pulse rounded-[30px] bg-white" />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="rounded-[30px] border border-[#eadbd5] bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8eeee] text-[#9a6257]">
          <UserRound size={24} />
        </div>

        <h2 className="mt-5 font-serif text-2xl text-[#294b39]">
          We couldn't load your profile
        </h2>

        <p className="mt-2 text-sm text-[#7a847d]">
          {error}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-[#294b39] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3b2c]"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[32px] border border-[#e1e4dc] bg-white px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="relative z-10 flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#294b39] font-serif text-2xl text-white shadow-sm">
              {getInitials(user.name)}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a958d]">
                Personal details
              </p>

              <h2 className="mt-1 font-serif text-3xl tracking-[-0.035em] text-[#294b39]">
                Your profile
              </h2>

              <p className="mt-1 text-sm text-[#7b867e]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#dce7dd] bg-[#f1f6f1] px-4 py-2 text-xs font-semibold text-[#315c45]">
            <ShieldCheck size={15} />
            {user.role === "admin"
              ? "Admin account"
              : "Customer account"}
          </div>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#eef3eb]" />
        <div className="pointer-events-none absolute -bottom-28 right-28 h-48 w-48 rounded-full bg-[#f5f0df]" />
      </section>

      {/* Profile form */}
      <section className="rounded-[30px] border border-[#e1e4dc] bg-white p-6 sm:p-8 lg:p-10">
        <div className="max-w-2xl">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a958d]">
              Account information
            </p>

            <h3 className="mt-2 font-serif text-2xl text-[#294b39]">
              Keep your details up to date
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#77827a]">
              Update the information we use when communicating
              with you and processing your orders.
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mt-6 rounded-2xl border border-[#eadbd5] bg-[#fdf5f2] px-4 py-3 text-sm text-[#9a6257]">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-[#d9e7da] bg-[#f1f7f1] px-4 py-3 text-sm text-[#315c45]">
              <Check size={17} />
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-semibold text-[#35483d]"
              >
                Full name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c978f]"
                />

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  maxLength={100}
                  autoComplete="name"
                  className="h-13 w-full rounded-2xl border border-[#dfe4dc] bg-[#fbfcf9] pl-11 pr-4 text-sm text-[#294b39] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#78917f] focus:bg-white focus:ring-4 focus:ring-[#315c45]/5"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-semibold text-[#35483d]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c978f]"
                />

                <input
                  id="profile-email"
                  type="email"
                  value={user.email}
                  disabled
                  className="h-13 w-full cursor-not-allowed rounded-2xl border border-[#e5e7e2] bg-[#f2f3ef] pl-11 pr-4 text-sm text-[#8a958d]"
                />
              </div>

              <p className="mt-2 text-xs text-[#969f98]">
                Your email address cannot be changed here.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="profile-phone"
                className="mb-2 block text-sm font-semibold text-[#35483d]"
              >
                Phone number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c978f]"
                />

                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  maxLength={30}
                  autoComplete="tel"
                  className="h-13 w-full rounded-2xl border border-[#dfe4dc] bg-[#fbfcf9] pl-11 pr-4 text-sm text-[#294b39] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#78917f] focus:bg-white focus:ring-4 focus:ring-[#315c45]/5"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            {/* Account metadata */}
            <div className="grid gap-4 border-t border-[#e7e9e4] pt-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f7f8f4] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#909a92]">
                  Account type
                </p>

                <p className="mt-2 text-sm font-semibold capitalize text-[#294b39]">
                  {user.role}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f7f8f4] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#909a92]">
                  Member since
                </p>

                <p className="mt-2 text-sm font-semibold text-[#294b39]">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end border-t border-[#e7e9e4] pt-6">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#294b39] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f3b2c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}