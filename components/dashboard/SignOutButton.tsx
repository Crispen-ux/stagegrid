"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/portal-session", { method: "DELETE" });
    } finally {
      setBusy(false);
      router.replace("/portal/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="btn btn-ghost border border-border px-3 py-1.5 text-[12px]"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
