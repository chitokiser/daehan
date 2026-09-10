import { NextRequest, NextResponse } from "next/server";
import { convertDpToMoney } from "@/lib/kcaDb";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, dpAmount } = body;

        if (!uid || !dpAmount) {
            return NextResponse.json({ success: false, error: "uid와 dpAmount는 필수 파라미터입니다." }, { status: 400 });
        }

        const result = await convertDpToMoney(uid, Number(dpAmount));
        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
