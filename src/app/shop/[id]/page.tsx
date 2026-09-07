"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { products, Product } from "@/data/products";
import { useUserWallet } from "@/context/UserWalletContext";
import { 
    Star, Truck, ShieldCheck, Award, Sparkles, Check,
    ArrowLeft, Heart, Plus, Minus, PackageCheck,
    CreditCard, ArrowRight, CheckCircle2, AlertCircle, ShoppingCart, Copy
} from "lucide-react";
import ShareButtons from "@/components/ShareButtons";

export default function ProductDetail() {
    const params = useParams();
    const rawId = params?.id as string || "1";

    const { user, wallet, isLoggedIn, payOrder, isLoading } = useUserWallet();

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
    const [recipientName, setRecipientName] = useState(user?.name || "ÏµúÎ?Ï§Ä");
    const [recipientPhone, setRecipientPhone] = useState("0702116617");
    const [recipientAddress, setRecipientAddress] = useState("Hanoi, Nam Tu Liem, My Dinh Song Da, Villa #12");
    const [deliveryMemo, setDeliveryMemo] = useState("?†ÏÑ† Î∞∞ÏÜ° Î∂Ä?ÅÎìúÎ¶ΩÎãà??");
    const [paymentReceipt, setPaymentReceipt] = useState<any>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [copiedTx, setCopiedTx] = useState(false);
    const [paymentCurrency, setPaymentCurrency] = useState<"VND" | "HEX">("VND");

    // Calculate dynamic pricing
    const unitPriceVnd = product.price;
    const basePriceVnd = unitPriceVnd * selectedWeight;
    const discountMultiplier = selectedWeight >= 10 ? 0.9 : 1.0;
    const finalPriceVndPerPack = Math.round(basePriceVnd * discountMultiplier);
    const totalPriceVnd = finalPriceVndPerPack * quantity;
    const earnedPoints = Math.round(totalPriceVnd * 0.05 / 100) * 100;

    const dynamicOrderId = useMemo(() => {
        return `ORD-DAEHAN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    }, [checkoutModalOpen]);

    // Rating & reviews state
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviewerName, setReviewerName] = useState("");

    const [reviews, setReviews] = useState([
        { id: 101, user: "Ïµ?ÎØ?(VIP ?åÏõê)", stars: 5, date: "2026.08.28", content: `?òÎÖ∏?¥Ïóê??${product.koreanName} ?úÎ?Î°??òÎäî Í≥≥ÏùÑ Ï∞æÏïò?§Ïöî! ?Ä?úÌè¨?∏Ìä∏ÍπåÏ? 5% Ï¶âÏãú ?ÅÎ¶Ω?òÏñ¥ ?àÎ¨¥ ÎßåÏ°±?§ÎüΩ?µÎãà??` },
        { id: 102, user: "?ëÏö∞?åÌã∞* (?ÑÏ?Í≥†Í∞ù)", stars: 5, date: "2026.08.25", content: "?úÍµ≠???∞ÌîÑÍ∞Ä ÎßåÎì† ÏßÑÏßú ?úÍµ≠ ÍπÄÏπ?ÎßõÏûÖ?àÎã§. VND Í≥ÑÏ¢å?¥Ï≤¥???¨Ïù∏??Í≤∞Ï†ú Î™®Îëê Í∞Ä?•Ìï¥???∏Î¶¨?¥Ïöî." },
        { id: 103, user: "ÍπÄ*??(Í≥®Îìú?åÏõê)", stars: 5, date: "2026.08.19", content: "10kg ?Ä??Ï£ºÎ¨∏?¥ÏÑú ?ùÎãπ?êÏÑú ?∞Îäî???êÎãò??Î∞òÏùë??ÏµúÍ≥†?ÖÎãà?? ÏΩúÎìúÏ≤¥Ïù∏ Î∞∞ÏÜ°???ÑÏ£º ?ÑÎ≤Ω?©Îãà??" },
    ]);

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

        const paymentAmount = paymentCurrency === "HEX" ? Math.round(totalPriceVnd / 1000) : totalPriceVnd;

        const res = await payOrder({
            orderId: dynamicOrderId,
            amount: paymentAmount,
            currency: paymentCurrency,
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
            setPaymentError(res.error || "Í≤∞Ï†ú???§Ìå®?àÏäµ?àÎã§.");
        }
    };

    const copyTxHash = (hash: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedTx(true);
        setTimeout(() => setCopiedTx(false), 2000);
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewText.trim()) return alert("?ÑÍ∏∞ ?¥Ïö©???ëÏÑ±?¥Ï£º?∏Ïöî.");

        setReviews([
            {
                id: Date.now(),
                user: reviewerName.trim() ? `${reviewerName} (Íµ¨Îß§Í≥†Í∞ù)` : (user?.name || "??(?∏Ï¶ù?åÏõê)"),
                stars: rating,
                date: "Î∞©Í∏à ??,
                content: reviewText.trim()
            },
            ...reviews
        ]);

        setReviewText("");
        setReviewerName("");
        alert(`?åÏ§ë???ÑÍ∏∞Í∞Ä ?±Î°ù?òÏóà?µÎãà?? 500 DP(?Ä?úÌè¨?∏Ìä∏)Í∞Ä Í≥ÑÏ†ï??Ï¶âÏãú ?ÅÎ¶Ω?òÏóà?µÎãà??`);
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
                    <ArrowLeft size={16} /> ?ÑÏ≤¥ ÍπÄÏπ?Î™©Î°ù?ºÎ°ú ?åÏïÑÍ∞ÄÍ∏?                </Link>
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
                        title="Ï∞úÌïòÍ∏?
                    >
                        <Heart size={20} fill={isLiked ? "#e31837" : "transparent"} color={isLiked ? "#e31837" : "#fff"} />
                    </button>
                </div>

                {/* Right: Product Purchase Configurator */}
                <div className={styles.infoSection}>
                    <div className={styles.titleArea}>
                        <div className={styles.subMeta}>
                            <span className={styles.brandName}>DAEHAN KIMCHI ???Ä?úÎ?Íµ??Ä???ÑÎ¶¨ÎØ∏ÏóÑ ÍπÄÏπ?/span>
                            <span className={styles.ratingBadge}>??4.9 (?ÑÍ∏∞ {reviews.length}Í∞?</span>
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
                            {selectedWeight >= 10 && (
                                <span className={styles.discountTag}>?Ä?©Îüâ 10% ?πÎ≥Ñ?†Ïù∏</span>
                            )}
                        </div>
                        <div className={styles.pointRow}>
                            <Sparkles size={14} color="#D4870A" />
                            <span>Í≤∞Ï†ú ??<strong>{earnedPoints.toLocaleString()} DP</strong> (5% ?Ä?úÌè¨?∏Ìä∏ ÎßàÏùºÎ¶¨Ï?) Ï¶âÏãú ?ÅÎ¶Ω</span>
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
                            ?©Îüâ ?†ÌÉù (Weight Option):
                            {selectedWeight >= 10 && <span className={styles.freeShippingBadge}>?öö Î¨¥Î£åÎ∞∞ÏÜ° ?Ä??/span>}
                        </label>
                        <div className={styles.weightSelector}>
                            {[
                                { weight: 1, label: "?åÎß§ 1Kg (Í∏∞Î≥∏)", desc: "Í∞Ä?ïÏö© ?åÌè¨?? },
                                { weight: 3, label: "3Kg ?®Î?Î¶¨Ìå©", desc: "Í∞Ä??Î≥¥Í??? },
                                { weight: 5, label: "5Kg ?§ÏÜç??, desc: "?∏Í∏∞ ?§Ïù∏ Í∞ÄÏ°? },
                                { weight: 10, label: "10Kg ?Ä?©Îüâ (?ÑÎß§)", desc: "Î¨¥Î£åÎ∞∞ÏÜ° + 10%?†Ïù∏" },
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
                        <span className={styles.optionLabel}>?òÎüâ (Quantity):</span>
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
                            title="Ï£ºÎ¨∏???¥Í∏∞ Î∞?Í≤∞Ï†ú?òÎã® ?†ÌÉù"
                        >
                            <CreditCard size={20} />
                            <span>Î∞îÎ°ú Íµ¨Îß§?òÍ∏∞ ({totalPriceVnd.toLocaleString()} VND)</span>
                        </button>

                        <button 
                            className={`btn-primary ${styles.buyBtn} ${cartAdded ? styles.cartAdded : ''}`}
                            onClick={handleAddToCart}
                        >
                            {cartAdded ? (
                                <>
                                    <PackageCheck size={20} /> ?•Î∞îÍµ¨Îãà ?¥Í?!
                                </>
                            ) : (
                                <>
                                    <ShoppingCart size={18} /> ?•Î∞îÍµ¨Îãà ?¥Í∏∞
                                </>
                            )}
                        </button>
                    </div>

                    {/* Quick Trust badges */}
                    <div className={styles.trustRow}>
                        <div className={styles.trustChip}>
                            <Truck size={15} /> ?òÎÖ∏???πÏùº/?µÏùº ?†ÏÑ†Î∞∞ÏÜ°
                        </div>
                        <div className={styles.trustChip}>
                            <ShieldCheck size={15} /> HACCP ?àÏã¨ ?¥Î¶∞Î£??ùÏÇ∞
                        </div>
                        <div className={styles.trustChip}>
                            <Award size={15} /> Íµ¨Îß§ ??5% ?Ä?úÌè¨?∏Ìä∏ ?ÅÎ¶Ω
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== ?åÏÖú Í≥µÏú† ===== */}
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
                <ShareButtons
                    title={`${product.koreanName} | ?Ä?úÍ?Ïπ?(DAEHAN KIMCHI)`}
                    description={product.desc || product.name}
                />
            </div>

            {/* Product Specifications Table */}
            <section className={styles.specSection}>
                <h2 className={styles.sectionHeading}>?úÌíà ?ÅÏÑ∏ ?ïÎ≥¥</h2>
                <div className={styles.specGrid}>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>?úÌíàÎ™?/div>
                        <div className={styles.specVal}>{product.name}</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>?ùÌíà ?†Ìòï</div>
                        <div className={styles.specVal}>ÍπÄÏπòÎ•ò (ÎπÑÏÇ¥Í∑?Î∞úÌö® ?çÏÇ∞Í∞ÄÍ≥µÌíà)</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>?¥Ïö©??Î∞?Í∞ÄÍ≤?/div>
                        <div className={styles.specVal}>{selectedWeight}Kg ({totalPriceVnd.toLocaleString()} VND)</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>ÏßÄ??Í≤∞Ï†ú ?òÎã®</div>
                        <div className={styles.specVal}>?íµ <strong>?ºÎ∞ò Í≤∞Ï†ú (VND / Í≥ÑÏ¢å?¥Ï≤¥)</strong>, ‚≠?<strong>?Ä?úÌè¨?∏Ìä∏(DP) ?ÅÎ¶Ω 5%</strong></div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>Î≥¥Í? Î∞©Î≤ï</div>
                        <div className={styles.specVal}>0~4???âÏû• Î≥¥Í? (Í∞úÎ¥â ??Î∞Ä?êÏö©Í∏∞Ïóê ?¥ÏïÑ ÍπÄÏπòÎÉâ?•Í≥† Î≥¥Í? Í∂åÏû•)</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>?†ÌÜµÍ∏∞Ìïú</div>
                        <div className={styles.specVal}>?úÏ°∞?ºÎ°úÎ∂Ä??90??(?ÅÏ†ï Î∞úÌö® ?ôÏÑ±?ÑÏóê ?∞Îùº ??∑®)</div>
                    </div>
                    <div className={styles.specRow}>
                        <div className={styles.specKey}>Í≥†Í∞ù?ºÌÑ∞ & Ï£ºÎ¨∏ Î¨∏Ïùò</div>
                        <div className={styles.specVal}>?Ä?úÍ?Ïπ?(DAEHAN KIMCHI) ??Kakao/Zalo: 0702116617</div>
                    </div>
                </div>
            </section>

            {/* Review Section */}
            <section className={styles.reviewSection}>
                <div className={styles.reviewHeaderMain}>
                    <h2 className={styles.reviewTitle}>
                        Íµ¨Îß§ Í≥†Í∞ù ÎßåÏ°± ?ÑÍ∏∞
                        <span className={styles.ratingOverview}>(??4.9 / 5.0)</span>
                    </h2>
                    <span className={styles.reviewCountInfo}>Ï¥?{reviews.length}Í∞úÏùò Î¶¨Ïñº Î¶¨Î∑∞</span>
                </div>

                {/* Write form */}
                <form className={styles.writeForm} onSubmit={handleSubmitReview}>
                    <div className={styles.formHeader}>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>ÏßÅÏ†ë ?âÏ†ê & ?îÏßÅ ?ÑÍ∏∞ ?ëÏÑ±</h3>
                        <span className={styles.rewardNotice}>?éÅ ?ÑÍ∏∞ ?ëÏÑ± ??500 DP Ï¶âÏãú ?ÅÎ¶Ω!</span>
                    </div>

                    <div className={styles.ratingSelect} onMouseLeave={() => setHoverRating(0)}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginRight: '8px' }}>Î≥ÑÏ†ê ?†ÌÉù:</span>
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
                            placeholder="?ëÏÑ±???¥Î¶Ñ"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                        />
                        <input
                            type="text"
                            className={styles.reviewInput}
                            placeholder="ÍπÄÏπòÏùò Îß? ?ôÏÑ±?? Î∞∞ÏÜ° Î∞?Í≤∞Ï†ú Í≤ΩÌóò ???îÏßÅ???ÑÍ∏∞Î•??®Í≤®Ï£ºÏÑ∏??"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '10px 24px', flexShrink: 0 }}>
                            ?ÑÍ∏∞ ?±Î°ù
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
                <h2 className={styles.sectionHeading}>?®Íªò Íµ¨Îß§?òÎ©¥ Ï¢ãÏ? ?Ä?úÍ?Ïπ??ºÏù∏??/h2>
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
                                        <h3>?Ä?úÍ?Ïπ?Ï£ºÎ¨∏ Î∞?Í≤∞Ï†ú</h3>
                                    </div>
                                    <button className={styles.modalClose} onClick={() => setCheckoutModalOpen(false)}>??/button>
                                </div>

                                {/* Order Summary */}
                                <div className={styles.orderSummaryCard}>
                                    <img src={product.image} alt={product.name} className={styles.orderThumb} />
                                    <div className={styles.orderMeta}>
                                        <h4>{product.koreanName}</h4>
                                        <p>?©Îüâ: {selectedWeight}Kg ???òÎüâ: {quantity}Í∞???Ï£ºÎ¨∏Î≤àÌò∏: <code>{dynamicOrderId}</code></p>
                                        <div className={styles.orderPrices}>
                                            <span className={styles.vndTotal} style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                                                {totalPriceVnd.toLocaleString()} VND 
                                                <span style={{ fontSize: '0.9rem', color: '#f7a400', marginLeft: 8 }}>({Math.round(totalPriceVnd / 1000).toLocaleString()} ∏”¥œ)</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className={styles.shippingForm} style={{ marginBottom: 16 }}>
                                    <label className={styles.sectionSubTitle}>Í≤∞Ï†ú ?òÎã® ?†ÌÉù:</label>
                                    <select 
                                        value={paymentCurrency} 
                                        onChange={(e) => setPaymentCurrency(e.target.value as "VND" | "HEX")}
                                        className={`${styles.checkoutInput} ${styles.fullWidth}`}
                                        style={{ marginTop: 8 }}
                                    >
                                        <option value="VND">?ºÎ∞ò Í≤∞Ï†ú (VND / ?ÑÍ∏à Í≥ÑÏ¢å?¥Ï≤¥)</option>
                                        <option value="HEX">∞°∏Õ¡° Î®∏Îãà (HEX) Í≤∞Ï†ú</option>
                                    </select>
                                </div>



                                {/* Shipping Address */}
                                <div className={styles.shippingForm}>
                                    <label className={styles.sectionSubTitle}>Î∞∞ÏÜ°ÏßÄ ?ïÎ≥¥ (?òÎÖ∏??ÏΩúÎìúÏ≤¥Ïù∏ ÏßÅÎ∞∞??:</label>
                                    <div className={styles.formGrid}>
                                        <input 
                                            type="text" 
                                            placeholder="Î∞õÎäî Î∂??±Ìï®" 
                                            value={recipientName}
                                            onChange={e => setRecipientName(e.target.value)}
                                            className={styles.checkoutInput}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="?∞ÎùΩÏ≤?(Zalo/?¥Î???" 
                                            value={recipientPhone}
                                            onChange={e => setRecipientPhone(e.target.value)}
                                            className={styles.checkoutInput}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="?òÎÖ∏??Î∞∞ÏÜ° Ï£ºÏÜå" 
                                            value={recipientAddress}
                                            onChange={e => setRecipientAddress(e.target.value)}
                                            className={`${styles.checkoutInput} ${styles.fullWidth}`}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Î∞∞ÏÜ° ?îÏ≤≠?¨Ìï≠ (?†ÌÉù)" 
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
                                        "Ï£ºÎ¨∏ Í≤∞Ï†ú ?πÏù∏ Ï≤òÎ¶¨ Ï§?.."
                                    ) : (
                                        <>
                                            ?í≥ {paymentCurrency === "HEX" ? Math.round(totalPriceVnd / 1000).toLocaleString() + " ∏”¥œ" : totalPriceVnd.toLocaleString() + " VND"} Í≤∞Ï†ú?òÍ∏∞
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
                                <h3 className={styles.successTitle}>Ï£ºÎ¨∏ Í≤∞Ï†úÍ∞Ä ?ÑÎ£å?òÏóà?µÎãà??</h3>
                                <p className={styles.successSub}>
                                    ?Ä?úÍ?Ïπ??†ÏÑ† Î∞∞ÏÜ° Ï§ÄÎπÑÍ? ?úÏûë?òÏóà?µÎãà??
                                </p>

                                <div className={styles.receiptCard}>
                                    <div className={styles.receiptRow}>
                                        <span>Ï£ºÎ¨∏ Î≤àÌò∏</span>
                                        <strong>{paymentReceipt.orderId}</strong>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>Í≤∞Ï†ú Í∏àÏï°</span>
                                        <strong style={{ color: '#fcd34d' }}>
                                            {paymentReceipt.paidAmount.toLocaleString()} {paymentReceipt.currency}
                                        </strong>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>Í≤∞Ï†ú ???îÏï°</span>
                                        <span>{paymentReceipt.remainingBalance} {paymentReceipt.currency}</span>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>?ÅÎ¶Ω???Ä?úÌè¨?∏Ìä∏</span>
                                        <strong style={{ color: '#f7a400' }}>+{paymentReceipt.earnedDp.toLocaleString()} DP (5% Î¶¨Ïõå??</strong>
                                    </div>
                                    <div className={styles.receiptRow}>
                                        <span>?∏Îûú??Öò ID</span>
                                        <div className={styles.txHashWrap}>
                                            <code>{paymentReceipt.txHash.slice(0, 10)}...{paymentReceipt.txHash.slice(-8)}</code>
                                            <button className={styles.copyBtn} onClick={() => copyTxHash(paymentReceipt.txHash)}>
                                                {copiedTx ? "Î≥µÏÇ¨??" : <Copy size={13} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.receiptActions}>
                                    <Link href="/mypage" className="btn-primary" style={{ textAlign: 'center', padding: '12px 24px' }}>
                                        ÎßàÏù¥?òÏù¥ÏßÄ & Ï£ºÎ¨∏?¥Ïó≠ Ï°∞Ìöå
                                    </Link>
                                    <button 
                                        className={styles.closeReceiptBtn}
                                        onClick={() => setCheckoutModalOpen(false)}
                                    >
                                        Í≥ÑÏÜç ?ºÌïë?òÍ∏∞
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

