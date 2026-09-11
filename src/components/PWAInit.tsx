"use client";

import { useEffect, useState } from "react";
import styles from "./PWAInit.module.css";
import { Download, X, Share, PlusSquare, Smartphone } from "lucide-react";

export default function PWAInit() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // Service Worker 등록
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("PWA Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.error("PWA Service Worker registration failed:", error);
        });
    }

    if (typeof window === "undefined") return;

    // 이미 PWA 독립 앱 상태로 실행 중인지 검사
    const isInStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    if (isInStandalone) {
      setIsStandalone(true);
      return;
    }

    // iOS 모바일 기기 감지
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    // 숨김 설정 확인 (사용자가 닫기 누른 후 일정 시간)
    const isDismissed = localStorage.getItem("daehan_pwa_banner_dismissed");
    const now = Date.now();
    if (isDismissed && now - parseInt(isDismissed, 10) < 86400000) {
      // 24시간 이내 닫은 경우 배너를 띄우지 않음
      return;
    }

    // Chrome/Android PWA 설치 이벤트 감지
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 모바일 기기이거나 iOS인 경우 PWA 안내 배너 자동 표시
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    if (isMobile && !isInStandalone) {
      // 1초 뒤 자연스럽게 배너 등장
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowBanner(false);
    } else if (isIos) {
      alert("📱 iOS(아이폰) 전용 설치 방법:\n하단 공유(공유 아이콘 [↑]) 버튼을 누른 후 '홈 화면에 추가'를 클릭하세요!");
    } else {
      alert("📱 모바일 브라우저 메뉴(⋮)에서 '앱 설치' 또는 '홈 화면에 추가'를 선택하세요!");
    }
  };

  const handleClose = () => {
    setShowBanner(false);
    localStorage.setItem("daehan_pwa_banner_dismissed", Date.now().toString());
  };

  if (!showBanner || isStandalone) return null;

  return (
    <div className={styles.pwaInstallContainer}>
      <div className={styles.pwaHeader}>
        <div className={styles.pwaBrand}>
          <img src="/images/favicon.png" alt="대한김치 앱" className={styles.pwaIcon} />
          <div className={styles.pwaTitleGroup}>
            <div className={styles.pwaTitle}>
              대한김치 모바일 앱
              <span className={styles.pwaBadge}>PWA</span>
            </div>
            <div className={styles.pwaSub}>공식 전용 앱 원터치 설치</div>
          </div>
        </div>
        <button className={styles.closeBtn} onClick={handleClose} aria-label="닫기">
          <X size={16} />
        </button>
      </div>

      <div className={styles.pwaBody}>
        한 번 터치로 홈 화면에 앱을 추가하세요! <strong>구매 시 10% DP 적립</strong> 혜택과 빠른 간편 주문을 이용하실 수 있습니다.
      </div>

      {isIos ? (
        <div className={styles.iosGuide}>
          <Smartphone size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>iOS (Safari) 설치 가이드:</strong><br />
            사파리 하단 <strong>공유 아이콘(<Share size={12} style={{ display: "inline" }} />)</strong> ➔ <strong>'홈 화면에 추가'(<PlusSquare size={12} style={{ display: "inline" }} />)</strong>를 누르시면 모바일 앱으로 즉시 설치됩니다.
          </div>
        </div>
      ) : (
        <button className={styles.installBtn} onClick={handleInstallClick}>
          <Download size={18} />
          <span>지금 바로 앱 설치하기</span>
        </button>
      )}

      <span className={styles.dismissLink} onClick={handleClose}>
        나중에 설치하기
      </span>
    </div>
  );
}
