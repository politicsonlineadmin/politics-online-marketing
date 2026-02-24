import {
  TikTokMetrics,
  InstagramMetrics,
  YouTubeMetrics,
  BrevoMetrics,
  UniversalMetric,
  ContentItem,
  CalendarEvent,
  Campaign,
  EmailCampaign,
  VideoAnalytics,
  AudienceDemographic,
  AudienceGender,
  TimeSeriesPoint,
  PostingTimeSlot,
} from "./types";

function generateSparkline(days: number, base: number, volatility: number, trend: number): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  let value = base;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    value = value + (Math.random() - 0.45) * volatility + trend;
    data.push({ date: date.toISOString().split("T")[0], value: Math.round(Math.max(0, value)) });
  }
  return data;
}

// Universal Metrics
export const universalMetrics: UniversalMetric[] = [
  { label: "Total Followers", value: "47.2K", change: 12.3, trend: "up" },
  { label: "Total Views (30d)", value: "1.2M", change: 8.7, trend: "up" },
  { label: "Engagement Rate", value: "4.8%", change: 0.3, trend: "up" },
  { label: "Content Published", value: "64", change: -5, trend: "down" },
  { label: "Email Subscribers", value: "8,430", change: 3.2, trend: "up" },
  { label: "Avg. Watch Time", value: "1m 42s", change: 11, trend: "up" },
];

// Platform Metrics
export const tiktokMetrics: TikTokMetrics = {
  platform: "tiktok",
  followers: 18400,
  followerGrowth: 15.2,
  engagement: 6.8,
  engagementChange: 1.2,
  views: 842000,
  viewsChange: 22.5,
  videoViews: 842000,
  avgWatchTime: 24.5,
  shares: 3200,
  topContentTitle: "Why Parliament Actually Works Like This",
  topContentMetric: "124K views",
  sparklineData: generateSparkline(30, 15000, 200, 80),
};

export const instagramMetrics: InstagramMetrics = {
  platform: "instagram",
  followers: 12800,
  followerGrowth: 8.4,
  engagement: 4.2,
  engagementChange: -0.3,
  views: 234000,
  viewsChange: 5.1,
  reach: 89000,
  reachChange: 12.3,
  saves: 4500,
  profileVisits: 6700,
  topContentTitle: "UK Constitution Explained in 60s",
  topContentMetric: "8.2K likes",
  sparklineData: generateSparkline(30, 11000, 150, 50),
};

export const youtubeMetrics: YouTubeMetrics = {
  platform: "youtube",
  followers: 7600,
  followerGrowth: 5.8,
  engagement: 3.4,
  engagementChange: 0.7,
  views: 156000,
  viewsChange: 14.2,
  subscribers: 7600,
  watchTimeHours: 12400,
  ctr: 6.2,
  avgViewDuration: "8:34",
  topContentTitle: "A-Level Politics: The FULL Electoral Systems Guide",
  topContentMetric: "32K views",
  sparklineData: generateSparkline(30, 6800, 80, 25),
};

export const brevoMetrics: BrevoMetrics = {
  platform: "brevo",
  followers: 8430,
  followerGrowth: 3.2,
  engagement: 24.5,
  engagementChange: 2.1,
  views: 0,
  viewsChange: 0,
  contacts: 8430,
  contactGrowth: 3.2,
  openRate: 42.8,
  clickRate: 8.6,
  deliverabilityRate: 98.2,
  lastCampaignName: "Weekly Politics Digest #47",
  topContentTitle: "Weekly Politics Digest #47",
  topContentMetric: "42.8% open rate",
  sparklineData: generateSparkline(30, 7800, 50, 20),
};

// Cross-platform growth data (90 days)
export const growthData = {
  tiktok: generateSparkline(90, 12000, 300, 70),
  instagram: generateSparkline(90, 9500, 180, 35),
  youtube: generateSparkline(90, 5800, 100, 20),
  brevo: generateSparkline(90, 7000, 60, 15),
};

// Engagement comparison data
export const engagementComparison = [
  { platform: "TikTok", engagement: 6.8, benchmark: 4.2 },
  { platform: "Instagram", engagement: 4.2, benchmark: 3.1 },
  { platform: "YouTube", engagement: 3.4, benchmark: 2.8 },
  { platform: "Brevo", engagement: 24.5, benchmark: 18.0 },
];

