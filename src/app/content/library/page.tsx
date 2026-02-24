"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Platform } from "@/lib/types";
import {
  Search,
  Upload,
  Image,
  Video,
  FileText,
  File,
  MoreVertical,
  Download,
  Trash2,
  Copy,
  Grid3X3,
  LayoutList,
  FolderOpen,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface MockAsset {
  id: string;
  filename: string;
  type: "image" | "video" | "document";
  size: string;
  date: string;
  platforms: Platform[];
  color: string;
}

const mockAssets: MockAsset[] = [
  { id: "a1", filename: "parliament-thumbnail.jpg", type: "image", size: "2.4 MB", date: "2026-02-20", platforms: ["tiktok", "youtube"], color: "from-blue-400 to-indigo-500" },
  { id: "a2", filename: "constitution-explainer.mp4", type: "video", size: "48.2 MB", date: "2026-02-19", platforms: ["instagram"], color: "from-purple-400 to-pink-500" },
  { id: "a3", filename: "electoral-systems-slides.pdf", type: "document", size: "1.8 MB", date: "2026-02-18", platforms: ["youtube"], color: "from-amber-400 to-orange-500" },
  { id: "a4", filename: "pm-vs-president-cover.png", type: "image", size: "1.2 MB", date: "2026-02-17", platforms: ["tiktok"], color: "from-teal-400 to-cyan-500" },
  { id: "a5", filename: "supreme-court-carousel-1.jpg", type: "image", size: "3.1 MB", date: "2026-02-16", platforms: ["instagram"], color: "from-rose-400 to-red-500" },
  { id: "a6", filename: "fptp-vs-pr-animation.mp4", type: "video", size: "72.5 MB", date: "2026-02-15", platforms: ["tiktok", "instagram"], color: "from-green-400 to-emerald-500" },
  { id: "a7", filename: "quiz-background-template.png", type: "image", size: "890 KB", date: "2026-02-14", platforms: ["instagram"], color: "from-violet-400 to-purple-500" },
  { id: "a8", filename: "revision-checklist.pdf", type: "document", size: "420 KB", date: "2026-02-13", platforms: ["brevo"], color: "from-gray-400 to-slate-500" },
  { id: "a9", filename: "devolution-map-graphic.png", type: "image", size: "4.6 MB", date: "2026-02-12", platforms: ["tiktok", "instagram", "youtube"], color: "from-sky-400 to-blue-500" },
  { id: "a10", filename: "weekly-digest-banner.jpg", type: "image", size: "1.5 MB", date: "2026-02-11", platforms: ["brevo"], color: "from-emerald-400 to-teal-500" },
  { id: "a11", filename: "judiciary-explained-b-roll.mp4", type: "video", size: "156.3 MB", date: "2026-02-10", platforms: ["youtube"], color: "from-orange-400 to-amber-500" },
  { id: "a12", filename: "brand-logo-pack.zip", type: "document", size: "8.2 MB", date: "2026-02-09", platforms: ["tiktok", "instagram", "youtube", "brevo"], color: "from-navy to-navy-light" },
];

const typeIcons: Record<string, React.ReactNode> = {
  image: <Image className="h-8 w-8" />,
  video: <Video className="h-8 w-8" />,
  document: <FileText className="h-8 w-8" />,
};

const typeIconsSmall: Record<string, React.ReactNode> = {
  image: <Image className="h-3.5 w-3.5" />,
  video: <Video className="h-3.5 w-3.5" />,
  document: <FileText className="h-3.5 w-3.5" />,
};

const platformDotColor: Record<Platform, string> = {
  tiktok: "bg-tiktok",
  instagram: "bg-instagram",
  youtube: "bg-youtube",
  brevo: "bg-brevo",
};

export default function MediaLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video" | "document">("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredAssets = mockAssets
    .filter((asset) => {
      const matchesSearch = asset.filename
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || asset.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "name") return a.filename.localeCompare(b.filename);
      if (sortBy === "size") {
        const parseSize = (s: string) => {
          const num = parseFloat(s);
          if (s.includes("GB")) return num * 1000;
          if (s.includes("MB")) return num;
          if (s.includes("KB")) return num / 1000;
          return num;
        };
        return parseSize(b.size) - parseSize(a.size);
      }
      return 0;
    });

  const typeCounts = {
    all: mockAssets.length,
    image: mockAssets.filter((a) => a.type === "image").length,
    video: mockAssets.filter((a) => a.type === "video").length,
    document: mockAssets.filter((a) => a.type === "document").length,
  };

  return (
    <AppShell title="Media Library">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className="pl-9 text-sm"
              />
            </div>

            {/* Type filter buttons */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "image", label: "Images" },
                  { id: "video", label: "Videos" },
                  { id: "document", label: "Docs" },
                ] as const
              ).map((type) => (
                <button
                  key={type.id}
                  onClick={() => setTypeFilter(type.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    typeFilter === type.id
                      ? "bg-navy text-white"
                      : "bg-white text-muted-foreground hover:bg-muted"
                  )}
                >
                  {type.label}
                  <span className="ml-1 opacity-60">{typeCounts[type.id]}</span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="size">Largest first</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 transition-colors",
                  viewMode === "grid"
                    ? "bg-navy text-white"
                    : "bg-white text-muted-foreground hover:bg-muted"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 transition-colors",
                  viewMode === "list"
                    ? "bg-navy text-white"
                    : "bg-white text-muted-foreground hover:bg-muted"
                )}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>

            <Button size="sm" className="bg-navy hover:bg-navy-light text-white">
              <Upload className="h-4 w-4 mr-1.5" />
              Upload
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span>
            <strong className="text-navy">{filteredAssets.length}</strong> assets
          </span>
          <span>
            <strong className="text-navy">{typeCounts.image}</strong> images
          </span>
          <span>
            <strong className="text-navy">{typeCounts.video}</strong> videos
          </span>
          <span>
            <strong className="text-navy">{typeCounts.document}</strong> documents
          </span>
        </div>

        {/* Asset grid or list */}
        {filteredAssets.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-white rounded-xl shadow-sm border border-border/50 overflow-hidden group hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div
                    className={cn(
                      "h-36 bg-gradient-to-br flex items-center justify-center relative",
                      asset.color
                    )}
                  >
                    <div className="text-white/80">{typeIcons[asset.type]}</div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-navy-dark/0 group-hover:bg-navy-dark/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button className="bg-white/90 rounded-lg p-2 hover:bg-white transition-colors">
                        <Download className="h-4 w-4 text-navy" />
                      </button>
                      <button className="bg-white/90 rounded-lg p-2 hover:bg-white transition-colors">
                        <Copy className="h-4 w-4 text-navy" />
                      </button>
                      <button className="bg-white/90 rounded-lg p-2 hover:bg-white transition-colors">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>

                    {/* Type badge */}
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 text-[9px] bg-white/90 text-navy capitalize gap-0.5"
                    >
                      {typeIconsSmall[asset.type]}
                      {asset.type}
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <p
                      className="text-xs font-medium text-navy truncate"
                      title={asset.filename}
                    >
                      {asset.filename}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        {asset.size}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {format(parseISO(asset.date), "d MMM")}
                      </span>
                    </div>

                    {/* Platform tags */}
                    <div className="flex items-center gap-1">
                      {asset.platforms.map((platform) => (
                        <div
                          key={platform}
                          className={cn(
                            "h-2 w-2 rounded-full",
                            platformDotColor[platform]
                          )}
                          title={platform}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List view */
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">
                      Platforms
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-9 w-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0",
                              asset.color
                            )}
                          >
                            <span className="text-white/80 scale-75">
                              {typeIconsSmall[asset.type]}
                            </span>
                          </div>
                          <span className="font-medium text-navy text-xs truncate max-w-[200px]">
                            {asset.filename}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className="text-[10px] capitalize gap-0.5"
                        >
                          {typeIconsSmall[asset.type]}
                          {asset.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {asset.size}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {format(parseISO(asset.date), "d MMM yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {asset.platforms.map((platform) => (
                            <div
                              key={platform}
                              className={cn(
                                "h-2 w-2 rounded-full",
                                platformDotColor[platform]
                              )}
                              title={platform}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded hover:bg-muted transition-colors">
                            <Download className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-muted transition-colors">
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-destructive/10 transition-colors">
                            <Trash2 className="h-3.5 w-3.5 text-destructive/60" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Empty state */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-navy mb-1">
              No assets found
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : "No assets match the current filters."}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
