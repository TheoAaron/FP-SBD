import React from 'react';


<div className="inline-flex flex-col justify-start items-start gap-12">
    <div className="flex flex-col justify-start items-start gap-6">
        <div className="justify-start text-black text-4xl font-medium font-['Inter'] leading-loose tracking-wider">Create an account</div>
        <div className="justify-start text-black text-base font-normal font-['Poppins'] leading-normal">Enter your details below</div>
    </div>
    <div className="flex flex-col justify-start items-center gap-10">
        <div className="flex flex-col justify-start items-start gap-10">
            <div className="flex flex-col justify-start items-start gap-2">
                <div className="opacity-40 justify-start text-black text-base font-normal font-['Poppins'] leading-normal">Name</div>
                <div className="w-96 h-0 relative opacity-50">
                    <div className="w-96 h-0 left-0 top-0 absolute outline outline-1 outline-offset-[-0.50px] outline-black"></div>
                </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-2">
                <div className="opacity-40 justify-start text-black text-base font-normal font-['Poppins'] leading-normal">Email or Phone Number</div>
                <div className="w-96 h-0 relative opacity-50">
                    <div className="w-96 h-0 left-0 top-0 absolute outline outline-1 outline-offset-[-0.50px] outline-black"></div>
                </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-2">
                <div className="opacity-40 justify-start text-black text-base font-normal font-['Poppins'] leading-normal">Password</div>
                <div className="w-96 h-0 relative opacity-50">
                    <div className="w-96 h-0 left-0 top-0 absolute outline outline-1 outline-offset-[-0.50px] outline-black"></div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-4">
            <div data-button="Primary" data-hover="No" className="px-32 py-4 bg-red-500 rounded inline-flex justify-center items-center gap-2.5">
                <div className="justify-start text-neutral-50 text-base font-medium font-['Poppins'] leading-normal">Create Account</div>
            </div>
            <div className="flex flex-col justify-start items-center gap-8">
                <div className="inline-flex justify-start items-center gap-4">
                    <div className="opacity-70 justify-start text-black text-base font-normal font-['Poppins'] leading-normal">Already have account?</div>
                    <div className="inline-flex flex-col justify-start items-start gap-1">
                        <div className="opacity-70 justify-start text-black text-base font-medium font-['Poppins'] leading-normal">Log in</div>
                        <div className="w-12 h-0 relative opacity-50">
                            <div className="w-12 h-0 left-0 top-0 absolute outline outline-1 outline-offset-[-0.50px] outline-black"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>