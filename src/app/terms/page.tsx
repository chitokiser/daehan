import styles from './page.module.css';
import Link from 'next/link';
import { FileText, ArrowLeft, CheckCircle2, Scale } from 'lucide-react';

export const metadata = {
    title: '서비스 이용약관 | 대한김치 (Daehan Kimchi)',
    description: '인피니스(주) 대한김치 온라인 서비스 및 회원 이용약관 안내.',
};

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Header Back & Title */}
                <div className={styles.headerBlock}>
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeft size={16} /> 홈으로 돌아가기
                    </Link>
                    <div className={styles.titleGroup}>
                        <div className={styles.iconWrap}>
                            <Scale size={28} color="var(--primary-color)" />
                        </div>
                        <div>
                            <h1 className={styles.title}>서비스 이용약관</h1>
                            <p className={styles.subTitle}>인피니스 주식회사 (대한김치 DAEHAN KIMCHI) 회원 서비스 이용약관</p>
                        </div>
                    </div>
                </div>

                {/* Main Legal Document Card */}
                <div className={styles.card}>
                    <div className={styles.effectiveBadge}>
                        <CheckCircle2 size={14} /> 시행일자: 2026년 1월 1일
                    </div>

                    {/* Section 1 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제1조 (목적)</h2>
                        <p>
                            이 약관은 인피니스 주식회사(이하 "회사"라 함)가 운영하는 대한김치 온라인 쇼핑몰 및 인터넷 서비스(이하 "서비스"라 함)의 이용조건 및 절차, 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제2조 (정의)</h2>
                        <ul className={styles.list}>
                            <li><strong>"대한김치"</strong>란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 설정한 가상 영업장을 말합니다.</li>
                            <li><strong>"이용자"</strong>란 "대한김치"에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                            <li><strong>"회원"</strong>이라 함은 "대한김치"에 개인정보를 제공하여 회원등록을 한 자로서, 추천인(멘토) 연동을 통해 회사의 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
                            <li><strong>"충전머니"</strong>라 함은 계좌 입금 및 환전을 통해 충전되며 대한김치 쇼핑몰 내에서 현금처럼 상품 결제에 사용할 수 있는 전용 전자 결제 수단을 말합니다.</li>
                            <li><strong>"대한포인트(DP)"</strong>라 함은 회원의 플랫폼 활동을 통해 적립되며 레벨 전환율에 따라 충전머니로 전환할 수 있는 로열티 포인트를 말합니다.</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제3조 (약관의 게시와 개정)</h2>
                        <p>
                            회사는 이 약관의 내용과 상호, 대표자 성명, 영업소 소재지 주소, 전화번호, 이메일 주소 등을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
                        </p>
                    </div>

                    {/* Section 4 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제4조 (회원가입 및 추천인 제도)</h2>
                        <p>
                            이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관 및 개인정보 처리방침에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
                        </p>
                        <ul className={styles.list}>
                            <li>대한김치 생태계의 특성상 신규 회원가입 시 기존 회원의 <strong>추천인(멘토) 이메일 또는 UID 코드</strong> 입력이 필수적입니다. (초기 루트 관리자는 제외)</li>
                            <li>신규 회원이 정상 가입을 완료하면 가입 축하 보상(1,000 DP)이 적립되며, 추천인에게는 추천 보상(500 DP)이 자동 적립됩니다.</li>
                        </ul>
                    </div>

                    {/* Section 5 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제5조 (지갑 자산 및 포인트 환전)</h2>
                        <ul className={styles.list}>
                            <li>회원은 보유한 대한포인트(DP)를 아래 환전 공식을 통해 충전머니로 환전할 수 있습니다.</li>
                            <li><strong>DP ➔ 충전머니 전환 공식:</strong> <code>전환 충전머니 = DP × (현재 레벨 / 10)</code></li>
                            <li>계좌 입금을 통한 충전머니 신청 시, 관리자가 입금을 확인한 후 즉시 충전머니 잔액에 반영됩니다.</li>
                        </ul>
                    </div>

                    {/* Section 6 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제6조 (상품 주문 및 콜드체인 배송)</h2>
                        <p>
                            회사는 회원이 주문한 상품이 최상의 신선도를 유지할 수 있도록 0~4℃ 정밀 콜드체인 전용 냉장 차량을 통해 하노이 및 베트남 전역으로 배송을 실시합니다.
                        </p>
                    </div>

                    {/* Section 7 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제7조 (청약철회 및 교환/환불)</h2>
                        <p>
                            김치 및 신선 식품의 특성상 제품 포장이 훼손되었거나 단순 변심에 의한 반품은 제한될 수 있습니다. 단, 배송 중 파손, 변질, 제품 하자 등이 발생한 경우 상품 수령 후 24시간 이내에 고객센터로 접수해 주시면 100% 교환 또는 환불 처리해 드립니다.
                        </p>
                    </div>

                    {/* Section 8 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제8조 (분쟁해결 및 관할법원)</h2>
                        <p>
                            회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 회사의 본사 소재지 관할 법원을 전속 관할 법원으로 합니다.
                        </p>
                    </div>

                    {/* Company Footer Info */}
                    <div className={styles.companyFooter}>
                        <p><strong>인피니스 주식회사 (CÔNG TY CỔ PHẦN INFINIS)</strong></p>
                        <p>대표이사: 김용진 | 고객센터: 070-2116-617 | 이메일: daguri75@gmail.com</p>
                        <p>본사 주소: Số 26 Phố Dương Đình Nghệ, Phường Yên Hoà, Quận Cầu Giấy, Hà Nội, Việt Nam</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
