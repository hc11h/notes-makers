"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Input } from "./input";
import { Button } from "./button";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useRouter } from "next/navigation";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  error?: any;
}

export function ProfileDialog({ open, onOpenChange, userId, error }: ProfileDialogProps) {
  const [token, setToken] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [connectError, setConnectError] = useState("");
  const router = useRouter();

  // Simulate connect logic (replace with real API call)
  async function handleConnect() {
    setConnectError("");
    if (!token) {
      setConnectError("Please enter a token.");
      return;
    }
    try {
      // Replace with real API call to validate token
      if (token.length < 8) throw new Error("Invalid token");
      // On success, close dialog
      onOpenChange(false);
    } catch (e: any) {
      setConnectError("Invalid or expired token.");
      setTimeout(() => router.replace("/error"), 1200);
    }
  }

  // If error from parent, redirect
  if (error) {
    router.replace("/error");
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://google.com";
  const qrUrl = `${baseUrl}/?token=${encodeURIComponent(userId)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Connect Device</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground text-center">
            Your Token ID: <span className="font-mono">{userId}</span>
          </div>
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
          <Button className="w-full" onClick={handleConnect}>
            Connect with Token
          </Button>
          <div className="flex items-center justify-center">
            <span className="text-xs text-muted-foreground">or</span>
          </div>
          {!showQR ? (
            <Button variant="outline" className="w-full" onClick={() => setShowQR(true)}>
              Connect on Mobile
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <QRCodeCanvas value={qrUrl} size={120} />
              <div className="text-xs break-all text-center">{qrUrl}</div>
              <Button variant="ghost" size="sm" onClick={() => setShowQR(false)}>
                Hide QR
              </Button>
            </div>
          )}
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