"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TimeSeriesPoint, ContentItem, Platform } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Growth Chart - Multi-line follower growth across 4 platforms        */
/* ------------------------------------------------------------------ */

interface GrowthChartProps {
  data: Record<Platform, TimeSeriesPoint[]>;
}

export function GrowthChart({ data }: GrowthChartProps) {
  // Merge all platform data by date
  const merged = data.tiktok.map((point, i) => ({
    date: point.date,
    tiktok: point.value,
    instagram: data.instagram[i]?.value ?? 0,
    youtube: data.youtube[i]?.value ?? 0,
    brevo: data.brevo[i]?.value ?? 0,
  }));

  // Show every ~15th label to avoid crowding
  const labelInterval = Math.floor(merged.length / 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-navy">
          Follower Growth (90 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(val: string) => {
                  const d = new Date(val);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
                interval={labelInterval}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(val: number) =>
                  val >= 1000 ? `${(val / 1000).toFixed(0)}K` : String(val)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1B2A4A",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 12,
                }}
                labelFormatter={(val: any) => {
                  const d = new Date(val);
                  return d.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  });
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [
                  typeof value === "number" ? value.toLocaleString() : value,
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
              />
              <Legend
                verticalAlign="top"
                height={32}
                formatter={(value: string) =>
                  value.charAt(0).toUpperCase() + value.slice(1)
                }
              />
              <Line
                type="monotone"
                dataKey="tiktok"
                stroke="#00F2EA"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="instagram"
                stroke="#E4405F"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="youtube"
                stroke="#FF0000"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="brevo"
                stroke="#0B996E"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Engagement Chart - Bar chart comparing engagement vs benchmarks     */
/* ------------------------------------------------------------------ */

interface EngagementDataPoint {
  platform: string;
  engagement: number;
  benchmark: number;
}

interface EngagementChartProps {
  data: EngagementDataPoint[];
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-navy">
          Engagement vs Benchmark
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="platform"
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(val: number) => `${val}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1B2A4A",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 12,
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [
                  `${value}%`,
                  name === "engagement" ? "Your Rate" : "Benchmark",
                ]}
              />
              <Legend
                verticalAlign="top"
                height={32}
                formatter={(value: string) =>
                  value === "engagement" ? "Your Rate" : "Benchmark"
                }
              />
              <Bar
                dataKey="engagement"
                fill="#1B2A4A"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="benchmark"
                fill="#F5C518"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Content Timeline - Recent content list with platform dots           */
/* ------------------------------------------------------------------ */

const platformDotColours: Record<Platform, string> = {
  tiktok: "bg-tiktok",
  instagram: "bg-instagram",
  youtube: "bg-youtube",
  brevo: "bg-brevo",
};

const platformLabels: Record<Platform, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  brevo: "Brevo",
};

interface ContentTimelineProps {
  items: ContentItem[];
}

function formatMetric(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function ContentTimeline({ items }: ContentTimelineProps) {
  const published = items
    .filter((item) => item.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-navy">
          Recent Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {published.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <div
                className={cn(
                  "h-2.5 w-2.5 flex-shrink-0 rounded-full",
                  platformDotColours[item.platform]
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-navy">
                  {item.title}
                </p>
                <p className="text-muted-foreground text-xs">
                  {platformLabels[item.platform]} &middot;{" "}
                  {new Date(item.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              {item.metrics && (
                <div className="flex flex-shrink-0 gap-4 text-right">
                  {item.metrics.views !== undefined && (
                    <div>
                      <p className="text-xs font-semibold text-navy">
                        {formatMetric(item.metrics.views)}
                      </p>
                      <p className="text-muted-foreground text-[10px]">views</p>
                    </div>
                  )}
                  {item.metrics.likes !== undefined && (
                    <div>
                      <p className="text-xs font-semibold text-navy">
                        {formatMetric(item.metrics.likes)}
                      </p>
                      <p className="text-muted-foreground text-[10px]">likes</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
