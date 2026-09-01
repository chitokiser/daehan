"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "SUPER_ADMIN" | "OPERATOR" | "VIP_MEMBER" | "GOLD_MEMBER" | "MEMBER";

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    onChainWalletAddress?: string;
    hexTokenBalance?: number;
    kcaPoints?: number;
    vndBalance?: number;
    dpPoints?: number;
    phone?: string;
    createdAt?: string;
}

export interface WalletState {
    onChainWalletAddress: string;
    hexTokenBalance: number;
    kcaPoints: number;
    vndBalance: number;
    dpPoints: number;
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

export interface AdminStats {
    totalHexSales: number;
    totalVndSales: number;
    totalOrders: number;
    pendingShipping: number;
    deliveredOrders: number;
    totalUsers: number;
    operatorCount: number;
    superAdminCount: number;
    recentOrders: MemberOrder[];
    recentTransactions: WalletTransaction[];
}

interface PaymentParams {
    orderId?: string;
    amount: number;
    currency: "HEX" | "POINT" | "VND";
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
    isWalletConnected: boolean;
    isLoading: boolean;
    orders: MemberOrder[];
    transactions: WalletTransaction[];
    allMembers: UserProfile[];
    adminStats: AdminStats | null;
    allOrders: MemberOrder[];
    login: (uid?: string) => Promise<void>;
    logout: () => void;
    connectWallet: () => Promise<void>;
    payOrder: (params: PaymentParams) => Promise<PaymentResult>;
    faucetHex: (amount?: number) => Promise<boolean>;
    refreshWallet: () => Promise<void>;
    fetchAdminData: () => Promise<void>;
    changeUserRole: (targetUid: string, newRole: UserRole) => Promise<{ success: boolean; error?: string; message?: string }>;
    changeOrderStatus: (orderId: string, status: "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED") => Promise<{ success: boolean; error?: string }>;
}

const defaultWallet: WalletState = {
    onChainWalletAddress: "0xa4850A83D219b5706D638cC28244EFe2bF8bdb40",
    hexTokenBalance: 95000.0,
    kcaPoints: 120000,
    vndBalance: 85000000,
    dpPoints: 50000
};

const defaultUser: UserProfile = {
    uid: "admin_super_daehan",
    name: "최고 관리자 (Super Admin)",
    email: "super.admin@daehankimchi.com",
    role: "SUPER_ADMIN",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
};

const UserWalletContext = createContext<UserWalletContextType | undefined>(undefined);

export function UserWalletProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(defaultUser);
    const [wallet, setWallet] = useState<WalletState>(defaultWallet);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isWalletConnected, setIsWalletConnected] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<MemberOrder[]>([]);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [allMembers, setAllMembers] = useState<UserProfile[]>([]);
    const [allOrders, setAllOrders] = useState<MemberOrder[]>([]);
    const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

    // Fetch live wallet data from KCA API
    const refreshWallet = useCallback(async () => {
        if (!user?.uid) return;
        try {
            const res = await fetch(`/api/v1/wallet/${user.uid}`, {
                headers: { "Authorization": "Bearer kca_merchant_sec_daehan2026_99x" }
            });
            const json = await res.json();
            if (json.success && json.data) {
                setWallet({
                    onChainWalletAddress: json.data.onChainWalletAddress || wallet.onChainWalletAddress,
                    hexTokenBalance: parseFloat(json.data.hexTokenBalance) || 0,
                    kcaPoints: json.data.kcaPoints || 0,
                    vndBalance: json.data.vndBalance || 0,
                    dpPoints: json.data.dpPoints || 0
                });
                if (json.data.recentOrders) setOrders(json.data.recentOrders);
                if (json.data.recentTransactions) setTransactions(json.data.recentTransactions);
            }
        } catch (e) {
            console.error("Failed to fetch wallet from KCA API:", e);
        }
    }, [user?.uid, wallet.onChainWalletAddress]);

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
                    onChainWalletAddress: json.data.onChainWalletAddress,
                    hexTokenBalance: parseFloat(json.data.hexTokenBalance) || 0,
                    kcaPoints: json.data.kcaPoints || 0,
                    vndBalance: json.data.vndBalance || 0,
                    dpPoints: json.data.dpPoints || 0
                });
                if (json.data.recentOrders) setOrders(json.data.recentOrders);
                if (json.data.recentTransactions) setTransactions(json.data.recentTransactions);
                setIsLoggedIn(true);
                setIsWalletConnected(true);
                await fetchAdminData();
            }
        } catch (e) {
            console.error("Login failed:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        setIsWalletConnected(false);
    };

    const connectWallet = async () => {
        setIsLoading(true);
        try {
            if (typeof window !== "undefined" && (window as any).ethereum) {
                try {
                    const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
                    if (accounts && accounts[0]) {
                        setWallet(prev => ({ ...prev, onChainWalletAddress: accounts[0] }));
                        setIsWalletConnected(true);
                        alert(`지갑이 성공적으로 연결되었습니다!\n주소: ${accounts[0]}`);
                        return;
                    }
                } catch (ethErr) {
                    console.log("Web3 provider rejected, using KCA Smart Wallet.");
                }
            }
            setIsWalletConnected(true);
            alert(`KCA 스마트 지갑이 연결되었습니다.\n온체인 주소: ${wallet.onChainWalletAddress}`);
        } finally {
            setIsLoading(false);
        }
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
                    currency: params.currency,
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
                return {
                    success: true,
                    transactionId: json.transactionId,
                    receipt: json.receipt
                };
            } else {
                return {
                    success: false,
                    error: json.error || "결제 처리 중 오류가 발생했습니다."
                };
            }
        } catch (e: any) {
            return {
                success: false,
                error: e.message || "서버 통신 오류가 발생했습니다."
            };
        } finally {
            setIsLoading(false);
        }
    };

    const faucetHex = async (amount: number = 500): Promise<boolean> => {
        if (!user?.uid) return false;
        setIsLoading(true);
        try {
            const res = await fetch("/api/v1/wallet/faucet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: user.uid, amount })
            });
            const json = await res.json();
            if (json.success) {
                await refreshWallet();
                await fetchAdminData();
                return true;
            }
            return false;
        } catch (e) {
            console.error("Faucet error:", e);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const changeUserRole = async (targetUid: string, newRole: UserRole) => {
        if (!user?.uid) return { success: false, error: "관리자 로그인이 필요합니다." };
        if (user.role !== "SUPER_ADMIN") {
            return { success: false, error: "최고 관리자(SUPER_ADMIN)만 운영자 권한을 지정할 수 있습니다." };
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/v1/admin/members", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    adminUid: user.uid,
                    targetUid,
                    action: "UPDATE_ROLE",
                    newRole
                })
            });
            const json = await res.json();
            if (json.success) {
                await fetchAdminData();
                return { success: true, message: json.message };
            }
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
            if (json.success) {
                await fetchAdminData();
                return { success: true };
            }
            return { success: false, error: json.error };
        } catch (e: any) {
            return { success: false, error: e.message };
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
                isWalletConnected,
                isLoading,
                orders,
                transactions,
                allMembers,
                adminStats,
                allOrders,
                login,
                logout,
                connectWallet,
                payOrder,
                faucetHex,
                refreshWallet,
                fetchAdminData,
                changeUserRole,
                changeOrderStatus
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
