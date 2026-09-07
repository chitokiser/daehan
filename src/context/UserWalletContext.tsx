"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "SUPER_ADMIN" | "OPERATOR" | "VIP_MEMBER" | "GOLD_MEMBER" | "MEMBER";

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    points?: number;
    vndBalance?: number;
    dpPoints?: number;
    phone?: string;
    createdAt?: string;
    onChainWalletAddress?: string;
    moneyBalance?: number;
    pointBalance?: number;
}

export interface WalletState {
    points: number;
    vndBalance: number;
    dpPoints: number;
    moneyBalance: number;
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
        image: string;
    }[];
    totalVnd: number;
    paidAmount: number;
    currency: "VND" | "MONEY" | "POINT";
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

export interface WalletTransaction {
    id: string;
    uid: string;
    type: "PAYMENT" | "REWARD" | "REFUND";
    currency: "VND" | "DP" | "MONEY" | "POINT";
    amount: number;
    description: string;
    status: "CONFIRMED" | "PENDING" | "FAILED";
    timestamp: string;
}

export interface AdminStats {
    totalVndSales: number;
    totalOrders: number;
    pendingShipping: number;
    deliveredOrders: number;
    totalUsers: number;
    operatorCount: number;
    superAdminCount: number;
    recentOrders: MemberOrder[];
    totalHexSales?: number;
}

interface PaymentParams {
    orderId?: string;
    amount: number;
    currency?: "MONEY" | "POINT" | "VND";
    items?: any[];
    shippingAddress?: any;
}

interface PaymentResult {
    success: boolean;
    error?: string;
    transactionId?: string;
    receipt?: any;
}

interface UserWalletContextType {
    user: UserProfile | null;
    wallet: WalletState;
    isLoggedIn: boolean;
    isLoading: boolean;
    orders: MemberOrder[];
    allMembers: UserProfile[];
    adminStats: AdminStats | null;
    allOrders: MemberOrder[];
    login: (uid?: string) => Promise<void>;
    loginWithGoogle: (customEmail?: string, customName?: string, referrerUid?: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
    logout: () => void;
    payOrder: (params: PaymentParams) => Promise<PaymentResult>;
    refreshWallet: () => Promise<void>;
    fetchAdminData: () => Promise<void>;
    changeUserRole: (targetUid: string, newRole: UserRole) => Promise<{ success: boolean; error?: string; message?: string }>;
    changeOrderStatus: (orderId: string, status: "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED") => Promise<{ success: boolean; error?: string }>;
    convertPoints: (points: number) => Promise<{ success: boolean; error?: string }>;
}

const defaultWallet: WalletState = {
    points: 120000,
    vndBalance: 85000000,
    dpPoints: 50000,
    moneyBalance: 95000.0
};

const defaultUser: UserProfile = {
    uid: "admin_super_daehan",
    name: "최고관리자",
    email: "daguri75@gmail.com",
    role: "SUPER_ADMIN",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
};

const UserWalletContext = createContext<UserWalletContextType | undefined>(undefined);

export function UserWalletProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [wallet, setWallet] = useState<WalletState>({ points: 0, vndBalance: 0, dpPoints: 0, moneyBalance: 0 });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<MemberOrder[]>([]);
    const [allMembers, setAllMembers] = useState<UserProfile[]>([]);
    const [allOrders, setAllOrders] = useState<MemberOrder[]>([]);
    const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

    const refreshWallet = useCallback(async () => {
        if (!user?.uid) return;
        try {
            const res = await fetch(`/api/v1/wallet/${user.uid}`, {
                headers: { "Authorization": "Bearer kca_merchant_sec_daehan2026_99x" }
            });
            const json = await res.json();
            if (json.success && json.data) {
                setWallet({
                    points: json.data.pointBalance || 0,
                    vndBalance: json.data.vndBalance || 0,
                    dpPoints: json.data.dpPoints || 0,
                    moneyBalance: json.data.moneyBalance || 0
                });
                if (json.data.recentOrders) setOrders(json.data.recentOrders);
            }
        } catch (e) {
            console.error("Failed to fetch wallet:", e);
        }
    }, [user?.uid]);

    const fetchAdminData = useCallback(async () => {
        try {
            const [membersRes, ordersRes] = await Promise.all([
                fetch("/api/v1/admin/members"),
                fetch("/api/v1/admin/orders")
            ]);
            const membersJson = await membersRes.json();
            const ordersJson = await ordersRes.json();
            if (membersJson.success && membersJson.data) {
                setAllMembers(membersJson.data.users);
                setAdminStats(membersJson.data.stats);
            }
            if (ordersJson.success && ordersJson.data) {
                setAllOrders(ordersJson.data);
            }
        } catch (e) {
            console.error("Failed to fetch admin data:", e);
        }
    }, []);

    useEffect(() => {
        refreshWallet();
        fetchAdminData();
    }, [refreshWallet, fetchAdminData]);

