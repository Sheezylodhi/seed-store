
import type { Metadata } from "next";
import "./globals.css";

import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/components/WishlistProvider";
import WishlistFloatingButton from "@/components/WishlistFloatingButton";

export const metadata: Metadata = {
  title: "Seed Store",
  description:
    "Premium seeds and seed cycling products for your everyday wellness routine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WishlistProvider>
          <CartProvider>
            {children}

            <CartDrawer />

            <WishlistFloatingButton />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}

