import { selectDailyQuestionIds, seededShuffle } from "../daily-selection.js";
import { ACTIVE_QUESTIONS, QUESTION_LIBRARY_META, QUESTIONS, TOPICS } from "../questions.js";
import { QURAN_VERSE_PACK_META, QURAN_VERSE_PASSAGES } from "../quran-verse-pack.js";
import { DAILY_SIZE, LOCKOUT_DAYS, WEEKLY_BONUS_SIZE } from "../rules.js";
import { migrateQuestionContent, reserveHistoryIds } from "../state-migration.js";
import { buildWeeklyExamQuestionIds } from "../weekly-exam.js";

const weeklyExams = Math.ceil(LOCKOUT_DAYS / 7);
const requiredQuestions = DAILY_SIZE * LOCKOUT_DAYS + WEEKLY_BONUS_SIZE * weeklyExams;
if (ACTIVE_QUESTIONS.length < requiredQuestions) {
  throw new Error(`Need ${requiredQuestions} active questions for two years including weekly bonus questions; found ${ACTIVE_QUESTIONS.length}.`);
}

const ids = new Set();
const prompts = new Set();
for (const question of QUESTIONS) {
  if (ids.has(question.id)) throw new Error(`Duplicate question ID: ${question.id}`);
  ids.add(question.id);
  if (!question.verse) {
    const key = question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (prompts.has(key)) throw new Error(`Duplicate authored prompt: ${question.id}`);
    prompts.add(key);
  }
  if (!TOPICS.includes(question.topic)) throw new Error(`Unknown topic: ${question.id}`);
  if (!Array.isArray(question.choices) || question.choices.length !== 4 || new Set(question.choices).size !== 4) {
    throw new Error(`Question ${question.id} needs four distinct choices.`);
  }
  if (!question.choices.includes(question.answer)) throw new Error(`Answer missing from choices: ${question.id}`);
  if (!question.explanation || !question.source || !/^https:\/\/(quran\.com|sunnah\.com)\//.test(question.url)) {
    throw new Error(`Missing supported direct source: ${question.id}`);
  }
  if (question.url.startsWith("https://sunnah.com/") && !/^https:\/\/sunnah\.com\/(bukhari|muslim):[0-9]+[a-z]?$/.test(question.url)) {
    throw new Error(`Unsupported hadith reference: ${question.id}`);
  }
  if (question.verse) {
    const { surah, ayah, start, length } = question.verse;
    if (question.source !== `Qur'an ${surah}:${ayah}` || question.url !== `https://quran.com/${surah}/${ayah}`) {
      throw new Error(`Passage reference mismatch: ${question.id}`);
    }
    if (question.active && (length < 1 || length > QURAN_VERSE_PACK_META.maxExcerptWords || start < 0)) {
      throw new Error(`Bad excerpt metadata: ${question.id}`);
    }
  }
}

if (QURAN_VERSE_PACK_META.translationResourceId !== 85 || QURAN_VERSE_PACK_META.translation !== "M.A.S. Abdel Haleem") {
  throw new Error("The passage pack must use the Quran.com M.A.S. Abdel Haleem translation resource.");
}
if (QURAN_VERSE_PASSAGES.filter((entry) => entry[4]).length !== QURAN_VERSE_PACK_META.generatedQuestions) {
  throw new Error("Passage-pack active count is inconsistent.");
}
for (const url of [QURAN_VERSE_PACK_META.source, QURAN_VERSE_PACK_META.chaptersSource]) {
  if (new URL(url).hostname !== "api.quran.com") throw new Error(`Unexpected Quran source: ${url}`);
}

const startDate = new Date("2026-01-05T12:00:00Z"); // Monday
const history = [];
const lastSeen = new Map();
const dailySessions = new Map();
let bonusCount = 0;
for (let day = 0; day < LOCKOUT_DAYS; day += 1) {
  const date = new Date(startDate.getTime() + day * 86_400_000).toISOString().slice(0, 10);
  const recentIds = new Set(history.filter((entry) => day - entry.day < LOCKOUT_DAYS).map((entry) => entry.id));
  const questionIds = selectDailyQuestionIds({
    questions: ACTIVE_QUESTIONS,
    topics: TOPICS,
    recentIds,
    todayKey: date,
    dailySize: DAILY_SIZE,
  });
  if (questionIds.length !== DAILY_SIZE || new Set(questionIds).size !== DAILY_SIZE) {
    throw new Error(`Daily set incomplete on ${date}.`);
  }
  for (const id of questionIds) {
    if (lastSeen.has(id) && day - lastSeen.get(id) < LOCKOUT_DAYS) throw new Error(`Question repeated within two years: ${id}`);
    lastSeen.set(id, day);
    history.push({ id, day });
  }
  dailySessions.set(date, { questionIds, answers: {} });

  if (day % 7 === 6) {
    const weekKey = new Date(startDate.getTime() + (day - 6) * 86_400_000).toISOString().slice(0, 10);
    const weekdays = Array.from({ length: 6 }, (_, offset) => {
      const key = new Date(startDate.getTime() + (day - 6 + offset) * 86_400_000).toISOString().slice(0, 10);
      return dailySessions.get(key);
    });
    const learnedIds = new Set(weekdays.flatMap((session) => session.questionIds));
    const idsForExam = buildWeeklyExamQuestionIds({
      weekKey,
      dailySessions: weekdays,
      allQuestionIds: ACTIVE_QUESTIONS.map((question) => question.id),
      recentIds: new Set(history.filter((entry) => day - entry.day < LOCKOUT_DAYS).map((entry) => entry.id)),
      shuffle: seededShuffle,
    });
    if (idsForExam.length !== 6 * DAILY_SIZE + WEEKLY_BONUS_SIZE) throw new Error(`Weekly exam incomplete on ${date}.`);
    for (const id of idsForExam.filter((item) => !learnedIds.has(item))) {
      if (lastSeen.has(id) && day - lastSeen.get(id) < LOCKOUT_DAYS) throw new Error(`Weekly bonus repeated: ${id}`);
      lastSeen.set(id, day);
      history.push({ id, day });
      bonusCount += 1;
    }
  }
}

const migrationHistory = [{ date: "2026-08-16", questionId: "foundations-01" }];
reserveHistoryIds(migrationHistory, "2026-08-17", ["quran-01"]);
const migration = migrateQuestionContent({
  contentVersion: 3,
  daily: { "2026-08-18": { questionIds: ["quran-02"], completedAt: null } },
  weeklyExams: {},
  history: migrationHistory,
  streak: { count: 27 },
}, {
  contentVersion: 4,
  todayKey: "2026-08-18",
  dailySize: DAILY_SIZE,
  activeQuestionIds: new Set(ACTIVE_QUESTIONS.map((question) => question.id)),
});
if (!migration.refreshed || migration.state.history.length !== 3 || migration.state.daily["2026-08-18"] || migration.state.streak.count !== 27) {
  throw new Error("Migration must retain used IDs and streak while replacing an incomplete quiz.");
}
if (QUESTION_LIBRARY_META.reviewedQuestions !== ACTIVE_QUESTIONS.length || QUESTION_LIBRARY_META.lockoutDays !== LOCKOUT_DAYS) {
  throw new Error("Question library metadata does not match active content.");
}

console.log(`Validated ${ACTIVE_QUESTIONS.length.toLocaleString()} active questions over ${LOCKOUT_DAYS} days, including ${bonusCount} unique weekly bonus uses, with history-preserving migration.`);
