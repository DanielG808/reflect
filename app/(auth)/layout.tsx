import AuthHeader from "@/src/components/layout/AuthHeader";
import { Footer } from "@/src/components/layout/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex justify-center items-center p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
