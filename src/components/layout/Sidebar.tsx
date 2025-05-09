/** @format */
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Tag, Layers, Activity, Home, CurlyBraces } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  subItems?: { title: string; href: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const currentPath = usePathname();

  // Navigation items
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home size={20} />,
    },
    {
      title: "Tanaman Obat",
      href: "/medicinal-plants",
      icon: <Leaf size={20} />,
      subItems: [
        { title: "Semua Tanaman Obat", href: "/medicinal-plants" },
        { title: "Tambah Tanaman Obat Baru", href: "/medicinal-plants/new" },
      ],
    },
    {
      title: "Kategori",
      href: "/categories",
      icon: <Tag size={20} />,
      subItems: [
        { title: "Semua Kategori", href: "/categories" },
        { title: "Tambah Kategori Baru", href: "/categories/new" },
      ],
    },
    {
      title: "Bagian Tanaman",
      href: "/parts",
      icon: <Layers size={20} />,
      subItems: [
        { title: "Semua Bagian Tanaman", href: "/parts" },
        { title: "Tambah Bagian Tanaman Baru", href: "/parts/new" },
      ],
    },
    {
      title: "Penyakit",
      href: "/diseases",
      icon: <Activity size={20} />,
      subItems: [
        { title: "Semua Penyakit", href: "/diseases" },
        { title: "Tambah Penyakit Baru", href: "/diseases/new" },
      ],
    },
    {
      title: "3D Models",
      href: "/3d-models",
      icon: <CurlyBraces size={20} />,
      subItems: [
        { title: "Semua Model 3D", href: "/3d-models" },
        { title: "Tambah Model 3D Baru", href: "/3d-models/new" },
      ],
    },
  ];

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  // Check if a path is exactly active
  const isExactActive = (path: string) => currentPath === path;

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-200 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-center px-4 border-b border-base-300">
          <Link href="/" className="flex items-center gap-2">
            {/* <MenuIcon className="text-primary h-6 w-6" /> */}
            <span className="font-bold text-xl">Menu</span>
          </Link>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-2 py-4">
          <ul className="menu menu-md">
            {navItems.map((item, index) => (
              <li key={index}>
                {item.subItems ? (
                  <details open={isActive(item.href)}>
                    <summary className={isActive(item.href) ? "active" : ""}>
                      {item.icon}
                      {item.title}
                    </summary>
                    <ul>
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href}
                            className={
                              isExactActive(subItem.href) ? "active" : ""
                            }
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link
                    href={item.href}
                    className={isActive(item.href) ? "active" : ""}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-base-300 p-4">
          <div className="text-xs text-base-content/70">
            <p>© 2025 MedicinalPlants</p>
            <p>All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
