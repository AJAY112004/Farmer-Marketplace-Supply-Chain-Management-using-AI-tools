import { useState } from 'react';
import { useNavigate } from '../hooks/useNavigate';
import { useShipments } from '../contexts/ShipmentsContext';
import { Search, MapPin, Truck, Package, Clock, CheckCircle, User, Phone } from 'lucide-react';

interface TrackingInfo {
  trackingNumber: string;
  status: 'booked' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered';
  product: string;
  from: string;
  to: string;
  bookedDate: string;
  estimatedDelivery: string;
  currentLocation: string;
  driver: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  timeline: {
    status: string;
    location: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export default function TrackShipment() {
  const navigate = useNavigate();
  const { shipments } = useShipments();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');

    // Find shipment in context
    setTimeout(() => {
      const foundShipment = shipments.find(s => s.trackingNumber === trackingNumber);
      
      if (!foundShipment) {
        setError('Shipment not found. Please check your tracking number.');
        setTrackingInfo(null);
        setLoading(false);
        return;
      }

      setTrackingInfo({
        trackingNumber: foundShipment.trackingNumber,
        status: foundShipment.status as any,
        product: foundShipment.product,
        from: `${foundShipment.pickupAddress}, ${foundShipment.pickupCity}`,
        to: `${foundShipment.dropoffAddress}, ${foundShipment.dropoffCity}`,
        bookedDate: `${foundShipment.scheduledDate} ${foundShipment.scheduledTime}`,
        estimatedDelivery: foundShipment.scheduledDate,
        currentLocation: foundShipment.from,
        driver: {
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          vehicleNumber: 'MH 02 AB 1234'
        },
        timeline: [
          { status: 'Booked', location: foundShipment.from, timestamp: foundShipment.date, completed: true },
          { status: 'Picked Up', location: foundShipment.from, timestamp: foundShipment.status !== 'pending' ? foundShipment.date : 'Pending', completed: foundShipment.status !== 'pending' },
          { status: 'In Transit', location: foundShipment.from, timestamp: foundShipment.status === 'in-transit' || foundShipment.status === 'delivered' ? foundShipment.date : 'Pending', completed: foundShipment.status === 'in-transit' || foundShipment.status === 'delivered' },
          { status: 'Out for Delivery', location: foundShipment.to, timestamp: 'Pending', completed: false },
          { status: 'Delivered', location: foundShipment.to, timestamp: foundShipment.status === 'delivered' ? foundShipment.deliveredDate || foundShipment.date : 'Pending', completed: foundShipment.status === 'delivered' }
        ]
      });
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'text-yellow-600 bg-yellow-100';
      case 'picked-up': return 'text-orange-600 bg-orange-100';
      case 'in-transit': return 'text-blue-600 bg-blue-100';
      case 'out-for-delivery': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Track Your Shipment</h1>

          {/* Search Box */}
          <div className="mb-8">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                  placeholder="Enter tracking number (e.g., SCM2024001)"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleTrack}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          {/* Tracking Results */}
          {trackingInfo && (
            <div className="space-y-6">
              {/* Status Header */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Tracking Number</p>
                    <p className="text-2xl font-bold">{trackingInfo.trackingNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(trackingInfo.status)}`}>
                      {trackingInfo.status.replace('-', ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Shipment Details</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-semibold">{trackingInfo.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booked:</span>
                      <span className="font-semibold">{trackingInfo.bookedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-semibold text-green-600">{trackingInfo.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Driver Information</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-semibold">{trackingInfo.driver.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <a href={`tel:${trackingInfo.driver.phone}`} className="font-semibold text-blue-600 hover:underline">
                        <Phone className="w-4 h-4 inline mr-1" />
                        {trackingInfo.driver.phone}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-semibold">{trackingInfo.driver.vehicleNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Route</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-semibold">{trackingInfo.from}</p>
                    <p className="text-xs text-gray-500">Origin</p>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-blue-300 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded-lg text-xs font-semibold whitespace-nowrap">
                      <Truck className="w-4 h-4 inline mr-1" />
                      {trackingInfo.currentLocation}
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-sm font-semibold">{trackingInfo.to}</p>
                    <p className="text-xs text-gray-500">Destination</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Shipment Timeline</h3>
                </div>
                <div className="space-y-4">
                  {trackingInfo.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.completed ? 'bg-green-600' : 'bg-gray-300'
                        }`}>
                          {event.completed ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        {index < trackingInfo.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${event.completed ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={`font-semibold ${event.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                          {event.status}
                        </p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                        <p className="text-xs text-gray-500">{event.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="border rounded-lg p-4 bg-gray-100 h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-semibold">Live Map View</p>
                  <p className="text-sm">Integration with Google Maps / Mapbox API</p>
                </div>
              </div>
            </div>
          )}

          {!trackingInfo && !loading && (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Enter a tracking number to view shipment details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
