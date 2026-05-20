import { isQuestionCorrect } from "./scoring.js";

/**
 * @param {import('./cert-loader.js').Question} q
 * @param {Record<string, string[]>} responses
 * @param {import('./config.js').ExamSettings} settings
 */
function renderReviewQuestion(q, responses, settings) {
  const card = document.createElement("article");
  card.className = "question-card review-question";

  const selected = responses[q.id] ?? [];
  const correct = isQuestionCorrect(q, selected);

  const badge = document.createElement("p");
  badge.className = `review-badge ${correct ? "correct-fb" : "incorrect-fb"}`;
  badge.textContent = correct ? "Correct" : "Incorrect";
  card.appendChild(badge);

  const text = document.createElement("p");
  text.className = "question-text";
  text.textContent = q.text;
  card.appendChild(text);

  const ul = document.createElement("ul");
  ul.className = "options";
  for (const opt of q.options) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    label.className = "option-label";
    if (q.correct.includes(opt.id)) label.classList.add("correct");
    else if (selected.includes(opt.id)) label.classList.add("incorrect");
    if (selected.includes(opt.id)) label.classList.add("selected");

    const input = document.createElement("input");
    input.type = q.type === "multiple-response" ? "checkbox" : "radio";
    input.checked = selected.includes(opt.id);
    input.disabled = true;

    const span = document.createElement("span");
    span.textContent = opt.text;
    label.append(input, span);
    li.appendChild(label);
    ul.appendChild(li);
  }
  card.appendChild(ul);

  if (q.explanation) {
    const p = document.createElement("p");
    p.className = "feedback-panel";
    p.textContent = q.explanation;
    card.appendChild(p);
  }

  if (settings.showDocLinks && q.docs?.length) {
    const docUl = document.createElement("ul");
    docUl.className = "doc-links";
    for (const doc of q.docs) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = doc.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = doc.title;
      li.appendChild(a);
      docUl.appendChild(li);
    }
    card.appendChild(docUl);
  }

  return card;
}

/**
 * @param {import('./cert-loader.js').Question[]} questions
 * @param {Record<string, string[]>} responses
 * @param {import('./config.js').ExamSettings} settings
 */
export function renderBookmarkReview(questions, responses, settings) {
  const container = document.getElementById("bookmark-review-content");
  if (!container) return;

  container.innerHTML = "";
  if (questions.length === 0) {
    container.innerHTML =
      "<p>No questions were flagged for review on this attempt.</p>";
    return;
  }

  for (const q of questions) {
    container.appendChild(renderReviewQuestion(q, responses, settings));
  }
}
