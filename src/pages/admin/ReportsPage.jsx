import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { AlertTriangle, Download, BarChart2 } from 'lucide-react'
import StatusBadge  from '../../components/ui/StatusBadge'
import Button       from '../../components/ui/Button'
import { useReports } from '../../hooks/useReports'
import { useShop    } from '../../context/ShopContext'
import { fmt }        from '../../utils/formatCurrency'

export default function ReportsPage() {
  const {
    todaySales, weekSales, monthSales,
    todayTotal, weekTotal, monthTotal, allTime,
    todayMomo, todayCash,
    staffStats, topProducts, lowStock,
  } = useReports()
  const { sales } = useShop()

  const momoPercent = todayTotal ? Math.round((todayMomo / todayTotal) * 100) : 0
  const cashPercent = 100 - momoPercent

  const exportCSV = () => {
    const rows = [
      ['Product','Qty','Amount','Method','Staff','Date'],
      ...sales.map(s => [s.productName, s.quantitySold, s.amount, s.paymentMethod, s.soldBy, new Date(s.date).toLocaleString()]),
    ]
    const csv  = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'sales-report.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <BarChart2 size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-400 mt-0.5">Performance overview</p>
          </div>
        </div>
        <Button variant="secondary" onClick={exportCSV}><Download size={14} /> Export CSV</Button>
      </div>

      {/* Revenue summary strip */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
        {[
          { label: 'Today',      value: todayTotal,  count: todaySales.length,  color: 'text-green-600'  },
          { label: 'This Week',  value: weekTotal,   count: weekSales.length,   color: 'text-blue-600'   },
          { label: 'This Month', value: monthTotal,  count: monthSales.length,  color: 'text-violet-600' },
          { label: 'All-Time',   value: allTime,     count: sales.length,       color: 'text-amber-600'  },
        ].map(({ label, value, count, color }) => (
          <div key={label} className="px-5 py-4 text-center sm:text-left">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-xl font-extrabold mt-1 ${color}`}>₵{fmt(value)}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{count} sale{count !== 1 ? 's' : ''}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        {/* Top products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
            <span className="w-1 h-5 rounded-full bg-indigo-500 inline-block flex-shrink-0" />
            <h2 className="text-sm font-semibold text-gray-900">Top Products by Revenue</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => v.split(' ')[0]} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₵${v}`} />
                <Tooltip formatter={v => [`₵${fmt(v)}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment split */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
            <span className="w-1 h-5 rounded-full bg-amber-400 inline-block flex-shrink-0" />
            <h2 className="text-sm font-semibold text-gray-900">Today's Payment Split</h2>
          </div>
          <div className="p-5">
            {todayTotal === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No payments today</p>
            ) : (
              <>
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="text-gray-600">Momo</span>
                    <strong className="text-amber-600">{momoPercent}%</strong>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                    <span className="text-gray-600">Cash</span>
                    <strong className="text-green-600">{cashPercent}%</strong>
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex mb-5">
                  <div style={{ width: `${momoPercent}%` }} className="bg-amber-400 h-full transition-all" />
                  <div style={{ width: `${cashPercent}%` }} className="bg-green-500 h-full transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Momo</p>
                    <p className="text-2xl font-extrabold text-amber-700 mt-1">₵{fmt(todayMomo)}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Cash</p>
                    <p className="text-2xl font-extrabold text-green-700 mt-1">₵{fmt(todayCash)}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Staff performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <span className="w-1 h-5 rounded-full bg-brand-600 inline-block flex-shrink-0" />
          <h2 className="text-sm font-semibold text-gray-900">Staff Performance Today</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Transactions</th>
                <th>Momo</th>
                <th>Cash</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {staffStats.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">No staff data</td></tr>
              ) : staffStats.map(s => (
                <tr key={s.name}>
                  <td className="font-semibold text-gray-900">{s.full}</td>
                  <td className="font-mono">{s.count}</td>
                  <td className="font-mono text-amber-600">₵{fmt(
                    todaySales.filter(x => x.soldBy === s.full && x.paymentMethod === 'momo').reduce((t, x) => t + x.amount, 0)
                  )}</td>
                  <td className="font-mono text-green-600">₵{fmt(
                    todaySales.filter(x => x.soldBy === s.full && x.paymentMethod === 'cash').reduce((t, x) => t + x.amount, 0)
                  )}</td>
                  <td className="font-mono font-bold text-gray-900">₵{fmt(s.total)}</td>
                </tr>
              ))}
              {staffStats.length > 0 && (
                <tr className="bg-gray-50 font-semibold">
                  <td className="text-gray-700">Total</td>
                  <td className="font-mono">{todaySales.length}</td>
                  <td className="font-mono text-amber-600">₵{fmt(todayMomo)}</td>
                  <td className="font-mono text-green-600">₵{fmt(todayCash)}</td>
                  <td className="font-mono font-bold text-gray-900">₵{fmt(todayTotal)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low stock */}
      {lowStock.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-red-100 bg-red-50">
            <AlertTriangle size={15} className="text-red-600 flex-shrink-0" />
            <h2 className="text-sm font-semibold text-red-700">Low Stock Alerts ({lowStock.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Product</th><th>Category</th><th>Qty Left</th><th>Status</th></tr>
              </thead>
              <tbody>
                {lowStock.map(p => (
                  <tr key={p.id}>
                    <td className="font-semibold text-gray-900">{p.name}</td>
                    <td className="text-gray-500 text-xs">{p.category || '—'}</td>
                    <td className="font-mono font-bold text-red-600">{p.quantity}</td>
                    <td><StatusBadge value={p.quantity <= 0 ? 'Out of Stock' : 'Low'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
