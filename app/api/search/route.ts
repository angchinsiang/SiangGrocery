import meili from "@/lib/meilisearch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ hits: [] });

  const limit = Math.min(
    Number(request.nextUrl.searchParams.get("limit")) || 8,
    50
  );

  try {
    const results = await meili.index("groceries").search(q, { limit });
    return NextResponse.json({ hits: results.hits });
  } catch (error) {
    console.error("Meilisearch error:", error);
    return NextResponse.json({ hits: [], error: "Search unavailable" }, { status: 503 });
  }
}
