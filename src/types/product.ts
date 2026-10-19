/**
 * 대한김치 홈페이지 상품 표시 타입.
 * 상품 데이터는 BestClub 중앙 Firestore merchant_products (BestERP 상품 마스터)에서만 가져온다
 * — src/lib/merchantProducts.ts 참고. 하드코딩된 상품 배열은 2026-10-19 메인 DB 이전 후 삭제됨.
 */
export interface Product {
    id: number;
    idx: number;
    name: string;
    koreanName: string;
    englishName: string;
    vietnameseName?: string;
    weight: string;
    category: string;
    vietnameseCategory?: string;
    price: number;
    priceFormatted: string;
    badge?: string;
    desc: string;
    vietnameseDesc?: string;
    detailDesc: string;
    vietnameseDetailDesc?: string;
    features: string[];
    vietnameseFeatures?: string[];
    slug: string;
    imgUrl?: string;
    image: string;
    /** BestClub merchant_products 문서 ID (DB 연동 상품) */
    bestclubProductId?: string;
    displayOrder?: number;
}
