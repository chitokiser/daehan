import { NextResponse } from "next/server";

export interface ArticleImageItem {
    id: string;
    tag: string;
    category: "FERMENTATION" | "KIMCHI_DNA" | "RECIPE" | "SMART_FARM" | "AI_STUDIO";
    title: string;
    subtitle: string;
    excerpt: string;
    date: string;
    image: string;
    prompt: string;
    likes: number;
    readTime: string;
    author: string;
    stats: {
        ph: string;
        temp: string;
        probiotics: string;
        fermentationDays: number;
    };
    pairingTip: string;
    recipe: string;
}

// Initial high-quality verified dataset
const initialArticles: ArticleImageItem[] = [
    {
        id: "ferment-01",
        tag: "FERMENTATION SCIENCE",
        category: "FERMENTATION",
        title: "유산균의 마법: 베트남 아열대 기후 속 1.8°C 저온 발효과학",
        subtitle: "동남아 현지 환경에서도 본연의 톡 쏘는 탄산미를 유지하는 비결",
        excerpt: "대한김치의 베트남 하노이 R&D 센터에서 밝혀낸, 고온다습한 기후 속에서도 완벽한 맛과 유산균 생존율을 보장하는 스마트 저온 숙성 사이클의 핵심 공정을 공개합니다.",
        date: "2026-09-01",
        image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=1000&q=80",
        prompt: "traditional Korean kimchi in ceramic onggi jar, fermentation bubbles, cold mist, cinematic macro culinary photography, 8k",
        likes: 142,
        readTime: "4분",
        author: "ZENTAROLAB 바이오 R&D팀",
        stats: { ph: "4.1", temp: "1.8°C", probiotics: "15억 CFU/g", fermentationDays: 21 },
        pairingTip: "살얼음이 살짝 낀 동치미 국물과 곁들이면 유산균의 풍미가 배가됩니다.",
        recipe: "2주간 1.8°C 항온 저장고에서 숙성된 묵은지는 돼지고기 수육 또는 전골 요리에 가장 이상적인 산미를 냅니다."
    },
    {
        id: "dna-02",
        tag: "KIMCHI DNA",
        category: "KIMCHI_DNA",
        title: "8각 김치 맛 분석: 하노이 소비자가 가장 열광한 미각 좌표는?",
        subtitle: "3,000명의 한·베 미각 데이터로 증명한 최적의 젓갈 감칠맛 밸런스",
        excerpt: "자체 개발한 8각 맛 DNA 알고리즘을 통해 3,000명의 한국 및 베트남 현지 소비자 데이터를 심층 분석했습니다. 젓갈의 깊은 감칠맛과 청량한 아삭함 사이의 황금비율을 탐구합니다.",
        date: "2026-08-30",
        image: "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=1000&q=80",
        prompt: "artisanal Korean kimchi freshly sliced on slate board with chili flakes and sesame, dramatic studio lighting, Michelin star presentation",
        likes: 98,
        readTime: "5분",
        author: "대한김치 미각연구소",
        stats: { ph: "4.3", temp: "2.0°C", probiotics: "9.8억 CFU/g", fermentationDays: 14 },
        pairingTip: "담백한 쌀밥과 구운 김, 그리고 감칠맛 높은 갓김치의 삼합 조화.",
        recipe: "젓갈 비율 7.5%의 프리미엄 양념장은 베트남 현지인의 입맛에도 부담 없이 감칠맛의 정수를 선사합니다."
    },
    {
        id: "recipe-03",
        tag: "RECIPE & PAIRING",
        category: "RECIPE",
        title: "하노이 분짜·쌀국수와 시원한 열무김치의 환상적인 크로스오버",
        subtitle: "베트남 스트리트 푸드와 한국 발효 김치가 만들어내는 미식의 신세계",
        excerpt: "베트남 전통 육수의 은은한 풍미에 아삭하고 톡 쏘는 열무김치가 만났을 때 미각에 일어나는 폭발적인 시너지. 하노이 유명 셰프들과 함께 개발한 시그니처 퓨전 페어링을 만나보세요.",
        date: "2026-08-28",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80",
        prompt: "vietnamese pho bowl served alongside crisp korean kimchi side dishes, vibrant food styling, steam rising, gourmet restaurant",
        likes: 215,
        readTime: "3분",
        author: "ZENTARO 푸드 컬처 랩",
        stats: { ph: "4.2", temp: "3.5°C", probiotics: "8.5억 CFU/g", fermentationDays: 7 },
        pairingTip: "진한 소고기 쌀국수(Pho Bo)에 잘 익은 열무김치 국물을 한 스푼 더해보세요.",
        recipe: "뜨거운 국물 한 모금 뒤에 차가운 열무김치의 아삭한 줄기를 씹으면 기름진 뒷맛이 깔끔하게 정돈됩니다."
    },
    {
        id: "farm-04",
        tag: "HACCP & SMART FARM",
        category: "SMART_FARM",
        title: "원재료부터 까다롭게: 베트남 달랏 고랭지 스마트 배추 농장 르포",
        subtitle: "해발 1,500m 청정 고원지대에서 자라나는 밀도 높은 아삭함",
        excerpt: "완벽한 포기김치를 만들기 위해 365일 엄격하게 온도와 수분을 스마트 센서로 관리하는 대한김치 전용 고랭지 계약재배 농장. HACCP 인증 시설과 연계된 안심 푸드 체인을 소개합니다.",
        date: "2026-08-25",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80",
        prompt: "lush highland organic napa cabbage farm morning sun rays mist mountain background agricultural high tech",
        likes: 180,
        readTime: "4분",
        author: "원료품질관리센터",
        stats: { ph: "6.5", temp: "16°C", probiotics: "자연 효모 풍부", fermentationDays: 0 },
        pairingTip: "수확 직후 절인 배추 본연의 달큰한 배추속잎과 특제 겉절이 양념의 궁합.",
        recipe: "해발 1,500m의 일교차를 견딘 배추는 잎이 두껍고 당도가 높아 숙성 후에도 쉽게 무르지 않습니다."
    },
    {
        id: "recipe-05",
        tag: "CHEF'S TABLE",
        category: "RECIPE",
        title: "장인의 손끝: 3년 묵은지 김치찜과 하노이 라이스 와인의 페어링",
        subtitle: "시간이 빚어낸 묵직한 산미와 부드러운 돼지 갈비의 극치",
        excerpt: "3년의 저온 숙성을 거치며 자연 분해된 아미노산이 뿜어내는 깊은 감칠맛. 베트남 현지 찹쌀 증류주(Nếp Mới)와 어우러지는 최고급 만찬 코스를 공개합니다.",
        date: "2026-08-20",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
        prompt: "korean braised aged kimchi stew with pork ribs boiling in stone pot, rich red broth, rustic wooden table, cinematic lighting",
        likes: 267,
        readTime: "6분",
        author: "대한김치 마스터 셰프",
        stats: { ph: "3.8", temp: "1.0°C", probiotics: "18억 CFU/g", fermentationDays: 1095 },
        pairingTip: "알코올 도수 25도 전후의 전통 쌀 증류주와 곁들이면 기름진 육즙을 깔끔히 씻어줍니다.",
        recipe: "약불에서 2시간 이상 은근히 조려낸 묵은지 김치찜은 젓가락만으로도 부드럽게 결대로 찢어집니다."
    },
    {
        id: "ai-06",
        tag: "AI FERMENTATION LAB",
        category: "AI_STUDIO",
        title: "ZENTAROLAB AI가 예측한 미래 발효식품: 마이크로바이옴 맞춤 김치",
        subtitle: "개인 유전자 프로필에 맞춰 발효 균주를 조절하는 차세대 바이오테크",
        excerpt: "인공지능이 사용자의 장내 미생물 환경 데이터를 실시간 분석하여, 가장 필요한 락토바실러스 균주를 강화해 맞춤 배송하는 맞춤형 바이오 김치 구독 서비스의 청사진을 소개합니다.",
        date: "2026-08-15",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
        prompt: "futuristic biological food science laboratory researching microbiome lactobacillus fermentation in glass glowing vessels, luxury aesthetic",
        likes: 310,
        readTime: "5분",
        author: "ZENTARO 미래기술원",
        stats: { ph: "4.0", temp: "2.2°C", probiotics: "25억 CFU/g", fermentationDays: 10 },
        pairingTip: "매일 아침 공복에 마시는 100ml 발효 유산균 에센스 샷.",
        recipe: "정밀 센서가 탑재된 스마트 김치 보관용기와 연동되어 최적의 발효 피크 타임을 스마트폰으로 알려줍니다."
    }
];

