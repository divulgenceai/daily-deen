# Daily Deen

A dependency-free dark mode daily Islamic reading app.

Open `index.html` in a browser, or run a local static server:

```bash
npm run dev
```

The daily selection is calculated using `Intl.DateTimeFormat` with the `Australia/Sydney`
time zone, so it stays locked from 12:00 AM to 12:00 AM Sydney time and refreshes when the
Sydney calendar date changes.

Content is curated from Qur'an passages and authentic hadith sources, with source links and
authenticity labels shown in the interface.

Saved readings are stored locally in the browser so users can reopen saved daily sets later.

## Vercel

This is a static app. Import the GitHub repository into Vercel and use the default static
deployment settings. No build output directory is required.

## Native iOS and Android apps

This repo also includes Capacitor native projects that wrap the same static app.

```bash
npm install
npm run sync
```

Useful scripts:

- `npm run build:web` copies the shipped web files into `www/`.
- `npm run build:android:debug` builds a local Android debug APK on Windows when JDK 21 and the Android SDK are installed.
- `npm run sync` rebuilds `www/` and syncs it into both native projects.
- `npm run sync:android` syncs Android only.
- `npm run sync:ios` syncs iOS only.
- `npm run open:android` opens Android Studio.
- `npm run open:ios` opens Xcode.

Current development app identity:

- App name: `Daily Deen`
- App/package ID: `com.zubibair.dailydeen`

Change the ID before the first App Store or Play Store release only if you want a different permanent bundle/package identifier.

Android can be built locally with Android Studio or Gradle after installing the Android SDK and JDK 21. On this Windows machine, the Android SDK is expected at `C:\Users\Zubair Mohammed\AppData\Local\Android\Sdk` and JDK 21 can live under `C:\Users\Zubair Mohammed\AppData\Local\Programs\Eclipse Adoptium\`. The local debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

iOS project files are included, but iOS simulator/device builds and App Store archives require macOS with Xcode.

### Publishing checklist

Android Play Store:

1. Run `npm run sync`.
2. Open Android Studio with `npm run open:android`.
3. Use **Build > Generate Signed App Bundle / APK**.
4. Choose **Android App Bundle**.
5. Create or select an upload keystore, keep it outside the repo, and back it up.
6. Upload the generated `.aab` to Google Play Console for package `com.zubibair.dailydeen`.

iOS App Store:

1. Run `npm run sync` on a Mac.
2. Open Xcode with `npm run open:ios`.
3. Select the `App` target and set your Apple Developer Team.
4. Confirm bundle identifier `com.zubibair.dailydeen`.
5. Test in an iPhone simulator and on a real device.
6. Use **Product > Archive**, then upload through Xcode Organizer.

External links such as Prayer Times and source links are opened through the Capacitor Browser plugin in the native apps, so the embedded reading app stays in place.

Native icon source SVGs live in `resources/`. The Capacitor asset generator could not be installed in this Windows environment because its `sharp` dependency failed with an access-denied error; run `npx @capacitor/assets generate` on a machine where that dependency installs cleanly to replace the default generated native icons and splash assets.
