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
    isToday?: boolean;
    stats: {
        ph: string;
        temp: string;
        probiotics: string;
        fermentationDays: number;
    };
    pairingTip: string;
    recipe: string;
}

// ─────────────────────────────────────────────
// 30개 아티클 풀 — 날짜 시드로 하루 1건 자동 발행
// ─────────────────────────────────────────────
const ARTICLE_POOL: ArticleImageItem[] = [
    {
        id: "pool-01", tag: "FERMENTATION SCIENCE", category: "FERMENTATION",
        title: "유산균의 마법: 베트남 아열대 기후 속 1.8°C 저온 발효과학",
        subtitle: "동남아 현지 환경에서도 본연의 톡 쏘는 탄산미를 유지하는 비결",
        excerpt: "대한김치의 베트남 하노이 R&D 센터에서 밝혀낸, 고온다습한 기후 속에서도 완벽한 맛과 유산균 생존율을 보장하는 스마트 저온 숙성 사이클의 핵심 공정을 공개합니다.",
        date: "2026-09-01", image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=1000&q=80",
        prompt: "traditional Korean kimchi in ceramic onggi jar, fermentation bubbles, cold mist, cinematic macro culinary photography, 8k",
        likes: 142, readTime: "4분", author: "대한김치 바이오 R&D팀",
        stats: { ph: "4.1", temp: "1.8°C", probiotics: "15억 CFU/g", fermentationDays: 21 },
        pairingTip: "살얼음이 살짝 낀 동치미 국물과 곁들이면 유산균의 풍미가 배가됩니다.",
        recipe: "2주간 1.8°C 항온 저장고에서 숙성된 묵은지는 돼지고기 수육 또는 전골 요리에 가장 이상적인 산미를 냅니다."
    },
    {
        id: "pool-02", tag: "KIMCHI DNA", category: "KIMCHI_DNA",
        title: "8각 김치 맛 분석: 하노이 소비자가 가장 열광한 미각 좌표는?",
        subtitle: "3,000명의 한·베 미각 데이터로 증명한 최적의 젓갈 감칠맛 밸런스",
        excerpt: "자체 개발한 8각 맛 DNA 알고리즘을 통해 3,000명의 한국 및 베트남 현지 소비자 데이터를 심층 분석했습니다. 젓갈의 깊은 감칠맛과 청량한 아삭함 사이의 황금비율을 탐구합니다.",
        date: "2026-08-30", image: "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=1000&q=80",
        prompt: "artisanal Korean kimchi freshly sliced on slate board with chili flakes and sesame, dramatic studio lighting, Michelin star presentation",
        likes: 98, readTime: "5분", author: "대한김치 미각연구소",
        stats: { ph: "4.3", temp: "2.0°C", probiotics: "9.8억 CFU/g", fermentationDays: 14 },
        pairingTip: "담백한 쌀밥과 구운 김, 그리고 감칠맛 높은 갓김치의 삼합 조화.",
        recipe: "젓갈 비율 7.5%의 프리미엄 양념장은 베트남 현지인의 입맛에도 부담 없이 감칠맛의 정수를 선사합니다."
    },
    {
        id: "pool-03", tag: "RECIPE & PAIRING", category: "RECIPE",
        title: "하노이 분짜·쌀국수와 시원한 열무김치의 환상적인 크로스오버",
        subtitle: "베트남 스트리트 푸드와 한국 발효 김치가 만들어내는 미식의 신세계",
        excerpt: "베트남 전통 육수의 은은한 풍미에 아삭하고 톡 쏘는 열무김치가 만났을 때 미각에 일어나는 폭발적인 시너지. 하노이 유명 셰프들과 함께 개발한 시그니처 퓨전 페어링을 만나보세요.",
        date: "2026-08-28", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80",
        prompt: "vietnamese pho bowl served alongside crisp korean kimchi side dishes, vibrant food styling, steam rising, gourmet restaurant",
        likes: 215, readTime: "3분", author: "대한김치 푸드 컬처 랩",
        stats: { ph: "4.2", temp: "3.5°C", probiotics: "8.5억 CFU/g", fermentationDays: 7 },
        pairingTip: "진한 소고기 쌀국수(Pho Bo)에 잘 익은 열무김치 국물을 한 스푼 더해보세요.",
        recipe: "뜨거운 국물 한 모금 뒤에 차가운 열무김치의 아삭한 줄기를 씹으면 기름진 뒷맛이 깔끔하게 정돈됩니다."
    },
    {
        id: "pool-04", tag: "HACCP & SMART FARM", category: "SMART_FARM",
        title: "원재료부터 까다롭게: 베트남 달랏 고랭지 스마트 배추 농장 르포",
        subtitle: "해발 1,500m 청정 고원지대에서 자라나는 밀도 높은 아삭함",
        excerpt: "완벽한 포기김치를 만들기 위해 365일 엄격하게 온도와 수분을 스마트 센서로 관리하는 대한김치 전용 고랭지 계약재배 농장. HACCP 인증 시설과 연계된 안심 푸드 체인을 소개합니다.",
        date: "2026-08-25", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80",
        prompt: "lush highland organic napa cabbage farm morning sun rays mist mountain background agricultural high tech",
        likes: 180, readTime: "4분", author: "원료품질관리센터",
        stats: { ph: "6.5", temp: "16°C", probiotics: "자연 효모 풍부", fermentationDays: 0 },
        pairingTip: "수확 직후 절인 배추 본연의 달큰한 배추속잎과 특제 겉절이 양념의 궁합.",
        recipe: "해발 1,500m의 일교차를 견딘 배추는 잎이 두껍고 당도가 높아 숙성 후에도 쉽게 무르지 않습니다."
    },
    {
        id: "pool-05", tag: "CHEF'S TABLE", category: "RECIPE",
        title: "정갈한 손끝: 3년 묵은지 김치찜과 하노이 라이스 와인의 페어링",
        subtitle: "시간이 빚어낸 묵직한 산미와 부드러운 돼지 갈비의 극치",
        excerpt: "3년의 저온 숙성을 거치며 자연 분해된 아미노산이 뿜어내는 깊은 감칠맛. 베트남 현지 찹쌀 증류주(Nếp Mới)와 어우러지는 최고급 만찬 코스를 공개합니다.",
        date: "2026-08-20", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
        prompt: "korean braised aged kimchi stew with pork ribs boiling in stone pot, rich red broth, rustic wooden table, cinematic lighting",
        likes: 267, readTime: "6분", author: "대한김치 마스터 셰프",
        stats: { ph: "3.8", temp: "1.0°C", probiotics: "18억 CFU/g", fermentationDays: 1095 },
        pairingTip: "알코올 도수 25도 전후의 전통 쌀 증류주와 곁들이면 기름진 육즙을 깔끔히 씻어줍니다.",
        recipe: "약불에서 2시간 이상 은근히 조려낸 묵은지 김치찜은 젓가락만으로도 부드럽게 결대로 찢어집니다."
    },
    {
        id: "pool-06", tag: "AI FERMENTATION LAB", category: "AI_STUDIO",
        title: "대한김치 스마트 AI가 예측한 미래 발효식품: 마이크로바이옴 맞춤 김치",
        subtitle: "개인 유전자 프로필에 맞춰 발효 균주를 조절하는 차세대 바이오테크",
        excerpt: "인공지능이 사용자의 장내 미생물 환경 데이터를 실시간 분석하여, 가장 필요한 락토바실러스 균주를 강화해 맞춤 배송하는 맞춤형 바이오 김치 구독 서비스의 청사진을 소개합니다.",
        date: "2026-08-15", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
        prompt: "futuristic biological food science laboratory researching microbiome lactobacillus fermentation in glass glowing vessels, luxury aesthetic",
        likes: 310, readTime: "5분", author: "대한김치 미래기술연구소",
        stats: { ph: "4.0", temp: "2.2°C", probiotics: "25억 CFU/g", fermentationDays: 10 },
        pairingTip: "매일 아침 공복에 마시는 100ml 발효 유산균 에센스 샷.",
        recipe: "정밀 센서가 탑재된 스마트 김치 보관용기와 연동되어 최적의 발효 피크 타임을 스마트폰으로 알려줍니다."
    },
    {
        id: "pool-07", tag: "SEASONAL KIMCHI", category: "KIMCHI_DNA",
        title: "계절이 빚는 김치: 가을 배추의 황금기와 최적 숙성 타이밍",
        subtitle: "24절기 발효 사이클과 배추 당도의 상관관계",
        excerpt: "가을 서리가 내리기 전 수확한 배추는 당도가 최고조에 달합니다. 이 황금 시기의 배추로 담근 포기김치가 왜 봄·여름 김치와 확연히 다른 풍미를 내는지 발효과학으로 설명합니다.",
        date: "2026-09-03", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80",
        prompt: "autumn harvest napa cabbage golden hour field Korea traditional kimchi ingredients preparation",
        likes: 88, readTime: "4분", author: "계절식품연구팀",
        stats: { ph: "6.2", temp: "4.0°C", probiotics: "자연 젖산균", fermentationDays: 3 },
        pairingTip: "갓 담근 겉절이는 참기름 한 방울과 통깨를 뿌려 바로 드세요.",
        recipe: "서리 직전 배추는 속이 단단하고 수분이 많아 절임 과정에서 불필요한 삼투 손실이 줄어듭니다."
    },
    {
        id: "pool-08", tag: "KIMCHI SCIENCE", category: "FERMENTATION",
        title: "pH 3.8의 세계: 김치 유산균이 만들어내는 천연 항생 환경의 과학",
        subtitle: "젖산과 초산의 이중 방어막이 유해균을 차단하는 메커니즘",
        excerpt: "완전히 숙성된 김치의 pH는 3.8까지 낮아져 대부분의 유해 병원균이 생존할 수 없는 환경이 만들어집니다. 이 자연 방부 시스템의 정교한 작동 원리를 분자 수준에서 분석합니다.",
        date: "2026-09-05", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80",
        prompt: "scientific microscopy lactobacillus bacteria culture fermentation lab glowing neon blue green",
        likes: 176, readTime: "5분", author: "발효과학연구소",
        stats: { ph: "3.8", temp: "1.5°C", probiotics: "20억 CFU/g", fermentationDays: 28 },
        pairingTip: "완전히 숙성된 신김치는 청국장찌개에 넣어 끓이면 산미가 중화되며 깊은 맛이 납니다.",
        recipe: "냄비에 돼지고기를 먼저 볶다가 신김치를 넣어 함께 볶으면 산미가 날아가며 진한 감칠맛만 남습니다."
    },
    {
        id: "pool-09", tag: "STREET FOOD", category: "RECIPE",
        title: "하노이 반미(Bánh Mì)에 포기김치를 곁들이다: 퓨전의 역습",
        subtitle: "베트남 바게트 샌드위치와 한국 발효의 예상치 못한 하모니",
        excerpt: "바삭한 쌀가루 바게트에 돼지고기 숯불구이, 현지 허브, 그리고 아삭한 대한김치 겉절이를 얹은 하노이 반미 퓨전. 길거리 먹거리의 새 역사를 써 내려가는 콜라보를 현장에서 취재했습니다.",
        date: "2026-08-18", image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1000&q=80",
        prompt: "vietnamese banh mi sandwich with korean kimchi toppings street food gourmet fusion photography",
        likes: 134, readTime: "3분", author: "하노이 푸드투어 에디터",
        stats: { ph: "4.5", temp: "5°C", probiotics: "6억 CFU/g", fermentationDays: 5 },
        pairingTip: "아이스 베트남 커피(Ca Phê Sữa Đá)와 함께하면 단짠의 극강 조합이 완성됩니다.",
        recipe: "바게트를 1분간 토스터에 구운 뒤 버터 대신 마요네즈와 겨자를 바르고, 차가운 겉절이를 듬뿍 올려주세요."
    },
    {
        id: "pool-10", tag: "ONGGI CULTURE", category: "FERMENTATION",
        title: "항아리의 숨결: 옹기 발효 용기가 만들어내는 미세 산소 교환의 과학",
        subtitle: "천연 황토 세라믹 기공이 김치를 살아 숨쉬게 하는 이유",
        excerpt: "조선시대부터 이어온 옹기 항아리는 단순한 용기가 아닙니다. 황토 태토의 미세 기공이 이산화탄소를 배출하고 산소를 적절히 차단하는 자연 밸브 역할을 합니다. 현대 플라스틱 용기와 비교 실험 결과를 공개합니다.",
        date: "2026-08-10", image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1000&q=80",
        prompt: "traditional korean onggi clay pot earthenware kimchi jar outdoor garden autumn bokeh",
        likes: 203, readTime: "5분", author: "전통식문화연구소",
        stats: { ph: "4.0", temp: "2.5°C", probiotics: "12억 CFU/g", fermentationDays: 45 },
        pairingTip: "100일 숙성 옹기 묵은지는 굵은 소금과 참기름만으로도 충분한 맛의 완결입니다.",
        recipe: "옹기 숙성 묵은지는 세척하지 말고 그대로 썰어 섭취하는 것이 유산균 손실을 최소화합니다."
    },
    {
        id: "pool-11", tag: "WELLNESS", category: "FERMENTATION",
        title: "장 건강의 수호자: 김치 유산균이 면역력을 80% 높이는 메커니즘",
        subtitle: "장내 마이크로바이옴과 NK세포 활성화의 연결고리",
        excerpt: "서울대학교 의대 공동 연구에서 밝혀진 김치 발효물의 장내 면역 증강 효과. 하루 100g 섭취로 NK세포 활성도가 최대 80% 향상된다는 임상 데이터를 상세히 분석합니다.",
        date: "2026-08-05", image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1000&q=80",
        prompt: "healthy gut microbiome probiotic yogurt fermented food immunity wellness photography vibrant green",
        likes: 421, readTime: "6분", author: "대한김치 헬스케어 연구팀",
        stats: { ph: "4.1", temp: "2.0°C", probiotics: "22억 CFU/g", fermentationDays: 30 },
        pairingTip: "매일 아침 식사와 함께 포기김치 100g을 섭취하면 하루 권장 유산균의 300%를 충당합니다.",
        recipe: "김치를 열처리하지 않은 생상태로 섭취해야 유산균이 살아있는 상태로 장까지 도달합니다."
    },
    {
        id: "pool-12", tag: "KIMCHI WORLD", category: "KIMCHI_DNA",
        title: "유네스코 세계유산 김치: 2013년 등재 이후 글로벌 소비 트렌드의 변화",
        subtitle: "K-Food 열풍을 선도하는 김치의 10년 세계화 여정",
        excerpt: "유네스코 인류무형문화유산 등재 이후 전 세계 김치 수출량은 340% 증가했습니다. 미국, 유럽, 동남아시아 각 시장에서 현지화된 김치 소비 트렌드와 대한김치가 하노이에서 쌓아온 현지화 전략을 심층 분석합니다.",
        date: "2026-07-28", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=80",
        prompt: "world map kimchi global food culture Korean tradition UNESCO heritage modern design",
        likes: 189, readTime: "7분", author: "글로벌 K-Food 리서치팀",
        stats: { ph: "4.2", temp: "3.0°C", probiotics: "11억 CFU/g", fermentationDays: 21 },
        pairingTip: "현지화 전략의 핵심은 매운맛을 30% 줄이고 젓갈 대신 새우 페이스트를 사용하는 것입니다.",
        recipe: "비건 버전 배추김치는 액젓 대신 표고버섯 우린 물과 미역 우린 물로 감칠맛을 대체합니다."
    },
    {
        id: "pool-13", tag: "KIMCHI TOUR", category: "SMART_FARM",
        title: "대한김치 하노이 공장 투어: 하루 3톤 생산 스마트 클린룸 현장 공개",
        subtitle: "HACCP 7단계 위해요소 분석부터 포장까지 한 번에",
        excerpt: "하노이 남뚜리엠(Nam Tu Liem)에 위치한 대한김치 베트남 본사 생산 시설 내부를 최초 공개합니다. 하루 3톤 규모의 스마트 클린룸 생산 라인과 실시간 온도 모니터링 시스템을 자세히 소개합니다.",
        date: "2026-07-20", image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1000&q=80",
        prompt: "modern food factory clean room stainless steel production line workers hygiene food safety",
        likes: 156, readTime: "5분", author: "대한김치 홍보팀",
        stats: { ph: "4.0", temp: "1.8°C", probiotics: "18억 CFU/g", fermentationDays: 14 },
        pairingTip: "포장 직전 품질 검수를 통과한 제품만 출하되며, 유통기한은 제조일로부터 90일입니다.",
        recipe: "진공 포장 김치는 냉장 개봉 후 3일 이내 섭취하거나 소분하여 재밀봉 보관하세요."
    },
    {
        id: "pool-14", tag: "WINTER KIMCHI", category: "KIMCHI_DNA",
        title: "겨울 김장의 철학: 김치 공동체 정신 '김장문화'가 담긴 사회적 의미",
        subtitle: "이웃과 나누는 발효, 600년 공동체 생활문화의 현대적 재해석",
        excerpt: "매년 11월 한반도 전역에서 벌어지는 김장 행사는 단순한 식품 제조가 아닙니다. 이웃끼리 함께 만들고 나누는 발효 공동체 문화의 정수를 조명하며, 베트남 이주 한인 커뮤니티가 하노이에서 이어가는 김장 전통을 소개합니다.",
        date: "2026-07-15", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
        prompt: "korean community kimjang winter kimchi making traditional hands cabbage salt cultural photography",
        likes: 234, readTime: "6분", author: "한인사회문화연구소",
        stats: { ph: "6.0", temp: "8°C", probiotics: "초기 발효균", fermentationDays: 1 },
        pairingTip: "갓 담근 겉절이는 뜨거운 밥과 구운 참치 통조림만 있으면 완성됩니다.",
        recipe: "김장 당일 만든 생김치는 2~3일간 실온 숙성 후 냉장고에 옮기면 아삭한 식감이 오래 유지됩니다."
    },
    {
        id: "pool-15", tag: "SPICE SCIENCE", category: "FERMENTATION",
        title: "고추의 캡사이신이 발효에 미치는 영향: 매운맛과 유산균의 공존",
        subtitle: "캡사이신 농도별 발효 속도 및 최종 산도 비교 실험",
        excerpt: "고춧가루의 주요 성분인 캡사이신이 유해균을 억제하면서도 유익한 유산균(Lactobacillus plantarum)의 증식을 돕는 신비로운 선택적 항균 효과를 실험 데이터로 증명합니다.",
        date: "2026-07-08", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=1000&q=80",
        prompt: "vibrant red Korean gochugaru chili powder macro photography capsaicin fire science",
        likes: 167, readTime: "4분", author: "식품화학연구팀",
        stats: { ph: "4.3", temp: "2.5°C", probiotics: "14억 CFU/g", fermentationDays: 21 },
        pairingTip: "매운김치는 유제품(치즈, 요거트)과 페어링하면 캡사이신의 자극이 완화되며 균형 잡힌 맛이 납니다.",
        recipe: "캡사이신 함량이 높은 매운 김치는 국물 요리보다 볶음 요리에 활용하면 열에 의해 매운맛이 순화됩니다."
    },
    {
        id: "pool-16", tag: "PREMIUM PAIRING", category: "RECIPE",
        title: "김치와 와인의 고차원 만남: 소믈리에가 추천하는 5가지 매칭",
        subtitle: "산미와 탄닌의 절묘한 균형, 하이엔드 다이닝의 새 지평",
        excerpt: "프랑스 보르도와 포기김치, 이탈리아 아마로네와 묵은지 — 얼핏 어울리지 않을 것 같은 이 조합이 실제로는 놀라운 하모니를 이룹니다. 하노이 5성 호텔 소믈리에와 함께 개발한 김치 와인 페어링 가이드를 공개합니다.",
        date: "2026-06-30", image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=1000&q=80",
        prompt: "korean kimchi fine dining wine pairing Michelin star restaurant elegant plating photography",
        likes: 298, readTime: "7분", author: "하노이 미슐랭 컨설턴트",
        stats: { ph: "3.9", temp: "1.5°C", probiotics: "16억 CFU/g", fermentationDays: 60 },
        pairingTip: "산도가 높은 묵은지에는 탄닌이 풍부한 레드 와인보다 드라이 화이트 와인(소비뇽 블랑)이 더 어울립니다.",
        recipe: "와인 잔에 김치 국물 한 방울을 떨어뜨려 향을 먼저 테스트해보세요. 의외의 플로럴 향이 느껴질 것입니다."
    },
    {
        id: "pool-17", tag: "PROBIOTIC POWER", category: "FERMENTATION",
        title: "김치 VS 요거트: 유산균 함량과 다양성 비교 분석",
        subtitle: "발효 식품의 왕좌를 가리는 프로바이오틱 배틀",
        excerpt: "100g당 유산균 균주 수와 종류에서 김치는 일반 요거트를 크게 앞섭니다. Lactobacillus kimchii, Leuconostoc mesenteroides 등 김치 특이적 균주들이 가진 특별한 장 건강 효능을 상세 분석합니다.",
        date: "2026-06-22", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=80",
        prompt: "comparison probiotic fermented food yogurt vs kimchi bacteria culture science visual",
        likes: 344, readTime: "5분", author: "미생물학 박사 팀",
        stats: { ph: "3.9", temp: "2.0°C", probiotics: "30억+ CFU/g", fermentationDays: 30 },
        pairingTip: "프로바이오틱 효과를 극대화하려면 항생제 복용 기간을 피해 섭취하세요.",
        recipe: "요거트에 깍두기 한 스푼을 넣어 믹싱하면 의외의 프로바이오틱 스무디가 완성됩니다."
    },
    {
        id: "pool-18", tag: "KIMCHI ART", category: "AI_STUDIO",
        title: "발효 미학: 김치가 캔버스가 되는 현대 미술의 경계",
        subtitle: "서울·하노이 아트씬이 주목하는 발효 오브제 설치 미술",
        excerpt: "유리 항아리 속에서 천천히 숙성되어 가는 김치의 색채 변화를 예술로 승화시키는 현대 아티스트들의 작품세계. 대한김치가 후원한 '발효 미학 2026' 전시의 하이라이트를 소개합니다.",
        date: "2026-06-15", image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1000&q=80",
        prompt: "contemporary art installation fermented kimchi glass jars light artistic Seoul gallery exhibition",
        likes: 122, readTime: "4분", author: "대한김치 아트 디렉터",
        stats: { ph: "4.5", temp: "3.0°C", probiotics: "5억 CFU/g", fermentationDays: 7 },
        pairingTip: "전시장 내 테이스팅 존에서 아티스트가 직접 담근 겉절이 시식이 가능합니다.",
        recipe: "예술 작품에 사용된 유리 항아리 속 김치는 전시 종료 후 관람객에게 무료 분양됩니다."
    },
    {
        id: "pool-19", tag: "EXPORT STORY", category: "SMART_FARM",
        title: "하노이→프랑크푸르트: 대한김치 유럽 수출 콜드체인 72시간의 기록",
        subtitle: "유럽 HACCP 기준을 통과한 국제 냉장 물류의 모든 것",
        excerpt: "하노이 공장에서 포장된 대한김치가 독일 프랑크푸르트 한인 마트에 도착하기까지 72시간 동안 유지되는 정밀 콜드체인을 추적합니다. EU 식품 안전 기준을 통과한 수출 인증 과정도 함께 공개합니다.",
        date: "2026-06-08", image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=1000&q=80",
        prompt: "cold chain logistics refrigerated cargo airplane food export international supply chain",
        likes: 145, readTime: "5분", author: "해외영업본부",
        stats: { ph: "4.0", temp: "0°C (수출 냉동)", probiotics: "10억 CFU/g", fermentationDays: 21 },
        pairingTip: "냉동 수출 김치는 해동 후 바로 섭취해야 아삭한 식감이 최대로 살아납니다.",
        recipe: "냉동 해동 시 냉장고에서 12시간 서서히 해동하면 세포 손상 없이 원래의 식감을 회복합니다."
    },
    {
        id: "pool-20", tag: "GASTRONOMIE", category: "RECIPE",
        title: "깍두기의 화려한 변신: 파인다이닝 레스토랑이 선택한 무김치 요리",
        subtitle: "구워낸 무의 단맛이 숙성 산미와 만났을 때의 마이야르 반응",
        excerpt: "하노이 미슐랭 가이드 비브 구르망에 오른 한식당 '소나무'의 수석 셰프가 공개하는 깍두기 활용 파인다이닝 레시피 3선. 깍두기를 갈아 만든 발효 소스부터 구운 깍두기 사이드까지.",
        date: "2026-05-30", image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1000&q=80",
        prompt: "gourmet Korean kkakdugi radish kimchi fine dining plating michelin star photography",
        likes: 278, readTime: "6분", author: "파인다이닝 셰프 팀",
        stats: { ph: "4.1", temp: "2.0°C", probiotics: "13억 CFU/g", fermentationDays: 14 },
        pairingTip: "얇게 썬 깍두기 위에 캐비어 한 알을 올리면 프레젠테이션과 맛 모두 완성됩니다.",
        recipe: "오븐에서 180°C로 10분 구운 깍두기는 겉이 캐러멜화되며 내부에 촉촉한 산미가 농축됩니다."
    },
    {
        id: "pool-21", tag: "VEGAN KIMCHI", category: "KIMCHI_DNA",
        title: "비건 김치의 정석: 동물성 젓갈 없이도 깊은 감칠맛을 살리는 법",
        subtitle: "표고버섯 파우더와 다시마 발효액으로 완성하는 채식 김치 레시피",
        excerpt: "전통 김치의 핵심 감칠맛을 담당하는 멸치액젓과 새우젓을 식물성 재료로 대체하면서도 동일한 풍미 깊이를 구현하는 대한김치 비건 라인의 개발 스토리를 공개합니다.",
        date: "2026-05-22", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
        prompt: "vegan plant based korean kimchi colorful vegetables fermented healthy lifestyle photography",
        likes: 192, readTime: "5분", author: "비건푸드연구팀",
        stats: { ph: "4.4", temp: "3.0°C", probiotics: "8억 CFU/g", fermentationDays: 10 },
        pairingTip: "비건 김치는 두부 요리나 곡물 샐러드와 함께 식물성 단백질 조합으로 완성됩니다.",
        recipe: "표고버섯 우린 물 300ml에 미역 우린 물 100ml를 섞어 30분간 약불로 졸이면 천연 감칠맛 베이스가 완성됩니다."
    },
    {
        id: "pool-22", tag: "KIMCHI RAMEN", category: "RECIPE",
        title: "김치 라멘의 탄생: 하노이 한인 셰프가 개발한 K-라멘 조리법",
        subtitle: "돼지뼈 육수와 신김치 발효 국물이 만드는 이중 깊이",
        excerpt: "하노이 한인타운 '호안끼엠'에서 폭발적 인기를 끌고 있는 대한김치 X 현지 라멘의 콜라보 레시피. 신김치를 육수에 함께 끓여 자연 발효 산미가 베어든 수프는 한번 맛보면 중독됩니다.",
        date: "2026-05-15", image: "https://images.unsplash.com/photo-1569418799600-87a523c5d10a?auto=format&fit=crop&w=1000&q=80",
        prompt: "korean kimchi ramen noodle soup hot steaming bowl chopsticks restaurant hanoi fusion",
        likes: 387, readTime: "4분", author: "하노이 K-라멘 연구소",
        stats: { ph: "4.0", temp: "끓는 온도", probiotics: "가열로 불활성", fermentationDays: 21 },
        pairingTip: "라멘에 넣을 김치는 신김치(2~3주 이상 숙성)를 사용해야 육수에 산미가 제대로 배어납니다.",
        recipe: "육수 1L에 신김치 200g을 넣고 30분 약불로 끓인 뒤 김치는 건져내고 국물만 사용하세요."
    },
    {
        id: "pool-23", tag: "HISTORY", category: "KIMCHI_DNA",
        title: "2,000년 발효사: 김치의 기원부터 현대화까지 연대기로 읽다",
        subtitle: "삼국시대 채소 절임에서 글로벌 프로바이오틱 식품으로의 대항해",
        excerpt: "고조선 시대의 소금 절임 채소에서 출발한 김치의 2,000년 진화사. 고려시대 붉은 고추의 도입, 조선시대 젓갈 배합의 완성, 그리고 냉장고 개발 후 현대화까지 — 발효 문화의 역사를 한눈에 정리합니다.",
        date: "2026-05-05", image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1000&q=80",
        prompt: "Korean history timeline ancient joseon dynasty traditional food culture kimchi evolution illustration",
        likes: 156, readTime: "8분", author: "음식역사학자",
        stats: { ph: "4.2", temp: "전통 온도", probiotics: "전통 자연균", fermentationDays: 30 },
        pairingTip: "역사 속 김치는 지금보다 훨씬 짜고 맵지 않았으며, 소금 절임에 가까운 형태였습니다.",
        recipe: "가장 오래된 형태의 김치를 재현하려면 배추 대신 순무에 소금과 산초만 넣어 15일간 절여보세요."
    },
    {
        id: "pool-24", tag: "KIMCHI COCKTAIL", category: "RECIPE",
        title: "김치 마티니가 세계를 놀라게 한 날: 뉴욕 바텐더가 말하는 발효 칵테일",
        subtitle: "김치 발효 국물이 가져다주는 천연 우마미 베이스의 혁신",
        excerpt: "뉴욕 트렌디 바에서 시작된 '킴치 마티니'가 하노이 루프탑 바까지 전파됐습니다. 김치 국물의 발효 산미가 진(Gin)의 주니퍼 향과 만들어내는 새로운 차원의 칵테일 경험을 소개합니다.",
        date: "2026-04-28", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80",
        prompt: "kimchi cocktail martini Korean fermented brine craft bar mixology New York",
        likes: 241, readTime: "4분", author: "하노이 믹솔로지 연구가",
        stats: { ph: "3.5 (발효 국물)", temp: "칵테일 서빙 온도", probiotics: "칵테일에는 비적합", fermentationDays: 30 },
        pairingTip: "김치 마티니 한 잔과 참치 타르타르, 그리고 김으로 만든 크래커로 아페리티프 코스를 완성하세요.",
        recipe: "진 60ml, 드라이 버무스 10ml, 신김치 국물 20ml를 쉐이커에 넣고 강하게 흔들어 쿠페 글래스에 따르세요."
    },
    {
        id: "pool-25", tag: "SKIN BEAUTY", category: "AI_STUDIO",
        title: "발효 미용학: 김치 유산균 추출물이 피부 장벽을 강화하는 원리",
        subtitle: "K-뷰티와 K-Food의 교차점에서 탄생한 발효 스킨케어",
        excerpt: "유산균 발효 과정에서 생성되는 천연 바이오폴리머와 펩타이드가 피부 마이크로바이옴을 균형 있게 조절합니다. 한국 뷰티 브랜드들이 앞다퉈 도입하는 김치 발효물 원료의 과학적 근거를 분석합니다.",
        date: "2026-04-20", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80",
        prompt: "Korean beauty skincare fermented kimchi extract lactobacillus luxury cosmetics clean beauty",
        likes: 415, readTime: "5분", author: "K-뷰티 발효연구소",
        stats: { ph: "4.1", temp: "추출 온도 35°C", probiotics: "발효 추출물", fermentationDays: 21 },
        pairingTip: "세안 후 발효 토너를 바를 때 가볍게 두드려 피부 흡수를 도와주세요.",
        recipe: "집에서 직접 만드는 DIY 김치 팩: 신김치 국물 2큰술 + 꿀 1큰술 + 쌀가루 1큰술을 섞어 15분간 도포 후 세안."
    },
    {
        id: "pool-26", tag: "TERROIR", category: "SMART_FARM",
        title: "테루아르(Terroir)가 김치에 미치는 영향: 같은 배추, 다른 맛의 비밀",
        subtitle: "서울 강원도 vs 하노이 달랏 고원지 배추의 발효 결과 비교",
        excerpt: "프랑스 와인의 테루아르(토양·기후·지형) 개념을 김치에 적용했습니다. 동일한 레시피로 담가도 배추의 재배 지역과 토양 성분에 따라 최종 산도, 식감, 발효 속도가 현저히 다르게 나타납니다.",
        date: "2026-04-12", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80",
        prompt: "highland terroir soil napa cabbage growth comparison sustainable organic farming Vietnam Korea",
        likes: 132, readTime: "6분", author: "원산지 품질연구팀",
        stats: { ph: "6.4", temp: "15°C (재배)", probiotics: "토양 유래 자연균", fermentationDays: 0 },
        pairingTip: "달랏 고원 배추는 수분 함량이 낮아 절임 시 소금을 20% 줄여도 충분합니다.",
        recipe: "재배지가 다른 두 배추로 각각 김치를 담가 한 달 뒤 맛을 비교해보세요. 놀라운 차이를 느낄 수 있습니다."
    },
    {
        id: "pool-27", tag: "B2B REPORT", category: "SMART_FARM",
        title: "하노이 5성급 호텔 주방을 점령한 대한김치: B2B 납품 성공 스토리",
        subtitle: "인터컨티넨탈·쉐라톤·메리어트가 선택한 HACCP 인증 발효 파트너",
        excerpt: "하노이 최고급 호텔 체인 12곳과 공급 계약을 맺은 대한김치의 B2B 영업 전략과 차별화 포인트. 현지 식자재 대비 3배 가격을 지불하면서도 대한김치를 선택하는 호텔 셰프들의 이유를 들었습니다.",
        date: "2026-04-04", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
        prompt: "luxury hotel kitchen chef Korean kimchi premium ingredient restaurant supply chain 5 star",
        likes: 178, readTime: "5분", author: "대한김치 B2B 영업팀",
        stats: { ph: "4.0", temp: "1.8°C (납품)", probiotics: "15억 CFU/g", fermentationDays: 14 },
        pairingTip: "호텔 조식 뷔페에서 포기김치는 외국인 투숙객에게 가장 인기 있는 K-Food 아이템입니다.",
        recipe: "B2B 납품용 김치는 개봉 후 3~5일 이내 사용하도록 주방에 안내하세요. 장기 보관 시 진공 재포장하세요."
    },
    {
        id: "pool-28", tag: "INNOVATION", category: "AI_STUDIO",
        title: "AI와 발효의 만남: 머신러닝으로 최적 발효 시점을 예측하다",
        subtitle: "센서 데이터 10만 건으로 훈련된 김치 숙성도 예측 모델",
        excerpt: "IoT 센서가 수집한 온도, 습도, pH, CO₂ 농도 데이터를 실시간 분석하여 김치의 최적 섭취 시점을 24시간 전에 예측하는 대한김치의 스마트 발효 AI 시스템을 공개합니다.",
        date: "2026-03-25", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
        prompt: "artificial intelligence IoT sensor fermentation prediction dashboard data visualization green neon",
        likes: 356, readTime: "6분", author: "대한김치 AI 개발팀",
        stats: { ph: "4.2", temp: "AI 예측 최적 온도", probiotics: "18억 CFU/g", fermentationDays: 21 },
        pairingTip: "앱 알림이 울리면 김치냉장고 문을 열어보세요. AI가 오늘이 가장 맛있는 날이라고 판단한 것입니다.",
        recipe: "스마트 김치통에 QR코드를 부착해 제조일, 재료, 예상 숙성 완료일을 간편하게 추적하세요."
    },
    {
        id: "pool-29", tag: "CULTURAL FUSION", category: "RECIPE",
        title: "김치 타코: 멕시코와 한국의 발효 혁명이 하노이에 착륙",
        subtitle: "살사 소스와 포기김치가 빚어내는 라틴-아시안 발효 크로스오버",
        excerpt: "멕시코 살사의 생 토마토 산미와 한국 김치의 발효 산미가 만나면 이중의 깊이를 가진 전혀 새로운 맛이 탄생합니다. 하노이에 열린 '킴치 타코' 팝업 레스토랑의 24시간 완판 기록을 소개합니다.",
        date: "2026-03-18", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80",
        prompt: "Korean kimchi taco fusion Mexican street food gourmet colorful vibrant food photography",
        likes: 312, readTime: "3분", author: "퓨전 푸드 큐레이터",
        stats: { ph: "4.3", temp: "서빙 온도", probiotics: "7억 CFU/g", fermentationDays: 7 },
        pairingTip: "매운 할라페뇨 대신 잘 익은 신김치를 타코 안에 가득 채우면 식감과 산미가 살사를 압도합니다.",
        recipe: "코르니아(Cortija) 치즈 위에 신김치 한 숟가락, 고수 잎, 라임 즙을 더하면 완벽한 킴치 타코 완성."
    },
    {
        id: "pool-30", tag: "SUSTAINABILITY", category: "SMART_FARM",
        title: "제로 웨이스트 김치: 배추 겉잎부터 절임 국물까지 100% 활용하는 법",
        subtitle: "김치 부산물 업사이클링으로 탄소 발자국을 40% 줄인 대한김치의 환경 전략",
        excerpt: "김치 생산 과정에서 버려지던 배추 겉잎은 동치미 원료로, 절임 간수는 해산물 정화용 천연 소독제로, 발효 CO₂는 온실 식물 성장 촉진제로 재활용됩니다. 대한김치의 전사적 친환경 순환 경제 모델을 공개합니다.",
        date: "2026-03-10", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
        prompt: "zero waste sustainable food production kimchi circular economy green recycling photography",
        likes: 223, readTime: "5분", author: "환경경영팀",
        stats: { ph: "4.0", temp: "2.0°C", probiotics: "12억 CFU/g", fermentationDays: 21 },
        pairingTip: "배추 겉잎으로 만든 된장 겉절이는 버리기 아까운 극강의 밥도둑입니다.",
        recipe: "절임 국물은 1:5 비율로 희석하여 텃밭 채소에 뿌려주면 천연 항균 발효 비료로 활용됩니다."
    }
];

