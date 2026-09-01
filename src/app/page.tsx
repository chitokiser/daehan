import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        {/* Placeholder for AI CF Video / Short Form */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className={styles.videoBg}
          poster="https://images.unsplash.com/photo-1583224964978-225ddb3ea664?q=80&w=2000&auto=format&fit=crop"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-red-chili-powder-falling-in-slow-motion-42686-large.mp4" type="video/mp4" />
        </video>

        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <h1 className={`${styles.title} ${styles.fadeInUp} ${styles.delay1}`}>
            <span className="text-gradient">The Essence of Fermentation</span>
            <br />Daehan Kimchi
          </h1>
          <p className={`${styles.subtitle} ${styles.fadeInUp} ${styles.delay2}`}>
            대한김치는 단순한 식품을 넘어, 베트남과 한국의 발효 과학을 잇는 <br />
            프리미엄 미식 라이프스타일 브랜드입니다. 당신만의 김치 DNA를 찾아보세요.
          </p>
          <div className={`${styles.ctaGroup} ${styles.fadeInUp} ${styles.delay3}`}>
            <Link href="/dna-test">
              <button className="btn-primary">나의 김치 DNA 찾기</button>
            </Link>
            <Link href="/brand">
              <button className={styles.btnSecondary}>브랜드 및 위생 관리</button>
            </Link>
          </div>
        </div>
      </section>

      {/* 
        This acts as the placeholder for the upcoming sections:
        - Brand Story & HACCP Infographics
        - Fermentation Webzine highlights 
        - Daehan Point Rewards summary
      */}
      <section style={{ height: '100vh', padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Discover the 8-Axis Kimchi DNA</h2>
        <p style={{ color: 'var(--text-muted)' }}>Scroll to explore the premium content...</p>
      </section>
    </main>
  );
}
