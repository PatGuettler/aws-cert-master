/**
 * @typedef {Object} CertRegistryEntry
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {string} dataFile
 * @property {boolean} available
 */

/**
 * @typedef {Object} DomainResource
 * @property {string} title
 * @property {string} url
 */

/**
 * @typedef {Object} Domain
 * @property {string} id
 * @property {string} name
 * @property {number} weight
 * @property {DomainResource[]} resources
 */

/**
 * @typedef {Object} QuestionOption
 * @property {string} id
 * @property {string} text
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} domain
 * @property {'multiple-choice'|'multiple-response'} type
 * @property {boolean} [scored]
 * @property {string} text
 * @property {QuestionOption[]} options
 * @property {string[]} correct
 * @property {string} [explanation]
 * @property {DomainResource[]} [docs]
 */

/**
 * @typedef {Object} ExamConfig
 * @property {number} totalQuestions
 * @property {number} scoredQuestions
 * @property {number} timeLimitMinutes
 * @property {number} passingScore
 * @property {number} maxScore
 */

/**
 * @typedef {Object} CertData
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {ExamConfig} exam
 * @property {Domain[]} domains
 * @property {Question[]} questions
 */

const registryCache = { data: /** @type {CertRegistryEntry[]|null} */ (null) };
const certCache = new Map();

/**
 * @param {string} basePath
 */
function resolvePath(basePath) {
  const base = document.querySelector("base")?.href ?? window.location.href;
  return new URL(basePath, base).href;
}

export async function loadRegistry() {
  if (registryCache.data) return registryCache.data;
  const res = await fetch(resolvePath("data/certs-registry.json"));
  if (!res.ok) throw new Error("Failed to load certification registry");
  const json = await res.json();
  registryCache.data = json.certs;
  return registryCache.data;
}

/**
 * @param {string} certId
 * @returns {Promise<CertData>}
 */
export async function loadCert(certId) {
  if (certCache.has(certId)) return certCache.get(certId);

  const registry = await loadRegistry();
  const entry = registry.find((c) => c.id === certId);
  if (!entry) throw new Error(`Unknown certification: ${certId}`);
  if (!entry.available) throw new Error(`${entry.name} is not available yet`);

  const res = await fetch(resolvePath(entry.dataFile));
  if (!res.ok) throw new Error(`Failed to load ${entry.name} questions`);
  const data = await res.json();
  certCache.set(certId, data);
  return data;
}

/**
 * @param {CertData} cert
 * @param {number} count
 * @returns {Question[]}
 */
export function selectExamQuestions(cert, count) {
  const pool = [...cert.questions];
  shuffle(pool);
  const n = Math.min(count, pool.length);
  return pool.slice(0, n);
}

/**
 * @param {unknown[]} arr
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
