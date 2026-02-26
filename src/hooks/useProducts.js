import { useShop } from '../context/ShopContext'
import { getProductStatus } from '../utils/stockStatus'

export const useProducts = () => {
  const { products, lowStock, dispatch } = useShop()

  const addProduct    = (data)     => dispatch({ type: 'ADD_PRODUCT',    payload: data })
  const updateProduct = (id, data) => dispatch({ type: 'UPDATE_PRODUCT', payload: { id, updates: data } })
  const deleteProduct = (id)       => dispatch({ type: 'DELETE_PRODUCT', payload: id })

  const withStatus = products.map(p => ({ ...p, status: getProductStatus(p.quantity) }))

  return { products: withStatus, lowStock, addProduct, updateProduct, deleteProduct }
}
