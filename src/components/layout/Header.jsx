import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Package, History, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useShop } from '../../context/ShopContext'
import { fmt }     from '../../utils/formatCurrency'

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

const AVATAR_COLORS = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626']
const avatarBg = (name = '') => AVATAR_COLORS[(name.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]

export default function Header() {
  const { currentUser }   = useAuth()
  const { products, sales } = useShop()
  const navigate          = useNavigate()
  const bg                = avatarBg(currentUser?.name)

  const [query,  setQuery]  = useState('')
  const [open,   setOpen]   = useState(false)
  const wrapRef = useRef(null)

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* Filter products and recent sales */
  const q = query.trim().toLowerCase()

  const matchedProducts = q
    ? products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 5)
    : []

  const matchedSales = q
    ? [...sales]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .filter(s => s.productName.toLowerCase().includes(q))
        .slice(0, 4)
    : []

  const hasResults = matchedProducts.length > 0 || matchedSales.length > 0

  const go = (path) => {
    setQuery('')
    setOpen(false)
    navigate(path)
  }

  const handleKey = e => {
    if (e.key === 'Escape') { setQuery(''); setOpen(false) }
  }

  return (
    <header className="bg-white border-b-2 border-brand-600 px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-sm shadow-brand-600/10">

      {/* ── Search ──────────────────────────────── */}
      <div ref={wrapRef} className="relative flex-1 max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Search products, sales…"
          className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-600/15 transition"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}

        {/* Dropdown */}
        {open && query && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
            {!hasResults ? (
              <div className="px-4 py-5 text-center text-sm text-gray-400">
                No results for "<strong className="text-gray-600">{query}</strong>"
              </div>
            ) : (
              <>
                {/* Products section */}
                {matchedProducts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <Package size={12} className="text-blue-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Products</span>
                    </div>
                    {matchedProducts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => go('/admin/products')}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50/60 transition text-left group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{p.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{p.category || 'No category'} · Stock: {p.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-green-600 ml-4 flex-shrink-0">₵{fmt(p.price)}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Sales section */}
                {matchedSales.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100 border-t">
                      <History size={12} className="text-violet-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Recent Sales</span>
                    </div>
                    {matchedSales.map(s => (
                      <button
                        key={s.id}
                        onClick={() => go('/admin/sales-history')}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-violet-50/60 transition text-left group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-700">{s.productName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {s.soldBy.split(' ')[0]} · {s.paymentMethod === 'momo' ? 'Momo' : 'Cash'} · Qty {s.quantitySold}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-green-600 ml-4 flex-shrink-0">₵{fmt(s.amount)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── User chip ───────────────────────────── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
          style={{ background: bg }}
        >
          {initials(currentUser?.name)}
        </div>
        <div className="hidden sm:block leading-none">
          <div className="text-base font-semibold text-gray-900">{currentUser?.name}</div>
          <div className="text-sm text-gray-400 capitalize">{currentUser?.role}</div>
        </div>
      </div>

    </header>
  )
}
