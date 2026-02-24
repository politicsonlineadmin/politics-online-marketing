"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  sparklineData?: { date: string; value: number }[];
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  trend,
  sparklineData,
  className,
}: MetricCardProps) {
  const isPositive = trend === "up";

  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <p className="text-muted-foreground text-xs font-medium">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-navy">{value}</p>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                isPositive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-muted-foreground text-xs">vs last period</span>
          </div>
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="h-10 w-20 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isPositive ? "#10b981" : "#ef4444"}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor={isPositive ? "#10b981" : "#ef4444"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "#10b981" : "#ef4444"}
                  strokeWidth={1.5}
                  fill={`url(#spark-${label})`}
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