    const login = async (targetUid: string = "admin_super_daehan") => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/v1/wallet/${targetUid}`, {
                headers: { "Authorization": "Bearer kca_merchant_sec_daehan2026_99x" }
            });
            const json = await res.json();
            if (json.success && json.data) {
                setUser({
                    uid: json.data.uid,
                    name: json.data.name,
                    email: json.data.email,
                    role: json.data.role,
                    avatar: json.data.avatar
                });
                setWallet({
                    points: json.data.pointBalance || 0,
                    vndBalance: json.data.vndBalance || 0,
                    dpPoints: json.data.dpPoints || 0,
                    moneyBalance: json.data.moneyBalance || 0
                });
                if (json.data.recentOrders) setOrders(json.data.recentOrders);
                setIsLoggedIn(true);
                await fetchAdminData();
            }
        } catch (e) {
            console.error("Login failed:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async (customEmail?: string, customName?: string, referrerUid?: string) => {
        setIsLoading(true);
        try {
            // localStorage 캐시 무시하고 입력받은 이메일만 사용
            const email = customEmail;
            if (!email) {
                return { success: false, error: "이메일이 제공되지 않았습니다." };
            }
            const name = customName || "Google 인증 회원";
            const avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

            const res = await fetch("/api/v1/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, avatar, sub: `google_sub_${Date.now()}`, referrerUid })
            });

            const json = await res.json();
            if (json.success && json.data) {
                const loggedUser: UserProfile = {
                    uid: json.data.uid,
                    name: json.data.name,
                    email: json.data.email,
                    role: json.data.role,
                    avatar: json.data.avatar,
                    phone: json.data.phone
                };
                setUser(loggedUser);
                setWallet({
                    points: json.data.pointBalance || 0,
                    vndBalance: json.data.vndBalance || 0,
                    dpPoints: json.data.dpPoints || 0,
                    moneyBalance: json.data.moneyBalance || 0
                });
                if (json.data.recentOrders) setOrders(json.data.recentOrders);
                setIsLoggedIn(true);

                if (typeof window !== "undefined") {
                    localStorage.setItem("google_auth_email", loggedUser.email);
                    localStorage.setItem("google_auth_name", loggedUser.name);
                }

                await fetchAdminData();
                return { success: true, user: loggedUser };
            }
            return { success: false, error: json.error || "Google 로그인에 실패했습니다." };
        } catch (e: any) {
            console.error("Google login failed:", e);
            return { success: false, error: e.message || "Google 로그인 통신 오류가 발생했습니다." };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
    };

    const payOrder = async (params: PaymentParams): Promise<PaymentResult> => {
        if (!user?.uid) {
            return { success: false, error: "로그인 후 결제를 진행해주세요." };
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/v1/wallet/pay", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer kca_merchant_sec_daehan2026_99x"
                },
                body: JSON.stringify({
                    uid: user.uid,
                    merchantId: "daehan_kimchi_store",
                    currency: params.currency || "VND",
                    amount: params.amount,
                    orderId: params.orderId || `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
                    items: params.items,
                    shippingAddress: params.shippingAddress
                })
            });

            const json = await res.json();
            if (json.success) {
                await refreshWallet();
                await fetchAdminData();
                return { success: true, transactionId: json.transactionId, receipt: json.receipt };
            } else {
                return { success: false, error: json.error || "결제 승인에 실패했습니다." };
            }
        } catch (e: any) {
            console.error("Payment error:", e);
            return { success: false, error: e.message || "결제 서버 통신 오류가 발생했습니다." };
        } finally {
            setIsLoading(false);
        }
    };

    const changeUserRole = async (targetUid: string, newRole: UserRole) => {
        if (!user?.uid) return { success: false, error: "관리자 로그인이 필요합니다." };
        if (user.role !== "SUPER_ADMIN") return { success: false, error: "최고 관리자(SUPER_ADMIN)만 운영자 권한을 지정할 수 있습니다." };
        setIsLoading(true);
        try {
            const res = await fetch("/api/v1/admin/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminUid: user.uid, targetUid, action: "UPDATE_ROLE", newRole })
            });
            const json = await res.json();
            if (json.success) { await fetchAdminData(); return { success: true, message: json.message }; }
            return { success: false, error: json.error };
        } catch (e: any) {
            return { success: false, error: e.message };
        } finally {
            setIsLoading(false);
        }
    };

    const changeOrderStatus = async (orderId: string, status: "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED") => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/v1/admin/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status })
            });
            const json = await res.json();
            if (json.success) { await fetchAdminData(); return { success: true }; }
            return { success: false, error: json.error };
        } catch (e: any) {
            return { success: false, error: e.message };
        } finally {
            setIsLoading(false);
        }
    };

    const convertPoints = async (pointsAmount: number) => {
        if (!user?.uid) return { success: false, error: "로그인이 필요합니다." };
        setIsLoading(true);
        try {
            const res = await fetch("/api/v1/wallet/convert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.uid, points: pointsAmount })
            });
            const json = await res.json();
            if (json.success) {
                await refreshWallet();
                return { success: true };
            }
            return { success: false, error: json.error || "전환에 실패했습니다." };
        } catch (e: any) {
            return { success: false, error: e.message || "서버 통신 오류" };
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserWalletContext.Provider
            value={{
                user,
                wallet,
                isLoggedIn,
                isLoading,
                orders,
                allMembers,
                adminStats,
                allOrders,
                login,
                loginWithGoogle,
                logout,
                payOrder,
                refreshWallet,
                fetchAdminData,
                changeUserRole,
                changeOrderStatus,
                convertPoints
            }}
        >
            {children}
        </UserWalletContext.Provider>
    );
}

export function useUserWallet() {
    const context = useContext(UserWalletContext);
    if (!context) {
        throw new Error("useUserWallet must be used within a UserWalletProvider");
    }
    return context;
}
