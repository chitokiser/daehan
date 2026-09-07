import { adminDb } from './firebaseAdmin';
import { sendAdminOrderNotification } from "./notifier";

export type UserRole = "SUPER_ADMIN" | "OPERATOR" | "VIP_MEMBER" | "GOLD_MEMBER" | "MEMBER";

export interface UserWalletData {
    uid: string;
    name: string;
    email: string;
    onChainWalletAddress: string;
    moneyBalance: number;
    pointBalance: number;
    vndBalance: number;
    dpPoints: number;
    role: UserRole;
    referrerUid?: string;
    mentees?: string[];
    avatar?: string;
    createdAt?: string;
    phone?: string;
}

export interface WalletTransaction {
    id: string;
    uid: string;
    merchantId: string;
    orderId?: string;
    type: "PAYMENT" | "FAUCET" | "REWARD" | "REFUND" | "SETTLEMENT" | "REFERRAL_BONUS";
    currency: "MONEY" | "POINT" | "VND" | "DP";
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
        priceMoney: number;
        image: string;
    }[];
    totalVnd: number;
    totalMoney: number;
    paidAmount: number;
    currency: "MONEY" | "POINT" | "VND";
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

const USERS_COL = 'users';
const TRANSACTIONS_COL = 'transactions';
const ORDERS_COL = 'orders';

// Helper to safely interact with firestore or fail gracefully if not configured
function getDb() {
    if (!adminDb) throw new Error("Firebase Admin DB is not initialized.");
    return adminDb;
}

export async function getUserWallet(uid: string): Promise<UserWalletData> {
    const db = getDb();
    const docSnap = await db.collection(USERS_COL).doc(uid).get();
    
    if (!docSnap.exists) {
        // Create default user if not exists
        const newUser: UserWalletData = {
            uid,
            name: `회원_${uid.slice(-4)}`,
            email: `${uid}@daehankimchi.com`,
            onChainWalletAddress: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 6)}`,
            moneyBalance: 1000.0,
            pointBalance: 5000,
            vndBalance: 300000,
            dpPoints: 2000,
            role: "MEMBER",
            mentees: [],
            createdAt: new Date().toISOString()
        };
        await db.collection(USERS_COL).doc(uid).set(newUser);
        return newUser;
    }
    
    return docSnap.data() as UserWalletData;
}

export async function registerOrLoginGoogleUser(googleData: {
    email: string;
    name: string;
    avatar?: string;
    sub?: string;
    referrerUid?: string;
}): Promise<{ success: boolean; user?: UserWalletData; error?: string }> {
    const db = getDb();
    const safeUid = `google_${(googleData.email || "user").replace(/[^a-zA-Z0-9]/g, "_")}`;
    
    const userRef = db.collection(USERS_COL).doc(safeUid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
        let role: UserRole = "VIP_MEMBER";
        if (googleData.email === "daguri75@gmail.com") role = "SUPER_ADMIN";
        else if (googleData.email === "kfu134252@gmail.com") role = "OPERATOR";

        if (role === "VIP_MEMBER" && !googleData.referrerUid) {
            return { success: false, error: "자체 다단계 보상 시스템 규정에 따라 추천인(멘토) 코드가 반드시 필요합니다." };
        }
        
        let validReferrer: string | null = null;
        if (googleData.referrerUid) {
            const refSnap = await db.collection(USERS_COL).doc(googleData.referrerUid).get();
            if (refSnap.exists) {
                validReferrer = googleData.referrerUid;
            } else if (role === "VIP_MEMBER") {
                return { success: false, error: "유효하지 않은 추천인 코드입니다." };
            }
        }

        const newUser: UserWalletData = {
            uid: safeUid,
            name: googleData.name || "Google 회원",
            email: googleData.email,
            avatar: googleData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            onChainWalletAddress: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 6)}`,
            moneyBalance: role === "OPERATOR" ? 15000.0 : 2000.0,
            pointBalance: role === "OPERATOR" ? 50000 : 10000,
            vndBalance: role === "OPERATOR" ? 15000000 : 500000,
            dpPoints: role === "OPERATOR" ? 20000 : 3000,
            role: role,
            referrerUid: validReferrer || undefined,
            mentees: [],
            createdAt: new Date().toISOString()
        };

        const batch = db.batch();
        batch.set(userRef, newUser);

        if (validReferrer) {
            const refDoc = db.collection(USERS_COL).doc(validReferrer);
            const refData = (await refDoc.get()).data() as UserWalletData;
            batch.update(refDoc, {
                mentees: [...(refData.mentees || []), safeUid]
            });
        }
        await batch.commit();
        return { success: true, user: newUser };
    } else {
        const updates: any = {};
        if (googleData.name) updates.name = googleData.name;
        if (googleData.avatar) updates.avatar = googleData.avatar;
        if (googleData.email === "daguri75@gmail.com") updates.role = "SUPER_ADMIN";
        else if (googleData.email === "kfu134252@gmail.com") updates.role = "OPERATOR";
        
        if (Object.keys(updates).length > 0) {
            await userRef.update(updates);
        }
        const updatedDoc = await userRef.get();
        return { success: true, user: updatedDoc.data() as UserWalletData };
    }
}

