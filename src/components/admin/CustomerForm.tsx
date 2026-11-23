"use client";

import { useState } from "react";
import type { CustomerType } from "@prisma/client";
import { createCustomerAction } from "@/app/actions/admin";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { toast } from "@/components/ui/toast";

const TYPES: { value: CustomerType; label: string }[] = [
  { value: "PARTICULAR", label: "Particular" },
  { value: "COMERCIO", label: "Comercio" },
  { value: "EMPRESA", label: "Empresa" },
];

const empty = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  taxId: "",
  address: "",
  locality: "",
  type: "PARTICULAR" as CustomerType,
  notes: "",
};

export function CustomerForm({ onSuccess }: { onSuccess?: () => void }) {
  const [f, setF] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!f.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    const res = await createCustomerAction(f);
    setSaving(false);
    if (res.ok) {
      toast.success(res.message);
      setF(empty);
      onSuccess?.();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre *">
          <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Juan Pérez" />
        </Field>
        <Field label="Tipo de cliente">
          <Select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as CustomerType })}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Teléfono">
          <Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        </Field>
        <Field label="WhatsApp">
          <Input value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} />
        </Field>
        <Field label="Email">
          <Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </Field>
        <Field label="DNI / CUIT">
          <Input value={f.taxId} onChange={(e) => setF({ ...f, taxId: e.target.value })} />
        </Field>
        <Field label="Dirección">
          <Input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />
        </Field>
        <Field label="Localidad">
          <Input value={f.locality} onChange={(e) => setF({ ...f, locality: e.target.value })} />
        </Field>
      </div>
      <Field label="Notas">
        <Textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
      </Field>
      <Button className="mt-2 w-full" onClick={save} loading={saving}>
        Crear cliente
      </Button>
    </div>
  );
}
