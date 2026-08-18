import { selectDailyQuestionIds } from "../daily-selection.js";
import { QUESTION_LIBRARY_META, QUESTIONS, TOPICS } from "../questions.js";
import { DAILY_SIZE, LOCKOUT_DAYS } from "../rules.js";
import { migrateQuestionContent } from "../state-migration.js";

const requiredQuestions = DAILY_SIZE * LOCKOUT_DAYS;
if (QUESTIONS.length < requiredQuestions) {
  throw new Error(`Need at least ${requiredQuestions} questions for ${LOCKOUT_DAYS} no-repeat days; found ${QUESTIONS.length}.`);
}

const ids = new Set();
const prompts = new Set();
for (const question of QUESTIONS) {
  if (ids.has(question.id)) throw new Error(`Duplicate question id: ${question.id}`);
  ids.add(question.id);

  const promptKey = question.prompt.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (prompts.has(promptKey)) throw new Error(`Duplicate question prompt: ${question.id}`);
  prompts.add(promptKey);

  if (!TOPICS.includes(question.topic)) throw new Error(`Unknown topic on ${question.id}: ${question.topic}`);
  if (!Array.isArray(question.choices) || question.choices.length !== 4 || new Set(question.choices).size !== 4) {
    throw new Error(`Question ${question.id} must have four unique choices.`);
  }
  if (!question.choices.includes(question.answer)) throw new Error(`Question ${question.id} is missing its answer choice.`);
  if (!question.explanation || !question.source || !/^https:\/\/(quran\.com|sunnah\.com)\//.test(question.url)) {
    throw new Error(`Question ${question.id} is missing a supported direct source.`);
  }

  if (question.id.startsWith("quran-passage-")) {
    const [, , surah, ayah] = question.id.split("-");
    if (question.source !== `Qur'an ${surah}:${ayah}` || question.url !== `https://quran.com/${surah}/${ayah}`) {
      throw new Error(`Passage reference mismatch on ${question.id}.`);
    }
  }
}

const history = [];
const lastSeen = new Map();
for (let day = 0; day < LOCKOUT_DAYS + 45; day += 1) {
  const recentIds = new Set(history.filter((entry) => day - entry.day < LOCKOUT_DAYS).map((entry) => entry.id));
  const questionIds = selectDailyQuestionIds({
    questions: QUESTIONS,
    topics: TOPICS,
    recentIds,
    todayKey: `simulation-day-${day}`,
    dailySize: DAILY_SIZE,
  });

  if (questionIds.length !== DAILY_SIZE || new Set(questionIds).size !== DAILY_SIZE) {
    throw new Error(`Selector returned an incomplete or duplicate set on simulated day ${day + 1}.`);
  }

  for (const id of questionIds) {
    const previousDay = lastSeen.get(id);
    if (previousDay !== undefined && day - previousDay < LOCKOUT_DAYS) {
      throw new Error(`Question ${id} repeated after ${day - previousDay} days.`);
    }
    lastSeen.set(id, day);
    history.push({ id, day });
  }
}

if (QUESTION_LIBRARY_META.reviewedQuestions !== QUESTIONS.length || QUESTION_LIBRARY_META.lockoutDays !== LOCKOUT_DAYS) {
  throw new Error("Question library metadata does not match the runtime rules.");
}

const exhaustedV1State = {
  contentVersion: 1,
  daily: { "2026-08-18": { questionIds: [], completedAt: null } },
  history: QUESTIONS.slice(0, 84).map((question) => ({ date: "2026-08-17", questionId: question.id })),
  streak: { count: 27, lastCompletedDate: "2026-08-17", pendingExam: null },
};
const migration = migrateQuestionContent(exhaustedV1State, {
  contentVersion: 2,
  todayKey: "2026-08-18",
  dailySize: DAILY_SIZE,
});
if (!migration.refreshed || migration.state.history.length || migration.state.daily["2026-08-18"] || migration.state.streak.count !== 27) {
  throw new Error("The exhausted v1 state did not refresh while preserving the streak.");
}

console.log(
  `Validated ${QUESTIONS.length.toLocaleString()} unique source-linked questions, the v1 reset, and ${LOCKOUT_DAYS + 45} simulated days with a ${LOCKOUT_DAYS}-day repeat lockout.`,
);
