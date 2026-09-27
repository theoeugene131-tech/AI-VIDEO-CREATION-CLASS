# AI Video Creation for Beginners — Standalone Course Package

A complete, self-contained course: 6 lessons with audio narration, video scripts, quizzes, and exercises. No platform, account, or internet connection required to use it.

## What is inside

```
ai-video-creation-course/
├── README.md                     ← you are here
├── course-player.html            ← the standalone course (double-click to open)
├── lessons/
│   ├── lesson-1.md               ← full content: narration script, video script, quiz, exercise
│   ├── lesson-2.md
│   ├── lesson-3.md
│   ├── lesson-4.md
│   ├── lesson-5.md
│   └── lesson-6.md
├── audio/
│   ├── lesson-1.wav … lesson-6.wav   ← narration audio (placeholder quality — see below)
│   └── README.md                 ← how to regenerate studio-quality audio
└── assets/
    └── prompt-cheat-sheet.md     ← bonus toolkit for students
```

## How to use the course

1. **Open `course-player.html`** in any browser (Chrome, Edge, phone, tablet — anything).
2. Work through lessons 1–6 in order. Each lesson has:
   - **Audio** — press play and listen (or read the full lesson text on screen)
   - **Video script** — what appears on screen, with timestamps (for recording your own version)
   - **Quiz** — 5 questions per lesson with instant feedback and scoring
   - **Exercise** — hands-on homework
3. Progress (completed lessons + quiz scores) is saved automatically in the browser.

## About the audio files

The included `.wav` files are **placeholder narration** generated with Windows' built-in speech voice, so the course works out of the box. They are functional but robotic.

To replace them with studio-quality narration (which is exactly what lesson 4 teaches):

1. Open **ElevenLabs** → Text to Speech.
2. Copy each lesson's narration script from `lessons/lesson-N.md` (the "Audio narration script" section).
3. Generate with your chosen voice (or your own cloned voice).
4. Export as `.mp3` and save it as `audio/lesson-N.mp3` (keep the same file names).
5. The player will automatically use your new files — no other changes needed.

## Recording your own video version

Each lesson file contains a **video script** table (time | on screen | audio). Use it to:

- Record a screen recording of the demos (OBS Studio is free),
- Record yourself on camera for the intro/outro (your phone is enough),
- Or generate the whole thing with AI tools and narrate over it.

When your videos are ready, drop them into `video/` as `lesson-1.mp4` … `lesson-6.mp4` and add a video player section to `course-player.html` — or simply upload them as unlisted YouTube videos and paste the links into your store's course page (`data/products.js` → `videoUrl`).

## Selling this course

This package is designed to be sold through your Naija Digital Store:

1. Record the 6 lesson videos (or package the audio + text as a text-and-audio course).
2. Zip the folder (minus the placeholder audio if you have real narration).
3. Add it as a product in `data/products.js` — either as a `file` product (the zip) or as a `course` product with `videoUrl` links per lesson.
4. The store's course page (`app/course/[token]/page.js`) delivers it automatically after payment.

## Course details

- **Title:** AI Video Creation for Beginners
- **Lessons:** 6 (What You Need to Get Started → Getting Paid for This Skill)
- **Tools covered:** Runway, Pika, Kling, Google Veo, ElevenLabs, CapCut
- **Skill level:** Absolute beginner — no camera, editing degree, or coding required
