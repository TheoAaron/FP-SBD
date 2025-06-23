'use client';

import React from 'react';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    };
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const results = await res.json();
        if (res.ok) {
            toast.success(results.message);
            window.location.href = '/login';
        } else {
            toast.error(results.message);
        }
    } catch (err) {
        toast.error('Error registering user');
        console.error('Error:', err);
    }
}

export default function RegisterPage() {
    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen flex flex-col lg:flex-row">
                {}
                <div className="hidden lg:flex w-full lg:w-1/2 relative bg-slate-300 overflow-hidden">
                    <img
                        className="w-full h-full object-cover"
                        src="https://magnoliahome.co.in/wp-content/uploads/2021/08/Jasper-Arm-Chair-1.1-1.jpg"
                        alt="Register illustration"
                    />
                </div>

                {}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <div className="w-full max-w-md space-y-8">
                        {}
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl sm:text-4xl font-medium text-black leading-tight tracking-wide">
                                Create an account
                            </h1>
                            <p className="mt-4 text-base text-gray-600">
                                Enter your details below
                            </p>
                        </div>

                        {}
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {}
                                <div className="space-y-2">
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full pb-2 border-b border-gray-300 outline-none text-black text-base bg-transparent placeholder-gray-400 focus:border-black transition-colors"
                                        placeholder="Username Here"
                                    />
                                </div>

                                {}
                                <div className="space-y-2">
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full pb-2 border-b border-gray-300 outline-none text-black text-base bg-transparent placeholder-gray-400 focus:border-black transition-colors"
                                        placeholder="Email Here"
                                    />
                                </div>

                                {}
                                <div className="space-y-2">
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full pb-2 border-b border-gray-300 outline-none text-black text-base bg-transparent placeholder-gray-400 focus:border-black transition-colors"
                                        placeholder="Password Here"
                                    />
                                </div>
                            </div>

                            {}
                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Create Account
                                </button>

                                {}
                                <div className="text-center">
                                    <span className="text-gray-600">Already have account? </span>
                                    <Link
                                        href="/login"
                                        className="text-black font-medium hover:text-blue-500 transition-colors border-b border-transparent hover:border-blue-500"
                                    >
                                        Log in
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
