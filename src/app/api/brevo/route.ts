import { NextResponse } from "next/server";
import { getBrevoDashboardData } from "@/lib/brevo";

export async function GET() {
  try {
    const data = await getBrevoDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Brevo API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch Brevo data" },
      { status: 500 }
    );
  }
}
