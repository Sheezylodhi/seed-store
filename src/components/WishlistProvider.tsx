
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface WishlistProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  oldPrice?: string | null;
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string | null;
  href: string;
}

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: WishlistProduct[];
  wishlistCount: number;
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (
    productId: string,
    product?: WishlistProduct
  ) => Promise<boolean>;
  removeWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext =
  createContext<WishlistContextType | undefined>(
    undefined
  );

const STORAGE_KEY = "seedstore_wishlist";

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wishlistProducts, setWishlistProducts] =
    useState<WishlistProduct[]>([]);

  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD WISHLIST FROM LOCAL STORAGE
  ====================================================== */

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        STORAGE_KEY
      );

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setWishlistProducts(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     SAVE WISHLIST TO LOCAL STORAGE
  ====================================================== */

  useEffect(() => {
    if (loading) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(wishlistProducts)
      );
    } catch (error) {
      console.error(
        "Failed to save wishlist:",
        error
      );
    }
  }, [wishlistProducts, loading]);

  /* =====================================================
     WISHLIST IDS
  ====================================================== */

  const wishlistIds = useMemo(
    () =>
      wishlistProducts.map(
        (product) => String(product.id)
      ),
    [wishlistProducts]
  );

  /* =====================================================
     CHECK WISHLIST
  ====================================================== */

  const isWishlisted = (productId: string) => {
    return wishlistIds.includes(String(productId));
  };

  /* =====================================================
     TOGGLE WISHLIST
  ====================================================== */

  const toggleWishlist = async (
    productId: string,
    product?: WishlistProduct
  ) => {
    const id = String(productId);

    let added = false;

    setWishlistProducts((current) => {
      const exists = current.some(
        (item) => String(item.id) === id
      );

      if (exists) {
        added = false;

        return current.filter(
          (item) => String(item.id) !== id
        );
      }

      if (!product) {
        console.warn(
          "Wishlist product data is required when adding a new product."
        );

        return current;
      }

      added = true;

      return [
        ...current,
        {
          ...product,
          id,
        },
      ];
    });

    window.dispatchEvent(
      new CustomEvent("wishlist-updated")
    );

    return added;
  };

  /* =====================================================
     REMOVE PRODUCT
  ====================================================== */

  const removeWishlist = (productId: string) => {
    const id = String(productId);

    setWishlistProducts((current) =>
      current.filter(
        (product) => String(product.id) !== id
      )
    );

    window.dispatchEvent(
      new CustomEvent("wishlist-updated")
    );
  };

  /* =====================================================
     CLEAR ALL
  ====================================================== */

  const clearWishlist = () => {
    setWishlistProducts([]);

    window.dispatchEvent(
      new CustomEvent("wishlist-updated")
    );
  };

  /* =====================================================
     CONTEXT VALUE
  ====================================================== */

  const value = useMemo(
    () => ({
      wishlistIds,
      wishlistProducts,
      wishlistCount: wishlistProducts.length,
      loading,
      isWishlisted,
      toggleWishlist,
      removeWishlist,
      clearWishlist,
    }),
    [
      wishlistIds,
      wishlistProducts,
      loading,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}

