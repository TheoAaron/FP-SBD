import "./../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "tokET",
  description: "TOKO ETerion",
};

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