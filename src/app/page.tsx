"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake, ThermometerSnowflake } from "lucide-react";
import { products } from "@/data/products";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { lang, t } = useLanguage();
  const featuredProducts = products.slice(0, 4);

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <span className="badge" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#e50914" /> {t("hero.badge", "하노이 직배송 • 100% 한국 정통 발효 비법")}
          </span>
          <h1 className={`${styles.title} ${styles.fadeInUp} ${styles.delay1}`}>
            <span className="text-gradient">The Essence of Fermentation</span>
            <br />{t("hero.title2", "대한김치 (DAEHAN KIMCHI)")}
          </h1>
          <p className={`${styles.subtitle} ${styles.fadeInUp} ${styles.delay2}`}>
            {t("hero.sub", "엄선된 고랭지 배추와 100% 천연 재료, HACCP 위생 인증 시설에서 정성껏 담근 한국 정통 김치.")}
          </p>
          <div className={`${styles.ctaGroup} ${styles.fadeInUp} ${styles.delay3}`}>
            <Link href="/dna-test">
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {t("dna.bannerBtn", "나의 김치 DNA 찾기")} <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/shop">
              <button className={styles.btnSecondary}>{t("hero.btnShop", "신선 김치 주문하기")}</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className={`${styles.section} container`}>
        <div className={styles.sectionHeader}>
          <span className="badge">OFFICIAL PRODUCTS</span>
          <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginTop: '8px' }}>
            {t("best.title", "대한김치 대표 시그니처")}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            {t("best.sub", "하노이 현지 위생 클린룸 시설에서 당일 생산되어 콜드체인으로 신선하게 배송됩니다.")}
          </p>
        </div>

        <div className={styles.productGrid}>
          {featuredProducts.map((product) => {
            const displayName = lang === "vi" ? (product.vietnameseName || product.koreanName) : product.koreanName;
            const displayDesc = lang === "vi" ? (product.vietnameseDesc || product.desc) : product.desc;

            return (
              <Link href={`/shop/${product.id}`} key={product.id} className={styles.productCard}>
                <div className={styles.cardImgWrap}>
                  <img src={product.image} alt={displayName} className={styles.productImg} />
                  <span className={styles.productBadge}>{product.badge}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.productName}>{displayName}</h3>
                  <p className={styles.productDesc}>{displayDesc}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.productPrice}>{product.priceFormatted}</span>
                    <span className={styles.viewDetail}>{t("best.details", "상세보기")} →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/shop">
            <button className="btn-primary" style={{ padding: '12px 32px' }}>
              {t("best.viewAll", "전체 상품 보러가기 →")}
            </button>
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
                {t("dna.bannerTitle", "🔬 AI DNA 맞춤 김치 추천")}
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
                {t("dna.bannerSub", "나만의 식습관과 유전자 유형에 딱 맞는 김치를 추천받아 보세요!")}
              </p>
              <div className={styles.badgeList}>
                <span className={styles.techBadge}>🧬 8-Axis Radar Chart</span>
                <span className={styles.techBadge}>🌡️ 1.8°C {lang === "vi" ? "Kiểm soát nhiệt độ chuẩn" : "스마트 숙성 모니터링"}</span>
                <span className={styles.techBadge}>📊 1.5 Tỷ CFU {lang === "vi" ? "Lợi khuẩn men" : "유산균 보증"}</span>
              </div>
              <div style={{ marginTop: '30px' }}>
                <Link href="/service">
                  <button className="btn-primary" style={{ marginRight: '12px' }}>
                    {t("nav.service", "발효과학 웹진 & 스튜디오")}
                  </button>
                </Link>
                <Link href="/dna-test">
                  <button className={styles.btnSecondary}>
                    {t("dna.bannerBtn", "DNA 즉시 측정")}
                  </button>
                </Link>
              </div>
            </div>
            <div className={styles.dnaPreviewCard}>
              <div className={styles.innerCard}>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
                  🎯 {lang === "vi" ? "Phân tích vị giác AI thời gian thực" : "미각 알고리즘 실시간 분석"}
                </div>
                <div className={styles.metricRow}>
                  <span>{lang === "vi" ? "Tỷ lệ lợi khuẩn sinh sống" : "발효 유산균 생존율"}</span>
                  <span style={{ color: '#00E676', fontWeight: 700 }}>99.4% ({lang === "vi" ? "Cao nhất" : "최상급"})</span>
                </div>
                <div className={styles.metricRow}>
                  <span>{lang === "vi" ? "Độ pH chuẩn lên men" : "최적 산도(pH) 지표"}</span>
                  <span style={{ color: '#2979FF', fontWeight: 700 }}>pH 4.2 ({lang === "vi" ? "Tỷ lệ vàng" : "황금비율"})</span>
                </div>
                <div className={styles.metricRow}>
                  <span>{lang === "vi" ? "Nhiệt độ ủ lên men" : "저온 숙성 온도"}</span>
                  <span style={{ color: '#FF9100', fontWeight: 700 }}>1.8°C</span>
                </div>
                <div className={styles.metricRow}>
                  <span>{lang === "vi" ? "Miễn phí giao hàng Hà Nội" : "하노이 무료배송 기준"}</span>
                  <span style={{ color: '#e50914', fontWeight: 700 }}>{lang === "vi" ? "Từ 10kg trở lên" : "10kg 이상 즉시 적용"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16:9 Wide Video Showcase Section */}
      <section className={styles.videoSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge">DAEHAN CINEMATIC & BRAND FILM</span>
            <h2 className="text-gradient" style={{ fontSize: '2.2rem', margin: '16px 0' }}>
              {lang === "vi" ? "Video thương hiệu DAEHAN KIMCHI 16:9" : "대한김치 16:9 시네마틱 브랜드 영상"}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              {lang === "vi" 
                ? "Thưởng thức câu chuyện khoa học lên men và ẩm thực Hàn Quốc tươi ngon ngay tại Hà Nội." 
                : "하노이 중심에서 전하는 완벽한 발효과학과 신선한 미식 스토리를 16:9 고화질 영상으로 감상해 보세요."}
            </p>
          </div>

          <div className={styles.wideVideoGrid}>
            <div className={styles.wideVideoCard}>
              <div className={styles.aspect16x9}>
                <iframe
                  src="https://www.youtube.com/embed/B3dXKWDrSJo?rel=0&modestbranding=1"
                  title="대한김치 시네마틱 브랜드 필름 1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className={styles.wideVideoCard}>
              <div className={styles.aspect16x9}>
                <iframe
                  src="https://www.youtube.com/embed/FTmFWkHBG2M?rel=0&modestbranding=1"
                  title="대한김치 시네마틱 브랜드 필름 2"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
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
              {lang === "vi" ? "Video ngắn nổi bật Daehan Shorts" : "대한김치 숏폼 하이라이트"}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              {lang === "vi" 
                ? "Khám phá quy trình sản xuất và trải nghiệm ẩm thực Kimchi qua các video ngắn." 
                : "생생한 대한김치의 제조 과정과 미식 경험을 영상으로 만나보세요."}
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
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&controls=0&modestbranding=1&showinfo=0`}
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
            <h4>{t("feat.haccp.title", "HACCP 무균 위생 공정")}</h4>
            <p>{t("feat.haccp.desc", "100% 자동화 에어샤워 및 정밀 세척 시스템")}</p>
          </div>
          <div className={styles.trustItem}>
            <Award size={36} color="#e50914" />
            <h4>{t("feat.secret.title", "정성 어린 비법 레시피")}</h4>
            <p>{t("feat.secret.desc", "엄선된 젓갈과 고춧가루의 깊은 감칠맛")}</p>
          </div>
          <div className={styles.trustItem}>
            <ThermometerSnowflake size={36} color="#e50914" />
            <h4>{t("feat.fresh.title", "콜드체인 안심 직배송")}</h4>
            <p>{t("feat.fresh.desc", "하노이 전 지역 신선 온도 유지 배송")}</p>
          </div>
          <div className={styles.trustItem}>
            <HeartHandshake size={36} color="#e50914" />
            <h4>{lang === "vi" ? "Ưu đãi điểm thưởng DP" : "대한포인트 혜택"}</h4>
            <p>{lang === "vi" ? "Tích lũy 10% điểm DP khi mua hàng và đánh giá" : "구매 시 10% DP 즉시 적립 및 후기 작성 혜택"}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
