"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

/** Notificaciones tipo toast, con estilo acorde al design system. */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border !border-line !bg-surface !text-ink !shadow-pop",
          description: "!text-muted",
          actionButton: "!bg-brand !text-brand-fg",
          cancelButton: "!bg-brand-soft !text-ink",
        },
      }}
    />
  );
}

export { toast };
