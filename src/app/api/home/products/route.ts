import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Review from "@/models/Review";
import "@/models/Category";

export const revalidate = 60;

const PRODUCT_LIMIT = 8;
const DISPLAY_LIMIT = 4;

export async function GET() {
  try {
    await connectDB();

    /* =====================================================
       1. GET BEST SELLING PRODUCT IDS
    ===================================================== */

    const bestSellerRows = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $match: {
          "items.product": {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$items.product",
          soldQuantity: {
            $sum: "$items.quantity",
          },
        },
      },
      {
        $sort: {
          soldQuantity: -1,
        },
      },
      {
        $limit: PRODUCT_LIMIT,
      },
    ]);

    const bestSellerIds = bestSellerRows.map(
      (item) => String(item._id)
    );

    /* =====================================================
       2. GET NEW ARRIVALS + FEATURED PRODUCTS
    ===================================================== */

    const [
      newArrivalProducts,
      featuredProducts,
    ] = await Promise.all([
      Product.find({
        isActive: true,
      })
        .select(
          "name slug category productType shortDescription images price compareAtPrice stock sku variants deliveryType deliveryCharge isFeatured isActive createdAt"
        )
        .populate({
          path: "category",
          select: "name slug",
        })
        .sort({
          createdAt: -1,
        })
        .limit(PRODUCT_LIMIT)
        .lean(),

      Product.find({
        isActive: true,
        isFeatured: true,
      })
        .select(
          "name slug category productType shortDescription images price compareAtPrice stock sku variants deliveryType deliveryCharge isFeatured isActive createdAt"
        )
        .populate({
          path: "category",
          select: "name slug",
        })
        .sort({
          createdAt: -1,
        })
        .limit(PRODUCT_LIMIT)
        .lean(),
    ]);

    /* =====================================================
       3. GET BEST SELLER PRODUCT DETAILS
    ===================================================== */

    let bestSellerProducts: any[] = [];

    if (bestSellerIds.length > 0) {
      const products = await Product.find({
        _id: {
          $in: bestSellerIds,
        },
        isActive: true,
      })
        .select(
          "name slug category productType shortDescription images price compareAtPrice stock sku variants deliveryType deliveryCharge isFeatured isActive createdAt"
        )
        .populate({
          path: "category",
          select: "name slug",
        })
        .lean();

      const productMap = new Map(
        products.map((product: any) => [
          String(product._id),
          product,
        ])
      );

      bestSellerProducts = bestSellerIds
        .map((id) => productMap.get(id))
        .filter(Boolean);
    }

    /* =====================================================
       4. COMBINE PRODUCTS WITHOUT DUPLICATES
    ===================================================== */

    const mergedProducts: any[] = [];
    const addedIds = new Set<string>();

    const addProduct = (
      product: any,
      source:
        | "bestSeller"
        | "newArrival"
        | "featured"
        | "sale"
    ) => {
      if (!product?._id) return;

      const id = String(product._id);

      if (addedIds.has(id)) return;

      if (
        mergedProducts.length >=
        DISPLAY_LIMIT
      ) {
        return;
      }

      addedIds.add(id);

      mergedProducts.push({
        ...product,
        _source: source,
      });
    };

    /*
      Priority:
      BEST SELLER
      FEATURED
      NEW ARRIVAL
      SALE
    */

    bestSellerProducts.forEach(
      (product) => {
        addProduct(
          product,
          "bestSeller"
        );
      }
    );

    featuredProducts.forEach(
      (product) => {
        addProduct(
          product,
          "featured"
        );
      }
    );

    newArrivalProducts.forEach(
      (product) => {
        addProduct(
          product,
          "newArrival"
        );
      }
    );

    /* =====================================================
       SALE PRODUCTS FALLBACK
    ===================================================== */

    if (
      mergedProducts.length <
      DISPLAY_LIMIT
    ) {
      const saleProducts =
        await Product.find({
          isActive: true,
          $expr: {
            $and: [
              {
                $ne: [
                  "$price",
                  null,
                ],
              },
              {
                $ne: [
                  "$compareAtPrice",
                  null,
                ],
              },
              {
                $gt: [
                  "$compareAtPrice",
                  "$price",
                ],
              },
            ],
          },
        })
          .select(
            "name slug category productType shortDescription images price compareAtPrice stock sku variants deliveryType deliveryCharge isFeatured isActive createdAt"
          )
          .populate({
            path: "category",
            select: "name slug",
          })
          .sort({
            createdAt: -1,
          })
          .limit(PRODUCT_LIMIT)
          .lean();

      saleProducts.forEach(
        (product) => {
          addProduct(
            product,
            "sale"
          );
        }
      );
    }

    /* =====================================================
       5. GET APPROVED + PUBLISHED REVIEW STATS
    ===================================================== */

    const displayIds =
      mergedProducts.map(
        (product) =>
          product._id
      );

    let reviewStats: any[] = [];

    if (
      displayIds.length > 0
    ) {
      reviewStats =
        await Review.aggregate([
          {
            $match: {
              product: {
                $in: displayIds,
              },
              isApproved: true,
              isPublished: true,
            },
          },
          {
            $group: {
              _id: "$product",

              averageRating: {
                $avg: "$rating",
              },

              reviewCount: {
                $sum: 1,
              },
            },
          },
        ]);
    }

    const reviewMap =
      new Map(
        reviewStats.map(
          (review) => [
            String(review._id),
            {
              rating: Number(
                Number(
                  review.averageRating ||
                    0
                ).toFixed(1)
              ),

              reviews: Number(
                review.reviewCount ||
                  0
              ),
            },
          ]
        )
      );

    /* =====================================================
       6. PRODUCT TYPE SETS
    ===================================================== */

    const newArrivalIdSet =
      new Set(
        newArrivalProducts.map(
          (product: any) =>
            String(product._id)
        )
      );

    const bestSellerIdSet =
      new Set(
        bestSellerProducts.map(
          (product: any) =>
            String(product._id)
        )
      );

    const featuredIdSet =
      new Set(
        featuredProducts.map(
          (product: any) =>
            String(product._id)
        )
      );

    /* =====================================================
       7. FORMAT FINAL PRODUCTS
    ===================================================== */

    const products =
      mergedProducts.map(
        (product) => {
          const id =
            String(product._id);

          /* -----------------------------------------------
             SIMPLE PRODUCT PRICE
          ------------------------------------------------ */

          let price =
            typeof product.price ===
            "number"
              ? product.price
              : null;

          let compareAtPrice =
            typeof product.compareAtPrice ===
            "number"
              ? product.compareAtPrice
              : null;

          let stock =
            typeof product.stock ===
            "number"
              ? product.stock
              : 0;

          /* -----------------------------------------------
             VARIANTS
          ------------------------------------------------ */

          const formattedVariants =
            Array.isArray(
              product.variants
            )
              ? product.variants
                  .filter(
                    (variant: any) =>
                      variant.isActive !==
                      false
                  )
                  .map(
                    (
                      variant: any
                    ) => ({
                      id: variant._id
                        ? String(
                            variant._id
                          )
                        : undefined,

                      packSize:
                        variant.packSize ||
                        "",

                      price:
                        typeof variant.price ===
                        "number"
                          ? variant.price
                          : 0,

                      compareAtPrice:
                        typeof variant.compareAtPrice ===
                        "number"
                          ? variant.compareAtPrice
                          : null,

                      stock:
                        typeof variant.stock ===
                        "number"
                          ? variant.stock
                          : 0,

                      sku:
                        variant.sku ||
                        "",

                      isActive:
                        variant.isActive !==
                        false,
                    })
                  )
              : [];

          /* -----------------------------------------------
             IF PRODUCT USES VARIANTS
             USE CHEAPEST ACTIVE VARIANT
          ------------------------------------------------ */

          if (
            price === null &&
            formattedVariants.length >
              0
          ) {
            const sortedVariants =
              [
                ...formattedVariants,
              ].sort(
                (a, b) =>
                  Number(
                    a.price
                  ) -
                  Number(
                    b.price
                  )
              );

            const cheapest =
              sortedVariants[0];

            price = Number(
              cheapest.price || 0
            );

            compareAtPrice =
              cheapest.compareAtPrice !=
              null
                ? Number(
                    cheapest.compareAtPrice
                  )
                : null;

            stock =
              formattedVariants.reduce(
                (
                  total: number,
                  variant: {
                    stock: number;
                  }
                ) =>
                  total +
                  Number(
                    variant.stock ||
                      0
                  ),
                0
              );
          }

          /* -----------------------------------------------
             IF SIMPLE PRICE EXISTS BUT VARIANTS ALSO EXIST
             CALCULATE TOTAL VARIANT STOCK
          ------------------------------------------------ */

          if (
            formattedVariants.length >
            0
          ) {
            stock =
              formattedVariants.reduce(
                (
                  total: number,
                  variant: {
                    stock: number;
                  }
                ) =>
                  total +
                  Number(
                    variant.stock ||
                      0
                  ),
                0
              );
          }

          /* -----------------------------------------------
             BADGE
          ------------------------------------------------ */

          let badge:
            | string
            | null = null;

          if (
            bestSellerIdSet.has(
              id
            )
          ) {
            badge =
              "BEST SELLER";
          } else if (
            newArrivalIdSet.has(
              id
            )
          ) {
            badge =
              "NEW ARRIVAL";
          } else if (
            featuredIdSet.has(
              id
            )
          ) {
            badge =
              "FEATURED";
          } else if (
            compareAtPrice !==
              null &&
            price !== null &&
            compareAtPrice > price
          ) {
            badge = "SALE";
          }

          /* -----------------------------------------------
             REVIEW DATA
          ------------------------------------------------ */

          const stats =
            reviewMap.get(id);

          /* -----------------------------------------------
             DELIVERY
          ------------------------------------------------ */

          const deliveryType =
            product.deliveryType ===
            "paid"
              ? "paid"
              : "free";

          const deliveryCharge =
            deliveryType ===
            "paid"
              ? Number(
                  product.deliveryCharge ||
                    0
                )
              : 0;

          /* -----------------------------------------------
             FINAL PRODUCT
          ------------------------------------------------ */

          return {
            id,

            name:
              product.name,

            slug:
              product.slug,

            category:
              product.category
                ?.name ||
              "Seeds",

            categorySlug:
              product.category
                ?.slug ||
              "",

            productType:
              product.productType,

            shortDescription:
              product.shortDescription ||
              "",

            image:
              Array.isArray(
                product.images
              ) &&
              product.images.length >
                0
                ? product
                    .images[0]
                : "/images/placeholder-product.jpg",

            images:
              product.images ||
              [],

            price:
              price ?? 0,

            compareAtPrice,

            stock,

            sku:
              product.sku ||
              "",

            /*
             * Backend variants
             */

            variants:
              formattedVariants,

            /*
             * Delivery
             *
             * This is now sent to the
             * homepage frontend so
             * Add to Cart can store
             * the same delivery data.
             */

            deliveryType,

            deliveryCharge,

            /*
             * Backend review statistics
             */

            rating:
              stats?.rating ||
              0,

            reviews:
              stats?.reviews ||
              0,

            badge,

            isFeatured:
              Boolean(
                product.isFeatured
              ),

            isNewArrival:
              newArrivalIdSet.has(
                id
              ),

            isBestSeller:
              bestSellerIdSet.has(
                id
              ),

            soldQuantity:
              bestSellerRows.find(
                (item) =>
                  String(
                    item._id
                  ) === id
              )?.soldQuantity ||
              0,

            href:
              `/shop/${product.slug}`,
          };
        }
      );

    /* =====================================================
       8. RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        products,

        bestSellers:
          bestSellerProducts.map(
            (product) =>
              String(
                product._id
              )
          ),

        newArrivals:
          newArrivalProducts.map(
            (product: any) =>
              String(
                product._id
              )
          ),

        featuredProducts:
          featuredProducts.map(
            (product: any) =>
              String(
                product._id
              )
          ),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error(
      "HOME PRODUCTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to load homepage products",

        products: [],
      },
      {
        status: 500,
      }
    );
  }
}