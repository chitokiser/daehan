import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            console.warn("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Admin features will fail.");
            // We initialize with a dummy or application default if possible, but leaving empty may fail nicely later
            admin.initializeApp();
        }
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
