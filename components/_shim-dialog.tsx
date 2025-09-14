"use client"

export function Dialog({ open, onOpenChange, children }: any) {
  return open ? (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      {children}
    </div>
  ) : null
}
export function DialogTrigger({ children }: any) {
  return children
}
export function DialogContent({ className = "", children }: any) {
  return <div className={`mx-4 w-full max-w-lg rounded-2xl bg-card p-4 shadow-xl ${className}`}>{children}</div>
}
export function DialogHeader({ children }: any) {
  return <div className="mb-2">{children}</div>
}
export function DialogFooter({ children, className = "" }: any) {
  return <div className={`mt-4 flex justify-end gap-2 ${className}`}>{children}</div>
}
export function DialogTitle({ children }: any) {
  return <h2 className="text-lg font-semibold">{children}</h2>
}
export function DialogClose({ asChild, children }: any) {
  return children
}
