'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
  showMessage?: boolean;
}

export default function RequireAuth({
  children,
  redirectTo = '/login',
  showMessage = true
}: RequireAuthProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          if (!showMessage) {
            router.push(redirectTo);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        if (!showMessage) {
          router.push(redirectTo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectTo, showMessage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && showMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md w-full">
          <div className="mb-8">
            <img
              src="https://res.cloudinary.com/dp8hpdiop/image/upload/angrycapy_hz49er.png"
              alt="Please login"
              className="w-48 h-48 mx-auto mb-6 object-contain"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum Login !!!</h2>
            <p className="text-gray-600 mb-8">
             Login Dulu Kalau nggak Nanti dicium Apin
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href={redirectTo}
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Go to Login
            </Link>
            <Link
              href="/register"
              className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              Create New Account
            </Link>
            <Link
              href="/"
              className="block w-full text-gray-500 hover:text-gray-700 transition-colors py-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !showMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center">        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
