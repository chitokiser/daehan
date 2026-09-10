import { NextRequest, NextResponse } from "next/server";
import { getDb, USERS_COL, getUserWallet } from "@/lib/kcaDb";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, dpAmount, expAmount } = body;

        if (!uid) {
            return NextResponse.json({ success: false, error: "uid는 필수입니다." }, { status: 400 });
        }

        const db = getDb();
        const user = await getUserWallet(uid);
        const newDp = (user.dpPoints || 0) + (Number(dpAmount) || 0);
        const newExp = (user.exp || 0) + (Number(expAmount) || 0);

        await db.collection(USERS_COL).doc(uid).set({
            dpPoints: newDp,
            exp: newExp
        }, { merge: true });

        return NextResponse.json({ success: true, newDp, newExp });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
