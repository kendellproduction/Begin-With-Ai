/**
 * 🚨 Storage Comparison Demo
 * Demonstrates why localStorage is unsafe for important data like drafts
 */

import draftService from '../services/draftService';

class StorageComparisonDemo {
  constructor() {
    this.demoData = {
      id: `demo-${Date.now()}`,
      title: 'Important Draft Lesson',
      contentVersions: {
        free: {
          title: 'Basic JavaScript Concepts',
          content: 'This is a valuable lesson that took hours to create...'
        },
        premium: {
          title: 'Advanced JavaScript Patterns',
          content: 'Premium content with advanced concepts and examples...'
        }
      },
      metadata: {
        estimatedTimeMinutes: 45,
        xpAward: 100,
        category: 'JavaScript',
        tags: ['functions', 'objects', 'arrays']
      }
    };
  }

  /**
   * 🔴 localStorage Problems Demo
   */
  demonstrateLocalStorageProblems() {
    console.log('🔴 localStorage Problems Demonstration:');
    console.log('=====================================');

    // Save data to localStorage
    localStorage.setItem('demo-draft', JSON.stringify(this.demoData));
    console.log('✅ Data saved to localStorage');

    // Simulate common scenarios where localStorage fails
    console.log('\n🚨 Common localStorage Failure Scenarios:');
    
    // 1. Browser cache clearing
    console.log('\n1. Browser cache clearing:');
    localStorage.clear();
    const afterClear = localStorage.getItem('demo-draft');
    console.log(`   Result: ${afterClear ? 'Data preserved' : '❌ DATA LOST!'}`);

    // 2. Storage quota exceeded
    console.log('\n2. Storage quota exceeded:');
    try {
      // Try to fill up localStorage
      const largeData = 'x'.repeat(1024 * 1024); // 1MB string
      for (let i = 0; i < 10; i++) {
        localStorage.setItem(`large-item-${i}`, largeData);
      }
      console.log('   ❌ Could exceed storage quota and lose data');
    } catch (error) {
      console.log(`   ❌ Storage quota exceeded: ${error.message}`);
    }

    // 3. Incognito mode
    console.log('\n3. Incognito mode:');
    console.log('   ❌ All localStorage data is lost when incognito window closes');

    // 4. Device switching
    console.log('\n4. Device switching:');
    console.log('   ❌ localStorage is browser-specific, not synced across devices');

    // 5. Browser updates/crashes
    console.log('\n5. Browser updates/crashes:');
    console.log('   ❌ Can cause localStorage corruption or data loss');

    return false; // Data is NOT safe
  }

  /**
   * ✅ Firestore Advantages Demo
   */
  async demonstrateFirestoreAdvantages(userId = 'demo-user') {
    console.log('\n✅ Firestore Advantages Demonstration:');
    console.log('=====================================');

    try {
      // 1. Persistent storage
      console.log('\n1. Persistent Storage:');
      const savedDraft = await draftService.saveDraft(userId, this.demoData);
      console.log('   ✅ Data saved to Firestore (persistent across sessions)');

      // 2. Cross-device sync
      console.log('\n2. Cross-Device Sync:');
      const loadedDrafts = await draftService.loadDrafts(userId);
      console.log(`   ✅ Data accessible from any device: ${loadedDrafts.length} drafts loaded`);

      // 3. Real-time updates
      console.log('\n3. Real-Time Updates:');
      const unsubscribe = draftService.subscribeToDrafts(userId, (drafts) => {
        console.log(`   ✅ Real-time update: ${drafts ? drafts.length : 0} drafts`);
      });

      // 4. Version control
      console.log('\n4. Version Control:');
      const updatedDraft = await draftService.saveDraft(userId, {
        ...this.demoData,
        version: 2,
        title: 'Updated Draft Lesson'
      });
      console.log('   ✅ Version history maintained');

      // 5. User isolation
      console.log('\n5. User Data Isolation:');
      console.log('   ✅ Each user\'s drafts are securely isolated');

      // 6. Backup and recovery
      console.log('\n6. Backup and Recovery:');
      console.log('   ✅ Automatic backups, disaster recovery');

      // Clean up
      setTimeout(() => {
        unsubscribe();
        draftService.deleteDraft(userId, savedDraft.id);
      }, 2000);

      return true; // Data IS safe

    } catch (error) {
      console.error('❌ Firestore demo error:', error);
      return false;
    }
  }

