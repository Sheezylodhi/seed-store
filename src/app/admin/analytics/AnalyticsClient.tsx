"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";

type Range = "7d" | "30d" | "90d" | "1y";

type TrendPoint = {
  label: string;
  revenue: number;
  orders: number;
};

type ProductPerformance = {
  productId: string;
  name: string;
  image?: string;
  unitsSold: number;
  revenue: number;
  orders: number;
};

type AnalyticsData = {
  summary: {
    revenue: number;
    previousRevenue: number;
    orders: number;
    previousOrders: number;
    averageOrderValue: number;
    previousAverageOrderValue: number;
    newCustomers: number;
    previousNewCustomers: number;
  };

  orderStatus: {
    status: string;
    count: number;
  }[];

  paymentMethods: {
    method: string;
    count: number;
    revenue: number;
  }[];

  paymentStatus: {
    status: string;
    count: number;
  }[];

  trends: TrendPoint[];

  topProducts: ProductPerformance[];

  inventory: {
    totalProducts: number;
    activeProducts: number;
    lowStockVariants: number;
    outOfStockVariants: number;
    totalStockUnits: number;
  };

  fulfillment: {
    delivered: number;
    cancelled: number;
    pending: number;
    processing: number;
    shipped: number;
  };
};

const RANGE_LABELS: Record<Range, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "1y": "Last 12 months",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Cash on delivery",
  card: "Card",
  bank_transfer: "Bank transfer",
  jazzcash: "JazzCash",
  easypaisa: "EasyPaisa",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  partially_refunded: "Partially refunded",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-PK").format(value || 0);
}