// In-memory store (user-generated AI articles prepend here)
let userGeneratedArticles: ArticleImageItem[] = [];

// ─────────────────────────────────────────────
// 날짜 시드 기반 오늘의 아티클 선택 함수
// ─────────────────────────────────────────────
function getTodayArticle(): ArticleImageItem {
    // KST (UTC+9) 기준 날짜 문자열 → 시드
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    const dateStr = kstDate.toISOString().split("T")[0]; // "YYYY-MM-DD"

    // 날짜 문자열을 숫자 시드로 변환 (단순 해시)
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
    }
    const index = hash % ARTICLE_POOL.length;
    const base = ARTICLE_POOL[index];

    return {
        ...base,
        id: `today-${dateStr}`,
        date: dateStr,
        tag: "TODAY'S PICK",
        isToday: true,
        likes: base.likes + Math.floor(hash % 50) // 날짜마다 조금씩 다른 좋아요
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "ALL";
    const query = searchParams.get("query")?.trim().toLowerCase() || "";
    const sort = searchParams.get("sort") || "latest";

    // 오늘의 아티클 (항상 맨 앞)
    const todayArticle = getTodayArticle();

    // 전체 풀: 유저 생성 → 오늘 제외 나머지 풀
    const poolExcludingToday = ARTICLE_POOL.filter(a => a.id !== todayArticle.id.replace(`today-`, "").replace(/-\d{4}-\d{2}-\d{2}/, "") && a !== ARTICLE_POOL[ARTICLE_POOL.findIndex(p => `today-${new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split("T")[0]}` === `today-${new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split("T")[0]}` && p.id === a.id)]);
    const allArticles = [todayArticle, ...userGeneratedArticles, ...ARTICLE_POOL];

    // 중복 제거 (id 기준)
    const seen = new Set<string>();
    const deduped = allArticles.filter(a => {
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
    });

    let filtered = deduped.filter(item => {
        const matchesCategory = category === "ALL" || item.category === category;
        const matchesQuery = !query ||
            item.title.toLowerCase().includes(query) ||
            item.excerpt.toLowerCase().includes(query) ||
            item.tag.toLowerCase().includes(query) ||
            item.prompt.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });

    if (sort === "popular") {
        const todayItem = filtered.find(a => a.isToday);
        const rest = filtered.filter(a => !a.isToday);
        rest.sort((a, b) => b.likes - a.likes);
        filtered = todayItem ? [todayItem, ...rest] : rest;
    } else {
        // 최신순: 오늘 아티클은 항상 맨 위
        const todayItem = filtered.find(a => a.isToday);
        const rest = filtered.filter(a => !a.isToday);
        rest.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        filtered = todayItem ? [todayItem, ...rest] : rest;
    }

    return NextResponse.json({
        success: true,
        total: filtered.length,
        todayDate: new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().split("T")[0],
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

        const enhancedPrompt = `${prompt.trim()}, gourmet Korean kimchi fermentation culinary food photography, photorealistic, 8k resolution, cinematic lighting, appetizing`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1000&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

        const generatedTitle = title || `AI 큐레이션: ${prompt.slice(0, 30)}${prompt.length > 30 ? "..." : ""}`;

        const newArticle: ArticleImageItem = {
            id: `ai-gen-${Date.now()}`,
            tag: "AI GENERATED VISUAL",
            category: (category as ArticleImageItem["category"]) || "AI_STUDIO",
            title: generatedTitle,
            subtitle: "대한김치 실시간 AI 이미지 생성 API 엔진으로 합성된 비주얼",
            excerpt: `사용자 프롬프트 [${prompt}]를 기반으로 생성된 발효 미식 아트워크입니다.`,
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

        userGeneratedArticles = [newArticle, ...userGeneratedArticles];

        return NextResponse.json({ success: true, article: newArticle });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "이미지 생성 실패";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
