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

    const [activeTab, setActiveTab] = useState<"charges" | "members" | "orders" | "analytics" | "api" | "kmoa_crm">("charges");
    const [memberSearch, setMemberSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("ALL");
    const [orderFilter, setOrderFilter] = useState<string>("ALL");
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    // 베트남 택배 / 송장 입력 모달 상태
    const [shippingModalOrder, setShippingModalOrder] = useState<MemberOrder | null>(null);
    const [shippingForm, setShippingForm] = useState<{
        courier: string;
        trackingNumber: string;
        driverPhone: string;
        deliveryMemo: string;
        targetStatus: "PREPARING" | "SHIPPING" | "DELIVERED";
    }>({
        courier: "🚀 GrabExpress (그랩 퀵)",
        trackingNumber: "",
        driverPhone: "",
        deliveryMemo: "",
        targetStatus: "SHIPPING"
    });

    // 계좌입금 충전 신청 상태
    const [chargeRequests, setChargeRequests] = useState<any[]>([]);
    const [loadingCharges, setLoadingCharges] = useState(false);

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


    // 계좌입금 충전 신청 목록 조회
    const fetchChargeRequests = async () => {
        setLoadingCharges(true);
        try {
            const res = await fetch("/api/v1/admin/charge-requests");
            const data = await res.json();
            if (data.success) {
                setChargeRequests(data.requests || []);
            }
        } catch (e) {
            console.error("Failed to fetch charge requests", e);
        } finally {
            setLoadingCharges(false);
        }
    };

    const handleApproveCharge = async (requestId: string) => {
        if (!confirm("입금을 확인하셨습니까? 승인 시 해당 회원에게 충전머니가 입금됩니다.")) return;
        try {
            const res = await fetch("/api/v1/admin/charge-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, action: "APPROVE" })
            });
            const data = await res.json();
            if (data.success) {
                setActionMessage(`충전 요청이 승인되었습니다. (${data.request?.amount?.toLocaleString()} 머니 충전 완료)`);
                setTimeout(() => setActionMessage(null), 3000);
                fetchChargeRequests();
                fetchAdminData();
            } else {
                alert(data.error || "승인 처리 중 오류가 발생했습니다.");
            }
        } catch (e) {
            alert("승인 요청 중 에러가 발생했습니다.");
        }
    };

    const handleRejectCharge = async (requestId: string) => {
        if (!confirm("해당 충전 요청을 거절하시겠습니까?")) return;
        try {
            const res = await fetch("/api/v1/admin/charge-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId, action: "REJECT" })
            });
            const data = await res.json();
            if (data.success) {
                setActionMessage("충전 요청이 거절 처리되었습니다.");
                setTimeout(() => setActionMessage(null), 3000);
                fetchChargeRequests();
            } else {
                alert(data.error || "거절 처리 중 오류가 발생했습니다.");
            }
        } catch (e) {
            alert("거절 요청 중 에러가 발생했습니다.");
        }
    };

    useEffect(() => { 
        loadKmoaData(); 
        fetchChargeRequests();
        fetchAdminData();
    }, []);


    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const isOperator = user?.role === "OPERATOR" || isSuperAdmin;

    // Filter members
    const filteredMembers = (allMembers || []).filter(m => {
        if (!m) return false;
        const nameStr = (m.name || "").toLowerCase();
        const emailStr = (m.email || "").toLowerCase();
        const addrStr = (m.onChainWalletAddress || "").toLowerCase();
        const searchStr = memberSearch.toLowerCase();

        const matchesSearch = nameStr.includes(searchStr) || emailStr.includes(searchStr) || addrStr.includes(searchStr);
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
        if (newStatus === "SHIPPING" || newStatus === "DELIVERED") {
            const targetOrd = (allOrders || []).find((o: any) => o.orderId === orderId);
            if (targetOrd) {
                openShippingModal(targetOrd, newStatus);
                return;
            }
        }

        const res = await changeOrderStatus(orderId, newStatus);
        if (res.success) {
            setActionMessage(`주문 [${orderId}] 상태가 [${newStatus}]로 업데이트되었습니다.`);
            setTimeout(() => setActionMessage(null), 3000);
            fetchAdminData();
        } else {
            alert(res.error || "상태 변경에 실패했습니다.");
        }
    };

    const openShippingModal = (order: MemberOrder, defaultStatus?: any) => {
        setShippingModalOrder(order);
        setShippingForm({
            courier: order.shippingInfo?.courier || "🚀 GrabExpress (그랩 퀵)",
            trackingNumber: order.shippingInfo?.trackingNumber || "",
            driverPhone: order.shippingInfo?.driverPhone || "",
            deliveryMemo: order.shippingInfo?.deliveryMemo || "",
            targetStatus: defaultStatus || (order.status === "DELIVERED" ? "DELIVERED" : "SHIPPING")
        });
    };

    const handleSaveShippingInfo = async () => {
        if (!shippingModalOrder) return;

        const res = await changeOrderStatus(shippingModalOrder.orderId, shippingForm.targetStatus, {
            courier: shippingForm.courier,
            trackingNumber: shippingForm.trackingNumber,
            driverPhone: shippingForm.driverPhone,
            deliveryMemo: shippingForm.deliveryMemo
        });

        if (res.success) {
            setActionMessage(`주문 [${shippingModalOrder.orderId}]의 베트남 배송 정보 및 상태가 저장되었습니다.`);
            setTimeout(() => setActionMessage(null), 3500);
            setShippingModalOrder(null);
            fetchAdminData();
        } else {
            alert(res.error || "배송 정보 저장 실패");
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

            {!isOperator && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#f87171',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 600
                }}>
                    <Lock size={18} />
                    <span>주문 처리 및 배송 관리 기능은 <strong>최고 관리자(SUPER_ADMIN)</strong>가 부여한 <strong>운영자(OPERATOR)</strong> 권한 필요 회원만 실행 가능합니다.</span>
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
            {(() => {
                const pendingChargeCount = chargeRequests.filter(r => r.status === "PENDING").length;
                const pendingOrderCount = (allOrders || []).filter(o => o.status === "PENDING_PAYMENT" || o.status === "PAID" || o.status === "PREPARING").length;
                return (
                    <div className={styles.tabNav}>
                        <button 
                            className={`${styles.navTabBtn} ${activeTab === "charges" ? styles.activeNavTab : ''}`}
                            onClick={() => setActiveTab("charges")}
                        >
                            <Wallet size={16} /> 💳 계좌입금 충전 신청 관리 {pendingChargeCount > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: '99px', padding: '1px 7px', fontSize: '0.75rem', marginLeft: '6px' }}>{pendingChargeCount}건 대기</span>}
                        </button>
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
                            <ShoppingBag size={16} /> 📦 주문 및 배송 상태 관리 ({allOrders ? allOrders.length : 0}) {pendingOrderCount > 0 && <span style={{ background: '#f59e0b', color: '#000', borderRadius: '99px', padding: '1px 7px', fontSize: '0.75rem', marginLeft: '6px', fontWeight: 700 }}>{pendingOrderCount}건 처리필요</span>}
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
                );
            })()}

            {/* TAB 0: BANK DEPOSIT CHARGE REQUESTS */}
            {activeTab === "charges" && (
                <section className={styles.panelSection}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h2 className={styles.panelHeading}>💳 회원 계좌 입금 충전 신청 관리 (VND 기준)</h2>
                            <p className={styles.panelDesc}>
                                회원이 신한은행 베트남 계좌 (<code>700004461261 KIM YONG JIN</code>)로 <strong>VND(동)</strong> 입금 후 요청한 건을 확인하고 <strong>승인</strong>하면 회원의 충전머니가 즉시 증액됩니다.
                            </p>
                        </div>
                        <button className={styles.refreshBtn} onClick={fetchChargeRequests} disabled={loadingCharges}>
                            <RefreshCw size={14} className={loadingCharges ? styles.spinning : ''} />
                            새로고침
                        </button>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.adminTable}>
                            <thead>
                                <tr>
                                    <th>신청 일시</th>
                                    <th>회원 (이름 / 이메일)</th>
                                    <th>입금자명</th>
                                    <th>신청 충전 금액 (VND)</th>
                                    <th>상태</th>
                                    <th>입금 확인 및 승인 / 거절</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chargeRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                            신청된 계좌입금 충전 내역이 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    chargeRequests.map((req) => (
                                        <tr key={req.requestId || req.id}>
                                            <td>
                                                <span className={styles.orderDate}>{new Date(req.createdAt).toLocaleString("ko-KR")}</span>
                                            </td>
                                            <td>
                                                <strong>{req.userName || req.userEmail}</strong>
                                                <br />
                                                <code className={styles.memberUid}>{req.userEmail || req.userId}</code>
                                            </td>
                                            <td>
                                                <strong style={{ color: '#38bdf8', fontSize: '0.95rem' }}>{req.depositorName}</strong>
                                            </td>
                                            <td>
                                                <strong style={{ color: '#fcd34d', fontSize: '1.05rem' }}>
                                                    {Number(req.amount).toLocaleString()} VND
                                                </strong>
                                            </td>
                                            <td>
                                                {req.status === "PENDING" && (
                                                    <span style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                                                        🟡 입금확인 대기중
                                                    </span>
                                                )}
                                                {req.status === "APPROVED" && (
                                                    <span style={{ color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                                                        🟢 승인 완료
                                                    </span>
                                                )}
                                                {req.status === "REJECTED" && (
                                                    <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                                                        🔴 거절됨
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {req.status === "PENDING" ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleApproveCharge(req.requestId || req.id)}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                                                color: '#fff',
                                                                border: 'none',
                                                                padding: '6px 12px',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontWeight: 700,
                                                                fontSize: '0.82rem',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                        >
                                                            <CheckCircle2 size={14} /> 입금 확인 & 승인
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectCharge(req.requestId || req.id)}
                                                            style={{
                                                                background: 'rgba(239,68,68,0.15)',
                                                                color: '#ef4444',
                                                                border: '1px solid rgba(239,68,68,0.3)',
                                                                padding: '6px 10px',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontWeight: 600,
                                                                fontSize: '0.82rem'
                                                            }}
                                                        >
                                                            거절
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                        {req.updatedAt ? new Date(req.updatedAt).toLocaleString("ko-KR") : "처리 완료"}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

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
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button className={styles.refreshBtn} onClick={fetchAdminData} disabled={isLoading}>
                                <RefreshCw size={14} className={isLoading ? styles.spinning : ''} />
                                주문 DB 동기화
                            </button>
                            <div className={styles.orderFilterGroup}>
                                <select 
                                    value={orderFilter}
                                    onChange={e => setOrderFilter(e.target.value)}
                                    className={styles.roleSelect}
                                >
                                    <option value="ALL">전체 주문 보기 ({allOrders ? allOrders.length : 0}건)</option>
                                    <option value="PENDING_PAYMENT">🟡 입금확인 대기중 (계좌이체)</option>
                                    <option value="PAID">🟢 입금승인/결제완료</option>
                                    <option value="PREPARING">👨‍🍳 상품 준비중</option>
                                    <option value="SHIPPING">🚚 하노이 배송중</option>
                                    <option value="DELIVERED">🎁 배송 완료</option>
                                </select>
                            </div>
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
                                    <th>베트남 택배 / 송장 정보</th>
                                    <th>트랜잭션 ID</th>
                                    <th>입금 확인 & 주문 상태</th>
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
                                            {order.currency === "VND" && (
                                                <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 600, marginTop: '4px' }}>
                                                    🏦 현금 계좌이체
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.shippingSnippet}>
                                                <strong>{order.shippingAddress?.recipient}</strong> ({order.shippingAddress?.phone})
                                                <p>{order.shippingAddress?.address}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem' }}>
                                                {order.shippingInfo?.courier || order.shippingInfo?.trackingNumber ? (
                                                    <>
                                                        <div style={{ fontWeight: 700, color: '#38bdf8' }}>
                                                            {order.shippingInfo.courier || "📦 베트남 택배"}
                                                        </div>
                                                        {order.shippingInfo.trackingNumber && (
                                                            <div style={{ fontSize: '0.78rem' }}>
                                                                송장: <code className={styles.txCode}>{order.shippingInfo.trackingNumber}</code>
                                                            </div>
                                                        )}
                                                        {order.shippingInfo.driverPhone && (
                                                            <div style={{ fontSize: '0.76rem', color: '#9ca3af' }}>
                                                                기사: <a href={`tel:${order.shippingInfo.driverPhone}`} style={{ color: '#60a5fa', textDecoration: 'underline' }}>{order.shippingInfo.driverPhone}</a>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => openShippingModal(order)}
                                                            style={{
                                                                marginTop: '4px',
                                                                background: 'rgba(255,255,255,0.08)',
                                                                border: '1px solid rgba(255,255,255,0.2)',
                                                                color: '#d1d5db',
                                                                borderRadius: '4px',
                                                                padding: '2px 6px',
                                                                fontSize: '0.74rem',
                                                                cursor: 'pointer',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '3px',
                                                                width: 'fit-content'
                                                            }}
                                                        >
                                                            <Edit3 size={11} /> 송장/기사 수정
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => openShippingModal(order)}
                                                        style={{
                                                            background: 'rgba(56, 189, 248, 0.12)',
                                                            border: '1px solid rgba(56, 189, 248, 0.3)',
                                                            color: '#38bdf8',
                                                            borderRadius: '6px',
                                                            padding: '6px 10px',
                                                            fontSize: '0.78rem',
                                                            fontWeight: 700,
                                                            cursor: 'pointer',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <Truck size={13} /> 베트남 택배/송장 입력
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <code className={styles.txCode}>{order.txId}</code>
                                        </td>
                                        <td>
                                            {order.status === "PENDING_PAYMENT" && (
                                                <div style={{ marginBottom: '6px' }}>
                                                    <button
                                                        onClick={() => handleOrderStatusChange(order.orderId, "PAID")}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                                            color: '#fff',
                                                            border: 'none',
                                                            padding: '6px 12px',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontWeight: 700,
                                                            fontSize: '0.8rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <CheckCircle2 size={13} /> 입금 확인 & 승인
                                                    </button>
                                                </div>
                                            )}
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleOrderStatusChange(order.orderId, e.target.value)}
                                                className={`${styles.statusSelect} ${styles[`status_${order.status}`]}`}
                                            >
                                                <option value="PENDING_PAYMENT">🟡 입금확인 대기중</option>
                                                <option value="PAID">🟢 입금승인/결제완료</option>
                                                <option value="PREPARING">👨‍🍳 숙성/포장준비</option>
                                                <option value="SHIPPING">🚚 하노이 배송중</option>
                                                <option value="DELIVERED">🎁 배송완료</option>
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

            {/* 베트남 택배 & 송장 입력 모달 */}
            {shippingModalOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#18181b',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '540px',
                        padding: '24px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        color: '#fff'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: '#fcd34d' }}>
                                <Truck size={20} color="#38bdf8" /> 베트남 현지 택배 & 송장 등록
                            </h3>
                            <button 
                                onClick={() => setShippingModalOrder(null)}
                                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ marginBottom: '14px', fontSize: '0.85rem', color: '#d1d5db', background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '8px' }}>
                            <div>주문 번호: <strong>{shippingModalOrder.orderId}</strong></div>
                            <div>수령인: <strong>{shippingModalOrder.shippingAddress?.recipient}</strong> ({shippingModalOrder.shippingAddress?.phone})</div>
                            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>주소: {shippingModalOrder.shippingAddress?.address}</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#9ca3af' }}>
                                    1. 베트남 현지 배송 수단 / 택배사 선택
                                </label>
                                <select
                                    value={shippingForm.courier}
                                    onChange={e => setShippingForm({ ...shippingForm, courier: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        background: '#27272a',
                                        border: '1px solid #3f3f46',
                                        color: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <option value="🚀 GrabExpress (그랩 퀵)">🚀 GrabExpress (그랩 오토바이/트럭 퀵)</option>
                                    <option value="🛵 Ahamove (아하무브 퀵배송)">🛵 Ahamove (아하무브 퀵배송)</option>
                                    <option value="📦 GHTK (Giao Hàng Tiết Kiệm)">📦 GHTK (Giao Hàng Tiết Kiệm 베트남 택배)</option>
                                    <option value="🚚 ShopeeExpress (SPX)">🚚 ShopeeExpress (SPX)</option>
                                    <option value="📮 ViettelPost (비에텔 포스트)">📮 ViettelPost (비에텔 포스트)</option>
                                    <option value="🚛 VNPost (베트남 우체국)">🚛 VNPost (베트남 우체국)</option>
                                    <option value="❄️ 대한김치 콜드체인 (자체 냉장 직배송)">❄️ 대한김치 콜드체인 (자체 냉장 직배송)</option>
                                    <option value="🚚 기타 현지 택배">🚚 기타 현지 택배</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#9ca3af' }}>
                                    2. 송장 번호 (Mã vận đơn)
                                </label>
                                <input 
                                    type="text"
                                    placeholder="예: GRAB-891023 또는 10293812"
                                    value={shippingForm.trackingNumber}
                                    onChange={e => setShippingForm({ ...shippingForm, trackingNumber: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        background: '#27272a',
                                        border: '1px solid #3f3f46',
                                        color: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#9ca3af' }}>
                                    3. 배송기사 / 택배사 연락처 (Số điện thoại tài xế)
                                </label>
                                <input 
                                    type="text"
                                    placeholder="예: 098-123-4567"
                                    value={shippingForm.driverPhone}
                                    onChange={e => setShippingForm({ ...shippingForm, driverPhone: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        background: '#27272a',
                                        border: '1px solid #3f3f46',
                                        color: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#9ca3af' }}>
                                    4. 배송 특이사항 / 안내 메모 (Ghi chú)
                                </label>
                                <input 
                                    type="text"
                                    placeholder="예: 하노이 미딩 지역 12시 이전 도착 요청"
                                    value={shippingForm.deliveryMemo}
                                    onChange={e => setShippingForm({ ...shippingForm, deliveryMemo: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        background: '#27272a',
                                        border: '1px solid #3f3f46',
                                        color: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#9ca3af' }}>
                                    5. 업데이트할 주문 상태 선택
                                </label>
                                <select
                                    value={shippingForm.targetStatus}
                                    onChange={e => setShippingForm({ ...shippingForm, targetStatus: e.target.value as any })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        background: '#27272a',
                                        border: '1px solid #3f3f46',
                                        color: '#fff',
                                        fontSize: '0.9rem',
                                        fontWeight: 700
                                    }}
                                >
                                    <option value="SHIPPING">🚚 하노이 배송중 (SHIPPING)</option>
                                    <option value="DELIVERED">🎁 배송 완료 (DELIVERED)</option>
                                    <option value="PREPARING">👨‍🍳 상품 준비중 (PREPARING)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button
                                onClick={() => setShippingModalOrder(null)}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#d1d5db',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveShippingInfo}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #16a34a, #15803d)',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <CheckCircle2 size={16} /> 배송 정보 저장 및 상태 업데이트
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
