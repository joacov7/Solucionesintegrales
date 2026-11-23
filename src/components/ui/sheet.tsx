"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

/** Panel lateral deslizante (derecha) para crear/editar sin cambiar de pantalla. */
export function SheetContent({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-surface shadow-pop",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line p-5">
          <div>
            <Dialog.Title className="text-lg font-bold text-ink">{title}</Dialog.Title>
            {description && (
              <Dialog.Description className="mt-1 text-sm text-muted">
                {description}
              </Dialog.Description>
            )}
          </div>
          <Dialog.Close
            aria-label="Cerrar"
            className="focus-ring grid h-9 w-9 flex-none place-items-center rounded-lg text-muted transition-colors hover:bg-brand-soft hover:text-ink"
          >
            <Icon name="x" className="h-5 w-5" />
          </Dialog.Close>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
