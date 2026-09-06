// Server-side / in-memory storage for K-MOA Member & Balance DB
// Simulates Firestore collections: 'users', 'kmoa_balances', 'merchant_settlements', 'transactions', 'orders'

import { sendAdminOrderNotification } from "./notifier";

export type UserRole = "SUPER_ADMIN" | "OPERATOR" | "VIP_MEMBER" | "GOLD_MEMBER" | "MEMBER";

export interface UserWalletData {
    uid: string;
    name: string;
    email: string;
    onChainWalletAddress: string;
    hexTokenBalance: number; // in HEX
    kcaPoints: number;       // in KCA Points
    vndBalance: number;      // in VND
    dpPoints: number;        // 대한포인트
    role: UserRole;
    avatar?: string;
    createdAt?: string;
    phone?: string;
}

export interface WalletTransaction {
    id: string;
    uid: string;
    merchantId: string;
    orderId?: string;
    type: "PAYMENT" | "FAUCET" | "REWARD" | "REFUND" | "SETTLEMENT";
    currency: "HEX" | "POINT" | "VND" | "DP";
    amount: number;
    description: string;
    status: "CONFIRMED" | "PENDING" | "FAILED";
    txHash: string;
    timestamp: string;
}

export interface MemberOrder {
    orderId: string;
    uid: string;
    items: {
        productId: number;
        productName: string;
        weight: string;
        quantity: number;
        priceVnd: number;
        priceHex: number;
        image: string;
    }[];
    totalVnd: number;
    totalHex: number;
    paidAmount: number;
    currency: "HEX" | "POINT" | "VND";
    txId: string;
    shippingAddress: {
        recipient: string;
        phone: string;
        address: string;
        memo?: string;
    };
    status: "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED";
    createdAt: string;
}

// Initial mock users database with Super Admin & Operators
const usersDb: Record<string, UserWalletData> = {
    "admin_super_daehan": {
        uid: "admin_super_daehan",
        email: "daguri75@gmail.com",
        name: "최고관리자",
        phone: "010-9999-0000",
        onChainWalletAddress: "0xa4850A83D219b5706D638cC28244EFe2bF8bdb40",
        hexTokenBalance: 95000.0,
        kcaPoints: 120000,
        vndBalance: 85000000,
        dpPoints: 50000,
        role: "SUPER_ADMIN",
        phone: "0702116617",
        createdAt: "2026-08-01T00:00:00Z",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    },
    "operator_hanoi_01": {
        uid: "operator_hanoi_01",
        name: "김하노이 (쇼핑몰 운영자)",
        email: "op.hanoi@daehankimchi.com",
        onChainWalletAddress: "0x89C1aB1234567890abcdef1234567890abcdef12",
        hexTokenBalance: 12500.0,
        kcaPoints: 45000,
        vndBalance: 12000000,
        dpPoints: 18000,
        role: "OPERATOR",
        phone: "0349475948",
        createdAt: "2026-08-10T09:00:00Z",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
    },
    "user_daehan_vip01": {
        uid: "user_daehan_vip01",
        name: "최민준 (VIP 회원)",
        email: "minjun.choi@daehankimchi.com",
        onChainWalletAddress: "0x71C38B12F009a287C9Fe11A65427909F8F813B29",
        hexTokenBalance: 2500.0,
        kcaPoints: 15000,
        vndBalance: 1200000,
        dpPoints: 8500,
        role: "VIP_MEMBER",
        phone: "0702116617",
        createdAt: "2026-08-15T10:00:00Z",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
    },
    "user_hanoi_kca02": {
        uid: "user_hanoi_kca02",
        name: "응우옌 티 마이 (Nguyen Thi Mai)",
        email: "mai.nguyen@kca-vietnam.io",
        onChainWalletAddress: "0xa4850A83D219b5706D638cC28244EFe2bF8bdb40",
        hexTokenBalance: 1200.0,
        kcaPoints: 8400,
        vndBalance: 650000,
        dpPoints: 3200,
        role: "GOLD_MEMBER",
        phone: "0901234567",
        createdAt: "2026-08-20T11:00:00Z"
    },
    "guest_user_demo": {
        uid: "guest_user_demo",
        name: "대한김치 체험 회원",
        email: "demo@daehankimchi.com",
        onChainWalletAddress: "0x3B82F6A10b98124d776b6044bfc00e68c99182a3",
        hexTokenBalance: 800.0,
        kcaPoints: 5000,
        vndBalance: 300000,
        dpPoints: 1500,
        role: "MEMBER",
        phone: "0987654321",
        createdAt: "2026-08-28T15:00:00Z"
    }
};

