import "../../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "tokET - Admin Coupon",
  description: "TOKO ETerion - Admin Coupon Management",
};

export default function AdminCouponLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}