const KEY = 'ava_sales'

/* ── Production: starts empty. Sales are recorded by staff. ── */
const seed = () => {
  if (!localStorage.getItem(KEY))
    localStorage.setItem(KEY, JSON.stringify([]))
}

export const salesService = {
  init: seed,

  getAll: () => {
    seed()
    return JSON.parse(localStorage.getItem(KEY))
  },

  add: (sale) => {
    seed()
    const list = JSON.parse(localStorage.getItem(KEY))
    const item = { ...sale, id: Date.now() }
    localStorage.setItem(KEY, JSON.stringify([...list, item]))
    return item
  },
}
