export type Platform = "tiktok" | "instagram" | "youtube" | "brevo";

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface PlatformMetrics {
  platform: Platform;
  followers: number;
  followerGrowth: number;
  engagement: number;
  engagementChange: number;
  views: number;
  viewsChange: number;
  topContentTitle: string;
  topContentMetric: string;
  sparklineData: TimeSeriesPoint[];
}

export interface TikTokMetrics extends PlatformMetrics {
  platform: "tiktok";
  videoViews: number;
  avgWatchTime: number;
  shares: number;
}

export interface InstagramMetrics extends PlatformMetrics {
  platform: "instagram";
  reach: number;
  reachChange: number;
  saves: number;
  profileVisits: number;
}

export interface YouTubeMetrics extends PlatformMetrics {
  platform: "youtube";
  subscribers: number;
  watchTimeHours: number;
  ctr: number;
  avgViewDuration: string;
}

export interface BrevoMetrics extends PlatformMetrics {
  platform: "brevo";
  contacts: number;
  contactGrowth: number;
  openRate: number;
  clickRate: number;
  deliverabilityRate: number;
  lastCampaignName: string;
}

export interface UniversalMetric {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
}

export interface ContentItem {
  id: string;
  title: string;
  platform: Platform;
  status: "published" | "scheduled" | "draft";
  date: string;
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  thumbnail?: string;
  type: "video" | "image" | "carousel" | "reel" | "email" | "story";
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  platform: Platform;
  status: "published" | "scheduled" | "draft";
  type: ContentItem["type"];
}

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "completed" | "draft" | "paused";
  startDate: string;
  endDate: string;
  platforms: Platform[];
  goal: string;
  progress: number;
  metrics: {
    reach: number;
    engagement: number;
    conversions: number;
  };
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  sentDate: string;
  status: "sent" | "scheduled" | "draft";
  recipients: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
}

export interface VideoAnalytics {
  id: string;
  title: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watchTime?: number;
  avgViewDuration?: string;
  ctr?: number;
}

export interface AudienceDemographic {
  ageGroup: string;
  percentage: number;
}

export interface AudienceGender {
  gender: string;
  percentage: number;
}

export interface ApiConnection {
  platform: Platform;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  credentials: Record<string, string>;
}

export interface PostingTimeSlot {
  hour: number;
  day: number;
  engagement: number;
}
