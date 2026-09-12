"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { products, Product } from "@/data/products";
import { useUserWallet } from "@/context/UserWalletContext";
import { 
    Star, Truck, ShieldCheck, Award, Sparkles, Check,
    ArrowLeft, Heart, Plus, Minus, PackageCheck,
    CreditCard, ArrowRight, CheckCircle2, AlertCircle, ShoppingCart, Copy, Clock
} from "lucide-react";
import ShareButtons from "@/components/ShareButtons";

export default function ProductDetail() {
    const params = useParams();
    const rawId = params?.id as string || "1";

    const { user, wallet, isLoggedIn, payOrder, isLoading, refreshWallet, loginWithGoogle } = useUserWallet();

    // Find product by id, idx, or slug
    const product: Product = useMemo(() => {
        const num = parseInt(rawId, 10);
        if (!isNaN(num)) {
            const byId = products.find(p => p.id === num);
            if (byId) return byId;
            const byIdx = products.find(p => p.idx === num);
            if (byIdx) return byIdx;
        }
        const bySlug = products.find(p => p.slug === rawId);
        return bySlug || products[0];
    }, [rawId]);

    // Weight and quantity selection
    const [selectedWeight, setSelectedWeight] = useState<number>(1);
    const [quantity, setQuantity] = useState<number>(1);
    const [isLiked, setIsLiked] = useState(false);
    const [cartAdded, setCartAdded] = useState(false);

    // Checkout modal state
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [recipientName, setRecipientName] = useState(user?.name || "최민준");
    const [recipientPhone, setRecipientPhone] = useState("0702116617");
    const [recipientAddress, setRecipientAddress] = useState("Hanoi, Nam Tu Liem, My Dinh Song Da, Villa #12");
    const [deliveryMemo, setDeliveryMemo] = useState("신선 배송 부탁드립니다.");
    const [paymentReceipt, setPaymentReceipt] = useState<any>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [copiedTx, setCopiedTx] = useState(false);
    const [paymentCurrency, setPaymentCurrency] = useState<"VND" | "대한페이">("VND");

    // Calculate dynamic pricing
    const unitPriceVnd = product.price;
    const basePriceVnd = unitPriceVnd * selectedWeight;
    const totalPriceVnd = basePriceVnd * quantity;
    const earnedPoints = Math.round(totalPriceVnd * 0.1 / 100) * 100;

    const dynamicOrderId = useMemo(() => {
        return `ORD-DAEHAN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    }, [checkoutModalOpen]);

    // Rating & reviews state
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    // Initial default reviews per product
    const defaultReviews = useMemo(() => [
        { id: 101, uid: "user_mock1", user: "최*민 (VIP 회원)", stars: 5, date: "2026.08.28", content: `하노이에서 ${product.koreanName} 제대로 하는 곳을 찾았네요! 대한포인트까지 10% 즉시 적립되어 너무 만족스럽습니다.` },
        { id: 102, uid: "user_mock2", user: "응우옌티* (현지고객)", stars: 5, date: "2026.08.25", content: "한국인 셰프가 만든 진짜 한국 김치 맛입니다. VND 계좌이체나 포인트 결제 모두 가능해서 편리해요." },
        { id: 103, uid: "user_mock3", user: "김*석 (골드회원)", stars: 5, date: "2026.08.19", content: "5kg 도매 포장으로 주문해서 식당에서 쓰는데 손님들 반응이 최고입니다. 콜드체인 배송도 아주 완벽합니다." },
    ], [product.koreanName]);

    const [reviews, setReviews] = useState<any[]>(defaultReviews);

    // Load saved custom reviews from localStorage for this product
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const saved = localStorage.getItem(`daehan_reviews_p${product.id}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setReviews([...parsed, ...defaultReviews]);
                    return;
                }
            }
        } catch (e) {}
        setReviews(defaultReviews);
    }, [product.id, defaultReviews]);

    // Check if the currently logged in user has already written a review for this product (1 review per product limit)
    const hasUserReviewed = useMemo(() => {
        if (!isLoggedIn || !user?.uid) return false;
        const reviewedInList = reviews.some(r => r.uid === user.uid);
        if (reviewedInList) return true;
        if (typeof window !== "undefined") {
            const flag = localStorage.getItem(`daehan_reviewed_p${product.id}_u${user.uid}`);
            if (flag === "true") return true;
        }
        return false;
    }, [isLoggedIn, user?.uid, reviews, product.id]);

    const handleAddToCart = () => {
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2200);
    };

    const handleOpenCheckout = () => {
        setPaymentError(null);
        setPaymentReceipt(null);
        setCheckoutModalOpen(true);
    };

    const handleExecutePayment = async () => {
        setPaymentError(null);
        const orderItems = [{
            productId: product.id,
            productName: `${product.koreanName} (${selectedWeight}Kg)`,
            weight: `${selectedWeight}Kg`,
            quantity: quantity,
            priceVnd: totalPriceVnd,
            image: product.image
        }];

        const paymentAmount = totalPriceVnd;

        const res = await payOrder({
            orderId: dynamicOrderId,
            amount: paymentAmount,
            currency: paymentCurrency === "대한페이" ? "MONEY" : paymentCurrency,
            items: orderItems,
            shippingAddress: {
                recipient: recipientName,
                phone: recipientPhone,
                address: recipientAddress,
                memo: deliveryMemo
            }
        });

        if (res.success) {
            setPaymentReceipt(res.receipt);
        } else {
            setPaymentError(res.error || "결제에 실패했습니다.");
        }
    };

    const copyTxHash = (hash: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedTx(true);
        setTimeout(() => setCopiedTx(false), 2000);
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. 로그인 회원 전용 체크
        if (!isLoggedIn || !user) {
            alert("🔒 리뷰를 작성하려면 로그인한 회원이어야 합니다.");
            return;
        }

        // 2. 상품당 1회 작성 제한 체크
        if (hasUserReviewed) {
            alert("⚠️ 이미 해당 상품에 대한 리뷰를 작성하셨습니다.\n(상품당 1회만 작성 가능합니다.)");
            return;
        }

        if (!reviewText.trim()) {
            return alert("후기 내용을 작성해주세요.");
        }

        // 3. 작성자 이름은 로그인된 계정 이름/이메일로 자동 지정
        const authorAccountName = user.name ? `${user.name} (${user.email || '인증회원'})` : (user.email || "로그인 회원");

        const newReview = {
            id: Date.now(),
            uid: user.uid,
            user: authorAccountName,
            stars: rating,
            date: new Date().toLocaleDateString("ko-KR"),
            content: reviewText.trim()
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);

        // 로컬 스토리지에 리뷰 저장 및 유저별 작성 여부 기록
        try {
            const userOnly = updatedReviews.filter(r => r.uid && !r.uid.startsWith("user_mock"));
            localStorage.setItem(`daehan_reviews_p${product.id}`, JSON.stringify(userOnly));
            localStorage.setItem(`daehan_reviewed_p${product.id}_u${user.uid}`, "true");
        } catch (e) {}

        setReviewText("");

        // 4. 500 DP 보상 적립 처리
        if (user.uid) {
            try {
                const res = await fetch("/api/v1/rewards", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        uid: user.uid,
                        actionType: "WRITE_REVIEW",
                        itemId: String(product.id)
                    })
                });
                const data = await res.json();
                if (data.success) {
                    refreshWallet();
                    alert(`✅ 소중한 후기가 성공적으로 등록되었습니다!\n🎁 리뷰 작성 보상으로 500 DP(대한포인트)와 +500 EXP(경험치)가 적립되었습니다.`);
                } else {
                    alert("✅ 소중한 후기가 등록되었습니다!");
                }
            } catch (e) {
                alert("✅ 소중한 후기가 등록되었습니다!");
            }
        }
    };

    const renderStars = (count: number) => {
        return Array(5).fill(0).map((_, i) => (
            <Star key={i} size={18} fill={i < count ? "#FBBC05" : "transparent"} color={i < count ? "#FBBC05" : "#444"} style={{ marginRight: 2 }} />
        ));
    };

    const relatedProducts = useMemo(() => {
        return products.filter(p => p.id !== product.id).slice(0, 4);
    }, [product]);

    return (
        <div className={styles.detailContainer}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <Link href="/shop" className={styles.backLink}>
                    <ArrowLeft size={16} /> 전체 김치 목록으로 돌아가기
                </Link>
                <span className={styles.breadDivider}>/</span>
                <span className={styles.breadCurrent}>{product.category}</span>
                <span className={styles.breadDivider}>/</span>
                <span className={styles.breadCurrent}>{product.koreanName}</span>
            </div>

            {/* Main Product Split View */}
            <div className={styles.productSplit}>
                {/* Left: Product Image Showcase */}
                <div className={styles.imageSection}>
                    {product.badge && (
                        <span className={`${styles.badge} ${product.badge.includes('HOT') ? styles.hotBadge : ''}`}>
                            {product.badge}
                        </span>
                    )}
                    <span className={styles.categoryBadge}>{product.category}</span>
                    <img src={product.image} alt={product.name} className={styles.productImage} />
                    <button 
                        className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`} 
                        onClick={() => setIsLiked(!isLiked)}
                        title="찜하기"
                    >
                        <Heart size={20} fill={isLiked ? "#e31837" : "transparent"} color={isLiked ? "#e31837" : "#fff"} />
                    </button>
                </div>

                {/* Right: Product Purchase Configurator */}
                <div className={styles.infoSection}>
                    <div className={styles.titleArea}>
                        <div className={styles.subMeta}>
                            <span className={styles.brandName}>DAEHAN KIMCHI • 대한민국 대표 프리미엄 김치</span>
                            <span className={styles.ratingBadge}>★ 4.9 (후기 {reviews.length}개)</span>
                        </div>
                        <h1 className={styles.title}>{product.koreanName}</h1>
                        <p className={styles.englishSubtitle}>{product.englishName}</p>
                    </div>

                    {/* Price Box */}
                    <div className={styles.priceBox}>
                        <div className={styles.priceRow}>
                            <div className={styles.mainPriceGroup}>
                                <span className={styles.finalPrice}>{totalPriceVnd.toLocaleString()} VND</span>
                            </div>
                            {selectedWeight >= 5 && (
                                <span className={styles.discountTag}>5Kg 도매 포장</span>
                            )}
                        </div>
                        <div className={styles.pointRow}>
                            <Sparkles size={14} color="#D4870A" />
                            <span>결제 시 <strong>{earnedPoints.toLocaleString()} DP</strong> (10% 대한포인트 마일리지) 즉시 적립</span>
                        </div>
                    </div>

                    <p className={styles.desc}>{product.detailDesc || product.desc}</p>

                    {/* Features checklist */}
                    <div className={styles.featuresList}>
                        {product.features.map((f, i) => (
                            <div key={i} className={styles.featureItem}>
                                <Check size={16} color="#00E676" />
                                <span>{f}</span>
                            </div>
                        ))}
                    </div>

                    {/* Weight options */}
                    <div className={styles.optionSection}>
                        <label className={styles.optionLabel}>
                            용량 선택 (Weight Option):
                            {selectedWeight === 5 && <span className={styles.freeShippingBadge}>🚚 5Kg 도매 포장</span>}
                        </label>
                        <div className={styles.weightSelector}>
                            {[
                                { weight: 1, label: "1Kg (소매 포장)", desc: "가정용 소매 포장" },
                                { weight: 5, label: "5Kg (도매 포장)", desc: "식당·업소용 도매 포장" },
                            ].map(opt => (
                                <button
                                    key={opt.weight}
                                    type="button"
                                    className={`${styles.weightBtn} ${selectedWeight === opt.weight ? styles.activeWeight : ''}`}
                                    onClick={() => setSelectedWeight(opt.weight)}
                                >
                                    <span className={styles.weightBtnLabel}>{opt.label}</span>
                                    <span className={styles.weightBtnDesc}>{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className={styles.quantitySection}>
                        <span className={styles.optionLabel}>수량 (Quantity):</span>
                        <div className={styles.quantityControl}>
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className={styles.qtyBtn}
                            >
                                <Minus size={16} />
                            </button>
                            <span className={styles.qtyNumber}>{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className={styles.qtyBtn}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Standard E-Commerce Purchase Actions */}
                    <div className={styles.purchaseActions}>
                        <button 
                            className={styles.hexPayBtn}
                            onClick={handleOpenCheckout}
                            title="주문서 열기 및 결제수단 선택"
                        >
                            <CreditCard size={20} />
                            <span>바로 구매하기 ({totalPriceVnd.toLocaleString()} VND)</span>
                        </button>

                        <button 
                            className={`btn-primary ${styles.buyBtn} ${cartAdded ? styles.cartAdded : ''}`}
                            onClick={handleAddToCart}
                        >
                            {cartAdded ? (
                                <>
                                    <PackageCheck size={20} /> 장바구니 담김!
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={18} /> 장바구니 담기
                                </>
                            )}
                        </button>
                    </div>

                    {/* Quick Trust badges */}
                    <div className={styles.trustRow}>
                        <div className={styles.trustChip}>
                            <Truck size={15} /> 하노이 당일/익일 신선배송
                        </div>
                        <div className={styles.trustChip}>
                            <ShieldCheck size={15} /> HACCP 안심 클린룸 생산
                        </div>
                        <div className={styles.trustChip}>
                            <Award size={15} /> 구매 시 10% 대한포인트 적립
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== 소셜 공유 ===== */}
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                <ShareButtons
                    title={`${product.koreanName} | 대한김치 (DAEHAN KIMCHI)`}
                    description={product.desc || product.name}
                />
            </div>

            {/* Product Specifications Table */}
            <section className={styles.specSection}>
                <h2 className={styles.sectionHeading}>제품 상세 정보</h2>
                <div className={styles.specGrid}>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>제품명</div>
                        <div className={styles.specVal}>{product.name}</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>식품 유형</div>
                        <div className={styles.specVal}>김치류 (비살균 발효 농산가공품)</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>내용량 및 가격</div>
                        <div className={styles.specVal}>{selectedWeight}Kg ({totalPriceVnd.toLocaleString()} VND)</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>지원 결제 수단</div>
                        <div className={styles.specVal}>💵 <strong>일반 결제 (VND / 계좌이체)</strong>, ⭐ <strong>대한포인트(DP) 적립 10%</strong></div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>보관 방법</div>
                        <div className={styles.specVal}>0~4℃ 냉장 보관 (개봉 후 밀폐용기에 담아 김치냉장고 보관 권장)</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>유통기한</div>
                        <div className={styles.specVal}>제조일로부터 90일 (적정 발효 숙성도에 따라 섭취)</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>고객센터 & 주문 문의</div>
                        <div className={styles.specVal}>대한김치 (DAEHAN KIMCHI) • Kakao/Zalo: 0702116617</div>
                    </div>
                </div>
            </section>

            {/* Review Section */}
            <section className={styles.reviewSection}>
                <div className={styles.reviewHeaderMain}>
                    <h2 className={styles.reviewTitle}>
                        구매 고객 만족 후기
                        <span className={styles.ratingOverview}>(★ 4.9 / 5.0)</span>
                    </h2>
                    <span className={styles.reviewCountInfo}>총 {reviews.length}개의 리얼 리뷰</span>
                </div>

                {/* Write form */}
                <form className={styles.writeForm} onSubmit={handleSubmitReview}>
                    <div className={styles.formHeader}>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>직접 평점 & 솔직 후기 작성</h3>
                        <span className={styles.rewardNotice}>🎁 후기 작성 시 500 DP 즉시 적립!</span>
                    </div>

                    {!isLoggedIn ? (
                        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', textAlign: 'center', border: '1px dashed #cbd5e1', marginTop: '12px' }}>
                            <p style={{ color: '#475569', fontSize: '0.92rem', fontWeight: 600, marginBottom: '10px' }}>
                                🔒 상품 리뷰는 <strong>로그인한 회원만</strong> 작성하실 수 있습니다.
                            </p>
                            <button
                                type="button"
                                onClick={() => loginWithGoogle ? loginWithGoogle() : alert("로그인 후 이용해 주세요.")}
                                className="btn-primary"
                                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                            >
                                Google 계정으로 간편 로그인
                            </button>
                        </div>
                    ) : hasUserReviewed ? (
                        <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '12px', textAlign: 'center', border: '1.5px solid #bbf7d0', marginTop: '12px' }}>
                            <p style={{ color: '#15803d', fontSize: '0.95rem', fontWeight: 800, marginBottom: '4px' }}>
                                ✅ 이미 이 상품에 대한 소중한 리뷰를 작성하셨습니다!
                            </p>
                            <span style={{ color: '#166534', fontSize: '0.82rem' }}>
                                (대한김치는 실사용 고객의 공정한 후기를 위해 <strong>상품당 1회만</strong> 리뷰 참여가 가능합니다)
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className={styles.ratingSelect} onMouseLeave={() => setHoverRating(0)}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginRight: '8px' }}>별점 선택:</span>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`${styles.starBtn} ${star <= (hoverRating || rating) ? styles.active : ''}`}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star size={28} fill={star <= (hoverRating || rating) ? "#FBBC05" : "transparent"} strokeWidth={1} />
                                    </button>
                                ))}
                            </div>

                            <div className={styles.inputRow}>
                                <input
                                    type="text"
                                    className={styles.nameInput}
                                    value={user?.name ? `${user.name} (계정)` : (user?.email || "로그인 회원")}
                                    readOnly
                                    title="작성자 이름은 로그인한 계정 정보로 자동 적용됩니다."
                                    style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#334155', fontWeight: 700 }}
                                />
                                <input
                                    type="text"
                                    className={styles.reviewInput}
                                    placeholder="김치의 맛, 숙성도, 배송 및 결제 경험 등 솔직한 후기를 남겨주세요!"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                                <button type="submit" className="btn-primary" style={{ padding: '10px 24px', flexShrink: 0 }}>
                                    후기 등록
                                </button>
                            </div>
                        </>
                    )}
                </form>

                {/* Review List */}
                <div className={styles.reviewList}>
                    {reviews.map(review => (
                        <div key={review.id} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewerInfo}>
                                    <span className={styles.reviewerName}>{review.user}</span>
                                    <span className={styles.reviewDate}>{review.date}</span>
                                </div>
                                <span className={styles.stars}>{renderStars(review.stars)}</span>
                            </div>
                            <p className={styles.reviewContent}>{review.content}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Products Grid */}
            <section className={styles.relatedSection}>
                <h2 className={styles.sectionHeading}>함께 구매하면 좋은 대한김치 라인업</h2>
                <div className={styles.relatedGrid}>
                    {relatedProducts.map(rel => {
                        return (
                            <Link href={`/shop/${rel.id}`} key={rel.id} className={styles.relatedCard}>
                                <div className={styles.relatedImgWrap}>
                                    <img src={rel.image} alt={rel.name} className={styles.relatedImg} />
                                    {rel.badge && <span className={styles.relatedBadge}>{rel.badge}</span>}
                                </div>
                                <div className={styles.relatedBody}>
                                    <h4 className={styles.relatedTitle}>{rel.koreanName}</h4>
                                    <div className={styles.relatedDualPrice}>
                                        <span className={styles.relatedPrice}>{rel.priceFormatted}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Universal Checkout Modal */}
            {checkoutModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setCheckoutModalOpen(false)}>
                    <div className={styles.checkoutModal} onClick={e => e.stopPropagation()}>
                        {!paymentReceipt ? (
                            <>
                                <div className={styles.modalHeader}>
                                    <div className={styles.modalTitleWrap}>
                                        <CreditCard size={22} color="#f7a400" />
                                        <h3>대한김치 주문 및 결제</h3>
                                    </div>
                                    <button className={styles.modalClose} onClick={() => setCheckoutModalOpen(false)}>✕</button>
                                </div>

                                {/* Order Summary */}
                                <div className={styles.orderSummaryCard}>
                                    <img src={product.image} alt={product.name} className={styles.orderThumb} />
                                    <div className={styles.orderMeta}>
                                        <h4>{product.koreanName}</h4>
                                        <p>용량: {selectedWeight}Kg • 수량: {quantity}개 • 주문번호: <code>{dynamicOrderId}</code></p>
                                        <div className={styles.orderPrices}>
                                            <span className={styles.vndTotal} style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                                                {totalPriceVnd.toLocaleString()} VND 
                                                <span style={{ fontSize: '0.9rem', color: '#f7a400', marginLeft: 8 }}>({totalPriceVnd.toLocaleString()} 머니)</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method & Wallet Balance */}
                                <div className={styles.shippingForm} style={{ marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                                        <label className={styles.sectionSubTitle}>결제 수단 선택:</label>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', background: 'rgba(22, 163, 74, 0.08)', padding: '3px 10px', borderRadius: '99px', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
                                            💳 보유 대한페이: {(wallet.moneyBalance || 0).toLocaleString()} 머니
                                        </span>
                                    </div>
                                    <select 
                                        value={paymentCurrency} 
                                        onChange={(e) => setPaymentCurrency(e.target.value as "VND" | "대한페이")}
                                        className={`${styles.checkoutInput} ${styles.fullWidth}`}
                                        style={{ marginTop: 8 }}
                                    >
                                        <option value="VND">일반 결제 (VND / 현금 계좌이체)</option>
                                        <option value="대한페이">대한김치 머니 (대한페이) 결제 - 1:1 결제</option>
                                    </select>

                                    {paymentCurrency === "대한페이" && (wallet.moneyBalance || 0) < totalPriceVnd && (
                                        <div style={{
                                            marginTop: '10px',
                                            padding: '10px 14px',
                                            background: 'rgba(239, 68, 68, 0.08)',
                                            border: '1px solid rgba(239, 68, 68, 0.25)',
                                            borderRadius: '8px',
                                            fontSize: '0.82rem',
                                            color: '#ef4444',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '8px'
                                        }}>
                                            <span>⚠️ 대한페이가 부족합니다. (보유: {(wallet.moneyBalance || 0).toLocaleString()} 머니 / 필요: {totalPriceVnd.toLocaleString()} 머니)</span>
                                            <Link href="/mypage" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'underline' }}>
                                                입금 충전 신청 →
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Shipping Address */}
                                <div className={styles.shippingForm}>
                                    <label className={styles.sectionSubTitle}>배송지 정보 (하노이 콜드체인 직배송):</label>
                                    <div className={styles.formGrid}>
                                        <input 
                                            type="text" 
                                            placeholder="받는 분 성함" 
                                            value={recipientName}
                                            onChange={e => setRecipientName(e.target.value)}
                                            className={styles.checkoutInput}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="연락처 (Zalo/휴대폰)" 
                                            value={recipientPhone}
                                            onChange={e => setRecipientPhone(e.target.value)}
                                            className={styles.checkoutInput}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="하노이 배송 주소" 
                                            value={recipientAddress}
                                            onChange={e => setRecipientAddress(e.target.value)}
                                            className={`${styles.checkoutInput} ${styles.fullWidth}`}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="배송 요청사항 (선택)" 
                                            value={deliveryMemo}
                                            onChange={e => setDeliveryMemo(e.target.value)}
                                            className={`${styles.checkoutInput} ${styles.fullWidth}`}
                                        />
                                    </div>
                                </div>

                                {paymentError && (
                                    <div className={styles.errorBanner}>
                                        <AlertCircle size={18} /> {paymentError}
                                    </div>
                                )}

                                {/* Submit Payment Button */}
                                <button
                                    className={styles.executePayBtn}
                                    onClick={handleExecutePayment}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        "주문 결제 승인 처리 중..."
                                    ) : (
                                        <>
                                            💳 {paymentCurrency === "대한페이" ? totalPriceVnd.toLocaleString() + " 머니" : totalPriceVnd.toLocaleString() + " VND"} 결제하기
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            /* Success / Bank Transfer Receipt View */
                            <div className={styles.receiptView}>
                                <div className={styles.successIconWrap}>
                                    {paymentReceipt.status === "PENDING_PAYMENT" ? (
                                        <Clock size={54} color="#f59e0b" />
                                    ) : (
                                        <CheckCircle2 size={54} color="#00E676" />
                                    )}
                                </div>
                                <h3 className={styles.successTitle}>
                                    {paymentReceipt.status === "PENDING_PAYMENT" 
                                        ? "주문이 접수되었습니다! (입금대기)" 
                                        : "주문 결제가 완료되었습니다!"}
                                </h3>
                                <p className={styles.successSub}>
                                    {paymentReceipt.status === "PENDING_PAYMENT"
                                        ? "아래 계좌로 현금 이체해 주시면 관리자 입금 확인 후 배송 절차가 진행됩니다."
                                        : "대한김치 신선 배송 준비가 시작되었습니다."}
                                </p>

                                <div className={styles.receiptCard}>
                                    <div className={styles.receiptRow}>
                                        <span>주문 번호</span>
                                        <strong>{paymentReceipt.orderId}</strong>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>주문 금액</span>
                                        <strong style={{ color: '#fcd34d' }}>
                                            {paymentReceipt.paidAmount.toLocaleString()} {paymentReceipt.currency}
                                        </strong>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>주문 상태</span>
                                        <span style={{ 
                                            color: paymentReceipt.status === "PENDING_PAYMENT" ? '#f59e0b' : '#16a34a',
                                            fontWeight: 700 
                                        }}>
                                            {paymentReceipt.status === "PENDING_PAYMENT" ? "🟡 입금 확인 대기중" : "🟢 결제 완료 (배송준비)"}
                                        </span>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>적립 예정 대한포인트</span>
                                        <strong style={{ color: '#f7a400' }}>
                                            +{paymentReceipt.earnedDp.toLocaleString()} DP (10% 적립{paymentReceipt.status === "PENDING_PAYMENT" ? " - 입금승인 시 즉시지급" : ""})
                                        </strong>
                                    </div>

                                    {paymentReceipt.bankTransferInfo && (
                                        <div style={{
                                            background: 'rgba(245, 158, 11, 0.08)',
                                            border: '1px solid rgba(245, 158, 11, 0.3)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            marginTop: '14px',
                                            textAlign: 'left'
                                        }}>
                                            <div style={{ fontWeight: 800, color: '#d97706', marginBottom: '8px', fontSize: '0.95rem' }}>
                                                🏦 현금 계좌이체 입금 안내
                                            </div>
                                            <div style={{ fontSize: '0.88rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>
                                                • <strong>은행명:</strong> {paymentReceipt.bankTransferInfo.bankName}<br />
                                                • <strong>계좌번호:</strong> <strong style={{ color: '#e50914', fontSize: '0.98rem' }}>{paymentReceipt.bankTransferInfo.accountNumber}</strong><br />
                                                • <strong>예금주:</strong> {paymentReceipt.bankTransferInfo.accountHolder}<br />
                                                • <strong>입금 메모:</strong> <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ccc' }}>{paymentReceipt.bankTransferInfo.memo}</code> (주문번호 필수)
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.receiptRow} style={{ marginTop: '12px' }}>
                                        <span>트랜잭션 ID</span>
                                        <div className={styles.txHashWrap}>
                                            <code>{paymentReceipt.txHash.slice(0, 10)}...{paymentReceipt.txHash.slice(-8)}</code>
                                            <button className={styles.copyBtn} onClick={() => copyTxHash(paymentReceipt.txHash)}>
                                                {copiedTx ? "복사됨!" : <Copy size={13} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.receiptActions}>
                                    <Link href="/mypage" className="btn-primary" style={{ textAlign: 'center', padding: '12px 24px' }}>
                                        마이페이지 & 주문내역 조회
                                    </Link>
                                    <button 
                                        className={styles.closeReceiptBtn}
                                        onClick={() => setCheckoutModalOpen(false)}
                                    >
                                        계속 쇼핑하기
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
