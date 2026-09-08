import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
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
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
