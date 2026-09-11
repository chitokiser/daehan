"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { ThumbsUp, Share2, ExternalLink, Eye, X, ShoppingBag, Heart, Check, Plus, Edit3, Trash2, ShieldAlert } from "lucide-react";
import { useUserWallet } from "@/context/UserWalletContext";
import Link from "next/link";
import SnsShareModal from "@/components/SnsShareModal";

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
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "OPERATOR";

    const [kmoaWebzines, setKmoaWebzines] = useState<KmoaWebzine[]>([]);
    const [kmoaLoading, setKmoaLoading] = useState(true);
    const [kmoaDemo, setKmoaDemo] = useState(false);
    const [kmoaViewer, setKmoaViewer] = useState<KmoaWebzine | null>(null);
    const [viewMode, setViewMode] = useState<"native" | "iframe">("native");
    const [likedSet, setLikedSet] = useState<Record<string, boolean>>({});

    // SNS 공유 모달 상태
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareTarget, setShareTarget] = useState<KmoaWebzine | null>(null);

    // 관리자 작성/수정 모달 상태
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<KmoaWebzine | null>(null);
    const [editForm, setEditForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        thumbnailUrl: "/images/products/pogi.jpg",
        relatedProductId: "pogi-kimchi-5kg"
    });

    const fetchWebzines = () => {
        setKmoaLoading(true);
        fetch("/api/v1/kmoa/webzines?limit=24")
            .then(r => r.json())
            .then(data => {
                if (data.success && data.webzines) {
                    setKmoaWebzines(data.webzines);
                    setKmoaDemo(!!data.demo);

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
    };

    useEffect(() => {
        fetchWebzines();
    }, [articleIdFromUrl]);

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

    // SNS 공유 모달 열기
    const handleOpenSnsShare = (e: React.MouseEvent, wz: KmoaWebzine) => {
        e.stopPropagation();
        setShareTarget(wz);
        setShareModalOpen(true);
    };

    // ── 관리자 CRUD 기능 ──
    const handleOpenCreateModal = () => {
        setEditingItem(null);
        setEditForm({
            title: "",
            excerpt: "",
            content: "",
            thumbnailUrl: "/images/products/pogi.jpg",
            relatedProductId: "pogi-kimchi-5kg"
        });
        setEditModalOpen(true);
    };

    const handleOpenEditModal = (e: React.MouseEvent, wz: KmoaWebzine) => {
        e.stopPropagation();
        setEditingItem(wz);
        setEditForm({
            title: wz.title,
            excerpt: wz.excerpt,
            content: wz.content || wz.excerpt,
            thumbnailUrl: wz.thumbnailUrl || "/images/products/pogi.jpg",
            relatedProductId: wz.relatedProductId || "pogi-kimchi-5kg"
        });
        setEditModalOpen(true);
    };

    const handleDeleteWebzine = async (e: React.MouseEvent, webzineId: string, title: string) => {
        e.stopPropagation();
        if (!confirm(`정말로 웹진 '${title}'을(를) 삭제하시겠습니까?`)) return;

        try {
            const res = await fetch(`/api/v1/kmoa/webzines?webzineId=${webzineId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                alert("웹진이 정상적으로 삭제되었습니다.");
                if (kmoaViewer && kmoaViewer.webzineId === webzineId) {
                    setKmoaViewer(null);
                }
                fetchWebzines();
            } else {
                alert(`삭제 실패: ${data.error}`);
            }
        } catch (err: any) {
            alert(`삭제 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    const handleSaveWebzineForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm.title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        try {
            const res = await fetch("/api/v1/kmoa/webzines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: editingItem ? "update" : "create",
                    webzineId: editingItem?.webzineId,
                    title: editForm.title,
                    excerpt: editForm.excerpt,
                    content: editForm.content,
                    thumbnailUrl: editForm.thumbnailUrl,
                    relatedProductId: editForm.relatedProductId
                })
            });

            const data = await res.json();
            if (data.success) {
                alert(data.message || "성공적으로 저장되었습니다.");
                setEditModalOpen(false);
                fetchWebzines();
            } else {
                alert(`저장 실패: ${data.error}`);
            }
        } catch (err: any) {
            alert(`저장 중 오류 발생: ${err.message}`);
        }
    };

    // 마크다운 텍스트 포맷터
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
                    <div className={styles.sectionSubRow}>
                        <p className={styles.kmoaSectionDesc}>대한김치 실제 제품 및 무균 생산 공정 현장을 바탕으로 매일 1개씩 자동 생성 및 발행되는 브랜드 전용 라이브 매거진입니다.</p>

                        {/* 관리자 전용 작성 버튼 */}
                        {isAdmin && (
                            <button className={styles.adminCreateBtn} onClick={handleOpenCreateModal}>
                                <Plus size={16} /> 신규 웹진 작성
                            </button>
                        )}
                    </div>
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
                                            onClick={(e) => handleOpenSnsShare(e, wz)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Share2 size={11} /> SNS 퍼가기
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
                                        
                                        <div className={styles.cardBtnGroup}>
                                            {/* 관리자 수정/삭제 버튼 */}
                                            {isAdmin && (
                                                <>
                                                    <button 
                                                        className={styles.adminEditBtn} 
                                                        onClick={(e) => handleOpenEditModal(e, wz)}
                                                        title="웹진 수정"
                                                    >
                                                        <Edit3 size={13} />
                                                    </button>
                                                    <button 
                                                        className={styles.adminDeleteBtn} 
                                                        onClick={(e) => handleDeleteWebzine(e, wz.webzineId, wz.title)}
                                                        title="웹진 삭제"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </>
                                            )}
                                            <button className={styles.kmoaReadBtn}>
                                                <Eye size={13} /> 상세 보기
                                            </button>
                                        </div>
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
                            <div className={styles.modalHeaderRight}>
                                {isAdmin && (
                                    <div className={styles.adminModalActions}>
                                        <button className={styles.adminEditBtn} onClick={(e) => handleOpenEditModal(e, kmoaViewer)}>
                                            <Edit3 size={14} /> 수정
                                        </button>
                                        <button className={styles.adminDeleteBtn} onClick={(e) => handleDeleteWebzine(e, kmoaViewer.webzineId, kmoaViewer.title)}>
                                            <Trash2 size={14} /> 삭제
                                        </button>
                                    </div>
                                )}
                                <button className={styles.kmoaViewerClose} onClick={() => setKmoaViewer(null)}>
                                    <X size={20} />
                                </button>
                            </div>
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

                                        <button className={styles.actionBtn} onClick={(e) => handleOpenSnsShare(e, kmoaViewer)}>
                                            <Share2 size={16} />
                                            <span>SNS 퍼가기</span>
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

            {/* 멀티 SNS 퍼가기 모달 */}
            {shareTarget && (
                <SnsShareModal
                    isOpen={shareModalOpen}
                    onClose={() => setShareModalOpen(false)}
                    title={shareTarget.title}
                    excerpt={shareTarget.excerpt}
                    shareUrl={typeof window !== "undefined" ? `${window.location.origin}/service?article=${shareTarget.webzineId}` : ""}
                    onShareReward={() => {
                        if (user?.uid) {
                            fetch("/api/v1/rewards", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    uid: user.uid,
                                    actionType: "SHARE_PRODUCT"
                                })
                            }).then(r => r.json()).then(res => {
                                if (res.success) refreshWallet();
                            }).catch(console.error);
                        }
                    }}
                />
            )}

            {/* 관리자 웹진 작성 / 수정 Form 모달 */}
            {editModalOpen && (
                <div className={styles.kmoaViewerOverlay} onClick={() => setEditModalOpen(false)}>
                    <div className={styles.adminFormModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.adminFormHeader}>
                            <h3>{editingItem ? "✏️ 웹진 아티클 수정" : "➕ 신규 웹진 작성"}</h3>
                            <button className={styles.closeBtn} onClick={() => setEditModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveWebzineForm} className={styles.adminForm}>
                            <div className={styles.formGroup}>
                                <label>아티클 제목 *</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="예: 100% 엄선된 한국산 원료로 담근 대한김치 시그니처" 
                                    value={editForm.title} 
                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>한 줄 요약 (Excerpt)</label>
                                <input 
                                    type="text" 
                                    placeholder="카드 목록 및 공유 팝업에 표시될 요약문" 
                                    value={editForm.excerpt} 
                                    onChange={e => setEditForm({ ...editForm, excerpt: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>썸네일 이미지 URL</label>
                                <input 
                                    type="text" 
                                    placeholder="/images/products/pogi.jpg 또는 웹 이미지 주소" 
                                    value={editForm.thumbnailUrl} 
                                    onChange={e => setEditForm({ ...editForm, thumbnailUrl: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>관련 상품 ID (스토어 바로가기 연동)</label>
                                <select 
                                    value={editForm.relatedProductId}
                                    onChange={e => setEditForm({ ...editForm, relatedProductId: e.target.value })}
                                >
                                    <option value="pogi-kimchi-5kg">포기김치 5kg (pogi-kimchi-5kg)</option>
                                    <option value="kkakdugi-3kg">깍두기 3kg (kkakdugi-3kg)</option>
                                    <option value="chonggak-kimchi-3kg">총각김치 3kg (chonggak-kimchi-3kg)</option>
                                    <option value="gat-kimchi-2kg">갓김치 2kg (gat-kimchi-2kg)</option>
                                    <option value="mookeunji-3kg">묵은지 3kg (mookeunji-3kg)</option>
                                    <option value="pa-kimchi-2kg">파김치 2kg (pa-kimchi-2kg)</option>
                                    <option value="oisobagi-2kg">오이소박이 2kg (oisobagi-2kg)</option>
                                    <option value="silbi-kimchi-2kg">실비김치 2kg (silbi-kimchi-2kg)</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>상세 본문 내용 (마크다운 지원)</label>
                                <textarea 
                                    rows={8}
                                    placeholder="### 소제목&#10;&#10;본문 내용 작성...&#10;- 포인트 1&#10;- 포인트 2"
                                    value={editForm.content}
                                    onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                                />
                            </div>

                            <div className={styles.formSubmitRow}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setEditModalOpen(false)}>
                                    취소
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    {editingItem ? "수정사항 저장" : "신규 발행하기"}
                                </button>
                            </div>
                        </form>
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


