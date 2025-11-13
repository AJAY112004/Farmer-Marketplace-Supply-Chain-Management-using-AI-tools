import { useNavigate, useCurrentPage } from '../hooks/useNavigate';
import { useShipments } from '../contexts/ShipmentsContext';
import { Package, MapPin, User, Phone, Truck, Calendar, DollarSign, Clock, Edit } from 'lucide-react';

export default function ShipmentDetails() {
  const navigate = useNavigate();
  const { productId: shipmentId } = useCurrentPage();
  const { getShipmentById } = useShipments();

  // Get shipment from context
  const foundShipment = getShipmentById(shipmentId || '1');

  // Mock data structure for display
  const shipment = foundShipment ? {
    trackingNumber: foundShipment.trackingNumber,
    status: foundShipment.status,
    product: {
      name: foundShipment.product,
      quantity: foundShipment.quantity,
      weight: `${foundShipment.weight} kg`,
      type: 'Agricultural Product'
    },
    sender: {
      name: 'Ramesh Patel',
      phone: '+91 98765 12345',
      address: foundShipment.pickupAddress + ', ' + foundShipment.pickupCity
    },
    receiver: {
      name: 'Suresh Kumar',
      phone: '+91 98765 67890',
      address: foundShipment.dropoffAddress + ', ' + foundShipment.dropoffCity
    },
    driver: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      vehicleNumber: 'MH 02 AB 1234',
      vehicleType: foundShipment.vehicleType.replace('-', ' ').toUpperCase() + ' (20 tons)'
    },
    booking: {
      date: foundShipment.date,
      time: foundShipment.scheduledTime,
      pickupDate: foundShipment.scheduledDate,
      estimatedDelivery: foundShipment.scheduledDate
    },
    payment: {
      amount: foundShipment.amount,
      status: 'Paid',
      method: 'Online Payment'
    }
  } : {
    trackingNumber: 'SCM2024001',
    status: 'in-transit',
    product: {
      name: 'Rice',
      quantity: '500 bags',
      weight: '25000 kg',
      type: 'Agricultural Product'
    },
    sender: {
      name: 'Ramesh Patel',
      phone: '+91 98765 12345',
      address: 'Farm House, Village Kheda, Mumbai, Maharashtra 400001'
    },
    receiver: {
      name: 'Suresh Kumar',
      phone: '+91 98765 67890',
      address: 'Warehouse 5, Industrial Area, Delhi, NCR 110001'
    },
    driver: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      vehicleNumber: 'MH 02 AB 1234',
      vehicleType: 'Heavy Truck (20 tons)'
    },
    booking: {
      date: '2024-01-15',
      time: '10:30 AM',
      pickupDate: '2024-01-15',
      estimatedDelivery: '2024-01-17'
    },
    payment: {
      amount: 8500,
      status: 'Paid',
      method: 'Online Payment'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in-transit': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Shipment Details</h1>
              <p className="text-gray-600 mt-1">Tracking: {shipment.trackingNumber}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(shipment.status)}`}>
              {shipment.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          {/* Product Information */}
          <div className="mb-6 border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Product Information</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Product Name</p>
                <p className="font-semibold text-gray-800">{shipment.product.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-semibold text-gray-800">{shipment.product.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-semibold text-gray-800">{shipment.product.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Weight</p>
                <p className="font-semibold text-gray-800">{shipment.product.weight}</p>
              </div>
            </div>
          </div>

          {/* Sender & Receiver */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Sender Details</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-800">{shipment.sender.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a href={`tel:${shipment.sender.phone}`} className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {shipment.sender.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-800">{shipment.sender.address}</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-800">Receiver Details</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-800">{shipment.receiver.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a href={`tel:${shipment.receiver.phone}`} className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {shipment.receiver.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-semibold text-gray-800">{shipment.receiver.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Driver & Vehicle */}
          <div className="mb-6 border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Driver & Vehicle Information</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Driver Name</p>
                <p className="font-semibold text-gray-800">{shipment.driver.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <a href={`tel:${shipment.driver.phone}`} className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {shipment.driver.phone}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehicle Number</p>
                <p className="font-semibold text-gray-800">{shipment.driver.vehicleNumber}</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-sm text-gray-600">Vehicle Type</p>
                <p className="font-semibold text-gray-800">{shipment.driver.vehicleType}</p>
              </div>
            </div>
          </div>

          {/* Booking & Delivery Timeline */}
          <div className="mb-6 border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Booking & Timeline</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Booked On</p>
                <p className="font-semibold text-gray-800">{shipment.booking.date} at {shipment.booking.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pickup Date</p>
                <p className="font-semibold text-gray-800">{shipment.booking.pickupDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-semibold text-green-600">{shipment.booking.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border rounded-lg p-6 bg-green-50">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Payment Information</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-2xl font-bold text-gray-800">₹{shipment.payment.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-semibold text-green-600">{shipment.payment.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold text-gray-800">{shipment.payment.method}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate('track-shipment')}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Track Shipment
            </button>
            <button
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Update Status
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
