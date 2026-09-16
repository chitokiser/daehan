import { NextRequest, NextResponse } from "next/server";
import { getTopDpRankings } from "@/lib/kcaDb";

export async function GET(request: NextRequest) {
    try {
        const rankings = await getTopDpRankings(10);
        return NextResponse.json({ success: true, rankings });
    } catch (e: any) {
        console.error("DP Rankings API Error:", e);
        return NextResponse.json({ success: true, rankings: [] });
    }
}
