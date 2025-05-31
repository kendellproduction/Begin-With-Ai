// Audio utilities for lesson feedback
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.isEnabled = true;
  }

  // Initialize audio context (needed for user interaction)
  async initAudio() {
    if (!this.audioContext && window.AudioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Create a success chime using Web Audio API
  playSuccessChime() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      // Create oscillator for the chime
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Connect audio nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Configure the chime sound (pleasant major chord)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
      
      // Create envelope for smooth sound
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
      
      // Play the chime
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
      
      // Add a second harmonic for richness
      setTimeout(() => {
        if (!this.audioContext) return;
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode2 = this.audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(this.audioContext.destination);
        
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(659.25, this.audioContext.currentTime); // E5
        
        gainNode2.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
        gainNode2.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
        
        oscillator2.start(this.audioContext.currentTime);
        oscillator2.stop(this.audioContext.currentTime + 0.4);
      }, 100);
      
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  // Play error sound (lower pitch, shorter)
  playErrorSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
      
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  // Toggle audio on/off
  toggleAudio() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  // Cleanup
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Create singleton instance
export const audioManager = new AudioManager();

// Helper functions
export const playSuccessChime = () => audioManager.playSuccessChime();
export const playErrorSound = () => audioManager.playErrorSound();
export const initAudio = () => audioManager.initAudio();
export const toggleAudio = () => audioManager.toggleAudio(); 