"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { useUserWallet } from "@/context/UserWalletContext";
import { Coins, Wallet, User, LogOut, ChevronDown, Sparkles, PlusCircle, ShieldAlert } from "lucide-react";

export default function Header() {
    const { user, wallet, isLoggedIn, isWalletConnected, login, loginWithGoogle, logout, connectWallet, faucetHex, isLoading } = useUserWallet();
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
            alert(`🎉 K-MOA 회원 계정(${res.user?.email})으로 로그인되었습니다!\n가입 기념 2,000 K-MOA 머니 및 10,000 포인트가 지급되었습니다.`);
        } else {
            alert(`로그인 실패: ${res.error}`);
        }
    };

    const handleFaucet = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const success = await faucetHex(500);
        if (success) {
            alert("🎉 500 K-MOA 충전머니가 성공적으로 지급되었습니다!");
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
                    <img src="/images/logo2.png" alt="대한김치" className={styles.logoImg} />
                </Link>

                <nav className={styles.nav}>
                    <Link href="/about" className={styles.navLink}>소개</Link>
                    <Link href="/service" className={styles.navLink}>서비스(웹진)</Link>
                    <Link href="/shop" className={styles.navLink}>쇼핑몰</Link>
                    <Link href="/mypage" className={styles.navLink}>지갑 & 마이페이지</Link>
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
                            {/* HEX Token Balance Chip */}
                            <div className={styles.hexChip} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <Coins size={16} className={styles.hexIcon} />
                                <span className={styles.hexAmount}>{wallet.hexTokenBalance.toLocaleString()} HEX</span>
                                <button 
                                    className={styles.miniFaucetBtn} 
                                    onClick={handleFaucet} 
                                    title="+500 HEX 테스트 토큰 충전"
                                    disabled={isLoading}
                                >
                                    <PlusCircle size={14} />
                                </button>
                            </div>

                            {/* User Profile & Wallet Trigger */}
                            <div className={styles.userTrigger} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <div className={styles.walletAddr}>
                                    <Wallet size={14} color="#00E676" />
                                    <span>{wallet.onChainWalletAddress.slice(0, 6)}...{wallet.onChainWalletAddress.slice(-4)}</span>
                                </div>
                                <span className={styles.userName}>{user.name.split(" ")[0]}</span>
                                <ChevronDown size={14} className={`${styles.chevron} ${dropdownOpen ? styles.open : ''}`} />
                            </div>

                            {/* Profile / Wallet Dropdown */}
                            {dropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownHeader}>
                                        <p className={styles.dropdownUserName}>{user.name}</p>
                                        <p className={styles.dropdownEmail}>{user.email}</p>
                                        <span className={`${styles.roleBadge} ${isSuperAdmin ? styles.superBadge : ''}`}>{user.role}</span>
                                    </div>

                                    <div className={styles.balancesBlock}>
                                        <div className={styles.balanceItem}>
                                            <span>🪙 K-MOA 머니:</span>
                                            <strong>{wallet.hexTokenBalance.toLocaleString()} 머니</strong>
                                        </div>
                                        <div className={styles.balanceItem}>
                                            <span>🎟️ K-MOA 포인트:</span>
                                            <strong>{wallet.kcaPoints.toLocaleString()} P</strong>
                                        </div>
                                        <div className={styles.balanceItem}>
                                            <span>💵 VND 잔액:</span>
                                            <strong>{wallet.vndBalance.toLocaleString()} ₫</strong>
                                        </div>
                                        <div className={styles.balanceItem}>
                                            <span>⭐ 대한포인트(DP):</span>
                                            <strong style={{ color: '#f7a400' }}>{wallet.dpPoints.toLocaleString()} DP</strong>
                                        </div>
                                    </div>

                                    <div className={styles.dropdownActions}>
                                        <button className={styles.faucetActionBtn} onClick={handleFaucet} disabled={isLoading}>
                                            <Sparkles size={14} /> +500 K-MOA 머니 무료 충전
                                        </button>
                                        <Link href="/mypage" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                                            <User size={15} /> K-MOA 머니 & 주문 내역 관리
                                        </Link>
                                        <Link href="/kmoa-guide" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)} style={{ color: '#fcd34d' }}>
                                            <Coins size={15} color="#fcd34d" /> K-MOA 가맹점 결제 가이드
                                        </Link>
                                        {isOperator && (
                                            <Link href="/admin" className={`${styles.dropdownLink} ${styles.adminDropdownLink}`} onClick={() => setDropdownOpen(false)}>
                                                <ShieldAlert size={15} color="#f7a400" /> 관리자 센터 & 운영자 관리
                                            </Link>
                                        )}
                                        <button className={styles.switchUserBtn} onClick={() => { setDropdownOpen(false); setLoginModalOpen(true); }}>
                                            계정 전환 (최고관리자/운영자/회원)
                                        </button>
                                        <button className={styles.logoutBtn} onClick={() => { logout(); setDropdownOpen(false); }}>
                                            <LogOut size={15} /> 로그아웃
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.unauthActions} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                K-MOA 회원 로그인
                            </button>
                            <button className="btn-primary" style={{ padding: '7px 16px', fontSize: '0.85rem' }} onClick={() => setLoginModalOpen(true)}>
                                <Wallet size={15} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                머니 & 로그인
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
                            K-MOA 회원 계정(Google)으로 바로 시작하거나, 테스트용 계정을 선택하세요.
                        </p>

                        {/* Google Social Login Primary Button */}
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
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    transition: 'background 0.2s, transform 0.15s'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span>K-MOA 회원으로 Google 계정 계속하기</span>
                            </button>

                            <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowEmailPrompt(!showEmailPrompt)}
                                    style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {showEmailPrompt ? "닫기" : "직접 Google 이메일 입력하여 로그인하기"}
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
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            color: '#fff',
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

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            color: '#6b7280',
                            fontSize: '0.75rem',
                            margin: '16px 0 12px'
                        }}>
                            <div style={{ flex: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>
                            <span style={{ padding: '0 10px' }}>또는 테스트 계정으로 체험</span>
                            <div style={{ flex: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>
                        </div>

                        <div className={styles.accountList}>
                            <button 
                                className={`${styles.accountOption} ${user?.uid === "admin_super_daehan" ? styles.selectedAccount : ''}`}
                                onClick={() => handleSwitchUser("admin_super_daehan")}
                            >
                                <div className={styles.accountAvatar}>👑</div>
                                <div className={styles.accountMeta}>
                                    <strong>최고 관리자 (Super Admin)</strong>
                                    <span>운영자 지정 권한 보유 • 95,000 머니</span>
                                    <code>회원계정: super.admin@daehankimchi.com</code>
                                </div>
                            </button>

                            <button 
                                className={`${styles.accountOption} ${user?.uid === "operator_hanoi_01" ? styles.selectedAccount : ''}`}
                                onClick={() => handleSwitchUser("operator_hanoi_01")}
                            >
                                <div className={styles.accountAvatar}>🛡️</div>
                                <div className={styles.accountMeta}>
                                    <strong>김하노이 (쇼핑몰 운영자)</strong>
                                    <span>주문 및 배송 관리 권한 • 12,500 머니</span>
                                    <code>회원계정: op.hanoi@daehankimchi.com</code>
                                </div>
                            </button>

                            <button 
                                className={`${styles.accountOption} ${user?.uid === "user_daehan_vip01" ? styles.selectedAccount : ''}`}
                                onClick={() => handleSwitchUser("user_daehan_vip01")}
                            >
                                <div className={styles.accountAvatar}>⭐</div>
                                <div className={styles.accountMeta}>
                                    <strong>최민준 (VIP 회원)</strong>
                                    <span>2,500 머니 • 15,000 P • 1,200,000 VND</span>
                                    <code>회원코드: KM-2026-VIP01</code>
                                </div>
                            </button>

                            <button 
                                className={`${styles.accountOption} ${user?.uid === "user_hanoi_kca02" ? styles.selectedAccount : ''}`}
                                onClick={() => handleSwitchUser("user_hanoi_kca02")}
                            >
                                <div className={styles.accountAvatar}>🇻🇳</div>
                                <div className={styles.accountMeta}>
                                    <strong>응우옌 티 마이 (Nguyen Thi Mai)</strong>
                                    <span>1,200 머니 • 8,400 P • 650,000 VND</span>
                                    <code>회원코드: KM-2026-HN02</code>
                                </div>
                            </button>

                            <button 
                                className={`${styles.accountOption} ${user?.uid === "guest_user_demo" ? styles.selectedAccount : ''}`}
                                onClick={() => handleSwitchUser("guest_user_demo")}
                            >
                                <div className={styles.accountAvatar}>🌿</div>
                                <div className={styles.accountMeta}>
                                    <strong>대한김치 체험 회원</strong>
                                    <span>800 머니 • 5,000 P • 300,000 VND</span>
                                    <code>회원코드: KM-2026-GUEST</code>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
