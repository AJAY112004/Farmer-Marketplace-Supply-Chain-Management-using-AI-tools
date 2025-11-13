import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type Page =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'home'
  | 'marketplace'
  | 'supply-chain'
  | 'book-shipment'
  | 'track-shipment'
  | 'shipment-details'
  | 'shipment-history'
  | 'cart'
  | 'orders'
  | 'product-detail';

interface NavigationState {
  page: Page;
  productId: string | null;
}

let navigationState: NavigationState = { page: 'login', productId: null };
const listeners: (() => void)[] = [];

export function useNavigate() {
  const [, forceUpdate] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return (page: Page, productId?: string, skipAuthCheck?: boolean) => {
    // Protect routes that require login
    const protectedPages: Page[] = ['home', 'marketplace', 'supply-chain', 'book-shipment', 'track-shipment', 'shipment-details', 'shipment-history', 'cart', 'orders'];
    if (!skipAuthCheck && !user && protectedPages.includes(page)) {
      console.warn('Unauthorized navigation — redirecting to login');
      navigationState = { page: 'login', productId: null };
    } else {
      navigationState = { page, productId: productId || null };
    }

    listeners.forEach(listener => listener());
  };
}

export function useCurrentPage(): NavigationState {
  const [, forceUpdate] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  // Auto redirect if session expired
  useEffect(() => {
    if (!user && navigationState.page !== 'login' && navigationState.page !== 'register') {
      navigationState = { page: 'login', productId: null };
      listeners.forEach(listener => listener());
    }
  }, [user]);

  return navigationState;
}
