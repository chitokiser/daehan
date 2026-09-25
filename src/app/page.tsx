"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake, ThermometerSnowflake, Trophy, Medal, Crown, Flame, Star, User, ChevronLeft, ChevronRight, ExternalLink, Video, Play, X } from "lucide-react";
import { products } from "@/data/products";
import { useLanguage } from "@/context/LanguageContext";

const HERO_IMAGES = [
  "/images/hero/1.png",
  "/images/hero/2.png",
  "/images/hero/3.png",
  "/images/hero/4.png",
  "/images/hero/5.png",
  "/images/hero/6.png",
];

const FACEBOOK_VIDEOS = [
  { id: 1, url: "https://www.facebook.com/share/r/1DboTgR89p/", title: "하노이 수제 대한김치 생생 릴스 #1", type: "reel", thumbnail: "/images/hero/1.png", videoUrl: "/images/factory/VIDEO_DOWNLOAD_1712385912839_1712386243008.mp4" },
  { id: 2, url: "https://www.facebook.com/share/v/1Eb2SW4FE5/", title: "100% 한국 정통 발효 비법 브랜드 영상", type: "video", thumbnail: "/images/hero/2.png", videoUrl: "https://www.youtube.com/embed/B3dXKWDrSJo?autoplay=1" },
  { id: 3, url: "https://www.facebook.com/share/r/19jWnXREqX/", title: "갓 담근 신선 배추김치 현장 릴스 #2", type: "reel", thumbnail: "/images/hero/3.png", videoUrl: "https://www.youtube.com/embed/F84Z-uNdCtA?autoplay=1" },
  { id: 4, url: "https://www.facebook.com/share/v/1VCJWCnQVb/", title: "HACCP 위생 인증 시설 제조 공정 영상", type: "video", thumbnail: "/images/factory/1788249934313_910087481450589245_g8397836875365957143_dfd4c34e7fa1b44a31af91205c2fcd77.jpg", videoUrl: "https://www.youtube.com/embed/FTmFWkHBG2M?autoplay=1" },
  { id: 5, url: "https://www.facebook.com/share/v/1C2tFzL9Dc/", title: "고랭지 배추와 천연 재료의 완벽 발효", type: "video", thumbnail: "/images/hero/4.png", videoUrl: "https://www.youtube.com/embed/PJyaRAnAjbM?autoplay=1" },
  { id: 6, url: "https://www.facebook.com/share/v/18DovEywNb/", title: "하노이 전지역 오토바이 직배송 현장", type: "video", thumbnail: "/images/hero/5.png", videoUrl: "https://www.youtube.com/embed/s-tMdKDLAns?autoplay=1" },
  { id: 7, url: "https://www.facebook.com/share/r/1CGhF4CvEA/", title: "대한김치 맛있게 즐기는 레시피 릴스 #3", type: "reel", thumbnail: "/images/hero/6.png", videoUrl: "https://www.youtube.com/embed/egYFkiS4xhM?autoplay=1" },
  { id: 8, url: "https://www.facebook.com/share/r/1DX3EXq8YV/", title: "하노이 교민 강력 추천 정통 김치 릴스 #4", type: "reel", thumbnail: "/images/products/pogi.jpg", videoUrl: "https://www.youtube.com/embed/Zx4QGyOciZM?autoplay=1" },
  { id: 9, url: "https://www.facebook.com/share/v/1HwibT7tA6/", title: "숙성 단계별 최상의 감칠맛 안내 영상", type: "video", thumbnail: "/images/products/chonggak.jpg", videoUrl: "/images/factory/VIDEO_DOWNLOAD_1712385912839_1712386243008.mp4" },
  { id: 10, url: "https://www.facebook.com/share/v/1CDGvgNsk4/", title: "정기구독 혜택 & 10% DP 적립 안내", type: "video", thumbnail: "/images/products/kkakdugi.jpg", videoUrl: "https://www.youtube.com/embed/B3dXKWDrSJo?autoplay=1" },
  { id: 11, url: "https://www.facebook.com/share/v/1cbRAcwtpo/", title: "대한김치 고객 생생 미식 후기 영상", type: "video", thumbnail: "/images/factory/1788250057286_910087481450589245_g8397836875365957143_a1f83771478661ade08188ee88eaeea2.jpg", videoUrl: "/images/factory/VIDEO_DOWNLOAD_1712385912839_1712386243008.mp4" },
];

