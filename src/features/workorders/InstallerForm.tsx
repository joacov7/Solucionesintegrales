"use client";

import { useState } from "react";
import { createInstallerAction } from "@/app/actions/operations";
import { Button, Field, Input } from "@/components/ui";
import { toast } from "@/components/ui/toast";

export function InstallerForm({ onSuccess }: { onSuccess?: () => void }) {
  const [f, setF] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!f.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    const res = await createInstallerAction(f);
    setSaving(false);
    if (res.ok) {
      toast.success(res.message);
      setF({ name: "", phone: "", email: "" });
      onSuccess?.();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="space-y-4">
      <Field label="Nombre *">
        <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Nombre y apellido" />
      </Field>
      <Field label="Teléfono">
        <Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      </Field>
      <Field label="Email">
        <Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      </Field>
      <Button className="w-full" onClick={save} loading={saving}>
        Crear instalador
      </Button>
    </div>
  );
}
