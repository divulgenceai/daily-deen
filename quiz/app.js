import { QUESTION_LIBRARY_META, QUESTIONS, TOPICS } from "./questions.js";
import { DAILY_SIZE, isPassingWeeklyExam, isWeeklyExamExpired, LOCKOUT_DAYS, weeklyExamPassScore, WEEKLY_BONUS_SIZE } from "./rules.js";
import { buildWeeklyExamQuestionIds, WEEKLY_EXAM_FORMAT_VERSION } from "./weekly-exam.js";
import { seededShuffle, selectDailyQuestionIds } from "./daily-selection.js";
import { migrateQuestionContent } from "./state-migration.js";

const STORAGE_KEY = "daily-deen-quiz-state-v1";
const CONTENT_VERSION = 3;
const DAY_MS = 86_400_000;
const letters = ["A", "B", "C", "D"];

const elements = {
  displayDate: document.querySelector("#displayDate"),
  mobileDisplayDate: document.querySelector("#mobileDisplayDate"),
  dayHeadingTitle: document.querySelector("#dayHeadingTitle"),
  mobileDayHeadingTitle: document.querySelector("#mobileDayHeadingTitle"),
  progressCount: document.querySelector("#progressCount"),
  progressTotal: document.querySelector("#progressTotal"),
  mobileProgressCount: document.querySelector("#mobileProgressCount"),
  mobileProgressTotal: document.querySelector("#mobileProgressTotal"),
  questionSteps: document.querySelector("#questionSteps"),
  mobileSteps: document.querySelector("#mobileSteps"),
  weekdayLabels: document.querySelector("#weekdayLabels"),
  stageContent: document.querySelector("#stageContent"),
  streakCount: document.querySelector("#streakCount"),
  dialog: document.querySelector("#infoDialog"),
  dialogKicker: document.querySelector("#dialogKicker"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogBody: document.querySelector("#dialogBody"),
  toast: document.querySelector("#toast"),
};

let libraryWasRefreshed = false;
let store = loadStore();
let activeMode = "daily";
let toastTimer = 0;
let renderMotion = "question";
const today = new Date();
const todayKey = toDateKey(today);

reconcileStreak();
ensureDailyQuiz();
render();
if (libraryWasRefreshed) {
  showToast(`Question library refreshed — ${QUESTION_LIBRARY_META.reviewedQuestions.toLocaleString()} questions are now ready.`);
}

document.addEventListener("click", (event) => {
  const answerButton = event.target.closest("[data-answer]");
  if (answerButton) {
    selectAnswer(answerButton.dataset.answer);
    return;
  }

  const actionButton = event.target.closest("[data-quiz-action]");
  if (actionButton) {
    handleQuizAction(actionButton.dataset.quizAction);
    return;
  }

  const dialogTrigger = event.target.closest("[data-dialog]");
  if (dialogTrigger) {
    openInfoDialog(dialogTrigger.dataset.dialog);
  }
});

function emptyStore() {
  return {
    contentVersion: CONTENT_VERSION,
    daily: {},
    history: [],
    streak: {
      count: 0,
      lastCompletedDate: null,
      pendingExam: null,
    },
    weeklyExams: {},
  };
}

function loadStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed || typeof parsed !== "object") return emptyStore();
    let loaded = {
      ...emptyStore(),
      ...parsed,
      contentVersion: parsed.contentVersion,
      streak: { ...emptyStore().streak, ...(parsed.streak || {}) },
      daily: parsed.daily || {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
      weeklyExams: parsed.weeklyExams || {},
    };

    const migration = migrateQuestionContent(loaded, {
      contentVersion: CONTENT_VERSION,
      todayKey: toDateKey(new Date()),
      dailySize: DAILY_SIZE,
    });
    loaded = migration.state;
    if (migration.refreshed) {
      libraryWasRefreshed = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
    }

    return loaded;
  } catch {
    return emptyStore();
  }
}