interface DpRankItem {
  rank: number;
  displayName: string;
  maskedEmail: string;
  level: number;
  dpPoints: number;
  avatar?: string;
  badgeTitle?: string;
}

interface ReferralRankItem {
  rank: number;
  displayName: string;
  maskedEmail: string;
  level: number;
  menteeCount: number;
  avatar?: string;
  badgeTitle?: string;
}

const DEFAULT_DP_RANKINGS: DpRankItem[] = [
  { rank: 1, displayName: "최*민", maskedEmail: "dag***@gmail.com", level: 9, dpPoints: 158400, avatar: "https://ui-avatars.com/api/?name=Choi&background=C8392B&color=fff&bold=true", badgeTitle: "👑 전설의 마스터" },
  { rank: 2, displayName: "응우옌티*", maskedEmail: "ngu***@gmail.com", level: 8, dpPoints: 124500, avatar: "https://ui-avatars.com/api/?name=Nguyen&background=D4870A&color=fff&bold=true", badgeTitle: "🔥 발효 장인" },
  { rank: 3, displayName: "김*석", maskedEmail: "kim***@naver.com", level: 7, dpPoints: 98200, avatar: "https://ui-avatars.com/api/?name=Kim&background=16a34a&color=fff&bold=true", badgeTitle: "⭐ VIP 가디언" },
  { rank: 4, displayName: "박*훈", maskedEmail: "park***@gmail.com", level: 6, dpPoints: 76000, avatar: "https://ui-avatars.com/api/?name=Park&background=2563eb&color=fff&bold=true", badgeTitle: "🎖️ 미식 탐험가" },
  { rank: 5, displayName: "이*영", maskedEmail: "lee***@hanmail.net", level: 5, dpPoints: 64500, avatar: "https://ui-avatars.com/api/?name=Lee&background=9333ea&color=fff&bold=true", badgeTitle: "🎖️ 골드 서포터" },
  { rank: 6, displayName: "쩐반*", maskedEmail: "tran***@gmail.com", level: 5, dpPoints: 52000, avatar: "https://ui-avatars.com/api/?name=Tran&background=0891b2&color=fff&bold=true", badgeTitle: "✨ 김치 러버" },
  { rank: 7, displayName: "정*우", maskedEmail: "jung***@kakao.com", level: 4, dpPoints: 41800, avatar: "https://ui-avatars.com/api/?name=Jung&background=ca8a04&color=fff&bold=true", badgeTitle: "✨ 김치 러버" },
  { rank: 8, displayName: "한*희", maskedEmail: "han***@gmail.com", level: 4, dpPoints: 37500, avatar: "https://ui-avatars.com/api/?name=Han&background=db2777&color=fff&bold=true", badgeTitle: "🌱 로열 후원자" },
  { rank: 9, displayName: "팜티*", maskedEmail: "pham***@gmail.com", level: 3, dpPoints: 29000, avatar: "https://ui-avatars.com/api/?name=Pham&background=4b5563&color=fff&bold=true", badgeTitle: "🌱 로열 후원자" },
  { rank: 10, displayName: "송*호", maskedEmail: "song***@naver.com", level: 3, dpPoints: 24200, avatar: "https://ui-avatars.com/api/?name=Song&background=65a30d&color=fff&bold=true", badgeTitle: "🌱 로열 후원자" }
];

