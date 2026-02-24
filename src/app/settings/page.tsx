"use client";

import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import type { Platform } from "@/lib/types";

interface PlatformConfig {
  platform: Platform;
  label: string;
  colorClass: string;
  borderClass: string;
  dotColor: string;
  defaultStatus: "connected" | "disconnected" | "error";
  fields: { key: string; label: string }[];
}

const platformConfigs: PlatformConfig[] = [
  {
    platform: "tiktok",
    label: "TikTok",
    colorClass: "text-tiktok",
    borderClass: "border-t-tiktok",
    dotColor: "bg-tiktok",
    defaultStatus: "disconnected",
    fields: [
      { key: "apiKey", label: "API Key" },
      { key: "apiSecret", label: "API Secret" },
    ],
  },
  {
    platform: "instagram",
    label: "Instagram",
    colorClass: "text-instagram",
    borderClass: "border-t-instagram",
    dotColor: "bg-instagram",
    defaultStatus: "disconnected",
    fields: [
      { key: "accessToken", label: "Access Token" },
      { key: "businessAccountId", label: "Business Account ID" },
    ],
  },
  {
    platform: "youtube",
    label: "YouTube",
    colorClass: "text-youtube",
    borderClass: "border-t-youtube",
    dotColor: "bg-youtube",
    defaultStatus: "connected",
    fields: [
      { key: "apiKey", label: "API Key" },
      { key: "channelId", label: "Channel ID" },
    ],
  },
  {
    platform: "brevo",
    label: "Brevo",
    colorClass: "text-brevo",
    borderClass: "border-t-brevo",
    dotColor: "bg-brevo",
    defaultStatus: "error",
    fields: [
      { key: "apiKey", label: "API Key" },
      { key: "senderEmail", label: "Sender Email" },
    ],
  },
];

type ConnectionStatus = "connected" | "disconnected" | "error";

interface PlatformState {
  credentials: Record<string, string>;
  status: ConnectionStatus;
  testing: boolean;
  visibleFields: Record<string, boolean>;
}

const STORAGE_KEY = "politics-api-connections";

function getStatusConfig(status: ConnectionStatus) {
  switch (status) {
    case "connected":
      return {
        label: "Connected",
        dotClass: "bg-green-500",
        icon: CheckCircle2,
        badgeClass: "bg-green-50 text-green-700 border-green-200",
      };
    case "error":
      return {
        label: "Connection error",
        dotClass: "bg-red-500",
        icon: XCircle,
        badgeClass: "bg-red-50 text-red-700 border-red-200",
      };
    default:
      return {
        label: "Not connected",
        dotClass: "bg-gray-400",
        icon: MinusCircle,
        badgeClass: "bg-gray-50 text-gray-600 border-gray-200",
      };
  }
}

export default function SettingsPage() {
  const [platforms, setPlatforms] = useState<Record<Platform, PlatformState>>(() => {
    const initial: Record<string, PlatformState> = {};
    for (const config of platformConfigs) {
      initial[config.platform] = {
        credentials: Object.fromEntries(config.fields.map((f) => [f.key, ""])),
        status: config.defaultStatus,
        testing: false,
        visibleFields: Object.fromEntries(config.fields.map((f) => [f.key, false])),
      };
    }
    return initial as Record<Platform, PlatformState>;
  });

  // Load saved values from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<
          string,
          { credentials: Record<string, string>; status: ConnectionStatus }
        >;
        setPlatforms((prev) => {
          const next = { ...prev };
          for (const key of Object.keys(parsed)) {
            const platform = key as Platform;
            if (next[platform]) {
              next[platform] = {
                ...next[platform],
                credentials: { ...next[platform].credentials, ...parsed[platform].credentials },
                status: parsed[platform].status,
              };
            }
          }
          return next;
        });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const updateCredential = useCallback(
    (platform: Platform, fieldKey: string, value: string) => {
      setPlatforms((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          credentials: { ...prev[platform].credentials, [fieldKey]: value },
        },
      }));
    },
    []
  );

  const toggleFieldVisibility = useCallback(
    (platform: Platform, fieldKey: string) => {
      setPlatforms((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          visibleFields: {
            ...prev[platform].visibleFields,
            [fieldKey]: !prev[platform].visibleFields[fieldKey],
          },
        },
      }));
    },
    []
  );

  const handleTestConnection = useCallback((platform: Platform) => {
    setPlatforms((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], testing: true },
    }));
    // Simulate a test connection with a brief loading state
    setTimeout(() => {
      setPlatforms((prev) => ({
        ...prev,
        [platform]: { ...prev[platform], testing: false },
      }));
    }, 1500);
  }, []);

  const handleSave = useCallback(
    (platform: Platform) => {
      const state = platforms[platform];
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const existing = saved ? JSON.parse(saved) : {};
        existing[platform] = {
          credentials: state.credentials,
          status: state.status,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      } catch {
        // Ignore storage errors
      }
    },
    [platforms]
  );

  return (
    <AppShell title="Settings">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-navy">API Connections</h2>
          <p className="text-sm text-muted-foreground">
            Manage your platform API connections and credentials.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {platformConfigs.map((config) => {
            const state = platforms[config.platform];
            const statusConfig = getStatusConfig(state.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={config.platform}
                className={cn(
                  "bg-white rounded-xl shadow-sm p-6 border-t-4",
                  config.borderClass
                )}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("size-3 rounded-full", config.dotColor)} />
                    <h3 className={cn("text-base font-semibold", config.colorClass)}>
                      {config.label}
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("gap-1.5 text-xs font-medium", statusConfig.badgeClass)}
                  >
                    <StatusIcon className="size-3" />
                    {statusConfig.label}
                  </Badge>
                </div>

                {/* Credential fields */}
                <div className="space-y-4">
                  {config.fields.map((field) => (
                    <div key={field.key}>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        {field.label}
                      </label>
                      <div className="relative">
                        <Input
                          type={state.visibleFields[field.key] ? "text" : "password"}
                          value={state.credentials[field.key]}
                          onChange={(e) =>
                            updateCredential(config.platform, field.key, e.target.value)
                          }
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => toggleFieldVisibility(config.platform, field.key)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {state.visibleFields[field.key] ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="mt-5 flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestConnection(config.platform)}
                    disabled={state.testing}
                  >
                    {state.testing ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSave(config.platform)}
                    className="bg-navy hover:bg-navy-light"
                  >
                    Save
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