const transactionsDb: WalletTransaction[] = [
    {
        id: "tx_init_01",
        uid: "user_daehan_vip01",
        merchantId: "kca_ecosystem",
        type: "REWARD",
        currency: "HEX",
        amount: 2500,
        description: "K-MOA 대한김치 가입 기념 충전머니 지급",
        status: "CONFIRMED",
        txHash: "0x8fa928bc19d08e82710bb8a72b14c3e89a0123ef456789abcdef0123456789ab",
        timestamp: "2026-08-20T10:00:00Z"
    },
    {
        id: "tx_init_02",
        uid: "user_daehan_vip01",
        merchantId: "daehan_kimchi_store",
        orderId: "ORD-20260825-9912",
        type: "PAYMENT",
        currency: "HEX",
        amount: 180,
        description: "포기김치 1Kg + 깍두기 1Kg K-MOA 머니 결제",
        status: "CONFIRMED",
        txHash: "0x98ab123ef0123456789abcdef0123456789ab8fa928bc19d08e82710bb8a72b1",
        timestamp: "2026-08-25T14:32:10Z"
    },
    {
        id: "tx_init_03",
        uid: "user_hanoi_kca02",
        merchantId: "daehan_kimchi_store",
        orderId: "ORD-20260829-1044",
        type: "PAYMENT",
        currency: "HEX",
        amount: 130,
        description: "실비김치 1Kg K-MOA 머니 결제",
        status: "CONFIRMED",
        txHash: "0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
        timestamp: "2026-08-29T16:10:00Z"
    }
];

const ordersDb: MemberOrder[] = [
    {
        orderId: "ORD-20260825-9912",
        uid: "user_daehan_vip01",
        items: [
            {
                productId: 1,
                productName: "포기김치 (Pogi Kimchi) 1Kg",
                weight: "1Kg",
                quantity: 1,
                priceVnd: 90000,
                priceHex: 90,
                image: "/images/products/pogi.jpg"
            },
            {
                productId: 3,
                productName: "깍두기 (Kkakdugi) 1Kg",
                weight: "1Kg",
                quantity: 1,
                priceVnd: 100000,
                priceHex: 90,
                image: "/images/products/kkakdugi.jpg"
            }
        ],
        totalVnd: 180000,
        totalHex: 180,
        paidAmount: 180,
        currency: "HEX",
        txId: "tx_init_02",
        shippingAddress: {
            recipient: "최민준",
            phone: "0702116617",
            address: "Hanoi, Nam Tu Liem, My Dinh Song Da, Villa #12",
            memo: "문 앞 부재 시 경비실에 맡겨주세요."
        },
        status: "DELIVERED",
        createdAt: "2026-08-25T14:32:10Z"
    },
    {
        orderId: "ORD-20260829-1044",
        uid: "user_hanoi_kca02",
        items: [
            {
                productId: 13,
                productName: "실비김치 (Silbi Kimchi) 1Kg",
                weight: "1Kg",
                quantity: 1,
                priceVnd: 130000,
                priceHex: 130,
                image: "/images/products/silbi.jpg"
            }
        ],
        totalVnd: 130000,
        totalHex: 130,
        paidAmount: 130,
        currency: "HEX",
        txId: "tx_init_03",
        shippingAddress: {
            recipient: "Nguyen Thi Mai",
            phone: "0901234567",
            address: "Keangnam Landmark 72, Pham Hung, Hanoi",
            memo: "로비에서 연락 부탁드립니다."
        },
        status: "SHIPPING",
        createdAt: "2026-08-29T16:10:00Z"
    }
];

// User & Wallet Functions
export function getUserWallet(uid: string): UserWalletData {
    if (!usersDb[uid]) {
        usersDb[uid] = {
            uid,
            name: `회원_${uid.slice(-4)}`,
            email: `${uid}@daehankimchi.com`,
            onChainWalletAddress: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 6)}`,
            hexTokenBalance: 1000.0,
            kcaPoints: 5000,
            vndBalance: 300000,
            dpPoints: 2000,
            role: "MEMBER",
            createdAt: new Date().toISOString()
        };
    }
    return usersDb[uid];
}

export function registerOrLoginGoogleUser(googleData: {
    email: string;
    name: string;
    avatar?: string;
    sub?: string;
}): UserWalletData {
    const safeUid = `google_${(googleData.email || "user").replace(/[^a-zA-Z0-9]/g, "_")}`;
    
    if (!usersDb[safeUid]) {
        usersDb[safeUid] = {
            uid: safeUid,
            name: googleData.name || "Google 회원",
            email: googleData.email,
            avatar: googleData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            onChainWalletAddress: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 6)}`,
            hexTokenBalance: 2000.0,
            kcaPoints: 10000,
            vndBalance: 500000,
            dpPoints: 3000,
            role: googleData.email === "daguri75@gmail.com" ? "SUPER_ADMIN" : "VIP_MEMBER",
            createdAt: new Date().toISOString()
        };
    } else {
        if (googleData.name) usersDb[safeUid].name = googleData.name;
        if (googleData.avatar) usersDb[safeUid].avatar = googleData.avatar;
        if (googleData.email === "daguri75@gmail.com") usersDb[safeUid].role = "SUPER_ADMIN";
    }
    return usersDb[safeUid];
}

