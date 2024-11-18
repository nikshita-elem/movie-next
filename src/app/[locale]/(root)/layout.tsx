/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Footer from "@/components/Footer";
import StoreProvider from "@/redux/StoreProvider";
import React from "react";

/**
 * Initialize the Montserrat font with desired subsets and weights.
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/**
 * Metadata for the application, enhancing SEO and providing useful information.
 */
export const metadata: Metadata = {
  title: "My Movie",
  description: "A simple movie app",
};

/**
 * Interface representing the expected parameters for RootLayout.
 */
// interface RootLayoutProps {
//   children: React.ReactNode;
//   params: {
//     locale: string;
//   };
// }

/**
 * RootLayout Component
 * 
 * Serves as the root layout for the application, wrapping all pages.
 * Incorporates internationalization, global state management, and consistent theming.
 */
export default async function RootLayout({ children, params }: any) {
  const { locale } = await params;
  

  // Fetch localized messages based on the current locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={`${montserrat.className} flex flex-col min-h-screen w-full`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <main className="flex-grow">{children}</main>
          </StoreProvider>
        </NextIntlClientProvider>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
