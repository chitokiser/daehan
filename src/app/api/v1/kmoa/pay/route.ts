import { NextRequest, NextResponse } from "next/server";
import { executePayment } from "@/lib/kcaDb";

export async function POST(req: NextRequest) {
    try {
        let body: any = {};
        try {
            body = await req.json();
        } catch {
            body = {};
        }
        const { uid, merchantId, currency, amount, orderId, items, shippingAddress } = body;

        if (!uid || !amount || !currency) {
            return NextResponse.json({
                success: false,
                error: "필수 파라미터(uid, amount, currency)가 누락되었습니다."
            }, { status: 400 });
        }

        const result = executePayment({
            uid,
            merchantId: merchantId || "daehan_kimchi_store",
            currency,
            amount,
            orderId: orderId || `ORD-KMOA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
            items,
            shippingAddress
        });

        if (!result.success) {
            return NextResponse.json({
                success: false,
                error: result.error
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "K-MOA 지갑 결제가 성공적으로 처리되었습니다.",
            contractAddress: "0xa4850A83D219b5706D638cC28244EFe2bF8bdb40",
            transactionId: result.transactionId,
            receipt: result.receipt
        });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            error: e.message || "K-MOA 결제 서버 내부 오류가 발생했습니다."
        }, { status: 500 });
    }
}
