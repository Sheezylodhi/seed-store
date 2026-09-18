"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User,
  AlertCircle,
  Loader2,
  Truck,
  Sparkles,
  CreditCard,
  Upload,
  X,
  Banknote,
  Smartphone,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Other",
];

type PaymentMethod =
  | "cod"
  | "bank_transfer"
  | "jazzcash"
  | "easypaisa";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  notes: string;
};

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  postalCode: "",
  notes: "",
};

/*
|--------------------------------------------------------------------------
| PAYMENT DETAILS
|--------------------------------------------------------------------------
| Replace these placeholder values with the client's real details.
*/

const PAYMENT_DETAILS = {
  bank: {
    bankName: "Your Bank",
    accountName: "SeedStore",
    accountNumber: "XXXXXXXXXXXX",
    iban: "PK00XXXXXXXXXXXX",
  },

  jazzcash: {
    number: "03XX XXXXXXX",
    name: "SeedStore",
  },

  easypaisa: {
    number: "03XX XXXXXXX",
    name: "SeedStore",
  },
};

const paymentMethods: {
  id: PaymentMethod;
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay when your order arrives.",
    icon: <Banknote size={18} />,
  },

  {
    id: "bank_transfer",
    title: "Bank Transfer",
    description: "Transfer payment and upload proof.",
    icon: <CreditCard size={18} />,
  },

  {
    id: "jazzcash",
    title: "JazzCash",
    description: "Send payment through JazzCash.",
    icon: <Smartphone size={18} />,
  },

  {
    id: "easypaisa",
    title: "Easypaisa",
    description: "Send payment through Easypaisa.",
    icon: <Smartphone size={18} />,
  },
];

