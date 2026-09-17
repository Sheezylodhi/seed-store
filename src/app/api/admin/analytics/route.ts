
import { NextResponse } from "next/server";
import { PipelineStage } from "mongoose";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

type Range = "7d" | "30d" | "90d" | "1y";

function getRangeConfig(range: Range) {
  const now = new Date();

  if (range === "7d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);

    const previousStart = new Date(start);
    previousStart.setDate(previousStart.getDate() - 7);

    const previousEnd = new Date(start);
    previousEnd.setMilliseconds(-1);

    return {
      start,
      end: now,
      previousStart,
      previousEnd,
      interval: "day" as const,
    };
  }

  if (range === "90d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 89);

    const previousStart = new Date(start);
    previousStart.setDate(previousStart.getDate() - 90);

    const previousEnd = new Date(start);
    previousEnd.setMilliseconds(-1);

    return {
      start,
      end: now,
      previousStart,
      previousEnd,
      interval: "day" as const,
    };
  }

  if (range === "1y") {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 11);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const previousStart = new Date(start);
    previousStart.setFullYear(
      previousStart.getFullYear() - 1
    );

    const previousEnd = new Date(start);
    previousEnd.setMilliseconds(-1);

    return {
      start,
      end: now,
      previousStart,
      previousEnd,
      interval: "month" as const,
    };
  }

  const start = new Date(now);
  start.setDate(start.getDate() - 29);

  const previousStart = new Date(start);
  previousStart.setDate(previousStart.getDate() - 30);

  const previousEnd = new Date(start);
  previousEnd.setMilliseconds(-1);

  return {
    start,
    end: now,
    previousStart,
    previousEnd,
    interval: "day" as const,
  };
}

