import { WEEKLY_BONUS_SIZE } from "./rules.js";

export const WEEKLY_EXAM_FORMAT_VERSION = 2;

export function buildWeeklyExamQuestionIds({ weekKey, dailySessions, allQuestionIds, shuffle }) {
  const learnedIds = [];
  const incorrectIds = [];

  for (const daily of dailySessions) {
    if (!daily) continue;
    for (const id of daily.questionIds || []) {
      if (!learnedIds.includes(id)) learnedIds.push(id);
      if (daily.answers?.[id] && !daily.answers[id].correct && !incorrectIds.includes(id)) incorrectIds.push(id);
    }
  }

  const weeklyReview = [
    ...shuffle(incorrectIds, `${weekKey}:incorrect`),
    ...shuffle(learnedIds.filter((id) => !incorrectIds.includes(id)), `${weekKey}:review`),
  ];
  const bonusPool = allQuestionIds.filter((id) => !learnedIds.includes(id));
  const bonusIds = shuffle(bonusPool, `${weekKey}:bonus`).slice(0, WEEKLY_BONUS_SIZE);

  return [...weeklyReview, ...bonusIds];
}
