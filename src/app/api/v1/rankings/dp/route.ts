import { NextRequest, NextResponse } from "next/server";
import { getTopDpRankings } from "@/lib/kcaDb";

export async function GET(request: NextRequest) {
    try {
        const rankings = await getTopDpRankings(10);
        return NextResponse.json({ success: true, rankings });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
