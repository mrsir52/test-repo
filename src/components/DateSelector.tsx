'use client';

import { formatDisplayDate } from '@/lib/dateUtils';

interface DateSelectorProps {
  availableDates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function DateSelector({ availableDates, selectedDate, onDateSelect }: DateSelectorProps) {
  if (availableDates.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl mb-6">
        <h3 className="text-xl font-bold mb-2 text-red-800">No Dates Available</h3>
        <p className="text-red-600">
          Orders are currently closed. Check back Tuesday morning for weekend availability!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center">
          <span className="text-2xl">📅</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Next Available</h3>
          <p className="text-gray-600">Delivery Dates</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {availableDates.map((date) => (
          <button
            key={date}
            onClick={() => onDateSelect(date)}
            className={`p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
              selectedDate === date
                ? 'bg-blue-900 text-white shadow-xl'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                selectedDate === date ? 'bg-white' : 'bg-blue-900'
              }`}></div>
              <div className={`font-bold text-xl ${
                selectedDate === date ? 'text-white' : 'text-gray-900'
              }`}>
                {formatDisplayDate(date)}
              </div>
            </div>
            <div className={`text-sm font-medium ${
              selectedDate === date ? 'text-blue-100' : 'text-gray-600'
            }`}>
              Available for delivery
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
        <p className="text-gray-700 text-center font-medium flex items-center justify-center gap-2">
          <span className="text-xl">🎿</span>
          Orders will be delivered fresh to the ski line on your selected date
        </p>
      </div>
    </div>
  );
}