import { NextResponse } from "next/server";

const KMOA_BASE = "https://us-central1-jumper-b15aa.cloudfunctions.net/merchantApi";
const KMOA_API_KEY = process.env.KMOA_API_KEY || "";

const DEMO_DATA = {
    success: true,
    demo: true,
    connectionStatus: "demo",
    merchantId: "daehan-kimchi-hanoi",
    merchantName: "대한김치 본점 (하노이)",
    balance: { points: 500000, bt: 1500 }
};

export async function GET() {
    if (!KMOA_API_KEY) {
        return NextResponse.json(DEMO_DATA);
    }

    try {
        const res = await fetch(`${KMOA_BASE}/v1/balance`, {
            headers: { "x-api-key": KMOA_API_KEY },
            cache: "no-store"
        });

        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch { data = { success: false, error: text }; }

        if (res.ok && data.success) {
            return NextResponse.json({ ...data, connectionStatus: "live", demo: false });
        }

        // API Key 오류 or 서버 오류 → demo fallback
        console.warn("[K-MOA balance] API error:", res.status, data?.error);
        return NextResponse.json({
            ...DEMO_DATA,
            connectionStatus: "error",
            apiError: data?.error || `HTTP ${res.status}`
        });

    } catch (err) {
        console.error("[K-MOA balance] Fetch failed:", err);
        return NextResponse.json({
            ...DEMO_DATA,
            connectionStatus: "offline",
            apiError: "K-MOA 서버에 연결할 수 없습니다."
        });
    }
}