export async function getAllUsers(): Promise<UserWalletData[]> {
    const db = getDb();
    const snapshot = await db.collection(USERS_COL).get();
    return snapshot.docs.map(doc => doc.data() as UserWalletData);
}

export async function updateUserRole(adminUid: string, targetUid: string, newRole: UserRole): Promise<{ success: boolean; error?: string; user?: UserWalletData }> {
    const db = getDb();
    const adminDoc = await db.collection(USERS_COL).doc(adminUid).get();
    if (!adminDoc.exists || (adminDoc.data() as UserWalletData).role !== "SUPER_ADMIN") {
        return { success: false, error: "최고 관리자(SUPER_ADMIN)만 운영자 권한을 변경할 수 있습니다." };
    }

    const targetRef = db.collection(USERS_COL).doc(targetUid);
    const targetDoc = await targetRef.get();
    if (!targetDoc.exists) {
        return { success: false, error: "해당 회원을 찾을 수 없습니다." };
    }

    await targetRef.update({ role: newRole });
    const updated = await targetRef.get();
    return { success: true, user: updated.data() as UserWalletData };
}

export async function updateUserBalance(adminUid: string, targetUid: string, updates: { money?: number; pointBalance?: number; vnd?: number; dp?: number }): Promise<{ success: boolean; error?: string; user?: UserWalletData }> {
    const db = getDb();
    const adminDoc = await db.collection(USERS_COL).doc(adminUid).get();
    const adminData = adminDoc.data() as UserWalletData;
    if (!adminDoc.exists || (adminData.role !== "SUPER_ADMIN" && adminData.role !== "OPERATOR")) {
        return { success: false, error: "관리자 권한이 필요합니다." };
    }

    const targetRef = db.collection(USERS_COL).doc(targetUid);
    const targetDoc = await targetRef.get();
    if (!targetDoc.exists) return { success: false, error: "해당 회원을 찾을 수 없습니다." };

    const targetData = targetDoc.data() as UserWalletData;
    const newUpdates: any = {};
    if (updates.money !== undefined) newUpdates.moneyBalance = Number(updates.money);
    if (updates.pointBalance !== undefined) newUpdates.pointBalance = Number(updates.pointBalance);
    if (updates.vnd !== undefined) newUpdates.vndBalance = Number(updates.vnd);
    if (updates.dp !== undefined) newUpdates.dpPoints = Number(updates.dp);

    await targetRef.update(newUpdates);
    const updated = await targetRef.get();
    return { success: true, user: updated.data() as UserWalletData };
}

export async function updateOrderStatus(orderId: string, status: "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED"): Promise<{ success: boolean; error?: string; order?: MemberOrder }> {
    const db = getDb();
    const snapshot = await db.collection(ORDERS_COL).where("orderId", "==", orderId).get();
    if (snapshot.empty) return { success: false, error: "주문을 찾을 수 없습니다." };
    
    const doc = snapshot.docs[0];
    await doc.ref.update({ status });
    const updated = await doc.ref.get();
    return { success: true, order: updated.data() as MemberOrder };
}

