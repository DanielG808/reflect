import AppHeader from "@/src/components/layout/AppHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />
      <main className="flex-1 px-6 py-4">{children}</main>
    </div>
  );
}
