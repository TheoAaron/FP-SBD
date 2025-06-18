import "./../globals.css";
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
           <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
      </body>
    </html>
  );
}