export function getAllUsers(): UserWalletData[] {
    return Object.values(usersDb);
}

export function updateUserRole(adminUid: string, targetUid: string, newRole: UserRole): { success: boolean; error?: string; user?: UserWalletData } {
    const admin = usersDb[adminUid];
    if (!admin || admin.role !== "SUPER_ADMIN") {
        return { success: false, error: "최고 관리자(SUPER_ADMIN)만 운영자 권한을 변경할 수 있습니다." };
    }

    const target = usersDb[targetUid];
    if (!target) {
        return { success: false, error: "해당 회원을 찾을 수 없습니다." };
    }

    target.role = newRole;
    return { success: true, user: target };
}

export function updateUserBalance(adminUid: string, targetUid: string, updates: { hex?: number; kcaPoints?: number; vnd?: number; dp?: number }): { success: boolean; error?: string; user?: UserWalletData } {
    const admin = usersDb[adminUid];
    if (!admin || (admin.role !== "SUPER_ADMIN" && admin.role !== "OPERATOR")) {
        return { success: false, error: "관리자 권한이 필요합니다." };
    }

    const target = usersDb[targetUid];
    if (!target) return { success: false, error: "해당 회원을 찾을 수 없습니다." };

    if (updates.hex !== undefined) target.hexTokenBalance = Number(updates.hex);
    if (updates.kcaPoints !== undefined) target.kcaPoints = Number(updates.kcaPoints);
    if (updates.vnd !== undefined) target.vndBalance = Number(updates.vnd);
    if (updates.dp !== undefined) target.dpPoints = Number(updates.dp);

    return { success: true, user: target };
}

export function updateOrderStatus(orderId: string, status: "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED"): { success: boolean; error?: string; order?: MemberOrder } {
    const order = ordersDb.find(o => o.orderId === orderId);
    if (!order) return { success: false, error: "주문을 찾을 수 없습니다." };
    order.status = status;
    return { success: true, order };
}
export function executePayment(params: {
    uid: string;
    merchantId: string;
    currency: "HEX" | "POINT" | "VND";
    amount: number;
    orderId: string;
    items?: any[];
    shippingAddress?: any;
}): { success: boolean; error?: string; transactionId?: string; receipt?: any } {
    const user = getUserWallet(params.uid);
    const amount = Number(params.amount);

    if (isNaN(amount) || amount <= 0) {
        return { success: false, error: "유효하지 않은 결제 금액입니다." };
    }

    // Check balance
    if (params.currency === "HEX") {
        if (user.hexTokenBalance < amount) {
            return {
                success: false,
                error: `K-MOA 충전머니 잔액이 부족합니다. (보유: ${user.hexTokenBalance.toLocaleString()} 머니, 필요: ${amount.toLocaleString()} 머니)`
            };
        }
        user.hexTokenBalance = Number((user.hexTokenBalance - amount).toFixed(2));
    } else if (params.currency === "POINT") {
        if (user.kcaPoints < amount) {
            return {
                success: false,
                error: `K-MOA 포인트 잔액이 부족합니다. (보유: ${user.kcaPoints.toLocaleString()} P, 필요: ${amount.toLocaleString()} P)`
            };
        }
        user.kcaPoints = Math.max(0, user.kcaPoints - amount);
    } else if (params.currency === "VND") {
        if (user.vndBalance < amount) {
            return {
                success: false,
                error: `VND 잔액이 부족합니다. (보유: ${user.vndBalance.toLocaleString()} VND, 필요: ${amount.toLocaleString()} VND)`
            };
        }
        user.vndBalance = Math.max(0, user.vndBalance - amount);
    } else {
        return { success: false, error: "지원하지 않는 통화입니다." };
    }

    // 5% DP Reward calculation for K-MOA money payment
    const earnedDp = Math.round(amount * (params.currency === "HEX" ? 50 : 0.05));
    user.dpPoints = (user.dpPoints || 0) + earnedDp;

    const txId = `KMOA-PAY-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txHash = `kmoa_pay_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const timestamp = new Date().toISOString();

    const txRecord: WalletTransaction = {
        id: txId,
        uid: params.uid,
        merchantId: params.merchantId || "daehan_kimchi_store",
        orderId: params.orderId,
        type: "PAYMENT",
        currency: params.currency,
        amount: amount,
        description: `대한김치 쇼핑몰 결제 (${params.orderId})`,
        status: "CONFIRMED",
        txHash,
        timestamp
    };
    transactionsDb.unshift(txRecord);

    if (params.items && params.items.length > 0) {
        const newOrder = {
            orderId: params.orderId,
            uid: params.uid,
            items: params.items,
            totalVnd: params.currency === "HEX" ? amount * 1000 : amount,
            totalHex: params.currency === "HEX" ? amount : Math.round(amount / 1000),
            paidAmount: amount,
            currency: params.currency,
            txId,
            shippingAddress: params.shippingAddress || {
                recipient: user.name,
                phone: user.phone || "0702116617",
                address: "Hanoi, Vietnam"
            },
            status: "PAID" as const,
            createdAt: timestamp
        };
        ordersDb.unshift(newOrder);

        // 텔레그램 관리자 알림 비동기 전송
        sendAdminOrderNotification(newOrder).catch(err => console.error("알림 발송 실패:", err));
    }

    const remainingBalance = params.currency === "HEX" 
        ? user.hexTokenBalance.toFixed(2)
        : params.currency === "POINT" 
            ? user.kcaPoints.toString() 
            : user.vndBalance.toString();

    return {
        success: true,
        transactionId: txId,
        receipt: {
            orderId: params.orderId,
            paidAmount: amount,
            currency: params.currency,
            remainingBalance,
            txHash,
            earnedDp,
            merchantId: params.merchantId || "daehan_kimchi_store",
            timestamp
        }
    };
}

