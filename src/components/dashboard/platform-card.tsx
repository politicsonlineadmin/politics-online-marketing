"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PlatformMetrics, Platform } from "@/lib/types";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const platformConfig: Record<
  Platform,
  { label: string; color: string; borderClass: string; dotClass: string }
> = {
  tiktok: {
    label: "TikTok",
    color: "#00F2EA",
    borderClass: "border-l-tiktok",
    dotClass: "bg-tiktok",
  },
  instagram: {
    label: "Instagram",
    color: "#E4405F",
    borderClass: "border-l-instagram",
    dotClass: "bg-instagram",
  },
  youtube: {
    label: "YouTube",
    color: "#FF0000",
    borderClass: "border-l-youtube",
    dotClass: "bg-youtube",
  },
  brevo: {
    label: "Brevo",
    color: "#0B996E",
    borderClass: "border-l-brevo",
    dotClass: "bg-brevo",
  },
};

interface PlatformCardProps {
  metrics: PlatformMetrics;
  className?: string;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function PlatformCard({ metrics, className }: PlatformCardProps) {
  const config = platformConfig[metrics.platform];

  return (
    <Card
      className={cn(
        "border-l-4 py-4",
        config.borderClass,
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={cn("h-2.5 w-2.5 rounded-full", config.dotClass)} />
          <CardTitle className="text-sm font-semibold">{config.label}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-muted-foreground text-xs">Followers</p>
            <p className="text-lg font-bold text-navy">
              {formatNumber(metrics.followers)}
            </p>
            <p
              className={cn(
                "text-xs font-medium",
                metrics.followerGrowth >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              )}
            >
              {metrics.followerGrowth >= 0 ? "+" : ""}
              {metrics.followerGrowth}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Engagement</p>
            <p className="text-lg font-bold text-navy">
              {metrics.engagement}%
            </p>
            <p
              className={cn(
                "text-xs font-medium",
                metrics.engagementChange >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              )}
            >
              {metrics.engagementChange >= 0 ? "+" : ""}
              {metrics.engagementChange}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Views</p>
            <p className="text-lg font-bold text-navy">
              {metrics.views > 0 ? formatNumber(metrics.views) : "N/A"}
            </p>
            {metrics.views > 0 && (
              <p
                className={cn(
                  "text-xs font-medium",
                  metrics.viewsChange >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                )}
              >
                {metrics.viewsChange >= 0 ? "+" : ""}
                {metrics.viewsChange}%
              </p>
            )}
          </div>
        </div>

        {/* Top content */}
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="text-muted-foreground text-xs">Top Content</p>
          <p className="truncate text-sm font-medium text-navy">
            {metrics.topContentTitle}
          </p>
          <p className="text-xs font-medium" style={{ color: config.color }}>
            {metrics.topContentMetric}
          </p>
        </div>

        {/* Sparkline */}
        {metrics.sparklineData.length > 0 && (
          <div className="h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.sparklineData}>
                <defs>
                  <linearGradient
                    id={`platform-spark-${metrics.platform}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={config.color}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor={config.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={1.5}
                  fill={`url(#platform-spark-${metrics.platform})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
