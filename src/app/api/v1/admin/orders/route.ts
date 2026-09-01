import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, updateOrderStatus } from "@/lib/kcaDb";

export async function GET(request: NextRequest) {
    try {
        const orders = getAllOrders();
        return NextResponse.json({ success: true, data: orders });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ success: false, error: "주문번호 및 변경 상태가 필요합니다." }, { status: 400 });
        }

        const result = updateOrderStatus(orderId, status);
        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: `주문 [${orderId}] 상태가 [${status}]로 변경되었습니다.`,
            order: result.order
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
