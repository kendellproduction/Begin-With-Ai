/*
  Cleanup script: delete all modules (and their lessons) under every learning path,
  but keep the learning path documents intact.

  Requirements:
  - Node 18+
  - firebase-admin installed (already in project dependencies)
  - GOOGLE_APPLICATION_CREDENTIALS set to a service account JSON path OR
    FIREBASE_SERVICE_ACCOUNT env var with the JSON content

  Usage:
    GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json \
    node scripts/cleanup-modules.js
*/

const admin = require('firebase-admin');

function initAdmin() {
  if (admin.apps.length > 0) return;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({ credential: admin.credential.cert(svc) });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT
      });
    }
  } catch (err) {
    throw new Error(`Failed to initialize firebase-admin. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT. ${err.message}`);
  }
}

async function cleanupModules() {
  initAdmin();
  const db = admin.firestore();

  console.log('🧹 Starting cleanup: deleting all modules and lessons, keeping learning paths...');

  const pathsSnap = await db.collection('learningPaths').get();
  let deletedModules = 0;
  let deletedLessons = 0;

  for (const pathDoc of pathsSnap.docs) {
    const pathId = pathDoc.id;
    const pathTitle = (pathDoc.data() && pathDoc.data().title) || pathId;
    console.log(`\n📁 Path: ${pathTitle} (${pathId})`);

    const modulesSnap = await db.collection('learningPaths').doc(pathId).collection('modules').get();
    for (const moduleDoc of modulesSnap.docs) {
      const moduleId = moduleDoc.id;
      const moduleTitle = (moduleDoc.data() && moduleDoc.data().title) || moduleId;
      console.log(`  📂 Module: ${moduleTitle} (${moduleId})`);

      // Delete lessons in batches
      const lessonsSnap = await db
        .collection('learningPaths')
        .doc(pathId)
        .collection('modules')
        .doc(moduleId)
        .collection('lessons')
        .get();

      const batch = db.batch();
      let ops = 0;
      for (const lessonDoc of lessonsSnap.docs) {
        batch.delete(lessonDoc.ref);
        ops++;
        deletedLessons++;
        if (ops >= 450) { // stay below 500 limit
          await batch.commit();
        }
      }
      if (ops > 0) await batch.commit();

      // Delete module itself
      await db
        .collection('learningPaths')
        .doc(pathId)
        .collection('modules')
        .doc(moduleId)
        .delete();
      deletedModules++;
      console.log(`  🗑️  Deleted module ${moduleTitle} and ${lessonsSnap.size} lessons`);
    }
  }

  console.log(`\n✅ Cleanup complete. Deleted ${deletedModules} modules and ${deletedLessons} lessons. Learning paths preserved.`);
}

cleanupModules().catch((err) => {
  console.error('❌ Cleanup failed:', err);
  process.exitCode = 1;
});


