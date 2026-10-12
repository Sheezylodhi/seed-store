
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";

const returnSections = [
  {
    number: "01",
    title: "Eligible Returns",
    description:
      "Damaged, defective, or incorrect products may qualify for a return, replacement, or refund.",
  },
  {
    number: "02",
    title: "Reporting Issues",
    description:
      "Please contact us within 48 hours of delivery with your order details and photographs, if applicable. This reporting period does not limit any rights provided by law.",
  },
  {
    number: "03",
    title: "Product Condition",
    description:
      "Approved returns should generally be unused and in their original packaging.",
  },
  {
    number: "04",
    title: "Health and Personal-Care Products",
    description:
      "Opened or used products may not qualify for return due to hygiene and safety reasons, subject to applicable law.",
  },
  {
    number: "05",
    title: "Refunds",
    description:
      "Approved refunds will be processed using an appropriate payment method. Processing times may vary.",
  },
  {
    number: "06",
    title: "Order Cancellation",
    description:
      "Contact us as soon as possible. Cancellation may not be possible after dispatch.",
  },
];

export default function ReturnRefundPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#fafbf7] text-[#18372a]">
        {/* PAGE HEADER */}
        <section className="border-b border-[#e5eade]">
          <div className="mx-auto max-w-[1100px] px-5 pb-14 pt-8 sm:px-8 sm:pb-20 lg:px-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#718071] transition hover:text-[#234636]"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>

            <div className="mt-14 max-w-3xl sm:mt-20">
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6d8b60]">
                <RotateCcw size={15} strokeWidth={1.5} />
                Customer information
              </div>

              <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Return &amp; Refund
                <br />
                <span className="italic font-normal text-[#78936b]">
                  Policy
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-[#69756b] sm:text-lg sm:leading-9">
                At SEEDRA by Dr. Hira, we care about product quality and
                customer satisfaction.
              </p>
            </div>
          </div>
        </section>

        {/* POLICY CONTENT */}
        <section className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
            {/* CONTENTS NAVIGATION */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78936b]">
                In this policy
              </p>

              <nav className="mt-5 space-y-4">
                {returnSections.map((item) => (
                  <a
                    key={item.number}
                    href={`#return-${item.number}`}
                    className="block text-sm leading-6 text-[#718071] transition hover:text-[#234636]"
                  >
                    <span className="mr-2 text-xs text-[#a0ad96]">
                      {item.number}
                    </span>
                    {item.title}
                  </a>
                ))}

                <a
                  href="#return-requests"
                  className="block text-sm leading-6 text-[#718071] transition hover:text-[#234636]"
                >
                  <span className="mr-2 text-xs text-[#a0ad96]">07</span>
                  Request a return or refund
                </a>
              </nav>
            </aside>

            {/* POLICY SECTIONS */}
            <div className="min-w-0">
              <div className="border-t border-[#dfe6d8]">
                {returnSections.map((item) => (
                  <article
                    key={item.number}
                    id={`return-${item.number}`}
                    className="scroll-mt-28 border-b border-[#e5eade] py-7 sm:py-8"
                  >
                    <div className="grid gap-3 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-5">
                      <span className="pt-1 font-serif text-lg text-[#8ba17b]">
                        {item.number}
                      </span>

                      <div>
                        <h2 className="font-serif text-2xl tracking-[-0.02em] text-[#234636] sm:text-[27px]">
                          {item.title}
                        </h2>

                        <p className="mt-3 text-sm leading-8 text-[#69756b] sm:text-[15px]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* CONTACT AND CUSTOMER RIGHTS */}
              <section
                id="return-requests"
                className="scroll-mt-28 pt-10 sm:pt-12"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78936b]">
                  Need assistance?
                </p>

                <h2 className="mt-4 font-serif text-3xl tracking-[-0.035em] text-[#234636] sm:text-4xl">
                  Request a return or refund
                </h2>

                <p className="mt-5 text-sm leading-8 text-[#69756b] sm:text-[15px]">
                  To request a return or refund, contact our customer support
                  team with your order number and details of the issue.
                </p>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 border-b border-[#8ba17b] pb-2 text-sm font-semibold text-[#315c42] transition hover:gap-4"
                >
                  Contact our team
                  <ArrowRight size={16} />
                </Link>

                <p className="mt-9 border-l-2 border-[#b8ce9e] py-1 pl-5 text-sm leading-8 text-[#557453]">
                  Your rights under applicable consumer protection laws remain
                  unaffected.
                </p>
              </section>

              {/* FOOTER DETAILS */}
              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#e5eade] pt-6">
                <p className="font-serif text-lg italic text-[#6d8b60]">
                  SEEDRA by Dr. Hira
                </p>

                <Link
                  href="/"
                  className="text-sm text-[#718071] transition hover:text-[#234636]"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}