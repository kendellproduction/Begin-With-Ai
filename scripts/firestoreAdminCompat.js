// Admin Firestore compat layer for Node-only scripts
// Provides a minimal subset of the client Firestore API used by our scripts

import admin from 'firebase-admin';

// Initialize admin app once using ADC or service account from env
if (admin.apps.length === 0) {
  const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT;
  const hasProjectId = !!process.env.GCLOUD_PROJECT || !!process.env.FIREBASE_PROJECT_ID || !!process.env.GCP_PROJECT;

  try {
    if (hasServiceAccount) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Fallback to Application Default Credentials (e.g., GOOGLE_APPLICATION_CREDENTIALS)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT
      });
    }
  } catch (err) {
    // Re-throw with clearer message to help local runs
    throw new Error(`Failed to initialize firebase-admin. Ensure GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT is set. Original error: ${err.message}`);
  }
}

export const db = admin.firestore();

// Compat helpers to mimic a subset of the client API used in scripts
export const collection = (database, ...segments) => {
  const path = segments.filter(Boolean).join('/');
  return database.collection(path);
};

export const doc = (database, ...segments) => {
  const path = segments.filter(Boolean).join('/');
  return database.doc(path);
};

export const setDoc = async (docRef, data, options = undefined) => {
  if (options && options.merge) {
    return docRef.set(data, { merge: true });
  }
  return docRef.set(data);
};

export const getDocs = async (queryOrCollectionRef) => {
  const snapshot = await queryOrCollectionRef.get();
  // Return an object that looks like client getDocs result enough for our scripts
  return {
    docs: snapshot.docs
  };
};

export const getDoc = async (docRef) => {
  const snap = await docRef.get();
  // Provide client-like API
  return {
    id: snap.id,
    ref: docRef,
    data: () => snap.data(),
    exists: () => !!snap.exists
  };
};

export const deleteDoc = async (docRef) => {
  return docRef.delete();
};

export const writeBatch = (database) => {
  const batch = database.batch();
  return {
    set: (ref, data, options = undefined) => options?.merge ? batch.set(ref, data, { merge: true }) : batch.set(ref, data),
    update: (ref, data) => batch.update(ref, data),
    delete: (ref) => batch.delete(ref),
    commit: () => batch.commit()
  };
};

// Simple FieldValue shim for server timestamps if needed in the future
export const serverTimestamp = () => admin.firestore.FieldValue.serverTimestamp();

export default {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  serverTimestamp
};


