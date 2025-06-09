import "./../globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "tokIT",
  description: "TOKO IT",
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
