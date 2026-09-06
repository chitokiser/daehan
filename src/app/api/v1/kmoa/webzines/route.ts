import { NextResponse } from "next/server";

const KMOA_BASE = "https://us-central1-jumper-b15aa.cloudfunctions.net/merchantApi";
const KMOA_API_KEY = process.env.KMOA_API_KEY || "";

const DEMO_WEBZINES = [
    {
        webzineId: "demo-wz-001",
        title: "하노이 K-푸드 최고 맛집, 대한김치의 진가를 알아보자!",
        excerpt: "최근 한류의 열풍과 더불어 K-푸드가 큰 사랑을 받고 있습니다. 그 중에서도 한국의 소울푸드인 김치를 전문적으로 제조·판매하는 대한김치가 하노이 현지인들에게 폭발적인 반응을 얻고 있습니다.",
        thumbnailUrl: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=800&q=80",
        viewCount: 320, likeCount: 15, shareCount: 4,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-001",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-001&whitelabel=true",
        publishedAt: "2026-09-05T15:20:00.000Z"
    },
    {
        webzineId: "demo-wz-002",
        title: "유산균 가득한 김치, 베트남 건강식 트렌드를 선도하다",
        excerpt: "베트남 하노이 현지 소비자들 사이에서 발효식품에 대한 관심이 급격히 높아지고 있습니다. 대한김치의 HACCP 인증 제품이 건강한 식탁의 필수 아이템으로 자리잡은 비결을 공개합니다.",
        thumbnailUrl: "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=800&q=80",
        viewCount: 215, likeCount: 28, shareCount: 9,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-002",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-002&whitelabel=true",
        publishedAt: "2026-09-03T10:00:00.000Z"
    },
    {
        webzineId: "demo-wz-003",
        title: "달랏 고랭지 유기농 배추로 빚은 프리미엄 포기김치",
        excerpt: "해발 1,500m 달랏 고원에서 재배한 유기농 배추를 엄선하여 담근 대한김치의 시그니처 포기김치. 아삭한 식감과 깊은 발효 향의 비밀을 지금 공개합니다.",
        thumbnailUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
        viewCount: 178, likeCount: 41, shareCount: 12,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-003",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-003&whitelabel=true",
        publishedAt: "2026-09-01T08:30:00.000Z"
    }
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "20";

    if (!KMOA_API_KEY) {
        return NextResponse.json({
            success: true, demo: true, connectionStatus: "demo",
            merchantId: "daehan-kimchi-hanoi", webzineCount: 3,
            webzines: DEMO_WEBZINES
        });
    }

    try {
        const res = await fetch(`${KMOA_BASE}/v1/webzines?limit=${limit}`, {
            headers: { "x-api-key": KMOA_API_KEY },
            cache: "no-store"
        });

        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch { data = { success: false, error: text }; }

        if (res.ok && data.success) {
            return NextResponse.json({ ...data, connectionStatus: "live", demo: false });
        }

        console.warn("[K-MOA webzines] API error:", res.status, data?.error);
        return NextResponse.json({
            success: true, demo: true, connectionStatus: "error",
            apiError: data?.error || `HTTP ${res.status}`,
            merchantId: "daehan-kimchi-hanoi", webzineCount: 3,
            webzines: DEMO_WEBZINES
        });

    } catch {
        return NextResponse.json({
            success: true, demo: true, connectionStatus: "offline",
            merchantId: "daehan-kimchi-hanoi", webzineCount: 3,
            webzines: DEMO_WEBZINES
        });
    }
}
