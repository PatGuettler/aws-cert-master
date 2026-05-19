import { isQuestionCorrect } from "./scoring.js";

/**
 * @typedef {import('./cert-loader.js').Question} Question
 * @typedef {import('./cert-loader.js').CertData} CertData
 * @typedef {import('./config.js').ExamSettings} ExamSettings
 */

/**
 * @param {Object} opts
 * @param {CertData} opts.cert
 * @param {Question[]} opts.questions
 * @param {ExamSettings} opts.settings
 * @param {Record<string, string[]>} opts.responses
 * @param {(responses: Record<string, string[]>) => void} opts.onResponsesChange
 * @param {() => void} opts.onFinish
 */
export function runExam({
  cert,
  questions,
  settings,
  responses,
  onResponsesChange,
  onFinish,
}) {
  let index = 0;
  /** @type {number|null} */
  let timerId = null;
  let remainingSeconds = cert.exam.timeLimitMinutes * 60;
  /** Questions for which the user clicked Next (or Finish) and saw right/wrong feedback */
  const revealed = new Set();

  const timerEl = document.getElementById("exam-timer");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const questionCard = document.getElementById("question-card");
  const qGrid = document.getElementById("question-grid");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnFinish = document.getElementById("btn-finish");

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateTimerDisplay() {
    if (!timerEl) return;
    if (!settings.timeLimitEnabled) {
      timerEl.textContent = "No limit";
      timerEl.classList.remove("warning");
      return;
    }
    timerEl.textContent = formatTime(remainingSeconds);
    timerEl.classList.toggle("warning", remainingSeconds <= 300);
  }

  function startTimer() {
    timerEl?.classList.remove("hidden");
    updateTimerDisplay();
    if (!settings.timeLimitEnabled) return;

    timerId = window.setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();
      if (remainingSeconds <= 0) {
        stopTimer();
        onFinish();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function getSelected(q) {
    return responses[q.id] ? [...responses[q.id]] : [];
  }

  function setSelected(q, selected) {
    responses[q.id] = selected;
    onResponsesChange({ ...responses });
  }

  /**
   * @param {Question} q
   */
  function isRevealed(q) {
    return settings.immediateFeedback && revealed.has(q.id);
  }

  function renderQuestionGrid() {
    if (!qGrid) return;
    qGrid.innerHTML = "";
    questions.forEach((q, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "q-dot";
      dot.textContent = String(i + 1);
      dot.title = `Question ${i + 1}`;

      if (isRevealed(q)) {
        const correct = isQuestionCorrect(q, getSelected(q));
        dot.classList.add(correct ? "correct" : "incorrect");
        dot.title = `Question ${i + 1} — ${correct ? "Correct" : "Incorrect"}`;
      } else if ((responses[q.id] ?? []).length > 0) {
        dot.classList.add("answered");
      }

      if (i === index) dot.classList.add("current");
      dot.addEventListener("click", () => {
        index = i;
        render();
      });
      qGrid.appendChild(dot);
    });
  }

  /**
   * @param {Question} q
   * @param {boolean} showFeedback
   */
  function renderOptions(q, showFeedback) {
    const isMulti = q.type === "multiple-response";
    const selected = getSelected(q);
    const inputType = isMulti ? "checkbox" : "radio";
    const name = `q-${q.id}`;

    const ul = document.createElement("ul");
    ul.className = "options";

    for (const opt of q.options) {
      const li = document.createElement("li");
      const label = document.createElement("label");
      label.className = "option-label";

      const input = document.createElement("input");
      input.type = inputType;
      input.name = name;
      input.value = opt.id;
      input.checked = selected.includes(opt.id);
      input.disabled = showFeedback;

      if (selected.includes(opt.id)) label.classList.add("selected");

      if (showFeedback) {
        if (q.correct.includes(opt.id)) label.classList.add("correct");
        else if (selected.includes(opt.id)) label.classList.add("incorrect");
      }

      input.addEventListener("change", () => {
        if (showFeedback) return;
        let next;
        if (isMulti) {
          next = input.checked
            ? [...selected, opt.id]
            : selected.filter((id) => id !== opt.id);
        } else {
          next = [opt.id];
        }
        setSelected(q, next);
        render();
      });

      const text = document.createElement("span");
      text.textContent = opt.text;

      label.appendChild(input);
      label.appendChild(text);
      li.appendChild(label);
      ul.appendChild(li);
    }

    return ul;
  }

  /**
   * @param {Question} q
   */
  function buildFeedbackPanel(q) {
    const selected = getSelected(q);
    const correct = isQuestionCorrect(q, selected);
    const panel = document.createElement("div");
    panel.className = `feedback-panel ${correct ? "correct-fb" : "incorrect-fb"}`;

    const heading = document.createElement("h4");
    heading.textContent = correct ? "Correct" : "Incorrect";
    panel.appendChild(heading);

    if (q.explanation) {
      const p = document.createElement("p");
      p.textContent = q.explanation;
      panel.appendChild(p);
    }

    if (settings.showDocLinks && q.docs?.length) {
      const ul = document.createElement("ul");
      ul.className = "doc-links";
      for (const doc of q.docs) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = doc.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = doc.title;
        li.appendChild(a);
        ul.appendChild(li);
      }
      panel.appendChild(ul);
    }

    return panel;
  }

  /**
   * Reveal right/wrong for the current question (called from Next / Finish).
   * @returns {boolean} true if this click only revealed feedback (caller should not advance yet)
   */
  function revealCurrentIfNeeded() {
    const q = questions[index];
    if (!settings.immediateFeedback || revealed.has(q.id)) return false;
    revealed.add(q.id);
    render();
    return true;
  }

  function render() {
    const q = questions[index];
    const showFeedback = isRevealed(q);
    const atEnd = index === questions.length - 1;

    if (progressFill) {
      progressFill.style.width = `${((index + 1) / questions.length) * 100}%`;
    }
    if (progressLabel) {
      progressLabel.textContent = `Question ${index + 1} of ${questions.length}`;
    }

    if (questionCard) {
      questionCard.innerHTML = "";

      const typeLine = document.createElement("p");
      typeLine.className = "question-type";
      typeLine.textContent =
        q.type === "multiple-response"
          ? "Multiple response — select TWO or more answers"
          : "Multiple choice — select ONE answer";
      questionCard.appendChild(typeLine);

      const text = document.createElement("p");
      text.className = "question-text";
      text.textContent = q.text;
      questionCard.appendChild(text);

      questionCard.appendChild(renderOptions(q, showFeedback));

      if (showFeedback) {
        questionCard.appendChild(buildFeedbackPanel(q));
      }
    }

    renderQuestionGrid();

    if (btnPrev) btnPrev.disabled = index === 0;

    const awaitingReveal =
      settings.immediateFeedback && !revealed.has(q.id);

    if (btnNext) {
      btnNext.classList.toggle("hidden", atEnd);
      btnNext.textContent = awaitingReveal ? "Check answer" : "Next";
    }
    if (btnFinish) {
      btnFinish.classList.toggle("hidden", !atEnd);
      btnFinish.textContent = awaitingReveal ? "Check answer" : "Submit exam";
    }
  }

  btnPrev?.addEventListener("click", () => {
    if (index > 0) {
      index--;
      render();
    }
  });

  btnNext?.addEventListener("click", () => {
    if (revealCurrentIfNeeded()) return;
    if (index < questions.length - 1) {
      index++;
      render();
    }
  });

  btnFinish?.addEventListener("click", () => {
    if (revealCurrentIfNeeded()) return;

    const unanswered = questions.filter(
      (q) => (responses[q.id] ?? []).length === 0
    ).length;
    if (
      unanswered > 0 &&
      !window.confirm(
        `${unanswered} question(s) are unanswered. Unanswered questions count as incorrect. Submit anyway?`
      )
    ) {
      return;
    }
    stopTimer();
    onFinish();
  });

  startTimer();
  render();

  return { stopTimer };
}
