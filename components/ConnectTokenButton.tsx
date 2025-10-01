import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectTokenDialog } from "@/components/ConnectTokenDialog";

export function ConnectTokenButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Connect with Token
      </Button>
      <ConnectTokenDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
