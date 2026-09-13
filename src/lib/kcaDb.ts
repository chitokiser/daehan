import { getAdminDb } from './firebaseAdmin';
import { NotificationService, sendAdminOrderNotification } from "./notifier";

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

export interface ShippingInfo {
    courier?: string; // e.g. GrabExpress, Ahamove, GHTK, ShopeeExpress, ViettelPost, 대한김치 직배송 등
    trackingNumber?: string; // 송장번호 / Mã vận đơn
    driverPhone?: string; // 기사/택배사 연락처
    shippedAt?: string; // 출고 일시
    deliveryMemo?: string; // 배송 특이사항 / 메모
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
    shippingInfo?: ShippingInfo;
    status: "PENDING_PAYMENT" | "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED";
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

export interface SubscriptionData {
    subscriptionId: string;
    uid: string;
    userName?: string;
    userEmail?: string;
    tier: "basic" | "family" | "restaurant";
    tierName: string;
    weight: string;
    kimchiType: string;
    cycle: string;
    monthlyPriceVnd: number;
    originalPriceVnd: number;
    discountPercent: number;
    shippingAddress: {
        recipient: string;
        phone: string;
        address: string;
        memo?: string;
    };
    paymentMethod: string;
    status: "ACTIVE" | "PAUSED" | "CANCELLED";
    createdAt: string;
}

export const USERS_COL = 'users';
export const TRANSACTIONS_COL = 'transactions';
export const ORDERS_COL = 'orders';
export const CHARGE_REQUESTS_COL = 'chargeRequests';
export const SUBSCRIPTIONS_COL = 'subscriptions';

interface InMemoryDoc {
    id: string;
    data: () => any;
    ref?: any;
}

class InMemoryCollection {
    private name: string;
    private static store: Record<string, Record<string, any>> = {};

    constructor(name: string) {
        this.name = name;
        if (!InMemoryCollection.store[name]) {
            InMemoryCollection.store[name] = {};
        }
    }

    private getQuery(items: any[]) {
        const createQuery = (currentItems: any[]): any => {
            const docs: InMemoryDoc[] = currentItems.map((item: any) => ({
                id: item.uid || item.id || item.orderId || item.requestId,
                data: () => item,
                ref: this.doc(item.uid || item.id || item.orderId || item.requestId)
            }));

            return {
                empty: docs.length === 0,
                docs,
                size: docs.length,
                get: async () => ({
                    empty: docs.length === 0,
                    docs,
                    size: docs.length
                }),
                orderBy: (field: string, dir: "asc" | "desc" = "asc") => {
                    const sorted = [...currentItems].sort((a, b) => {
                        const valA = a[field] ?? "";
                        const valB = b[field] ?? "";
                        if (dir === "desc") return valB > valA ? 1 : valB < valA ? -1 : 0;
                        return valA > valB ? 1 : valA < valB ? -1 : 0;
                    });
                    return createQuery(sorted);
                },
                limit: (n: number) => {
                    return createQuery(currentItems.slice(0, n));
                },
                where: (field: string, op: string, value: any) => {
                    const filtered = currentItems.filter((item: any) => {
                        if (op === "==") return item[field] === value;
                        return false;
                    });
                    return createQuery(filtered);
                }
            };
        };

        return createQuery(items);
    }

    doc(id: string) {
        const col = InMemoryCollection.store[this.name];
        return {
            id,
            get: async () => ({
                exists: !!col[id],
                data: () => col[id]
            }),
            set: async (data: any, options?: any) => {
                if (options?.merge) {
                    col[id] = { ...(col[id] || {}), ...data };
                } else {
                    col[id] = { ...data };
                }
            },
            update: async (data: any) => {
                if (col[id]) {
                    col[id] = { ...col[id], ...data };
                }
            },
            delete: async () => {
                delete col[id];
            }
        };
    }

    where(field: string, op: string, value: any) {
        const col = InMemoryCollection.store[this.name];
        return this.getQuery(Object.values(col)).where(field, op, value);
    }

    orderBy(field: string, dir: "asc" | "desc" = "asc") {
        const col = InMemoryCollection.store[this.name];
        return this.getQuery(Object.values(col)).orderBy(field, dir);
    }

    limit(n: number) {
        const col = InMemoryCollection.store[this.name];
        return this.getQuery(Object.values(col)).limit(n);
    }

