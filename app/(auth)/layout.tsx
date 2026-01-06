import AuthHeader from "@/src/components/layout/AuthHeader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthHeader />
      <div className="flex flex-1 justify-center items-center p-6">
        {children}
      </div>
    </>
  );
}
