/**
 * Teaching content and "Get more information" panel for KeyTrain workshops.
 */

/**
 * @typedef {string|string[]|{ title?: string, paragraphs?: string[], bullets?: string[] }} LearnMoreInput
 */

/**
 * @typedef {object} TeachingContext
 * @property {boolean} [quizSubmitted]
 * @property {boolean} [quizCorrect]
 * @property {string[]} [quizSelected]
 * @property {boolean} [orderChecked]
 * @property {boolean} [orderCorrect]
 * @property {string[]} [orderPicked]
 * @property {boolean} [autoOpen]
 */

/**
 * @param {LearnMoreInput} input
 * @returns {{ title: string, paragraphs: string[], bullets: string[] }|null}
 */
export function normalizeLearnMore(input) {
  if (!input) return null;
  if (typeof input === "string") {
    return { title: "How to think through this", paragraphs: [input], bullets: [] };
  }
  if (Array.isArray(input)) {
    return { title: "How to think through this", paragraphs: [], bullets: input };
  }
  return {
    title: input.title ?? "How to think through this",
    paragraphs: input.paragraphs ?? [],
    bullets: input.bullets ?? [],
  };
}

/**
 * @param {import('../workshop-runner.js').WorkshopStep} step
 * @param {TeachingContext} [ctx]
 * @returns {{ title: string, paragraphs: string[], bullets: string[] }|null}
 */
export function buildTeachingContent(step, ctx = {}) {
  if (step.learnMore) return normalizeLearnMore(step.learnMore);

  if (step.type === "visual" && step.visual) {
    return buildVisualTeaching(step.visual, ctx);
  }
  if (step.type === "quiz") {
    return buildQuizTeaching(step, ctx);
  }
  if (step.type === "lesson") {
    return buildLessonTeaching(step);
  }
  if (step.type === "checklist") {
    return buildChecklistTeaching(step);
  }
  if (step.type === "summary") {
    return normalizeLearnMore(
      step.paragraphs?.length
        ? step.paragraphs
        : "Review these takeaways before practice exams or certification."
    );
  }
  return null;
}

/**
 * @param {import('./workshop-visual-engine.js').WorkshopVisual} visual
 * @param {TeachingContext} ctx
 */
function buildVisualTeaching(visual, ctx) {
  if (visual.learnMore) return normalizeLearnMore(visual.learnMore);

  if (visual.kind === "order") {
    return buildOrderTeaching(visual, ctx);
  }
  if (visual.kind === "flow" && visual.frames?.length) {
    return {
      title: "Step-by-step reasoning",
      paragraphs: ["Each step in the diagram explains why that part of the process matters:"],
      bullets: visual.frames.map((f, i) => `${i + 1}. ${f.label} — ${f.why}`),
    };
  }
  if (visual.kind === "hotspot" && visual.hotspots?.length) {
    return {
      title: "What each part means",
      paragraphs: ["Tap the diagram, or read the full breakdown here:"],
      bullets: visual.hotspots.map((h) => `${h.label} — ${h.why}`),
    };
  }
  if (visual.kind === "compare" && visual.left && visual.right) {
    return {
      title: "Compare both approaches",
      paragraphs: [
        `Without protection: ${visual.left.body}`,
        `With protection: ${visual.right.body}`,
      ],
      bullets: [
        "Use the tabs on the diagram to switch views.",
        "Training goal: recognize which controls remove the risky path.",
      ],
    };
  }
  return null;
}

/**
 * @param {import('./workshop-visual-engine.js').WorkshopVisual} visual
 * @param {TeachingContext} ctx
 */
