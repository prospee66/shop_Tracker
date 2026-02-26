import { createContext, useContext, useReducer } from 'react'
import { productService } from '../services/productService'
import { salesService   } from '../services/salesService'
import { authService    } from '../services/authService'
import { LOW_THRESHOLD  } from '../utils/stockStatus'

const ShopContext = createContext(null)

const shopReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':    return { ...state, products: action.payload }
    case 'ADD_PRODUCT': {
      const p = productService.add(action.payload)
      return { ...state, products: [...state.products, p] }
    }
    case 'UPDATE_PRODUCT': {
      const p = productService.update(action.payload.id, action.payload.updates)
      return { ...state, products: state.products.map(x => x.id === p.id ? p : x) }
    }
    case 'DELETE_PRODUCT': {
      productService.delete(action.payload)
      return { ...state, products: state.products.filter(x => x.id !== action.payload) }
    }
    case 'ADD_SALE': {
      const s = salesService.add(action.payload)
      /* Also decrement product stock */
      productService.update(s.productId, {
        quantity: Math.max(0, (state.products.find(p => p.id === s.productId)?.quantity ?? 0) - s.quantitySold)
      })
      const updatedProducts = state.products.map(p =>
        p.id === s.productId ? { ...p, quantity: Math.max(0, p.quantity - s.quantitySold) } : p
      )
      return { ...state, sales: [...state.sales, s], products: updatedProducts }
    }
    case 'ADD_USER': {
      const u = authService.addUser(action.payload)
      return { ...state, users: [...state.users, u] }
    }
    case 'UPDATE_USER': {
      const u = authService.updateUser(action.payload.id, action.payload.updates)
      return { ...state, users: state.users.map(x => x.id === u.id ? u : x) }
    }
    case 'DELETE_USER': {
      authService.deleteUser(action.payload)
      return { ...state, users: state.users.filter(x => x.id !== action.payload) }
    }
    default: return state
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, {
    products: productService.getAll(),
    sales:    salesService.getAll(),
    users:    authService.getAll(),
  })

  const lowStock = state.products.filter(p => p.quantity <= LOW_THRESHOLD)

  return (
    <ShopContext.Provider value={{ ...state, lowStock, dispatch }}>
      {children}
    </ShopContext.Provider>
  )
}

export const useShop = () => {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be inside ShopProvider')
  return ctx
}