    async get() {
        const col = InMemoryCollection.store[this.name];
        return this.getQuery(Object.values(col)).get();
    }
}

class InMemoryDb {
    collection(name: string) {
        return new InMemoryCollection(name);
    }
    batch() {
        const ops: Function[] = [];
        return {
            set: (ref: any, data: any) => ops.push(() => ref.set(data)),
            update: (ref: any, data: any) => ops.push(() => ref.update(data)),
            delete: (ref: any) => ops.push(() => ref.delete()),
            commit: async () => {
                for (const op of ops) await op();
            }
        };
    }
    async runTransaction(cb: Function) {
        return cb({
            get: async (ref: any) => ref.get(),
            update: (ref: any, data: any) => ref.update(data),
            set: (ref: any, data: any) => ref.set(data)
        });
    }
}

const fallbackDb = new InMemoryDb();

// Helper to safely interact with firestore or fail gracefully if not configured
export function getDb() {
    try {
        const db = getAdminDb();
        if (db) return db;
    } catch (e) {
        console.warn("Firestore access error, fallback to in-memory store:", e);
    }
    return fallbackDb as any;
}

export async function getUserWallet(uid: string): Promise<UserWalletData> {
    const db = getDb();
    const docSnap = await db.collection(USERS_COL).doc(uid).get();
    
    if (!docSnap.exists) {
        // Create default user if not exists
        const initialRole: UserRole = uid.includes("operator") ? "OPERATOR" : (uid.includes("admin") || uid.includes("super")) ? "SUPER_ADMIN" : "MEMBER";
        const newUser: UserWalletData = {
            uid,
            name: uid.includes("operator") ? "지정 운영자" : uid.includes("admin") ? "최고 관리자" : `회원_${uid.slice(-4)}`,
            email: `${uid}@daehankimchi.com`,
            onChainWalletAddress: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 6)}`,
            moneyBalance: 0,
            pointBalance: 0,
            vndBalance: 0,
            dpPoints: 0,
            level: 1,
            exp: 0,
            role: initialRole,
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
            const refSnap = await refDoc.get();
            if (refSnap.exists) {
                const refData = refSnap.data() as UserWalletData;
                batch.update(refDoc, {
                    mentees: [...(refData?.mentees || []), safeUid]
                });
            }
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
    return snapshot.docs.map((doc: any) => doc.data() as UserWalletData);
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

export async function updateOrderStatus(
    orderId: string, 
    status: "PENDING_PAYMENT" | "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED",
    shippingInfo?: ShippingInfo
): Promise<{ success: boolean; error?: string; order?: MemberOrder }> {
    const db = getDb();
    const snapshot = await db.collection(ORDERS_COL).where("orderId", "==", orderId).get();
    if (snapshot.empty) return { success: false, error: "주문을 찾을 수 없습니다." };
    
    const doc = snapshot.docs[0];
    const existingOrder = doc.data() as any;
    const oldStatus = existingOrder.status;

    const updatePayload: any = { status };
    if (shippingInfo) {
        updatePayload.shippingInfo = {
            ...(existingOrder.shippingInfo || {}),
            ...shippingInfo,
            shippedAt: shippingInfo.shippedAt || new Date().toISOString()
        };
    }

    await doc.ref.update(updatePayload);
    const updated = await doc.ref.get();
    const updatedOrder = updated.data() as MemberOrder;

    // 만약 입금대기(PENDING_PAYMENT) 상태에서 결제확인/승인(PAID, PREPARING, SHIPPING, DELIVERED)으로 변경된 경우:
    if (oldStatus === "PENDING_PAYMENT" && status !== "PENDING_PAYMENT") {
        const totalVndAmount = existingOrder.totalVnd || existingOrder.paidAmount || 0;
        const earnedDp = Math.round(totalVndAmount * 0.1);
        if (earnedDp > 0) {
            await grantDaehanPoint(existingOrder.uid, earnedDp, `[계좌이체 입금확인 완료] ${orderId} 10% 적립`, "REWARD");
        }
        await distributeReferralRewards(existingOrder.uid, totalVndAmount, "VND");
    }

    return { success: true, order: updatedOrder };
}

export async function distributeReferralRewards(buyerUid: string, amount: number, currency: "MONEY" | "POINT" | "VND" | "HEX" | "DP") {
    const db = getDb();
    const buyerRef = db.collection(USERS_COL).doc(buyerUid);
    const buyerDoc = await buyerRef.get();
    if (!buyerDoc.exists) return;
    
    const buyer = buyerDoc.data() as UserWalletData;
    
    let earnedDp = 0;
    if (currency === "DP") {
        earnedDp = amount;
    } else {
        earnedDp = Math.round(amount * 0.1);
    }

    if (earnedDp <= 0) return;

    const mentorDp = Math.floor(earnedDp * 0.5); // 멘토 50% (예: 멘티 100 DP -> 멘토 50 DP)
    const grandMentorDp = Math.floor(earnedDp * 0.2); // 2차 멘토 20% (예: 멘티 100 DP -> 2차 멘토 20 DP)
    const timestamp = new Date().toISOString();
    const batch = db.batch();

    // 멘토 보상 (50% DP & EXP)
    if (buyer.referrerUid && mentorDp > 0) {
        const mentorRef = db.collection(USERS_COL).doc(buyer.referrerUid);
        const mentorDoc = await mentorRef.get();
        if (mentorDoc.exists) {
            const mentor = mentorDoc.data() as UserWalletData;
            batch.update(mentorRef, { 
                dpPoints: (mentor.dpPoints || 0) + mentorDp,
                exp: (mentor.exp !== undefined ? mentor.exp : 0) + mentorDp
            });
            const txRef = db.collection(TRANSACTIONS_COL).doc();
            batch.set(txRef, {
                id: txRef.id,
                uid: mentor.uid,
                merchantId: "daehan_ecosystem",
                type: "REFERRAL_BONUS",
                currency: "DP",
                amount: mentorDp,
                description: `멘티 [${buyer.name || '회원'}] DP 적립에 따른 멘토 리워드 (50% = ${mentorDp.toLocaleString()} DP)`,
                status: "CONFIRMED",
                txHash: `0x${Math.random().toString(16).substring(2)}`,
                timestamp
            });

            // 2차 멘토 보상 (20% DP & EXP)
            if (mentor.referrerUid && grandMentorDp > 0) {
                const gMentorRef = db.collection(USERS_COL).doc(mentor.referrerUid);
                const gMentorDoc = await gMentorRef.get();
                if (gMentorDoc.exists) {
                    const grandMentor = gMentorDoc.data() as UserWalletData;
                    batch.update(gMentorRef, { 
                        dpPoints: (grandMentor.dpPoints || 0) + grandMentorDp,
                        exp: (grandMentor.exp !== undefined ? grandMentor.exp : 0) + grandMentorDp
                    });
                    const txRef2 = db.collection(TRANSACTIONS_COL).doc();
                    batch.set(txRef2, {
                        id: txRef2.id,
                        uid: grandMentor.uid,
                        merchantId: "daehan_ecosystem",
                        type: "REFERRAL_BONUS",
                        currency: "DP",
                        amount: grandMentorDp,
                        description: `2차 멘티 [${buyer.name || '회원'}] DP 적립에 따른 상위 멘토 리워드 (20% = ${grandMentorDp.toLocaleString()} DP)`,
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
    currency: "MONEY" | "POINT" | "VND" | "HEX";
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
    let isPendingBankTransfer = false;

    if (params.currency === "MONEY" || params.currency === "HEX") {
        if ((user.moneyBalance || 0) < amount) {
            return { 
                success: false, 
                error: `대한페이(충전머니) 잔액이 부족합니다. (보유: ${(user.moneyBalance || 0).toLocaleString()} 머니 / 필요: ${amount.toLocaleString()} 머니). [마이페이지]에서 계좌 입금 충전 신청 후 이용해주세요.` 
            };
        }
        updates.moneyBalance = Number(((user.moneyBalance || 0) - amount).toFixed(2));
        const earnedDp = Math.round(amount * 0.1);
        updates.dpPoints = (user.dpPoints || 0) + earnedDp;
        const addExp = Math.round(amount * 0.1);
        updates.exp = (user.exp !== undefined ? user.exp : 0) + addExp;
    } else if (params.currency === "POINT") {
        if ((user.pointBalance || 0) < amount) return { success: false, error: "포인트 잔액이 부족합니다." };
        updates.pointBalance = Math.max(0, (user.pointBalance || 0) - amount);
        const earnedDp = Math.round(amount * 0.1);
        updates.dpPoints = (user.dpPoints || 0) + earnedDp;
        const addExp = Math.round(amount * 0.1);
        updates.exp = (user.exp !== undefined ? user.exp : 0) + addExp;
    } else if (params.currency === "VND") {
        // 일반 결제 (VND / 계좌이체): 지갑 잔액 검사 및 차감 없음! 입금 확인 대기(PENDING_PAYMENT)로 주문 생성
        isPendingBankTransfer = true;
    } else {
        return { success: false, error: "지원하지 않는 통화입니다." };
    }

    const txId = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txHash = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const timestamp = new Date().toISOString();

    const batch = db.batch();
    if (Object.keys(updates).length > 0) {
        batch.update(userRef, updates);
    }

    const txRef = db.collection(TRANSACTIONS_COL).doc(txId);
    batch.set(txRef, {
        id: txId,
        uid: params.uid,
        merchantId: params.merchantId || "daehan_kimchi_store",
        orderId: params.orderId,
        type: "PAYMENT",
        currency: params.currency,
        amount: amount,
        description: isPendingBankTransfer ? `대한김치 계좌이체 주문접수 (${params.orderId})` : `대한김치 쇼핑몰 결제 (${params.orderId})`,
        status: isPendingBankTransfer ? "PENDING" : "CONFIRMED",
        txHash,
        timestamp
    });

    const orderStatus = isPendingBankTransfer ? "PENDING_PAYMENT" : "PAID";
    const bankTransferInfo = isPendingBankTransfer ? {
        bankName: "Shinhan Bank Vietnam (신한베트남)",
        accountNumber: "700-004-461261",
        accountHolder: "DAEHAN KIMCHI CO., LTD",
        memo: params.orderId
    } : null;

    let newOrderToNotify: MemberOrder | null = null;

    if (params.items && params.items.length > 0) {
        const orderRef = db.collection(ORDERS_COL).doc(params.orderId);
        const newOrder = {
            orderId: params.orderId,
            uid: params.uid,
            items: params.items,
            totalVnd: amount,
            totalMoney: (params.currency === "MONEY" || params.currency === "HEX") ? amount : Math.round(amount / 1000),
            paidAmount: amount,
            currency: params.currency,
            txId,
            shippingAddress: params.shippingAddress || {
                recipient: user.name,
                phone: user.phone || "0702116617",
                address: "Hanoi, Vietnam"
            },
            bankTransferInfo,
            status: orderStatus,
            createdAt: timestamp
        };
        batch.set(orderRef, newOrder);
        newOrderToNotify = newOrder as MemberOrder;
    }

    // 1. 주문 DB 저장이 성공한 후 알림을 발송한다.
    await batch.commit();

    // 2. DB 저장 성공 완료 후 텔레그램 알림 발송 (알림 실패가 주문에 영향을 주지 않음)
    if (newOrderToNotify) {
        NotificationService.sendOrderNotification(newOrderToNotify as any).catch(err => {
            console.error("⚠️ [Order Notification Warning] DB 주문 저장은 성공했으나 텔레그램 알림 전송 중 오류 발생:", err);
        });
    }

    if (!isPendingBankTransfer) {
        await distributeReferralRewards(params.uid, amount, params.currency);
    }

    return {
        success: true,
        transactionId: txId,
        receipt: {
            orderId: params.orderId,
            paidAmount: amount,
            currency: params.currency,
            txHash,
            status: orderStatus,
            earnedDp: Math.round(amount * 0.1),
            bankTransferInfo
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
    const docs = snapshot.docs.map((doc: any) => doc.data() as WalletTransaction);
    return docs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getAllTransactions(): Promise<WalletTransaction[]> {
    const db = getDb();
    const snapshot = await db.collection(TRANSACTIONS_COL).orderBy("timestamp", "desc").limit(50).get();
    return snapshot.docs.map((doc: any) => doc.data() as WalletTransaction);
}

export async function getUserOrders(uid: string): Promise<MemberOrder[]> {
    const db = getDb();
    const snapshot = await db.collection(ORDERS_COL).where("uid", "==", uid).get();
    const docs = snapshot.docs.map((doc: any) => doc.data() as MemberOrder);
    return docs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllOrders(): Promise<MemberOrder[]> {
    try {
        const db = getDb();
        const snapshot = await db.collection(ORDERS_COL).get();
        const docs = snapshot.docs.map((doc: any) => doc.data() as MemberOrder);
        return docs.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } catch (e) {
        console.error("getAllOrders error:", e);
        return [];
    }
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
    const ordersSnap = await db.collection(ORDERS_COL).get();
    const orders: MemberOrder[] = ordersSnap.docs.map((d: any) => d.data() as MemberOrder);
    
    const usersSnap = await db.collection(USERS_COL).get();
    const users: UserWalletData[] = usersSnap.docs.map((d: any) => d.data() as UserWalletData);
    
    const txSnap = await db.collection(TRANSACTIONS_COL).get();
    const recentTx: WalletTransaction[] = txSnap.docs.map((d: any) => d.data() as WalletTransaction);

    const totalMoneySales = orders.filter((o: MemberOrder) => o.currency === "MONEY").reduce((sum: number, o: MemberOrder) => sum + (o.paidAmount || 0), 0);
    const totalVndSales = orders.filter((o: MemberOrder) => o.currency === "VND").reduce((sum: number, o: MemberOrder) => sum + (o.paidAmount || 0), 0) + (totalMoneySales * 1000);

    return {
        totalMoneySales,
        totalVndSales,
        totalOrders: orders.length,
        pendingShipping: orders.filter((o: MemberOrder) => o.status === "PAID" || o.status === "PREPARING").length,
        deliveredOrders: orders.filter((o: MemberOrder) => o.status === "DELIVERED").length,
        totalUsers: users.length,
        operatorCount: users.filter((u: UserWalletData) => u.role === "OPERATOR").length,
        superAdminCount: users.filter((u: UserWalletData) => u.role === "SUPER_ADMIN").length,
        recentOrders: orders.sort((a: MemberOrder, b: MemberOrder) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 5),
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

export async function grantDaehanPoint(
    uid: string,
    amount: number,
    description: string,
    type: "REWARD" | "REFERRAL_BONUS" | "FAUCET" = "REWARD",
    expAmount?: number
): Promise<{ success: boolean; newBalance?: number; newExp?: number; error?: string }> {
    const db = getDb();
    const userRef = db.collection(USERS_COL).doc(uid);
    
    try {
        const result = await db.runTransaction(async (transaction: any) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) throw new Error("사용자를 찾을 수 없습니다.");
            
            const user = userDoc.data() as UserWalletData;
            const updatedDp = (user.dpPoints || 0) + amount;
            const addExp = expAmount !== undefined ? expAmount : amount;
            const updatedExp = (user.exp !== undefined ? user.exp : 0) + addExp;
            
            transaction.update(userRef, {
                dpPoints: updatedDp,
                exp: updatedExp
            });
            
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
            
            return { newBalance: updatedDp, newExp: updatedExp };
        });
        
        return { success: true, newBalance: result.newBalance, newExp: result.newExp };
    } catch (e: any) {
        console.error("Failed to grant DP & EXP:", e);
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

        // DB 저장이 완료된 후 운영자 텔레그램 알림 발송 (안전 예외 처리)
        NotificationService.sendDepositRequestNotification(newReq).catch(err => {
            console.error("⚠️ [Deposit Request Notification Warning] DB 저장은 성공했으나 텔레그램 알림 발송 실패:", err);
        });

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
            .map((doc: any) => doc.data() as ChargeRequest)
            .filter((r: any) => r.uid === uid);
        return requests.sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));
    } catch {
        return [];
    }
}

export async function getAllChargeRequests(): Promise<ChargeRequest[]> {
    try {
        const db = getDb();
        const snap = await db.collection(CHARGE_REQUESTS_COL).get();
        const requests = snap.docs.map((doc: any) => doc.data() as ChargeRequest);
        return requests.sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));
    } catch {
        return [];
    }
}

export async function approveChargeRequest(requestId: string): Promise<{ success: boolean; request?: ChargeRequest; error?: string }> {
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

        return { success: true, request: reqData };
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

export async function createSubscription(params: {
    uid: string;
    userName?: string;
    userEmail?: string;
    tier: "basic" | "family" | "restaurant";
    tierName: string;
    weight: string;
    kimchiType: string;
    cycle: string;
    monthlyPriceVnd: number;
    originalPriceVnd: number;
    discountPercent: number;
    shippingAddress: {
        recipient: string;
        phone: string;
        address: string;
        memo?: string;
    };
    paymentMethod: string;
}): Promise<{ success: boolean; subscription?: SubscriptionData; error?: string }> {
    try {
        const db = getDb();
        const subscriptionId = `SUB-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

        const newSub: SubscriptionData = {
            subscriptionId,
            uid: params.uid,
            userName: params.userName,
            userEmail: params.userEmail,
            tier: params.tier,
            tierName: params.tierName,
            weight: params.weight,
            kimchiType: params.kimchiType,
            cycle: params.cycle,
            monthlyPriceVnd: params.monthlyPriceVnd,
            originalPriceVnd: params.originalPriceVnd,
            discountPercent: params.discountPercent,
            shippingAddress: params.shippingAddress,
            paymentMethod: params.paymentMethod,
            status: "ACTIVE",
            createdAt: new Date().toISOString()
        };

        await db.collection(SUBSCRIPTIONS_COL).doc(subscriptionId).set(newSub);

        // 텔레그램 운영자 알림 전송 (비동기 안전 실행)
        NotificationService.sendSubscriptionNotification({
            subscriptionId,
            uid: params.uid,
            userName: params.userName,
            tierName: params.tierName,
            kimchiType: params.kimchiType,
            cycle: params.cycle,
            weight: params.weight,
            monthlyPriceVnd: params.monthlyPriceVnd,
            recipient: params.shippingAddress.recipient,
            phone: params.shippingAddress.phone,
            address: params.shippingAddress.address
        }).catch(err => console.error("⚠️ [Subscription Notification Error]", err));

        return { success: true, subscription: newSub };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function getUserSubscriptions(uid: string): Promise<SubscriptionData[]> {
    try {
        const db = getDb();
        const snap = await db.collection(SUBSCRIPTIONS_COL).get();
        const subs = snap.docs
            .map((doc: any) => doc.data() as SubscriptionData)
            .filter((s: any) => s.uid === uid);
        return subs.sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));
    } catch {
        return [];
    }
}

