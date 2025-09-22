'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ClientView from '@/components/ClientView';
import KitchenView from '@/components/KitchenView';
import RunnerView from '@/components/RunnerView';
import AdminView from '@/components/AdminView';
import { MenuItem, Order, Tab, DateInventory } from '@/types';
import { getAvailableOrderDates } from '@/lib/dateUtils';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('client');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Bacon Egg Sandwich', count: 10 },
    { id: 2, name: 'Sausage Egg Sandwich', count: 10 },
    { id: 3, name: 'Veggie Egg Sandwich', count: 10 },
    { id: 4, name: 'Ham Egg Sandwich', count: 10 },
    { id: 5, name: 'Cheese Egg Sandwich', count: 10 },
  ]);
  const [cart, setCart] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedOrderDate, setSelectedOrderDate] = useState('');
  const [adminAvailableDates, setAdminAvailableDates] = useState<string[]>([]);
  const [dateInventory, setDateInventory] = useState<DateInventory>({});
  
  // Get available dates for ordering
  const availableOrderDates = getAvailableOrderDates(adminAvailableDates);

  // Initialize inventory for a date if not exists
  const initializeDateInventory = (date: string) => {
    if (!dateInventory[date]) {
      const newInventory = { ...dateInventory };
      newInventory[date] = {};
      menuItems.forEach(item => {
        newInventory[date][item.id] = 10; // Default stock
      });
      setDateInventory(newInventory);
    }
  };

  // Get current menu items with counts for selected date
  const getCurrentMenuItems = (): MenuItem[] => {
    if (!selectedOrderDate) return menuItems;
    
    return menuItems.map(item => ({
      ...item,
      count: dateInventory[selectedOrderDate]?.[item.id] ?? 10
    }));
  };

  const addToCart = (id: number) => {
    if (!selectedOrderDate) {
      alert('Please select a delivery date first');
      return;
    }

    // Initialize inventory for date if needed
    initializeDateInventory(selectedOrderDate);
    
    const currentCount = dateInventory[selectedOrderDate]?.[id] ?? 10;
    if (currentCount > 0) {
      const item = menuItems.find(m => m.id === id);
      if (item) {
        setCart([...cart, item.name]);
        
        // Update inventory for the specific date
        const newInventory = { ...dateInventory };
        newInventory[selectedOrderDate][id] = currentCount - 1;
        setDateInventory(newInventory);
      }
    }
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    if (!selectedOrderDate) {
      alert('Please select a delivery date');
      return;
    }
    
    const newOrder: Order = {
      id: Date.now(),
      items: [...cart],
      status: 'New',
      timestamp: Date.now(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderDate: selectedOrderDate,
    };
    
    // Add to local state first
    setOrders([...orders, newOrder]);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setSelectedOrderDate('');
    
    // Sync to Google Sheets
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      
      if (!response.ok) {
        console.error('Failed to sync order to Google Sheets');
        // Don't block the user experience, but log the error
      } else {
        console.log('Order synced to Google Sheets successfully');
      }
    } catch (error) {
      console.error('Error syncing to Google Sheets:', error);
      // Continue with local experience
    }
    
    alert('Order placed!');
  };

  const markReady = async (id: number) => {
    // Update local state first
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: 'Ready' } : order
    ));
    
    // Sync status to Google Sheets
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Ready' }),
      });
      
      if (!response.ok) {
        console.error('Failed to sync order status to Google Sheets');
      } else {
        console.log(`Order ${id} status updated to Ready in Google Sheets`);
      }
    } catch (error) {
      console.error('Error syncing status to Google Sheets:', error);
    }
  };

  const markDelivered = async (id: number) => {
    // Update local state first
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: 'Delivered' } : order
    ));
    
    // Sync status to Google Sheets
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Delivered' }),
      });
      
      if (!response.ok) {
        console.error('Failed to sync order status to Google Sheets');
      } else {
        console.log(`Order ${id} status updated to Delivered in Google Sheets`);
      }
    } catch (error) {
      console.error('Error syncing status to Google Sheets:', error);
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleDateSelect = (date: string) => {
    setSelectedOrderDate(date);
    // Initialize inventory for this date if needed
    initializeDateInventory(date);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'client':
        return (
          <ClientView
            menuItems={getCurrentMenuItems()}
            cart={cart}
            customerName={customerName}
            customerPhone={customerPhone}
            selectedOrderDate={selectedOrderDate}
            availableOrderDates={availableOrderDates}
            onAddToCart={addToCart}
            onCheckout={checkout}
            onCustomerNameChange={setCustomerName}
            onCustomerPhoneChange={setCustomerPhone}
            onDateSelect={handleDateSelect}
          />
        );
      case 'kitchen':
        return (
          <KitchenView
            tickets={orders}
            onMarkReady={markReady}
          />
        );
      case 'runner':
        return (
          <RunnerView
            deliveries={orders}
            onMarkDelivered={markDelivered}
          />
        );
      case 'admin':
        return (
          <AdminView
            isOpen={isOpen}
            onToggleOpen={toggleOpen}
            allOrders={orders}
            availableDates={adminAvailableDates}
            onUpdateAvailableDates={setAdminAvailableDates}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderActiveTab()}
    </div>
  );
}