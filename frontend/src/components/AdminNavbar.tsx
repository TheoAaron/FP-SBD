// src/components/AdminNavbar.tsx
"use client" // ← Tambahkan ini di baris pertama

import Link from "next/link"
import { usePathname } from 'next/navigation'

export default function AdminNavbar() {
  const pathname = usePathname()
  
  return (
    <nav className="w-full bg-white border-b">
      {/* ... rest of component */}
    </nav>
  )
}
