/**
 * Converts a value in seconds to a string in MM:SS format.
 *
 * @param {number} seconds - The value in seconds to be converted.
 * @returns {string} The formatted string in MM:SS format.
 */
export function formatSecondsToMMSS(seconds: number) {
  const intSeconds = Math.floor(seconds);
  const minutes = Math.floor(intSeconds / 60);
  const remainingSeconds = intSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}
