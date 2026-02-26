import { useState } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

/* Layout components */
import Sidebar         from './components/layout/Sidebar'
import Header          from './components/layout/Header'
import ProtectedRoute  from './components/layout/ProtectedRoute'

/* Pages */
import LoginPage        from './pages/auth/LoginPage'
import DashboardPage    from './pages/admin/DashboardPage'
import ProductsPage     from './pages/admin/ProductsPage'
import SalesHistoryPage from './pages/admin/SalesHistoryPage'
import ReportsPage      from './pages/admin/ReportsPage'
import SettingsPage     from './pages/admin/SettingsPage'
import SalePage         from './pages/user/SalePage'

/* Admin shell — dark sidebar + white topbar + content area */
function AdminShell() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(o => !o)} />
      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: isOpen ? 256 : 72, transition: 'margin-left 0.3s ease' }}
      >
        <Header />
        <main className="flex-1 p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/* Redirect already-logged-in users away from /login */
function GuestRoute({ children }) {
  const { isLoggedIn, currentUser } = useAuth()
  if (isLoggedIn) {
    return <Navigate to={currentUser?.role === 'admin' ? '/admin/dashboard' : '/sale'} replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public */}
      <Route path="/login" element={
        <GuestRoute><LoginPage /></GuestRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin"><AdminShell /></ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"     element={<DashboardPage />}    />
        <Route path="products"      element={<ProductsPage />}     />
        <Route path="sales-history" element={<SalesHistoryPage />} />
        <Route path="reports"       element={<ReportsPage />}      />
        <Route path="settings"      element={<SettingsPage />}     />
      </Route>

      {/* Staff POS */}
      <Route path="/sale" element={
        <ProtectedRoute role="staff"><SalePage /></ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
