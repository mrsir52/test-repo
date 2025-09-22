'use client';

import { useState } from 'react';
import { Order } from '@/types';
import { formatDisplayDate, formatDate } from '@/lib/dateUtils';

interface AdminViewProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  allOrders: Order[];
  availableDates: string[];
  onUpdateAvailableDates: (dates: string[]) => void;
}

export default function AdminView({ isOpen, onToggleOpen, allOrders, availableDates, onUpdateAvailableDates }: AdminViewProps) {
  const [newDate, setNewDate] = useState('');
  
  const stats = {
    total: allOrders.length,
    new: allOrders.filter(o => o.status === 'New').length,
    ready: allOrders.filter(o => o.status === 'Ready').length,
    delivered: allOrders.filter(o => o.status === 'Delivered').length,
  };

  const addDate = () => {
    if (newDate && !availableDates.includes(newDate)) {
      const updatedDates = [...availableDates, newDate].sort();
      onUpdateAvailableDates(updatedDates);
      setNewDate('');
    }
  };

  const removeDate = (dateToRemove: string) => {
    const updatedDates = availableDates.filter(date => date !== dateToRemove);
    onUpdateAvailableDates(updatedDates);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
        <h2 className="text-2xl font-bold text-black">Admin Console</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isOpen 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isOpen ? '🟢 Open' : '🔴 Closed'}
        </span>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Restaurant Status */}
        <div className="bg-white border border-blue-100 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-black mb-4">Restaurant Control</h3>
          
          {/* Google Sheets Status */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-black">Google Sheets Integration</span>
            </div>
            <p className="text-xs text-gray-600">
              Orders automatically sync to Google Sheets for kitchen workflow
            </p>
          </div>
          <button
            onClick={onToggleOpen}
            className={`w-full py-3 rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] ${
              isOpen
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-blue-900 text-white hover:bg-blue-800'
            }`}
          >
            {isOpen ? '🛑 Close Restaurant' : '🟢 Open Restaurant'}
          </button>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-black text-sm">
              <span className="font-semibold">Current Status:</span>{' '}
              <span className={isOpen ? 'text-blue-600' : 'text-red-600'}>
                {isOpen ? 'Accepting Orders' : 'Closed for Orders'}
              </span>
            </p>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="lg:col-span-2 bg-white border border-blue-100 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-black mb-4">Order Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-black">{stats.total}</div>
              <div className="text-sm text-gray-600 font-medium">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-800">{stats.new}</div>
              <div className="text-sm text-yellow-700 font-medium">In Kitchen</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-800">{stats.ready}</div>
              <div className="text-sm text-blue-700 font-medium">Ready to Go</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-800">{stats.delivered}</div>
              <div className="text-sm text-blue-700 font-medium">Delivered</div>
            </div>
          </div>
        </div>

        {/* Calendar Management */}
        <div className="lg:col-span-3 bg-white border border-blue-100 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-black mb-4">Available Order Dates</h3>
          
          {/* Add New Date */}
          <div className="flex gap-3 mb-4">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={formatDate(new Date())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black"
            />
            <button
              onClick={addDate}
              disabled={!newDate}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:bg-gray-300 transition-colors"
            >
              Add Date
            </button>
          </div>

          {/* Current Available Dates */}
          <div className="space-y-2">
            <h4 className="font-semibold text-black">Currently Available:</h4>
            {availableDates.length === 0 ? (
              <p className="text-gray-500 italic">No dates set - showing default weekend dates to customers</p>
            ) : (
              <div className="grid gap-2 md:grid-cols-2">
                {availableDates.map((date) => (
                  <div key={date} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="font-medium text-black">{formatDisplayDate(date)}</span>
                    <button
                      onClick={() => removeDate(date)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white border border-blue-100 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-black mb-4">Recent Orders</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {allOrders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🍳</div>
                <p className="text-gray-500 text-lg">No orders yet</p>
                <p className="text-gray-400 text-sm">Orders will appear here as customers place them</p>
              </div>
            ) : (
              allOrders.slice(-10).reverse().map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-black">Order #{order.id}</span>
                    <span className="font-medium text-black">{order.customerName}</span>
                    <span className="text-gray-600 text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(order.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'New' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'Ready'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'New' ? '🍳 Cooking' : order.status === 'Ready' ? '📦 Ready' : '✅ Delivered'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}