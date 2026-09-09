"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useUserWallet, UserRole, MemberOrder } from "@/context/UserWalletContext";
import { products } from "@/data/products";

import Link from "next/link";
import { 
    ShieldAlert, Users, ShoppingBag, Coins, DollarSign, RefreshCw, 
    UserCheck, UserX, Crown, CheckCircle2, Truck, Eye, Search, 
    Key, ExternalLink, ArrowUpRight, Sparkles, Filter, Edit3, Lock,
    Wallet, Ticket, RefreshCcw
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

    const [activeTab, setActiveTab] = useState<"members" | "orders" | "analytics" | "api" | "kmoa_crm">("members");
    const [memberSearch, setMemberSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [orderFilter, setOrderFilter] = useState<string>("ALL");
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    // 가맹점 CRM 상태
    const [kmoaBalance, setKmoaBalance] = useState<any>(null);
    const [kmoaMembers, setKmoaMembers] = useState<any[]>([]);
    const [kmoaDbLoading, setKmoaDbLoading] = useState(false);
    const [kmoaDemo, setKmoaDemo] = useState(false);
    const [kmoaConnStatus, setKmoaConnStatus] = useState<"live"|"demo"|"error"|"offline"|"loading">("loading");


    // 가맹점 데이터 로드
    const loadKmoaData = async () => {
        setKmoaDbLoading(true);
        setKmoaConnStatus("loading");
        try {
            const [balRes, memRes] = await Promise.all([
                fetch("/api/v1/kmoa/balance").then(r => r.json()),
                fetch("/api/v1/kmoa/members?limit=50").then(r => r.json())
            ]);
            if (balRes.success) setKmoaBalance(balRes);
            if (memRes.success) {
                setKmoaMembers(memRes.members || []);
                setKmoaDemo(!!memRes.demo);
                setKmoaConnStatus(balRes.connectionStatus || "demo");
            }
        } catch {
            setKmoaConnStatus("offline");
        } finally { setKmoaDbLoading(false); }
    };


    useEffect(() => { loadKmoaData(); }, []);


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
    const filteredOrders = (allOrders || []).filter((o: MemberOrder) => {
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
                            <h1 className={styles.adminTitle}>가맹점 관리자 센터 (Admin Control)</h1>
                            <span className={`${styles.currentRoleBadge} ${isSuperAdmin ? styles.superAdminBadge : styles.operatorBadge}`}>
                                {isSuperAdmin ? "👑 최고 관리자 (Super Admin)" : isOperator ? "🛡️ 운영자 (Operator)" : "일반 회원 (권한 제한)"}
                            </span>
                        </div>
                        <p className={styles.adminSub}>
                            결제 시스템 연동 기반 회원 DB, 운영자 권한 부여 및 결제 관리
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

            {/* 가맹점 실시간 데이터 패널 */}
            <div className={styles.kmoaPanel}>
                <div className={styles.kmoaPanelHeader}>
                    <div className={styles.kmoaPanelTitle}>
                        <span className={styles.kmoaLiveDot2} />
                        <Wallet size={18} color="#C8392B" />
                        <strong>가맹점 실시간 자산 현황</strong>
                        {kmoaConnStatus === "live" && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16a34a', background: 'rgba(22,163,74,.1)', border: '1px solid rgba(22,163,74,.3)', padding: '2px 9px', borderRadius: '99px' }}>
                                🟢 LIVE 연결됨
                            </span>
                        )}
                        {(kmoaConnStatus === "error" || kmoaConnStatus === "offline") && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#dc2626', background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.25)', padding: '2px 9px', borderRadius: '99px' }}>
                                🔴 API 키 확인 중 (DEMO 표시)
                            </span>
                        )}
                        {(kmoaConnStatus === "demo" || kmoaConnStatus === "loading") && (
                            <span className={styles.kmoaDemoBadge}>DEMO 데이터</span>
                        )}
                    </div>
                    <button
                        className={styles.kmoaRefreshBtn}
                        onClick={loadKmoaData}
                        disabled={kmoaDbLoading}
                    >
                        <RefreshCcw size={14} className={kmoaDbLoading ? styles.spinning : ''} />
                        {kmoaDbLoading ? "로딩...": "실시간 동기화"}
                    </button>
                </div>
                <div className={styles.kmoaBalanceRow}>
                    <div className={styles.kmoaBalanceCard}>
                        <div className={styles.kmoaBalanceIcon}>💰</div>
                        <div>
                            <div className={styles.kmoaBalanceLabel}>플랫폼 포인트 잔액</div>
                            <div className={styles.kmoaBalanceVal}>
                                {kmoaBalance ? kmoaBalance.balance?.points?.toLocaleString() : "--"}
                                <span className={styles.kmoaBalanceUnit}>P</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.kmoaBalanceCard}>
                        <div className={styles.kmoaBalanceIcon}>🎟️</div>
                        <div>
                            <div className={styles.kmoaBalanceLabel}>보너스티켓 재고</div>
                            <div className={styles.kmoaBalanceVal}>
                                {kmoaBalance ? kmoaBalance.balance?.btBalance?.toLocaleString() : "--"}
                                <span className={styles.kmoaBalanceUnit}>BT</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.kmoaBalanceCard}>
                        <div className={styles.kmoaBalanceIcon}>💵</div>
                        <div>
                            <div className={styles.kmoaBalanceLabel}>가맹점 머니 (결제대금)</div>
                            <div className={styles.kmoaBalanceVal}>
                                {kmoaBalance ? kmoaBalance.balance?.km?.toLocaleString() : "--"}
                                <span className={styles.kmoaBalanceUnit}>KM</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.kmoaBalanceCard}>
                        <div className={styles.kmoaBalanceIcon}>👥</div>
                        <div>
                            <div className={styles.kmoaBalanceLabel}>확보 단골 회원 수</div>
                            <div className={styles.kmoaBalanceVal}>
                                {kmoaMembers.length}
                                <span className={styles.kmoaBalanceUnit}>명</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.kmoaBalanceCard}>
                        <div className={styles.kmoaBalanceIcon}>🏷️</div>
                        <div>
                            <div className={styles.kmoaBalanceLabel}>가맹점 ID</div>
                            <div className={styles.kmoaBalanceVal} style={{ fontSize: '0.9rem' }}>
                                {kmoaBalance?.merchantName || "--"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 가맹점 단골 회원 CRM 테이블 */}
            <div className={styles.kmoaCrmSection}>
                <div className={styles.kmoaCrmHeader}>
                    <h3 className={styles.kmoaCrmTitle}>👥 단골 멤버십 DB</h3>
                    <span className={styles.kmoaCrmCount}>전체 {kmoaMembers.length}명</span>
                </div>
                <div className={styles.kmoaCrmTable}>
                    <table className={styles.kmoaTable}>
                        <thead>
                            <tr>
                                <th>회원명</th>
                                <th>이메일</th>
                                <th>레벨</th>
                                <th>포인트</th>
                                <th>보너스티켓</th>
                                <th>가입일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kmoaMembers.length === 0 && (
                                <tr><td colSpan={6} className={styles.kmoaEmptyRow}>API 키를 설정하면 실제 회원 DB가 표시됩니다.</td></tr>
                            )}
                            {kmoaMembers.map((m: any) => (
                                <tr key={m.uid}>
                                    <td className={styles.kmoaTableName}>{m.displayName}</td>
                                    <td className={styles.kmoaTableEmail}>{m.email}</td>
                                    <td>
                                        <span className={styles.kmoaLevelBadge} data-level={m.userLevel}>
                                            Lv.{m.userLevel}
                                        </span>
                                    </td>
                                    <td className={styles.kmoaTablePoints}>{m.pointBalance?.toLocaleString()} P</td>
                                    <td>{m.btBalance} BT</td>
                                    <td className={styles.kmoaTableDate}>
                                        {new Date(m.joinedAt).toLocaleDateString("ko-KR")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            <div className={styles.kpiGrid}>
                <div className={`${styles.kpiCard} ${styles.kpiHex}`}>
                    <div className={styles.kpiIconWrap}>
                        <Coins size={24} color="#fcd34d" />
                    </div>
                    <div className={styles.kpiMeta}>
                        <span className={styles.kpiLabel}>총 충전머니 결제 매출</span>
                        <div className={styles.kpiVal}>
                            {(adminStats?.totalHexSales || 0).toLocaleString()}
                            <span className={styles.kpiUnit}>머니</span>
                        </div>
                        <span className={styles.kpiSub}>결제 시스템 안전 거래 기록</span>
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrap} style={{ background: 'rgba(0, 230, 118, 0.15)' }}>
                        <DollarSign size={24} color="#00E676" />
                    </div>
                    <div className={styles.kpiMeta}>
                        <span className={styles.kpiLabel}>총 환산 매출액 (통화)</span>
                        <div className={styles.kpiVal} style={{ color: '#00E676' }}>
                            {(adminStats?.totalVndSales || 0).toLocaleString()}
                            <span className={styles.kpiUnit}>단위</span>
                        </div>
                        <span className={styles.kpiSub}>통화 기준 정산</span>
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
                        <span className={styles.kpiSub}>물류 시스템 당일/익일 출고</span>
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
                        <span className={styles.kpiSub}>플랫폼 가맹점 연동</span>
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
                    <Coins size={16} /> 📊 매출 & 정산 대시보드
                </button>
                <button 
                    className={`${styles.navTabBtn} ${activeTab === "api" ? styles.activeNavTab : ''}`}
                    onClick={() => setActiveTab("api")}
                >
                    <Key size={16} /> ⚙️ 가맹점 API 연동 정보
                </button>
            </div>

            {/* TAB 1: MEMBERS & OPERATOR APPOINTMENT */}
            {activeTab === "members" && (
                <section className={styles.panelSection}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h2 className={styles.panelHeading}>회원 DB & 운영자(Operator) 지정 관리</h2>
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
                                    <th>보유 잔액</th>
                                    <th>플랫폼 포인트</th>
                                    <th>현금 예치금</th>
                                    <th>기타 포인트</th>
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
                                            <div className={styles.memberLoyalty}>
                                                <strong style={{ color: '#fcd34d' }}>{(member.moneyBalance || 0).toLocaleString()} 충전머니</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ color: '#00E676' }}>{(member.points || 0).toLocaleString()} P</span>
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
                                {filteredOrders.map((order: MemberOrder) => (
                                    <tr key={order.orderId}>
                                        <td>
                                            <strong>{order.orderId}</strong>
                                            <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleString()}</span>
                                        </td>
                                        <td>
                                            <div className={styles.orderItemsList}>
                                                {order.items.map((it: any, i: number) => (
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
                    <h2 className={styles.panelHeading}>가맹점 매출 분석 & 정산 현황</h2>
                    <div className={styles.analyticsGrid}>
                        <div className={styles.analyticsCard}>
                            <h3>🪙 통화별 결제 비중</h3>
                            <div className={styles.currencyBreakdown}>
                                <div className={styles.curBreakRow}>
                                    <span>충전머니 결제</span>
                                    <strong style={{ color: '#fcd34d' }}>85.4% (주요 결제 수단)</strong>
                                </div>
                                <div className={styles.curBreakRow}>
                                    <span>VND 현금 및 계좌이체</span>
                                    <strong style={{ color: '#60a5fa' }}>10.2%</strong>
                                </div>
                                <div className={styles.curBreakRow}>
                                    <span>플랫폼 포인트</span>
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

            {/* TAB 4: API & GATEWAY SETTINGS */}
            {activeTab === "api" && (
                <section className={styles.panelSection}>
                    <h2 className={styles.panelHeading}>플랫폼 가맹점 결제 게이트웨이 연동 스펙</h2>
                    <p className={styles.panelDesc}>
                        <a href="https://kmoa.netlify.app/kmoa_merchant_guide.html" target="_blank" rel="noreferrer" style={{ color: '#fcd34d', textDecoration: 'underline' }}>
                            가맹점 API 공식 가이드 바로가기 <ExternalLink size={14} style={{ verticalAlign: 'middle' }} />
                        </a>
                    </p>

                    <div className={styles.apiSpecBox}>
                        <div className={styles.apiSpecItem}>
                            <span>Merchant ID (가맹점 식별자)</span>
                            <code>daehan_kimchi_store</code>
                        </div>
                        <div className={styles.apiSpecItem}>
                            <span>Merchant API Secret (인증키)</span>
                            <code>Bearer sk_kmoa_sec_daehan2026_99x</code>
                        </div>
                        <div className={styles.apiSpecItem}>
                            <span>회원 DB & 결제 엔진</span>
                            <code>Firebase Auth UID + Firestore Realtime Engine (0.1s 원자적 처리)</code>
                        </div>
                        <div className={styles.apiSpecItem}>
                            <span>플랫폼 Cloud Functions API Root</span>
                            <code>https://us-central1-kca-platform.cloudfunctions.net/api/v1</code>
                        </div>
                        <div className={styles.apiSpecItem}>
                            <span>추천인(Mentor) 자동 가입 URL</span>
                            <code>https://kmoa.netlify.app/register.html?mentor=daehan_kimchi_store</code>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
