"use client";

import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { instagramMetrics, contentItems } from "@/lib/mock-data";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

const typeColors: Record<string, string> = {
  reel: "bg-instagram/10 text-instagram",
  carousel: "bg-purple-100 text-purple-700",
  image: "bg-blue-100 text-blue-700",
  story: "bg-amber-100 text-amber-700",
};

// Simple engagement breakdown data
const engagementBreakdown = [
  { type: "Likes", value: 8200 },
  { type: "Comments", value: 890 },
  { type: "Saves", value: 4500 },
  { type: "Shares", value: 1210 },
  { type: "Profile Visits", value: 6700 },
];

export default function InstagramPage() {
  const instagramContent = contentItems
    .filter((item) => item.platform === "instagram" && item.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AppShell title="Instagram Analytics">
      <div className="space-y-6">
        {/* Top metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Followers"
            value={formatNumber(instagramMetrics.followers)}
            change={instagramMetrics.followerGrowth}
            trend="up"
          />
          <MetricCard
            label="Reach"
            value={formatNumber(instagramMetrics.reach)}
            change={instagramMetrics.reachChange}
            trend="up"
          />
          <MetricCard
            label="Engagement Rate"
            value={`${instagramMetrics.engagement}%`}
            change={instagramMetrics.engagementChange}
            trend={instagramMetrics.engagementChange >= 0 ? "up" : "down"}
          />
          <MetricCard
            label="Saves"
            value={formatNumber(instagramMetrics.saves)}
            change={5.3}
            trend="up"
          />
          <MetricCard
            label="Profile Visits"
            value={formatNumber(instagramMetrics.profileVisits)}
            change={7.1}
            trend="up"
          />
        </div>

        {/* Post grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-navy">
              Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {instagramContent.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/30"
                >
                  {/* Placeholder thumbnail */}
                  <div className="mb-3 flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-instagram/10 to-purple-100">
                    <span className="text-3xl text-instagram/40">
                      {item.type === "reel" ? "R" : item.type === "carousel" ? "C" : item.type === "story" ? "S" : "I"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-navy">
                        {item.title}
                      </p>
                      <Badge
                        className={cn(
                          "text-[10px] capitalize",
                          typeColors[item.type] ?? "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {item.metrics && (
                      <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
                        {item.metrics.views !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {formatNumber(item.metrics.views)}
                          </span>
                        )}
                        {item.metrics.likes !== undefined && (
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {formatNumber(item.metrics.likes)}
                          </span>
                        )}
                        {item.metrics.comments !== undefined && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {item.metrics.comments}
                          </span>
                        )}
                        {item.metrics.shares !== undefined && (
                          <span className="flex items-center gap-1">
                            <Share2 className="h-3 w-3" />
                            {item.metrics.shares}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement breakdown + Follower growth */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Engagement breakdown bar chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-navy">
                Engagement Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={engagementBreakdown}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(val: number) => formatNumber(val)}
                    />
                    <YAxis
                      type="category"
                      dataKey="type"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      width={90}
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
                      formatter={(value: any) => [
                        Number(value).toLocaleString(),
                        "Count",
                      ]}
                    />
                    <Bar
                      dataKey="value"
                      fill="#E4405F"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Follower growth sparkline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-navy">
                Follower Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={instagramMetrics.sparklineData}>
                    <defs>
                      <linearGradient
                        id="ig-growth-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#E4405F"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#E4405F"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(val: string) => {
                        const d = new Date(val);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      }}
                      interval={4}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(val: number) =>
                        val >= 1000
                          ? `${(val / 1000).toFixed(1)}K`
                          : String(val)
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
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any) => [
                        Number(value).toLocaleString(),
                        "Followers",
                      ]}
                      labelFormatter={(val: any) => {
                        const d = new Date(val);
                        return d.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        });
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#E4405F"
                      strokeWidth={2}
                      fill="url(#ig-growth-fill)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
