import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.brandInfo}>
                    <Link href="/" className={styles.footerLogoLink}>
                        <img src="/images/logo2.png" alt="대한김치" className={styles.footerLogoImg} />
                    </Link>
                    <p className={styles.brandDesc}>
                        정성 어린 정통 손맛과 꼼꼼한 위생 관리.<br />
                        하노이 중심에서 전하는 완벽한 발효과학의 비밀.
                    </p>
                    <p className={styles.companySubInfo}>
                        인피니스㈜ 대한김치 • HACCP CODEX 2020 인증
                    </p>
                </div>
                <div className={styles.links}>
                    <div className={styles.linkColumn}>
                        <h4>COMPANY</h4>
                        <Link href="/about">회사소개서</Link>
                        <Link href="/about#ceo">대표 인사말</Link>
                        <Link href="/about#haccp">HACCP 위생인증</Link>
                        <Link href="/about#brand">브랜드 철학</Link>
                    </div>
                    <div className={styles.linkColumn}>
                        <h4>SERVICE</h4>
                        <Link href="/shop">김치 상품 몰</Link>
                        <Link href="/service">제품 서비스</Link>
                        <a href="/docu/HACCP_Certificate.pdf" target="_blank" rel="noopener noreferrer">HACCP 인증서(PDF)</a>
                    </div>
                    <div className={styles.linkColumn}>
                        <h4>SUPPORT</h4>
                        <Link href="/support">고객지원</Link>
                        <Link href="/privacy">개인정보 처리방침</Link>
                        <Link href="/terms">이용약관</Link>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} CÔNG TY CỔ PHẦN INFINIS (DAEHAN KIMCHI). All Rights Reserved.</p>
                <p>Vietnam Hanoi Branch • Factory: Đông Anh, Hà Nội</p>
            </div>
        </footer>
    );
}
