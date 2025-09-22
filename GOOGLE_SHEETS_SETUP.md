# Google Sheets Integration Setup

This guide will help you set up Google Sheets integration for the breakfast ordering app.

## Prerequisites

1. Google Cloud Platform account
2. Google Sheets API enabled
3. Service account credentials

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `breakfast-app-sheets`
   - Description: `Service account for breakfast ordering app`
4. Click "Create and Continue"
5. Skip role assignment for now (click "Continue")
6. Click "Done"

## Step 3: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Select "JSON" format
6. Click "Create" - this downloads the key file

## Step 4: Extract Credentials

From the downloaded JSON file, you'll need:
- `client_email` - this is your service account email
- `private_key` - this is your private key (keep the \\n newlines)

## Step 5: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Breakfast Orders" or similar
4. Copy the Spreadsheet ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the SPREADSHEET_ID part

## Step 6: Share Spreadsheet with Service Account

1. In your Google Sheet, click "Share"
2. Add the service account email (from step 4) as an editor
3. Click "Send"

## Step 7: Configure Environment Variables

Update your `.env.local` file:

```env
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- Keep the quotes around the private key
- Preserve the \\n characters in the private key
- Never commit the `.env.local` file to version control

## Step 8: Test the Integration

1. Restart your Next.js development server
2. Place a test order in the app
3. Check your Google Sheet - you should see an "Orders" tab with the order data

## Spreadsheet Structure

The app will automatically create an "Orders" sheet with these columns:
- Order ID
- Timestamp (ISO format)
- Customer Name
- Customer Phone
- Items (comma-separated)
- Status (New/Ready/Delivered)
- Order Time (human-readable)

## Kitchen Workflow

Kitchen staff can:
1. View new orders in real-time
2. Mark orders as "Ready" by changing the Status column
3. Print orders directly from Google Sheets
4. Sort/filter orders as needed

The app keeps local state in sync with Google Sheets, so changes made in either location will be reflected (with periodic sync).

## Troubleshooting

**"Credentials not configured" error:**
- Check that all environment variables are set correctly
- Ensure the private key includes proper newlines

**"Permission denied" error:**
- Make sure the service account has editor access to the spreadsheet
- Verify the Spreadsheet ID is correct

**"API not enabled" error:**
- Enable the Google Sheets API in Google Cloud Console
- Wait a few minutes for the API to be fully activated