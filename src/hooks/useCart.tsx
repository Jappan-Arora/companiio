import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export interface CartItem {
  venueId: number
  venueName: string
  venueSlug: string
  venueImage: string
  venueCity: string
  venueCategory: string
  priceLevel: number
  addedAt: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'addedAt'>) => void
  removeItem: (venueId: number) => void
  clearCart: () => void
  isInCart: (venueId: number) => boolean
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = 'companiio-cart'

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((item: Omit<CartItem, 'addedAt'>) => {
    setItems(prev => {
      if (prev.some(i => i.venueId === item.venueId)) return prev
      return [...prev, { ...item, addedAt: new Date().toISOString() }]
    })
  }, [])

  const removeItem = useCallback((venueId: number) => {
    setItems(prev => prev.filter(i => i.venueId !== venueId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const isInCart = useCallback((venueId: number) => {
    return items.some(i => i.venueId === venueId)
  }, [items])

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      clearCart,
      isInCart,
      itemCount: items.length,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
