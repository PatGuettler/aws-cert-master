import { getKeytrainIssuance } from "./keytrain-storage.js";
import {
  downloadKeytrainCertificatePdf,
  preloadKeytrainCertificatePdf,
} from "./keytrain-certificate.js";
import { isQuestionCorrect } from "./scoring.js";

/**
 * @param {import('./keytrain-loader.js').KeytrainCertSummary[]} catalog
 * @param {(keytrainId: string) => void} onSelect
 */
/**
 * @param {import('./keytrain-loader.js').KeytrainCertSummary[]} items
 * @param {HTMLElement|null} grid
 * @param {(keytrainId: string) => void} onSelect
 */
function renderKeytrainGrid(items, grid, onSelect) {
  if (!grid) return;
  grid.innerHTML = "";
  for (const item of items) {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "landing-cert-tile keytrain-tile";
    const issued = getKeytrainIssuance(item.id);

    const level = document.createElement("span");
    level.className = "landing-cert-tile-level";
    level.textContent = item.level || "Certification";

    const title = document.createElement("span");
    title.className = "landing-cert-tile-title";
    title.textContent = item.certificateTitle;

    const code = document.createElement("span");
    code.className = "landing-cert-tile-code";
    code.textContent = item.code;

    const meta = document.createElement("span");
    meta.className = "landing-cert-tile-meta";
    meta.textContent = issued?.passed
      ? `Certified · ${issued.recipientName}`
      : "Pass/fail assessment · PDF certificate";

    tile.append(level, title, code, meta);
    tile.addEventListener("click", () => onSelect(item.id));
    grid.appendChild(tile);
  }
}

/** @deprecated Certification grids render via renderKeytrainHub in key-training-ui.js */
export function renderKeytrainHub(_catalog, _onSelect) {
  /* unified hub in key-training-ui.js */
}

/**
 * @param {object} program
 * @param {import('./keytrain-loader.js').KeytrainCertSummary} summary
 */
export function renderKeytrainCertPage(program, summary) {
  const { keytrain, cert, examMeta, brand, tagline } = program;
  const issued = getKeytrainIssuance(keytrain.id);

  document.getElementById("keytrain-cert-title")?.replaceChildren(
    document.createTextNode(keytrain.certificateTitle)
  );
  const codeEl = document.getElementById("keytrain-cert-code");
  if (codeEl) codeEl.textContent = `${examMeta.code} · ${brand}`;

  const desc = document.getElementById("keytrain-cert-description");
  if (desc) {
    desc.textContent =
      `${tagline} This is a formal timed assessment (${cert.exam.totalQuestions} scenario questions, ` +
      `${cert.exam.timeLimitMinutes} minutes, passing ${cert.exam.passingScore}/${cert.exam.maxScore}). ` +
      `Answer choices are balanced in length—you must read scenarios, not guess by wording. ` +
      `After submit you get full review with core concepts. Pass to download your PDF certificate.`;
  }

  document.getElementById("kt-meta-questions")?.replaceChildren(
    document.createTextNode(String(cert.exam.totalQuestions))
  );
  document.getElementById("kt-meta-time")?.replaceChildren(
    document.createTextNode(String(cert.exam.timeLimitMinutes))
  );
  document.getElementById("kt-meta-pass")?.replaceChildren(
    document.createTextNode(String(cert.exam.passingScore))
  );
  document.getElementById("kt-meta-max")?.replaceChildren(
    document.createTextNode(String(cert.exam.maxScore))
  );

  const issuedBanner = document.getElementById("keytrain-issued-banner");
  const issuedText = document.getElementById("keytrain-issued-text");
  if (issued?.passed && issuedBanner && issuedText) {
    issuedText.textContent = `You passed on ${new Date(issued.issuedAt).toLocaleDateString()} as ${issued.recipientName}. Certificate ID: ${issued.certificateId}.`;
    issuedBanner.classList.remove("hidden");
  } else {
    issuedBanner?.classList.add("hidden");
  }

  const rules = document.getElementById("keytrain-rules-list");
  if (rules) {
    rules.innerHTML = "";
    const items = [
      `Timed exam (${cert.exam.timeLimitMinutes} minutes)`,
      `${cert.exam.totalQuestions} scored questions drawn from the official-weighted bank`,
      `Passing score: ${cert.exam.passingScore} of ${cert.exam.maxScore}`,
      "All options are similar length—use judgment from the scenario, not answer size",
      "No answer feedback until you submit the full exam",
      "After submit: review every question with explanations and core concepts",
      "Pause & exit is disabled during KeyTrain assessments",
      "Certificate PDF available only after a passing score",
    ];
    for (const text of items) {
      const li = document.createElement("li");
      li.textContent = text;
      rules.appendChild(li);
    }
  }
}

