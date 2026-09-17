"use client";

import Link from "next/link";

import {
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

export default function CartSummary() {
  const {
    subtotal,
    deliveryCharge,
    couponDiscount,
  } = useCart();

  /*
   * Delivery is calculated from the products
   * already stored in CartContext.
   *
   * Free delivery product = Rs. 0
   * Paid delivery product = its configured charge
   *
   * If multiple paid-delivery products exist,
   * CartContext uses the highest delivery charge.
   */

  const shipping = deliveryCharge;

  const total = Math.max(
    subtotal -
      (couponDiscount || 0) +
      shipping,
    0
  );

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="overflow-hidden rounded-[28px] border border-[#ddd8cb] bg-white shadow-[0_18px_50px_rgba(35,70,54,0.07)]">
        {/* Header */}
        <div className="border-b border-[#e8e3d8] px-6 py-6 sm:px-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c8579]">
            Order summary
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#234636]">
            Your total
          </h2>
        </div>

        {/* Price details */}
        <div className="space-y-4 px-6 py-6 sm:px-7">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#747970]">
              Subtotal
            </span>

            <span className="font-medium text-[#343b35]">
              Rs. {subtotal.toLocaleString()}
            </span>
          </div>

          {/* Coupon Discount */}
          {couponDiscount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#747970]">
                Discount
              </span>

              <span className="font-medium text-[#315c45]">
                - Rs.{" "}
                {couponDiscount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Delivery */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#747970]">
              Delivery
            </span>

            <span className="font-medium text-[#343b35]">
              {shipping === 0
                ? "FREE"
                : `Rs. ${shipping.toLocaleString()}`}
            </span>
          </div>

          {/* Delivery Information */}
          {shipping > 0 && (
            <div className="rounded-xl bg-[#f5f2e9] px-4 py-3 text-xs leading-5 text-[#667066]">
              Delivery charges are based on the
              products in your order.
            </div>
          )}

          {shipping === 0 && (
            <div className="rounded-xl bg-[#edf2eb] px-4 py-3 text-xs leading-5 text-[#5f6d61]">
              Your order qualifies for free
              delivery.
            </div>
          )}
        </div>

        {/* Total */}
        <div className="mx-6 border-t border-[#e8e3d8] px-0 py-6 sm:mx-7">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#8a8f87]">
                Total
              </p>

              <p className="mt-1 text-xs text-[#8a8f87]">
                Including delivery
              </p>
            </div>

            <p className="text-2xl font-semibold tracking-[-0.03em] text-[#234636]">
              Rs. {total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Checkout */}
        <div className="px-6 pb-6 sm:px-7">
          <Link
            href="/checkout"
            className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#315c45] text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#234636] hover:shadow-lg"
          >
            Proceed to Checkout

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/shop"
            className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-[#d9d5ca] text-sm font-medium text-[#315c45] transition-colors hover:bg-[#f7f4ec]"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Trust */}
        <div className="grid grid-cols-2 border-t border-[#e8e3d8] bg-[#faf8f2]">
          <div className="flex items-center gap-3 border-r border-[#e8e3d8] px-5 py-5">
            <Truck
              size={18}
              strokeWidth={1.5}
              className="text-[#315c45]"
            />

            <div>
              <p className="text-[10px] font-semibold text-[#344037]">
                Nationwide
              </p>

              <p className="mt-0.5 text-[9px] text-[#858a82]">
                Delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-5">
            <ShieldCheck
              size={18}
              strokeWidth={1.5}
              className="text-[#315c45]"
            />

            <div>
              <p className="text-[10px] font-semibold text-[#344037]">
                Secure
              </p>

              <p className="mt-0.5 text-[9px] text-[#858a82]">
                Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}