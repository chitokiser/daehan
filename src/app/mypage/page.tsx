"use client";

import React, { useEffect, useState } from "react";
import { useUserWallet } from "@/context/UserWalletContext";
import styles from "./page.module.css";
import { Wallet, Award, Users, Copy, Check, Gift, Sparkles, UserCheck, ShieldCheck, Share2, MessageSquare, BookOpen, ShoppingBag, ArrowRightLeft, TrendingUp, Zap, Building, Landmark, CreditCard, QrCode, Truck } from "lucide-react";

export default function MyPage() {
    const { user, wallet, isLoggedIn, orders, refreshWallet, convertDpToMoney, levelUp } = useUserWallet();
    const [mounted, setMounted] = useState(false);
    const [copiedUid, setCopiedUid] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [convertDpInput, setConvertDpInput] = useState<string>("");
    const [convertLoading, setConvertLoading] = useState(false);
    const [levelUpLoading, setLevelUpLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    // 충전머니 계좌 입금 신청 상태
    const [chargeAmountInput, setChargeAmountInput] = useState<string>("");
    const [depositorNameInput, setDepositorNameInput] = useState<string>("");
    const [chargeLoading, setChargeLoading] = useState(false);
    const [userRequests, setUserRequests] = useState<any[]>([]);

    const fetchUserChargeRequests = async () => {
        if (!user?.uid) return;
        try {
            const res = await fetch(`/api/v1/wallet/charge-request?uid=${user.uid}`);
            const json = await res.json();
            if (json.success) setUserRequests(json.requests || []);
        } catch {}
    };

    useEffect(() => {
        setMounted(true);
        if (isLoggedIn) {
            refreshWallet();
            fetchUserChargeRequests();
        }
    }, [isLoggedIn, refreshWallet, user?.uid]);

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

    const originUrl = typeof window !== "undefined" ? window.location.origin : "https://daehankimchi.com";
    const userRefCode = user?.email || user?.uid || "daguri75@gmail.com";
    const referralLink = `${originUrl}/?ref=${encodeURIComponent(userRefCode)}`;
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(referralLink)}`;

    const copyReferralCode = () => {
        if (typeof navigator !== "undefined" && user?.uid) {
            navigator.clipboard.writeText(user.uid);
            setCopiedUid(true);
            setTimeout(() => setCopiedUid(false), 2000);
        }
    };

    const copyReferralLink = () => {
        if (typeof navigator !== "undefined") {
            navigator.clipboard.writeText(referralLink);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        }
    };

    // Level & EXP 계산 (레벨업 공식 = 현재레벨² X 10,000 EXP)
    const userLevel = user.level || 1;
    const userExp = user.exp !== undefined ? user.exp : 0;
    const requiredExp = Math.pow(userLevel, 2) * 10000;
    const expProgressPercent = Math.min(100, Math.floor((userExp / requiredExp) * 100));
    const canLevelUp = userExp >= requiredExp;

    // DP -> 충전머니 전환 비율 계산 (전환 공식 = DP X 레벨 / 10)
    const conversionRate = userLevel / 10;
    const inputDpNum = parseInt(convertDpInput) || 0;
    const previewConvertedMoney = Math.floor(inputDpNum * conversionRate);

    const handleConvertDp = async () => {
        if (inputDpNum <= 0) {
            setMessage({ text: "전환할 DP 수량을 입력해 주세요.", type: "error" });
            return;
        }
        if (inputDpNum > wallet.dpPoints) {
            setMessage({ text: "보유하신 DP 잔액보다 많은 수량입니다.", type: "error" });
            return;
        }

        setConvertLoading(true);
        setMessage(null);
        const res = await convertDpToMoney(inputDpNum);
        setConvertLoading(false);

        if (res.success) {
            setMessage({ 
                text: `🎉 전환 성공! ${inputDpNum.toLocaleString()} DP가 ${res.convertedMoney?.toLocaleString()} 충전머니로 안전하게 전환되었습니다!`, 
                type: "success" 
            });
            setConvertDpInput("");
        } else {
            setMessage({ text: res.error || "전환 처리 실패", type: "error" });
        }
    };

    const handleLevelUp = async () => {
        if (!canLevelUp) return;
        setLevelUpLoading(true);
        setMessage(null);
        const res = await levelUp();
        setLevelUpLoading(false);

        if (res.success) {
            setMessage({ 
                text: `🚀 축하합니다! 레벨업 완료 (현재 Lv.${userLevel + 1})! DP 전환율이 ${(userLevel + 1) * 10}%로 대폭 상승했습니다!`, 
                type: "success" 
            });
        } else {
            setMessage({ text: res.error || "레벨업 실패", type: "error" });
        }
    };

    const handleCreateChargeRequest = async () => {
        const amt = parseInt(chargeAmountInput);
        if (!amt || amt <= 0) {
            setMessage({ text: "충전 신청할 금액을 입력해 주세요.", type: "error" });
            return;
        }
        if (!depositorNameInput.trim()) {
            setMessage({ text: "입금자명을 입력해 주세요.", type: "error" });
            return;
        }

        setChargeLoading(true);
        setMessage(null);
        try {
            const res = await fetch("/api/v1/wallet/charge-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user.uid,
                    amount: amt,
                    depositorName: depositorNameInput.trim()
                })
            });
            const json = await res.json();
            if (json.success) {
                setMessage({ 
                    text: `✅ 계좌 입금 충전 신청 완료! (신청 금액: ${amt.toLocaleString()} 머니). 관리자가 신한은행 계좌 입금 확인 후 즉시 승인됩니다.`, 
                    type: "success" 
                });
                setChargeAmountInput("");
                fetchUserChargeRequests();
            } else {
                setMessage({ text: json.error || "신청에 실패했습니다.", type: "error" });
            }
        } catch (e: any) {
            setMessage({ text: e.message || "서버 통신 오류", type: "error" });
        } finally {
            setChargeLoading(false);
        }
    };

    const handleResetWallets = async () => {
        const res = await fetch("/api/v1/admin/reset-wallets", { method: "POST" });
        const json = await res.json();
        if (json.success) {
            setMessage({ text: "🧹 모든 유저의 지갑 자산(DP, 충전머니, EXP)이 0으로 성공적으로 초기화되었습니다!", type: "success" });
            await refreshWallet();
        } else {
            setMessage({ text: json.error || "초기화 실패", type: "error" });
        }
    };

    const handleGrantTestDp = async (dpAmount: number) => {
        if (!user?.uid) return;
        const res = await fetch("/api/v1/wallet/grant-test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: user.uid, dpAmount })
        });
        const json = await res.json();
        if (json.success) {
            setMessage({ text: `🎁 테스트용 +${dpAmount.toLocaleString()} DP가 즉시 적립되었습니다!`, type: "success" });
            await refreshWallet();
        }
    };

    const handleGrantTestExp = async (expAmount: number) => {
        if (!user?.uid) return;
        const res = await fetch("/api/v1/wallet/grant-test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: user.uid, expAmount })
        });
        const json = await res.json();
        if (json.success) {
            setMessage({ text: `⚡ 테스트용 +${expAmount.toLocaleString()} EXP가 획득되었습니다!`, type: "success" });
            await refreshWallet();
        }
    };

    const rewardRules = [
        { icon: <Gift size={16} color="#d97706" />, action: "신규 회원가입", reward: "1,000 DP / +1,000 EXP" },
        { icon: <UserCheck size={16} color="#2563eb" />, action: "친구 추천 (멘토)", reward: "500 DP / +2,000 EXP" },
        { icon: <ShoppingBag size={16} color="#dc2626" />, action: "상품 구매", reward: "구매액 10% DP / 1% EXP" },
        { icon: <MessageSquare size={16} color="#16a34a" />, action: "리뷰 작성", reward: "500 DP / +500 EXP" },
        { icon: <Share2 size={16} color="#9333ea" />, action: "상품/웹진 공유", reward: "100 DP / +100 EXP" },
        { icon: <BookOpen size={16} color="#0284c7" />, action: "웹진 읽기", reward: "50 DP / +50 EXP" },
    ];

    return (
        <main style={{ backgroundColor: "#f9fafb", minHeight: "100vh", paddingBottom: "4rem" }}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>마이페이지</h1>
                    <p className={styles.subTitle}>대한김치 회원 정보와 지갑 자산(DP & 충전머니), 레벨 성장 시스템 및 주문 내역을 확인하세요.</p>
                </div>



                {/* 알림 메시지 배너 */}
                {message && (
                    <div style={{
                        padding: "1rem 1.25rem",
                        borderRadius: "12px",
                        marginBottom: "1.5rem",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        backgroundColor: message.type === "success" ? "#ecfdf5" : "#fef2f2",
                        color: message.type === "success" ? "#047857" : "#b91c1c",
                        border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Profile Card */}
                <div className={styles.profileCard}>
                    <img 
                        src={user.avatar || (user.email ? `https://unavatar.io/google/${user.email}` : "https://lh3.googleusercontent.com/a/default-user")} 
                        alt="Profile" 
                        className={styles.avatar} 
                    />
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            {user.name} 님
                            <span className={styles.roleBadge}>{user.role}</span>
                            <span style={{
                                fontSize: "0.82rem",
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #c8392b, #d4870a)",
                                color: "#fff",
                                padding: "3px 10px",
                                borderRadius: "99px",
                                letterSpacing: "0.05em"
                            }}>
                                Lv.{userLevel}
                            </span>
                        </div>
                        <div className={styles.userEmail}>{user.email}</div>
                        {user.createdAt && (
                            <div className={styles.userEmail} style={{ fontSize: '0.85rem' }}>
                                가입일: {formatDate(user.createdAt)}
                            </div>
                        )}
                    </div>
                </div>

                {/* ⭐ 레벨 & EXP 경험치 성장 시스템 (프로그래시브 막대) */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <div className={styles.sectionTitle}>
                        <TrendingUp size={20} color="#c8392b" /> ⭐ 회원 레벨 & EXP 성장에 따른 혜택
                    </div>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        padding: '1.75rem',
                        border: '1.5px solid #f3f4f6',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 800,
                                        color: '#1a0d08'
                                    }}>
                                        현재 레벨: Lv.{userLevel}
                                    </span>
                                    <span style={{
                                        fontSize: '0.78rem',
                                        fontWeight: 800,
                                        color: '#c8392b',
                                        background: 'rgba(200, 57, 43, 0.1)',
                                        border: '1px solid rgba(200, 57, 43, 0.3)',
                                        padding: '3px 10px',
                                        borderRadius: '99px'
                                    }}>
                                        전환율: {userLevel * 10}%
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.86rem', color: '#6b7280', margin: 0 }}>
                                    플랫폼 내 다양한 활동으로 EXP를 쌓아 레벨업하면 DP ➔ 충전머니 전환율이 비례하여 증가합니다.
                                </p>
                            </div>

                            {/* 레벨업 버튼 */}
                            <button
                                onClick={handleLevelUp}
                                disabled={!canLevelUp || levelUpLoading}
                                style={{
                                    background: canLevelUp ? 'linear-gradient(135deg, #c8392b, #d4870a)' : '#e5e7eb',
                                    color: canLevelUp ? '#ffffff' : '#9ca3af',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '12px 22px',
                                    fontSize: '0.92rem',
                                    fontWeight: 800,
                                    cursor: canLevelUp ? 'pointer' : 'not-allowed',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: canLevelUp ? '0 6px 20px rgba(200, 57, 43, 0.3)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Zap size={16} />
                                {levelUpLoading ? "레벨업 처리 중..." : canLevelUp ? `🚀 레벨업하기 (Lv.${userLevel} ➔ Lv.${userLevel + 1})` : `다음 레벨까지 ${(requiredExp - userExp).toLocaleString()} EXP 필요`}
                            </button>
                        </div>

                        {/* 📊 프로그래시브 바 (Progress Bar) */}
                        <div style={{ marginTop: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                                <span>경험치 진행률 (EXP)</span>
                                <span>{userExp.toLocaleString()} / {requiredExp.toLocaleString()} EXP ({expProgressPercent}%)</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '16px',
                                background: '#f3f4f6',
                                borderRadius: '99px',
                                overflow: 'hidden',
                                border: '1px solid #e5e7eb',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: `${expProgressPercent}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #c8392b 0%, #d4870a 100%)',
                                    borderRadius: '99px',
                                    transition: 'width 0.6s ease'
                                }} />
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '6px', textAlign: 'right' }}>
                                ※ 레벨업 조건 공식: 현재레벨² × 10,000 EXP
                            </div>
                        </div>
                    </div>
                </section>

                {/* 💳 자체 지갑 자산 섹션 (DP & 충전머니 2가지 자산만 표시) */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <div className={styles.sectionTitle}>
                        <Wallet size={20} color="#d97706" /> 💳 대한김치 지갑 자산
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        {/* 1. 대한포인트 (DP) Card */}
                        <div className={`${styles.assetCard} ${styles.assetDp}`} style={{ border: '2px solid #f59e0b', background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)' }}>
                            <div className={styles.assetHeader}>
                                <Sparkles size={18} /> ⭐ 대한포인트 (DP)
                            </div>
                            <div>
                                <span className={styles.assetValue}>{wallet.dpPoints.toLocaleString()}</span>
                                <span className={styles.assetUnit}>DP</span>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: '#b45309', margin: 0, fontWeight: 600 }}>
                                회원 활동을 통해 적립되며, 충전머니로 전환 가능
                            </p>
                        </div>

                        {/* 2. 충전 머니 Card */}
                        <div className={styles.assetCard} style={{ border: '2px solid #10b981', background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)' }}>
                            <div className={styles.assetHeader} style={{ color: '#059669' }}>
                                💳 충전 머니 (결제 수단)
                            </div>
                            <div>
                                <span className={styles.assetValue} style={{ color: '#047857' }}>{wallet.moneyBalance.toLocaleString()}</span>
                                <span className={styles.assetUnit} style={{ color: '#059669' }}>머니</span>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: '#047857', margin: 0, fontWeight: 600 }}>
                                쇼핑몰에서 현금처럼 바로 사용 가능한 전용 결제 수단
                            </p>
                        </div>
                    </div>

                    {/* 🔄 DP ➔ 충전머니 전환 (DP 환전소) */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        padding: '1.5rem 1.75rem',
                        border: '1.5px solid #f3f4f6',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            <ArrowRightLeft size={18} color="#c8392b" />
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                                🔄 DP ➔ 충전머니 전환 서비스
                            </h3>
                            <span style={{ fontSize: '0.78rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '2px 8px', fontWeight: 700 }}>
                                현재 레벨 Lv.{userLevel} (전환율 {conversionRate * 100}%)
                            </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>
                            보유하신 DP 포인트를 쇼핑몰 결제용 충전머니로 전환하세요. <strong>공식: 전환 머니 = DP × (레벨 / 10)</strong>
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                            <div style={{ flex: '1', minWidth: '220px', display: 'flex', gap: '8px' }}>
                                <input
                                    type="number"
                                    placeholder="전환할 DP 수량 입력"
                                    value={convertDpInput}
                                    onChange={(e) => setConvertDpInput(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '12px 14px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '10px',
                                        fontSize: '0.92rem',
                                        fontWeight: 700,
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={() => setConvertDpInput(wallet.dpPoints.toString())}
                                    style={{
                                        padding: '0 14px',
                                        background: '#f3f4f6',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '10px',
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        color: '#374151',
                                        cursor: 'pointer'
                                    }}
                                >
                                    전액
                                </button>
                            </div>

                            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#c8392b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>➔</span>
                                <span>{previewConvertedMoney.toLocaleString()} 머니 전환 예정</span>
                            </div>

                            <button
                                onClick={handleConvertDp}
                                disabled={convertLoading}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                                }}
                            >
                                <Zap size={15} />
                                {convertLoading ? "전환 처리 중..." : "⚡ 충전머니로 전환하기"}
                            </button>
                        </div>
                    </div>
                </section>

                {/* 🏦 계좌입금 충전 신청 섹션 */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <div className={styles.sectionTitle}>
                        <Building size={20} color="#1d4ed8" /> 🏦 충전머니 계좌입금 신청 (VND 기준 / 입금 후 충전 요청)
                    </div>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {/* 입금 계좌 안내 카드 */}
                        <div style={{
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
                            color: '#ffffff',
                            borderRadius: '20px',
                            padding: '1.75rem',
                            boxShadow: '0 8px 30px rgba(29, 78, 216, 0.25)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                                    <Landmark size={22} color="#fbbf24" />
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>입금 지정 계좌 안내 (VND 전용)</span>
                                </div>
                                
                                <div style={{ background: 'rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '14px 16px', backdropFilter: 'blur(8px)', marginBottom: '1.25rem' }}>
                                    <div style={{ fontSize: '0.82rem', color: '#bfdbfe', marginBottom: '4px' }}>은행 (NGÂN HÀNG)</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>SHINHAN BANK VIETNAM (신한은행 베트남)</div>
                                    
                                    <div style={{ fontSize: '0.82rem', color: '#bfdbfe', marginBottom: '4px' }}>계좌번호 (SỐ TÀI KHOẢN)</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.05em', color: '#fbbf24', fontFamily: 'monospace', marginBottom: '10px' }}>
                                        700004461261
                                    </div>

                                    <div style={{ fontSize: '0.82rem', color: '#bfdbfe', marginBottom: '4px' }}>예금주 (TÊN TÀI KHOẢN)</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>KIM YONG JIN</div>

                                    <div style={{ fontSize: '0.82rem', color: '#bfdbfe', marginBottom: '4px' }}>입금 통화 (TIỀN TỆ)</div>
                                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#4ade80' }}>🇻🇳 VND (베트남 동 ₫ 전용 계좌)</div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (typeof navigator !== "undefined") {
                                        navigator.clipboard.writeText("700004461261");
                                        alert("계좌번호(700004461261)가 클립보드에 복사되었습니다!");
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#ffffff',
                                    color: '#1d4ed8',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Copy size={16} /> 계좌번호 복사하기
                            </button>
                        </div>

                        {/* 충전 신청 작성 폼 카드 */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '20px',
                            padding: '1.75rem',
                            border: '1.5px solid #e5e7eb',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CreditCard size={18} color="#059669" /> 계좌 입금 완료 후 충전 요청
                                </h3>
                                <p style={{ fontSize: '0.84rem', color: '#6b7280', marginBottom: '1.25rem' }}>
                                    신한은행 베트남 계좌로 <strong>VND(동)</strong> 입금 후 신청하시면 관리자가 입금 확인 후 충전머니를 승인해 드립니다.
                                </p>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                                        충전 요청 금액 (VND ₫ 기준)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="예: 200000 (VND ₫)"
                                        value={chargeAmountInput}
                                        onChange={(e) => setChargeAmountInput(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '10px',
                                            fontSize: '0.95rem',
                                            fontWeight: 700,
                                            outline: 'none',
                                            marginBottom: '8px'
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {[100000, 200000, 500000, 1000000].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setChargeAmountInput(val.toString())}
                                                style={{
                                                    padding: '5px 10px',
                                                    fontSize: '0.76rem',
                                                    fontWeight: 700,
                                                    background: '#f3f4f6',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '6px',
                                                    color: '#374151',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                +{val.toLocaleString()} VND
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                                        입금자 성함 (Tên người gửi)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="입금하신 통장 표시 이름 (예: 김용진)"
                                        value={depositorNameInput}
                                        onChange={(e) => setDepositorNameInput(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '10px',
                                            fontSize: '0.92rem',
                                            fontWeight: 700,
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreateChargeRequest}
                                disabled={chargeLoading}
                                style={{
                                    width: '100%',
                                    padding: '13px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                                }}
                            >
                                <Zap size={16} /> {chargeLoading ? "신청 처리 중..." : "⚡ 입금 완료 및 충전 신청하기 (VND)"}
                            </button>
                        </div>
                    </div>

                    {/* 나의 최근 충전 신청 현황 목록 */}
                    {userRequests.length > 0 && (
                        <div style={{ marginTop: '1.5rem', background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid #e5e7eb' }}>
                            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', marginBottom: '1rem' }}>
                                📋 내 계좌 입금 충전 신청 이력 ({userRequests.length}건)
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {userRequests.map((req: any) => (
                                    <div key={req.requestId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                                        <div>
                                            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#111827' }}>
                                                {req.amount.toLocaleString()} VND (충전머니)
                                            </span>
                                            <span style={{ fontSize: '0.78rem', color: '#6b7280', marginLeft: '10px' }}>
                                                (입금자: {req.depositorName} | {new Date(req.createdAt).toLocaleDateString("ko-KR")})
                                            </span>
                                        </div>
                                        <div>
                                            {req.status === "PENDING" && (
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '99px' }}>
                                                    🟡 입금 확인 대기중
                                                </span>
                                            )}
                                            {req.status === "APPROVED" && (
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '99px' }}>
                                                    🟢 승인 완료 (머니 충전됨)
                                                </span>
                                            )}
                                            {req.status === "REJECTED" && (
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '99px' }}>
                                                    🔴 거절됨
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* 👥 추천인 & 멘티 관리 섹션 */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <div className={styles.sectionTitle}>
                        <Users size={20} color="#2563eb" /> 👥 추천인 & 멘티 시스템
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {/* 내 자동 추천 QR & 초대전용 링크 카드 */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <QrCode size={20} color="#C8392B" /> 내 자동 추천 QR 코드
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: '#4b5563', marginBottom: '1rem', lineHeight: '1.4' }}>
                                신규 가입자가 이 <strong>QR 코드를 스캔</strong>하거나 <strong>초대 링크</strong>로 들어와 가입하면 <strong style={{ color: '#C8392B' }}>자동으로 나의 멘티</strong>로 지정되며 <strong>500 DP / +2,000 EXP</strong>가 적립됩니다.
                            </p>
                            
                            {/* QR Code Display Box */}
                            <div style={{
                                background: '#fff',
                                padding: '10px',
                                borderRadius: '12px',
                                border: '2px dashed #F87171',
                                boxShadow: '0 4px 12px rgba(200, 57, 43, 0.08)',
                                marginBottom: '1rem'
                            }}>
                                <img
                                    src={qrCodeApiUrl}
                                    alt="대한김치 추천 QR 코드"
                                    style={{ width: '160px', height: '160px', display: 'block', borderRadius: '6px' }}
                                />
                            </div>

                            {/* Referral Link & Copy Buttons */}
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={referralLink} 
                                        style={{ 
                                            flex: 1, 
                                            background: '#f9fafb', 
                                            border: '1px solid #d1d5db', 
                                            borderRadius: '8px', 
                                            padding: '8px 10px', 
                                            fontSize: '0.82rem', 
                                            fontWeight: '600', 
                                            color: '#374151',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }} 
                                    />
                                    <button 
                                        onClick={copyReferralLink}
                                        style={{ 
                                            background: copiedLink ? '#16a34a' : '#C8392B', 
                                            color: '#fff', 
                                            border: 'none', 
                                            borderRadius: '8px', 
                                            padding: '8px 14px', 
                                            fontSize: '0.82rem', 
                                            fontWeight: 700, 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '4px',
                                            whiteSpace: 'nowrap',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                                        {copiedLink ? "링크 복사됨!" : "초대링크 복사"}
                                    </button>
                                </div>
                                <div style={{ fontSize: '0.76rem', color: '#6B7280', display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
                                    <span>내 추천 ID: <strong style={{ color: '#111827' }}>{userRefCode}</strong></span>
                                    <a
                                        href={qrCodeApiUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: '#C8392B', fontWeight: 600, textDecoration: 'underline' }}
                                    >
                                        QR 크게 보기 ↗
                                    </a>
                                </div>
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

                {/* 🎁 대한김치 포인트 & EXP 적립 안내 표 */}
                <section style={{ marginBottom: '2.5rem' }}>
                    <div className={styles.sectionTitle}>
                        <Gift size={20} color="#dc2626" /> 🎁 대한김치 로열티 & EXP 적립 혜택
                    </div>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {rewardRules.map((rule, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f9fafb', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                                    <div>{rule.icon}</div>
                                    <div>
                                        <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>{rule.action}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#111827', fontWeight: 800 }}>{rule.reward}</div>
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
                                    {order.shippingInfo && (order.shippingInfo.courier || order.shippingInfo.trackingNumber || order.shippingInfo.driverPhone) && (
                                        <div style={{
                                            margin: '0 16px 12px',
                                            padding: '12px 14px',
                                            background: 'rgba(22, 163, 74, 0.05)',
                                            border: '1px solid rgba(22, 163, 74, 0.2)',
                                            borderRadius: '10px',
                                            fontSize: '0.85rem'
                                        }}>
                                            <div style={{ fontWeight: 700, color: '#16a34a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Truck size={15} /> 베트남 현지 배송 정보 (Mã vận đơn)
                                            </div>
                                            {order.shippingInfo.courier && (
                                                <div style={{ color: '#374151', margin: '2px 0' }}>
                                                    배송 수단: <strong>{order.shippingInfo.courier}</strong>
                                                </div>
                                            )}
                                            {order.shippingInfo.trackingNumber && (
                                                <div style={{ color: '#374151', margin: '2px 0' }}>
                                                    송장 번호: <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{order.shippingInfo.trackingNumber}</code>
                                                </div>
                                            )}
                                            {order.shippingInfo.driverPhone && (
                                                <div style={{ color: '#374151', margin: '2px 0' }}>
                                                    기사/택배 연락처: <a href={`tel:${order.shippingInfo.driverPhone}`} style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 600 }}>{order.shippingInfo.driverPhone}</a>
                                                </div>
                                            )}
                                            {order.shippingInfo.deliveryMemo && (
                                                <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px' }}>
                                                    배송 메모: {order.shippingInfo.deliveryMemo}
                                                </div>
                                            )}
                                        </div>
                                    )}
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
