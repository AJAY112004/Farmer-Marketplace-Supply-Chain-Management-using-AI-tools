import { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';

interface Shipment {
  id: string;
  tracking_number: string;
  product_type: string;
  sender_address: string;
  receiver_address: string;
  status: 'booked' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string;
}

interface DashboardProps {
  onNavigate: (page: string, data?: unknown) => void;
  userId: string;
}

export function Dashboard({ onNavigate, userId }: DashboardProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    inTransit: 0,
    delivered: 0,
    total: 0,
  });

  useEffect(() => {
    fetchShipments();
  }, [userId]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/shipments/?user_id=${userId}`);
      const data: Shipment[] = res.data;

      setShipments(data);
      setStats({
        pending: data.filter((s) => s.status === 'booked').length,
        inTransit: data.filter((s) => s.status === 'in_transit').length,
        delivered: data.filter((s) => s.status === 'delivered').length,
        total: data.length,
      });
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Pending Pickups',
      value: stats.pending,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'In Transit',
      value: stats.inTransit,
      icon: Truck,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Delivered',
      value: stats.delivered,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Shipments',
      value: stats.total,
      icon: Package,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage and track your shipments in real-time</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className="transition-transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions + Recent Shipments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button fullWidth onClick={() => onNavigate('book')} className="justify-center">
                Book New Shipment
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => onNavigate('track')}
                className="justify-center"
              >
                Track Shipment
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => onNavigate('history')}
                className="justify-center"
              >
                View History
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Shipments</h2>
              <Button variant="outline" size="sm" onClick={() => onNavigate('history')}>
                View All
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : shipments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No shipments yet. Book your first shipment to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-all cursor-pointer"
                    onClick={() => onNavigate('shipment-details', { shipmentId: shipment.id })}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {shipment.tracking_number}
                        </p>
                        <p className="text-sm text-gray-600">{shipment.product_type}</p>
                      </div>
                      <StatusBadge status={shipment.status} />
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>From: {shipment.sender_address}</p>
                      <p>To: {shipment.receiver_address}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
