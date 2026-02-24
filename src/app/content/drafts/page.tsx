"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { contentItems } from "@/lib/mock-data";
import type { Platform } from "@/lib/types";
import {
  Pencil,
  Trash2,
  CalendarClock,
  FileText,
  Film,
  Images,
  Layers,
  Mail,
  Camera,
  InboxIcon,
} from "lucide-react";
import { format, parseISO } from "date-fns";

const platformFilters: { id: Platform | "all"; label: string; color: string; activeColor: string }[] = [
  { id: "all", label: "All Platforms", color: "text-muted-foreground", activeColor: "bg-navy text-white" },
  { id: "tiktok", label: "TikTok", color: "text-muted-foreground", activeColor: "bg-tiktok text-navy-dark" },
  { id: "instagram", label: "Instagram", color: "text-muted-foreground", activeColor: "bg-instagram text-white" },
  { id: "youtube", label: "YouTube", color: "text-muted-foreground", activeColor: "bg-youtube text-white" },
  { id: "brevo", label: "Brevo", color: "text-muted-foreground", activeColor: "bg-brevo text-white" },
];

const platformBadgeColor: Record<Platform, string> = {
  tiktok: "bg-tiktok/15 text-navy-dark border-tiktok/30",
  instagram: "bg-instagram/15 text-instagram border-instagram/30",
  youtube: "bg-youtube/15 text-youtube border-youtube/30",
  brevo: "bg-brevo/15 text-brevo border-brevo/30",
};

const typeIcons: Record<string, React.ReactNode> = {
  video: <Film className="h-3.5 w-3.5" />,
  image: <Camera className="h-3.5 w-3.5" />,
  carousel: <Images className="h-3.5 w-3.5" />,
  reel: <Film className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  story: <Layers className="h-3.5 w-3.5" />,
};

export default function DraftsPage() {
  const [activeFilter, setActiveFilter] = useState<Platform | "all">("all");

  const drafts = contentItems.filter((item) => item.status === "draft");
  const filteredDrafts =
    activeFilter === "all"
      ? drafts
      : drafts.filter((item) => item.platform === activeFilter);

  return (
    <AppShell title="Drafts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {drafts.length} draft{drafts.length !== 1 ? "s" : ""} awaiting review
            </p>
          </div>
          <Button size="sm" className="bg-navy hover:bg-navy-light text-white">
            <FileText className="h-4 w-4 mr-1.5" />
            New Draft
          </Button>
        </div>

        {/* Platform filter */}
        <div className="flex flex-wrap gap-2">
          {platformFilters.map((filter) => {
            const isActive = activeFilter === filter.id;
            const count =
              filter.id === "all"
                ? drafts.length
                : drafts.filter((d) => d.platform === filter.id).length;

            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all border",
                  isActive
                    ? cn(filter.activeColor, "border-transparent shadow-sm")
                    : "border-border bg-white hover:bg-muted/50"
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center",
                    isActive ? "bg-white/20" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Drafts list */}
        {filteredDrafts.length > 0 ? (
          <div className="space-y-3">
            {filteredDrafts.map((draft) => (
              <Card
                key={draft.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: thumbnail placeholder + info */}
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Thumbnail placeholder */}
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shrink-0">
                        <span className="text-muted-foreground">
                          {typeIcons[draft.type] || (
                            <FileText className="h-5 w-5" />
                          )}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 space-y-1.5">
                        <h3 className="text-sm font-semibold text-navy truncate">
                          {draft.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Platform badge */}
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] capitalize",
                              platformBadgeColor[draft.platform]
                            )}
                          >
                            {draft.platform}
                          </Badge>

                          {/* Type badge */}
                          <Badge
                            variant="secondary"
                            className="text-[10px] capitalize gap-1"
                          >
                            {typeIcons[draft.type]}
                            {draft.type}
                          </Badge>

                          {/* Status badge */}
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-amber-50 text-amber-700 border-amber-200"
                          >
                            Draft
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Last edited{" "}
                          {format(parseISO(draft.date), "d MMM yyyy")}
                        </p>
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 text-navy"
                      >
                        <CalendarClock className="h-3.5 w-3.5 mr-1" />
                        Schedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <InboxIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-navy mb-1">
              No drafts found
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {activeFilter === "all"
                ? "You don't have any drafts yet. Create your first post!"
                : `No drafts for ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}. Try a different platform filter.`}
            </p>
            <Button size="sm" className="bg-navy hover:bg-navy-light text-white">
              <FileText className="h-4 w-4 mr-1.5" />
              Create New Post
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