export default function CheckoutPage() {
  const router = useRouter();

  const {
    items,
    subtotal,
    coupon,
    couponDiscount,
    deliveryCharge,
    clearCart,
  } = useCart();

  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

  const [paymentScreenshot, setPaymentScreenshot] =
    useState<File | null>(null);

  const [screenshotPreview, setScreenshotPreview] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [openSection, setOpenSection] =
    useState<string | null>("contact");

  /*
  |--------------------------------------------------------------------------
  | TOTAL
  |--------------------------------------------------------------------------
  | Delivery comes directly from CartContext.
  | No hardcoded threshold or delivery amount.
  */

  const total = Math.max(
    subtotal - couponDiscount + deliveryCharge,
    0
  );

  const isManualPayment =
    paymentMethod !== "cod";

  /*
  |--------------------------------------------------------------------------
  | CLEANUP IMAGE PREVIEW
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (screenshotPreview) {
        URL.revokeObjectURL(screenshotPreview);
      }
    };
  }, [screenshotPreview]);

  /*
  |--------------------------------------------------------------------------
  | FIELD UPDATE
  |--------------------------------------------------------------------------
  */

  const updateField = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PAYMENT METHOD
  |--------------------------------------------------------------------------
  */

  const handlePaymentMethodChange = (
    method: PaymentMethod
  ) => {
    setPaymentMethod(method);

    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }

    setPaymentScreenshot(null);
    setScreenshotPreview(null);
    setErrorMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | SCREENSHOT
  |--------------------------------------------------------------------------
  */

  const handleScreenshotChange = (
    file: File | null
  ) => {
    setErrorMessage("");

    if (!file) {
      setPaymentScreenshot(null);
      setScreenshotPreview(null);
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setErrorMessage(
        "Please upload a JPG, PNG or WEBP image."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        "Payment screenshot must be smaller than 5MB."
      );
      return;
    }

    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setPaymentScreenshot(file);
    setScreenshotPreview(previewUrl);
  };

  const removeScreenshot = () => {
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }

    setPaymentScreenshot(null);
    setScreenshotPreview(null);
  };

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return "Please enter your first name.";
    }

    if (!formData.lastName.trim()) {
      return "Please enter your last name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (formData.phone.trim().length < 10) {
      return "Please enter a valid phone number.";
    }

    if (!formData.address.trim()) {
      return "Please enter your delivery address.";
    }

    if (!formData.city.trim()) {
      return "Please select your city.";
    }

    if (
      isManualPayment &&
      !paymentScreenshot
    ) {
      return "Please upload your payment screenshot.";
    }

    return "";
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT ORDER
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage(
        "Your cart is empty. Please add a product before checkout."
      );
      return;
    }

    const validationError =
      validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const body = new FormData();

      body.append(
        "customerInfo",
        JSON.stringify({
          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),
        })
      );

      body.append(
        "shippingAddress",
        JSON.stringify({
          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName.trim(),

          address:
            formData.address.trim(),

          apartment:
            formData.apartment.trim() ||
            undefined,

          city:
            formData.city.trim(),

          postalCode:
            formData.postalCode.trim() ||
            undefined,

          country: "Pakistan",

          phone:
            formData.phone.trim(),
        })
      );

      /*
      |--------------------------------------------------------------------------
      | IMPORTANT
      |--------------------------------------------------------------------------
      | We intentionally do NOT send deliveryCharge from the client.
      |
      | The server will read the real delivery settings from MongoDB.
      */

     body.append(
  "items",
  JSON.stringify(
    items.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId || null,
      quantity: item.quantity,
      packSize: item.packSize,
    }))
  )
);

      body.append(
        "paymentMethod",
        paymentMethod
      );

      body.append(
        "couponCode",
        coupon?.code || ""
      );

      body.append(
        "notes",
        formData.notes.trim()
      );

      /*
      |--------------------------------------------------------------------------
      | PAYMENT SCREENSHOT
      |--------------------------------------------------------------------------
      */

      if (paymentScreenshot) {
        body.append(
          "paymentScreenshot",
          paymentScreenshot
        );
      }

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          body,
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to place your order. Please try again."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | CLEAR CART ONLY AFTER SUCCESS
      |--------------------------------------------------------------------------
      */

      clearCart();

      router.push(
        `/order-confirmation?order=${encodeURIComponent(
          data.order.orderNumber
        )}`
      );
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setIsSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | EMPTY CART
  |--------------------------------------------------------------------------
  */

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f5ee] text-[#1d2b22]">
        <header className="border-b border-[#dfe3db] bg-[#f7f5ee]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
            <Link
              href="/"
              className="text-xl font-semibold tracking-[-0.04em]"
            >
              Seed
              <span className="text-[#52745d]">
                Store
              </span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#657168]">
              <Lock size={13} />
              Secure Checkout
            </div>
          </div>
        </header>

        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-20">
          <div className="w-full rounded-[32px] border border-[#dfe4dc] bg-white p-10 text-center shadow-[0_25px_80px_rgba(28,43,34,0.08)] sm:p-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef3ed]">
              <ShoppingBag
                size={30}
                strokeWidth={1.5}
                className="text-[#45644f]"
              />
            </div>

            <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#728078]">
              Checkout
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Your cart is empty.
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#6b756e]">
              Add something beautiful to your
              collection and return here when
              you're ready to place your order.
            </p>

            <Link
              href="/shop"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#294b39] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#1f3d2e]"
            >
              Explore the collection
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ee] text-[#1d2b22]">
      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#dfe3db] bg-[#f7f5ee]/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[-0.04em]"
          >
            Seed
            <span className="text-[#52745d]">
              Store
            </span>
          </Link>

          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#68736c] sm:text-xs">
            <Lock size={13} />
            Secure Checkout
          </div>
        </div>
      </header>

      {/* PAGE */}

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <Link
          href="/shop"
          className="group mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6c776f] transition hover:text-[#294b39]"
        >
          <ArrowLeft
            size={15}
            className="transition-transform group-hover:-translate-x-1"
          />
          Continue shopping
        </Link>

        {/* INTRO */}

        <div className="mb-12 max-w-3xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#8ba18f]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#718078]">
              Checkout
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Complete your
            <span className="block font-serif font-normal italic text-[#52745d]">
              order.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#6d766f] sm:text-base">
            A few details, then we'll take care
            of the rest. Your order will be
            prepared with care and delivered to
            your chosen address.
          </p>
        </div>

        {/* ERROR */}

        {errorMessage && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                We couldn't place your order.
              </p>

              <p className="mt-1 text-red-600">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_410px]"
        >
          {/* LEFT */}

          <div className="space-y-5">
            {/* CONTACT */}

            <section className="overflow-hidden rounded-[28px] border border-[#dfe4dc] bg-white shadow-[0_15px_50px_rgba(30,48,38,0.04)]">
              <button
                type="button"
                onClick={() =>
                  setOpenSection(
                    openSection === "contact"
                      ? null
                      : "contact"
                  )
                }
                className="flex w-full items-center justify-between px-6 py-6 text-left sm:px-8"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf2ed]">
                    <User
                      size={18}
                      strokeWidth={1.6}
                      className="text-[#45634f]"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a938d]">
                      01
                    </p>

                    <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em]">
                      Contact information
                    </h2>
                  </div>
                </div>

                {openSection === "contact" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {openSection === "contact" && (
                <div className="border-t border-[#edf0eb] px-6 pb-7 pt-7 sm:px-8">
                  <div className="mb-6 rounded-[22px] border border-[#d5e0d6] bg-[#f7faf6] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52745d]">
                          Order email
                        </p>

                        <p className="mt-1 text-sm text-[#667169]">
                          We'll send your order
                          confirmation and updates here.
                        </p>
                      </div>

                      <Lock
                        size={17}
                        className="mt-1 shrink-0 text-[#52745d]"
                      />
                    </div>

                    <InputField
                      label="Email address"
                      type="email"
                      value={formData.email}
                      onChange={(value) =>
                        updateField(
                          "email",
                          value
                        )
                      }
                      placeholder="you@example.com"
                      required
                    />

                    <p className="mt-3 text-xs text-[#7a847d]">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-semibold text-[#45634f] underline underline-offset-2 transition hover:text-[#294b39]"
                      >
                        Log in
                      </Link>
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="First name"
                      value={formData.firstName}
                      onChange={(value) =>
                        updateField(
                          "firstName",
                          value
                        )
                      }
                      required
                    />

                    <InputField
                      label="Last name"
                      value={formData.lastName}
                      onChange={(value) =>
                        updateField(
                          "lastName",
                          value
                        )
                      }
                      required
                    />

                    <InputField
                      label="Phone number"
                      type="tel"
                      value={formData.phone}
                      onChange={(value) =>
                        updateField(
                          "phone",
                          value
                        )
                      }
                      placeholder="03XX XXXXXXX"
                      required
                    />
                  </div>
                </div>
              )}
            </section>

            {/* ADDRESS */}

            <section className="overflow-hidden rounded-[28px] border border-[#dfe4dc] bg-white shadow-[0_15px_50px_rgba(30,48,38,0.04)]">
              <button
                type="button"
                onClick={() =>
                  setOpenSection(
                    openSection === "address"
                      ? null
                      : "address"
                  )
                }
                className="flex w-full items-center justify-between px-6 py-6 text-left sm:px-8"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf2ed]">
                    <MapPin
                      size={18}
                      strokeWidth={1.6}
                      className="text-[#45634f]"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a938d]">
                      02
                    </p>

                    <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em]">
                      Delivery address
                    </h2>
                  </div>
                </div>

                {openSection === "address" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {openSection === "address" && (
                <div className="border-t border-[#edf0eb] px-6 pb-7 pt-7 sm:px-8">
                  <div className="space-y-5">
                    <InputField
                      label="Street address"
                      value={formData.address}
                      onChange={(value) =>
                        updateField(
                          "address",
                          value
                        )
                      }
                      placeholder="House / building / street"
                      required
                    />

                    <InputField
                      label="Apartment, suite, etc."
                      value={formData.apartment}
                      onChange={(value) =>
                        updateField(
                          "apartment",
                          value
                        )
                      }
                      placeholder="Optional"
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-[#4e5b53]">
                          City{" "}
                          <span className="text-[#9b5f4f]">
                            *
                          </span>
                        </label>

                        <select
                          value={formData.city}
                          onChange={(event) =>
                            updateField(
                              "city",
                              event.target.value
                            )
                          }
                          className="h-14 w-full appearance-none rounded-2xl border border-[#dce2dc] bg-[#fafbf9] px-4 text-sm text-[#29372f] outline-none transition focus:border-[#52745d] focus:ring-4 focus:ring-[#52745d]/10"
                        >
                          <option value="">
                            Select your city
                          </option>

                          {cities.map(
                            (city) => (
                              <option
                                key={city}
                                value={city}
                              >
                                {city}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <InputField
                        label="Postal code"
                        value={formData.postalCode}
                        onChange={(value) =>
                          updateField(
                            "postalCode",
                            value
                          )
                        }
                        placeholder="Optional"
                      />
                    </div>

                    <div className="rounded-2xl border border-[#e2e7e1] bg-[#f8faf7] px-4 py-4">
                      <div className="flex gap-3">
                        <Phone
                          size={17}
                          className="mt-0.5 text-[#52745d]"
                        />

                        <div>
                          <p className="text-sm font-semibold">
                            Delivery in Pakistan
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#727c75]">
                            We'll contact you on
                            your phone number to
                            confirm your order.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* DELIVERY */}

            <section className="rounded-[28px] border border-[#dfe4dc] bg-white p-6 shadow-[0_15px_50px_rgba(30,48,38,0.04)] sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf2ed]">
                  <Truck
                    size={18}
                    strokeWidth={1.6}
                    className="text-[#45634f]"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a938d]">
                    03
                  </p>

                  <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em]">
                    Delivery method
                  </h2>
                </div>
              </div>

              <div className="mt-7 rounded-[22px] border border-[#cfdacf] bg-[#f7faf6] p-5">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#294b39] text-white">
                      <Package size={17} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        Standard delivery
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#727d75]">
                        Delivery charges are based on
                        the products in your order.
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {deliveryCharge === 0
                        ? "FREE"
                        : `PKR ${deliveryCharge.toLocaleString()}`}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-[#dfe7df] pt-5 text-xs font-semibold text-[#52745d]">
                  <Check size={15} />

                  {deliveryCharge === 0
                    ? "Free delivery on this order."
                    : `Delivery charge: PKR ${deliveryCharge.toLocaleString()}`}
                </div>
              </div>
            </section>

            {/* PAYMENT */}

            <section className="rounded-[28px] border border-[#dfe4dc] bg-white p-6 shadow-[0_15px_50px_rgba(30,48,38,0.04)] sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf2ed]">
                  <Lock
                    size={18}
                    strokeWidth={1.6}
                    className="text-[#45634f]"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a938d]">
                    04
                  </p>

                  <h2 className="mt-1 text-lg font-semibold tracking-[-0.025em]">
                    Payment method
                  </h2>
                </div>
              </div>

              {/* PAYMENT OPTIONS */}

              <div className="mt-7 space-y-3">
                {paymentMethods.map(
                  (method) => {
                    const selected =
                      paymentMethod ===
                      method.id;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() =>
                          handlePaymentMethodChange(
                            method.id
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-[22px] border p-4 text-left transition ${
                          selected
                            ? "border-[#52745d] bg-[#f7faf6] ring-1 ring-[#52745d]"
                            : "border-[#dfe4dc] bg-white hover:border-[#bfcbbf]"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                              selected
                                ? "bg-[#294b39] text-white"
                                : "bg-[#edf2ed] text-[#45634f]"
                            }`}
                          >
                            {method.icon}
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              {method.title}
                            </p>

                            <p className="mt-1 text-xs text-[#727d75]">
                              {method.description}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected
                              ? "border-[#52745d] bg-[#52745d] text-white"
                              : "border-[#cfd8d0]"
                          }`}
                        >
                          {selected && (
                            <Check size={12} />
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>

              {/* COD */}

              {paymentMethod === "cod" && (
                <div className="mt-5 flex gap-3 rounded-2xl bg-[#fafbf9] px-4 py-4">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-[#52745d]"
                  />

                  <p className="text-xs leading-5 text-[#727c75]">
                    No online payment is
                    required. We'll confirm your
                    order before dispatch.
                  </p>
                </div>
              )}

              {/* MANUAL PAYMENT */}

              {isManualPayment && (
                <div className="mt-5 rounded-[24px] border border-[#dfe4dc] bg-[#fafbf9] p-5">
                  <div className="rounded-2xl bg-[#edf3ed] p-4">
                    <p className="text-sm font-semibold text-[#294b39]">
                      Payment instructions
                    </p>

                    {paymentMethod ===
                      "bank_transfer" && (
                      <div className="mt-3 space-y-1 text-xs leading-5 text-[#647168]">
                        <p>
                          <strong>
                            Bank:
                          </strong>{" "}
                          {
                            PAYMENT_DETAILS.bank
                              .bankName
                          }
                        </p>

                        <p>
                          <strong>
                            Account Name:
                          </strong>{" "}
                          {
                            PAYMENT_DETAILS.bank
                              .accountName
                          }
                        </p>

                        <p>
                          <strong>
                            Account Number:
                          </strong>{" "}
                          {
                            PAYMENT_DETAILS.bank
                              .accountNumber
                          }
                        </p>

                        <p>
                          <strong>
                            IBAN:
                          </strong>{" "}
                          {
                            PAYMENT_DETAILS.bank
                              .iban
                          }
                        </p>
                      </div>
                    )}

                    {paymentMethod ===
                      "jazzcash" && (
                      <div className="mt-3 text-xs leading-5 text-[#647168]">
                        <p>
                          Send your payment to
                          the official SeedStore
                          JazzCash number.
                        </p>

                        <p className="mt-1 font-semibold text-[#294b39]">
                          JazzCash:{" "}
                          {
                            PAYMENT_DETAILS
                              .jazzcash
                              .number
                          }
                        </p>

                        <p className="mt-1">
                          Account Name:{" "}
                          {
                            PAYMENT_DETAILS
                              .jazzcash
                              .name
                          }
                        </p>
                      </div>
                    )}

                    {paymentMethod ===
                      "easypaisa" && (
                      <div className="mt-3 text-xs leading-5 text-[#647168]">
                        <p>
                          Send your payment to
                          the official SeedStore
                          Easypaisa number.
                        </p>

                        <p className="mt-1 font-semibold text-[#294b39]">
                          Easypaisa:{" "}
                          {
                            PAYMENT_DETAILS
                              .easypaisa
                              .number
                          }
                        </p>

                        <p className="mt-1">
                          Account Name:{" "}
                          {
                            PAYMENT_DETAILS
                              .easypaisa
                              .name
                          }
                        </p>
                      </div>
                    )}

                    <p className="mt-4 border-t border-[#dbe4dc] pt-4 text-[11px] leading-5 text-[#7a847d]">
                      After completing your
                      payment, upload a clear
                      screenshot of the payment
                      confirmation below. Your
                      payment will remain pending
                      until our team verifies it.
                    </p>
                  </div>

                  {/* SCREENSHOT */}

                  <div className="mt-5">
                    <label className="block text-xs font-semibold text-[#4e5b53]">
                      Payment screenshot{" "}
                      <span className="text-[#9b5f4f]">
                        *
                      </span>
                    </label>

                    {!paymentScreenshot ? (
                      <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbd6cc] bg-white px-5 py-8 text-center transition hover:border-[#52745d] hover:bg-[#f7faf6]">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf2ed] text-[#52745d]">
                          <Upload size={18} />
                        </div>

                        <p className="mt-3 text-sm font-semibold">
                          Upload payment proof
                        </p>

                        <p className="mt-1 text-xs text-[#858e88]">
                          JPG, PNG or WEBP ·
                          Maximum 5MB
                        </p>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(event) =>
                            handleScreenshotChange(
                              event.target.files?.[0] ||
                                null
                            )
                          }
                        />
                      </label>
                    ) : (
                      <div className="mt-2 overflow-hidden rounded-2xl border border-[#d7e0d7] bg-white">
                        <div className="relative aspect-video w-full bg-[#eef2ed]">
                          {screenshotPreview && (
                            <Image
                              src={
                                screenshotPreview
                              }
                              alt="Payment screenshot preview"
                              fill
                              unoptimized
                              className="object-contain"
                            />
                          )}

                          <button
                            type="button"
                            onClick={
                              removeScreenshot
                            }
                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold">
                              {
                                paymentScreenshot.name
                              }
                            </p>

                            <p className="mt-1 text-[10px] text-[#7d877f]">
                              {(
                                paymentScreenshot.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                          </div>

                          <Check
                            size={17}
                            className="text-[#52745d]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex gap-3 rounded-2xl bg-[#f1f5f0] px-4 py-4">
                    <ShieldCheck
                      size={17}
                      className="mt-0.5 shrink-0 text-[#52745d]"
                    />

                    <p className="text-xs leading-5 text-[#727c75]">
                      Your order will be created
                      with{" "}
                      <strong>
                        pending payment
                      </strong>
                      . Our team will verify the
                      screenshot before marking
                      the payment as paid.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* NOTES */}

            <section className="rounded-[28px] border border-[#dfe4dc] bg-white p-6 shadow-[0_15px_50px_rgba(30,48,38,0.04)] sm:p-8">
              <label className="block">
                <span className="text-sm font-semibold">
                  Order notes
                </span>

                <span className="mt-1 block text-xs text-[#858d87]">
                  Optional — delivery instructions
                  or anything you'd like us to know.
                </span>

                <textarea
                  value={formData.notes}
                  onChange={(event) =>
                    updateField(
                      "notes",
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="For example: Please call before delivery..."
                  className="mt-4 w-full resize-none rounded-2xl border border-[#dce2dc] bg-[#fafbf9] px-4 py-4 text-sm outline-none transition placeholder:text-[#a0a7a2] focus:border-[#52745d] focus:ring-4 focus:ring-[#52745d]/10"
                />
              </label>
            </section>

            {/* DESKTOP CTA */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="hidden w-full items-center justify-center gap-3 rounded-full bg-[#294b39] px-7 py-5 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(41,75,57,0.2)] transition hover:bg-[#1f3d2e] disabled:cursor-not-allowed disabled:opacity-70 sm:flex"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Placing your order...
                </>
              ) : (
                <>
                  Place order
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>

          {/* RIGHT */}

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[30px] border border-[#d9dfd8] bg-[#203c2d] text-white shadow-[0_25px_70px_rgba(28,51,39,0.16)]">
              {/* SUMMARY HEADER */}

              <div className="border-b border-white/10 px-6 py-7 sm:px-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
                      Your order
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                      Order summary
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <ShoppingBag size={17} />
                  </div>
                </div>
              </div>

              {/* ITEMS */}

              <div className="max-h-[370px] space-y-5 overflow-y-auto px-6 py-7 sm:px-7">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-white/10">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Sparkles
                            size={18}
                            className="text-white/40"
                          />
                        </div>
                      )}

                      <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#294b39] px-1.5 text-[9px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium leading-5">
                        {item.name}
                      </p>

                      {item.packSize && (
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/45">
                          {item.packSize}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-white/60">
                        PKR{" "}
                        {item.price.toLocaleString()}{" "}
                        × {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold">
                      PKR{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* TOTALS */}

              <div className="border-t border-white/10 px-6 py-7 sm:px-7">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>

                    <span>
                      PKR{" "}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>

                  {coupon &&
                    couponDiscount > 0 && (
                      <div className="flex items-center justify-between text-[#a8d1b1]">
                        <span className="flex items-center gap-2">
                          Discount

                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]">
                            {coupon.code}
                          </span>
                        </span>

                        <span>
                          − PKR{" "}
                          {couponDiscount.toLocaleString()}
                        </span>
                      </div>
                    )}

                  <div className="flex justify-between text-white/60">
                    <span>Delivery</span>

                    <span>
                      {deliveryCharge === 0
                        ? "FREE"
                        : `PKR ${deliveryCharge.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="my-5 h-px bg-white/10" />

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                        Total
                      </p>

                      <p className="mt-1 text-xs text-white/50">
                        PKR
                      </p>
                    </div>

                    <p className="text-3xl font-semibold tracking-[-0.05em]">
                      {total.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex gap-3">
                    <ShieldCheck
                      size={17}
                      className="mt-0.5 shrink-0 text-white/70"
                    />

                    <p className="text-[11px] leading-5 text-white/55">
                      {paymentMethod ===
                      "cod"
                        ? "Your order information is securely processed. Payment is collected when your order arrives."
                        : "Your payment proof will be securely reviewed by our team before the payment is marked as paid."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TRUST */}

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <TrustItem
                icon={<Lock size={15} />}
                text="Secure"
              />

              <TrustItem
                icon={<Truck size={15} />}
                text="Delivery"
              />

              <TrustItem
                icon={
                  <ShieldCheck size={15} />
                }
                text="Protected"
              />
            </div>
          </aside>
        </form>
      </div>

      {/* MOBILE CTA */}

      <div className="sticky bottom-0 z-40 border-t border-[#dce2db] bg-[#f7f5ee]/95 p-4 backdrop-blur-xl sm:hidden">
        <button
          type="submit"
          form="checkout-form"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-[#294b39] px-6 py-4 text-sm font-semibold text-white shadow-lg disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Placing order...
            </>
          ) : (
            <>
              Place order · PKR{" "}
              {total.toLocaleString()}
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| INPUT
|--------------------------------------------------------------------------
*/

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-xs font-semibold text-[#4e5b53]">
        {label}{" "}
        {required && (
          <span className="text-[#9b5f4f]">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="h-14 w-full rounded-2xl border border-[#dce2dc] bg-[#fafbf9] px-4 text-sm text-[#29372f] outline-none transition placeholder:text-[#a0a7a2] focus:border-[#52745d] focus:ring-4 focus:ring-[#52745d]/10"
      />
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| TRUST ITEM
|--------------------------------------------------------------------------
*/

function TrustItem({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#dfe4dc] bg-white px-3 py-4 text-[#69756d]">
      {icon}

      <span className="text-[9px] font-semibold uppercase tracking-[0.13em]">
        {text}
      </span>
    </div>
  );
}