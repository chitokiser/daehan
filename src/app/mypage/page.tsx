"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useUserWallet } from "@/context/UserWalletContext";
import Link from "next/link";
import { 
    Wallet, Coins, Sparkles, RefreshCw, Copy, Check, ExternalLink, 
    ArrowUpRight, ArrowDownLeft, ShoppingBag, Truck, ShieldCheck, 
    UserCheck, CreditCard, ChevronRight, AlertCircle, PlusCircle, Award
} from "lucide-react";

export default function MyPageDashboard() {
    const { 
        user, 
        wallet, 
        orders, 
        transactions, 
        isLoggedIn, 
        refreshWallet, 
        faucetHex, 
        login, 
        isLoading 
    } = useUserWallet();

    const [activeTab, setActiveTab] = useState<"orders" | "transactions" | "points">("orders");
    const [copiedAddress, setCopiedAddress] = useState(false);
    const [faucetSuccess, setFaucetSuccess] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(wallet.onChainWalletAddress);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
    };

    const handleFaucet = async () => {
        const success = await faucetHex(500);
        if (success) {
            setFaucetSuccess(true);
            setTimeout(() => setFaucetSuccess(false), 2500);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        await refreshWallet();
        setTimeout(() => {
            setSyncing(false);
            alert("잔액 및 주문 내역이 성공적으로 동기화되었습니다!");
        }, 600);
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* Header / Member Profile Badge */}
            <div className={styles.topProfileBar}>
                <div className={styles.profileMeta}>
                    <div className={styles.avatarWrap}>
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
                        ) : (
                            <div className={styles.avatarFallback}>👑</div>
                        )}
                    </div>
                    <div>
                        <div className={styles.nameRow}>
                            <h1 className={styles.userName}>{user?.name || "대한김치 회원"}</h1>
                            <span className={styles.roleTag}>{user?.role || "VIP_MEMBER"}</span>
                        </div>
                        <p className={styles.userEmail}>{user?.email || "user@daehankimchi.com"}</p>
                    </div>
                </div>

                <div className={styles.profileActions}>
                    <Link 
                        href="/kmoa-guide" 
                        className={styles.syncBtn} 
                        style={{ textDecoration: 'none', color: '#fcd34d', borderColor: 'rgba(247, 164, 0, 0.4)' }}
                    >
                        <ExternalLink size={14} />
                        포인트 결제 안내
                    </Link>
                    <button 
                        className={styles.syncBtn} 
                        onClick={handleSync}
                        disabled={syncing || isLoading}
                    >
                        <RefreshCw size={15} className={syncing ? styles.spinning : ''} />
                        {syncing ? "동기화 중..." : "잔액 동기화"}
                    </button>
                    <Link href="/shop" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                        <ShoppingBag size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                        쇼핑몰 이용하기
                    </Link>
                </div>
            </div>

            {/* Money & Point Wallet Card Grid */}
            <div className={styles.walletGrid}>
                {/* Main K-MOA Money Card */}
                <div className={`${styles.walletCard} ${styles.hexCard}`}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIconWrap}>
                            <Coins size={24} color="#fcd34d" />
                        </div>
                        <span className={styles.cardBadge}>충전 잔액</span>
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardLabel}>보유 충전 잔액</span>
                        <div className={styles.mainAmount}>
                            {wallet.hexTokenBalance.toLocaleString()}
                            <span className={styles.unit}>머니</span>
                        </div>
                        <div className={styles.approxVnd}>
                            ≈ {(wallet.hexTokenBalance * 1000).toLocaleString()} VND 가치 (1머니 = 1,000 VND)
                        </div>
                    </div>
                    <div className={styles.cardFooter}>
                        <button 
                            className={styles.faucetBtn}
                            onClick={handleFaucet}
                            disabled={isLoading}
                        >
                            <PlusCircle size={15} />
                            {faucetSuccess ? "500 머니 충전 완료!" : "+500 머니 충전하기"}
                        </button>
                    </div>
                </div>

                {/* KCA Points Card */}
                <div className={styles.walletCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIconWrap} style={{ background: 'rgba(0, 230, 118, 0.15)' }}>
                            <Sparkles size={24} color="#00E676" />
                        </div>
                        <span className={styles.cardBadge} style={{ color: '#00E676', borderColor: 'rgba(0, 230, 118, 0.3)' }}>적립 포인트</span>
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardLabel}>적립 포인트 잔액</span>
                        <div className={styles.mainAmount} style={{ color: '#00E676' }}>
                            {wallet.kcaPoints.toLocaleString()}
                            <span className={styles.unit}>P</span>
                        </div>
                        <div className={styles.approxVnd}>
                            가맹점 100% 현금 결제 전환 가능
                        </div>
                    </div>
                </div>

                {/* VND Balance Card */}
                <div className={styles.walletCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIconWrap} style={{ background: 'rgba(41, 121, 255, 0.15)' }}>
                            <CreditCard size={24} color="#2979FF" />
                        </div>
                        <span className={styles.cardBadge} style={{ color: '#2979FF', borderColor: 'rgba(41, 121, 255, 0.3)' }}>하노이 현금 잔액</span>
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardLabel}>VND 예치금</span>
                        <div className={styles.mainAmount} style={{ color: '#60a5fa' }}>
                            {wallet.vndBalance.toLocaleString()}
                            <span className={styles.unit}>₫</span>
                        </div>
                        <div className={styles.approxVnd}>
                            하노이 시내 계좌이체 & 직배송
                        </div>
                    </div>
                </div>

                {/* Daehan Points (DP) Card */}
                <div className={styles.walletCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardIconWrap} style={{ background: 'rgba(247, 164, 0, 0.15)' }}>
                            <Award size={24} color="#f7a400" />
                        </div>
                        <span className={styles.cardBadge} style={{ color: '#f7a400', borderColor: 'rgba(247, 164, 0, 0.3)' }}>대한포인트 (DP)</span>
                    </div>
                    <div className={styles.cardContent}>
                        <span className={styles.cardLabel}>누적 리워드 마일리지</span>
                        <div className={styles.mainAmount} style={{ color: '#f7a400' }}>
                            {wallet.dpPoints.toLocaleString()}
                            <span className={styles.unit}>DP</span>
                        </div>
                        <div className={styles.approxVnd}>
                            구매 및 리뷰 작성 시 5% 상시 적립
                        </div>
                    </div>
                </div>
            </div>

            {/* K-MOA Member Account Identifier Bar */}
            <div className={styles.addressBar}>
                <div className={styles.addrLeft}>
                    <Wallet size={18} color="#00E676" />
                    <span className={styles.addrLabel}>회원 식별 코드:</span>
                    <code className={styles.addrCode}>{wallet.onChainWalletAddress}</code>
                </div>
                <div className={styles.addrRight}>
                    <button className={styles.copyBtn} onClick={handleCopyAddress}>
                        {copiedAddress ? <Check size={14} color="#00E676" /> : <Copy size={14} />}
                        {copiedAddress ? "복사완료" : "회원코드 복사"}
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className={styles.tabsSection}>
                <div className={styles.tabsHeader}>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === "orders" ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        <ShoppingBag size={16} /> 김치 주문 내역 ({orders.length})
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === "transactions" ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab("transactions")}
                    >
                        <Coins size={16} /> 지갑 트랜잭션 ({transactions.length})
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === "points" ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab("points")}
                    >
                        <Award size={16} /> 대한포인트(DP) 적립
                    </button>
                </div>

                {/* Tab 1: Orders */}
                {activeTab === "orders" && (
                    <div className={styles.tabPanel}>
                        {orders.length === 0 ? (
                            <div className={styles.emptyState}>
                                <ShoppingBag size={36} color="var(--text-muted)" />
                                <p>아직 결제하신 주문 내역이 없습니다.</p>
                                <Link href="/shop" className="btn-primary" style={{ marginTop: '14px', display: 'inline-block' }}>
                                    15종 김치 쇼핑몰 바로가기
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.orderList}>
                                {orders.map(order => (
                                    <div key={order.orderId} className={styles.orderItem}>
                                        <div className={styles.orderTop}>
                                            <div className={styles.orderIdGroup}>
                                                <span className={styles.orderTag}>주문번호</span>
                                                <strong>{order.orderId}</strong>
                                                <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleString()}</span>
                                            </div>
                                            <span className={`${styles.statusBadge} ${order.status === 'DELIVERED' ? styles.delivered : styles.paid}`}>
                                                {order.status === 'DELIVERED' ? '배송완료' : '결제완료 (배송준비중)'}
                                            </span>
                                        </div>

                                        <div className={styles.orderProducts}>
                                            {order.items.map((it, idx) => (
                                                <div key={idx} className={styles.prodRow}>
                                                    <img src={it.image} alt={it.productName} className={styles.prodThumb} />
                                                    <div className={styles.prodInfo}>
                                                        <h4>{it.productName}</h4>
                                                        <p>규격: {it.weight} • 수량: {it.quantity}개</p>
                                                    </div>
                                                    <div className={styles.prodPrice}>
                                                        <span>{it.priceVnd.toLocaleString()} VND</span>
                                                        <strong style={{ color: '#fcd34d' }}>🪙 {it.priceHex} HEX</strong>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.orderBottom}>
                                            <div className={styles.shippingMeta}>
                                                <Truck size={14} color="#f7a400" />
                                                <span>받는 분: <strong>{order.shippingAddress?.recipient}</strong> ({order.shippingAddress?.phone}) • {order.shippingAddress?.address}</span>
                                            </div>
                                            <div className={styles.totalPaid}>
                                                <span>총 결제금액:</span>
                                                <strong style={{ color: '#fcd34d' }}>
                                                    {order.paidAmount.toLocaleString()} {order.currency}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: Transactions */}
                {activeTab === "transactions" && (
                    <div className={styles.tabPanel}>
                        <div className={styles.txList}>
                            {transactions.map(tx => (
                                <div key={tx.id} className={styles.txItem}>
                                    <div className={styles.txLeft}>
                                        <div className={`${styles.txIconWrap} ${tx.type === 'PAYMENT' ? styles.txSpend : styles.txEarn}`}>
                                            {tx.type === 'PAYMENT' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                        </div>
                                        <div className={styles.txMeta}>
                                            <h4>{tx.description}</h4>
                                            <div className={styles.txSub}>
                                                <span>{new Date(tx.timestamp).toLocaleString()}</span>
                                                <span>•</span>
                                                <code>{tx.txHash ? `${tx.txHash.slice(0, 10)}...${tx.txHash.slice(-8)}` : tx.id}</code>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${styles.txAmount} ${tx.type === 'PAYMENT' ? styles.negative : styles.positive}`}>
                                        {tx.type === 'PAYMENT' ? '-' : '+'}{tx.amount.toLocaleString()} {tx.currency}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab 3: Points */}
                {activeTab === "points" && (
                    <div className={styles.tabPanel}>
                        <div className={styles.pointRewardCard}>
                            <div className={styles.rewardTop}>
                                <Award size={32} color="#f7a400" />
                                <div>
                                    <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '4px' }}>대한김치 VIP 리워드 프로그램</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                        쇼핑몰 구매 시 결제 금액의 5%가 대한포인트(DP)로 자동 적립되며, 후기 작성 시 회당 500 DP가 추가 지급됩니다.
                                    </p>
                                </div>
                            </div>
                            <div className={styles.rewardStats}>
                                <div className={styles.rewardCol}>
                                    <span>현재 보유 포인트</span>
                                    <strong style={{ color: '#f7a400' }}>{wallet.dpPoints.toLocaleString()} DP</strong>
                                </div>
                                <div className={styles.rewardCol}>
                                    <span>적립율</span>
                                    <strong style={{ color: '#00E676' }}>5.0% (VIP 최고 혜택)</strong>
                                </div>
                                <div className={styles.rewardCol}>
                                    <span>포인트 전환율</span>
                                    <strong>1 DP = 1 VND 즉시 할인</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
