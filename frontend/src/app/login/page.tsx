'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginLayout() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = sessionStorage.getItem('jwtToken');
                if (token) {
                    setIsAuthenticated(true);
                    // Redirect to home if already logged in
                    toast.success('You are already logged in!');
                    router.push('/');
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If already authenticated, show message
    if (isAuthenticated) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Logged In</h2>
                    <p className="text-gray-600 mb-6">You are already logged in. Redirecting to home...</p>

                    <Link 
                        href="/" 
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);    
        const payload = {
            username: formData.get('email'),
            password: formData.get('password'),
        };
        try {

             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                toast.success('Login successful');
                const data = await res.json();
                if (data.token) {
                    sessionStorage.setItem('jwtToken', data.token);

                    const userRole = data.role || data.user?.role;
                    if (userRole === 'admin') {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/';
                    }
                }
            } else {
                const dataa = await res.json();
                toast.error(dataa.message || 'Login failed');
            }
        } catch (err) {
            toast.error('Error logging in');
            console.error('Error:', err);
        }
    }    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Image Section - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:block lg:w-1/2 relative bg-slate-300 overflow-hidden">
                    <img 
                        className="w-full h-full object-cover" 
                        src="https://magnoliahome.co.in/wp-content/uploads/2021/08/Jasper-Arm-Chair-1.1-1.jpg" 
                        alt="Chair"
                    />
                </div>

                {/* Form Section */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <div className="w-full max-w-md space-y-6 sm:space-y-8">
                        {/* Header */}
                        <div className="text-center lg:text-left space-y-2 sm:space-y-4">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-black leading-tight">
                                Log in to Exclusive
                            </h1>
                            <p className="text-sm sm:text-base text-black">
                                Enter your details below
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
                            {/* Email or Phone */}
                            <div className="space-y-2">
                                <input
                                    name="email"
                                    type="text"
                                    className="w-full border-b border-black/50 focus:border-black outline-none text-black text-sm sm:text-base font-normal bg-transparent placeholder-black/50 pb-2 px-0 transition-colors touch-manipulation"
                                    placeholder="Enter your Username"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <input
                                    name="password"
                                    type="password"
                                    className="w-full border-b border-black/50 focus:border-black outline-none text-black text-sm sm:text-base font-normal bg-transparent placeholder-black/50 pb-2 px-0 transition-colors touch-manipulation"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-red-500 hover:bg-red-600 active:bg-red-600 rounded text-white text-sm sm:text-base font-medium transition-colors touch-manipulation"
                                >
                                    Login
                                </button>

                                {/* Forgot Password */}
                                <div className="text-center lg:text-left">
                                    <Link 
                                        href="/login" 
                                        className="text-red-500 text-sm sm:text-base hover:text-red-600 active:text-red-600 underline transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Sign Up Link */}                                <div className="text-center lg:text-left text-sm sm:text-base text-black/70">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href="/register" 
                                        className="text-red-500 hover:text-red-600 active:text-red-600 underline transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}