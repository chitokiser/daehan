import { NextResponse } from "next/server";

const KMOA_BASE = "https://us-central1-jumper-b15aa.cloudfunctions.net/merchantApi";
const KMOA_API_KEY = process.env.KMOA_API_KEY || "";

// 대한김치 실제 제품 및 공장 사진을 활용한 고품질 아티클 풀
const WEBZINE_ARTICLE_POOL = [
    {
        poolId: "wz-01",
        title: "하노이 프리미엄 K-푸드의 기준, 대한김치 포기김치",
        excerpt: "100% 엄선된 한국산 원료와 달랏 고랭지 배추로 담근 대한김치의 시그니처 포기김치. 하노이 현지에서 전하는 정통 깊은 손맛.",
        thumbnailUrl: "/images/products/pogi.jpg",
        whitelabelId: "demo-wz-001"
    },
    {
        poolId: "wz-02",
        title: "아삭함과 시원한 유산균의 만남, 대한김치 깍두기",
        excerpt: "한 입 크기의 알맞은 단단함과 상쾌한 무의 유산균 발효. 사계절 건강한 한식 식탁을 만드는 깍두기 발효 과학.",
        thumbnailUrl: "/images/products/kkakdugi.jpg",
        whitelabelId: "demo-wz-002"
    },
    {
        poolId: "wz-03",
        title: "달랏 고원 1,500m 원료와 알싸한 총각김치의 비결",
        excerpt: "해발 1,500m 청정 고원에서 수확한 유기농 알타리 무로 만드는 대한김치 별미 총각김치 레시피 공개.",
        thumbnailUrl: "/images/products/chonggak.jpg",
        whitelabelId: "demo-wz-003"
    },
    {
        poolId: "wz-04",
        title: "HACCP CODEX 2020 국제 인증 스마트 무균 팩토리",
        excerpt: "100% 자동화 에어샤워와 초위생 세척 공정, 정밀 온도 제어 시스템을 갖춘 하노이 동안 소재 클린룸 투어.",
        thumbnailUrl: "/images/factory/1788250057286_910087481450589245_g8397836875365957143_a1f83771478661ade08188ee88eaeea2.jpg",
        whitelabelId: "demo-wz-004"
    },
    {
        poolId: "wz-05",
        title: "톡 쏘는 남도 스타일 갓김치 & 청량한 열무김치",
        excerpt: "알싸한 갓의 향기가 피어나는 프리미엄 갓김치와 여름철 시원함을 선사하는 열무김치의 앙상블.",
        thumbnailUrl: "/images/products/gatkimchi.jpg",
        whitelabelId: "demo-wz-005"
    },
    {
        poolId: "wz-06",
        title: "1.8°C 저온 숙성의 비밀, 300일 항온 발효 묵은지",
        excerpt: "김치찌개, 김치찜, 김치전 어디에 넣어도 특유의 산도(pH 4.2)와 깊은 감칠맛을 완성하는 명품 묵은지.",
        thumbnailUrl: "/images/products/mookeunji.jpg",
        whitelabelId: "demo-wz-006"
    },
    {
        poolId: "wz-07",
        title: "삼겹살과 짜장라면의 영혼 파트너, 대한김치 파김치",
        excerpt: "알싸한 파의 알리신 성분과 한국 정통 양념이 어우러져 한층 깊은 미각을 깨우는 알싸한 파김치.",
        thumbnailUrl: "/images/products/pakimchi.jpg",
        whitelabelId: "demo-wz-007"
    },
    {
        poolId: "wz-08",
        title: "여름철 최고의 쿨링 별미, 아삭 오이소박이",
        excerpt: "싱싱한 오이 속에 부추와 고춧가루 특제 양념을 꽉 채워 청량함과 감칠맛을 극대화한 오이소박이.",
        thumbnailUrl: "/images/products/oisobagi.jpg",
        whitelabelId: "demo-wz-008"
    },
    {
        poolId: "wz-09",
        title: "한 장 한 장 손맛으로 담근 향긋한 깻잎김치",
        excerpt: "밥도둑 대표 주자! 은은한 깻잎 향과 대한김치 비법 양념장의 짭조름한 조화.",
        thumbnailUrl: "/images/products/kkaennip.jpg",
        whitelabelId: "demo-wz-009"
    },
    {
        poolId: "wz-10",
        title: "화끈하고 중독적인 매운맛, 대한김치 실비김치",
        excerpt: "매운맛 마니아들을 사로잡은 화끈한 청양고춧가루 특제 실비김치. 스트레스를 단번에 날려버리는 맛.",
        thumbnailUrl: "/images/products/silbi.jpg",
        whitelabelId: "demo-wz-001"
    },
    {
        poolId: "wz-11",
        title: "국물 요리의 완성, 큼직한 석박지 & 대파김치",
        excerpt: "설렁탕, 곰탕, 칼국수의 맛을 200% 끌어올려주는 큼직한 석박지와 진한 대파김치 제안.",
        thumbnailUrl: "/images/products/daepa.jpg",
        whitelabelId: "demo-wz-002"
    },
    {
        poolId: "wz-12",
        title: "신선도를 지키는 콜드체인 물류 및 저온 창고 라인업",
        excerpt: "제조부터 배송까지 끊김 없는 1.8°C 신선 콜드체인 시스템으로 하노이 전역에 갓 담근 김치 전달.",
        thumbnailUrl: "/images/factory/1788249934313_910087481450589245_g8397836875365957143_dfd4c34e7fa1b44a31af91205c2fcd77.jpg",
        whitelabelId: "demo-wz-003"
    },
    {
        poolId: "wz-13",
        title: "정갈하고 언제나 신선한 대한김치 맛김치",
        excerpt: "한 입 크기로 손질되어 바로 꺼내 먹기 편한 프리미엄 맛김치. 가정 및 업소용 최적의 선택.",
        thumbnailUrl: "/images/products/matkimchi.jpg",
        whitelabelId: "demo-wz-004"
    },
    {
        poolId: "wz-14",
        title: "부드럽고 연한 봄철 별미, 얼갈이 배추김치",
        excerpt: "갓 겉절이처럼 풋풋하고 부드러운 식감이 살아있는 대한김치 얼갈이 김치 큐레이션.",
        thumbnailUrl: "/images/products/eolgari.jpg",
        whitelabelId: "demo-wz-005"
    },
    {
        poolId: "wz-15",
        title: "시원한 동치미 육수 국물의 열무물김치",
        excerpt: "국수를 말아 드시면 극상의 시원함을 자랑하는 특제 열무물김치 발효 노하우.",
        thumbnailUrl: "/images/products/yeolmu.jpg",
        whitelabelId: "demo-wz-006"
    },
    {
        poolId: "wz-16",
        title: "대한김치 무균 에어샤워 및 이물질 0% 검수 공정",
        excerpt: "클린룸 입장부터 이중 에어샤워, 자외선 살균 소독으로 이물질 발생 가능성을 철저히 차단.",
        thumbnailUrl: "/images/factory/20260903_114509.png",
        whitelabelId: "demo-wz-007"
    },
    {
        poolId: "wz-17",
        title: "아삭하고 새콤달콤한 별미, 양파김치 & 쪽파김치",
        excerpt: "양파의 단맛과 양념의 감칠맛이 어우러져 고기 요리와 최고의 조화를 이루는 프리미엄 양파김치.",
        thumbnailUrl: "/images/products/yangpa.jpg",
        whitelabelId: "demo-wz-008"
    },
    {
        poolId: "wz-18",
        title: "100% 자동 세척 시스템과 스마트 비전 검수",
        excerpt: "버블 세척과 농약 잔류 정밀 검사 시스템으로 위생 안전을 확립하는 하노이 공장 현장.",
        thumbnailUrl: "/images/factory/1788250016539_910087481450589245_g8397836875365957143_75b5eb0727148146cea7e19b352438a4.jpg",
        whitelabelId: "demo-wz-009"
    }
];

