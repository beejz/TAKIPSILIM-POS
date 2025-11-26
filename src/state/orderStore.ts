import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Order, OrderStatus, OrderItem, PaymentMethod } from "../types/cafe";
import { useMenuStore } from "./menuStore";
import { useInventoryStore } from "./inventoryStore";

interface OrderState {
  orders: Order[];
  createOrder: (
    items: OrderItem[],
    customerName: string | undefined,
    notes: string | undefined,
    paymentMethod: PaymentMethod,
    createdBy: string,
    createdByName: string,
    amountReceived?: number
  ) => Order | null;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  markAsServed: (id: string) => void;
  markAsPaid: (id: string, amountReceived?: number) => void;
  completeOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByDateRange: (startDate: string, endDate: string) => Order[];
  getTodayOrders: () => Order[];
  getOrdersByUser: (userId: string) => Order[];
  initializeSampleData: () => void;
  fixInconsistentOrders: () => void;
}

// TAX_RATE removed - no tax calculation needed

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (items, customerName, notes, paymentMethod, createdBy, createdByName, amountReceived) => {
        // Validate stock availability
        const menuStore = useMenuStore.getState();
        const inventoryStore = useInventoryStore.getState();

        for (const item of items) {
          const menuItem = menuStore.getItemById(item.menuItemId);
          if (!menuItem) {
            return null;
          }
          if (menuItem.stockQuantity < item.quantity) {
            return null;
          }
        }

        // Calculate totals (no tax)
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = 0; // No tax
        const total = subtotal; // Total equals subtotal (no tax added)

        // Calculate change if amount received is provided
        const change = amountReceived ? amountReceived - total : undefined;

        // Create order
        const orderNumber = `ORD-${Date.now()}`;
        const newOrder: Order = {
          id: Date.now().toString(),
          orderNumber,
          items,
          subtotal,
          tax,
          total,
          status: "pending",
          isServed: false,
          isPaid: false,
          paymentMethod,
          amountReceived,
          change: change && change > 0 ? change : undefined,
          customerName,
          notes,
          createdBy,
          createdByName,
          createdAt: new Date().toISOString(),
        };

        // DON'T reduce stock yet - only when marked as paid
        set((state) => ({ orders: [...state.orders, newOrder] }));
        return newOrder;
      },

      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...updates } : order
          ),
        }));
      },

      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        }));
      },

      markAsServed: (id) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== id) return order;

            // Don't change status if order is already completed (paid)
            if (order.isPaid || order.status === "completed") {
              return {
                ...order,
                isServed: true,
                servedAt: new Date().toISOString(),
              };
            }

            // Otherwise set status to served
            return {
              ...order,
              isServed: true,
              status: "served" as OrderStatus,
              servedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      markAsPaid: (id, amountReceived) => {
        console.log("[OrderStore] markAsPaid called for order:", id, "Amount:", amountReceived);
        const state = get();
        const order = state.orders.find((o) => o.id === id);
        if (!order) {
          console.log("[OrderStore] Order not found:", id);
          return;
        }

        console.log("[OrderStore] Order before marking as paid:", {
          id: order.id,
          isPaid: order.isPaid,
          status: order.status,
          total: order.total
        });

        // Calculate change if amount received is provided
        const change = amountReceived ? amountReceived - order.total : 0;

        // Deduct stock when marking as paid
        const menuStore = useMenuStore.getState();
        const inventoryStore = useInventoryStore.getState();

        order.items.forEach((item) => {
          const menuItem = menuStore.getItemById(item.menuItemId);
          if (menuItem) {
            menuStore.updateStock(
              item.menuItemId,
              menuItem.stockQuantity - item.quantity
            );

            // Reduce inventory based on ingredients
            menuItem.ingredients.forEach((ingredient) => {
              inventoryStore.reduceStock(
                ingredient.ingredientId,
                ingredient.quantityUsed * item.quantity
              );
            });
          }
        });

        const completedAt = new Date().toISOString();
        console.log("[OrderStore] Setting completedAt to:", completedAt);

        // Update order status - Create new array to trigger reactivity
        const updatedOrders = state.orders.map((order) =>
          order.id === id
            ? {
                ...order,
                isPaid: true,
                amountReceived,
                change: change > 0 ? change : undefined,
                status: "completed" as OrderStatus,
                completedAt,
              }
            : order
        );

        console.log("[OrderStore] Updated orders array length:", updatedOrders.length);
        const updatedOrder = updatedOrders.find(o => o.id === id);
        console.log("[OrderStore] Updated order:", {
          id: updatedOrder?.id,
          isPaid: updatedOrder?.isPaid,
          status: updatedOrder?.status,
          completedAt: updatedOrder?.completedAt,
          total: updatedOrder?.total
        });

        set({ orders: updatedOrders });
        console.log("[OrderStore] Orders state updated");
      },

      completeOrder: (id) => {
        // This is now handled by markAsPaid
        get().markAsPaid(id);
      },

      cancelOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? { ...order, status: "cancelled" as OrderStatus }
              : order
          ),
        }));
      },

      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },

      getOrdersByDateRange: (startDate, endDate) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return get().orders.filter((order) => {
          const orderDate = new Date(order.createdAt).getTime();
          return orderDate >= start && orderDate <= end;
        });
      },

      getTodayOrders: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return get().orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= today && orderDate < tomorrow;
        });
      },

      getOrdersByUser: (userId) => {
        return get().orders.filter((order) => order.createdBy === userId);
      },

      initializeSampleData: () => {
        // Sample orders will be created through the UI
        set({ orders: [] });
      },

      fixInconsistentOrders: () => {
        // Fix orders where isPaid=true but status is not "completed"
        const state = get();
        const fixedOrders = state.orders.map((order) => {
          if (order.isPaid && order.status !== "completed") {
            console.log("[OrderStore] Fixing inconsistent order:", order.id, "status:", order.status, "isPaid:", order.isPaid);
            return {
              ...order,
              status: "completed" as OrderStatus,
              completedAt: order.completedAt || order.createdAt, // Use existing completedAt or fallback to createdAt
            };
          }
          return order;
        });

        const fixedCount = fixedOrders.filter((o, i) => o !== state.orders[i]).length;
        if (fixedCount > 0) {
          console.log("[OrderStore] Fixed", fixedCount, "inconsistent orders");
          set({ orders: fixedOrders });
        }
      },
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
