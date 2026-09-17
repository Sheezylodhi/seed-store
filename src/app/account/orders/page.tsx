"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Package,
  ShoppingBag,
} from "lucide-react";

type Order = {
  orderNumber: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  itemCount: number;
  items: {
    name: string;
    image?: string;
    quantity: number;
  }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/orders", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-[30px] bg-white p-10">
        Loading orders...
      </div>
    );
  }

  return (
    <section className="rounded-[30px] border border-[#dfe3dc] bg-white shadow-[0_18px_60px_rgba(34,58,45,0.04)]">

      <div className="border-b border-[#edf0eb] px-6 py-7 sm:px-8">

        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a928c]">
          Shopping history
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          My Orders
        </h2>

        <p className="mt-2 text-sm text-[#818a83]">
          View and track everything you've ordered
          from SeedStore.
        </p>

      </div>

      {orders.length === 0 ? (
        <div className="px-6 py-16 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
            <ShoppingBag size={21} />
          </div>

          <h3 className="mt-5 font-serif text-3xl italic text-[#294b39]">
            No orders yet
          </h3>

          <p className="mt-2 text-sm text-[#8a928c]">
            Your completed orders will appear here.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#294b39] px-6 py-3 text-xs font-semibold text-white"
          >
            Start shopping
            <ArrowRight size={14} />
          </Link>

        </div>
      ) : (
        <div className="divide-y divide-[#edf0eb]">

          {orders.map((order) => (
            <Link
              key={order.orderNumber}
              href={`/account/orders/${order.orderNumber}`}
              className="block px-6 py-7 transition hover:bg-[#fafbf8] sm:px-8"
            >

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf2eb] text-[#52745d]">
                    <Package size={18} />
                  </div>

                  <div>
                    <p className="font-mono text-sm font-semibold text-[#294b39]">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-xs text-[#8a928c]">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-PK",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                </div>

                <div className="flex flex-wrap items-center gap-5">

                  <span className="rounded-full bg-[#edf3ed] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#52745d]">
                    {order.orderStatus.replaceAll(
                      "_",
                      " "
                    )}
                  </span>

                  <span className="text-xs text-[#7f8981]">
                    {order.itemCount}{" "}
                    {order.itemCount === 1
                      ? "item"
                      : "items"}
                  </span>

                  <span className="text-sm font-semibold text-[#294b39]">
                    PKR {order.total.toLocaleString()}
                  </span>

                  <ArrowRight
                    size={16}
                    className="text-[#8a928c]"
                  />

                </div>

              </div>

            </Link>
          ))}

        </div>
      )}

    </section>
  );
}