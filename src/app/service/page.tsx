"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Sparkles, Search, SlidersHorizontal, Heart, Bookmark, Eye, X, RefreshCw, Send, BookOpen, Thermometer, FlaskConical, Award } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";

interface ArticleImageItem {
    id: string;
    tag: string;
    category: "FERMENTATION" | "KIMCHI_DNA" | "RECIPE" | "SMART_FARM" | "AI_STUDIO";
    title: string;
    subtitle: string;
    excerpt: string;
    date: string;
    image: string;
    prompt: string;
    likes: number;
    readTime: string;
    author: string;
    stats: {
        ph: string;
        temp: string;
        probiotics: string;
        fermentationDays: number;
    };
    pairingTip: string;
    recipe: string;
}

interface CategoryOption {
    key: string;
    label: string;
}

const PRESET_PROMPTS = [
    { label: "🔥 옹기 저온 발효", prompt: "korean traditional onggi clay pot with fermenting kimchi, cold mist, probiotic bubbles" },
    { label: "🍜 쌀국수 X 열무김치", prompt: "hanoi traditional pho noodle soup served with crisp fresh yeolmu kimchi gourmet" },
    { label: "🥬 고랭지 스마트팜", prompt: "highland fresh napa cabbage organic smart farm sunny morning mist da lat" },
    { label: "🍲 3년 묵은지 수육", prompt: "three year aged kimchi braised with tender pork belly steaming in hot stone pot" },
    { label: "✨ 황금 갓김치 프리미엄", prompt: "premium gourmet gat kimchi with vibrant spices plated on royal luxury porcelain" }
];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=1000&q=80";

