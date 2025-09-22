'use client';

import { MenuItem } from '@/types';
import DateSelector from '@/components/DateSelector';

interface ClientViewProps {
  menuItems: MenuItem[];
  cart: string[];
  customerName: string;
  customerPhone: string;
  selectedOrderDate: string;
  availableOrderDates: string[];
  onAddToCart: (id: number) => void;
  onCheckout: () => void;
  onCustomerNameChange: (name: string) => void;
  onCustomerPhoneChange: (phone: string) => void;
  onDateSelect: (date: string) => void;
}

export default function ClientView({ 
  menuItems, 
  cart, 
  customerName, 
  customerPhone,
  selectedOrderDate,
  availableOrderDates,
  onAddToCart, 
  onCheckout, 
  onCustomerNameChange, 
  onCustomerPhoneChange,
  onDateSelect
}: ClientViewProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Date Selection - Moved to Top */}
      <DateSelector 
        availableDates={availableOrderDates}
        selectedDate={selectedOrderDate}
        onDateSelect={onDateSelect}
      />

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🥪</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fresh Menu</h2>
            <p className="text-gray-600">Hot breakfast sandwiches</p>
          </div>
        </div>
        
        <div className="grid gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                    <span className="text-gray-600 font-medium">Available: {item.count}</span>
                  </div>
                </div>
                <button
                  onClick={() => onAddToCart(item.id)}
                  disabled={item.count <= 0}
                  className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    item.count <= 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-900 text-white hover:bg-blue-800 shadow-lg'
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🛒</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Your Cart</h3>
            <p className="text-gray-600">{cart.length} items selected</p>
          </div>
        </div>
        
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛒</span>
            </div>
            <p className="text-gray-500 font-medium">Your cart is empty</p>
            <p className="text-gray-400 text-sm">Add some delicious sandwiches!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-900 font-medium">{item}</span>
              </div>
            ))}
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Total items:</span>
                <span className="font-bold text-xl text-blue-600">{cart.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Customer Info</h3>
            <p className="text-gray-600">We&apos;ll contact you when ready</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Full Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 text-gray-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Phone Number *
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 text-gray-900 font-medium"
            />
          </div>
        </div>
      </div>
      
      <button
        onClick={onCheckout}
        disabled={cart.length === 0}
        className={`w-full py-5 rounded-3xl font-bold text-xl transition-all duration-300 transform hover:scale-[1.02] ${
          cart.length === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-900 text-white hover:bg-blue-800 shadow-xl'
        }`}
      >
        <span className="flex items-center justify-center gap-3">
          <span className="text-2xl">🎿</span>
          Pay & Deliver to Ski Line
        </span>
      </button>
    </div>
  );
}