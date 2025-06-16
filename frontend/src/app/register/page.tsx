'use client';

import React from 'react';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';

// form submission handler
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
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

export default function SigninPage() {
    return (
        <>
            <Toaster position="top-right" />
            <div className="inline-flex justify-start items-center gap-32">
                <div className="w-[805px] h-[781px] relative bg-slate-300 rounded-tr rounded-br overflow-hidden">
                    <img className="w-[805px] h-[782px] left-[-px] top-[px] absolute" src="https://magnoliahome.co.in/wp-content/uploads/2021/08/Jasper-Arm-Chair-1.1-1.jpg" />
                </div>
                <div className="inline-flex flex-col justify-start items-start gap-10">
                    <div className="flex flex-col justify-start items-start gap-4">
                        <div className="justify-start text-black text-4xl font-medium font-['Inter'] leading-loose tracking-wider">Create an account</div>
                        <div className="justify-start text-black text-base font-normal font-['Poppins'] leading-normal">Enter your details below</div>
                    </div>
                    <div className="flex flex-col justify-start items-center gap-10">
                        <form className="flex flex-col justify-start items-start gap-10" onSubmit={handleSubmit}>
                            <div className="flex flex-col justify-start items-start gap-10">
                                <div className="flex flex-col justify-start items-start gap-12">
                                    {/* Name */}
                                    <div className="flex flex-col gap-2 w-96">

                                        <input
                                            name="name"
                                            type="text"
                                            className="w-80 border-b border-black outline-none text-black text-base font-['Poppins'] bg-transparent placeholder-opacity-200"
                                            placeholder="Username Here"
                                        />
                                    </div>

                                    {/* Email or Phone */}
                                    <div className="flex flex-col gap-2 w-96">

                                        <input
                                            name="email"
                                            type="text"
                                            className="w-80 border-b border-black opacity-100 text-black text-base font-normal font-['Poppins'] leading-normal bg-transparent placeholder-opacity-20"
                                            placeholder="Email Here"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-2 w-96">

                                        <input
                                            name="password"
                                            type="password"
                                            className="w-80 border-b border-black outline-none text-black text-base font-['Poppins'] bg-transparent placeholder-opacity-50"
                                            placeholder="Password Here, but sshh quitely"
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-col justify-start items-start gap-4">
                                <button
                                    type="submit"
                                    className="px-32 py-4 bg-red-500 rounded inline-flex justify-center items-center gap-2.5 text-neutral-50 text-base font-medium font-['Poppins'] leading-normal"
                                >
                                    Create Account
                                </button>
                                <div className="flex flex-col justify-start items-center gap-8">
                                    <div className="inline-flex justify-start items-center gap-4">
                                        <div className="opacity-70 justify-start text-black text-base font-normal font-['Poppins'] leading-normal">Already have account?</div>
                                        <Link href="/login" className="inline-flex flex-col justify-start items-start gap-1">
                                            <span className="opacity-70 text-black text-base font-medium font-['Poppins'] leading-normal">Log in</span>
                                            <div className="w-12 h-0 relative opacity-50">
                                                <div className="w-12 h-0 left-0 top-0 absolute outline outline-1 outline-offset-[-0.50px] outline-black"></div>
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