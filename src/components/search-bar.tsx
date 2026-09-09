"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useCallback } from "react";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  /** If true, navigate to /search?q=... on submit */
  navigateOnSubmit?: boolean;
  /** Callback for debounced search value changes */
  onSearchChange?: (query: string) => void;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Search articles...",
  navigateOnSubmit = true,
  onSearchChange,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (onSearchChange) {
        // Debounce the callback
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onSearchChange(value);
        }, 300);
      }
    },
    [onSearchChange]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value?.trim();
    if (navigateOnSubmit && value) {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={handleChange}
        className="h-11 rounded-xl border-border/50 bg-accent/30 pl-10 pr-16 text-sm backdrop-blur-sm transition-colors focus:border-indigo-500/50 focus:bg-accent/50"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border/50 bg-accent/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:block">
        ⌘K
      </kbd>
    </form>
  );
}
