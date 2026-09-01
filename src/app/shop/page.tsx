import styles from "./page.module.css";
import Link from "next/link";

const products = [
    {
        id: 1,
        name: "프리미엄 포기김치 (Pogi Kimchi)",
        desc: "신선한 고랭지 배추와 30년 비법 양념으로 버무린 대한김치의 시그니처 베스트셀러.",
        price: "150,000 VND",
        badge: "BEST",
        image: "https://images.unsplash.com/photo-1583225206029-a46c5b058a94?q=80&w=700&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "아삭한 총각김치 (Chonggak Kimchi)",
        desc: "알타리 무 특유의 단단하고 아삭한 식감과 깊은 발효향을 동시에 느낄 수 있는 별미.",
        price: "160,000 VND",
        badge: "RECOMMEND",
        image: "https://images.unsplash.com/photo-1549909249-165f9a6225a1?q=80&w=700&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "새콤달콤 깍두기 (Kkakdugi)",
        desc: "한 입 크기의 무를 시원하게 담가 진한 곰탕이나 국밥과 가장 잘 어울리는 식탁 필수품.",
        price: "140,000 VND",
        badge: "",
        image: "https://images.unsplash.com/photo-1549909249-165f9a6225a1?q=80&w=700&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "전라도식 갓김치 (Gat Kimchi)",
        desc: "알싸한 돌산 갓의 향과 톡 쏘는 매력, 시간이 지나 숙성될수록 깊어지는 고급스러운 풍미.",
        price: "180,000 VND",
        badge: "PREMIUM",
        image: "https://images.unsplash.com/photo-1583224964978-225ddb3ea664?q=80&w=700&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "시원한 열무김치 (Yeolmu Kimchi)",
        desc: "여름철 잃어버린 입맛을 돋우는 연한 열무와 자작한 국물의 시원한 조화.",
        price: "145,000 VND",
        badge: "",
        image: "https://images.unsplash.com/photo-1583224964978-225ddb3ea664?q=80&w=700&auto=format&fit=crop"
    },
    {
        id: 6,
        name: "깔끔한 맛김치 (Mat Kimchi)",
        desc: "미리 먹기 좋게 썰어져 있어 간편하며, 바쁜 일상 속에서도 정갈하게 즐길 수 있는 김치.",
        price: "150,000 VND",
        badge: "",
        image: "https://images.unsplash.com/photo-1583225206029-a46c5b058a94?q=80&w=700&auto=format&fit=crop"
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
