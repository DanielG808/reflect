import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/src/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Reflect",
  description: "Private journaling, thoughtfully designed",
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
        <Toaster
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--accent)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            },
          }}
        />
      </body>
    </html>
  );
}
