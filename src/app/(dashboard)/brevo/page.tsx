"use client";

import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { brevoMetrics, emailCampaigns } from "@/lib/mock-data";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Mail, MousePointerClick, AlertTriangle, Calendar } from "lucide-react";

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
  return (
    <AppShell title="Email Analytics">
      <div className="space-y-6">
        {/* Top metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Contacts"
            value={formatNumber(brevoMetrics.contacts)}
            change={brevoMetrics.contactGrowth}
            trend="up"
          />
          <MetricCard
            label="Open Rate"
            value={`${brevoMetrics.openRate}%`}
            change={2.1}
            trend="up"
          />
          <MetricCard
            label="Click Rate"
            value={`${brevoMetrics.clickRate}%`}
            change={0.8}
            trend="up"
          />
          <MetricCard
            label="Deliverability"
            value={`${brevoMetrics.deliverabilityRate}%`}
            change={0.1}
            trend="up"
          />
          <MetricCard
            label="Contact Growth"
            value={`+${brevoMetrics.contactGrowth}%`}
            change={brevoMetrics.contactGrowth}
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
            <div className="space-y-3">
              {emailCampaigns.map((campaign) => {
                const status = statusConfig[campaign.status];
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
                          <Badge
                            className={cn(
                              "text-[10px]",
                              status.className
                            )}
                          >
                            {status.label}
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {campaign.subject}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(campaign.sentDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                          <span className="mx-1">&middot;</span>
                          {formatNumber(campaign.recipients)} recipients
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
                            <p className="text-[10px] text-muted-foreground">
                              Open Rate
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center justify-end gap-1">
                              <MousePointerClick className="h-3 w-3 text-brevo" />
                              <p className="text-sm font-bold text-navy">
                                {campaign.clickRate}%
                              </p>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              Click Rate
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center justify-end gap-1">
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                              <p className="text-sm font-bold text-navy">
                                {campaign.bounceRate}%
                              </p>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              Bounce
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Contact growth chart */}
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
                    <linearGradient
                      id="brevo-growth-fill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#0B996E"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="#0B996E"
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
                      "Contacts",
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
