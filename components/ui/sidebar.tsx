"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useSession";
import { Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SideBar({ onAdd }: { onAdd: () => void }) {
  const { userId, error, loading } = useUser();
  const router = useRouter();

  function handleProfileClick() {
    alert(`User ID: ${userId}`);
  }

  // ✅ Redirect handled safely in useEffect
  useEffect(() => {
    if (error) {
      router.replace("/error");
    }
  }, [error, router]);

  // Don't render anything during loading or error
  if (loading || error) return null;

  return (
    <aside
      className="hidden h-dvh shrink-0 border-r border-sidebar-border bg-sidebar p-3 md:flex md:w-16 md:flex-col md:items-center md:pt-4"
      aria-label="Sidebar"
    >
      <Button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary p-0 text-primary-foreground shadow hover:bg-primary/90"
        aria-label="Add note"
        onClick={onAdd}
      >
        <Plus className="h-5 w-5" />
      </Button>
      <br />
      <Button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary p-0 text-primary-foreground shadow hover:bg-primary/90"
        aria-label="Profile"
        onClick={handleProfileClick}
      >
        <User className="h-5 w-5" />
      </Button>
      <span className="mt-2 text-xs text-muted-foreground break-all text-center">
        {userId?.slice(0, 8)}
      </span>
    </aside>
  );
}
