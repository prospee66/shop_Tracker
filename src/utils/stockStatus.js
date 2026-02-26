export const LOW_THRESHOLD = 20

/**
 * Returns 'In Stock' | 'Low' | 'Out of Stock' based on quantity.
 */
export const getProductStatus = (qty = 0) => {
  if (qty <= 0)             return 'Out of Stock'
  if (qty <= LOW_THRESHOLD) return 'Low'
  return 'In Stock'
}