function buildOrderTeaching(visual, ctx) {
  const correct = visual.correctOrder ?? [];
  const items = visual.orderItems ?? [];
  const byId = Object.fromEntries(items.map((it) => [it.id, it.label]));

  /** @type {string[]} */
  const bullets = [];

  if (visual.orderSuccess) {
    bullets.push(`Summary: ${visual.orderSuccess}`);
  }

  correct.forEach((id, i) => {
    const note = visual.orderStepNotes?.[id];
    bullets.push(
      `Step ${i + 1} — ${byId[id] ?? id}${note ? `: ${note}` : ""}`
    );
  });

  const distractorIds = items.map((it) => it.id).filter((id) => !correct.includes(id));
  for (const id of distractorIds) {
    const note = visual.orderDistractorNotes?.[id];
    if (note) {
      bullets.push(`Do not prioritize early: ${byId[id]} — ${note}`);
    } else {
      bullets.push(`Not part of the safest sequence: ${byId[id]}`);
    }
  }

  /** @type {string[]} */
  const paragraphs = [
    "Build your order by asking: What stops active harm first? Who needs to investigate? What recovery comes after containment?",
  ];

  if (ctx.orderChecked && !ctx.orderCorrect && ctx.orderPicked?.length) {
    paragraphs.push(
      "Your order did not match the safest sequence. Compare your numbered list to the steps below—notice which action should happen earlier."
    );
  }

  return {
    title: "How to solve this ordering exercise",
    paragraphs,
    bullets,
  };
}

/**
 * @param {import('../workshop-runner.js').WorkshopStep} step
 * @param {TeachingContext} ctx
 */
function buildQuizTeaching(step, ctx) {
  const correct = step.correct ?? [];
  const options = step.options ?? [];
  /** @type {string[]} */
  const bullets = [];
  const flags = step.warningFlags ?? [];

  if (ctx.quizSubmitted && !ctx.quizCorrect && flags.length) {
    for (const flag of flags) {
      bullets.push(flag);
    }
  }

  if (step.explanation) {
    bullets.push(`Key idea: ${step.explanation}`);
  }

  if (ctx.quizSubmitted) {
    for (const opt of options) {
      const isRight = correct.includes(opt.id);
      const picked = (ctx.quizSelected ?? []).includes(opt.id);
      const hint = step.optionNotes?.[opt.id];
      let line = `${isRight ? "✓" : "✗"} ${opt.text}`;
      if (hint) line += ` — ${hint}`;
      else if (isRight) line += " — This is the best answer.";
      else if (picked) line += " — Not the best choice here.";
      else line += " — Not the best choice.";
      bullets.push(line);
    }
    return {
      title: ctx.quizCorrect
        ? "Why this is correct"
        : flags.length
          ? "All warning flags for this scenario"
          : "How to reach the right answer",
      paragraphs: ctx.quizCorrect
        ? ["You can still read why the other options are weaker."]
        : flags.length
          ? [
              "Use the warning flags below before you try again. They are the same clues security teams look for in real incidents.",
            ]
          : [
              "Read each option below before trying again. Use Check answer after you understand the reasoning.",
            ],
      bullets,
    };
  }

  const preBullets = [];
  if (flags.length) {
    preBullets.push(...flags);
  }
  for (const opt of options) {
    const hint = step.optionNotes?.[opt.id];
    preBullets.push(hint ? `${opt.text} — Consider: ${hint}` : opt.text);
  }

  return {
    title: flags.length ? "Warning flags before you answer" : "Clues before you answer",
    paragraphs: [
      flags.length
        ? "Look for these warning flags in the scenario, then pick the response that avoids every trap."
        : "You do not need to guess. Use these notes to rule out weak options, then pick what fits best.",
      step.prompt ? `Question focus: ${step.prompt}` : "",
    ].filter(Boolean),
    bullets: preBullets,
  };
}

/**
 * @param {import('../workshop-runner.js').WorkshopStep} step
 */
function buildLessonTeaching(step) {
  if (!step.paragraphs?.length && !step.bullets?.length) return null;
  return {
    title: "Core points for this topic",
    paragraphs: step.paragraphs ?? [],
    bullets: step.bullets ?? [],
  };
}

/**
 * @param {import('../workshop-runner.js').WorkshopStep} step
 */
function buildChecklistTeaching(step) {
  const bullets = (step.items ?? []).map((it) => {
    const tag = it.good === false ? "Avoid" : "Recommended";
    const why = it.feedback ?? it.detail ?? "";
    return why ? `${tag}: ${it.label} — ${why}` : `${tag}: ${it.label}`;
  });
  if (!bullets.length) return null;
  return {
    title: "Why each habit matters",
    paragraphs: [
      ...(step.paragraphs ?? []),
      "On this step, tap each item to see whether it is recommended. Every item in a habits checklist should be a real control—not a trick option.",
    ],
    bullets,
  };
}