/**
 * @param {object} opts
 * @param {boolean} opts.passed
 * @param {number} opts.scaledScore
 * @param {import('./cert-loader.js').CertData} opts.cert
 * @param {object} opts.keytrain
 * @param {() => void} opts.onCertificate
 * @param {() => void} opts.onRetake
 * @param {() => void} opts.onHub
 */
export function renderKeytrainResults(opts) {
  const header = document.getElementById("keytrain-results-header");
  const title = document.getElementById("keytrain-results-title");
  const score = document.getElementById("keytrain-results-score");
  const detail = document.getElementById("keytrain-results-detail");
  const passActions = document.getElementById("keytrain-pass-actions");
  const failActions = document.getElementById("keytrain-fail-actions");

  header?.classList.toggle("pass", opts.passed);
  header?.classList.toggle("fail", !opts.passed);

  if (title) {
    title.textContent = opts.passed ? "Certification passed" : "Certification not passed";
  }
  if (score) {
    score.textContent = `${opts.scaledScore} / ${opts.cert.exam.maxScore}`;
  }
  if (detail) {
    detail.textContent = opts.passed
      ? `You met the passing score of ${opts.cert.exam.passingScore}. Download your KeyTrain certificate below.`
      : `You need ${opts.cert.exam.passingScore} or higher to pass. Review weak domains in practice mode, then try again.`;
  }

  passActions?.classList.toggle("hidden", !opts.passed);
  failActions?.classList.toggle("hidden", opts.passed);
}

/**
 * Full exam review with explanations and per-domain core concepts (post-submit learning).
 * @param {import('./cert-loader.js').Question[]} questions
 * @param {Record<string, string[]>} responses
 * @param {import('./cert-loader.js').CertData} cert
 */
export function renderKeytrainExamReview(questions, responses, cert) {
  const container = document.getElementById("keytrain-review-content");
  const section = document.getElementById("keytrain-review-section");
  if (!container) return;
  container.innerHTML = "";

  const domainNames = Object.fromEntries(cert.domains.map((d) => [d.id, d.name]));
  let incorrect = 0;

  for (const q of questions) {
    const selected = responses[q.id] ?? [];
    const correct = isQuestionCorrect(q, selected);
    if (!correct) incorrect++;

    const card = document.createElement("article");
    card.className = "question-card review-question";

    const badge = document.createElement("p");
    badge.className = `review-badge ${correct ? "correct-fb" : "incorrect-fb"}`;
    badge.textContent = correct ? "Correct" : "Incorrect";
    card.appendChild(badge);

    const domain = document.createElement("p");
    domain.className = "keytrain-review-domain";
    domain.textContent = domainNames[q.domain] ?? q.domain;
    card.appendChild(domain);

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
      input.type = "radio";
      input.checked = selected.includes(opt.id);
      input.disabled = true;

      const span = document.createElement("span");
      span.textContent = opt.text;
      label.append(input, span);
      li.appendChild(label);
      ul.appendChild(li);
    }
    card.appendChild(ul);

    if (q.concept) {
      const concept = document.createElement("p");
      concept.className = "keytrain-concept";
      const label = document.createElement("strong");
      label.textContent = "Core concept: ";
      concept.append(label, document.createTextNode(q.concept));
      card.appendChild(concept);
    }

    if (q.explanation) {
      const p = document.createElement("p");
      p.className = "feedback-panel";
      p.textContent = q.explanation;
      card.appendChild(p);
    }

    container.appendChild(card);
  }

  if (section) {
    const summary = section.querySelector("summary");
    if (summary) {
      summary.textContent =
        incorrect > 0
          ? `Review answers and core concepts (${incorrect} to study)`
          : "Review answers and core concepts";
    }
    section.open = incorrect > 0;
  }
}

