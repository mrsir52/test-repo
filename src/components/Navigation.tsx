'use client';

import { Tab } from '@/types';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: 'client', label: 'Client' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'runner', label: 'Runner' },
    { id: 'admin', label: 'Admin' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-2 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-3 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}