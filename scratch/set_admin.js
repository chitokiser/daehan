const fs = require('fs');
const path = require('path');
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

async function main() {
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
        
        const serviceAccount = JSON.parse(keyStr);
        if (getApps().length === 0) {
            initializeApp({ credential: cert(serviceAccount) });
        }
        const db = getFirestore();
        console.log("Firebase Admin SDK initialized!");

        const targetEmail = "infinis6688@gmail.com";
        const safeUid = `google_${targetEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;
        
        // Check by email query
        const usersSnap = await db.collection('users').where('email', '==', targetEmail).get();
        if (!usersSnap.empty) {
            for (const doc of usersSnap.docs) {
                console.log(`Found existing user doc: ${doc.id}`);
                await doc.ref.set({ role: 'SUPER_ADMIN' }, { merge: true });
                console.log(`Updated ${doc.id} role to SUPER_ADMIN`);
            }
        }

        // Also set/ensure safeUid doc exists
        const safeDocRef = db.collection('users').doc(safeUid);
        const safeDoc = await safeDocRef.get();
        if (!safeDoc.exists) {
            console.log(`Creating user doc for ${safeUid}...`);
            await safeDocRef.set({
                uid: safeUid,
                name: "관리자 (infinis6688)",
                email: targetEmail,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent("관리자 (infinis6688)")}&background=E31837&color=ffffff&bold=true`,
                role: 'SUPER_ADMIN',
                moneyBalance: 0,
                pointBalance: 0,
                vndBalance: 0,
                dpPoints: 0,
                level: 1,
                exp: 0,
                createdAt: new Date().toISOString()
            }, { merge: true });
            console.log(`Created ${safeUid} with SUPER_ADMIN role.`);
        } else {
            console.log(`Updating ${safeUid} role to SUPER_ADMIN...`);
            await safeDocRef.set({ role: 'SUPER_ADMIN' }, { merge: true });
            console.log(`Updated ${safeUid} role to SUPER_ADMIN.`);
        }

        console.log("SUCCESS: infinis6688@gmail.com is now SUPER_ADMIN!");
        process.exit(0);
    } catch (err) {
        console.error("Error setting admin:", err);
        process.exit(1);
    }
}

main();
