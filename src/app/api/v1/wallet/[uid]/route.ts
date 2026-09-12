export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserWallet, getUserTransactions, getUserOrders } from "@/lib/kcaDb";

export async function GET(
    request: NextRequest,
    context: any
) {
    try {
        let uid = "google_daguri75_gmail_com";
        if (context?.params) {
            const resolvedParams = await context.params;
            if (resolvedParams?.uid) {
                uid = resolvedParams.uid;
            }
        }

        if (!uid) {
            return NextResponse.json({ success: false, error: "UID is required" }, { status: 400 });
        }

        const wallet = await getUserWallet(uid);
        let transactions: any[] = [];
        let orders: any[] = [];
        try {
            transactions = await getUserTransactions(uid);
            orders = await getUserOrders(uid);
        } catch (err) {
            console.error("Failed to fetch transactions/orders:", err);
        }

        return NextResponse.json({
            success: true,
            data: {
                uid: wallet.uid,
                name: wallet.name,
                email: wallet.email,
                pointBalance: wallet.pointBalance || 0,
                vndBalance: wallet.vndBalance || 0,
                moneyBalance: Number(wallet.moneyBalance || 0).toFixed(2),
                onChainWalletAddress: wallet.onChainWalletAddress || "0x...",
                dpPoints: wallet.dpPoints || 0,
                level: wallet.level || 1,
                exp: wallet.exp !== undefined ? wallet.exp : 15000,
                role: wallet.role,
                avatar: wallet.avatar,
                referrerUid: wallet.referrerUid,
                mentees: wallet.mentees || [],
                recentTransactions: (transactions || []).slice(0, 5),
                recentOrders: (orders || []).slice(0, 5)
            }
        });
    } catch (error: any) {
        console.error("Wallet [uid] API error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
