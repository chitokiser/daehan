"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import styles from "./ShareButtons.module.css";

interface ShareButtonsProps {
    url?: string;
    title?: string;
    description?: string;
    compact?: boolean;
}

export default function ShareButtons({
    url,
    title = "대한김치 - 하노이 정통 발효김치",
    description = "대한민국 30년 전통 비법 대한김치",
    compact = false,
}: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "https://daehankimchi.netlify.app");
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(`${description} | ${shareUrl}`);

    const platforms = [
        {
            id: "facebook",
            label: "Facebook",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
            ),
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "#FFFFFF",
            bg: "#1877F2",
        },
        {
            id: "x",
            label: "X",
            icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            ),
            href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: "#FFFFFF",
            bg: "#000000",
        },
        {
            id: "threads",
            label: "Threads",
            icon: (
                <svg width="17" height="17" viewBox="0 0 192 192" fill="currentColor">
                    <path d="M141.537 88.988a66.667 66.667 0 00-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.232c8.27.054 14.492 2.458 18.494 7.145 2.952 3.404 4.927 8.117 5.91 14.08-7.394-1.258-15.425-1.648-24.03-1.162-24.17 1.393-39.716 15.495-38.716 35.05.506 9.928 5.26 18.486 13.382 24.076 6.85 4.742 15.696 7.069 24.888 6.573 12.13-.652 21.633-5.29 28.248-13.783 5.023-6.47 8.19-14.845 9.568-25.375 5.723 3.457 9.953 8.038 12.348 13.502 4.135 9.461 4.374 25.003-8.546 37.847-11.319 11.24-24.925 16.1-45.488 16.243-22.788-.163-40.048-7.497-51.306-21.82C48.6 138.284 43.072 120.3 42.818 97.9c.254-22.4 5.782-40.384 16.427-53.435 11.258-14.323 28.518-21.657 51.306-21.82 22.967.164 40.56 7.524 52.298 21.88 5.71 7.01 10.03 15.793 12.878 26.07l16.187-4.311c-3.476-12.757-9.145-23.765-16.953-32.762C158.086 17.807 136.12 8.2 109.541 8h-.406C82.678 8.2 60.974 17.83 46.19 36.058 32.87 52.604 26.028 75.86 25.8 97.9l.002.12c-.226 22.04 6.616 45.295 19.938 61.843C60.974 178.17 82.678 187.8 109.135 188h.406c23.353-.162 39.759-6.263 53.3-19.737 18.425-18.324 17.866-41.04 11.803-55.032-4.432-10.13-12.906-18.368-33.107-24.243zM96.035 140.93c-10.587.568-21.553-4.152-22.113-14.32-.412-7.65 5.523-16.17 23.34-17.197 2.042-.118 4.048-.176 6.02-.176 6.67 0 12.92.642 18.543 1.872-2.11 26.234-15.197 29.27-25.79 29.82z"/>
                </svg>
            ),
            href: `https://threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
            color: "#FFFFFF",
            bg: "#101010",
            borderColor: "#333",
        },
        {
            id: "tumblr",
            label: "Tumblr",
            icon: (
                <svg width="15" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633H13.516v7.016c.073 1.145.411 1.819 1.613 1.932.801.073 1.938-.169 2.536-.4v3.188c-.668.234-1.875.527-3.102.517z"/>
                </svg>
            ),
            href: `https://www.tumblr.com/share/link?url=${encodedUrl}&name=${encodedTitle}&description=${encodedDesc}`,
            color: "#FFFFFF",
            bg: "#35465C",
        },
    ];

    const handleKakaoShare = () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            navigator.share({ title, url: shareUrl }).catch(() => {});
        } else {
            handleCopy();
        }
    };

    const handleCopy = () => {
        if (typeof navigator !== "undefined") {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            });
        }
    };

    const handleShare = (href: string) => {
        window.open(href, "_blank", "noopener,noreferrer,width=640,height=520");
    };

    return (
        <div className={`${styles.shareWrap} ${compact ? styles.compact : ""}`}>
            <div className={styles.shareLabel}>
                <Share2 size={13} />
                <span>공유하기</span>
            </div>
            <div className={styles.shareButtons}>
                {platforms.map((p) => (
                    <button
                        key={p.id}
                        className={styles.shareBtn}
                        style={{ background: p.bg, color: p.color, borderColor: (p as any).borderColor || "transparent" }}
                        onClick={() => handleShare(p.href!)}
                        title={p.label}
                        aria-label={`${p.label}로 공유`}
                    >
                        {p.icon}
                        {!compact && <span>{p.label}</span>}
                    </button>
                ))}

                {/* 카카오톡 */}
                <button
                    className={styles.shareBtn}
                    style={{ background: "#FEE500", color: "#3A1D1D" }}
                    onClick={handleKakaoShare}
                    title="카카오톡"
                    aria-label="카카오톡으로 공유"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.748 1.636 5.168 4.113 6.623L5.17 20.5l4.138-2.695A11.3 11.3 0 0012 18c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
                    </svg>
                    {!compact && <span>카카오톡</span>}
                </button>

                {/* 링크 복사 */}
                <button
                    className={`${styles.shareBtn} ${copied ? styles.copied : ""}`}
                    onClick={handleCopy}
                    title="링크 복사"
                    aria-label="링크 복사"
                    style={{ background: copied ? "#E8F5E9" : "#EFEFEF", color: copied ? "#2E7D32" : "#555" }}
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {!compact && <span>{copied ? "복사됨!" : "링크 복사"}</span>}
                </button>
            </div>
        </div>
    );
}
