export interface Product {
    id: number;
    idx: number;
    name: string;
    koreanName: string;
    englishName: string;
    weight: string;
    category: string;
    price: number;
    priceFormatted: string;
    priceHex?: number;
    badge?: string;
    desc: string;
    detailDesc: string;
    features: string[];
    slug: string;
    imgUrl?: string;
    image: string;
}

export function vndToHex(vnd: number): number {
    return Math.round(vnd / 1000);
}

export const products: Product[] = [
    {
        "id": 1,
        "idx": 14,
        "name": "포기김치 (Pogi Kimchi) 1Kg",
        "koreanName": "포기김치",
        "englishName": "Traditional Whole Cabbage Kimchi",
        "weight": "1Kg",
        "category": "배추김치",
        "price": 90000,
        "priceFormatted": "90,000 VND",
        "badge": "BEST",
        "desc": "신선한 고랭지 배추와 30년 비법 양념으로 정성껏 담근 대한김치의 대표 시그니처 배추김치.",
        "detailDesc": "한국 정통 레시피와 100% 엄선된 식재료를 사용하여 아삭한 배추의 결마다 깊고 시원한 감칠맛 양념이 가득 배어 있습니다. 갓 담근 생김치의 아삭함부터 알맞게 익었을 때의 깊은 풍미까지 식탁을 풍성하게 만듭니다.",
        "features": [
            "엄선된 신선 배추 사용",
            "전통 발효 비법 양념",
            "HACCP 위생 인증 시설 제조"
        ],
        "slug": "pogi",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/7fee4253432e9.jpg?w=800",
        "image": "/images/products/pogi.jpg"
    },
    {
        "id": 2,
        "idx": 13,
        "name": "맛김치 (Mat Kimchi) 1Kg",
        "koreanName": "맛김치",
        "englishName": "Sliced Fresh Kimchi",
        "weight": "1Kg",
        "category": "배추김치",
        "price": 80000,
        "priceFormatted": "80,000 VND",
        "badge": "POPULAR",
        "desc": "먹기 좋은 한 입 크기로 썰어 담가 바로 간편하게 즐길 수 있는 신선하고 깔끔한 배추 맛김치.",
        "detailDesc": "한 입 크기로 손질된 알배기 배추에 시원하고 칼칼한 양념을 버무려 썰어 먹는 번거로움 없이 식탁이나 야외, 도시락 어디서든 편리하게 즐길 수 있는 실속형 김치입니다.",
        "features": [
            "한 입 크기 간편 컷팅",
            "시원하고 깔끔한 맛",
            "가정 및 식당 인기 메뉴"
        ],
        "slug": "matkimchi",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/dda0c1e295a54.jpg?w=800",
        "image": "/images/products/matkimchi.jpg"
    },
    {
        "id": 3,
        "idx": 15,
        "name": "깍두기 (Kkakdugi) 1Kg",
        "koreanName": "깍두기",
        "englishName": "Cubed Radish Kimchi",
        "weight": "1Kg",
        "category": "무김치",
        "price": 100000,
        "priceFormatted": "100,000 VND",
        "badge": "POPULAR",
        "desc": "아삭아삭한 단단한 무와 시원달큼한 양념이 어우러진 곰탕·국밥·라면 단짝 깍두기.",
        "detailDesc": "수분감 가득하고 단맛이 차오른 신선한 무를 깍둑썰기하여 매콤달콤한 비법 고춧가루와 멸치액젓으로 버무렸습니다. 씹을 때마다 터지는 시원한 무즙과 감칠맛이 일품입니다.",
        "features": [
            "아삭아삭 씹히는 식감",
            "시원하고 개운한 즙",
            "국물 요리와 환상 궁합"
        ],
        "slug": "kkakdugi",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/6e4eec2445053.jpg?w=800",
        "image": "/images/products/kkakdugi.jpg"
    },
    {
        "id": 4,
        "idx": 16,
        "name": "석박지 (Seokbakji) 1Kg",
        "koreanName": "석박지",
        "englishName": "Thick-Cut Korean Radish Kimchi",
        "weight": "1Kg",
        "category": "무김치",
        "price": 100000,
        "priceFormatted": "100,000 VND",
        "badge": "RECOMMEND",
        "desc": "큼직큼직하게 썰어 국물요리 및 설렁탕 전문점의 깊은 맛을 그대로 재현한 정통 석박지.",
        "detailDesc": "큼직하게 썬 무에 찹쌀풀과 칼칼한 양념을 듬뿍 넣어 시원하게 숙성시킨 석박지입니다. 탕이나 국밥 국물에 살짝 적셔 드시면 깊고 풍부한 감칠맛을 느끼실 수 있습니다.",
        "features": [
            "큼직하고 풍성한 두께",
            "전문점 스타일 깊은 숙성미",
            "시원한 발효 탄산감"
        ],
        "slug": "seokbakji",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/363a948fcd32a.jpg?w=800",
        "image": "/images/products/seokbakji.jpg"
    },
    {
        "id": 5,
        "idx": 17,
        "name": "신김치 / 묵은지 (Mookeunji) 1Kg",
        "koreanName": "신김치 (묵은지)",
        "englishName": "Aged Sour Kimchi",
        "weight": "1Kg",
        "category": "배추김치",
        "price": 90000,
        "priceFormatted": "90,000 VND",
        "badge": "COOKING",
        "desc": "저온 숙성으로 깊은 감칠맛과 묵직한 산미가 살아있는 김치찌개·찜·볶음 요리 필수 신김치.",
        "detailDesc": "적정 온도에서 장기간 저온 숙성시켜 깊은 유산균 발효 풍미가 우러나오는 묵은지입니다. 김치찌개, 돼지고기 김치찜, 김치볶음밥, 부침개 요리 시 깊고 진한 맛을 선사합니다.",
        "features": [
            "깊은 저온 젖산 발효",
            "찌개·찜 조리에 최적화",
            "풍부한 유산균과 깊은 산미"
        ],
        "slug": "mookeunji",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/9f648b03e369c.jpg?w=800",
        "image": "/images/products/mookeunji.jpg"
    },
    {
        "id": 6,
        "idx": 18,
        "name": "쪽파김치 (Pa Kimchi) 1Kg",
        "koreanName": "쪽파김치",
        "englishName": "Scallion / Green Onion Kimchi",
        "weight": "1Kg",
        "category": "별미김치",
        "price": 110000,
        "priceFormatted": "110,000 VND",
        "badge": "PREMIUM",
        "desc": "알싸한 쪽파와 진한 멸치액젓 양념의 완벽한 조화, 짜파게티·수육과 환상의 짝꿍 쪽파김치.",
        "detailDesc": "달큼하면서도 알싸한 신선한 쪽파만을 골라 진한 남도식 멸치액젓과 고춧가루로 버무렸습니다. 익을수록 톡 쏘는 감칠맛이 고기 요리와 라면의 기름진 맛을 깔끔하게 잡아줍니다.",
        "features": [
            "알싸하고 향긋한 신선 쪽파",
            "깊은 남도식 액젓 양념",
            "고기/라면과 환상 마리아주"
        ],
        "slug": "jjokpa",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/882733b0c35ec.jpg?w=800",
        "image": "/images/products/jjokpa.jpg"
    },
    {
        "id": 7,
        "idx": 19,
        "name": "대파김치 (Daepa Kimchi) 1Kg",
        "koreanName": "대파김치",
        "englishName": "Leek / Large Green Onion Kimchi",
        "weight": "1Kg",
        "category": "별미김치",
        "price": 120000,
        "priceFormatted": "120,000 VND",
        "badge": "SPECIAL",
        "desc": "도톰하고 달큼한 대파의 결이 살아있어 고기 구이와 함께 구워 먹으면 극상의 별미 대파김치.",
        "detailDesc": "통통하게 살이 오른 신선한 대파를 큼직하게 썰어 매콤알싸한 비법 소스로 숙성시켰습니다. 삼겹살, 곱창 구이와 함께 곁들이거나 불판에 살짝 구워드시면 최고의 풍미를 자랑합니다.",
        "features": [
            "달큼하고 굵직한 대파",
            "구이 요리에 특화된 별미",
            "중독성 강한 알싸함"
        ],
        "slug": "daepa",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/8df0090311ac1.jpg?w=800",
        "image": "/images/products/daepa.jpg"
    },
    {
        "id": 8,
        "idx": 20,
        "name": "깻잎김치 (Kkaennip Kimchi) 1Kg",
        "koreanName": "깻잎김치",
        "englishName": "Pickled Perilla Leaves Kimchi",
        "weight": "1Kg",
        "category": "별미김치",
        "price": 160000,
        "priceFormatted": "160,000 VND",
        "badge": "RECOMMEND",
        "desc": "한 장 한 장 정성스럽게 수제 비법 양념을 덧바른 향긋하고 입맛 돋우는 밥도둑 깻잎김치.",
        "detailDesc": "향긋함이 살아있는 여린 깻잎을 깨끗이 세척 후 수제 비법 간장·고춧가루 양념을 정성스레 발랐습니다. 따끈한 흰 쌀밥에 싸서 드시면 밥 한 공기가 순식간에 사라집니다.",
        "features": [
            "수작업 정성 양념 코팅",
            "입맛 살리는 특유의 깻잎 향",
            "대표 밥도둑 반찬"
        ],
        "slug": "kkaennip",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/e311e7030f6df.jpg?w=800",
        "image": "/images/products/kkaennip.jpg"
    },
    {
        "id": 9,
        "idx": 21,
        "name": "총각김치 (Chonggak Kimchi) 1Kg",
        "koreanName": "총각김치 (알타리)",
        "englishName": "Ponytail Radish Kimchi",
        "weight": "1Kg",
        "category": "무김치",
        "price": 120000,
        "priceFormatted": "120,000 VND",
        "badge": "POPULAR",
        "desc": "단단하고 달콤한 알타리무와 싱싱한 무청의 식감이 어우러져 아삭함의 끝판왕 총각김치.",
        "detailDesc": "한 입 베어물면 쾌활한 소리와 함께 시원한 무즙이 터지는 명품 알타리 총각김치입니다. 무의 단단함과 무청의 쫄깃한 식감이 조화를 이루어 오랫동안 질리지 않는 맛입니다.",
        "features": [
            "탄력 있고 단단한 알타리무",
            "영양 가득한 신선 무청",
            "풍부한 유산균과 식감"
        ],
        "slug": "chonggak",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/a479ba4702689.jpg?w=800",
        "image": "/images/products/chonggak.jpg"
    },
    {
        "id": 10,
        "idx": 22,
        "name": "열무김치 (Yeolmu Kimchi) 1Kg",
        "koreanName": "열무김치",
        "englishName": "Young Summer Radish Kimchi",
        "weight": "1Kg",
        "category": "계절김치",
        "price": 100000,
        "priceFormatted": "100,000 VND",
        "badge": "SUMMER",
        "desc": "어린 열무의 연하고 아삭한 줄기로 담가 열무국수·비빔밥과 찰떡궁합인 시원한 열무김치.",
        "detailDesc": "풋내 없이 산뜻하게 절인 어린 열무에 홍고추와 특제 찹쌀풀로 시원하고 칼칼하게 국물을 우려냈습니다. 열무비빔밥, 시원한 열무냉면, 비빔국수 토핑으로 최고의 맛을 선사합니다.",
        "features": [
            "질기지 않은 연한 어린 열무",
            "시원하고 깔끔한 국물",
            "비빔밥/국수 최고의 토핑"
        ],
        "slug": "yeolmu",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/4f429c1a1de34.jpg?w=800",
        "image": "/images/products/yeolmu.jpg"
    },
    {
        "id": 11,
        "idx": 23,
        "name": "갓김치 (Gat Kimchi) 1Kg",
        "koreanName": "갓김치 (돌산갓김치)",
        "englishName": "Mustard Greens Kimchi",
        "weight": "1Kg",
        "category": "별미김치",
        "price": 110000,
        "priceFormatted": "110,000 VND",
        "badge": "PREMIUM",
        "desc": "톡 쏘는 독특한 향과 깊은 알싸함이 매력적인 남도 전통 스타일의 프리미엄 갓김치.",
        "detailDesc": "줄기가 굵고 잎이 싱싱한 갓에 풍부한 멸치진젓과 고춧가루 양념을 듬뿍 버무려 숙성될수록 톡 쏘는 청량감과 묵직한 감칠맛을 즐길 수 있는 미식가의 김치입니다.",
        "features": [
            "돌산갓 특유의 톡 쏘는 향",
            "진한 남도 젓갈 풍미",
            "숙성될수록 깊어지는 맛"
        ],
        "slug": "gatkimchi",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/423135146af15.jpg?w=800",
        "image": "/images/products/gatkimchi.jpg"
    },
    {
        "id": 12,
        "idx": 24,
        "name": "오이소박이 (Oisobagi) 1Kg",
        "koreanName": "오이소박이",
        "englishName": "Stuffed Cucumber Kimchi",
        "weight": "1Kg",
        "category": "별미김치",
        "price": 110000,
        "priceFormatted": "110,000 VND",
        "badge": "SEASONAL",
        "desc": "아삭한 오이 속에 부추와 당근 비법 속재료를 꽉 채워 청량하고 상큼한 오이소박이.",
        "detailDesc": "수분 가득한 신선한 백오이에 십자 칼집을 내고 향긋한 부추와 칼칼한 양념소를 가득 채웠습니다. 입안 가득 퍼지는 상큼한 오이향과 시원한 채즙이 기름진 입맛을 깔끔하게 정돈해줍니다.",
        "features": [
            "아삭하고 청량한 오이 채즙",
            "향긋한 부추속 가득",
            "사계절 사랑받는 별미"
        ],
        "slug": "oisobagi",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/53dbfa7e87182.jpg?w=800",
        "image": "/images/products/oisobagi.jpg"
    },
    {
        "id": 13,
        "idx": 26,
        "name": "실비김치 / 매운김치 (Silbi Hot Kimchi) 1Kg",
        "koreanName": "실비김치 (화끈하게 매운김치)",
        "englishName": "Super Spicy Silbi Kimchi",
        "weight": "1Kg",
        "category": "스페셜",
        "price": 130000,
        "priceFormatted": "130,000 VND",
        "badge": "HOT 🔥",
        "desc": "최상급 청양고추와 특제 매운 양념으로 뇌리까지 짜릿하게 매운 중독성 최강의 실비김치.",
        "detailDesc": "스트레스가 확 풀리는 강렬한 매운맛! 최상급 캡사이신 인공 가미 없이 자연 고춧가루와 비법 배합만으로 만든 맛있게 매운 실비김치입니다. 짜장라면, 보쌈, 소고기 구이와 곁들이면 극락의 궁합입니다.",
        "features": [
            "자연 청양고춧가루의 화끈함",
            "중독적인 매콤달콤 양념",
            "SNS 화제의 인기 김치"
        ],
        "slug": "silbi",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/d2ddf3925d5a3.jpg?w=800",
        "image": "/images/products/silbi.jpg"
    },
    {
        "id": 14,
        "idx": 28,
        "name": "양파김치 (Yangpa Kimchi) 1Kg",
        "koreanName": "양파김치",
        "englishName": "Korean Onion Kimchi",
        "weight": "1Kg",
        "category": "별미김치",
        "price": 80000,
        "priceFormatted": "80,000 VND",
        "badge": "NEW",
        "desc": "달큼한 햇양파의 아삭한 겹겹마다 매콤새콤 양념이 쏙 배어든 산뜻하고 깔끔한 양파김치.",
        "detailDesc": "매운맛을 빼고 단맛을 극대화한 신선한 양파에 감칠맛 넘치는 젓갈 양념을 버무려 씹을 때마다 아삭하고 달콤한 즙이 배어나옵니다. 고기 요리의 느끼함을 씻어주는 최고의 식탁 반찬입니다.",
        "features": [
            "달큼하고 아삭한 햇양파",
            "산뜻하고 깔끔한 감칠맛",
            "기름진 요리와 찰떡궁합"
        ],
        "slug": "yangpa",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/8d51d6ae6f926.jpg?w=800",
        "image": "/images/products/yangpa.jpg"
    },
    {
        "id": 15,
        "idx": 31,
        "name": "얼갈이김치 (Eolgari Kimchi) 1Kg",
        "koreanName": "얼갈이김치",
        "englishName": "Baby Napa Cabbage Kimchi",
        "weight": "1Kg",
        "category": "계절김치",
        "price": 120000,
        "priceFormatted": "120,000 VND",
        "badge": "NEW",
        "desc": "부드럽고 풋풋한 얼갈이배추로 담가 시원하고 개운한 맛이 일품인 싱그러운 얼갈이김치.",
        "detailDesc": "연한 얼갈이배추의 숨을 살려 홍고추와 멸치액젓으로 가볍고 산뜻하게 버무려냈습니다. 텁텁함 없이 시원하고 맑은 감칠맛으로 여름철 입맛을 돋우며 강된장 보리밥이나 비빔밥에 제격입니다.",
        "features": [
            "부드럽고 풋풋한 얼갈이",
            "시원하고 맑은 감칠맛",
            "보리밥/비빔밥 최고의 짝꿍"
        ],
        "slug": "eolgari",
        "imgUrl": "https://cdn-optimized.imweb.me/upload/S2023051834e94c6548805/3f08e57e09aef.png?w=800",
        "image": "/images/products/eolgari.jpg"
    }
];

export function getProductById(id: number): Product | undefined {
    return products.find(p => p.id === id);
}

export function getProductByIdx(idx: number): Product | undefined {
    return products.find(p => p.idx === idx);
}

export function getProductByIdOrSlug(idOrSlug: string | number): Product | undefined {
    if (typeof idOrSlug === "number" || !isNaN(Number(idOrSlug))) {
        const num = Number(idOrSlug);
        return products.find(p => p.id === num || p.idx === num);
    }
    return products.find(p => p.slug.toLowerCase() === String(idOrSlug).toLowerCase());
}
