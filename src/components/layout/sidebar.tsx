"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  LayoutDashboard,
  Calendar,
  PenSquare,
  FileText,
  ImageIcon,
  Megaphone,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const platformItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "TikTok", href: "/tiktok", icon: BarChart3, color: "text-tiktok" },
  { label: "Instagram", href: "/instagram", icon: BarChart3, color: "text-instagram" },
  { label: "YouTube", href: "/youtube", icon: BarChart3, color: "text-youtube" },
  { label: "Brevo", href: "/brevo", icon: BarChart3, color: "text-brevo" },
];

const contentItems = [
  { label: "Calendar", href: "/content/calendar", icon: Calendar },
  { label: "New Post", href: "/content/new", icon: PenSquare },
  { label: "Drafts", href: "/content/drafts", icon: FileText },
  { label: "Library", href: "/content/library", icon: ImageIcon },
];

const manageItems = [
  { label: "Campaigns", href: "/campaigns", icon: Megaphone },
  { label: "Audience", href: "/audience", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const NavItem = ({ item }: { item: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; color?: string } }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-gold/15 text-gold border-l-2 border-gold"
            : "text-white/60 hover:bg-white/5 hover:text-white/90",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", item.color && active ? item.color : "")} />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const SectionLabel = ({ label }: { label: string }) => {
    if (collapsed) return <div className="my-2 border-t border-white/10" />;
    return (
      <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
        {label}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-navy text-white transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2 border-b border-white/10 px-4 py-4", collapsed && "justify-center px-2")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold text-navy font-bold text-sm">
          PO
        </div>
        {!collapsed && (
          <span className="font-heading text-sm font-bold tracking-tight">
            Politics Online
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        <SectionLabel label="Dashboard" />
        {platformItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}

        <SectionLabel label="Content" />
        {contentItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}

        <SectionLabel label="Manage" />
        {manageItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center border-t border-white/10 py-3 text-white/40 hover:text-white/80 transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
