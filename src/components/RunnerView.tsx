'use client';

import { Order } from '@/types';
import { formatDisplayDate } from '@/lib/dateUtils';

interface RunnerViewProps {
  deliveries: Order[];
  onMarkDelivered: (id: number) => void;
}

export default function RunnerView({ deliveries, onMarkDelivered }: RunnerViewProps) {
  const readyDeliveries = deliveries.filter(delivery => delivery.status === 'Ready');
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
        <h2 className="text-2xl font-bold text-black">Runner Dashboard</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          {readyDeliveries.length} ready
        </span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {readyDeliveries.length === 0 ? (
          <div className="col-span-full bg-blue-50 border border-blue-200 p-8 rounded-xl text-center">
            <div className="text-4xl mb-3">🎿</div>
            <p className="text-gray-600 text-lg">No deliveries ready</p>
            <p className="text-gray-500 text-sm mt-1">Waiting for kitchen to prepare orders</p>
          </div>
        ) : (
          readyDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white border border-blue-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-black">Delivery #{delivery.id}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                    READY
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-black">👤 {delivery.customerName}</p>
                  <p className="text-blue-600 font-medium">📞 {delivery.customerPhone}</p>
                  <p className="font-medium text-blue-700">🎿 Deliver: {formatDisplayDate(delivery.orderDate)}</p>
                  <p className="text-gray-600">Ordered: {new Date(delivery.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-black mb-2">Items to deliver:</h4>
                <div className="space-y-1">
                  {delivery.items.map((item, index) => (
                    <div key={index} className="text-black bg-blue-50 px-3 py-1 rounded-lg text-sm">
                      📦 {item}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm font-semibold">🎿 Destination: Ski Line</p>
                <p className="text-blue-600 text-xs mt-1">Fresh & hot delivery</p>
              </div>
              
              <button
                onClick={() => onMarkDelivered(delivery.id)}
                className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                🚀 Mark Delivered
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}