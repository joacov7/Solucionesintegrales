"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui";
import { InstallerForm } from "./InstallerForm";

export function NewInstallerSheet() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={buttonVariants({ size: "sm" })}>
        + Nuevo instalador
      </SheetTrigger>
      <SheetContent title="Nuevo instalador" description="Sumá un técnico al equipo.">
        <InstallerForm
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
