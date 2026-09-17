"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

// Adjust these two import paths if your components live elsewhere.
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";

const topics = [
  "Product question",
  "Order support",
  "Shipping & delivery",
  "Seed cycling guidance",
  "Wholesale / partnership",
  "Other",
];

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@seedra.com",
    href: "mailto:hello@seedra.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+92 300 0000000",
    href: "tel:+923000000000",
  },
  {
    icon: Clock3,
    label: "Response time",
    value: "Usually within 24 hours",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const finalSubject =
        form.subject.trim() || topic.trim() || undefined;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          subject: finalSubject,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to send your message."
        );
      }

      setSuccess(true);

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTopic("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f6ef] text-[#234636]">
      <Navbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-40">
          {/* Decorative atmosphere */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-15%] top-[8%] h-[500px] w-[500px] rounded-full bg-[#315c45]/[0.055] blur-[100px]" />
            <div className="absolute right-[-12%] top-[15%] h-[450px] w-[450px] rounded-full bg-[#b9a886]/[0.09] blur-[110px]" />

            <div className="absolute inset-x-0 top-0 h-px bg-[#234636]/10" />

            <div className="absolute left-1/2 top-24 hidden h-[520px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#234636]/[0.07] to-transparent lg:block" />
          </div>

          <div className="relative mx-auto max-w-[1400px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mx-auto max-w-5xl text-center"
            >
              {/* Eyebrow */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#234636]/10 bg-white/60 px-4 py-2.5 shadow-[0_10px_35px_rgba(35,70,54,0.04)] backdrop-blur-xl">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#234636] text-white">
                  <Sparkles className="h-2.5 w-2.5" />
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#315c45] sm:text-[11px]">
                  A conversation starts here
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-[3.7rem] font-medium leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-[7.6rem]">
                We&apos;re here
                <span className="block font-serif italic font-normal text-[#315c45]">
                  to listen.
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-7 text-[#747970] sm:text-lg sm:leading-8">
                Questions about your routine, your order, or finding the
                right Seedra product? Tell us what&apos;s on your mind.
                We&apos;ll take it from there.
              </p>

              {/* Trust line */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-[#747970]">
                <TrustPoint text="Personal support" />
                <TrustPoint text="Thoughtful guidance" />
                <TrustPoint text="Usually within 24 hours" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================================
            CONTACT / FORM
        ========================================================= */}
        <section className="relative px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
              {/* LEFT CONTACT PANEL */}
              <motion.aside
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75 }}
                className="relative overflow-hidden rounded-[2rem] bg-[#1c392b] p-7 text-white sm:p-9 lg:min-h-[700px] lg:p-11"
              >
                {/* Texture / glow */}
                <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#7f9b87]/20 blur-[90px]" />

                <div className="pointer-events-none absolute bottom-[-15%] left-[-20%] h-96 w-96 rounded-full border border-white/[0.05]" />
                <div className="pointer-events-none absolute bottom-[-10%] left-[-15%] h-72 w-72 rounded-full border border-white/[0.05]" />

                <div className="relative z-10 flex h-full flex-col">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                      Get in touch
                    </p>

                    <h2 className="mt-5 max-w-md text-4xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-5xl">
                      Good questions
                      <span className="block font-serif italic font-normal text-[#b9c9bd]">
                        deserve good answers.
                      </span>
                    </h2>

                    <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
                      Whether you&apos;re discovering Seedra for the first
                      time or you&apos;ve been part of our journey for a
                      while, we&apos;re always happy to help.
                    </p>
                  </div>

                  <div className="mt-12 space-y-3">
                    {contactDetails.map((item, index) => {
                      const Icon = item.icon;

                      const content = (
                        <div className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-sm transition duration-300 hover:border-white/[0.15] hover:bg-white/[0.06]">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-[#d4dfd7]">
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                              {item.label}
                            </p>

                            <p className="mt-1 truncate text-sm font-medium text-white/85">
                              {item.value}
                            </p>
                          </div>

                          {index < 2 && (
                            <ArrowRight className="ml-auto h-4 w-4 text-white/20 transition duration-300 group-hover:translate-x-1 group-hover:text-white/60" />
                          )}
                        </div>
                      );

                      return item.href ? (
                        <a key={item.label} href={item.href}>
                          {content}
                        </a>
                      ) : (
                        <div key={item.label}>{content}</div>
                      );
                    })}
                  </div>

                  <div className="mt-auto pt-12">
                    <div className="border-t border-white/[0.09] pt-7">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#b9c9bd]" />

                        <div>
                          <p className="text-xs font-semibold text-white/80">
                            Seedra support
                          </p>

                          <p className="mt-1 max-w-xs text-xs leading-5 text-white/40">
                            We&apos;re here to make your experience
                            simpler, clearer, and more personal.
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/#faq"
                        className="group mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/75 transition hover:text-white"
                      >
                        Explore FAQs
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.aside>

              {/* RIGHT FORM */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, delay: 0.08 }}
                className="relative overflow-hidden rounded-[2rem] border border-[#234636]/10 bg-white shadow-[0_30px_100px_rgba(35,70,54,0.08)]"
              >
                {/* top accent */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#315c45] to-transparent opacity-70" />

                {success ? (
                  <SuccessState />
                ) : (
                  <div className="p-6 sm:p-9 lg:p-12 xl:p-14">
                    {/* Form heading */}
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#315c45]">
                          Send a message
                        </p>

                        <h2 className="mt-3 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                          How can we help?
                        </h2>
                      </div>

                      <div className="hidden items-center gap-2 text-xs text-[#747970] sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#315c45]" />
                        Your details stay private
                      </div>
                    </div>

                    <div className="mt-5 h-px bg-[#234636]/[0.08]" />

                    <p className="mt-6 max-w-xl text-sm leading-6 text-[#747970]">
                      Share a few details below. The more you tell us, the
                      better we can help.
                    </p>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
                      >
                        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                        {error}
                      </motion.div>
                    )}

                    <form
                      onSubmit={handleSubmit}
                      className="mt-8 space-y-6"
                    >
                      <div className="grid gap-6 sm:grid-cols-2">
                        <LuxuryField
                          label="Full name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                        />

                        <LuxuryField
                          label="Email address"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                        />
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <LuxuryField
                          label="Phone number"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+92 3XX XXXXXXX"
                        />

                        <div>
                          <label className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#566259]">
                            Topic
                          </label>

                          <div className="relative">
                            <select
                              value={topic}
                              onChange={(e) =>
                                setTopic(e.target.value)
                              }
                              className="h-[52px] w-full appearance-none rounded-xl border border-[#234636]/10 bg-[#fafbf8] px-4 pr-10 text-sm text-[#234636] outline-none transition duration-200 focus:border-[#315c45]/50 focus:bg-white focus:ring-4 focus:ring-[#315c45]/[0.07]"
                            >
                              <option value="">
                                Select a topic
                              </option>

                              {topics.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>

                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#747970]">
                              <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                            </span>
                          </div>
                        </div>
                      </div>

                      <LuxuryField
                        label="Subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                      />

                      <div>
                        <label className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#566259]">
                          Your message
                        </label>

                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={7}
                          maxLength={5000}
                          placeholder="Tell us how we can help..."
                          className="w-full resize-none rounded-2xl border border-[#234636]/10 bg-[#fafbf8] px-4 py-4 text-sm leading-6 text-[#234636] outline-none transition duration-200 placeholder:text-[#8b938c] focus:border-[#315c45]/50 focus:bg-white focus:ring-4 focus:ring-[#315c45]/[0.07]"
                        />

                        <div className="mt-2 flex justify-end text-[10px] tracking-wide text-[#8b938c]">
                          {form.message.length} / 5000
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          type="submit"
                          disabled={loading}
                          className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-[#234636] text-sm font-semibold text-white transition duration-300 hover:bg-[#315c45] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {/* Hover sweep */}
                          <span className="absolute inset-y-0 -left-24 w-20 skew-x-[-18deg] bg-white/10 transition-all duration-700 group-hover:left-[110%]" />

                          {loading ? (
                            <span className="relative flex items-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                              Sending your message...
                            </span>
                          ) : (
                            <span className="relative flex items-center gap-2">
                              Send message
                              <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          )}
                        </button>
                      </div>

                      <div className="flex items-start gap-3 border-t border-[#234636]/[0.07] pt-5">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#315c45]" />

                        <p className="text-[11px] leading-5 text-[#747970]">
                          By submitting this form, you agree that Seedra
                          may use the information you provide to respond
                          to your enquiry.
                        </p>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* =========================================================
            FAQ / SUPPORT CTA
        ========================================================= */}
        <section className="relative border-t border-[#234636]/[0.08] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#315c45]/[0.035] blur-[100px]" />

          <div className="relative mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#234636] text-white shadow-[0_12px_30px_rgba(35,70,54,0.16)]">
                <MessageCircle className="h-5 w-5" />
              </div>

              <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#315c45]">
                Need a quick answer?
              </p>

              <h2 className="mt-4 text-4xl font-medium tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                You might find it in our
                <span className="block font-serif italic font-normal text-[#315c45]">
                  frequently asked questions.
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#747970] sm:text-base">
                Browse answers about products, orders, shipping, seed
                cycling, and more.
              </p>

              <Link
                href="/#faq"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#234636] px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#315c45]"
              >
                Visit FAQs
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* =========================================================
   TRUST POINT
========================================================= */

function TrustPoint({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-[#315c45]" />
      {text}
    </span>
  );
}

/* =========================================================
   LUXURY INPUT
========================================================= */

function LuxuryField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const maxLength =
    name === "name"
      ? 100
      : name === "email"
        ? 150
        : name === "phone"
          ? 30
          : 200;

  return (
    <div>
      <label className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#566259]">
        {label}
        {required && (
          <span className="ml-1 text-[#315c45]">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="h-[52px] w-full rounded-xl border border-[#234636]/10 bg-[#fafbf8] px-4 text-sm text-[#234636] outline-none transition duration-200 placeholder:text-[#8b938c] focus:border-[#315c45]/50 focus:bg-white focus:ring-4 focus:ring-[#315c45]/[0.07]"
      />
    </div>
  );
}

/* =========================================================
   SUCCESS
========================================================= */

function SuccessState() {
  return (
    <div className="flex min-h-[650px] flex-col items-center justify-center px-7 py-16 text-center sm:px-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-[-12px] rounded-full border border-[#315c45]/10" />

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#315c45]/10 text-[#315c45]">
          <CheckCircle2 className="h-9 w-9" />
        </div>
      </motion.div>

      <p className="mt-9 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#315c45]">
        Message received
      </p>

      <h2 className="mt-4 max-w-xl text-4xl font-medium leading-tight tracking-[-0.045em] sm:text-5xl">
        Thank you for reaching
        <span className="block font-serif italic font-normal text-[#315c45]">
          out to us.
        </span>
      </h2>

      <p className="mt-6 max-w-md text-sm leading-7 text-[#747970]">
        Your message is safely with our team. We&apos;ll review it and
        get back to you as soon as possible.
      </p>

      <div className="mt-8 flex items-center gap-2 rounded-full bg-[#f8f6ef] px-4 py-2.5 text-xs text-[#747970]">
        <Clock3 className="h-3.5 w-3.5 text-[#315c45]" />
        Usually within 24 hours
      </div>

      <Link
        href="/shop"
        className="group mt-9 inline-flex items-center gap-2 rounded-full bg-[#234636] px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#315c45]"
      >
        Continue exploring
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}