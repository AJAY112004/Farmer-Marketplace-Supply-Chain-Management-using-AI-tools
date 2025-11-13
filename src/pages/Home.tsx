import { useState, useEffect } from 'react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Truck, LogOut, User, Mail, Phone, MapPin, Lock, Package, ChevronRight, Calendar, ChevronDown, Edit } from 'lucide-react';

export default function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  
  useEffect(() => {
    fetchOrderHistory();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://127.0.0.1:8000/api/orders/list/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.slice(0, 5)); // Show last 5 orders
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://127.0.0.1:8000/api/users/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword
        })
      });

      if (response.ok) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowChangePassword(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        const data = await response.json();
        setPasswordError(data.detail || 'Failed to change password');
      }
    } catch (err) {
      setPasswordError('An error occurred. Please try again.');
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileForm.email)) {
      setProfileError('Please enter a valid email address');
      return;
    }

    // Validate phone (optional but if provided should be valid)
    if (profileForm.phone && profileForm.phone.length < 10) {
      setProfileError('Phone number must be at least 10 digits');
      return;
    }

    // Validate name
    if (profileForm.full_name.trim().length < 2) {
      setProfileError('Name must be at least 2 characters');
      return;
    }

    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://127.0.0.1:8000/api/users/profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => {
          setShowEditProfile(false);
          setProfileSuccess('');
          window.location.reload(); // Refresh to update user data
        }, 1500);
      } else {
        const data = await response.json();
        setProfileError(data.detail || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError('An error occurred. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Enhanced Navbar with Profile */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-700">AgriConnect</h1>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 transition"
              >
                <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">{user?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'Farmer'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                  {/* Profile Info */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                        {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{user?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'Farmer'}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user?.email || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{user?.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span className="text-xs">{user?.address || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowEditProfile(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-green-50 rounded-lg transition"
                    >
                      <Edit className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Edit Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowChangePassword(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Lock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Change Password</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h3>
            {profileError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
                {profileSuccess}
              </div>
            )}
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                  minLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Enter your address"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProfile(false);
                    setProfileError('');
                    setProfileSuccess('');
                    setProfileForm({
                      full_name: user?.full_name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      address: user?.address || ''
                    });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal Overlay */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
                {passwordSuccess}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Module Selection */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Choose Your Module</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Farmer Marketplace */}
              <button
                onClick={() => navigate('marketplace')}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-1 text-left"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-green-100 p-6 rounded-full">
                    <ShoppingCart className="w-16 h-16 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Farmer Marketplace
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse and purchase agricultural products including fertilizers, pesticides, seeds, and farming tools.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Fertilizers
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Seeds
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Tools
                  </span>
                </div>
              </button>

              {/* Supply Chain */}
              <button
                onClick={() => navigate('supply-chain')}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition transform hover:-translate-y-1 text-left"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-blue-100 p-6 rounded-full">
                    <Truck className="w-16 h-16 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Supply Chain Management
                </h3>
                <p className="text-gray-600 mb-4">
                  Book vehicles for transporting your produce with real-time tracking and reliable logistics partners.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    Live Tracking
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    Vehicle Booking
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    Route Planning
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Recent Orders</h3>
              <button
                onClick={() => navigate('orders')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No orders yet</p>
                <p className="text-gray-400 text-sm mb-4">Start shopping to see your order history</p>
                <button
                  onClick={() => navigate('marketplace')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-gray-800">Order #{order.id}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{order.items?.length || 0} item(s)</span>
                        <span className="font-bold text-green-600 text-lg">₹{order.total_amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
