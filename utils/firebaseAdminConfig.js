const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require("firebase-admin/storage");

const serviceAccount = require("../serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${process.env.FIREBASE_BUCKET_NAME}.appspot.com`,
});

exports.bucket = getStorage().bucket();
