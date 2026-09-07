"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { useUserWallet } from "@/context/UserWalletContext";
import { User, LogOut, ChevronDown, ShieldAlert, Wallet } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

export default function Header() {
    const { user, wallet, isLoggedIn, login, loginWithGoogle, logout, isLoading } = useUserWallet();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [googleEmailInput, setGoogleEmailInput] = useState("");
    const [showEmailPrompt, setShowEmailPrompt] = useState(false);
    const [referrerPromptOpen, setReferrerPromptOpen] = useState(false);
    const [referrerInput, setReferrerInput] = useState("");
    const [pendingUserInfo, setPendingUserInfo] = useState<{email: string; name: string} | null>(null);

    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const isOperator = user?.role === "OPERATOR" || isSuperAdmin;

    const handleRealGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await res.json();
                
                if (userInfo.email) {
                    const loginRes = await loginWithGoogle(userInfo.email, userInfo.name);
                    if (loginRes.success) {
                        setLoginModalOpen(false);
                        setDropdownOpen(false);
                        alert(`🎉 대한김치 회원(${loginRes.user?.email})으로 로그인되었습니다!`);
                    } else {
                        alert(`로그인 실패: ${loginRes.error}`);
                    }
                }
            } catch (err) {
                console.error("Google Auth Error:", err);
                alert("구글 로그인 처리 중 오류가 발생했습니다.");
            }
        },
        onError: errorResponse => {
            console.error("Google Auth Error:", errorResponse);
            if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === undefined) {
                alert("Google Client ID가 설정되지 않았습니다. .env 파일에 NEXT_PUBLIC_GOOGLE_CLIENT_ID를 등록해주세요.");
            } else {
                alert("구글 로그인에 실패했습니다.");
            }
        }
    });

    const handleEmailLogin = async (customEmail?: string) => {
        let emailToUse = customEmail || googleEmailInput.trim();
        if (!emailToUse) {
            alert("이메일을 입력해주세요.");
            return;
        }

        const res = await loginWithGoogle(emailToUse);
        if (res.success) {
            setLoginModalOpen(false);
            setDropdownOpen(false);
            alert(`🎉 대한김치 회원(${res.user?.email})으로 로그인되었습니다!`);
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
                                        <div className={styles.walletBalanceBadge}>
                                            <span>💳 충전머니:</span>
                                            <strong>{wallet.hexBalance?.toLocaleString() || 0} 머니</strong>
                                        </div>
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
                                            다른 계정 로그인
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
                                onClick={() => setLoginModalOpen(true)}
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
                        </div>
                    )}
                </div>
            </header>

            {/* Login / User Switch Modal */}
            {loginModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setLoginModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>로그인</h3>
                            <button className={styles.modalClose} onClick={() => setLoginModalOpen(false)}>✕</button>
                        </div>
                        <p className={styles.modalDesc}>
                            Google 계정 또는 이메일로 로그인하세요.
                        </p>

                        {/* Google Social Login */}
                        <div style={{ marginBottom: '20px' }}>
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
                                        onClick={() => handleEmailLogin()}
                                    >
                                        로그인
                                    </button>
                                </div>
                            )}
                        </div>


                    </div>
                </div>
            )}

            {/* Referrer Prompt Modal */}
            {referrerPromptOpen && (
                <div className={styles.modalOverlay} style={{ zIndex: 1100 }}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>추천인 코드 입력 (필수)</h3>
                        </div>
                        <p className={styles.modalDesc} style={{ color: '#E53E3E', fontWeight: 'bold' }}>
                            대한김치 생태계는 추천인 제도로 운영됩니다.<br/>
                            가입을 완료하려면 추천인(멘토)의 UID 코드를 입력해주세요.
                        </p>
                        <div style={{ marginTop: '15px' }}>
                            <input
                                type="text"
                                placeholder="추천인 UID 코드 입력"
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
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button
                                    className="btn-primary"
                                    onClick={submitReferrer}
                                    style={{ flex: 1, padding: '10px' }}
                                >
                                    확인 및 가입
                                </button>
                                <button
                                    style={{
                                        flex: 1, padding: '10px', background: '#e5e7eb',
                                        color: '#374151', border: 'none', borderRadius: '6px', fontWeight: 'bold'
                                    }}
                                    onClick={() => { setReferrerPromptOpen(false); setPendingUserInfo(null); }}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
