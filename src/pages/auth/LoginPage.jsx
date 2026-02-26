import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShoppingBag, User, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form,    setForm]    = useState({ username: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter your username and password.')
      return
    }
    setLoading(true); setError('')
    setTimeout(() => {
      const res = login(form.username.trim(), form.password)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
      } else {
        navigate(res.user?.role === 'admin' ? '/admin/dashboard' : '/sale', { replace: true })
      }
    }, 300)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-blue-950 to-brand-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute w-72 h-72 bg-brand-600/20 rounded-full -top-16 -left-16 blur-3xl" />
        <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full bottom-12 -right-12 blur-3xl" />

        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
            <ShoppingBag size={38} color="#fff" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Shop Assistance</h1>
          <p className="text-blue-200 text-base leading-relaxed">
            Your complete shop management system. Track products, record sales, and monitor performance — all in one place.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[['Products', 'Track'],['Sales', 'Record'],['Reports', 'Analyse']].map(([t, s]) => (
              <div key={t} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-white font-bold text-sm">{t}</div>
                <div className="text-blue-300 text-xs mt-0.5">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <ShoppingBag size={20} color="#fff" />
            </div>
            <span className="text-xl font-bold text-gray-900">Shop Assistance</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue</p>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    name="username"
                    autoFocus
                    autoComplete="username"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handle}
                    className="field pl-9"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handle}
                    className="field pl-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              Contact your administrator if you cannot sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
