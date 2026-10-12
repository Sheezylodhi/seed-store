
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";

const privacySections = [
  {
    number: "01",
    title: "Information We Collect",
    description:
      "We may collect your name, contact details, delivery address, order information, payment status, and website usage data when you interact with our store or place an order.",
    points: [
      "Personal and contact details",
      "Delivery and order information",
      "Payment status and transaction-related details",
      "Website usage and interaction data",
    ],
  },
  {
    number: "02",
    title: "How We Use Your Information",
    description:
      "Your information helps us provide a smooth and reliable shopping experience. We use it only as needed for our business operations and customer service.",
    points: [
      "Process and manage your orders",
      "Arrange deliveries and provide support",
      "Send important order-related updates",
      "Understand and improve our website",
    ],
  },
  {
    number: "03",
    title: "Information Sharing",
    description:
      "We may share relevant information with trusted service providers when necessary to operate our business and fulfill your requests.",
    points: [
      "Shopify and relevant store service providers",
      "Courier companies for order delivery",
      "Payment providers for payment processing",
      "Other providers supporting essential operations",
    ],
  },
  {
    number: "04",
    title: "Cookies & Website Usage",
    description:
      "Our website may use cookies and similar technologies to improve your shopping experience, remember relevant preferences, and understand website activity.",
    points: [
      "Support essential website functionality",
      "Improve navigation and shopping convenience",
      "Help us understand website performance",
    ],
  },
  {
    number: "05",
    title: "Data Protection",
    description:
      "We take reasonable steps to protect your personal information against unauthorized access, misuse, alteration, or disclosure.",
    points: [
      "Apply reasonable security measures",
      "Limit information use to relevant purposes",
      "Retain information only as needed for business or legal purposes",
    ],
  },
  {
    number: "06",
    title: "Your Privacy Choices",
    description:
      "Subject to applicable law, you may request access to your personal information, ask us to correct inaccurate details, or request its deletion.",
    points: [
      "Request access to your personal information",
      "Ask for corrections to inaccurate details",
      "Request deletion where applicable",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fafbf7] text-[#18372a]">
        {/* PAGE HEADER */}
        <section className="border-b border-[#e5eade] bg-white">
          <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#718071] transition-colors hover:text-[#234636]"
            >
              <ArrowLeft size={16} />
              Back to home
            </Link>

            <div className="mt-10 max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6d8b60] sm:text-xs">
                SEEDRA by Dr. Hira
              </p>

              <h1 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.045em] text-[#18372a] sm:text-5xl lg:text-6xl">
                Privacy Policy
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#69756b] sm:text-base sm:leading-8">
                Your trust matters to us. At SEEDRA by Dr. Hira, we respect
                your privacy and are committed to handling your personal
                information with care, transparency, and responsibility.
              </p>

              <p className="mt-5 border-l-2 border-[#9cb48d] pl-4 text-sm leading-7 text-[#526a54]">
                When you browse our website, contact us, or place an order, you
                may share information that helps us serve you. We understand
                that this information is personal, and we take our
                responsibility to handle it carefully.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#718071]">
                This Privacy Policy explains the types of information we may
                collect, how we use it, when it may be shared, and the choices
                available to you regarding your personal information.
              </p>
            </div>
          </div>
        </section>

        {/* POLICY CONTENT */}
        <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
            {/* CONTENT GUIDE */}
            <aside className="h-fit border-b border-[#e2e8dc] pb-7 lg:sticky lg:top-28 lg:border-b-0 lg:pb-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#81917d]">
                On this page
              </p>

              <nav className="mt-5 flex flex-wrap gap-x-5 gap-y-3 lg:flex-col lg:gap-4">
                {privacySections.map((section) => (
                  <a
                    key={section.number}
                    href={`#section-${section.number}`}
                    className="text-sm text-[#69756b] transition-colors hover:text-[#234636]"
                  >
                    {section.number}. {section.title}
                  </a>
                ))}

                <a
                  href="#contact-privacy"
                  className="text-sm text-[#69756b] transition-colors hover:text-[#234636]"
                >
                  Contact
                </a>
              </nav>
            </aside>

            {/* LEGAL TEXT */}
            <div className="min-w-0">
              <div className="border-b border-[#e2e8dc] pb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6d8b60]">
                  Your information, explained
                </p>

                <h2 className="mt-3 font-serif text-2xl tracking-[-0.025em] text-[#18372a] sm:text-3xl">
                  How we handle your data
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#718071] sm:text-base sm:leading-8">
                  A straightforward overview of the information we may collect
                  and how it supports your shopping experience.
                </p>
              </div>

              <div>
                {privacySections.map((section) => (
                  <article
                    key={section.number}
                    id={`section-${section.number}`}
                    className="scroll-mt-28 border-b border-[#e2e8dc] py-8 sm:py-10"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="shrink-0 font-serif text-sm text-[#8ba17d]">
                        {section.number}
                      </span>

                      <h3 className="font-serif text-xl leading-snug tracking-[-0.02em] text-[#234636] sm:text-2xl">
                        {section.title}
                      </h3>
                    </div>

                    <div className="mt-4 pl-0 sm:pl-9">
                      <p className="text-sm leading-7 text-[#657365] sm:text-base sm:leading-8">
                        {section.description}
                      </p>

                      <ul className="mt-5 space-y-3">
                        {section.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-3 text-sm leading-7 text-[#657365] sm:text-[15px]"
                          >
                            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#8ba17d]" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>

              {/* PRIVACY PROMISE */}
              <section className="border-b border-[#e2e8dc] py-8 sm:py-10">
                <h3 className="font-serif text-xl leading-snug tracking-[-0.02em] text-[#234636] sm:text-2xl">
                  Our commitment to your privacy
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#657365] sm:text-base sm:leading-8">
                  We do not sell your personal information to third parties for
                  their independent marketing purposes.
                </p>

                <p className="mt-4 text-sm leading-7 text-[#657365] sm:text-base sm:leading-8">
                  We take reasonable steps to protect personal information and
                  keep it only for as long as necessary for business or legal
                  purposes.
                </p>

                <p className="mt-4 text-sm leading-7 text-[#657365] sm:text-base sm:leading-8">
                  Subject to applicable law, you may request access to your
                  personal information, ask us to correct inaccurate details,
                  or request its deletion.
                </p>
              </section>

              {/* CONTACT */}
              <section
                id="contact-privacy"
                className="scroll-mt-28 py-8 sm:py-10"
              >
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf3e7] text-[#426746]">
                    <Mail size={19} strokeWidth={1.6} />
                  </span>

                  <div>
                    <h3 className="font-serif text-xl tracking-[-0.02em] text-[#234636] sm:text-2xl">
                      Questions about your privacy?
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#657365] sm:text-base sm:leading-8">
                      If you have questions about this policy or want to make
                      a request regarding your personal information, please
                      reach out through our official customer support
                      channels.
                    </p>

                    <Link
                      href="/contact"
                      className="mt-5 inline-flex items-center gap-2 border-b border-[#8ba17d] pb-1 text-sm font-semibold text-[#315c42] transition-colors hover:border-[#234636] hover:text-[#18372a]"
                    >
                      Contact our team
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* SIMPLE CLOSING */}
        <section className="border-t border-[#e5eade] bg-white">
          <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 lg:px-12">
            <p className="font-serif text-lg italic text-[#6d8b60]">
              SEEDRA by Dr. Hira
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}