import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, updateUserRole, updateUserBalance, getAdminStats, UserRole } from "@/lib/kcaDb";

export async function GET(request: NextRequest) {
    try {
        const users = await getAllUsers();
        const stats = await getAdminStats();

        return NextResponse.json({
            success: true,
            data: {
                users,
                stats
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { adminUid, targetUid, action, newRole, updates } = body;

        if (!adminUid) {
            return NextResponse.json({ success: false, error: "관리자 UID가 필요합니다." }, { status: 400 });
        }

        if (action === "UPDATE_ROLE") {
            if (!targetUid || !newRole) {
                return NextResponse.json({ success: false, error: "대상 회원 및 권한 정보가 누락되었습니다." }, { status: 400 });
            }

            const result = await updateUserRole(adminUid, targetUid, newRole as UserRole);
            if (!result.success) {
                return NextResponse.json({ success: false, error: result.error }, { status: 403 });
            }

            return NextResponse.json({
                success: true,
                message: `회원 [${result.user?.name}]의 권한이 [${newRole}]로 성공적으로 변경되었습니다.`,
                user: result.user
            });
        }

        if (action === "UPDATE_BALANCE") {
            if (!targetUid || !updates) {
                return NextResponse.json({ success: false, error: "대상 회원 및 잔액 수정 정보가 누락되었습니다." }, { status: 400 });
            }

            const result = await updateUserBalance(adminUid, targetUid, updates);
            if (!result.success) {
                return NextResponse.json({ success: false, error: result.error }, { status: 403 });
            }

            return NextResponse.json({
                success: true,
                message: `회원 [${result.user?.name}]의 지갑 잔액이 성공적으로 업데이트되었습니다.`,
                user: result.user
            });
        }

        return NextResponse.json({ success: false, error: "알 수 없는 요청입니다." }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
