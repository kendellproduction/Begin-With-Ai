import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  // View preferences
  isPremiumMode: false,
  isMobileView: false,
  
  // Content editing state
  currentLesson: null,
  currentLessonDraft: null,
  unsavedChanges: false,
  
  // Content versions (Free/Premium)
  contentVersions: {
    free: null,
    premium: null
  },
  
  // Draft management
  drafts: [],
  
  // UI state
  sidebarCollapsed: false,
  activePanel: 'dashboard'
};

// Action types
const ActionTypes = {
  // View preferences
  SET_PREMIUM_MODE: 'SET_PREMIUM_MODE',
  SET_MOBILE_VIEW: 'SET_MOBILE_VIEW',
  SET_SIDEBAR_COLLAPSED: 'SET_SIDEBAR_COLLAPSED',
  SET_ACTIVE_PANEL: 'SET_ACTIVE_PANEL',
  
  // Content editing
  SET_CURRENT_LESSON: 'SET_CURRENT_LESSON',
  SET_UNSAVED_CHANGES: 'SET_UNSAVED_CHANGES',
  
  // Content versions
  SET_CONTENT_VERSION: 'SET_CONTENT_VERSION',
  UPDATE_CONTENT_VERSION: 'UPDATE_CONTENT_VERSION',
  
  // Draft management
  SAVE_DRAFT: 'SAVE_DRAFT',
  LOAD_DRAFT: 'LOAD_DRAFT',
  DELETE_DRAFT: 'DELETE_DRAFT',
  SET_DRAFTS: 'SET_DRAFTS',
  
  // Reset state
  RESET_STATE: 'RESET_STATE'
};

// Reducer function
const adminReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_PREMIUM_MODE:
      return {
        ...state,
        isPremiumMode: action.payload
      };
      
    case ActionTypes.SET_MOBILE_VIEW:
      return {
        ...state,
        isMobileView: action.payload
      };
      
    case ActionTypes.SET_SIDEBAR_COLLAPSED:
      return {
        ...state,
        sidebarCollapsed: action.payload
      };
      
    case ActionTypes.SET_ACTIVE_PANEL:
      return {
        ...state,
        activePanel: action.payload
      };
      
    case ActionTypes.SET_CURRENT_LESSON:
      return {
        ...state,
        currentLesson: action.payload,
        contentVersions: {
          free: action.payload?.freeVersion || null,
          premium: action.payload?.premiumVersion || null
        }
      };
      
    case ActionTypes.SET_UNSAVED_CHANGES:
      return {
        ...state,
        unsavedChanges: action.payload
      };
      
    case ActionTypes.SET_CONTENT_VERSION:
      return {
        ...state,
        contentVersions: {
          ...state.contentVersions,
          [action.payload.type]: action.payload.content
        },
        unsavedChanges: true
      };
      
    case ActionTypes.UPDATE_CONTENT_VERSION:
      return {
        ...state,
        contentVersions: {
          ...state.contentVersions,
          [action.payload.type]: {
            ...state.contentVersions[action.payload.type],
            ...action.payload.updates
          }
        },
        unsavedChanges: true
      };
      
    case ActionTypes.SAVE_DRAFT:
      const newDraft = {
        id: action.payload.id || `draft-${Date.now()}`,
        lessonId: action.payload.lessonId,
        title: action.payload.title,
        contentVersions: action.payload.contentVersions,
        lastModified: new Date().toISOString(),
        status: 'draft'
      };
      
      return {
        ...state,
        drafts: [...state.drafts.filter(d => d.id !== newDraft.id), newDraft],
        unsavedChanges: false
      };
      
    case ActionTypes.LOAD_DRAFT:
      const draft = state.drafts.find(d => d.id === action.payload);
      return {
        ...state,
        currentLessonDraft: draft,
        contentVersions: draft?.contentVersions || { free: null, premium: null },
        unsavedChanges: false
      };
      
    case ActionTypes.DELETE_DRAFT:
      return {
        ...state,
        drafts: state.drafts.filter(d => d.id !== action.payload),
        currentLessonDraft: state.currentLessonDraft?.id === action.payload ? null : state.currentLessonDraft
      };
      
    case ActionTypes.SET_DRAFTS:
      return {
        ...state,
        drafts: action.payload
      };
      
    case ActionTypes.RESET_STATE:
      return {
        ...initialState,
        isPremiumMode: state.isPremiumMode,
        isMobileView: state.isMobileView,
        sidebarCollapsed: state.sidebarCollapsed
      };
      
    default:
      return state;
  }
};

// Context
const AdminContext = createContext();

// Provider component
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  
  // Action creators
  const actions = {
    // View preferences
    setPremiumMode: (isPremium) => {
      dispatch({ type: ActionTypes.SET_PREMIUM_MODE, payload: isPremium });
    },
    
    setMobileView: (isMobile) => {
      dispatch({ type: ActionTypes.SET_MOBILE_VIEW, payload: isMobile });
    },
    
    setSidebarCollapsed: (collapsed) => {
      dispatch({ type: ActionTypes.SET_SIDEBAR_COLLAPSED, payload: collapsed });
    },
    
    setActivePanel: (panel) => {
      dispatch({ type: ActionTypes.SET_ACTIVE_PANEL, payload: panel });
    },
    
    // Content editing
    setCurrentLesson: (lesson) => {
      dispatch({ type: ActionTypes.SET_CURRENT_LESSON, payload: lesson });
    },
    
    setUnsavedChanges: (hasChanges) => {
      dispatch({ type: ActionTypes.SET_UNSAVED_CHANGES, payload: hasChanges });
    },
    
    // Content versions
    setContentVersion: (type, content) => {
      dispatch({ 
        type: ActionTypes.SET_CONTENT_VERSION, 
        payload: { type, content } 
      });
    },
    
    updateContentVersion: (type, updates) => {
      dispatch({ 
        type: ActionTypes.UPDATE_CONTENT_VERSION, 
        payload: { type, updates } 
      });
    },
    
    // Draft management (state only - actual Firestore operations handled in components)
    saveDraftToState: (draftData) => {
      dispatch({ type: ActionTypes.SAVE_DRAFT, payload: draftData });
    },
    
    loadDraftToState: (draftId) => {
      dispatch({ type: ActionTypes.LOAD_DRAFT, payload: draftId });
    },
    
    deleteDraftFromState: (draftId) => {
      dispatch({ type: ActionTypes.DELETE_DRAFT, payload: draftId });
    },
    
    setDrafts: (drafts) => {
      dispatch({ type: ActionTypes.SET_DRAFTS, payload: drafts });
    },
    
    // Utility functions
    getCurrentContentVersion: () => {
      return state.isPremiumMode ? state.contentVersions.premium : state.contentVersions.free;
    },
    
    saveCurrentDraft: () => {
      if (state.currentLesson || state.unsavedChanges) {
        const draftData = {
          id: state.currentLessonDraft?.id,
          lessonId: state.currentLesson?.id,
          title: state.currentLesson?.title || 'Untitled Lesson',
          contentVersions: state.contentVersions
        };
        actions.saveDraftToState(draftData);
      }
    },
    
    // Reset state
    resetState: () => {
      dispatch({ type: ActionTypes.RESET_STATE });
    }
  };
  
  return (
    <AdminContext.Provider value={{ state, actions }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use the admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Export action types for use in components
export { ActionTypes }; 