import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Package, TrendingUp, Smartphone, Banknote, AlertTriangle, LayoutDashboard,
} from 'lucide-react'
import StatCard    from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { useReports }  from '../../hooks/useReports'
import { useShop }     from '../../context/ShopContext'
import { fmt }         from '../../utils/formatCurrency'
import { friendlyTime } from '../../utils/dateUtils'

export default function DashboardPage() {
  const {
    todaySales, todayTotal, weekTotal, monthTotal, allTime,
    todayMomo, todayCash, dailyRevenue, staffStats, lowStock,
  } = useReports()
  const { sales, products } = useShop()

  const yd = new Date(); yd.setDate(yd.getDate() - 1)
  const yTotal = sales
    .filter(s => new Date(s.date).toDateString() === yd.toDateString())
    .reduce((t, s) => t + s.amount, 0)

  const trend = (() => {
    if (!yTotal) return null
    const pct = Math.round(((todayTotal - yTotal) / yTotal) * 100)
    return { dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat', pct: Math.abs(pct) }
  })()

  const momoPercent = todayTotal ? Math.round((todayMomo / todayTotal) * 100) : 0
  const cashPercent = 100 - momoPercent
  const recent = [...todaySales].reverse().slice(0, 8)
  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const maxStaff = staffStats.length ? staffStats[0].total : 1

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-brand-600/30 flex-shrink-0">
            <LayoutDashboard size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">{dateStr}</p>
          </div>
        </div>
        {lowStock.length > 0 && (
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-amber-100 transition"
          >
            <AlertTriangle size={14} />
            {lowStock.length} low stock alert{lowStock.length !== 1 ? 's' : ''}
          </Link>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Products"   value={products.length}      sub={`${lowStock.length} item${lowStock.length !== 1 ? 's' : ''} low`} icon={Package}   color="blue"   />
        <StatCard label="Today's Revenue"  value={`₵${fmt(todayTotal)}`} sub={`${todaySales.length} transaction${todaySales.length !== 1 ? 's' : ''}`}          icon={TrendingUp} color="green"  trend={trend} />
        <StatCard label="Momo Collected"   value={`₵${fmt(todayMomo)}`} sub={todayTotal ? `${momoPercent}% of today` : 'No sales yet'}                          icon={Smartphone} color="amber"  />
        <StatCard label="Cash Collected"   value={`₵${fmt(todayCash)}`} sub={todayTotal ? `${cashPercent}% of today` : 'No sales yet'}                          icon={Banknote}   color="purple" />
      </div>

      {/* Revenue strip */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
        {[
          { label: 'Today',       value: todayTotal, color: 'text-green-600'  },
          { label: 'Last 7 Days', value: weekTotal,  color: 'text-blue-600'   },
          { label: 'This Month',  value: monthTotal, color: 'text-violet-600' },
          { label: 'All-Time',    value: allTime,    color: 'text-amber-600'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4 text-center sm:text-left">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-xl font-extrabold mt-1 ${color}`}>₵{fmt(value)}</p>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 mb-6 text-sm">
          <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
          <span>
            <strong>{lowStock.length} product{lowStock.length !== 1 ? 's' : ''}</strong>{' '}
            {lowStock.length === 1 ? 'is' : 'are'} running low on stock.{' '}
            <Link to="/admin/reports" className="font-bold underline">View alerts →</Link>
          </span>
        </div>
      )}

      {/* Chart + Staff */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        {/* Area chart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
            <span className="w-1 h-5 rounded-full bg-brand-600 inline-block flex-shrink-0" />
            <h2 className="text-sm font-semibold text-gray-900">Revenue — Last 7 Days</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={dailyRevenue} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₵${v}`} />
                <Tooltip formatter={v => [`₵${fmt(v)}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} fill="url(#rev)"
                      dot={{ r: 4, fill: '#16a34a', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
            <span className="w-1 h-5 rounded-full bg-blue-500 inline-block flex-shrink-0" />
            <h2 className="text-sm font-semibold text-gray-900">Staff Activity Today</h2>
          </div>
          <div className="p-5">
            {staffStats.filter(s => s.count > 0).length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No activity yet</p>
            ) : (
              <div className="space-y-4">
                {staffStats.filter(s => s.count > 0).map((s, i) => {
                  const barColors = ['bg-brand-600', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500']
                  return (
                    <div key={s.name}>
                      <div className="flex items-center justify-between mb-1.5 text-sm">
                        <span className="font-semibold text-gray-800">{s.name}</span>
                        <span className="font-bold text-brand-600">₵{fmt(s.total)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColors[i % barColors.length]} rounded-full transition-all`}
                             style={{ width: `${(s.total / maxStaff) * 100}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{s.count} transaction{s.count !== 1 ? 's' : ''}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions + Payment split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent transactions */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2.5">
              <span className="w-1 h-5 rounded-full bg-violet-500 inline-block flex-shrink-0" />
              <h2 className="text-sm font-semibold text-gray-900">Today's Transactions</h2>
            </div>
            <Link to="/admin/sales-history" className="text-sm text-brand-600 font-semibold hover:underline">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No sales recorded today yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>Product</th><th>Qty</th><th>Amount</th><th>Method</th><th>By</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {recent.map(s => (
                    <tr key={s.id}>
                      <td className="font-semibold text-gray-900">{s.productName}</td>
                      <td className="font-mono">{s.quantitySold}</td>
                      <td className="font-mono font-bold text-green-600">₵{fmt(s.amount)}</td>
                      <td><StatusBadge value={s.paymentMethod} /></td>
                      <td className="text-gray-500">{s.soldBy.split(' ')[0]}</td>
                      <td className="text-gray-400 text-xs">{friendlyTime(s.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payment split */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
            <span className="w-1 h-5 rounded-full bg-amber-400 inline-block flex-shrink-0" />
            <h2 className="text-sm font-semibold text-gray-900">Payment Split Today</h2>
          </div>
          <div className="p-5">
            {todayTotal === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No payments yet</p>
            ) : (
              <>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="text-gray-600">Momo</span>
                    <strong className="text-amber-600">{momoPercent}%</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                    <span className="text-gray-600">Cash</span>
                    <strong className="text-green-600">{cashPercent}%</strong>
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div style={{ width: `${momoPercent}%` }} className="bg-amber-400 h-full transition-all" />
                  <div style={{ width: `${cashPercent}%` }} className="bg-green-500 h-full transition-all" />
                </div>
                <div className="flex gap-3 mt-5">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex-1 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Momo</p>
                    <p className="text-xl font-extrabold text-amber-700 mt-1">₵{fmt(todayMomo)}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex-1 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-600">Cash</p>
                    <p className="text-xl font-extrabold text-green-700 mt-1">₵{fmt(todayCash)}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
