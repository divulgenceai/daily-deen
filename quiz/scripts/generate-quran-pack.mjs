import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { QURAN_VERSE_PASSAGES as previousPassages } from "../quran-verse-pack.js";

const TRANSLATION_RESOURCE_ID = 85;
const TRANSLATIONS_URL = `https://api.quran.com/api/v4/quran/translations/${TRANSLATION_RESOURCE_ID}`;
const CHAPTERS_URL = "https://api.quran.com/api/v4/chapters?language=en";
const TARGET_SIZE = 5700;
const TARGET_EXCERPT_WORDS = 12;
const outputPath = fileURLToPath(new URL("../quran-verse-pack.js", import.meta.url));

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function fetchJson(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error(`Quran.com returned HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}

function plainTranslation(html) {
  return html
    .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalise(value) {
  return value.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.join(" ") || "";
}

function suitable(text) {
  const words = text.split(/\s+/).length;
  return words >= 5 && words <= 85 && text.length >= 32 && text.length <= 550;
}

function roundRobin(versesByChapter) {
  const selected = [];
  const longest = Math.max(...versesByChapter.map((chapter) => chapter.length));
  for (let row = 0; row < longest; row += 1) {
    for (const chapter of versesByChapter) {
      if (chapter[row]) selected.push(chapter[row]);
    }
  }
  return selected;
}

function uniqueExcerptWindows(verses, selected) {
  const wordsByVerse = verses.map((verse) => verse.text.split(/\s+/));
  const maxWords = Math.max(...selected.map((verse) => verse.text.split(/\s+/).length));
  const windowsByLength = new Map();
  for (let length = TARGET_EXCERPT_WORDS; length <= maxWords; length += 1) {
    const counts = new Map();
    for (const words of wordsByVerse) {
      if (words.length < length) continue;
      const uniqueInVerse = new Set();
      for (let start = 0; start <= words.length - length; start += 1) {
        uniqueInVerse.add(normalise(words.slice(start, start + length).join(" ")));
      }
      for (const key of uniqueInVerse) counts.set(key, (counts.get(key) || 0) + 1);
    }
    windowsByLength.set(length, counts);
  }
  return selected.map((verse) => {
    const words = verse.text.split(/\s+/);
    if (words.length < TARGET_EXCERPT_WORDS && verse.unique) return [0, words.length];
    for (let length = TARGET_EXCERPT_WORDS; length <= words.length; length += 1) {
      const counts = windowsByLength.get(length);
      for (let start = 0; start <= words.length - length; start += 1) {
        if (counts.get(normalise(words.slice(start, start + length).join(" "))) === 1) {
          return [start, length];
        }
      }
    }
    return [0, 0];
  });
}

const sourceText = process.argv.includes("--stdin")
  ? await readStdin()
  : process.argv[2]
    ? await readFile(process.argv[2], "utf8")
    : null;
const payload = sourceText ? JSON.parse(sourceText) : {
  translations: (await fetchJson(TRANSLATIONS_URL)).translations,
  chapters: (await fetchJson(CHAPTERS_URL)).chapters,
};
const { chapters, translations } = payload;
if (!Array.isArray(chapters) || chapters.length !== 114 || !Array.isArray(translations)) {
  throw new Error("Expected Quran.com chapter and M.A.S. Abdel Haleem translation data.");
}
const expectedVerseCount = chapters.reduce((total, chapter) => total + chapter.verses_count, 0);
if (translations.length !== expectedVerseCount || translations.some((verse) => verse.resource_id !== TRANSLATION_RESOURCE_ID)) {
  throw new Error(`Expected ${expectedVerseCount} Quran.com translation verses from resource ${TRANSLATION_RESOURCE_ID}.`);
}

let cursor = 0;
const versesByChapter = chapters.map((chapter) => {
  const verses = translations.slice(cursor, cursor + chapter.verses_count).map((translation, index) => ({
    surah: chapter.id,
    ayah: index + 1,
    text: plainTranslation(translation.text),
  }));
  cursor += chapter.verses_count;
  return verses;
});
const allVerses = versesByChapter.flat();
const byKey = new Map(allVerses.map((verse) => [`${verse.surah}:${verse.ayah}`, verse]));
// The first 5,116 IDs shipped in v1.6; keep them available for saved sessions.
const priorKeys = [...new Set(previousPassages.slice(0, 5116).map(([surah, ayah]) => `${surah}:${ayah}`))];
const selected = priorKeys.map((key) => byKey.get(key)).filter(Boolean);
const selectedKeys = new Set(priorKeys);
const usedText = new Set();
let active = 0;
for (const verse of selected) {
  const key = normalise(verse.text);
  verse.unique = Boolean(key) && !usedText.has(key);
  if (verse.unique) {
    usedText.add(key);
    active += 1;
  }
}
for (const verse of roundRobin(versesByChapter)) {
  if (active >= TARGET_SIZE) break;
  const key = `${verse.surah}:${verse.ayah}`;
  const textKey = normalise(verse.text);
  if (selectedKeys.has(key) || !suitable(verse.text) || usedText.has(textKey)) continue;
  verse.unique = true;
  selected.push(verse);
  selectedKeys.add(key);
  usedText.add(textKey);
  active += 1;
}
if (active !== TARGET_SIZE) throw new Error(`Needed ${TARGET_SIZE} distinct verses; found ${active}.`);

const excerptWindows = uniqueExcerptWindows(allVerses, selected);
const entries = selected.map((verse, index) => {
  const [start, length] = excerptWindows[index];
  return [verse.surah, verse.ayah, start, length, verse.unique && length > 0 ? 1 : 0];
});
const activeEntries = entries.filter((entry) => entry[4]);
const maxExcerptWords = Math.max(...activeEntries.map((entry) => entry[3]));
if (activeEntries.length < 5600 || maxExcerptWords > 30) {
  throw new Error(`Only ${activeEntries.length} short, unique excerpts were found; longest was ${maxExcerptWords} words.`);
}

const generated = `// Quran.com verse references and excerpt positions only. Translation text is fetched when shown.\n` +
  `// Generated by scripts/generate-quran-pack.mjs; do not edit by hand.\n\n` +
  `export const QURAN_VERSE_PACK_META = ${JSON.stringify({
    generatedQuestions: activeEntries.length,
    legacyReferences: entries.length - activeEntries.length,
    translation: "M.A.S. Abdel Haleem",
    translationResourceId: TRANSLATION_RESOURCE_ID,
    source: TRANSLATIONS_URL,
    chaptersSource: CHAPTERS_URL,
    targetExcerptWords: TARGET_EXCERPT_WORDS,
    maxExcerptWords,
  }, null, 2)};\n\n` +
  `export const SURAH_NAMES = ${JSON.stringify(chapters.map((chapter) => chapter.name_simple))};\n\n` +
  `export const QURAN_VERSE_PASSAGES = ${JSON.stringify(entries)};\n`;
await writeFile(outputPath, generated, "utf8");
console.log(`Generated ${activeEntries.length} active Quran.com references (${entries.length - activeEntries.length} legacy); longest excerpt: ${maxExcerptWords} words.`);
