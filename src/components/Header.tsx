"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { useUserWallet } from "@/context/UserWalletContext";
import { Coins, Wallet, User, LogOut, ChevronDown, Sparkles, PlusCircle, ShieldAlert } from "lucide-react";

export default function Header() {
    const { user, wallet, isLoggedIn, isWalletConnected, login, logout, connectWallet, faucetHex, isLoading } = useUserWallet();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const isOperator = user?.role === "OPERATOR" || isSuperAdmin;

    const handleFaucet = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const success = await faucetHex(500);
        if (success) {
            alert("🎉 500 HEX 토큰이 성공적으로 지갑에 지급되었습니다!");
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
                    <Link href="/shop" className={styles.navLink}>쇼핑몰 (HEX결제)</Link>
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
                                            <span>🪙 HEX 토큰:</span>
                                            <strong>{wallet.hexTokenBalance.toLocaleString()} HEX</strong>
                                        </div>
                                        <div className={styles.balanceItem}>
                                            <span>🎟️ KCA 포인트:</span>
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
                                            <Sparkles size={14} /> +500 HEX 토큰 무료 충전
                                        </button>
                                        <Link href="/mypage" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>
                                            <User size={15} /> 지갑 & 주문 내역 관리
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
                        <div className={styles.unauthActions}>
                            <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem' }} onClick={() => setLoginModalOpen(true)}>
                                <Wallet size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                지갑 연결 & 로그인
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
                            <h3>KCA 회원 DB & 계정 전환</h3>
                            <button className={styles.modalClose} onClick={() => setLoginModalOpen(false)}>✕</button>
                        </div>
                        <p className={styles.modalDesc}>
                            최고 관리자, 쇼핑몰 운영자 또는 일반 VIP 회원을 선택하여 로그인할 수 있습니다.
                        </p>

                        <div className={styles.accountList}>
                            <button 
                                className={`${styles.accountOption} ${user?.uid === "admin_super_daehan" ? styles.selectedAccount : ''}`}
                                onClick={() => handleSwitchUser("admin_super_daehan")}
                            >
                                <div className={styles.accountAvatar}>👑</div>
                                <div className={styles.accountMeta}>
                                    <strong>최고 관리자 (Super Admin)</strong>
                                    <span>운영자 지정 권한 보유 • 95,000 HEX</span>
                                    <code>0xa485...bdb40 (컨트랙트 배포자)</code>
                                </div>
                            </button>

                            <button 
                                className={`${styles.accountOption} ${user?.uid === "operator_hanoi_01" ? styles.selectedAccount : ''}`}
                                onClick={() => handleSwitchUser("operator_hanoi_01")}
                            >
                                <div className={styles.accountAvatar}>🛡️</div>
                                <div className={styles.accountMeta}>
                                    <strong>김하노이 (쇼핑몰 운영자)</strong>
                                    <span>주문 및 배송 관리 권한 • 12,500 HEX</span>
                                    <code>0x89C1...ef12</code>
                                </div>
                            </button>

                            <button 
                                className={`${styles.accountOption} ${user?.uid === "user_daehan_vip01" ? styles.selectedAccount : ''}`}
                                onClick={() => handleSwitchUser("user_daehan_vip01")}
                            >
                                <div className={styles.accountAvatar}>⭐</div>
                                <div className={styles.accountMeta}>
                                    <strong>최민준 (VIP 회원)</strong>
                                    <span>2,500 HEX • 15,000 P • 1,200,000 VND</span>
                                    <code>0x71C3...3B29</code>
                                </div>
                            </button>

                            <button 
                                className={`${styles.accountOption} ${user?.uid === "user_hanoi_kca02" ? styles.selectedAccount : ''}`}
                                onClick={() => handleSwitchUser("user_hanoi_kca02")}
                            >
                                <div className={styles.accountAvatar}>🇻🇳</div>
                                <div className={styles.accountMeta}>
                                    <strong>응우옌 티 마이 (Nguyen Thi Mai)</strong>
                                    <span>1,200 HEX • 8,400 P • 650,000 VND</span>
                                    <code>0xa485...db40</code>
                                </div>
                            </button>

                            <button 
                                className={`${styles.accountOption} ${user?.uid === "guest_user_demo" ? styles.selectedAccount : ''}`}
                                onClick={() => handleSwitchUser("guest_user_demo")}
                            >
                                <div className={styles.accountAvatar}>🌿</div>
                                <div className={styles.accountMeta}>
                                    <strong>대한김치 체험 회원</strong>
                                    <span>800 HEX • 5,000 P • 300,000 VND</span>
                                    <code>0x3B82...82a3</code>
                                </div>
                            </button>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.web3ConnectBtn} onClick={() => { connectWallet(); setLoginModalOpen(false); }}>
                                🦊 MetaMask / 외부 Web3 지갑 직접 연결
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
