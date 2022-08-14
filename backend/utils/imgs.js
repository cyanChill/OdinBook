const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const debug = require("debug")("images");

const { bucket } = require("./firebaseAdminConfig");

exports.upload = multer({ storage: multer.memoryStorage() });

/* Checks to see if uploaded file is an image */
exports.isImg = (fileObj) => {
  return /image\/(avif|jpeg|png|webp)/.test(fileObj.mimetype);
};

/* Checks whether the img size is <= the specified value */
exports.fileSizeIsLEQ = (fileObj, sizeMB) => {
  return fileObj.size <= sizeMB * 1000000;
};

/* Converts file object buffer to .webp buffer */
exports.convertToWebpBuff = async (fileObj) => {
  const webpBuffer = await sharp(fileObj.buffer).webp().toBuffer();
  return webpBuffer;
};

/* Upload .webp buffer to firebase and returns download url */
exports.uploadImgToFirebase = async (webpBuffer, uploaderId) => {
  const imgRefId = uuidv4();
  const downloadToken = uuidv4();
  const destination = `odinworks/${uploaderId}/${imgRefId}.webp`;

  const newFile = bucket.file(destination);
  await newFile.save(webpBuffer); // Upload Image
  // Update metadata for obtainable downloadUrl
  await newFile.setMetadata({
    metadata: { firebaseStorageDownloadTokens: downloadToken },
  });

  // Return file download url
  return `https://firebasestorage.googleapis.com/v0/b/${
    process.env.FIREBASE_BUCKET_NAME
  }.appspot.com/o/${encodeURIComponent(
    destination
  )}?alt=media&token=${downloadToken}`;
};

/* Deletes image from firebase image url */
exports.deleteImageFromUrl = async (imgUrl) => {
  const encodedFilePath = imgUrl
    .replace(
      `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_BUCKET_NAME}.appspot.com/o/`,
      ""
    )
    .replace(/\?alt\=media\&token\=.*/, "");
  const filePath = decodeURIComponent(encodedFilePath);
  try {
    await bucket.file(filePath).delete();
    debug("Successfully deleted file.");
  } catch (err) {
    debug(err);
  }
};

/* Deletes all images made by user */
exports.deleteAllUserImgs = async (userId) => {
  try {
    await bucket.deleteFiles({ prefix: `odinworks/${userId}/` });
    debug("Successfully deleted all images from user.");
  } catch (err) {
    debug(err);
  }
};

/* ⭐ "Fast Track" Functions ⭐ */
// Quick image validation function
exports.validateImg = (fileObj, errArr) => {
  if (!fileObj) {
    errArr.push({ msg: "User must submit an image." });
  } else {
    if (!this.isImg(fileObj)) {
      errArr.push({ msg: "Uploaded file is not an image." });
    }
    if (!this.fileSizeIsLEQ(fileObj, 1)) {
      errArr.push({ msg: "Uploaded file is not <= 1MB in size." });
    }
  }
};

// Quick image conversion + upload
exports.convertImgAndUploadToFirebase = async (fileObj, uploaderId) => {
  const webpBuffer = await this.convertToWebpBuff(fileObj);
  const downloadUrl = await this.uploadImgToFirebase(webpBuffer, uploaderId);
  return downloadUrl;
};

// Is Firebase Image Url
exports.isFirebaseImg = (url) => {
  return url.startsWith(
    `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_BUCKET_NAME}.appspot.com/o/`
  );
};
