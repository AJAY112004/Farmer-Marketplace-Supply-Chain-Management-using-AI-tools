import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Edit2, Save } from 'lucide-react';
import axios from 'axios';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Base URL of Django backend
  const API_BASE = 'http://127.0.0.1:8000/api';

  // Load user's profile address on component mount
  useEffect(() => {
    if (user?.address) {
      setShippingAddress(user.address);
    }
  }, [user]);

  const handleCheckout = async () => {
    if (!shippingAddress) {
      setError('Please enter your shipping address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      // Create order from cart
      const orderResponse = await axios.post(`${API_BASE}/orders/`, {}, {
        headers
      });

      clearCart();
      alert('✅ Order placed successfully! Order ID: ' + orderResponse.data.id);
      navigate('orders');
    } catch (err) {
      console.error('Checkout failed:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!shippingAddress.trim()) {
      setError('Address cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('access');
      const response = await axios.patch(
        `${API_BASE}/users/profile/`,
        { address: shippingAddress },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        // Update localStorage
        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditingAddress(false);
        setError('');
        setSuccess('Address saved to your profile successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update address:', err);
      setError('Failed to update address. Please try again.');
    }
  };

  // 🛒 Empty Cart UI
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate('marketplace')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Marketplace
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <button
            onClick={() => navigate('marketplace')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // 🧾 Cart + Checkout UI
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('marketplace')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Marketplace
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
            <div className="w-24" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 🧺 Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex gap-4">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/150'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-green-600 font-semibold text-xl mb-4">₹{item.price}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-200 rounded-l-lg transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-200 rounded-r-lg transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-600 text-sm mb-1">Subtotal</p>
                    <p className="font-bold text-xl text-gray-800">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 💳 Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {success}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Shipping Address
                      {user?.address && !isEditingAddress && (
                        <span className="text-xs text-gray-500 ml-2">(From your profile)</span>
                      )}
                    </label>
                    {!isEditingAddress ? (
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveAddress}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        <Save className="w-3 h-3" />
                        Save to Profile
                      </button>
                    )}
                  </div>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    disabled={!isEditingAddress && !!user?.address}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      !isEditingAddress && user?.address ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    rows={3}
                    placeholder="Enter your delivery address"
                  />
                  {isEditingAddress && (
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Saving this address will update your profile address too
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="upi">UPI</option>
                    <option value="paytm">PayTM</option>
                    <option value="googlepay">Google Pay</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="netbanking">Net Banking</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-green-600">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