// Content items
export const contentItems: ContentItem[] = [
  { id: "1", title: "Why Parliament Actually Works Like This", platform: "tiktok", status: "published", date: "2026-02-20", type: "video", metrics: { views: 124000, likes: 8900, comments: 342, shares: 1200 } },
  { id: "2", title: "UK Constitution Explained in 60s", platform: "instagram", status: "published", date: "2026-02-19", type: "reel", metrics: { views: 45000, likes: 8200, comments: 156, shares: 890 } },
  { id: "3", title: "A-Level Politics: Electoral Systems Guide", platform: "youtube", status: "published", date: "2026-02-18", type: "video", metrics: { views: 32000, likes: 2100, comments: 287, shares: 450 } },
  { id: "4", title: "PM vs President: Power Compared", platform: "tiktok", status: "published", date: "2026-02-17", type: "video", metrics: { views: 98000, likes: 7200, comments: 512, shares: 980 } },
  { id: "5", title: "5 Things About the Supreme Court", platform: "instagram", status: "published", date: "2026-02-16", type: "carousel", metrics: { views: 28000, likes: 3400, comments: 89, shares: 320 } },
  { id: "6", title: "How Bills Become Laws — Full Breakdown", platform: "youtube", status: "scheduled", date: "2026-02-26", type: "video" },
  { id: "7", title: "Devolution Explained Simply", platform: "tiktok", status: "scheduled", date: "2026-02-27", type: "video" },
  { id: "8", title: "Weekly Politics Digest #48", platform: "brevo", status: "scheduled", date: "2026-02-28", type: "email" },
  { id: "9", title: "Pressure Groups: Insider vs Outsider", platform: "instagram", status: "draft", date: "2026-02-24", type: "carousel" },
  { id: "10", title: "Voting Behaviour Deep Dive", platform: "youtube", status: "draft", date: "2026-02-24", type: "video" },
  { id: "11", title: "FPTP vs PR — Which is Better?", platform: "tiktok", status: "published", date: "2026-02-15", type: "video", metrics: { views: 67000, likes: 5100, comments: 678, shares: 890 } },
  { id: "12", title: "Parliament Quiz — Test Yourself!", platform: "instagram", status: "published", date: "2026-02-14", type: "story", metrics: { views: 15000, likes: 2200, comments: 45 } },
];

// Calendar events
export const calendarEvents: CalendarEvent[] = [
  { id: "c1", title: "TikTok: Devolution Explained", date: "2026-02-27", time: "18:00", platform: "tiktok", status: "scheduled", type: "video" },
  { id: "c2", title: "YouTube: How Bills Become Laws", date: "2026-02-26", time: "14:00", platform: "youtube", status: "scheduled", type: "video" },
  { id: "c3", title: "Email: Weekly Digest #48", date: "2026-02-28", time: "09:00", platform: "brevo", status: "scheduled", type: "email" },
  { id: "c4", title: "IG: Rights & Liberties Carousel", date: "2026-03-02", time: "12:00", platform: "instagram", status: "scheduled", type: "carousel" },
  { id: "c5", title: "TikTok: Parliament Works Like This", date: "2026-02-20", time: "18:00", platform: "tiktok", status: "published", type: "video" },
  { id: "c6", title: "IG: Constitution in 60s", date: "2026-02-19", time: "11:00", platform: "instagram", status: "published", type: "reel" },
  { id: "c7", title: "YouTube: Electoral Systems", date: "2026-02-18", time: "15:00", platform: "youtube", status: "published", type: "video" },
  { id: "c8", title: "TikTok: PM vs President", date: "2026-02-17", time: "17:30", platform: "tiktok", status: "published", type: "video" },
  { id: "c9", title: "Email: Weekly Digest #47", date: "2026-02-21", time: "09:00", platform: "brevo", status: "published", type: "email" },
  { id: "c10", title: "YouTube: Judiciary Explained", date: "2026-03-04", time: "14:00", platform: "youtube", status: "scheduled", type: "video" },
  { id: "c11", title: "TikTok: Quick Quiz — PM Powers", date: "2026-03-01", time: "18:00", platform: "tiktok", status: "scheduled", type: "video" },
  { id: "c12", title: "IG: Exam Tips Post", date: "2026-02-25", time: "10:00", platform: "instagram", status: "scheduled", type: "image" },
];

