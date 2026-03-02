import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Log the full URL
  const fullUrl = request.url;
  const searchParams = request.nextUrl.searchParams;

  // Extract all search params into an object
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = {
    fullUrl,
    searchString: request.nextUrl.search,
    parsedParams: params,
    paramCount: Object.keys(params).length,
    timestamp: new Date().toISOString(),
  };

  // Server-side logging (check Appwrite Sites logs)
  console.log("=== API ROUTE: /api/test-params ===");
  console.log("Full URL:", fullUrl);
  console.log("Search string:", request.nextUrl.search);
  console.log("Parsed params:", JSON.stringify(params));
  console.log("Param count:", Object.keys(params).length);
  console.log("===================================");

  return NextResponse.json(result);
}
