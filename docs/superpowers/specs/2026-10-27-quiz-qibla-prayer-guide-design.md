# Daily Deen Quiz: Qibla and Prayer Guide design

Date: 27 October 2026 (Australia/Sydney)
Status: approved design, awaiting written-spec review

## Goal and scope

Add two source-backed, responsive features to the existing Daily Deen Quiz website in quiz/: a live phone-compass Qibla page and a step-by-step Prayer Guide. The guide starts by asking whether the visitor wants the men's or women's path. The existing seven-question daily quiz, Sunday exam, question history, scores, and streak state remain unchanged.

This delivery targets the desktop and mobile website. The web files should be included in the existing quiz web build so a later Android rebuild can use them, but native Android permission wiring, APK installation, and Play Store release are not part of this delivery. Do not alter the separate Daily Deen reading site at the repository root.

## Site structure and navigation

- Keep quiz/index.html as Today. Add quiz/qibla.html and quiz/prayer-guide.html as separate static pages.
- Replace the informational quiz footer's primary role with a consistent three-item Today / Qibla / Prayer Guide navigation dock on all three pages. Preserve the existing footer information in a less prominent location. On narrow phones, respect the bottom safe area and leave enough page padding that quiz answers and guide controls are not hidden behind the dock.
- Preserve the quiz's existing Topics, How it works, and streak controls. The active page is clear in the dock and exposed with aria-current.
- Match the quiz's current dark visual language, typography, restrained animation, and responsive layout. Motion should respect prefers-reduced-motion.
- A visitor can move among the three pages without changing quiz progress or triggering a new quiz attempt.

Use small, independent modules: a pure Qibla-bearing calculation unit; a browser-permission/heading adapter; a Qibla view; and structured guide content rendered into two paths. Avoid adding prayer content or sensor logic to the already-large quiz/app.js.

## Qibla experience and data flow

