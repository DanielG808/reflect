import AuthHydrator from "@/src/components/auth/AuthHydrator";
import AppHeader from "@/src/components/layout/AppHeader";

import { Footer } from "@/src/components/layout/Footer";
import { requireUser } from "@/src/lib/auth/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <>
      <AuthHydrator user={user} />

      <div className="h-dvh min-h-dvh flex flex-col overflow-hidden">
        <div className="shrink-0">
          <AppHeader />
        </div>

        <main className="flex-1 min-h-0 overflow-hidden px-6 py-4">
          {children}
        </main>

        <div className="shrink-0">
          <Footer />
        </div>
      </div>
    </>
  );
}
