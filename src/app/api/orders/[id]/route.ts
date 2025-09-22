import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatusInSheet } from '@/lib/googleSheets';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json();
    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id);
    
    // Update order status in Google Sheets
    await updateOrderStatusInSheet(orderId, status);
    
    return NextResponse.json({ success: true, message: 'Order status updated in Google Sheets' });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status in Google Sheets' }, 
      { status: 500 }
    );
  }
}