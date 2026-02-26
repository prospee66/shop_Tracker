const USERS_KEY   = 'ava_users'
const SESSION_KEY = 'ava_session'

/* ── Production seed: admin only. Add staff via Settings page. ── */
const DEFAULT_USERS = [
  { id: 1, name: 'Administrator', username: 'admin', password: 'admin123', role: 'admin' },
]

const seed = () => {
  if (!localStorage.getItem(USERS_KEY))
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS))
}

export const authService = {
  init: seed,

  getAll: () => {
    seed()
    return JSON.parse(localStorage.getItem(USERS_KEY))
  },

  login: (username, password) => {
    seed()
    const users = JSON.parse(localStorage.getItem(USERS_KEY))
    const user  = users.find(u => u.username === username && u.password === password)
    if (!user) return { ok: false, error: 'Invalid username or password.' }
    const session = { id: user.id, name: user.name, username: user.username, role: user.role }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { ok: true, user: session }
  },

  logout: () => localStorage.removeItem(SESSION_KEY),

  getSession: () => {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  },

  addUser: (user) => {
    seed()
    const users = JSON.parse(localStorage.getItem(USERS_KEY))
    const next  = { ...user, id: Date.now() }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, next]))
    return next
  },

  updateUser: (id, updates) => {
    seed()
    const users   = JSON.parse(localStorage.getItem(USERS_KEY))
    const updated = users.map(u => u.id === id ? { ...u, ...updates } : u)
    localStorage.setItem(USERS_KEY, JSON.stringify(updated))
    return updated.find(u => u.id === id)
  },

  deleteUser: (id) => {
    seed()
    const users = JSON.parse(localStorage.getItem(USERS_KEY)).filter(u => u.id !== id)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },
}
