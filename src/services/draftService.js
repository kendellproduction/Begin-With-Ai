/**
 * Draft Service - Secure Firestore-based draft management
 * Uses Firestore for persistence with localStorage as temporary buffer
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

class DraftService {
  constructor() {
    this.cache = new Map(); // In-memory cache for performance
    this.subscribers = new Set(); // For real-time updates
  }

  /**
   * Get drafts collection reference for a user
   */
  getDraftsCollection() {
    // Admin-only drafts at root level
    return collection(db, 'drafts');
  }

  /**
   * Subscribe to real-time draft updates
   */
  subscribeToDrafts(userId, callback) {
    try {
      const draftsRef = this.getDraftsCollection();
      const q = query(draftsRef, orderBy('lastModified', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const drafts = [];
        snapshot.forEach((doc) => {
          drafts.push({ id: doc.id, ...doc.data() });
        });
        
        // Update cache
        this.cache.set(`drafts_all`, drafts);
        
        // Notify subscribers
        callback(drafts);
      }, (error) => {
        console.error('Error subscribing to drafts:', error);
        callback(null, error);
      });

      this.subscribers.add(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up draft subscription:', error);
      callback(null, error);
      return null;
    }
  }

  /**
   * Save draft to Firestore
   */
  async saveDraft(userId, draftData) {
    if (!userId) {
      throw new Error('User ID is required to save draft');
    }

    try {
      const draftsRef = this.getDraftsCollection();
      
      const draftDoc = {
        title: draftData.title || 'Untitled Draft',
        lessonId: draftData.lessonId || null,
        contentVersions: draftData.contentVersions || { free: null, premium: null },
        metadata: {
          lessonType: draftData.lessonType || 'concept_explanation',
          estimatedTimeMinutes: draftData.estimatedTimeMinutes || 15,
          xpAward: draftData.xpAward || 10,
          category: draftData.category || 'General',
          tags: draftData.tags || []
        },
        status: 'draft',
        createdBy: userId, // Track which admin created the draft
        lastModified: serverTimestamp(),
        createdAt: draftData.createdAt ? new Date(draftData.createdAt) : serverTimestamp(),
        version: draftData.version || 1
      };

      let result;
      if (draftData.id) {
        // Update existing draft using setDoc with merge to handle both create and update
        const draftDocRef = doc(draftsRef, draftData.id);
        const updatedDoc = {
          ...draftDoc,
          version: (draftData.version || 1) + 1
        };
        await setDoc(draftDocRef, updatedDoc, { merge: true });
        result = { id: draftData.id, ...updatedDoc };
      } else {
        // Create new draft
        const docRef = await addDoc(draftsRef, draftDoc);
        result = { id: docRef.id, ...draftDoc };
      }

      // Update localStorage buffer
      this.updateLocalStorageBuffer(userId, result);
      
      console.log('✅ Draft saved to Firestore:', result.id);
      return result;

    } catch (error) {
      console.error('❌ Error saving draft:', error);
      
      // Fallback to localStorage if Firestore fails
      this.saveToLocalStorageBuffer(userId, draftData);
      throw new Error(`Failed to save draft: ${error.message}`);
    }
  }

  /**
   * Load all drafts for a user
   */
  async loadDrafts(userId) {
    if (!userId) {
      return [];
    }

    try {
      // Check cache first
      const cached = this.cache.get(`drafts_all`);
      if (cached) {
        return cached;
      }

      const draftsRef = this.getDraftsCollection();
      const q = query(draftsRef, orderBy('lastModified', 'desc'));
      const snapshot = await getDocs(q);
      
      const drafts = [];
      snapshot.forEach((doc) => {
        drafts.push({ id: doc.id, ...doc.data() });
      });

      // Update cache
      this.cache.set(`drafts_all`, drafts);
      
      console.log(`📁 Loaded ${drafts.length} drafts from Firestore`);
      return drafts;

    } catch (error) {
      console.error('❌ Error loading drafts from Firestore:', error);
      
      // Fallback to localStorage
      return this.loadFromLocalStorageBuffer(userId);
    }
  }

  /**
   * Load specific draft by ID
   */
  async loadDraft(userId, draftId) {
    if (!userId || !draftId) {
      throw new Error('User ID and Draft ID are required');
    }

    try {
      const draftRef = doc(this.getDraftsCollection(), draftId);
      const draftSnap = await getDoc(draftRef);
      
      if (draftSnap.exists()) {
        return { id: draftSnap.id, ...draftSnap.data() };
      } else {
        throw new Error('Draft not found');
      }
    } catch (error) {
      console.error('❌ Error loading draft:', error);
      throw error;
    }
  }

  /**
   * Delete draft from Firestore
   */
  async deleteDraft(userId, draftId) {
    if (!userId || !draftId) {
      throw new Error('User ID and Draft ID are required');
    }

    try {
      const draftRef = doc(this.getDraftsCollection(), draftId);
      await deleteDoc(draftRef);
      
      // Remove from localStorage buffer
      this.removeFromLocalStorageBuffer(userId, draftId);
      
      console.log('✅ Draft deleted:', draftId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting draft:', error);
      throw error;
    }
  }

  /**
   * Publish draft to production lesson structure
   */
  async publishDraft(userId, draftId, pathId, moduleId) {
    if (!userId || !draftId || !pathId || !moduleId) {
      throw new Error('User ID, Draft ID, Path ID, and Module ID are required');
    }

    try {
      // Load the draft
      const draft = await this.loadDraft(userId, draftId);
      if (!draft) {
        throw new Error('Draft not found');
      }

      // Convert draft format to lesson format
      const lessonData = {
        title: draft.title,
        lessonType: draft.metadata?.lessonType || 'concept_explanation',
        estimatedTimeMinutes: draft.metadata?.estimatedTimeMinutes || 15,
        xpAward: draft.metadata?.xpAward || 10,
        category: draft.metadata?.category || 'General',
        tags: draft.metadata?.tags || [],
        content: draft.contentVersions?.free || [],
        premiumContent: draft.contentVersions?.premium || null,
        status: 'published',
        publishedAt: serverTimestamp(),
        publishedBy: userId,
        draftId: draftId,
        version: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Get the highest order number in this module and increment
      const lessonsRef = collection(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons');
      const snapshot = await getDocs(lessonsRef);
      const maxOrder = snapshot.docs.reduce((max, doc) => {
        const order = doc.data().order || 0;
        return Math.max(max, order);
      }, 0);
      
      lessonData.order = maxOrder + 1;
      lessonData.lessonModuleId = moduleId;

      // Create lesson in production structure
      const lessonDocRef = await addDoc(lessonsRef, lessonData);
      
      // Update draft status to published
      const draftRef = doc(this.getDraftsCollection(), draftId);
      await setDoc(draftRef, {
        status: 'published',
        publishedAt: serverTimestamp(),
        publishedLessonId: lessonDocRef.id,
        publishedPath: pathId,
        publishedModule: moduleId
      }, { merge: true });

      console.log('✅ Draft published successfully:', lessonDocRef.id);
      return {
        lessonId: lessonDocRef.id,
        pathId,
        moduleId,
        success: true
      };

    } catch (error) {
      console.error('❌ Error publishing draft:', error);
      throw new Error(`Failed to publish draft: ${error.message}`);
    }
  }

  /**
   * Auto-save draft (for temporary storage while editing)
   */
  autoSaveDraft(userId, draftData) {
    if (!userId) return;

    try {
      // Save to localStorage immediately for responsiveness
      this.saveToLocalStorageBuffer(userId, draftData, true);
      
      // Debounced Firestore save (implement if needed)
      if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout);
      }
      
      this.autoSaveTimeout = setTimeout(async () => {
        try {
          await this.saveDraft(userId, draftData);
        } catch (error) {
          console.warn('Auto-save to Firestore failed, keeping in localStorage:', error);
        }
      }, 2000); // 2 second delay
      
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  }

  /**
   * localStorage buffer methods (fallback only)
   */
  saveToLocalStorageBuffer(userId, draftData, isAutoSave = false) {
    try {
      const key = `draft_buffer_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      
      const draft = {
        ...draftData,
        id: draftData.id || `temp_${Date.now()}`,
        lastModified: new Date().toISOString(),
        isTemporary: isAutoSave,
        bufferOnly: true
      };

      const updated = existing.filter(d => d.id !== draft.id);
      updated.unshift(draft);
      
      // Keep only last 5 drafts in localStorage
      localStorage.setItem(key, JSON.stringify(updated.slice(0, 5)));
      
    } catch (error) {
      console.error('Error saving to localStorage buffer:', error);
    }
  }

  updateLocalStorageBuffer(userId, draftData) {
    try {
      const key = `draft_buffer_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      
      const updated = existing.filter(d => d.id !== draftData.id);
      updated.unshift({ ...draftData, bufferOnly: false });
      
      localStorage.setItem(key, JSON.stringify(updated.slice(0, 5)));
    } catch (error) {
      console.error('Error updating localStorage buffer:', error);
    }
  }

  removeFromLocalStorageBuffer(userId, draftId) {
    try {
      const key = `draft_buffer_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = existing.filter(d => d.id !== draftId);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing from localStorage buffer:', error);
    }
  }

  loadFromLocalStorageBuffer(userId) {
    try {
      const key = `draft_buffer_${userId}`;
      const drafts = JSON.parse(localStorage.getItem(key) || '[]');
      console.log(`📦 Loaded ${drafts.length} drafts from localStorage buffer`);
      return drafts;
    } catch (error) {
      console.error('Error loading from localStorage buffer:', error);
      return [];
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    // Unsubscribe from all real-time listeners
    this.subscribers.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.subscribers.clear();
    
    // Clear cache
    this.cache.clear();
    
    // Clear auto-save timeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
  }
}

// Create singleton instance
const draftService = new DraftService();

export default draftService; 