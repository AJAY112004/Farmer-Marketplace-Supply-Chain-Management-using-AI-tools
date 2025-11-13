import { useState } from 'react';
import { useNavigate } from '../hooks/useNavigate';
import { useShipments } from '../contexts/ShipmentsContext';
import { MapPin, Package, Truck, Calendar, DollarSign, Star } from 'lucide-react';

interface LogisticsProvider {
  id: string;
  name: string;
  rating: number;
  capacity: string;
  rate: number;
  vehicleType: string;
}

export default function BookShipment() {
  const navigate = useNavigate();
  const { addShipment } = useShipments();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    pickupCity: '',
    dropoffCity: '',
    productType: '',
    quantity: '',
    weight: '',
    vehicleType: 'truck',
    scheduledDate: '',
    scheduledTime: '',
    selectedProvider: ''
  });

  const [providers] = useState<LogisticsProvider[]>([
    { id: '1', name: 'FastTrack Logistics', rating: 4.5, capacity: '10 tons', rate: 5000, vehicleType: 'Truck' },
    { id: '2', name: 'QuickShip Transport', rating: 4.2, capacity: '5 tons', rate: 3500, vehicleType: 'Mini Truck' },
    { id: '3', name: 'MegaHaul Services', rating: 4.8, capacity: '20 tons', rate: 8500, vehicleType: 'Heavy Truck' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const selectedProvider = providers.find(p => p.id === formData.selectedProvider);
    
    const trackingNumber = addShipment({
      product: `${formData.productType} - ${formData.weight}kg`,
      from: formData.pickupCity,
      to: formData.dropoffCity,
      pickupAddress: formData.pickupAddress,
      dropoffAddress: formData.dropoffAddress,
      pickupCity: formData.pickupCity,
      dropoffCity: formData.dropoffCity,
      quantity: formData.quantity,
      weight: formData.weight,
      vehicleType: formData.vehicleType,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      providerId: formData.selectedProvider,
      providerName: selectedProvider?.name || '',
      amount: selectedProvider?.rate || 0
    });
    
    alert(`Booking confirmed! Your tracking number is ${trackingNumber}`);
    navigate('supply-chain');
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Book a Shipment</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>1</div>
              <span className="ml-2 text-sm font-semibold">Shipment Details</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</div>
              <span className="ml-2 text-sm font-semibold">Select Provider</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>3</div>
              <span className="ml-2 text-sm font-semibold">Confirmation</span>
            </div>
          </div>

          {/* Step 1: Shipment Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter pickup address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup City
                  </label>
                  <input
                    type="text"
                    name="pickupCity"
                    value={formData.pickupCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Drop-off Address
                  </label>
                  <input
                    type="text"
                    name="dropoffAddress"
                    value={formData.dropoffAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter drop-off address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off City
                  </label>
                  <input
                    type="text"
                    name="dropoffCity"
                    value={formData.dropoffCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="w-4 h-4 inline mr-1" />
                    Product Type
                  </label>
                  <input
                    type="text"
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Rice, Wheat, Vegetables"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 500 bags"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Total weight"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Truck className="w-4 h-4 inline mr-1" />
                    Vehicle Type
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="truck">Truck (10 tons)</option>
                    <option value="mini-truck">Mini Truck (5 tons)</option>
                    <option value="heavy-truck">Heavy Truck (20 tons)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Continue to Provider Selection
              </button>
            </div>
          )}

          {/* Step 2: Select Provider */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Logistics Providers</h2>
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => setFormData({ ...formData, selectedProvider: provider.id })}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    formData.selectedProvider === provider.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{provider.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          {provider.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          {provider.vehicleType}
                        </span>
                        <span>Capacity: {provider.capacity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
                        <DollarSign className="w-6 h-6" />
                        {provider.rate}
                      </div>
                      <span className="text-sm text-gray-500">Estimated cost</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!formData.selectedProvider}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Continue to Confirmation
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Summary</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-semibold">{formData.pickupAddress}, {formData.pickupCity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-semibold">{formData.dropoffAddress}, {formData.dropoffCity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="font-semibold">{formData.productType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-semibold">{formData.quantity} ({formData.weight} kg)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheduled</p>
                    <p className="font-semibold">{formData.scheduledDate} at {formData.scheduledTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Provider</p>
                    <p className="font-semibold">
                      {providers.find(p => p.id === formData.selectedProvider)?.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