// 하루에 하나씩 자동 업그레이드/발행되는 로직
function getAutoUpgradedWebzines(limitCount: number = 20) {
    const now = new Date();
    // 기준 앵커 날짜
    const anchorDate = new Date("2026-01-01T00:00:00Z");
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysElapsed = Math.floor((now.getTime() - anchorDate.getTime()) / msPerDay);

    const poolLen = WEBZINE_ARTICLE_POOL.length;
    const webzines = [];

    for (let i = 0; i < Math.min(limitCount, poolLen); i++) {
        // 매일 00시 기준, 오늘 아티클 인덱스가 +1 증가하여 상단에 오늘 날짜로 자동 신규 발행
        const poolIndex = (daysElapsed - i + poolLen * 1000) % poolLen;
        const baseArticle = WEBZINE_ARTICLE_POOL[poolIndex];

        // i = 0 이면 오늘, i = 1 은 어제
        const pubDate = new Date(now.getTime() - i * msPerDay);
        pubDate.setHours(9 + ((i * 3) % 8), (i * 17) % 60, 0);

        const isToday = i === 0;

        webzines.push({
            webzineId: `auto-wz-d${daysElapsed - i}-${baseArticle.poolId}`,
            title: baseArticle.title,
            excerpt: baseArticle.excerpt,
            thumbnailUrl: baseArticle.thumbnailUrl,
            isTodayArticle: isToday,
            publishedAt: pubDate.toISOString(),
            viewCount: 180 + (poolLen - i) * 35 + ((daysElapsed * 11 + i * 19) % 150),
            likeCount: 24 + (poolLen - i) * 8 + ((daysElapsed * 5 + i * 7) % 40),
            shareCount: 6 + (poolLen - i) * 3 + ((daysElapsed * 2 + i) % 18),
            readUrl: `https://kmoa.netlify.app/kca_webzine.html?id=${baseArticle.whitelabelId}`,
            whitelabelUrl: `https://kmoa.netlify.app/kca_webzine.html?id=${baseArticle.whitelabelId}&whitelabel=true`
        });
    }

    return webzines;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const autoWebzines = getAutoUpgradedWebzines(limit);

    if (!KMOA_API_KEY) {
        return NextResponse.json({
            success: true, demo: true, connectionStatus: "live-auto",
            merchantId: "daehan-kimchi-hanoi", webzineCount: autoWebzines.length,
            webzines: autoWebzines
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

        if (res.ok && data.success && data.webzines && data.webzines.length > 0) {
            return NextResponse.json({ ...data, connectionStatus: "live", demo: false });
        }

        return NextResponse.json({
            success: true, demo: true, connectionStatus: "live-auto",
            merchantId: "daehan-kimchi-hanoi", webzineCount: autoWebzines.length,
            webzines: autoWebzines
        });

    } catch {
        return NextResponse.json({
            success: true, demo: true, connectionStatus: "live-auto",
            merchantId: "daehan-kimchi-hanoi", webzineCount: autoWebzines.length,
            webzines: autoWebzines
        });
    }
}