// In-memory article store so user-generated AI images persist during dev session
let articlesStore: ArticleImageItem[] = [...initialArticles];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "ALL";
    const query = searchParams.get("query")?.trim().toLowerCase() || "";
    const sort = searchParams.get("sort") || "latest";

    let filtered = articlesStore.filter(item => {
        const matchesCategory = category === "ALL" || item.category === category;
        const matchesQuery = !query ||
            item.title.toLowerCase().includes(query) ||
            item.excerpt.toLowerCase().includes(query) ||
            item.tag.toLowerCase().includes(query) ||
            item.prompt.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });

    if (sort === "popular") {
        filtered.sort((a, b) => b.likes - a.likes);
    } else {
        // default latest
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return NextResponse.json({
        success: true,
        total: filtered.length,
        categories: [
            { key: "ALL", label: "전체 아티클" },
            { key: "FERMENTATION", label: "발효과학" },
            { key: "KIMCHI_DNA", label: "김치 DNA" },
            { key: "RECIPE", label: "페어링 & 레시피" },
            { key: "SMART_FARM", label: "스마트팜 & HACCP" },
            { key: "AI_STUDIO", label: "AI 비주얼 랩" }
        ],
        articles: filtered
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, category = "AI_STUDIO", title, author = "게스트 큐레이터" } = body;

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { success: false, error: "프롬프트(설명)를 입력해주세요." },
                { status: 400 }
            );
        }

        // Construct high-quality AI image generation URL via Pollinations API
        const enhancedPrompt = `${prompt.trim()}, gourmet Korean kimchi fermentation culinary food photography, photorealistic, 8k resolution, cinematic lighting, appetizing`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1000&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

        const generatedTitle = title || `AI 큐레이션: ${prompt.slice(0, 30)}${prompt.length > 30 ? "..." : ""}`;

        const newArticle: ArticleImageItem = {
            id: `ai-gen-${Date.now()}`,
            tag: "AI GENERATED VISUAL",
            category: (category as ArticleImageItem["category"]) || "AI_STUDIO",
            title: generatedTitle,
            subtitle: "ZENTAROLAB 실시간 AI 이미지 생성 API 엔진으로 합성된 비주얼",
            excerpt: `사용자 프롬프트 [${prompt}]를 기반으로 생성된 발효 미식 아트워크입니다. 대한김치의 30년 발효과학 데이터셋과 최신 비전 생성 모델이 결합되었습니다.`,
            date: new Date().toISOString().split("T")[0],
            image: imageUrl,
            prompt: enhancedPrompt,
            likes: 1,
            readTime: "2분",
            author,
            stats: {
                ph: "4.2",
                temp: "1.8°C",
                probiotics: "10억 CFU/g",
                fermentationDays: Math.floor(Math.random() * 20) + 7
            },
            pairingTip: "AI가 추천하는 미식 조합: 시원한 나박김치 국물과 따뜻한 밥 한 공기.",
            recipe: "이 아티클은 이미지 API를 통해 즉석 생성된 비주얼 아카이브 카드입니다."
        };

        // Prepend to article store
        articlesStore = [newArticle, ...articlesStore];

        return NextResponse.json({
            success: true,
            article: newArticle
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "이미지 생성 실패";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
