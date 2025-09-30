"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ErrorScreen({ error, onRetry }: { error: string, onRetry: () => void }) {
  return (
    <Dialog open>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>{error}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onRetry}>Create New Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}