export async function distributeReferralRewards(buyerUid: string, amount: number, currency: "MONEY" | "POINT" | "VND") {
    const db = getDb();
    const buyerRef = db.collection(USERS_COL).doc(buyerUid);
    const buyerDoc = await buyerRef.get();
    if (!buyerDoc.exists) return;
    
    const buyer = buyerDoc.data() as UserWalletData;
    const baseRewardAmount = currency === "VND" ? amount / 1000 : amount;

    const buyerReward = Math.floor(baseRewardAmount * 0.1);
    const mentorReward = Math.floor(baseRewardAmount * 0.05);
    const grandMentorReward = Math.floor(baseRewardAmount * 0.02);
    const timestamp = new Date().toISOString();
    const batch = db.batch();

    // 1. 본인 보상
    if (buyerReward > 0) {
        batch.update(buyerRef, { pointBalance: (buyer.pointBalance || 0) + buyerReward });
        const txRef = db.collection(TRANSACTIONS_COL).doc();
        batch.set(txRef, {
            id: txRef.id,
            uid: buyerUid,
            merchantId: "kca_ecosystem",
            type: "REFERRAL_BONUS",
            currency: "POINT",
            amount: buyerReward,
            description: `자체 결제 리워드 (10%)`,
            status: "CONFIRMED",
            txHash: `0x${Math.random().toString(16).substring(2)}`,
            timestamp
        });
    }

    // 2. 멘토 보상
    if (buyer.referrerUid && mentorReward > 0) {
        const mentorRef = db.collection(USERS_COL).doc(buyer.referrerUid);
        const mentorDoc = await mentorRef.get();
        if (mentorDoc.exists) {
            const mentor = mentorDoc.data() as UserWalletData;
            batch.update(mentorRef, { moneyBalance: (mentor.moneyBalance || 0) + mentorReward });
            const txRef = db.collection(TRANSACTIONS_COL).doc();
            batch.set(txRef, {
                id: txRef.id,
                uid: mentor.uid,
                merchantId: "kca_ecosystem",
                type: "REFERRAL_BONUS",
                currency: "MONEY",
                amount: mentorReward,
                description: `멘티 [${buyer.name}] 결제에 따른 멘토 리워드 (5%)`,
                status: "CONFIRMED",
                txHash: `0x${Math.random().toString(16).substring(2)}`,
                timestamp
            });

            // 3. 멘토의 멘토 보상
            if (mentor.referrerUid && grandMentorReward > 0) {
                const gMentorRef = db.collection(USERS_COL).doc(mentor.referrerUid);
                const gMentorDoc = await gMentorRef.get();
                if (gMentorDoc.exists) {
                    const grandMentor = gMentorDoc.data() as UserWalletData;
                    batch.update(gMentorRef, { moneyBalance: (grandMentor.moneyBalance || 0) + grandMentorReward });
                    const txRef2 = db.collection(TRANSACTIONS_COL).doc();
                    batch.set(txRef2, {
                        id: txRef2.id,
                        uid: grandMentor.uid,
                        merchantId: "kca_ecosystem",
                        type: "REFERRAL_BONUS",
                        currency: "MONEY",
                        amount: grandMentorReward,
                        description: `2차 멘티 [${buyer.name}] 결제에 따른 멘토 리워드 (2%)`,
                        status: "CONFIRMED",
                        txHash: `0x${Math.random().toString(16).substring(2)}`,
                        timestamp
                    });
                }
            }
        }
    }
    
    await batch.commit();
}

