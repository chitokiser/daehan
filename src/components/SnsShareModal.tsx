"use client";

import { useState } from "react";
import { X, Copy, Check, Share2, ExternalLink } from "lucide-react";
import styles from "./SnsShareModal.module.css";

interface SnsShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    excerpt?: string;
    shareUrl: string;
    onShareReward?: () => void;
}

export default function SnsShareModal({
    isOpen,
    onClose,
    title,
    excerpt = "대한김치 전용 미식 & 발효 라이브 매거진",
    shareUrl,
    onShareReward
}: SnsShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [showTiktokNotice, setShowTiktokNotice] = useState(false);

    if (!isOpen) return null;

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedExcerpt = encodeURIComponent(excerpt);

    const handleShareClick = (url: string) => {
        if (onShareReward) onShareReward();
        window.open(url, "_blank", "noopener,noreferrer,width=640,height=560");
    };

    const handleCopyLink = async () => {
        if (onShareReward) onShareReward();
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            alert("클립보드 복사 중 오류가 발생했습니다.");
        }
    };

    const handleTiktokShare = async () => {
        if (onShareReward) onShareReward();
        const tiktokCaption = `${title}\n\n${excerpt}\n\n📍 바로가기: ${shareUrl}\n#대한김치 #K푸드 #발효김치 #김치웹진 #하노이맛집`;
        try {
            await navigator.clipboard.writeText(tiktokCaption);
            setShowTiktokNotice(true);
            setTimeout(() => {
                window.open("https://www.tiktok.com/upload", "_blank");
            }, 1200);
        } catch {
            alert("틱톡 캡션 복사에 실패했습니다.");
        }
    };

    const handleNativeShare = async () => {
        if (onShareReward) onShareReward();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: excerpt,
                    url: shareUrl
                });
            } catch (err) {
                console.log("Native share cancelled", err);
            }
        } else {
            handleCopyLink();
        }
    };

    const snsPlatforms = [
        {
            id: "facebook",
            name: "페이스북",
            bgColor: "#1877F2",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
            ),
            onClick: () => handleShareClick(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)
        },
        {
            id: "x",
            name: "X (트위터)",
            bgColor: "#000000",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            ),
            onClick: () => handleShareClick(`https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`)
        },
        {
            id: "threads",
            name: "쓰레드",
            bgColor: "#101010",
            icon: (
                <svg width="20" height="20" viewBox="0 0 192 192" fill="currentColor">
                    <path d="M141.537 88.988a66.667 66.667 0 00-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.232c8.27.054 14.492 2.458 18.494 7.145 2.952 3.404 4.927 8.117 5.91 14.08-7.394-1.258-15.425-1.648-24.03-1.162-24.17 1.393-39.716 15.495-38.716 35.05.506 9.928 5.26 18.486 13.382 24.076 6.85 4.742 15.696 7.069 24.888 6.573 12.13-.652 21.633-5.29 28.248-13.783 5.023-6.47 8.19-14.845 9.568-25.375 5.723 3.457 9.953 8.038 12.348 13.502 4.135 9.461 4.374 25.003-8.546 37.847-11.319 11.24-24.925 16.1-45.488 16.243-22.788-.163-40.048-7.497-51.306-21.82C48.6 138.284 43.072 120.3 42.818 97.9c.254-22.4 5.782-40.384 16.427-53.435 11.258-14.323 28.518-21.657 51.306-21.82 22.967.164 40.56 7.524 52.298 21.88 5.71 7.01 10.03 15.793 12.878 26.07l16.187-4.311c-3.476-12.757-9.145-23.765-16.953-32.762C158.086 17.807 136.12 8.2 109.541 8h-.406C82.678 8.2 60.974 17.83 46.19 36.058 32.87 52.604 26.028 75.86 25.8 97.9l.002.12c-.226 22.04 6.616 45.295 19.938 61.843C60.974 178.17 82.678 187.8 109.135 188h.406c23.353-.162 39.759-6.263 53.3-19.737 18.425-18.324 17.866-41.04 11.803-55.032-4.432-10.13-12.906-18.368-33.107-24.243zM96.035 140.93c-10.587.568-21.553-4.152-22.113-14.32-.412-7.65 5.523-16.17 23.34-17.197 2.042-.118 4.048-.176 6.02-.176 6.67 0 12.92.642 18.543 1.872-2.11 26.234-15.197 29.27-25.79 29.82z"/>
                </svg>
            ),
            onClick: () => handleShareClick(`https://threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`)
        },
        {
            id: "tumblr",
            name: "텀블러",
            bgColor: "#35465C",
            icon: (
                <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633H13.516v7.016c.073 1.145.411 1.819 1.613 1.932.801.073 1.938-.169 2.536-.4v3.188c-.668.234-1.875.527-3.102.517z"/>
                </svg>
            ),
            onClick: () => handleShareClick(`https://www.tumblr.com/share/link?url=${encodedUrl}&name=${encodedTitle}&description=${encodedExcerpt}`)
        },
        {
            id: "kakao",
            name: "카카오톡",
            bgColor: "#FEE500",
            textColor: "#191919",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.748 1.636 5.168 4.113 6.623L5.17 20.5l4.138-2.695A11.3 11.3 0 0012 18c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
                </svg>
            ),
            onClick: handleNativeShare
        },
        {
            id: "tiktok",
            name: "틱톡",
            bgColor: "#010101",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.65a6.34 6.34 0 0010.86 4.46A6.29 6.29 0 0015.82 15V8.04a8.26 8.26 0 004.77 1.47V6.06a4.86 4.86 0 01-1-.37z"/>
                </svg>
            ),
            onClick: handleTiktokShare
        },
        {
            id: "line",
            name: "라인",
            bgColor: "#00B900",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.34 10.15c0-4.07-4.18-7.38-9.34-7.38S.66 6.08.66 10.15c0 3.65 3.32 6.7 7.8 7.25.3.07.72.2.82.46.1.25.06.64.03.9-.05.35-.22 1.37-.24 1.66-.03.49-.15 1.93.85 1.05 1-.88 5.4-3.18 7.37-5.45 1.45-1.57 2.09-3.32 2.09-5.82zm-12.87 2.1H5.06a.45.45 0 01-.45-.45V8.12a.45.45 0 01.45-.45h1.41a.45.45 0 01.45.45v3.68a.45.45 0 01-.45.45zm2.84 0h-1.41a.45.45 0 01-.45-.45V8.12a.45.45 0 01.45-.45h1.41a.45.45 0 01.45.45v3.68a.45.45 0 01-.45.45zm5.5 0h-1.41a.45.45 0 01-.45-.45V8.12a.45.45 0 01.45-.45h1.41a.45.45 0 01.45.45v3.68a.45.45 0 01-.45.45zm2.84 0h-1.41a.45.45 0 01-.45-.45V8.12a.45.45 0 01.45-.45h1.41a.45.45 0 01.45.45v3.68a.45.45 0 01-.45.45z"/>
                </svg>
            ),
            onClick: () => handleShareClick(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`)
        },
        {
            id: "band",
            name: "네이버 밴드",
            bgColor: "#10C838",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 13.5h-7a.5.5 0 01-.5-.5v-6a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v6a.5.5 0 01-.5.5z"/>
                </svg>
            ),
            onClick: () => handleShareClick(`https://band.us/plugin/share?body=${encodedTitle}%0A${encodedUrl}&route=${encodedUrl}`)
        }
    ];

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitleWrap}>
                        <Share2 size={20} className={styles.headerIcon} />
                        <h3>SNS로 퍼가기 (소셜 공유)</h3>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.shareArticlePreview}>
                    <p className={styles.previewTitle}>{title}</p>
                    {excerpt && <p className={styles.previewExcerpt}>{excerpt}</p>}
                </div>

                {showTiktokNotice && (
                    <div className={styles.tiktokNoticeBox}>
                        🎉 틱톡용 웹진 캡션과 URL이 복사되었습니다! 틱톡 업로드 창으로 이동합니다.
                    </div>
                )}

                <div className={styles.snsGrid}>
                    {snsPlatforms.map(sns => (
                        <button
                            key={sns.id}
                            className={styles.snsCardBtn}
                            style={{ background: sns.bgColor, color: sns.textColor || "#FFFFFF" }}
                            onClick={sns.onClick}
                        >
                            <div className={styles.snsIconWrap}>{sns.icon}</div>
                            <span className={styles.snsName}>{sns.name}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.copyUrlSection}>
                    <div className={styles.urlInputBox}>
                        <input type="text" readOnly value={shareUrl} className={styles.urlInput} />
                        <button className={`${styles.copyBtn} ${copied ? styles.copied : ""}`} onClick={handleCopyLink}>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copied ? "복사완료" : "링크 복사"}</span>
                        </button>
                    </div>
                </div>

                {typeof navigator !== "undefined" && "share" in navigator && (
                    <div className={styles.nativeShareWrap}>
                        <button className={styles.nativeShareBtn} onClick={handleNativeShare}>
                            <ExternalLink size={15} /> 기기 기본 공유 메뉴 사용하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
