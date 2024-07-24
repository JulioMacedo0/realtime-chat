/**
 * Generates an array of snap points as percentages.
 *
 * @param {number} start - The starting percentage.
 * @param {number} end - The ending percentage.
 * @param {number} step - The step increment for each percentage point.
 * @returns {string[]} An array of snap points in percentage format.
 */
export const generateSnapPoints = (
  start: number,
  end: number,
  step: number
): string[] => {
  const points: string[] = [];
  for (let i = start; i <= end; i += step) {
    points.push(`${i}%`);
  }
  return points;
};
