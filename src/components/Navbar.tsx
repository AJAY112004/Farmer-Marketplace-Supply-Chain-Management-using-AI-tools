import { Truck, Bell, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  unreadCount?: number;
}

export function Navbar({ onNavigate, currentPage, unreadCount = 0 }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'book', label: 'Book Shipment' },
    { id: 'track', label: 'Track' },
    { id: 'history', label: 'History' },
    { id: 'support', label: 'Support' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <Truck className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">SupplyChain</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavigate('notifications')}
              className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <User className="h-6 w-6" />
            </button>
          </div>

          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-700 hover:bg-emerald-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex space-x-2 px-4 pt-2">
              <button
                onClick={() => {
                  onNavigate('notifications');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Bell className="h-6 w-6 mx-auto" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-1/2 translate-x-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  onNavigate('profile');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              >
                <User className="h-6 w-6 mx-auto" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
