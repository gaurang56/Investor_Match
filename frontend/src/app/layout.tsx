// app/layout.tsx
"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers"; 
import { InvestorsProvider } from "./InvestorsContext"; 
import { DarkModeProvider } from "./DarkModeContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/* export const metadata: Metadata = {
  title: "AloAngels: Free AI Powered Investor Matching",
  description: "Find investors willing to fund your idea or business with AlgoAngels, an AI Powered Investor Matching tool ",
}; */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <InvestorsProvider> 
          <DarkModeProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            suppressHydrationWarning
          >
            {children}
          </body>
          </DarkModeProvider>
        </InvestorsProvider>
      </Providers>
    </html>
  );
}