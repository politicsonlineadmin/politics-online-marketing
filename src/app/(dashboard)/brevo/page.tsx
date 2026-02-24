"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { brevoMetrics, emailCampaigns as mockEmailCampaigns } from "@/lib/mock-data";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Mail, MousePointerClick, AlertTriangle, Calendar, Loader2 } from "lucide-react";

interface CampaignData {
  id: string;
  name: string;
  subject: string;
  status: "sent" | "scheduled" | "draft";
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
}

interface BrevoData {
  totalContacts: number;
  avgOpenRate: number;
  avgClickRate: number;
  deliverabilityRate: number;
  campaigns: CampaignData[];
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

const statusConfig: Record<string, { label: string; className: string }> = {
  sent: { label: "Sent", className: "bg-emerald-100 text-emerald-700" },
  scheduled: { label: "Scheduled", className: "bg-amber-100 text-amber-700" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
};

export default function BrevoPage() {
  const [data, setData] = useState<BrevoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch("/api/brevo")
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
          totalContacts: brevoMetrics.contacts,
          avgOpenRate: brevoMetrics.openRate,
          avgClickRate: brevoMetrics.clickRate,
          deliverabilityRate: brevoMetrics.deliverabilityRate,
          campaigns: mockEmailCampaigns.map((c) => ({
            ...c,
            status: c.status as "sent" | "scheduled" | "draft",
          })),
        });
        setIsLive(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppShell title="Email Analytics">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brevo" />
          <span className="ml-3 text-muted-foreground">Loading Brevo data...</span>
        </div>
      </AppShell>
    );
  }

  const d = data!;
  const campaigns = d.campaigns;

  return (
    <AppShell title="Email Analytics">
      <div className="space-y-6">
        {/* Data source indicator */}
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", isLive ? "bg-emerald-500" : "bg-amber-500")} />
          <span className="text-xs text-muted-foreground">
            {isLive ? "Live data from Brevo API" : "Showing mock data — check API key in settings"}
          </span>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Contacts"
            value={formatNumber(d.totalContacts)}
            change={brevoMetrics.contactGrowth}
            trend="up"
          />
          <MetricCard
            label="Avg Open Rate"
            value={`${d.avgOpenRate}%`}
            change={2.1}
            trend="up"
          />
          <MetricCard
            label="Avg Click Rate"
            value={`${d.avgClickRate}%`}
            change={0.8}
            trend="up"
          />
          <MetricCard
            label="Deliverability"
            value={`${d.deliverabilityRate}%`}
            change={0.1}
            trend="up"
          />
          <MetricCard
            label="Campaigns"
            value={String(campaigns.length)}
            change={0}
            trend="up"
          />
        </div>

        {/* Campaign list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-navy">
              Email Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No email campaigns found. Create your first campaign in Brevo.
              </p>
            ) : (
              <div className="space-y-3">
                {campaigns.map((campaign) => {
                  const status = statusConfig[campaign.status] || statusConfig.draft;
                  return (
                    <div
                      key={campaign.id}
                      className="rounded-lg border border-border/50 p-4 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-navy">
                              {campaign.name}
                            </h3>
                            <Badge className={cn("text-[10px]", status.className)}>
                              {status.label}
                            </Badge>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {campaign.subject}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(campaign.sentDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                            {campaign.recipients > 0 && (
                              <>
                                <span className="mx-1">&middot;</span>
                                {formatNumber(campaign.recipients)} recipients
                              </>
                            )}
                          </div>
                        </div>

                        {campaign.status === "sent" && (
                          <div className="flex gap-4 text-right">
                            <div>
                              <div className="flex items-center justify-end gap-1">
                                <Mail className="h-3 w-3 text-brevo" />
                                <p className="text-sm font-bold text-navy">
                                  {campaign.openRate}%
                                </p>
                              </div>
                              <p className="text-[10px] text-muted-foreground">Open Rate</p>
                            </div>
                            <div>
                              <div className="flex items-center justify-end gap-1">
                                <MousePointerClick className="h-3 w-3 text-brevo" />
                                <p className="text-sm font-bold text-navy">
                                  {campaign.clickRate}%
                                </p>
                              </div>
                              <p className="text-[10px] text-muted-foreground">Click Rate</p>
                            </div>
                            <div>
                              <div className="flex items-center justify-end gap-1">
                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                                <p className="text-sm font-bold text-navy">
                                  {campaign.bounceRate}%
                                </p>
                              </div>
                              <p className="text-[10px] text-muted-foreground">Bounce</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact growth chart — still using sparkline mock data for now */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-navy">
              Contact Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={brevoMetrics.sparklineData}>
                  <defs>
                    <linearGradient id="brevo-growth-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0B996E" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#0B996E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickFormatter={(val: string) => {
                      const dt = new Date(val);
                      return `${dt.getDate()}/${dt.getMonth() + 1}`;
                    }}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickFormatter={(val: number) =>
                      val >= 1000 ? `${(val / 1000).toFixed(1)}K` : String(val)
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
                    formatter={(value: any) => [Number(value).toLocaleString(), "Contacts"]}
                    labelFormatter={(val: any) => {
                      const dt = new Date(val);
                      return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0B996E"
                    strokeWidth={2}
                    fill="url(#brevo-growth-fill)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
