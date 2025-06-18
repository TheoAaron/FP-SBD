import "../../globals.css";
import type { Metadata } from "next";
import React from 'react'

export const metadata: Metadata = {
  title: "tokIT",
  description: "TOKO IT",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart page layout wrapper */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
};