"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useUserWallet } from "@/context/UserWalletContext";
import { Sparkles, Check, Truck, Percent, Gift, Calendar, ArrowRight, ShieldCheck, PhoneCall } from "lucide-react";
import Link from "next/link";

interface TierConfig {
    id: "basic" | "family" | "restaurant";
    nameKo: string;
    nameVi: string;
    weightKo: string;
    weightVi: string;
    targetKo: string;
    targetVi: string;
    weeklyKg: number;
    pricePerKg: number; // 80,000 VND
    discountPercent: number; // 5%
    recommended?: boolean;
    featuresKo: string[];
    featuresVi: string[];
}

const TIERS: TierConfig[] = [
    {
        id: "basic",
        nameKo: "Basic 정기구독",
        nameVi: "Gói Basic",
        weightKo: "1주일 2Kg (월 8Kg)",
        weightVi: "1 tuần 2Kg (tháng 8Kg)",
        targetKo: "1~2인 가구 및 자취생 추천",
        targetVi: "Dành cho 1-2 người & cá nhân",
        weeklyKg: 2,
        pricePerKg: 80000,
        discountPercent: 5,
        featuresKo: [
            "1주일 2Kg 신선 정기 배송",
            "구독 전용 5% 즉시 할인",
            "하노이 전 지역 콜드체인 무료배송",
            "결제 시 10% DP (대한포인트) 적립"
        ],
        featuresVi: [
            "Giao 2Kg tươi hàng tuần",
            "Giảm giá ngay 5% dành cho gói đăng ký",
            "Miễn phí giao hàng lạnh toàn Hà Nội",
            "Tích lũy 10% điểm DP Daehan"
        ]
    },
    {
        id: "family",
        nameKo: "Family 정기구독",
        nameVi: "Gói Family",
        weightKo: "1주일 5Kg (월 20Kg)",
        weightVi: "1 tuần 5Kg (tháng 20Kg)",
        targetKo: "3~4인 가정 및 김치 마니아 추천",
        targetVi: "Dành cho gia đình 3-4 người",
        weeklyKg: 5,
        pricePerKg: 80000,
        discountPercent: 5,
        recommended: true,
        featuresKo: [
            "1주일 5Kg 넉넉한 가족용 정기 배송",
            "구독 전용 5% 할인 + 도매 추가 혜택",
            "하노이 콜드체인 당일 우선 배송",
            "결제 시 10% DP 적립 + 시즌 별미 김치 샘플 증정"
        ],
        featuresVi: [
            "Giao 5Kg dư dả cho gia đình hàng tuần",
            "Giảm 5% + Ưu đãi giá sỉ đặc biệt",
            "Ưu tiên giao lạnh trong ngày",
            "Tích 10% điểm DP + Tặng mẫu Kimchi mùa mới"
        ]
    },
    {
        id: "restaurant",
        nameKo: "Restaurant 대량구독",
        nameVi: "Gói Restaurant (Nhà hàng)",
        weightKo: "1주일 10~30Kg (선택 가능)",
        weightVi: "1 tuần 10~30Kg (Tùy chọn)",
        targetKo: "한식당 • 기업체 급식 • 단체 추천",
        targetVi: "Dành cho nhà hàng & doanh nghiệp",
        weeklyKg: 10,
        pricePerKg: 75000, // 대량 우대 정가
        discountPercent: 5,
        featuresKo: [
            "1주일 10~30Kg 식당 맞춤 정기 공급",
            "5% 추가 할인 + B2B 특가 적용",
            "숙성도(갓 담근 김치/알맞게 익은 김치) 맞춤 제공",
            "세금계산서 발행 및 도매 전용 상담 지원"
        ],
        featuresVi: [
            "Cung cấp 10-30Kg hàng tuần theo yêu cầu",
            "Giảm thêm 5% + Áp dụng giá B2B sỉ",
            "Tùy chỉnh độ chua (Mới muối / Lên men vừa)",
            "Hỗ trợ xuất hóa đơn & Tư vấn sỉ B2B"
        ]
    }
];

