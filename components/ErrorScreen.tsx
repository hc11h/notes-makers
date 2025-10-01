"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ConnectTokenButton } from "@/components/ConnectTokenButton";

export default function ErrorScreen({ error, onRetry }: { error: string, onRetry: () => void }) {
  return (
    <Dialog open>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>{error}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <ConnectTokenButton />
          <Button onClick={onRetry} variant="secondary">Create New Account</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}