export async function sendAdminOrderNotification(orderData: any) {
    // 텔레그램 봇 설정 (환경변수에서 가져옴)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 설정이 없으면 개발 환경 로그만 출력하고 종료
    if (!botToken || !chatId) {
        console.log("🔔 [알림 시스템] 텔레그램 토큰 또는 Chat ID가 설정되지 않아 알림이 생략되었습니다.");
        console.log("📩 [주문 정보]:", orderData);
        return;
    }

    try {
        const itemsText = orderData.items.map((item: any) => 
            `- ${item.productName} (${item.quantity}개)`
        ).join('\n');

        const message = `
🚨 <b>신규 주문 알림 (대한김치)</b> 🚨

<b>주문번호:</b> <code>${orderData.orderId}</code>
<b>결제금액:</b> ${orderData.paidAmount.toLocaleString()} ${orderData.currency}
<b>회원 ID:</b> ${orderData.uid}

📦 <b>주문 상품:</b>
${itemsText}

📍 <b>배송지 정보:</b>
수령인: ${orderData.shippingAddress.recipient}
연락처: ${orderData.shippingAddress.phone}
주소: ${orderData.shippingAddress.address}
        `.trim();

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            console.error("❌ 텔레그램 알림 전송 실패:", await response.text());
        } else {
            console.log("✅ 텔레그램 알림 전송 완료!");
        }

    } catch (error) {
        console.error("❌ 텔레그램 알림 API 호출 에러:", error);
    }
}
