import { NextRequest, NextResponse } from "next/server";
import { registerOrLoginGoogleUser, getUserTransactions, getUserOrders } from "@/lib/kcaDb";

export async function POST(req: NextRequest) {
    try {
        let body: any = {};
        try {
            body = await req.json();
        } catch {
            body = {};
        }
        const { email, name, avatar, sub } = body;

        const effectiveEmail = email || `user_${Date.now()}@gmail.com`;
        const effectiveName = name || "Google 인증 회원";
        const effectiveAvatar = avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80";

        const user = registerOrLoginGoogleUser({
            email: effectiveEmail,
            name: effectiveName,
            avatar: effectiveAvatar,
            sub
        });

        const recentOrders = getUserOrders(user.uid);
        const recentTransactions = getUserTransactions(user.uid);

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
        return NextResponse.json({
            success: false,
            error: e.message || "Google 로그인 처리 중 서버 오류가 발생했습니다."
        }, { status: 500 });
    }
}
