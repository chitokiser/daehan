import { NextRequest, NextResponse } from "next/server";
import { faucetWallet, getUserWallet } from "@/lib/kcaDb";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, amount } = body;

        if (!uid) {
            return NextResponse.json({ success: false, error: "UID is required" }, { status: 400 });
        }

        const hexAmount = Number(amount) || 500;
        const result = faucetWallet(uid, hexAmount);
        const user = getUserWallet(uid);

        return NextResponse.json({
            success: true,
            message: `${hexAmount} HEX 토큰이 지갑으로 성공적으로 충전되었습니다.`,
            newBalance: result.newBalance,
            wallet: user
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
