"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  youtubeMetrics,
  youtubeVideos,
  youtubeRetention,
  youtubeTrafficSources,
} from "@/lib/mock-data";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

type SortKey = "views" | "likes" | "comments";

export default function YouTubePage() {
  const [sortBy, setSortBy] = useState<SortKey>("views");
  const [sortAsc, setSortAsc] = useState(false);

  const sortedVideos = [...youtubeVideos].sort((a, b) => {
    const diff = a[sortBy] - b[sortBy];
    return sortAsc ? diff : -diff;
  });

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(false);
    }
  };

  const sortableHeader = (label: string, key: SortKey) => (
    <button
      onClick={() => toggleSort(key)}
      className={cn(
        "flex items-center gap-1 pb-3 px-4 text-right font-medium text-muted-foreground transition-colors hover:text-navy",
        sortBy === key && "text-navy"
      )}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <AppShell title="YouTube Analytics">
      <div className="space-y-6">
        {/* Top metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Subscribers"
            value={formatNumber(youtubeMetrics.subscribers)}
            change={youtubeMetrics.followerGrowth}
            trend="up"
          />
          <MetricCard
            label="Views"
            value={formatNumber(youtubeMetrics.views)}
            change={youtubeMetrics.viewsChange}
            trend="up"
          />
          <MetricCard
            label="Watch Time (hrs)"
            value={formatNumber(youtubeMetrics.watchTimeHours)}
            change={9.8}
            trend="up"
          />
          <MetricCard
            label="CTR"
            value={`${youtubeMetrics.ctr}%`}
            change={0.4}
            trend="up"
          />
          <MetricCard
            label="Avg View Duration"
            value={youtubeMetrics.avgViewDuration}
            change={3.2}
            trend="up"
          />
        </div>

        {/* Video table */}
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
                    <th className="text-right">
                      {sortableHeader("Views", "views")}
                    </th>
                    <th className="text-right">
                      {sortableHeader("Likes", "likes")}
                    </th>
                    <th className="text-right">
                      {sortableHeader("Comments", "comments")}
                    </th>
                    <th className="pb-3 px-4 text-right font-medium text-muted-foreground">
                      Avg Duration
                    </th>
                    <th className="pb-3 pl-4 text-right font-medium text-muted-foreground">
                      CTR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVideos.map((video) => (
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
                        {video.avgViewDuration ?? "—"}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        {video.ctr ? `${video.ctr}%` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Retention curve + Traffic sources */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Retention curve */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-navy">
                Average Retention Curve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={youtubeRetention}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(val: number) => `${val}%`}
                      domain={[0, 100]}
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
                      formatter={(value: any) => [`${value}%`, "Retention"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="retention"
                      stroke="#FF0000"
                      strokeWidth={2.5}
                      dot={{ fill: "#FF0000", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Traffic sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-navy">
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={youtubeTrafficSources}
                    layout="vertical"
                    margin={{ left: 30 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(val: number) => `${val}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="source"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      width={120}
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
                      formatter={(value: any, _name: any, props: any) => [
                        `${value}% (${formatNumber(props?.payload?.views ?? 0)} views)`,
                        "Traffic",
                      ]}
                    />
                    <Bar
                      dataKey="percentage"
                      fill="#FF0000"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
