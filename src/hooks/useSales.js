import { useShop } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { isToday  } from '../utils/dateUtils'

export const useSales = () => {
  const { sales, products, dispatch } = useShop()
  const { currentUser } = useAuth()

  const todaySales = sales.filter(s => isToday(s.date))

  const addSale = ({ product, quantitySold, paymentMethod }) => {
    const amount = product.price * quantitySold
    dispatch({
      type: 'ADD_SALE',
      payload: {
        productId:     product.id,
        productName:   product.name,
        quantitySold,
        amount,
        paymentMethod,
        soldById:      currentUser.id,
        soldBy:        currentUser.name,
        date:          new Date().toISOString(),
      },
    })
    return amount
  }

  return { sales, todaySales, addSale, products }
}
