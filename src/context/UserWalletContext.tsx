"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
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
    type: "PAYMENT" | "FAUCET" | "REWARD" | "REFUND";
    currency: "HEX" | "POINT" | "VND" | "DP";
    amount: number;
    description: string;
    status: "CONFIRMED" | "PENDING" | "FAILED";
    txHash: string;
    timestamp: string;
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
    login: (uid?: string) => Promise<void>;
    logout: () => void;
    connectWallet: () => Promise<void>;
    payOrder: (params: PaymentParams) => Promise<PaymentResult>;
    faucetHex: (amount?: number) => Promise<boolean>;
    refreshWallet: () => Promise<void>;
}

const defaultWallet: WalletState = {
    onChainWalletAddress: "0x71C38B12F009a287C9Fe11A65427909F8F813B29",
    hexTokenBalance: 2500.0,
    kcaPoints: 15000,
    vndBalance: 1200000,
    dpPoints: 8500
};

const defaultUser: UserProfile = {
    uid: "user_daehan_vip01",
    name: "최민준 (VIP 회원)",
    email: "minjun.choi@daehankimchi.com",
    role: "VIP_MEMBER",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
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

    // Fetch live wallet data from KCA API
    const refreshWallet = useCallback(async () => {
        if (!user?.uid) return;
        try {
            const res = await fetch(`/api/v1/wallet/${user.uid}`, {
                headers: {
                    "Authorization": "Bearer kca_merchant_sec_daehan2026_99x"
                }
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

    useEffect(() => {
        refreshWallet();
    }, [refreshWallet]);

    const login = async (targetUid: string = "user_daehan_vip01") => {
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
            // Check if window.ethereum exists or simulate web3 connection
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
            // Default KCA On-Chain Smart Wallet
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
                login,
                logout,
                connectWallet,
                payOrder,
                faucetHex,
                refreshWallet
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
