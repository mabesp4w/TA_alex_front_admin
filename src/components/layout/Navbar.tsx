/** @format */

import React from "react";
import Link from "next/link";
import { Menu, X, Leaf } from "lucide-react";
import Image from "next/image";

interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div className="navbar bg-base-100 shadow-md px-4 z-10">
      <div className="flex-1">
        <button
          className="btn btn-ghost btn-circle lg:hidden"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className="btn btn-ghost">
          <div className="flex items-center gap-2">
            <Leaf className="text-primary" />
            <span className="font-bold text-xl">Tanaman Obat</span>
          </div>
        </Link>
      </div>

      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <Image
                alt="User Avatar"
                src="/images/avatar.png"
                width={40}
                height={40}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="/auth/logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
