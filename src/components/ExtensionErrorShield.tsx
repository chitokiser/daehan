"use client";

import { useEffect } from "react";

/**
 * ExtensionErrorShield
 * Prevents third-party browser extensions (TrustWallet, Phantom, Solflare, OKX inpage.js)
 * from crashing Next.js with unhandled runtime errors like 'se is not a function' or 'registerSolanaInjectedWallet'.
 */
export default function ExtensionErrorShield() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const isExtensionError = (errorOrMessage: any, source?: string, stack?: string): boolean => {
            const strMsg = String(errorOrMessage || "");
            const strSource = String(source || "");
            const strStack = String(stack || "");

            const extensionKeywords = [
                "chrome-extension://",
                "moz-extension://",
                "inpage.js",
                "extensionPageScript",
                "registerSolanaInjectedWallet",
                "initSolanaConnect",
                "se is not a function",
                "Cannot redefine property: ethereum",
                "Cannot redefine property: solana",
                "solanaInjectedWallet",
                "coinbaseWalletExtension",
                "egjidjbogllichdcondbcbdnbeappgdph",
                "fldfpgipfncgndfolcbkdeeknbbbnhcc"
            ];

            return extensionKeywords.some(
                kw => strMsg.includes(kw) || strSource.includes(kw) || strStack.includes(kw)
            );
        };

        const originalOnError = window.onerror;
        window.onerror = function(message, source, lineno, colno, error) {
            if (isExtensionError(message, source, error?.stack)) {
                return true; // Suppress Next.js dev overlay for Chrome extension errors
            }
            if (typeof originalOnError === "function") {
                return originalOnError.call(window, message, source, lineno, colno, error);
            }
            return false;
        };

        const errorHandler = (event: ErrorEvent) => {
            const { message, filename, error } = event;
            if (isExtensionError(message, filename, error?.stack)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                return true;
            }
        };

        const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
            const reason = event.reason;
            const msg = reason?.message || String(reason || "");
            const stack = reason?.stack || "";
            if (isExtensionError(msg, "", stack)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                return true;
            }
        };

        window.addEventListener("error", errorHandler, true);
        window.addEventListener("unhandledrejection", unhandledRejectionHandler, true);

        return () => {
            window.onerror = originalOnError;
            window.removeEventListener("error", errorHandler, true);
            window.removeEventListener("unhandledrejection", unhandledRejectionHandler, true);
        };
    }, []);

    return null;
}
