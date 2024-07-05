/**
 * Extracts the file extension from a given URI.
 *
 * @param {string} uri - The URI of the file.
 * @returns {string} - The file extension.
 * @throws {Error} - If the file extension cannot be extracted.
 */
export const getFileExtension = (uri: string) => {
  const match = /\.([a-zA-Z]+)$/.exec(uri);

  if (match == null) {
    throw new Error(`Error getting file extension from ${uri}`);
  }

  return match[1];
};
