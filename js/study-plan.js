/**
 * @typedef {import('./cert-loader.js').CertData} CertData
 * @typedef {import('./scoring.js').scoreExam} ScoreResult
 */

/**
 * @param {CertData} cert
 * @param {{ domainBreakdown: { id: string, name: string, percent: number, weak: boolean }[] }} result
 */
export function buildStudyPlan(cert, result) {
  const weakDomains = result.domainBreakdown.filter((d) => d.weak);
  const domainsToCover =
    weakDomains.length > 0
      ? weakDomains
      : result.domainBreakdown.filter((d) => d.percent < 100);

  return domainsToCover.map((summary) => {
    const domain = cert.domains.find((d) => d.id === summary.id);
    return {
      id: summary.id,
      name: domain?.name ?? summary.name,
      scorePercent: summary.percent,
      resources: domain?.resources ?? [],
    };
  });
}
