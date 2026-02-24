"use client";

import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PlatformCard } from "@/components/dashboard/platform-card";
import {
  GrowthChart,
  EngagementChart,
  ContentTimeline,
} from "@/components/dashboard/charts";
import {
  universalMetrics,
  tiktokMetrics,
  instagramMetrics,
  youtubeMetrics,
  brevoMetrics,
  growthData,
  engagementComparison,
  contentItems,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
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
