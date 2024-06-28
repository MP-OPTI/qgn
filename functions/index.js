/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sitemap = require("sitemap");

admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data, context) => {
  const {userId} = data;

  try {
    await admin.auth().deleteUser(userId);
    return {success: true};
  } catch (error) {
    console.error("Error deleting user:", error);
    return {success: false, error: error.message};
  }
});

exports.updateUserEmail = functions.https.onCall(async (data, context) => {
  const {userId, newEmail} = data;

  try {
    await admin.auth().updateUser(userId, {email: newEmail});
    return {success: true};
  } catch (error) {
    console.error("Error updating user email:", error);
    return {success: false, error: error.message};
  }
});

exports.updateUserPassword = functions.https.onCall(async (data, context) => {
  const {userId, newPassword} = data;

  try {
    await admin.auth().updateUser(userId, {password: newPassword});
    return {success: true};
  } catch (error) {
    console.error("Error updating user password:", error);
    return {success: false, error: error.message};
  }
});

exports.getUserData = functions.https.onCall(async (data, context) => {
  const {userId} = data;

  try {
    const userRecord = await admin.auth().getUser(userId);
    return {success: true, user: userRecord};
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {success: false, error: error.message};
  }
});

// This might need to be redone. Why not use Firebase own authentication?
exports.sendVerificationEmail = functions.https.onCall(async (data, context) =>{
  const {userId} = data;

  try {
    const user = await admin.auth().getUser(userId);
    const link = await admin.auth().generateEmailVerificationLink(user.email);

    // Here you would typically send the email using an email service provider
    // For simplicity, we are just returning the link.
    return {success: true, link: link};
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {success: false, error: error.message};
  }
});

// Sitemap generator

exports.generateSitemap = functions.pubsub
    .schedule("every 1 hours")
    .onRun(async (context) => {
      const db = admin.firestore();
      const postsCollection = await db.collection("blogPosts").get();
      const posts = postsCollection.docs.map((doc) => doc.data());

      const sm = sitemap.createSitemap({
        hostname: "https://qgn.app",
        urls: [
          {url: "/", changefreq: "daily", priority: 1.0},
          ...posts.map((post) => ({
            url: `/blog/${post.slug}`,
            changefreq: "weekly",
            lastmodISO: post.lastEditedAt ?
            post.lastEditedAt.toDate().toISOString() :
            post.createdAt.toDate().toISOString(),
            priority: 0.8,
          })),
        ],
      });

      const sitemapContent = sm.toString();
      const bucket = admin.storage().bucket();
      const file = bucket.file("sitemap.xml");
      await file.save(sitemapContent, {contentType: "application/xml"});
      console.log("Sitemap updated");
      return null;
    });

exports.serveSitemap = functions.https.onRequest(async (req, res) => {
  const bucket = admin.storage().bucket();
  const file = bucket.file("sitemap.xml");
  const [exists] = await file.exists();
  if (exists) {
    const stream = file.createReadStream();
    stream.pipe(res);
  } else {
    res.status(404).send("Sitemap not found");
  }
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
