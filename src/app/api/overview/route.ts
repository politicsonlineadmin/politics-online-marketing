import { NextResponse } from "next/server";
import { getBrevoDashboardData } from "@/lib/brevo";
import { getYouTubeDashboardData } from "@/lib/youtube";

export async function GET() {
  try {
    const [brevo, youtube] = await Promise.allSettled([
      getBrevoDashboardData(),
      getYouTubeDashboardData(),
    ]);

    const brevoData = brevo.status === "fulfilled" ? brevo.value : null;
    const youtubeData = youtube.status === "fulfilled" ? youtube.value : null;

    return NextResponse.json({
      brevo: brevoData,
      youtube: youtubeData,
      // TikTok and Instagram not yet integrated — frontend will use mock
      tiktok: null,
      instagram: null,
    });
  } catch (error) {
    console.error("Overview API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch overview data" },
      { status: 500 }
    );
  }
}
