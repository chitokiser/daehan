import { NextRequest, NextResponse } from "next/server";
import { convertPointsToKm } from "@/lib/kcaDb";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { uid, points } = body;

        if (!uid || !points || points <= 0) {
            return NextResponse.json({ success: false, error: "유효하지 않은 요청입니다." }, { status: 400 });
        }

        const result = await convertPointsToKm(uid, Number(points));

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "포인트 전환이 완료되었습니다.",
                data: {
                    newPoints: result.newPoints,
                    newKm: result.newKm
                }
            });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message || "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
