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
                        30년 장인의 손맛과 철저한 위생 관리 프로세스(HACCP).<br />
                        하노이 중심에서 전하는 완벽한 발효과학의 비밀.
                    </p>
                </div>
                <div className={styles.links}>
                    <div className={styles.linkColumn}>
                        <h4>COMPANY</h4>
                        <Link href="/about">브랜드 소개</Link>
                        <Link href="/service">제품 서비스</Link>
                        <Link href="/research">ZENTAROLAB R&D</Link>
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
                <p>&copy; {new Date().getFullYear()} DAEHAN KIMCHI INC. All Rights Reserved.</p>
                <p>Vietnam Hanoi Branch</p>
            </div>
        </footer>
    );
}
