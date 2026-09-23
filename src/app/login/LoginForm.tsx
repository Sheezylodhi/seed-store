"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: {
              credential: string;
            }) => void;
          }) => void;

          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
              shape?: string;
              logo_alignment?: string;
            }
          ) => void;

          cancel: () => void;
        };
      };
    };
  }
}

export default function LoginForm() {
  const router = useRouter();

  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleInitializedRef = useRef(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");

  function redirectUser(role: string) {
    if (role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/account");
    }
  }

  /*
   * ---------------------------------------------------------
   * Normal Email + Password Login
   * ---------------------------------------------------------
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to sign in. Please check your credentials."
        );

        return;
      }

      redirectUser(data.user?.role);
    } catch {
      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * Google Login
   * ---------------------------------------------------------
   */
  async function handleGoogleCredential(
    response: {
      credential: string;
    }
  ) {
    if (!response?.credential) {
      setError(
        "Google authentication failed. Please try again."
      );

      return;
    }

    setError("");
    setGoogleLoading(true);

    try {
      const apiResponse = await fetch(
        "/api/auth/google",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            credential: response.credential,
          }),
        }
      );

      const data = await apiResponse.json();

      if (!apiResponse.ok || !data.success) {
        setError(
          data.message ||
            "Unable to sign in with Google."
        );

        return;
      }

      redirectUser(data.user?.role);
    } catch {
      setError(
        "Something went wrong while signing in with Google."
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * Initialize Google Identity Services
   * ---------------------------------------------------------
   */
  function initializeGoogle() {
    if (
      googleInitializedRef.current ||
      !window.google ||
      !googleButtonRef.current
    ) {
      return;
    }

    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error(
        "NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing."
      );

      return;
    }

    googleInitializedRef.current = true;

    window.google.accounts.id.initialize({
      client_id: clientId,

      callback: handleGoogleCredential,
    });

    googleButtonRef.current.innerHTML = "";

    window.google.accounts.id.renderButton(
      googleButtonRef.current,
      {
        theme: "outline",
        size: "large",
        width: 400,
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
      }
    );
  }

  /*
   * If Google script was already loaded before the component
   * initialized, make sure the button still gets rendered.
   */
  useEffect(() => {
    if (
      window.google &&
      googleButtonRef.current
    ) {
      initializeGoogle();
    }
  }, []);

  const anyLoading = loading || googleLoading;

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initializeGoogle}
      />

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
                backgroundSize: "42px 42px",
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

              {/* Main message */}

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
                    Quality starts with the seed
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
                  Grow something

                  <span className="block text-[#b8ce9e]">
                    worth growing.
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
                  Sign in to manage your orders,
                  explore premium seeds, and keep
                  your growing journey moving forward.
                </motion.p>

                {/* Trust points */}

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
                      <Leaf
                        size={15}
                        className="text-[#b8ce9e]"
                      />
                    </div>

                    <p className="text-sm font-medium text-white/80">
                      Carefully selected
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-white/35">
                      Seeds chosen with quality in mind.
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
                      Secure account
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-white/35">
                      Your account is protected by secure sessions.
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
              RIGHT LOGIN PANEL
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

              {/* Heading */}

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
                }}
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9f0e5]">
                  <LockKeyhole
                    size={18}
                    strokeWidth={1.8}
                    className="text-[#315c42]"
                  />
                </div>

                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#718077]">
                  Welcome back
                </p>

                <h2 className="text-[38px] font-medium tracking-[-0.045em] text-[#142019] sm:text-[42px]">
                  Sign in to your

                  <span className="block text-[#315c42]">
                    SeedStore account.
                  </span>
                </h2>

                <p className="mt-4 text-[14px] leading-6 text-[#718077]">
                  Access your orders, account details,
                  and everything you need for your next grow.
                </p>
              </motion.div>

              {/* Login */}

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

                {/* Error */}

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

                {/* Google Login */}

                <div className="relative">

                  <div
                    className={`transition-opacity ${
                      googleLoading
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    <div
                      ref={googleButtonRef}
                      className="flex min-h-[44px] w-full justify-center overflow-hidden"
                    />
                  </div>

                  {googleLoading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#315c42]/20 border-t-[#315c42]" />
                    </div>
                  )}
                </div>

                {/* Divider */}

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#e3e8e3]" />

                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#9aa39d]">
                    or continue with email
                  </span>

                  <div className="h-px flex-1 bg-[#e3e8e3]" />
                </div>

                {/* Email */}

                <form onSubmit={handleSubmit}>

                  <div className="mb-5">

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
                          setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        disabled={anyLoading}
                        required
                        className="h-[56px] w-full rounded-2xl border border-[#dfe5df] bg-white pl-12 pr-4 text-[14px] text-[#142019] outline-none transition-all placeholder:text-[#adb5b0] hover:border-[#c9d3ca] focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Password */}

                  <div className="mb-3">

                    <div className="mb-2.5 flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#59675f]"
                      >
                        Password
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-[11px] font-medium text-[#315c42] transition-colors hover:text-[#1c402b]"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="group relative">

                      <LockKeyhole
                        size={17}
                        strokeWidth={1.8}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ba69f] transition-colors group-focus-within:text-[#315c42]"
                      />

                      <input
                        id="password"
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        disabled={anyLoading}
                        required
                        maxLength={128}
                        className="h-[56px] w-full rounded-2xl border border-[#dfe5df] bg-white pl-12 pr-12 text-[14px] text-[#142019] outline-none transition-all placeholder:text-[#adb5b0] hover:border-[#c9d3ca] focus:border-[#315c42] focus:ring-4 focus:ring-[#315c42]/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        disabled={anyLoading}
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-[#9ba69f] transition-colors hover:bg-[#f1f4f0] hover:text-[#315c42] disabled:pointer-events-none"
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
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
                      Your sign-in is protected with a secure,
                      httpOnly session. Your password is never
                      stored in plain text.
                    </p>
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    disabled={
                      anyLoading ||
                      !email.trim() ||
                      !password
                    }
                    className="group relative mt-6 flex h-[58px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#10291d] text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_15px_35px_rgba(16,41,29,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#183c29] hover:shadow-[0_18px_40px_rgba(16,41,29,0.22)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-2.5">

                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          Signing in
                        </>
                      ) : (
                        <>
                          Sign in

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

              {/* Register */}

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                }}
                className="mt-8 text-center"
              >
                <p className="text-[13px] text-[#7b867f]">
                  Don't have an account?{" "}

                  <Link
                    href="/register"
                    className="font-semibold text-[#315c42] transition-colors hover:text-[#1c402b]"
                  >
                    Create one
                  </Link>
                </p>
              </motion.div>

              {/* Mobile security */}

              <div className="mt-10 flex items-center justify-center gap-2 text-[#9ba49e] lg:hidden">
                <ShieldCheck size={14} />

                <span className="text-[10px] uppercase tracking-[0.16em]">
                  Secure authentication
                </span>
              </div>

              {/* Back home */}

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
    </>
  );
}