export interface DpRankItem {
    rank: number;
    displayName: string;
    maskedEmail: string;
    level: number;
    dpPoints: number;
    avatar?: string;
    badgeTitle?: string;
}

export async function getTopDpRankings(limitCount = 10): Promise<DpRankItem[]> {
    const fallbackMock: DpRankItem[] = [
        { rank: 1, displayName: "최*민", maskedEmail: "dag***@gmail.com", level: 9, dpPoints: 158400, avatar: "https://ui-avatars.com/api/?name=Choi&background=C8392B&color=fff&bold=true", badgeTitle: "👑 전설의 마스터" },
        { rank: 2, displayName: "응우옌티*", maskedEmail: "ngu***@gmail.com", level: 8, dpPoints: 124500, avatar: "https://ui-avatars.com/api/?name=Nguyen&background=D4870A&color=fff&bold=true", badgeTitle: "🔥 발효 장인" },
        { rank: 3, displayName: "김*석", maskedEmail: "kim***@naver.com", level: 7, dpPoints: 98200, avatar: "https://ui-avatars.com/api/?name=Kim&background=16a34a&color=fff&bold=true", badgeTitle: "⭐ VIP 가디언" },
        { rank: 4, displayName: "박*훈", maskedEmail: "park***@gmail.com", level: 6, dpPoints: 76000, avatar: "https://ui-avatars.com/api/?name=Park&background=2563eb&color=fff&bold=true", badgeTitle: "🎖️ 미식 탐험가" },
        { rank: 5, displayName: "이*영", maskedEmail: "lee***@hanmail.net", level: 5, dpPoints: 64500, avatar: "https://ui-avatars.com/api/?name=Lee&background=9333ea&color=fff&bold=true", badgeTitle: "🎖️ 골드 서포터" },
        { rank: 6, displayName: "쩐반*", maskedEmail: "tran***@gmail.com", level: 5, dpPoints: 52000, avatar: "https://ui-avatars.com/api/?name=Tran&background=0891b2&color=fff&bold=true", badgeTitle: "✨ 김치 러버" },
        { rank: 7, displayName: "정*우", maskedEmail: "jung***@kakao.com", level: 4, dpPoints: 41800, avatar: "https://ui-avatars.com/api/?name=Jung&background=ca8a04&color=fff&bold=true", badgeTitle: "✨ 김치 러버" },
        { rank: 8, displayName: "한*희", maskedEmail: "han***@gmail.com", level: 4, dpPoints: 37500, avatar: "https://ui-avatars.com/api/?name=Han&background=db2777&color=fff&bold=true", badgeTitle: "🌱 로열 후원자" },
        { rank: 9, displayName: "팜티*", maskedEmail: "pham***@gmail.com", level: 3, dpPoints: 29000, avatar: "https://ui-avatars.com/api/?name=Pham&background=4b5563&color=fff&bold=true", badgeTitle: "🌱 로열 후원자" },
        { rank: 10, displayName: "송*호", maskedEmail: "song***@naver.com", level: 3, dpPoints: 24200, avatar: "https://ui-avatars.com/api/?name=Song&background=65a30d&color=fff&bold=true", badgeTitle: "🌱 로열 후원자" }
    ];

    try {
        const db = getDb();
        const snap = await db.collection(USERS_COL).get();
        const users = snap.docs.map((doc: any) => doc.data() as UserWalletData);
        
        if (users.length === 0) return fallbackMock;

        const sorted = users
            .filter((u: UserWalletData) => (u.dpPoints || 0) > 0)
            .sort((a: UserWalletData, b: UserWalletData) => (b.dpPoints || 0) - (a.dpPoints || 0));

        if (sorted.length === 0) return fallbackMock;

        const result: DpRankItem[] = sorted.slice(0, limitCount).map((u: UserWalletData, i: number) => {
            const rawName = u.name || "회원";
            const maskedName = rawName.length > 2 
                ? `${rawName[0]}*${rawName[rawName.length - 1]}`
                : `${rawName[0]}*`;

            const emailParts = (u.email || "user@daehankimchi.com").split("@");
            const maskedEmail = emailParts[0].length > 3
                ? `${emailParts[0].substring(0, 3)}***@${emailParts[1] || "gmail.com"}`
                : `${emailParts[0]}***@gmail.com`;

            const userLvl = u.level || 1;
            let badgeTitle = "🌱 로열 후원자";
            if (userLvl >= 8) badgeTitle = "👑 전설의 마스터";
            else if (userLvl >= 6) badgeTitle = "🔥 발효 장인";
            else if (userLvl >= 4) badgeTitle = "⭐ VIP 가디언";
            else if (userLvl >= 2) badgeTitle = "🎖️ 미식 탐험가";

            return {
                rank: i + 1,
                displayName: maskedName,
                maskedEmail,
                level: userLvl,
                dpPoints: u.dpPoints || 0,
                avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(maskedName)}&background=C8392B&color=fff&bold=true`,
                badgeTitle
            };
        });

        if (result.length < limitCount) {
            const needed = limitCount - result.length;
            const extraMocks = fallbackMock.slice(result.length, result.length + needed).map((item, index) => ({
                ...item,
                rank: result.length + index + 1
            }));
            return [...result, ...extraMocks];
        }

        return result;
    } catch {
        return fallbackMock;
    }
}

export interface ReferralRankItem {
    rank: number;
    displayName: string;
    maskedEmail: string;
    level: number;
    menteeCount: number;
    avatar?: string;
    badgeTitle?: string;
}

export async function getTopReferralRankings(limitCount = 10): Promise<ReferralRankItem[]> {
    const fallbackMock: ReferralRankItem[] = [
        { rank: 1, displayName: "최*민", maskedEmail: "dag***@gmail.com", level: 9, menteeCount: 48, avatar: "https://ui-avatars.com/api/?name=Choi&background=C8392B&color=fff&bold=true", badgeTitle: "👑 최상위 멘토 마스터" },
        { rank: 2, displayName: "응우옌티*", maskedEmail: "ngu***@gmail.com", level: 8, menteeCount: 35, avatar: "https://ui-avatars.com/api/?name=Nguyen&background=D4870A&color=fff&bold=true", badgeTitle: "🔥 다이아몬드 멘토" },
        { rank: 3, displayName: "김*석", maskedEmail: "kim***@naver.com", level: 7, menteeCount: 29, avatar: "https://ui-avatars.com/api/?name=Kim&background=16a34a&color=fff&bold=true", badgeTitle: "⭐ 골드 멘토" },
        { rank: 4, displayName: "박*훈", maskedEmail: "park***@gmail.com", level: 6, menteeCount: 22, avatar: "https://ui-avatars.com/api/?name=Park&background=2563eb&color=fff&bold=true", badgeTitle: "🎖️ 실버 멘토" },
        { rank: 5, displayName: "이*영", maskedEmail: "lee***@hanmail.net", level: 5, menteeCount: 18, avatar: "https://ui-avatars.com/api/?name=Lee&background=9333ea&color=fff&bold=true", badgeTitle: "🎖️ 실버 멘토" },
        { rank: 6, displayName: "쩐반*", maskedEmail: "tran***@gmail.com", level: 5, menteeCount: 14, avatar: "https://ui-avatars.com/api/?name=Tran&background=0891b2&color=fff&bold=true", badgeTitle: "✨ 우수 앰버서더" },
        { rank: 7, displayName: "정*우", maskedEmail: "jung***@kakao.com", level: 4, menteeCount: 11, avatar: "https://ui-avatars.com/api/?name=Jung&background=ca8a04&color=fff&bold=true", badgeTitle: "✨ 우수 앰버서더" },
        { rank: 8, displayName: "한*희", maskedEmail: "han***@gmail.com", level: 4, menteeCount: 9, avatar: "https://ui-avatars.com/api/?name=Han&background=db2777&color=fff&bold=true", badgeTitle: "🌱 열정 리더" },
        { rank: 9, displayName: "팜티*", maskedEmail: "pham***@gmail.com", level: 3, menteeCount: 7, avatar: "https://ui-avatars.com/api/?name=Pham&background=4b5563&color=fff&bold=true", badgeTitle: "🌱 열정 리더" },
        { rank: 10, displayName: "송*호", maskedEmail: "song***@naver.com", level: 3, menteeCount: 5, avatar: "https://ui-avatars.com/api/?name=Song&background=65a30d&color=fff&bold=true", badgeTitle: "🌱 열정 리더" }
    ];

    try {
        const db = getDb();
        const snap = await db.collection(USERS_COL).get();
        const users = snap.docs.map((doc: any) => doc.data() as UserWalletData);

        if (users.length === 0) return fallbackMock;

        // Calculate mentee counts per user
        const menteeCountsMap = new Map<string, number>();
        users.forEach((u: UserWalletData) => {
            if (u.referrerUid) {
                menteeCountsMap.set(u.referrerUid, (menteeCountsMap.get(u.referrerUid) || 0) + 1);
            }
        });

        // Filter users who have referred at least 1 person or sort users by mentee count
        const rankedUsers = users
            .map((u: UserWalletData) => ({
                user: u,
                menteeCount: menteeCountsMap.get(u.uid) || 0
            }))
            .filter((item: { user: UserWalletData; menteeCount: number }) => item.menteeCount > 0)
            .sort((a: { user: UserWalletData; menteeCount: number }, b: { user: UserWalletData; menteeCount: number }) => {
                if (b.menteeCount !== a.menteeCount) {
                    return b.menteeCount - a.menteeCount;
                }
                return (b.user.dpPoints || 0) - (a.user.dpPoints || 0);
            });

        if (rankedUsers.length === 0) return fallbackMock;

        const result: ReferralRankItem[] = rankedUsers.slice(0, limitCount).map((item: { user: UserWalletData; menteeCount: number }, i: number) => {
            const u = item.user;
            const rawName = u.name || "회원";
            const maskedName = rawName.length > 2 
                ? `${rawName[0]}*${rawName[rawName.length - 1]}`
                : `${rawName[0]}*`;

            const emailParts = (u.email || "user@daehankimchi.com").split("@");
            const maskedEmail = emailParts[0].length > 3
                ? `${emailParts[0].substring(0, 3)}***@${emailParts[1] || "gmail.com"}`
                : `${emailParts[0]}***@gmail.com`;

            const mCount = item.menteeCount;
            let badgeTitle = "🌱 열정 리더";
            if (mCount >= 40) badgeTitle = "👑 최상위 멘토 마스터";
            else if (mCount >= 30) badgeTitle = "🔥 다이아몬드 멘토";
            else if (mCount >= 20) badgeTitle = "⭐ 골드 멘토";
            else if (mCount >= 10) badgeTitle = "🎖️ 실버 멘토";
            else if (mCount >= 5) badgeTitle = "✨ 우수 앰버서더";

            return {
                rank: i + 1,
                displayName: maskedName,
                maskedEmail,
                level: u.level || 1,
                menteeCount: mCount,
                avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(maskedName)}&background=D4870A&color=fff&bold=true`,
                badgeTitle
            };
        });

        if (result.length < limitCount) {
            const needed = limitCount - result.length;
            const extraMocks = fallbackMock.slice(result.length, result.length + needed).map((item: ReferralRankItem, index: number) => ({
                ...item,
                rank: result.length + index + 1
            }));
            return [...result, ...extraMocks];
        }

        return result;
    } catch {
        return fallbackMock;
    }
}



