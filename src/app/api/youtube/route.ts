import { NextResponse } from "next/server";
import { getYouTubeDashboardData } from "@/lib/youtube";

export async function GET() {
  try {
    const data = await getYouTubeDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}
