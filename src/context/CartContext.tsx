"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import type { CartItem } from "@/types/cart";

type AddToCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

export type CartCoupon = {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  discountAmount: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;

  deliveryCharge: number;

  coupon: CartCoupon | null;
  revealedCoupon: CartCoupon | null;
  couponDiscount: number;

  isCouponRevealed: boolean;
  isCouponLoading: boolean;

  isCartOpen: boolean;

  addToCart: (item: AddToCartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;

  revealCoupon: () => Promise<void>;
  applyCoupon: () => void;
  removeCoupon: () => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<
  CartContextType | undefined
>(undefined);

const STORAGE_KEY = "seed-store-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [coupon, setCoupon] =
    useState<CartCoupon | null>(null);

  const [revealedCoupon, setRevealedCoupon] =
    useState<CartCoupon | null>(null);

  const [isCouponRevealed, setIsCouponRevealed] =
    useState(false);

  const [isCouponLoading, setIsCouponLoading] =
    useState(false);

  /*
   * Load cart from localStorage.
   *
   * Older carts may not have delivery fields,
   * so we normalize them here.
   */
  useEffect(() => {
    try {
      const storedCart =
        localStorage.getItem(STORAGE_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(
          storedCart
        );

        if (Array.isArray(parsedCart)) {
          const normalizedCart: CartItem[] =
            parsedCart.map((item) => ({
              ...item,

              deliveryType:
                item.deliveryType === "paid"
                  ? "paid"
                  : "free",

              deliveryCharge:
                item.deliveryType === "paid"
                  ? Number(
                      item.deliveryCharge
                    ) || 0
                  : 0,
            }));

          setItems(normalizedCart);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  /*
   * Save cart to localStorage.
   */
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [items, hydrated]);

  /*
   * Add item to cart.
   */
  const addToCart = (
    item: AddToCartItem
  ) => {
    setItems((currentItems) => {
      const quantityToAdd =
        item.quantity ?? 1;

      const existingItem =
        currentItems.find(
          (cartItem) =>
            cartItem.id === item.id
        );

      if (existingItem) {
        return currentItems.map(
          (cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity +
                    quantityToAdd,

                  /*
                   * Refresh delivery settings
                   * from the latest product data.
                   */
                  deliveryType:
                    item.deliveryType ===
                    "paid"
                      ? "paid"
                      : "free",

                  deliveryCharge:
                    item.deliveryType ===
                    "paid"
                      ? Number(
                          item.deliveryCharge
                        ) || 0
                      : 0,
                }
              : cartItem
        );
      }

      return [
        ...currentItems,
        {
          ...item,

          deliveryType:
            item.deliveryType === "paid"
              ? "paid"
              : "free",

          deliveryCharge:
            item.deliveryType === "paid"
              ? Number(
                  item.deliveryCharge
                ) || 0
              : 0,

          quantity: quantityToAdd,
        },
      ];
    });
  };

  /*
   * Remove item from cart.
   */
  const removeFromCart = (
    id: string
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id
      )
    );
  };

  /*
   * Increase quantity.
   */
  const increaseQuantity = (
    id: string
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  /*
   * Decrease quantity.
   */
  const decreaseQuantity = (
    id: string
  ) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  /*
   * Update quantity.
   */
  const updateQuantity = (
    id: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  /*
   * Clear cart.
   */
  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setRevealedCoupon(null);
    setIsCouponRevealed(false);
  };

  /*
   * Check whether product exists in cart.
   */
  const isInCart = (id: string) => {
    return items.some(
      (item) => item.id === id
    );
  };

  /*
   * Cart drawer controls.
   */
  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(
      (current) => !current
    );
  };

  /*
   * Total item quantity.
   */
  const totalItems = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [items]);

  /*
   * Cart subtotal.
   */
  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  }, [items]);

  /*
   * Calculate delivery charge from
   * product-level database settings.
   *
   * Rules:
   *
   * All products free
   *    -> Free
   *
   * One or more products paid
   *    -> Highest configured delivery charge
   *
   * We intentionally do NOT use the old
   * Rs. 5000 free-delivery threshold.
   */
  const deliveryCharge = useMemo(() => {
    if (items.length === 0) {
      return 0;
    }

    const paidDeliveryCharges =
      items
        .filter(
          (item) =>
            item.deliveryType === "paid"
        )
        .map(
          (item) =>
            Number(
              item.deliveryCharge
            ) || 0
        );

    if (
      paidDeliveryCharges.length === 0
    ) {
      return 0;
    }

    return Math.max(
      ...paidDeliveryCharges
    );
  }, [items]);

  /*
   * Calculate currently applied
   * coupon discount.
   */
  const couponDiscount = useMemo(() => {
    if (!coupon) return 0;

    if (
      coupon.minimumOrderAmount !==
        undefined &&
      subtotal <
        coupon.minimumOrderAmount
    ) {
      return 0;
    }

    let discount = 0;

    if (
      coupon.discountType ===
      "percentage"
    ) {
      discount =
        (subtotal *
          coupon.discountValue) /
        100;

      if (
        coupon.maximumDiscountAmount !==
          undefined &&
        coupon.maximumDiscountAmount !==
          null
      ) {
        discount = Math.min(
          discount,
          coupon.maximumDiscountAmount
        );
      }
    }

    if (
      coupon.discountType === "fixed"
    ) {
      discount =
        coupon.discountValue;
    }

    return Math.min(
      Math.max(
        Math.round(discount),
        0
      ),
      subtotal
    );
  }, [coupon, subtotal]);

  /*
   * Reveal best available coupon.
   */
  const revealCoupon = async () => {
    if (
      isCouponLoading ||
      subtotal <= 0
    ) {
      return;
    }

    try {
      setIsCouponLoading(true);

      const response = await fetch(
        "/api/coupons/reveal",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            subtotal,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Coupon reveal response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to reveal coupon"
        );
      }

      setRevealedCoupon(
        data?.coupon || null
      );

      setIsCouponRevealed(true);
    } catch (error) {
      console.error(
        "Failed to reveal coupon:",
        error
      );

      setRevealedCoupon(null);
      setIsCouponRevealed(true);
    } finally {
      setIsCouponLoading(false);
    }
  };

  /*
   * Apply revealed coupon.
   */
  const applyCoupon = () => {
    if (!revealedCoupon) return;

    if (
      revealedCoupon.minimumOrderAmount !==
        undefined &&
      subtotal <
        revealedCoupon.minimumOrderAmount
    ) {
      return;
    }

    setCoupon(revealedCoupon);
  };

  /*
   * Remove currently applied coupon.
   */
  const removeCoupon = () => {
    setCoupon(null);
  };

  /*
   * Remove coupon if cart falls below
   * its minimum order requirement.
   */
  useEffect(() => {
    if (!coupon) return;

    if (
      coupon.minimumOrderAmount !==
        undefined &&
      subtotal <
        coupon.minimumOrderAmount
    ) {
      setCoupon(null);
    }
  }, [coupon, subtotal]);

  const value: CartContextType = {
    items,
    totalItems,
    subtotal,

    deliveryCharge,

    coupon,
    revealedCoupon,
    couponDiscount,

    isCouponRevealed,
    isCouponLoading,

    isCartOpen,

    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    isInCart,

    revealCoupon,
    applyCoupon,
    removeCoupon,

    openCart,
    closeCart,
    toggleCart,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}