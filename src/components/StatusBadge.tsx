interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    booked: { bg: 'bg-blue-100', text: 'text-blue-800' },
    in_transit: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
  };

  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}