function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function addDays(key, amount) {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

function dayDifference(earlier, later) {
  return Math.round((fromDateKey(later) - fromDateKey(earlier)) / DAY_MS);
}

function mondayFor(key) {
  const date = fromDateKey(key);
  const weekday = date.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  date.setDate(date.getDate() + offset);
  return toDateKey(date);
}

function reconcileStreak() {
  const { streak } = store;
  let changed = false;

  if (isWeeklyExamExpired(streak.pendingExam, todayKey)) {
    streak.count = 0;
    streak.pendingExam.status = "missed";
    changed = true;
  }

  if (streak.lastCompletedDate && dayDifference(streak.lastCompletedDate, todayKey) > 1) {
    streak.count = 0;
    changed = true;
  }

  if (changed) saveStore();
}

function ensureDailyQuiz() {
  if (store.daily[todayKey]) return;

  const recentIds = new Set(
    store.history
      .filter((entry) => dayDifference(entry.date, todayKey) >= 0 && dayDifference(entry.date, todayKey) < LOCKOUT_DAYS)
      .map((entry) => entry.questionId),
  );

  store.daily[todayKey] = {
    date: todayKey,
    questionIds: selectDailyQuestionIds({
      questions: QUESTIONS,
      topics: TOPICS,
      recentIds,
      todayKey,
      dailySize: DAILY_SIZE,
    }),
    currentIndex: 0,
    answers: {},
    draft: null,
    completedAt: null,
    score: null,
  };
  saveStore();
}

function getQuestion(id) {
  return QUESTIONS.find((question) => question.id === id);
}

function currentSession() {
  if (activeMode === "exam") {
    const pending = store.streak.pendingExam;
    return pending ? store.weeklyExams[pending.weekKey] : null;
  }
  return store.daily[todayKey];
}

function render() {
  const daily = store.daily[todayKey];
  const session = currentSession() || daily;
  const total = session.questionIds.length || DAILY_SIZE;
  const index = Math.min(session.currentIndex || 0, total - 1);
  const progress = session.completedAt ? total : index + 1;
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(today);

  const isExam = activeMode === "exam";
  const contextLabel = isExam ? `${total} questions · ${weeklyExamPassScore(total)} to pass` : formattedDate;
  elements.dayHeadingTitle.textContent = isExam ? "Weekly exam" : "Today’s seven";
  elements.mobileDayHeadingTitle.textContent = isExam ? "Weekly exam" : "Today’s seven";
  elements.displayDate.textContent = contextLabel;
  elements.mobileDisplayDate.textContent = contextLabel;
  elements.progressCount.textContent = String(progress).padStart(2, "0");
  elements.progressTotal.textContent = `/ ${String(total).padStart(2, "0")}`;
  elements.mobileProgressCount.textContent = String(progress).padStart(2, "0");
  elements.mobileProgressTotal.textContent = `/ ${String(total).padStart(2, "0")}`;
  elements.streakCount.textContent = String(store.streak.count || 0);
  renderSteps(session);
  renderWeekdays();

  renderStage(daily, session);
}

function renderStage(daily, session) {
  if (!daily.questionIds.length) {
    renderContentLimit();
  } else if (activeMode === "exam") {
    if (session?.completedAt) renderExamResult(session);
    else renderQuestion(session, "exam");
  } else if (daily.completedAt) {
    renderDailyResult(daily);
  } else {
    renderQuestion(daily, "daily");
  }
}

function renderSteps(session) {
  const total = session.questionIds.length || DAILY_SIZE;
  const currentIndex = Math.min(session.currentIndex || 0, total - 1);
  const completed = Boolean(session.completedAt);
  const railProgress = completed ? 100 : total > 1 ? (currentIndex / (total - 1)) * 100 : 0;
  const currentNumber = completed ? total : currentIndex + 1;

  elements.questionSteps.classList.toggle("long-session", total > DAILY_SIZE);
  elements.mobileSteps.classList.toggle("long-session", total > DAILY_SIZE);
  elements.questionSteps.style.setProperty("--step-progress", `${railProgress}%`);

  if (total > DAILY_SIZE) {
    const progressMarkup = `<div class="long-progress-copy"><strong>${currentNumber} of ${total}</strong><span>${completed ? "Complete" : `${total - currentNumber} remaining`}</span></div>
      <div class="long-progress-track" role="progressbar" aria-label="Weekly exam progress" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${currentNumber}"><span style="width: ${railProgress}%"></span></div>`;
    elements.questionSteps.innerHTML = `<li class="long-progress">${progressMarkup}</li>`;
    elements.mobileSteps.innerHTML = `<div class="long-progress">${progressMarkup}</div>`;
    return;
  }

  elements.questionSteps.innerHTML = Array.from({ length: DAILY_SIZE }, (_, index) => {
    const done = completed || index < currentIndex;
    const current = !completed && index === currentIndex;
    const dot = done
      ? '<svg viewBox="0 0 24 24" width="18" aria-hidden="true"><path d="m6 12 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : String(index + 1);
    return `<li class="step-item${done ? " done" : ""}${current ? " current" : ""}">
      <span class="step-dot">${dot}</span>
      <span class="step-number">${index + 1}</span>
      <span class="step-you-are-here">${current ? "You are here" : ""}</span>
    </li>`;
  }).join("");

  elements.mobileSteps.innerHTML = Array.from({ length: DAILY_SIZE }, (_, index) => {
    const done = completed || index < currentIndex;
    const current = !completed && index === currentIndex;
    const dot = done
      ? '<svg viewBox="0 0 24 24" width="16" aria-hidden="true"><path d="m6 12 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : String(index + 1);
    return `<div class="mobile-step${done ? " done" : ""}${current ? " current" : ""}">
      <span class="mobile-step-dot">${dot}</span><span>${current ? "You are here" : ""}</span>
    </div>`;
  }).join("");
}

function renderWeekdays() {
  const monday = mondayFor(todayKey);
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  elements.weekdayLabels.innerHTML = labels.map((label, index) => {
    const date = addDays(monday, index);
    const complete = Boolean(store.daily[date]?.completedAt);
    const isToday = date === todayKey;
    const dot = complete ? "✓" : isToday ? "●" : "";
    return `<div class="weekday${complete ? " complete" : ""}${isToday ? " today" : ""}">
      <span>${label}</span><span class="weekday-dot">${dot}</span>
    </div>`;
  }).join("");
}

function choiceOrder(question, mode) {
  return seededShuffle(question.choices, `${todayKey}:${mode}:${question.id}:choices`);
}

function renderQuestion(session, mode) {
  const questionId = session.questionIds[session.currentIndex];
  const question = getQuestion(questionId);
  if (!question) {
    renderContentLimit();
    return;
  }

  const answer = session.answers[questionId];
  const selected = answer?.selected || (session.draft?.questionId === questionId ? session.draft.selected : null);
  const revealed = Boolean(answer?.revealed);
  const choices = choiceOrder(question, mode);
  const total = session.questionIds.length;
  const actionLabel = revealed ? (session.currentIndex === total - 1 ? "See my score" : "Next question") : "Check answer";
  const motionClass = `motion-${renderMotion}`;
  const passageClass = question.id.startsWith("quran-passage-") ? " passage-question" : "";

  elements.stageContent.innerHTML = `<div class="question-shell ${motionClass}${passageClass}">
    <p class="topic-label">${mode === "exam" ? `Weekly exam ${session.currentIndex + 1}/${total} · ${escapeHtml(question.topic)}` : escapeHtml(question.topic)}</p>
    <h2 class="question-title">${escapeHtml(question.prompt)}</h2>
    <div class="answer-list" role="group" aria-label="Answer choices">
      ${choices.map((choice, index) => renderAnswerOption(question, choice, index, selected, revealed)).join("")}
    </div>
    ${revealed ? renderFeedback(question, answer) : ""}
    <button class="primary-action" type="button" data-quiz-action="${revealed ? "continue" : "check"}" ${selected ? "" : "disabled"}>
      <span>${actionLabel}</span>
      <svg class="action-arrow" viewBox="0 0 32 24" aria-hidden="true"><path d="M3 12h25M21 4l8 8-8 8"/></svg>
    </button>
    ${revealed ? "" : `<p class="source-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H7a3 3 0 0 0-3 3zM4 5.5V21M8 7h8M8 11h7"/></svg><span>Sources and a short explanation appear after every answer.</span></p>`}
  </div>`;
  renderMotion = "idle";
}

function renderAnswerOption(question, choice, index, selected, revealed) {
  const isSelected = choice === selected;
  const isCorrect = choice === question.answer;
  const classes = ["answer-option"];
  if (isSelected) classes.push("selected");
  if (revealed && isCorrect) classes.push("correct");
  if (revealed && isSelected && !isCorrect) classes.push("incorrect");

  let stateIcon = "";
  if (revealed && isCorrect) {
    stateIcon = '<svg class="answer-state-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>';
  } else if (revealed && isSelected && !isCorrect) {
    stateIcon = '<svg class="answer-state-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
  }

  return `<button class="${classes.join(" ")}" style="--answer-index: ${index}" type="button" data-answer="${escapeAttribute(choice)}" ${revealed ? "disabled" : ""} aria-pressed="${isSelected}">
    <span class="answer-letter">${letters[index]}</span>
    <span>${escapeHtml(choice)}</span>
    ${stateIcon}
  </button>`;
}

function renderFeedback(question, answer) {
  const correct = answer.selected === question.answer;
  if (correct) {
    return `<section class="feedback-panel correct compact" aria-label="Correct answer explanation">
      <div class="feedback-heading">
        <strong><span class="feedback-mark" aria-hidden="true">✓</span> Correct</strong>
        <a class="source-link" href="${escapeAttribute(question.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(question.source)} <span aria-hidden="true">↗</span></a>
      </div>
      <p>${escapeHtml(question.explanation)}</p>
    </section>`;
  }

  return `<section class="feedback-panel wrong detailed" aria-label="Incorrect answer explanation">
    <div class="feedback-heading">
      <strong>Not quite — the answer is ${escapeHtml(question.answer)}</strong>
      <a class="source-link" href="${escapeAttribute(question.url)}" target="_blank" rel="noopener noreferrer">Read the source <span aria-hidden="true">↗</span></a>
    </div>
    <div class="explanation-grid">
      <div class="explanation-part">
        <span class="explanation-label">Why this is correct</span>
        <p>${escapeHtml(question.explanation)}</p>
      </div>
      <div class="explanation-part">
        <span class="explanation-label">Why your answer missed</span>
        <p>Your choice, “${escapeHtml(answer.selected)},” is not the fact identified by ${escapeHtml(question.source)}. For this question, the cited source supports “${escapeHtml(question.answer)}.”</p>
      </div>
      <div class="explanation-part memory-cue">
        <span class="explanation-label">Memory cue</span>
        <p><span>${escapeHtml(question.prompt)}</span><strong>${escapeHtml(question.answer)}</strong></p>
      </div>
    </div>
  </section>`;
}

function selectAnswer(choice) {
  const session = currentSession();
  const questionId = session?.questionIds[session.currentIndex];
  if (!session || !questionId || session.answers[questionId]?.revealed) return;
  session.draft = { questionId, selected: choice };
  renderMotion = "selection";
  saveStore();
  renderStage(store.daily[todayKey], session);
}

function handleQuizAction(action) {
  if (action === "check") checkAnswer();
  if (action === "continue") continueQuiz();
  if (action === "start-exam") startWeeklyExam();
  if (action === "daily-result") {
    activeMode = "daily";
    render();
  }
  if (action === "share") shareResult();
  if (action === "review") openInfoDialog("review");
}

function checkAnswer() {
  const session = currentSession();
  const questionId = session?.questionIds[session.currentIndex];
  if (!session?.draft || session.draft.questionId !== questionId) return;
  const question = getQuestion(questionId);
  session.answers[questionId] = {
    selected: session.draft.selected,
    correct: session.draft.selected === question.answer,
    revealed: true,
  };
  session.draft = null;
  renderMotion = "feedback";
  saveStore();
  renderStage(store.daily[todayKey], session);
}

function continueQuiz() {
  const session = currentSession();
  if (!session) return;
  if (session.currentIndex < session.questionIds.length - 1) {
    session.currentIndex += 1;
    renderMotion = "question";
    saveStore();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (activeMode === "exam") completeWeeklyExam(session);
  else completeDailyQuiz(session);
}

function completeDailyQuiz(session) {
  session.score = Object.values(session.answers).filter((answer) => answer.correct).length;
  session.completedAt = new Date().toISOString();

  const lastDate = store.streak.lastCompletedDate;
  if (lastDate !== todayKey) {
    store.streak.count = lastDate && dayDifference(lastDate, todayKey) === 1 ? store.streak.count + 1 : 1;
    store.streak.lastCompletedDate = todayKey;
  }

  for (const questionId of session.questionIds) {
    if (!store.history.some((entry) => entry.date === todayKey && entry.questionId === questionId)) {
      store.history.push({ date: todayKey, questionId });
    }
  }
  store.history = store.history.filter((entry) => dayDifference(entry.date, todayKey) < LOCKOUT_DAYS + 14);

  if (today.getDay() === 0) {
    const weekKey = mondayFor(todayKey);
    store.streak.pendingExam = {
      weekKey,
      dueDate: todayKey,
      expiresDate: addDays(todayKey, 1),
      status: "pending",
    };
    ensureWeeklyExam(weekKey);
  }

  saveStore();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function ensureWeeklyExam(weekKey) {
  const existing = store.weeklyExams[weekKey];
  if (existing?.completedAt || existing?.formatVersion === WEEKLY_EXAM_FORMAT_VERSION) return existing;

  const dailySessions = Array.from({ length: 6 }, (_, offset) => store.daily[addDays(weekKey, offset)]);
  const questionIds = buildWeeklyExamQuestionIds({
    weekKey,
    dailySessions,
    allQuestionIds: QUESTIONS.map((question) => question.id),
    shuffle: seededShuffle,
  });

  store.weeklyExams[weekKey] = {
    weekKey,
    formatVersion: WEEKLY_EXAM_FORMAT_VERSION,
    questionIds,
    currentIndex: 0,
    answers: {},
    draft: null,
    completedAt: null,
    score: null,
    passed: null,
  };
  return store.weeklyExams[weekKey];
}

function startWeeklyExam() {
  const pending = store.streak.pendingExam;
  if (!pending || pending.status !== "pending") {
    showToast("The weekly exam unlocks after Sunday’s daily quiz and stays open through Monday.");
    return;
  }
  ensureWeeklyExam(pending.weekKey);
  activeMode = "exam";
  renderMotion = "question";
  saveStore();
  render();
  elements.dialog.close();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function completeWeeklyExam(session) {
  session.score = Object.values(session.answers).filter((answer) => answer.correct).length;
  session.completedAt = new Date().toISOString();
  session.passed = isPassingWeeklyExam(session.score, session.questionIds.length);
  store.streak.pendingExam.status = session.passed ? "passed" : "failed";
  if (!session.passed) store.streak.count = 0;
  saveStore();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDailyResult(session) {
  const score = session.score || 0;
  const message = score === 7 ? "A complete seven." : score >= 5 ? "Strong work today." : "Every answer taught you something.";
  const sundayAction = store.streak.pendingExam?.status === "pending";
  elements.stageContent.innerHTML = `<section class="result-shell">
    <div class="result-heading">
      <div class="score-disc"><strong>${score}/7</strong></div>
      <div class="result-copy">
        <p class="topic-label">Daily quiz complete</p>
        <h1>${message}</h1>
        <p>Your score is saved on this device. Review every source below, then return tomorrow for a fresh set.</p>
        <div class="result-meta"><span>${store.streak.count} day streak</span><span>${sundayAction ? "Weekly exam ready" : "Next quiz tomorrow"}</span></div>
      </div>
    </div>
    ${renderReviewRows(session)}
    <div class="result-actions">
      <button class="secondary-action" type="button" data-quiz-action="review">Review explanations</button>
      <button class="primary-action" type="button" data-quiz-action="${sundayAction ? "start-exam" : "share"}"><span>${sundayAction ? "Continue to weekly exam" : "Share my score"}</span><svg class="action-arrow" viewBox="0 0 32 24" aria-hidden="true"><path d="M3 12h25M21 4l8 8-8 8"/></svg></button>
    </div>
  </section>`;
}

function renderExamResult(session) {
  const passed = session.passed;
  const total = session.questionIds.length;
  const passScore = weeklyExamPassScore(total);
  elements.stageContent.innerHTML = `<section class="result-shell">
    <div class="result-heading">
      <div class="score-disc"><strong>${session.score}/${total}</strong></div>
      <div class="result-copy">
        <p class="topic-label">Weekly exam complete</p>
        <h1>${passed ? "Streak protected." : "The streak resets here."}</h1>
        <p>${passed ? `You reached the ${passScore}/${total} pass mark. Keep building on what you reviewed.` : `You scored below ${passScore}/${total}. The streak resets, but every reviewed source stays available.`}</p>
        <div class="result-meta"><span>${store.streak.count} day streak</span><span>${passed ? "Passed" : "Not passed"}</span></div>
      </div>
    </div>
    ${renderReviewRows(session)}
    <div class="result-actions">
      <button class="secondary-action" type="button" data-quiz-action="review">Review explanations</button>
      <button class="primary-action" type="button" data-quiz-action="daily-result"><span>Back to today’s result</span><svg class="action-arrow" viewBox="0 0 32 24" aria-hidden="true"><path d="M3 12h25M21 4l8 8-8 8"/></svg></button>
    </div>
  </section>`;
}

function renderReviewRows(session) {
  return `<div class="review-list">${session.questionIds.map((id) => {
    const question = getQuestion(id);
    const answer = session.answers[id];
    const correct = answer?.correct;
    const icon = correct ? '<path d="m5 12 4 4 10-10"/>' : '<path d="m6 6 12 12M18 6 6 18"/>';
    return `<div class="review-row${correct ? "" : " wrong"}">
      <svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>
      <span>${escapeHtml(question.topic)} · ${correct ? "Correct" : `Answer: ${question.answer}`}</span>
      <a href="${escapeAttribute(question.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(question.source)} ↗</a>
    </div>`;
  }).join("")}</div>`;
}

function renderContentLimit() {
  elements.stageContent.innerHTML = `<section class="empty-state">
    <p class="topic-label">Question library unavailable</p>
    <h1>Today’s quiz could not be prepared.</h1>
    <p>The refreshed library contains enough questions for ${LOCKOUT_DAYS} no-repeat days. Close and reopen the app to reload the content pack.</p>
  </section>`;
}

function openInfoDialog(type) {
  const daily = store.daily[todayKey];
  const pending = store.streak.pendingExam;
  const topicCounts = TOPICS.map((topic) => ({
    topic,
    count: QUESTIONS.filter((question) => question.topic === topic).length,
  }));

  const dialogContent = {
    today: {
      kicker: "Your local day",
      title: "Today’s seven",
      body: `<p>Your seven questions are chosen once for ${formatLongDate(todayKey)} and saved on this device. Your score stays hidden until the end.</p>
        <div class="status-block"><strong>${daily.completedAt ? `Completed · ${daily.score}/7` : `Question ${daily.currentIndex + 1} of 7`}</strong><p>${daily.completedAt ? "Come back after midnight for a new set." : "Finish today to keep your normal daily streak moving."}</p></div>`,
    },
    topics: {
      kicker: "Source-linked curriculum",
      title: "Seven topic lanes",
      body: `<p>Each daily set spreads questions across the available lanes, then fills from the complete source-linked pool.</p>
        <div class="topic-grid">${topicCounts.map(({ topic, count }) => `<div class="topic-row"><strong>${escapeHtml(topic)}</strong><span>${count.toLocaleString()} questions</span></div>`).join("")}</div>
        <h3>Content status</h3>
        <p>The library now contains ${QUESTION_LIBRARY_META.reviewedQuestions.toLocaleString()} questions: ${QUESTION_LIBRARY_META.coreQuestions} hand-written fundamentals plus ${QUESTION_LIBRARY_META.generatedVerseQuestions.toLocaleString()} exact-reference Qur'an passage questions using Pickthall’s English rendering. The ${LOCKOUT_DAYS}-day lockout prevents a daily question from returning for two full years.</p>`,
    },
    how: {
      kicker: "One clear routine",
      title: "How it works",
      body: `<ol class="dialog-list">
        <li><span class="dialog-number">01</span><span>Answer seven multiple-choice questions every day. The final score appears only after question seven.</span></li>
        <li><span class="dialog-number">02</span><span>Open the cited Qur'an or sahih hadith source after each answer. Explanations stay short and avoid disputed rulings.</span></li>
        <li><span class="dialog-number">03</span><span>Finish the daily quiz to keep the normal streak. A missed ordinary day resets it.</span></li>
        <li><span class="dialog-number">04</span><span>After Sunday’s quiz, take a full weekly review containing every question from Monday through Saturday plus ${WEEKLY_BONUS_SIZE} bonus questions.</span></li>
        <li><span class="dialog-number">05</span><span>Score at least 70% to protect the streak. A failed exam resets immediately; a skipped exam remains open through Monday, then resets.</span></li>
      </ol>`,
    },
    streak: {
      kicker: "Consistency, not perfection",
      title: `${store.streak.count} day streak`,
      body: `<p>The daily streak records completion, not a perfect score. Learning from a wrong answer still counts as showing up.</p>
        <div class="status-block"><strong>${pending ? examStatusSentence(pending) : "No weekly exam is currently due."}</strong><p>Weekly exams unlock after the Sunday daily quiz and use Monday as the only grace day.</p></div>`,
    },
    exam: {
      kicker: "Sunday review",
      title: pending?.status === "pending" ? "Your weekly exam is ready" : "Weekly exam status",
      body: `<p>${pending ? examStatusSentence(pending) : "The weekly exam unlocks after you finish Sunday's daily quiz."}</p>
        <ol class="dialog-list">
          <li><span class="dialog-number">ALL</span><span>Every available question from Monday through Saturday, with missed answers shown first.</span></li>
          <li><span class="dialog-number">+${WEEKLY_BONUS_SIZE}</span><span>${WEEKLY_BONUS_SIZE} fresh bonus questions complete the Sunday challenge. Score 70% to pass.</span></li>
          <li><span class="dialog-number">M</span><span>If you skip Sunday, the same exam stays open until the end of Monday.</span></li>
        </ol>
        ${pending?.status === "pending" ? '<button class="primary-action" type="button" data-quiz-action="start-exam"><span>Start weekly exam</span><svg class="action-arrow" viewBox="0 0 32 24" aria-hidden="true"><path d="M3 12h25M21 4l8 8-8 8"/></svg></button>' : ""}`,
    },
    review: {
      kicker: "Source review",
      title: "Today’s explanations",
      body: renderDetailedReview(daily),
    },
  };

  const content = dialogContent[type] || dialogContent.how;
  elements.dialogKicker.textContent = content.kicker;
  elements.dialogTitle.textContent = content.title;
  elements.dialogBody.innerHTML = content.body;
  if (!elements.dialog.open) elements.dialog.showModal();
}

function renderDetailedReview(session) {
  if (!session.completedAt) return "<p>Finish today’s quiz to unlock the complete source review.</p>";
  return session.questionIds.map((id, index) => {
    const question = getQuestion(id);
    const answer = session.answers[id];
    return `<section class="status-block"><strong>${index + 1}. ${escapeHtml(question.prompt)}</strong><p>${escapeHtml(question.explanation)}</p><a class="source-link" href="${escapeAttribute(question.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(question.source)} ↗</a><p>Your answer: ${escapeHtml(answer.selected)} · ${answer.correct ? "Correct" : `Correct answer: ${escapeHtml(question.answer)}`}</p></section>`;
  }).join("");
}

function examStatusSentence(pending) {
  if (pending.status === "pending") return `Due by the end of ${formatLongDate(pending.expiresDate)}.`;
  if (pending.status === "passed") return "Passed. Your streak is protected.";
  if (pending.status === "failed") return "Not passed. The streak has reset.";
  return "The grace window closed before the exam was completed.";
}

function formatLongDate(key) {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long" }).format(fromDateKey(key));
}

async function shareResult() {
  const daily = store.daily[todayKey];
  const text = `I scored ${daily.score}/7 on today’s Daily Deen Quiz and kept a ${store.streak.count}-day streak.`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "Daily Deen Quiz", text, url: location.href });
    } else {
      await navigator.clipboard.writeText(`${text} ${location.href}`);
      showToast("Score copied to your clipboard.");
    }
  } catch (error) {
    if (error?.name !== "AbortError") showToast("Sharing is not available in this browser.");
  }
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), 2800);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
