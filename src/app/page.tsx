import styles from "./page.module.css";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake, ThermometerSnowflake } from "lucide-react";
import { products } from "@/data/products";

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className="badge" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#e50914" /> 하노이 프리미엄 스마트 발효과학
          </span>
          <h1 className={`${styles.title} ${styles.fadeInUp} ${styles.delay1}`}>
            <span className="text-gradient">The Essence of Fermentation</span>
            <br />대한김치 (DAEHAN KIMCHI)
          </h1>
          <p className={`${styles.subtitle} ${styles.fadeInUp} ${styles.delay2}`}>
            30년 전통의 비법과 현대적인 스마트 발효과학이 융합된 대한김치 프리미엄 미식 라이프스타일.<br />
            당신만의 8각 김치 미각 DNA를 측정하고 최적의 숙성 김치를 경험해보세요.
          </p>
          <div className={`${styles.ctaGroup} ${styles.fadeInUp} ${styles.delay3}`}>
            <Link href="/dna-test">
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                나의 김치 DNA 찾기 <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/shop">
              <button className={styles.btnSecondary}>김치 쇼핑몰 둘러보기</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className={`${styles.section} container`}>
        <div className={styles.sectionHeader}>
          <span className="badge">OFFICIAL PRODUCTS</span>
          <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginTop: '8px' }}>대한김치 대표 시그니처</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            하노이 현지 위생 클린룸 시설에서 당일 생산되어 콜드체인으로 신선하게 배송됩니다.
          </p>
        </div>

        <div className={styles.productGrid}>
          {featuredProducts.map((product) => (
            <Link href={`/shop/${product.id}`} key={product.id} className={styles.productCard}>
              <div className={styles.cardImgWrap}>
                <img src={product.image} alt={product.name} className={styles.productImg} />
                <span className={styles.productBadge}>{product.badge}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.productName}>{product.koreanName}</h3>
                <p className={styles.productDesc}>{product.desc}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.productPrice}>{product.priceFormatted}</span>
                  <span className={styles.viewDetail}>상세보기 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/shop">
            <button className="btn-primary" style={{ padding: '12px 32px' }}>전체 상품 보러가기</button>
          </Link>
        </div>
      </section>

      {/* 8-Axis DNA Feature Highlight */}
      <section className={styles.dnaHighlightSection}>
        <div className="container">
          <div className={styles.dnaSplit}>
            <div className={styles.dnaText}>
              <span className="badge">AI & BIO FERMENTATION</span>
              <h2 className="text-gradient" style={{ fontSize: '2.2rem', margin: '16px 0' }}>
                당신의 미각 좌표는 어디인가요?<br />8각 김치 맛 DNA 분석
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
                매운맛 강도, 숙성 산미, 젓갈 감칠맛, 씹는 아삭함, 탄산 청량감 등 8가지 미각 축을 통해 
                나에게 가장 이상적인 숙성일수와 최적의 발효 김치를 추천해 드립니다.
              </p>
              <div className={styles.badgeList}>
                <span className={styles.techBadge}>🧬 8-Axis Radar Chart</span>
                <span className={styles.techBadge}>🌡️ 1.8°C 스마트 숙성 모니터링</span>
                <span className={styles.techBadge}>📊 15억 CFU 유산균 보증</span>
              </div>
              <div style={{ marginTop: '30px' }}>
                <Link href="/service">
                  <button className="btn-primary" style={{ marginRight: '12px' }}>발효과학 웹진 & 스튜디오</button>
                </Link>
                <Link href="/dna-test">
                  <button className={styles.btnSecondary}>DNA 즉시 측정</button>
                </Link>
              </div>
            </div>
            <div className={styles.dnaPreviewCard}>
              <div className={styles.innerCard}>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
                  🎯 미각 알고리즘 실시간 분석
                </div>
                <div className={styles.metricRow}>
                  <span>발효 유산균 생존율</span>
                  <span style={{ color: '#00E676', fontWeight: 700 }}>99.4% (최상급)</span>
                </div>
                <div className={styles.metricRow}>
                  <span>최적 산도(pH) 지표</span>
                  <span style={{ color: '#2979FF', fontWeight: 700 }}>pH 4.2 (황금비율)</span>
                </div>
                <div className={styles.metricRow}>
                  <span>저온 숙성 온도</span>
                  <span style={{ color: '#FF9100', fontWeight: 700 }}>1.8°C 항온 제어</span>
                </div>
                <div className={styles.metricRow}>
                  <span>하노이 무료배송 기준</span>
                  <span style={{ color: '#e50914', fontWeight: 700 }}>10kg 이상 즉시 적용</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shorts Highlight Section */}
      <section className={styles.shortsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge">DAEHAN SHORTS</span>
            <h2 className="text-gradient" style={{ fontSize: '2.2rem', margin: '16px 0' }}>
              대한김치 숏폼 하이라이트
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              생생한 대한김치의 제조 과정과 미식 경험을 영상으로 만나보세요.
            </p>
          </div>
          
          <div className={styles.shortsGrid}>
            {[
              "F84Z-uNdCtA",
              "PJyaRAnAjbM",
              "s-tMdKDLAns",
              "egYFkiS4xhM",
              "Zx4QGyOciZM"
            ].map(videoId => (
              <div className={styles.shortVideoCard} key={videoId}>
                <iframe
                  className={styles.shortVideoIframe}
                  src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & HACCP Banner */}
      <section className={`${styles.section} container`}>
        <div className={styles.trustGrid}>
          <div className={styles.trustItem}>
            <ShieldCheck size={36} color="#e50914" />
            <h4>HACCP 무균 위생 공정</h4>
            <p>100% 자동화 에어샤워 및 정밀 세척 시스템</p>
          </div>
          <div className={styles.trustItem}>
            <Award size={36} color="#e50914" />
            <h4>30년 전통 장인의 레시피</h4>
            <p>엄선된 젓갈과 고춧가루의 깊은 감칠맛</p>
          </div>
          <div className={styles.trustItem}>
            <ThermometerSnowflake size={36} color="#e50914" />
            <h4>콜드체인 안심 직배송</h4>
            <p>하노이 전 지역 신선 온도 유지 배송</p>
          </div>
          <div className={styles.trustItem}>
            <HeartHandshake size={36} color="#e50914" />
            <h4>대한포인트 혜택</h4>
            <p>구매 및 후기 작성 시 즉시 적립 (DP 마일리지)</p>
          </div>
        </div>
      </section>
    </main>
  );
}