export async function executePayment(params: {
    uid: string;
    merchantId: string;
    currency: "MONEY" | "POINT" | "VND";
    amount: number;
    orderId: string;
    items?: any[];
    shippingAddress?: any;
}): Promise<{ success: boolean; error?: string; transactionId?: string; receipt?: any }> {
    const db = getDb();
    const userRef = db.collection(USERS_COL).doc(params.uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) return { success: false, error: "사용자 정보를 찾을 수 없습니다." };
    const user = userDoc.data() as UserWalletData;
    const amount = Number(params.amount);

    if (isNaN(amount) || amount <= 0) {
        return { success: false, error: "유효하지 않은 결제 금액입니다." };
    }

    const updates: any = {};
    if (params.currency === "MONEY") {
        if (user.moneyBalance < amount) return { success: false, error: "머니 잔액이 부족합니다." };
        updates.moneyBalance = Number((user.moneyBalance - amount).toFixed(2));
    } else if (params.currency === "POINT") {
        if (user.pointBalance < amount) return { success: false, error: "포인트 잔액이 부족합니다." };
        updates.pointBalance = Math.max(0, user.pointBalance - amount);
    } else if (params.currency === "VND") {
        if (user.vndBalance < amount) return { success: false, error: "VND 잔액이 부족합니다." };
        updates.vndBalance = Math.max(0, user.vndBalance - amount);
    } else {
        return { success: false, error: "지원하지 않는 통화입니다." };
    }

    const earnedDp = Math.round(amount * (params.currency === "MONEY" ? 50 : 0.05));
    updates.dpPoints = (user.dpPoints || 0) + earnedDp;

    const txId = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txHash = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const timestamp = new Date().toISOString();

    const batch = db.batch();
    batch.update(userRef, updates);

    const txRef = db.collection(TRANSACTIONS_COL).doc(txId);
    batch.set(txRef, {
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
    });

    if (params.items && params.items.length > 0) {
        const orderRef = db.collection(ORDERS_COL).doc(params.orderId);
        const newOrder = {
            orderId: params.orderId,
            uid: params.uid,
            items: params.items,
            totalVnd: params.currency === "MONEY" ? amount * 1000 : amount,
            totalMoney: params.currency === "MONEY" ? amount : Math.round(amount / 1000),
            paidAmount: amount,
            currency: params.currency,
            txId,
            shippingAddress: params.shippingAddress || {
                recipient: user.name,
                phone: user.phone || "0702116617",
                address: "Hanoi, Vietnam"
            },
            status: "PAID",
            createdAt: timestamp
        };
        batch.set(orderRef, newOrder);
        // 비동기 알림
        sendAdminOrderNotification(newOrder as MemberOrder).catch(err => console.error(err));
    }

    await batch.commit();

    // 멘토 보상
    await distributeReferralRewards(params.uid, amount, params.currency);

    const remainingBalance = params.currency === "MONEY" 
        ? updates.moneyBalance 
        : params.currency === "POINT" 
            ? updates.pointBalance 
            : updates.vndBalance;

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

export async function faucetWallet(uid: string, moneyAmount: number = 500): Promise<{ success: boolean; newBalance?: number }> {
    const db = getDb();
    const userRef = db.collection(USERS_COL).doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return { success: false };
    
    const user = userDoc.data() as UserWalletData;
    const newBalance = Number((user.moneyBalance + moneyAmount).toFixed(2));
    
    const txId = `tx_faucet_${Date.now()}`;
    const batch = db.batch();
    batch.update(userRef, { moneyBalance: newBalance });
    batch.set(db.collection(TRANSACTIONS_COL).doc(txId), {
        id: txId,
        uid,
        merchantId: "faucet",
        type: "FAUCET",
        currency: "MONEY",
        amount: moneyAmount,
        description: `충전머니 ${moneyAmount} 지급`,
        status: "CONFIRMED",
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: new Date().toISOString()
    });
    await batch.commit();
    return { success: true, newBalance };
}

export async function getUserTransactions(uid: string): Promise<WalletTransaction[]> {
    const db = getDb();
    const snapshot = await db.collection(TRANSACTIONS_COL).where("uid", "==", uid).orderBy("timestamp", "desc").get();
    return snapshot.docs.map(doc => doc.data() as WalletTransaction);
}

export async function getAllTransactions(): Promise<WalletTransaction[]> {
    const db = getDb();
    const snapshot = await db.collection(TRANSACTIONS_COL).orderBy("timestamp", "desc").limit(50).get();
    return snapshot.docs.map(doc => doc.data() as WalletTransaction);
}

export async function getUserOrders(uid: string): Promise<MemberOrder[]> {
    const db = getDb();
    const snapshot = await db.collection(ORDERS_COL).where("uid", "==", uid).orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => doc.data() as MemberOrder);
}

