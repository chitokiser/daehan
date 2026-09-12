import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let isInitialized = false;

export function initFirebaseAdmin(): boolean {
    if (isInitialized || getApps().length > 0) return true;
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            let keyStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
            if (keyStr.startsWith("'") && keyStr.endsWith("'")) {
                keyStr = keyStr.slice(1, -1);
            }
            const serviceAccount = JSON.parse(keyStr);
            initializeApp({
                credential: cert(serviceAccount)
            });
            isInitialized = true;
            return true;
        } else {
            console.warn("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
            return false;
        }
    } catch (error) {
        console.error('Firebase admin initialization error:', error);
        return false;
    }
}

export function getAdminDb() {
    const ok = initFirebaseAdmin();
    if (!ok && getApps().length === 0) {
        return null as any;
    }
    return getFirestore();
}

export function getAdminAuth() {
    const ok = initFirebaseAdmin();
    if (!ok && getApps().length === 0) {
        return null as any;
    }
    return getAuth();
}
