import Link from "next/link";
import styles from "./page.module.css";
import { 
    Coins, Wallet, ArrowRight, ShieldCheck, Zap, QrCode, 
    ExternalLink, CheckCircle2, Code2, Server, ArrowLeft, Users, CreditCard 
} from "lucide-react";

export default function KmoaGuidePage() {
    return (
        <div className={styles.guideContainer}>
            <div className={styles.topBack}>
                <Link href="/shop" className={styles.backLink}>
                    <ArrowLeft size={16} /> 쇼핑몰로 돌아가기
                </Link>
            </div>

            <header className={styles.header}>
                <span className={styles.badge}>K-MOA MONEY & POINT GATEWAY v2.0</span>
                <h1 className={styles.title}>K-MOA 충전머니 & 포인트 결제 연동 가이드</h1>
                <p className={styles.subtitle}>
                    대한김치 및 K-컬처 가맹점을 위한 K-MOA 충전머니(1 머니 = 1,000 VND) & 포인트 결제 프로토콜
                </p>
            </header>

            {/* Section 1: Overview */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Coins size={22} color="#fcd34d" />
                    1. K-MOA 결제 시스템 및 공통 회원 DB 개요
                </h2>
                <p className={styles.desc}>
                    <strong>K-MOA 결제 시스템</strong>은 K-컬처 쇼핑몰과 가맹점에서 <strong>K-MOA 충전머니</strong>와 <strong>포인트</strong>를 매개로 간편하고 신속하게 결제할 수 있는 통합 머니 결제 게이트웨이입니다. 회원 DB를 공유하여 단 한 번의 계정으로 모든 가맹점에서 잔액과 포인트를 사용할 수 있습니다.
                </p>
                <div className={styles.grid2}>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>
                            <Zap size={20} color="#fcd34d" />
                        </div>
                        <h3>1초 즉시 결제 (Instant Money Payment)</h3>
                        <p>복잡한 인증 절차 없이, 보유한 K-MOA 충전머니 또는 포인트로 원클릭 즉시 결제가 처리됩니다.</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>
                            <CheckCircle2 size={20} color="#00E676" />
                        </div>
                        <h3>5% 대한포인트(DP) 자동 적립</h3>
                        <p>K-MOA 충전머니 결제 발생 시 구매자에게 결제 금액의 5%가 대한포인트(DP)로 자동 적립됩니다.</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>
                            <Users size={20} color="#2979FF" />
                        </div>
                        <h3>공통 회원 DB & 통합 잔액 공유</h3>
                        <p>Google 소셜 로그인 및 K-MOA 회원 계정으로 모든 가맹점에서 동일한 머니/포인트 잔액을 사용합니다.</p>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>
                            <CreditCard size={20} color="#f7a400" />
                        </div>
                        <h3>다양한 복합 결제 수단 지원</h3>
                        <p>K-MOA 충전머니, K-MOA 포인트, 모바일 QR코드 스캔 결제, 일반 결제(VND/계좌이체)를 완벽 지원합니다.</p>
                    </div>
                </div>

                <div className={styles.highlightBox}>
                    <strong>📌 가맹점 식별 코드 (Merchant ID):</strong>
                    <code className={styles.contractCode}>daehan_kimchi_store</code>
                </div>
            </section>

            {/* Section 2: Modes */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <QrCode size={22} color="#00E676" />
                    2. 지원 결제 방식 (Payment Options)
                </h2>

                <div className={styles.modeCard}>
                    <h3>옵션 1. K-MOA 충전머니 1초 결제 (K-MOA Money Direct)</h3>
                    <p>회원 계정에 충전된 K-MOA 머니 잔액에서 즉시 차감 결제되며, 5% 대한포인트(DP)가 자동 적립됩니다.</p>
                </div>

                <div className={styles.modeCard}>
                    <h3>옵션 2. K-MOA 포인트 결제 (Point 100% Pay)</h3>
                    <p>회원이 적립받은 K-MOA 포인트를 전액 사용하여 현금 부담 없이 100% 포인트로 결제합니다.</p>
                </div>

                <div className={styles.modeCard}>
                    <h3>옵션 3. K-MOA 모바일 앱 QR코드 스캔 결제 (App Scan & Pay)</h3>
                    <p>쇼핑몰 주문서에 실시간 생성된 Dynamic QR 코드를 K-MOA 모바일 앱 카메라로 스캔하여 결제 승인합니다.</p>
                    <pre className={styles.codeBlock}>
                        <code>kmoa://pay?merchant=daehan_kimchi_store&orderId={'{ORDER_ID}'}&amount={'{MONEY_AMOUNT}'}&currency=HEX</code>
                    </pre>
                </div>

                <div className={styles.modeCard}>
                    <h3>옵션 4. 일반 결제 (VND 현금 / 계좌이체)</h3>
                    <p>VND 예치금 또는 하노이 현지 계좌이체를 통한 신선 배송 주문을 처리합니다.</p>
                </div>
            </section>

            {/* Section 3: REST API Specifications */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Server size={22} color="#2979FF" />
                    3. K-MOA 가맹점 REST API 규격
                </h2>

                <h3 className={styles.subHeading}>1) 결제 승인 API (POST /api/v1/kmoa/pay)</h3>
                <pre className={styles.codeBlock}>
<code>{`// Request Payload
{
  "uid": "user_daehan_vip01",
  "merchantId": "daehan_kimchi_store",
  "currency": "HEX", // "HEX"(K-MOA머니) | "POINT" | "VND"
  "amount": 90,
  "orderId": "ORD-KMOA-20260902-991",
  "items": [
    {
      "productId": 1,
      "productName": "배추김치 (포기김치 1Kg)",
      "quantity": 1,
      "priceVnd": 90000,
      "priceHex": 90
    }
  ],
  "shippingAddress": {
    "recipient": "최민준",
    "phone": "0702116617",
    "address": "Hanoi, Nam Tu Liem, My Dinh Song Da, Villa #12"
  }
}

// Response (200 OK)
{
  "success": true,
  "message": "K-MOA 충전머니 결제가 성공적으로 승인되었습니다.",
  "transactionId": "KMOA-PAY-M928K-1829",
  "receipt": {
    "orderId": "ORD-KMOA-20260902-991",
    "paidAmount": 90,
    "currency": "HEX",
    "remainingBalance": 2410,
    "earnedDp": 4500,
    "txHash": "kmoa_pay_1788316200_a8f9b2"
  }
}`}</code>
                </pre>

                <h3 className={styles.subHeading} style={{ marginTop: '24px' }}>2) 결제 상태 조회 및 검증 API (GET /api/v1/kmoa/verify?orderId=...)</h3>
                <pre className={styles.codeBlock}>
<code>{`// GET /api/v1/kmoa/verify?orderId=ORD-KMOA-20260902-991

// Response (200 OK)
{
  "success": true,
  "data": {
    "orderId": "ORD-KMOA-20260902-991",
    "status": "PAID",
    "paidAmount": 90,
    "currency": "HEX",
    "txId": "KMOA-PAY-M928K-1829",
    "createdAt": "2026-09-02T02:50:00Z"
  }
}`}</code>
                </pre>
            </section>

            {/* Section 4: External Official Guide & Marketing */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <ExternalLink size={22} color="#f7a400" />
                    4. K-MOA 공식 문서 & 제휴사 추천인 가입 링크
                </h2>
                <div className={styles.modeCard}>
                    <h3>🌐 K-MOA 공식 개발자 가이드 (Live)</h3>
                    <p>본사에서 제공하는 최신 API 명세서 원문을 확인할 수 있습니다.</p>
                    <p>
                        <a 
                            href="https://kmoa.netlify.app/kmoa_merchant_guide.html" 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ color: '#fcd34d', fontWeight: 700, textDecoration: 'underline' }}
                        >
                            https://kmoa.netlify.app/kmoa_merchant_guide.html ↗
                        </a>
                    </p>
                </div>

                <div className={styles.modeCard} style={{ marginTop: '12px' }}>
                    <h3>🚀 추천인(Mentor) 자동 가입 마케팅 링크</h3>
                    <p>대한김치 고객이 K-MOA에 신규 가입할 때 1,000 보너스 포인트를 지급하고 가맹점 회원으로 유치합니다.</p>
                    <pre className={styles.codeBlock}>
                        <code>https://kmoa.netlify.app/register.html?mentor=daehan_kimchi_store</code>
                    </pre>
                </div>
            </section>
        </div>
    );
}