export async function getAllOrders(): Promise<MemberOrder[]> {
    const db = getDb();
    const snapshot = await db.collection(ORDERS_COL).orderBy("createdAt", "desc").limit(50).get();
    return snapshot.docs.map(doc => doc.data() as MemberOrder);
}

export async function verifyTransaction(txHash: string, orderId?: string): Promise<{ verified: boolean; transaction?: WalletTransaction; order?: MemberOrder }> {
    const db = getDb();
    let tx: WalletTransaction | undefined;
    
    const txQuery = await db.collection(TRANSACTIONS_COL).where("txHash", "==", txHash).get();
    if (!txQuery.empty) tx = txQuery.docs[0].data() as WalletTransaction;
    else {
        const txDoc = await db.collection(TRANSACTIONS_COL).doc(txHash).get();
        if (txDoc.exists) tx = txDoc.data() as WalletTransaction;
    }

    let order: MemberOrder | undefined;
    if (orderId || tx?.orderId) {
        const oId = orderId || tx!.orderId;
        const oDoc = await db.collection(ORDERS_COL).doc(oId as string).get();
        if (oDoc.exists) order = oDoc.data() as MemberOrder;
    }
    
    if (tx) return { verified: true, transaction: tx, order };
    return { verified: false };
}

export async function getAdminStats(): Promise<any> {
    const db = getDb();
    // In a real scenario with lots of data, you would use aggregation queries.
    // For MVP, we fetch recent and calculate, or maintain aggregated counters.
    const ordersSnap = await db.collection(ORDERS_COL).get();
    const orders = ordersSnap.docs.map(d => d.data() as MemberOrder);
    
    const usersSnap = await db.collection(USERS_COL).get();
    const users = usersSnap.docs.map(d => d.data() as UserWalletData);
    
    const txSnap = await db.collection(TRANSACTIONS_COL).orderBy("timestamp", "desc").limit(5).get();
    const recentTx = txSnap.docs.map(d => d.data());

    const totalMoneySales = orders.filter(o => o.currency === "MONEY").reduce((sum, o) => sum + o.paidAmount, 0);
    const totalVndSales = orders.filter(o => o.currency === "VND").reduce((sum, o) => sum + o.paidAmount, 0) + (totalMoneySales * 1000);

    return {
        totalMoneySales,
        totalVndSales,
        totalOrders: orders.length,
        pendingShipping: orders.filter(o => o.status === "PAID" || o.status === "PREPARING").length,
        deliveredOrders: orders.filter(o => o.status === "DELIVERED").length,
        totalUsers: users.length,
        operatorCount: users.filter(u => u.role === "OPERATOR").length,
        superAdminCount: users.filter(u => u.role === "SUPER_ADMIN").length,
        recentOrders: orders.sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
        recentTransactions: recentTx
    };
}

export async function convertPointsToKm(uid: string, pointsAmount: number): Promise<{ success: boolean; error?: string; newPoints?: number; newKm?: number }> {
    const db = getDb();
    const userRef = db.collection(USERS_COL).doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return { success: false, error: "사용자를 찾을 수 없습니다." };
    
    const user = userDoc.data() as UserWalletData;
    if (user.pointBalance < pointsAmount) return { success: false, error: "포인트가 부족합니다." };
    
    const moneyAmount = pointsAmount; 
    
    const batch = db.batch();
    batch.update(userRef, {
        pointBalance: user.pointBalance - pointsAmount,
        moneyBalance: user.moneyBalance + moneyAmount
    });
    
    const txId = `tx_convert_${Date.now()}`;
    batch.set(db.collection(TRANSACTIONS_COL).doc(txId), {
        id: txId,
        uid,
        merchantId: "kca_ecosystem",
        type: "REWARD",
        currency: "MONEY",
        amount: moneyAmount,
        description: `포인트 ${pointsAmount.toLocaleString()}P -> 머니 ${moneyAmount.toLocaleString()} 전환`,
        status: "CONFIRMED",
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        timestamp: new Date().toISOString()
    });
    
    await batch.commit();
    
    return { success: true, newPoints: user.pointBalance - pointsAmount, newKm: user.moneyBalance + moneyAmount };
}
