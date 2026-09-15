"use client";

import { useState, useMemo } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { products } from "@/data/products";
import { Search, SlidersHorizontal, Sparkles, Truck, ShieldCheck, PhoneCall, ShoppingBag, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORIES_KO = ["전체보기", "배추김치", "무김치", "별미김치", "계절김치", "스페셜"];

export default function Shop() {
    const { lang, t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState("전체보기");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "name">("default");
    const [addedId, setAddedId] = useState<number | null>(null);

    const getCategoryLabel = (cat: string) => {
        if (lang === "vi") {
            switch (cat) {
                case "전체보기": return "Tất cả";
                case "배추김치": return "Kimchi Cải Thảo";
                case "무김치": return "Kimchi Củ Cải";
                case "별미김치": return "Kimchi Đặc Biệt";
                case "계절김치": return "Kimchi Theo Mùa";
                case "스페셜": return "Đặc Biệt";
                default: return cat;
            }
        }
        return cat;
    };

    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                const matchesCat = selectedCategory === "전체보기" || product.category === selectedCategory;
                const matchesSearch =
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.koreanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (product.vietnameseName && product.vietnameseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    product.desc.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCat && matchesSearch;
            })
            .sort((a, b) => {
                if (sortBy === "price-asc") return a.price - b.price;
                if (sortBy === "price-desc") return b.price - a.price;
                if (sortBy === "name") {
                    const nameA = lang === "vi" ? (a.vietnameseName || a.name) : a.koreanName;
                    const nameB = lang === "vi" ? (b.vietnameseName || b.name) : b.koreanName;
                    return nameA.localeCompare(nameB);
                }
                return a.id - b.id;
            });
    }, [selectedCategory, searchQuery, sortBy, lang]);

    const handleAddToCart = (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        e.stopPropagation();
        setAddedId(productId);
        setTimeout(() => setAddedId(null), 1800);
    };

    return (
        <div className={styles.shopContainer}>
            {/* Header section */}
            <header className={styles.header}>
                <div className={styles.headerBadge}>
                    <Sparkles size={14} color="#C8392B" /> {t("hero.badge", "100% 당일 생산 \u0026 하노이 오토바이 직배송")}
                </div>
                <h1 className={`${styles.title} text-gradient`}>DAEHAN KIMCHI SHOP</h1>
                <p className={styles.description}>
                    {t("shop.sub", "한국 정통의 발효 비법과 HACCP 기준 위생 관리 환경에서 정성껏 담근 대한김치의 정통 라인업.")}<br />
                    {lang === "vi" 
                        ? "Từ gói lẻ 1Kg tươi ngon đến gói 5Kg sỉ cho nhà hàng, thanh toán dễ dàng qua chuyển khoản hoặc Tiền nạp DAEHAN." 
                        : "신선한 소매 1Kg 포장부터 식당·업소를 위한 5Kg 도매 포장까지 계좌이체 및 충전머니로 간편 결제할 수 있습니다."}
                </p>

                <div className={styles.deliveryBanner}>
                    <div className={styles.bannerItem}>
                        <Truck size={18} color="#D4870A" />
                        <span><strong>{lang === "vi" ? "Khi đặt hàng gói sỉ 5kg" : "5kg 도매 포장 주문 시"}</strong> {lang === "vi" ? "Giao hàng lạnh tận nơi tại Hà Nội" : "하노이 시내 오토바이 신선배송"}</span>
                    </div>
                    <div className={styles.bannerDivider}></div>
                    <div className={styles.bannerItem}>
                        <ShieldCheck size={18} color="#16a34a" />
                        <span><strong>{lang === "vi" ? "Giao hàng định kỳ cho nhà hàng" : "식당·업소·단체 정기납품"}</strong> {lang === "vi" ? "Giá sỉ ưu đãi gói 5Kg" : "5Kg 도매가 공급"}</span>
                    </div>
                    <div className={styles.bannerDivider}></div>
                    <div className={styles.bannerItem}>
                        <PhoneCall size={18} color="#2563eb" />
                        <span><strong>{lang === "vi" ? "Liên hệ tư vấn" : "주문 문의"}</strong> Zalo / Kakao : 0702116617</span>
                    </div>
                </div>
            </header>

            {/* Filter & Search Bar */}
            <div className={`${styles.filterBar} container`}>
                <div className={styles.categoryTabs}>
                    {CATEGORIES_KO.map(cat => {
                        const count = cat === "전체보기"
                            ? products.length
                            : products.filter(p => p.category === cat).length;
                        return (
                            <button
                                key={cat}
                                className={`${styles.categoryTab} ${selectedCategory === cat ? styles.activeTab : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {getCategoryLabel(cat)} <span className={styles.tabCount}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className={styles.searchAndSort}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder={t("shop.searchPlaceholder", "김치 이름, 종류 검색...")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchQuery && (
                            <button className={styles.clearSearch} onClick={() => setSearchQuery("")}>✕</button>
                        )}
                    </div>

                    <div className={styles.sortSelectWrap}>
                        <SlidersHorizontal size={16} className={styles.sortIcon} />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className={styles.sortSelect}
                        >
                            <option value="default">{lang === "vi" ? "Nổi bật nhất" : "기본 추천순"}</option>
                            <option value="price-asc">{lang === "vi" ? "Giá từ thấp đến cao" : "가격 낮은순"}</option>
                            <option value="price-desc">{lang === "vi" ? "Giá부터 높은순" : "가격 높은순"}</option>
                            <option value="name">{lang === "vi" ? "Theo bảng chữ cái" : "가나다순"}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className={`${styles.productGrid} container`}>
                {filteredProducts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>{lang === "vi" ? "Không tìm thấy sản phẩm Kimchi nào phù hợp." : "검색 결과에 맞는 김치가 없습니다."}</p>
                        <button
                            className="btn-primary"
                            onClick={() => { setSelectedCategory("전체보기"); setSearchQuery(""); }}
                            style={{ marginTop: '16px' }}
                        >
                            {t("shop.all", "전체 상품 보기")}
                        </button>
                    </div>
                ) : (
                    filteredProducts.map(product => {
                        const displayName = lang === "vi" ? (product.vietnameseName || product.koreanName) : product.koreanName;
                        const displayCategory = lang === "vi" ? (product.vietnameseCategory || product.category) : product.category;
                        const displayDesc = lang === "vi" ? (product.vietnameseDesc || product.desc) : product.desc;
                        const displayFeatures = lang === "vi" ? (product.vietnameseFeatures || product.features) : product.features;

                        return (
                            <Link href={`/shop/${product.id}`} key={product.id} className={styles.cardLink}>
                                <article className={styles.productCard}>
                                    <div className={styles.imageWrapper}>
                                        {product.badge && (
                                            <span className={`${styles.badge} ${product.badge.includes('HOT') ? styles.hotBadge : ''}`}>
                                                {product.badge}
                                            </span>
                                        )}
                                        <span className={styles.categoryTag}>{displayCategory}</span>
                                        <img
                                            src={product.image}
                                            alt={displayName}
                                            className={styles.productImage}
                                            loading="lazy"
                                        />
                                        <div className={styles.weightTag}>{product.weight}</div>
                                    </div>

                                    <div className={styles.info}>
                                        <div className={styles.titleHeader}>
                                            <h2 className={styles.productName}>{displayName}</h2>
                                            <span className={styles.englishName}>{product.englishName}</span>
                                        </div>
                                        <p className={styles.productDesc}>{displayDesc}</p>

                                        <div className={styles.featurePills}>
                                            {displayFeatures.slice(0, 2).map((f, i) => (
                                                <span key={i} className={styles.featurePill}>{f}</span>
                                            ))}
                                        </div>

                                        <div className={styles.footer}>
                                            <div className={styles.priceContainer}>
                                                <span className={styles.price}>{product.priceFormatted}</span>
                                                <span className={styles.priceLabel}>{lang === "vi" ? "Gói lẻ 1Kg" : "소매 1Kg 기준"}</span>
                                            </div>
                                            <button
                                                className={`${styles.addToCartBtn} ${addedId === product.id ? styles.addedBtn : ''}`}
                                                onClick={(e) => handleAddToCart(e, product.id)}
                                            >
                                                {addedId === product.id ? (
                                                    <><Check size={16} /> {lang === "vi" ? "Đã thêm!" : "담김!"}</>
                                                ) : (
                                                    <><ShoppingBag size={16} /> {t("shop.addToCart", "담기")}</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Wholesale Bottom Callout */}
            <div className={`${styles.wholesaleCallout} container`}>
                <div className={styles.wholesaleContent}>
                    <div className={styles.wholesaleText}>
                        <span className="badge">B2B & WHOLESALE</span>
                        <h3>{lang === "vi" ? "Hướng dẫn đặt hàng sỉ số lượng lớn cho Nhà hàng / Doanh nghiệp" : "식당 / 기업 / 단체 대량 주문 안내"}</h3>
                        <p>
                            {lang === "vi" 
                                ? "Cung cấp Kimchi tươi đóng gói 5kg bảo quản lạnh định kỳ cho các nhà hàng Hàn Quốc, khách sạn và siêu thị tại Hà Nội." 
                                : "하노이 내 한식당, 호텔, 기업체 급식 및 마트에 정기적으로 5kg 도매 포장 단위로 신선하게 오토바이로 신속배송합니다."}<br />
                            {lang === "vi" 
                                ? "Ưu đãi thêm điểm DP và tùy chỉnh độ chua theo yêu cầu hợp đồng." 
                                : "정기 계약 시 맞춤형 숙성도 조절 및 대한포인트 추가 적립 혜택을 제공합니다."}
                        </p>
                    </div>
                    <div className={styles.wholesaleActions}>
                        <a
                            href="https://zalo.me/0702116617"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                            <PhoneCall size={18} /> {lang === "vi" ? "Tư vấn sỉ qua Zalo" : "Zalo 도매 직통 상담"}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
