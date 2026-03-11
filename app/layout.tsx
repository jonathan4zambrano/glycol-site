import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GlycoTech",
  description: "Real-time stormwater glycol monitoring for airports and industrial facilities.",
  openGraph: {
    title: "GlycoTech",
    description: "Real-time stormwater glycol monitoring for airports and industrial facilities.",
    url: "https://glycotech.ca",
    siteName: "GlycoTech",
    images: [
      {
        url: "https://glycotech.ca/Navbar_Logo.png",
        width: 1200,
        height: 630,
        alt: "GlycoTech Logo",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlycoTech",
    description: "Real-time stormwater glycol monitoring for airports and industrial facilities.",
    images: ["https://glycotech.ca/Navbar_Logo.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

