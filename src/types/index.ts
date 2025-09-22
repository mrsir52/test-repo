export interface MenuItem {
  id: number;
  name: string;
  count: number;
}

export interface DateInventory {
  [date: string]: { // YYYY-MM-DD format
    [itemId: number]: number; // item ID -> count
  };
}

export interface Order {
  id: number;
  items: string[];
  status: 'New' | 'Ready' | 'Delivered';
  timestamp: number;
  customerName: string;
  customerPhone: string;
  orderDate: string; // YYYY-MM-DD format for the delivery date
}

export type Tab = 'client' | 'kitchen' | 'runner' | 'admin';