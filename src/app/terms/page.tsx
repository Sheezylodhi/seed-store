
import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";

const termsSections = [
  {
    number: "01",
    title: "Products",
    description:
      "We aim to provide accurate product descriptions, images, and prices. Availability and product presentation may change.",
  },
  {
    number: "02",
    title: "Orders and Payments",
    description:
      "Orders are subject to confirmation and availability. We may cancel orders for legitimate reasons, such as stock issues, pricing errors, or suspected fraud.",
  },
  {
    number: "03",
    title: "Shipping",
    description:
      "Delivery estimates are approximate and may vary. Please refer to our Shipping Policy for details.",
    link: {
      label: "Shipping Policy",
      href: "/shipping-policy",
    },
  },
  {
    number: "04",
    title: "Returns",
    description:
      "Returns and refunds are governed by our Return and Refund Policy and applicable law.",
    link: {
      label: "Return and Refund Policy",
      href: "/return-policy",
    },
  },
  {
    number: "05",
    title: "Health Disclaimer",
    description:
      "Information about seeds, nutrition, and wellness products is for general informational purposes and is not a substitute for professional medical advice. Follow product instructions and consult a qualified professional when needed.",
  },
  {
    number: "06",
    title: "Website Content",
    description:
      "Our website content, branding, and images may not be copied or used commercially without permission.",
  },
  {
    number: "07",
    title: "Privacy",
    description:
      "Personal information is handled according to our Privacy Policy.",
    link: {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
  },
  {
    number: "08",
    title: "Applicable Law",
    description:
      "These terms are subject to applicable laws of Pakistan, including mandatory consumer protection requirements.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#fafbf7] text-[#18372a]">
        {/* PAGE INTRODUCTION */}
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
                <FileText size={15} strokeWidth={1.5} />
                Legal information
              </div>

              <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Terms and
                <br />
                <span className="italic font-normal text-[#78936b]">
                  Conditions
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-[#69756b] sm:text-lg sm:leading-9">
                By accessing or purchasing from SEEDRA by Dr. Hira, you agree
                to the following terms.
              </p>
            </div>
          </div>
        </section>

        {/* TERMS CONTENT */}
        <section className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
            {/* CONTENTS NAVIGATION */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78936b]">
                In this document
              </p>

              <nav className="mt-5 space-y-4">
                {termsSections.map((item) => (
                  <a
                    key={item.number}
                    href={`#terms-${item.number}`}
                    className="block text-sm leading-6 text-[#718071] transition hover:text-[#234636]"
                  >
                    <span className="mr-2 text-xs text-[#a0ad96]">
                      {item.number}
                    </span>
                    {item.title}
                  </a>
                ))}

                <a
                  href="#terms-updates"
                  className="block text-sm leading-6 text-[#718071] transition hover:text-[#234636]"
                >
                  <span className="mr-2 text-xs text-[#a0ad96]">09</span>
                  Updates to these terms
                </a>

                <a
                  href="#terms-contact"
                  className="block text-sm leading-6 text-[#718071] transition hover:text-[#234636]"
                >
                  <span className="mr-2 text-xs text-[#a0ad96]">10</span>
                  Contact
                </a>
              </nav>
            </aside>

            {/* MAIN DOCUMENT */}
            <div className="min-w-0">
              <div className="border-t border-[#dfe6d8]">
                {termsSections.map((item) => (
                  <article
                    key={item.number}
                    id={`terms-${item.number}`}
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

                        {item.link && (
                          <Link
                            href={item.link.href}
                            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#557453] underline decoration-[#c5d4b9] underline-offset-4 transition hover:text-[#234636]"
                          >
                            {item.link.label}
                            <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* TERMS UPDATES */}
              <section
                id="terms-updates"
                className="scroll-mt-28 border-b border-[#e5eade] py-8 sm:py-9"
              >
                <div className="grid gap-3 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-5">
                  <span className="pt-1 font-serif text-lg text-[#8ba17b]">
                    09
                  </span>

                  <div>
                    <h2 className="font-serif text-2xl tracking-[-0.02em] text-[#234636] sm:text-[27px]">
                      Updates to these terms
                    </h2>

                    <p className="mt-3 text-sm leading-8 text-[#69756b] sm:text-[15px]">
                      We may update these terms when necessary. Any changes
                      will be published on this page.
                    </p>
                  </div>
                </div>
              </section>

              {/* CONTACT */}
              <section
                id="terms-contact"
                className="scroll-mt-28 pt-9 sm:pt-10"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78936b]">
                  Need clarification?
                </p>

                <h2 className="mt-4 font-serif text-3xl tracking-[-0.035em] text-[#234636] sm:text-4xl">
                  Questions about these terms?
                </h2>

                <p className="mt-5 text-sm leading-8 text-[#69756b] sm:text-[15px]">
                  For questions, please contact our customer support team.
                </p>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-2 border-b border-[#8ba17b] pb-2 text-sm font-semibold text-[#315c42] transition hover:gap-4"
                >
                  Contact our team
                  <ArrowRight size={16} />
                </Link>
              </section>

              {/* DOCUMENT FOOTER */}
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