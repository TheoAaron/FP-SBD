import "./../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "tokIT",
  description: "TOKO IT",
};

export default function CheckoutLayout({
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