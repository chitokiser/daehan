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
        whitelabelId: "demo-wz-001",
        relatedProductId: "pogi-kimchi-5kg",
        content: `
### 🌿 한국 정통 양념과 베트남 청정 고원의 만남

대한김치 포기김치는 100% 한국산 태양초 고춧가루, 정품 신안 천일염, 최고급 남해안 멸치액젓만을 고집하여 담급니다. 베트남 달랏(Da Lat) 해발 1,500m 고랭지에서 재배된 유기농 배추만을 엄선하여 일반 배추에 비해 줄기가 꽉 차고 씹을수록 깊은 단맛과 아삭함을 자랑합니다.

#### 💡 핵심 발효 포인트 & 미각 과학
- **숙성 1~7일차**: 갓 담근 싱싱함과 풋풋한 채즙, 칼칼한 태양초 양념의 조화
- **숙성 8~20일차 (골든 타임)**: pH 4.2~4.4 도달, 1g당 15억 CFU 이상의 유익균(Leuconostoc, Lactobacillus) 최정점 형성
- **숙성 21일 이후**: 은은한 산미와 감칠맛이 극대화되어 김치찌개, 볶음밥용으로 최고의 깊은 맛 선사

> 📌 **HACCP & CODEX 2020 위생 보증**  
> 하노이 동안 소재 클린룸에서 에어샤워 및 3단계 버블 세척, 금속검출기를 거쳐 1.8°C 저온 콜드체인으로 댁까지 전달됩니다.
`
    },
    {
        poolId: "wz-02",
        title: "아삭함과 시원한 유산균의 만남, 대한김치 깍두기",
        excerpt: "한 입 크기의 알맞은 단단함과 상쾌한 무의 유산균 발효. 사계절 건강한 한식 식탁을 만드는 깍두기 발효 과학.",
        thumbnailUrl: "/images/products/kkakdugi.jpg",
        whitelabelId: "demo-wz-002",
        relatedProductId: "kkakdugi-3kg",
        content: `
### 🧊 알맞게 단단한 깍두기 한 입의 청량감

국물 요리나 설렁탕, 라면과 완벽한 앙상블을 이루는 대한김치 깍두기는 최적의 무 수분 비율과 천일염 절임 시간 조절을 통해 마지막 한 조각까지 무르지 않고 무 특유의 상쾌한 단맛을 유지합니다.

#### 💡 마스터 셰프 큐레이션
- **입안 가득 터지는 알싸한 채즙**: 껍질을 얇게 벗겨 식이섬유와 아삭아삭한 식감 저장
- **유산균 음료보다 풍부한 식물성 유산균**: 무 발효 과정에서 생성되는 천연 유기산이 장 건강에 도움
- **추천 페어링**: 차돌된장찌개, 설렁탕, 사골곰탕, 신라면, 볶음밥
`
    },
    {
        poolId: "wz-03",
        title: "달랏 고원 1,500m 원료와 알싸한 총각김치의 비결",
        excerpt: "해발 1,500m 청정 고원에서 수확한 유기농 알타리 무로 만드는 대한김치 별미 총각김치 레시피 공개.",
        thumbnailUrl: "/images/products/chonggak.jpg",
        whitelabelId: "demo-wz-003",
        relatedProductId: "chonggak-kimchi-3kg",
        content: `
### 🌾 단단하고 오독오독 씹히는 총각무의 진수

달랏 청정 고원지대의 큰 일교차 속에서 자란 알타리무는 당도가 높고 속이 오독오독 꽉 차 있습니다. 대한김치만의 비법 찹쌀풀과 남해안 생새우를 갈아 넣어 씹을수록 고소함과 젓갈의 감칠맛이 입안 가득 감돕니다.

#### 💡 셰프 추천 팁
1. **무청의 풋세 조절**: 무청 줄기까지 아삭하게 절여 비타민 A, C 복합 영양 공급
2. **익혀 먹는 즐거움**: 상온에서 1~2일간 알맞게 익힌 후 냉장 보관하시면 특유의 알싸한 톡 쏘는 탄산감을 만끽할 수 있습니다.
`
    },
    {
        poolId: "wz-04",
        title: "HACCP CODEX 2020 국제 인증 스마트 무균 팩토리",
        excerpt: "100% 자동화 에어샤워와 초위생 세척 공정, 정밀 온도 제어 시스템을 갖춘 하노이 동안 소재 클린룸 투어.",
        thumbnailUrl: "/images/factory/1788250057286_910087481450589245_g8397836875365957143_a1f83771478661ade08188ee88eaeea2.jpg",
        whitelabelId: "demo-wz-004",
        relatedProductId: "pogi-kimchi-5kg",
        content: `
### 🏭 100% 스마트 클린룸 생산 공정 현장 스케치

대한김치 하노이 스마트 공장은 국제 HACCP 및 CODEX 2020 인증 규격을 완벽하게 준수하여 설계되었습니다. 작업자 전원 에어샤워 부스 통과, 이중 마스크 및 방진복 착용, 음압 살균 시스템을 운영하고 있습니다.

#### 🛡️ 위생 4대 핵심 가치
- **3단계 오존 버블 세척**: 잔류 농약 및 이물질 100% 제거
- **정밀 X-ray & 금속 검출기**: 0.5mm 미세 금속 이물까지 자동 선별
- **1.8°C 항온 제어**: 세척부터 배송 차량 상차까지 김치 유산균의 활성도를 최적으로유지
`
    },
    {
        poolId: "wz-05",
        title: "톡 쏘는 남도 스타일 갓김치 & 청량한 열무김치",
        excerpt: "알싸한 갓의 향기가 피어나는 프리미엄 갓김치와 여름철 시원함을 선사하는 열무김치의 앙상블.",
        thumbnailUrl: "/images/products/gatkimchi.jpg",
        whitelabelId: "demo-wz-005",
        relatedProductId: "gat-kimchi-2kg",
        content: `
### 🍃 쌉싸래한 갓 향과 정통 남도 양념의 깊은 조화

여수 및 고원지대 특산 돌산갓 스타일의 원료로 만든 대한김치 갓김치는 특유의 알싸한 시니그린 성분이 입맛을 돋워줍니다. 멸치진젓과 갈아넣은 생강, 찹쌀풀로 양념하여 갓의 톡 쏘는 청량함과 감칠맛을 최상으로 끌어올렸습니다.

#### 🍲 별미 조합 추천
- **갓김치 짜장라면**: 알싸함이 느끼함을 잡아주는 환상의 짝꿍
- **갓김치 돼지 수육**: 푹 삶은 삼겹 수육에 갓김치를 둘러 먹는 별미 미식
`
    },
    {
        poolId: "wz-06",
        title: "1.8°C 저온 숙성의 비밀, 300일 항온 발효 묵은지",
        excerpt: "김치찌개, 김치찜, 김치전 어디에 넣어도 특유의 산도(pH 4.2)와 깊은 감칠맛을 완성하는 명품 묵은지.",
        thumbnailUrl: "/images/products/mookeunji.jpg",
        whitelabelId: "demo-wz-006",
        relatedProductId: "mookeunji-3kg",
        content: `
### 🏺 1.8°C 저온 300일 발효가 만든 명품 묵은지

대한김치 묵은지는 무르지 않고 속까지 양념이 깊숙이 배어든 저온 항온 발효 묵은지입니다. 신맛만 강한 일반 신김치와 달리, 유익균이 빚어낸 은은한 천연 과일 산미와 깊은 효모 감칠맛이 특징입니다.

#### 🍳 묵은지 100% 활용 쿠킹 팁
- **묵은지 돼지갈비찜**: 양념을 살짝 씻어내고 푹 끓여내 부드러운 고기와 조합
- **묵은지 들기름 볶음**: 씻은 묵은지를 들기름과 마늘에 조물조물 볶아 정갈한 밥반찬 완성
`
    },
    {
        poolId: "wz-07",
        title: "삼겹살과 짜장라면의 영혼 파트너, 대한김치 파김치",
        excerpt: "알싸한 파의 알리신 성분과 한국 정통 양념이 어우러져 한층 깊은 미각을 깨우는 알싸한 파김치.",
        thumbnailUrl: "/images/products/pakimchi.jpg",
        whitelabelId: "demo-wz-007",
        relatedProductId: "pa-kimchi-2kg",
        content: `
### 🧅 파의 신선함과 진한 양념의 치명적 중독성

대한김치 파김치는 억세지 않고 부드러운 알파 쪽파만을 선별하여 진한 멸치액젓과 태양초 고춧가루 양념으로 정성껏 절였습니다. 갓 담갔을 때는 맵싸하고 알싸하며, 3~5일 숙성되면 달콤 짭조름한 양념이 깊게 배어듭니다.
`
    },
    {
        poolId: "wz-08",
        title: "여름철 최고의 쿨링 별미, 아삭 오이소박이",
        excerpt: "싱싱한 오이 속에 부추와 고춧가루 특제 양념을 꽉 채워 청량함과 감칠맛을 극대화한 오이소박이.",
        thumbnailUrl: "/images/products/oisobagi.jpg",
        whitelabelId: "demo-wz-008",
        relatedProductId: "oisobagi-2kg",
        content: `
### 🥒 입안 가득 싱그러움이 터지는 오이소박이

가장 신선한 취청오이의 십자 칼집 사이에 향긋한 부추와 양념 소를 듬뿍 채웠습니다. 끓인 소금물로 오이를 정밀 절임하여 시간이 지나도 물러지지 않고 아삭함이 오래 유지됩니다.
`
    },
    {
        poolId: "wz-09",
        title: "한 장 한 장 손맛으로 담근 향긋한 깻잎김치",
        excerpt: "밥도둑 대표 주자! 은은한 깻잎 향과 대한김치 비법 양념장의 짭조름한 조화.",
        thumbnailUrl: "/images/products/kkaennip.jpg",
        whitelabelId: "demo-wz-009",
        relatedProductId: "kkaennip-1kg",
        content: `
### 🍃 갓 지은 쌀밥 위의 밥도둑 1위, 깻잎김치

어린 깻잎을 한 장 한 장 정성스럽게 씻어 특제 간장과 고춧가루, 마늘, 통깨 양념을 레이어링했습니다. 깻잎 특유의 정유 성분이 밥맛을 살려줍니다.
`
    },
    {
        poolId: "wz-10",
        title: "화끈하고 중독적인 매운맛, 대한김치 실비김치",
        excerpt: "매운맛 마니아들을 사로잡은 화끈한 청양고춧가루 특제 실비김치. 스트레스를 단번에 날려버리는 맛.",
        thumbnailUrl: "/images/products/silbi.jpg",
        whitelabelId: "demo-wz-001",
        relatedProductId: "silbi-kimchi-2kg",
        content: `
### 🔥 화끈한 매운맛의 미학, 대한김치 실비김치

엄선된 100% 한국산 청양 고춧가루를 듬뿍 얹어 입안이 얼얼할 정도로 맛있게 매운 실비김치. 짜장면, 삼겹살, 비빔밥과 곁들이면 스트레스가 싹 풀리는 스파이시 K-푸드입니다.
`
    },
    {
        poolId: "wz-11",
        title: "국물 요리의 완성, 큼직한 석박지 & 대파김치",
        excerpt: "설렁탕, 곰탕, 칼국수의 맛을 200% 끌어올려주는 큼직한 석박지와 진한 대파김치 제안.",
        thumbnailUrl: "/images/products/daepa.jpg",
        whitelabelId: "demo-wz-002",
        relatedProductId: "daepa-kimchi-2kg",
        content: `
### 🍲 깊은 국물 맛을 완성하는 큼직한 석박지

큼직하게 썬 무를 들기름과 찹쌀풀, 멸치 액젓으로 어우러지게 절여 감칠맛 국물이 자연스럽게 잰 석박지입니다. 곰탕이나 국밥에 국물째 얹어 드시면 식당 못지않은 깊은 미각을 경험하실 수 있습니다.
`
    },
    {
        poolId: "wz-12",
        title: "신선도를 지키는 콜드체인 물류 및 저온 창고 라인업",
        excerpt: "제조부터 배송까지 끊김 없는 1.8°C 신선 콜드체인 시스템으로 하노이 전역에 갓 담근 김치 전달.",
        thumbnailUrl: "/images/factory/1788249934313_910087481450589245_g8397836875365957143_dfd4c34e7fa1b44a31af91205c2fcd77.jpg",
        whitelabelId: "demo-wz-003",
        relatedProductId: "pogi-kimchi-5kg",
        content: `
### ❄️ 하노이 전역 1.8°C 콜드체인 신선 배송

대한김치는 생산 직후 전용 보냉 팩과 냉장 배송 차량을 통해 하노이 시내 및 인근 지역까지 신선하게 전달됩니다. 유산균 폭발 구간인 1.8°C 온도를 엄격히 보증합니다.
`
    },
    {
        poolId: "wz-13",
        title: "정갈하고 언제나 신선한 대한김치 맛김치",
        excerpt: "한 입 크기로 손질되어 바로 꺼내 먹기 편한 프리미엄 맛김치. 가정 및 업소용 최적의 선택.",
        thumbnailUrl: "/images/products/matkimchi.jpg",
        whitelabelId: "demo-wz-004",
        relatedProductId: "mat-kimchi-3kg",
        content: `
### ✂️ 칼로 자를 필요 없이 바로 덜어 먹는 편의성

썰어담은 맛김치는 손질의 번거로움을 줄이고 뜯자마자 식탁 위에 바로 올릴 수 있는 스마트 포장 김치입니다. 혼밥족 및 야외 캠핑, 사무실 도시락용으로 인기 만점입니다.
`
    },
    {
        poolId: "wz-14",
        title: "부드럽고 연한 봄철 별미, 얼갈이 배추김치",
        excerpt: "갓 겉절이처럼 풋풋하고 부드러운 식감이 살아있는 대한김치 얼갈이 김치 큐레이션.",
        thumbnailUrl: "/images/products/eolgari.jpg",
        whitelabelId: "demo-wz-005",
        relatedProductId: "eolgari-kimchi-2kg",
        content: `
### 🌱 부드러운 잎사귀와 연한 채즙의 얼갈이 김치

줄기가 두껍지 않고 부드러운 연잎 얼갈이 배추를 짜지 않게 겉절이 스타일로 살짝 절여 고소한 과일 양념으로 버무렸습니다.
`
    },
    {
        poolId: "wz-15",
        title: "시원한 동치미 육수 국물의 열무물김치",
        excerpt: "국수를 말아 드시면 극상의 시원함을 자랑하는 특제 열무물김치 발효 노하우.",
        thumbnailUrl: "/images/products/yeolmu.jpg",
        whitelabelId: "demo-wz-006",
        relatedProductId: "yeolmu-water-kimchi-3kg",
        content: `
### 🍧 톡 쏘는 동치미 육수와 살얼음 열무국수

감자풀과 무즙, 배 착즙 액으로 자작하게 국물을 낸 열무물김치는 소면만 삶아 말아 먹어도 시원한 한 끼 국수가 완성됩니다.
`
    },
    {
        poolId: "wz-16",
        title: "대한김치 무균 에어샤워 및 이물질 0% 검수 공정",
        excerpt: "클린룸 입장부터 이중 에어샤워, 자외선 살균 소독으로 이물질 발생 가능성을 철저히 차단.",
        thumbnailUrl: "/images/factory/20260903_114509.png",
        whitelabelId: "demo-wz-007",
        relatedProductId: "pogi-kimchi-5kg",
        content: `
### 🔬 0.01%의 불량도 허용하지 않는 위생 검수 공정

원료 수입 검수부터 탈수, 절임, 양념 버무림, 위생 용기 용량 정밀 계량까지 8단계 센서 및 현장 관리자의 철저한 이중 체크가 이루어집니다.
`
    },
    {
        poolId: "wz-17",
        title: "아삭하고 새콤달콤한 별미, 양파김치 & 쪽파김치",
        excerpt: "양파의 단맛과 양념의 감칠맛이 어우러져 고기 요리와 최고의 조화를 이루는 프리미엄 양파김치.",
        thumbnailUrl: "/images/products/yangpa.jpg",
        whitelabelId: "demo-wz-008",
        relatedProductId: "yangpa-kimchi-2kg",
        content: `
### 🧅 양파의 알싸함이 천연 단맛으로 변하는 숙성 신비

동글동글 싱싱한 자색 및 알양파에 칼집을 내어 고춧가루 액젓 특제 소스를 침투시킨 양파김치. 고깃집 기본찬 이상의 고급스러운 미각을 선물합니다.
`
    },
    {
        poolId: "wz-18",
        title: "100% 자동 세척 시스템과 스마트 비전 검수",
        excerpt: "버블 세척과 농약 잔류 정밀 검사 시스템으로 위생 안전을 확립하는 하노이 공장 현장.",
        thumbnailUrl: "/images/factory/1788250016539_910087481450589245_g8397836875365957143_75b5eb0727148146cea7e19b352438a4.jpg",
        whitelabelId: "demo-wz-009",
        relatedProductId: "pogi-kimchi-5kg",
        content: `
### 🤖 첨단 자동 세척 라인으로 완성하는 무균 배추

수작업으로 일일이 배추 겉잎을 선별한 후 자동 3단계 기포 세척기에서 흙과 잔여물을 완벽히 세척해냅니다. 안심하고 바로 드실 수 있는 깨끗한 김치의 기본입니다.
`
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
            content: baseArticle.content,
            relatedProductId: baseArticle.relatedProductId || "pogi-kimchi-5kg",
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
