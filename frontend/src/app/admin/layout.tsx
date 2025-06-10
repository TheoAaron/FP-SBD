"use client"

import "./../globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import type { Metadata } from "next";
import AdminNavbar from "@/components/AdminNavbar"
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="en">
      <body>
        {isAdmin ? <AdminNavbar /> : <Navbar />}
        {children}
      </body>
    </html>
  )
}