import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/LoginForm";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Ingresar",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-brand-soft p-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8 shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-fg">
          <Icon name="shield" className="h-7 w-7 text-accent" />
        </div>
        <h1 className="mt-5 text-center text-xl font-bold text-ink">
          {siteConfig.name}
        </h1>
        <p className="mt-1 text-center text-sm text-muted">
          Acceso al panel de gestión
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
