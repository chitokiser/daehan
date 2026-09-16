"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { useUserWallet } from "@/context/UserWalletContext";
import { useLanguage } from "@/context/LanguageContext";
import { User, LogOut, ChevronDown, ShieldAlert, Wallet, Menu, X, Globe } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

export default function Header() {
    const { user, wallet, isLoggedIn, login, loginWithGoogle, logout, isLoading, isLoginModalOpen, openLoginModal, closeLoginModal } = useUserWallet();
    const { lang, setLang, t } = useLanguage();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [googleEmailInput, setGoogleEmailInput] = useState("");
    const [showEmailPrompt, setShowEmailPrompt] = useState(false);
    const [referrerPromptOpen, setReferrerPromptOpen] = useState(false);
    const [referrerInput, setReferrerInput] = useState("");
    const [pendingUserInfo, setPendingUserInfo] = useState<{email: string; name: string; avatar?: string} | null>(null);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);

    // URL ?ref= 또는 ?referrer= 파라미터 감지 및 localStorage 자동 저장
    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get("ref") || urlParams.get("referrer");
            if (refCode) {
                localStorage.setItem("daehan_ref_code", refCode);
                setReferrerInput(refCode);
            } else {
                const savedRef = localStorage.getItem("daehan_ref_code");
                if (savedRef) {
                    setReferrerInput(savedRef);
                }
            }
        }
    }, []);

    const handleAgreeAll = (checked: boolean) => {
        setAgreeTerms(checked);
        setAgreePrivacy(checked);
    };

    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const isOperator = user?.role === "OPERATOR" || isSuperAdmin;

    const closeAllAccountModals = useCallback(() => {
        closeLoginModal();
        setReferrerPromptOpen(false);
        setShowEmailPrompt(false);
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        setPendingUserInfo(null);
    }, [closeLoginModal]);

    const handleRealGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await res.json();
                
                if (userInfo.email) {
                    const loginRes = await loginWithGoogle(userInfo.email, userInfo.name, undefined, userInfo.picture);
                    if (loginRes.success) {
                        closeAllAccountModals();
                        alert(`🎉 대한김치 회원(${loginRes.user?.email})으로 로그인되었습니다!`);
                    } else if (loginRes.error === "NEW_USER_TERMS_REQUIRED" || loginRes.error?.includes("추천인") || loginRes.error?.includes("멘토")) {
                        setPendingUserInfo({ email: userInfo.email, name: userInfo.name || "Google 회원", avatar: userInfo.picture });
                        closeLoginModal();
                        setReferrerPromptOpen(true);
                    } else {
                        alert(`로그인 실패: ${loginRes.error}`);
                    }
                }
            } catch (err) {
                console.error("Google Auth Error:", err);
                alert("구글 로그인 처리 중 오류가 발생했습니다. 아래 이메일 직접 입력을 통해 로그인해보세요.");
            }
        },
        onError: errorResponse => {
            console.error("Google Auth Error:", errorResponse);
            alert("구글 팝업 로그인에 실패하였거나 취소되었습니다. 모달 하단의 이메일 직접 입력을 이용해주세요.");
        }
    });

    const handleEmailLogin = async (customEmail?: string) => {
        let emailToUse = customEmail || googleEmailInput.trim();
        if (!emailToUse) {
            alert("이메일을 입력해주세요.");
            return;
        }

        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(emailToUse)}&background=E31837&color=ffffff&bold=true`;
        const res = await loginWithGoogle(emailToUse, undefined, undefined, avatarUrl);
        if (res.success) {
            closeAllAccountModals();
            alert(`🎉 대한김치 회원(${res.user?.email})으로 로그인되었습니다!`);
        } else if (res.error === "NEW_USER_TERMS_REQUIRED" || res.error?.includes("추천인") || res.error?.includes("멘토")) {
            setPendingUserInfo({ email: emailToUse, name: "회원", avatar: avatarUrl });
            closeLoginModal();
            setReferrerPromptOpen(true);
        } else {
            alert(`로그인 실패: ${res.error}`);
        }
    };

    const submitReferrer = async () => {
        const finalReferrer = referrerInput.trim() || "daguri75@gmail.com";
        if (!agreeTerms || !agreePrivacy) {
            alert("이용약관 및 개인정보 처리방침에 모두 동의해 주세요 (필수).");
            return;
        }
        if (!pendingUserInfo) {
            alert("회원 정보가 없습니다. 다시 로그인해 주세요.");
            setReferrerPromptOpen(false);
            return;
        }
        // 약관 동의(termsAgreed = true) 파라미터 전달하여 회원 가입 승인
        const loginRes = await loginWithGoogle(pendingUserInfo.email, pendingUserInfo.name, finalReferrer, pendingUserInfo.avatar, true);
        if (loginRes.success) {
            setReferrerPromptOpen(false);
            setPendingUserInfo(null);
            setReferrerInput("");
            setAgreeTerms(false);
            setAgreePrivacy(false);
            setDropdownOpen(false);
            setMobileMenuOpen(false);
            alert(`🎉 대한김치 회원 가입 완료! 멘토 [${finalReferrer}]님의 멘티로 등록되었습니다.`);
        } else {
            alert(`회원가입 실패: ${loginRes.error}`);
        }
    };

    const handleSwitchUser = async (uid: string) => {
        await login(uid);
        closeAllAccountModals();
    };

    const navLinks = [
        { href: "/about", label: t("nav.about", "소개") },
        { href: "/service", label: t("nav.service", "서비스(웹진)") },
        { href: "/shop", label: t("nav.shop", "쇼핑몰") },
        { href: "/subscribe", label: t("nav.subscribe", "정기구독") },
        { href: "/mypage", label: t("nav.mypage", "마이페이지") }
    ];

    return (
        <>
            <header className={styles.header}>
                <Link href="/" className={styles.logoLink} onClick={() => setMobileMenuOpen(false)}>
                    <img 
                        src="/images/logo2.png" 
                        alt="대한김치" 
                        className={styles.logoImg}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.dataset.failedOnce) {
                                target.dataset.failedOnce = "true";
                                target.src = "/images/logo1.png";
                            }
                        }}
                    />
                </Link>

                <nav className={styles.nav}>
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className={styles.navLink}>{link.label}</Link>
                    ))}
                    {isOperator && (
                        <Link href="/admin" className={`${styles.navLink} ${styles.adminNavLink}`} onClick={closeAllAccountModals}>
                            <ShieldAlert size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            {t("nav.admin", "관리자 센터")}
                        </Link>
                    )}
                </nav>

                <div className={styles.authAction} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Language Switcher Button Group */}
                    <div className={`${styles.langSwitchGroup} ${styles.desktopLangSwitch}`}>
                        <button 
                            type="button"
                            className={`${styles.langOptionBtn} ${lang === 'ko' ? styles.langOptionActive : ''}`}
                            onClick={() => setLang('ko')}
                            title="한국어"
                        >
                            <span className={styles.langFlag}>🇰🇷</span> KO
                        </button>
                        <button 
                            type="button"
                            className={`${styles.langOptionBtn} ${lang === 'vi' ? styles.langOptionActive : ''}`}
                            onClick={() => setLang('vi')}
                            title="Tiếng Việt"
                        >
                            <span className={styles.langFlag}>🇻🇳</span> VI
                        </button>
                    </div>

                    {isLoggedIn && user ? (
                        <div className={styles.walletBar}>
                            {/* User Profile Trigger */}
                            <div className={styles.userTrigger} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <img 
                                    src={user.avatar && !user.avatar.includes("unavatar.io") ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "회원")}&background=E31837&color=ffffff&bold=true`} 
                                    alt={user.name} 
                                    className={styles.headerAvatar} 
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "회원")}&background=E31837&color=ffffff&bold=true`;
                                    }}
                                />
                                <span className={styles.userName}>{user.name.split(" ")[0]}</span>
                                <ChevronDown size={14} className={`${styles.chevron} ${dropdownOpen ? styles.open : ''}`} />
                            </div>

                            {/* Profile Dropdown */}
                            {dropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownHeader}>
                                        <img 
                                            src={user.avatar && !user.avatar.includes("unavatar.io") ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "회원")}&background=E31837&color=ffffff&bold=true`} 
                                            alt={user.name} 
                                            className={styles.dropdownAvatar} 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "회원")}&background=E31837&color=ffffff&bold=true`;
                                            }}
                                        />
                                        <div>
                                            <p className={styles.dropdownUserName}>{user.name}</p>
                                            <p className={styles.dropdownEmail}>{user.email}</p>
                                            <span className={`${styles.roleBadge} ${isSuperAdmin ? styles.superBadge : ''}`}>{user.role}</span>
                                        </div>
                                    </div>

                                    <div className={styles.balancesBlock}>
                                        <div className={styles.walletBalanceBadge}>
                                            <span>💳 {t("header.chargedMoney", "충전머니")}:</span>
                                            <strong>{wallet.moneyBalance?.toLocaleString() || 0} 머니</strong>
                                        </div>
                                        <div className={styles.balanceItem}>
                                            <span>🎟️ {t("header.points", "적립 포인트")}:</span>
                                            <strong>{wallet.points.toLocaleString()} P</strong>
                                        </div>
                                        <div className={styles.balanceItem}>
                                            <span>💵 {t("header.vndBalance", "VND 잔액")}:</span>
                                            <strong>{wallet.vndBalance.toLocaleString()} ₫</strong>
                                        </div>
                                        <div className={styles.balanceItem}>
                                            <span>⭐ {t("header.dpPoints", "대한포인트(DP)")}:</span>
                                            <strong style={{ color: '#D4870A' }}>{wallet.dpPoints.toLocaleString()} DP</strong>
                                        </div>
                                    </div>

                                    <div className={styles.dropdownActions}>
                                        <Link href="/mypage" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                                            <User size={15} /> {t("header.ordersAndPoints", "주문 내역 & 포인트")}
                                        </Link>
                                        {isOperator && (
                                            <Link href="/admin" className={`${styles.dropdownLink} ${styles.adminDropdownLink}`} onClick={closeAllAccountModals}>
                                                <ShieldAlert size={15} /> {t("nav.admin", "관리자 센터")}
                                            </Link>
                                        )}
                                        <button className={styles.switchUserBtn} onClick={() => { setDropdownOpen(false); openLoginModal(); }}>
                                            {t("header.switchAccount", "다른 계정 로그인")}
                                        </button>
                                        <button className={styles.logoutBtn} onClick={() => { logout(); closeAllAccountModals(); }}>
                                            <LogOut size={15} /> {t("nav.logout", "로그아웃")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={openLoginModal}
                                disabled={isLoading}
                                style={{
                                    background: '#ffffff',
                                    color: '#3c4043',
                                    border: '1px solid #dadce0',
                                    borderRadius: '20px',
                                    padding: '6px 14px',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span className={styles.hideOnMobile}>{t("nav.login", "구글 회원가입 / 로그인")}</span>
                                <span className={styles.showOnMobile}>{t("nav.loginMobile", "로그인")}</span>
                            </button>
                        </div>
                    )}
                    
                    <button className={styles.mobileMenuBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            {mobileMenuOpen && (
                <div className={styles.mobileNavOverlay}>
                    {/* Mobile Language Switcher */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-sub)' }}>🌐 언어 선택 / Ngôn ngữ:</span>
                        <div className={styles.langSwitchGroup}>
                            <button 
                                type="button"
                                className={`${styles.langOptionBtn} ${lang === 'ko' ? styles.langOptionActive : ''}`}
                                onClick={() => setLang('ko')}
                            >
                                <span className={styles.langFlag}>🇰🇷</span> 한국어
                            </button>
                            <button 
                                type="button"
                                className={`${styles.langOptionBtn} ${lang === 'vi' ? styles.langOptionActive : ''}`}
                                onClick={() => setLang('vi')}
                            >
                                <span className={styles.langFlag}>🇻🇳</span> Tiếng Việt
                            </button>
                        </div>
                    </div>

                    {navLinks.map(link => (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            className={styles.mobileNavLink}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isOperator && (
                        <Link 
                            href="/admin" 
                            className={`${styles.mobileNavLink} ${styles.adminNavLink}`}
                            onClick={closeAllAccountModals}
                        >
                            <ShieldAlert size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            {t("nav.admin", "관리자 센터")}
                        </Link>
                    )}
                </div>
            )}

            {/* Login / User Switch Modal */}
            {isLoginModalOpen && (
                <div className={styles.modalOverlay} onClick={closeAllAccountModals}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>로그인 & 계정 선택</h3>
                            <button className={styles.modalClose} onClick={closeAllAccountModals}>✕</button>
                        </div>
                        {isOperator && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.84rem', color: '#991b1b', fontWeight: 700 }}>
                                    🛡️ 관리자({user?.email}) 권한으로 로그인되어 있습니다.
                                </span>
                            </div>
                        )}
                        <p className={styles.modalDesc}>
                            이메일 주소를 입력하거나 Google 계정으로 계속하세요.
                        </p>

                        {/* Direct Email Login Form */}
                        <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                                ✉️ 이메일로 간편 로그인 / 회원가입
                            </label>
                            <form onSubmit={(e) => { e.preventDefault(); handleEmailLogin(); }} style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="email"
                                    placeholder="예: daguri75@gmail.com"
                                    value={googleEmailInput}
                                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                                    style={{
                                        flex: 1,
                                        background: '#fff',
                                        border: '1.5px solid #cbd5e1',
                                        borderRadius: '8px',
                                        padding: '10px 14px',
                                        color: '#1e293b',
                                        fontSize: '0.92rem',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "처리중..." : "로그인"}
                                </button>
                            </form>
                            <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>빠른 테스트:</span>
                                <button
                                    type="button"
                                    onClick={() => handleEmailLogin("daguri75@gmail.com")}
                                    style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '12px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    👑 대표자 (daguri75)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleEmailLogin("hansguy001@gmail.com")}
                                    style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', borderRadius: '12px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    ⭐ VIP (hansguy)
                                </button>
                            </div>
                        </div>

                        {/* Google Social Login */}
                        <div style={{ marginBottom: '12px' }}>
                            <button
                                type="button"
                                onClick={() => handleRealGoogleLogin()}
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    background: '#ffffff',
                                    color: '#3c4043',
                                    border: '1px solid #dadce0',
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    fontSize: '0.92rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span>Google 계정으로 계속하기</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Referrer & Terms Agreement Prompt Modal */}
            {referrerPromptOpen && (
                <div className={styles.modalOverlay} style={{ zIndex: 1100 }}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
                        <div className={styles.modalHeader}>
                            <h3>회원가입 & 약관 동의 (필수)</h3>
                        </div>
                        <p className={styles.modalDesc} style={{ color: '#4A5568', fontSize: '0.86rem', lineHeight: '1.5' }}>
                            대한김치 생태계는 추천인 제도로 운영됩니다.<br className={styles.desktopBr} />
                            QR 코드를 스캔하셨거나 초대 링크를 통해 가입 시 멘토가 자동 설정됩니다.
                        </p>
                        {referrerInput && (
                            <div style={{ background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: '6px', padding: '6px 10px', fontSize: '0.78rem', color: '#1E40AF', fontWeight: 600, marginTop: '8px' }}>
                                📱 QR 스캔/초대 링크로 멘토 (<strong>{referrerInput}</strong>) 님이 자동 지정되었습니다!
                            </div>
                        )}
                        <div style={{ marginTop: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-sub)' }}>
                                    👤 추천인(멘토) 이메일 또는 UID 코드:
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setReferrerInput("daguri75@gmail.com")}
                                    style={{
                                        background: '#FDF2F2',
                                        color: '#C8392B',
                                        border: '1px solid #F87171',
                                        borderRadius: '4px',
                                        padding: '3px 8px',
                                        fontSize: '0.76rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    ⚡ 자동 추천 (daguri75@gmail.com)
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="추천인 이메일 입력 (미입력 시 daguri75@gmail.com 자동지정)"
                                value={referrerInput}
                                onChange={(e) => setReferrerInput(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: '#fff',
                                    border: '1.5px solid rgba(0,0,0,0.15)',
                                    borderRadius: '6px',
                                    padding: '10px 12px',
                                    color: '#1A0D08',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>

                            {/* 약관 동의 체크박스 섹션 */}
                            <div style={{
                                background: '#FAFAF8',
                                border: '1px solid rgba(0,0,0,0.1)',
                                borderRadius: '8px',
                                padding: '12px 14px',
                                marginTop: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '8px', color: 'var(--text-main)' }}>
                                    <input
                                        type="checkbox"
                                        checked={agreeTerms && agreePrivacy}
                                        onChange={(e) => handleAgreeAll(e.target.checked)}
                                        style={{ width: '16px', height: '16px', accentColor: '#C8392B', cursor: 'pointer' }}
                                    />
                                    <span>모든 약관에 전체 동의합니다</span>
                                </label>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#333' }}>
                                        <input
                                            type="checkbox"
                                            checked={agreeTerms}
                                            onChange={(e) => setAgreeTerms(e.target.checked)}
                                            style={{ width: '15px', height: '15px', accentColor: '#C8392B', cursor: 'pointer' }}
                                        />
                                        <span><strong style={{ color: '#C8392B' }}>[필수]</strong> 이용약관 동의</span>
                                    </label>
                                    <a 
                                        href="/terms" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        style={{ color: '#6B4C38', fontSize: '0.78rem', textDecoration: 'underline', fontWeight: 600 }}
                                    >
                                        약관보기 ↗
                                    </a>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#333' }}>
                                        <input
                                            type="checkbox"
                                            checked={agreePrivacy}
                                            onChange={(e) => setAgreePrivacy(e.target.checked)}
                                            style={{ width: '15px', height: '15px', accentColor: '#C8392B', cursor: 'pointer' }}
                                        />
                                        <span><strong style={{ color: '#C8392B' }}>[필수]</strong> 개인정보 처리방침 동의</span>
                                    </label>
                                    <a 
                                        href="/privacy" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        style={{ color: '#6B4C38', fontSize: '0.78rem', textDecoration: 'underline', fontWeight: 600 }}
                                    >
                                        약관보기 ↗
                                    </a>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                <button
                                    className="btn-primary"
                                    onClick={submitReferrer}
                                    disabled={!agreeTerms || !agreePrivacy}
                                    style={{
                                        flex: 1,
                                        padding: '11px',
                                        fontWeight: 700,
                                        opacity: (!agreeTerms || !agreePrivacy) ? 0.5 : 1,
                                        cursor: (!agreeTerms || !agreePrivacy) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    확인 및 회원가입
                                </button>
                                <button
                                    style={{
                                        flex: 1, padding: '11px', background: '#e5e7eb',
                                        color: '#374151', border: 'none', borderRadius: '6px', fontWeight: 'bold'
                                    }}
                                    onClick={() => {
                                        setReferrerPromptOpen(false);
                                        setPendingUserInfo(null);
                                        setAgreeTerms(false);
                                        setAgreePrivacy(false);
                                    }}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
            )}
        </>
    );
}
