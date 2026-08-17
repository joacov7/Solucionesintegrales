"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function logout() {
    await logoutAction();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className={cn(
        "rounded-lg px-3 py-2 text-left text-sm font-medium text-muted hover:bg-brand-soft hover:text-ink",
        className
      )}
    >
      Cerrar sesión
    </button>
  );
}
