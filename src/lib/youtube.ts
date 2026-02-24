const YT_BASE = "https://www.googleapis.com/youtube/v3";

async function ytFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY not set");

  const url = new URL(`${YT_BASE}${path}`);
  url.searchParams.set("key", apiKey);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API ${res.status}: ${body}`);
  }

  return res.json();
}

// ---- Types ----

interface YTChannelResponse {
  items: {
    snippet: {
      title: string;
      description: string;
      customUrl: string;
      publishedAt: string;
      thumbnails: { default: { url: string }; medium: { url: string }; high: { url: string } };
    };
    statistics: {
      viewCount: string;
      subscriberCount: string;
      hiddenSubscriberCount: boolean;
      videoCount: string;
    };
  }[];
}

interface YTSearchResponse {
  items: { id: { videoId: string } }[];
  nextPageToken?: string;
}

interface YTVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: { default: { url: string }; medium: { url: string }; high?: { url: string } };
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
    favoriteCount?: string;
  };
  contentDetails: {
    duration: string;
  };
}

interface YTVideosResponse {
  items: YTVideoItem[];
}

// ---- Public API ----

export async function getYouTubeChannelStats() {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) throw new Error("YOUTUBE_CHANNEL_ID not set");

  const data = await ytFetch<YTChannelResponse>("/channels", {
    part: "statistics,snippet",
    id: channelId,
  });

  const channel = data.items[0];
  if (!channel) throw new Error("Channel not found");

  return {
    title: channel.snippet.title,
    customUrl: channel.snippet.customUrl,
    thumbnail: channel.snippet.thumbnails.medium.url,
    subscribers: parseInt(channel.statistics.subscriberCount, 10),
    totalViews: parseInt(channel.statistics.viewCount, 10),
    videoCount: parseInt(channel.statistics.videoCount, 10),
    hiddenSubscribers: channel.statistics.hiddenSubscriberCount,
  };
}

export async function getYouTubeVideos(maxResults = 27) {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) throw new Error("YOUTUBE_CHANNEL_ID not set");

  // Step 1: Get video IDs via search
  const searchData = await ytFetch<YTSearchResponse>("/search", {
    part: "id",
    channelId,
    type: "video",
    order: "date",
    maxResults: String(maxResults),
  });

  const videoIds = searchData.items.map((item) => item.id.videoId);
  if (videoIds.length === 0) return [];

  // Step 2: Get video details + stats in one call
  const videosData = await ytFetch<YTVideosResponse>("/videos", {
    part: "statistics,snippet,contentDetails",
    id: videoIds.join(","),
  });

  return videosData.items.map((v) => ({
    id: v.id,
    title: v.snippet.title,
    publishedAt: v.snippet.publishedAt,
    thumbnail: v.snippet.thumbnails.medium.url,
    views: parseInt(v.statistics.viewCount || "0", 10),
    likes: parseInt(v.statistics.likeCount || "0", 10),
    comments: parseInt(v.statistics.commentCount || "0", 10),
    duration: parseDuration(v.contentDetails.duration),
    durationRaw: v.contentDetails.duration,
  }));
}

export async function getYouTubeDashboardData() {
  const [channel, videos] = await Promise.all([
    getYouTubeChannelStats(),
    getYouTubeVideos(),
  ]);

  // Compute derived metrics
  const totalVideoViews = videos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likes, 0);
  const totalComments = videos.reduce((sum, v) => sum + v.comments, 0);
  const avgViews = videos.length > 0 ? Math.round(totalVideoViews / videos.length) : 0;

  // Sort videos by views for top performers
  const sortedByViews = [...videos].sort((a, b) => b.views - a.views);

  return {
    channel,
    videos: sortedByViews,
    summary: {
      totalVideoViews,
      totalLikes,
      totalComments,
      avgViews,
      topVideo: sortedByViews[0] || null,
    },
  };
}

// ---- Helpers ----

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const h = parseInt(match[1] || "0", 10);
  const m = parseInt(match[2] || "0", 10);
  const s = parseInt(match[3] || "0", 10);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
