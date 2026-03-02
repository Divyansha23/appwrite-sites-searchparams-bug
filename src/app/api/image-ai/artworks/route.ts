import { NextRequest, NextResponse } from "next/server";

/**
 * Mimics the reported issue scenario:
 * Frontend calls: api/image-ai/artworks?newestFirst=true&skip=20&limit=20
 * But server-side the search params are missing.
 */
export async function GET(request: NextRequest) {
  const fullUrl = request.url;
  const searchParams = request.nextUrl.searchParams;

  const newestFirst = searchParams.get("newestFirst");
  const skip = searchParams.get("skip");
  const limit = searchParams.get("limit");

  const result = {
    fullUrl,
    searchString: request.nextUrl.search,
    receivedParams: {
      newestFirst,
      skip,
      limit,
    },
    allParamsPresent: newestFirst !== null && skip !== null && limit !== null,
    timestamp: new Date().toISOString(),
  };

  // Server-side logging
  console.log("=== API ROUTE: /api/image-ai/artworks ===");
  console.log("Full URL:", fullUrl);
  console.log("Search string:", request.nextUrl.search);
  console.log("newestFirst:", newestFirst);
  console.log("skip:", skip);
  console.log("limit:", limit);
  console.log("All params present:", result.allParamsPresent);
  console.log("==========================================");

  // Simulate returning artworks data
  const artworks = Array.from({ length: Number(limit) || 5 }, (_, i) => ({
    id: (Number(skip) || 0) + i + 1,
    title: `Artwork ${(Number(skip) || 0) + i + 1}`,
  }));

  return NextResponse.json({
    ...result,
    artworks,
  });
}
