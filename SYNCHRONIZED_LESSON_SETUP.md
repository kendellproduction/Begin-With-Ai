# Synchronized Lesson Viewer Setup

## Overview

You now have a synchronized audio lesson viewer that combines your "The Incredible Story of AI" audio file with the lesson content, automatically pausing at quiz points to ensure students understand what they're learning.

## Features

✅ **Audio Synchronization**: Content highlights as the audio plays  
✅ **Automatic Pause**: Audio pauses when students reach quiz questions  
✅ **Resume on Quiz Completion**: Audio resumes after students answer correctly  
✅ **Visual Feedback**: Current section is highlighted with a subtle glow  
✅ **Progress Tracking**: Students earn XP for quiz completion and lesson progress  
✅ **Mobile Responsive**: Works on all devices with touch controls  

## How to Access

### For Users:
- Navigate to any History of AI lesson (`/lessons/history-of-ai` or `/lessons/welcome-ai-revolution`)
- The system automatically routes to the synchronized viewer
- Audio controls appear at the top of the screen

### For Testing:
- Direct access: `/sync-demo` (bypasses lesson routing)
- Direct lesson sync: `/lesson-sync/history-of-ai`

## Audio Timestamps Configuration

The synchronized experience relies on timestamps that you can easily adjust in the component. Here's where to modify them:

### File: `src/components/SynchronizedLessonViewer.js`

Look for the `audioTimestamps` object around line 35:

```javascript
const audioTimestamps = {
  section1_start: 0,        // The Wartime Origins and Early Dreams
  section1_quiz: 480,       // 8 minutes - pause for first quiz
  section2_start: 540,      // Internet Era and Machine Learning Revolution  
  section2_quiz: 1020,      // 17 minutes - pause for second quiz
  section3_start: 1080,     // ChatGPT Revolution and What's Next
  section3_end: 1620        // 27 minutes - end of lesson
};
```

### How to Adjust Timestamps:

1. **Listen to your audio file** and note when each section begins
2. **Identify quiz pause points** - where you want the audio to pause for student interaction
3. **Update the timestamps** (in seconds):
   - `section1_start: 0` - Beginning of first section
   - `section1_quiz: 480` - When to pause for first quiz (8 minutes)
   - `section2_start: 540` - When second section begins (9 minutes)
   - `section2_quiz: 1020` - When to pause for second quiz (17 minutes)
   - `section3_start: 1080` - When third section begins (18 minutes)
   - `section3_end: 1620` - Total lesson duration (27 minutes)

### Example: Converting Minutes to Seconds
- 2 minutes 30 seconds = 150 seconds
- 5 minutes 45 seconds = 345 seconds
- 10 minutes = 600 seconds

## Audio File Requirements

- **Current file**: `The Incredible Story of AI_ From Turing to Today.wav`
- **Location**: `/public/` (accessible at root URL)
- **Supported formats**: MP3, WAV, MP4 (audio), OGG
- **Recommended**: MP3 for best browser compatibility

### To Replace Audio:
1. Place your new audio file in the `/public/` directory
2. Update the `src` attribute in `SynchronizedLessonViewer.js`:
   ```javascript
   <audio
     ref={audioRef}
     src="/your-new-audio-file.mp3"  // Update this line
     preload="metadata"
   />
   ```

## Lesson Content Structure

The system automatically converts your existing lesson slides into synchronized sections:

- **Content Sections**: Long-form explanatory content that syncs with audio
- **Quiz Sections**: Interactive questions that pause audio
- **Automatic Unlocking**: Next section unlocks after quiz completion

## Customization Options

### Visual Highlighting
You can adjust the highlight effects in the component:
- Ring color: `ring-blue-500/30`
- Background glow: `shadow-2xl`
- Transition duration: `duration: 0.5`

### Audio Controls
- **Skip backward**: 15 seconds
- **Skip forward**: 30 seconds  
- **Click to seek**: Click anywhere on progress bar
- **Pause protection**: Play button disabled during quiz pauses

### Progress Tracking
- **Quiz completion**: 50 XP per correct answer
- **Lesson completion**: 200 XP total
- **Badges**: Automatic on lesson completion

## Testing Your Setup

1. **Start the development server**: `npm run dev-session-start`
2. **Navigate to**: `http://localhost:3001/sync-demo`
3. **Test audio playback**: Ensure audio loads and plays
4. **Check synchronization**: Verify content highlights match audio
5. **Test quiz pausing**: Confirm audio pauses at quiz sections
6. **Test resume**: Ensure audio resumes after correct answers

## Troubleshooting

### Audio Won't Load
- Check file is in `/public/` directory
- Verify file path in component matches actual filename
- Test audio file plays in browser directly: `http://localhost:3001/your-audio-file.wav`

### Timing Issues
- Use browser developer tools to inspect current audio time
- Add `console.log(currentTime)` to debug timestamp matching
- Adjust timestamps by ±5-10 seconds for better synchronization

### Performance Issues
- Large audio files (>50MB) may take time to load
- Consider compressing audio while maintaining quality
- Use MP3 format for better compression and compatibility

## Future Enhancements

You can easily extend this system:

- **Multiple audio tracks**: Different narrators or languages
- **Chapter navigation**: Jump to specific sections
- **Speed controls**: Already implemented (0.5x to 2x speed)
- **Closed captions**: Add subtitle synchronization
- **Analytics**: Track where students pause/replay most

## Need Help?

The synchronized lesson viewer is designed to be easily customizable. Most changes only require updating the timestamps object and optionally the audio file path. The system handles all the complex synchronization logic automatically.

For major customizations, focus on:
1. `audioTimestamps` object for timing
2. `createSynchronizedSections()` function for content structure
3. `checkForQuizPause()` function for pause logic 