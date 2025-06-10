import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile } from './firestoreService';

// Permission check utility
const checkAdminPermission = async (userId) => {
  const userProfile = await getUserProfile(userId);
  if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'developer')) {
    throw new Error('Insufficient permissions: Admin or Developer role required');
  }
  return userProfile;
};

// Learning Paths CRUD Operations

export const getAllLearningPaths = async () => {
  try {
    const pathsRef = collection(db, 'learningPaths');
    const q = query(pathsRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    const paths = [];
    for (const pathDoc of snapshot.docs) {
      const pathData = { id: pathDoc.id, ...pathDoc.data() };
      
      // Get modules for this path
      const modulesRef = collection(db, 'learningPaths', pathDoc.id, 'modules');
      const modulesQ = query(modulesRef, orderBy('order', 'asc'));
      const modulesSnapshot = await getDocs(modulesQ);
      
      const modules = [];
      for (const moduleDoc of modulesSnapshot.docs) {
        const moduleData = { id: moduleDoc.id, ...moduleDoc.data() };
        
        // Get lessons for this module
        const lessonsRef = collection(db, 'learningPaths', pathDoc.id, 'modules', moduleDoc.id, 'lessons');
        const lessonsQ = query(lessonsRef, orderBy('order', 'asc'));
        const lessonsSnapshot = await getDocs(lessonsQ);
        
        const lessons = lessonsSnapshot.docs.map(lessonDoc => ({
          id: lessonDoc.id,
          ...lessonDoc.data()
        }));
        
        moduleData.lessons = lessons;
        modules.push(moduleData);
      }
      
      pathData.modules = modules;
      paths.push(pathData);
    }
    
    return paths;
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    throw error;
  }
};

export const createLearningPath = async (pathData, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    // Get the highest order number and increment
    const pathsRef = collection(db, 'learningPaths');
    const snapshot = await getDocs(pathsRef);
    const maxOrder = snapshot.docs.reduce((max, doc) => {
      const order = doc.data().order || 0;
      return Math.max(max, order);
    }, 0);
    
    const newPathData = {
      ...pathData,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1
    };
    
    const docRef = await addDoc(pathsRef, newPathData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating learning path:', error);
    throw error;
  }
};

export const updateLearningPath = async (pathId, updates, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const pathRef = doc(db, 'learningPaths', pathId);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    await updateDoc(pathRef, updateData);
  } catch (error) {
    console.error('Error updating learning path:', error);
    throw error;
  }
};

export const deleteLearningPath = async (pathId, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const batch = writeBatch(db);
    
    // Delete all modules and their lessons first
    const modulesRef = collection(db, 'learningPaths', pathId, 'modules');
    const modulesSnapshot = await getDocs(modulesRef);
    
    for (const moduleDoc of modulesSnapshot.docs) {
      // Delete all lessons in this module
      const lessonsRef = collection(db, 'learningPaths', pathId, 'modules', moduleDoc.id, 'lessons');
      const lessonsSnapshot = await getDocs(lessonsRef);
      
      lessonsSnapshot.docs.forEach(lessonDoc => {
        batch.delete(lessonDoc.ref);
      });
      
      // Delete the module
      batch.delete(moduleDoc.ref);
    }
    
    // Delete the learning path
    const pathRef = doc(db, 'learningPaths', pathId);
    batch.delete(pathRef);
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting learning path:', error);
    throw error;
  }
};

// Modules CRUD Operations

export const createModule = async (pathId, moduleData, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    // Get the highest order number in this path and increment
    const modulesRef = collection(db, 'learningPaths', pathId, 'modules');
    const snapshot = await getDocs(modulesRef);
    const maxOrder = snapshot.docs.reduce((max, doc) => {
      const order = doc.data().order || 0;
      return Math.max(max, order);
    }, 0);
    
    const newModuleData = {
      ...moduleData,
      learningPathId: pathId,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(modulesRef, newModuleData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating module:', error);
    throw error;
  }
};

export const updateModule = async (pathId, moduleId, updates, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const moduleRef = doc(db, 'learningPaths', pathId, 'modules', moduleId);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    await updateDoc(moduleRef, updateData);
  } catch (error) {
    console.error('Error updating module:', error);
    throw error;
  }
};

