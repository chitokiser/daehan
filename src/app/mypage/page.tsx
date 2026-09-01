"use client";
import { useState } from "react";
import styles from "./page.module.css";

// Mocking the ZENTARO User DB interaction
const initialHistory = [
    { id: 1, type: "earn", amount: 1500, title: "발효식품 웹진 일일 콘텐츠 출석 보상", date: "2026-09-01" },
    { id: 2, type: "earn", amount: 3000, title: "대한김치 통합 리워드 시스템 가입 축하", date: "2026-08-31" },
    { id: 3, type: "spend", amount: -2000, title: "장바구니 할인 쿠폰 2,000원 교환", date: "2026-08-28" },
    { id: 4, type: "earn", amount: 5000, title: "프리미엄 포기김치 포토 리뷰 작성", date: "2026-08-25" },
];

export default function PointDashboard() {
    const [points, setPoints] = useState(7500);
    const [history] = useState(initialHistory);
    const [loading, setLoading] = useState(false);

    // ZENTARO DB Mock sync function
    const syncWithZentaroDB = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert("ZENTARO 회원 DB와 성공적으로 연동되어 최신 포인트를 동기화했습니다!");
        }, 1000);
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={`${styles.title} text-gradient`}>마이페이지 & 포인트</h1>

            <div className={styles.pointCard}>
                <h2 className={styles.pointLabel}>현재 보유 대한포인트 (초기 ZENTARO 연동)</h2>
                <div className={styles.pointValue}>
                    {points.toLocaleString()}<span>DP</span>
                </div>
                <div className={styles.actions}>
                    <button className="btn-primary" onClick={syncWithZentaroDB} disabled={loading}>
                        {loading ? "동기화 중..." : "ZENTARO DB 연동 동기화하기"}
                    </button>
                </div>
            </div>

            <div className={styles.historySection}>
                <h3 className={styles.historyTitle}>최근 리워드 적립 및 사용 내역</h3>
                <ul className={styles.historyList}>
                    {history.map(item => (
                        <li key={item.id} className={styles.historyItem}>
                            <div className={styles.itemInfo}>
                                <h4>{item.title}</h4>
                                <p>{item.date}</p>
                            </div>
                            <div className={`${styles.itemAmount} ${item.type === 'earn' ? styles.positive : styles.negative}`}>
                                {item.type === 'earn' ? '+' : ''}{item.amount.toLocaleString()} DP
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
