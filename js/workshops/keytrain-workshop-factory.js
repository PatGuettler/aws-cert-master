/**
 * @typedef {import('../workshop-runner.js').KeytrainWorkshop} KeytrainWorkshop
 * @typedef {import('../workshop-runner.js').WorkshopStep} WorkshopStep
 */

/**
 * @param {Partial<KeytrainWorkshop> & Pick<KeytrainWorkshop, 'id'|'categoryId'|'level'|'title'|'code'|'tagline'|'topics'|'steps'>} w
 * @returns {KeytrainWorkshop}
 */
export function workshop(w) {
  return {
    estimatedMinutes: Math.max(10, w.steps.length * 2),
    ...w,
  };
}
