import { useState } from 'react';
import { useNavigate } from '../hooks/useNavigate';
import { useShipments } from '../contexts/ShipmentsContext';
import { Search, Filter, Package, MapPin, Calendar, Clock } from 'lucide-react';

interface Shipment {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  product: string;
  from: string;
  to: string;
  date: string;
  deliveredDate?: string;
}

export default function ShipmentHistory() {
  const navigate = useNavigate();
  const { shipments } = useShipments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState('');

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.to.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesDate = !filterDate || shipment.date === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in-transit': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-transit': return <Package className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      case 'cancelled': return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('supply-chain')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Supply Chain
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Shipment History</h1>

          {/* Search and Filters */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by tracking number, product, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-gray-600">
            Showing <span className="font-semibold">{filteredShipments.length}</span> of {shipments.length} shipments
          </div>

          {/* Shipments List */}
          <div className="space-y-4">
            {filteredShipments.length > 0 ? (
              filteredShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate('shipment-details', shipment.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-800">{shipment.trackingNumber}</span>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                        {getStatusIcon(shipment.status)}
                        {shipment.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {shipment.date}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Product</p>
                      <p className="font-semibold text-gray-800">{shipment.product}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Route</p>
                      <p className="font-semibold text-gray-800 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-green-600" />
                        {shipment.from}
                        <span className="text-gray-400">→</span>
                        <MapPin className="w-4 h-4 text-red-600" />
                        {shipment.to}
                      </p>
                    </div>
                    {shipment.deliveredDate && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Delivered On</p>
                        <p className="font-semibold text-green-600">{shipment.deliveredDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold">No shipments found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredShipments.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">2</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">3</button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
