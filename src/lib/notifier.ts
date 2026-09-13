/**
 * NotificationService (독립 알림 서비스 모듈)
 * 
 * 1차: Telegram Bot 운영자 실시간 푸시 알림
 * 향후 확장: Firebase Cloud Messaging(FCM) 및 SMS 알림 모듈 추가 가능
 */

export interface OrderNotificationPayload {
    orderId: string;
    uid: string;
    paidAmount: number;
    currency: string;
    status?: string;
    items: Array<{
        productName?: string;
        name?: string;
        quantity: number;
        priceVnd?: number;
        weight?: string;
    }>;
    shippingAddress: {
        recipient: string;
        phone: string;
        address: string;
        memo?: string;
    };
    createdAt?: string;
}

export interface DepositRequestNotificationPayload {
    requestId: string;
    uid: string;
    userEmail?: string;
    userName?: string;
    amount: number;
    depositorName: string;
    createdAt?: string;
}

export class NotificationService {
    /**
     * 텔레그램 메세지 전송 공통 로직
     */
    private static async sendTelegramMessage(htmlMessage: string): Promise<boolean> {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            console.log("🔔 [NotificationService] TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID 환경변수가 설정되지 않아 알림이 콘솔로그로만 기록됩니다.");
            return false;
        }

        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: htmlMessage,
                    parse_mode: "HTML",
                    disable_web_page_preview: true
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("❌ [NotificationService] 텔레그램 전송 실패:", errText);
                return false;
            }

            console.log("✅ [NotificationService] 텔레그램 알림 전송 완료!");
            return true;
        } catch (error) {
            console.error("❌ [NotificationService] 텔레그램 API 호출 예외:", error);
            return false;
        }
    }

    /**
     * 쇼핑몰 신규 주문 발생 시 운영자 알림 전송
     */
    public static async sendOrderNotification(orderData: OrderNotificationPayload): Promise<void> {
        try {
            const itemsText = orderData.items.map((item) => {
                const pName = item.productName || item.name || "대한김치 상품";
                const weightStr = item.weight ? ` (${item.weight})` : "";
                return `  • <b>${pName}</b>${weightStr} x <b>${item.quantity}개</b>`;
            }).join("\n");

            const currencyText = orderData.currency === "MONEY" ? "충전머니" : orderData.currency;
            const recipient = orderData.shippingAddress?.recipient || "미지정";
            const phone = orderData.shippingAddress?.phone || "미지정";
            const address = orderData.shippingAddress?.address || "미지정";
            const memo = orderData.shippingAddress?.memo ? `\n📝 <b>요청사항:</b> ${orderData.shippingAddress.memo}` : "";

            const htmlMessage = `
🚨 <b>[대한김치] 신규 주문 발생!</b> 🚨

🆔 <b>주문번호:</b> <code>${orderData.orderId}</code>
👤 <b>회원 ID:</b> ${orderData.uid}
💰 <b>결제금액:</b> <b>${orderData.paidAmount.toLocaleString()} ${currencyText}</b>
💳 <b>결제상태:</b> ${orderData.status || "접수완료"}

📦 <b>주문 상품 목록:</b>
${itemsText}

📍 <b>배송지 정보:</b>
  • 수령인: ${recipient}
  • 연락처: ${phone}
  • 주소: ${address}${memo}

⏰ <b>주문시각:</b> ${orderData.createdAt || new Date().toLocaleString("ko-KR")}
            `.trim();

            console.log("📢 [NotificationService] 텔레그램 신규 주문 알림 시도 중...", orderData.orderId);
            await this.sendTelegramMessage(htmlMessage);

            // 향후 FCM Push 및 추가 알림 채널 연동 지점
            // await this.sendFcmPushNotification(orderData);
        } catch (err) {
            console.error("❌ [NotificationService] sendOrderNotification 에러:", err);
        }
    }

    /**
     * 계좌 입금 충전 신청 발생 시 운영자 알림 전송
     */
    public static async sendDepositRequestNotification(depositData: DepositRequestNotificationPayload): Promise<void> {
        try {
            const htmlMessage = `
💳 <b>[대한김치] 계좌 입금 충전 요청!</b> 💳

🆔 <b>신청 ID:</b> <code>${depositData.requestId}</code>
👤 <b>회원:</b> ${depositData.userName || depositData.userEmail || depositData.uid}
💵 <b>신청 금액:</b> <b>${depositData.amount.toLocaleString()} VND</b>
🏦 <b>입금자명:</b> <b>${depositData.depositorName}</b>

⏰ <b>신청시각:</b> ${depositData.createdAt || new Date().toLocaleString("ko-KR")}

<i>※ 관리자 센터에서 확인 후 머니 승인을 진행해주세요.</i>
            `.trim();

            console.log("📢 [NotificationService] 텔레그램 충전 신청 알림 시도 중...", depositData.requestId);
            await this.sendTelegramMessage(htmlMessage);
        } catch (err) {
            console.error("❌ [NotificationService] sendDepositRequestNotification 에러:", err);
        }
    }

    /**
     * 정기구독 신청 발생 시 운영자 알림 전송
     */
    public static async sendSubscriptionNotification(subData: {
        subscriptionId: string;
        uid: string;
        userName?: string;
        tierName: string;
        kimchiType: string;
        cycle: string;
        weight: string;
        monthlyPriceVnd: number;
        recipient: string;
        phone: string;
        address: string;
    }): Promise<void> {
        try {
            const htmlMessage = `
🥬 <b>[대한김치] 정기배송 구독 신청!</b> 🥬

🆔 <b>구독 ID:</b> <code>${subData.subscriptionId}</code>
👤 <b>회원:</b> ${subData.userName || subData.uid}
📦 <b>구독 플랜:</b> <b>${subData.tierName} (${subData.weight})</b>
🌶️ <b>선택 김치:</b> ${subData.kimchiType}
🗓️ <b>배송 주기:</b> <b>${subData.cycle}</b>
💰 <b>월 정기 금액 (5% 할인가):</b> <b>${subData.monthlyPriceVnd.toLocaleString()} VND</b>

📍 <b>배송지 정보:</b>
  • 수령인: ${subData.recipient}
  • 연락처: ${subData.phone}
  • 주소: ${subData.address}

⏰ <b>신청시각:</b> ${new Date().toLocaleString("ko-KR")}
            `.trim();

            console.log("📢 [NotificationService] 텔레그램 정기구독 알림 시도 중...", subData.subscriptionId);
            await this.sendTelegramMessage(htmlMessage);
        } catch (err) {
            console.error("❌ [NotificationService] sendSubscriptionNotification 에러:", err);
        }
    }

    /**
     * (향후 확장용) FCM 모바일 Push 알림 스텁
     */
    public static async sendFcmPushNotification(_payload: any): Promise<void> {
        // FCM 모바일 푸시 추가 시 이곳 구현
    }
}

/**
 * 기존 코드 호환용 래퍼 함수
 */
export async function sendAdminOrderNotification(orderData: any): Promise<void> {
    return NotificationService.sendOrderNotification(orderData);
}
