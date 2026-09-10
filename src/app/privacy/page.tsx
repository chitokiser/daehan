import styles from './page.module.css';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
    title: '개인정보 처리방침 | 대한김치 (Daehan Kimchi)',
    description: '인피니스(주) 대한김치의 개인정보 처리방침 및 고객 정보 보호 정책 안내.',
};

export default function PrivacyPage() {
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
                            <ShieldCheck size={28} color="var(--primary-color)" />
                        </div>
                        <div>
                            <h1 className={styles.title}>개인정보 처리방침</h1>
                            <p className={styles.subTitle}>인피니스 주식회사 (대한김치 DAEHAN KIMCHI) 개인정보 보호 정책</p>
                        </div>
                    </div>
                </div>

                {/* Main Legal Document Card */}
                <div className={styles.card}>
                    <div className={styles.effectiveBadge}>
                        <CheckCircle2 size={14} /> 시행일자: 2026년 1월 1일
                    </div>

                    <div className={styles.introText}>
                        인피니스 주식회사(이하 "회사"라 함)는 이용자의 개인정보를 매우 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다. 회사는 개인정보 처리방침을 통하여 이용자께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
                    </div>

                    {/* Section 1 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제1조 (개인정보의 처리 목적)</h2>
                        <p>회사는 다음의 목적을 위하여 최소한의 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                        <ul className={styles.list}>
                            <li><strong>회원 가입 및 관리:</strong> 회원 가입의사 확인, 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지.</li>
                            <li><strong>재화 또는 서비스 제공:</strong> 물품배송(하노이 콜드체인 직배송), 결제 및 정산, 주문 내역 관리.</li>
                            <li><strong>지갑 자산 및 로열티 혜택 관리:</strong> 대한포인트(DP) 적립·전환, 충전머니 잔액 관리, 레벨 성장 시스템 운영 및 추천인(멘토) 보상 지급.</li>
                            <li><strong>고객 상담 및 민원 처리:</strong> 고객 문의 사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보.</li>
                        </ul>
                    </div>

                    {/* Section 2 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제2조 (처리하는 개인정보의 항목)</h2>
                        <p>회사는 회원가입 및 서비스 이용 과정에서 아래와 같은 개인정보 항목을 수집하고 있습니다.</p>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>수집 및 처리 항목</th>
                                        <th>수집 목적</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>회원가입 (필수)</strong></td>
                                        <td>이름, 이메일 주소, 프로필 사진, 추천인(멘토) UID 또는 이메일</td>
                                        <td>회원 식별, 서비스 이용 및 다단계 혜택 연동</td>
                                    </tr>
                                    <tr>
                                        <td><strong>상품 주문 (필수)</strong></td>
                                        <td>수령인 성명, 연락처(전화번호), 배송지 주소, 배송 요청사항</td>
                                        <td>상품 배송 및 신선 콜드체인 출하 안내</td>
                                    </tr>
                                    <tr>
                                        <td><strong>계좌 입금 충전 (필수)</strong></td>
                                        <td>입금자명, 신청 충전 금액, 입금 계좌 정보</td>
                                        <td>입금 확인 및 충전머니 수동/자동 승인 처리</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제3조 (개인정보의 처리 및 보유 기간)</h2>
                        <p>회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.</p>
                        <ul className={styles.list}>
                            <li><strong>회원 가입 정보:</strong> 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지)</li>
                            <li><strong>대금결제 및 재화 등의 공급에 관한 기록:</strong> 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                            <li><strong>소비자의 불만 또는 분쟁처리에 관한 기록:</strong> 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                        </ul>
                    </div>

                    {/* Section 4 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제4조 (개인정보의 제3자 제공 및 위탁)</h2>
                        <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 이용자가 사전에 동의한 경우나 법령의 규정에 의거한 경우는 예외로 합니다. 상품 배송을 위해 배송 전문 업체에 최소한의 배송 정보(성명, 주소, 연락처)가 전달될 수 있습니다.</p>
                    </div>

                    {/* Section 5 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제5조 (정보주체의 권리·의무 및 행사방법)</h2>
                        <p>이용자는 개인정보주체로서 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지(탈퇴)를 요청할 수도 있습니다. 언제든지 서면, 이메일 등을 통해 권리 행사를 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
                    </div>

                    {/* Section 6 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제6조 (개인정보의 안전성 확보 조치)</h2>
                        <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
                        <ul className={styles.list}>
                            <li><strong>기술적 조치:</strong> 개인정보의 암호화 통신(SSL/TLS), Firebase/Firestore 보안 규칙 적용, 접근 권한 통제.</li>
                            <li><strong>관리적 조치:</strong> 개인정보 취급 직원의 최소화 및 정기적인 위생·보안 교육 실시.</li>
                        </ul>
                    </div>

                    {/* Section 7 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionHeading}>제7조 (개인정보 보호책임자 및 문의처)</h2>
                        <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                        
                        <div className={styles.contactCard}>
                            <div className={styles.contactItem}>
                                <label>개인정보 보호책임자:</label>
                                <span>김용진 (대표이사)</span>
                            </div>
                            <div className={styles.contactItem}>
                                <label>문의 이메일:</label>
                                <span>daguri75@gmail.com</span>
                            </div>
                            <div className={styles.contactItem}>
                                <label>하노이 고객센터:</label>
                                <span>070-2116-617 (Zalo / 카카오톡 상담)</span>
                            </div>
                            <div className={styles.contactItem}>
                                <label>공장 및 영업소 주소:</label>
                                <span>Số 3 Thôn Ngọc Giang, Xã Vĩnh Ngọc, Huyện Đông Anh, Hà Nội, Việt Nam</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
