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

## Product rules implemented

- Seven multiple-choice questions every local calendar day.
- The score is hidden until the seventh question.
- A correct answer reveals a concise explanation; a wrong answer reveals the correct fact, why the selected choice missed, and a memory cue.
- Every explanation retains a direct Qur'an or hadith source link.
- Daily completion keeps the normal streak; the score does not need to be perfect.
- Sunday's daily quiz unlocks a longer weekly exam containing every question served from Monday through Saturday, followed by five fresh bonus questions.
- A complete six-day week produces a 47-question exam: 42 weekday questions plus five bonus questions.
- The weekly exam pass mark is 70%, rounded up to the next whole question.
- Failing the weekly review resets the streak immediately.
- Skipping Sunday leaves the review open through Monday; expiry resets the streak.
- The weekly review includes all of that week's weekday material and presents previously missed questions first.
- Daily-question history is stored locally and the selector enforces a 304-day repeat lockout.

## Accuracy and content capacity

The MVP includes 84 manually written, source-linked starter questions across seven topics. The app never invents a fallback question or silently reuses an item inside the 304-day lockout.

Ten months of seven unique daily questions requires at least 2,128 independently reviewed questions (304 × 7), plus a reserve for withdrawals or corrections. The lockout and source schema are production-ready, but the starter library is intentionally not misrepresented as the full launch corpus. The next content phase should use a two-person review workflow: one qualified Islamic reviewer and one copy/logic reviewer, with every revision retaining its source link and review status.

## Design references

- `design/desktop-concept.png`
- `design/mobile-concept.png`

The implementation follows the DailyDeen black/emerald editorial design language while using a quiz-specific progress rail, answer rows, feedback state, results state, and weekly-exam rail.

## Publishing

See `PLAY_STORE.md` for the remaining identity, signing, privacy, content-review, testing, and Play Console work.
