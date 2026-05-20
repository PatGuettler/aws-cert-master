/**
 * @typedef {Object} AcronymEntry
 * @property {string} term
 * @property {string} expansion
 * @property {string} [hint]
 * @property {string} [category]
 */

/**
 * @param {AcronymEntry[]} pool
 * @param {AcronymEntry} entry
 * @param {number} count
 */
function pickDistractors(pool, entry, count) {
  const others = pool.filter(
    (a) => a.expansion !== entry.expansion && a.term !== entry.term
  );
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * @param {AcronymEntry[]} acronyms
 * @param {{ mode?: 'term-to-expansion' | 'expansion-to-term', limit?: number }} [opts]
 */
export function buildAcronymDeck(acronyms, opts = {}) {
  const mode = opts.mode ?? "term-to-expansion";
  const limit = opts.limit ?? Math.min(25, acronyms.length);
  const deck = [...acronyms].sort(() => Math.random() - 0.5).slice(0, limit);

  return deck.map((entry) => {
    if (mode === "expansion-to-term") {
      const distractors = pickDistractors(acronyms, entry, 3).map((d) => d.term);
      const options = [entry.term, ...distractors].sort(() => Math.random() - 0.5);
      return {
        entry,
        mode,
        prompt: entry.expansion,
        subprompt: entry.hint ?? "",
        options,
        correct: entry.term,
      };
    }

    const distractors = pickDistractors(acronyms, entry, 3).map(
      (d) => d.expansion
    );
    const options = [entry.expansion, ...distractors].sort(
      () => Math.random() - 0.5
    );
    return {
      entry,
      mode,
      prompt: entry.term,
      subprompt: entry.hint ?? "",
      options,
      correct: entry.expansion,
    };
  });
}

/**
 * @param {Object} opts
 * @param {import('./cert-loader.js').CertData} opts.cert
 * @param {HTMLElement} opts.container
 * @param {() => void} opts.onExit
 */
export function runAcronymQuiz({ cert, container, onExit }) {
  const acronyms = cert.acronyms ?? [];
  if (acronyms.length === 0) {
    container.innerHTML =
      "<p>No acronyms defined for this certification yet.</p>";
    return { stop: () => {} };
  }

  let mode = "term-to-expansion";
  let deck = buildAcronymDeck(acronyms, { mode });
  let index = 0;
  let correct = 0;
  let phase = "intro";

  function render() {
    if (phase === "intro") {
      container.innerHTML = `
        <div class="acronym-intro">
          <h2>Why study acronyms?</h2>
          <p>CompTIA exams are dense with abbreviations—<strong>SSH</strong>, <strong>SIEM</strong>, <strong>VLAN</strong>, <strong>UEFI</strong>, and dozens more. Instructors and exam items often assume you recognize them instantly.</p>
          <p>Most prep tools skip acronym drills. After taking these classes, many students lose points simply because a stem uses shorthand they have seen but never memorized both ways (term ↔ meaning).</p>
          <p>This mode quizzes you in both directions: see the acronym and pick the meaning, or see the meaning and pick the acronym. It is low-stakes practice that builds speed before full exam simulations.</p>
          <p class="acronym-intro-meta"><strong>${cert.name}</strong> — ${acronyms.length} terms in the bank for this cert.</p>
          <label class="acronym-mode-label">
            <span>Quiz direction</span>
            <select id="acronym-mode-select" class="acronym-mode-select">
              <option value="term-to-expansion">Acronym → meaning</option>
              <option value="expansion-to-term">Meaning → acronym</option>
              <option value="mixed">Mixed (both)</option>
            </select>
          </label>
          <button type="button" id="acronym-start-btn" class="btn btn-primary">Start acronym quiz</button>
        </div>`;

      document.getElementById("acronym-mode-select")?.addEventListener("change", (e) => {
        mode = e.target.value;
      });
      document.getElementById("acronym-start-btn")?.addEventListener("click", () => {
        if (mode === "mixed") {
          const half = buildAcronymDeck(acronyms, {
            mode: "term-to-expansion",
            limit: 13,
          });
          const half2 = buildAcronymDeck(acronyms, {
            mode: "expansion-to-term",
            limit: 12,
          });
          deck = [...half, ...half2].sort(() => Math.random() - 0.5);
        } else {
          deck = buildAcronymDeck(acronyms, { mode, limit: 25 });
        }
        index = 0;
        correct = 0;
        phase = "quiz";
        render();
      });
      return;
    }

    if (phase === "done") {
      const pct = Math.round((correct / deck.length) * 100);
      container.innerHTML = `
        <div class="acronym-results">
          <h2>Acronym quiz complete</h2>
          <p class="acronym-score">${correct} / ${deck.length} correct (${pct}%)</p>
          <p>Run again to shuffle terms and try the other direction in the menu above.</p>
          <button type="button" id="acronym-retry" class="btn btn-secondary">Try again</button>
          <button type="button" id="acronym-exit" class="btn btn-outline">Back to exam page</button>
        </div>`;
      document.getElementById("acronym-retry")?.addEventListener("click", () => {
        phase = "intro";
        render();
      });
      document.getElementById("acronym-exit")?.addEventListener("click", onExit);
      return;
    }

    const card = deck[index];
    const optionsHtml = card.options
      .map(
        (opt) =>
          `<button type="button" class="acronym-option" data-value="${escapeAttr(opt)}">${escapeHtml(opt)}</button>`
      )
      .join("");

    container.innerHTML = `
      <div class="acronym-quiz">
        <p class="acronym-progress">Card ${index + 1} of ${deck.length}</p>
        <div class="progress-bar" aria-hidden="true">
          <div class="progress-fill" style="width:${((index + 1) / deck.length) * 100}%"></div>
        </div>
        <p class="acronym-prompt-label">${card.mode === "term-to-expansion" ? "What does this stand for?" : "Which acronym matches?"}</p>
        <p class="acronym-prompt">${escapeHtml(card.prompt)}</p>
        ${card.subprompt ? `<p class="acronym-hint">${escapeHtml(card.subprompt)}</p>` : ""}
        <div class="acronym-options" id="acronym-options">${optionsHtml}</div>
        <p id="acronym-feedback" class="acronym-feedback hidden" role="status"></p>
        <button type="button" id="acronym-next" class="btn btn-primary hidden">Next</button>
      </div>`;

    container.querySelectorAll(".acronym-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (container.dataset.answered === "true") return;
        container.dataset.answered = "true";
        const val = btn.getAttribute("data-value");
        const ok = val === card.correct;
        if (ok) correct++;

        container.querySelectorAll(".acronym-option").forEach((b) => {
          b.disabled = true;
          const v = b.getAttribute("data-value");
          if (v === card.correct) b.classList.add("correct");
          else if (b === btn && !ok) b.classList.add("incorrect");
        });

        const fb = document.getElementById("acronym-feedback");
        if (fb) {
          fb.classList.remove("hidden");
          fb.textContent = ok
            ? `Correct — ${card.entry.term}: ${card.entry.expansion}`
            : `Correct answer: ${card.correct}`;
        }
        document.getElementById("acronym-next")?.classList.remove("hidden");
      });
    });

    document.getElementById("acronym-next")?.addEventListener(
      "click",
      () => {
        delete container.dataset.answered;
        index++;
        if (index >= deck.length) {
          phase = "done";
        }
        render();
      },
      { once: true }
    );
  }

  render();
  return {
    stop: () => {
      container.innerHTML = "";
    },
  };
}

/**
 * @param {string} text
 */
function escapeHtml(text) {
  const el = document.createElement("span");
  el.textContent = text;
  return el.innerHTML;
}

/**
 * @param {string} text
 */
function escapeAttr(text) {
  return text.replace(/"/g, "&quot;");
}
