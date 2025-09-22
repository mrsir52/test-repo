// Utility functions for handling order dates

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

export const formatDisplayDate = (dateString: string): string => {
  const date = parseDate(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Get the next available weekend dates
export const getNextWeekendDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Find the next Saturday and Sunday
  let daysUntilSaturday = 6 - currentDay;
  if (daysUntilSaturday <= 0) {
    daysUntilSaturday += 7; // Next week's Saturday
  }
  
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilSaturday);
  
  const nextSunday = new Date(nextSaturday);
  nextSunday.setDate(nextSaturday.getDate() + 1);
  
  dates.push(formatDate(nextSaturday));
  dates.push(formatDate(nextSunday));
  
  return dates;
};

// Check if today is Tuesday (when orders open)
export const isOrderingDay = (): boolean => {
  const today = new Date();
  return today.getDay() === 2; // Tuesday = 2
};

// Get available ordering dates (can be customized by admin)
export const getAvailableOrderDates = (adminDates?: string[]): string[] => {
  if (adminDates && adminDates.length > 0) {
    // Filter out past dates
    const today = formatDate(new Date());
    return adminDates.filter(date => date >= today);
  }
  
  // Default: next weekend
  return getNextWeekendDates();
};