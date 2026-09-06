import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/kcaDb";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get("orderId");

        if (!orderId) {
            return NextResponse.json({ success: false, error: "조회할 orderId가 필요합니다." }, { status: 400 });
        }

        // verifyTransaction with txHash="dummy" and orderId instead
        const result = verifyTransaction("", orderId);

        if (!result.verified || !result.transaction) {
            return NextResponse.json({ success: false, error: "결제 내역을 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                orderId: result.transaction.orderId,
                status: result.transaction.status === "CONFIRMED" ? "PAID" : "PENDING",
                paidAmount: result.transaction.amount,
                currency: result.transaction.currency,
                txId: result.transaction.id,
                createdAt: result.transaction.timestamp
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || "결제 내역 조회 중 오류가 발생했습니다." }, { status: 500 });
    }
}
