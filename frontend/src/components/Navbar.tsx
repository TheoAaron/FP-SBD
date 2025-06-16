'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { FiHeart, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { FaUser, FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: number;
  email: string;
  role: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
}

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('jwtToken');
      setIsLoggedIn(!!token);
      
      // Optionally get user info from sessionStorage
      const userInfo = sessionStorage.getItem('user');
      if (userInfo) {
        try {
          setUserProfile(JSON.parse(userInfo));
        } catch (error) {
          console.error('Error parsing user info:', error);
        }
      }
    };

    // Check on component mount
    checkLoginStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };  }, []);

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
            <input
              type="text"
              placeholder="What are you looking for?"
              className="px-4 py-2 pl-5 rounded-full bg-gray-100 text-lg focus:outline-none" // Increased font size
            />

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
          </Link>          {/* Profile Icon or Login Button */}
          {isLoggedIn ? (
            <div className="relative" ref={popupRef}>
              {/* Profile Picture or Default Icon */}
              {userProfile?.profile_picture ? (
                <img
                  src={userProfile.profile_picture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-red-600"
                  onClick={() => setShowPopup((prev) => !prev)}
                />
              ) : (
                <FaUserCircle
                  className="text-3xl text-red-600 cursor-pointer"
                  onClick={() => setShowPopup((prev) => !prev)}
                />
              )}
              
              {showPopup && (
                <div className="absolute right-0 mt-2 w-52 bg-white border rounded shadow-md p-3 z-50 text-black">
                  <div className="px-5 py-2 border-b border-gray-200 mb-2">
                    <p className="text-sm text-gray-600">Welcome!</p>
                    <p className="font-semibold">
                      {userProfile?.first_name || userProfile?.name || userProfile?.email || 'User'}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-5 py-3 rounded hover:bg-gray-100 transition-colors text-lg"
                    onClick={() => setShowPopup(false)}
                  >
                    <FaUser className="text-lg" /> 
                    My Profile
                  </Link>
                  <Link
                    href="/order"
                    className="flex items-center gap-3 px-5 py-3 rounded hover:bg-gray-100 transition-colors text-lg"
                    onClick={() => setShowPopup(false)}
                  >
                    <FiShoppingCart className="text-lg" /> 
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("jwtToken");
                      sessionStorage.removeItem("user");
                      setIsLoggedIn(false);
                      setUserProfile(null);
                      setShowPopup(false);
                      router.push('/');
                    }}
                    className="flex items-center gap-3 px-5 py-3 rounded hover:bg-gray-100 transition-colors text-lg w-full text-left"
                  >
                    <FiLogOut className="text-lg" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 text-red-600 font-semibold hover:text-red-800 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom border */}
      <div className="bg-gray-100 w-full h-[1px]" />
    </nav>
  );
};


 
export default Navbar;
