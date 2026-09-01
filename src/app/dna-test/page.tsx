"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import Link from 'next/link';

const questions = [
    { axis: "Spicy", label: "매운맛", q: "고추장의 매콤함이나 매운 고춧가루가 듬뿍 들어간 맛을 선호하시나요?" },
    { axis: "Sour", label: "신맛", q: "입맛을 돋우는 새콤하게 잘 익은 묵은지 같은 맛을 좋아하시나요?" },
    { axis: "Salty", label: "짠맛", q: "밥과 함께 먹기 좋게 간간하고 짭조름한 간이 밴 김치를 선호하시나요?" },
    { axis: "Sweet", label: "단맛", q: "과일의 단맛이나 양념의 자연스러운 달큰함이 느껴지는 김치가 좋으신가요?" },
    { axis: "Umami", label: "감칠맛", q: "풍부한 젓갈이 들어가 깊고 묵직한 감칠맛이 도는 김치를 원하시나요?" },
    { axis: "Crunchy", label: "아삭함", q: "무나 열무처럼 경쾌하게 씹히는 식감을 매우 중요하게 생각하시나요?" },
    { axis: "Fermented", label: "발효향", q: "갓김치처럼 시간이 지날수록 톡 쏘는 발효향을 좋아하시나요?" },
    { axis: "Flavor", label: "풍미", q: "배추 본연의 맛보다 다양한 양념이 어우러져 내는 진한 풍미를 원하시나요?" },
];

export default function DnaTest() {
    const [step, setStep] = useState(-1);
    const [scores, setScores] = useState<number[]>(Array(8).fill(0));

    const handleStart = () => setStep(0);

    const handleAnswer = (val: number) => {
        const newScores = [...scores];
        newScores[step] = val;
        setScores(newScores);
        setStep(step + 1);
    };

    if (step === -1) {
        return (
            <div className={styles.dnaContainer}>
                <div className={styles.introSection}>
                    <h1 className={`${styles.title} text-gradient`}>나의 김치 DNA 찾기</h1>
                    <p className={styles.description}>
                        8가지 맛의 축을 통해 당신의 미각에 완벽히 일치하는<br />
                        운명적인 대한김치를 찾아드립니다.
                    </p>
                    <div style={{ marginTop: 40 }}>
                        <button className="btn-primary" onClick={handleStart} style={{ padding: '16px 40px', fontSize: '1.2rem' }}>
                            DNA 분석 시작하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step >= 0 && step < questions.length) {
        const currentQ = questions[step];
        // Key added to glassCard to force re-animation on step change
        return (
            <div className={styles.dnaContainer}>
                <div key={step} className={styles.glassCard}>
                    <div className={styles.quizHeader}>
                        <div className={styles.stepIndicator}>STEP {step + 1} / {questions.length} - {currentQ.label}</div>
                        <h2 className={styles.questionText}>{currentQ.q}</h2>
                    </div>
                    <div className={styles.optionsContainer}>
                        <button className={styles.optionBtn} onClick={() => handleAnswer(100)}>완전 그렇다 (100점)</button>
                        <button className={styles.optionBtn} onClick={() => handleAnswer(80)}>어느정도 그렇다 (80점)</button>
                        <button className={styles.optionBtn} onClick={() => handleAnswer(50)}>보통이다 (50점)</button>
                        <button className={styles.optionBtn} onClick={() => handleAnswer(20)}>별로 그렇지 않다 (20점)</button>
                        <button className={styles.optionBtn} onClick={() => handleAnswer(0)}>전혀 그렇지 않다 (0점)</button>
                    </div>
                </div>
            </div>
        );
    }

    // Results calculation formatting
    const chartData = questions.map((q, i) => ({
        subject: q.label,
        A: scores[i],
        fullMark: 100
    }));

    // Simple mock recommendation logic
    const spicyScore = scores[0];
    const crunchyScore = scores[5];
    let recommended = "프리미엄 포기김치";
    if (spicyScore > 70) recommended = "전라도식 갓김치";
    if (crunchyScore > 70) recommended = "아삭한 총각김치";

    return (
        <div className={styles.dnaContainer}>
            <div className={styles.introSection}>
                <h1 className={styles.matchTitle}>분석 완료!</h1>
                <p className={styles.description}>당신의 미각 세포가 선택한 최고의 조합입니다.</p>
            </div>

            <div className={styles.glassCard}>
                <div className={styles.resultsSection}>
                    <h2 style={{ fontSize: '2rem', color: '#fff' }}>추천 김치: <span className="text-gradient">{recommended}</span></h2>

                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0a4ab', fontSize: 13 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="My DNA" dataKey="A" stroke="#e31837" fill="#e31837" fillOpacity={0.5} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={{ display: 'flex', gap: 16 }}>
                        <Link href="/shop"><button className="btn-primary">쇼핑몰에서 구매하기</button></Link>
                        <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setStep(-1)}>다시 테스트하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
