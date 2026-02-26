import { useMemo }  from 'react'
import { useShop }  from '../context/ShopContext'
import { isToday  } from '../utils/dateUtils'

export const useReports = () => {
  const { sales, products, users, lowStock } = useShop()

  return useMemo(() => {
    const now     = new Date()
    const wkStart = new Date(); wkStart.setDate(wkStart.getDate() - 6); wkStart.setHours(0,0,0,0)
    const moStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const todaySales  = sales.filter(s => isToday(s.date))
    const weekSales   = sales.filter(s => new Date(s.date) >= wkStart)
    const monthSales  = sales.filter(s => new Date(s.date) >= moStart)

    const todayTotal  = todaySales.reduce((t, s) => t + s.amount, 0)
    const weekTotal   = weekSales .reduce((t, s) => t + s.amount, 0)
    const monthTotal  = monthSales.reduce((t, s) => t + s.amount, 0)
    const allTime     = sales     .reduce((t, s) => t + s.amount, 0)

    const todayMomo   = todaySales.filter(s => s.paymentMethod === 'momo').reduce((t, s) => t + s.amount, 0)
    const todayCash   = todaySales.filter(s => s.paymentMethod === 'cash').reduce((t, s) => t + s.amount, 0)

    /* last 7 daily totals for chart */
    const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0,0,0,0)
      const next = new Date(d); next.setDate(next.getDate() + 1)
      const total = sales.filter(s => { const t = new Date(s.date); return t >= d && t < next })
                         .reduce((acc, s) => acc + s.amount, 0)
      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: total,
      }
    })

    /* staff performance (today) */
    const staff = users.filter(u => u.role === 'staff')
    const staffStats = staff.map(u => {
      const ss = todaySales.filter(s => s.soldById === u.id)
      return { name: u.name.split(' ')[0], full: u.name, total: ss.reduce((t, s) => t + s.amount, 0), count: ss.length }
    }).sort((a, b) => b.total - a.total)

    /* top products (all-time sales volume) */
    const productMap = {}
    sales.forEach(s => {
      if (!productMap[s.productId]) productMap[s.productId] = { name: s.productName, qty: 0, revenue: 0 }
      productMap[s.productId].qty     += s.quantitySold
      productMap[s.productId].revenue += s.amount
    })
    const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

    return {
      todaySales, weekSales, monthSales,
      todayTotal, weekTotal, monthTotal, allTime,
      todayMomo, todayCash,
      dailyRevenue, staffStats, topProducts,
      lowStock,
    }
  }, [sales, products, users, lowStock])
}
