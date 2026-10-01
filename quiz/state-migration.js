export function reserveHistoryIds(history, date, questionIds) {
  const seen = new Set(history.map((entry) => `${entry.date}:${entry.questionId}`));
  for (const questionId of questionIds) {
    const key = `${date}:${questionId}`;
    if (!seen.has(key)) {
      history.push({ date, questionId });
      seen.add(key);
    }
  }
}

function sundayFor(weekKey) {
  const date = new Date(`${weekKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 6);
  return date.toISOString().slice(0, 10);
}

export function migrateQuestionContent(state, { contentVersion, todayKey, dailySize, activeQuestionIds }) {
  if (state.contentVersion === contentVersion) return { refreshed: false, state };

  const daily = { ...(state.daily || {}) };
  const history = [...(state.history || [])];
  for (const [date, session] of Object.entries(daily)) {
    reserveHistoryIds(history, date, session?.questionIds || []);
  }
  for (const [weekKey, exam] of Object.entries(state.weeklyExams || {})) {
    reserveHistoryIds(history, sundayFor(weekKey), exam?.questionIds || []);
  }

  const todaySession = daily[todayKey];
  if (todaySession && !todaySession.completedAt && (
    !Array.isArray(todaySession.questionIds) ||
    todaySession.questionIds.length < dailySize ||
    (activeQuestionIds && todaySession.questionIds.some((id) => !activeQuestionIds.has(id)))
  )) {
    delete daily[todayKey];
  }

  return { refreshed: true, state: { ...state, contentVersion, daily, history } };
}
