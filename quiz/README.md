# Daily Deen Quiz — web and Android app

This folder is a separate, dependency-free web app so the existing DailyDeen reading app remains untouched. `Daily Deen Quiz` is a working title and can be changed before launch.

## Run it

```powershell
cd quiz
npm run dev
```

The server prints two kinds of links:

- Open `http://localhost:4180` on this computer.
- Open the printed `Device` URL on a phone or tablet connected to the same Wi-Fi network.

The preview binds to `0.0.0.0` on port `4180`. If another device cannot connect, allow Node.js through Windows Firewall for private networks.

When this branch is merged into the main repository, the production web app is available at:

`https://daily-deen-seven.vercel.app/quiz/`

The browser version uses the same quiz source, animations, explanations, streak rules, and weekly-exam logic as the Android app.

## Android app

This project also includes a Capacitor 8 Android wrapper. It supports Android 7 and newer, currently targets Android 16 / API 36, and uses the development application ID `com.zubairmohammed.dailydeenquiz`.

```powershell
# Copy the current web app into the Android project
npm run android:sync

# Build a locally installable debug APK
npm run android:apk

# Open the native project in Android Studio
npm run android:open
```

The debug APK is created at `android/app/build/outputs/apk/debug/app-debug.apk`. Use `npm run android:bundle` to build a release Android App Bundle. A Play-uploadable release must also be signed with a protected upload key; see `PLAY_STORE.md`.

The GitHub debug-APK workflow is a fallback when the local Windows Java build environment cannot compile. Its downloaded artifact is signed with a temporary cloud debug key. If replacing a version installed from this computer, re-sign that APK with this computer's existing Android debug keystore before installing; otherwise Android rejects the update.

## Product rules implemented

- Seven multiple-choice questions every local calendar day.
- The score is hidden until the seventh question.
- A correct answer reveals a concise explanation; a wrong answer reveals the correct fact, why the selected choice missed, and a memory cue.
- Every explanation retains a direct Quran.com or Sunnah.com source link.
- Daily completion keeps the normal streak; the score does not need to be perfect.
- Sunday's daily quiz unlocks a longer weekly exam containing every question served from Monday through Saturday, followed by five fresh bonus questions.
- A complete six-day week produces a 47-question exam: 42 weekday questions plus five bonus questions.
- The weekly exam pass mark is 70%, rounded up to the next whole question.
- Failing the weekly review resets the streak immediately.
- Skipping Sunday leaves the review open through Monday; expiry resets the streak.
- The weekly review includes all of that week's weekday material and presents previously missed questions first.
- Every daily question and fresh weekly bonus question is reserved in local history as soon as its quiz is created, even if the quiz is not finished. The selector enforces a 731-day lockout (at least two calendar years, including a leap day) on those IDs. Weekly review questions intentionally repeat material from the preceding Monday–Saturday.
- The v4 content migration preserves earlier question history and saved quiz IDs, keeps the streak and completed results, and replaces only an incomplete daily quiz whose questions are no longer active.

## Accuracy and content capacity

The library contains 5,783 active source-linked questions: 101 short authored questions, including 17 new Sahih al-Bukhari questions, and 5,682 Qur'an verse-recognition questions. A 731-day span needs 5,117 daily questions plus up to 525 fresh weekly bonus questions; this bank has 141 more than that conservative maximum. The automated check simulates 731 days with every weekly exam and rejects any repeat inside the lockout.

The verse questions use Quran.com's M.A.S. Abdel Haleem translation resource 85 for plainer English. Each question shows a short excerpt and links to the exact ayah for context. The shipped pack stores verse references and excerpt positions, not translation text; the app fetches the English wording when a question appears. An internet connection is therefore needed for verse questions on both web and Android. Hadith questions link only to Sahih al-Bukhari and Sahih Muslim on Sunnah.com. The generated verse questions are reference/translation checks, not individually reviewed interpretive claims; the authored hadith and Qur'an facts should still receive qualified Islamic review before public release.

Regenerate and validate the committed passage pack with:

```powershell
node scripts/generate-quran-pack.mjs
npm run check
```

The generator rejects overly short, overly long, and duplicate passage text before selecting a broad sample across the surahs. Saved data is local to each browser or APK installation: clearing app data or using a second device without sync can restart the history. Cross-device non-repeat requires a future account/sync system.

## Design references

- `design/desktop-concept.png`
- `design/mobile-concept.png`

The implementation follows the DailyDeen black/emerald editorial design language while using a quiz-specific progress rail, answer rows, feedback state, results state, and weekly-exam rail.

## Publishing

See `PLAY_STORE.md` for the remaining identity, signing, privacy, content-review, testing, and Play Console work.
