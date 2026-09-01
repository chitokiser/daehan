// Server-side / in-memory storage for KCA Member & Wallet DB
// Simulates Firestore collections: 'users', 'k_culture_balances', 'merchant_settlements', 'transactions'

export interface UserWalletData {
    uid: string;
    name: string;
    email: string;
    onChainWalletAddress: string;
    hexTokenBalance: number; // in HEX
    kcaPoints: number;       // in KCA Points
    vndBalance: number;      // in VND
    dpPoints: number;        // 대한포인트
    role: string;
    avatar?: string;
}

export interface WalletTransaction {
    id: string;
    uid: string;
    merchantId: string;
    orderId?: string;
    type: "PAYMENT" | "FAUCET" | "REWARD" | "REFUND";
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

// Initial mock users database
const usersDb: Record<string, UserWalletData> = {
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
        role: "GOLD_MEMBER"
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
        role: "MEMBER"
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
        description: "KCA 발효 미식 생태계 가입 기념 HEX 에어드롭",
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
        description: "포기김치 1Kg + 깍두기 1Kg HEX 토큰 결제",
        status: "CONFIRMED",
        txHash: "0x98ab123ef0123456789abcdef0123456789ab8fa928bc19d08e82710bb8a72b1",
        timestamp: "2026-08-25T14:32:10Z"
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
    }
];

// Helper functions
export function getUserWallet(uid: string): UserWalletData {
    if (!usersDb[uid]) {
        // Create new user wallet on demand
        usersDb[uid] = {
            uid,
            name: `회원_${uid.slice(-4)}`,
            email: `${uid}@daehankimchi.com`,
            onChainWalletAddress: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 6)}`,
            hexTokenBalance: 1000.0,
            kcaPoints: 5000,
            vndBalance: 300000,
            dpPoints: 2000,
            role: "MEMBER"
        };
    }
    return usersDb[uid];
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
                error: `HEX 토큰 잔액이 부족합니다. (보유: ${user.hexTokenBalance.toFixed(2)} HEX, 필요: ${amount.toFixed(2)} HEX)`
            };
        }
        user.hexTokenBalance = Number((user.hexTokenBalance - amount).toFixed(2));
    } else if (params.currency === "POINT") {
        if (user.kcaPoints < amount) {
            return {
                success: false,
                error: `KCA 포인트 잔액이 부족합니다. (보유: ${user.kcaPoints} P, 필요: ${amount} P)`
            };
        }
        user.kcaPoints -= Math.round(amount);
    } else if (params.currency === "VND") {
        if (user.vndBalance < amount) {
            return {
                success: false,
                error: `VND 잔액이 부족합니다. (보유: ${user.vndBalance.toLocaleString()} VND, 필요: ${amount.toLocaleString()} VND)`
            };
        }
        user.vndBalance -= Math.round(amount);
    } else {
        return { success: false, error: "지원하지 않는 통화입니다." };
    }

    // Add 5% DP 대한포인트
    const earnedDp = Math.round(amount * 5);
    user.dpPoints += earnedDp;

    const txId = `tx_${params.currency.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
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
        ordersDb.unshift({
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
                phone: "0702116617",
                address: "Hanoi, Vietnam"
            },
            status: "PAID",
            createdAt: timestamp
        });
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
        description: `KCA 테스트넷 HEX 토큰 ${hexAmount} 에어드롭 충전`,
        status: "CONFIRMED",
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: new Date().toISOString()
    });

    return { success: true, newBalance: user.hexTokenBalance };
}

export function getUserTransactions(uid: string): WalletTransaction[] {
    return transactionsDb.filter(t => t.uid === uid);
}

export function getUserOrders(uid: string): MemberOrder[] {
    return ordersDb.filter(o => o.uid === uid);
}
