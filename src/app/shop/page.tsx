"use client";

import { useState, useMemo } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { products, vndToHex } from "@/data/products";
import { useUserWallet } from "@/context/UserWalletContext";
import { Search, SlidersHorizontal, Sparkles, Truck, ShieldCheck, PhoneCall, ShoppingBag, Check, Coins, Wallet } from "lucide-react";

const CATEGORIES = ["전체보기", "배추김치", "무김치", "별미김치", "계절김치", "스페셜"];

export default function Shop() {
    const { wallet, isLoggedIn } = useUserWallet();
    const [selectedCategory, setSelectedCategory] = useState("전체보기");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "name">("default");
    const [addedId, setAddedId] = useState<number | null>(null);

    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                const matchesCat = selectedCategory === "전체보기" || product.category === selectedCategory;
                const matchesSearch =
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.koreanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.desc.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCat && matchesSearch;
            })
            .sort((a, b) => {
                if (sortBy === "price-asc") return a.price - b.price;
                if (sortBy === "price-desc") return b.price - a.price;
                if (sortBy === "name") return a.koreanName.localeCompare(b.koreanName, "ko");
                return a.id - b.id;
            });
    }, [selectedCategory, searchQuery, sortBy]);

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
                    <Sparkles size={14} color="#e31837" /> 100% 당일 생산 & 하노이 콜드체인 직배송
                </div>
                <h1 className={`${styles.title} text-gradient`}>DAEHAN KIMCHI SHOP</h1>
                <p className={styles.description}>
                    30년 전통의 발효 비법과 HACCP 인증 클린룸 시설에서 정성껏 담근 대한김치의 15가지 정통 라인업.<br />
                    신선한 소매 1Kg 단위부터 식당·기업을 위한 10Kg 이상 대량 주문까지 일반 결제(VND/계좌이체) 및 K-MOA 충전머니, 포인트로 간편 결제할 수 있습니다.
                </p>

                {/* K-MOA Crypto & Web3 Banner */}
                <div className={styles.hexNoticeBar}>
                    <div className={styles.hexNoticeItem}>
                        <Coins size={18} color="#fcd34d" />
                        <span><strong>결제 안내:</strong> 일반 결제(VND/계좌이체) 및 K-MOA 충전머니(HEX) 결제 시 5% DP 대한포인트 즉시 적립</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link href="/kmoa-guide" style={{ color: '#fcd34d', fontSize: '0.82rem', textDecoration: 'underline', fontWeight: 600 }}>
                            K-MOA 결제안내
                        </Link>
                        {isLoggedIn && (
                            <div className={styles.hexBalancePill}>
                                <Wallet size={14} color="#00E676" />
                                <span>내 충전머니 잔액: <strong>{wallet.hexTokenBalance.toLocaleString()} HEX</strong></span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.deliveryBanner}>
                    <div className={styles.bannerItem}>
                        <Truck size={18} color="#f7a400" />
                        <span><strong>10kg 이상 주문 시</strong> 하노이 시내 무료배송</span>
                    </div>
                    <div className={styles.bannerDivider}></div>
                    <div className={styles.bannerItem}>
                        <ShieldCheck size={18} color="#00E676" />
                        <span><strong>식당·업소·단체 정기납품</strong> 특별 도매가 공급</span>
                    </div>
                    <div className={styles.bannerDivider}></div>
                    <div className={styles.bannerItem}>
                        <PhoneCall size={18} color="#2979FF" />
                        <span><strong>주문 문의</strong> Zalo / Kakao : 0702116617</span>
                    </div>
                </div>
            </header>

            {/* Filter & Search Bar */}
            <div className={`${styles.filterBar} container`}>
                <div className={styles.categoryTabs}>
                    {CATEGORIES.map(cat => {
                        const count = cat === "전체보기" 
                            ? products.length 
                            : products.filter(p => p.category === cat).length;
                        return (
                            <button
                                key={cat}
                                className={`${styles.categoryTab} ${selectedCategory === cat ? styles.activeTab : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat} <span className={styles.tabCount}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className={styles.searchAndSort}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="김치 이름, 종류 검색..."
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
                            <option value="default">기본 추천순</option>
                            <option value="price-asc">가격 낮은순</option>
                            <option value="price-desc">가격 높은순</option>
                            <option value="name">가나다순</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className={`${styles.productGrid} container`}>
                {filteredProducts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>검색 결과에 맞는 김치가 없습니다.</p>
                        <button 
                            className="btn-primary" 
                            onClick={() => { setSelectedCategory("전체보기"); setSearchQuery(""); }}
                            style={{ marginTop: '16px' }}
                        >
                            전체 상품 보기
                        </button>
                    </div>
                ) : (
                    filteredProducts.map(product => {
                        const hexPrice = vndToHex(product.price);
                        return (
                            <Link href={`/shop/${product.id}`} key={product.id} className={styles.cardLink}>
                                <article className={styles.productCard}>
                                    <div className={styles.imageWrapper}>
                                        {product.badge && (
                                            <span className={`${styles.badge} ${product.badge.includes('HOT') ? styles.hotBadge : ''}`}>
                                                {product.badge}
                                            </span>
                                        )}
                                        <span className={styles.categoryTag}>{product.category}</span>
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className={styles.productImage}
                                            loading="lazy"
                                        />
                                        <div className={styles.weightTag}>{product.weight}</div>
                                        <div className={styles.hexTokenTag}>
                                            <Coins size={12} /> {hexPrice} HEX
                                        </div>
                                    </div>

                                    <div className={styles.info}>
                                        <div className={styles.titleHeader}>
                                            <h2 className={styles.productName}>{product.koreanName}</h2>
                                            <span className={styles.englishName}>{product.englishName}</span>
                                        </div>
                                        <p className={styles.productDesc}>{product.desc}</p>
                                        
                                        <div className={styles.featurePills}>
                                            {product.features.slice(0, 2).map((f, i) => (
                                                <span key={i} className={styles.featurePill}>{f}</span>
                                            ))}
                                        </div>

                                        <div className={styles.footer}>
                                            <div className={styles.priceContainer}>
                                                <div className={styles.dualPrice}>
                                                    <span className={styles.price}>{product.priceFormatted}</span>
                                                    <span className={styles.hexPriceBadge}>🪙 {hexPrice} HEX</span>
                                                </div>
                                                <span className={styles.priceLabel}>소매 1Kg 기준</span>
                                            </div>
                                            <button 
                                                className={`${styles.addToCartBtn} ${addedId === product.id ? styles.addedBtn : ''}`}
                                                onClick={(e) => handleAddToCart(e, product.id)}
                                            >
                                                {addedId === product.id ? (
                                                    <>
                                                        <Check size={16} /> 담김!
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingBag size={16} /> 담기
                                                    </>
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
                        <h3>식당 / 기업 / 단체 대량 주문 & K-MOA 결제 안내</h3>
                        <p>
                            하노이 내 한식당, 호텔, 기업체 급식 및 마트에 정기적으로 10kg, 20kg, 50kg 단위로 신선하게 냉장 납품합니다.<br />
                            정기 계약 시 맞춤형 숙성도 조절 및 <strong>K-MOA 가맹점 충전머니 B2B 간편 정산</strong> 혜택을 제공합니다.
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
                            <PhoneCall size={18} /> Zalo 도매 직통 상담
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
