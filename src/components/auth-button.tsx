"use client";

import { Button } from "./ui/button";
import { LogOut, UserCircle } from "lucide-react";
import Image from "next/image";
import { handleSignIn, handleSignOut } from "@/lib/actions";

interface AuthButtonProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AuthButton({ user }: AuthButtonProps) {
  if (!user) {
    return (
      <form action={handleSignIn}>
        <Button type="submit" variant="default" size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <UserCircle className="h-4 w-4" />
          Sign In
        </Button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={32}
            height={32}
            className="rounded-full border border-border"
          />
        )}
        <span className="text-sm font-medium hidden sm:inline-block">
          {user.name}
        </span>
      </div>
      <form action={handleSignOut}>
        <Button type="submit" variant="ghost" size="icon" title="Sign Out">
          <LogOut className="h-4 w-4 text-muted-foreground" />
        </Button>
      </form>
    </div>
  );
}
