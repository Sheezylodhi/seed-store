import { Suspense } from "react";
import OrderConfirmationClient from "./OrderConfirmationClient";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OrderConfirmationClient />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ee] px-5">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9eee8]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#d7dfd6] border-t-[#52745d]" />
        </div>

        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7e8981]">
          Loading your order
        </p>

        <p className="mt-2 font-serif text-2xl italic text-[#294b39]">
          Just a moment...
        </p>
      </div>
    </main>
  );
}