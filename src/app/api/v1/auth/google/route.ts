export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { registerOrLoginGoogleUser, getUserTransactions, getUserOrders } from "@/lib/kcaDb";

export async function POST(req: NextRequest) {
    try {
        let body: any = {};
        try {
            const rawText = await req.text();
            body = rawText ? JSON.parse(rawText) : {};
        } catch {
            body = {};
        }
        const { email, name, avatar, sub, referrerUid, termsAgreed } = body;

        const effectiveEmail = email || `user_${Date.now()}@gmail.com`;
        const effectiveName = name || "Google 인증 회원";
        const effectiveAvatar = avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

        const result = await registerOrLoginGoogleUser({
            email: effectiveEmail,
            name: effectiveName,
            avatar: effectiveAvatar,
            sub,
            referrerUid,
            termsAgreed
        });

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 400 });
        }

        const user = result.user!;

        let recentOrders: any[] = [];
        let recentTransactions: any[] = [];
        try {
            recentOrders = await getUserOrders(user.uid);
            recentTransactions = await getUserTransactions(user.uid);
        } catch (err) {
            console.error("Failed to fetch user orders/transactions:", err);
        }

        return NextResponse.json({
            success: true,
            message: "Google 계정 로그인이 성공적으로 완료되었습니다.",
            data: {
                ...user,
                recentOrders,
                recentTransactions
            }
        });
    } catch (e: any) {
        console.error("Auth google API error:", e);
        return NextResponse.json({
            success: false,
            error: e.message || "Google 로그인 처리 중 서버 오류가 발생했습니다."
        }, { status: 500 });
    }
}
