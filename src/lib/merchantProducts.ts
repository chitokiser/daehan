"use client";

/**
 * 대한김치 판매 상품 = BestClub 중앙 Firestore `merchant_products` (BestERP 상품 마스터).
 * 정적 상품 배열(src/data/products.ts)은 더 이상 화면에 사용하지 않는다 (BestClub CLAUDE.md §7.2, §8.2, §17).
 * 조회 조건: merchant_id in [정식 ID, 숫자형] && sale_status == 'published'
 */
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, type DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import type { Product } from "@/types/product";

export const DAEHAN_MERCHANT_ID = process.env.NEXT_PUBLIC_BESTCLUB_MERCHANT_ID || "1791002036";

const CACHE_TTL_MS = 30_000;
let cache: { at: number; promise: Promise<Product[]> } | null = null;

function str(v: unknown): string | undefined {
    return typeof v === "string" && v.length > 0 ? v : undefined;
}
function num(v: unknown): number | undefined {
    return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}
function strArr(v: unknown): string[] {
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}
/** site_meta 가 없는 상품(BestERP 에서 직접 등록)용 안정적인 숫자 ID */
function stableNumericId(docId: string): number {
    let h = 2166136261;
    for (let i = 0; i < docId.length; i++) h = Math.imul(h ^ docId.charCodeAt(i), 16777619);
    return 100000 + (Math.abs(h) % 900000);
}

export function toSiteProduct(docId: string, d: DocumentData): Product | null {
    const price = num(d.price);
    const name = str(d.product_name);
    if (!name || price === undefined) return null;
    const meta: Record<string, unknown> = typeof d.site_meta === "object" && d.site_meta !== null ? d.site_meta : {};
    const images = strArr(d.images);
    const id = num(meta.legacyId) ?? stableNumericId(docId);
    return {
        id,
        idx: num(meta.legacyIdx) ?? id,
        name,
        koreanName: str(meta.koreanName) ?? name,
        englishName: str(meta.englishName) ?? name,
        vietnameseName: str(meta.vietnameseName),
        weight: str(meta.weight) ?? "",
        category: str(meta.category) ?? "기타",
        vietnameseCategory: str(meta.vietnameseCategory),
        price,
        priceFormatted: `${price.toLocaleString("en-US")} VND`,
        badge: str(meta.badge),
        desc: str(d.description) ?? "",
        vietnameseDesc: str(meta.vietnameseDesc),
        detailDesc: str(meta.detailDesc) ?? str(d.description) ?? "",
        vietnameseDetailDesc: str(meta.vietnameseDetailDesc),
        features: strArr(meta.features),
        vietnameseFeatures: strArr(meta.vietnameseFeatures),
        slug: str(meta.slug) ?? docId,
        imgUrl: str(meta.imgUrl) ?? images[1],
        image: str(meta.image) ?? images[0] ?? str(d.image_url) ?? "",
        bestclubProductId: docId,
        displayOrder: num(meta.displayOrder) ?? num(d.display_order) ?? 999,
    };
}

async function fetchProducts(): Promise<Product[]> {
    const ids: Array<string | number> = [DAEHAN_MERCHANT_ID];
    if (/^\d+$/.test(DAEHAN_MERCHANT_ID)) ids.push(Number(DAEHAN_MERCHANT_ID));
    const snap = await getDocs(
        query(collection(db, "merchant_products"), where("merchant_id", "in", ids), where("sale_status", "==", "published")),
    );
    const list: Product[] = [];
    snap.forEach((doc) => {
        const p = toSiteProduct(doc.id, doc.data());
        if (p) list.push(p);
    });
    list.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999) || a.id - b.id);
    return list;
}

export function loadMerchantProducts(force = false): Promise<Product[]> {
    if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.promise;
    const promise = fetchProducts();
    cache = { at: Date.now(), promise };
    promise.catch(() => {
        cache = null;
    });
    return promise;
}

export function useMerchantProducts(): { products: Product[]; loading: boolean; error: string | null } {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        let alive = true;
        loadMerchantProducts()
            .then((list) => {
                if (alive) setProducts(list);
            })
            .catch((err: unknown) => {
                if (alive) setError(err instanceof Error ? err.message : String(err));
            })
            .finally(() => {
                if (alive) setLoading(false);
            });
        return () => {
            alive = false;
        };
    }, []);
    return { products, loading, error };
}
