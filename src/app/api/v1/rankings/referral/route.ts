import { NextRequest, NextResponse } from "next/server";
import { getTopReferralRankings } from "@/lib/kcaDb";

export async function GET(request: NextRequest) {
    try {
        const rankings = await getTopReferralRankings(10);
        return NextResponse.json({ success: true, rankings });
    } catch (e: any) {
        console.error("Referral Rankings API Error:", e);
        return NextResponse.json({ success: true, rankings: [] });
    }
}
