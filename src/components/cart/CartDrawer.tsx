
"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

const formatPrice = (price: number) =>
  `Rs. ${price.toLocaleString("en-PK")}`;

export default function CartDrawer() {
  const {
    items,
    subtotal,
    totalItems,
    deliveryCharge,
    isCartOpen,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,

    coupon,
    revealedCoupon,
    couponDiscount,
    isCouponRevealed,
    isCouponLoading,
    revealCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  /*
   * Delivery comes directly from the
   * product-level delivery settings
   * stored in the cart.
   *
   * No Rs. 5000 global free-delivery
   * rule is used here.
   */
  const total = Math.max(
    subtotal -
      couponDiscount +
      deliveryCharge,
    0
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* BACKDROP */}
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-[90] cursor-default bg-[#17271f]/35 backdrop-blur-[2px]"
          />

          {/* DRAWER */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 34,
            }}
            className="fixed right-0 top-0 z-[100] flex h-dvh w-full max-w-[440px] flex-col bg-[#f8f6ef] shadow-[-20px_0_60px_rgba(35,70,54,0.14)]"
            aria-label="Shopping cart"
          >
            {/* HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#dedad0] bg-white px-5 py-5 sm:px-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#315c45]">
                  Your Selection
                </p>

                <h2 className="mt-1 font-serif text-2xl tracking-[-0.025em] text-[#234636]">
                  Shopping Cart
                </h2>
              </div>

              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd9ce] bg-[#f8f6ef] text-[#315c45] transition hover:bg-[#edf2eb]"
              >
                <X
                  size={17}
                  strokeWidth={1.7}
                />
              </button>
            </div>

            {/* DELIVERY INFO */}
            {items.length > 0 && (
              <div className="shrink-0 border-b border-[#e1ddd3] bg-[#f1f4ed] px-5 py-4 sm:px-6">
                {deliveryCharge === 0 ? (
                  <p className="text-[11px] font-semibold text-[#315c45]">
                    ✓ Free delivery is available
                    for your order.
                  </p>
                ) : (
                  <p className="text-[11px] leading-5 text-[#59625a]">
                    Delivery charge:{" "}
                    <span className="font-bold text-[#315c45]">
                      {formatPrice(
                        deliveryCharge
                      )}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* CONTENT */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {items.length === 0 ? (
                <div className="flex min-h-full items-center justify-center">
                  <div className="w-full text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9eee7]">
                      <ShoppingBag
                        size={26}
                        strokeWidth={1.4}
                        className="text-[#315c45]"
                      />
                    </div>

                    <h3 className="mt-5 font-serif text-2xl text-[#234636]">
                      Your cart is empty
                    </h3>

                    <p className="mx-auto mt-2 max-w-[280px] text-xs leading-6 text-[#747970]">
                      Discover our carefully
                      selected seed products and
                      add something you love.
                    </p>

                    <Link
                      href="/shop"
                      onClick={closeCart}
                      className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#315c45] px-5 text-xs font-semibold text-white transition hover:bg-[#234636]"
                    >
                      Explore Products
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* PRODUCTS */}
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="rounded-2xl border border-[#e0dcd2] bg-white p-3.5"
                    >
                      <div className="flex gap-3.5">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={closeCart}
                          className="h-[88px] w-[78px] shrink-0 overflow-hidden rounded-xl bg-[#eeeade]"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#8a8e85]">
                                {item.productType}
                              </p>

                              <Link
                                href={`/shop/${item.slug}`}
                                onClick={
                                  closeCart
                                }
                                className="mt-1 block line-clamp-2 text-sm font-semibold leading-5 text-[#234636] transition hover:text-[#315c45]"
                              >
                                {item.name}
                              </Link>

                              <p className="mt-1 text-[10px] text-[#858980]">
                                {item.packSize}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(
                                  item.id
                                )
                              }
                              aria-label={`Remove ${item.name}`}
                              className="shrink-0 text-[#a0a39b] transition hover:text-[#9a4c43]"
                            >
                              <Trash2
                                size={15}
                              />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex h-8 items-center overflow-hidden rounded-lg border border-[#ddd9ce]">
                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(
                                    item.id
                                  )
                                }
                                aria-label="Decrease quantity"
                                className="flex h-full w-8 items-center justify-center text-[#315c45] transition hover:bg-[#edf2eb]"
                              >
                                <Minus
                                  size={12}
                                />
                              </button>

                              <span className="flex w-7 justify-center text-[11px] font-semibold text-[#234636]">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseQuantity(
                                    item.id
                                  )
                                }
                                aria-label="Increase quantity"
                                className="flex h-full w-8 items-center justify-center text-[#315c45] transition hover:bg-[#edf2eb]"
                              >
                                <Plus
                                  size={12}
                                />
                              </button>
                            </div>

                            <p className="text-sm font-bold text-[#315c45]">
                              {formatPrice(
                                item.price *
                                  item.quantity
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* ============================= */}
                  {/* COUPON REVEAL */}
                  {/* ============================= */}

                  <div className="pt-2">
                    <AnimatePresence mode="wait">
                      {/* INITIAL */}
                      {!isCouponRevealed &&
                        !isCouponLoading && (
                          <motion.button
                            key="initial"
                            type="button"
                            onClick={
                              revealCoupon
                            }
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -8,
                            }}
                            className="group relative w-full overflow-hidden rounded-2xl border border-[#d8dfd3] bg-gradient-to-br from-[#edf4ea] via-[#f5f6ed] to-[#fff8df] p-4 text-left transition duration-300 hover:border-[#c4d2bd] hover:shadow-[0_10px_30px_rgba(49,92,69,0.08)]"
                          >
                            {/* Decorative glow */}
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#f4d77d]/25 blur-2xl" />

                            <div className="relative flex items-center gap-3">
                              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_5px_18px_rgba(35,70,54,0.08)]">
                                <Sparkles
                                  size={18}
                                  className="text-[#315c45]"
                                  strokeWidth={
                                    1.7
                                  }
                                />

                                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e8bd45]" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#315c45]">
                                  A Little Gift
                                </p>

                                <p className="mt-1 text-sm font-semibold text-[#234636]">
                                  There may be a
                                  special offer
                                  waiting for you
                                </p>

                                <p className="mt-1 text-[10px] text-[#858980]">
                                  Tap to reveal your
                                  exclusive coupon
                                </p>
                              </div>

                              <div className="flex h-8 shrink-0 items-center rounded-full bg-[#315c45] px-3 text-[9px] font-bold text-white transition group-hover:bg-[#234636]">
                                Reveal
                              </div>
                            </div>
                          </motion.button>
                        )}

                      {/* LOADING */}
                      {isCouponLoading && (
                        <motion.div
                          key="loading"
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          className="relative overflow-hidden rounded-2xl border border-[#d8dfd3] bg-[#f0f4ed] p-4"
                        >
                          {/* shimmer */}
                          <motion.div
                            animate={{
                              x: [
                                "-100%",
                                "200%",
                              ],
                            }}
                            transition={{
                              duration: 1.4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-18deg]"
                          />

                          <div className="relative flex items-center gap-3">
                            <motion.div
                              animate={{
                                rotate: 360,
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"
                            >
                              <Sparkles
                                size={18}
                                className="text-[#315c45]"
                              />
                            </motion.div>

                            <div className="flex-1">
                              <div className="h-2.5 w-24 animate-pulse rounded-full bg-[#d7e1d2]" />

                              <div className="mt-2 h-3 w-48 animate-pulse rounded-full bg-[#dfe7db]" />

                              <div className="mt-2 h-2 w-32 animate-pulse rounded-full bg-[#e4e9e0]" />
                            </div>
                          </div>

                          <div className="relative mt-3 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#315c45]" />

                            <span className="text-[9px] font-medium text-[#697269]">
                              Finding your best
                              available offer...
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* REVEALED COUPON */}
                      {isCouponRevealed &&
                        !coupon &&
                        !isCouponLoading &&
                        revealedCoupon && (
                          <motion.div
                            key="revealed"
                            initial={{
                              opacity: 0,
                              scale: 0.96,
                              y: 12,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              y: 0,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 280,
                              damping: 22,
                            }}
                            className="relative overflow-hidden rounded-2xl border border-[#d6d9c9] bg-gradient-to-br from-[#fffdf3] via-white to-[#eef5eb] shadow-[0_12px_35px_rgba(35,70,54,0.08)]"
                          >
                            {/* Top accent */}
                            <div className="h-1 bg-gradient-to-r from-[#315c45] via-[#d8b84c] to-[#315c45]" />

                            {/* Decorative circles */}
                            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#f3d56d]/20 blur-2xl" />

                            <div className="relative p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#315c45] text-white shadow-sm">
                                    <Sparkles
                                      size={15}
                                    />
                                  </div>

                                  <div>
                                    <p className="text-[8px] font-bold uppercase tracking-[0.17em] text-[#315c45]">
                                      Your Reward
                                    </p>

                                    <p className="mt-0.5 text-xs font-semibold text-[#234636]">
                                      You unlocked a
                                      special offer
                                    </p>
                                  </div>
                                </div>

                                <span className="rounded-full bg-[#f4df8b]/35 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[#8a6d12]">
                                  Exclusive
                                </span>
                              </div>

                              <div className="my-4 border-t border-dashed border-[#d6d5c9]" />

                              <div className="flex items-end justify-between gap-4">
                                <div>
                                  <p className="font-serif text-3xl tracking-[-0.04em] text-[#234636]">
                                    {revealedCoupon.discountType ===
                                    "percentage"
                                      ? `${revealedCoupon.discountValue}%`
                                      : formatPrice(
                                          revealedCoupon.discountValue
                                        )}
                                  </p>

                                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#315c45]">
                                    {revealedCoupon.discountType ===
                                    "percentage"
                                      ? "Discount"
                                      : "Off your order"}
                                  </p>
                                </div>

                                <div className="rounded-lg border border-dashed border-[#bfc8ba] bg-[#f7f8f2] px-3 py-2 text-right">
                                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#8a8e85]">
                                    Coupon
                                  </p>

                                  <p className="mt-0.5 text-sm font-bold tracking-[0.08em] text-[#315c45]">
                                    {
                                      revealedCoupon.code
                                    }
                                  </p>
                                </div>
                              </div>

                              <p className="mt-3 text-[10px] leading-4 text-[#747970]">
                                Save up to{" "}
                                <span className="font-bold text-[#315c45]">
                                  {formatPrice(
                                    revealedCoupon.discountAmount
                                  )}
                                </span>{" "}
                                on this order.
                              </p>

                              <button
                                type="button"
                                onClick={
                                  applyCoupon
                                }
                                className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#315c45] text-[10px] font-bold text-white shadow-[0_6px_18px_rgba(49,92,69,0.18)] transition hover:bg-[#234636] hover:shadow-[0_8px_22px_rgba(49,92,69,0.22)]"
                              >
                                Apply{" "}
                                {
                                  revealedCoupon.code
                                }
                                <ArrowRight
                                  size={13}
                                />
                              </button>
                            </div>
                          </motion.div>
                        )}

                      {/* NO COUPON */}
                      {isCouponRevealed &&
                        !coupon &&
                        !isCouponLoading &&
                        !revealedCoupon && (
                          <motion.div
                            key="empty"
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            className="rounded-2xl border border-[#e0dcd2] bg-white p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f1e9] text-[#8b8d84]">
                                <Sparkles
                                  size={16}
                                />
                              </div>

                              <div>
                                <p className="text-xs font-semibold text-[#234636]">
                                  No offer available
                                  right now
                                </p>

                                <p className="mt-1 text-[10px] text-[#858980]">
                                  Keep shopping — a
                                  better offer may
                                  appear later.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                      {/* APPLIED */}
                      {coupon && (
                        <motion.div
                          key="applied"
                          initial={{
                            opacity: 0,
                            scale: 0.97,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          className="relative overflow-hidden rounded-2xl border border-[#cbdac7] bg-gradient-to-r from-[#edf5eb] to-[#f8f8ef] p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#315c45] text-white shadow-sm">
                              <Check
                                size={17}
                                strokeWidth={
                                  2.5
                                }
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#315c45]">
                                    Offer Applied
                                  </p>

                                  <p className="mt-1 text-sm font-bold tracking-[0.04em] text-[#234636]">
                                    {coupon.code}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={
                                    removeCoupon
                                  }
                                  className="text-[9px] font-semibold text-[#858980] transition hover:text-[#9a4c43]"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="mt-2 flex items-center justify-between">
                                <p className="text-[10px] text-[#697269]">
                                  Your savings
                                </p>

                                <p className="text-xs font-bold text-[#315c45]">
                                  -
                                  {formatPrice(
                                    couponDiscount
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* SUMMARY */}
            {items.length > 0 && (
              <div className="shrink-0 border-t border-[#ddd9ce] bg-white px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                <div className="space-y-2.5">
                  {/* SUBTOTAL */}
                  <div className="flex items-center justify-between text-xs text-[#747970]">
                    <span>
                      Subtotal ({totalItems}{" "}
                      {totalItems === 1
                        ? "item"
                        : "items"}
                      )
                    </span>

                    <span className="font-semibold text-[#234636]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {/* DISCOUNT */}
                  {couponDiscount > 0 && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-[#315c45]">
                        Discount{" "}
                        {coupon && (
                          <span className="font-semibold">
                            ({coupon.code})
                          </span>
                        )}
                      </span>

                      <span className="font-semibold text-[#315c45]">
                        -
                        {formatPrice(
                          couponDiscount
                        )}
                      </span>
                    </motion.div>
                  )}

                  {/* DELIVERY */}
                  <div className="flex items-center justify-between text-xs text-[#747970]">
                    <span>Delivery</span>

                    <span className="font-semibold text-[#234636]">
                      {deliveryCharge === 0
                        ? "Free"
                        : formatPrice(
                            deliveryCharge
                          )}
                    </span>
                  </div>

                  <div className="my-3 h-px bg-[#e4e0d6]" />

                  {/* TOTAL */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#234636]">
                      Total
                    </span>

                    <span className="text-lg font-bold text-[#315c45]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* CHECKOUT */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#315c45] text-sm font-semibold text-white transition hover:bg-[#234636]"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>

                {/* FULL CART */}
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="mt-2.5 flex h-10 w-full items-center justify-center text-xs font-semibold text-[#315c45] transition hover:text-[#234636]"
                >
                  View Full Cart
                </Link>

                <p className="mt-3 text-center text-[9px] leading-4 text-[#9a9c94]">
                  Delivery charges are based on
                  the products in your order.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

