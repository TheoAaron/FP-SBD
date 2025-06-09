'use client'; // ⬅ Required for using hooks like usePathname

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiSearch, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? 'border-b-2 border-black pb-1'
      : 'pb-1 hover:border-b';

  return (
    <nav className="w-full border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-xl font-bold">tokIT</div>

        {/* Nav Links */}
        <div className="space-x-6 text-sm">
          <Link href="/" className={linkClass('/')}>Home</Link>
          <Link href="/contact" className={linkClass('/contact')}>Contact</Link>
          <Link href="/about" className={linkClass('/about')}>About</Link>
        </div>

        {/* Search and Icons */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="px-3 py-1 pl-4 rounded-full bg-gray-100 text-sm focus:outline-none"
            />
          </div>
          <FiHeart className="text-xl cursor-pointer" />
          <FiShoppingCart className="text-xl cursor-pointer" />
          <FaUserCircle className="text-xl text-red-600 cursor-pointer" />
        </div>
      </div>

      {/* Purple Top Border Line */}
      <div className="bg-gray-100 w-full" />
    </nav>
  );
};

export default Navbar;
