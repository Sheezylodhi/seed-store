
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import User from "@/models/User";
import Order from "@/models/Order";

type CustomerOrderStats = {
  totalOrders: number;
  totalSpent: number;
  deliveredOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
};

const EMPTY_STATS: CustomerOrderStats = {
  totalOrders: 0,
  totalSpent: 0,
  deliveredOrders: 0,
  pendingOrders: 0,
  cancelledOrders: 0,
};

function createStats(): CustomerOrderStats {
  return {
    totalOrders: 0,
    totalSpent: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  };
}

function addStats(
  target: CustomerOrderStats,
  source: Partial<CustomerOrderStats>
) {
  target.totalOrders += Number(source.totalOrders || 0);
  target.totalSpent += Number(source.totalSpent || 0);
  target.deliveredOrders += Number(source.deliveredOrders || 0);
  target.pendingOrders += Number(source.pendingOrders || 0);
  target.cancelledOrders += Number(source.cancelledOrders || 0);
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "all";

    const requestedPage = Number(
      searchParams.get("page") || "1"
    );

    const requestedLimit = Number(
      searchParams.get("limit") || "10"
    );

    const page = Number.isFinite(requestedPage)
      ? Math.max(Math.floor(requestedPage), 1)
      : 1;

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(
          Math.max(Math.floor(requestedLimit), 1),
          100
        )
      : 10;

    const skip = (page - 1) * limit;

    /* =====================================================
       CUSTOMER FILTER
    ===================================================== */

    const userFilter: Record<string, unknown> = {
      role: "customer",
    };

    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(escapedSearch, "i");

      userFilter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
      ];
    }

    if (status === "active") {
      userFilter.isActive = true;
    }

    if (status === "inactive") {
      userFilter.isActive = false;
    }

    /* =====================================================
       DATE
    ===================================================== */

    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() - 30
    );

    /* =====================================================
       GET CUSTOMERS + COUNTS
    ===================================================== */

    const [
      customers,
      filteredTotalCustomers,
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      newCustomers,
    ] = await Promise.all([
      User.find(userFilter)
        .select(
          "name email phone role isActive createdAt updatedAt"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(userFilter),

      User.countDocuments({
        role: "customer",
      }),

      User.countDocuments({
        role: "customer",
        isActive: true,
      }),

      User.countDocuments({
        role: "customer",
        isActive: false,
      }),

      User.countDocuments({
        role: "customer",
        createdAt: {
          $gte: thirtyDaysAgo,
        },
      }),
    ]);

    /* =====================================================
       CUSTOMER IDS + EMAILS
    ===================================================== */

    const customerIds = customers.map(
      (customer) => customer._id
    );

    const customerEmails = customers
      .map((customer) =>
        String(customer.email || "")
          .trim()
          .toLowerCase()
      )
      .filter(Boolean);

    /* =====================================================
       ORDER STATS
       
       We use TWO ways to identify a customer:

       1. Order.customer -> User._id
       2. Order.customerInfo.email -> User.email

       This makes old orders work too if they don't have
       the customer ObjectId stored.
    ===================================================== */

    const statsMap = new Map<
      string,
      CustomerOrderStats
    >();

    if (customers.length > 0) {
      /* ---------------------------------------------------
         A) ORDERS WITH CUSTOMER OBJECT ID
      --------------------------------------------------- */

      const ordersByCustomer =
        customerIds.length > 0
          ? await Order.aggregate([
              {
                $match: {
                  customer: {
                    $in: customerIds,
                  },
                },
              },

              {
                $group: {
                  _id: "$customer",

                  totalOrders: {
                    $sum: 1,
                  },

                  totalSpent: {
                    $sum: {
                      $cond: [
                        {
                          $ne: [
                            "$orderStatus",
                            "cancelled",
                          ],
                        },
                        {
                          $ifNull: [
                            "$total",
                            0,
                          ],
                        },
                        0,
                      ],
                    },
                  },

                  deliveredOrders: {
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

                  pendingOrders: {
                    $sum: {
                      $cond: [
                        {
                          $in: [
                            "$orderStatus",
                            [
                              "pending",
                              "confirmed",
                              "processing",
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

                  cancelledOrders: {
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
                },
              },
            ])
          : [];

      /* ---------------------------------------------------
         SAVE OBJECT ID STATS
      --------------------------------------------------- */

      for (const stat of ordersByCustomer) {
        statsMap.set(
          String(stat._id),
          {
            totalOrders: Number(
              stat.totalOrders || 0
            ),
            totalSpent: Number(
              stat.totalSpent || 0
            ),
            deliveredOrders: Number(
              stat.deliveredOrders || 0
            ),
            pendingOrders: Number(
              stat.pendingOrders || 0
            ),
            cancelledOrders: Number(
              stat.cancelledOrders || 0
            ),
          }
        );
      }

      /* ---------------------------------------------------
         B) LEGACY ORDERS WITHOUT CUSTOMER ID

         These orders are matched by email.

         IMPORTANT:
         We ONLY take orders where customer is null/missing
         so the same order isn't counted twice.
      --------------------------------------------------- */

      if (customerEmails.length > 0) {
        const legacyOrdersByEmail =
          await Order.aggregate([
            {
              $match: {
                $or: [
                  {
                    customer: null,
                  },
                  {
                    customer: {
                      $exists: false,
                    },
                  },
                ],

                "customerInfo.email": {
                  $in: customerEmails,
                },
              },
            },

            {
              $group: {
                _id: {
                  $toLower:
                    "$customerInfo.email",
                },

                totalOrders: {
                  $sum: 1,
                },

                totalSpent: {
                  $sum: {
                    $cond: [
                      {
                        $ne: [
                          "$orderStatus",
                          "cancelled",
                        ],
                      },
                      {
                        $ifNull: [
                          "$total",
                          0,
                        ],
                      },
                      0,
                    ],
                  },
                },

                deliveredOrders: {
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

                pendingOrders: {
                  $sum: {
                    $cond: [
                      {
                        $in: [
                          "$orderStatus",
                          [
                            "pending",
                            "confirmed",
                            "processing",
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

                cancelledOrders: {
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
              },
            },
          ]);

        /* -------------------------------------------------
           MAP EMAIL -> USER ID

           This lets us attach legacy orders to the
           correct customer.
        ------------------------------------------------- */

        const emailToCustomerId =
          new Map<string, string>();

        for (const customer of customers) {
          const email = String(
            customer.email || ""
          )
            .trim()
            .toLowerCase();

          if (email) {
            emailToCustomerId.set(
              email,
              String(customer._id)
            );
          }
        }

        /* -------------------------------------------------
           MERGE LEGACY STATS
        ------------------------------------------------- */

        for (const stat of legacyOrdersByEmail) {
          const email = String(
            stat._id || ""
          )
            .trim()
            .toLowerCase();

          const customerId =
            emailToCustomerId.get(email);

          if (!customerId) {
            continue;
          }

          const existing =
            statsMap.get(customerId) ||
            createStats();

          addStats(existing, {
            totalOrders:
              stat.totalOrders,
            totalSpent:
              stat.totalSpent,
            deliveredOrders:
              stat.deliveredOrders,
            pendingOrders:
              stat.pendingOrders,
            cancelledOrders:
              stat.cancelledOrders,
          });

          statsMap.set(
            customerId,
            existing
          );
        }
      }
    }

    /* =====================================================
       FORMAT CUSTOMERS
    ===================================================== */

    const formattedCustomers =
      customers.map((customer) => {
        const customerStats =
          statsMap.get(
            String(customer._id)
          ) || {
            ...EMPTY_STATS,
          };

        return {
          ...customer,

          orderStats: {
            totalOrders:
              Number(
                customerStats.totalOrders || 0
              ),

            totalSpent:
              Number(
                customerStats.totalSpent || 0
              ),

            deliveredOrders:
              Number(
                customerStats.deliveredOrders ||
                  0
              ),

            pendingOrders:
              Number(
                customerStats.pendingOrders ||
                  0
              ),

            cancelledOrders:
              Number(
                customerStats.cancelledOrders ||
                  0
              ),
          },
        };
      });

    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages = Math.max(
      Math.ceil(
        filteredTotalCustomers / limit
      ),
      1
    );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        data: {
          customers:
            formattedCustomers,

          pagination: {
            page,
            limit,
            total:
              filteredTotalCustomers,
            totalPages,
          },

          stats: {
            totalCustomers,
            activeCustomers,
            inactiveCustomers,
            newCustomers,
          },
        },
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Admin customers GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load customers",
      },
      {
        status: 500,
      }
    );
  }
}

