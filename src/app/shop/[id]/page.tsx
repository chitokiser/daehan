"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";
import { Star } from "lucide-react";

const products = [
    { id: 1, name: "프리미엄 포기김치", desc: "신선한 고랭지 배추와 30년 비법 양념으로 버무린 대한김치의 시그니처 배추김치. 깊고 풍부한 젓갈향과 매콤한 양념이 아삭한 배추 속에 가득 배어 있습니다.", price: "150,000 VND", badge: "BEST", image: "/images/products/pogi.jpg" },
    { id: 2, name: "새콤달콤 깍두기", desc: "한 입 크기의 무를 시원하게 담가 진한 곰탕이나 국밥과 가장 잘 어울리는 식탁 필수품.", price: "140,000 VND", badge: "POPULAR", image: "/images/products/kkakdugi.jpg" },
    { id: 3, name: "향긋한 깻잎김치", desc: "한 장 한 장 정성스레 양념을 바른 밥도둑 깻잎김치. 향긋한 풍미와 깊은 감칠맛의 조화.", price: "160,000 VND", badge: "RECOMMEND", image: "/images/products/kkaennip.jpg" },
    { id: 4, name: "알싸한 대파김치", desc: "달큼하고 알싸한 대파의 결이 살아있어 고기 구이나 라면과 최고의 마리아주를 자랑하는 별미.", price: "170,000 VND", badge: "SPECIAL", image: "/images/products/daepa.jpg" },
    { id: 5, name: "정통 전라도식 파김치", desc: "신선한 쪽파에 멸치액젓과 특제 양념을 듬뿍 버무려 숙성될수록 톡 쏘는 깊은 감칠맛.", price: "180,000 VND", badge: "PREMIUM", image: "/images/products/pa.jpg" }
];

export default function ProductDetail() {
    const pathname = usePathname();
    const rawId = pathname?.split("/").pop() || "1";
    const idValue = parseInt(rawId, 10);

    const product = products.find(p => p.id === idValue) || products[0];

    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    // Real-time state for reviews
    const [reviews, setReviews] = useState([
        { id: 101, user: "최*민 (VIP고객)", stars: 5, content: "맛이 깊고 젓갈의 풍미가 신선해서 매우 만족스럽습니다! 하노이에서 바로 받을 수 있어 편리해요." },
        { id: 102, user: "응우옌티*", stars: 5, content: "하노이에서 이런 엄청난 퀄리티의 한식당 김치라니, 놀랍습니다. 배송도 빠릅니다. 재구매 의사 무조건 있습니다." },
        { id: 103, user: "J** (일반고객)", stars: 4, content: "양이 많고 패키지가 훌륭하지만 베트남 분들이 드시기에 살짝 매운 편이에요. 그래도 맛있습니다." },
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewText.trim()) return alert("후기 내용을 작성해주세요.");

        setReviews([{
            id: Date.now(),
            user: "나 (현재 로그인된 유저)",
            stars: rating,
            content: reviewText
        }, ...reviews]);

        setReviewText("");
        alert("소중한 스코어 평가 리뷰가 등록되었으며 500 DP(대한포인트)가 회원 계정에 즉시 적립되었습니다!");
    };

    const renderStars = (count: number) => {
        return Array(5).fill(0).map((_, i) => (
            <Star key={i} size={18} fill={i < count ? "#FBBC05" : "transparent"} color={i < count ? "#FBBC05" : "#444"} style={{ marginRight: 4 }} />
        ));
    };

    return (
        <div className={styles.detailContainer}>
            <div className={styles.productSplit}>
                <div className={styles.imageSection}>
                    <img src={product.image} alt={product.name} className={styles.productImage} />
                </div>

                <div className={styles.infoSection}>
                    {product.badge && <span className={styles.badge}>{product.badge}</span>}
                    <h1 className={styles.title}>{product.name}</h1>
                    <p className={styles.price}>{product.price}</p>
                    <p className={styles.desc}>{product.desc}</p>

                    <div className={styles.purchaseActions}>
                        <button className={`btn-primary ${styles.buyBtn}`}>장바구니 추가 & 750 DP 적립안내</button>
                    </div>
                </div>
            </div>

            <div className={styles.reviewSection}>
                <h2 className={styles.reviewTitle}>
                    제품 및 평점 후기
                    <span className={styles.ratingOverview}>(4.8/5.0)</span>
                </h2>

                <form className={styles.writeForm} onSubmit={handleSubmit}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', color: '#fff' }}>직접 평점 매기기</h3>
                    <div className={styles.ratingSelect} onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                className={`${styles.starBtn} ${star <= (hoverRating || rating) ? styles.active : ''}`}
                                onMouseEnter={() => setHoverRating(star)}
                                onClick={() => setRating(star)}
                            >
                                <Star size={36} fill={star <= (hoverRating || rating) ? "#FBBC05" : "transparent"} strokeWidth={0} />
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        className={styles.reviewInput}
                        placeholder="[후기 작성 시 500 대한포인트 즉시 지급] 구매하신 제품의 맛과 경험을 자유롭게 나눠주세요!"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontSize: '1.05rem' }}>별점 & 후기 등록하기</button>
                </form>

                <div className={styles.reviewList}>
                    {reviews.map(review => (
                        <div key={review.id} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                                <span className={styles.reviewerName}>{review.user}</span>
                                <span className={styles.stars}>{renderStars(review.stars)}</span>
                            </div>
                            <p className={styles.reviewContent}>{review.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
