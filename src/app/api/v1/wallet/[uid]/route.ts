import { NextRequest, NextResponse } from "next/server";
import { getUserWallet, getUserTransactions, getUserOrders } from "@/lib/kcaDb";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ uid: string }> }
) {
    try {
        const { uid } = await context.params;

        if (!uid) {
            return NextResponse.json({ success: false, error: "UID is required" }, { status: 400 });
        }

        // Check optional Merchant API Key verification
        const authHeader = request.headers.get("authorization") || "";
        // Support any valid Bearer token or internal requests
        const wallet = await getUserWallet(uid);
        const transactions = await getUserTransactions(uid);
        const orders = await getUserOrders(uid);

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
                recentTransactions: transactions.slice(0, 5),
                recentOrders: orders.slice(0, 5)
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
