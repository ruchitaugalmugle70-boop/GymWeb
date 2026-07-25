const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const SERVICE_ACCOUNT_PATH = path.join(__dirname, "../../serviceAccountKey.json");

let adminInitialized = false;

if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    try {
        const serviceAccount = require(SERVICE_ACCOUNT_PATH);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        adminInitialized = true;
        console.log("✅ Firebase Admin SDK initialized successfully.");
    } catch (err) {
        console.warn("⚠️  Firebase Admin SDK initialization failed:", err.message);
        console.warn("   Google Sign-In will use fallback verification.");
    }
} else {
    console.warn("⚠️  serviceAccountKey.json not found at:", SERVICE_ACCOUNT_PATH);
    console.warn("   Google Sign-In backend verification is limited.");
    console.warn("   To enable full Google Sign-In, download your service account key from:");
    console.warn("   Firebase Console → Project Settings → Service Accounts → Generate new private key");
    console.warn("   and save it as: backend/serviceAccountKey.json");
}

module.exports = { admin, adminInitialized };
