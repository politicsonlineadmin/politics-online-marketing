"use client";

import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  tiktokMetrics,
  tiktokVideos,
  postingHeatmap,
} from "@/lib/mock-data";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6am to 11pm

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

function getHeatmapColor(engagement: number): string {
  // Scale from light teal to deep teal
  if (engagement >= 80) return "bg-tiktok text-navy-dark font-semibold";
  if (engagement >= 60) return "bg-tiktok/70 text-navy-dark";
  if (engagement >= 40) return "bg-tiktok/40 text-navy";
  if (engagement >= 25) return "bg-tiktok/20 text-navy";
  return "bg-tiktok/5 text-muted-foreground";
}

export default function TikTokPage() {
  const videosSorted = [...tiktokVideos].sort((a, b) => b.views - a.views);

  return (
    <AppShell title="TikTok Analytics">
      <div className="space-y-6">
        {/* Top metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Followers"
            value={formatNumber(tiktokMetrics.followers)}
            change={tiktokMetrics.followerGrowth}
            trend="up"
          />
          <MetricCard
            label="Video Views"
            value={formatNumber(tiktokMetrics.videoViews)}
            change={tiktokMetrics.viewsChange}
            trend="up"
          />
          <MetricCard
            label="Engagement Rate"
            value={`${tiktokMetrics.engagement}%`}
            change={tiktokMetrics.engagementChange}
            trend={tiktokMetrics.engagementChange >= 0 ? "up" : "down"}
          />
          <MetricCard
            label="Avg Watch Time"
            value={`${tiktokMetrics.avgWatchTime}s`}
            change={11}
            trend="up"
          />
          <MetricCard
            label="Shares"
            value={formatNumber(tiktokMetrics.shares)}
            change={8.4}
            trend="up"
          />
        </div>

        {/* Video analytics table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-navy">
              Video Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">
                      Title
                    </th>
                    <th className="pb-3 px-4 text-left font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="pb-3 px-4 text-right font-medium text-muted-foreground">
                      Views
                    </th>
                    <th className="pb-3 px-4 text-right font-medium text-muted-foreground">
                      Likes
                    </th>
                    <th className="pb-3 px-4 text-right font-medium text-muted-foreground">
                      Comments
                    </th>
                    <th className="pb-3 px-4 text-right font-medium text-muted-foreground">
                      Shares
                    </th>
                    <th className="pb-3 pl-4 text-right font-medium text-muted-foreground">
                      Watch Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {videosSorted.map((video) => (
                    <tr
                      key={video.id}
                      className="border-b border-border/50 transition-colors hover:bg-muted/30"
                    >
                      <td className="py-3 pr-4 font-medium text-navy">
                        {video.title}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(video.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-navy">
                        {formatNumber(video.views)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatNumber(video.likes)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {video.comments.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatNumber(video.shares)}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        {video.watchTime ? `${video.watchTime}s` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Follower growth chart + Heatmap side by side */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Follower growth chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-navy">
                Follower Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tiktokMetrics.sparklineData}>
                    <defs>
                      <linearGradient
                        id="tiktok-growth-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#00F2EA"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#00F2EA"
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
                      stroke="#00F2EA"
                      strokeWidth={2}
                      fill="url(#tiktok-growth-fill)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Posting time heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-navy">
                Best Posting Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[540px]">
                  {/* Hour labels */}
                  <div className="mb-1 flex">
                    <div className="w-10 flex-shrink-0" />
                    {hours.map((h) => (
                      <div
                        key={h}
                        className="flex-1 text-center text-[10px] text-muted-foreground"
                      >
                        {h}:00
                      </div>
                    ))}
                  </div>
                  {/* Grid rows */}
                  {days.map((day, dayIndex) => (
                    <div key={day} className="flex items-center gap-0.5 mb-0.5">
                      <div className="w-10 flex-shrink-0 text-xs font-medium text-muted-foreground">
                        {day}
                      </div>
                      {hours.map((hour) => {
                        const slot = postingHeatmap.find(
                          (s) => s.day === dayIndex && s.hour === hour
                        );
                        const engagement = slot?.engagement ?? 0;
                        return (
                          <div
                            key={`${dayIndex}-${hour}`}
                            className={cn(
                              "flex flex-1 items-center justify-center rounded-sm py-1.5 text-[9px]",
                              getHeatmapColor(engagement)
                            )}
                            title={`${day} ${hour}:00 - Engagement: ${engagement}`}
                          >
                            {engagement >= 60 ? engagement : ""}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Higher numbers = more engagement. Best times are highlighted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
