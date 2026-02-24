"use client";

import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Topbar({ title }: { title: string }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <h1 className="font-heading text-lg font-bold text-navy">{title}</h1>
      <div className="flex items-center gap-3">
        {/* Search placeholder */}
        <button className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="ml-2 rounded bg-white px-1.5 py-0.5 text-[10px] font-mono border">
            Ctrl+K
          </kbd>
        </button>
        {/* Refresh */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
          PO
        </div>
      </div>
    </header>
  );
}
