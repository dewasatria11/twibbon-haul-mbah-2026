import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Unique identifier for this website on the free cloud counter
    const targetUrl =
      "https://hits.sh/twibbon-haul-mbah-2026.alikhsan.ponpes.id.svg?view=today-total";

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TwibbonHaulMbahBot/1.0; +https://alikhsanbeji.ponpes.id)",
        Accept: "image/svg+xml,*/*",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Cloud counter returned status ${response.status}`);
    }

    const svg = await response.text();

    // hits.sh returns SVG with aria-label="hits: [today] / [total]" or similar
    const match =
      svg.match(/aria-label="[^:]+:\s*([0-9,]+)\s*\/\s*([0-9,]+)"/) ||
      svg.match(/<title>[^:]+:\s*([0-9,]+)\s*\/\s*([0-9,]+)<\/title>/);

    if (match) {
      const today = parseInt(match[1].replace(/,/g, ""), 10) || 1;
      const total = parseInt(match[2].replace(/,/g, ""), 10) || 1;

      return NextResponse.json(
        { today, total },
        {
          headers: {
            "Cache-Control": "no-store, max-age=0, must-revalidate",
          },
        }
      );
    }

    // Fallback if parsing didn't match format
    return NextResponse.json(
      { today: 1, total: 1 },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    // Graceful fallback so UI doesn't break
    return NextResponse.json(
      { today: 1, total: 1 },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  }
}
