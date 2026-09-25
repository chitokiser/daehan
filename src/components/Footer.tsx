"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const { lang, t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.brandInfo}>
                    <Link href="/" className={styles.footerLogoLink}>
                        <img src="/images/logo2.png" alt="대한김치" className={styles.footerLogoImg} />
                    </Link>
                    <p className={styles.brandDesc}>
                        {t("footer.desc", "정성 어린 정통 손맛과 꼼꼼한 위생 관리. 하노이 중심에서 전하는 완벽한 발효과학의 비밀.")}
                    </p>
                    <p className={styles.companySubInfo}>
                        {t("footer.company", "인피니스㈜ 대한김치 • HACCP CODEX 2020 인증")}
                    </p>
                </div>
                <div className={styles.links}>
                    <div className={styles.linkColumn}>
                        <h4>{t("footer.companyTitle", "COMPANY")}</h4>
                        <Link href="/about">{t("footer.about", "회사소개서")}</Link>
                        <Link href="/about#ceo">{t("footer.ceo", "대표 인사말")}</Link>
                        <Link href="/about#haccp">{t("footer.haccp", "HACCP 위생인증")}</Link>
                        <Link href="/about#brand">{t("footer.brand", "브랜드 철학")}</Link>
                    </div>
                    <div className={styles.linkColumn}>
                        <h4>{t("footer.serviceTitle", "SERVICE")}</h4>
                        <Link href="/shop">{t("footer.shop", "김치 상품 몰")}</Link>
                        <Link href="/service">{t("footer.service", "제품 서비스")}</Link>
                    </div>
                    <div className={styles.linkColumn} style={{ minWidth: '220px' }}>
                        <h4 style={{ color: '#e50914', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>
                            📞 {lang === "vi" ? "LIÊN HỆ ĐẶT HÀNG" : "주문 & 고객 문의"}
                        </h4>
                        <div style={{
                            background: '#ffffff',
                            border: '1.5px solid rgba(229, 9, 20, 0.25)',
                            borderRadius: '14px',
                            padding: '14px 16px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                        }}>
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ display: 'inline-block', fontSize: '0.78rem', fontWeight: 800, color: '#e50914', background: 'rgba(229,9,20,0.08)', padding: '2px 8px', borderRadius: '6px', marginBottom: '4px' }}>
                                    🇰🇷 Korean (한국어)
                                </span>
                                <p style={{ margin: '2px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#1A0D08' }}>
                                    0702116617 <span style={{ color: '#aaa', fontWeight: 400 }}>/</span> 0366440746
                                </p>
                            </div>
                            <div>
                                <span style={{ display: 'inline-block', fontSize: '0.78rem', fontWeight: 800, color: '#16a34a', background: 'rgba(22,163,74,0.08)', padding: '2px 8px', borderRadius: '6px', marginBottom: '4px' }}>
                                    🇻🇳 Vietnam (Tiếng Việt)
                                </span>
                                <p style={{ margin: '2px 0 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#16a34a' }}>
                                    0349475948
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.linkColumn}>
                        <h4>{t("footer.supportTitle", "SUPPORT")}</h4>
                        <Link href="/support">{t("footer.support", "고객지원")}</Link>
                        <Link href="/privacy">{t("footer.privacy", "개인정보 처리방침")}</Link>
                        <Link href="/terms">{t("footer.terms", "이용약관")}</Link>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} CÔNG TY CỔ PHẦN INFINIS (DAEHAN KIMCHI). All Rights Reserved.</p>
                <p>Vietnam Hanoi Branch • Factory: Đông Anh, Hà Nội • Contact Korean: 0702116617 / 0366440746 | Vietnam: 0349475948</p>
            </div>
        </footer>
    );
}
