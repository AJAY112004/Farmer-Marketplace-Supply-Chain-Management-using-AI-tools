import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ShipmentsProvider } from './contexts/ShipmentsContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { useCurrentPage } from './hooks/useNavigate';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import SupplyChain from './pages/SupplyChain';
import BookShipment from './pages/BookShipment';
import TrackShipment from './pages/TrackShipment';
import ShipmentDetails from './pages/ShipmentDetails';
import History from './pages/History';

function AppContent() {
  const { user, loading } = useAuth();
  const { page } = useCurrentPage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && page !== 'register' && page !== 'forgot-password') {
    return <Login />;
  }

  if (!user && page === 'register') {
    return <Register />;
  }

  if (!user && page === 'forgot-password') {
    return <ForgotPassword />;
  }

  switch (page) {
    case 'login':
      return <Login />;
    case 'register':
      return <Register />;
    case 'forgot-password':
      return <ForgotPassword />;
    case 'home':
      return <Home />;
    case 'marketplace':
      return <Marketplace />;
    case 'cart':
      return <Cart />;
    case 'orders':
      return <Orders />;
    case 'supply-chain':
      return <SupplyChain />;
    case 'book-shipment':
      return <BookShipment />;
    case 'track-shipment':
      return <TrackShipment />;
    case 'shipment-details':
      return <ShipmentDetails />;
    case 'shipment-history':
      return <History />;
    default:
      return <Home />;
  }
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ShipmentsProvider>
          <ProductsProvider>
            <AppContent />
          </ProductsProvider>
        </ShipmentsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
