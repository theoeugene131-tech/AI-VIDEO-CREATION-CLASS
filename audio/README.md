# Course Audio

This folder contains the narration audio for each lesson.

## Current files

`lesson-1.mp3` … `lesson-6.mp3` — narration generated with Microsoft's neural text-to-speech voice (Edge TTS, en-US-GuyNeural). Good quality, small file size.

## Upgrade to studio quality (recommended)

This is exactly what Lesson 4 of the course teaches. To replace the placeholders:

1. Open **ElevenLabs** → **Text to Speech**.
2. Open `../lessons/lesson-N.md` and copy the **Audio narration script** section (clean, word-for-word narration — already formatted for TTS).
3. Choose a voice — or clone your own voice (Lesson 4 shows how, with consent).
4. Export as **MP3** and save it in this folder as `lesson-N.mp3` (same names as the WAVs).

The course player (`course-player.html`) tries `audio/lesson-N.wav` first — simply replace the WAV files with your MP3s (same file names) and the player will use them automatically. You can delete the WAVs afterwards to keep the package small.

## Regenerating the placeholder WAVs

If you ever need to regenerate them, run the included generator script (Windows only):

```powershell
powershell -File gen-course-audio.ps1
```

(Requires the Windows Speech API — available on any Windows PC, no install needed.)
