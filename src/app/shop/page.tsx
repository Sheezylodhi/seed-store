"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  Leaf,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import WishlistButton from "@/components/WishlistButton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import { useCart } from "@/context/CartContext";

/* =========================================================
   TYPES
========================================================= */

type ProductCategory = {
  id?: string;
  name?: string;
  slug?: string;
};

type ProductVariant = {
  id?: string;
  packSize?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  isActive?: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;

  category?: ProductCategory | null;

  type: string;

  deliveryType?: "free" | "paid";
  deliveryCharge?: number;

  description?: string;

  price: number;
  oldPrice?: number;

  rating?: number;
  reviews?: number;

  image?: string;
  images?: string[];

  weights?: string[];

  variants?: ProductVariant[];

  stock?: number;

  featured?: boolean;

  createdAt?: string;
};

/* =========================================================
   SORT OPTIONS
========================================================= */

const sortOptions = [
  {
    value: "featured",
    label: "Featured",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "rating",
    label: "Highest Rated",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getActiveVariants(product: Product) {
  return (product.variants || []).filter(
    (variant) => variant.isActive !== false
  );
}

/* =========================================================
   SHOP PAGE
========================================================= */

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedType, setSelectedType] =
    useState("All Products");

  const [selectedWeight, setSelectedWeight] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("featured");

  const [filterOpen, setFilterOpen] =
    useState(false);

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/shop/products",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data = await response.json();

        if (mounted) {
          setProducts(
            Array.isArray(data.products)
              ? data.products
              : []
          );
        }
      } catch (error) {
        console.error(
          "Shop products fetch error:",
          error
        );

        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     DYNAMIC PRODUCT TYPES
     Comes directly from API -> productType
  ========================================================= */

  const productTypes = useMemo(() => {
    const types = products
      .map((product) => product.type)
      .filter(
        (type): type is string =>
          typeof type === "string" &&
          type.trim().length > 0
      );

    return Array.from(new Set(types));
  }, [products]);

  const filterTypes = useMemo(() => {
    return ["All Products", ...productTypes];
  }, [productTypes]);

  /* =========================================================
     DYNAMIC PACK SIZES
     Comes from backend variants
  ========================================================= */

  const weights = useMemo(() => {
    const values = products.flatMap(
      (product) =>
        getActiveVariants(product)
          .map(
            (variant) => variant.packSize
          )
          .filter(
            (packSize): packSize is string =>
              typeof packSize === "string" &&
              packSize.trim().length > 0
          )
    );

    return Array.from(new Set(values));
  }, [products]);

  /* =========================================================
     FILTER + SEARCH + SORT
  ========================================================= */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const query =
      searchQuery.trim().toLowerCase();

    /* Search */
    if (query) {
      result = result.filter((product) => {
        const searchableText = [
          product.name,
          product.description,
          product.category?.name,
          product.category?.slug,
          product.type,
          ...(product.variants || []).map(
            (variant) => variant.packSize
          ),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      });
    }

    /* Product type */
    if (
      selectedType !== "All Products"
    ) {
      result = result.filter(
        (product) =>
          product.type === selectedType
      );
    }

    /* Pack size */
    if (selectedWeight !== "All") {
      result = result.filter((product) =>
        getActiveVariants(product).some(
          (variant) =>
            variant.packSize ===
            selectedWeight
        )
      );
    }

    /* Sorting */
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => {
          const dateA = a.createdAt
            ? new Date(
                a.createdAt
              ).getTime()
            : 0;

          const dateB = b.createdAt
            ? new Date(
                b.createdAt
              ).getTime()
            : 0;

          return dateB - dateA;
        });
        break;

      case "price-low":
        result.sort(
          (a, b) =>
            a.price - b.price
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            b.price - a.price
        );
        break;

      case "rating":
        result.sort(
          (a, b) =>
            (b.rating || 0) -
            (a.rating || 0)
        );
        break;

      case "featured":
      default:
        result.sort(
          (a, b) =>
            Number(
              Boolean(b.featured)
            ) -
            Number(
              Boolean(a.featured)
            )
        );
        break;
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedType,
    selectedWeight,
    sortBy,
  ]);

  /* =========================================================
     ACTIVE FILTER COUNT
  ========================================================= */

  const activeFilterCount =
    (selectedType !== "All Products"
      ? 1
      : 0) +
    (selectedWeight !== "All"
      ? 1
      : 0) +
    (sortBy !== "featured"
      ? 1
      : 0);

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  function clearFilters() {
    setSelectedType(
      "All Products"
    );

    setSelectedWeight("All");

    setSortBy("featured");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f8f6ef] text-[#18231d]">

        {/* =====================================================
            SHOP HEADER
        ===================================================== */}

        <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-12">
          <div className="mx-auto max-w-[1380px]">

            <div className="relative overflow-hidden rounded-[28px] bg-[#234636] px-6 py-8 text-[#f8f6ef] sm:px-8 sm:py-10 lg:px-12 lg:py-11">

              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full border border-white/[0.08]" />

              <div className="pointer-events-none absolute -bottom-28 right-28 h-52 w-52 rounded-full border border-white/[0.05]" />

              <Leaf
                className="pointer-events-none absolute right-7 top-7 h-24 w-24 rotate-12 text-white/[0.055] sm:right-12 sm:top-9 sm:h-32 sm:w-32"
                strokeWidth={1}
              />

              <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

                <div className="max-w-3xl">

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#dfe8df]" />
                    Seedra Collection
                  </div>

                  <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl lg:text-[48px]">
                    Seeds made for your{" "}
                    <span className="text-white/60">
                      daily ritual.
                    </span>
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                    Explore our collection of
                    thoughtfully selected seeds and
                    seed cycling blends for your
                    everyday routine.
                  </p>
                </div>

                {/* Backend-driven product count */}
                <div className="shrink-0">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-sm">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      Available
                    </p>

                    <div className="mt-1 flex items-end gap-2">
                      <span className="text-3xl font-semibold tracking-tight">
                        {products.length}
                      </span>

                      <span className="pb-1 text-xs text-white/45">
                        products
                      </span>
                    </div>

                  </div>
                </div>

              </div>

              {/* Dynamic product types */}
              {filterTypes.length > 1 && (
                <div className="relative z-10 mt-8 flex gap-2 overflow-x-auto border-t border-white/10 pt-5 scrollbar-hide">

                  {filterTypes.map(
                    (type) => {
                      const active =
                        selectedType ===
                        type;

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setSelectedType(
                              type
                            )
                          }
                          className={[
                            "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
                            active
                              ? "bg-[#f8f6ef] text-[#234636]"
                              : "border border-white/10 bg-white/[0.035] text-white/55 hover:bg-white/[0.08] hover:text-white",
                          ].join(" ")}
                        >
                          {type}
                        </button>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          </div>
        </section>

        {/* =====================================================
            SEARCH + FILTER BAR
        ===================================================== */}

        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1380px]">

            <div className="rounded-[22px] bg-white p-2.5 shadow-[0_12px_35px_rgba(35,70,54,0.09)]">

              <div className="flex flex-col gap-2 sm:flex-row">

                {/* Search */}
                <div className="relative flex-1">

                 <Search
  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#747970]"
  strokeWidth={1.8}
/>

                  <input
  type="search"
  value={searchQuery}
  onChange={(event) =>
    setSearchQuery(event.target.value)
  }
  placeholder="Search seeds, blends or products..."
  className="h-12 w-full rounded-xl border border-[#e3e7df] bg-[#f8f6ef] pl-11 pr-4 text-sm text-[#234636] outline-none placeholder:text-[#8b938c] transition focus:border-[#d1dbd2] focus:bg-white focus:ring-0"
/>

                </div>

                {/* Filters */}
                <button
                  type="button"
                  onClick={() =>
                    setFilterOpen(true)
                  }
                  className="relative flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f8f6ef] px-5 text-sm font-semibold text-[#234636] transition hover:bg-white sm:min-w-[150px]"
                >

                  <SlidersHorizontal
                    className="h-4 w-4"
                    strokeWidth={2}
                  />

                  Filters

                  {activeFilterCount >
                    0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#234636] px-1.5 text-[10px] font-bold text-[#f8f6ef]">
                      {
                        activeFilterCount
                      }
                    </span>
                  )}

                </button>

              </div>
            </div>

            {/* Active filters */}
            {(activeFilterCount >
              0 ||
              searchQuery) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">

                <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#747970]">
                  Active
                </span>

                {searchQuery && (
                  <FilterChip
                    label={`Search: ${searchQuery}`}
                    onRemove={() =>
                      setSearchQuery("")
                    }
                  />
                )}

                {selectedType !==
                  "All Products" && (
                  <FilterChip
                    label={
                      selectedType
                    }
                    onRemove={() =>
                      setSelectedType(
                        "All Products"
                      )
                    }
                  />
                )}

                {selectedWeight !==
                  "All" && (
                  <FilterChip
                    label={
                      selectedWeight
                    }
                    onRemove={() =>
                      setSelectedWeight(
                        "All"
                      )
                    }
                  />
                )}

                {sortBy !==
                  "featured" && (
                  <FilterChip
                    label={
                      sortOptions.find(
                        (option) =>
                          option.value ===
                          sortBy
                      )?.label ||
                      "Sorted"
                    }
                    onRemove={() =>
                      setSortBy(
                        "featured"
                      )
                    }
                  />
                )}

                <button
                  type="button"
                  onClick={() => {
                    clearFilters();
                    setSearchQuery("");
                  }}
                  className="ml-1 text-xs font-semibold text-[#234636] underline underline-offset-4"
                >
                  Clear all
                </button>

              </div>
            )}

          </div>
        </section>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <section className="px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">

          <div className="mx-auto max-w-[1380px]">

            <div className="mb-6 flex items-end justify-between gap-4">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#747970]">
                  Seedra Shop
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[#18231d] sm:text-3xl">
                  Our collection
                </h2>
              </div>

              <p className="text-right text-xs text-[#747970] sm:text-sm">
                {loading
                  ? "Loading..."
                  : `${filteredProducts.length} ${
                      filteredProducts.length ===
                      1
                        ? "product"
                        : "products"
                    }`}
              </p>

            </div>

            {loading && (
              <ProductSkeleton />
            )}

            {!loading &&
              filteredProducts.length ===
                0 && (
                <EmptyState
                  onReset={() => {
                    clearFilters();
                    setSearchQuery("");
                  }}
                />
              )}

            {!loading &&
              filteredProducts.length >
                0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                  {filteredProducts.map(
                    (
                      product,
                      index
                    ) => (
                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                        index={
                          index
                        }
                      />
                    )
                  )}

                </div>
              )}

          </div>
        </section>

        {/* =====================================================
            SEO CONTENT
        ===================================================== */}

        <section className="border-t border-[#234636]/10 bg-white/35 px-4 py-16 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-4xl text-center">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#747970]">
              Seedra Seeds
            </span>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#18231d] sm:text-3xl">
              Thoughtfully selected seeds
              for your routine
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#747970] sm:text-base">
              Discover Seedra&apos;s collection
              of seed cycling blends and
              individual seeds. Choose the
              products that fit your routine
              and make them part of your
              everyday meals and rituals.
            </p>

          </div>

        </section>

      </main>

      {/* =======================================================
          FILTER DRAWER
      ======================================================= */}

      <FilterDrawer
        open={filterOpen}
        onClose={() =>
          setFilterOpen(false)
        }
        filterTypes={
          filterTypes
        }
        weights={weights}
        selectedType={
          selectedType
        }
        selectedWeight={
          selectedWeight
        }
        sortBy={sortBy}
        onTypeChange={
          setSelectedType
        }
        onWeightChange={
          setSelectedWeight
        }
        onSortChange={
          setSortBy
        }
        onClear={() => {
          clearFilters();
          setSearchQuery("");
        }}
        resultCount={
          filteredProducts.length
        }
      />

      {/* =====================================================
    FINAL CTA
===================================================== */}

<section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
  <div className="mx-auto max-w-[1380px]">
    <div className="relative overflow-hidden rounded-[28px] bg-[#234636] px-6 py-12 text-[#f8f6ef] sm:px-10 sm:py-14 lg:px-14 lg:py-16">

      {/* Decorative elements */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/[0.07]" />

      <div className="pointer-events-none absolute -bottom-32 right-20 h-72 w-72 rounded-full border border-white/[0.05]" />

      <Leaf
        className="pointer-events-none absolute right-8 top-8 h-28 w-28 rotate-12 text-white/[0.045] sm:right-14 sm:top-10 sm:h-40 sm:w-40"
        strokeWidth={1}
      />

      <div className="relative z-10 max-w-3xl">

        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-[#dfe8df]" />
          Your Daily Ritual
        </span>

        <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-4xl lg:text-[48px]">
          Small seeds.
          <br />
          <span className="text-white/55">
            A thoughtful daily ritual.
          </span>
        </h2>

        <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
          Thoughtfully selected seed blends and
          individual seeds made to fit naturally
          into your everyday routine.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

          <Link
            href="/#our-story"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f8f6ef] px-6 text-sm font-semibold text-[#234636] transition hover:bg-white"
          >
            Explore Our Story

            <ArrowUpRight
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </Link>

          <Link
            href="/#how-it-works"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/[0.12]"
          >
            How It Works

            <ArrowRight
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </Link>

        </div>

      </div>
    </div>
  </div>
</section>

      <Footer />
    </>
  );
}

/* =========================================================
   FILTER CHIP
========================================================= */

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border border-[#234636]/10 bg-white px-3 py-1.5 text-xs font-medium text-[#234636] shadow-sm transition hover:border-[#234636]/20"
    >
      {label}

      <X
        className="h-3 w-3"
        strokeWidth={2}
      />
    </button>
  );
}

/* =========================================================
   FILTER DRAWER
========================================================= */

function FilterDrawer({
  open,
  onClose,
  filterTypes,
  weights,
  selectedType,
  selectedWeight,
  sortBy,
  onTypeChange,
  onWeightChange,
  onSortChange,
  onClear,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;

  filterTypes: string[];
  weights: string[];

  selectedType: string;
  selectedWeight: string;
  sortBy: string;

  onTypeChange: (
    value: string
  ) => void;

  onWeightChange: (
    value: string
  ) => void;

  onSortChange: (
    value: string
  ) => void;

  onClear: () => void;

  resultCount: number;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label="Close filters"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="fixed inset-0 z-[80] cursor-default bg-[#102319]/45 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.aside
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 34,
            }}
            className="fixed right-0 top-0 z-[90] flex h-full w-[min(430px,94vw)] flex-col bg-[#f8f6ef] shadow-[-20px_0_60px_rgba(16,35,25,0.16)]"
          >

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#234636]/10 px-6 py-5">

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#747970]">
                  Refine collection
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#18231d]">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#234636]/10 bg-white text-[#234636] transition hover:bg-[#234636] hover:text-white"
                aria-label="Close filters"
              >
                <X
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </button>

            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">

              {/* Collection */}
              <FilterSection
                title="Collection"
                icon={
                  <Leaf className="h-4 w-4" />
                }
              >
                <div className="space-y-2">

                  {filterTypes.map(
                    (type) => {
                      const active =
                        selectedType ===
                        type;

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            onTypeChange(
                              type
                            )
                          }
                          className={[
                            "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm transition",
                            active
                              ? "border-[#234636] bg-[#234636] text-white"
                              : "border-[#234636]/10 bg-white text-[#37443b] hover:border-[#234636]/25",
                          ].join(" ")}
                        >
                          <span>
                            {type}
                          </span>

                          {active && (
                            <Check
                              className="h-4 w-4"
                              strokeWidth={
                                2.2
                              }
                            />
                          )}
                        </button>
                      );
                    }
                  )}

                </div>
              </FilterSection>

              {/* Pack size */}
              {weights.length >
                0 && (
                <FilterSection
                  title="Pack Size"
                  icon={
                    <ShoppingBag className="h-4 w-4" />
                  }
                >
                  <div className="flex flex-wrap gap-2">

                    <FilterPill
                      label="All"
                      active={
                        selectedWeight ===
                        "All"
                      }
                      onClick={() =>
                        onWeightChange(
                          "All"
                        )
                      }
                    />

                    {weights.map(
                      (weight) => (
                        <FilterPill
                          key={
                            weight
                          }
                          label={
                            weight
                          }
                          active={
                            selectedWeight ===
                            weight
                          }
                          onClick={() =>
                            onWeightChange(
                              weight
                            )
                          }
                        />
                      )
                    )}

                  </div>
                </FilterSection>
              )}

              {/* Sort */}
              <FilterSection
                title="Sort By"
                icon={
                  <SlidersHorizontal className="h-4 w-4" />
                }
              >
                <div className="space-y-2">

                  {sortOptions.map(
                    (option) => {
                      const active =
                        sortBy ===
                        option.value;

                      return (
                        <button
                          key={
                            option.value
                          }
                          type="button"
                          onClick={() =>
                            onSortChange(
                              option.value
                            )
                          }
                          className={[
                            "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm transition",
                            active
                              ? "border-[#234636] bg-[#234636] text-white"
                              : "border-[#234636]/10 bg-white text-[#37443b] hover:border-[#234636]/25",
                          ].join(" ")}
                        >
                          <span>
                            {
                              option.label
                            }
                          </span>

                          {active && (
                            <Check
                              className="h-4 w-4"
                              strokeWidth={
                                2.2
                              }
                            />
                          )}
                        </button>
                      );
                    }
                  )}

                </div>
              </FilterSection>

            </div>

            {/* Footer */}
            <div className="border-t border-[#234636]/10 bg-[#f8f6ef] p-5">

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={onClear}
                  className="h-12 flex-1 rounded-xl border border-[#234636]/15 bg-white text-sm font-semibold text-[#234636] transition hover:border-[#234636]/30"
                >
                  Clear all
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="h-12 flex-[1.5] rounded-xl bg-[#234636] text-sm font-semibold text-[#f8f6ef] transition hover:bg-[#315c45]"
                >
                  Show{" "}
                  {
                    resultCount
                  }{" "}
                  {resultCount ===
                  1
                    ? "product"
                    : "products"}
                </button>

              </div>

            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   FILTER SECTION
