import styles from "./page.module.css";
import Link from "next/link";

const products = [
    {
        id: 1,
        name: "프리미엄 포기김치 (Pogi Kimchi)",
        desc: "신선한 고랭지 배추와 30년 비법 양념으로 버무린 대한김치의 시그니처 베스트셀러.",
        price: "150,000 VND",
        badge: "BEST",
        image: "/images/products/pogi.jpg"
    },
    {
        id: 2,
        name: "새콤달콤 깍두기 (Kkakdugi)",
        desc: "한 입 크기의 무를 시원하게 담가 진한 곰탕이나 국밥과 가장 잘 어울리는 식탁 필수품.",
        price: "140,000 VND",
        badge: "POPULAR",
        image: "/images/products/kkakdugi.jpg"
    },
    {
        id: 3,
        name: "향긋한 깻잎김치 (Kkaennip Kimchi)",
        desc: "한 장 한 장 정성스레 양념을 바른 밥도둑 깻잎김치. 향긋한 풍미와 깊은 감칠맛의 조화.",
        price: "160,000 VND",
        badge: "RECOMMEND",
        image: "/images/products/kkaennip.jpg"
    },
    {
        id: 4,
        name: "알싸한 대파김치 (Daepa Kimchi)",
        desc: "달큼하고 알싸한 대파의 결이 살아있어 고기 구이나 라면과 최고의 마리아주를 자랑하는 별미.",
        price: "170,000 VND",
        badge: "SPECIAL",
        image: "/images/products/daepa.jpg"
    },
    {
        id: 5,
        name: "정통 전라도식 파김치 (Pa Kimchi)",
        desc: "신선한 쪽파에 멸치액젓과 특제 양념을 듬뿍 버무려 숙성될수록 톡 쏘는 깊은 감칠맛.",
        price: "180,000 VND",
        badge: "PREMIUM",
        image: "/images/products/pa.jpg"
    }
];

export default function Shop() {
    return (
        <div className={styles.shopContainer}>
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>ZENTARO DAEHAN SHOP</h1>
                <p className={styles.description}>
                    30년 장인의 손맛과 엄격한 위해요소분석(HACCP) 인증 시설에서 생산됩니다.<br />
                    베트남 하노이에서 만나는 프리미엄 발효과학. (10kg 이상 주문 시 하노이 시내 무료배송)
                </p>
            </header>

            <div className={`${styles.productGrid} container`}>
                {products.map(product => (
                    <Link href={`/shop/${product.id}`} key={product.id}>
                        <article className={styles.productCard}>
                            {product.badge && <span className={styles.badge}>{product.badge}</span>}
                            <div className={styles.imageWrapper}>
                                <img src={product.image} alt={product.name} className={styles.productImage} />
                            </div>
                            <div className={styles.info}>
                                <h2 className={styles.productName}>{product.name}</h2>
                                <p className={styles.productDesc}>{product.desc}</p>
                                <div className={styles.footer}>
                                    <span className={styles.price}>{product.price}</span>
                                    <button className={styles.addToCartBtn}>상세보기</button>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
