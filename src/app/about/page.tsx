import styles from './page.module.css';
import Link from 'next/link';
import { Award, CheckCircle2, Download, Building2, ShieldCheck, HeartHandshake, Sparkles, FileText } from 'lucide-react';

export const metadata = {
    title: '회사소개서 | 대한김치 (Daehan Kimchi)',
    description: '인피니스(주) 대한김치의 대표 인사말, 브랜드 핵심 가치, HACCP 인증서 및 위생 관리 시스템 안내.',
};

export default function AboutPage() {
    return (
        <div className={styles.container}>
            {/* Hero Banner Section */}
            <section className={styles.heroSection}>
                <div className="container">
                    <div className={styles.heroBadge}>
                        <Sparkles size={16} />
                        <span>COMPANY PROFILE & BRAND STORY</span>
                    </div>
                    <h1 className={styles.title}>
                        정성 어린 정통 손맛과 꼼꼼한 위생 관리<br />
                        하노이 중심에서 전하는 완벽한 발효과학의 비밀
                    </h1>
                    <p className={styles.subtitle}>
                        인피니스㈜ 대한김치는 2023년 베트남 하노이 동안에 설립되어 100% 엄선된 농산물 원료와 HACCP CODEX 인증 위생 시설에서 정성껏 담근 대한민국 대표 김치를 선보입니다.
                    </p>
                    <div className={styles.heroActions}>
                        <a href="/docu/HACCP_Certificate.pdf" target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
                            <Download size={18} />
                            <span>HACCP 인증서 (PDF) 다운로드</span>
                        </a>
                        <Link href="/shop" className={styles.secondaryBtn}>
                            <span>대한김치 제품 라인업 보기</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Sticky Navigation Tabs */}
            <nav className={styles.stickyTabNav}>
                <div className={styles.tabList}>
                    <a href="#ceo" className={styles.tabLink}>대표 인사말</a>
                    <a href="#brand" className={styles.tabLink}>브랜드 핵심가치</a>
                    <a href="#haccp" className={styles.tabLink}>HACCP 위생 인증</a>
                    <a href="#company" className={styles.tabLink}>기업 정보 개요</a>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className={styles.contentWrapper}>

                {/* 1. CEO Message Section */}
                <section id="ceo" className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>CEO MESSAGE</span>
                        <h2 className={styles.sectionTitle}>대표이사 인사말</h2>
                    </div>

                    <div className={styles.ceoLayout}>
                        <div className={styles.ceoProfileCard}>
                            <div className={styles.ceoAvatarCircle}>
                                <HeartHandshake size={48} />
                            </div>
                            <h3 className={styles.ceoName}>김용진</h3>
                            <p className={styles.ceoTitleText}>인피니스㈜ 대한김치 대표이사</p>
                            <span className={styles.ceoBadgeTag}>K-FOOD GLOBAL LEADER</span>
                        </div>

                        <div className={styles.ceoMessageBody}>
                            <p>
                                <strong>인피니스㈜ 대한김치는 베트남 하노이 동안에 위치하고 2023년에 설립되었습니다.</strong>
                            </p>
                            <p>
                                김치는 우리의 식탁에 빠질 수 없는 음식이자 대한민국을 대표하는 식품으로서, 독특한 맛과 풍미는 물론 원재료에 없던 새로운 영양물질과 살아있는 많은 유산균을 섭취할 수 있는 대표 건강식품입니다. 또한 수천 년의 역사를 이어온 김치는 이제 국내를 넘어 세계인들에게 맛있고 건강한 식품으로 인식되면서 한국문화 확산과 K-FOOD 대표주자로 자리매김했습니다.
                            </p>
                            <p>
                                대한김치는 ‘식품’을 넘어 ‘문화의 아이콘’이 된 김치의 변하지 않는 가치를 소중히 지켜나가기 위해, 김치산업에서 발효과학의 초격차 기술 확보를 통해 영세한 김치산업체의 기초체력을 강화하고, 김치의 미래가치를 창출하기 위한 노력을 지속하고 있습니다.
                            </p>
                            <p>
                                특히, 정부 부처를 비롯해 식품 관계기관, 김치산업체 등과의 다양한 협력을 통한 핵심기술 개발과 현장 보급으로 김치산업 성장을 견인하고, 김치의 글로벌화를 선도하여 베트남 거점기관으로 거듭나고자 합니다.
                            </p>
                            <p>
                                대한김치의 모든 직원은 대한민국의 중요한 국가 자산인 ‘김치’의 모든 것을 연구한다는 사명감과 자긍심으로 연구 및 생산에 매진하고 있습니다. 앞으로 김치 발효과학과 산업진흥을 총괄하는 ‘김치 세계화’를 목표로 최선의 노력을 다하겠습니다.
                            </p>
                            <p>
                                고객 여러분께서도 김치 종주국의 국민으로서 스스로 전승 주체가 되어 소중한 국가 자산인 김치를 지킬 수 있도록 많은 관심과 성원을 보내주시길 바랍니다. 감사합니다.
                            </p>

                            <div className={styles.ceoSignatureBox}>
                                <span className={styles.signatureTitle}>인피니스 주식회사 대표이사</span>
                                <span className={styles.signatureName}>김 용 진</span>
                            </div>
                        </div>
                    </div>
                </section>


                {/* 2. Brand Core Values & Philosophy */}
                <section id="brand" className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>BRAND PHILOSOPHY</span>
                        <h2 className={styles.sectionTitle}>대한김치의 5대 원칙과 약속</h2>
                    </div>

                    <div className={styles.brandGrid}>
                        <div className={styles.brandCard}>
                            <span className={styles.brandNum}>01</span>
                            <div className={styles.brandIcon}>🌾</div>
                            <h4>신선하고 안전한 농산물 원료</h4>
                            <p>엄격한 품질 검증을 거쳐 선별된 최상급 야채와 식재료만을 사용하여 깊고 순수한 자연의 맛을 선사합니다.</p>
                        </div>

                        <div className={styles.brandCard}>
                            <span className={styles.brandNum}>02</span>
                            <div className={styles.brandIcon}>✨</div>
                            <h4>풍부한 조화로움</h4>
                            <p>색감이 풍부하고 자극적이지 않아 한식은 물론 동서양 다양한 미식 요리와도 감칠맛 있게 완벽히 어울립니다.</p>
                        </div>

                        <div className={styles.brandCard}>
                            <span className={styles.brandNum}>03</span>
                            <div className={styles.brandIcon}>🛡️</div>
                            <h4>HACCP 국제 인증 위생 관리</h4>
                            <p>위해요소분석(Hazard Analysis)과 중요관리점 국제 규격인 "HACCP CODEX 2020"을 획득하여 안심하고 드실 수 있습니다.</p>
                        </div>

                        <div className={styles.brandCard}>
                            <span className={styles.brandNum}>04</span>
                            <div className={styles.brandIcon}>🧬</div>
                            <h4>영양과 맛을 고려한 건강 발효</h4>
                            <p>살아있는 유산균과 식이섬유를 풍부히 유지하는 정밀 온도 발효 과학 기법으로 맛과 영양을 모두 잡았습니다.</p>
                        </div>

                        <div className={styles.brandCard}>
                            <span className={styles.brandNum}>05</span>
                            <div className={styles.brandIcon}>🥬</div>
                            <h4>13종+ 다양한 전문 라인업</h4>
                            <p>포기김치, 맛김치, 깍두기, 총각김치, 열무김치, 갓김치, 파김치 등 식탁의 모든 취향을 충족하는 풍성한 메뉴를 자랑합니다.</p>
                        </div>
                    </div>
                </section>


                {/* 3. HACCP Certification Section */}
                <section id="haccp" className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>QUALITY & SAFETY CERTIFICATE</span>
                        <h2 className={styles.sectionTitle}>HACCP CODEX 2020 국제 인증</h2>
                    </div>

                    <div className={styles.haccpBanner}>
                        <div className={styles.haccpContent}>
                            <h3>안전하고 철저한 위생 관리 검증</h3>
                            <p style={{ color: '#d0dbe5', fontSize: '0.98rem', lineHeight: '1.7' }}>
                                대한김치는 원료 입고부터 세척, 버무림, 숙성, 포가 및 출하까지 전 과정에 엄격한 위생 검사를 실시하며, 국제 규격 품질 인증인 HACCP CODEX 2020을 획득하였습니다.
                            </p>

                            <div className={styles.haccpBadgeList}>
                                <span className={styles.haccpBadgeItem}>✓ HACCP CODEX 2020 인증</span>
                                <span className={styles.haccpBadgeItem}>✓ 100% 무균 세척 공정</span>
                                <span className={styles.haccpBadgeItem}>✓ 정밀 콜드체인 유통</span>
                            </div>

                            <div className={styles.haccpMetaGrid}>
                                <div className={styles.haccpMetaItem}>
                                    <label>인증 번호 (Certification No.)</label>
                                    <span>GOODVN2824.HACCP</span>
                                </div>
                                <div className={styles.haccpMetaItem}>
                                    <label>유효 기간 (Expiration Date)</label>
                                    <span>2024.04.08 ~ 2027.04.08</span>
                                </div>
                                <div className={styles.haccpMetaItem}>
                                    <label>인증 범위 (Certification Scope)</label>
                                    <span style={{ color: '#fff' }}>Sản xuất và kinh doanh Kim chi (Kimchi Production & Sales)</span>
                                </div>
                                <div className={styles.haccpMetaItem}>
                                    <label>발행 기관 (Issuing Authority)</label>
                                    <span style={{ color: '#fff' }}>GOOD VIETNAM CERTIFICATION INC.</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.haccpViewerCard}>
                            <div style={{ padding: '16px', background: '#f5f7fa', borderRadius: '8px', marginBottom: '16px' }}>
                                <ShieldCheck size={48} color="#007aff" style={{ margin: '0 auto 8px' }} />
                                <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700 }}>HACCP 획득 확인서</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>CÔNG TY CỔ PHẦN INFINIS (INFINIS JOINT STOCK COMPANY)</p>
                            </div>

                            <a 
                                href="/docu/HACCP_Certificate.pdf" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.pdfBtn}
                            >
                                <FileText size={18} />
                                <span>인증서 전문 (PDF) 원본 보기</span>
                            </a>
                        </div>
                    </div>
                </section>


                {/* 4. Company Profile Overview Table */}
                <section id="company" className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>CORPORATE INFORMATION</span>
                        <h2 className={styles.sectionTitle}>회사 개요 (Company Profile)</h2>
                    </div>

                    <div className={styles.overviewTableWrapper}>
                        <table className={styles.overviewTable}>
                            <tbody>
                                <tr>
                                    <th>법인명</th>
                                    <td>인피니스 주식회사 / CÔNG TY CỔ PHẦN INFINIS (INFINIS JOINT STOCK COMPANY)</td>
                                </tr>
                                <tr>
                                    <th>브랜드명</th>
                                    <td><strong>대한김치 (DAEHAN KIMCHI)</strong></td>
                                </tr>
                                <tr>
                                    <th>대표이사</th>
                                    <td>김용진 (Kim Yong Jin)</td>
                                </tr>
                                <tr>
                                    <th>설립일자</th>
                                    <td>2023년 설립</td>
                                </tr>
                                <tr>
                                    <th>본사 주소</th>
                                    <td>Số 26 Phố Dương Đình Nghệ, Phường Yên Hoà, Quận Cầu Giấy, Thành phố Hà Nội, Việt Nam</td>
                                </tr>
                                <tr>
                                    <th>생산 공장 주소</th>
                                    <td>Số 3 Thôn Ngọc Giang, Xã Vĩnh Ngọc, Huyện Đông Anh, Thành phố Hà Nội, Việt Nam</td>
                                </tr>
                                <tr>
                                    <th>주요 사업</th>
                                    <td>한국 정통 김치 및 식자재 전문 제조, 베트남 현지 유통 및 K-Food FNB 서비스</td>
                                </tr>
                                <tr>
                                    <th>품질 인증</th>
                                    <td>HACCP CODEX 2020 (Giấy chứng nhận số: GOODVN2824.HACCP)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>
        </div>
    );
}
