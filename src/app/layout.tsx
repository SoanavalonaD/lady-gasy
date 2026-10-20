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
  metadataBase: new URL("https://ladygasy.mg"),
  title: "Lady Gasy - Un havre de beauté naturelle",
  description: "Découvrez le pouvoir de la nature avec notre gamme de soins capillaires bio, conçue spécifiquement pour sublimer les cheveux texturés et naturels.",
  icons: {
    icon: "/logo2.png",
    shortcut: "/logo2.png",
    apple: "/logo2.png",
  },
  openGraph: {
    title: "Lady Gasy - Un havre de beauté naturelle",
    description: "Découvrez le pouvoir de la nature avec notre gamme de soins capillaires bio, conçue spécifiquement pour sublimer les cheveux texturés et naturels.",
    url: "https://ladygasy.mg",
    siteName: "Lady Gasy",
    locale: "fr_MG",
    type: "website",
    images: [
      {
        url: "/background-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lady Gasy - Un havre de beauté naturelle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lady Gasy - Un havre de beauté naturelle",
    description: "Découvrez le pouvoir de la nature avec notre gamme de soins capillaires bio, conçue spécifiquement pour sublimer les cheveux texturés et naturels.",
    images: ["/background-image.jpg"],
  },
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
