import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    // Check if credentials are configured
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json(
        { 
          connected: false, 
          error: 'Google Sheets credentials not configured',
          details: {
            hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            hasKey: !!process.env.GOOGLE_PRIVATE_KEY
          }
        }, 
        { status: 500 }
      );
    }

    if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      return NextResponse.json(
        { 
          connected: false, 
          error: 'GOOGLE_SHEETS_SPREADSHEET_ID not configured' 
        }, 
        { status: 500 }
      );
    }

    // Create auth client
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Initialize Sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    // Try to read spreadsheet metadata
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    });

    // Try to read from Orders sheet if it exists
    let ordersData = null;
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
        range: 'Orders!A1:H1',
      });
      ordersData = response.data.values;
    } catch (error) {
      // Orders sheet might not exist yet
      ordersData = 'Orders sheet not found (will be created on first order)';
    }

    return NextResponse.json({
      connected: true,
      spreadsheet: {
        title: spreadsheet.data.properties?.title,
        spreadsheetId: spreadsheet.data.spreadsheetId,
        sheets: spreadsheet.data.sheets?.map(sheet => sheet.properties?.title),
      },
      ordersSheet: ordersData,
      message: 'Google Sheets connection successful!'
    });

  } catch (error) {
    console.error('Google Sheets connection test failed:', error);
    return NextResponse.json(
      { 
        connected: false, 
        error: 'Failed to connect to Google Sheets',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}