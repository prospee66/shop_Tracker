import { NavLink } from 'react-router-dom'
import { useAuth  } from '../../context/AuthContext'
import {
  LayoutDashboard, Package, History,
  BarChart2, Settings, ShoppingBag, LogOut,
  ChevronLeft, ChevronRight,
} from 'lucide-react'

const NAV_MAIN = [
  { to: '/admin/dashboard',      label: 'Dashboard',     Icon: LayoutDashboard },
  { to: '/admin/products',       label: 'Products',      Icon: Package         },
  { to: '/admin/sales-history',  label: 'Sales History', Icon: History         },
  { to: '/admin/reports',        label: 'Reports',       Icon: BarChart2       },
]

const NAV_BOTTOM = [
  { to: '/admin/settings', label: 'Settings', Icon: Settings },
]

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

export default function Sidebar({ isOpen, onToggle }) {
  const { currentUser, logout } = useAuth()

  return (
    <aside
      className="fixed inset-y-0 left-0 flex flex-col z-30 overflow-hidden"
      style={{
        width: isOpen ? 256 : 72,
        transition: 'width 0.3s ease',
        background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
      }}
    >

      {/* ── Brand ─────────────────────────────── */}
      <div className="flex items-center px-4 pt-7 pb-5" style={{ minHeight: 80 }}>
        {/* Logo icon — always visible */}
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-600/40">
          <ShoppingBag size={19} color="#fff" />
        </div>

        {/* Brand text — visible only when open */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ width: isOpen ? 140 : 0, opacity: isOpen ? 1 : 0 }}
        >
          <div className="pl-3 whitespace-nowrap">
            <div className="text-white font-extrabold text-base leading-tight tracking-tight">
              Shop Assist
            </div>
            <div className="text-gray-500 text-[11px] mt-0.5 tracking-wide">
              Management System
            </div>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white/10 hover:text-white transition-all flex-shrink-0"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <div className="mx-4 h-px bg-white/5" />

      {/* ── Navigation ────────────────────────── */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto overflow-x-hidden flex flex-col gap-5">

        {/* Main menu */}
        <div>
          {isOpen && (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 px-3 mb-3">
              Main Menu
            </p>
          )}
          <ul className="space-y-1.5">
            {NAV_MAIN.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  title={!isOpen ? label : undefined}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                        : 'text-gray-400 hover:bg-white/6 hover:text-gray-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        isActive ? 'bg-white/25' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Icon size={17} />
                      </div>
                      <span
                        className="whitespace-nowrap overflow-hidden transition-all duration-300 pb-px"
                        style={{ maxWidth: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0 }}
                      >
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Preferences */}
        <div>
          {isOpen && (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 px-3 mb-3">
              Preferences
            </p>
          )}
          <ul className="space-y-1.5">
            {NAV_BOTTOM.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  title={!isOpen ? label : undefined}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                        : 'text-gray-400 hover:bg-white/6 hover:text-gray-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        isActive ? 'bg-white/25' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Icon size={17} />
                      </div>
                      <span
                        className="whitespace-nowrap overflow-hidden transition-all duration-300 pb-px"
                        style={{ maxWidth: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0 }}
                      >
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

      </nav>

      <div className="mx-4 h-px bg-white/5" />

      {/* ── User footer ───────────────────────── */}
      <div className="px-3 py-4">

        {/* User card */}
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white/5 mb-2 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow shadow-brand-600/40">
            {initials(currentUser?.name)}
          </div>
          <div
            className="min-w-0 overflow-hidden transition-all duration-300"
            style={{ maxWidth: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0 }}
          >
            <div className="text-white text-sm font-semibold leading-tight truncate whitespace-nowrap">
              {currentUser?.name}
            </div>
            <div className="text-gray-500 text-xs mt-0.5 capitalize whitespace-nowrap">
              {currentUser?.role}
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          title={!isOpen ? 'Sign Out' : undefined}
          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/15 transition-all">
            <LogOut size={15} />
          </div>
          <span
            className="whitespace-nowrap overflow-hidden transition-all duration-300 pb-px"
            style={{ maxWidth: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0 }}
          >
            Sign Out
          </span>
        </button>

      </div>

    </aside>
  )
}
