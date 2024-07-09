type params = {
  hex: string;
  alpha: number;
};
/**
 * Converts a hexadecimal color code to a hexadecimal color code with alpha transparency.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.hex - The hexadecimal color code (e.g., "#FF5733").
 * @param {number} params.alpha - The alpha value from 0 to 1 (e.g., 0.5).
 * @returns {string} The hexadecimal color code with alpha (e.g., "#FF573380").
 */
export const hexdecimalWithAlpha = ({ alpha, hex }: params) => {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
  return `#${hex}${alphaHex}`;
};
