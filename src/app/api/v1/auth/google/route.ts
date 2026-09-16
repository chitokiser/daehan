export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { registerOrLoginGoogleUser, getUserTransactions, getUserOrders } from "@/lib/kcaDb";

export async function POST(req: NextRequest) {
    try {
        let body: any = {};
        try {
            body = await req.json();
        } catch {
            try {
                const rawText = await req.text();
                body = rawText ? JSON.parse(rawText) : {};
            } catch {
                body = {};
            }
        }
        const { email, name, avatar, sub, referrerUid, termsAgreed } = body;

        const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        if (!cleanEmail) {
            return NextResponse.json({
                success: false,
                error: "올바른 이메일 주소를 입력해주세요."
            }, { status: 400 });
        }

        const effectiveName = name ? name.trim() : "Google 인증 회원";
        const effectiveAvatar = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(effectiveName)}&background=E31837&color=ffffff&bold=true`;

        const result = await registerOrLoginGoogleUser({
            email: cleanEmail,
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
        }, { status: 200 });
    }
}

