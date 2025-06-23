'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiShoppingCart, FiLogOut, FiMenu, FiX, FiSearch } from 'react-icons/fi';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('jwtToken');
      setIsLoggedIn(!!token);

      const userInfo = sessionStorage.getItem('user');
      if (userInfo) {
        try {
          setUserProfile(JSON.parse(userInfo));
        } catch (error) {
          console.error('Error parsing user info:', error);
        }
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

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
      ? 'border-b-2 border-black pb-1 text-black'
      : 'pb-1 hover:border-b text-gray-700 hover:text-black';

  const mobileLinkClass = (path: string) =>
    pathname === path
      ? 'block px-4 py-3 text-black font-semibold bg-gray-100 rounded-lg'
      : 'block px-4 py-3 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors';

  const [query, setQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        router.push(`/product?search=${encodeURIComponent(query)}`)
      }
    }

  return (
    <nav className="w-full border-b shadow-sm bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {}
        <Link href="/">
          <Image src="/tokit.svg" alt="tokIT Logo" width={200} height={80} /> {}
        </Link>

        {}
        <div className="hidden lg:flex space-x-8 xl:space-x-12 text-base xl:text-lg font-medium">
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

        {}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Cari produk..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </form>
          </div>
        </div>

        {}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-black transition-colors"
          >
            <FiSearch size={20} />
          </button>

          {}
          <Link
            href="/wishlist"
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors relative"
          >
            <FiHeart size={20} />
          </Link>

          {}
          <Link
            href="/cart"
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors relative"
          >
            <FiShoppingCart size={20} />
          </Link>

          {}
          {isLoggedIn ? (
            <div className="relative" ref={popupRef}>
              <button
                onClick={() => setShowPopup(!showPopup)}
                className="p-2 text-gray-600 hover:text-black transition-colors"
              >
                {userProfile?.profile_picture ? (
                  <Image
                    src={userProfile.profile_picture}
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <FaUserCircle size={24} />
                )}
              </button>

              {showPopup && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {userProfile?.name || userProfile?.first_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{userProfile?.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowPopup(false)}
                  >
                    <FaUser className="mr-3" size={14} />
                    Profile
                  </Link>

                  {userProfile?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowPopup(false)}
                    >
                      <FaUser className="mr-3" size={14} />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      sessionStorage.removeItem('jwtToken');
                      sessionStorage.removeItem('user');
                      setIsLoggedIn(false);
                      setUserProfile(null);
                      setShowPopup(false);
                      router.push('/');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                  >
                    <FiLogOut className="mr-3" size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <FaUser className="mr-2" size={14} />
              Login
            </Link>
          )}

          {}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-black transition-colors"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4 border-t bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      )}

      {}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/"
              className={mobileLinkClass('/')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="https://wa.me/6282145665062"
              target="_blank"
              rel="noopener noreferrer"
              className={mobileLinkClass('/contact')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <Link
              href="/about"
              className={mobileLinkClass('/about')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            {}
            {!isLoggedIn && (
              <Link
                href="/login"
                className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUser className="mr-3" size={16} />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
