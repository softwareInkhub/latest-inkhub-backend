import admin from 'firebase-admin';
import 'dotenv/config';

console.log("Initializing Firebase Admin...");

// Log the environment variable to check its value
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

console.log("Firebase Admin initialized with project ID:", serviceAccount.projectId);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log("Firestore initialized.");

export { db, admin }; 