"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

type User = {
  name: string;
  email: string;
  phone?: string;
};

type Order = {
  id: string;
  orderNumber: string;

  total: number;
  subtotal: number;
  discount: number;
  deliveryCharge: number;

  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;

  createdAt: string;

  itemCount: number;

  items: {
    name: string;
    packSize?: string;
    price: number;
    quantity: number;
    image?: string;
  }[];

  shipping?: {
    courier?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
    shippedAt?: string;
    deliveredAt?: string;
  } | null;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "/api/account/orders",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (data.success) {
          setUser(data.customer);
          setOrders(data.orders);
        }
      } catch (error) {
        console.error(
          "ACCOUNT LOAD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[30px] bg-white p-10">
        <div className="animate-pulse">
          Loading your account...
        </div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 3);

  const processingOrders = orders.filter(
    (order) =>
      [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
      ].includes(order.orderStatus)
  ).length;

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <section className="relative overflow-hidden rounded-[32px] bg-[#294b39] p-8 text-white sm:p-10">

        <div className="relative z-10">
          <p className="text-[9px] font-bold uppercase tracking-[0.23em] text-white/45">
            Welcome back
          </p>

          <h2 className="mt-3 font-serif text-4xl tracking-[-0.05em] sm:text-5xl">
            {user?.name || "Customer"}
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
            Your SeedStore orders, deliveries and
            account activity — all in one place.
          </p>

          {user?.email && (
            <p className="mt-5 text-xs text-white/45">
              {user.email}
            </p>
          )}
        </div>

        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 right-20 h-64 w-64 rounded-full border border-white/5" />

      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">

        <StatCard
          icon={<ClipboardList size={19} />}
          label="Total orders"
          value={orders.length}
        />

        <StatCard
          icon={<Package size={19} />}
          label="In progress"
          value={processingOrders}
        />

        <StatCard
          icon={<CheckCircle2 size={19} />}
          label="Completed"
          value={
            orders.filter(
              (order) =>
                order.orderStatus ===
                "delivered"
            ).length
          }
        />

      </div>

      {/* Recent Orders */}
      <section className="overflow-hidden rounded-[30px] border border-[#dfe3dc] bg-white shadow-[0_18px_60px_rgba(34,58,45,0.04)]">

        <div className="flex items-center justify-between border-b border-[#edf0eb] px-6 py-6 sm:px-8">

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a928c]">
              Shopping history
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#294b39]">
              Recent orders
            </h2>
          </div>

          <Link
            href="/account/orders"
            className="text-xs font-semibold text-[#52745d] transition hover:text-[#294b39]"
          >
            View all →
          </Link>

        </div>

        {recentOrders.length === 0 ? (
          <div className="px-8 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
              <Package size={22} />
            </div>

            <p className="mt-5 font-serif text-2xl italic text-[#294b39]">
              No orders yet
            </p>

            <p className="mt-2 text-sm text-[#8a928c]">
              Your SeedStore journey starts here.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-full bg-[#294b39] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#203c2d]"
            >
              Start shopping
            </Link>

          </div>
        ) : (
          <div className="divide-y divide-[#edf0eb]">

            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.orderNumber}`}
                className="group block px-6 py-6 transition hover:bg-[#fafbf8] sm:px-8"
              >

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  {/* Left */}
                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
                      <Package size={18} />
                    </div>

                    <div>
                      <p className="font-mono text-sm font-semibold text-[#294b39]">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-[#8a928c]">
                        {order.itemCount}{" "}
                        {order.itemCount === 1
                          ? "item"
                          : "items"}{" "}
                        ·{" "}
                        {formatDate(
                          order.createdAt
                        )}
                      </p>

                      <p className="mt-2 text-xs text-[#68766d]">
                        {order.items
                          .slice(0, 2)
                          .map(
                            (item) =>
                              item.name
                          )
                          .join(" · ")}

                        {order.items.length > 2 &&
                          " · More"}
                      </p>
                    </div>

                  </div>

                  {/* Right */}
                  <div className="flex items-center justify-between gap-6 sm:justify-end">

                    <div className="text-left sm:text-right">

                      <p className="text-sm font-semibold text-[#294b39]">
                        PKR{" "}
                        {order.total.toLocaleString()}
                      </p>

                      <div className="mt-2 flex items-center gap-2 sm:justify-end">
                        <OrderStatus
                          status={
                            order.orderStatus
                          }
                        />
                      </div>

                      <p className="mt-2 text-[10px] capitalize text-[#9aa19b]">
                        Payment:{" "}
                        {order.paymentStatus}
                      </p>

                    </div>

                    <ArrowRight
                      size={17}
                      className="text-[#8a928c] transition group-hover:translate-x-1 group-hover:text-[#294b39]"
                    />

                  </div>

                </div>

              </Link>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[26px] border border-[#dfe3dc] bg-white p-6">

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
        {icon}
      </div>

      <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8e9790]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-[#294b39]">
        {value}
      </p>

    </div>
  );
}

/* =====================================================
   ORDER STATUS
===================================================== */

function OrderStatus({
  status,
}: {
  status: string;
}) {
  const config: Record<
    string,
    {
      label: string;
      icon: React.ReactNode;
      className: string;
    }
  > = {
    pending: {
      label: "Pending",
      icon: <Clock3 size={11} />,
      className:
        "bg-[#fff7df] text-[#9a7418]",
    },

    confirmed: {
      label: "Confirmed",
      icon: <CheckCircle2 size={11} />,
      className:
        "bg-[#edf5ed] text-[#52745d]",
    },

    processing: {
      label: "Processing",
      icon: <Package size={11} />,
      className:
        "bg-[#edf2f7] text-[#54708a]",
    },

    shipped: {
      label: "Shipped",
      icon: <Truck size={11} />,
      className:
        "bg-[#edf2f7] text-[#54708a]",
    },

    out_for_delivery: {
      label: "Out for delivery",
      icon: <Truck size={11} />,
      className:
        "bg-[#f0f5eb] text-[#52745d]",
    },

    delivered: {
      label: "Delivered",
      icon: <CheckCircle2 size={11} />,
      className:
        "bg-[#eaf4eb] text-[#3f7650]",
    },

    cancelled: {
      label: "Cancelled",
      icon: <XCircle size={11} />,
      className:
        "bg-[#fbeeee] text-[#a05d5d]",
    },
  };

  const current =
    config[status] || {
      label: status.replaceAll("_", " "),
      icon: <Clock3 size={11} />,
      className:
        "bg-[#f1f1ee] text-[#777]",
    };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${current.className}`}
    >
      {current.icon}
      {current.label}
    </span>
  );
}

/* =====================================================
   DATE
===================================================== */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-PK",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}