import "./../globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "tokET",
  description: "TOKO ETerion",
};

// src/app/admin/products/layout.tsx
export default function AdminProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )}
