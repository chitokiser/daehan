import { NextRequest, NextResponse } from "next/server";
import { createChargeRequest, getUserChargeRequests } from "@/lib/kcaDb";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, amount, depositorName } = body;

        if (!uid || !amount || !depositorName) {
            return NextResponse.json({ success: false, error: "uid, amount, depositorName은 필수입니다." }, { status: 400 });
        }

        const result = await createChargeRequest(uid, Number(amount), depositorName);
        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get("uid");

        if (!uid) {
            return NextResponse.json({ success: false, error: "uid 파라미터가 필요합니다." }, { status: 400 });
        }

        const requests = await getUserChargeRequests(uid);
        return NextResponse.json({ success: true, requests });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