/**
 * @param {string[]} flags
 * @param {{ title?: string }} [opts]
 * @returns {string}
 */
export function renderWarningFlagsSection(flags, opts = {}) {
  if (!flags?.length) return "";
  const title = opts.title ?? "Warning flags to spot";
  return `
    <div class="workshop-warning-flags">
      <h4 class="workshop-warning-flags-title">${escapeHtml(title)}</h4>
      <ul class="workshop-warning-flags-list">
        ${flags.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}
      </ul>
    </div>
  `;
}

/**
 * @param {import('../workshop-runner.js').WorkshopStep} step
 * @param {string[]} selected
 * @returns {string}
 */
export function renderQuizWrongPickCallout(step, selected) {
  const correct = step.correct ?? [];
  const wrongPicked = selected.filter((id) => !correct.includes(id));
  if (!wrongPicked.length || !step.optionNotes) return "";

  const parts = [];
  for (const id of wrongPicked) {
    const note = step.optionNotes[id];
    const opt = step.options?.find((o) => o.id === id);
    if (!note || !opt) continue;
    parts.push(`
      <div class="workshop-quiz-pick-note">
        <strong>Why your choice is risky</strong>
        <p class="workshop-quiz-pick-label">${escapeHtml(opt.text)}</p>
        <p>${escapeHtml(note)}</p>
      </div>
    `);
  }
  return parts.join("");
}

/**
 * @param {{ title: string, paragraphs: string[], bullets: string[] }|null} content
 * @param {{ open?: boolean }} [opts]
 * @returns {string}
 */
export function renderLearnMorePanelHtml(content, opts = {}) {
  if (!content) return "";
  const open = opts.open ?? false;
  const bodyParts = [];
  for (const p of content.paragraphs) {
    bodyParts.push(`<p>${escapeHtml(p)}</p>`);
  }
  if (content.bullets.length) {
    bodyParts.push("<ul>");
    for (const b of content.bullets) {
      bodyParts.push(`<li>${escapeHtml(b)}</li>`);
    }
    bodyParts.push("</ul>");
  }

  return `
    <section class="workshop-learn-more" data-workshop-learn-more>
      <button
        type="button"
        class="btn btn-outline btn-sm workshop-learn-more-btn"
        data-learn-more-toggle
        aria-expanded="${open ? "true" : "false"}"
      >
        Get more information on this
      </button>
      <div class="workshop-learn-more-panel${open ? "" : " hidden"}" data-learn-more-panel>
        <h4 class="workshop-learn-more-title">${escapeHtml(content.title)}</h4>
        <div class="workshop-learn-more-body">${bodyParts.join("")}</div>
      </div>
    </section>
  `;
}

/**
 * @param {HTMLElement} root
 */
export function bindLearnMorePanel(root) {
  const toggle = root.querySelector("[data-learn-more-toggle]");
  const panel = root.querySelector("[data-learn-more-panel]");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isHidden = panel.classList.contains("hidden");
    panel.classList.toggle("hidden", !isHidden);
    toggle.setAttribute("aria-expanded", isHidden ? "true" : "false");
    toggle.textContent = isHidden ? "Hide extra information" : "Get more information on this";
  });
}

/**
 * @param {HTMLElement} root
 * @param {{ title: string, paragraphs: string[], bullets: string[] }|null} content
 * @param {{ open?: boolean }} [opts]
 */
export function updateLearnMorePanel(root, content, opts = {}) {
  const existing = root.querySelector("[data-workshop-learn-more]");
  const html = renderLearnMorePanelHtml(content, opts);
  if (!html) {
    existing?.remove();
    return;
  }
  if (existing) {
    existing.outerHTML = html;
  } else {
    root.insertAdjacentHTML("beforeend", html);
  }
  bindLearnMorePanel(root);
}

/**
 * @param {string} text
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
