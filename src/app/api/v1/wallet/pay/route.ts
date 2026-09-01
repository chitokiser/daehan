import { NextRequest, NextResponse } from "next/server";
import { executePayment } from "@/lib/kcaDb";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, merchantId, currency, amount, orderId, items, shippingAddress } = body;

        if (!uid) {
            return NextResponse.json({ success: false, error: "회원 UID가 누락되었습니다." }, { status: 400 });
        }
        if (!currency || !["HEX", "POINT", "VND"].includes(currency)) {
            return NextResponse.json({ success: false, error: "유효한 통화(HEX, POINT, VND)를 지정해주세요." }, { status: 400 });
        }
        if (!amount || Number(amount) <= 0) {
            return NextResponse.json({ success: false, error: "결제 금액이 올바르지 않습니다." }, { status: 400 });
        }

        const effectiveOrderId = orderId || `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const result = executePayment({
            uid,
            merchantId: merchantId || "daehan_kimchi_store",
            currency,
            amount: Number(amount),
            orderId: effectiveOrderId,
            items,
            shippingAddress
        });

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            transactionId: result.transactionId,
            receipt: result.receipt
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
