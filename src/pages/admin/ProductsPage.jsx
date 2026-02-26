import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import Modal       from '../../components/ui/Modal'
import Button      from '../../components/ui/Button'
import SearchBar   from '../../components/ui/SearchBar'
import StatusBadge from '../../components/ui/StatusBadge'
import { useProducts } from '../../hooks/useProducts'
import { fmt }         from '../../utils/formatCurrency'

const EMPTY_FORM = { name: '', price: '', quantity: '', category: '' }

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()

  const [search,  setSearch]  = useState('')
  const [modal,   setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [delId,   setDelId]   = useState(null)
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [err,     setErr]     = useState('')

  const filtered = useMemo(() =>
    products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
  [products, search])

  const openAdd  = () => { setForm(EMPTY_FORM); setErr(''); setModal('add') }
  const openEdit = p => {
    setEditing(p)
    setForm({ name: p.name, price: p.price, quantity: p.quantity, category: p.category || '' })
    setErr(''); setModal('edit')
  }
  const openDel  = id => { setDelId(id); setModal('del') }
  const closeAll = () => { setModal(null); setEditing(null); setDelId(null) }
  const handle   = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    if (!form.name.trim())  return 'Product name is required.'
    if (!form.price || isNaN(+form.price)    || +form.price    <= 0) return 'Enter a valid price.'
    if (!form.quantity || isNaN(+form.quantity) || +form.quantity < 0) return 'Enter a valid quantity.'
    return ''
  }

  const submitAdd = () => {
    const e = validate(); if (e) { setErr(e); return }
    addProduct({ name: form.name.trim(), price: +form.price, quantity: +form.quantity, category: form.category.trim() })
    closeAll()
  }

  const submitEdit = () => {
    const e = validate(); if (e) { setErr(e); return }
    updateProduct(editing.id, { name: form.name.trim(), price: +form.price, quantity: +form.quantity, category: form.category.trim() })
    closeAll()
  }

  const confirmDel = () => { deleteProduct(delId); closeAll() }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
            <Package size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-400 mt-0.5">{products.length} items in inventory</p>
          </div>
        </div>
        <Button onClick={openAdd}><Plus size={15} /> Add Product</Button>
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Search products…" className="mb-4 max-w-sm" />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <span className="w-1 h-5 rounded-full bg-blue-500 inline-block flex-shrink-0" />
          <h2 className="text-sm font-semibold text-gray-900">Inventory List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Package size={32} className="mx-auto mb-2 opacity-40" />
                    No products found.
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td className="font-semibold text-gray-900">{p.name}</td>
                  <td className="text-gray-500 text-xs">{p.category || '—'}</td>
                  <td className="font-mono font-bold text-green-600">₵{fmt(p.price)}</td>
                  <td className="font-mono font-semibold text-gray-700">{p.quantity}</td>
                  <td><StatusBadge value={p.status} /></td>
                  <td className="text-right pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => openDel(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit modal */}
      <Modal open={modal === 'add' || modal === 'edit'} onClose={closeAll} title={modal === 'add' ? 'Add New Product' : 'Edit Product'}>
        {err && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{err}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
            <input name="name" className="field" value={form.name} onChange={handle} placeholder="e.g. Coca Cola 500ml" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₵)</label>
              <input name="price" type="number" min="0" step="0.01" className="field" value={form.price} onChange={handle} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
              <input name="quantity" type="number" min="0" className="field" value={form.quantity} onChange={handle} placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <input name="category" className="field" value={form.category} onChange={handle} placeholder="e.g. Beverages" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={closeAll}>Cancel</Button>
          <Button onClick={modal === 'add' ? submitAdd : submitEdit}>
            {modal === 'add' ? 'Add Product' : 'Save Changes'}
          </Button>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={modal === 'del'} onClose={closeAll} title="Delete Product" maxW="max-w-sm">
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={closeAll}>Cancel</Button>
          <Button variant="danger" onClick={confirmDel}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
