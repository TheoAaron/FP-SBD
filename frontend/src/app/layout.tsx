import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "tokIT",
  description: "TOKO IT",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
