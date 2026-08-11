import type { Metadata } from "next";
import { Libre_Caslon_Text, Be_Vietnam_Pro } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const libreCaslon = Libre_Caslon_Text({
  variable: "--font-libre-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lady Gasy - Un havre de beauté naturelle",
  description: "Découvrez le pouvoir de la nature avec notre gamme de soins capillaires bio, conçue spécifiquement pour sublimer les cheveux texturés et naturels.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${libreCaslon.variable} ${beVietnam.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
