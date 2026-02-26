import { useState } from 'react'
import { Plus, Pencil, Trash2, KeyRound, Settings } from 'lucide-react'
import Modal  from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import { useShop } from '../../context/ShopContext'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'

const AVATAR_COLORS = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626']
const avatarBg  = name => AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]
const initials  = (n = '') => n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

const EMPTY_USER = { name: '', username: '', password: '', role: 'staff' }
const EMPTY_PW   = { current: '', next: '', confirm: '' }

export default function SettingsPage() {
  const { users, dispatch } = useShop()
  const { currentUser }     = useAuth()

  const [modal,   setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [delId,   setDelId]   = useState(null)
  const [uForm,   setUForm]   = useState(EMPTY_USER)
  const [pwForm,  setPwForm]  = useState(EMPTY_PW)
  const [err,     setErr]     = useState('')
  const [success, setSuccess] = useState('')

  const closeAll = () => { setModal(null); setEditing(null); setDelId(null); setErr(''); setSuccess('') }
  const openAdd  = () => { setUForm(EMPTY_USER); setErr(''); setModal('addUser') }
  const openEdit = u => { setEditing(u); setUForm({ name: u.name, username: u.username, password: u.password, role: u.role }); setErr(''); setModal('editUser') }
  const openDel  = id => { setDelId(id); setModal('delUser') }

  const handleU = e => setUForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleP = e => setPwForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validateUser = () => {
    if (!uForm.name.trim())     return 'Name is required.'
    if (!uForm.username.trim()) return 'Username is required.'
    if (!uForm.password.trim()) return 'Password is required.'
    if (modal === 'addUser') {
      const allUsers = authService.getAll()
      if (allUsers.find(u => u.username === uForm.username.trim())) return 'Username already taken.'
    }
    return ''
  }

  const submitAdd = () => {
    const e = validateUser(); if (e) { setErr(e); return }
    dispatch({ type: 'ADD_USER', payload: { name: uForm.name.trim(), username: uForm.username.trim(), password: uForm.password, role: uForm.role } })
    closeAll()
  }

  const submitEdit = () => {
    const e = validateUser(); if (e) { setErr(e); return }
    dispatch({ type: 'UPDATE_USER', payload: { id: editing.id, updates: { name: uForm.name.trim(), username: uForm.username.trim(), password: uForm.password, role: uForm.role } } })
    closeAll()
  }

  const confirmDel = () => { dispatch({ type: 'DELETE_USER', payload: delId }); closeAll() }

  const submitPw = () => {
    setErr(''); setSuccess('')
    const allUsers = authService.getAll()
    const me = allUsers.find(u => u.id === currentUser.id)
    if (!me || me.password !== pwForm.current) { setErr('Current password is incorrect.'); return }
    if (pwForm.next.length < 6)               { setErr('New password must be at least 6 characters.'); return }
    if (pwForm.next !== pwForm.confirm)        { setErr('Passwords do not match.'); return }
    dispatch({ type: 'UPDATE_USER', payload: { id: currentUser.id, updates: { password: pwForm.next } } })
    setSuccess('Password updated successfully.')
    setPwForm(EMPTY_PW)
  }

  return (
    <div className="max-w-3xl">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-brand-600/30 flex-shrink-0">
          <Settings size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage staff accounts and security</p>
        </div>
      </div>

      {/* Staff Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-5 rounded-full bg-brand-600 inline-block flex-shrink-0" />
            <h2 className="text-sm font-semibold text-gray-900">Staff Accounts</h2>
          </div>
          <Button size="sm" onClick={openAdd}><Plus size={13} /> Add Staff</Button>
        </div>
        <div className="divide-y divide-gray-100">
          {users.map(u => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-3.5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                style={{ background: avatarBg(u.name) }}
              >
                {initials(u.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{u.name}</div>
                <div className="text-xs text-gray-400">@{u.username}</div>
              </div>
              <StatusBadge value={u.role} />
              {u.id !== currentUser.id && (
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(u)} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => openDel(u.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <span className="w-1 h-5 rounded-full bg-violet-500 inline-block flex-shrink-0" />
          <KeyRound size={15} className="text-violet-500" />
          <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
        </div>
        <div className="px-5 py-5 space-y-4 max-w-sm">
          {err     && <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{err}</div>}
          {success && <div className="px-3 py-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{success}</div>}
          {[
            { name: 'current', label: 'Current Password' },
            { name: 'next',    label: 'New Password'     },
            { name: 'confirm', label: 'Confirm Password' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
              <input type="password" name={name} className="field" value={pwForm[name]} onChange={handleP} />
            </div>
          ))}
          <Button onClick={submitPw}>Update Password</Button>
        </div>
      </div>

      {/* Add/Edit user modal */}
      <Modal open={modal === 'addUser' || modal === 'editUser'} onClose={closeAll} title={modal === 'addUser' ? 'Add Staff Account' : 'Edit Account'} maxW="max-w-md">
        {err && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{err}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input name="name" className="field" value={uForm.name} onChange={handleU} placeholder="e.g. Kofi Mensah" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input name="username" className="field" value={uForm.username} onChange={handleU} placeholder="kofi" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" name="password" className="field" value={uForm.password} onChange={handleU} placeholder="••••••" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
            <select name="role" className="field" value={uForm.role} onChange={handleU}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={closeAll}>Cancel</Button>
          <Button onClick={modal === 'addUser' ? submitAdd : submitEdit}>
            {modal === 'addUser' ? 'Add Account' : 'Save Changes'}
          </Button>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={modal === 'delUser'} onClose={closeAll} title="Delete Account" maxW="max-w-sm">
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this account? They will no longer be able to sign in.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={closeAll}>Cancel</Button>
          <Button variant="danger" onClick={confirmDel}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
