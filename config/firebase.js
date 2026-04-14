const admin = require('firebase-admin');

// Load environment variables
const path = require('path');

// Initialize Firebase Admin with Service Account JSON
let serviceAccount = null;
try {
  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (saPath) {
    // Resolve the path relative to the config directory (__dirname)
    // saPath is something like './config/serviceAccountKey.json'
    // so we step back one folder level to be at the project root.
    serviceAccount = require(path.resolve(__dirname, '..', saPath));
  }
} catch (e) {
  console.error('Failed to load Firebase Service Account:', e.message);
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  console.log('✅ Firebase Admin initialized successfully');
} else {
  console.warn('⚠️ Firebase Admin not initialized: Check .env and serviceAccountKey.json');
}

const db = admin.apps.length > 0 ? admin.firestore() : null;
const auth = admin.apps.length > 0 ? admin.auth() : null;

module.exports = { admin, db, auth };
