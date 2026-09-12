"use client";

import { useEffect, useState } from "react";
import styles from "./PWAInit.module.css";
import { Download, X, Share, PlusSquare, Smartphone } from "lucide-react";

export default function PWAInit() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

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

    // 1. 이미 PWA 독립 앱 상태(standalone)로 실행 중인지 검사
    const isInStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    // 2. 이전에 설치 완료된 장치인지 localStorage 검사
    const alreadyInstalled = localStorage.getItem("daehan_pwa_installed") === "true";

    // 스탠드얼론 모드로 실행된 경우 바로 설치 완료 플래그 저장 및 배너 차단
    if (isInStandalone) {
      localStorage.setItem("daehan_pwa_installed", "true");
      setIsStandalone(true);
      setIsInstalled(true);
      return;
    }

    // 이미 설치된 기록이 있는 장치는 배너/모달을 절대 띄우지 않음
    if (alreadyInstalled) {
      setIsInstalled(true);
      return;
    }

    // 3. 브라우저 지원 시 navigator.getInstalledRelatedApps() 로 이미 설치되어 있는지 추가 확인
    if ("getInstalledRelatedApps" in navigator) {
      (navigator as any)
        .getInstalledRelatedApps()
        .then((relatedApps: any[]) => {
          if (relatedApps && relatedApps.length > 0) {
            localStorage.setItem("daehan_pwa_installed", "true");
            setIsInstalled(true);
            setShowBanner(false);
          }
        })
        .catch(() => {});
    }

    // 4. 어플 설치 완료 이벤트 감지 (설치 성공 시 localStorage 기록 및 배너/모달 차단)
    const handleAppInstalled = () => {
      localStorage.setItem("daehan_pwa_installed", "true");
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // iOS 모바일 기기 감지
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(iosDevice);

    // 닫기 누른 후 24시간 이내에는 배너를 띄우지 않음
    const isDismissed = localStorage.getItem("daehan_pwa_banner_dismissed");
    const now = Date.now();
    if (isDismissed && now - parseInt(isDismissed, 10) < 86400000) {
      return () => {
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }

    // Chrome/Android PWA 설치 가능 프롬프트 감지
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // 설치가 완료된 장치인 경우 절대 프롬프트 배너를 띄우지 않음
      if (localStorage.getItem("daehan_pwa_installed") === "true") return;

      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 모바일 기기 안내 배너 표시 (설치 완료된 기록이 없을 때만)
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    let timer: NodeJS.Timeout | null = null;
    if (isMobile && !isInStandalone && !alreadyInstalled) {
      timer = setTimeout(() => {
        if (localStorage.getItem("daehan_pwa_installed") !== "true") {
          setShowBanner(true);
        }
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      if (outcome === "accepted") {
        // 설치 성공 시 localStorage에 설치 상태 저장하여 모달 차단
        localStorage.setItem("daehan_pwa_installed", "true");
        setIsInstalled(true);
      }
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

  // 이미 설치되었거나, 스탠드얼론 상태이거나, 설치 완료된 장치에는 절대 모달을 띄우지 않음
  if (!showBanner || isStandalone || isInstalled) return null;

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

