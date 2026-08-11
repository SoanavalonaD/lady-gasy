import type { Metadata } from "next";
import { Be_Vietnam_Pro, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AppShell } from "@/components/AppShell";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const libreCaslonText = Libre_Caslon_Text({
  variable: "--font-libre-caslon-text",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Lady Gasy - Un havre de beauté naturelle",
  description: "Célébrer la beauté naturelle à travers le prisme de l'authenticité et de l'expertise botanique malgache. Des soins capillaires premium et naturels.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${beVietnamPro.variable} ${libreCaslonText.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols Outlined stylesheet */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
