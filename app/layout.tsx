import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Reflect",
  description: "Private journaling",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
