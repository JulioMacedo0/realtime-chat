/**
 * Helper function to extract the `id` property from an item.
 *
 * @param {T} item - The item from which to extract the `id`.
 * @param {number} index - The index of the item in the list.
 * @returns {string} The `id` of the item.
 */
export const keyExtractorId = <T extends { id: string | number }>(
  item: T,
  index: number
): string => {
  return item.id.toString();
};
