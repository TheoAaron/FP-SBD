'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { FiSearch, FiHeart, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { FaUser, FaUserCircle } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  
 // Checking untuk admin page
  const isAdmin = pathname.startsWith('/admin');
  const logoText = isAdmin ? "tokET" : "tokIT";

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const linkClass = (path: string) =>
    pathname === path
      ? 'border-b-2 border-black pb-1'
      : 'pb-1 hover:border-b';

  return (
    <nav className="w-full border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/">
          <Image src="/tokit.svg" alt="tokIT Logo" width={120} height={60} /> {/* Increased logo size */}
        </Link>

        {/* Nav Links */}
        <div className="space-x-24 text-lg font-bold"> {/* Increased spacing from space-x-16 to space-x-24 */}
          <Link href="/" className={linkClass('/')}>Home</Link>
          <a
          href="https://wa.me/6282145665062"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass('/contact')}
            >
              Contact
              </a>

          <Link href="/about" className={linkClass('/about')}>About</Link>
        </div>

        {/* Search and Icons */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="px-4 py-2 pl-5 rounded-full bg-gray-100 text-lg focus:outline-none" // Increased font size
            />
          </div>

          <Link href="/wishlist" className="relative">
            <FiHeart className="text-3xl cursor-pointer" /> {/* Increased icon size */}
            <span className="absolute -top-2 -right-2 text-sm bg-red-500 text-white px-2 rounded-full"> {/* Increased badge size */}
              4
            </span>
          </Link>
          <Link href="/cart" className="relative">
            <FiShoppingCart className="text-3xl cursor-pointer" /> {/* Increased icon size */}
            <span className="absolute -top-2 -right-2 text-sm bg-red-500 text-white px-2 rounded-full"> {/* Increased badge size */}
              4
            </span>
          </Link>

          {/* Profile Icon with Popup */}
          <div className="relative" ref={popupRef}>
            <FaUserCircle
              className="text-3xl text-red-600 cursor-pointer" // Increased icon size
              onClick={() => setShowPopup((prev) => !prev)}
            />
            {showPopup && (
              <div className="absolute right-0 mt-2 w-52 bg-white border rounded shadow-md p-3 z-50 text-black"> {/* Increased popup width and padding */}
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-5 py-3 rounded hover:bg-gray-100 transition-colors text-lg" // Increased padding, gap and font size
                >
                  <FaUser className="text-lg" /> {/* Increased icon size */}
                  Profile
                </Link>
                <Link
                  href="/logout"
                  className="flex items-center gap-3 px-5 py-3 rounded hover:bg-gray-100 transition-colors text-lg" // Increased padding, gap and font size
                >
                  <FiLogOut className="text-lg" /> {/* Increased icon size */}
                  Logout
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="bg-gray-100 w-full h-[1px]" />
    </nav>
  );
};


 
export default Navbar;
