"use client";

import React, { useEffect, useState } from "react";
import { useUserWallet } from "@/context/UserWalletContext";
import styles from "./page.module.css";
import { Wallet, Award, Users, Copy, Check, Gift, Sparkles, UserCheck, ShieldCheck, Share2, MessageSquare, BookOpen, ShoppingBag } from "lucide-react";

export default function MyPage() {
    const { user, wallet, isLoggedIn, orders, isLoading, refreshWallet } = useUserWallet();
    const [mounted, setMounted] = useState(false);
    const [copiedUid, setCopiedUid] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isLoggedIn) {
            refreshWallet();
        }
    }, [isLoggedIn, refreshWallet]);

    if (!mounted) return null;

    if (!isLoggedIn || !user) {
        return (
            <main>
                <div className={styles.authWarning}>
                    <h2>로그인이 필요한 서비스입니다.</h2>
                    <p>우측 상단 메뉴의 로그인 버튼을 통해 로그인 후 이용해 주세요.</p>
                </div>
            </main>
        );
    }

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "PAID": return "결제완료";
            case "PREPARING": return "상품준비중";
            case "SHIPPING": return "배송중";
            case "DELIVERED": return "배송완료";
            default: return status;
        }
    };

    const copyReferralCode = () => {
        if (typeof navigator !== "undefined" && user?.uid) {
            navigator.clipboard.writeText(user.uid);
            setCopiedUid(true);
            setTimeout(() => setCopiedUid(false), 2000);
        }
    };

    const rewardRules = [
        { icon: <Gift size={16} color="#d97706" />, action: "신규 회원가입", reward: "1,000 DP" },
        { icon: <UserCheck size={16} color="#2563eb" />, action: "친구 추천 (멘토)", reward: "500 DP" },
        { icon: <ShoppingBag size={16} color="#dc2626" />, action: "상품 구매", reward: "구매액 5% DP" },
        { icon: <MessageSquare size={16} color="#16a34a" />, action: "리뷰 작성", reward: "500 DP" },
        { icon: <Share2 size={16} color="#9333ea" />, action: "상품/웹진 공유", reward: "100 DP" },
        { icon: <BookOpen size={16} color="#0284c7" />, action: "웹진 읽기", reward: "50 DP" },
    ];

    return (
        <main style={{ backgroundColor: "#f9fafb", minHeight: "100vh", paddingBottom: "4rem" }}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>마이페이지</h1>
                    <p className={styles.subTitle}>대한김치 회원 정보와 지갑 자산, 추천인 시스템 및 주문 내역을 확인하세요.</p>
                </div>

                {/* Profile Card */}
                <div className={styles.profileCard}>
                    <img 
                        src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} 
                        alt="Profile" 
                        className={styles.avatar} 
                    />
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            {user.name} 님
                            <span className={styles.roleBadge}>{user.role}</span>
                        </div>
                        <div className={styles.userEmail}>{user.email}</div>
                        {user.createdAt && (
                            <div className={styles.userEmail} style={{ fontSize: '0.85rem' }}>
                                가입일: {formatDate(user.createdAt)}
                            </div>
                        )}
                    </div>
                </div>

                {/* 💳 자체 지갑 자산 섹션 */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <div className={styles.sectionTitle}>
                        <Wallet size={20} color="#d97706" /> 💳 대한김치 지갑 자산
                    </div>
                    <div className={styles.assetGrid}>
                        {/* 대한포인트 (DP) Card */}
                        <div className={`${styles.assetCard} ${styles.assetDp}`} style={{ border: '2px solid #f59e0b', background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)' }}>
                            <div className={styles.assetHeader}>
                                <Sparkles size={16} /> ⭐ 대한포인트 (DP)
                            </div>
                            <div>
                                <span className={styles.assetValue}>{wallet.dpPoints.toLocaleString()}</span>
                                <span className={styles.assetUnit}>DP</span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: '#b45309', margin: 0 }}>
                                대한김치 생태계 전용 대표 적립 포인트
                            </p>
                        </div>

                        {/* 충전 머니 Card */}
                        <div className={styles.assetCard}>
                            <div className={styles.assetHeader}>
                                💳 충전 머니
                            </div>
                            <div>
                                <span className={styles.assetValue}>{wallet.moneyBalance.toLocaleString()}</span>
                                <span className={styles.assetUnit}>머니</span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: 0 }}>
                                간편 결제 전용 예치금
                            </p>
                        </div>

                        {/* 적립 포인트 Card */}
                        <div className={`${styles.assetCard} ${styles.assetPoints}`}>
                            <div className={styles.assetHeader}>
                                🎟️ 적립 포인트
                            </div>
                            <div>
                                <span className={styles.assetValue}>{wallet.points.toLocaleString()}</span>
                                <span className={styles.assetUnit}>P</span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: '#047857', margin: 0 }}>
                                일반 구매 보상 포인트
                            </p>
                        </div>

                        {/* VND 잔액 Card */}
                        <div className={`${styles.assetCard} ${styles.assetVnd}`}>
                            <div className={styles.assetHeader}>
                                💵 VND 잔액
                            </div>
                            <div>
                                <span className={styles.assetValue}>{wallet.vndBalance.toLocaleString()}</span>
                                <span className={styles.assetUnit}>₫</span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: '#1d4ed8', margin: 0 }}>
                                베트남 동 현금성 잔액
                            </p>
                        </div>
                    </div>
                </section>

                {/* 👥 추천인 & 멘티 관리 섹션 */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <div className={styles.sectionTitle}>
                        <Users size={20} color="#2563eb" /> 👥 추천인 & 멘티 시스템
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {/* 내 추천인 코드 복사 카드 */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Award size={18} color="#d97706" /> 내 추천인 UID 코드
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                                신규 가입하는 회원에게 아래 코드를 공유하세요. 추천 가입 시 <strong>500 DP</strong>가 즉시 적립됩니다.
                            </p>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={user.uid} 
                                    style={{ 
                                        flex: 1, 
                                        background: '#f3f4f6', 
                                        border: '1px solid #d1d5db', 
                                        borderRadius: '8px', 
                                        padding: '10px 12px', 
                                        fontSize: '0.88rem', 
                                        fontFamily: 'monospace', 
                                        fontWeight: 'bold', 
                                        color: '#111827' 
                                    }} 
                                />
                                <button 
                                    onClick={copyReferralCode}
                                    style={{ 
                                        background: copiedUid ? '#16a34a' : '#111827', 
                                        color: '#fff', 
                                        border: 'none', 
                                        borderRadius: '8px', 
                                        padding: '10px 16px', 
                                        fontSize: '0.88rem', 
                                        fontWeight: 700, 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '6px',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    {copiedUid ? <Check size={16} /> : <Copy size={16} />}
                                    {copiedUid ? "복사됨!" : "코드 복사"}
                                </button>
                            </div>
                        </div>

                        {/* 나의 멘토 & 멘티 정보 카드 */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <ShieldCheck size={18} color="#16a34a" /> 나의 멘토 및 멘티 현황
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: 600 }}>나를 추천해준 멘토:</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2563eb' }}>
                                        {user.referrerUid ? user.referrerUid : "없음 (최초 가입자 / 관리자)"}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: 600 }}>나를 추천하여 가입한 멘티:</span>
                                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#d97706' }}>
                                        {user.mentees?.length || 0} 명
                                    </span>
                                </div>
                                {user.mentees && user.mentees.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                        {user.mentees.map((mUid, idx) => (
                                            <span key={idx} style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '3px 8px', fontWeight: 600 }}>
                                                {mUid}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🎁 대한김치 포인트 적립 안내 표 */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <div className={styles.sectionTitle}>
                        <Gift size={20} color="#dc2626" /> 🎁 대한김치 로열티 적립 혜택
                    </div>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            {rewardRules.map((rule, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                                    <div>{rule.icon}</div>
                                    <div>
                                        <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>{rule.action}</div>
                                        <div style={{ fontSize: '0.95rem', color: '#111827', fontWeight: 800 }}>{rule.reward}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 📦 주문 내역 섹션 */}
                <div className={styles.ordersSection}>
                    <div className={styles.sectionTitle} style={{ marginBottom: "1.5rem" }}>
                        <ShoppingBag size={20} color="#16a34a" /> 📦 최근 주문 내역
                    </div>
                    
                    {orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>최근 주문 내역이 없습니다.</p>
                        </div>
                    ) : (
                        <div className={styles.orderList}>
                            {orders.map((order) => (
                                <div key={order.orderId} className={styles.orderCard}>
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderIdBox}>
                                            <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                                            <span className={styles.orderId}>{order.orderId}</span>
                                        </div>
                                        <div className={`${styles.orderStatus} ${styles[`status_${order.status}`]}`}>
                                            {getStatusText(order.status)}
                                        </div>
                                    </div>
                                    <div className={styles.orderBody}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className={styles.orderItem}>
                                                <img src={item.image} alt={item.productName} className={styles.itemImage} />
                                                <div className={styles.itemDetails}>
                                                    <div className={styles.itemName}>{item.productName}</div>
                                                    <div className={styles.itemMeta}>옵션: {item.weight} | 수량: {item.quantity}개</div>
                                                    <div className={styles.itemPrice}>{item.priceVnd.toLocaleString()} ₫</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.orderFooter}>
                                        <span className={styles.totalLabel}>총 결제 금액 ({order.currency})</span>
                                        <span className={styles.totalAmount}>
                                            {order.paidAmount.toLocaleString()} 
                                            {order.currency === "VND" ? " ₫" : order.currency === "POINT" ? " P" : " 머니"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
