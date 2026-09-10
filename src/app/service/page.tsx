"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { ThumbsUp, Share2, ExternalLink, Eye, X, ShoppingBag, Heart, Check } from "lucide-react";
import { useUserWallet } from "@/context/UserWalletContext";
import Link from "next/link";

// 브랜드 공식 웹진 타입
interface KmoaWebzine {
    webzineId: string;
    title: string;
    excerpt: string;
    content?: string;
    relatedProductId?: string;
    thumbnailUrl: string;
    viewCount: number;
    likeCount: number;
    shareCount: number;
    readUrl: string;
    whitelabelUrl: string;
    publishedAt: string;
    isTodayArticle?: boolean;
}

function WebzineServiceContent() {
    const searchParams = useSearchParams();
    const articleIdFromUrl = searchParams.get("article");

    const { user, refreshWallet } = useUserWallet();
    const [kmoaWebzines, setKmoaWebzines] = useState<KmoaWebzine[]>([]);
    const [kmoaLoading, setKmoaLoading] = useState(true);
    const [kmoaDemo, setKmoaDemo] = useState(false);
    const [kmoaViewer, setKmoaViewer] = useState<KmoaWebzine | null>(null);
    const [viewMode, setViewMode] = useState<"native" | "iframe">("native");
    const [likedSet, setLikedSet] = useState<Record<string, boolean>>({});
    const [copied, setCopied] = useState(false);

    const handleOpenWebzine = (wz: KmoaWebzine) => {
        setKmoaViewer(wz);
        setViewMode("native");
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
        fetch("/api/v1/kmoa/webzines?limit=18")
            .then(r => r.json())
            .then(data => {
                if (data.success && data.webzines) {
                    setKmoaWebzines(data.webzines);
                    setKmoaDemo(!!data.demo);

                    // URL 파라미터 ?article= ID 가 존재하는 경우 해당 상세 모달 자동 연동
                    if (articleIdFromUrl) {
                        const target = data.webzines.find((w: KmoaWebzine) => w.webzineId === articleIdFromUrl);
                        if (target) {
                            handleOpenWebzine(target);
                        }
                    }
                }
            })
            .catch(() => {})
            .finally(() => setKmoaLoading(false));
    }, [articleIdFromUrl]);

    const handleToggleLike = (e: React.MouseEvent, webzineId: string) => {
        e.stopPropagation();
        setLikedSet(prev => {
            const isLiked = prev[webzineId];
            const nextState = !isLiked;

            setKmoaWebzines(list => list.map(item => {
                if (item.webzineId === webzineId) {
                    return {
                        ...item,
                        likeCount: isLiked ? item.likeCount - 1 : item.likeCount + 1
                    };
                }
                return item;
            }));

            if (kmoaViewer && kmoaViewer.webzineId === webzineId) {
                setKmoaViewer(prevViewer => prevViewer ? ({
                    ...prevViewer,
                    likeCount: isLiked ? prevViewer.likeCount - 1 : prevViewer.likeCount + 1
                }) : null);
            }

            return { ...prev, [webzineId]: nextState };
        });
    };

    const handleShare = async (e: React.MouseEvent, wz: KmoaWebzine) => {
        e.stopPropagation();
        const shareUrl = window.location.origin + `/service?article=${wz.webzineId}`;
        const shareData = {
            title: wz.title,
            text: wz.excerpt,
            url: shareUrl
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                alert("아티클 링크가 클립보드에 복사되었습니다!");
            } catch (err) {
                alert("공유 기능을 지원하지 않는 브라우저입니다.");
            }
        }
    };

    // 간단한 텍스트 포맷팅 (h3, h4, blockquote, bullet point)
    const renderFormattedContent = (text?: string) => {
        if (!text) return null;
        const lines = text.trim().split("\n");
        return lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} style={{ height: "12px" }} />;
            if (trimmed.startsWith("### ")) {
                return <h3 key={idx} className={styles.articleH3}>{trimmed.replace("### ", "")}</h3>;
            }
            if (trimmed.startsWith("#### ")) {
                return <h4 key={idx} className={styles.articleH4}>{trimmed.replace("#### ", "")}</h4>;
            }
            if (trimmed.startsWith("> ")) {
                return (
                    <blockquote key={idx} className={styles.articleBlockquote}>
                        {trimmed.replace("> ", "")}
                    </blockquote>
                );
            }
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                    <li key={idx} className={styles.articleListItem}>
                        {trimmed.substring(2)}
                    </li>
                );
            }
            if (/^\d+\.\s/.test(trimmed)) {
                return (
                    <li key={idx} className={styles.articleListItem}>
                        {trimmed.replace(/^\d+\.\s/, "")}
                    </li>
                );
            }
            return <p key={idx} className={styles.articleParagraph}>{trimmed}</p>;
        });
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
                                        <span 
                                            className={`${styles.kmoaStatChip} ${likedSet[wz.webzineId] ? styles.likedChip : ""}`}
                                            onClick={(e) => handleToggleLike(e, wz.webzineId)}
                                        >
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
                                        <ExternalLink size={10} /> 브랜드 매거진
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

            {/* 브랜드 매거진 인앱 인디테일 모달 뷰어 */}
            {kmoaViewer && (
                <div className={styles.kmoaViewerOverlay} onClick={() => setKmoaViewer(null)}>
                    <div className={styles.kmoaNativeModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.kmoaNativeModalHeader}>
                            <div className={styles.kmoaModalCategory}>
                                <span>📰 대한김치 미식 & 발효 라이브 매거진</span>
                                {kmoaViewer.isTodayArticle && <span className={styles.todayPill}>오늘 발행</span>}
                            </div>
                            <button className={styles.kmoaViewerClose} onClick={() => setKmoaViewer(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.kmoaNativeBody}>
                            {viewMode === "native" ? (
                                <article className={styles.nativeArticleContainer}>
                                    <div className={styles.articleHeroImageWrap}>
                                        <img 
                                            src={kmoaViewer.thumbnailUrl} 
                                            alt={kmoaViewer.title} 
                                            className={styles.articleHeroImage}
                                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/products/pogi.jpg"; }}
                                        />
                                        <div className={styles.articleMetaBadgeRow}>
                                            <span>📅 {new Date(kmoaViewer.publishedAt).toLocaleDateString("ko-KR")}</span>
                                            <span>👁 조회 {kmoaViewer.viewCount}</span>
                                            <span>❤️ 추천 {kmoaViewer.likeCount}</span>
                                        </div>
                                    </div>

                                    <h1 className={styles.articleMainTitle}>{kmoaViewer.title}</h1>
                                    <div className={styles.articleLeadExcerpt}>{kmoaViewer.excerpt}</div>

                                    <hr className={styles.articleDivider} />

                                    <div className={styles.articleBodyContent}>
                                        {renderFormattedContent(kmoaViewer.content || kmoaViewer.excerpt)}
                                    </div>

                                    {/* 하단 액션 영역 */}
                                    <div className={styles.articleFooterActions}>
                                        <button 
                                            className={`${styles.actionBtn} ${likedSet[kmoaViewer.webzineId] ? styles.likedActionBtn : ""}`}
                                            onClick={(e) => handleToggleLike(e, kmoaViewer.webzineId)}
                                        >
                                            <Heart size={16} fill={likedSet[kmoaViewer.webzineId] ? "#ef4444" : "none"} color={likedSet[kmoaViewer.webzineId] ? "#ef4444" : "#4b5563"} />
                                            <span>좋아요 ({kmoaViewer.likeCount})</span>
                                        </button>

                                        <button className={styles.actionBtn} onClick={(e) => handleShare(e, kmoaViewer)}>
                                            <Share2 size={16} />
                                            <span>{copied ? "복사완료!" : "공유하기"}</span>
                                        </button>

                                        {kmoaViewer.relatedProductId && (
                                            <Link href={`/shop/${kmoaViewer.relatedProductId}`} className={styles.shopActionBtn}>
                                                <ShoppingBag size={16} />
                                                <span>관련 제품 구매하기</span>
                                            </Link>
                                        )}
                                    </div>

                                    <div className={styles.externalFallbackRow}>
                                        <span>웹진 원본 프레임 보기: </span>
                                        <button 
                                            className={styles.viewModeToggleBtn} 
                                            onClick={() => setViewMode("iframe")}
                                        >
                                            <ExternalLink size={12} /> iframe 창으로 보기
                                        </button>
                                    </div>
                                </article>
                            ) : (
                                <div className={styles.iframeWrapper}>
                                    <div className={styles.iframeTopBar}>
                                        <button className={styles.viewModeToggleBtn} onClick={() => setViewMode("native")}>
                                            ← 대한김치 인앱 뷰어로 돌아가기
                                        </button>
                                        <a href={kmoaViewer.readUrl} target="_blank" rel="noreferrer" className={styles.externalLinkAnchor}>
                                            새 창에서 열기 <ExternalLink size={12} />
                                        </a>
                                    </div>
                                    <iframe
                                        src={kmoaViewer.whitelabelUrl}
                                        className={styles.kmoaViewerFrame}
                                        title={kmoaViewer.title}
                                        sandbox="allow-scripts allow-same-origin allow-popups"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function WebzineServicePage() {
    return (
        <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>웹진 로딩 중...</div>}>
            <WebzineServiceContent />
        </Suspense>
    );
}

