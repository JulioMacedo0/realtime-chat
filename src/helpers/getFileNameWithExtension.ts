/**
 * Extracts the file name with extension from a given URI.
 *
 * @param {string} uri - The URI of the file.
 * @returns {string} - The file name with extension.
 * @throws {Error} - If the file name or extension cannot be extracted.
 */
export const getFileNameWithExtension = (uri: string) => {
  const match = /\/([^\/]+)$/.exec(uri);

  if (match == null) {
    throw new Error(`Error getting file name and extension from ${uri}`);
  }

  return match[1];
};
