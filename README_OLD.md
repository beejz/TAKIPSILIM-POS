# Cafe Management System

A complete, full-featured Cafe Management System built with React Native and Expo. This app provides comprehensive tools for managing all aspects of a cafe business including orders, menu items, inventory, purchases, and sales reporting.

## Features

### 🔐 Authentication
- User login with role-based access (Admin & Staff)
- Secure authentication with persistent sessions
- Demo credentials included for testing

### 📊 Dashboard
- Real-time revenue tracking (Today, This Week, This Month)
- Order statistics and counts
- Top-selling items overview
- Low stock alerts
- Recent orders list

### 🛒 Order Management
- Create new orders with menu item selection
- Real-time stock availability checking
- Customer information capture
- Order notes and special instructions
- Automatic tax calculation (8%)
- View order history with filters
- Order status management (Pending, Completed, Cancelled)
- **Automatic stock reduction** when orders are placed

### 🍔 Menu Management
- Add, edit, and delete menu items
- Organize items by categories (Coffee, Snack, Dessert, Beverage, Food, Other)
- Set prices and stock quantities
- Track item availability status
- Item descriptions and details

### 📦 Inventory / Stock Management
- Track all inventory items with quantities
- Set minimum stock levels for alerts
- Low stock notifications
- Supplier information tracking
- Cost per unit tracking
- Automatic inventory updates from orders and purchases
- Units of measurement (kg, liters, pieces, etc.)

### 🛍️ Purchase History
- Record supplier purchases
- Multi-item purchase tracking
- Automatic inventory restocking
- Purchase date and notes
- Cost tracking per purchase
- Supplier-wise purchase filtering

### 📈 Sales Reporting
- Period-based reports (Today, This Week, This Month)
- Total revenue and order statistics
- Average order value calculations
- Daily revenue breakdown with visual bars
- Top 10 best-selling items with quantity and revenue
- Items sold tracking

## Technical Stack

- **Framework**: Expo SDK 53 with React Native 0.76.7
- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: React Navigation (Drawer + Native Stack)
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Date Handling**: date-fns
- **Icons**: Expo Vector Icons (Ionicons)
- **Type Safety**: TypeScript

## Project Structure

```
src/
├── screens/          # All application screens
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── OrdersScreen.tsx
│   ├── CreateOrderScreen.tsx
│   ├── MenuScreen.tsx
│   ├── InventoryScreen.tsx
│   ├── PurchasesScreen.tsx
│   └── SalesScreen.tsx
├── navigation/       # Navigation configuration
│   └── MainNavigator.tsx
├── state/           # Zustand stores
│   ├── authStore.ts
│   ├── menuStore.ts
│   ├── orderStore.ts
│   ├── inventoryStore.ts
│   ├── purchaseStore.ts
│   └── salesStore.ts
├── types/           # TypeScript types
│   └── cafe.ts
└── utils/           # Utility functions
    └── cn.ts
```

## How It Works

### Order Flow with Automatic Stock Management

1. **Creating an Order**:
   - Staff/Admin selects menu items and quantities
   - System checks real-time stock availability
   - Customer information and notes can be added
   - Subtotal, tax (8%), and total are automatically calculated

2. **Automatic Stock Reduction**:
   - When an order is created, the system automatically:
     - Reduces menu item stock quantities
     - Updates inventory based on ingredients used
     - Updates item status to "out_of_stock" if quantity reaches 0
   - This ensures real-time stock accuracy across the system

3. **Stock Management**:
   - Low stock alerts appear on the dashboard
   - Inventory can be restocked through Purchase History
   - Manual adjustments available in Inventory Management

### User Roles

- **Admin**: Full access to all features
- **Staff**: Full access to all features (role distinction can be customized)

### Data Persistence

All data is stored locally using Zustand with AsyncStorage persistence:
- User authentication state
- Menu items and categories
- Orders and order history
- Inventory levels
- Purchase records

The data persists between app sessions and survives app restarts.

## Demo Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Staff Account:**
- Username: `staff`
- Password: `staff123`

## Sample Data

The app initializes with sample data on first login:
- 6 menu items across different categories
- 5 inventory items with suppliers
- Linked ingredients for automatic stock management

## Key Features Implementation

### Automatic Stock Updates
The system automatically manages inventory through a sophisticated ingredient-tracking system:
- Each menu item has associated ingredients from inventory
- When an order is placed, both menu stock AND ingredient inventory are reduced
- Ensures accurate tracking at both the product and raw material level

### Low Stock Alerts
- Dashboard displays items below minimum quantity threshold
- Color-coded indicators (Green = OK, Red = Low)
- Helps prevent stockouts

### Sales Analytics
- Real-time calculation of revenue and order metrics
- Historical data tracking by date range
- Popular items ranked by quantity sold and revenue
- Visual representation of daily sales

## Customization

### Tax Rate
The tax rate is currently set to 8% and can be modified in `/src/state/orderStore.ts`:
```typescript
const TAX_RATE = 0.08; // Change to your desired rate
```

### Menu Categories
Categories can be customized in `/src/types/cafe.ts`:
```typescript
export type MenuCategory = "Coffee" | "Snack" | "Dessert" | "Beverage" | "Food" | "Other";
```

## Future Enhancements

Potential features for expansion:
- Multi-currency support
- Receipt printing
- Export sales reports (CSV/PDF)
- Employee time tracking
- Table management
- Customer loyalty program
- Online ordering integration
- Multi-location support

## Support

For issues or questions, please check the app's documentation or contact support.

---

**Built with React Native & Expo** | Optimized for iOS
