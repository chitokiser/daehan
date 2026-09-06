"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { useUserWallet } from "@/context/UserWalletContext";
import { User, LogOut, ChevronDown, ShieldAlert, Wallet } from "lucide-react";

export default function Header() {
    const { user, wallet, isLoggedIn, login, loginWithGoogle, logout, isLoading } = useUserWallet();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [googleEmailInput, setGoogleEmailInput] = useState("");
    const [showEmailPrompt, setShowEmailPrompt] = useState(false);

    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const isOperator = user?.role === "OPERATOR" || isSuperAdmin;

    const handleGoogleLogin = async (customEmail?: string) => {
        const emailToUse = customEmail || googleEmailInput.trim() || undefined;
        const res = await loginWithGoogle(emailToUse);
        if (res.success) {
            setLoginModalOpen(false);
            setDropdownOpen(false);
            alert(`🎉 대한김치 회원(${res.user?.email})으로 로그인되었습니다!\n가입 기념 2,000 포인트 및 10,000 적립금이 지급되었습니다.`);
        } else {
            alert(`로그인 실패: ${res.error}`);
        }
    };

    const handleSwitchUser = async (uid: string) => {
        await login(uid);
        setLoginModalOpen(false);
        setDropdownOpen(false);
    };

    return (
        <>
            <header className={styles.header}>
                <Link href="/" className={styles.logoLink}>
                    <img
                        src="/images/logo1.png"
                        alt="대한김치"
                        className={styles.logoImg}
                    />
                </Link>

                <nav className={styles.nav}>
                    <Link href="/about" className={styles.navLink}>소개</Link>
                    <Link href="/service" className={styles.navLink}>서비스(웹진)</Link>
                    <Link href="/shop" className={styles.navLink}>쇼핑몰</Link>
                    <Link href="/mypage" className={styles.navLink}>마이페이지</Link>
                    {isOperator && (
                        <Link href="/admin" className={`${styles.navLink} ${styles.adminNavLink}`}>
                            <ShieldAlert size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            관리자 모드
                        </Link>
                    )}
                </nav>

                <div className={styles.authAction}>
                    {isLoggedIn && user ? (
                        <div className={styles.walletBar}>
                            {/* User Profile Trigger */}
                            <div className={styles.userTrigger} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <span className={styles.userName}>{user.name.split(" ")[0]}</span>
                                <ChevronDown size={14} className={`${styles.chevron} ${dropdownOpen ? styles.open : ''}`} />
                            </div>

                            {/* Profile Dropdown */}
                            {dropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownHeader}>
                                        <p className={styles.dropdownUserName}>{user.name}</p>
                                        <p className={styles.dropdownEmail}>{user.email}</p>
                                        <span className={`${styles.roleBadge} ${isSuperAdmin ? styles.superBadge : ''}`}>{user.role}</span>
                                    </div>

                                    <div className={styles.balancesBlock}>
                                        <div className={styles.balanceItem}>
                                            <span>🎟️ 적립 포인트:</span>
                                            <strong>{wallet.points.toLocaleString()} P</strong>
                                        </div>
                                        <div className={styles.balanceItem}>
                                            <span>💵 VND 잔액:</span>
                                            <strong>{wallet.vndBalance.toLocaleString()} ₫</strong>
                                        </div>
                                        <div className={styles.balanceItem}>
                                            <span>⭐ 대한포인트(DP):</span>
                                            <strong style={{ color: '#D4870A' }}>{wallet.dpPoints.toLocaleString()} DP</strong>
                                        </div>
                                    </div>

                                    <div className={styles.dropdownActions}>
                                        <Link href="/mypage" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                                            <User size={15} /> 주문 내역 & 포인트
                                        </Link>
                                        {isOperator && (
                                            <Link href="/admin" className={`${styles.dropdownLink} ${styles.adminDropdownLink}`} onClick={() => setDropdownOpen(false)}>
                                                <ShieldAlert size={15} /> 관리자 센터
                                            </Link>
                                        )}
                                        <button className={styles.switchUserBtn} onClick={() => { setDropdownOpen(false); setLoginModalOpen(true); }}>
                                            계정 전환
                                        </button>
                                        <button className={styles.logoutBtn} onClick={() => { logout(); setDropdownOpen(false); }}>
                                            <LogOut size={15} /> 로그아웃
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                onClick={() => handleGoogleLogin()}
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
                                로그인
                            </button>
                            <button className="btn-primary" style={{ padding: '7px 16px', fontSize: '0.85rem' }} onClick={() => setLoginModalOpen(true)}>
                                <Wallet size={15} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                계정 전환
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Login / User Switch Modal */}
            {loginModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setLoginModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>로그인 & 계정 전환</h3>
                            <button className={styles.modalClose} onClick={() => setLoginModalOpen(false)}>✕</button>
                        </div>
                        <p className={styles.modalDesc}>
                            Google 계정으로 로그인하거나, 테스트용 계정을 선택하세요.
                        </p>

                        {/* Google Social Login */}
                        <div style={{ marginBottom: '20px' }}>
                            <button
                                type="button"
                                onClick={() => handleGoogleLogin()}
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    background: '#ffffff',
                                    color: '#3c4043',
                                    border: '1px solid #dadce0',
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    fontSize: '0.98rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
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

                            <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowEmailPrompt(!showEmailPrompt)}
                                    style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {showEmailPrompt ? "닫기" : "직접 이메일 입력하여 로그인"}
                                </button>
                            </div>

                            {showEmailPrompt && (
                                <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                                    <input
                                        type="email"
                                        placeholder="yourname@gmail.com"
                                        value={googleEmailInput}
                                        onChange={(e) => setGoogleEmailInput(e.target.value)}
                                        style={{
                                            flex: 1,
                                            background: '#fff',
                                            border: '1.5px solid rgba(0,0,0,0.15)',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            color: '#1A0D08',
                                            fontSize: '0.88rem'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                        onClick={() => handleGoogleLogin()}
                                    >
                                        로그인
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', margin: '16px 0 12px' }}>
                            <div style={{ flex: 1, borderBottom: '1px solid rgba(0,0,0,0.10)' }}></div>
                            <span style={{ padding: '0 10px' }}>또는 테스트 계정으로 체험</span>
                            <div style={{ flex: 1, borderBottom: '1px solid rgba(0,0,0,0.10)' }}></div>
                        </div>

                        <div className={styles.accountList}>
                            {[
                                { uid: "admin_super_daehan", emoji: "👑", name: "최고 관리자 (Super Admin)", desc: "운영자 지정 권한 보유", email: "super.admin@daehankimchi.com" },
                                { uid: "operator_hanoi_01", emoji: "🛡️", name: "김하노이 (쇼핑몰 운영자)", desc: "주문 및 배송 관리 권한", email: "op.hanoi@daehankimchi.com" },
                                { uid: "user_daehan_vip01", emoji: "⭐", name: "최민준 (VIP 회원)", desc: "VIP_MEMBER", email: "min.jun@gmail.com" },
                                { uid: "user_hanoi_kca02", emoji: "🇻🇳", name: "응우옌 티 마이", desc: "MEMBER", email: "nguyen.mai@gmail.com" },
                                { uid: "guest_user_demo", emoji: "🌿", name: "대한김치 체험 회원", desc: "MEMBER (게스트)", email: "demo@daehankimchi.com" },
                            ].map(acc => (
                                <button
                                    key={acc.uid}
                                    className={`${styles.accountOption} ${user?.uid === acc.uid ? styles.selectedAccount : ''}`}
                                    onClick={() => handleSwitchUser(acc.uid)}
                                >
                                    <div className={styles.accountAvatar}>{acc.emoji}</div>
                                    <div className={styles.accountMeta}>
                                        <strong>{acc.name}</strong>
                                        <span>{acc.desc}</span>
                                        <code>{acc.email}</code>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
