  "use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ClipboardList,
  Package,
  RefreshCw,
  ShoppingBag,
  Star,
  Users,
  Wallet,
  MessageSquare,
  TrendingUp,
  CircleCheck,
  Clock3,
} from "lucide-react";

type DashboardData = {
  stats: {
    totalProducts: number;
    totalCustomers: number;
    totalOrders: number;
    pendingOrders: number;
    pendingReviews: number;
    unreadMessages: number;
    revenue: number;
  };

  recentOrders: {
    _id: string;
    orderNumber: string;
    customerInfo?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    total: number;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
  }[];
};

const statusLabels: Record<
  string,
  string
> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function DashboardClient() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/dashboard",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      // Unauthorized / expired session / non-admin
      // → send directly to homepage
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        window.location.replace("/");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to load dashboard"
        );
      }

      setData(result.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =========================
     LOADING
  ========================== */

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1680px] px-1 sm:px-2 lg:px-4">
        <div className="space-y-6">
          {/* Header skeleton */}

          <div
            className="
              relative overflow-hidden
              rounded-[28px]
              border border-[#e1e8df]
              bg-white
              p-6
              shadow-[0_15px_45px_rgba(24,45,31,0.04)]
              sm:p-8
            "
          >
            <div className="animate-pulse">
              <div className="h-3 w-24 rounded-full bg-[#e9eee8]" />
              <div className="mt-4 h-9 w-72 rounded-xl bg-[#e9eee8]" />
              <div className="mt-3 h-4 w-80 rounded-full bg-[#f0f3ef]" />
            </div>
          </div>

          {/* Stats skeleton */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    h-[190px]
                    animate-pulse
                    rounded-[24px]
                    border border-[#e5ebe3]
                    bg-white
                  "
                />
              )
            )}
          </div>

          {/* Attention skeleton */}

          <div className="grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    h-[105px]
                    animate-pulse
                    rounded-[22px]
                    border border-[#e5ebe3]
                    bg-white
                  "
                />
              )
            )}
          </div>

          <div
            className="
              h-[430px]
              animate-pulse
              rounded-[28px]
              border border-[#e5ebe3]
              bg-white
            "
          />
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================== */

  if (error) {
    return (
      <div className="mx-auto flex min-h-[65vh] w-full max-w-[1680px] items-center justify-center px-4">
        <div
          className="
            relative w-full max-w-[440px]
            overflow-hidden
            rounded-[30px]
            border border-[#e2e8e1]
            bg-white
            p-8
            text-center
            shadow-[0_25px_70px_rgba(20,40,27,0.10)]
          "
        >
          <div
            className="
              pointer-events-none
              absolute -right-16 -top-16
              h-40 w-40
              rounded-full
              bg-[#315c42]/[0.06]
              blur-3xl
            "
          />

          <div
            className="
              relative mx-auto
              flex h-14 w-14
              items-center justify-center
              rounded-[17px]
              border border-[#ead8d4]
              bg-[#faf0ee]
            "
          >
            <RefreshCw
              size={20}
              strokeWidth={1.8}
              className="text-[#a05244]"
            />
          </div>

          <h2
            className="
              relative mt-5
              text-xl
              font-bold
              tracking-[-0.03em]
              text-[#17231c]
            "
          >
            Unable to load dashboard
          </h2>

          <p className="relative mt-2 text-sm leading-6 text-[#7b867f]">
            {error}
          </p>

          <button
            onClick={loadDashboard}
            className="
              relative mt-7
              inline-flex h-11
              items-center gap-2
              rounded-[13px]
              bg-[#10291d]
              px-5
              text-xs
              font-bold
              text-white
              shadow-[0_8px_22px_rgba(16,41,29,0.18)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-[#183a29]
              active:translate-y-0
            "
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, recentOrders } = data;

  const statCards = [
    {
      label: "Total revenue",
      value: formatCurrency(
        stats.revenue
      ),
      icon: Wallet,
      description: "From paid orders",
      eyebrow: "Revenue",
    },
    {
      label: "Orders",
      value:
        stats.totalOrders.toLocaleString(),
      icon: ClipboardList,
      description: `${stats.pendingOrders} pending`,
      eyebrow: "Sales activity",
    },
    {
      label: "Customers",
      value:
        stats.totalCustomers.toLocaleString(),
      icon: Users,
      description: "Active customers",
      eyebrow: "Audience",
    },
    {
      label: "Products",
      value:
        stats.totalProducts.toLocaleString(),
      icon: Package,
      description: "Active products",
      eyebrow: "Catalog",
    },
  ];

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[1680px]
        px-1
        sm:px-2
        lg:px-5
        xl:px-7
      "
    >
      {/* ==================================================
          HEADER / HERO
      =================================================== */}

      {/* ==================================================
    HEADER / LUXURY HERO
=================================================== */}

<section
  className="
    relative
    overflow-hidden
    rounded-[30px]
    border border-[#1d4631]
    bg-[#10291d]
    px-6 py-7
    shadow-[0_24px_70px_rgba(16,41,29,0.16)]
    sm:px-8 sm:py-8
    lg:px-10 lg:py-9
  "
>
  {/* ==================================================
      AMBIENT DECORATION
  =================================================== */}

  <div
    className="
      pointer-events-none
      absolute
      -right-28
      -top-32
      h-[360px]
      w-[360px]
      rounded-full
      bg-[#315c42]/45
      blur-[90px]
    "
  />

  <div
    className="
      pointer-events-none
      absolute
      -bottom-36
      left-[32%]
      h-[300px]
      w-[300px]
      rounded-full
      bg-[#8eae73]/10
      blur-[90px]
    "
  />

  <div
    className="
      pointer-events-none
      absolute
      right-[18%]
      top-1/2
      hidden
      h-[190px]
      w-[190px]
      -translate-y-1/2
      rounded-full
      border
      border-white/[0.045]
      lg:block
    "
  />

  <div
    className="
      pointer-events-none
      absolute
      right-[21%]
      top-1/2
      hidden
      h-[125px]
      w-[125px]
      -translate-y-1/2
      rounded-full
      border
      border-white/[0.035]
      lg:block
    "
  />

  {/* ==================================================
      CONTENT
  =================================================== */}

  <div
    className="
      relative
      flex
      flex-col
      justify-between
      gap-8
      md:flex-row
      md:items-center
    "
  >
    {/* LEFT */}

    <div className="min-w-0">
      {/* Eyebrow */}

      <div className="flex items-center gap-2.5">
        <span
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-[10px]
            border
            border-[#c5dda8]/15
            bg-[#c5dda8]/10
            shadow-[0_6px_18px_rgba(197,221,168,0.08)]
          "
        >
          <TrendingUp
            size={13}
            strokeWidth={2}
            className="text-[#c5dda8]"
          />
        </span>

        <p
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.24em]
            text-[#aebfaa]
          "
        >
          Store overview
        </p>
      </div>

      {/* Heading */}

      <h1
        className="
          mt-5
          text-[30px]
          font-bold
          tracking-[-0.045em]
          text-white
          sm:text-[36px]
          lg:text-[40px]
        "
      >
        Good evening, Admin.
      </h1>

      {/* Description */}

      <p
        className="
          mt-2.5
          max-w-[590px]
          text-[13px]
          leading-6
          text-white/50
          sm:text-[14px]
        "
      >
        Here&apos;s a quick look at your store
        performance and the activity that needs
        your attention.
      </p>

      {/* Small status line */}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/[0.08]
            bg-white/[0.055]
            px-3
            py-1.5
            backdrop-blur-md
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#9fbe7d]
              shadow-[0_0_10px_rgba(159,190,125,0.55)]
            "
          />

          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-white/55
            "
          >
            Store active
          </span>
        </div>

        <span
          className="
            text-[10px]
            text-white/20
          "
        >
          •
        </span>

        <span
          className="
            text-[10px]
            font-medium
            text-white/35
          "
        >
          Live dashboard
        </span>
      </div>
    </div>

    {/* RIGHT */}

    <div
      className="
        relative
        flex
        shrink-0
        flex-col
        items-start
        gap-3
        sm:flex-row
        sm:items-center
      "
    >
      {/* Mini overview badge */}

      <div
        className="
          hidden
          items-center
          gap-3
          rounded-[16px]
          border
          border-white/[0.08]
          bg-white/[0.045]
          px-4
          py-3
          backdrop-blur-md
          lg:flex
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-[11px]
            bg-[#c5dda8]/10
            text-[#c5dda8]
          "
        >
          <ShoppingBag
            size={15}
            strokeWidth={1.8}
          />
        </div>

        <div>
          <p
            className="
              text-[8px]
              font-black
              uppercase
              tracking-[0.15em]
              text-white/30
            "
          >
            Store status
          </p>

          <p
            className="
              mt-0.5
              text-[11px]
              font-bold
              text-white/75
            "
          >
            Everything is live
          </p>
        </div>
      </div>

      {/* Refresh */}

      <button
        onClick={loadDashboard}
        className="
          group
          inline-flex
          h-11
          items-center
          gap-2.5
          rounded-[13px]

          border
          border-white/[0.10]
          bg-white/[0.07]

          px-4

          text-xs
          font-bold
          text-white/75

          shadow-[0_8px_25px_rgba(0,0,0,0.12)]

          backdrop-blur-md

          transition-all
          duration-200

          hover:-translate-y-0.5
          hover:border-white/[0.16]
          hover:bg-white/[0.11]
          hover:text-white

          active:translate-y-0
        "
      >
        <RefreshCw
          size={14}
          strokeWidth={1.9}
          className="
            text-[#c5dda8]
            transition-transform
            duration-500
            group-hover:rotate-180
          "
        />

        Refresh data
      </button>
    </div>
  </div>

  {/* ==================================================
      BOTTOM METRICS
  =================================================== */}

  <div
    className="
      relative
      mt-7
      grid
      grid-cols-1
      gap-3
      border-t
      border-white/[0.08]
      pt-5
      sm:grid-cols-3
      sm:gap-0
    "
  >
    {/* Revenue */}

    <div
      className="
        flex
        items-center
        gap-3
        sm:border-r
        sm:border-white/[0.07]
        sm:pr-6
      "
    >
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-[10px]
          bg-white/[0.055]
          text-[#b8cba6]
        "
      >
        <Wallet
          size={14}
          strokeWidth={1.8}
        />
      </div>

      <div>
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.15em]
            text-white/30
          "
        >
          Revenue
        </p>

        <p
          className="
            mt-0.5
            text-[11px]
            font-bold
            text-white/70
          "
        >
          {formatCurrency(stats.revenue)}
        </p>
      </div>
    </div>

    {/* Orders */}

    <div
      className="
        flex
        items-center
        gap-3
        sm:border-r
        sm:border-white/[0.07]
        sm:px-6
      "
    >
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-[10px]
          bg-white/[0.055]
          text-[#b8cba6]
        "
      >
        <ClipboardList
          size={14}
          strokeWidth={1.8}
        />
      </div>

      <div>
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.15em]
            text-white/30
          "
        >
          Orders
        </p>

        <p
          className="
            mt-0.5
            text-[11px]
            font-bold
            text-white/70
          "
        >
          {stats.totalOrders.toLocaleString()}
          {" "}
          <span className="font-medium text-white/30">
            total
          </span>
        </p>
      </div>
    </div>

    {/* Customers */}

    <div
      className="
        flex
        items-center
        gap-3
        sm:pl-6
      "
    >
      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-[10px]
          bg-white/[0.055]
          text-[#b8cba6]
        "
      >
        <Users
          size={14}
          strokeWidth={1.8}
        />
      </div>

      <div>
        <p
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.15em]
            text-white/30
          "
        >
          Customers
        </p>

        <p
          className="
            mt-0.5
            text-[11px]
            font-bold
            text-white/70
          "
        >
          {stats.totalCustomers.toLocaleString()}
          {" "}
          <span className="font-medium text-white/30">
            active
          </span>
        </p>
      </div>
    </div>
  </div>
</section>

      {/* ==================================================
          PRIMARY STATS
      =================================================== */}

      <section className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="
                  group relative
                  overflow-hidden
                  rounded-[24px]
                  border border-[#e1e8df]
                  bg-white
                  p-5

                  shadow-[0_12px_35px_rgba(20,40,27,0.045)]

                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#d4dfd4]
                  hover:shadow-[0_20px_45px_rgba(20,40,27,0.08)]
                "
              >
                {/* Card ambient glow */}

                <div
                  className="
                    pointer-events-none
                    absolute -right-10 -top-10
                    h-28 w-28
                    rounded-full
                    bg-[#b9d39e]/[0.12]
                    blur-3xl
                    transition-opacity
                    group-hover:opacity-100
                  "
                />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    {/* Icon */}

                    <div
                      className="
                        relative
                        flex h-11 w-11
                        items-center justify-center
                        rounded-[14px]

                        border border-[#dce8d9]
                        bg-gradient-to-br
                        from-[#f2f7ef]
                        to-[#e7f0e4]

                        shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]
                      "
                    >
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                        className="text-[#315c42]"
                      />

                      <span
                        className="
                          absolute
                          -bottom-1
                          -right-1
                          h-2.5 w-2.5
                          rounded-full
                          border-2
                          border-white
                          bg-[#9fbe7d]
                        "
                      />
                    </div>

                    {/* Arrow */}

                    <span
                      className="
                        flex h-8 w-8
                        items-center justify-center
                        rounded-full
                        border border-[#edf0eb]
                        bg-[#fafbf9]
                        text-[#a4aea7]

                        transition-all duration-200

                        group-hover:border-[#dce6da]
                        group-hover:bg-[#edf3e9]
                        group-hover:text-[#315c42]
                      "
                    >
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.8}
                        className="
                          transition-transform
                          duration-200
                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5
                        "
                      />
                    </span>
                  </div>

                  {/* Eyebrow */}

                  <div className="mt-6">
                    <p
                      className="
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.18em]
                        text-[#a0aaa3]
                      "
                    >
                      {card.eyebrow}
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-[25px]
                        font-bold
                        tracking-[-0.04em]
                        text-[#17231c]
                      "
                    >
                      {card.value}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-[#9fbe7d]" />

                      <p className="text-[10px] font-medium text-[#89958d]">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          ATTENTION / QUICK INSIGHTS
      =================================================== */}

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.2em]
                text-[#9aa49e]
              "
            >
              Quick insights
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <AttentionCard
            icon={ClipboardList}
            label="Pending orders"
            value={stats.pendingOrders}
            description="Orders waiting for action"
            tone="green"
          />

          <AttentionCard
            icon={Star}
            label="Reviews awaiting approval"
            value={stats.pendingReviews}
            description="Customer feedback to review"
            tone="gold"
          />

          <AttentionCard
            icon={MessageSquare}
            label="New messages"
            value={stats.unreadMessages}
            description="Unread customer conversations"
            tone="blue"
          />
        </div>
      </section>

      {/* ==================================================
          RECENT ORDERS
      =================================================== */}

      <section
        className="
          mt-6
          overflow-hidden
          rounded-[28px]
          border border-[#e0e7df]
          bg-white
          shadow-[0_15px_45px_rgba(20,40,27,0.045)]
        "
      >
        {/* Section header */}

        <div
          className="
            relative
            overflow-hidden
            border-b border-[#edf0eb]
            bg-gradient-to-r
            from-[#fbfcfa]
            to-white
            px-5 py-5
            sm:px-6
            lg:px-7
          "
        >
          <div
            className="
              pointer-events-none
              absolute -right-10 -top-20
              h-40 w-40
              rounded-full
              bg-[#b9d39e]/[0.08]
              blur-3xl
            "
          />

          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="
                    flex h-7 w-7
                    items-center justify-center
                    rounded-[9px]
                    bg-[#edf3e9]
                  "
                >
                  <Clock3
                    size={13}
                    strokeWidth={1.8}
                    className="text-[#315c42]"
                  />
                </span>

                <h2
                  className="
                    text-[15px]
                    font-bold
                    tracking-[-0.015em]
                    text-[#17231c]
                  "
                >
                  Recent orders
                </h2>
              </div>

              <p
                className="
                  mt-2
                  text-[11px]
                  text-[#929c95]
                "
              >
                Latest activity from your
                storefront
              </p>
            </div>

            <a
              href="/admin/orders"
              className="
                group
                inline-flex
                items-center gap-2
                text-[11px]
                font-bold
                text-[#315c42]
                transition-colors
                hover:text-[#10291d]
              "
            >
              View all orders

              <span
                className="
                  flex h-6 w-6
                  items-center justify-center
                  rounded-full
                  bg-[#edf3e9]
                  transition-all duration-200
                  group-hover:translate-x-0.5
                  group-hover:bg-[#e2ecdf]
                "
              >
                <ArrowUpRight
                  size={12}
                  strokeWidth={2}
                />
              </span>
            </a>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr
                className="
                  border-b border-[#edf0eb]
                  bg-[#fbfcfa]
                  text-left
                "
              >
                <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.18em] text-[#a0aaa4] lg:px-7">
                  Order
                </th>

                <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.18em] text-[#a0aaa4]">
                  Customer
                </th>

                <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.18em] text-[#a0aaa4]">
                  Total
                </th>

                <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.18em] text-[#a0aaa4]">
                  Status
                </th>

                <th className="px-6 py-4 text-[8px] font-black uppercase tracking-[0.18em] text-[#a0aaa4]">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center"
                  >
                    <div
                      className="
                        mx-auto flex h-14 w-14
                        items-center justify-center
                        rounded-[17px]
                        bg-[#f1f5ef]
                      "
                    >
                      <ShoppingBag
                        size={22}
                        strokeWidth={1.7}
                        className="text-[#8b9b90]"
                      />
                    </div>

                    <p className="mt-4 text-sm font-bold text-[#536158]">
                      No orders yet
                    </p>

                    <p className="mt-1 text-[11px] text-[#9ba49e]">
                      New orders will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const customerName =
                    [
                      order.customerInfo
                        ?.firstName,
                      order.customerInfo
                        ?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ") ||
                    "Guest customer";

                  return (
                    <tr
                      key={order._id}
                      className="
                        group
                        border-b
                        border-[#f0f2ef]
                        last:border-0

                        transition-colors
                        hover:bg-[#fafcf9]
                      "
                    >
                      {/* ORDER */}

                      <td className="px-6 py-4 lg:px-7">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              flex h-9 w-9
                              items-center justify-center
                              rounded-[10px]
                              bg-[#f1f5ef]
                              transition-colors
                              group-hover:bg-[#e8f0e5]
                            "
                          >
                            <ClipboardList
                              size={14}
                              strokeWidth={1.8}
                              className="text-[#567260]"
                            />
                          </div>

                          <div>
                            <p className="text-[11px] font-bold text-[#26352c]">
                              #{order.orderNumber}
                            </p>

                            <p className="mt-0.5 text-[9px] text-[#a0aaa4]">
                              Order
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CUSTOMER */}

                      <td className="px-6 py-4">
                        <p className="text-[11px] font-semibold text-[#536158]">
                          {customerName}
                        </p>

                        <p className="mt-1 text-[9px] text-[#a0aaa4]">
                          {order.customerInfo
                            ?.email || "—"}
                        </p>
                      </td>

                      {/* TOTAL */}

                      <td className="px-6 py-4">
                        <p className="text-[11px] font-bold text-[#26352c]">
                          {formatCurrency(
                            order.total
                          )}
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <span
                          className={`
                            inline-flex
                            items-center gap-1.5
                            rounded-full
                            border
                            px-2.5
                            py-1.5

                            text-[8px]
                            font-black
                            uppercase
                            tracking-[0.10em]

                            ${
                              order.orderStatus ===
                              "delivered"
                                ? "border-[#d8e8d4] bg-[#edf6eb] text-[#42704c]"
                                : order.orderStatus ===
                                  "cancelled"
                                ? "border-[#efd8d5] bg-[#fbefed] text-[#a05244]"
                                : "border-[#e5e8df] bg-[#f5f6f1] text-[#68756c]"
                            }
                          `}
                        >
                          {order.orderStatus ===
                          "delivered" ? (
                            <CircleCheck
                              size={10}
                              strokeWidth={2}
                            />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                          )}

                          {statusLabels[
                            order.orderStatus
                          ] ||
                            order.orderStatus}
                        </span>
                      </td>

                      {/* DATE */}

                      <td className="px-6 py-4 text-[10px] font-medium text-[#8d9991]">
                        {formatDate(
                          order.createdAt
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AttentionCard({
  icon: Icon,
  label,
  value,
  description,
  tone,
}: {
  icon: typeof ClipboardList;
  label: string;
  value: number;
  description: string;
  tone: "green" | "gold" | "blue";
}) {
  const toneStyles = {
    green: {
      box: "border-[#dce8da] bg-gradient-to-br from-[#f5f8f3] to-white",
      icon: "border-[#d9e7d5] bg-[#edf4ea] text-[#315c42]",
      dot: "bg-[#8eae73]",
    },
    gold: {
      box: "border-[#ebe5d5] bg-gradient-to-br from-[#faf9f3] to-white",
      icon: "border-[#e9e1c9] bg-[#f5f2e6] text-[#8b7950]",
      dot: "bg-[#c4a85d]",
    },
    blue: {
      box: "border-[#dfe7e8] bg-gradient-to-br from-[#f5f8f8] to-white",
      icon: "border-[#dce6e7] bg-[#edf3f4] text-[#527177]",
      dot: "bg-[#759aa0]",
    },
  };

  const styles = toneStyles[tone];

  return (
    <div
      className={`
        group
        relative
        flex items-center gap-4
        overflow-hidden
        rounded-[22px]
        border
        px-5 py-4
        shadow-[0_10px_30px_rgba(20,40,27,0.035)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_16px_35px_rgba(20,40,27,0.065)]
        ${styles.box}
      `}
    >
      {/* Accent glow */}

      <div
        className="
          pointer-events-none
          absolute -right-10 -top-10
          h-24 w-24
          rounded-full
          bg-[#b9d39e]/[0.08]
          blur-2xl
        "
      />

      {/* Icon */}

      <div
        className={`
          relative
          flex h-11 w-11
          shrink-0
          items-center justify-center
          rounded-[13px]
          border
          transition-transform
          duration-300
          group-hover:scale-105
          ${styles.icon}
        `}
      >
        <Icon
          size={17}
          strokeWidth={1.8}
        />
      </div>

      {/* Content */}

      <div className="relative min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className="
              truncate
              text-[10px]
              font-black
              uppercase
              tracking-[0.12em]
              text-[#7d8981]
            "
          >
            {label}
          </p>

          <span
            className={`
              h-1.5 w-1.5
              shrink-0
              rounded-full
              ${styles.dot}
            `}
          />
        </div>

        <div className="mt-1 flex items-end gap-2">
          <p
            className="
              text-[23px]
              font-bold
              tracking-[-0.04em]
              text-[#26352c]
            "
          >
            {value}
          </p>

          <p
            className="
              mb-1
              text-[9px]
              font-medium
              text-[#9aa49e]
            "
          >
            items
          </p>
        </div>

        <p className="mt-0.5 truncate text-[9px] text-[#a0aaa4]">
          {description}
        </p>
      </div>

      {/* Arrow */}

      <div
        className="
          relative
          flex h-7 w-7
          shrink-0
          items-center justify-center
          rounded-full
          border border-[#e7ebe5]
          bg-white/80
          text-[#b0b9b2]
          transition-all duration-200
          group-hover:border-[#d7e1d6]
          group-hover:text-[#315c42]
        "
      >
        <ArrowUpRight
          size={12}
          strokeWidth={1.8}
          className="
            transition-transform
            duration-200
            group-hover:-translate-y-0.5
            group-hover:translate-x-0.5
          "
        />
      </div>
    </div>
  );
}

