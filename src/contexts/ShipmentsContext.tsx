import { createContext, useContext, useState, ReactNode } from 'react';

interface Shipment {
  id: string;
  trackingNumber: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
  product: string;
  from: string;
  to: string;
  date: string;
  deliveredDate?: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupCity: string;
  dropoffCity: string;
  quantity: string;
  weight: string;
  vehicleType: string;
  scheduledDate: string;
  scheduledTime: string;
  providerId: string;
  providerName: string;
  amount: number;
}

interface ShipmentsContextType {
  shipments: Shipment[];
  addShipment: (shipment: Omit<Shipment, 'id' | 'trackingNumber' | 'date' | 'status'>) => string;
  getShipmentById: (id: string) => Shipment | undefined;
}

const ShipmentsContext = createContext<ShipmentsContextType | undefined>(undefined);

export function ShipmentsProvider({ children }: { children: ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: '1',
      trackingNumber: 'SCM2024001',
      status: 'in-transit',
      product: 'Rice - 500kg',
      from: 'Mumbai',
      to: 'Delhi',
      date: '2024-01-15',
      pickupAddress: 'Farm House, Village Kheda',
      dropoffAddress: 'Warehouse 5, Industrial Area',
      pickupCity: 'Mumbai',
      dropoffCity: 'Delhi',
      quantity: '500 bags',
      weight: '25000',
      vehicleType: 'truck',
      scheduledDate: '2024-01-15',
      scheduledTime: '10:00',
      providerId: '1',
      providerName: 'FastTrack Logistics',
      amount: 5000
    },
    {
      id: '2',
      trackingNumber: 'SCM2024002',
      status: 'pending',
      product: 'Wheat - 1000kg',
      from: 'Pune',
      to: 'Bangalore',
      date: '2024-01-16',
      pickupAddress: 'Agricultural Market',
      dropoffAddress: 'Distribution Center',
      pickupCity: 'Pune',
      dropoffCity: 'Bangalore',
      quantity: '1000 bags',
      weight: '50000',
      vehicleType: 'heavy-truck',
      scheduledDate: '2024-01-16',
      scheduledTime: '08:00',
      providerId: '3',
      providerName: 'MegaHaul Services',
      amount: 8500
    },
    {
      id: '3',
      trackingNumber: 'SCM2024003',
      status: 'delivered',
      product: 'Vegetables - 200kg',
      from: 'Chennai',
      to: 'Hyderabad',
      date: '2024-01-14',
      pickupAddress: 'Vegetable Market',
      dropoffAddress: 'Retail Store',
      pickupCity: 'Chennai',
      dropoffCity: 'Hyderabad',
      quantity: '200 bags',
      weight: '10000',
      vehicleType: 'mini-truck',
      scheduledDate: '2024-01-14',
      scheduledTime: '06:00',
      providerId: '2',
      providerName: 'QuickShip Transport',
      amount: 3500
    }
  ]);

  const generateTrackingNumber = () => {
    const number = 1000 + shipments.length + 1;
    return `SCM2024${number.toString().padStart(3, '0')}`;
  };

  const addShipment = (shipmentData: Omit<Shipment, 'id' | 'trackingNumber' | 'date' | 'status'>) => {
    const newShipment: Shipment = {
      ...shipmentData,
      id: (shipments.length + 1).toString(),
      trackingNumber: generateTrackingNumber(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setShipments(prev => [newShipment, ...prev]);
    return newShipment.trackingNumber;
  };

  const getShipmentById = (id: string) => {
    return shipments.find(shipment => shipment.id === id);
  };

  return (
    <ShipmentsContext.Provider value={{ shipments, addShipment, getShipmentById }}>
      {children}
    </ShipmentsContext.Provider>
  );
}

export function useShipments() {
  const context = useContext(ShipmentsContext);
  if (!context) {
    throw new Error('useShipments must be used within a ShipmentsProvider');
  }
  return context;
}
