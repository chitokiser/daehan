"use client";

import React, { useEffect, useState } from "react";
import styles from "./KMoaWidget.module.css";
import { Zap } from "lucide-react";

interface KMoaBalance {
    points: number;
    km: number;
    btBalance: number;
}

export default function KMoaWidget() {
    const [balance, setBalance] = useState<KMoaBalance | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKMoaData = async () => {
            try {
                // Fetch balance from internal proxy API
                const res = await fetch("/api/v1/kmoa/balance");
                const data = await res.json();
                
                if (data.success && data.balance) {
                    setBalance(data.balance);
                } else {
                    // Fallback to demo data if API fails
                    setBalance({ points: 756212, km: 367620, btBalance: 193 });
                }
            } catch (error) {
                console.error("Failed to fetch K-MOA balance:", error);
                setBalance({ points: 756212, km: 367620, btBalance: 193 });
            } finally {
                setLoading(false);
            }
        };

        fetchKMoaData();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.topCardsGrid}>
                    <div className={styles.skeletonCard}></div>
                    <div className={styles.skeletonCard}></div>
                    <div className={styles.skeletonCard}></div>
                </div>
                <div className={styles.skeletonLevel}></div>
            </div>
        );
    }

    // Default to fallback values if somehow balance is still null
    const safeBalance = balance || { points: 0, km: 0, btBalance: 0 };
    
    // Mock level data to match the screenshot design
    const levelData = {
        level: 2,
        name: "소보지",
        currentExp: 30457,
        maxExp: 40000
    };

    const expPercentage = Math.min((levelData.currentExp / levelData.maxExp) * 100, 100);

    const handlePointConvert = () => {
        alert("포인트를 Money로 전환하는 팝업/페이지가 열립니다.");
    };

    const handleUseBt = () => {
        alert("마켓 굴리기(BT 사용) 페이지가 열립니다.");
    };

    return (
        <div className={styles.kmoaWidgetContainer}>
            {/* Top Cards Grid */}
            <div className={styles.topCardsGrid}>
                {/* KM Card */}
                <div className={`${styles.cardBase} ${styles.kmCard}`}>
                    <div className={styles.cardTitle}>label_payment_balance</div>
                    <div className={styles.cardValue}>{(safeBalance.km || 0).toLocaleString()} KM</div>
                    <div className={styles.cardSubtext}>(K-MOA 가맹점 결제 가능 잔고)</div>
                </div>

                {/* Points Card */}
                <div className={`${styles.cardBase} ${styles.pointsCard}`}>
                    <div className={styles.cardTitle}>Points (→Point)</div>
                    <div className={styles.cardValue}>{(safeBalance.points || 0).toLocaleString()} P</div>
                    <button className={`${styles.cardActionBtn} ${styles.pointsBtn}`} onClick={handlePointConvert}>
                        <Zap size={14} /> Money로 전환
                    </button>
                </div>

                {/* BT Card */}
                <div className={`${styles.cardBase} ${styles.btCard}`}>
                    <div className={styles.cardTitle}>label_bt</div>
                    <div className={styles.cardValue}>{(safeBalance.btBalance || 0).toLocaleString()} BT</div>
                    <button className={`${styles.cardActionBtn} ${styles.btBtn}`} onClick={handleUseBt}>
                        사용하기 (마켓 굴리기)
                    </button>
                </div>
            </div>

            {/* Level Section */}
            <div className={styles.levelSection}>
                <div className={styles.levelHeader}>
                    <div className={styles.levelInfo}>
                        <div className={styles.levelCircle}>{levelData.level}</div>
                        <div>
                            <div className={styles.levelName}>LEVEL</div>
                            <div className={styles.levelTitle}>{levelData.name}</div>
                        </div>
                    </div>
                    <div className={styles.expInfo}>
                        <div className={styles.expLabel}>다음 레벨까지</div>
                        <div className={styles.expValue}>
                            {(levelData.maxExp - levelData.currentExp).toLocaleString()} EXP
                        </div>
                    </div>
                </div>

                <div className={styles.expLabel} style={{ marginBottom: "0.25rem", textAlign: "right" }}>
                    {levelData.currentExp.toLocaleString()} / {levelData.maxExp.toLocaleString()} EXP
                </div>
                <div className={styles.progressBarContainer}>
                    <div 
                        className={styles.progressBarFill} 
                        style={{ width: `${expPercentage}%` }}
                    />
                </div>

                <div className={styles.earnWaysGrid}>
                    <div className={styles.earnWayCard}>
                        <div className={styles.earnWayTitle}>결제 100,000₫</div>
                        <div className={styles.earnWayValue}>+100 EXP</div>
                    </div>
                    <div className={styles.earnWayCard}>
                        <div className={styles.earnWayTitle}>BT 1장 수강</div>
                        <div className={styles.earnWayValue}>+100 EXP</div>
                    </div>
                    <div className={styles.earnWayCard}>
                        <div className={styles.earnWayTitle}>추천인 등록</div>
                        <div className={styles.earnWayValue}>+1,000 EXP</div>
                    </div>
                </div>

                <div className={styles.levelFooter}>
                    <Zap size={14} color="#fde047" /> 포인트 → KM 전환 비율: 포인트 x 2 + 10
                </div>
            </div>
        </div>
    );
}
