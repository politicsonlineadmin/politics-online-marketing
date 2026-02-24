"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PlatformCard } from "@/components/dashboard/platform-card";
import {
  GrowthChart,
  EngagementChart,
  ContentTimeline,
} from "@/components/dashboard/charts";
import {
  tiktokMetrics,
  instagramMetrics,
  youtubeMetrics as mockYoutubeMetrics,
  brevoMetrics as mockBrevoMetrics,
  growthData,
  engagementComparison as mockEngagementComparison,
  contentItems,
} from "@/lib/mock-data";
import type { PlatformMetrics, UniversalMetric } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

interface OverviewData {
  brevo: {
    totalContacts: number;
    avgOpenRate: number;
    avgClickRate: number;
    deliverabilityRate: number;
    campaigns: { id: string; name: string; status: string; sentDate: string; recipients: number; openRate: number; clickRate: number }[];
  } | null;
  youtube: {
    channel: { title: string; subscribers: number; totalViews: number; videoCount: number };
    videos: { id: string; title: string; views: number; likes: number; comments: number; duration: string; publishedAt: string }[];
    summary: { totalVideoViews: number; totalLikes: number; totalComments: number; avgViews: number; topVideo: { title: string; views: number } | null };
  } | null;
}

export default function DashboardPage() {
  const [liveData, setLiveData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveSources, setLiveSources] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/overview")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json: OverviewData) => {
        setLiveData(json);
        const sources: string[] = [];
        if (json.youtube) sources.push("YouTube");
        if (json.brevo) sources.push("Brevo");
        setLiveSources(sources);
      })
      .catch(() => {
        setLiveData(null);
        setLiveSources([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Build platform metrics — merge live data where available
  const ytLive = liveData?.youtube;
  const brevoLive = liveData?.brevo;

  const youtubeMetrics: PlatformMetrics = ytLive
    ? {
        platform: "youtube",
        followers: ytLive.channel.subscribers,
        followerGrowth: 0,
        engagement: ytLive.channel.totalViews > 0 && ytLive.summary.totalLikes > 0
          ? Math.round((ytLive.summary.totalLikes / ytLive.channel.totalViews) * 1000) / 10
          : 0,
        engagementChange: 0,
        views: ytLive.channel.totalViews,
        viewsChange: 0,
        topContentTitle: ytLive.summary.topVideo?.title || "—",
        topContentMetric: ytLive.summary.topVideo
          ? `${formatNumber(ytLive.summary.topVideo.views)} views`
          : "—",
        sparklineData: mockYoutubeMetrics.sparklineData,
      }
    : mockYoutubeMetrics;

  const brevoMetrics: PlatformMetrics = brevoLive
    ? {
        platform: "brevo",
        followers: brevoLive.totalContacts,
        followerGrowth: 0,
        engagement: brevoLive.avgOpenRate,
        engagementChange: 0,
        views: 0,
        viewsChange: 0,
        topContentTitle: brevoLive.campaigns.find((c) => c.status === "sent")?.name || "—",
        topContentMetric: `${brevoLive.avgOpenRate}% open rate`,
        sparklineData: mockBrevoMetrics.sparklineData,
      }
    : mockBrevoMetrics;

  // Build universal metrics from real + mock data
  const totalFollowers =
    tiktokMetrics.followers +
    instagramMetrics.followers +
    youtubeMetrics.followers +
    brevoMetrics.followers;

  const totalViews =
    tiktokMetrics.views +
    instagramMetrics.views +
    youtubeMetrics.views;

  const avgEngagement =
    Math.round(
      ((tiktokMetrics.engagement +
        instagramMetrics.engagement +
        youtubeMetrics.engagement) /
        3) *
        10
    ) / 10;

  const sentCampaigns = brevoLive
    ? brevoLive.campaigns.filter((c) => c.status === "sent").length
    : 5;

  const universalMetrics: UniversalMetric[] = [
    { label: "Total Followers", value: formatNumber(totalFollowers), change: 0, trend: "up" },
    { label: "Total Views", value: formatNumber(totalViews), change: 0, trend: "up" },
    { label: "Avg Engagement", value: `${avgEngagement}%`, change: 0, trend: "up" },
    { label: "YouTube Videos", value: ytLive ? String(ytLive.channel.videoCount) : String(mockYoutubeMetrics.views), change: 0, trend: "up" },
    { label: "Email Subscribers", value: formatNumber(brevoMetrics.followers), change: 0, trend: "up" },
    { label: "Email Campaigns", value: String(sentCampaigns), change: 0, trend: "up" },
  ];

  // Build engagement comparison with real data where available
  const engagementComparison = [
    { platform: "TikTok", engagement: tiktokMetrics.engagement, benchmark: 4.2 },
    { platform: "Instagram", engagement: instagramMetrics.engagement, benchmark: 3.1 },
    { platform: "YouTube", engagement: youtubeMetrics.engagement, benchmark: 2.8 },
    { platform: "Brevo", engagement: brevoMetrics.engagement, benchmark: 18.0 },
  ];

  if (loading) {
    return (
      <AppShell title="Dashboard">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-navy" />
          <span className="ml-3 text-muted-foreground">Loading dashboard...</span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        {/* Data source indicator */}
        <div className="flex items-center gap-2">
          {liveSources.length > 0 ? (
            <>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">
                Live data: {liveSources.join(", ")} — Mock data: TikTok, Instagram
              </span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">
                Showing mock data — no live APIs connected
              </span>
            </>
          )}
        </div>

        {/* Universal metrics row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {universalMetrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              change={metric.change}
              trend={metric.trend}
            />
          ))}
        </div>

        {/* Platform cards 2x2 */}
        <div className="grid gap-4 md:grid-cols-2">
          <PlatformCard metrics={tiktokMetrics} />
          <PlatformCard metrics={instagramMetrics} />
          <PlatformCard metrics={youtubeMetrics} />
          <PlatformCard metrics={brevoMetrics} />
        </div>

        {/* Charts section */}
        <div className="grid gap-4 lg:grid-cols-2">
          <GrowthChart data={growthData} />
          <EngagementChart data={engagementComparison} />
        </div>

        {/* Content timeline */}
        <ContentTimeline items={contentItems} />
      </div>
    </AppShell>
  );
}