const KIMCHI_OPTIONS = [
    { value: "포기김치 (Pogi Kimchi)", labelKo: "포기김치 (대표 시그니처)", labelVi: "Kimchi Cải Thảo Nguyên Cây" },
    { value: "맛김치 (Mat Kimchi)", labelKo: "맛김치 (한 입 크기 컷팅)", labelVi: "Kimchi Cải Thảo Cắt Miếng" },
    { value: "깍두기 (Kkakdugi)", labelKo: "깍두기 (아삭한 무김치)", labelVi: "Kimchi Củ Cải Cắt Vuông" },
    { value: "묵은지 (Mookeunji)", labelKo: "신김치 / 묵은지 (요리용)", labelVi: "Kimchi Chua Lên Men Lâu" },
    { value: "혼합 (포기김치+깍두기)", labelKo: "반반 혼합 (포기김치 + 깍두기)", labelVi: "Mix (Cải Thảo + Củ Cải)" }
];

export default function SubscribePage() {
    const { lang, t } = useLanguage();
    const { user, isLoggedIn } = useUserWallet();

    const [selectedTier, setSelectedTier] = useState<TierConfig | null>(null);
    const [selectedKimchi, setSelectedKimchi] = useState<string>("포기김치 (Pogi Kimchi)");
    const [selectedCycle, setSelectedCycle] = useState<string>("EVERY_WEEK");
    const [restaurantKg, setRestaurantKg] = useState<number>(10);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [recipientName, setRecipientName] = useState(user?.name || "");
    const [recipientPhone, setRecipientPhone] = useState("0702116617");
    const [recipientAddress, setRecipientAddress] = useState("Hanoi, Nam Tu Liem, My Dinh Song Da");
    const [deliveryMemo, setDeliveryMemo] = useState("정기배송 신선 문앞 배송 부탁드립니다.");
    const [paymentMethod, setPaymentMethod] = useState<string>("VND");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openSubscriptionModal = (tier: TierConfig) => {
        setSelectedTier(tier);
        if (user?.name) setRecipientName(user.name);
        setModalOpen(true);
    };

    const getCycleLabel = (code: string) => {
        if (lang === "vi") {
            switch (code) {
                case "EVERY_WEEK": return "Mỗi tuần 1 lần (Thứ 2 hàng tuần)";
                case "EVERY_MONTH_1": return "Ngày 1 hàng tháng (Tự động)";
                case "EVERY_MONTH_15": return "Ngày 15 hàng tháng (Tự động)";
                case "EVERY_MONTH_BIWEEKLY": return "Ngày 1 & Ngày 15 (2 lần/tháng)";
                default: return code;
            }
        }
        switch (code) {
            case "EVERY_WEEK": return "매주 1회 자동 배송 (매주 월요일)";
            case "EVERY_MONTH_1": return "매월 1일 자동 주문 배송";
            case "EVERY_MONTH_15": return "매월 15일 자동 주문 배송";
            case "EVERY_MONTH_BIWEEKLY": return "매월 1일 & 15일 (월 2회 격주 배송)";
            default: return code;
        }
    };

    // Calculate Price
    const currentKg = selectedTier?.id === "restaurant" ? restaurantKg : (selectedTier?.weeklyKg || 2);
    const pricePerKg = selectedTier?.pricePerKg || 80000;
    const weeklyOriginalPrice = currentKg * pricePerKg;
    const weeklyDiscountedPrice = Math.round(weeklyOriginalPrice * 0.95); // 5% 할인
    const monthlyPrice = weeklyDiscountedPrice * 4; // 월 4주 기준
    const earnedDpPoints = Math.round(monthlyPrice * 0.1);

    const handleSubscribeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTier) return;
        if (!recipientName || !recipientPhone || !recipientAddress) {
            alert(lang === "vi" ? "Vui lòng nhập đầy đủ thông tin giao hàng." : "수령인, 연락처 및 배송지 주소를 작성해주세요.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/v1/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user?.uid || `guest_${Date.now()}`,
                    userName: user?.name || recipientName,
                    userEmail: user?.email || "guest@daehankimchi.com",
                    tier: selectedTier.id,
                    tierName: lang === "vi" ? selectedTier.nameVi : selectedTier.nameKo,
                    weight: `${currentKg}Kg / ${lang === "vi" ? "tuần" : "주일"}`,
                    kimchiType: selectedKimchi,
                    cycle: getCycleLabel(selectedCycle),
                    monthlyPriceVnd: monthlyPrice,
                    originalPriceVnd: weeklyOriginalPrice * 4,
                    discountPercent: 5,
                    shippingAddress: {
                        recipient: recipientName,
                        phone: recipientPhone,
                        address: recipientAddress,
                        memo: deliveryMemo
                    },
                    paymentMethod
                })
            });

            const data = await res.json();
            if (data.success) {
                alert(lang === "vi" 
                    ? `🎉 Đăng ký gói Kimchi thành công!\nMã đơn: ${data.subscription.subscriptionId}\nBộ phận chăm sóc sẽ liên hệ xác nhận giao hàng.` 
                    : `🎉 대한김치 정기배송 구독 신청이 완료되었습니다!\n(구독 ID: ${data.subscription.subscriptionId})\n운영자가 안내 연락을 드릴 예정입니다.`);
                setModalOpen(false);
            } else {
                alert(`신청 실패: ${data.error}`);
            }
        } catch (err: any) {
            alert(`오류 발생: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={`${styles.container} container`}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <span className={styles.heroBadge}>
                    <Sparkles size={16} /> 🥬 {lang === "vi" ? "Dịch vụ giao Kimchi định kỳ DAEHAN" : "매주/매월 신선 정기 배송 서비스"}
                </span>
                <h1 className={styles.title}>
                    <span className="text-gradient">대한김치 정기배송 구독</span>
                    <br />
                    {lang === "vi" ? "Thưởng thức Kimchi tươi chuẩn Hàn mỗi tuần" : "원하는 날짜에, 원하는 만큼 아삭하게!"}
                </h1>
                <p className={styles.subtitle}>
                    {lang === "vi"
                        ? "Đăng ký nhận Kimchi tươi muối trong ngày giao tận nhà hàng tuần hoặc hàng tháng (Ngày 1 & Ngày 15). Tiết kiệm hơn với ưu đãi giảm 5% và tích điểm DP!"
                        : "하노이 현지 위생 클린룸에서 당일 담근 100% 정통 한국 김치를 매주 또는 매월 1일/15일에 신선하게 받아보세요."}
                </p>
            </section>

            {/* Benefits Banner */}
            <div className={styles.benefitsGrid}>
                <div className={styles.benefitCard}>
                    <div className={styles.benefitIcon}>
                        <Percent size={24} />
                    </div>
                    <div>
                        <div className={benefitTitle(lang, "5% 전용 즉시 할인", "Giảm ngay 5%")}>5% 전용 즉시 할인</div>
                        <div className={styles.benefitDesc}>
                            {lang === "vi" ? "Tất cả các gói đăng ký định kỳ đều được giảm giá 5% so với giá bán lẻ." : "정기구독 신청 고객 모두에게 매 결제 시 5% 할인 혜택이 적용됩니다."}
                        </div>
                    </div>
                </div>

                <div className={styles.benefitCard}>
                    <div className={styles.benefitIcon}>
                        <Truck size={24} />
                    </div>
                    <div>
                        <div className={benefitTitle(lang, "하노이 우선 무료배송", "Miễn phí giao hàng lạnh")}>하노이 우선 무료배송</div>
                        <div className={styles.benefitDesc}>
                            {lang === "vi" ? "Ưu tiên giao hàng lạnh Cold-chain tận nhà toàn thành phố Hà Nội." : "정기배송 전용 콜드체인 차량으로 하노이 전 지역 우선 무료배송해 드립니다."}
                        </div>
                    </div>
                </div>

                <div className={styles.benefitCard}>
                    <div className={styles.benefitIcon}>
                        <Gift size={24} />
                    </div>
                    <div>
                        <div className={benefitTitle(lang, "10% DP 마일리지 적립", "Tích 10% điểm DP")}>10% DP 마일리지 적립</div>
                        <div className={styles.benefitDesc}>
                            {lang === "vi" ? "Tích lũy 10% điểm DP Daehan để đổi lấy Tiền nạp hoặc quà tặng." : "매월 결제금액의 10%가 대한포인트(DP)로 자동 적립되어 머니 전환이 가능합니다."}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tiers Grid */}
            <div className={styles.sectionTitleBlock}>
                <span className="badge">CHOOSE YOUR PLAN</span>
                <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginTop: '8px' }}>
                    {lang === "vi" ? "Chọn gói Kimchi phù hợp với bạn" : "나에게 딱 맞는 정기구독 플랜 선택"}
                </h2>
            </div>

            <div className={styles.tiersGrid}>
                {TIERS.map(tier => {
                    const isRec = tier.recommended;
                    const tierName = lang === "vi" ? tier.nameVi : tier.nameKo;
                    const weightText = lang === "vi" ? tier.weightVi : tier.weightKo;
                    const targetText = lang === "vi" ? tier.targetVi : tier.targetKo;
                    const features = lang === "vi" ? tier.featuresVi : tier.featuresKo;

                    const baseWeeklyKg = tier.id === "restaurant" ? 10 : tier.weeklyKg;
                    const origWeeklyPrice = baseWeeklyKg * tier.pricePerKg;
                    const discWeeklyPrice = Math.round(origWeeklyPrice * 0.95);

                    return (
                        <div key={tier.id} className={`${styles.tierCard} ${isRec ? styles.recommendedTier : ''}`}>
                            {isRec && <span className={styles.tierBadge}>BEST BEST</span>}
                            <div className={styles.tierHeader}>
                                <h3 className={styles.tierName}>{tierName}</h3>
                                <p className={styles.tierTarget}>{targetText}</p>
                            </div>

                            <div className={styles.priceBlock}>
                                <div className={styles.originalPrice}>{origWeeklyPrice.toLocaleString()} VND / {lang === "vi" ? "tuần" : "주"}</div>
                                <div className={styles.discountPriceGroup}>
                                    <span className={styles.finalPrice}>{discWeeklyPrice.toLocaleString()}</span>
                                    <span className={styles.unitText}>VND / {lang === "vi" ? "tuần" : "주"}</span>
                                    <span className={styles.discountTag}>5% OFF</span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    📦 {weightText}
                                </div>
                            </div>

                            <ul className={styles.featureList}>
                                {features.map((feat, idx) => (
                                    <li key={idx} className={styles.featureItem}>
                                        <Check size={16} />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`${styles.selectBtn} ${isRec ? 'btn-primary' : styles.btnSecondary}`}
                                onClick={() => openSubscriptionModal(tier)}
                            >
                                {lang === "vi" ? "Đăng ký gói này" : "이 플랜 구독 신청하기"} <ArrowRight size={18} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {modalOpen && selectedTier && (
                <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>🥬 {lang === "vi" ? selectedTier.nameVi : selectedTier.nameKo} {lang === "vi" ? "Đăng ký" : "구독 신청"}</h3>
                            <button className={styles.closeBtn} onClick={() => setModalOpen(false)}>✕</button>
                        </div>

                        <form onSubmit={handleSubscribeSubmit}>
                            {/* Kimchi Selection */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>🌶️ {lang === "vi" ? "Chọn loại Kimchi" : "구독할 김치 종류 선택"}:</label>
                                <select
                                    className={styles.select}
                                    value={selectedKimchi}
                                    onChange={(e) => setSelectedKimchi(e.target.value)}
                                >
                                    {KIMCHI_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {lang === "vi" ? opt.labelVi : opt.labelKo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Restaurant Kg Slider if Restaurant tier */}
                            {selectedTier.id === "restaurant" && (
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        ⚖️ {lang === "vi" ? "Số lượng Kg hàng tuần" : "1주일 배송 중량 선택"} (10~30Kg): <strong>{restaurantKg}Kg</strong>
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="30"
                                        step="5"
                                        value={restaurantKg}
                                        onChange={(e) => setRestaurantKg(Number(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                                    />
                                </div>
                            )}

                            {/* Delivery Cycle Options */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>📅 {lang === "vi" ? "Chọn chu kỳ giao hàng" : "배송 주기 선택"}:</label>
                                <div className={styles.cycleGrid}>
                                    {[
                                        { code: "EVERY_WEEK", labelKo: "🗓️ 매주 월요일 배송", labelVi: "🗓️ Mỗi tuần (Thứ 2)" },
                                        { code: "EVERY_MONTH_1", labelKo: "📅 매월 1일 자동 배송", labelVi: "📅 Ngày 1 hàng tháng" },
                                        { code: "EVERY_MONTH_15", labelKo: "📅 매월 15일 자동 배송", labelVi: "📅 Ngày 15 hàng tháng" },
                                        { code: "EVERY_MONTH_BIWEEKLY", labelKo: "📅 매월 1일 & 15일 (격주)", labelVi: "📅 Ngày 1 & 15 (2 lần/tháng)" }
                                    ].map(c => (
                                        <div
                                            key={c.code}
                                            className={`${styles.cycleOption} ${selectedCycle === c.code ? styles.cycleOptionActive : ''}`}
                                            onClick={() => setSelectedCycle(c.code)}
                                        >
                                            {lang === "vi" ? c.labelVi : c.labelKo}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping info */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>👤 {lang === "vi" ? "Tên người nhận" : "수령인 성함"}:</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>📱 {lang === "vi" ? "Số điện thoại" : "연락처 (전화번호)"}:</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={recipientPhone}
                                    onChange={(e) => setRecipientPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>📍 {lang === "vi" ? "Địa chỉ giao hàng Hà Nội" : "하노이 배송지 주소"}:</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={recipientAddress}
                                    onChange={(e) => setRecipientAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>📝 {lang === "vi" ? "Ghi chú giao hàng" : "배송 요청사항"}:</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={deliveryMemo}
                                    onChange={(e) => setDeliveryMemo(e.target.value)}
                                />
                            </div>

                            {/* Payment Method */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>💳 {lang === "vi" ? "Phương thức thanh toán" : "결제 방식"}:</label>
                                <select
                                    className={styles.select}
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="VND">🏦 {lang === "vi" ? "Chuyển khoản Ngân hàng Shinhan VND" : "신한은행 계좌이체 (VND)"}</option>
                                    <option value="MONEY">💳 {lang === "vi" ? "Tiền nạp DAEHAN" : "대한김치 충전머니 자동 차감"}</option>
                                </select>
                            </div>

                            {/* Summary Box */}
                            <div className={styles.summaryBox}>
                                <div className={styles.summaryRow}>
                                    <span>{lang === "vi" ? "Tổng lượng Kimchi hàng tháng" : "월 정기 배송 중량"}:</span>
                                    <strong>{currentKg * 4}Kg</strong>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>{lang === "vi" ? "Chiết khấu 구독 5%" : "구독 전용 5% 할인"}:</span>
                                    <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>-{(weeklyOriginalPrice * 4 * 0.05).toLocaleString()} VND</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>🎟️ {lang === "vi" ? "Điểm thưởng DP tích lũy" : "적립 예정 대한포인트(DP)"}:</span>
                                    <strong style={{ color: '#D4870A' }}>+{earnedDpPoints.toLocaleString()} DP</strong>
                                </div>
                                <div className={styles.summaryTotal}>
                                    <span>{lang === "vi" ? "Tổng tiền hàng tháng" : "월 예상 정기 결제금액"}:</span>
                                    <span>{monthlyPrice.toLocaleString()} VND</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting 
                                    ? (lang === "vi" ? "Đang xử lý..." : "신청 처리 중...") 
                                    : (lang === "vi" ? "Xác nhận đăng ký Kimchi" : "🥬 김치 정기배송 구독 완료하기")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

function benefitTitle(lang: string, koText: string, viText: string) {
    return lang === "vi" ? viText : koText;
}
