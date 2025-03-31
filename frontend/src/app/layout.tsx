import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/shell";
import { Providers } from "@/app/providers";
import { getCurrencyCurrencyGet } from "@/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banko",
  description: "Personal finance management made easy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currency = await getCurrencyCurrencyGet();
  // TODO: global nextjs error handling
  if (!currency.data) {
    throw new Error("Failed to fetch currency data");
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers currency={currency.data}>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
