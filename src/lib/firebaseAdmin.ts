let isInitialized = false;
let adminApp: any = null;
let adminDb: any = null;
let adminAuth: any = null;

export function initFirebaseAdmin(): boolean {
    if (isInitialized) return adminDb !== null;
    try {
        const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!key) {
            console.warn("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Using fallback in-memory store.");
            isInitialized = true;
            return false;
        }

        let keyStr = key.trim();
        if ((keyStr.startsWith("'") && keyStr.endsWith("'")) || (keyStr.startsWith('"') && keyStr.endsWith('"'))) {
            keyStr = keyStr.slice(1, -1);
        }

        let serviceAccount: any;
        try {
            serviceAccount = JSON.parse(keyStr);
        } catch {
            const fixedStr = keyStr.replace(/[\r\n]+/g, "\\n");
            serviceAccount = JSON.parse(fixedStr);
        }

        // Dynamic require to prevent module load crashes in serverless functions if firebase-admin package or credentials fail
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const adminAppModule = require('firebase-admin/app');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const adminFirestoreModule = require('firebase-admin/firestore');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const adminAuthModule = require('firebase-admin/auth');

        if (adminAppModule.getApps().length === 0) {
            adminApp = adminAppModule.initializeApp({
                credential: adminAppModule.cert(serviceAccount)
            });
        } else {
            adminApp = adminAppModule.getApps()[0];
        }

        adminDb = adminFirestoreModule.getFirestore(adminApp);
        adminAuth = adminAuthModule.getAuth(adminApp);
        isInitialized = true;
        return true;
    } catch (error) {
        console.error('Firebase admin initialization error:', error);
        isInitialized = true;
        adminDb = null;
        adminAuth = null;
        return false;
    }
}

export function getAdminDb() {
    initFirebaseAdmin();
    return adminDb;
}

export function getAdminAuth() {
    initFirebaseAdmin();
    return adminAuth;
}