function buildTrendPipeline(
  start: Date,
  end: Date,
  interval: "day" | "month"
): PipelineStage[] {
  const dateFormat =
    interval === "month"
      ? "%Y-%m"
      : "%Y-%m-%d";

  return [
    {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
        paymentStatus: {
          $in: ["paid", "partially_refunded"],
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: "$createdAt",
          },
        },
        revenue: {
          $sum: "$total",
        },
        orders: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const requestedRange =
      searchParams.get("range") as Range | null;

    const range: Range =
      requestedRange &&
      ["7d", "30d", "90d", "1y"].includes(
        requestedRange
      )
        ? requestedRange
        : "30d";

    const {
      start,
      end,
      previousStart,
      previousEnd,
      interval,
    } = getRangeConfig(range);

    /*
     * ------------------------------------------------------
     * REVENUE / ORDERS SUMMARY
     * ------------------------------------------------------
     */

    const [
      currentSummary,
      previousSummary,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lte: end,
            },
            paymentStatus: {
              $in: [
                "paid",
                "partially_refunded",
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$total",
            },
            orders: {
              $sum: 1,
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: previousStart,
              $lte: previousEnd,
            },
            paymentStatus: {
              $in: [
                "paid",
                "partially_refunded",
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$total",
            },
            orders: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const currentRevenue =
      currentSummary[0]?.revenue || 0;

    const currentOrders =
      currentSummary[0]?.orders || 0;

    const previousRevenue =
      previousSummary[0]?.revenue || 0;

    const previousOrders =
      previousSummary[0]?.orders || 0;

    const averageOrderValue =
      currentOrders > 0
        ? currentRevenue / currentOrders
        : 0;

    const previousAverageOrderValue =
      previousOrders > 0
        ? previousRevenue / previousOrders
        : 0;

    /*
     * ------------------------------------------------------
     * NEW CUSTOMERS
     * ------------------------------------------------------
     */

    const [
      currentCustomers,
      previousCustomers,
    ] = await Promise.all([
      User.countDocuments({
        role: "customer",
        createdAt: {
          $gte: start,
          $lte: end,
        },
      }),

      User.countDocuments({
        role: "customer",
        createdAt: {
          $gte: previousStart,
          $lte: previousEnd,
        },
      }),
    ]);

    /*
     * ------------------------------------------------------
     * ORDER STATUS
     * ------------------------------------------------------
     */

    const orderStatus = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: "$orderStatus",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    /*
     * ------------------------------------------------------
     * PAYMENT METHODS
     * ------------------------------------------------------
     */

    const paymentMethods = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          paymentStatus: {
            $in: [
              "paid",
              "partially_refunded",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: {
            $sum: 1,
          },
          revenue: {
            $sum: "$total",
          },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
    ]);

    /*
     * ------------------------------------------------------
     * PAYMENT STATUS
     * ------------------------------------------------------
     */

    const paymentStatus = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: "$paymentStatus",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    /*
     * ------------------------------------------------------
     * SALES TREND
     * ------------------------------------------------------
     */

    const trendResults =
      await Order.aggregate(
        buildTrendPipeline(
          start,
          end,
          interval
        )
      );

    /*
     * ------------------------------------------------------
     * TOP PRODUCTS
     * ------------------------------------------------------
     *
     * Product name + image come from the snapshot where
     * possible, so old orders still remain meaningful.
     */

    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          paymentStatus: {
            $in: [
              "paid",
              "partially_refunded",
            ],
          },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.product",
          name: {
            $first: "$items.name",
          },
          image: {
            $first: "$items.image",
          },
          unitsSold: {
            $sum: "$items.quantity",
          },
          revenue: {
            $sum: {
              $multiply: [
                "$items.price",
                "$items.quantity",
              ],
            },
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
      {
        $limit: 8,
      },
    ]);

    /*
     * ------------------------------------------------------
     * INVENTORY
     * ------------------------------------------------------
     */

    const inventoryResult =
      await Product.aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $unwind: {
            path: "$variants",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: null,

            activeProducts: {
              $addToSet: "$_id",
            },

            totalStockUnits: {
              $sum: {
                $ifNull: [
                  "$variants.stock",
                  0,
                ],
              },
            },

            lowStockVariants: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gt: [
                          "$variants.stock",
                          0,
                        ],
                      },
                      {
                        $lte: [
                          "$variants.stock",
                          10,
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            outOfStockVariants: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$variants.stock",
                      0,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

    const totalProducts =
      await Product.countDocuments();

    const inventory =
      inventoryResult[0] || {
        activeProducts: [],
        totalStockUnits: 0,
        lowStockVariants: 0,
        outOfStockVariants: 0,
      };

    /*
     * ------------------------------------------------------
     * FULFILLMENT
     * ------------------------------------------------------
     */

    const fulfillmentResult =
      await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $group: {
            _id: null,

            delivered: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$orderStatus",
                      "delivered",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            cancelled: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$orderStatus",
                      "cancelled",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            pending: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$orderStatus",
                      "pending",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            processing: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$orderStatus",
                      "processing",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            shipped: {
              $sum: {
                $cond: [
                  {
                    $in: [
                      "$orderStatus",
                      [
                        "shipped",
                        "out_for_delivery",
                      ],
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

    const fulfillment =
      fulfillmentResult[0] || {
        delivered: 0,
        cancelled: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
      };

    /*
     * ------------------------------------------------------
     * FORMAT RESPONSE
     * ------------------------------------------------------
     */

    const data = {
      summary: {
        revenue: currentRevenue,
        previousRevenue,

        orders: currentOrders,
        previousOrders,

        averageOrderValue,
        previousAverageOrderValue,

        newCustomers: currentCustomers,
        previousNewCustomers: previousCustomers,
      },

      orderStatus: orderStatus.map(
        (item) => ({
          status: item._id,
          count: item.count,
        })
      ),

      paymentMethods:
        paymentMethods.map(
          (item) => ({
            method: item._id,
            count: item.count,
            revenue: item.revenue,
          })
        ),

      paymentStatus:
        paymentStatus.map(
          (item) => ({
            status: item._id,
            count: item.count,
          })
        ),

      trends: trendResults.map(
        (item) => ({
          label: item._id,
          revenue: item.revenue,
          orders: item.orders,
        })
      ),

      topProducts:
        topProducts.map(
          (item) => ({
            productId:
              item._id?.toString(),
            name:
              item.name || "Unknown product",
            image: item.image || "",
            unitsSold:
              item.unitsSold || 0,
            revenue:
              item.revenue || 0,
            orders:
              item.orders || 0,
          })
        ),

      inventory: {
        totalProducts,

        activeProducts:
          inventory.activeProducts?.length ||
          0,

        lowStockVariants:
          inventory.lowStockVariants || 0,

        outOfStockVariants:
          inventory.outOfStockVariants || 0,

        totalStockUnits:
          inventory.totalStockUnits || 0,
      },

      fulfillment: {
        delivered:
          fulfillment.delivered || 0,

        cancelled:
          fulfillment.cancelled || 0,

        pending:
          fulfillment.pending || 0,

        processing:
          fulfillment.processing || 0,

        shipped:
          fulfillment.shipped || 0,
      },
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "ADMIN ANALYTICS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load analytics",
      },
      {
        status: 500,
      }
    );
  }
}

