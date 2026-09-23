"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [sent, setSent] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: email
              .trim()
              .toLowerCase(),
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Something went wrong. Please try again."
        );

        return;
      }

      setSent(true);
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

        {/* =====================================================
            LEFT BRAND PANEL
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-[#10291d] lg:flex">

          <div className="absolute inset-0">

            <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#315c42]/20 blur-3xl" />

            <div className="absolute -bottom-52 -right-40 h-[620px] w-[620px] rounded-full bg-[#6d8d5c]/10 blur-3xl" />

            <div className="absolute left-[18%] top-[30%] h-72 w-72 rounded-full border border-white/[0.05]" />

            <div className="absolute left-[22%] top-[34%] h-56 w-56 rounded-full border border-white/[0.04]" />

          </div>

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize:
                "42px 42px",
            }}
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Logo */}

            <Link
              href="/"
              className="group inline-flex w-fit items-center gap-3"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] shadow-2xl backdrop-blur">

                <Leaf
                  size={21}
                  strokeWidth={1.8}
                  className="text-[#b8ce9e]"
                />

              </div>

              <div>

                <p className="text-[17px] font-semibold tracking-[0.22em] text-white">
                  SEEDSTORE
                </p>

                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.28em] text-white/40">
                  Grow with confidence
                </p>

              </div>

            </Link>

            {/* Main */}

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
                transition={{
                  duration: 0.7,
                }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3.5 py-2 backdrop-blur"
              >

                <Sparkles
                  size={13}
                  className="text-[#b8ce9e]"
                />

                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
                  Your account, protected
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
                transition={{
                  duration: 0.75,
                  delay: 0.08,
                }}
                className="text-[clamp(3.2rem,5.3vw,5.6rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white"
              >

                A fresh start

                <span className="block text-[#b8ce9e]">
                  for your account.
                </span>

              </motion.h1>

              <motion.p
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.18,
                }}
                className="mt-7 max-w-[500px] text-[15px] leading-7 text-white/48"
              >
                Forgot your password?
                No worries. We'll help you
                securely get back into your
                SeedStore account.
              </motion.p>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.28,
                }}
                className="mt-10 grid max-w-[500px] grid-cols-2 gap-3"
              >

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur">

                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-[#b8ce9e]/10">

                    <LockKeyhole
                      size={15}
                      className="text-[#b8ce9e]"
                    />

                  </div>

                  <p className="text-sm font-medium text-white/80">
                    Secure reset
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-white/35">
                    Reset links are temporary
                    and protected.
                  </p>

                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 backdrop-blur">

                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-[#b8ce9e]/10">

                    <ShieldCheck
                      size={15}
                      className="text-[#b8ce9e]"
                    />

                  </div>

                  <p className="text-sm font-medium text-white/80">
                    Account protection
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-white/35">
                    Your account details stay private.
                  </p>

                </div>

              </motion.div>

            </div>

            {/* Footer */}

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

        {/* =====================================================
            RIGHT PANEL
        ====================================================== */}

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12 xl:px-20">

          <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[#dce8d2] blur-3xl lg:hidden" />

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

                <div>

                  <p className="text-[15px] font-semibold tracking-[0.2em] text-[#10291d]">
                    SEEDSTORE
                  </p>

                  <p className="text-[8px] uppercase tracking-[0.25em] text-[#718077]">
                    Grow with confidence
                  </p>

                </div>

              </Link>

            </div>

            <AnimatePresence mode="wait">

              {!sent ? (

                <motion.div
                  key="form"
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                >

                  {/* Heading */}

                  <div>

                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9f0e5]">

                      <LockKeyhole
                        size={18}
                        strokeWidth={1.8}
                        className="text-[#315c42]"
                      />

                    </div>

                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#718077]">
                      Account recovery
                    </p>

                    <h2 className="text-[38px] font-medium tracking-[-0.045em] text-[#142019] sm:text-[42px]">

                      Forgot your

                      <span className="block text-[#315c42]">
                        password?
                      </span>

                    </h2>

                    <p className="mt-4 text-[14px] leading-6 text-[#718077]">
                      Enter the email address
                      connected to your SeedStore
                      account and we'll send you
                      a secure password reset link.
                    </p>

                  </div>

                  {/* Form */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1,
                    }}
                    className="mt-9"
                  >

                    <AnimatePresence>

                      {error && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                            y: -5,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="mb-5 overflow-hidden"
                        >

                          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5">

                            <p className="text-[13px] leading-5 text-red-700">
                              {error}
                            </p>

                          </div>

                        </motion.div>
                      )}

                    </AnimatePresence>

                    <form
                      onSubmit={handleSubmit}
                    >

                      <div>

                        <label
                          htmlFor="email"
                          className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#59675f]"
                        >
                          Email address
                        </label>

                        <div className="group relative">

                          <Mail
                            size={17}
                            strokeWidth={1.8}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ba69f] transition-colors group-focus-within:text-[#315c42]"
                          />

                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) =>
                              setEmail(
                                event.target.value
                              )
                            }
                            placeholder="you@example.com"
                            disabled={loading}
                            required
                            className="h-[56px] w-full rounded-2xl border border-[#dfe5df] bg-white pl-12 pr-4 text-[14px] text-[#142019] outline-none transition-all placeholder:text-[#adb5b0] hover:border-[#c9d3ca] focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
                          />

                        </div>

                      </div>

                      {/* Security */}

                      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#e3e9e1] bg-[#f3f6f1] px-4 py-3.5">

                        <ShieldCheck
                          size={17}
                          strokeWidth={1.8}
                          className="mt-0.5 shrink-0 text-[#55755d]"
                        />

                        <p className="text-[11px] leading-5 text-[#68766e]">
                          For your security, we
                          won't reveal whether an
                          account exists for this
                          email address.
                        </p>

                      </div>

                      {/* Submit */}

                      <button
                        type="submit"
                        disabled={
                          loading ||
                          !email.trim()
                        }
                        className="group relative mt-6 flex h-[58px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#10291d] text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_15px_35px_rgba(16,41,29,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#183c29] hover:shadow-[0_18px_40px_rgba(16,41,29,0.22)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
                      >

                        <span className="relative z-10 flex items-center gap-2.5">

                          {loading ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                              Sending link
                            </>
                          ) : (
                            <>
                              Send reset link

                              <ArrowRight
                                size={16}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              />
                            </>
                          )}

                        </span>

                      </button>

                    </form>

                  </motion.div>

                  {/* Back login */}

                  <div className="mt-8 text-center">

                    <Link
                      href="/login"
                      className="text-[13px] font-semibold text-[#315c42] transition-colors hover:text-[#1c402b]"
                    >
                      ← Back to sign in
                    </Link>

                  </div>

                </motion.div>

              ) : (

                /* =================================================
                   SENT STATE
                ================================================== */

                <motion.div
                  key="sent"
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                >

                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f0e5]">

                    <CheckCircle2
                      size={21}
                      strokeWidth={1.8}
                      className="text-[#315c42]"
                    />

                  </div>

                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#718077]">
                    Check your email
                  </p>

                  <h2 className="text-[38px] font-medium tracking-[-0.045em] text-[#142019] sm:text-[42px]">

                    Reset link

                    <span className="block text-[#315c42]">
                      is on its way.
                    </span>

                  </h2>

                  <p className="mt-4 text-[14px] leading-6 text-[#718077]">

                    If an account exists for

                    <span className="font-semibold text-[#526159]">
                      {" "}
                      {email}
                    </span>

                    , we've sent a password
                    reset link.

                  </p>

                  {/* Inbox */}

                  <div className="mt-7 rounded-2xl border border-[#dfe7dc] bg-[#f3f6f1] p-5">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">

                        <Mail
                          size={17}
                          className="text-[#315c42]"
                        />

                      </div>

                      <div>

                        <p className="text-[13px] font-semibold text-[#314038]">
                          Check your inbox
                        </p>

                        <p className="mt-1 text-[12px] leading-5 text-[#718077]">
                          If you don't see the
                          email within a few minutes,
                          please check your
                          <span className="font-semibold text-[#59675f]">
                            {" "}Spam or Junk folder
                          </span>
                          {" "}too.
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Expiry */}

                  <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#e3e9e1] bg-white px-4 py-3.5">

                    <ShieldCheck
                      size={17}
                      strokeWidth={1.8}
                      className="mt-0.5 shrink-0 text-[#55755d]"
                    />

                    <p className="text-[11px] leading-5 text-[#68766e]">
                      The reset link expires
                      in 30 minutes and can
                      only be used once.
                    </p>

                  </div>

                  {/* Login */}

                  <Link
                    href="/login"
                    className="group mt-7 flex h-[56px] w-full items-center justify-center rounded-2xl bg-[#10291d] text-[12px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_15px_35px_rgba(16,41,29,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#183c29]"
                  >
                    Back to sign in
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setError("");
                    }}
                    className="mt-2 h-[50px] w-full rounded-2xl text-[11px] font-semibold uppercase tracking-[0.14em] text-[#718077] transition-colors hover:bg-[#f1f4f0] hover:text-[#315c42]"
                  >
                    Try another email
                  </button>

                </motion.div>

              )}

            </AnimatePresence>

            {/* Mobile security */}

            <div className="mt-10 flex items-center justify-center gap-2 text-[#9ba49e] lg:hidden">

              <ShieldCheck
                size={14}
              />

              <span className="text-[10px] uppercase tracking-[0.16em]">
                Secure account recovery
              </span>

            </div>

            {/* Home */}

            <div className="mt-7 text-center">

              <Link
                href="/"
                className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9ba49e] transition-colors hover:text-[#315c42]"
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