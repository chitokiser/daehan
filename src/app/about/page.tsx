import styles from './page.module.css';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <section className={styles.heroSection}>
                <div className="container">
                    <span className="badge">BRAND STORY & HYGIENE</span>
                    <h1 className={`${styles.title} text-gradient`}>
                        전통 발효의 장인정신과<br />현대 바이오 과학의 융합
                    </h1>
                    <p className={styles.subtitle}>
                        대한김치는 30년 전통의 비법 양념과 스마트 발효과학 연구진의 철저한 위생 관리 기술이 만나 탄생한 대한민국 대표 프리미엄 김치 브랜드입니다.
                    </p>
                </div>
            </section>

            <section className={`${styles.featuresSection} container`}>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.iconWrapper}>🔬</div>
                        <h3>1.8°C 스마트 저온 발효</h3>
                        <p>동남아 아열대 기후에서도 갓 담근 김치의 아삭함과 유산균 생존력을 최상으로 유지하는 항온 숙성 시스템을 적용합니다.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.iconWrapper}>🛡️</div>
                        <h3>HACCP 기준 위생 관리</h3>
                        <p>전 공정 100% 무균 자동화 세척 및 잔류 농약 정밀 검사, 엄격한 공기 정화 클린룸에서 안전하게 생산됩니다.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.iconWrapper}>🧬</div>
                        <h3>8각 미각 DNA 맞춤 큐레이션</h3>
                        <p>매운맛, 산미, 감칠맛, 염도 등 8가지 지표를 과학적으로 측정하여 한·베 고객 모두의 취향에 완벽히 부합하는 김치를 제공합니다.</p>
                    </div>
                </div>
            </section>

            <section className={styles.facilitySection}>
                <div className="container">
                    <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>
                        하노이 현지 생산 & 당일 직배송 시스템
                    </h2>
                    <div className={styles.statsRow}>
                        <div className={styles.statBox}>
                            <span className={styles.statNum}>100%</span>
                            <span className={styles.statLabel}>한국산 엄선 고춧가루 & 젓갈</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statNum}>15억 CFU</span>
                            <span className={styles.statLabel}>그램당 프리미엄 생유산균</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statNum}>당일 출고</span>
                            <span className={styles.statLabel}>하노이 시내 콜드체인 안심배송</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <Link href="/shop">
                            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1.1rem' }}>
                                대한김치 상품 둘러보기
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
