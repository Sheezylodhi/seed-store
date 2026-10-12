
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Truck,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";

const shippingDetails = [
  {
    number: "01",
    title: "Order Processing",
    description:
      "Orders are generally processed within 1–3 business days. Processing times may vary depending on order volume and product availability.",
    detail: "1–3 business days",
  },
  {
    number: "02",
    title: "Delivery Time",
    description:
      "Orders within Pakistan typically arrive within 3–7 business days after dispatch. Delivery may take longer due to courier services, weather, or other unforeseen circumstances.",
    detail: "3–7 business days after dispatch",
  },
  {
    number: "03",
    title: "Shipping Charges",
    description:
      "Applicable delivery charges will be displayed at checkout or confirmed before dispatch. Free shipping applies only to eligible products or offers.",
    detail: "Shown at checkout or before dispatch",
  },
  {
    number: "04",
    title: "Order Confirmation",
    description:
      "For Cash on Delivery orders, we may contact you to confirm your order details before dispatch. Please ensure your phone number is reachable.",
    detail: "COD orders may require confirmation",
  },
  {
    number: "05",
    title: "Order Tracking",
    description:
      "Tracking details will be shared where available so you can follow your shipment. Tracking availability depends on the courier service.",
    detail: "Tracking shared where available",
  },
  {
    number: "06",
    title: "Delivery Information",
    description:
      "Please provide a complete and accurate delivery address, contact number, and any useful location details when placing your order.",
    detail: "Accurate address and phone number",
  },
];

const deliveryNotes = [
  {
    title: "Delivery delays",
    description:
      "While we aim to meet the estimated delivery window, delays may occur due to courier operations, weather conditions, or other unforeseen circumstances.",
  },
  {
    title: "Accurate delivery details",
    description:
      "Customers are responsible for providing accurate delivery information. Please double-check your address and contact number before submitting your order.",
  },
  {
    title: "Tracking updates",
    description:
      "Where tracking is available, we will share the relevant details to help you follow your order after dispatch.",
  },
];

export default function ShippingPolicyPage() {
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
                <Truck size={16} strokeWidth={1.5} />
                Customer information
              </div>

              <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Shipping Policy
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-[#69756b] sm:text-lg sm:leading-9">
                Every order matters to us. At SEEDRA by Dr. Hira, we aim to
                deliver your purchases safely and on time, with clear
                information at every step of the journey.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-[#e5eade] pt-6">
              <div>
                <p className="text-xs text-[#879184]">Order processing</p>
                <p className="mt-1 font-serif text-2xl text-[#315c42]">
                  1–3 business days
                </p>
              </div>

              <div>
                <p className="text-xs text-[#879184]">Estimated delivery</p>
                <p className="mt-1 font-serif text-2xl text-[#315c42]">
                  3–7 business days
                </p>
              </div>

              <p className="max-w-xs self-end text-xs leading-6 text-[#879184]">
                Delivery estimates apply after dispatch and are not guaranteed.
              </p>
            </div>
          </div>
        </section>

        {/* POLICY CONTENT */}
        <section
          id="shipping-details"
          className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
        >
          <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78936b]">
                In this policy
              </p>

              <nav className="mt-5 space-y-3">
                {shippingDetails.map((item) => (
                  <a
                    key={item.number}
                    href={`#shipping-${item.number}`}
                    className="block text-sm text-[#718071] transition hover:text-[#234636]"
                  >
                    <span className="mr-2 text-xs text-[#a0ad96]">
                      {item.number}
                    </span>
                    {item.title}
                  </a>
                ))}

                <a
                  href="#delivery-notes"
                  className="block text-sm text-[#718071] transition hover:text-[#234636]"
                >
                  <span className="mr-2 text-xs text-[#a0ad96]">07</span>
                  Important information
                </a>
              </nav>
            </aside>

            <div className="min-w-0">
              <div className="max-w-2xl">
                <p className="text-sm leading-8 text-[#718071]">
                  Here is what to know about processing, delivery, charges,
                  and receiving your SEEDRA order.
                </p>
              </div>

              <div className="mt-8 border-t border-[#dfe6d8]">
                {shippingDetails.map((item) => (
                  <article
                    key={item.number}
                    id={`shipping-${item.number}`}
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

                        <p className="mt-4 text-xs font-medium leading-6 text-[#557453]">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* IMPORTANT INFORMATION */}
              <section id="delivery-notes" className="scroll-mt-28 pt-12">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78936b]">
                  Please keep in mind
                </p>

                <h2 className="mt-4 font-serif text-3xl tracking-[-0.035em] text-[#234636] sm:text-4xl">
                  Important delivery information
                </h2>

                <div className="mt-7 border-t border-[#dfe6d8]">
                  {deliveryNotes.map((note, index) => (
                    <article
                      key={note.title}
                      className="grid gap-2 border-b border-[#e5eade] py-6 sm:grid-cols-[210px_minmax(0,1fr)] sm:gap-8"
                    >
                      <h3 className="text-sm font-semibold text-[#315c42]">
                        {note.title}
                      </h3>

                      <p className="text-sm leading-8 text-[#69756b]">
                        {note.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              {/* CONTACT */}
              <section className="mt-14 border-t-2 border-[#234636] pt-8 sm:mt-16 sm:pt-10">
                <div className="flex items-start gap-4">
                  <Headphones
                    size={23}
                    strokeWidth={1.5}
                    className="mt-1 shrink-0 text-[#557453]"
                  />

                  <div>
                    <h2 className="font-serif text-2xl text-[#234636] sm:text-3xl">
                      Questions about your delivery?
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-8 text-[#69756b]">
                      If you have a question about shipping or your order has
                      been delayed, please contact us through our official
                      customer support channels. We will be happy to help.
                    </p>

                    <Link
                      href="/contact"
                      className="mt-5 inline-flex items-center gap-2 border-b border-[#8ba17b] pb-1 text-sm font-semibold text-[#315c42] transition hover:gap-4"
                    >
                      Contact our team
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

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
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}