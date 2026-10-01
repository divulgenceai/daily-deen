import { QURAN_VERSE_PACK_META } from "./quran-verse-pack.js";

const verseRequests = new Map();

function plainTranslation(html) {
  const documentFragment = new DOMParser().parseFromString(html, "text/html");
  documentFragment.querySelectorAll("sup").forEach((note) => note.remove());
  return (documentFragment.body.textContent || "").replace(/\s+/g, " ").trim();
}

export function versePrompt(question) {
  if (!question.verse) return Promise.resolve(question.prompt);
  const { surah, ayah, start, length } = question.verse;
  if (!length) return Promise.resolve(question.prompt);
  const key = `${surah}:${ayah}`;
  if (!verseRequests.has(key)) {
    const request = fetch(`https://api.quran.com/api/v4/verses/by_key/${key}?translations=${QURAN_VERSE_PACK_META.translationResourceId}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Quran.com returned ${response.status}`);
        return response.json();
      })
      .then(({ verse }) => {
        if (verse?.verse_key !== key || !Array.isArray(verse.translations)) throw new Error("Verse response did not match the requested reference.");
        const translation = verse.translations.find((item) => item.resource_id === QURAN_VERSE_PACK_META.translationResourceId);
        if (!translation?.text) throw new Error("The requested translation was unavailable.");
        const words = plainTranslation(translation.text).split(/\s+/);
        if (start + length > words.length) throw new Error("The translation has changed; please check Quran.com.");
        const excerpt = words.slice(start, start + length).join(" ");
        return `Which surah is this verse from? “${start ? "…" : ""}${excerpt}${start + length < words.length ? "…" : ""}”`;
      })
      .catch((error) => {
        verseRequests.delete(key);
        throw error;
      });
    verseRequests.set(key, request);
  }
  return verseRequests.get(key);
}
