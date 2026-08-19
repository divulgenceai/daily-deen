import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const TRANSLATION_RESOURCE_ID = 19;
const TRANSLATIONS_URL = `https://api.quran.com/api/v4/quran/translations/${TRANSLATION_RESOURCE_ID}`;
const CHAPTERS_URL = "https://api.quran.com/api/v4/chapters?language=en";
const TARGET_SIZE = 5116;
const PASSAGE_EXCERPT_WORDS = 12;
const outputPath = fileURLToPath(new URL("../quran-verse-pack.js", import.meta.url));

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function fetchJson(url, label) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}`);
      return response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}

async function fetchSource() {
  const [translationPayload, chapterPayload] = await Promise.all([
    fetchJson(TRANSLATIONS_URL, "Quran.com translation source"),
    fetchJson(CHAPTERS_URL, "Quran.com chapter source"),
  ]);
  return {
    translations: translationPayload.translations,
    chapters: chapterPayload.chapters,
  };
}

function normaliseText(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isUsefulPassage(text) {
  const words = text.trim().split(/\s+/).length;
  return words >= 5 && words <= 60 && text.length >= 40 && text.length <= 340;
}

function roundRobinPassages(surahs) {
  const seenText = new Set();
  const queues = surahs.map((surah) =>
    surah.ayahs
      .filter((ayah) => {
        const key = normaliseText(ayah.text);
        if (!isUsefulPassage(ayah.text) || seenText.has(key)) return false;
        seenText.add(key);
        return true;
      })
      .map((ayah) => [surah.number, ayah.numberInSurah, ayah.text]),
  );

  const selected = [];
  let row = 0;
  while (selected.length < TARGET_SIZE) {
    let added = false;
    for (const queue of queues) {
      if (queue[row]) {
        selected.push(queue[row]);
        added = true;
        if (selected.length === TARGET_SIZE) return selected;
      }
    }
    if (!added) break;
    row += 1;
  }
  return selected;
}

function buildPassageExcerpts(passages) {
  const passageWords = passages.map(([, , passage]) => passage.trim().split(/\s+/));
  const windowCounts = new Map();
  const longestPassage = Math.max(...passageWords.map((words) => words.length));

  for (let length = PASSAGE_EXCERPT_WORDS; length <= longestPassage; length += 1) {
    const counts = new Map();
    for (const words of passageWords) {
      if (words.length < length) continue;
      const passageWindows = new Set();
      for (let start = 0; start <= words.length - length; start += 1) {
        passageWindows.add(normaliseText(words.slice(start, start + length).join(" ")));
      }
      for (const window of passageWindows) counts.set(window, (counts.get(window) || 0) + 1);
    }
    windowCounts.set(length, counts);
  }

  return passageWords.map((words) => {
    if (words.length <= PASSAGE_EXCERPT_WORDS) return words.join(" ");

    for (let length = PASSAGE_EXCERPT_WORDS; length <= words.length; length += 1) {
      const counts = windowCounts.get(length);
      for (let start = 0; start <= words.length - length; start += 1) {
        const excerptWords = words.slice(start, start + length);
        if (counts.get(normaliseText(excerptWords.join(" "))) === 1) {
          const leadingEllipsis = start > 0 ? "…" : "";
          const trailingEllipsis = start + length < words.length ? "…" : "";
          return `${leadingEllipsis}${excerptWords.join(" ")}${trailingEllipsis}`;
        }
      }
    }

    return words.join(" ");
  });
}

const sourceText = process.argv.includes("--stdin")
  ? await readStdin()
  : process.argv[2]
    ? await readFile(process.argv[2], "utf8")
    : null;
const payload = sourceText ? JSON.parse(sourceText) : await fetchSource();
const chapters = payload?.chapters;
const translations = payload?.translations;

if (!Array.isArray(chapters) || chapters.length !== 114 || !Array.isArray(translations)) {
  throw new Error("Expected complete Quran.com chapter and Pickthall translation datasets.");
}

const expectedVerseCount = chapters.reduce((total, chapter) => total + chapter.verses_count, 0);
if (translations.length !== expectedVerseCount || translations.some((verse) => verse.resource_id !== TRANSLATION_RESOURCE_ID)) {
  throw new Error(`Expected ${expectedVerseCount} verses from Quran.com translation resource ${TRANSLATION_RESOURCE_ID}.`);
}

let translationCursor = 0;
const surahs = chapters.map((chapter) => {
  const chapterTranslations = translations.slice(translationCursor, translationCursor + chapter.verses_count);
  translationCursor += chapter.verses_count;
  return {
    number: chapter.id,
    englishName: chapter.name_simple,
    ayahs: chapterTranslations.map((verse, index) => ({
      numberInSurah: index + 1,
      text: verse.text,
    })),
  };
});

const passages = roundRobinPassages(surahs);
if (passages.length !== TARGET_SIZE) {
  throw new Error(`Expected ${TARGET_SIZE} suitable unique passages, found ${passages.length}.`);
}
const passageExcerpts = buildPassageExcerpts(passages);
const passagesWithExcerpts = passages.map((passage, index) => [...passage, passageExcerpts[index]]);
const maxExcerptWords = Math.max(...passageExcerpts.map((excerpt) => excerpt.replaceAll("…", "").trim().split(/\s+/).length));

const surahNames = surahs.map((surah) => surah.englishName);
const generated = `// Generated by scripts/generate-quran-pack.mjs. Do not edit by hand.\n` +
  `// English rendering: Mohammed Marmaduke Pickthall. References link to Quran.com.\n\n` +
  `export const QURAN_VERSE_PACK_META = ${JSON.stringify({
    generatedQuestions: passages.length,
    translation: "M. Pickthall",
    edition: "quran.en.pickthall",
    translationResourceId: TRANSLATION_RESOURCE_ID,
    source: TRANSLATIONS_URL,
    chaptersSource: CHAPTERS_URL,
    targetExcerptWords: PASSAGE_EXCERPT_WORDS,
    maxExcerptWords,
  }, null, 2)};\n\n` +
  `export const SURAH_NAMES = ${JSON.stringify(surahNames, null, 2)};\n\n` +
  `export const QURAN_VERSE_PASSAGES = ${JSON.stringify(passagesWithExcerpts)};\n`;

await writeFile(outputPath, generated, "utf8");
console.log(`Generated ${passages.length} unique Qur'an passage questions at ${outputPath}`);
