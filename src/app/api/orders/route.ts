import { NextRequest, NextResponse } from 'next/server';
import { addOrderToSheet } from '@/lib/googleSheets';
import { Order } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json();
    
    // Add order to Google Sheets
    await addOrderToSheet(order);
    
    return NextResponse.json({ success: true, message: 'Order added to Google Sheets' });
  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add order to Google Sheets' }, 
      { status: 500 }
    );
  }
}