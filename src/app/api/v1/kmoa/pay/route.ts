import { NextRequest, NextResponse } from "next/server";
import { executePayment } from "@/lib/kcaDb";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        const VALID_MERCHANT_KEY = "Bearer moa-merch-5e516c7d164218f4";
        
        if (!authHeader || authHeader !== VALID_MERCHANT_KEY) {
            return NextResponse.json({ success: false, error: "인증되지 않은 가맹점 접근입니다. (Invalid API Key)" }, { status: 401 });
        }

        const body = await request.json();
        const { uid, merchantId, currency, amount, orderId, items, shippingAddress } = body;

        if (!uid || !merchantId) {
            return NextResponse.json({ success: false, error: "회원 UID 또는 가맹점 ID가 누락되었습니다." }, { status: 400 });
        }
        if (!currency || !["HEX", "POINT", "VND"].includes(currency)) {
            return NextResponse.json({ success: false, error: "유효한 통화(HEX, POINT, VND)를 지정해주세요." }, { status: 400 });
        }
        if (!amount || Number(amount) <= 0) {
            return NextResponse.json({ success: false, error: "결제 금액이 올바르지 않습니다." }, { status: 400 });
        }
        if (!orderId) {
            return NextResponse.json({ success: false, error: "주문 번호(orderId)가 누락되었습니다." }, { status: 400 });
        }

        const result = executePayment({
            uid,
            merchantId,
            currency,
            amount: Number(amount),
            orderId,
            items,
            shippingAddress
        });

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "K-MOA 결제가 성공적으로 승인되었습니다.",
            transactionId: result.transactionId,
            receipt: result.receipt
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || "K-MOA 게이트웨이 내부 오류가 발생했습니다." }, { status: 500 });
    }
}
