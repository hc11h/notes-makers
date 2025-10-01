import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTokenConnect } from "@/hooks/useTokenConnect";

interface ConnectTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectTokenDialog({ open, onOpenChange }: ConnectTokenDialogProps) {
  const [token, setToken] = useState("");
  const [connectError, setConnectError] = useState("");
  const { connectWithToken, loading: connectLoading } = useTokenConnect();

  async function handleConnect() {
    setConnectError("");
    if (!token) {
      setConnectError("Please enter a token.");
      return;
    }
    const ok = await connectWithToken(token, () => {
      onOpenChange(false);
    });
    if (!ok) setConnectError("Invalid or expired token.");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Connect Existing Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Enter token to connect"
            value={token}
            onChange={e => setToken(e.target.value)}
            className="w-full"
            aria-label="Token input"
          />
          {connectError && (
            <div className="text-xs text-red-500 text-center">{connectError}</div>
          )}
          <Button className="w-full" onClick={handleConnect} disabled={connectLoading}>
            {connectLoading ? "Connecting..." : "Connect with Token"}
          </Button>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
