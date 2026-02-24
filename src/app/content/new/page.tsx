"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Platform } from "@/lib/types";
import {
  Bold,
  Italic,
  Link,
  Smile,
  Upload,
  Image,
  Video,
  Music,
  Hash,
  Clock,
  Send,
  Save,
  Smartphone,
  Type,
  AlignLeft,
  List,
  AtSign,
} from "lucide-react";

const platforms: { id: Platform; label: string; color: string; activeColor: string; icon: string }[] = [
  { id: "tiktok", label: "TikTok", color: "border-tiktok/30 text-muted-foreground", activeColor: "bg-tiktok/10 border-tiktok text-navy-dark ring-2 ring-tiktok/20", icon: "TT" },
  { id: "instagram", label: "Instagram", color: "border-instagram/30 text-muted-foreground", activeColor: "bg-instagram/10 border-instagram text-instagram ring-2 ring-instagram/20", icon: "IG" },
  { id: "youtube", label: "YouTube", color: "border-youtube/30 text-muted-foreground", activeColor: "bg-youtube/10 border-youtube text-youtube ring-2 ring-youtube/20", icon: "YT" },
  { id: "brevo", label: "Brevo", color: "border-brevo/30 text-muted-foreground", activeColor: "bg-brevo/10 border-brevo text-brevo ring-2 ring-brevo/20", icon: "BR" },
];

const platformDotColor: Record<Platform, string> = {
  tiktok: "bg-tiktok",
  instagram: "bg-instagram",
  youtube: "bg-youtube",
  brevo: "bg-brevo",
};

