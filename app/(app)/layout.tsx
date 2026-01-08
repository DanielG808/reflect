import AuthHydrator from "@/src/components/auth/AuthHydrator";
import AppHeader from "@/src/components/layout/AppHeader";
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

      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 px-6 py-4">{children}</main>
      </div>
    </>
  );
}
