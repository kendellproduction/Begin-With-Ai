# BeginningWithAi Development Guidelines

## 🚨 Issue Prevention Rules

### 1. React Import/Export Best Practices

#### ❌ **NEVER DO:**
```javascript
// Don't import components you don't use
import Navigation from './components/Navigation';
import SwipeNavigationWrapper from './components/SwipeNavigationWrapper';

function App() {
  return <div>Hello</div>; // Navigation and SwipeNavigationWrapper never used = ERROR
}
```

#### ✅ **ALWAYS DO:**
```javascript
// Only import what you actually use
import HomePage from './pages/HomePage';

function App() {
  return <HomePage />; // Component is properly used
}
```

### 2. Component Export Standards

#### ✅ **Required Export Pattern:**
```javascript
// MyComponent.js
import React from 'react';

const MyComponent = () => {
  return <div>My Component</div>;
};

export default MyComponent; // Always default export for components
```

### 3. Dependency Management Rules

#### 🔧 **When Issues Arise:**
1. **FIRST:** Remove unused imports
2. **SECOND:** Check component exports
3. **THIRD:** Clean install if needed:
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

### 4. Git Workflow Protection

#### 📋 **Before Every Commit:**
- [ ] Check for unused imports
- [ ] Verify all components are properly exported
- [ ] Test app starts without errors
- [ ] Run `npm run build` to catch build issues

#### 🚨 **If Stuck on Issues:**
```bash
# Nuclear option - reset to last working commit
git reset --hard HEAD
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 5. Code Quality Checks

#### 🔍 **Automated Checks to Add:**
- ESLint rule for unused imports
- Pre-commit hooks
- Component export validation
- Build verification before push

### 6. Development Environment Standards

#### 📝 **Required Versions:**
- Node.js: v20.19.2 (confirmed working)
- npm: 10.8.2 (confirmed working)
- React: 18.3.1 (confirmed working)

#### 🔧 **Environment Setup:**
```bash
# Always use exact versions
npm install --exact
# Keep package-lock.json in version control
git add package-lock.json
```

### 7. Debugging Workflow

#### 🔍 **When React Errors Occur:**
1. **Check Browser Console** - Look for specific error lines
2. **Verify Imports** - Ensure all imports are used
3. **Check Exports** - Verify components export properly
4. **Test Component Isolation** - Create minimal test case
5. **Clean Dependencies** - Nuclear reset if needed

### 8. Emergency Recovery Protocol

#### 🆘 **If Multiple Days Stuck:**
1. **STOP** - Don't keep patching symptoms
2. **RESET** - Go back to last working commit
3. **ANALYZE** - Identify root cause systematically
4. **FIX** - Address root cause, not symptoms
5. **PREVENT** - Add safeguards to prevent recurrence

### 9. Component Development Standards

#### 📁 **File Organization:**
```
src/
  components/         # Reusable UI components
  pages/             # Route-level components
  contexts/          # React contexts
  hooks/             # Custom hooks
  utils/             # Utility functions
```

#### 🏗️ **Component Template:**
```javascript
import React from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### 10. Testing Requirements

#### ✅ **Before Deployment:**
- [ ] App starts without console errors
- [ ] All routes load properly
- [ ] No unused import warnings
- [ ] Build completes successfully
- [ ] All components render correctly

## 🎯 Success Metrics

- **Zero import/export errors**
- **Clean console on startup**
- **Successful builds**
- **No dependency conflicts**
- **Fast development iteration**

## 📞 Troubleshooting Contacts

- **Development Issues:** Check this guide first
- **Dependency Problems:** Clean install protocol
- **React Errors:** Import/export verification
- **Build Failures:** Environment verification

---

**Last Updated:** June 2024  
**Status:** Active Development Guidelines 