========================================================= */

function FilterSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[#234636]/10 pb-6">

      <div className="mb-4 flex items-center gap-2 text-[#234636]">

        {icon}

        <h3 className="text-sm font-semibold">
          {title}
        </h3>

      </div>

      {children}

      <div className="mt-6" />

    </div>
  );
}

/* =========================================================
   FILTER PILL
========================================================= */

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-4 py-2.5 text-xs font-semibold transition",
        active
          ? "border-[#234636] bg-[#234636] text-white"
          : "border-[#234636]/10 bg-white text-[#4d5a52] hover:border-[#234636]/25",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { addToCart, openCart } = useCart();

  const activeVariants = useMemo(
    () => getActiveVariants(product),
    [product]
  );

  /* =========================================================
     AVAILABLE PACK SIZES FROM BACKEND
  ========================================================= */

  const availableWeights = useMemo(() => {
    return Array.from(
      new Set(
        activeVariants
          .map((variant) => variant.packSize)
          .filter(
            (value): value is string =>
              typeof value === "string" &&
              value.trim().length > 0
          )
      )
    );
  }, [activeVariants]);

  const [selectedWeight, setSelectedWeight] =
    useState("");

  const [liked, setLiked] = useState(false);

  /* =========================================================
     DEFAULT AVAILABLE VARIANT
  ========================================================= */

  useEffect(() => {
    if (!availableWeights.length) {
      setSelectedWeight("");
      return;
    }

    setSelectedWeight((current) => {
      if (
        current &&
        availableWeights.includes(current)
      ) {
        return current;
      }

      const firstInStock =
        activeVariants.find(
          (variant) => variant.stock > 0
        );

      return (
        firstInStock?.packSize ||
        availableWeights[0]
      );
    });
  }, [
    availableWeights,
    activeVariants,
  ]);

  /* =========================================================
     SELECTED VARIANT
  ========================================================= */

  const selectedVariant = useMemo(() => {
    if (!activeVariants.length) {
      return undefined;
    }

    if (selectedWeight) {
      const exact = activeVariants.find(
        (variant) =>
          variant.packSize === selectedWeight
      );

      if (exact) {
        return exact;
      }
    }

    return (
      activeVariants.find(
        (variant) => variant.stock > 0
      ) || activeVariants[0]
    );
  }, [
    activeVariants,
    selectedWeight,
  ]);

  /* =========================================================
     STOCK
  ========================================================= */

  const hasAvailableStock =
    activeVariants.length > 0
      ? activeVariants.some(
          (variant) => variant.stock > 0
        )
      : (product.stock || 0) > 0;

  const isOutOfStock =
    !hasAvailableStock;

  /* =========================================================
     PRICE
  ========================================================= */

  const displayPrice =
    selectedVariant?.price ??
    product.price;

  const displayComparePrice =
    selectedVariant?.compareAtPrice ??
    product.oldPrice;

  /* =========================================================
     ADD TO CART
  ========================================================= */

  function handleAddToCart() {
    if (isOutOfStock) {
      return;
    }

    const purchasableVariant =
      selectedVariant &&
      selectedVariant.stock > 0
        ? selectedVariant
        : activeVariants.find(
            (variant) =>
              variant.stock > 0
          );

    if (
      activeVariants.length > 0 &&
      !purchasableVariant
    ) {
      return;
    }

addToCart({
  id: product.id,
  name: product.name,
  slug: product.slug,

  price:
    purchasableVariant?.price ??
    product.price,

  image:
    product.image ||
    product.images?.[0] ||
    "",

  quantity: 1,

  productType:
    product.type,

  packSize:
    purchasableVariant?.packSize || "",

  deliveryType:
    product.deliveryType === "paid"
      ? "paid"
      : "free",

  deliveryCharge:
    product.deliveryType === "paid"
      ? Number(product.deliveryCharge) || 0
      : 0,
});

    /* =======================================================
       OPEN CART DRAWER AFTER ADDING
    ======================================================= */

    openCart();
  }

  const image =
    product.image ||
    product.images?.[0] ||
    "/placeholder-product.jpg";

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        delay: Math.min(
          index * 0.04,
          0.2
        ),
      }}
      className="group relative overflow-hidden rounded-[24px] border border-[#234636]/10 bg-[#18231d] shadow-[0_8px_30px_rgba(35,70,54,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(35,70,54,0.13)]"
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative aspect-[0.9/1] overflow-hidden">
        <Link
          href={`/shop/${product.slug}`}
          className="absolute inset-0 z-0"
        >
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b14]/30 via-transparent to-[#0d1b14]/95" />
        </Link>

        {/* =================================================
            TOP CONTENT
        ================================================= */}

        <div className="absolute left-4 right-4 top-4 z-10 flex items-start justify-between gap-3">
          {product.type ? (
            <span className="rounded-full border border-white/15 bg-[#234636]/85 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              {product.type}
            </span>
          ) : (
            <span />
          )}

        <WishlistButton
  productId={product.id}
  product={{
    id: product.id,
    name: product.name,
    category:
      product.category?.name || "",
    price: formatPrice(displayPrice),
    oldPrice:
      displayComparePrice &&
      displayComparePrice > displayPrice
        ? formatPrice(displayComparePrice)
        : null,
    image:
      product.image ||
      product.images?.[0] ||
      "/placeholder-product.jpg",
    rating: product.rating,
    reviews: product.reviews,
    badge: product.type || null,
    href: `/shop/${product.slug}`,
  }}
  size="sm"
  className="border-white/20 bg-black/20 text-white hover:bg-white hover:text-[#234636]"
/>
        </div>

        {/* =================================================
            RATING
        ================================================= */}

        {typeof product.rating ===
          "number" &&
          product.rating > 0 && (
            <div className="absolute right-4 top-[68px] z-10 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1.5 backdrop-blur-md">
              <Star
                className="h-3 w-3 text-[#234636]"
                fill="currentColor"
              />

              <span className="text-[10px] font-bold text-[#234636]">
                {product.rating.toFixed(1)}
              </span>

              {typeof product.reviews ===
                "number" &&
                product.reviews > 0 && (
                  <span className="text-[9px] text-[#747970]">
                    ({product.reviews})
                  </span>
                )}
            </div>
          )}

        {/* =================================================
            SOLD OUT
        ================================================= */}

        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#102319]/35 backdrop-blur-[1px]">
            <span className="rounded-full bg-[#f8f6ef] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#234636] shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* =================================================
            PRODUCT CONTENT OVER IMAGE
        ================================================= */}

        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1">
              {product.category?.name && (
                <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/50">
                  {product.category.name}
                </p>
              )}

              <Link
                href={`/shop/${product.slug}`}
              >
                <h3 className="line-clamp-2 text-xl font-semibold leading-[1.08] tracking-[-0.035em] text-white transition hover:text-white/75">
                  {product.name}
                </h3>
              </Link>

              {product.description && (
                <p className="mt-2 line-clamp-2 max-w-[440px] text-xs leading-5 text-white/60">
                  {product.description}
                </p>
              )}
            </div>

            {/* PRICE */}

            <div className="shrink-0 text-right">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                From
              </p>

              <p className="mt-0.5 text-lg font-semibold tracking-[-0.03em] text-white">
                {formatPrice(displayPrice)}
              </p>

              {displayComparePrice &&
                displayComparePrice >
                  displayPrice && (
                  <p className="text-[10px] text-white/35 line-through">
                    {formatPrice(
                      displayComparePrice
                    )}
                  </p>
                )}
            </div>
          </div>

          {/* =================================================
              PACK SIZES
          ================================================= */}

          {availableWeights.length >
            0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {availableWeights.map(
                (weight) => {
                  const variant =
                    activeVariants.find(
                      (item) =>
                        item.packSize ===
                        weight
                    );

                  const active =
                    selectedWeight ===
                    weight;

                  const unavailable =
                    !variant ||
                    variant.stock <= 0;

                  return (
                    <button
                      key={weight}
                      type="button"
                      disabled={
                        unavailable
                      }
                      onClick={() =>
                        setSelectedWeight(
                          weight
                        )
                      }
                      className={[
                        "rounded-full border px-3 py-1.5 text-[10px] font-semibold backdrop-blur-md transition",
                        active
                          ? "border-white bg-white text-[#234636]"
                          : unavailable
                          ? "cursor-not-allowed border-white/10 bg-black/10 text-white/25"
                          : "border-white/15 bg-black/15 text-white/65 hover:border-white/30 hover:text-white",
                      ].join(" ")}
                    >
                      {weight}
                    </button>
                  );
                }
              )}
            </div>
          )}

          {/* =================================================
              ACTION ROW
          ================================================= */}

          <div className="mt-4 flex gap-2">
            {/* View Product */}

            <Link
              href={`/shop/${product.slug}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white backdrop-blur-md transition hover:bg-white hover:text-[#234636]"
              aria-label={`View ${product.name}`}
            >
              <ArrowUpRight
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </Link>

            {/* Add To Cart */}

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              disabled={isOutOfStock}
              className={[
                "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition",
                isOutOfStock
                  ? "cursor-not-allowed bg-white/10 text-white/35"
                  : "bg-[#f8f6ef] text-[#234636] hover:bg-white",
              ].join(" ")}
            >
              <ShoppingBag
                className="h-4 w-4"
                strokeWidth={1.8}
              />

              {isOutOfStock
                ? "Unavailable"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
/* =========================================================
   PRODUCT SKELETON
========================================================= */

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[24px] bg-white"
        >

          <div className="aspect-[0.9/1] animate-pulse bg-[#e7e7df]" />

          <div className="space-y-3 p-5">

            <div className="h-4 w-2/3 animate-pulse rounded bg-[#e7e7df]" />

            <div className="h-3 w-full animate-pulse rounded bg-[#eeeeea]" />

            <div className="h-3 w-4/5 animate-pulse rounded bg-[#eeeeea]" />

          </div>

        </div>
      ))}

    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-[#234636]/10 bg-white px-6 py-16 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef1eb] text-[#234636]">
        <Search
          className="h-6 w-6"
          strokeWidth={1.6}
        />
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-[#18231d]">
        No products found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#747970]">
        We couldn&apos;t find anything
        matching your current search or
        filters. Try adjusting them to
        see more products.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#234636] px-5 py-3 text-sm font-semibold text-[#f8f6ef] transition hover:bg-[#315c45]"
      >
        Clear filters

        <ArrowRight
          className="h-4 w-4"
          strokeWidth={1.8}
        />
      </button>

    </div>
  );
}