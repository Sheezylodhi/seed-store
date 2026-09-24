"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

import { useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );
    }
  }, [token]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password.length > 128) {
      setError("Password is too long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to reset your password."
        );
        return;
      }

      setSuccess(true);
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#142019]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT */}
        <section className="relative hidden overflow-hidden bg-[#10291d] lg:flex">

          <div className="absolute inset-0">

            <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#315c42]/20 blur-3xl" />

            <div className="absolute -bottom-52 -right-40 h-[620px] w-[620px] rounded-full bg-[#6d8d5c]/10 blur-3xl" />

            <div className="absolute left-[18%] top-[30%] h-72 w-72 rounded-full border border-white/[0.05]" />

          </div>

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            <Link
              href="/"
              className="inline-flex w-fit items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
                <Leaf
                  size={21}
                  className="text-[#b8ce9e]"
                />
              </div>

              <div>
                <p className="text-[17px] font-semibold tracking-[0.22em] text-white">
                  SEEDSTORE
                </p>

                <p className="mt-0.5 text-[9px] uppercase tracking-[0.28em] text-white/40">
                  Grow with confidence
                </p>
              </div>
            </Link>

            <div className="max-w-[590px]">

              <motion.div
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3.5 py-2"
              >
                <ShieldCheck
                  size={13}
                  className="text-[#b8ce9e]"
                />

                <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">
                  Secure account recovery
                </span>
              </motion.div>

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 22,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="text-[clamp(3.2rem,5.3vw,5.6rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white"
              >
                Back to

                <span className="block text-[#b8ce9e]">
                  growing.
                </span>
              </motion.h1>

              <p className="mt-7 max-w-[500px] text-[15px] leading-7 text-white/48">
                Create a new password and
                continue your SeedStore journey
                with a secure account.
              </p>

            </div>

            <div className="flex items-center justify-between border-t border-white/[0.07] pt-6">

              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                Premium seeds · Better growth
              </p>

              <p className="text-[10px] text-white/20">
                © {new Date().getFullYear()} SeedStore
              </p>

            </div>

          </div>
        </section>

        {/* RIGHT */}
        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">

          <div className="w-full max-w-[440px]">

            {/* Mobile logo */}
            <div className="mb-12 flex justify-center lg:hidden">

              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10291d]">
                  <Leaf
                    size={19}
                    className="text-[#b8ce9e]"
                  />
                </div>

                <p className="text-[15px] font-semibold tracking-[0.2em] text-[#10291d]">
                  SEEDSTORE
                </p>
              </Link>

            </div>

            {!success ? (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9f0e5]">
                  <LockKeyhole
                    size={18}
                    className="text-[#315c42]"
                  />
                </div>

                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#718077]">
                  Account recovery
                </p>

                <h2 className="text-[38px] font-medium tracking-[-0.045em] sm:text-[42px]">
                  Create a new

                  <span className="block text-[#315c42]">
                    password.
                  </span>
                </h2>

                <p className="mt-4 text-[14px] leading-6 text-[#718077]">
                  Choose a new password for
                  your SeedStore account.
                </p>

                <div className="mt-9">

                  {error && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5">
                      <p className="text-[13px] leading-5 text-red-700">
                        {error}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>

                    {/* PASSWORD */}
                    <div className="mb-5">

                      <label
                        htmlFor="password"
                        className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#59675f]"
                      >
                        New password
                      </label>

                      <div className="group relative">

                        <LockKeyhole
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ba69f]"
                        />

                        <input
                          id="password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          autoComplete="new-password"
                          value={password}
                          onChange={(event) =>
                            setPassword(
                              event.target.value
                            )
                          }
                          placeholder="Enter new password"
                          disabled={loading}
                          required
                          minLength={8}
                          maxLength={128}
                          className="h-[56px] w-full rounded-2xl border border-[#dfe5df] bg-white pl-12 pr-12 text-[14px] outline-none transition-all placeholder:text-[#adb5b0] focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.07]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (current) => !current
                            )
                          }
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#9ba69f] hover:bg-[#f1f4f0] hover:text-[#315c42]"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                      </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>

                      <label
                        htmlFor="confirmPassword"
                        className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#59675f]"
                      >
                        Confirm password
                      </label>

                      <div className="group relative">

                        <LockKeyhole
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ba69f]"
                        />

                        <input
                          id="confirmPassword"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(
                              event.target.value
                            )
                          }
                          placeholder="Confirm new password"
                          disabled={loading}
                          required
                          minLength={8}
                          maxLength={128}
                          className="h-[56px] w-full rounded-2xl border border-[#dfe5df] bg-white pl-12 pr-12 text-[14px] outline-none transition-all placeholder:text-[#adb5b0] focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.07]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (current) => !current
                            )
                          }
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#9ba69f] hover:bg-[#f1f4f0] hover:text-[#315c42]"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>

                      </div>
                    </div>

                    {/* SECURITY */}
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#e3e9e1] bg-[#f3f6f1] px-4 py-3.5">

                      <ShieldCheck
                        size={17}
                        className="mt-0.5 shrink-0 text-[#55755d]"
                      />

                      <p className="text-[11px] leading-5 text-[#68766e]">
                        Your new password is
                        securely encrypted before
                        it is stored.
                      </p>

                    </div>

                    {/* BUTTON */}
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        !token ||
                        !password ||
                        !confirmPassword
                      }
                      className="group mt-6 flex h-[58px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#10291d] text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_15px_35px_rgba(16,41,29,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#183c29] disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          Updating password
                        </>
                      ) : (
                        <>
                          Reset password

                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}

                    </button>

                  </form>
                </div>
              </motion.div>
            ) : (

              /* SUCCESS */
              <motion.div
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f0e5]">
                  <CheckCircle2
                    size={22}
                    className="text-[#315c42]"
                  />
                </div>

                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#718077]">
                  All set
                </p>

                <h2 className="text-[38px] font-medium tracking-[-0.045em] sm:text-[42px]">
                  Password

                  <span className="block text-[#315c42]">
                    updated.
                  </span>
                </h2>

                <p className="mt-4 text-[14px] leading-6 text-[#718077]">
                  Your password has been
                  successfully changed.
                  You can now sign in using
                  your new password.
                </p>

                <Link
                  href="/login"
                  className="group mt-8 flex h-[58px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#10291d] text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_15px_35px_rgba(16,41,29,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#183c29]"
                >
                  Sign in

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

              </motion.div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9ba49e] hover:text-[#315c42]"
              >
                ← Back to store
              </Link>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

/*
 * IMPORTANT:
 *
 * useSearchParams() requires a Suspense
 * boundary during Next.js production build.
 */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f8f4] text-[#142019]">
          <div className="flex min-h-screen items-center justify-center">
            <div className="flex items-center gap-3 text-[#315c42]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#315c42]/20 border-t-[#315c42]" />

              <span className="text-sm">
                Loading secure reset page...
              </span>
            </div>
          </div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}