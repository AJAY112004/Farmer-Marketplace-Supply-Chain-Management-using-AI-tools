import { useState } from 'react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';
import { useShipments } from '../contexts/ShipmentsContext';
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ShipmentStats {
  pendingPickups: number;
  inTransit: number;
  completed: number;
  total: number;
}

interface RecentShipment {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'in-transit' | 'delivered';
  product: string;
  from: string;
  to: string;
  date: string;
}

export default function SupplyChain() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { shipments } = useShipments();
  
  // Calculate stats from actual shipments
  const stats = {
    pendingPickups: shipments.filter(s => s.status === 'pending').length,
    inTransit: shipments.filter(s => s.status === 'in-transit').length,
    completed: shipments.filter(s => s.status === 'delivered').length,
    total: shipments.length
  };

  // Get recent shipments (last 5)
  const recentShipments = shipments.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in-transit': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-transit': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('home')}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Supply Chain Management</h1>
            </div>
            <span className="text-gray-600">Welcome, {user?.full_name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Pickups</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingPickups}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Transit</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inTransit}</p>
              </div>
              <Truck className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <Package className="w-12 h-12 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('book-shipment')}
              className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Truck className="w-6 h-6" />
              <span className="font-semibold">Book Shipment</span>
            </button>

            <button
              onClick={() => navigate('track-shipment')}
              className="flex items-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <MapPin className="w-6 h-6" />
              <span className="font-semibold">Track Shipment</span>
            </button>

            <button
              onClick={() => navigate('shipment-history')}
              className="flex items-center gap-3 p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <Package className="w-6 h-6" />
              <span className="font-semibold">View History</span>
            </button>
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Shipments</h2>
          <div className="space-y-4">
            {recentShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate('shipment-details', shipment.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{shipment.trackingNumber}</span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                      {getStatusIcon(shipment.status)}
                      {shipment.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{shipment.date}</span>
                </div>
                <div className="text-gray-700 mb-2">{shipment.product}</div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{shipment.from} → {shipment.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