// Campaigns
export const campaigns: Campaign[] = [
  { id: "camp1", name: "Exam Season Push 2026", status: "active", startDate: "2026-02-01", endDate: "2026-04-30", platforms: ["tiktok", "instagram", "youtube", "brevo"], goal: "Increase followers by 20% before exam season", progress: 62, metrics: { reach: 450000, engagement: 32000, conversions: 1200 } },
  { id: "camp2", name: "YouTube Long-Form Growth", status: "active", startDate: "2026-01-15", endDate: "2026-03-31", platforms: ["youtube"], goal: "Grow subscribers to 10K", progress: 76, metrics: { reach: 180000, engagement: 12000, conversions: 800 } },
  { id: "camp3", name: "Email List Builder", status: "active", startDate: "2026-01-01", endDate: "2026-06-30", platforms: ["brevo", "instagram"], goal: "Reach 10K email subscribers", progress: 84, metrics: { reach: 95000, engagement: 8500, conversions: 2100 } },
  { id: "camp4", name: "January Revision Blitz", status: "completed", startDate: "2026-01-05", endDate: "2026-01-31", platforms: ["tiktok", "instagram"], goal: "Drive traffic to revision resources", progress: 100, metrics: { reach: 320000, engagement: 28000, conversions: 3400 } },
  { id: "camp5", name: "Spring Term Launch", status: "draft", startDate: "2026-03-01", endDate: "2026-03-31", platforms: ["tiktok", "instagram", "youtube"], goal: "Launch new topic series", progress: 0, metrics: { reach: 0, engagement: 0, conversions: 0 } },
];

// Email campaigns
export const emailCampaigns: EmailCampaign[] = [
  { id: "em1", name: "Weekly Politics Digest #47", subject: "This Week in UK Politics + Free Revision Card", sentDate: "2026-02-21", status: "sent", recipients: 8430, openRate: 42.8, clickRate: 8.6, bounceRate: 1.2, unsubscribeRate: 0.3 },
  { id: "em2", name: "Weekly Politics Digest #46", subject: "Supreme Court Special + Practice Questions", sentDate: "2026-02-14", status: "sent", recipients: 8210, openRate: 39.5, clickRate: 7.2, bounceRate: 1.1, unsubscribeRate: 0.2 },
  { id: "em3", name: "Weekly Politics Digest #45", subject: "Electoral Systems Breakdown Inside", sentDate: "2026-02-07", status: "sent", recipients: 7980, openRate: 44.1, clickRate: 9.8, bounceRate: 0.9, unsubscribeRate: 0.1 },
  { id: "em4", name: "Exam Season Kickoff", subject: "Your A-Level Politics Revision Starts NOW", sentDate: "2026-02-01", status: "sent", recipients: 7800, openRate: 52.3, clickRate: 14.2, bounceRate: 1.0, unsubscribeRate: 0.4 },
  { id: "em5", name: "Weekly Politics Digest #48", subject: "Devolution & the Union — What You Need to Know", sentDate: "2026-02-28", status: "scheduled", recipients: 8500, openRate: 0, clickRate: 0, bounceRate: 0, unsubscribeRate: 0 },
];

// TikTok video analytics
export const tiktokVideos: VideoAnalytics[] = [
  { id: "tv1", title: "Why Parliament Actually Works Like This", date: "2026-02-20", views: 124000, likes: 8900, comments: 342, shares: 1200, watchTime: 18.5 },
  { id: "tv2", title: "PM vs President: Power Compared", date: "2026-02-17", views: 98000, likes: 7200, comments: 512, shares: 980, watchTime: 22.1 },
  { id: "tv3", title: "FPTP vs PR — Which is Better?", date: "2026-02-15", views: 67000, likes: 5100, comments: 678, shares: 890, watchTime: 26.3 },
  { id: "tv4", title: "What Does the Speaker Actually Do?", date: "2026-02-12", views: 54000, likes: 4200, comments: 234, shares: 560, watchTime: 19.8 },
  { id: "tv5", title: "3 Things About Royal Prerogative", date: "2026-02-10", views: 45000, likes: 3800, comments: 189, shares: 420, watchTime: 15.2 },
  { id: "tv6", title: "Quick Revision: Constitution Sources", date: "2026-02-08", views: 38000, likes: 2900, comments: 156, shares: 380, watchTime: 21.4 },
];

