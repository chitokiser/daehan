import { getAdminDb } from './src/lib/firebaseAdmin';
async function clean() {
  const db = getAdminDb();
  if(!db) { console.log('No Firebase config found'); return; }
  const snap = await db.collection('users').where('email', '==', 'daguri75@gmail.com').get();
  console.log('Found ' + snap.docs.length + ' docs for daguri75');
  for (const doc of snap.docs) {
      if (doc.id !== 'google_daguri75_gmail_com') {
          console.log('Deleting ' + doc.id);
          await db.collection('users').doc(doc.id).delete();
      }
  }
}
clean().then(() => console.log('Done')).catch(console.error);