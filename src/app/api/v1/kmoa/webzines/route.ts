import { NextResponse } from "next/server";

const KMOA_BASE = "https://us-central1-jumper-b15aa.cloudfunctions.net/merchantApi";
const KMOA_API_KEY = process.env.KMOA_API_KEY || "";

const DEMO_WEBZINES = [
    {
        webzineId: "demo-wz-001",
        title: "하노이 프리미엄 K-푸드의 시작, 대한김치의 진가",
        excerpt: "최근 한류의 열풍과 더불어 한국의 소울푸드인 김치를 전문적으로 제조·판매하는 대한김치가 하노이 현지인들에게 폭발적인 반응을 얻고 있습니다.",
        thumbnailUrl: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=800&q=80",
        viewCount: 320, likeCount: 15, shareCount: 4,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-001",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-001&whitelabel=true",
        publishedAt: "2026-09-08T15:20:00.000Z"
    },
    {
        webzineId: "demo-wz-002",
        title: "유산균 가득한 김치, 베트남 건강식 트렌드를 선도하다",
        excerpt: "베트남 하노이 현지 소비자들 사이에서 발효식품에 대한 관심이 급격히 높아지고 있습니다. 대한김치의 무균 공정 제품이 건강한 식탁의 필수 아이템으로 자리잡은 비결을 공개합니다.",
        thumbnailUrl: "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=800&q=80",
        viewCount: 215, likeCount: 28, shareCount: 9,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-002",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-002&whitelabel=true",
        publishedAt: "2026-09-07T10:00:00.000Z"
    },
    {
        webzineId: "demo-wz-003",
        title: "달랏 고랭지 유기농 배추로 빚은 프리미엄 포기김치",
        excerpt: "해발 1,500m 달랏 고원에서 재배한 유기농 배추를 엄선하여 담근 대한김치의 시그니처 포기김치. 아삭한 식감과 깊은 발효 향의 비밀을 지금 확인해보세요.",
        thumbnailUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
        viewCount: 178, likeCount: 41, shareCount: 12,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-003",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-003&whitelabel=true",
        publishedAt: "2026-09-06T08:30:00.000Z"
    },
    {
        webzineId: "demo-wz-004",
        title: "김치 숙성 과학, 1.8°C 저온 항온 제어의 비밀",
        excerpt: "김치의 황금 비율 산도(pH 4.2)를 유지하기 위해 도입된 대한김치의 스마트 숙성 시스템. 사계절 더운 하노이에서도 일관된 맛을 내는 기술력을 소개합니다.",
        thumbnailUrl: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=800&q=80",
        viewCount: 450, likeCount: 88, shareCount: 24,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-004",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-004&whitelabel=true",
        publishedAt: "2026-09-05T14:15:00.000Z"
    },
    {
        webzineId: "demo-wz-005",
        title: "당신만의 8각 미각 DNA, 김치 매칭 알고리즘",
        excerpt: "매운맛, 산미, 감칠맛 등 8가지 미각 축을 분석하여 내 입맛에 딱 맞는 숙성일수를 추천해주는 대한김치만의 AI 큐레이션 서비스를 체험해보세요.",
        thumbnailUrl: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80",
        viewCount: 512, likeCount: 102, shareCount: 35,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-005",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-005&whitelabel=true",
        publishedAt: "2026-09-04T09:00:00.000Z"
    },
    {
        webzineId: "demo-wz-006",
        title: "하노이 파인다이닝 셰프들이 선택한 대한김치",
        excerpt: "베트남 현지 최고급 레스토랑의 셰프들이 대한김치를 활용하여 만들어낸 독창적인 파인다이닝 코스와 그들의 리뷰를 독점 공개합니다.",
        thumbnailUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
        viewCount: 890, likeCount: 156, shareCount: 89,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-006",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-006&whitelabel=true",
        publishedAt: "2026-09-03T18:45:00.000Z"
    },
    {
        webzineId: "demo-wz-007",
        title: "현지 입맛을 사로잡은 퓨전 김치 요리 Best 3",
        excerpt: "김치 반미(Banh Mi), 김치 쌀국수 볶음, 그리고 김치 짜조까지. 하노이 젊은 세대 사이에서 유행하는 트렌디한 김치 퓨전 레시피를 따라해 보세요.",
        thumbnailUrl: "https://images.unsplash.com/photo-1555126634-42328054c25f?auto=format&fit=crop&w=800&q=80",
        viewCount: 620, likeCount: 130, shareCount: 55,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-007",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-007&whitelabel=true",
        publishedAt: "2026-09-02T11:20:00.000Z"
    },
    {
        webzineId: "demo-wz-008",
        title: "전통 손맛과 AI의 만남, 하노이 스마트 팩토리 르포",
        excerpt: "100% 자동화 에어샤워, 정밀 세척 시스템, 그리고 AI 비전 검수까지. 정통 한국 김치 레시피를 완벽하게 재현하는 대한김치 클린룸 팩토리 투어.",
        thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        viewCount: 410, likeCount: 75, shareCount: 18,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-008",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-008&whitelabel=true",
        publishedAt: "2026-09-01T16:00:00.000Z"
    },
    {
        webzineId: "demo-wz-009",
        title: "비건(Vegan) 소비자를 위한 100% 식물성 김치 출시",
        excerpt: "젓갈 알러지가 있거나 채식을 지향하는 소비자들을 위해 감칠맛 나는 대체 액젓으로 만든 대한김치 비건 라인업이 드디어 론칭되었습니다.",
        thumbnailUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        viewCount: 750, likeCount: 210, shareCount: 142,
        readUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-009",
        whitelabelUrl: "https://kmoa.netlify.app/kca_webzine.html?id=demo-wz-009&whitelabel=true",
        publishedAt: "2026-08-31T08:00:00.000Z"
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
