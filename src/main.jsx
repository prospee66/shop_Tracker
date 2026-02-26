import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ShopProvider } from './context/ShopContext'
import './index.css'

/* ── Wipe any old dev/demo data on first load of this production version ── */
const APP_VER = '2.0.0'
if (localStorage.getItem('ava_ver') !== APP_VER) {
  ;['ava_users', 'ava_products', 'ava_sales', 'ava_session'].forEach(k => localStorage.removeItem(k))
  localStorage.setItem('ava_ver', APP_VER)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ShopProvider>
        <App />
      </ShopProvider>
    </AuthProvider>
  </BrowserRouter>
)