/**
 * @param {object} handlers
 * @param {() => void} [handlers.onCertificate]
 * @param {() => void} [handlers.onRetake]
 * @param {() => void} [handlers.onHub]
 */
export function bindKeytrainResultsActions(handlers) {
  const pairs = [
    ["btn-keytrain-get-cert", handlers.onCertificate],
    ["btn-keytrain-retake-pass", handlers.onRetake],
    ["btn-keytrain-retake-fail", handlers.onRetake],
    ["btn-keytrain-hub-pass", handlers.onHub],
    ["btn-keytrain-hub-fail", handlers.onHub],
  ];
  for (const [id, fn] of pairs) {
    document.getElementById(id)?.addEventListener("click", () => fn?.());
  }
}

/**
 * @param {object} opts
 * @param {object} opts.keytrain
 * @param {import('./cert-loader.js').CertData} opts.cert
 * @param {number} opts.scaledScore
 * @param {object} [opts.existing]
 */
export function renderKeytrainCertificateForm(opts) {
  const nameInput = /** @type {HTMLInputElement|null} */ (
    document.getElementById("keytrain-recipient-name")
  );
  const preview = document.getElementById("keytrain-cert-preview");
  const err = document.getElementById("keytrain-cert-error");

  if (nameInput && opts.existing?.recipientName) {
    nameInput.value = opts.existing.recipientName;
  }

  function updatePreview() {
    const name = nameInput?.value?.trim() || "Your name";
    if (preview) {
      preview.innerHTML = `
        <p class="keytrain-preview-brand">KeyTrain</p>
        <p class="keytrain-preview-label">Certificate of achievement</p>
        <p class="keytrain-preview-name">${escapeHtml(name)}</p>
        <p class="keytrain-preview-title">${escapeHtml(opts.keytrain.certificateTitle)}</p>
      `;
    }
  }

  updatePreview();
  nameInput?.addEventListener("input", updatePreview);
  preloadKeytrainCertificatePdf();

  const downloadBtn = document.getElementById("btn-keytrain-download-pdf");
  const formRoot = document.getElementById("view-keytrain-certificate");
  if (!downloadBtn || formRoot?.dataset.certFormBound === "1") return;
  if (formRoot) formRoot.dataset.certFormBound = "1";
  downloadBtn.addEventListener("click", async () => {
    const name = nameInput?.value?.trim();
    if (!name || name.length < 2) {
      if (err) {
        err.textContent = "Enter your full name (at least 2 characters).";
        err.classList.remove("hidden");
      }
      nameInput?.focus();
      return;
    }
    err?.classList.add("hidden");
    const btn = document.getElementById("btn-keytrain-download-pdf");
    if (btn) btn.disabled = true;
    try {
      const record = opts.existing ?? {};
      const certificateId = record.certificateId ?? null;
      const issuedAt = record.issuedAt ?? new Date().toISOString();
      const certId = certificateId || opts.existing?.certificateId || "KT-PENDING";
      await downloadKeytrainCertificatePdf({
        recipientName: name,
        certificateTitle: opts.keytrain.certificateTitle,
        certificateId: certId,
        issuedAt,
        scaledScore: opts.scaledScore,
        passingScore: opts.cert.exam.passingScore,
        examCode: opts.cert.code,
      });
      if (opts.onNameSaved) {
        opts.onNameSaved(name, certId);
      }
    } catch (e) {
      if (err) {
        err.textContent = e instanceof Error ? e.message : "PDF download failed.";
        err.classList.remove("hidden");
      }
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
