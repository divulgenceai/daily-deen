export const DAILY_SIZE = 7;
export const WEEKLY_BONUS_SIZE = 5;
export const WEEKLY_PASS_RATIO = 0.7;
export const LOCKOUT_DAYS = 304;

export function weeklyExamPassScore(questionCount) {
  if (!Number.isFinite(questionCount) || questionCount < 1) return 0;
  return Math.ceil(questionCount * WEEKLY_PASS_RATIO);
}

export function isPassingWeeklyExam(score, questionCount = DAILY_SIZE) {
  return Number.isFinite(score) && score >= weeklyExamPassScore(questionCount) && score <= questionCount;
}

export function isWeeklyExamExpired(pendingExam, currentDateKey) {
  return Boolean(
    pendingExam &&
      pendingExam.status === "pending" &&
      typeof pendingExam.expiresDate === "string" &&
      currentDateKey > pendingExam.expiresDate,
  );
}
