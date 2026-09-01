"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useUserWallet, UserRole } from "@/context/UserWalletContext";
import { products, vndToHex } from "@/data/products";
import Link from "next/link";
import { 
    ShieldAlert, Users, ShoppingBag, Coins, DollarSign, RefreshCw, 
    UserCheck, UserX, Crown, CheckCircle2, Truck, Eye, Search, 
    Key, ExternalLink, ArrowUpRight, Sparkles, Filter, Edit3, Lock 
} from "lucide-react";

export default function AdminDashboard() {
    const { 
        user, 
        wallet, 
        allMembers, 
        allOrders, 
        adminStats, 
        login, 
        changeUserRole, 
        changeOrderStatus, 
        fetchAdminData, 
        isLoading 
    } = useUserWallet();

    const [activeTab, setActiveTab] = useState<"members" | "orders" | "analytics" | "api">("members");
    const [memberSearch, setMemberSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [orderFilter, setOrderFilter] = useState<string>("ALL");
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const isOperator = user?.role === "OPERATOR" || isSuperAdmin;

    // Filter members
    const filteredMembers = allMembers.filter(m => {
        const matchesSearch = 
            m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
            m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
            (m.onChainWalletAddress && m.onChainWalletAddress.toLowerCase().includes(memberSearch.toLowerCase()));
        const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Filter orders
    const filteredOrders = allOrders.filter(o => {
        if (orderFilter === "ALL") return true;
        return o.status === orderFilter;
    });

    const handleRoleChange = async (targetUid: string, newRole: UserRole) => {
        if (!isSuperAdmin) {
            alert("최고 관리자(SUPER_ADMIN)만 운영자 권한을 지정하거나 변경할 수 있습니다.");
            return;
        }
        const res = await changeUserRole(targetUid, newRole);
        if (res.success) {
            setActionMessage(res.message || "권한이 성공적으로 변경되었습니다.");
            setTimeout(() => setActionMessage(null), 3000);
        } else {
            alert(res.error || "권한 변경에 실패했습니다.");
        }
    };

    const handleOrderStatusChange = async (orderId: string, newStatus: any) => {
        const res = await changeOrderStatus(orderId, newStatus);
        if (res.success) {
            setActionMessage(`주문 [${orderId}] 상태가 [${newStatus}]로 업데이트되었습니다.`);
            setTimeout(() => setActionMessage(null), 3000);
        } else {
            alert(res.error || "상태 변경에 실패했습니다.");
        }
    };

    return (
        <div className={styles.adminContainer}>
            {/* Top Admin Header Bar */}
            <div className={styles.topAdminBar}>
                <div className={styles.adminTitleGroup}>
                    <div className={styles.adminIconWrap}>
                        <ShieldAlert size={28} color="#e31837" />
                    </div>
                    <div>
                        <div className={styles.titleRow}>
                            <h1 className={styles.adminTitle}>대한김치 관리자 센터 (Admin Control)</h1>
                            <span className={`${styles.currentRoleBadge} ${isSuperAdmin ? styles.superAdminBadge : styles.operatorBadge}`}>
                                {isSuperAdmin ? "👑 최고 관리자 (Super Admin)" : isOperator ? "🛡️ 운영자 (Operator)" : "일반 회원 (권한 제한)"}
                            </span>
                        </div>
                        <p className={styles.adminSub}>
                            KCA Merchant Open API 연동 기반 회원 DB, 운영자 권한 부여 및 온체인 HEX 토큰 결제 관리
                        </p>
                    </div>
                </div>

                {/* Account Switcher for Instant Testing */}
                <div className={styles.quickAccountSwitch}>
                    <span className={styles.switchLabel}>빠른 계정 전환 (테스트용):</span>
                    <div className={styles.switchBtnGroup}>
                        <button 
                            className={`${styles.switchBtn} ${user?.uid === "admin_super_daehan" ? styles.activeSwitch : ''}`}
                            onClick={() => login("admin_super_daehan")}
                        >
                            👑 최고관리자
                        </button>
                        <button 
                            className={`${styles.switchBtn} ${user?.uid === "operator_hanoi_01" ? styles.activeSwitch : ''}`}
                            onClick={() => login("operator_hanoi_01")}
                        >
                            🛡️ 운영자
                        </button>
                        <button 
                            className={`${styles.switchBtn} ${user?.uid === "user_daehan_vip01" ? styles.activeSwitch : ''}`}
                            onClick={() => login("user_daehan_vip01")}
                        >
                            👤 일반VIP회원
                        </button>
                    </div>
                </div>
            </div>

            {actionMessage && (
                <div className={styles.alertSuccess}>
                    <CheckCircle2 size={18} /> {actionMessage}
                </div>
            )}

            {/* KPI Metric Cards */}
            <div className={styles.kpiGrid}>
                <div className={`${styles.kpiCard} ${styles.kpiHex}`}>
                    <div className={styles.kpiIconWrap}>
                        <Coins size={24} color="#fcd34d" />
                    </div>
                    <div className={styles.kpiMeta}>
                        <span className={styles.kpiLabel}>총 HEX 결제 매출</span>
                        <div className={styles.kpiVal}>
                            {(adminStats?.totalHexSales || 0).toLocaleString()}
                            <span className={styles.kpiUnit}>HEX</span>
                        </div>
                        <span className={styles.kpiSub}>KCA 온체인 스마트 컨트랙트 체결</span>
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrap} style={{ background: 'rgba(0, 230, 118, 0.15)' }}>
                        <DollarSign size={24} color="#00E676" />
                    </div>
                    <div className={styles.kpiMeta}>
                        <span className={styles.kpiLabel}>총 환산 매출액 (VND)</span>
                        <div className={styles.kpiVal} style={{ color: '#00E676' }}>
                            {(adminStats?.totalVndSales || 0).toLocaleString()}
                            <span className={styles.kpiUnit}>₫</span>
                        </div>
                        <span className={styles.kpiSub}>1 HEX = 1,000 VND 기준 정산</span>
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrap} style={{ background: 'rgba(41, 121, 255, 0.15)' }}>
                        <ShoppingBag size={24} color="#2979FF" />
                    </div>
                    <div className={styles.kpiMeta}>
                        <span className={styles.kpiLabel}>총 주문 건수 / 배송 대기</span>
                        <div className={styles.kpiVal} style={{ color: '#60a5fa' }}>
                            {adminStats?.totalOrders || 0}
                            <span className={styles.kpiUnit}>건 ({adminStats?.pendingShipping || 0}건 대기)</span>
                        </div>
                        <span className={styles.kpiSub}>하노이 콜드체인 당일/익일 출고</span>
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrap} style={{ background: 'rgba(227, 24, 55, 0.15)' }}>
                        <Users size={24} color="#e31837" />
                    </div>
                    <div className={styles.kpiMeta}>
                        <span className={styles.kpiLabel}>총 등록 회원 / 운영자 수</span>
                        <div className={styles.kpiVal} style={{ color: '#ff4d6d' }}>
                            {adminStats?.totalUsers || 0}
                            <span className={styles.kpiUnit}>명 (운영자 {adminStats?.operatorCount || 0}명)</span>
                        </div>
                        <span className={styles.kpiSub}>KCA Merchant API 회원 연동</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className={styles.tabNav}>
                <button 
                    className={`${styles.navTabBtn} ${activeTab === "members" ? styles.activeNavTab : ''}`}
                    onClick={() => setActiveTab("members")}
                >
                    <Users size={16} /> 👥 회원 및 운영자 권한 관리
                </button>
                <button 
                    className={`${styles.navTabBtn} ${activeTab === "orders" ? styles.activeNavTab : ''}`}
                    onClick={() => setActiveTab("orders")}
                >
                    <ShoppingBag size={16} /> 📦 주문 및 배송 상태 관리 ({allOrders.length})
                </button>
                <button 
                    className={`${styles.navTabBtn} ${activeTab === "analytics" ? styles.activeNavTab : ''}`}
                    onClick={() => setActiveTab("analytics")}
                >
                    <Coins size={16} /> 📊 KCA 매출 & 정산 대시보드
                </button>
                <button 
                    className={`${styles.navTabBtn} ${activeTab === "api" ? styles.activeNavTab : ''}`}
                    onClick={() => setActiveTab("api")}
                >
                    <Key size={16} /> ⚙️ KCA 가맹점 API 연동 정보
                </button>
            </div>

            {/* TAB 1: MEMBERS & OPERATOR APPOINTMENT */}
            {activeTab === "members" && (
                <section className={styles.panelSection}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h2 className={styles.panelHeading}>KCA 회원 DB & 운영자(Operator) 지정 관리</h2>
                            <p className={styles.panelDesc}>
                                💡 <strong>최고 관리자(SUPER_ADMIN)</strong>는 회원의 역할을 <code>OPERATOR (운영자)</code>로 지정하거나 해제할 수 있습니다.
                            </p>
                        </div>
                        <button className={styles.refreshBtn} onClick={fetchAdminData} disabled={isLoading}>
                            <RefreshCw size={14} className={isLoading ? styles.spinning : ''} />
                            회원 DB 동기화
                        </button>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className={styles.memberFilterRow}>
                        <div className={styles.searchBox}>
                            <Search size={16} color="var(--text-muted)" />
                            <input 
                                type="text"
                                placeholder="회원 이름, 이메일, 지갑 주소 검색..."
                                value={memberSearch}
                                onChange={e => setMemberSearch(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.roleFilterGroup}>
                            <Filter size={15} color="var(--text-muted)" />
                            <select 
                                value={roleFilter} 
                                onChange={e => setRoleFilter(e.target.value)}
                                className={styles.roleSelect}
                            >
                                <option value="ALL">모든 권한 등급</option>
                                <option value="SUPER_ADMIN">최고 관리자 (SUPER_ADMIN)</option>
                                <option value="OPERATOR">운영자 (OPERATOR)</option>
                                <option value="VIP_MEMBER">VIP 회원</option>
                                <option value="GOLD_MEMBER">골드 회원</option>
                                <option value="MEMBER">일반 회원</option>
                            </select>
                        </div>
                    </div>

                    {/* Members Table */}
                    <div className={styles.tableWrapper}>
                        <table className={styles.adminTable}>
                            <thead>
                                <tr>
                                    <th>회원 정보</th>
                                    <th>현재 권한</th>
                                    <th>연동 지갑 주소</th>
                                    <th>보유 HEX 토큰</th>
                                    <th>KCA 포인트</th>
                                    <th>VND 예치금</th>
                                    <th>대한포인트</th>
                                    <th>운영자 지정 및 권한 변경</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map(member => (
                                    <tr key={member.uid} className={member.role === "SUPER_ADMIN" ? styles.superAdminRow : member.role === "OPERATOR" ? styles.operatorRow : ''}>
                                        <td>
                                            <div className={styles.memberCell}>
                                                <div className={styles.memberAvatar}>
                                                    {member.role === "SUPER_ADMIN" ? "👑" : member.role === "OPERATOR" ? "🛡️" : "👤"}
                                                </div>
                                                <div>
                                                    <strong className={styles.memberName}>{member.name}</strong>
                                                    <span className={styles.memberEmail}>{member.email}</span>
                                                    <code className={styles.memberUid}>{member.uid}</code>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.rolePill} ${styles[member.role]}`}>
                                                {member.role === "SUPER_ADMIN" ? "최고 관리자" : member.role === "OPERATOR" ? "운영자" : member.role}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.walletAddrCell}>
                                                <code>{member.onChainWalletAddress ? `${member.onChainWalletAddress.slice(0, 6)}...${member.onChainWalletAddress.slice(-4)}` : "미연동"}</code>
                                            </div>
                                        </td>
                                        <td>
                                            <strong style={{ color: '#fcd34d' }}>{(member.hexTokenBalance || 0).toLocaleString()} HEX</strong>
                                        </td>
                                        <td>
                                            <span style={{ color: '#00E676' }}>{(member.kcaPoints || 0).toLocaleString()} P</span>
                                        </td>
                                        <td>
                                            <span>{(member.vndBalance || 0).toLocaleString()} ₫</span>
                                        </td>
                                        <td>
                                            <span style={{ color: '#f7a400' }}>{(member.dpPoints || 0).toLocaleString()} DP</span>
                                        </td>
                                        <td>
                                            {isSuperAdmin ? (
                                                <div className={styles.roleActionCell}>
                                                    <select
                                                        value={member.role}
                                                        onChange={(e) => handleRoleChange(member.uid, e.target.value as UserRole)}
                                                        className={styles.roleChangeSelect}
                                                        disabled={isLoading}
                                                    >
                                                        <option value="SUPER_ADMIN">👑 최고 관리자</option>
                                                        <option value="OPERATOR">🛡️ 운영자 (Operator)</option>
                                                        <option value="VIP_MEMBER">⭐ VIP 회원</option>
                                                        <option value="GOLD_MEMBER">🥇 골드 회원</option>
                                                        <option value="MEMBER">👤 일반 회원</option>
                                                    </select>
                                                </div>
                                            ) : (
                                                <span className={styles.lockedNotice}>
                                                    <Lock size={12} /> 최고관리자 전용
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* TAB 2: ORDERS MANAGEMENT */}
            {activeTab === "orders" && (
                <section className={styles.panelSection}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h2 className={styles.panelHeading}>주문 내역 및 하노이 콜드체인 출고 관리</h2>
                            <p className={styles.panelDesc}>
                                실시간 결제된 김치 주문 상태를 <code>PREPARING (준비중)</code>, <code>SHIPPING (배송중)</code>, <code>DELIVERED (배송완료)</code>로 즉시 갱신할 수 있습니다.
                            </p>
                        </div>
                        <div className={styles.orderFilterGroup}>
                            <select 
                                value={orderFilter}
                                onChange={e => setOrderFilter(e.target.value)}
                                className={styles.roleSelect}
                            >
                                <option value="ALL">전체 주문 보기</option>
                                <option value="PAID">결제 완료</option>
                                <option value="PREPARING">상품 준비중</option>
                                <option value="SHIPPING">배송중</option>
                                <option value="DELIVERED">배송 완료</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.adminTable}>
                            <thead>
                                <tr>
                                    <th>주문 번호 / 일시</th>
                                    <th>주문 상품</th>
                                    <th>결제 금액 & 수단</th>
                                    <th>배송지 및 수령인</th>
                                    <th>트랜잭션 ID</th>
                                    <th>주문 상태 변경</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.orderId}>
                                        <td>
                                            <strong>{order.orderId}</strong>
                                            <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleString()}</span>
                                        </td>
                                        <td>
                                            <div className={styles.orderItemsList}>
                                                {order.items.map((it, i) => (
                                                    <div key={i} className={styles.orderItemSnippet}>
                                                        <img src={it.image} alt={it.productName} className={styles.tinyThumb} />
                                                        <span>{it.productName} x {it.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <strong style={{ color: '#fcd34d', fontSize: '1rem' }}>
                                                {order.paidAmount.toLocaleString()} {order.currency}
                                            </strong>
                                            <span className={styles.approxSmall}>({order.totalVnd.toLocaleString()} VND)</span>
                                        </td>
                                        <td>
                                            <div className={styles.shippingSnippet}>
                                                <strong>{order.shippingAddress?.recipient}</strong> ({order.shippingAddress?.phone})
                                                <p>{order.shippingAddress?.address}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <code className={styles.txCode}>{order.txId}</code>
                                        </td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleOrderStatusChange(order.orderId, e.target.value)}
                                                className={`${styles.statusSelect} ${styles[`status_${order.status}`]}`}
                                            >
                                                <option value="PAID">결제완료</option>
                                                <option value="PREPARING">숙성/포장준비</option>
                                                <option value="SHIPPING">하노이 배송중</option>
                                                <option value="DELIVERED">배송완료</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* TAB 3: ANALYTICS & SETTLEMENT */}
            {activeTab === "analytics" && (
                <section className={styles.panelSection}>
                    <h2 className={styles.panelHeading}>KCA 가맹점 매출 분석 & 토큰 정산 현황</h2>
                    <div className={styles.analyticsGrid}>
                        <div className={styles.analyticsCard}>
                            <h3>🪙 통화별 결제 비중</h3>
                            <div className={styles.currencyBreakdown}>
                                <div className={styles.curBreakRow}>
                                    <span>HEX 토큰 결제</span>
                                    <strong style={{ color: '#fcd34d' }}>85.4% (주요 결제 수단)</strong>
                                </div>
                                <div className={styles.curBreakRow}>
                                    <span>VND 현금 및 계좌이체</span>
                                    <strong style={{ color: '#60a5fa' }}>10.2%</strong>
                                </div>
                                <div className={styles.curBreakRow}>
                                    <span>KCA 플랫폼 포인트</span>
                                    <strong style={{ color: '#00E676' }}>4.4%</strong>
                                </div>
                            </div>
                        </div>

                        <div className={styles.analyticsCard}>
                            <h3>🌱 베스트셀러 김치 TOP 3</h3>
                            <div className={styles.topProductsList}>
                                <div className={styles.topProdItem}>
                                    <span>1. 포기김치 1Kg</span>
                                    <strong>42% 점유</strong>
                                </div>
                                <div className={styles.topProdItem}>
                                    <span>2. 화끈한 실비김치 1Kg</span>
                                    <strong>28% 점유</strong>
                                </div>
                                <div className={styles.topProdItem}>
                                    <span>3. 알싸한 쪽파김치 1Kg</span>
                                    <strong>18% 점유</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* TAB 4: API & CONTRACT SETTINGS */}
            {activeTab === "api" && (
                <section className={styles.panelSection}>
                    <h2 className={styles.panelHeading}>KCA Merchant API 및 스마트 컨트랙트 연동 스펙</h2>
                    <p className={styles.panelDesc}>
                        <a href="https://jump22.netlify.app/kca_merchant_api.html" target="_blank" rel="noreferrer" style={{ color: '#fcd34d', textDecoration: 'underline' }}>
                            KCA Merchant Open API 공식 문서 바로가기 <ExternalLink size={14} style={{ verticalAlign: 'middle' }} />
                        </a>
                    </p>

                    <div className={styles.apiSpecBox}>
                        <div className={styles.apiSpecItem}>
                            <span>Merchant ID (가맹점 식별자)</span>
                            <code>daehan_kimchi_store</code>
                        </div>
                        <div className={styles.apiSpecItem}>
                            <span>Merchant API Key (비밀키)</span>
                            <code>kca_merchant_sec_daehan2026_99x</code>
                        </div>
                        <div className={styles.apiSpecItem}>
                            <span>HEX Token Smart Contract Address</span>
                            <code>0xa4850A83D219b5706D638cC28244EFe2bF8bdb40</code>
                        </div>
                        <div className={styles.apiSpecItem}>
                            <span>KCA Cloud Functions API Root</span>
                            <code>https://us-central1-kca-platform.cloudfunctions.net/api/v1</code>
                        </div>
                        <div className={styles.apiSpecItem}>
                            <span>Internal Local API Gateway</span>
                            <code>/api/v1/wallet/[uid] & /api/v1/wallet/pay</code>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
