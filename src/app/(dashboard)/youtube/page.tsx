"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  youtubeMetrics,
  youtubeVideos as mockVideos,
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
import { ArrowUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

interface VideoData {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
}

interface YouTubeData {
  channel: {
    title: string;
    subscribers: number;
    totalViews: number;
    videoCount: number;
  };
  videos: VideoData[];
  summary: {
    totalVideoViews: number;
    totalLikes: number;
    totalComments: number;
    avgViews: number;
    topVideo: VideoData | null;
  };
}

type SortKey = "views" | "likes" | "comments";

export default function YouTubePage() {
  const [data, setData] = useState<YouTubeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("views");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    fetch("/api/youtube")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setIsLive(true);
      })
      .catch(() => {
        // Fall back to mock data
        setData({
          channel: {
            title: "Politics Online",
            subscribers: youtubeMetrics.subscribers,
            totalViews: youtubeMetrics.views,
            videoCount: mockVideos.length,
          },
          videos: mockVideos.map((v) => ({
            id: v.id,
            title: v.title,
            publishedAt: v.date,
            thumbnail: "",
            views: v.views,
            likes: v.likes,
            comments: v.comments,
            duration: v.avgViewDuration || "—",
          })),
          summary: {
            totalVideoViews: mockVideos.reduce((s, v) => s + v.views, 0),
            totalLikes: mockVideos.reduce((s, v) => s + v.likes, 0),
            totalComments: mockVideos.reduce((s, v) => s + v.comments, 0),
            avgViews: Math.round(mockVideos.reduce((s, v) => s + v.views, 0) / mockVideos.length),
            topVideo: null,
          },
        });
        setIsLive(false);
      })
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return (
      <AppShell title="YouTube Analytics">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-youtube" />
          <span className="ml-3 text-muted-foreground">Loading YouTube data...</span>
        </div>
      </AppShell>
    );
  }

  const d = data!;
  const sortedVideos = [...d.videos].sort((a, b) => {
    const diff = a[sortBy] - b[sortBy];
    return sortAsc ? diff : -diff;
  });

  return (
    <AppShell title="YouTube Analytics">
      <div className="space-y-6">
        {/* Data source indicator */}
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", isLive ? "bg-emerald-500" : "bg-amber-500")} />
          <span className="text-xs text-muted-foreground">
            {isLive ? "Live data from YouTube API" : "Showing mock data — check API key in settings"}
          </span>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Subscribers"
            value={formatNumber(d.channel.subscribers)}
            change={0}
            trend="up"
          />
          <MetricCard
            label="Total Views"
            value={formatNumber(d.channel.totalViews)}
            change={0}
            trend="up"
          />
          <MetricCard
            label="Videos"
            value={String(d.channel.videoCount)}
            change={0}
            trend="up"
          />
          <MetricCard
            label="Avg Views/Video"
            value={formatNumber(d.summary.avgViews)}
            change={0}
            trend="up"
          />
          <MetricCard
            label="Total Likes"
            value={formatNumber(d.summary.totalLikes)}
            change={0}
            trend="up"
          />
        </div>

        {/* Video table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-navy">
              Video Analytics ({sortedVideos.length} videos)
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
                    <th className="pb-3 pl-4 text-right font-medium text-muted-foreground">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVideos.map((video) => (
                    <tr
                      key={video.id}
                      className="border-b border-border/50 transition-colors hover:bg-muted/30"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          {video.thumbnail && (
                            <img
                              src={video.thumbnail}
                              alt=""
                              className="h-9 w-16 rounded object-cover"
                            />
                          )}
                          <span className="font-medium text-navy line-clamp-1">
                            {video.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {new Date(video.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
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
                      <td className="py-3 pl-4 text-right text-muted-foreground">
                        {video.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Retention curve + Traffic sources (still mock — YouTube API doesn't expose these publicly) */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-navy">
                Average Retention Curve
              </CardTitle>
              <p className="text-xs text-muted-foreground">Sample data — requires YouTube Studio access</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={youtubeRetention}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#6b7280" }} />
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-navy">
                Traffic Sources
              </CardTitle>
              <p className="text-xs text-muted-foreground">Sample data — requires YouTube Studio access</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={youtubeTrafficSources}
                    layout="vertical"
                    margin={{ left: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
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
