import { NextRequest, NextResponse } from "next/server";
import { resetAllUserWallets } from "@/lib/kcaDb";

export async function POST(request: NextRequest) {
    try {
        const result = await resetAllUserWallets();
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const result = await resetAllUserWallets();
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
