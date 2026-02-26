/** ISO string for a timestamp today at the given HH:MM */
export const todayAt = (hh, mm) => {
  const d = new Date()
  d.setHours(hh, mm, 0, 0)
  return d.toISOString()
}

/** ISO string N days ago at optional HH:MM */
export const daysAgoAt = (days, hh = 10, mm = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hh, mm, 0, 0)
  return d.toISOString()
}

/** True when the ISO date string falls on today */
export const isToday = (iso) =>
  new Date(iso).toDateString() === new Date().toDateString()

/** 'Mon, 22 Feb 2026' style */
export const friendlyDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })

/** 'HH:MM AM/PM' */
export const friendlyTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
