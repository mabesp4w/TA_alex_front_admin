/** @format */

import React, { useState } from "react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Tanaman Obat",
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Head>
        <title>{title} | Tanaman Obat Admin</title>
        <meta name="description" content="Tanaman Obat Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-base-100">
        {/* Toast notifications */}
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

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Sidebar backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main content */}
        <div className={`lg:pl-64 transition-all duration-300 ease-in-out`}>
          <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
