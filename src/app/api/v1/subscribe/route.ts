import { NextRequest, NextResponse } from "next/server";
import { createSubscription, getUserSubscriptions } from "@/lib/kcaDb";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            uid, userName, userEmail, tier, tierName, weight, kimchiType,
            cycle, monthlyPriceVnd, originalPriceVnd, discountPercent,
            shippingAddress, paymentMethod
        } = body;

        if (!uid || !tier || !kimchiType || !cycle || !monthlyPriceVnd || !shippingAddress) {
            return NextResponse.json({ success: false, error: "필수 구독 정보가 누락되었습니다." }, { status: 400 });
        }

        const result = await createSubscription({
            uid,
            userName,
            userEmail,
            tier,
            tierName: tierName || "Basic",
            weight: weight || "1주일 2Kg",
            kimchiType,
            cycle,
            monthlyPriceVnd: Number(monthlyPriceVnd),
            originalPriceVnd: Number(originalPriceVnd || monthlyPriceVnd),
            discountPercent: Number(discountPercent || 5),
            shippingAddress,
            paymentMethod: paymentMethod || "VND"
        });

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "🎉 김치 정기배송 구독 신청이 성공적으로 완료되었습니다!",
            subscription: result.subscription
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message || "구독 처리 중 서버 오류가 발생했습니다." }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get("uid");

        if (!uid) {
            return NextResponse.json({ success: false, error: "uid 파라미터가 필요합니다." }, { status: 400 });
        }

        const subscriptions = await getUserSubscriptions(uid);
        return NextResponse.json({ success: true, subscriptions });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
