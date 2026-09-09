import { NextRequest, NextResponse } from "next/server";
import { grantDaehanPoint, getDb, TRANSACTIONS_COL } from "@/lib/kcaDb";

const REWARD_AMOUNTS = {
    "READ_WEBZINE": 50,
    "SHARE_PRODUCT": 100,
    "WRITE_REVIEW": 500,
    "SHARE_RECIPE": 100
};

const ACTION_DESCRIPTIONS = {
    "READ_WEBZINE": "웹진 읽기 보상",
    "SHARE_PRODUCT": "상품 공유 보상",
    "WRITE_REVIEW": "상품 리뷰 작성 보상",
    "SHARE_RECIPE": "레시피 공유 보상"
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { uid, actionType, itemId } = body;

        const targetItemId = itemId || "GENERAL";

        if (!uid || !actionType) {
            return NextResponse.json({ success: false, error: "필수 파라미터가 누락되었습니다." }, { status: 400 });
        }

        const amount = REWARD_AMOUNTS[actionType as keyof typeof REWARD_AMOUNTS];
        const description = ACTION_DESCRIPTIONS[actionType as keyof typeof ACTION_DESCRIPTIONS];

        if (!amount) {
            return NextResponse.json({ success: false, error: "유효하지 않은 보상 타입입니다." }, { status: 400 });
        }

        const db = getDb();

        // 어뷰징 방지: 동일 유저, 동일 액션, 동일 아이템에 대해 이미 보상이 지급되었는지 확인
        // (단순화를 위해 itemId당 1회만 지급)
        const existingTxSnap = await db.collection(TRANSACTIONS_COL)
            .where("uid", "==", uid)
            .where("type", "==", "REWARD")
            .where("currency", "==", "DP")
            .get();
        
        // 메모리 상에서 필터링 (복합 색인 회피)
        const alreadyRewarded = existingTxSnap.docs.some((doc: any) => {
            const data = doc.data();
            return data.description && data.description.includes(actionType) && data.description.includes(targetItemId);
        });

        if (alreadyRewarded) {
            return NextResponse.json({ success: false, error: "이미 보상이 지급된 항목입니다." }, { status: 400 });
        }

        const fullDescription = `${description} (${targetItemId}) [${actionType}]`;
        const result = await grantDaehanPoint(uid, amount, fullDescription, "REWARD");

        if (result.success) {
            return NextResponse.json({ success: true, message: "포인트가 적립되었습니다.", newBalance: result.newBalance });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message || "서버 오류가 발생했습니다." }, { status: 500 });
    }
}
