"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { campaigns } from "@/lib/mock-data";
import { Plus, CalendarDays, Target } from "lucide-react";
import type { Campaign, Platform } from "@/lib/types";

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const statusConfig: Record<
  Campaign["status"],
  { label: string; className: string }
> = {
  active: { label: "Active", className: "bg-green-50 text-green-700 border-green-200" },
  completed: { label: "Completed", className: "bg-blue-50 text-blue-700 border-blue-200" },
  draft: { label: "Draft", className: "bg-gray-50 text-gray-600 border-gray-200" },
  paused: { label: "Paused", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

const platformConfig: Record<Platform, { label: string; colorClass: string; dotClass: string }> = {
  tiktok: { label: "TikTok", colorClass: "text-tiktok", dotClass: "bg-tiktok" },
  instagram: { label: "Instagram", colorClass: "text-instagram", dotClass: "bg-instagram" },
  youtube: { label: "YouTube", colorClass: "text-youtube", dotClass: "bg-youtube" },
  brevo: { label: "Brevo", colorClass: "text-brevo", dotClass: "bg-brevo" },
};

function getProgressColor(progress: number): string {
  if (progress > 66) return "bg-green-500";
  if (progress > 33) return "bg-amber-500";
  return "bg-red-500";
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const status = statusConfig[campaign.status];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header: Name + Status */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-base font-semibold text-navy">{campaign.name}</h3>
        <Badge variant="outline" className={cn("shrink-0 text-xs font-medium", status.className)}>
          {status.label}
        </Badge>
      </div>

      {/* Date range */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
        <CalendarDays className="size-3.5" />
        <span>
          {formatDate(campaign.startDate)} &ndash; {formatDate(campaign.endDate)}
        </span>
      </div>

      {/* Platforms */}
      <div className="flex items-center gap-2 mb-3">
        {campaign.platforms.map((platform) => {
          const pConfig = platformConfig[platform];
          return (
            <span
              key={platform}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-muted",
                pConfig.colorClass
              )}
            >
              <span className={cn("size-1.5 rounded-full", pConfig.dotClass)} />
              {pConfig.label}
            </span>
          );
        })}
      </div>

      {/* Goal */}
      <div className="flex items-start gap-1.5 text-sm text-muted-foreground mb-4">
        <Target className="size-3.5 mt-0.5 shrink-0" />
        <span>{campaign.goal}</span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">Progress</span>
          <span className="text-xs font-semibold text-navy">{campaign.progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", getProgressColor(campaign.progress))}
            style={{ width: `${campaign.progress}%` }}
          />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Reach</p>
          <p className="text-sm font-semibold text-navy">{formatNumber(campaign.metrics.reach)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Engagement</p>
          <p className="text-sm font-semibold text-navy">
            {formatNumber(campaign.metrics.engagement)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Conversions</p>
          <p className="text-sm font-semibold text-navy">
            {formatNumber(campaign.metrics.conversions)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredCampaigns =
    activeTab === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === activeTab);

  return (
    <AppShell title="Campaigns">
      <div className="space-y-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-navy">Campaign Manager</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage your marketing campaigns across platforms.
            </p>
          </div>
          <Button className="bg-navy hover:bg-navy-light">
            <Plus className="size-4" />
            New Campaign
          </Button>
        </div>

        {/* Filter tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All
              <span className="ml-1 text-xs text-muted-foreground">({campaigns.length})</span>
            </TabsTrigger>
            <TabsTrigger value="active">
              Active
              <span className="ml-1 text-xs text-muted-foreground">
                ({campaigns.filter((c) => c.status === "active").length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              <span className="ml-1 text-xs text-muted-foreground">
                ({campaigns.filter((c) => c.status === "completed").length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft
              <span className="ml-1 text-xs text-muted-foreground">
                ({campaigns.filter((c) => c.status === "draft").length})
              </span>
            </TabsTrigger>
          </TabsList>

          {/* All tab content rendered via the same filtered list */}
          {["all", "active", "completed", "draft"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="space-y-4">
                {filteredCampaigns.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <p className="text-muted-foreground">No campaigns found.</p>
                  </div>
                ) : (
                  filteredCampaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppShell>
  );
}
