"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "PLEASE_ENTER_GOOGLE_CLIENT_ID_IN_ENV";
    
    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
