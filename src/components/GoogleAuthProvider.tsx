"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";

export default function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "PLEASE_ENTER_GOOGLE_CLIENT_ID_IN_ENV";
    
    useEffect(() => {
        console.log("현재 적용된 Google Client ID:", clientId);
    }, [clientId]);

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
