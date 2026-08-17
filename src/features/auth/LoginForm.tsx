"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction } from "@/app/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    const res = await loginAction(password);
    if (res.ok) {
      const dest = res.role === "INSTALLER" ? "/installer" : next;
      router.replace(dest);
      router.refresh();
    } else {
      setError(res.message ?? "No se pudo ingresar.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Contraseña"
        className="h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-accent focus:outline-none"
        autoFocus
      />
      <button
        onClick={submit}
        disabled={loading}
        className="mt-3 w-full rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
      >
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
      {error && <p className="mt-3 text-center text-sm text-rose-600">{error}</p>}
    </div>
  );
}
