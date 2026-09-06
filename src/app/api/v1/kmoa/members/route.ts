import { NextResponse } from "next/server";

const KMOA_BASE = "https://us-central1-jumper-b15aa.cloudfunctions.net/merchantApi";
const KMOA_API_KEY = process.env.KMOA_API_KEY || "";

const DEMO_MEMBERS = [
    { uid: "demo-uid-001", email: "c***1@gmail.com", displayName: "김치마니아", userLevel: 3, pointBalance: 12500, btBalance: 5, joinedAt: "2026-09-01T15:00:00.000Z" },
    { uid: "demo-uid-002", email: "u***2@naver.com", displayName: "K푸드러버", userLevel: 1, pointBalance: 3200, btBalance: 2, joinedAt: "2026-09-03T11:20:00.000Z" },
    { uid: "demo-uid-003", email: "h***3@kakao.com", displayName: "하노이단골", userLevel: 2, pointBalance: 8800, btBalance: 10, joinedAt: "2026-09-04T08:45:00.000Z" }
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "50";

    if (!KMOA_API_KEY) {
        return NextResponse.json({
            success: true, demo: true, connectionStatus: "demo",
            merchantId: "daehan-kimchi-hanoi", memberCount: 3,
            members: DEMO_MEMBERS
        });
    }

    try {
        const res = await fetch(`${KMOA_BASE}/v1/members?limit=${limit}`, {
            headers: { "x-api-key": KMOA_API_KEY },
            cache: "no-store"
        });

        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch { data = { success: false, error: text }; }

        if (res.ok && data.success) {
            return NextResponse.json({ ...data, connectionStatus: "live", demo: false });
        }

        console.warn("[K-MOA members] API error:", res.status, data?.error);
        return NextResponse.json({
            success: true, demo: true, connectionStatus: "error",
            apiError: data?.error || `HTTP ${res.status}`,
            merchantId: "daehan-kimchi-hanoi", memberCount: 3,
            members: DEMO_MEMBERS
        });

    } catch (err) {
        return NextResponse.json({
            success: true, demo: true, connectionStatus: "offline",
            merchantId: "daehan-kimchi-hanoi", memberCount: 3,
            members: DEMO_MEMBERS
        });
    }
}
