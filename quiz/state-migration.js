export function migrateQuestionContent(state, { contentVersion, todayKey, dailySize }) {
  if (state.contentVersion === contentVersion) {
    return { refreshed: false, state };
  }

  const daily = { ...(state.daily || {}) };
  const todaySession = daily[todayKey];
  if (todaySession && (!Array.isArray(todaySession.questionIds) || todaySession.questionIds.length < dailySize)) {
    delete daily[todayKey];
  }

  return {
    refreshed: true,
    state: {
      ...state,
      contentVersion,
      daily,
      history: [],
    },
  };
}