const DEFAULT_REFERRAL_RANKINGS: ReferralRankItem[] = [
  { rank: 1, displayName: "최*민", maskedEmail: "dag***@gmail.com", level: 9, menteeCount: 48, avatar: "https://ui-avatars.com/api/?name=Choi&background=C8392B&color=fff&bold=true", badgeTitle: "👑 최상위 멘토 마스터" },
  { rank: 2, displayName: "응우옌티*", maskedEmail: "ngu***@gmail.com", level: 8, menteeCount: 35, avatar: "https://ui-avatars.com/api/?name=Nguyen&background=D4870A&color=fff&bold=true", badgeTitle: "🔥 다이아몬드 멘토" },
  { rank: 3, displayName: "김*석", maskedEmail: "kim***@naver.com", level: 7, menteeCount: 29, avatar: "https://ui-avatars.com/api/?name=Kim&background=16a34a&color=fff&bold=true", badgeTitle: "⭐ 골드 멘토" },
  { rank: 4, displayName: "박*훈", maskedEmail: "park***@gmail.com", level: 6, menteeCount: 22, avatar: "https://ui-avatars.com/api/?name=Park&background=2563eb&color=fff&bold=true", badgeTitle: "🎖️ 실버 멘토" },
  { rank: 5, displayName: "이*영", maskedEmail: "lee***@hanmail.net", level: 5, menteeCount: 18, avatar: "https://ui-avatars.com/api/?name=Lee&background=9333ea&color=fff&bold=true", badgeTitle: "🎖️ 실버 멘토" },
  { rank: 6, displayName: "쩐반*", maskedEmail: "tran***@gmail.com", level: 5, menteeCount: 14, avatar: "https://ui-avatars.com/api/?name=Tran&background=0891b2&color=fff&bold=true", badgeTitle: "✨ 우수 앰버서더" },
  { rank: 7, displayName: "정*우", maskedEmail: "jung***@kakao.com", level: 4, menteeCount: 11, avatar: "https://ui-avatars.com/api/?name=Jung&background=ca8a04&color=fff&bold=true", badgeTitle: "✨ 우수 앰버서더" },
  { rank: 8, displayName: "한*희", maskedEmail: "han***@gmail.com", level: 4, menteeCount: 9, avatar: "https://ui-avatars.com/api/?name=Han&background=db2777&color=fff&bold=true", badgeTitle: "🌱 열정 리더" },
  { rank: 9, displayName: "팜티*", maskedEmail: "pham***@gmail.com", level: 3, menteeCount: 7, avatar: "https://ui-avatars.com/api/?name=Pham&background=4b5563&color=fff&bold=true", badgeTitle: "🌱 열정 리더" },
  { rank: 10, displayName: "송*호", maskedEmail: "song***@naver.com", level: 3, menteeCount: 5, avatar: "https://ui-avatars.com/api/?name=Song&background=65a30d&color=fff&bold=true", badgeTitle: "🌱 열정 리더" }
];

