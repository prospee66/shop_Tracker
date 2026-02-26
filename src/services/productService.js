const KEY = 'ava_products'

/* ── Production: no demo products. Add products via the Products page. ── */
const seed = () => {
  if (!localStorage.getItem(KEY))
    localStorage.setItem(KEY, JSON.stringify([]))
}

export const productService = {
  init: seed,

  getAll: () => {
    seed()
    return JSON.parse(localStorage.getItem(KEY))
  },

  add: (product) => {
    seed()
    const list = JSON.parse(localStorage.getItem(KEY))
    const item = { ...product, id: Date.now() }
    localStorage.setItem(KEY, JSON.stringify([...list, item]))
    return item
  },

  update: (id, updates) => {
    seed()
    const list    = JSON.parse(localStorage.getItem(KEY))
    const updated = list.map(p => p.id === id ? { ...p, ...updates } : p)
    localStorage.setItem(KEY, JSON.stringify(updated))
    return updated.find(p => p.id === id)
  },

  delete: (id) => {
    seed()
    const list = JSON.parse(localStorage.getItem(KEY)).filter(p => p.id !== id)
    localStorage.setItem(KEY, JSON.stringify(list))
  },
}
