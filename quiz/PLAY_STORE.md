# Google Play release path

The Android project is technically ready for device testing, but it is not yet ready for a public store submission. Do not create the Play Console app until the final public name and package ID have been chosen: the Play package name is unique and permanent.

## Current Android configuration

- Working app name: `Daily Deen Quiz`
- Development package ID: `com.zubairmohammed.dailydeenquiz`
- Minimum Android version: Android 7 / API 24
- Compile and target SDK: Android 16 / API 36
- Version code: `8`
- Version name: `1.7`
- Native permissions: internet only, for loading Quran.com verse translations and opening cited HTTPS sources
- Data model: quiz history and streak data stay in local app storage; there are no accounts, analytics, ads, location, contacts, or tracking SDKs. Verse wording is fetched from Quran.com over HTTPS, so verify its network/privacy disclosure before release.

## Before creating the Play Console app

1. Finalize the public name, icon, developer name, support email, website, and permanent package ID.
2. Commission a qualified Islamic content review of the 101 authored questions and check the generated verse-reference workflow against the selected Quran.com translation. The bank has capacity for 731 days of daily questions plus weekly bonuses, but capacity is not the same thing as independent religious review.
3. Have the full question corpus and explanations reviewed by a qualified Islamic reviewer and a separate copy/logic reviewer.
4. Publish a privacy policy at a stable public HTTPS URL and add a privacy link or text inside the app. Even an app that collects no user data must complete Play's Data safety form and provide a privacy policy.
5. Prepare the store listing: short and full descriptions, phone and tablet screenshots, feature graphic, app icon, category, content rating, and support contact.

## Signing and release bundle

Google Play requires an Android App Bundle and Play App Signing for new apps. Create and protect an upload key only after the final app identity has been chosen.

Create `android/key.properties` locally with this structure:

```properties
storeFile=upload-key.jks
storePassword=replace-with-a-secure-secret
keyAlias=upload
keyPassword=replace-with-a-secure-secret
```

Place `upload-key.jks` inside `android/`. Both files are ignored by Git. Keep encrypted backups of the keystore and credentials outside this repository.

Then build the signed bundle:

```powershell
npm run android:bundle
```

The bundle is written to `android/app/build/outputs/bundle/release/app-release.aab`.

## Play Console sequence

1. Create and verify the appropriate Personal or Organization Play developer account.
2. Create the app using the final package ID and enroll in Play App Signing.
3. Complete App content, privacy policy, Data safety, ads, content-rating, target-audience, and store-listing sections.
4. Upload the signed AAB to Internal testing first and test on at least one phone and one tablet.
5. If the Personal developer account was created after 13 November 2023, run the currently required closed test with at least 12 opted-in testers for 14 continuous days before applying for production access.
6. Fix pre-launch report issues, then stage a controlled production rollout.
7. Increase `versionCode` for every later Play update.

## Current official requirements checked in July 2026

- New apps and updates must target API 36 from 31 August 2026: https://developer.android.com/google/play/requirements/target-sdk
- New apps are published as Android App Bundles: https://developer.android.com/studio/publish/
- Play App Signing is mandatory for new apps: https://developer.android.com/studio/publish/upload-bundle
- Personal-account testing requirement: https://support.google.com/googleplay/android-developer/answer/14151465
- Data safety requirements: https://support.google.com/googleplay/android-developer/answer/10787469
