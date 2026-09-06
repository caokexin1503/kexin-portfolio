"use client";

import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="focus-ring flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-foreground"
    >
      <LogOutIcon className="h-4 w-4" />
      Sign Out
    </button>
  );
}
