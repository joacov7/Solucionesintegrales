"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Kbd } from "@/components/ui";

type Item = {
  label: string;
  href: string;
  hint?: string;
  external?: boolean;
};

const GO_TO: Item[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Presupuestos", href: "/admin/presupuestos" },
  { label: "Órdenes de trabajo", href: "/admin/ordenes" },
  { label: "Instaladores", href: "/admin/instaladores" },
  { label: "Instalaciones y garantías", href: "/admin/instalaciones" },
  { label: "Leads / CRM", href: "/admin/leads" },
  { label: "Clientes", href: "/admin/clientes" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Stock", href: "/admin/stock" },
  { label: "Mantenimiento", href: "/admin/mantenimiento" },
  { label: "Mano de obra", href: "/admin/servicios" },
  { label: "Financiación", href: "/admin/financiacion" },
  { label: "Configuración", href: "/admin/configuracion" },
  { label: "Design System", href: "/admin/design" },
];

const ACTIONS: Item[] = [
  { label: "Nuevo presupuesto", href: "/admin/presupuestos/nuevo", hint: "Crear" },
  { label: "Nuevo cliente", href: "/admin/clientes", hint: "Crear" },
  { label: "Nuevo instalador", href: "/admin/instaladores", hint: "Crear" },
  { label: "Agendar mantenimiento", href: "/admin/mantenimiento", hint: "Crear" },
];

const PUBLIC: Item[] = [
  { label: "Ver sitio público", href: "/" },
  { label: "App del instalador", href: "/installer" },
  { label: "Cotizador de alarmas", href: "/cotizar/alarmas" },
  { label: "Cotizador de cámaras", href: "/cotizar/camaras" },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (item: Item) => {
    setOpen(false);
    if (item.external) {
      window.open(item.href, "_blank");
    } else {
      router.push(item.href);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="focus-ring flex w-full items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" />
        </svg>
        <span className="flex-1 text-left">Buscar o ejecutar…</span>
        <span className="hidden items-center gap-1 sm:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
            <motion.div
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-pop"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Command className="w-full" loop>
                <div className="flex items-center gap-2 border-b border-line px-4">
                  <Icon name="spark" className="h-4 w-4 text-muted" />
                  <Command.Input
                    autoFocus
                    placeholder="Buscar secciones, acciones…"
                    className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                  />
                  <Kbd>esc</Kbd>
                </div>
                <Command.List className="max-h-[320px] overflow-y-auto p-2">
                  <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
                    Sin resultados.
                  </Command.Empty>

                  <Group heading="Acciones rápidas">
                    {ACTIONS.map((i) => (
                      <Row key={i.label} item={i} onSelect={go} accent />
                    ))}
                  </Group>

                  <Group heading="Ir a">
                    {GO_TO.map((i) => (
                      <Row key={i.href} item={i} onSelect={go} />
                    ))}
                  </Group>

                  <Group heading="Público">
                    {PUBLIC.map((i) => (
                      <Row key={i.href} item={i} onSelect={go} />
                    ))}
                  </Group>
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="px-1 pb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted"
    >
      {children}
    </Command.Group>
  );
}

function Row({
  item,
  onSelect,
  accent,
}: {
  item: Item;
  onSelect: (i: Item) => void;
  accent?: boolean;
}) {
  return (
    <Command.Item
      value={item.label}
      onSelect={() => onSelect(item)}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink data-[selected=true]:bg-brand-soft"
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md ${
          accent ? "bg-accent/10 text-accent" : "bg-brand-soft text-muted"
        }`}
      >
        <Icon name={accent ? "spark" : "arrow-right"} className="h-3.5 w-3.5" />
      </span>
      <span className="flex-1">{item.label}</span>
      {item.hint && <span className="text-xs text-muted">{item.hint}</span>}
    </Command.Item>
  );
}
