"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { products, Product, vndToHex } from "@/data/products";
import { useUserWallet } from "@/context/UserWalletContext";
import { 
    Star, Truck, ShieldCheck, Award, Sparkles, Check, PhoneCall, 
    ArrowLeft, Heart, Plus, Minus, PackageCheck, Coins, Wallet, 
    CreditCard, ArrowRight, CheckCircle2, AlertCircle, Copy 
} from "lucide-react";

export default function ProductDetail() {
    const params = useParams();
    const rawId = params?.id as string || "1";

    const { user, wallet, isLoggedIn, isWalletConnected, payOrder, faucetHex, refreshWallet, isLoading } = useUserWallet();

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
    const [selectedCurrency, setSelectedCurrency] = useState<"HEX" | "POINT" | "VND">("HEX");
    const [recipientName, setRecipientName] = useState(user?.name || "최민준");
    const [recipientPhone, setRecipientPhone] = useState("0702116617");
    const [recipientAddress, setRecipientAddress] = useState("Hanoi, Nam Tu Liem, My Dinh Song Da, Villa #12");
    const [deliveryMemo, setDeliveryMemo] = useState("신선 배송 부탁드립니다.");
    const [paymentReceipt, setPaymentReceipt] = useState<any>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [copiedTx, setCopiedTx] = useState(false);

    // Calculate dynamic pricing
    const unitPriceVnd = product.price;
    const basePriceVnd = unitPriceVnd * selectedWeight;
    const discountMultiplier = selectedWeight >= 10 ? 0.9 : 1.0;
    const finalPriceVndPerPack = Math.round(basePriceVnd * discountMultiplier);
    const totalPriceVnd = finalPriceVndPerPack * quantity;
    const totalPriceHex = vndToHex(totalPriceVnd);
    const earnedPoints = Math.round(totalPriceVnd * 0.05 / 100) * 100;

    // Rating & reviews state
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviewerName, setReviewerName] = useState("");

    const [reviews, setReviews] = useState([
        { id: 101, user: "최*민 (VIP 회원)", stars: 5, date: "2026.08.28", content: `하노이에서 ${product.koreanName} 제대로 하는 곳을 찾았네요! HEX 토큰으로 원클릭 결제하니 편리하고 5% 대한포인트까지 적립되어 만족스럽습니다.` },
        { id: 102, user: "응우옌티* (현지고객)", stars: 5, date: "2026.08.25", content: "한국인 셰프가 만든 진짜 한국 김치 맛입니다. KCA 지갑으로 바로 결제할 수 있어서 혁신적이에요." },
        { id: 103, user: "김*석 (골드회원)", stars: 5, date: "2026.08.19", content: "10kg 대량 주문해서 식당에서 쓰는데 손님들 반응이 최고입니다. 콜드체인 배송도 아주 완벽합니다." },
    ]);

    const handleAddToCart = () => {
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2200);
    };

    const handleOpenCheckout = (currency: "HEX" | "POINT" | "VND" = "HEX") => {
        setSelectedCurrency(currency);
        setPaymentError(null);
        setPaymentReceipt(null);
        setCheckoutModalOpen(true);
    };

    const handleExecutePayment = async () => {
        setPaymentError(null);
        const amount = selectedCurrency === "HEX" 
            ? totalPriceHex 
            : selectedCurrency === "POINT" 
                ? totalPriceHex * 10 
                : totalPriceVnd;

        const orderItems = [{
            productId: product.id,
            productName: `${product.koreanName} (${selectedWeight}Kg)`,
            weight: `${selectedWeight}Kg`,
            quantity: quantity,
            priceVnd: totalPriceVnd,
            priceHex: totalPriceHex,
            image: product.image
        }];

        const res = await payOrder({
            amount,
            currency: selectedCurrency,
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

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewText.trim()) return alert("후기 내용을 작성해주세요.");

        setReviews([
            {
                id: Date.now(),
                user: reviewerName.trim() ? `${reviewerName} (구매고객)` : (user?.name || "나 (인증회원)"),
                stars: rating,
                date: "방금 전",
                content: reviewText.trim()
            },
            ...reviews
        ]);

        setReviewText("");
        setReviewerName("");
        alert(`소중한 후기가 등록되었습니다! 500 DP(대한포인트)가 계정에 즉시 적립되었습니다.`);
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
                    <div className={styles.imageHexFloatingBadge}>
                        <Coins size={14} /> 1 HEX = 1,000 VND
                    </div>
                </div>

                {/* Right: Product Purchase Configurator */}
                <div className={styles.infoSection}>
                    <div className={styles.titleArea}>
                        <div className={styles.subMeta}>
                            <span className={styles.brandName}>DAEHAN KIMCHI • KCA OFFICIAL MERCHANT</span>
                            <span className={styles.ratingBadge}>★ 4.9 (후기 {reviews.length}개)</span>
                        </div>
                        <h1 className={styles.title}>{product.koreanName}</h1>
                        <p className={styles.englishSubtitle}>{product.englishName}</p>
                    </div>

                    {/* Dual Price Box: VND & HEX Token */}
                    <div className={styles.priceBox}>
                        <div className={styles.priceRow}>
                            <div className={styles.mainPriceGroup}>
                                <span className={styles.finalPrice}>{totalPriceVnd.toLocaleString()} VND</span>
                                <span className={styles.hexPriceHighlight}>
                                    <Coins size={20} className={styles.coinIcon} />
                                    <strong>{totalPriceHex.toLocaleString()} HEX</strong>
                                </span>
                            </div>
                            {selectedWeight >= 10 && (
                                <span className={styles.discountTag}>대용량 10% 특별할인</span>
                            )}
                        </div>
                        <div className={styles.pointRow}>
                            <Sparkles size={14} color="#f7a400" />
                            <span>결제 시 <strong>{earnedPoints.toLocaleString()} DP</strong> (5% 마일리지) 즉시 적립</span>
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
                            {selectedWeight >= 10 && <span className={styles.freeShippingBadge}>🚚 무료배송 대상</span>}
                        </label>
                        <div className={styles.weightSelector}>
                            {[
                                { weight: 1, label: "소매 1Kg (기본)", desc: "가정용 소포장" },
                                { weight: 3, label: "3Kg 패밀리팩", desc: "가정 보관용" },
                                { weight: 5, label: "5Kg 실속팩", desc: "인기 다인 가족" },
                                { weight: 10, label: "10Kg 대용량 (도매)", desc: "무료배송 + 10%할인" },
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

                    {/* Action Buttons */}
                    <div className={styles.purchaseActions}>
                        {/* Primary HEX Token Checkout Button */}
                        <button 
                            className={styles.hexPayBtn}
                            onClick={() => handleOpenCheckout("HEX")}
                        >
                            <Coins size={20} color="#fcd34d" />
                            <span>HEX 토큰 즉시 결제 ({totalPriceHex.toLocaleString()} HEX)</span>
                        </button>

                        <button 
                            className={`btn-primary ${styles.buyBtn} ${cartAdded ? styles.cartAdded : ''}`}
                            onClick={handleAddToCart}
                        >
                            {cartAdded ? (
                                <>
                                    <PackageCheck size={20} /> 담김!
                                </>
                            ) : (
                                <>
                                    장바구니 담기
                                </>
                            )}
                        </button>

                        <button 
                            className={styles.vndPayBtn}
                            onClick={() => handleOpenCheckout("VND")}
                        >
                            <CreditCard size={18} /> 일반 주문
                        </button>
                    </div>

                    {/* Quick Trust badges */}
                    <div className={styles.trustRow}>
                        <div className={styles.trustChip}>
                            <Truck size={15} color="#f7a400" /> 하노이 당일/익일 신선배송
                        </div>
                        <div className={styles.trustChip}>
                            <ShieldCheck size={15} color="#00E676" /> HACCP 안심 클린룸 생산
                        </div>
                        <div className={styles.trustChip}>
                            <Award size={15} color="#2979FF" /> KCA 공인 가맹점
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Specifications Table */}
            <section className={styles.specSection}>
                <h2 className={styles.sectionHeading}>제품 상세 정보 및 결제 가이드</h2>
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
                        <div className={styles.specVal}>
                            {selectedWeight}Kg ({totalPriceVnd.toLocaleString()} VND / <strong>{totalPriceHex.toLocaleString()} HEX</strong>)
                        </div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>결제 수단</div>
                        <div className={styles.specVal}>
                            🪙 <strong>HEX 토큰</strong> (KCA On-Chain Wallet), 🎟️ <strong>KCA 포인트</strong>, 💵 <strong>VND 계좌이체/현금</strong>
                        </div>
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
                        <div className={styles.specKey}>주요 원재료</div>
                        <div className={styles.specVal}>신선 원채, 고춧가루, 마늘, 생강, 정제염, 멸치액젓, 찹쌀풀 등 (100% 엄선 식재료)</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>가맹점 및 고객센터</div>
                        <div className={styles.specVal}>대한김치 (DAEHAN KIMCHI / ZENTARO BIO FOOD) • Kakao/Zalo: 0702116617</div>
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
                        <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>직접 평점 & 솔직 후기 작성</h3>
                        <span className={styles.rewardNotice}>🎁 후기 작성 시 500 DP 즉시 적립!</span>
                    </div>

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
                            placeholder="작성자 이름"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                        />
                        <input
                            type="text"
                            className={styles.reviewInput}
                            placeholder="김치의 맛, 숙성도, HEX 결제 경험 등 솔직한 후기를 남겨주세요!"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '10px 24px', flexShrink: 0 }}>
                            후기 등록
                        </button>
                    </div>
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
                        const hexRel = vndToHex(rel.price);
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
                                        <span className={styles.relatedHexPrice}>🪙 {hexRel} HEX</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Checkout & Web3 Payment Modal */}
            {checkoutModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setCheckoutModalOpen(false)}>
                    <div className={styles.checkoutModal} onClick={e => e.stopPropagation()}>
                        {!paymentReceipt ? (
                            <>
                                <div className={styles.modalHeader}>
                                    <div className={styles.modalTitleWrap}>
                                        <Coins size={22} color="#fcd34d" />
                                        <h3>KCA 스마트 결제 주문서</h3>
                                    </div>
                                    <button className={styles.modalClose} onClick={() => setCheckoutModalOpen(false)}>✕</button>
                                </div>

                                {/* Order Summary */}
                                <div className={styles.orderSummaryCard}>
                                    <img src={product.image} alt={product.name} className={styles.orderThumb} />
                                    <div className={styles.orderMeta}>
                                        <h4>{product.koreanName}</h4>
                                        <p>용량: {selectedWeight}Kg • 수량: {quantity}개</p>
                                        <div className={styles.orderPrices}>
                                            <span className={styles.vndTotal}>{totalPriceVnd.toLocaleString()} VND</span>
                                            <span className={styles.hexTotal}>🪙 {totalPriceHex.toLocaleString()} HEX</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Currency Selection */}
                                <div className={styles.currencySelectGroup}>
                                    <label className={styles.sectionSubTitle}>결제 통화 선택 (Payment Currency):</label>
                                    <div className={styles.currencyOptions}>
                                        <button 
                                            type="button"
                                            className={`${styles.currencyBtn} ${selectedCurrency === "HEX" ? styles.activeCurrency : ''}`}
                                            onClick={() => setSelectedCurrency("HEX")}
                                        >
                                            <div className={styles.curTop}>
                                                <Coins size={18} color="#fcd34d" />
                                                <strong>HEX 토큰 (추천)</strong>
                                            </div>
                                            <span className={styles.curBalance}>
                                                내 잔액: {wallet.hexTokenBalance.toLocaleString()} HEX
                                            </span>
                                            <span className={styles.curDiscount}>5% DP 추가 적립</span>
                                        </button>

                                        <button 
                                            type="button"
                                            className={`${styles.currencyBtn} ${selectedCurrency === "POINT" ? styles.activeCurrency : ''}`}
                                            onClick={() => setSelectedCurrency("POINT")}
                                        >
                                            <div className={styles.curTop}>
                                                <Sparkles size={18} color="#00E676" />
                                                <strong>KCA 포인트</strong>
                                            </div>
                                            <span className={styles.curBalance}>
                                                내 잔액: {wallet.kcaPoints.toLocaleString()} P
                                            </span>
                                        </button>

                                        <button 
                                            type="button"
                                            className={`${styles.currencyBtn} ${selectedCurrency === "VND" ? styles.activeCurrency : ''}`}
                                            onClick={() => setSelectedCurrency("VND")}
                                        >
                                            <div className={styles.curTop}>
                                                <CreditCard size={18} color="#2979FF" />
                                                <strong>VND 잔액/이체</strong>
                                            </div>
                                            <span className={styles.curBalance}>
                                                내 잔액: {wallet.vndBalance.toLocaleString()} VND
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Wallet / Account Check */}
                                <div className={styles.walletCheckCard}>
                                    <div className={styles.walletCheckHeader}>
                                        <span>결제자 계정: <strong>{user?.name || "손님"}</strong></span>
                                        <span className={styles.walletCheckAddr}>
                                            {wallet.onChainWalletAddress.slice(0, 8)}...{wallet.onChainWalletAddress.slice(-6)}
                                        </span>
                                    </div>

                                    {selectedCurrency === "HEX" && wallet.hexTokenBalance < totalPriceHex && (
                                        <div className={styles.insufficientAlert}>
                                            <AlertCircle size={16} />
                                            <span>HEX 잔액이 부족합니다. (+500 HEX 충전 후 결제하세요)</span>
                                            <button 
                                                className={styles.inlineFaucetBtn}
                                                onClick={async () => {
                                                    await faucetHex(500);
                                                }}
                                                disabled={isLoading}
                                            >
                                                +500 HEX 충전
                                            </button>
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
                                    disabled={isLoading || (selectedCurrency === "HEX" && wallet.hexTokenBalance < totalPriceHex)}
                                >
                                    {isLoading ? (
                                        "KCA 블록체인 결제 승인 중..."
                                    ) : (
                                        <>
                                            {selectedCurrency === "HEX" ? `🪙 ${totalPriceHex.toLocaleString()} HEX 즉시 결제하기` : `${totalPriceVnd.toLocaleString()} VND 결제하기`}
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            /* Success Receipt View */
                            <div className={styles.receiptView}>
                                <div className={styles.successIconWrap}>
                                    <CheckCircle2 size={54} color="#00E676" />
                                </div>
                                <h3 className={styles.successTitle}>결제가 성공적으로 완료되었습니다!</h3>
                                <p className={styles.successSub}>
                                    KCA Merchant Open API를 통해 트랜잭션이 안전하게 체결되었습니다.
                                </p>

                                <div className={styles.receiptCard}>
                                    <div className={styles.receiptRow}>
                                        <span>주문 번호</span>
                                        <strong>{paymentReceipt.orderId}</strong>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>결제 금액</span>
                                        <strong style={{ color: '#fcd34d' }}>
                                            {paymentReceipt.paidAmount.toLocaleString()} {paymentReceipt.currency}
                                        </strong>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>결제 후 잔액</span>
                                        <span>{paymentReceipt.remainingBalance} {paymentReceipt.currency}</span>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>적립된 대한포인트</span>
                                        <strong style={{ color: '#f7a400' }}>+{paymentReceipt.earnedDp.toLocaleString()} DP</strong>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>트랜잭션 해시 (TX)</span>
                                        <div className={styles.txHashWrap}>
                                            <code>{paymentReceipt.txHash.slice(0, 10)}...{paymentReceipt.txHash.slice(-8)}</code>
                                            <button className={styles.copyBtn} onClick={() => copyTxHash(paymentReceipt.txHash)}>
                                                {copiedTx ? "복사됨!" : <Copy size={13} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>가맹점 식별자</span>
                                        <span>{paymentReceipt.merchantId}</span>
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
