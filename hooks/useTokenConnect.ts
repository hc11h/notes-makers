import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useTokenConnect() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function connectWithToken(token: string, onSuccess?: (userId: string) => void) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Invalid or expired token.");
        setError(data.error || "Invalid or expired token.");
        setLoading(false);
        return false;
      }
      const data = await res.json();
      sessionStorage.setItem("user_token", token);
      toast.success("Connected!");
      setLoading(false);
      if (onSuccess) onSuccess(data.userId);
      return true;
    } catch (e) {
      toast.error("Server error. Try again.");
      setError("Server error. Try again.");
      setLoading(false);
      return false;
    }
  }

  return { connectWithToken, loading, error };
}
