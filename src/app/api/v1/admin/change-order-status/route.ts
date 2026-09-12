import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/kcaDb";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { orderId, status, shippingInfo } = body;

        if (!orderId || !status) {
            return NextResponse.json({ success: false, error: "주문 ID와 변경할 상태값이 필요합니다." }, { status: 400 });
        }

        const result = await updateOrderStatus(orderId, status, shippingInfo);
        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: `주문 ${orderId}의 상태가 ${status}(으)로 성공적으로 변경되었습니다.`,
            data: result.order
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message || "주문 상태 변경 처리 중 오류가 발생했습니다." }, { status: 500 });
    }
}
