import { guideSections, pathNotes } from "./guide-content.js";

const choice = document.querySelector("#guideChoice");
const experience = document.querySelector("#guideExperience");
const sectionsNav = document.querySelector("#guideSections");
const content = document.querySelector("#guideContent");
const pathLabel = document.querySelector("#guidePathLabel");
const progress = document.querySelector("#guideProgress");
const previous = document.querySelector("#previousGuideSection");
const next = document.querySelector("#nextGuideSection");
let path = null;
let sectionIndex = 0;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function sourceLinks(sources) {
  return `<div class="guide-sources" aria-label="Sources">${sources.map((source) =>
    `<a href="${escapeHtml(source.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)} <span aria-hidden="true">↗</span></a>`,
  ).join("")}</div>`;
}

function itemMarkup(item, number = null) {
  return `<article class="guide-item">
    ${number === null ? "" : `<span class="guide-number" aria-hidden="true">${number}</span>`}
    <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p>${sourceLinks(item.sources)}</div>
  </article>`;
}

function recitationMarkup(item) {
  return `<article class="recitation-item">
    <h3>${escapeHtml(item.title)}</h3>
    <p class="arabic" lang="ar" dir="rtl">${escapeHtml(item.arabic)}</p>
    <div class="recitation-translation"><span>Pronunciation</span><p>${escapeHtml(item.transliteration)}</p></div>
    <div class="recitation-translation"><span>Meaning</span><p>${escapeHtml(item.meaning)}</p></div>
    ${sourceLinks(item.sources)}
  </article>`;
}

function render() {
  if (!path) return;
  const sections = guideSections(path);
  const section = sections[sectionIndex];
  pathLabel.textContent = pathNotes[path].label;
  progress.textContent = `${sectionIndex + 1} of ${sections.length}`;
  previous.disabled = sectionIndex === 0;
  next.disabled = sectionIndex === sections.length - 1;
  next.textContent = next.disabled ? "End of guide" : "Next";
  sectionsNav.innerHTML = sections.map((entry, index) =>
    `<button type="button" data-section="${index}" ${index === sectionIndex ? 'aria-current="step"' : ""}>
      <span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(entry.title)}
    </button>`,
  ).join("");

  const patterns = section.patterns
    ? `<div class="prayer-patterns" aria-label="Obligatory prayer rak'ah counts">${section.patterns.map((prayer) =>
      `<div><strong>${escapeHtml(prayer.name)}</strong><span>${prayer.count} rak'ahs</span>${sourceLinks(prayer.sources)}</div>`,
    ).join("")}</div>` : "";
  const items = section.items
    ? `<div class="guide-item-list">${section.items.map((item, index) => itemMarkup(item, sectionIndex === 1 ? index + 1 : null)).join("")}</div>` : "";
  const recitations = section.recitations
    ? `<div class="recitation-note"><p>The English meaning helps understanding; it is not a substitute for the Arabic recitation in prayer.</p>${sourceLinks([{ label: "Qur'an 1", href: "https://quran.com/1" }, { label: "Bukhari 756", href: "https://sunnah.com/bukhari:756" }])}</div>
       <div class="recitation-list">${section.recitations.map(recitationMarkup).join("")}</div>` : "";
  const groups = section.groups
    ? section.groups.map((group) => `<section class="guide-group"><h3>${escapeHtml(group.title)}</h3><div class="guide-item-list">${group.items.map((item) => itemMarkup(item)).join("")}</div></section>`).join("") : "";
  content.innerHTML = `<div class="guide-content-heading"><span>Section ${String(sectionIndex + 1).padStart(2, "0")}</span><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.lead)}</p></div>${patterns}${items}${recitations}${groups}`;
}

function selectSection(index) {
  if (!path || index < 0 || index >= guideSections(path).length) return;
  sectionIndex = index;
  render();
  experience.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

choice.addEventListener("click", (event) => {
  const button = event.target.closest("[data-guide]");
  if (!button) return;
  path = button.dataset.guide;
  sectionIndex = 0;
  choice.hidden = true;
  experience.hidden = false;
  render();
  sectionsNav.querySelector("button")?.focus();
});

document.querySelector("#switchGuide").addEventListener("click", () => {
  path = null;
  sectionIndex = 0;
  experience.hidden = true;
  choice.hidden = false;
  choice.querySelector("button")?.focus();
});

sectionsNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-section]");
  if (button) selectSection(Number(button.dataset.section));
});
previous.addEventListener("click", () => selectSection(sectionIndex - 1));
next.addEventListener("click", () => selectSection(sectionIndex + 1));
