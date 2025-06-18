import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "tokIT",
  description: "TOKO IT",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <LayoutWrapper>
          {children}          
        </LayoutWrapper>
      </body>
    </html>
  );
}
