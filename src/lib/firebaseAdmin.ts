import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let isInitialized = false;

export function initFirebaseAdmin() {
    if (isInitialized || getApps().length > 0) return;
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            let keyStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
            // Netlify 환경 변수 설정 시 실수로 홑따옴표(')를 넣은 경우를 대비
            if (keyStr.startsWith("'") && keyStr.endsWith("'")) {
                keyStr = keyStr.slice(1, -1);
            }
            const serviceAccount = JSON.parse(keyStr);
            initializeApp({
                credential: cert(serviceAccount)
            });
        } else {
            console.warn("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Admin features will fail.");
            initializeApp();
        }
        isInitialized = true;
    } catch (error) {
        console.error('Firebase admin initialization error:', error);
        throw error;
    }
}

export function getAdminDb() {
    initFirebaseAdmin();
    return getFirestore();
}

export function getAdminAuth() {
    initFirebaseAdmin();
    return getAuth();
}
