import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/shell";
import { Providers } from "@/app/providers";
import { getCurrencyCurrencyGet } from "@/client";
import { heyApiServerClient } from "@/lib/hey-api";

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

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(heyApiServerClient.getConfig().baseUrl);
  const currency = await getCurrencyCurrencyGet({ client: heyApiServerClient });
  // TODO: global nextjs error handling
  if (!currency.data) {
    throw new Error("Failed to fetch currency data");
  }

  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🤑</text></svg>"
        ></link>
      </head>
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