// YouTube video analytics
export const youtubeVideos: VideoAnalytics[] = [
  { id: "yv1", title: "A-Level Politics: The FULL Electoral Systems Guide", date: "2026-02-18", views: 32000, likes: 2100, comments: 287, shares: 450, avgViewDuration: "8:34", ctr: 7.2 },
  { id: "yv2", title: "Parliament Explained: Commons vs Lords", date: "2026-02-11", views: 28000, likes: 1800, comments: 198, shares: 320, avgViewDuration: "10:12", ctr: 6.8 },
  { id: "yv3", title: "UK Constitution Deep Dive", date: "2026-02-04", views: 24000, likes: 1500, comments: 234, shares: 280, avgViewDuration: "12:45", ctr: 5.9 },
  { id: "yv4", title: "Voting Behaviour: What Makes People Vote?", date: "2026-01-28", views: 21000, likes: 1400, comments: 312, shares: 190, avgViewDuration: "9:23", ctr: 6.4 },
  { id: "yv5", title: "Devolution: Scotland, Wales & NI", date: "2026-01-21", views: 18000, likes: 1200, comments: 167, shares: 210, avgViewDuration: "11:08", ctr: 5.5 },
];

// Audience demographics
export const audienceDemographics: AudienceDemographic[] = [
  { ageGroup: "13-17", percentage: 42 },
  { ageGroup: "18-24", percentage: 35 },
  { ageGroup: "25-34", percentage: 12 },
  { ageGroup: "35-44", percentage: 6 },
  { ageGroup: "45+", percentage: 5 },
];

export const audienceGender: AudienceGender[] = [
  { gender: "Female", percentage: 48 },
  { gender: "Male", percentage: 44 },
  { gender: "Other", percentage: 8 },
];

export const audienceTopLocations = [
  { location: "London", percentage: 18 },
  { location: "Manchester", percentage: 9 },
  { location: "Birmingham", percentage: 8 },
  { location: "Leeds", percentage: 6 },
  { location: "Bristol", percentage: 5 },
  { location: "Edinburgh", percentage: 5 },
  { location: "Glasgow", percentage: 4 },
  { location: "Cardiff", percentage: 3 },
];

// Posting time heatmap data (TikTok)
export const postingHeatmap: PostingTimeSlot[] = (() => {
  const data: PostingTimeSlot[] = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  for (let d = 0; d < 7; d++) {
    for (let h = 6; h <= 23; h++) {
      let engagement = Math.random() * 40 + 10;
      // Higher engagement after school/evening
      if (h >= 16 && h <= 20) engagement += 40;
      if (h >= 20 && h <= 22) engagement += 25;
      // Weekend midday boost
      if ((d === 5 || d === 6) && h >= 11 && h <= 15) engagement += 30;
      data.push({ hour: h, day: d, engagement: Math.round(engagement) });
    }
  }
  return data;
})();

// Traffic sources (YouTube)
export const youtubeTrafficSources = [
  { source: "YouTube Search", percentage: 38, views: 59280 },
  { source: "Suggested Videos", percentage: 24, views: 37440 },
  { source: "Browse Features", percentage: 15, views: 23400 },
  { source: "External (TikTok/IG)", percentage: 12, views: 18720 },
  { source: "Direct / URL", percentage: 7, views: 10920 },
  { source: "Other", percentage: 4, views: 6240 },
];

// YouTube retention curve
export const youtubeRetention = [
  { time: "0:00", retention: 100 },
  { time: "0:30", retention: 82 },
  { time: "1:00", retention: 71 },
  { time: "2:00", retention: 62 },
  { time: "3:00", retention: 55 },
  { time: "4:00", retention: 50 },
  { time: "5:00", retention: 46 },
  { time: "6:00", retention: 42 },
  { time: "7:00", retention: 38 },
  { time: "8:00", retention: 35 },
  { time: "9:00", retention: 32 },
  { time: "10:00", retention: 28 },
];
