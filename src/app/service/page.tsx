"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { ThumbsUp, Share2, ExternalLink, Eye, X } from "lucide-react";
import { useUserWallet } from "@/context/UserWalletContext";

// 브랜드 공식 웹진 타입
interface KmoaWebzine {
    webzineId: string;
    title: string;
    excerpt: string;
    thumbnailUrl: string;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    readUrl: string;
    whitelabelUrl: string;
    publishedAt: string;
    isTodayArticle?: boolean;
}

export default function WebzineServicePage() {
    const { user, refreshWallet } = useUserWallet();
    const [kmoaWebzines, setKmoaWebzines] = useState<KmoaWebzine[]>([]);
    const [kmoaLoading, setKmoaLoading] = useState(true);
    const [kmoaDemo, setKmoaDemo] = useState(false);
    const [kmoaViewer, setKmoaViewer] = useState<KmoaWebzine | null>(null);

    const handleOpenWebzine = (wz: KmoaWebzine) => {
        setKmoaViewer(wz);
        if (user?.uid) {
            fetch("/api/v1/rewards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user.uid,
                    actionType: "READ_WEBZINE",
                    itemId: wz.webzineId
                })
            }).then(r => r.json()).then(res => {
                if (res.success) {
                    refreshWallet();
                }
            }).catch(console.error);
        }
    };

    useEffect(() => {
        // 기존 6개에서 12개 정도로 늘려서 넉넉하게 불러오기
        fetch("/api/v1/kmoa/webzines?limit=12")
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setKmoaWebzines(data.webzines || []);
                    setKmoaDemo(!!data.demo);
                }
            })
            .catch(() => {})
            .finally(() => setKmoaLoading(false));
    }, []);

    const handleShare = async (e: React.MouseEvent, wz: KmoaWebzine) => {
        e.stopPropagation();
        const shareData = {
            title: wz.title,
            text: wz.excerpt,
            url: window.location.origin + `/service?article=${wz.webzineId}`
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert("링크가 클립보드에 복사되었습니다!");
            } catch (err) {
                alert("공유 기능을 지원하지 않는 브라우저입니다.");
            }
        }
    };

    return (
        <div className={styles.webzineContainer}>
            {/* Header Hero */}
            <header className={styles.header}>
                <h1 className={`${styles.title} text-gradient`}>FERMENTATION WEBZINE</h1>
                <p className={styles.description}>
                    매일 00:00 시각에 맞춰 1개씩 자동 발행/업그레이드되는 대한김치 전용 미식 & 발효 웹진.
                </p>
            </header>

            {/* ── 공식 AI 웹진 섹션 ── */}
            <section className={styles.kmoaWebzineSection}>
                <div className={styles.kmoaSectionHeader}>
                    <div className={styles.kmoaTitleRow}>
                        <span className={styles.kmoaLiveDot} />
                        <h2 className={styles.kmoaSectionTitle}>📰 브랜드 매거진 (매일 자동 발행)</h2>
                        <span className={styles.dailyBadge}>DAILY AUTO-UPGRADE</span>
                    </div>
                    <p className={styles.kmoaSectionDesc}>대한김치 실제 제품 및 무균 생산 공정 현장을 바탕으로 매일 1개씩 자동 생성 및 발행되는 브랜드 전용 라이브 매거진입니다.</p>
                </div>

                {kmoaLoading ? (
                    <div className={styles.kmoaSkeletonGrid}>
                        {[1,2,3,4,5,6].map(n => (
                            <div key={n} className={styles.kmoaSkeleton}>
                                <div className={styles.kmoaSkeletonThumb} />
                                <div className={styles.kmoaSkeletonLine} />
                                <div className={styles.kmoaSkeletonLineShort} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.kmoaGrid}>
                        {kmoaWebzines.map(wz => (
                            <div
                                key={wz.webzineId}
                                className={styles.kmoaCard}
                                onClick={() => handleOpenWebzine(wz)}
                            >
                                <div className={styles.kmoaThumbWrap}>
                                    <img
                                        src={wz.thumbnailUrl}
                                        alt={wz.title}
                                        className={styles.kmoaThumb}
                                        onError={(e) => { (e.target as HTMLImageElement).src = "/images/products/pogi.jpg"; }}
                                    />
                                    {wz.isTodayArticle && (
                                        <div className={styles.todayArticleTag}>
                                            🔥 오늘 자동 업그레이드 (NEW)
                                        </div>
                                    )}
                                    <div className={styles.kmoaStatsOverlay}>
                                        <span className={styles.kmoaStatChip}>
                                            <ThumbsUp size={11} /> {wz.likeCount}
                                        </span>
                                        <span 
                                            className={styles.kmoaStatChip} 
                                            onClick={(e) => handleShare(e, wz)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Share2 size={11} /> 공유하기
                                        </span>
                                    </div>
                                    <div className={styles.kmoaWhitelabelBadge}>
                                        <ExternalLink size={10} /> 화이트라벨
                                    </div>
                                </div>
                                <div className={styles.kmoaCardBody}>
                                    <p className={styles.kmoaCardDate}>
                                        {new Date(wz.publishedAt).toLocaleDateString("ko-KR")}
                                    </p>
                                    <h3 className={styles.kmoaCardTitle}>{wz.title}</h3>
                                    <p className={styles.kmoaCardExcerpt}>{wz.excerpt}</p>
                                    <div className={styles.kmoaCardFooter}>
                                        <span className={styles.kmoaViewCount}>👁 {wz.viewCount}</span>
                                        <button className={styles.kmoaReadBtn}>
                                            <Eye size={13} /> 상세 보기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 매거진 화이트라벨 iframe 뷰어 팝업 */}
            {kmoaViewer && (
                <div className={styles.kmoaViewerOverlay} onClick={() => setKmoaViewer(null)}>
                    <div className={styles.kmoaViewerModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.kmoaViewerHeader}>
                            <span className={styles.kmoaViewerTitle}>{kmoaViewer.title}</span>
                            <button className={styles.kmoaViewerClose} onClick={() => setKmoaViewer(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <iframe
                            src={kmoaViewer.whitelabelUrl}
                            className={styles.kmoaViewerFrame}
                            title={kmoaViewer.title}
                            sandbox="allow-scripts allow-same-origin allow-popups"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