function formatCompactCurrency(value: number) {
  if (value >= 1000000) {
    return `₨${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `₨${(value / 1000).toFixed(1)}K`;
  }

  return `₨${Math.round(value)}`;
}

function calculateChange(current: number, previous: number) {
  if (!previous) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
}

function formatChange(value: number) {
  if (!Number.isFinite(value)) return "0%";

  const rounded =
    Math.abs(value) >= 10
      ? Math.round(value)
      : Number(value.toFixed(1));

  return `${rounded}%`;
}

function getDateLabel(date: string, range: Range) {
  const parsed = new Date(date);

  if (range === "1y") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(parsed);
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(parsed);
}

export default function AnalyticsClient() {
  const [range, setRange] = useState<Range>("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAnalytics(selectedRange = range) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/analytics?range=${selectedRange}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        window.location.replace("/");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load analytics"
        );
      }

      setData(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics(range);
  }, [range]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-[70vh] px-4 py-8 sm:px-6 lg:px-10">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-[#dbe6dc] bg-white p-9 text-center shadow-[0_35px_100px_rgba(16,41,29,0.12)]">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[#b9d39e]" />

            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#eef4eb] blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-[#e3ebe2] bg-[#f6f9f4] shadow-inner">
                <RefreshCw
                  size={21}
                  className="text-[#315c42]"
                />
              </div>

              <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.22em] text-[#96a29a]">
                Analytics system
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em] text-[#17231c]">
                Unable to load analytics
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#7b867f]">
                {error}
              </p>

              <button
                onClick={() => loadAnalytics()}
                className="mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-[#10291d] px-7 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(16,41,29,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#173b29]"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const revenueChange = calculateChange(
    data.summary.revenue,
    data.summary.previousRevenue
  );

  const ordersChange = calculateChange(
    data.summary.orders,
    data.summary.previousOrders
  );

  const aovChange = calculateChange(
    data.summary.averageOrderValue,
    data.summary.previousAverageOrderValue
  );

  const customersChange = calculateChange(
    data.summary.newCustomers,
    data.summary.previousNewCustomers
  );

  const totalOrders = data.orderStatus.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const deliveredPercentage = totalOrders
    ? Math.round(
        (data.fulfillment.delivered / totalOrders) * 100
      )
    : 0;

  const cancelledPercentage = totalOrders
    ? Math.round(
        (data.fulfillment.cancelled / totalOrders) * 100
      )
    : 0;

  return (
    <div className="relative min-h-full overflow-hidden bg-white pb-14">
   

      <div className="mx-auto max-w-[1680px] px-4 pt-3 sm:px-6 lg:px-9 xl:px-10">
        {/* =====================================================
            PREMIUM HEADER
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[32px] border border-[#193a29] bg-[#0d2419] shadow-[0_28px_80px_rgba(16,41,29,0.16)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(185,211,158,0.13),transparent_30%),radial-gradient(circle_at_50%_120%,rgba(49,92,66,0.28),transparent_42%)]" />

          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/[0.055]" />
          <div className="pointer-events-none absolute -right-8 -top-16 h-52 w-52 rounded-full border border-white/[0.045]" />
          <div className="pointer-events-none absolute bottom-[-160px] left-[42%] h-72 w-72 rounded-full bg-[#315c42]/20 blur-[80px]" />

          <div className="relative px-5 py-7 sm:px-8 sm:py-8 lg:px-9">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07] shadow-inner">
                    <BarChart3
                      size={14}
                      className="text-[#c5dda8]"
                    />
                  </span>

                  <div className="h-px w-7 bg-[#6f9278]/50" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#9eb1a4]">
                    Store intelligence
                  </p>
                </div>

                <h1 className="mt-4 text-[34px] font-semibold tracking-[-0.055em] text-white sm:text-[42px]">
                  Analytics
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#a7b7ad]">
                  Understand your sales, customers, products and
                  order performance at a glance.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <CalendarDays
                    size={14}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8ca095]"
                  />

                  <select
                    value={range}
                    onChange={(event) =>
                      setRange(event.target.value as Range)
                    }
                    className="h-12 appearance-none rounded-2xl border border-white/10 bg-white/[0.07] pl-9 pr-11 text-xs font-semibold text-white shadow-inner outline-none transition-all hover:border-white/15 hover:bg-white/[0.1] focus:border-[#9fbc9f]"
                  >
                    {Object.entries(RANGE_LABELS).map(
                      ([value, label]) => (
                        <option
                          key={value}
                          value={value}
                          className="bg-[#10291d] text-white"
                        >
                          {label}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#91a399]"
                  />
                </div>

                <button
                  onClick={() => loadAnalytics()}
                  className="flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-[#c5dda8] px-5 text-xs font-bold text-[#132b1d] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d2e5ba]"
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="relative mt-8 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
              <HeaderMiniStat
                label="Revenue"
                value={formatCompactCurrency(
                  data.summary.revenue
                )}
              />

              <HeaderMiniStat
                label="Orders"
                value={formatNumber(data.summary.orders)}
              />

              <HeaderMiniStat
                label="AOV"
                value={formatCompactCurrency(
                  data.summary.averageOrderValue
                )}
              />

              <HeaderMiniStat
                label="Customers"
                value={formatNumber(
                  data.summary.newCustomers
                )}
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            KPI CARDS
        ====================================================== */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Revenue"
            value={formatCurrency(data.summary.revenue)}
            icon={Wallet}
            change={revenueChange}
            description="Compared with previous period"
            featured
          />

          <MetricCard
            label="Orders"
            value={formatNumber(data.summary.orders)}
            icon={ClipboardList}
            change={ordersChange}
            description="Total orders in period"
          />

          <MetricCard
            label="Average order value"
            value={formatCurrency(
              data.summary.averageOrderValue
            )}
            icon={CircleDollarSign}
            change={aovChange}
            description="Average spend per order"
          />

          <MetricCard
            label="New customers"
            value={formatNumber(data.summary.newCustomers)}
            icon={Users}
            change={customersChange}
            description="Customers registered in period"
          />
        </div>

        {/* =====================================================
            REVENUE + ORDER STATUS
        ====================================================== */}

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(350px,0.8fr)]">
          <section className="overflow-hidden rounded-[30px] border border-[#dce6dd] bg-white shadow-[0_24px_70px_rgba(16,41,29,0.065)]">
            <div className="flex flex-col justify-between gap-5 border-b border-[#edf1ed] px-5 py-5 sm:px-7 sm:py-6 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#10291d] shadow-[0_10px_25px_rgba(16,41,29,0.14)]">
                    <TrendingUp
                      size={18}
                      className="text-[#c5dda8]"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9aa59d]">
                      Sales intelligence
                    </p>

                    <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.025em] text-[#17231c]">
                      Revenue & orders
                    </h2>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#89958d]">
                  Sales performance over{" "}
                  {RANGE_LABELS[range].toLowerCase()}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-[#e7ede7] bg-[#fafcf9] p-1.5">
                <span className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#516158] shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#315c42] shadow-[0_0_0_3px_rgba(49,92,66,0.08)]" />
                  Revenue
                </span>

                <span className="flex items-center gap-2 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8b9690]">
                  <span className="h-2 w-2 rounded-full bg-[#b8c7bb]" />
                  Orders
                </span>
              </div>
            </div>

            <div className="bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfa_100%)] px-3 pb-6 pt-5 sm:px-6 sm:pt-6">
              <RevenueChart
                points={data.trends}
                range={range}
              />
            </div>
          </section>

          <OrderStatusCard
            items={data.orderStatus}
            totalOrders={totalOrders}
          />
        </div>

        {/* =====================================================
            PERFORMANCE ROW
        ====================================================== */}

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <PerformanceCard
            title="Fulfillment"
            description="How orders are moving through your store"
            icon={Truck}
          >
            <div className="space-y-5">
              <ProgressRow
                label="Delivered"
                value={data.fulfillment.delivered}
                total={totalOrders}
                icon={CheckCircle2}
              />

              <ProgressRow
                label="Processing"
                value={data.fulfillment.processing}
                total={totalOrders}
                icon={RefreshCw}
              />

              <ProgressRow
                label="Shipped"
                value={data.fulfillment.shipped}
                total={totalOrders}
                icon={Truck}
              />

              <ProgressRow
                label="Cancelled"
                value={data.fulfillment.cancelled}
                total={totalOrders}
                icon={XCircle}
                danger
              />
            </div>
          </PerformanceCard>

          <PaymentMethodsCard
            items={data.paymentMethods}
          />

          <InventoryCard inventory={data.inventory} />
        </div>

        {/* =====================================================
            TOP PRODUCTS
        ====================================================== */}

        <section className="mt-5 overflow-hidden rounded-[30px] border border-[#dce6dd] bg-white shadow-[0_24px_70px_rgba(16,41,29,0.06)]">
          <div className="flex flex-col justify-between gap-4 border-b border-[#edf1ed] px-5 py-5 sm:flex-row sm:items-center sm:px-7 sm:py-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#10291d] shadow-[0_10px_25px_rgba(16,41,29,0.14)]">
                  <ShoppingBag
                    size={18}
                    className="text-[#c5dda8]"
                  />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9aa59d]">
                    Product intelligence
                  </p>

                  <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.025em] text-[#17231c]">
                    Top products
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-xs text-[#8a958e]">
                Products generating the most sales during this
                period
              </p>
            </div>

            <span className="rounded-full border border-[#dce7dc] bg-[#f5f9f3] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#64766b]">
              Product performance
            </span>
          </div>

          <div className="overflow-x-auto">
            {data.topProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No product sales yet"
                description="Product performance will appear here once orders are placed."
              />
            ) : (
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#edf1ed] bg-[#fafcf9] text-left">
                    <th className="px-7 py-4 text-[9px] font-bold uppercase tracking-[0.17em] text-[#9ba49e]">
                      Product
                    </th>

                    <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.17em] text-[#9ba49e]">
                      Units sold
                    </th>

                    <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.17em] text-[#9ba49e]">
                      Orders
                    </th>

                    <th className="px-7 py-4 text-right text-[9px] font-bold uppercase tracking-[0.17em] text-[#9ba49e]">
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.topProducts.map(
                    (product, index) => (
                      <tr
                        key={product.productId}
                        className="group border-b border-[#f0f3ef] last:border-0 transition-all duration-200 hover:bg-[#f9fbf8]"
                      >
                        <td className="px-7 py-5">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e3eae2] bg-[#f5f8f4] text-[9px] font-bold text-[#718078] transition-all group-hover:border-[#cdddcf] group-hover:bg-[#edf4ea]">
                              {String(index + 1).padStart(
                                2,
                                "0"
                              )}
                            </div>

                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 rounded-[14px] border border-[#e3eae2] object-cover shadow-sm transition-transform duration-300 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-[#e3eae2] bg-[#edf3e9]">
                                <Package
                                  size={17}
                                  className="text-[#587260]"
                                />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="max-w-[300px] truncate text-xs font-bold text-[#26352c]">
                                {product.name}
                              </p>

                              <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.1em] text-[#a0aaa4]">
                                Product
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-xl border border-[#e7ece6] bg-[#f7f9f6] px-3 py-2 text-xs font-bold text-[#536158]">
                            {formatNumber(
                              product.unitsSold
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-xs font-medium text-[#68756c]">
                          {formatNumber(product.orders)}
                        </td>

                        <td className="px-7 py-5 text-right">
                          <p className="text-xs font-bold text-[#26352c]">
                            {formatCurrency(
                              product.revenue
                            )}
                          </p>

                          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.11em] text-[#a0aaa4]">
                            Revenue generated
                          </p>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* =====================================================
            BOTTOM INSIGHTS
        ====================================================== */}

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <PaymentStatusCard
            items={data.paymentStatus}
          />

          <div className="relative overflow-hidden rounded-[30px] border border-[#1d3d2b] bg-[#0d2419] p-6 text-white shadow-[0_28px_75px_rgba(16,41,29,0.16)] sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(185,211,158,0.11),transparent_28%),radial-gradient(circle_at_20%_120%,rgba(49,92,66,0.28),transparent_45%)]" />

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/[0.055]" />
            <div className="pointer-events-none absolute -right-6 top-10 h-36 w-36 rounded-full bg-[#315c42]/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-100px] left-[25%] h-56 w-56 rounded-full bg-[#6f9278]/10 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#9fb3a4]">
                  Store health
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em]">
                  Fulfillment snapshot
                </h2>

                <p className="mt-1.5 text-[11px] text-[#92a69a]">
                  A quick view of operational performance.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/10 bg-white/[0.07] shadow-inner">
                <BarChart3
                  size={19}
                  className="text-[#c5dda8]"
                />
              </div>
            </div>

            <div className="relative mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <DarkStat
                label="Delivered"
                value={`${deliveredPercentage}%`}
              />

              <DarkStat
                label="Cancelled"
                value={`${cancelledPercentage}%`}
              />

              <DarkStat
                label="Orders"
                value={formatNumber(totalOrders)}
              />

              <DarkStat
                label="AOV"
                value={formatCompactCurrency(
                  data.summary.averageOrderValue
                )}
              />
            </div>

            <div className="relative mt-5 rounded-[20px] border border-white/10 bg-white/[0.045] p-4.5 shadow-inner">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold">
                    Delivery performance
                  </p>

                  <p className="mt-1 text-[10px] text-[#9fb3a4]">
                    Percentage of orders successfully delivered
                  </p>
                </div>

                <span className="text-xl font-semibold text-[#c5dda8]">
                  {deliveredPercentage}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#c4d7c8] transition-all"
                  style={{
                    width: `${Math.min(
                      deliveredPercentage,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HEADER MINI STAT
========================================================= */

function HeaderMiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] px-3.5 py-3 backdrop-blur-sm">
      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#81968a]">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm font-semibold tracking-[-0.02em] text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  label,
  value,
  icon: Icon,
  change,
  description,
  featured = false,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
  change: number;
  description: string;
  featured?: boolean;
}) {
  const positive = change >= 0;

  return (
    <div
      className={`group relative min-h-[176px] overflow-hidden rounded-[26px] border p-5.5 transition-all duration-300 hover:-translate-y-1 ${
        featured
          ? "border-[#1d402c] bg-[#10291d] shadow-[0_24px_65px_rgba(16,41,29,0.16)]"
          : "border-[#dce6dd] bg-white shadow-[0_18px_50px_rgba(16,41,29,0.055)] hover:border-[#cfded0] hover:shadow-[0_25px_65px_rgba(16,41,29,0.10)]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${
          featured
            ? "bg-[#315c42]/30"
            : "bg-[#e8f0e5]"
        }`}
      />

      <div
        className={`pointer-events-none absolute bottom-[-45px] left-[25%] h-24 w-24 rounded-full blur-2xl ${
          featured
            ? "bg-[#6f9278]/10"
            : "bg-[#f0f5ee]"
        }`}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${
            featured
              ? "border border-white/10 bg-white/[0.08] shadow-inner"
              : "border border-[#e1e9e0] bg-[#eef4eb]"
          }`}
        >
          <Icon
            size={18}
            className={
              featured
                ? "text-[#c5dda8]"
                : "text-[#315c42]"
            }
          />
        </div>

        <div
          className={`flex items-center gap-0.5 rounded-full px-2.5 py-1.5 text-[9px] font-bold ${
            positive
              ? featured
                ? "border border-[#c5dda8]/10 bg-[#c5dda8]/10 text-[#c5dda8]"
                : "bg-[#edf5ec] text-[#47704f]"
              : "bg-[#fbeceb] text-[#a05244]"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={11} />
          ) : (
            <ArrowDownRight size={11} />
          )}

          {formatChange(change)}
        </div>
      </div>

      <p
        className={`relative mt-7 text-[9px] font-bold uppercase tracking-[0.16em] ${
          featured
            ? "text-[#8fa499]"
            : "text-[#929c95]"
        }`}
      >
        {label}
      </p>

      <p
        className={`relative mt-1 truncate text-[27px] font-semibold tracking-[-0.05em] ${
          featured
            ? "text-white"
            : "text-[#17231c]"
        }`}
      >
        {value}
      </p>

      <p
        className={`relative mt-1.5 text-[10px] ${
          featured
            ? "text-[#8fa499]"
            : "text-[#98a39c]"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   REVENUE CHART
========================================================= */

function RevenueChart({
  points,
  range,
}: {
  points: TrendPoint[];
  range: Range;
}) {
  const width = 900;
  const height = 320;
  const paddingLeft = 55;
  const paddingRight = 18;
  const paddingTop = 24;
  const paddingBottom = 45;

  const chartWidth =
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;

  const maxRevenue = Math.max(
    ...points.map((point) => point.revenue),
    1
  );

  const maxOrders = Math.max(
    ...points.map((point) => point.orders),
    1
  );

  const revenuePoints = points.map(
    (point, index) => {
      const x =
        paddingLeft +
        (index / Math.max(points.length - 1, 1)) *
          chartWidth;

      const y =
        paddingTop +
        chartHeight -
        (point.revenue / maxRevenue) *
          chartHeight;

      return {
        x,
        y,
        ...point,
      };
    }
  );

  const revenuePath = revenuePoints
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath =
    revenuePoints.length > 0
      ? `${revenuePath} L ${
          revenuePoints[revenuePoints.length - 1].x
        } ${paddingTop + chartHeight} L ${
          revenuePoints[0].x
        } ${paddingTop + chartHeight} Z`
      : "";

  const labelIndexes = getLabelIndexes(
    points.length,
    range
  );

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-4 flex items-end justify-between px-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9aa49e]">
            Total revenue
          </p>

          <p className="mt-1 text-[22px] font-semibold tracking-[-0.04em] text-[#26352c]">
            {formatCurrency(
              points.reduce(
                (sum, point) => sum + point.revenue,
                0
              )
            )}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#9aa49e]">
            Orders
          </p>

          <p className="mt-1 text-[22px] font-semibold tracking-[-0.04em] text-[#26352c]">
            {formatNumber(
              points.reduce(
                (sum, point) => sum + point.orders,
                0
              )
            )}
          </p>
        </div>
      </div>

      <div className="rounded-[22px] border border-[#edf1ed] bg-[#fbfcfa] px-2 py-2 shadow-inner sm:px-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          preserveAspectRatio="none"
        >
          {[0, 0.25, 0.5, 0.75, 1].map(
            (ratio) => {
              const y =
                paddingTop +
                chartHeight * ratio;

              const value =
                maxRevenue * (1 - ratio);

              return (
                <g key={ratio}>
                  <line
                    x1={paddingLeft}
                    x2={width - paddingRight}
                    y1={y}
                    y2={y}
                    stroke="#e9eee9"
                    strokeWidth="1"
                  />

                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#a0aaa4"
                  >
                    {formatCompactCurrency(value)}
                  </text>
                </g>
              );
            }
          )}

          {points.length > 1 && (
            <path
              d={areaPath}
              fill="rgba(49,92,66,0.065)"
            />
          )}

          {points.length > 1 && (
            <path
              d={revenuePath}
              fill="none"
              stroke="#315c42"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {revenuePoints.map(
            (point, index) => (
              <g key={`${point.label}-${index}`}>
                {points.length <= 14 && (
                  <>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="7"
                      fill="rgba(49,92,66,0.08)"
                    />

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#ffffff"
                      stroke="#315c42"
                      strokeWidth="2"
                    />
                  </>
                )}

                {labelIndexes.includes(index) && (
                  <text
                    x={point.x}
                    y={height - 17}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#9aa49e"
                  >
                    {getDateLabel(
                      point.label,
                      range
                    )}
                  </text>
                )}
              </g>
            )
          )}

          {points.map((point, index) => {
            if (
              !labelIndexes.includes(index) ||
              points.length <= 1
            ) {
              return null;
            }

            const x =
              paddingLeft +
              (index /
                Math.max(points.length - 1, 1)) *
                chartWidth;

            const orderHeight =
              (point.orders / maxOrders) *
              chartHeight;

            return (
              <line
                key={`order-${index}`}
                x1={x}
                x2={x}
                y1={paddingTop + chartHeight}
                y2={
                  paddingTop +
                  chartHeight -
                  orderHeight
                }
                stroke="#b8c7bb"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.35"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function getLabelIndexes(
  length: number,
  range: Range
) {
  if (length <= 1) return [0];

  if (range === "7d") {
    return Array.from(
      { length },
      (_, index) => index
    );
  }

  if (range === "30d") {
    const indexes = [0];

    const step = Math.ceil(
      (length - 1) / 5
    );

    for (
      let i = step;
      i < length - 1;
      i += step
    ) {
      indexes.push(i);
    }

    indexes.push(length - 1);

    return [...new Set(indexes)];
  }

  if (range === "90d") {
    const indexes = [0];

    const step = Math.ceil(
      (length - 1) / 6
    );

    for (
      let i = step;
      i < length - 1;
      i += step
    ) {
      indexes.push(i);
    }

    indexes.push(length - 1);

    return [...new Set(indexes)];
  }

  return Array.from(
    { length },
    (_, index) => index
  );
}

/* =========================================================
   ORDER STATUS
========================================================= */

function OrderStatusCard({
  items,
  totalOrders,
}: {
  items: {
    status: string;
    count: number;
  }[];
  totalOrders: number;
}) {
  const max = Math.max(
    ...items.map((item) => item.count),
    1
  );

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#dce6dd] bg-white p-5 shadow-[0_24px_70px_rgba(16,41,29,0.06)] sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#edf4ea] blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#10291d] shadow-[0_10px_25px_rgba(16,41,29,0.13)]">
              <ClipboardList
                size={17}
                className="text-[#c5dda8]"
              />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#9aa49e]">
                Order intelligence
              </p>

              <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.025em] text-[#17231c]">
                Order status
              </h2>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#8a958e]">
            Current order distribution
          </p>
        </div>

        <div className="text-right">
          <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#a0aaa4]">
            Total
          </p>

          <span className="mt-0.5 block text-[27px] font-semibold tracking-[-0.05em] text-[#26352c]">
            {formatNumber(totalOrders)}
          </span>
        </div>
      </div>

      <div className="relative mt-7 space-y-5">
        {items.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#9aa49e]">
            No order data available.
          </p>
        ) : (
          items.map((item) => {
            const percentage = totalOrders
              ? Math.round(
                  (item.count / totalOrders) * 100
                )
              : 0;

            return (
              <div key={item.status}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#536158]">
                    {STATUS_LABELS[item.status] ||
                      item.status}
                  </span>

                  <span className="text-[10px] font-bold text-[#68756c]">
                    {item.count} · {percentage}%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf1ed]">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.status === "cancelled"
                        ? "bg-[#d99b91]"
                        : item.status === "delivered"
                        ? "bg-[#6f9278]"
                        : "bg-[#9fb29f]"
                    }`}
                    style={{
                      width: `${Math.max(
                        percentage,
                        item.count > 0 ? 3 : 0
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-1.5 text-right text-[8px] font-medium uppercase tracking-[0.1em] text-[#a0aaa4]">
                  max {max}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

/* =========================================================
   PERFORMANCE CARD
========================================================= */

function PerformanceCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Truck;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#dce6dd] bg-white p-5 shadow-[0_22px_65px_rgba(16,41,29,0.055)] sm:p-6">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#eef4eb] blur-3xl" />

      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#10291d] shadow-[0_10px_24px_rgba(16,41,29,0.13)]">
          <Icon
            size={17}
            className="text-[#c5dda8]"
          />
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#9aa49e]">
            Operations
          </p>

          <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.025em] text-[#17231c]">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-[#8a958e]">
            {description}
          </p>
        </div>
      </div>

      <div className="relative mt-7">{children}</div>
    </section>
  );
}

function ProgressRow({
  label,
  value,
  total,
  icon: Icon,
  danger = false,
}: {
  label: string;
  value: number;
  total: number;
  icon: typeof CheckCircle2;
  danger?: boolean;
}) {
  const percentage = total
    ? Math.round((value / total) * 100)
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              danger
                ? "bg-[#fbeceb]"
                : "bg-[#edf4ea]"
            }`}
          >
            <Icon
              size={13}
              className={
                danger
                  ? "text-[#b56c60]"
                  : "text-[#63806a]"
              }
            />
          </div>

          <span className="text-xs font-semibold text-[#536158]">
            {label}
          </span>
        </div>

        <span className="text-[10px] font-bold text-[#8d9991]">
          {value} · {percentage}%
        </span>
      </div>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#edf1ed]">
        <div
          className={`h-full rounded-full transition-all ${
            danger
              ? "bg-[#d19a91]"
              : "bg-[#71917a]"
          }`}
          style={{
            width: `${Math.min(
              percentage,
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT METHODS
========================================================= */

function PaymentMethodsCard({
  items,
}: {
  items: {
    method: string;
    count: number;
    revenue: number;
  }[];
}) {
  const total = items.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#dce6dd] bg-white p-5 shadow-[0_22px_65px_rgba(16,41,29,0.055)] sm:p-6">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#eef4eb] blur-3xl" />

      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#10291d] shadow-[0_10px_24px_rgba(16,41,29,0.13)]">
          <CreditCard
            size={17}
            className="text-[#c5dda8]"
          />
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#9aa49e]">
            Revenue mix
          </p>

          <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.025em] text-[#17231c]">
            Payment methods
          </h2>

          <p className="mt-1 text-xs text-[#8a958e]">
            How customers are paying
          </p>
        </div>
      </div>

      <div className="relative mt-7 space-y-5">
        {items.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#9aa49e]">
            No payment data available.
          </p>
        ) : (
          items.map((item) => {
            const percentage = total
              ? Math.round(
                  (item.count / total) * 100
                )
              : 0;

            return (
              <div key={item.method}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#536158]">
                    {PAYMENT_LABELS[item.method] ||
                      item.method}
                  </span>

                  <span className="text-[10px] font-bold text-[#7e8982]">
                    {percentage}%
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#edf1ed]">
                    <div
                      className="h-full rounded-full bg-[#71917a] transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span className="w-16 text-right text-[10px] font-bold text-[#536158]">
                    {formatCompactCurrency(
                      item.revenue
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

/* =========================================================
   INVENTORY
========================================================= */

function InventoryCard({
  inventory,
}: {
  inventory: AnalyticsData["inventory"];
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#dce6dd] bg-white p-5 shadow-[0_22px_65px_rgba(16,41,29,0.055)] sm:p-6">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#eef4eb] blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#10291d] shadow-[0_10px_24px_rgba(16,41,29,0.13)]">
            <Package
              size={17}
              className="text-[#c5dda8]"
            />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#9aa49e]">
              Stock intelligence
            </p>

            <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.025em] text-[#17231c]">
              Inventory
            </h2>

            <p className="mt-1 text-xs text-[#8a958e]">
              Current product stock health
            </p>
          </div>
        </div>

        <span className="rounded-full border border-[#dbe8da] bg-[#edf5ec] px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#4b7053]">
          Live
        </span>
      </div>

      <div className="relative mt-7 grid grid-cols-2 gap-3">
        <InventoryStat
          label="Active products"
          value={inventory.activeProducts}
        />

        <InventoryStat
          label="Stock units"
          value={inventory.totalStockUnits}
        />

        <InventoryStat
          label="Low stock"
          value={inventory.lowStockVariants}
          warning
        />

        <InventoryStat
          label="Out of stock"
          value={inventory.outOfStockVariants}
          danger
        />
      </div>
    </section>
  );
}

function InventoryStat({
  label,
  value,
  warning,
  danger,
}: {
  label: string;
  value: number;
  warning?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#e9eee8] bg-[#fafcf9] p-3.5 transition-all duration-200 hover:border-[#d9e5d8] hover:bg-[#f7faf6]">
      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#9aa49e]">
        {label}
      </p>

      <p
        className={`mt-2 text-[21px] font-semibold tracking-[-0.04em] ${
          danger
            ? "text-[#a05244]"
            : warning
            ? "text-[#9b7851]"
            : "text-[#26352c]"
        }`}
      >
        {formatNumber(value)}
      </p>
    </div>
  );
}

/* =========================================================
   PAYMENT STATUS
========================================================= */

function PaymentStatusCard({
  items,
}: {
  items: {
    status: string;
    count: number;
  }[];
}) {
  const total = items.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#dce6dd] bg-white p-5 shadow-[0_24px_70px_rgba(16,41,29,0.06)] sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#edf4ea] blur-3xl" />

      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#10291d] shadow-[0_10px_25px_rgba(16,41,29,0.13)]">
          <CircleDollarSign
            size={17}
            className="text-[#c5dda8]"
          />
        </div>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-[#9aa49e]">
            Transaction health
          </p>

          <h2 className="mt-0.5 text-[17px] font-semibold tracking-[-0.025em] text-[#17231c]">
            Payment status
          </h2>

          <p className="mt-1 text-xs text-[#8a958e]">
            Payment completion across orders
          </p>
        </div>
      </div>

      <div className="relative mt-7 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const percentage = total
            ? Math.round(
                (item.count / total) * 100
              )
            : 0;

          const isGood =
            item.status === "paid";

          const isBad =
            item.status === "failed" ||
            item.status === "cancelled" ||
            item.status === "refunded";

          return (
            <div
              key={item.status}
              className="group rounded-[20px] border border-[#e8eee7] bg-[#fafcf9] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d8e4d7] hover:bg-[#f7faf6]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-[#536158]">
                  {PAYMENT_STATUS_LABELS[
                    item.status
                  ] || item.status}
                </p>

                <span
                  className={`h-2.5 w-2.5 rounded-full shadow-[0_0_0_3px_rgba(0,0,0,0.025)] ${
                    isGood
                      ? "bg-[#71917a]"
                      : isBad
                      ? "bg-[#d09a91]"
                      : "bg-[#c0b078]"
                  }`}
                />
              </div>

              <div className="mt-4 flex items-end justify-between">
                <p className="text-[21px] font-semibold tracking-[-0.04em] text-[#26352c]">
                  {formatNumber(item.count)}
                </p>

                <p className="text-[10px] font-bold text-[#929c95]">
                  {percentage}%
                </p>
              </div>

              <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#edf0eb]">
                <div
                  className={`h-full rounded-full ${
                    isGood
                      ? "bg-[#71917a]"
                      : isBad
                      ? "bg-[#d09a91]"
                      : "bg-[#c0b078]"
                  }`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   DARK STAT
========================================================= */

function DarkStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3.5 shadow-inner transition-all duration-200 hover:bg-white/[0.08]">
      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#9fb3a4]">
        {label}
      </p>

      <p className="mt-2 text-[19px] font-semibold tracking-[-0.035em] text-white">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Package;
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#e4ebe3] bg-[#f4f7f2] shadow-inner">
        <Icon
          size={22}
          className="text-[#7e8b82]"
        />
      </div>

      <p className="mt-5 text-sm font-semibold text-[#536158]">
        {title}
      </p>

      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-[#9ba49e]">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function AnalyticsSkeleton() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 pb-14 pt-3 sm:px-6 lg:px-9 xl:px-10">
      <div className="animate-pulse">
        <div className="rounded-[32px] border border-[#e0e8df] bg-[#eef3ed] p-7 sm:p-9">
          <div className="h-3 w-28 rounded-full bg-[#dce5da]" />
          <div className="mt-5 h-11 w-56 rounded-2xl bg-[#dce5da]" />
          <div className="mt-3 h-4 w-80 rounded-full bg-[#e3eae2]" />

          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-16 rounded-2xl bg-[#e2e9e0]"
                />
              )
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-[176px] rounded-[26px] bg-[#eef3ed]"
              />
            )
          )}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(350px,0.8fr)]">
          <div className="h-[455px] rounded-[30px] bg-[#eef3ed]" />
          <div className="h-[455px] rounded-[30px] bg-[#eef3ed]" />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="h-72 rounded-[30px] bg-[#eef3ed]" />
          <div className="h-72 rounded-[30px] bg-[#eef3ed]" />
          <div className="h-72 rounded-[30px] bg-[#eef3ed]" />
        </div>

        <div className="mt-5 h-96 rounded-[30px] bg-[#eef3ed]" />

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="h-72 rounded-[30px] bg-[#eef3ed]" />
          <div className="h-72 rounded-[30px] bg-[#10291d]/10" />
        </div>
      </div>
    </div>
  );
}