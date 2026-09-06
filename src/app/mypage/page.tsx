"use client";

import React, { useEffect, useState } from "react";
import { useUserWallet } from "@/context/UserWalletContext";
import styles from "./page.module.css";

export default function MyPage() {
    const { user, wallet, isLoggedIn, orders, isLoading, refreshWallet } = useUserWallet();
    const [mounted, setMounted] = useState(false);

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
                    <p>우측 상단 메뉴를 통해 로그인 후 이용해 주세요.</p>
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

    return (
        <main style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>마이페이지</h1>
                    <p className={styles.subTitle}>나의 회원 정보와 보유 자산, 주문 내역을 확인하세요.</p>
                </div>

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

                <div className={styles.sectionTitle}>💎 보유 자산 현황</div>
                <div className={styles.assetGrid}>
                    <div className={`${styles.assetCard} ${styles.assetPoints}`}>
                        <div className={styles.assetHeader}>🎟️ 플랫폼 포인트</div>
                        <div className={styles.assetValue}>
                            {wallet.points.toLocaleString()}
                            <span className={styles.assetUnit}>P</span>
                        </div>
                    </div>
                    
                    <div className={`${styles.assetCard} ${styles.assetDp}`}>
                        <div className={styles.assetHeader}>⭐ 대한포인트(DP)</div>
                        <div className={styles.assetValue}>
                            {wallet.dpPoints.toLocaleString()}
                            <span className={styles.assetUnit}>DP</span>
                        </div>
                    </div>

                    <div className={`${styles.assetCard} ${styles.assetVnd}`}>
                        <div className={styles.assetHeader}>💵 결제 대금 (현금성)</div>
                        <div className={styles.assetValue}>
                            {wallet.vndBalance.toLocaleString()}
                            <span className={styles.assetUnit}>₫</span>
                        </div>
                    </div>

                    <div className={`${styles.assetCard} ${styles.assetKm}`}>
                        <div className={styles.assetHeader}>💎 충전머니</div>
                        <div className={styles.assetValue}>
                            {wallet.hexBalance.toLocaleString()}
                            <span className={styles.assetUnit}>KM</span>
                        </div>
                    </div>
                </div>

                <div className={styles.ordersSection}>
                    <div className={styles.sectionTitle} style={{ marginBottom: "2rem" }}>📦 최근 주문 내역</div>
                    
                    {orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>최근 3개월 간 주문 내역이 없습니다.</p>
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
                                            {order.currency === "VND" ? " ₫" : order.currency === "POINT" ? " P" : " KM"}
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
