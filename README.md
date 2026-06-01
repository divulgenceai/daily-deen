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
