const fs = require('fs');
const path = require('path');
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/FIREBASE_SERVICE_ACCOUNT_KEY=(.*)/);
    if (!match) {
        console.error("FIREBASE_SERVICE_ACCOUNT_KEY not found in .env.local");
        process.exit(1);
    }
    let keyStr = match[1].trim();
    if (keyStr.startsWith("'") && keyStr.endsWith("'")) {
        keyStr = keyStr.slice(1, -1);
    }
    
    console.log("Raw Key String Length:", keyStr.length);
    const serviceAccount = JSON.parse(keyStr);
    console.log("Successfully parsed JSON! Project ID:", serviceAccount.project_id);

    if (getApps().length === 0) {
        initializeApp({ credential: cert(serviceAccount) });
    }
    const db = getFirestore();
    console.log("Firebase Admin SDK initialized successfully!");

    db.collection('users').limit(1).get().then(snap => {
        console.log("Firestore query success! Doc count:", snap.size);
        process.exit(0);
    }).catch(err => {
        console.error("Firestore query error:", err);
        process.exit(1);
    });
} catch (err) {
    console.error("Firebase Test Error:", err);
    process.exit(1);
}
