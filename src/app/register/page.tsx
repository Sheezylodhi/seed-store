"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState<
    "register" | "verify"
  >("register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cooldown, setCooldown] = useState(0);

  const startCooldown = () => {
    setCooldown(60);

    const interval = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);
  };

  async function handleRegister(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to create your account."
        );
        return;
      }

      setStep("verify");

      setSuccess(
        "We've sent a 6-digit verification code to your email."
      );

      startCooldown();
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!/^\d{6}$/.test(otp)) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid verification code."
        );
        return;
      }

      setSuccess(
        "Account created successfully. Redirecting..."
      );

      window.location.href = "/account";
    } catch {
      setError(
        "Unable to verify your email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || resending) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      setResending(true);

      const response = await fetch(
        "/api/auth/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to resend the code."
        );
        return;
      }

      setSuccess(
        "A new verification code has been sent."
      );

      startCooldown();
      setOtp("");
    } catch {
      setError(
        "Unable to resend the verification code."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f6ef] text-[#234636]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <section className="relative hidden overflow-hidden bg-[#234636] lg:flex">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white" />
            <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full border border-white" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-14 xl:p-20">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-tight text-white"
            >
              SeedStore
            </Link>

            <div className="max-w-xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
                <Sparkles
                  size={15}
                />
                A healthier routine starts here
              </div>

              <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white xl:text-6xl">
                Build your account.
                <br />
                Start your ritual.
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-8 text-white/65">
                Create your SeedStore account to
                manage orders, track deliveries and
                keep your seed cycling journey
                beautifully organized.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Easy order tracking",
                  "Secure account protection",
                  "Personalized shopping experience",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-white/85"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                      <Check size={15} />
                    </span>

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} SeedStore
            </p>
          </div>
        </section>

        {/* Right Side */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 lg:hidden">
              <Link
                href="/"
                className="text-2xl font-semibold tracking-tight"
              >
                SeedStore
              </Link>
            </div>

            {step === "register" ? (
              <>
                <div className="mb-9">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234636] text-white">
                    <Sparkles size={21} />
                  </div>

                  <h2 className="text-3xl font-semibold tracking-tight">
                    Create your account
                  </h2>

                  <p className="mt-3 leading-6 text-[#747970]">
                    Join SeedStore and make your
                    shopping experience simpler.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleRegister}
                  className="space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Full name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Your full name"
                      autoComplete="name"
                      className="h-14 w-full rounded-2xl border border-[#dedbd0] bg-white px-4 outline-none transition placeholder:text-[#aaa89f] focus:border-[#234636]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c8f88]"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(
                            event.target.value
                          )
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="h-14 w-full rounded-2xl border border-[#dedbd0] bg-white pl-11 pr-4 outline-none transition placeholder:text-[#aaa89f] focus:border-[#234636]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Phone
                      <span className="ml-1 text-xs text-[#999]">
                        optional
                      </span>
                    </label>

                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value
                        )
                      }
                      placeholder="+92 300 1234567"
                      autoComplete="tel"
                      className="h-14 w-full rounded-2xl border border-[#dedbd0] bg-white px-4 outline-none transition placeholder:text-[#aaa89f] focus:border-[#234636]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(event) =>
                          setPassword(
                            event.target.value
                          )
                        }
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        className="h-14 w-full rounded-2xl border border-[#dedbd0] bg-white px-4 pr-12 outline-none transition placeholder:text-[#aaa89f] focus:border-[#234636]"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) => !value
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777]"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Confirm password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={
                          confirmPassword
                        }
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        className="h-14 w-full rounded-2xl border border-[#dedbd0] bg-white px-4 pr-12 outline-none transition placeholder:text-[#aaa89f] focus:border-[#234636]"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) => !value
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#234636] px-5 font-medium text-white transition hover:bg-[#315c45] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-7 flex items-center justify-center gap-2 text-sm text-[#747970]">
                  <span>
                    Already have an account?
                  </span>

                  <Link
                    href="/login"
                    className="font-semibold text-[#234636] hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="mb-9">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234636] text-white">
                    <ShieldCheck size={22} />
                  </div>

                  <h2 className="text-3xl font-semibold tracking-tight">
                    Verify your email
                  </h2>

                  <p className="mt-3 leading-6 text-[#747970]">
                    We sent a 6-digit verification
                    code to
                  </p>

                  <p className="mt-1 break-all font-medium text-[#234636]">
                    {email}
                  </p>
                </div>

                {error && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">
                    {success}
                  </div>
                )}

                <form
                  onSubmit={handleVerify}
                  className="space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Verification code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(event) =>
                        setOtp(
                          event.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="000000"
                      autoComplete="one-time-code"
                      className="h-16 w-full rounded-2xl border border-[#dedbd0] bg-white px-4 text-center text-2xl font-semibold tracking-[0.45em] outline-none transition placeholder:text-[#bbb9b0] focus:border-[#234636]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      otp.length !== 6
                    }
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#234636] px-5 font-medium text-white transition hover:bg-[#315c45] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & create account
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-7 text-center">
                  <p className="text-sm text-[#747970]">
                    Didn't receive the code?
                  </p>

                  <button
                    type="button"
                    disabled={
                      cooldown > 0 ||
                      resending
                    }
                    onClick={handleResend}
                    className="mt-2 text-sm font-semibold text-[#234636] disabled:cursor-not-allowed disabled:text-[#999]"
                  >
                    {resending
                      ? "Sending..."
                      : cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : "Resend verification code"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep("register");
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                  className="mt-5 w-full text-sm text-[#747970] hover:text-[#234636]"
                >
                  ← Back to registration
                </button>
              </>
            )}

            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-[#99978f]">
              <ShieldCheck size={14} />
              Your account information is securely protected.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}