export function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededShuffle(items, seedText) {
  const result = [...items];
  let seed = hashString(seedText) || 1;
  const random = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function selectDailyQuestionIds({ questions, topics, recentIds, todayKey, dailySize }) {
  const selected = [];
  const dayOrdinal = Math.floor(Date.parse(`${todayKey}T00:00:00Z`) / 86_400_000);
  const bukhariQuestions = questions.filter((question) => question.id.startsWith("bukhari-") && !recentIds.has(question.id));
  if (Number.isFinite(dayOrdinal) && dayOrdinal % 42 === 0 && bukhariQuestions.length) {
    selected.push(bukhariQuestions[hashString(`${todayKey}:bukhari`) % bukhariQuestions.length]);
  }
  const regularQuestions = questions.filter((question) => !question.id.startsWith("bukhari-"));
  for (const topic of topics) {
    if (selected.length >= dailySize) break;
    const candidates = regularQuestions.filter((question) => question.topic === topic && !recentIds.has(question.id));
    if (!candidates.length) continue;
    const index = hashString(`${todayKey}:${topic}`) % candidates.length;
    selected.push(candidates[index]);
  }

  if (selected.length < dailySize) {
    const remaining = regularQuestions.filter(
      (question) => !recentIds.has(question.id) && !selected.some((picked) => picked.id === question.id),
    );
    selected.push(...seededShuffle(remaining, `${todayKey}:fill`).slice(0, dailySize - selected.length));
  }

  return seededShuffle(selected, `${todayKey}:order`).slice(0, dailySize).map((question) => question.id);
}
