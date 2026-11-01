import assert from "node:assert/strict";
import test from "node:test";
import { coreSteps, guideSections, obligatoryPrayers, recitations } from "../guide-content.js";

test("both guide paths keep the same prayer sequence and obligatory counts", () => {
  const men = guideSections("men");
  const women = guideSections("women");
  assert.deepEqual(men.map(({ title }) => title), women.map(({ title }) => title));
  assert.strictEqual(men[1].items, coreSteps);
  assert.strictEqual(women[1].items, coreSteps);
  assert.strictEqual(men[2].patterns, obligatoryPrayers);
  assert.deepEqual(obligatoryPrayers.map(({ count }) => count), [2, 4, 4, 3, 4]);
});

test("every guide item and recitation has a direct allowed source", () => {
  const items = new Set(recitations);
  for (const path of ["men", "women"]) {
    for (const section of guideSections(path)) {
      for (const item of section.items || []) items.add(item);
      for (const item of section.patterns || []) items.add(item);
      for (const group of section.groups || []) {
        for (const item of group.items) items.add(item);
      }
    }
  }
  for (const item of items) {
    assert.ok(item.sources?.length, `Missing source: ${item.title || item.name}`);
    for (const source of item.sources) {
      const url = new URL(source.href);
      assert.ok(["quran.com", "sunnah.com"].includes(url.hostname), `Unapproved source: ${source.href}`);
      assert.ok(url.pathname.length > 1, `Source is not direct: ${source.href}`);
    }
  }
});
