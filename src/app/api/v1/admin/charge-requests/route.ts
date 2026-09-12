import { NextRequest, NextResponse } from "next/server";
import { getAllChargeRequests, approveChargeRequest, rejectChargeRequest } from "@/lib/kcaDb";

export async function GET() {
    try {
        const requests = await getAllChargeRequests();
        return NextResponse.json({ success: true, requests });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const targetRequestId = body.requestId || body.id;
        const action = body.action;

        if (!targetRequestId || !action) {
            return NextResponse.json({ success: false, error: "requestId 및 action(APPROVE/REJECT) 파라미터가 필요합니다." }, { status: 400 });
        }

        if (action === "APPROVE") {
            const result = await approveChargeRequest(targetRequestId);
            if (!result.success) return NextResponse.json(result, { status: 400 });
            return NextResponse.json(result);
        } else if (action === "REJECT") {
            const result = await rejectChargeRequest(targetRequestId);
            if (!result.success) return NextResponse.json(result, { status: 400 });
            return NextResponse.json(result);
        }

        return NextResponse.json({ success: false, error: "유효하지 않은 action입니다." }, { status: 400 });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
