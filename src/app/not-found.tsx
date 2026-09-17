import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8faf7] px-5 py-10">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#315c42]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[460px] w-[460px] rounded-full bg-[#c5dda8]/20 blur-[110px]" />

      {/* Subtle decorative circles */}
      <div className="pointer-events-none absolute left-[8%] top-[18%] hidden h-20 w-20 rounded-full border border-[#315c42]/[0.07] sm:block" />
      <div className="pointer-events-none absolute bottom-[18%] right-[10%] hidden h-28 w-28 rounded-full border border-[#315c42]/[0.06] sm:block" />

      <section className="relative w-full max-w-[760px] text-center">
        {/* Brand mark */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#315c42]/10 bg-white shadow-[0_15px_40px_rgba(20,40,27,0.08)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#10291d] text-[#c5dda8]">
            <Leaf size={17} strokeWidth={1.8} />
          </div>
        </div>

        {/* Eyebrow */}
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#315c42]/10 bg-white px-3.5 py-2 shadow-[0_8px_25px_rgba(20,40,27,0.045)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#315c42]" />
          <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#6f7b72]">
            Page not found
          </span>
        </div>

        {/* 404 */}
        <div className="relative mt-5">
          <p
            aria-hidden="true"
            className="select-none text-[120px] font-black leading-none tracking-[-0.09em] text-[#10291d]/[0.055] sm:text-[170px] lg:text-[210px]"
          >
            404
          </p>

          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-[34px] font-bold tracking-[-0.055em] text-[#10291d] sm:text-[46px] lg:text-[52px]">
              This page wandered off.
            </h1>
          </div>
        </div>

        {/* Description */}
        <p className="mx-auto mt-1 max-w-[500px] text-[13px] leading-6 text-[#7a847d] sm:text-[14px]">
          The page you&apos;re looking for doesn&apos;t exist, may have moved,
          or is no longer available.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-[14px] bg-[#10291d] px-5 text-[11px] font-bold text-white shadow-[0_14px_30px_rgba(16,41,29,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#173a28] hover:shadow-[0_18px_38px_rgba(16,41,29,0.2)]"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.9}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to home
          </Link>

          <Link
            href="/shop"
            className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-[14px] border border-[#dce5dc] bg-white px-5 text-[11px] font-bold text-[#315c42] shadow-[0_10px_28px_rgba(20,40,27,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#cbd9cc] hover:shadow-[0_16px_34px_rgba(20,40,27,0.08)]"
          >
            Explore the shop
            <ArrowUpRight
              size={14}
              strokeWidth={1.9}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Bottom detail */}
        <div className="mx-auto mt-10 flex max-w-[430px] items-center justify-center gap-3">
          <span className="h-px flex-1 bg-[#315c42]/10" />

          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#a2aba4]">
            Seedra
          </span>

          <span className="h-px flex-1 bg-[#315c42]/10" />
        </div>
      </section>
    </main>
  );
}

