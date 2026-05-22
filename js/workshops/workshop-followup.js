/**
 * Links from a completed workshop to practice exam and formal certification.
 */

/**
 * @param {string} categoryId Workshop / Key Training category id (e.g. keytrain-identity-access)
 * @param {import('../cert-loader.js').ExamIndexEntry[]} examIndexList
 * @param {{ id: string }[]} keytrainCatalog
 */
export function resolveWorkshopFollowUp(categoryId, examIndexList, keytrainCatalog) {
  const keytrainCertId = `kt-${categoryId}`;
  const practiceExamId = examIndexList.some((e) => e.id === categoryId) ? categoryId : null;
  const certProgramId = keytrainCatalog.some((c) => c.id === keytrainCertId)
    ? keytrainCertId
    : null;
  return { practiceExamId, certProgramId, categoryId };
}