The page initially explains that location and phone compass access are needed and shows a Find Qibla button. It never requests permission on page load. A button press requests geolocation and, where the browser requires it, device-orientation permission in the same user gesture. The user's coordinates and the Kaaba target (approximately 21.4225° N, 39.8262° E) feed a great-circle initial-bearing calculation. The result is a true-north bearing from the user toward the Kaaba, based on [Qur'an 2:144](https://quran.com/2/144).

A live arrow appears only after both a current location and a usable absolute heading exist. On browsers exposing a true-north absolute heading, use it directly. Apple's webkitCompassHeading is relative to magnetic north; correct it locally using the current bundled [NOAA World Magnetic Model 2025](https://www.ncei.noaa.gov/products/world-magnetic-model) before combining it with a true-north bearing. Treat a missing, relative-only, invalid, or stale heading as unsupported. Do not silently substitute an uncorrected magnetic heading. The World Magnetic Model must be updated before its validity period ends in 2029; if it is expired, the magnetic-heading path must fail closed rather than show a potentially misleading arrow.

The arrow turns smoothly as the phone rotates. Its label says approximate, not exact: browser sensor quality, calibration, magnetic interference, and location accuracy can still affect direction. Include a short calibration hint and advise checking another reliable Qibla indication if the compass behaves erratically. Do not show a manual-coordinate form or a numeric-only desktop substitute; the user specifically chose a live phone-compass experience.

Permission and device states are distinct:

| State | Visitor-facing behavior |
| --- | --- |
| Insecure page, such as many file previews | Explain that the feature needs the deployed HTTPS site. |
| Location denied or unavailable | Explain that location permission is required and offer Try again. |
| Motion permission denied | Explain that motion/compass permission is required and offer Try again. |
| No compass or no usable heading, including most PCs | Show Compass unavailable on this device/browser; do not show a direction arrow. |
| Position or heading times out or becomes stale | Remove the arrow, explain the issue, and offer Try again. |

Coordinates and sensor samples exist only in memory while the Qibla page is active. Do not save them to localStorage, send them to an analytics or geocoding service, or log them. Stop listening to sensor events when the page is hidden or exited. Browser permission grants themselves are controlled by the browser.

Browser behavior must follow the secure-context and explicit-permission requirements documented by [MDN Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition) and [MDN DeviceOrientationEvent.requestPermission](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static). Apple's [webkitCompassHeading documentation](https://developer.apple.com/documentation/webkitjs/deviceorientationevent) establishes the magnetic-north distinction.

## Prayer Guide entry and paths

Prayer Guide opens on a choice screen with Men's guide and Women's guide. Neither path is selected by default. The choice is not stored; visitors choose again on a new visit, and a visible Switch guide control makes both paths accessible at any time. This choice changes the presentation of preparation and relevant notes, not the core sequence of salah.

Each path contains, in order:

1. Prepare: prayer time, intention, a clean place and appropriate clothing, purification (wudu or ghusl when required), and facing the Qibla.
2. A chronological two-rak'ah walkthrough: standing and opening takbir; al-Fatiha and an additional Qur'an passage where appropriate; bowing, standing upright, two prostrations with a calm sitting between them; second rak'ah; final sitting, tashahhud, blessings on the Prophet, and taslim.
3. Clear continuation diagrams or numbered instructions for three- and four-rak'ah obligatory prayers, including the first sitting after two rak'ahs and the final sitting. Show the obligatory prayer counts for Fajr, Dhuhr, Asr, Maghrib, and Isha.
4. A recitations reference: accurate Arabic, carefully checked transliteration, and short plain-English meaning. English is a meaning aid, not a substitute for the prescribed Arabic recitation. Link each recitation to its direct Qur'an.com or Sunnah.com source.
5. Prophetic practices and variations: examples supported by sound reports, with no assertion that every named school classifies every detail the same way.
6. What affects prayer: preparation requirements, actions that normally require restarting, and separate warnings or disputed details. Do not collapse these into one invalidators list.

The men's path puts men's clothing guidance in context, including the lower-garment-below-ankles warning. The women's path puts prayer clothing and menstruation guidance in context. Both paths explain that intercourse requires ghusl before prayer; it is not a men-only rule. The paths share one structured core-step source so they cannot drift into contradictory movement instructions. Where Sunni scholars differ (for example, some hand-position details, recitation behind an imam, and finer clothing coverage questions), say so briefly and do not invent a universal invalidity ruling.

For accessibility, Arabic is marked right-to-left and readable at phone size; the transliteration and meaning are clearly separate; step navigation is keyboard usable and screen-reader labelled. Every religious instruction has a visible source link, not a hidden bibliography alone. The guide states that it is an educational overview, not an individual fatwa for unusual circumstances.

## Religious source and wording policy

Religious assertions in the new pages may cite only Qur'an.com and Sunnah.com. Prefer Sahih al-Bukhari; use another Sunnah.com collection only where needed and only after checking its displayed grading. Do not use a report marked weak to establish a rule. Do not present the author's interpretation, a chapter heading, or a juristic difference as if it were the exact wording of a verse or hadith. Paraphrase in normal English and identify recitations separately from explanations.

The initial source map is:

| Topic | Direct source |
| --- | --- |
| Facing the Sacred Mosque | [Qur'an 2:144](https://quran.com/2/144) |
| Prayer times and intention | [Qur'an 4:103](https://quran.com/4/103); [Sahih al-Bukhari 1](https://sunnah.com/bukhari:1) |
| Wudu and major purification | [Qur'an 5:6](https://quran.com/5/6); [Qur'an 4:43](https://quran.com/4/43) |
| Ghusl after intercourse | [Sahih al-Bukhari 291](https://sunnah.com/bukhari:291) |
| Prayer sequence and calmness | [Sahih al-Bukhari 757](https://sunnah.com/bukhari:757); [Sahih al-Bukhari 631](https://sunnah.com/bukhari:631) |
| Obligatory prayer rak'ah patterns | [Sahih al-Bukhari 759](https://sunnah.com/bukhari:759); [Sahih al-Bukhari 1091–1092](https://sunnah.com/bukhari:1091); [Sahih Muslim 687a](https://sunnah.com/muslim:687a) |
| Al-Fatiha and additional recitation | [Qur'an 1](https://quran.com/1); [Sahih al-Bukhari 756](https://sunnah.com/bukhari:756); [Sahih al-Bukhari 759](https://sunnah.com/bukhari:759) |
| Movement takbirs and upright praise | [Sahih al-Bukhari 789](https://sunnah.com/bukhari:789); [Sahih al-Bukhari 793](https://sunnah.com/bukhari:793) |
| Bowing and prostration remembrance | [Sahih al-Bukhari 794](https://sunnah.com/bukhari:794) |
| Sitting between prostrations | [Sunan Ibn Majah 897](https://sunnah.com/ibnmajah:897), graded Sahih on Sunnah.com |
| Tashahhud and blessings | [Sahih al-Bukhari 831](https://sunnah.com/bukhari:831); [Sahih al-Bukhari 3370](https://sunnah.com/bukhari:3370) |
| Ending with taslim | [Sunan Ibn Majah 914](https://sunnah.com/ibnmajah:914), graded Sahih on Sunnah.com |
| Prayer clothing | [Qur'an 7:31](https://quran.com/7/31); [Sunan Abi Dawud 641](https://sunnah.com/abudawud:641), graded Sahih on Sunnah.com |
| Menstruation and resuming prayer | [Sahih al-Bukhari 331](https://sunnah.com/bukhari:331); [Sahih al-Bukhari 321](https://sunnah.com/bukhari:321) |
| Renewing wudu after hadath | [Sahih al-Bukhari 6954](https://sunnah.com/bukhari:6954) |
| Silence in prayer | [Sahih al-Bukhari 7361](https://sunnah.com/bukhari:7361) |
| Below-ankles warning, not an automatic invalidity ruling | [Sahih al-Bukhari 5787](https://sunnah.com/bukhari:5787) |

Do not use [Sunan Abi Dawud 4086](https://sunnah.com/abudawud:4086) as proof that a below-ankles garment automatically invalidates prayer: Sunnah.com displays a Da'if grading for that report. Specific school attributions, finer awrah limits, unusual bleeding cases, and accidental omissions need either carefully bounded wording or omission if the allowed sources do not establish the claimed rule.

## Verification and acceptance

- Unit-test great-circle bearing against known city-to-Kaaba examples, angle wraparound, and heading-to-arrow rotation. Test magnetic-versus-true conversion against NOAA WMM2025 published values and its model-validity boundary.
- Browser-test first-visit permission flow, denial, timeout, stale/relative-only heading, unavailable sensors, retry, and page visibility cleanup. A mocked browser can test states and rendering, but a real phone must be used to validate sensor behavior and rotation before calling the live compass verified.
- Check phone and desktop widths for navigation, safe areas, overflow, text legibility, keyboard use, reduced motion, and source links. Check that returning to Today preserves quiz progress, answer feedback, scores, and streak data.
- Review every Arabic recitation and transliteration against its linked primary text. Check every claim's link, hadith grading, and classification. Remove or qualify claims that cannot be supported by the allowed sources.
- Run the quiz's existing checks and web build. Include all new page assets in quiz/scripts/build-web.mjs without changing question data or state migration.

The feature is complete for the website when both new pages are reachable on phone and desktop, the two guide paths are accurate and source-linked, the Qibla arrow works on a supported permission-granted phone, unsupported/denied cases never display a misleading arrow, and existing quiz behavior still passes its checks.