export default function NewPostPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["tiktok"]);
  const [content, setContent] = useState("");
  const [scheduleDate, setScheduleDate] = useState("2026-02-26");
  const [scheduleTime, setScheduleTime] = useState("18:00");

  // Per-platform state
  const [igPostType, setIgPostType] = useState("feed");
  const [ytTitle, setYtTitle] = useState("");
  const [ytDescription, setYtDescription] = useState("");
  const [ytTags, setYtTags] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailPreview, setEmailPreview] = useState("");

  function togglePlatform(platform: Platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  }

  const charCount = content.length;
  const maxChars = selectedPlatforms.includes("tiktok") ? 2200 : 2200;

  return (
    <AppShell title="New Post">
      <div className="flex gap-6 h-full">
        {/* Left column - Editor */}
        <div className="flex-1 space-y-5 min-w-0">
          {/* Platform selector */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="text-sm font-semibold text-navy mb-3 block">
              Select Platforms
            </label>
            <div className="flex flex-wrap gap-3">
              {platforms.map((platform) => {
                const isActive = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all",
                      isActive ? platform.activeColor : platform.color,
                      "hover:shadow-sm"
                    )}
                  >
                    <div
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        platformDotColor[platform.id]
                      )}
                    />
                    {platform.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text editor */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="text-sm font-semibold text-navy mb-3 block">
              Content
            </label>

            {/* Toolbar */}
            <div className="flex items-center gap-1 border border-border rounded-t-lg px-2 py-1.5 bg-muted/30">
              <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Bold">
                <Bold className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Italic">
                <Italic className="h-4 w-4 text-muted-foreground" />
              </button>
              <Separator orientation="vertical" className="h-5 mx-1" />
              <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Link">
                <Link className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Mention">
                <AtSign className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Hashtag">
                <Hash className="h-4 w-4 text-muted-foreground" />
              </button>
              <Separator orientation="vertical" className="h-5 mx-1" />
              <button className="p-1.5 rounded hover:bg-muted transition-colors" title="Emoji">
                <Smile className="h-4 w-4 text-muted-foreground" />
              </button>
              <div className="ml-auto text-xs text-muted-foreground">
                {charCount} / {maxChars}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              className="w-full border border-t-0 border-border rounded-b-lg p-4 text-sm min-h-[180px] resize-y focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/30 placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Media upload zone */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="text-sm font-semibold text-navy mb-3 block">
              Media
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-navy/30 hover:bg-muted/10 transition-colors cursor-pointer">
              <div className="bg-muted/50 rounded-full p-3 mb-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-navy mb-1">
                Drag media here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                Supports images, videos, and GIFs up to 100MB
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="text-[10px]">
                  <Image className="h-3 w-3 mr-1" />
                  JPG, PNG, GIF
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  <Video className="h-3 w-3 mr-1" />
                  MP4, MOV
                </Badge>
              </div>
            </div>
          </div>

          {/* Per-platform config */}
          {selectedPlatforms.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="text-sm font-semibold text-navy mb-4 block">
                Platform Settings
              </label>

              <div className="space-y-5">
                {selectedPlatforms.includes("tiktok") && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-tiktok" />
                      <span className="text-sm font-semibold text-navy">TikTok</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pl-5">
                      <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/30 transition-colors">
                        <Music className="h-4 w-4 text-tiktok" />
                        Add Sounds
                      </button>
                      <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/30 transition-colors">
                        <Image className="h-4 w-4 text-tiktok" />
                        Cover Image
                      </button>
                    </div>
                  </div>
                )}

                {selectedPlatforms.includes("instagram") && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-instagram" />
                      <span className="text-sm font-semibold text-navy">Instagram</span>
                    </div>
                    <div className="pl-5">
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        Post Type
                      </label>
                      <div className="flex gap-2">
                        {["feed", "reel", "story"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setIgPostType(type)}
                            className={cn(
                              "rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition-all",
                              igPostType === type
                                ? "border-instagram bg-instagram/10 text-instagram"
                                : "border-border text-muted-foreground hover:bg-muted/30"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlatforms.includes("youtube") && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-youtube" />
                      <span className="text-sm font-semibold text-navy">YouTube</span>
                    </div>
                    <div className="space-y-3 pl-5">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Video Title
                        </label>
                        <Input
                          value={ytTitle}
                          onChange={(e) => setYtTitle(e.target.value)}
                          placeholder="Enter YouTube title..."
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Description
                        </label>
                        <textarea
                          value={ytDescription}
                          onChange={(e) => setYtDescription(e.target.value)}
                          placeholder="Video description..."
                          className="w-full border border-border rounded-lg p-3 text-sm min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-navy/20"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Tags
                        </label>
                        <Input
                          value={ytTags}
                          onChange={(e) => setYtTags(e.target.value)}
                          placeholder="politics, a-level, education..."
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlatforms.includes("brevo") && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-brevo" />
                      <span className="text-sm font-semibold text-navy">Brevo</span>
                    </div>
                    <div className="space-y-3 pl-5">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Subject Line
                        </label>
                        <Input
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Email subject line..."
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Preview Text
                        </label>
                        <Input
                          value={emailPreview}
                          onChange={(e) => setEmailPreview(e.target.value)}
                          placeholder="Text shown in inbox preview..."
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Preview & Schedule */}
        <div className="w-[350px] shrink-0 space-y-5">
          {/* Phone mockup preview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="text-sm font-semibold text-navy mb-3 block">
              Preview
            </label>
            <div className="mx-auto w-[280px]">
              {/* Phone frame */}
              <div className="relative bg-navy-dark rounded-[2rem] p-2 shadow-xl">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-navy-dark rounded-b-2xl z-10" />

                {/* Screen */}
                <div className="bg-white rounded-[1.5rem] overflow-hidden min-h-[420px]">
                  {/* Status bar */}
                  <div className="bg-navy/5 px-4 py-2 flex items-center justify-between">
                    <span className="text-[9px] font-semibold text-navy">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-1.5 bg-navy/40 rounded-sm" />
                      <div className="w-3 h-1.5 bg-navy/40 rounded-sm" />
                      <div className="w-4 h-1.5 bg-navy/40 rounded-sm" />
                    </div>
                  </div>

                  {/* Platform header */}
                  <div className="px-3 py-2 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-navy flex items-center justify-center">
                        <span className="text-[8px] font-bold text-gold">PO</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-navy leading-tight">
                          Politics Online
                        </p>
                        <p className="text-[8px] text-muted-foreground">
                          {selectedPlatforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ") || "Select platform"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content preview */}
                  <div className="p-3">
                    {/* Media placeholder */}
                    <div className="bg-gradient-to-br from-navy/5 to-navy/10 rounded-lg h-40 flex items-center justify-center mb-3">
                      <div className="text-center">
                        <Smartphone className="h-8 w-8 text-navy/20 mx-auto mb-1" />
                        <span className="text-[9px] text-muted-foreground">Media preview</span>
                      </div>
                    </div>

                    {/* Text preview */}
                    <p className="text-[10px] text-navy leading-relaxed">
                      {content || (
                        <span className="text-muted-foreground italic">
                          Your post content will appear here...
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Engagement bar mockup */}
                  <div className="px-3 py-2 border-t border-border/50 mt-auto">
                    <div className="flex items-center gap-4 text-[9px] text-muted-foreground">
                      <span>&#9825; Like</span>
                      <span>&#128172; Comment</span>
                      <span>&#8618; Share</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="text-sm font-semibold text-navy mb-3 block">
              <Clock className="h-4 w-4 inline mr-1.5 -mt-0.5" />
              Schedule
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Date
                </label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Time
                </label>
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="text-sm"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Scheduled for {scheduleDate} at {scheduleTime}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <Button className="w-full bg-navy hover:bg-navy-light text-white">
              <Send className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
            <Button variant="outline" className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
