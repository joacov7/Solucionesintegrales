"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui";
import { CustomerForm } from "./CustomerForm";

export function NewCustomerSheet() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={buttonVariants({ size: "sm" })}>
        + Nuevo cliente
      </SheetTrigger>
      <SheetContent title="Nuevo cliente" description="Cargá los datos del cliente.">
        <CustomerForm
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