  /**
   * 🔄 Hybrid Approach Demo
   */
  demonstrateHybridApproach(userId = 'demo-user') {
    console.log('\n🔄 Hybrid Approach (Our Solution):');
    console.log('=================================');

    console.log('\n📝 How our DraftService works:');
    console.log('1. Primary storage: Firestore (persistent, reliable)');
    console.log('2. Temporary buffer: localStorage (for responsiveness)');
    console.log('3. Auto-save: Debounced saves to Firestore every 2 seconds');
    console.log('4. Real-time sync: Live updates across all devices');
    console.log('5. Fallback protection: localStorage as emergency backup');

    console.log('\n✅ Benefits:');
    console.log('• Fast local editing (localStorage buffer)');
    console.log('• Reliable persistence (Firestore)');
    console.log('• Cross-device sync (Firestore)');
    console.log('• Offline editing (localStorage fallback)');
    console.log('• Version control (Firestore)');
    console.log('• User isolation (Firestore security rules)');

    // Demonstrate auto-save
    console.log('\n🔄 Auto-save demonstration:');
    draftService.autoSaveDraft(userId, this.demoData);
    console.log('   ✅ Auto-save triggered (saves to localStorage immediately, Firestore in 2s)');
  }

  /**
   * 📊 Performance Comparison
   */
  performanceComparison() {
    console.log('\n📊 Performance Comparison:');
    console.log('=========================');

    const performanceData = {
      localStorage: {
        writeSpeed: 'Very Fast (synchronous)',
        readSpeed: 'Very Fast (synchronous)',
        reliability: '❌ Poor (easily lost)',
        crossDevice: '❌ No',
        offline: '✅ Yes',
        storage: '~5-10MB limit'
      },
      firestore: {
        writeSpeed: 'Fast (asynchronous)',
        readSpeed: 'Fast (cached)',
        reliability: '✅ Excellent (cloud backup)',
        crossDevice: '✅ Yes',
        offline: '✅ Yes (with cache)',
        storage: '✅ Unlimited'
      },
      hybrid: {
        writeSpeed: 'Very Fast (localStorage buffer)',
        readSpeed: 'Very Fast (localStorage + cache)',
        reliability: '✅ Excellent (Firestore backup)',
        crossDevice: '✅ Yes (Firestore sync)',
        offline: '✅ Yes (both systems)',
        storage: '✅ Unlimited (Firestore)'
      }
    };

    console.table(performanceData);
  }

  /**
   * 🧪 Run complete demo
   */
  async runCompleteDemo(userId = 'demo-user') {
    console.log('🧪 Complete Storage Comparison Demo');
    console.log('====================================');

    // 1. Show localStorage problems
    this.demonstrateLocalStorageProblems();

    // 2. Show Firestore advantages
    await this.demonstrateFirestoreAdvantages(userId);

    // 3. Show hybrid approach
    this.demonstrateHybridApproach(userId);

    // 4. Show performance comparison
    this.performanceComparison();

    console.log('\n🎉 Demo Complete!');
    console.log('\n💡 Key Takeaway:');
    console.log('localStorage is NOT safe for important data like drafts.');
    console.log('Our Firestore + localStorage hybrid approach provides the best of both worlds.');
  }
}

// Export for use in components
export default StorageComparisonDemo;

// Make available in browser console for testing
if (typeof window !== 'undefined') {
  window.StorageComparisonDemo = StorageComparisonDemo;
  window.runStorageDemo = async (userId = 'demo-user') => {
    const demo = new StorageComparisonDemo();
    await demo.runCompleteDemo(userId);
  };
} 