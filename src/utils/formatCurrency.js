/** Format a number as Ghana Cedis display value (no symbol — prepend ₵ in JSX) */
export const fmt = (n = 0) =>
  Number(n).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default fmt
