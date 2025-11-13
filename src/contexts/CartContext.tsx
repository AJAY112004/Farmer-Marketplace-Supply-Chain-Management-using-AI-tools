import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalAmount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:8000/api/cart'; // Django backend

  useEffect(() => {
    if (user) fetchCart();
    else setItems([]);
  }, [user]);

  // ✅ Properly typed and safe header generator
  const getAuthHeader = (): HeadersInit => {
    const token = localStorage.getItem('access');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/`, {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();

      // Backend returns { items: [...], total_items, total_cost }
      const formatted = (data.items || []).map((item: any) => ({
        id: item.id.toString(),
        name: item.product_name,
        price: item.price,
        quantity: item.quantity,
        image_url: '', // No image in cart item
      }));

      setItems(formatted);
    } catch (err) {
      console.error('Cart fetch failed:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: CartItem) => {
    // Optimistically update UI
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + product.quantity } : i
        );
      }
      return [...prev, product];
    });

    try {
      await fetch(`${API_BASE}/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          product_name: product.name,
          price: product.price,
          quantity: product.quantity,
        }),
      });
    } catch (err) {
      console.error('Add to cart failed:', err);
      // Revert on error
      fetchCart();
    }
  };

  const removeFromCart = async (productId: string) => {
    const productName = items.find(i => i.id === productId)?.name;
    if (!productName) return;

    setItems(prev => prev.filter(i => i.id !== productId));
    try {
      await fetch(`${API_BASE}/remove/${encodeURIComponent(productName)}/`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
    } catch (err) {
      console.error('Remove failed:', err);
      fetchCart();
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const productName = items.find(i => i.id === productId)?.name;
    if (!productName) return;

    setItems(prev =>
      prev.map(i => (i.id === productId ? { ...i, quantity } : i))
    );
    try {
      await fetch(`${API_BASE}/update/${encodeURIComponent(productName)}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ quantity }),
      });
    } catch (err) {
      console.error('Update quantity failed:', err);
      fetchCart();
    }
  };

  const clearCart = async () => {
    setItems([]);
    try {
      await fetch(`${API_BASE}/clear/`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
    } catch (err) {
      console.error('Clear cart failed:', err);
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
