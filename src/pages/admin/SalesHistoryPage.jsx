import { useState, useMemo } from 'react'
import { History } from 'lucide-react'
import SearchBar   from '../../components/ui/SearchBar'
import StatusBadge from '../../components/ui/StatusBadge'
import { useShop } from '../../context/ShopContext'
import { fmt }     from '../../utils/formatCurrency'
import { friendlyDate, friendlyTime } from '../../utils/dateUtils'

export default function SalesHistoryPage() {
  const { sales, users } = useShop()

  const [search,   setSearch]  = useState('')
  const [method,   setMethod]  = useState('all')
  const [staffId,  setStaffId] = useState('all')
  const [dateFrom, setFrom]    = useState('')
  const [dateTo,   setTo]      = useState('')

  const staff = users.filter(u => u.role === 'staff')

  const filtered = useMemo(() => {
    let list = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date))
    if (search)           list = list.filter(s => s.productName.toLowerCase().includes(search.toLowerCase()))
    if (method !== 'all') list = list.filter(s => s.paymentMethod === method)
    if (staffId !== 'all')list = list.filter(s => String(s.soldById) === staffId)
    if (dateFrom)         list = list.filter(s => new Date(s.date) >= new Date(dateFrom))
    if (dateTo)           list = list.filter(s => new Date(s.date) <= new Date(dateTo + 'T23:59:59'))
    return list
  }, [sales, search, method, staffId, dateFrom, dateTo])

  const totalAmt  = filtered.reduce((t, s) => t + s.amount, 0)
  const totalMomo = filtered.filter(s => s.paymentMethod === 'momo').reduce((t, s) => t + s.amount, 0)
  const totalCash = filtered.filter(s => s.paymentMethod === 'cash').reduce((t, s) => t + s.amount, 0)

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
          <History size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales History</h1>
          <p className="text-sm text-gray-400 mt-0.5">{sales.length} total records</p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 grid grid-cols-3 divide-x divide-gray-100">
        {[
          { label: 'Total',  value: totalAmt,  color: 'text-gray-900'   },
          { label: 'Momo',   value: totalMomo, color: 'text-amber-600'  },
          { label: 'Cash',   value: totalCash, color: 'text-green-600'  },
        ].map(({ label, value, color }) => (
          <div key={label} className="px-5 py-4 text-center sm:text-left">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
            <p className={`text-xl font-extrabold mt-1 ${color}`}>₵{fmt(value)}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search product…" className="w-48" />
        <select className="field w-36" value={method} onChange={e => setMethod(e.target.value)}>
          <option value="all">All Methods</option>
          <option value="momo">Momo</option>
          <option value="cash">Cash</option>
        </select>
        <select className="field w-44" value={staffId} onChange={e => setStaffId(e.target.value)}>
          <option value="all">All Staff</option>
          {staff.map(u => <option key={u.id} value={u.id}>{u.name.split(' ')[0]}</option>)}
        </select>
        <input type="date" className="field w-40" value={dateFrom} onChange={e => setFrom(e.target.value)} />
        <input type="date" className="field w-40" value={dateTo}   onChange={e => setTo(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <span className="w-1 h-5 rounded-full bg-violet-500 inline-block flex-shrink-0" />
          <h2 className="text-sm font-semibold text-gray-900">
            {filtered.length} record{filtered.length !== 1 ? 's' : ''} shown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th><th>Qty</th><th>Amount</th>
                <th>Method</th><th>Staff</th><th>Date</th><th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <History size={32} className="mx-auto mb-2 opacity-40" />
                    No sales found.
                  </td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td className="font-semibold text-gray-900">{s.productName}</td>
                  <td className="font-mono">{s.quantitySold}</td>
                  <td className="font-mono font-bold text-green-600">₵{fmt(s.amount)}</td>
                  <td><StatusBadge value={s.paymentMethod} /></td>
                  <td className="text-gray-500">{s.soldBy.split(' ')[0]}</td>
                  <td className="text-gray-500 text-xs">{friendlyDate(s.date)}</td>
                  <td className="text-gray-400 text-xs">{friendlyTime(s.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
