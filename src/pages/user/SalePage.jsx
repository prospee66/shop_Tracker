import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, CheckCircle, LogOut, Package } from 'lucide-react'
import StatusBadge from '../../components/ui/StatusBadge'
import { useSales    } from '../../hooks/useSales'
import { useAuth     } from '../../context/AuthContext'
import { fmt }         from '../../utils/formatCurrency'
import { friendlyTime, isToday } from '../../utils/dateUtils'

export default function SalePage() {
  const { products, sales, todaySales, addSale } = useSales()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [query,   setQuery]   = useState('')
  const [open,    setOpen]    = useState(false)
  const [product, setProduct] = useState(null)
  const [qty,     setQty]     = useState(1)
  const [method,  setMethod]  = useState('cash')
  const [toast,   setToast]   = useState(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    return products
      .filter(p => p.quantity > 0 && p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8)
  }, [products, query])

  useEffect(() => {
    if (suggestions.length > 0) setOpen(true)
    else setOpen(false)
  }, [suggestions])

  const select = (p) => {
    setProduct(p); setQuery(p.name); setOpen(false); setQty(1)
  }

  const clear = () => {
    setProduct(null); setQuery(''); setQty(1); setMethod('cash')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const total = product ? product.price * qty : 0

  const submit = () => {
    if (!product || qty < 1 || qty > product.quantity) return
    setLoading(true)
    setTimeout(() => {
      const amount = addSale({ product, quantitySold: qty, paymentMethod: method })
      setToast({ productName: product.name, qty, amount, method })
      clear()
      setLoading(false)
      setTimeout(() => setToast(null), 4000)
    }, 200)
  }

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  /* Today's own sales */
  const mySales  = todaySales.filter(s => s.soldById === currentUser?.id)
  const myTotal  = mySales.reduce((t, s) => t + s.amount, 0)
  const myMomo   = mySales.filter(s => s.paymentMethod === 'momo').reduce((t, s) => t + s.amount, 0)
  const myCash   = mySales.filter(s => s.paymentMethod === 'cash').reduce((t, s) => t + s.amount, 0)

  const initials = (n = '') => n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-gray-900 text-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold">
            {initials(currentUser?.name)}
          </div>
          <div>
            <div className="text-sm font-semibold">{currentUser?.name}</div>
            <div className="text-[10px] text-gray-400">Sales Staff</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition px-3 py-2 rounded-lg hover:bg-gray-800"
        >
          <LogOut size={13} /> Sign Out
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* My stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'My Sales Today', value: `₵${fmt(myTotal)}`, sub: `${mySales.length} transactions` },
            { label: 'Momo',           value: `₵${fmt(myMomo)}`,  sub: 'collected via mobile money' },
            { label: 'Cash',           value: `₵${fmt(myCash)}`,  sub: 'collected in cash' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Sale form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={18} className="text-brand-600" />
                <h2 className="text-sm font-semibold text-gray-900">Record Sale</h2>
              </div>

              {/* Product search */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Search Product</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    ref={inputRef}
                    className="field pl-9"
                    placeholder="Type product name…"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setProduct(null) }}
                    onFocus={() => suggestions.length && setOpen(true)}
                    autoFocus
                  />
                  {/* Dropdown */}
                  {open && suggestions.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
                      {suggestions.map(p => (
                        <button
                          key={p.id}
                          onMouseDown={() => select(p)}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition text-left"
                        >
                          <span className="font-medium text-gray-800">{p.name}</span>
                          <span className="text-gray-500 text-xs">₵{fmt(p.price)} · {p.quantity} left</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product preview */}
              {product && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">₵{fmt(product.price)} per unit · {product.quantity} in stock</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Qty */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={!product}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition font-bold text-lg"
                  >−</button>
                  <input
                    type="number"
                    min={1}
                    max={product?.quantity ?? 1}
                    value={qty}
                    onChange={e => setQty(Math.max(1, Math.min(product?.quantity ?? 1, +e.target.value || 1)))}
                    disabled={!product}
                    className="field text-center w-16 disabled:opacity-50"
                  />
                  <button
                    onClick={() => setQty(q => Math.min(product?.quantity ?? 1, q + 1))}
                    disabled={!product}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition font-bold text-lg"
                  >+</button>
                </div>
              </div>

              {/* Payment method */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {['cash', 'momo'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`py-2 rounded-lg text-sm font-semibold border transition ${
                        method === m
                          ? m === 'momo'
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {m === 'cash' ? '💵 Cash' : '📱 Momo'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total preview */}
              {product && (
                <div className="bg-brand-50 rounded-xl p-4 mb-5 text-center">
                  <p className="text-xs text-brand-700 font-medium">Total Amount</p>
                  <p className="text-3xl font-bold text-brand-700 mt-0.5">₵{fmt(total)}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={submit}
                disabled={!product || loading || qty < 1 || qty > (product?.quantity ?? 0)}
                className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? 'Processing…' : '✓ Confirm Sale'}
              </button>
            </div>
          </div>

          {/* Recent sales */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">My Sales Today ({mySales.length})</h2>
              </div>
              {mySales.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-400">No sales recorded yet today.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th><th>Qty</th><th>Amount</th><th>Method</th><th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...mySales].reverse().map(s => (
                        <tr key={s.id}>
                          <td className="font-semibold text-gray-900 max-w-[140px] truncate">{s.productName}</td>
                          <td className="font-mono">{s.quantitySold}</td>
                          <td className="font-mono font-semibold text-gray-900">₵{fmt(s.amount)}</td>
                          <td><StatusBadge value={s.paymentMethod} /></td>
                          <td className="text-gray-400 text-xs">{friendlyTime(s.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3 max-w-xs z-50 animate-in">
          <CheckCircle size={20} className="text-brand-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Sale recorded!</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {toast.qty}× {toast.productName} — ₵{fmt(toast.amount)} ({toast.method})
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
