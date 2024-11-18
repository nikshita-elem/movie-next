import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Footer from "@/components/Footer";
import StoreProvider from "@/redux/StoreProvider";
import "../globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700", "600"] });

export const metadata: Metadata = {
  title: "My Movie",
  description: "A simple movie app",
};

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {


  return (
    <html >
      <body className={montserrat.className}>
        <main>
          <StoreProvider>{children}</StoreProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}