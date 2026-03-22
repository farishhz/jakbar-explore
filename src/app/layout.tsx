import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "./LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wisata & Kuliner Jakarta Barat Terlengkap 2024 | Jakbar Explore",
  description: "Panduan lengkap wisata dan kuliner Jakarta Barat. Temukan 100+ rekomendasi tempat makan enak, cafe aesthetic, destinasi wisata, hotel, dan tempat nongkrong terbaik di Tanjung Duren, Puri Indah, PIK, dan sekitarnya.",
  keywords: ["wisata jakarta barat", "kuliner jakarta barat", "tempat makan jakbar", "cafe jakarta barat", "tanjung duren", "puri indah", "PIK", "pantai indah kapuk", "tempat nongkrong jakarta", "hotel jakarta barat", "wisata murah jakarta", "kuliner enak jakbar"],
  authors: [{ name: "Jakbar Explore Team" }],
  creator: "Jakbar Explore",
  publisher: "Jakbar Explore",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  canonical: "https://jakbar-4.vercel.app/",
  alternates: {
    languages: {
      id: "https://jakbar-4.vercel.app/",
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jakbar Explore",
  },
  verification: {
    google: "AKKZ7yzAWuqwOEDovTwVnd9vW_NGDZq55h3GbxBRvCg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://jakbar-4.vercel.app/",
    siteName: "Jakbar Explore",
    title: "Wisata & Kuliner Jakarta Barat Terlengkap 2024",
    description: "Panduan lengkap wisata dan kuliner Jakarta Barat. Temukan 100+ rekomendasi tempat makan enak, cafe aesthetic, dan destinasi wisata terbaik.",
    images: [{
      url: "/images/og-preview.jpg",
      width: 1200,
      height: 630,
      alt: "Wisata & Kuliner Jakarta Barat",
      type: "image/jpeg",
    }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@jakbarexplore",
    creator: "@jakbarexplore",
    title: "Wisata & Kuliner Jakarta Barat Terlengkap 2024",
    description: "Panduan lengkap wisata dan kuliner Jakarta Barat. 100+ rekomendasi tempat makan, cafe, dan destinasi wisata terbaik.",
    images: ["/images/twitter-preview.jpg"],
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
    "theme-color": "#0d1117",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
