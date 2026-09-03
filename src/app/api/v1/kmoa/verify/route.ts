import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/kcaDb";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const txHash = searchParams.get("txHash");
        const orderId = searchParams.get("orderId");

        if (!txHash && !orderId) {
            return NextResponse.json({
                success: false,
                error: "txHash 또는 orderId를 제공해야 합니다."
            }, { status: 400 });
        }

        const result = verifyTransaction(txHash || "", orderId || undefined);

        if (!result.verified) {
            return NextResponse.json({
                success: false,
                verified: false,
                message: "해당 트랜잭션 또는 주문을 K-MOA 블록체인 원장에서 찾을 수 없습니다."
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            verified: true,
            contractAddress: "0xa4850A83D219b5706D638cC28244EFe2bF8bdb40",
            transaction: result.transaction,
            order: result.order
        });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            error: e.message || "트랜잭션 검증 중 오류가 발생했습니다."
        }, { status: 500 });
    }
}
