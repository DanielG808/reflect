"use client";

import { useAuthStore } from "@/src/stores/auth-store";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const status = useAuthStore((s) => s.status);

  const onLogout = async () => {
    const res = await logout();

    if (!res.ok) {
      return;
    }

    router.replace("/login");
    router.refresh();
  };

  return (
    <button
      onClick={onLogout}
      disabled={status === "loading"}
      className="cursor-pointer"
    >
      Logout
    </button>
  );
}