export const deleteModule = async (pathId, moduleId, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const batch = writeBatch(db);
    
    // Delete all lessons in this module first
    const lessonsRef = collection(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons');
    const lessonsSnapshot = await getDocs(lessonsRef);
    
    lessonsSnapshot.docs.forEach(lessonDoc => {
      batch.delete(lessonDoc.ref);
    });
    
    // Delete the module
    const moduleRef = doc(db, 'learningPaths', pathId, 'modules', moduleId);
    batch.delete(moduleRef);
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting module:', error);
    throw error;
  }
};

// Lessons CRUD Operations

export const createLesson = async (pathId, moduleId, lessonData, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    // Get the highest order number in this module and increment
    const lessonsRef = collection(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons');
    const snapshot = await getDocs(lessonsRef);
    const maxOrder = snapshot.docs.reduce((max, doc) => {
      const order = doc.data().order || 0;
      return Math.max(max, order);
    }, 0);
    
    const newLessonData = {
      ...lessonData,
      lessonModuleId: moduleId,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(lessonsRef, newLessonData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

export const updateLesson = async (pathId, moduleId, lessonId, updates, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', lessonId);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    await updateDoc(lessonRef, updateData);
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

export const deleteLesson = async (pathId, moduleId, lessonId, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', lessonId);
    await deleteDoc(lessonRef);
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

// Reordering Functions

export const reorderModules = async (pathId, moduleOrders, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const batch = writeBatch(db);
    
    moduleOrders.forEach(({ moduleId, order }) => {
      const moduleRef = doc(db, 'learningPaths', pathId, 'modules', moduleId);
      batch.update(moduleRef, { order, updatedAt: new Date() });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error reordering modules:', error);
    throw error;
  }
};

export const reorderLessons = async (pathId, moduleId, lessonOrders, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const batch = writeBatch(db);
    
    lessonOrders.forEach(({ lessonId, order }) => {
      const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', lessonId);
      batch.update(lessonRef, { order, updatedAt: new Date() });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error reordering lessons:', error);
    throw error;
  }
};

export const reorderPages = async (pathId, moduleId, lessonId, pageOrders, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    // Get the lesson document
    const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', lessonId);
    const lessonDoc = await getDoc(lessonRef);
    
    if (!lessonDoc.exists()) {
      throw new Error('Lesson not found');
    }
    
    const lessonData = lessonDoc.data();
    const content = lessonData.content || [];
    
    // Reorder the content array based on pageOrders
    const reorderedContent = pageOrders.map(({ pageIndex }) => content[pageIndex]).filter(Boolean);
    
    await updateDoc(lessonRef, {
      content: reorderedContent,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error reordering pages:', error);
    throw error;
  }
};

// Bulk Operations for YouTube-generated content

export const createLearningPathWithModules = async (pathData, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const batch = writeBatch(db);
    
    // Create the learning path
    const pathRef = doc(collection(db, 'learningPaths'));
    const pathDataToSave = {
      ...pathData,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      order: 0 // Will be updated later if needed
    };
    delete pathDataToSave.modules; // Remove modules from path data
    
    batch.set(pathRef, pathDataToSave);
    
    // Create modules and lessons
    if (pathData.modules && pathData.modules.length > 0) {
      pathData.modules.forEach((moduleData, moduleIndex) => {
        const moduleRef = doc(collection(db, 'learningPaths', pathRef.id, 'modules'));
        const moduleDataToSave = {
          ...moduleData,
          learningPathId: pathRef.id,
          order: moduleIndex + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        delete moduleDataToSave.lessons; // Remove lessons from module data
        
        batch.set(moduleRef, moduleDataToSave);
        
        // Create lessons
        if (moduleData.lessons && moduleData.lessons.length > 0) {
          moduleData.lessons.forEach((lessonData, lessonIndex) => {
            const lessonRef = doc(collection(db, 'learningPaths', pathRef.id, 'modules', moduleRef.id, 'lessons'));
            const lessonDataToSave = {
              ...lessonData,
              lessonModuleId: moduleRef.id,
              order: lessonIndex + 1,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            batch.set(lessonRef, lessonDataToSave);
          });
        }
      });
    }
    
    await batch.commit();
    return pathRef.id;
  } catch (error) {
    console.error('Error creating learning path with modules:', error);
    throw error;
  }
};

// Search and Filter Functions

export const searchContent = async (searchTerm, type = 'all') => {
  try {
    const results = [];
    
    if (type === 'all' || type === 'paths') {
      const pathsRef = collection(db, 'learningPaths');
      const pathsSnapshot = await getDocs(pathsRef);
      
      pathsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            type: 'path',
            id: doc.id,
            title: data.title,
            description: data.description
          });
        }
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
};

// Content Analytics

export const getContentStats = async () => {
  try {
    const stats = {
      totalPaths: 0,
      totalModules: 0,
      totalLessons: 0,
      publishedPaths: 0,
      premiumPaths: 0
    };
    
    const pathsRef = collection(db, 'learningPaths');
    const pathsSnapshot = await getDocs(pathsRef);
    
    stats.totalPaths = pathsSnapshot.size;
    
    for (const pathDoc of pathsSnapshot.docs) {
      const pathData = pathDoc.data();
      
      if (pathData.published) stats.publishedPaths++;
      if (pathData.isPremium) stats.premiumPaths++;
      
      // Count modules
      const modulesRef = collection(db, 'learningPaths', pathDoc.id, 'modules');
      const modulesSnapshot = await getDocs(modulesRef);
      stats.totalModules += modulesSnapshot.size;
      
      // Count lessons
      for (const moduleDoc of modulesSnapshot.docs) {
        const lessonsRef = collection(db, 'learningPaths', pathDoc.id, 'modules', moduleDoc.id, 'lessons');
        const lessonsSnapshot = await getDocs(lessonsRef);
        stats.totalLessons += lessonsSnapshot.size;
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting content stats:', error);
    throw error;
  }
};

// Validation Functions

export const validateLearningPath = (pathData) => {
  const errors = [];
  
  if (!pathData.title || pathData.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!pathData.description || pathData.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (pathData.targetAudience && !Array.isArray(pathData.targetAudience)) {
    errors.push('Target audience must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateModule = (moduleData) => {
  const errors = [];
  
  if (!moduleData.title || moduleData.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!moduleData.description || moduleData.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateLesson = (lessonData) => {
  const errors = [];
  
  if (!lessonData.title || lessonData.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!lessonData.lessonType) {
    errors.push('Lesson type is required');
  }
  
  if (!lessonData.content || !Array.isArray(lessonData.content) || lessonData.content.length === 0) {
    errors.push('Content is required and must be an array with at least one item');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const moveLesson = async (pathId, fromModuleId, toModuleId, lessonId, newOrder, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const batch = writeBatch(db);
    
    // Get the lesson data from the source module
    const sourceRef = doc(db, 'learningPaths', pathId, 'modules', fromModuleId, 'lessons', lessonId);
    const sourceSnap = await getDoc(sourceRef);
    
    if (!sourceSnap.exists()) {
      throw new Error('Lesson not found');
    }
    
    const lessonData = sourceSnap.data();
    
    // Create lesson in destination module
    const destRef = doc(db, 'learningPaths', pathId, 'modules', toModuleId, 'lessons', lessonId);
    const updatedLessonData = {
      ...lessonData,
      lessonModuleId: toModuleId,
      order: newOrder,
      updatedAt: new Date()
    };
    
    batch.set(destRef, updatedLessonData);
    
    // Delete lesson from source module (only if moving to different module)
    if (fromModuleId !== toModuleId) {
      batch.delete(sourceRef);
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error moving lesson:', error);
    throw error;
  }
};

export const getAllModulesFlat = async () => {
  try {
    const pathsRef = collection(db, 'learningPaths');
    const pathsSnapshot = await getDocs(pathsRef);
    
    const modules = [];
    
    for (const pathDoc of pathsSnapshot.docs) {
      const pathData = { id: pathDoc.id, ...pathDoc.data() };
      
      const modulesRef = collection(db, 'learningPaths', pathDoc.id, 'modules');
      const modulesQ = query(modulesRef, orderBy('order', 'asc'));
      const modulesSnapshot = await getDocs(modulesQ);
      
      for (const moduleDoc of modulesSnapshot.docs) {
        const moduleData = { 
          id: moduleDoc.id, 
          pathId: pathDoc.id,
          pathTitle: pathData.title,
          ...moduleDoc.data() 
        };
        
        // Get lessons for this module
        const lessonsRef = collection(db, 'learningPaths', pathDoc.id, 'modules', moduleDoc.id, 'lessons');
        const lessonsQ = query(lessonsRef, orderBy('order', 'asc'));
        const lessonsSnapshot = await getDocs(lessonsQ);
        
        const lessons = lessonsSnapshot.docs.map(lessonDoc => ({
          id: lessonDoc.id,
          pathId: pathDoc.id,
          moduleId: moduleDoc.id,
          ...lessonDoc.data()
        }));
        
        moduleData.lessons = lessons;
        modules.push(moduleData);
      }
    }
    
    return modules;
  } catch (error) {
    console.error('Error fetching all modules:', error);
    throw error;
  }
};

export const updateLessonPages = async (pathId, moduleId, lessonId, pages, userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', lessonId);
    const updateData = {
      content: pages,
      updatedAt: new Date()
    };
    
    await updateDoc(lessonRef, updateData);
  } catch (error) {
    console.error('Error updating lesson pages:', error);
    throw error;
  }
};

export const getLessonWithPages = async (pathId, moduleId, lessonId) => {
  try {
    const lessonRef = doc(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons', lessonId);
    const lessonSnap = await getDoc(lessonRef);
    
    if (!lessonSnap.exists()) {
      throw new Error('Lesson not found');
    }
    
    return {
      id: lessonSnap.id,
      pathId,
      moduleId,
      ...lessonSnap.data()
    };
  } catch (error) {
    console.error('Error fetching lesson with pages:', error);
    throw error;
  }
};

export const cleanupFakeData = async (userId) => {
  try {
    if (userId) {
      await checkAdminPermission(userId);
    }
    
    // Define the real modules we want to keep
    const realModules = [
      'ai-foundations',
      'interactive-coding'
    ];
    
    const realPaths = [
      'prompt-engineering-mastery',
      'vibe-coding'
    ];

    const batch = writeBatch(db);
    const pathsRef = collection(db, 'learningPaths');
    const pathsSnapshot = await getDocs(pathsRef);
    
    let deletedPaths = 0;
    let deletedModules = 0;
    let deletedLessons = 0;

    for (const pathDoc of pathsSnapshot.docs) {
      const pathId = pathDoc.id;
      
      // If this is not a real path, delete it entirely
      if (!realPaths.includes(pathId)) {
        // Delete all modules and lessons first
        const modulesRef = collection(db, 'learningPaths', pathId, 'modules');
        const modulesSnapshot = await getDocs(modulesRef);
        
        for (const moduleDoc of modulesSnapshot.docs) {
          const lessonsRef = collection(db, 'learningPaths', pathId, 'modules', moduleDoc.id, 'lessons');
          const lessonsSnapshot = await getDocs(lessonsRef);
          
          lessonsSnapshot.docs.forEach(lessonDoc => {
            batch.delete(lessonDoc.ref);
            deletedLessons++;
          });
          
          batch.delete(moduleDoc.ref);
          deletedModules++;
        }
        
        batch.delete(pathDoc.ref);
        deletedPaths++;
      } else {
        // This is a real path, but check modules within it
        const modulesRef = collection(db, 'learningPaths', pathId, 'modules');
        const modulesSnapshot = await getDocs(modulesRef);
        
        for (const moduleDoc of modulesSnapshot.docs) {
          const moduleId = moduleDoc.id;
          
          // If this module is not in our real modules list, delete it
          if (!realModules.includes(moduleId)) {
            const lessonsRef = collection(db, 'learningPaths', pathId, 'modules', moduleId, 'lessons');
            const lessonsSnapshot = await getDocs(lessonsRef);
            
            lessonsSnapshot.docs.forEach(lessonDoc => {
              batch.delete(lessonDoc.ref);
              deletedLessons++;
            });
            
            batch.delete(moduleDoc.ref);
            deletedModules++;
          }
        }
      }
    }

    await batch.commit();
    
    return {
      success: true,
      message: `Cleanup completed: ${deletedPaths} paths, ${deletedModules} modules, and ${deletedLessons} lessons removed`,
      stats: {
        deletedPaths,
        deletedModules,
        deletedLessons
      }
    };
    
  } catch (error) {
    console.error('Error cleaning up fake data:', error);
    throw error;
  }
}; 