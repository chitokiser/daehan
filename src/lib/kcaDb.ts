import { getAdminDb } from './firebaseAdmin';
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
    level?: number;
    exp?: number;
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

export interface ChargeRequest {
    requestId: string;
    uid: string;
    userName: string;
    userEmail: string;
    amount: number;
    depositorName: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    approvedAt?: string;
}

export const USERS_COL = 'users';
export const TRANSACTIONS_COL = 'transactions';
export const ORDERS_COL = 'orders';
export const CHARGE_REQUESTS_COL = 'chargeRequests';

// Helper to safely interact with firestore or fail gracefully if not configured
export function getDb() {
    return getAdminDb();
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
            moneyBalance: 0,
            pointBalance: 0,
            vndBalance: 0,
            dpPoints: 0,
            level: 1,
            exp: 0,
            role: "MEMBER",
            mentees: [],
            createdAt: new Date().toISOString()
        };
        await db.collection(USERS_COL).doc(uid).set(newUser);
        return newUser;
    }
    
    const data = docSnap.data() as UserWalletData;
    return {
        ...data,
        level: data.level || 1,
        exp: data.exp !== undefined ? data.exp : 0
    };
}

export async function registerOrLoginGoogleUser(googleData: {
    email: string;
    name: string;
    avatar?: string;
    sub?: string;
    referrerUid?: string;
    termsAgreed?: boolean;
}): Promise<{ success: boolean; user?: UserWalletData; error?: string }> {
    const db = getDb();
    const safeUid = `google_${(googleData.email || "user").replace(/[^a-zA-Z0-9]/g, "_")}`;
    
    const userRef = db.collection(USERS_COL).doc(safeUid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
        // 신규 회원인 경우 반드시 약관 동의(termsAgreed === true) 필요
        if (!googleData.termsAgreed && googleData.email !== "daguri75@gmail.com") {
            return {
                success: false,
                error: "NEW_USER_TERMS_REQUIRED"
            };
        }

        let role: UserRole = "VIP_MEMBER";
        if (googleData.email === "daguri75@gmail.com") role = "SUPER_ADMIN";

        // 추천인 파라미터가 없거나 빈 경우 기본 추천인(daguri75@gmail.com)으로 설정
        const effectiveReferrer = (googleData.referrerUid && googleData.referrerUid.trim()) ? googleData.referrerUid.trim() : "daguri75@gmail.com";

        let validReferrer: string | null = null;
        if (effectiveReferrer) {
            const inputRef = effectiveReferrer;
            
            // 1. Direct doc lookup by UID
            const refSnap1 = await db.collection(USERS_COL).doc(inputRef).get();
            if (refSnap1.exists) {
                validReferrer = inputRef;
            } else {
                // 2. Google UID format match (e.g. "daguri75@gmail.com" -> "google_daguri75_gmail_com")
                const googleFormattedUid = `google_${inputRef.replace(/[^a-zA-Z0-9]/g, "_")}`;
                const refSnap2 = await db.collection(USERS_COL).doc(googleFormattedUid).get();
                if (refSnap2.exists) {
                    validReferrer = googleFormattedUid;
                } else {
                    // 3. Search by email field
                    const emailSnap = await db.collection(USERS_COL).where("email", "==", inputRef).limit(1).get();
                    if (!emailSnap.empty) {
                        validReferrer = emailSnap.docs[0].id;
                    } else if (inputRef === "daguri75@gmail.com" || inputRef === "daguri75" || inputRef === "admin_super_daehan") {
                        // 4. Initial Seed Super Admin Fallback (daguri75@gmail.com)
                        const superAdminUid = "google_daguri75_gmail_com";
                        await db.collection(USERS_COL).doc(superAdminUid).set({
                            uid: superAdminUid,
                            name: "dao hex (최고관리자)",
                            email: "daguri75@gmail.com",
                            avatar: "https://lh3.googleusercontent.com/a/default-user",
                            onChainWalletAddress: "0x700004461261daehanadmin",
                            moneyBalance: 0,
                            pointBalance: 0,
                            vndBalance: 0,
                            dpPoints: 0,
                            level: 1,
                            exp: 0,
                            role: "SUPER_ADMIN",
                            mentees: [],
                            createdAt: new Date().toISOString()
                        }, { merge: true });
                        validReferrer = superAdminUid;
                    }
                }
            }

            if (!validReferrer) {
                return { success: false, error: `입력하신 추천인 [${inputRef}]을 찾을 수 없습니다. 정확한 추천인 이메일(예: daguri75@gmail.com) 또는 코드를 입력해주세요.` };
            }
        }
        
        // 예외: 최고 관리자 계정(SUPER_ADMIN: daguri75@gmail.com)만 추천인 없이 가입 가능
        const isException = role === "SUPER_ADMIN";
        if (!isException && !validReferrer) {
            // 기본값 설정으로 여기까지 오지 않지만 보완 코드 유지
            validReferrer = "google_daguri75_gmail_com";
        }

        const newUser: UserWalletData = {
            uid: safeUid,
            name: googleData.name || "Google 회원",
            email: googleData.email,
            avatar: googleData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            onChainWalletAddress: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 6)}`,
            moneyBalance: 0,
            pointBalance: 0,
            vndBalance: 0,
            dpPoints: 0,
            role: role,
            ...(validReferrer && { referrerUid: validReferrer }),
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
        
        // DP 리워드 지급 (신규회원 1000 DP, 추천인 500 DP)
        await grantDaehanPoint(safeUid, 1000, "신규 회원가입 보상 (1,000 DP)", "REWARD");
        newUser.dpPoints = (newUser.dpPoints || 0) + 1000;
        
        if (validReferrer) {
            await grantDaehanPoint(validReferrer, 500, `친구 추천 보상 (${newUser.name} 가입)`, "REFERRAL_BONUS");
        }
        
        return { success: true, user: newUser };
    } else {
        const updates: any = {};
        if (googleData.name) updates.name = googleData.name;
        if (googleData.avatar) updates.avatar = googleData.avatar;
        if (googleData.email === "daguri75@gmail.com") updates.role = "SUPER_ADMIN";
        
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

    const earnedDp = Math.round(amount * (params.currency === "MONEY" ? 100 : 0.1));
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
    const snapshot = await db.collection(TRANSACTIONS_COL).where("uid", "==", uid).get();
    const docs = snapshot.docs.map(doc => doc.data() as WalletTransaction);
    return docs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getAllTransactions(): Promise<WalletTransaction[]> {
    const db = getDb();
    const snapshot = await db.collection(TRANSACTIONS_COL).orderBy("timestamp", "desc").limit(50).get();
    return snapshot.docs.map(doc => doc.data() as WalletTransaction);
}

export async function getUserOrders(uid: string): Promise<MemberOrder[]> {
    const db = getDb();
    const snapshot = await db.collection(ORDERS_COL).where("uid", "==", uid).get();
    const docs = snapshot.docs.map(doc => doc.data() as MemberOrder);
    return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

export async function grantDaehanPoint(uid: string, amount: number, description: string, type: "REWARD" | "REFERRAL_BONUS" | "FAUCET" = "REWARD"): Promise<{ success: boolean; newBalance?: number; error?: string }> {
    const db = getDb();
    const userRef = db.collection(USERS_COL).doc(uid);
    
    try {
        const newBalance = await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) throw new Error("사용자를 찾을 수 없습니다.");
            
            const user = userDoc.data() as UserWalletData;
            const updatedDp = (user.dpPoints || 0) + amount;
            
            transaction.update(userRef, { dpPoints: updatedDp });
            
            const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const txRef = db.collection(TRANSACTIONS_COL).doc(txId);
            
            transaction.set(txRef, {
                id: txId,
                uid,
                merchantId: "daehan_loyalty",
                type,
                currency: "DP",
                amount,
                description,
                status: "CONFIRMED",
                txHash: `0x${Math.random().toString(16).substring(2)}`,
                timestamp: new Date().toISOString()
            });
            
            return updatedDp;
        });
        
        return { success: true, newBalance };
    } catch (e: any) {
        console.error("Failed to grant DP:", e);
        return { success: false, error: e.message };
    }
}

export async function convertDpToMoney(uid: string, dpAmount: number): Promise<{ success: boolean; error?: string; convertedMoney?: number; newDp?: number; newMoney?: number }> {
    try {
        const db = getDb();
        const user = await getUserWallet(uid);
        const currentDp = user.dpPoints || 0;
        if (currentDp < dpAmount) return { success: false, error: "DP 잔액이 부족합니다." };
        if (dpAmount <= 0) return { success: false, error: "전환할 올바른 DP 수량을 입력해 주세요." };

        const userLevel = user.level || 1;
        // 전환 공식: 전환 머니 = DP * (레벨 / 10)
        const conversionRate = userLevel / 10;
        const convertedMoney = Math.floor(dpAmount * conversionRate);

        const newDp = currentDp - dpAmount;
        const newMoney = (user.moneyBalance || 0) + convertedMoney;

        const userRef = db.collection(USERS_COL).doc(uid);
        await userRef.set({
            dpPoints: newDp,
            moneyBalance: newMoney
        }, { merge: true });

        const txId = `tx_convert_dp_${Date.now()}`;
        try {
            await db.collection(TRANSACTIONS_COL).doc(txId).set({
                id: txId,
                uid,
                merchantId: "daehan_ecosystem",
                type: "REWARD",
                currency: "MONEY",
                amount: convertedMoney,
                description: `DP ${dpAmount.toLocaleString()} DP -> 충전머니 ${convertedMoney.toLocaleString()} 머니 전환 (레벨 ${userLevel}, 전환율 ${userLevel * 10}%)`,
                status: "CONFIRMED",
                txHash: `0x${Math.random().toString(16).substring(2)}`,
                timestamp: new Date().toISOString()
            });
        } catch {}

        return { success: true, convertedMoney, newDp, newMoney };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function levelUpUser(uid: string): Promise<{ success: boolean; error?: string; newLevel?: number; newExp?: number }> {
    try {
        const db = getDb();
        const user = await getUserWallet(uid);
        const currentLevel = user.level || 1;
        const currentExp = user.exp !== undefined ? user.exp : 15000;
        // 레벨업 공식: 현재레벨 제곱 X 10,000 EXP
        const requiredExp = Math.pow(currentLevel, 2) * 10000;

        if (currentExp < requiredExp) {
            return { 
                success: false, 
                error: `레벨업에 필요한 EXP가 부족합니다. (필요: ${requiredExp.toLocaleString()} EXP, 보유: ${currentExp.toLocaleString()} EXP)` 
            };
        }

        const newLevel = currentLevel + 1;
        const newExp = currentExp - requiredExp;

        const userRef = db.collection(USERS_COL).doc(uid);
        await userRef.set({
            level: newLevel,
            exp: newExp
        }, { merge: true });

        return { success: true, newLevel, newExp };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function purgeAllUsersExceptSuperAdmin(): Promise<{ success: boolean; deletedCount: number; error?: string }> {
    try {
        const db = getDb();
        const usersSnap = await db.collection(USERS_COL).get();
        let deletedCount = 0;

        for (const doc of usersSnap.docs) {
            const data = doc.data() as UserWalletData;
            const email = (data.email || "").toLowerCase();
            const uid = doc.id;

            // Keep daguri75@gmail.com (Super Admin)
            if (email === "daguri75@gmail.com" || uid === "google_daguri75_gmail_com" || uid === "admin_super_daehan") {
                await doc.ref.set({
                    uid: "google_daguri75_gmail_com",
                    name: "dao hex (최고관리자)",
                    email: "daguri75@gmail.com",
                    avatar: data.avatar || "https://lh3.googleusercontent.com/a/default-user",
                    onChainWalletAddress: "0x700004461261daehanadmin",
                    moneyBalance: 0,
                    pointBalance: 0,
                    vndBalance: 0,
                    dpPoints: 0,
                    level: 1,
                    exp: 0,
                    role: "SUPER_ADMIN",
                    mentees: []
                }, { merge: true });
            } else {
                await doc.ref.delete();
                deletedCount++;
            }
        }

        // Ensure root super admin daguri75@gmail.com exists
        const superAdminUid = "google_daguri75_gmail_com";
        const superSnap = await db.collection(USERS_COL).doc(superAdminUid).get();
        if (!superSnap.exists) {
            await db.collection(USERS_COL).doc(superAdminUid).set({
                uid: superAdminUid,
                name: "dao hex (최고관리자)",
                email: "daguri75@gmail.com",
                avatar: "https://lh3.googleusercontent.com/a/default-user",
                onChainWalletAddress: "0x700004461261daehanadmin",
                moneyBalance: 0,
                pointBalance: 0,
                vndBalance: 0,
                dpPoints: 0,
                level: 1,
                exp: 0,
                role: "SUPER_ADMIN",
                mentees: [],
                createdAt: new Date().toISOString()
            });
        }

        // Clean up charge requests
        const reqsSnap = await db.collection(CHARGE_REQUESTS_COL).get();
        for (const rDoc of reqsSnap.docs) {
            await rDoc.ref.delete();
        }

        return { success: true, deletedCount };
    } catch (e: any) {
        console.error("Purge error:", e);
        return { success: false, deletedCount: 0, error: e.message };
    }
}

export async function resetAllUserWallets(): Promise<{ success: boolean; updatedCount: number; error?: string }> {
    const res = await purgeAllUsersExceptSuperAdmin();
    return { success: res.success, updatedCount: res.deletedCount, error: res.error };
}

export async function createChargeRequest(uid: string, amount: number, depositorName: string): Promise<{ success: boolean; request?: ChargeRequest; error?: string }> {
    try {
        const db = getDb();
        const user = await getUserWallet(uid);
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        
        const newReq: ChargeRequest = {
            requestId,
            uid,
            userName: user.name,
            userEmail: user.email,
            amount: Number(amount),
            depositorName,
            status: "PENDING",
            createdAt: new Date().toISOString()
        };

        await db.collection(CHARGE_REQUESTS_COL).doc(requestId).set(newReq);
        return { success: true, request: newReq };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getUserChargeRequests(uid: string): Promise<ChargeRequest[]> {
    try {
        const db = getDb();
        const snap = await db.collection(CHARGE_REQUESTS_COL).get();
        const requests = snap.docs
            .map(doc => doc.data() as ChargeRequest)
            .filter(r => r.uid === uid);
        return requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch {
        return [];
    }
}

export async function getAllChargeRequests(): Promise<ChargeRequest[]> {
    try {
        const db = getDb();
        const snap = await db.collection(CHARGE_REQUESTS_COL).get();
        const requests = snap.docs.map(doc => doc.data() as ChargeRequest);
        return requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch {
        return [];
    }
}

export async function approveChargeRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const db = getDb();
        const reqRef = db.collection(CHARGE_REQUESTS_COL).doc(requestId);
        const reqSnap = await reqRef.get();
        if (!reqSnap.exists) return { success: false, error: "신청 건을 찾을 수 없습니다." };

        const reqData = reqSnap.data() as ChargeRequest;
        if (reqData.status !== "PENDING") return { success: false, error: "이미 처리 완료된 신청 건입니다." };

        // 1. Update ChargeRequest status
        await reqRef.set({
            status: "APPROVED",
            approvedAt: new Date().toISOString()
        }, { merge: true });

        // 2. Add moneyBalance to user
        const userRef = db.collection(USERS_COL).doc(reqData.uid);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            const userData = userDoc.data() as UserWalletData;
            const newMoney = (userData.moneyBalance || 0) + reqData.amount;
            await userRef.set({ moneyBalance: newMoney }, { merge: true });
        }

        // 3. Log transaction
        const txId = `tx_charge_${Date.now()}`;
        try {
            await db.collection(TRANSACTIONS_COL).doc(txId).set({
                id: txId,
                uid: reqData.uid,
                merchantId: "daehan_bank_charge",
                type: "FAUCET",
                currency: "MONEY",
                amount: reqData.amount,
                description: `계좌 입금 확인 머니 충전 완료 (입금자: ${reqData.depositorName})`,
                status: "CONFIRMED",
                txHash: `0x${Math.random().toString(16).substring(2)}`,
                timestamp: new Date().toISOString()
            });
        } catch {}

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function rejectChargeRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const db = getDb();
        const reqRef = db.collection(CHARGE_REQUESTS_COL).doc(requestId);
        await reqRef.set({
            status: "REJECTED",
            approvedAt: new Date().toISOString()
        }, { merge: true });
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

