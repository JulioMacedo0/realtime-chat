/**
 * Converts a size in bytes to a human-readable string with appropriate units (bytes, KB, or MB).
 *
 * @param {number} bytes - The size in bytes to be converted.
 * @returns {string} The human-readable string representing the size with appropriate units.
 */
export const formatBytes = (bytes: number) => {
  const KB = 1024;
  const MB = KB * 1024;

  if (bytes >= MB) {
    return (bytes / MB).toFixed(2) + " MB";
  } else if (bytes >= KB) {
    return (bytes / KB).toFixed(2) + " KB";
  } else {
    return bytes + " bytes";
  }
};
