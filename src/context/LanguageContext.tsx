"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ko" | "vi";

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    toggleLang: () => void;
    t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    ko: {
        // Navigation & General
        "nav.home": "홈",
        "nav.about": "브랜드 소개",
        "nav.service": "서비스(웹진)",
        "nav.shop": "쇼핑몰",
        "nav.subscribe": "정기구독",
        "nav.dna": "DNA 맞춤 김치",
        "nav.mypage": "마이페이지",
        "nav.admin": "관리자 센터",
        "nav.login": "로그인",
        "nav.logout": "로그아웃",

        // Language Names
        "lang.ko": "한국어",
        "lang.vi": "Tiếng Việt",

        // Header & Wallet
        "header.chargedMoney": "충전머니",
        "header.points": "적립 포인트",
        "header.vndBalance": "VND 잔액",
        "header.dpPoints": "대한포인트(DP)",
        "header.ordersAndPoints": "주문 내역 & 포인트",
        "header.switchAccount": "다른 계정 로그인",

        // Hero & Main Banner
        "hero.badge": "하노이 직배송 • 100% 한국 정통 발효 비법",
        "hero.title1": "대한민국 정통 비법 그대로",
        "hero.title2": "하노이에서 즐기는 프리미엄 대한김치",
        "hero.sub": "엄선된 고랭지 배추와 100% 천연 재료, HACCP 위생 인증 시설에서 정성껏 담근 한국 정통 김치.",
        "hero.btnShop": "신선 김치 주문하기",
        "hero.btnAbout": "브랜드 스토리",

        // Home Features
        "feat.haccp.title": "HACCP CODEX 위생 인증",
        "feat.haccp.desc": "하노이 최신 위생 공장에서 철저한 품질 관리로 담급니다.",
        "feat.fresh.title": "당일 생산 • 직배송",
        "feat.fresh.desc": "아삭하고 시원한 김치 맛을 신선하게 전달합니다.",
        "feat.secret.title": "100% 정통 한국 레시피",
        "feat.secret.desc": "한국인 입맛과 현지 입맛 모두를 사로잡은 감칠맛 비법.",

        // Best Products Section
        "best.tag": "PREMIUM SELECTION",
        "best.title": "대한김치 인기 시그니처 메뉴",
        "best.sub": "가장 많은 사랑을 받는 베스트셀러 김치를 만나보세요.",
        "best.viewAll": "전체 สินค้า 보러가기 →",
        "best.buyNow": "바로 구매",
        "best.details": "상세보기",

        // DNA Test Banner
        "dna.bannerTitle": "🔬 AI DNA 맞춤 김치 추천",
        "dna.bannerSub": "나만의 식습관과 유전자 유형에 딱 맞는 김치를 추천받아 보세요!",
        "dna.bannerBtn": "맞춤 테스트 시작하기",

        // K-MOA Guide Banner
        "kmoa.title": "💳 K-MOA가맹점 충전 결제혜택",
        "kmoa.desc": "K-MOA 충전머니로 결제 시 추가 DP 적립 및 가맹점 단일 할인 혜택을 누리세요.",

        // Shop Page
        "shop.title": "대한김치 정품 쇼핑몰",
        "shop.sub": "하노이 현지 생산 신선 직배송! 정통 한국 맛을 가정에서 즐기세요.",
        "shop.searchPlaceholder": "김치 이름 또는 카테고리 검색...",
        "shop.all": "전체보기",
        "shop.cabbage": "배추김치",
        "shop.radish": "무김치",
        "shop.special": "별미김치",
        "shop.side": "반찬/양념",
        "shop.unitPrice": "VND",
        "shop.inStock": "재고 있음",
        "shop.outOfStock": "일시 품절",
        "shop.addToCart": "장바구니",
        "shop.orderNow": "즉시 구매",
        "shop.detailView": "상세정보",

        // Product Detail
        "detail.weight": "중량",
        "detail.category": "카테고리",
        "detail.price": "판매가",
        "detail.quantity": "수량",
        "detail.totalPrice": "총 결제금액",
        "detail.features": "제품 특징",
        "detail.payWithMoney": "충전머니로 간편 결제",
        "detail.payWithCash": "계좌입금 / 일반 결제",

        // Footer
        "footer.desc": "정성 어린 정통 손맛과 꼼꼼한 위생 관리. 하노이 중심에서 전하는 완벽한 발효과학의 비밀.",
        "footer.company": "인피니스㈜ 대한김치 • HACCP CODEX 2020 인증",
        "footer.companyTitle": "COMPANY",
        "footer.about": "회사소개서",
        "footer.ceo": "대표 인사말",
        "footer.haccp": "HACCP 위생인증",
        "footer.brand": "브랜드 철학",
        "footer.serviceTitle": "SERVICE",
        "footer.shop": "김치 상품 몰",
        "footer.service": "제품 서비스",
        "footer.supportTitle": "SUPPORT",
        "footer.support": "고객지원",
        "footer.privacy": "개인정보 처리방침",
        "footer.terms": "이용약관",

        // Mypage
        "mypage.title": "마이페이지",
        "mypage.sub": "나의 지갑 자산, 레벨 성장 상태 및 주문 내역 관리",
        "mypage.wallet": "💳 지갑 자산 현황",
        "mypage.dp": "대한포인트 (DP)",
        "mypage.money": "충전머니 (결제머니)",
        "mypage.depositTitle": "🏦 신한은행 계좌 입금 충전 안내",
        "mypage.bankName": "은행명",
        "mypage.accountNo": "계좌번호",
        "mypage.accountHolder": "예금주",
        "mypage.copyBtn": "계좌번호 복사",
        "mypage.copySuccess": "계좌번호가 복사되었습니다!",
        "mypage.depositFormTitle": "💳 계좌 입금 완료 후 충전 요청",
        "mypage.depositAmountLabel": "입금 신청 금액 (VND):",
        "mypage.depositNameLabel": "입금자명:",
        "mypage.depositBtn": "충전 요청 제출하기",
        "mypage.orderHistory": "📦 최근 주문 내역",
        "mypage.noOrders": "최근 주문 내역이 없습니다.",
        "mypage.convertDp": "DP → 충전머니 전환",

        // Modals & Common Buttons
        "modal.close": "닫기",
        "modal.confirm": "확인",
        "modal.cancel": "취소",
        "modal.loginTitle": "로그인 & 계정 선택",
        "modal.googleLogin": "Google 계정으로 계속하기",
        "modal.emailLogin": "직접 이메일 입력하여 로그인",
    },
    vi: {
        // Navigation & General
        "nav.home": "Trang chủ",
        "nav.about": "Về thương hiệu",
        "nav.service": "Dịch vụ (Tạp chí)",
        "nav.shop": "Cửa hàng",
        "nav.subscribe": "Đăng ký Kimchi",
        "nav.dna": "Kimchi DNA cá nhân",
        "nav.mypage": "Trang cá nhân",
        "nav.admin": "Quản trị viên",
        "nav.login": "Đăng nhập",
        "nav.logout": "Đăng xuất",

        // Language Names
        "lang.ko": "한국어",
        "lang.vi": "Tiếng Việt",

        // Header & Wallet
        "header.chargedMoney": "Tiền nạp",
        "header.points": "Điểm thưởng",
        "header.vndBalance": "Số dư VND",
        "header.dpPoints": "Điểm Daehan (DP)",
        "header.ordersAndPoints": "Lịch sử đơn hàng & Điểm",
        "header.switchAccount": "Đổi tài khoản khác",

        // Hero & Main Banner
        "hero.badge": "Giao tận nơi tại Hà Nội • 100% Bí quyết lên men truyền thống Hàn Quốc",
        "hero.title1": "Bí quyết truyền thống chuẩn vị Hàn Quốc",
        "hero.title2": "Thưởng thức Daehan Kimchi cao cấp tại Hà Nội",
        "hero.sub": "Kimchi Hàn Quốc truyền thống được làm tỉ mỉ từ cải thảo chọn lọc, nguyên liệu 100% tự nhiên tại nhà máy đạt chứng nhận vệ sinh HACCP.",
        "hero.btnShop": "Đặt mua Kimchi tươi ngay",
        "hero.btnAbout": "Câu chuyện thương hiệu",

        // Home Features
        "feat.haccp.title": "Chứng nhận vệ sinh HACCP CODEX",
        "feat.haccp.desc": "Sản xuất tại nhà máy hiện đại Hà Nội với quy trình kiểm soát chất lượng nghiêm ngặt.",
        "feat.fresh.title": "Sản xuất trong ngày • Giao tươi tận nơi",
        "feat.fresh.desc": "Mang đến hương vị kimchi giòn ngon, thanh mát chuẩn vị.",
        "feat.secret.title": "100% Công thức truyền thống Hàn Quốc",
        "feat.secret.desc": "Bí quyết đậm đà chinh phục cả khẩu vị Hàn Quốc lẫn Việt Nam.",

        // Best Products Section
        "best.tag": "PREMIUM SELECTION",
        "best.title": "Các món Kimchi nổi bật nhất",
        "best.sub": "Khám phá các loại Kimchi bán chạy nhất được yêu thích.",
        "best.viewAll": "Xem tất cả sản phẩm →",
        "best.buyNow": "Mua ngay",
        "best.details": "Xem chi tiết",

        // DNA Test Banner
        "dna.bannerTitle": "🔬 Khuyến nghị Kimchi phù hợp qua AI DNA",
        "dna.bannerSub": "Nhận gợi ý món kimchi hoàn hảo theo thói quen ăn uống và thể trạng của bạn!",
        "dna.bannerBtn": "Bắt đầu bài kiểm tra",

        // K-MOA Guide Banner
        "kmoa.title": "💳 Ưu đãi thanh toán nạp tiền K-MOA",
        "kmoa.desc": "Tích lũy thêm điểm DP và nhận giảm giá khi thanh toán bằng tiền nạp K-MOA.",

        // Shop Page
        "shop.title": "Cửa hàng chính hãng Daehan Kimchi",
        "shop.sub": "Sản xuất trực tiếp tại Hà Nội, giao tươi tận nhà! Thưởng thức vị chuẩn Hàn Quốc tại gia.",
        "shop.searchPlaceholder": "Tìm tên Kimchi hoặc danh mục...",
        "shop.all": "Tất cả",
        "shop.cabbage": "Kimchi Cải Thảo",
        "shop.radish": "Kimchi Củ Cải",
        "shop.special": "Kimchi Đặc Biệt",
        "shop.side": "Món phụ / Gia vị",
        "shop.unitPrice": "VND",
        "shop.inStock": "Còn hàng",
        "shop.outOfStock": "Tạm hết hàng",
        "shop.addToCart": "Giỏ hàng",
        "shop.orderNow": "Mua ngay",
        "shop.detailView": "Chi tiết",

        // Product Detail
        "detail.weight": "Trọng lượng",
        "detail.category": "Danh mục",
        "detail.price": "Giá bán",
        "detail.quantity": "Số lượng",
        "detail.totalPrice": "Tổng tiền thanh toán",
        "detail.features": "Đặc điểm sản phẩm",
        "detail.payWithMoney": "Thanh toán tiện lợi bằng Tiền nạp",
        "detail.payWithCash": "Chuyển khoản ngân hàng / Thanh toán thường",

        // Footer
        "footer.desc": "Chăm chút từng hương vị truyền thống và quản lý vệ sinh nghiêm ngặt. Bí mật khoa học lên men hoàn hảo từ trung tâm Hà Nội.",
        "footer.company": "Công ty Cổ phần INFINIS (Daehan Kimchi) • Chứng nhận HACCP CODEX 2020",
        "footer.companyTitle": "CÔNG TY",
        "footer.about": "Giới thiệu công ty",
        "footer.ceo": "Lời chào từ Giám đốc",
        "footer.haccp": "Chứng nhận HACCP",
        "footer.brand": "Triết lý thương hiệu",
        "footer.serviceTitle": "DỊCH VỤ",
        "footer.shop": "Cửa hàng Kimchi",
        "footer.service": "Dịch vụ sản phẩm",
        "footer.supportTitle": "HỖ TRỢ",
        "footer.support": "Hỗ trợ khách hàng",
        "footer.privacy": "Chính sách bảo mật",
        "footer.terms": "Điều khoản sử dụng",

        // Mypage
        "mypage.title": "Trang cá nhân",
        "mypage.sub": "Quản lý tài sản ví, cấp độ phát triển và lịch sử đơn hàng của bạn",
        "mypage.wallet": "💳 Tình trạng tài sản ví",
        "mypage.dp": "Điểm Daehan (DP)",
        "mypage.money": "Tiền nạp (Tiền thanh toán)",
        "mypage.depositTitle": "🏦 Hướng dẫn chuyển khoản Ngân hàng Shinhan",
        "mypage.bankName": "Tên ngân hàng",
        "mypage.accountNo": "Số tài khoản",
        "mypage.accountHolder": "Chủ tài khoản",
        "mypage.copyBtn": "Sao chép số tài khoản",
        "mypage.copySuccess": "Đã sao chép số tài khoản!",
        "mypage.depositFormTitle": "💳 Yêu cầu nạp tiền sau khi chuyển khoản",
        "mypage.depositAmountLabel": "Số tiền yêu cầu nạp (VND):",
        "mypage.depositNameLabel": "Tên người chuyển khoản:",
        "mypage.depositBtn": "Gửi yêu cầu nạp tiền",
        "mypage.orderHistory": "📦 Lịch sử đơn hàng gần đây",
        "mypage.noOrders": "Chưa có lịch sử đơn hàng nào gần đây.",
        "mypage.convertDp": "Đổi DP → Tiền nạp",

        // Modals & Common Buttons
        "modal.close": "Đóng",
        "modal.confirm": "Xác nhận",
        "modal.cancel": "Hủy",
        "modal.loginTitle": "Đăng nhập & Chọn tài khoản",
        "modal.googleLogin": "Tiếp tục với tài khoản Google",
        "modal.emailLogin": "Đăng nhập bằng Email trực tiếp",
    }
};

const LanguageContext = createContext<LanguageContextType>({
    lang: "ko",
    setLang: () => {},
    toggleLang: () => {},
    t: (key: string, defaultText?: string) => defaultText || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<Language>("ko");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedLang = localStorage.getItem("daehan_lang") as Language;
            if (savedLang === "ko" || savedLang === "vi") {
                setLangState(savedLang);
            }
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        if (typeof window !== "undefined") {
            localStorage.setItem("daehan_lang", newLang);
            document.documentElement.lang = newLang;
        }
    };

    const toggleLang = () => {
        const nextLang = lang === "ko" ? "vi" : "ko";
        setLang(nextLang);
    };

    const t = (key: string, defaultText?: string): string => {
        const dict = translations[lang] || translations.ko;
        return dict[key] || defaultText || translations.ko[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
