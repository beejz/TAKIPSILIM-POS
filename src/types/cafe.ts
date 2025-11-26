// User Types
export type UserRole = "admin" | "staff";

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  email: string; // Google account email
  photoUrl?: string; // Google profile photo
  createdAt: string;
}

// Menu Types
export type MenuCategory = string; // Dynamic categories - can be any string
export type MenuStatus = "available" | "out_of_stock";

export interface MenuItemSize {
  name: string;
  price: number;
}

export interface MenuItemFlavor {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  stockQuantity: number;
  status: MenuStatus;
  description?: string;
  ingredients: { ingredientId: string; quantityUsed: number }[];
  imageUrl?: string;
  sizes?: MenuItemSize[]; // Optional size variants (e.g., 16oz, 22oz)
  flavors?: MenuItemFlavor[]; // Optional flavor variants (e.g., Cheese, Honey Butter)
  createdAt: string;
  updatedAt: string;
}

// Order Types
export type OrderStatus = "pending" | "served" | "completed" | "cancelled";
export type PaymentMethod = "Cash" | "Card" | "GCash" | "Maya";

export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  subtotal: number;
  selectedSize?: string; // Optional size name (e.g., "16oz", "22oz")
  selectedFlavor?: string; // Optional flavor name (e.g., "Cheese", "Honey Butter")
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  isServed: boolean;
  isPaid: boolean;
  paymentMethod?: PaymentMethod;
  amountReceived?: number;
  change?: number;
  customerName?: string;
  notes?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  servedAt?: string;
  completedAt?: string;
}

// Inventory Types
export type IngredientCategory = string; // Dynamic categories - can be any string

export interface InventoryItem {
  id: string;
  name: string;
  category: IngredientCategory;
  unit: string; // kg, liters, pieces, etc.
  quantity: number;
  minQuantity: number; // For low stock alerts
  costPerUnit: number;
  supplier?: string;
  lastRestocked?: string;
  createdAt: string;
  updatedAt: string;
}

// Purchase Types
export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierName: string;
  items: {
    inventoryItemId: string;
    itemName: string;
    quantity: number;
    costPerUnit: number;
    total: number;
  }[];
  totalCost: number;
  purchaseDate: string;
  notes?: string;
  createdBy: string;
  createdByName: string;
}

// Sales Data Types
export interface DailySales {
  date: string;
  revenue: number;
  orderCount: number;
  itemsSold: number;
}

export interface PopularItem {
  menuItemId: string;
  menuItemName: string;
  quantitySold: number;
  revenue: number;
}

export interface SalesReport {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalOrders: number;
  totalItemsSold: number;
  dailySales: DailySales[];
  popularItems: PopularItem[];
  averageOrderValue: number;
}

// Dashboard Summary
export interface DashboardSummary {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayOrders: number;
  lowStockItems: InventoryItem[];
  topSellingItems: PopularItem[];
  recentOrders: Order[];
}
