const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");

const serviceAccount = require("../serviceAccountKey.json");

initializeApp({
  credential: cert({
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/gm, "\n")
      : undefined,
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  }),
  storageBucket: `${process.env.FIREBASE_BUCKET_NAME}.appspot.com`,
});

exports.bucket = getStorage().bucket();