export default function WebzineServicePage() {
    const [articles, setArticles] = useState<ArticleImageItem[]>([]);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [activeCategory, setActiveCategory] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [loading, setLoading] = useState(true);
    const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});

    // AI Image Generator input
    const [customPrompt, setCustomPrompt] = useState("");
    const [customTitle, setCustomTitle] = useState("");
    const [generating, setGenerating] = useState(false);
    const [genMessage, setGenMessage] = useState("");

    // Modal state
    const [selectedArticle, setSelectedArticle] = useState<ArticleImageItem | null>(null);

    // Fetch articles from /api/images
    const fetchArticles = async (category = activeCategory, query = searchQuery, sort = sortBy) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category !== "ALL") params.append("category", category);
            if (query) params.append("query", query);
            if (sort) params.append("sort", sort);

            const res = await fetch(`/api/images?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setArticles(data.articles);
                if (data.categories && categories.length === 0) {
                    setCategories(data.categories);
                }
            }
        } catch (err) {
            console.error("Failed to fetch articles:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(activeCategory, searchQuery, sortBy);
    }, [activeCategory, sortBy]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchArticles(activeCategory, searchQuery, sortBy);
    };

    // AI Image Generation via Image API POST
    const handleGenerateImage = async (e?: React.FormEvent, presetPrompt?: string) => {
        if (e) e.preventDefault();
        const promptToUse = presetPrompt || customPrompt;
        if (!promptToUse.trim()) return;

        setGenerating(true);
        setGenMessage("AI 이미지 생성 엔진(대한김치 AI Studio API)으로 새로운 비주얼을 합성하는 중입니다...");

        try {
            const res = await fetch("/api/images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: promptToUse,
                    title: customTitle.trim() || undefined,
                    category: "AI_STUDIO",
                    author: "AI 게스트 큐레이터"
                })
            });

            const data = await res.json();
            if (data.success && data.article) {
                setArticles(prev => [data.article, ...prev]);
                setCustomPrompt("");
                setCustomTitle("");
                setGenMessage("✨ 새로운 발효 비주얼 아티클이 생성되어 갤러리에 추가되었습니다!");
                setTimeout(() => setGenMessage(""), 4000);
            } else {
                setGenMessage(`오류: ${data.error || "생성 실패"}`);
            }
        } catch (err) {
            console.error("AI image gen error:", err);
            setGenMessage("네트워크 오류로 이미지 생성에 실패했습니다.");
        } finally {
            setGenerating(false);
        }
    };

    const toggleLike = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setLikedArticles(prev => {
            const isLiked = !prev[id];
            setArticles(curr => curr.map(item => item.id === id ? { ...item, likes: item.likes + (isLiked ? 1 : -1) } : item));
            return { ...prev, [id]: isLiked };
        });
    };

    return (
        <div className={styles.webzineContainer}>
            {/* Header Hero */}
            <header className={styles.header}>
                <div className={styles.badgeWrapper}>
                    <span className={styles.heroBadge}>
                        <Sparkles size={14} className={styles.sparkleIcon} /> 대한김치 FERMENTATION IMAGE & WEBZINE API
                    </span>
                </div>
                <h1 className={`${styles.title} text-gradient`}>FERMENTATION WEBZINE</h1>
                <p className={styles.description}>
                    매일 업데이트되는 발효식품의 지혜와 미식 인사이트.<br />
                    실시간 <strong>이미지 API 엔진</strong>과 AI 비주얼라이저를 통해 다채로운 김치 컬처를 탐구하세요.
                </p>

                {/* Live Stats Bar */}
                <div className={styles.statsBar}>
                    <div className={styles.statItem}>
                        <FlaskConical size={18} className={styles.statIcon} />
                        <div>
                            <span className={styles.statVal}>6+</span>
                            <span className={styles.statLbl}>발효 과학 연구</span>
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <Thermometer size={18} className={styles.statIcon} />
                        <div>
                            <span className={styles.statVal}>1.8°C</span>
                            <span className={styles.statLbl}>최적 저온 숙성</span>
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <Award size={18} className={styles.statIcon} />
                        <div>
                            <span className={styles.statVal}>100%</span>
                            <span className={styles.statLbl}>HACCP 인증</span>
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <Sparkles size={18} className={styles.statIcon} />
                        <div>
                            <span className={styles.statVal}>API Live</span>
                            <span className={styles.statLbl}>AI 비주얼 엔진</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* AI Image Studio Section */}
            <section className={styles.aiStudioSection}>
                <div className={styles.studioCard}>
                    <div className={styles.studioHeader}>
                        <div className={styles.studioTitleWrap}>
                            <Sparkles size={20} color="var(--secondary-color)" />
                            <h2 className={styles.studioTitle}>AI 발효 이미지 API 스튜디오</h2>
                        </div>
                        <span className={styles.studioSubtitle}>원하는 김치·발효 요리 아이디어를 입력하면 AI 이미지 API가 즉석에서 고화질 아티클을 생성합니다.</span>
                    </div>

                    <form className={styles.studioForm} onSubmit={handleGenerateImage}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                className={styles.promptInput}
                                placeholder="예: 하노이 분짜와 함께 즐기는 톡 쏘는 갓김치 테이블링, 옹기 단지 발효 미스트..."
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                disabled={generating}
                            />
                            <button
                                type="submit"
                                className={`btn-primary ${styles.generateBtn}`}
                                disabled={generating || !customPrompt.trim()}
                            >
                                {generating ? (
                                    <>
                                        <RefreshCw size={16} className={styles.spin} /> 생성 중...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} /> AI 이미지 생성
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Presets */}
                    <div className={styles.presetChips}>
                        <span className={styles.presetLabel}>추천 프리셋:</span>
                        {PRESET_PROMPTS.map((p, idx) => (
                            <button
                                key={idx}
                                className={styles.chipBtn}
                                onClick={() => handleGenerateImage(undefined, p.prompt)}
                                disabled={generating}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {genMessage && (
                        <div className={`${styles.statusMessage} ${generating ? styles.info : styles.success}`}>
                            {genMessage}
                        </div>
                    )}
                </div>
            </section>

            {/* Search & Filter Toolbar */}
            <div className={styles.toolbar}>
                {/* Category Pills */}
                <div className={styles.categoryPills}>
                    <button
                        className={`${styles.pillBtn} ${activeCategory === "ALL" ? styles.activePill : ""}`}
                        onClick={() => setActiveCategory("ALL")}
                    >
                        전체 보기
                    </button>
                    <button
                        className={`${styles.pillBtn} ${activeCategory === "FERMENTATION" ? styles.activePill : ""}`}
                        onClick={() => setActiveCategory("FERMENTATION")}
                    >
                        🔬 발효과학
                    </button>
                    <button
                        className={`${styles.pillBtn} ${activeCategory === "KIMCHI_DNA" ? styles.activePill : ""}`}
                        onClick={() => setActiveCategory("KIMCHI_DNA")}
                    >
                        🧬 김치 DNA
                    </button>
                    <button
                        className={`${styles.pillBtn} ${activeCategory === "RECIPE" ? styles.activePill : ""}`}
                        onClick={() => setActiveCategory("RECIPE")}
                    >
                        🍳 페어링 & 레시피
                    </button>
                    <button
                        className={`${styles.pillBtn} ${activeCategory === "SMART_FARM" ? styles.activePill : ""}`}
                        onClick={() => setActiveCategory("SMART_FARM")}
                    >
                        🌱 스마트팜 & HACCP
                    </button>
                    <button
                        className={`${styles.pillBtn} ${activeCategory === "AI_STUDIO" ? styles.activePill : ""}`}
                        onClick={() => setActiveCategory("AI_STUDIO")}
                    >
                        ✨ AI 비주얼 랩
                    </button>
                </div>

                {/* Search Bar & Sort */}
                <div className={styles.searchSortGroup}>
                    <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="키워드 검색 (배추, 유산균, 하노이...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <div className={styles.sortSelectWrapper}>
                        <SlidersHorizontal size={14} className={styles.sortIcon} />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={styles.sortSelect}
                        >
                            <option value="latest">최신순</option>
                            <option value="popular">인기순</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Article Grid */}
            {loading ? (
                <div className={styles.loadingGrid}>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <div key={n} className={styles.skeletonCard}>
                            <div className={styles.skeletonImg}></div>
                            <div className={styles.skeletonText}></div>
                            <div className={styles.skeletonTextShort}></div>
                        </div>
                    ))}
                </div>
            ) : articles.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>검색 조건에 맞는 발효 아티클이 없습니다.</p>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setActiveCategory("ALL");
                            setSearchQuery("");
                            fetchArticles("ALL", "", "latest");
                        }}
                    >
                        전체 목록 초기화
                    </button>
                </div>
            ) : (
                <div className={styles.articleGrid}>
                    {articles.map((article) => (
                        <article
                            key={article.id}
                            className={styles.articleCard}
                            onClick={() => setSelectedArticle(article)}
                        >
                            <div className={styles.imageWrapper}>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className={styles.articleImage}
                                    onError={(e) => {
                                        // Safe fallback in case of remote network failure
                                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                    }}
                                    loading="lazy"
                                />
                                <div className={styles.imageBadgeGroup}>
                                    <span className={styles.tagBadge}>{article.tag}</span>
                                    {article.category === "AI_STUDIO" && (
                                        <span className={styles.aiBadge}>AI GENERATED</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.articleContent}>
                                <div className={styles.metaTop}>
                                    <span className={styles.author}>{article.author}</span>
                                    <span className={styles.dot}>•</span>
                                    <span className={styles.readTime}>{article.readTime}</span>
                                </div>

                                <h2 className={styles.articleTitle}>{article.title}</h2>
                                <p className={styles.articleExcerpt}>{article.excerpt}</p>

                                {/* Micro stats pill */}
                                <div className={styles.cardStats}>
                                    <span className={styles.statChip}>pH {article.stats.ph}</span>
                                    <span className={styles.statChip}>저온 {article.stats.temp}</span>
                                    <span className={styles.statChip}>발효 {article.stats.fermentationDays}일</span>
                                </div>

                                <div className={styles.articleFooter}>
                                    <span className={styles.date}>{article.date}</span>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={`${styles.iconBtn} ${likedArticles[article.id] ? styles.liked : ""}`}
                                            onClick={(e) => toggleLike(article.id, e)}
                                            title="좋아요"
                                        >
                                            <Heart size={16} fill={likedArticles[article.id] ? "#e31837" : "transparent"} color={likedArticles[article.id] ? "#e31837" : "currentColor"} />
                                            <span>{article.likes}</span>
                                        </button>
                                        <button className={styles.readMoreBtn}>
                                            <Eye size={16} /> 상세 보기
                                        </button>
                                    </div>
                                </div>
                                {/* 소셜 공유 버튼 (카드) */}
                                <div onClick={(e) => e.stopPropagation()}>
                                    <ShareButtons
                                        title={`${article.title} | 대한김치 발효 웹진`}
                                        description={article.excerpt}
                                        compact={true}
                                    />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Article Detail Modal / Lightbox */}
            {selectedArticle && (
                <div className={styles.modalOverlay} onClick={() => setSelectedArticle(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedArticle(null)}>
                            <X size={24} />
                        </button>

                        <div className={styles.modalImageWrapper}>
                            <img
                                src={selectedArticle.image}
                                alt={selectedArticle.title}
                                className={styles.modalImage}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                }}
                            />
                            <div className={styles.modalImageOverlay}>
                                <span className={styles.tagBadge}>{selectedArticle.tag}</span>
                                <span className={styles.modalReadTime}>{selectedArticle.readTime} 분량</span>
                            </div>
                        </div>

                        <div className={styles.modalBody}>
                            <h2 className={styles.modalTitle}>{selectedArticle.title}</h2>
                            <p className={styles.modalSubtitle}>{selectedArticle.subtitle}</p>

                            {/* Fermentation Metrics Box */}
                            <div className={styles.metricsBox}>
                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>산도 (pH)</span>
                                    <span className={styles.metricValue}>{selectedArticle.stats.ph}</span>
                                </div>
                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>보관 온도</span>
                                    <span className={styles.metricValue}>{selectedArticle.stats.temp}</span>
                                </div>
                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>유산균 지수</span>
                                    <span className={styles.metricValue}>{selectedArticle.stats.probiotics}</span>
                                </div>
                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>숙성 일수</span>
                                    <span className={styles.metricValue}>{selectedArticle.stats.fermentationDays}일</span>
                                </div>
                            </div>

                            <div className={styles.modalSection}>
                                <h3 className={styles.sectionHeading}>
                                    <BookOpen size={18} /> 본문 인사이트
                                </h3>
                                <p className={styles.modalParagraph}>{selectedArticle.excerpt}</p>
                            </div>

                            <div className={styles.modalSection}>
                                <h3 className={styles.sectionHeading}>
                                    🍽️ 마스터 셰프 페어링 & 레시피 가이드
                                </h3>
                                <div className={styles.recipeCard}>
                                    <p><strong>페어링 팁:</strong> {selectedArticle.pairingTip}</p>
                                    <p style={{ marginTop: 8 }}><strong>조리 및 서빙 비결:</strong> {selectedArticle.recipe}</p>
                                </div>
                            </div>

                            {/* Image Prompt metadata */}
                            <div className={styles.promptMetadata}>
                                <h4>이미지 API 비전 프롬프트 메타데이터</h4>
                                <code>{selectedArticle.prompt}</code>
                            </div>

                            <div className={styles.modalFooter}>
                                <div className={styles.modalAuthorInfo}>
                                    <span>작성: {selectedArticle.author}</span>
                                    <span>발행일: {selectedArticle.date}</span>
                                </div>
                                <div className={styles.modalActionGroup}>
                                    <button
                                        className={`btn-primary ${styles.modalLikeBtn}`}
                                        onClick={(e) => toggleLike(selectedArticle.id, e)}
                                    >
                                        <Heart size={16} fill={likedArticles[selectedArticle.id] ? "#fff" : "transparent"} />
                                        좋아요 ({selectedArticle.likes})
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
