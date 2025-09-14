"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DialogCtx = React.createContext<{ close: () => void } | null>(null)

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  children: React.ReactNode
}) {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    if (open) window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [open, onOpenChange])

  return (
    <DialogCtx.Provider value={{ close: () => onOpenChange(false) }}>
      <div
        role="dialog"
        aria-modal="true"
        className={cn("fixed inset-0 z-50 grid place-items-center bg-black/40 p-4", open ? "block" : "hidden")}
        onClick={() => onOpenChange(false)}
      >
        <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </DialogCtx.Provider>
  )
}

export function DialogContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn(className)}>{children}</div>
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-2">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
}

export function DialogClose({
  asChild,
  children,
  onClick,
  ...props
}: { asChild?: boolean; children?: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(DialogCtx)
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    ctx?.close?.()
  }
  if (asChild && React.isValidElement(children)) {
    // clone child and inject onClick that closes dialog
    return React.cloneElement(children as React.ReactElement, {
      onClick: (e: React.MouseEvent) => {
        // @ts-expect-error allow if child has its own onClick
        children.props?.onClick?.(e)
        handle(e as any)
      },
    })
  }
  return (
    <button type="button" onClick={handle} {...props}>
      {children ?? "Close"}
    </button>
  )
}

export { DialogFooter, DialogDescription }