export default function Home() {
  const { lang, t } = useLanguage();
  const featuredProducts = products.slice(0, 4);
  const [rankingTab, setRankingTab] = useState<"referral" | "dp">("referral");
  const [dpRankings, setDpRankings] = useState<DpRankItem[]>(DEFAULT_DP_RANKINGS);
  const [referralRankings, setReferralRankings] = useState<ReferralRankItem[]>(DEFAULT_REFERRAL_RANKINGS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    videoUrl: string;
    fbUrl: string;
  } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  useEffect(() => {
    fetch("/api/v1/rankings/dp")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.rankings) && data.rankings.length > 0) {
          setDpRankings(data.rankings);
        }
      })
      .catch(() => {});

    fetch("/api/v1/rankings/referral")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.rankings) && data.rankings.length > 0) {
          setReferralRankings(data.rankings);
        }
      })
      .catch(() => {});
  }, []);

  const activeRankings = rankingTab === "referral" ? referralRankings : dpRankings;
  const top3 = activeRankings.slice(0, 3);
  const restRankings = activeRankings.slice(3, 10);

  return (
    <main className={styles.main}>
      {/* Hero Banner Section (Carousel) */}
      <section className={styles.heroBanner}>
        <div className={styles.sliderContainer}>
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={img}
              className={`${styles.slideItem} ${idx === currentSlide ? styles.slideActive : ""}`}
            >
              <img
                src={img}
                alt={`대한김치 히어로 ${idx + 1}`}
                className={styles.slideImage}
              />
            </div>
          ))}
        </div>
        <div className={styles.heroBannerOverlay}></div>

        {/* Slider Controls */}
        <button
          className={`${styles.sliderNavBtn} ${styles.sliderPrevBtn}`}
          onClick={prevSlide}
          aria-label="이전 이미지"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className={`${styles.sliderNavBtn} ${styles.sliderNextBtn}`}
          onClick={nextSlide}
          aria-label="다음 이미지"
        >
          <ChevronRight size={24} />
        </button>

        {/* Pagination Dots */}
        <div className={styles.sliderDots}>
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${idx === currentSlide ? styles.activeDot : ""}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`슬라이드 ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Hero Text Box Section (Below Hero Banner) */}
      <section className={styles.heroTextSection}>
        <div className={styles.heroContent}>
          <span className="badge" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#e50914" /> {t("hero.badge", "하노이 직배송 • 100% 한국 전통 발효 비법")}
          </span>
          <h1 className={`${styles.title} ${styles.fadeInUp} ${styles.delay1}`}>
            <span className="text-gradient">The Essence of Fermentation</span>
            <br />{t("hero.title2", "대한김치 (DAEHAN KIMCHI)")}
          </h1>
          <p className={`${styles.subtitle} ${styles.fadeInUp} ${styles.delay2}`}>
            {t("hero.sub", "엄선된 고랭지 배추와 100% 천연 재료, HACCP 위생 인증 시설에서 정성껏 담근 한국 정통 김치.")}
          </p>
          <div className={`${styles.ctaGroup} ${styles.fadeInUp} ${styles.delay3}`}>
            <Link href="/subscribe">
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                🥬 {lang === "vi" ? "Đăng ký Kimchi định kỳ" : "김치 정기배송 구독하기"} <ArrowRight size={18} />
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
          <h2 className={`text-gradient ${styles.sectionTitle}`}>
            {t("best.title", "대한김치 대표 시그니처")}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            {t("best.sub", "하노이 현지 위생 클린룸 시설에서 당일 생산되어 오토바이로 신선하게 배송됩니다.")}
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

      {/* Subscription Banner Section */}
      <section className="container">
        <div className={styles.subBanner}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <span className="badge" style={{ background: 'rgba(200,57,43,0.1)', color: 'var(--primary-color)' }}>
              🥬 {lang === "vi" ? "ĐĂNG KÝ KIMCHI ĐỊNH KỲ" : "김치 정기배송 서비스"}
            </span>
            <h2 className={styles.subBannerTitle}>
              {lang === "vi" ? "Giao Kimchi tươi tận nhà hàng tuần / hàng tháng" : "1주일에 1회, 매월 1일/15일 원하는 만큼 정기배송"}
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
              {lang === "vi" 
                ? "Tận hưởng ưu đãi giảm giá 5% + Miễn phí giao hàng lạnh + Tích 10% điểm DP với các gói Basic (2Kg), Family (5Kg), Restaurant (10~30Kg)." 
                : "Basic(2Kg), Family(5Kg), Restaurant(10~30Kg) 맞춤 플랜! 정기구독 신청 시 5% 할인 + 무료배송 + 10% DP 적립 혜택을 제공합니다."}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/subscribe">
              <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 800 }}>
                {lang === "vi" ? "Xem các gói đăng ký →" : "🥬 김치 정기구독 신청하기 →"}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Leaderboard TOP 10 Section (Referral Mentors & DP Rankings) */}
      <section className={styles.dpRankingSection}>
        <div className="container">
          <div className={styles.sectionHeader} style={{ marginBottom: '24px' }}>
            <span className="badge" style={{ background: 'rgba(212, 135, 10, 0.12)', color: '#D4870A' }}>
              🏆 HALL OF FAME
            </span>
            <h2 className={`text-gradient ${styles.sectionTitle}`}>
              {rankingTab === "referral"
                ? (lang === "vi" ? "🤝 Bảng Xếp Hạng Người Giới Thiệu (Mentor) TOP 10" : "🤝 멘토 추천 랭킹 TOP 10")
                : (lang === "vi" ? "🏆 Bảng Xếp Hạng Điểm DP Daehan TOP 10" : "🏆 대한포인트(DP) 명예의 전당 TOP 10")}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              {rankingTab === "referral"
                ? (lang === "vi"
                    ? "Danh sách TOP 10 Mentor có số lượng Mentee giới thiệu nhiều nhất. Nhận hoa hồng DP 2 cấp hấp dẫn!"
                    : "대한김치 생태계를 함께 키워나가는 명예로운 TOP 10 추천인(멘토) 목록입니다. 주문 발생 시 2단계 DP 보상 혜택!")
                : (lang === "vi"
                    ? "Bảng xếp hạng thành viên tích lũy điểm DP cao nhất. Nhận ưu đãi đổi Tiền nạp lên tới 100%!"
                    : "플랫폼 활동과 구매로 포인트를 모은 명예로운 TOP 10 회원 목록입니다. 레벨 상승 시 최대 100% 충전머니 전환!")}
            </p>

            {/* Ranking Tab Switcher */}
            <div className={styles.rankingTabContainer}>
              <button
                className={`${styles.rankingTabBtn} ${rankingTab === "referral" ? styles.rankingTabActive : ""}`}
                onClick={() => setRankingTab("referral")}
              >
                🤝 {lang === "vi" ? "TOP 10 Người Giới Thiệu" : "멘토 추천 랭킹 TOP 10"}
              </button>
              <button
                className={`${styles.rankingTabBtn} ${rankingTab === "dp" ? styles.rankingTabActive : ""}`}
                onClick={() => setRankingTab("dp")}
              >
                🏆 {lang === "vi" ? "TOP 10 Điểm DP" : "DP 명예의 전당 TOP 10"}
              </button>
            </div>
          </div>

          {/* TOP 3 Podium */}
          <div className={styles.rankTop3Grid}>
            {top3.map((item: any) => {
              const cardClass = item.rank === 1 ? styles.rankGold : (item.rank === 2 ? styles.rankSilver : styles.rankBronze);
              const medalEmoji = item.rank === 1 ? "🥇 1위" : (item.rank === 2 ? "🥈 2위" : "🥉 3위");
              const valueDisplay = rankingTab === "referral"
                ? `${item.menteeCount} ${lang === "vi" ? "Mentee" : "명 추천"}`
                : `${item.dpPoints?.toLocaleString()} DP`;

              return (
                <div key={item.rank} className={`${styles.rankTop3Card} ${cardClass}`}>
                  <div className={styles.topMedal}>{medalEmoji}</div>
                  <img src={item.avatar} alt={item.displayName} className={styles.rankAvatar} />
                  <div className={styles.rankUserName}>{item.displayName}</div>
                  <div className={styles.rankMaskedEmail}>{item.maskedEmail}</div>
                  <span className={styles.rankBadgeTitle}>{item.badgeTitle || `Lv.${item.level}`}</span>
                  <div className={styles.rankDpPoints}>{valueDisplay}</div>
                </div>
              );
            })}
          </div>

          {/* Ranks 4 to 10 List */}
          <div className={styles.rankListTable}>
            {restRankings.map((item: any) => {
              const valueDisplay = rankingTab === "referral"
                ? `${item.menteeCount} ${lang === "vi" ? "Mentee" : "명 추천"}`
                : `${item.dpPoints?.toLocaleString()} DP`;

              return (
                <div key={item.rank} className={styles.rankListRow}>
                  <div className={styles.rankListLeft}>
                    <span className={styles.rankNum}>{item.rank}</span>
                    <img src={item.avatar} alt={item.displayName} className={styles.rankMiniAvatar} />
                    <div className={styles.rankInfoBlock}>
                      <span className={styles.rankInfoName}>{item.displayName} <small style={{ color: 'var(--text-muted)' }}>({item.maskedEmail})</small></span>
                      <span className={styles.rankInfoBadge}>Lv.{item.level} • {item.badgeTitle}</span>
                    </div>
                  </div>
                  <div className={styles.rankRightDp}>
                    {valueDisplay}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 8-Axis DNA Feature Highlight */}
      <section className={styles.dnaHighlightSection}>
        <div className="container">
          <div className={styles.dnaSplit}>
            <div className={styles.dnaText}>
              <span className="badge">AI & BIO FERMENTATION</span>
              <h2 className={`${styles.responsiveHeading} text-gradient`}>
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

      {/* Facebook Video & Reels Showcase Section */}
      <section className={styles.fbVideoSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="badge" style={{ background: 'rgba(24, 119, 242, 0.1)', color: '#1877F2', borderColor: 'rgba(24, 119, 242, 0.3)' }}>
              📘 FACEBOOK REELS & VIDEOS
            </span>
            <h2 className={`${styles.responsiveHeading} text-gradient`} style={{ margin: '16px 0' }}>
              {lang === "vi" ? "Video & Reels Daehan Kimchi trên Facebook" : "대한김치 페이스북 공식 영상 & 릴스"}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              {lang === "vi" 
                ? "Theo dõi các video quy trình sản xuất, trải nghiệm vị ngon và câu chuyện thương hiệu trên Facebook." 
                : "생생한 대한김치의 제조 과정과 미식 경험, 하노이 현지 소식을 페이스북 영상으로 감상해보세요."}
            </p>
          </div>

          <div className={styles.fbVideoGrid}>
            {FACEBOOK_VIDEOS.map((item) => (
              <div
                key={item.id}
                className={styles.fbVideoCard}
                onClick={() => setActiveVideo({ title: item.title, videoUrl: item.videoUrl, fbUrl: item.url })}
              >
                <div className={styles.fbVideoThumb}>
                  <img src={item.thumbnail} alt={item.title} className={styles.fbThumbImg} />
                  <div className={styles.fbThumbOverlay}></div>
                  <span className={styles.fbBadgePos}>
                    {item.type === "reel" ? "🎬 Reel" : "📹 Video"}
                  </span>
                  <div className={styles.fbPlayCircle}>
                    <Play size={26} fill="#ffffff" style={{ marginLeft: '3px' }} />
                  </div>
                </div>
                <div className={styles.fbCardBody}>
                  <h4 className={styles.fbCardTitle}>{item.title}</h4>
                  <button className={styles.fbWatchBtn}>
                    <Play size={16} fill="#ffffff" />
                    <span>비회원 바로 감상하기</span>
                  </button>
                </div>
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
            <h4>{t("feat.fresh.title", "오토바이 안심 직배송")}</h4>
            <p>{t("feat.fresh.desc", "하노이 전 지역 신선 온도 유지 배송")}</p>
          </div>
          <div className={styles.trustItem}>
            <HeartHandshake size={36} color="#e50914" />
            <h4>{lang === "vi" ? "Ưu đãi điểm thưởng DP" : "대한포인트 혜택"}</h4>
            <p>{lang === "vi" ? "Tích lũy 10% điểm DP khi mua hàng 및 đánh giá" : "구매 시 10% DP 즉시 적립 및 후기 작성 혜택"}</p>
          </div>
        </div>
      </section>

      {/* Non-member In-App Video Modal Player */}
      {activeVideo && (
        <div className={styles.videoModalOverlay} onClick={() => setActiveVideo(null)}>
          <div className={styles.videoModalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.videoModalHeader}>
              <h3 className={styles.videoModalTitle}>🎬 {activeVideo.title}</h3>
              <button className={styles.videoModalCloseBtn} onClick={() => setActiveVideo(null)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.videoModalBody}>
              {activeVideo.videoUrl.endsWith(".mp4") ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className={styles.videoModalMedia}
                />
              ) : (
                <iframe
                  src={activeVideo.videoUrl}
                  title={activeVideo.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className={styles.videoModalMedia}
                ></iframe>
              )}
            </div>
            <div className={styles.videoModalFooter}>
              <span style={{ fontSize: '0.88rem', color: '#4ade80', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#4ade80" /> 페이스북 로그인 없이 자유롭게 바로 감상 중입니다.
              </span>
              <a
                href={activeVideo.fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Facebook 앱에서 보기</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
