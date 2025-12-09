import type { Metadata } from "next";
import { Nunito, Petrona } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-nunito'
});

const petrona = Petrona({
  subsets: ["latin"],
  weight: ['900'],
  variable: '--font-petrona'
});

export const metadata: Metadata = {
  title: "Animalsox | 3D Hugging Socks",
  description: "Discover cozy Animal Socks made with love. Cute, eco-friendly, and the perfect gift for any occasion. A warm hug for your feet!",
  icons: {
    icon: [
      { url: "/pawsox 512.jpg", type: "image/jpeg" },
    ],
    shortcut: "/pawsox 512.jpg",
    apple: "/pawsox 512.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`antialiased ${nunito.variable} ${petrona.variable}`}>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
          strategy="beforeInteractive"
        />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
