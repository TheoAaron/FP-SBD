'use client';

import React from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginLayout() {
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);    
        const payload = {
            username: formData.get('email'),
            password: formData.get('password'),
        };
        try {

            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                toast.success('Login successful');
                const data = await res.json();
                if (data.token) {
                    sessionStorage.setItem('jwtToken', data.token);
                    // Redirect ke home setelah login berhasil
                    router.push('/');
                }
            } else {
                toast.error('Login failed');
            }
        } catch (err) {
            toast.error('Error logging in');
            console.error('Error:', err);
        }
    }
    return (
        <>
            <Toaster position="top-right" />
            <div className="inline-flex justify-start items-center gap-32">
                <div className="w-[805px] h-[781px] relative bg-slate-300 rounded-tr rounded-br overflow-hidden">
                    <img className="w-[805px] h-[782px] left-[-px] top-[px] absolute" src="https://magnoliahome.co.in/wp-content/uploads/2021/08/Jasper-Arm-Chair-1.1-1.jpg" />
                </div>
                <div className="inline-flex flex-col justify-start items-start gap-10">
                    <div className="flex flex-col justify-start items-start gap-4">
                        <div className="justify-start text-black text-4xl font-medium font-['Inter'] leading-loose tracking-wider">Log in to Exclusive</div>
                        <div className="justify-start text-black text-base font-normal font-['Poppins'] leading-normal">Enter your details below</div>
                    </div>
                    <div className="flex flex-col justify-start items-center gap-10">
                        <form className="flex flex-col justify-start items-start gap-10" onSubmit={handleSubmit}>
                            <div className="flex flex-col justify-start items-start gap-10">
                                <div className="flex flex-col justify-start items-start gap-12">


                                    {/* Email or Phone */}
                                    <div className="flex flex-col gap-2 w-96">

                                        <input
                                            name="email"
                                            type="text"
                                            className="w-80 border-b border-black opacity-100 text-black text-base font-normal font-['Poppins'] leading-normal bg-transparent placeholder-opacity-20"
                                            placeholder="Enter your Username"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-2 w-96">

                                        <input
                                            name="password"
                                            type="password"
                                            className="w-80 border-b border-black outline-none text-black text-base font-['Poppins'] bg-transparent placeholder-opacity-50"
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-col justify-start items-start gap-4">
                                <button
                                    type="submit"
                                    className="px-12 py-4 bg-red-500 rounded inline-flex justify-center items-center gap-2.5 text-neutral-50 text-base font-medium font-['Poppins'] leading-normal"
                                >
                                    Login
                                </button>
                                <div className="flex flex-col justify-start items-center gap-8">
                                    <div className="inline-flex justify-start items-center gap-4">
                                        <Link href="/login" className="inline-flex flex-col justify-start items-start gap-1">
                                            <span className="justify-start text-red-500 text-base font-normal font-['Poppins'] leading-normal">Forgot Password?</span>
                                            <div className="w-12 h-0 relative opacity-50">
                                                <div className="w-36 h-0 left-0 top-0 absolute outline outline-1 outline-offset-[-0.50px] outline-red-500"></div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}