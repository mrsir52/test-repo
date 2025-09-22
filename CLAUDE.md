# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack)
- **Build for production**: `npm run build` (uses Turbopack)
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

The development server runs on http://localhost:3000 and supports hot reloading.

## Architecture Overview

This is a **breakfast delivery app** built as a single-page application with Next.js 15, TypeScript, and Tailwind CSS. The app serves multiple user roles through a tab-based interface.

### Core Architecture

**State Management**: All state is managed at the top level in `src/app/page.tsx` using React hooks:
- `menuItems`: Available sandwich inventory with counts
- `cart`: Current customer's cart items
- `orders`: All orders across the system with status tracking
- `activeTab`: Controls which view is displayed

**Data Flow**: 
1. Customer adds items to cart → decrements menu inventory
2. Checkout creates order with "New" status → clears cart
3. Kitchen marks orders "Ready" → moves to runner view
4. Runner marks orders "Delivered" → final status

### Component Structure

**Main Page** (`src/app/page.tsx`): 
- Root component with all state management
- Renders Header, Navigation, and active tab component
- Contains all business logic functions (addToCart, checkout, markReady, markDelivered)

**Tab Views** (`src/components/`):
- `ClientView`: Menu display, cart management, checkout
- `KitchenView`: Shows "New" orders, mark as ready functionality  
- `RunnerView`: Shows "Ready" orders, delivery completion
- `AdminView`: Restaurant controls, statistics, order history

**Shared Components**:
- `Header`: App title and branding
- `Navigation`: Tab switching interface

### Data Types

Core types defined in `src/types/index.ts`:

```typescript
interface MenuItem {
  id: number;
  name: string;
  count: number; // Inventory count
}

interface Order {
  id: number; // Timestamp-based
  items: string[]; // Array of sandwich names
  status: 'New' | 'Ready' | 'Delivered';
  timestamp: number;
}

type Tab = 'client' | 'kitchen' | 'runner' | 'admin';
```

### Design System

**Color Palette** (green-focused):
- Primary: `bg-green-500/600` (buttons, navigation)
- Accents: `bg-green-50/100` (backgrounds, highlights)
- Status colors: Yellow (new), Blue (ready), Green (delivered)
- Text: Black (`text-black`) for maximum readability on white backgrounds

**UI Patterns**:
- White cards with subtle green borders (`border-green-100`)
- Rounded corners (`rounded-xl`) and subtle shadows
- Hover effects with scale transforms and shadow changes
- Status badges with color-coded backgrounds

### Key Business Logic

**Inventory Management**: Adding items to cart decrements `menuItems[].count`

**Order Lifecycle**: New → Ready → Delivered (status can only move forward)

**Role-Based Views**: 
- Kitchen sees only "New" orders
- Runner sees only "Ready" orders  
- Admin sees all orders with statistics

## Product Context

This breakfast delivery app is built for a ski resort client (Lenny) with specific business requirements:

**Target Launch**: Thanksgiving Weekend (test) → Christmas Week (full launch)
**Key Integration**: Google Sheets for kitchen workflow (orders sync in real-time)
**Notification System**: SMS via Twilio for customer reminders and confirmations
**Business Model**: Pre-orders for weekend ski days, opens Tuesday mornings

## Future Development Notes

This is an MVP focused on core ordering functionality. The app is designed to be extended with:
- Google Sheets integration for kitchen workflow
- SMS notifications via Twilio/GHL API
- Customer accounts and order history
- Payment processing
- Calendar-based order scheduling (Tuesday opens for weekend)
- Tips functionality for runners
- Rewards/loyalty program (tiered: free sandwich → beverage → cookie)
- Promo codes system
- Add-ons (drinks, muffins, cookies)
- Customer contact integration for runners
- Real-time menu updates (out-of-stock management)