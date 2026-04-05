const { db } = require('../config/firebase');

async function cleanup() {
  if (!db) {
    console.error('❌ Database not initialized');
    process.exit(1);
  }

  const collections = ['users', 'books', 'transactions'];
  
  for (const collectionName of collections) {
    console.log(`🧹 Cleaning up collection: ${collectionName}...`);
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ ${collectionName} cleared.`);
  }

  process.exit();
}

cleanup();
