'use client';

import { Order } from '@/types';
import { formatDisplayDate } from '@/lib/dateUtils';

interface KitchenViewProps {
  tickets: Order[];
  onMarkReady: (id: number) => void;
}

export default function KitchenView({ tickets, onMarkReady }: KitchenViewProps) {
  const pendingTickets = tickets.filter(ticket => ticket.status === 'New');
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h2 className="text-2xl font-bold text-black">Kitchen Display</h2>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          {pendingTickets.length} orders
        </span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pendingTickets.length === 0 ? (
          <div className="col-span-full bg-green-50 border border-green-200 p-8 rounded-xl text-center">
            <div className="text-4xl mb-3">🍳</div>
            <p className="text-gray-600 text-lg">No orders to prepare</p>
            <p className="text-gray-500 text-sm mt-1">All caught up!</p>
          </div>
        ) : (
          pendingTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border border-green-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-black">Order #{ticket.id}</h3>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                    NEW
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-black">{ticket.customerName}</p>
                  <p>{ticket.customerPhone}</p>
                  <p className="font-medium text-green-700">🎿 {formatDisplayDate(ticket.orderDate)}</p>
                  <p>{new Date(ticket.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-black mb-2">Items:</h4>
                <div className="space-y-1">
                  {ticket.items.map((item, index) => (
                    <div key={index} className="text-black bg-green-50 px-3 py-1 rounded-lg text-sm">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => onMarkReady(ticket.id)}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                ✅ Mark Ready
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}