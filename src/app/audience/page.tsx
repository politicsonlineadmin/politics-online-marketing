"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { cn } from "@/lib/utils";
import {
  tiktokMetrics,
  instagramMetrics,
  youtubeMetrics as mockYoutubeMetrics,
  brevoMetrics as mockBrevoMetrics,
  audienceDemographics,
  audienceGender,
  audienceTopLocations,
} from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Users, TrendingUp, Crown, UserCheck, Loader2 } from "lucide-react";
import type { Platform } from "@/lib/types";

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

const GENDER_COLORS = ["#E4405F", "#1B2A4A", "#F5C518"];

const engagementTiers = [
  { label: "Highly Engaged", percentage: 18, color: "bg-green-500", textColor: "text-green-700" },
  { label: "Engaged", percentage: 34, color: "bg-blue-500", textColor: "text-blue-700" },
  { label: "Casual", percentage: 35, color: "bg-amber-500", textColor: "text-amber-700" },
  { label: "Inactive", percentage: 13, color: "bg-gray-400", textColor: "text-gray-600" },
];

const tooltipStyle = {
  backgroundColor: "#1B2A4A",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

interface LiveData {
  brevo: { totalContacts: number; avgOpenRate: number } | null;
  youtube: { channel: { subscribers: number; totalViews: number } } | null;
}

export default function AudiencePage() {
  const [liveData, setLiveData] = useState<LiveData>({ brevo: null, youtube: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/overview")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json) => setLiveData(json))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ytFollowers = liveData.youtube?.channel.subscribers ?? mockYoutubeMetrics.subscribers;
  const brevoFollowers = liveData.youtube ? (liveData.brevo?.totalContacts ?? mockBrevoMetrics.contacts) : mockBrevoMetrics.contacts;
  const ytEngagement = liveData.youtube?.channel.totalViews
    ? Math.round((liveData.youtube.channel.totalViews / (ytFollowers || 1)) * 10) / 10
    : mockYoutubeMetrics.engagement;

  const platformFollowers: { platform: Platform; label: string; followers: number; colorClass: string; live: boolean }[] = [
    { platform: "tiktok", label: "TikTok", followers: tiktokMetrics.followers, colorClass: "text-tiktok", live: false },
    { platform: "instagram", label: "Instagram", followers: instagramMetrics.followers, colorClass: "text-instagram", live: false },
    { platform: "youtube", label: "YouTube", followers: ytFollowers, colorClass: "text-youtube", live: !!liveData.youtube },
    { platform: "brevo", label: "Brevo", followers: brevoFollowers, colorClass: "text-brevo", live: !!liveData.brevo },
  ];

  const totalAudience = platformFollowers.reduce((sum, p) => sum + p.followers, 0);
  const avgEngagement = Math.round(((tiktokMetrics.engagement + instagramMetrics.engagement + ytEngagement) / 3) * 10) / 10;
  const topPlatform = platformFollowers.reduce((a, b) => (a.followers > b.followers ? a : b));
  const topAgeGroup = audienceDemographics.reduce((a, b) => (a.percentage > b.percentage ? a : b));

  if (loading) {
    return (
      <AppShell title="Audience">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-navy" />
          <span className="ml-3 text-muted-foreground">Loading audience data...</span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Audience">
      <div className="space-y-6">
        {/* Data source indicator */}
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", (liveData.youtube || liveData.brevo) ? "bg-emerald-500" : "bg-amber-500")} />
          <span className="text-xs text-muted-foreground">
            {liveData.youtube || liveData.brevo
              ? `Live data: ${[liveData.youtube && "YouTube", liveData.brevo && "Brevo"].filter(Boolean).join(", ")} — Mock: TikTok, Instagram, demographics`
              : "Showing mock data — no live APIs connected"}
          </span>
        </div>

        {/* Overview metrics row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-navy/10">
                <Users className="size-4 text-navy" />
              </div>
              <span className="text-sm text-muted-foreground">Total Audience</span>
            </div>
            <p className="text-2xl font-bold text-navy">{formatNumber(totalAudience)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-gold/10">
                <TrendingUp className="size-4 text-gold-dark" />
              </div>
              <span className="text-sm text-muted-foreground">Avg Engagement</span>
            </div>
            <p className="text-2xl font-bold text-navy">{avgEngagement.toFixed(1)}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-tiktok/10">
                <Crown className="size-4 text-tiktok" />
              </div>
              <span className="text-sm text-muted-foreground">Top Platform</span>
            </div>
            <p className="text-2xl font-bold text-navy">{topPlatform.label}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-navy/10">
                <UserCheck className="size-4 text-navy" />
              </div>
              <span className="text-sm text-muted-foreground">Top Age Group</span>
            </div>
            <p className="text-2xl font-bold text-navy">{topAgeGroup.ageGroup}</p>
          </div>
        </div>

        {/* Charts section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Age Demographics */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-navy mb-4">Age Demographics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={audienceDemographics} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(val: number) => `${val}%`} />
                  <YAxis type="category" dataKey="ageGroup" tick={{ fontSize: 12, fill: "#1B2A4A", fontWeight: 500 }} width={50} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value}%`, "Percentage"]} />
                  <Bar dataKey="percentage" fill="#1B2A4A" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gender Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-navy mb-4">Gender Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={audienceGender}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="percentage"
                    nameKey="gender"
                    label={({ name, value }: any) => `${name} ${value}%`}
                  >
                    {audienceGender.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value}%`, "Percentage"]} />
                  <Legend verticalAlign="bottom" height={36} formatter={(value: string) => <span className="text-sm text-foreground">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
            <h3 className="text-base font-semibold text-navy mb-4">Top Locations</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={audienceTopLocations} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(val: number) => `${val}%`} />
                  <YAxis type="category" dataKey="location" tick={{ fontSize: 12, fill: "#1B2A4A", fontWeight: 500 }} width={90} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value}%`, "Percentage"]} />
                  <Bar dataKey="percentage" fill="#F5C518" radius={[0, 4, 4, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Platform audience breakdown */}
        <div>
          <h3 className="text-base font-semibold text-navy mb-4">Platform Audience Breakdown</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {platformFollowers.map((pf) => (
              <div key={pf.platform} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn("size-2.5 rounded-full", pf.colorClass.replace("text-", "bg-"))} />
                  <span className={cn("text-sm font-medium", pf.colorClass)}>{pf.label}</span>
                  {pf.live && <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 rounded px-1">LIVE</span>}
                </div>
                <p className="text-2xl font-bold text-navy">{formatNumber(pf.followers)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pf.platform === "brevo" ? "contacts" : "followers"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement scoring section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-base font-semibold text-navy mb-2">Engagement Scoring</h3>
          <p className="text-sm text-muted-foreground mb-5">
            Distribution of your audience by engagement level.
          </p>

          <div className="h-10 w-full rounded-lg overflow-hidden flex">
            {engagementTiers.map((tier) => (
              <div
                key={tier.label}
                className={cn("h-full flex items-center justify-center text-xs font-semibold text-white transition-all", tier.color)}
                style={{ width: `${tier.percentage}%` }}
              >
                {tier.percentage >= 15 ? `${tier.percentage}%` : ""}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {engagementTiers.map((tier) => (
              <div key={tier.label} className="flex items-center gap-2">
                <div className={cn("size-3 rounded-sm", tier.color)} />
                <span className="text-sm text-muted-foreground">{tier.label}</span>
                <span className={cn("text-sm font-semibold", tier.textColor)}>{tier.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