export function faucetWallet(uid: string, hexAmount: number = 500): { success: boolean; newBalance: number } {
    const user = getUserWallet(uid);
    user.hexTokenBalance = Number((user.hexTokenBalance + hexAmount).toFixed(2));

    const txId = `tx_faucet_${Date.now()}`;
    transactionsDb.unshift({
        id: txId,
        uid,
        merchantId: "kca_faucet",
        type: "FAUCET",
        currency: "HEX",
        amount: hexAmount,
        description: `K-MOA 대한김치 충전머니 ${hexAmount} 추가 지급`,
        status: "CONFIRMED",
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: new Date().toISOString()
    });

    return { success: true, newBalance: user.hexTokenBalance };
}

export function getUserTransactions(uid: string): WalletTransaction[] {
    return transactionsDb.filter(t => t.uid === uid);
}

export function getAllTransactions(): WalletTransaction[] {
    return transactionsDb;
}

export function getUserOrders(uid: string): MemberOrder[] {
    return ordersDb.filter(o => o.uid === uid);
}

export function getAllOrders(): MemberOrder[] {
    return ordersDb;
}

export function verifyTransaction(txHash: string, orderId?: string): { verified: boolean; transaction?: WalletTransaction; order?: MemberOrder } {
    const tx = transactionsDb.find(t => t.txHash.toLowerCase() === txHash.toLowerCase() || t.id === txHash);
    const order = orderId ? ordersDb.find(o => o.orderId === orderId) : (tx?.orderId ? ordersDb.find(o => o.orderId === tx.orderId) : undefined);
    
    if (tx) {
        return { verified: true, transaction: tx, order };
    }
    return { verified: false };
}

export function getAdminStats() {
    const totalHexSales = ordersDb
        .filter(o => o.currency === "HEX")
        .reduce((sum, o) => sum + o.paidAmount, 0);
    const totalVndSales = ordersDb
        .filter(o => o.currency === "VND")
        .reduce((sum, o) => sum + o.paidAmount, 0) + (totalHexSales * 1000);
    
    return {
        totalHexSales,
        totalVndSales,
        totalOrders: ordersDb.length,
        pendingShipping: ordersDb.filter(o => o.status === "PAID" || o.status === "PREPARING").length,
        deliveredOrders: ordersDb.filter(o => o.status === "DELIVERED").length,
        totalUsers: Object.keys(usersDb).length,
        operatorCount: Object.values(usersDb).filter(u => u.role === "OPERATOR").length,
        superAdminCount: Object.values(usersDb).filter(u => u.role === "SUPER_ADMIN").length,
        recentOrders: ordersDb.slice(0, 5),
        recentTransactions: transactionsDb.slice(0, 5)
    };
}
