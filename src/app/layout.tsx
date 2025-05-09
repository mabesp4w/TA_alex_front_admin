/** @format */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Auth from "./Auth";

// Font configuration
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Tanaman Obat Admin",
    default: "Tanaman Obat Admin",
  },
  description: "Web Admin Tanaman Obat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <Auth />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "hsl(var(--b1))",
              color: "hsl(var(--bc))",
              border: "1px solid hsl(var(--b3))",
            },
            success: {
              iconTheme: {
                primary: "hsl(var(--su))",
                secondary: "hsl(var(--suc))",
              },
            },
            error: {
              iconTheme: {
                primary: "hsl(var(--er))",
                secondary: "hsl(var(--erc))",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
