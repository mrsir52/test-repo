import { google } from 'googleapis';
import { Order } from '@/types';

// Create Google Auth client
const createAuthClient = () => {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Sheets credentials not configured');
  }

  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

// Initialize Google Sheets API
const getSheetsAPI = () => {
  const auth = createAuthClient();
  return google.sheets({ version: 'v4', auth });
};

// Add order to Google Sheets
export const addOrderToSheet = async (order: Order): Promise<void> => {
  try {
    const sheets = getSheetsAPI();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');
    }

    // Check if Orders sheet exists, create if not
    try {
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Orders!A1:A1',
      });
    } catch (error) {
      // Sheet doesn't exist, create it with headers
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'Orders'
              }
            }
          }]
        }
      });

      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Orders!A1:H1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            'Order ID',
            'Timestamp', 
            'Customer Name',
            'Customer Phone',
            'Items',
            'Status',
            'Delivery Date',
            'Order Time'
          ]]
        }
      });
    }

    // Add the order data
    const orderData = [
      order.id.toString(),
      new Date(order.timestamp).toISOString(),
      order.customerName,
      order.customerPhone,
      order.items.join(', '),
      order.status,
      order.orderDate,
      new Date(order.timestamp).toLocaleString()
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Orders!A:H',
      valueInputOption: 'RAW',
      requestBody: {
        values: [orderData]
      }
    });

    console.log(`Order ${order.id} added to Google Sheets`);
  } catch (error) {
    console.error('Error adding order to Google Sheets:', error);
    throw error;
  }
};

// Update order status in Google Sheets
export const updateOrderStatusInSheet = async (orderId: number, newStatus: string): Promise<void> => {
  try {
    const sheets = getSheetsAPI();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');
    }

    // Get all orders to find the row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Orders!A:H',
    });

    const rows = response.data.values;
    if (!rows) return;

    // Find the order row (skip header)
    const orderRowIndex = rows.findIndex((row, index) => 
      index > 0 && row[0] === orderId.toString()
    );

    if (orderRowIndex > 0) {
      // Update status (column F)
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Orders!F${orderRowIndex + 1}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[newStatus]]
        }
      });

      console.log(`Order ${orderId} status updated to ${newStatus} in Google Sheets`);
    } else {
      console.error(`Order ${orderId} not found in Google Sheets`);
    }
  } catch (error) {
    console.error('Error updating order status in Google Sheets:', error);
    throw error;
  }
};