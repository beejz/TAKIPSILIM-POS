import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order } from '../types/cafe';

// Collection reference
const ORDERS_COLLECTION = 'orders';

/**
 * 🔥 REAL-TIME ORDER SYNC SERVICE
 *
 * This service syncs orders across all devices in real-time:
 * - Create order on Device 1 → Shows on Device 2 instantly
 * - Mark as paid on POS → Admin sees it immediately
 * - All devices stay synchronized automatically
 */

export class FirebaseOrderService {
  /**
   * Subscribe to real-time order updates
   * Returns unsubscribe function - call it to stop listening
   */
  static subscribeToOrders(callback: (orders: Order[]) => void): () => void {
    const ordersQuery = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          orders.push({
            id: doc.id,
            orderNumber: data.orderNumber,
            items: data.items,
            subtotal: data.subtotal,
            tax: data.tax,
            total: data.total,
            paymentMethod: data.paymentMethod,
            customerName: data.customerName,
            notes: data.notes,
            status: data.status,
            createdBy: data.createdBy,
            createdByName: data.createdByName,
            isPaid: data.isPaid,
            isServed: data.isServed,
            amountReceived: data.amountReceived,
            change: data.change,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            completedAt: data.completedAt?.toDate?.()?.toISOString() || data.completedAt,
            servedAt: data.servedAt?.toDate?.()?.toISOString() || data.servedAt,
          });
        });
        callback(orders);
      },
      (error) => {
        console.error('Error subscribing to orders:', error);
      }
    );

    return unsubscribe;
  }

  /**
   * Subscribe to today's orders only
   */
  static subscribeToTodayOrders(callback: (orders: Order[]) => void): () => void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersQuery = query(
      collection(db, ORDERS_COLLECTION),
      where('createdAt', '>=', Timestamp.fromDate(today)),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          orderNumber: data.orderNumber,
          items: data.items,
          subtotal: data.subtotal,
          tax: data.tax,
          total: data.total,
          paymentMethod: data.paymentMethod,
          customerName: data.customerName,
          notes: data.notes,
          status: data.status,
          createdBy: data.createdBy,
          createdByName: data.createdByName,
          isPaid: data.isPaid,
          isServed: data.isServed,
          amountReceived: data.amountReceived,
          change: data.change,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          completedAt: data.completedAt?.toDate?.()?.toISOString() || data.completedAt,
          servedAt: data.servedAt?.toDate?.()?.toISOString() || data.servedAt,
        });
      });
      callback(orders);
    });

    return unsubscribe;
  }

  /**
   * Create a new order (syncs to all devices)
   */
  static async createOrder(order: Omit<Order, 'id'>): Promise<string> {
    try {
      const orderData = {
        ...order,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        completedAt: order.completedAt ? Timestamp.fromDate(new Date(order.completedAt)) : null,
        servedAt: order.servedAt ? Timestamp.fromDate(new Date(order.servedAt)) : null,
      };

      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Update an order (syncs to all devices)
   */
  static async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      // Convert date strings to Timestamps
      if (updates.completedAt) {
        updateData.completedAt = Timestamp.fromDate(new Date(updates.completedAt));
      }
      if (updates.servedAt) {
        updateData.servedAt = Timestamp.fromDate(new Date(updates.servedAt));
      }

      await updateDoc(orderRef, updateData);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  /**
   * Delete an order (syncs to all devices)
   */
  static async deleteOrder(orderId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  /**
   * Get all orders once (no real-time)
   */
  static async getAllOrders(): Promise<Order[]> {
    try {
      const ordersQuery = query(
        collection(db, ORDERS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(ordersQuery);

      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          orderNumber: data.orderNumber,
          items: data.items,
          subtotal: data.subtotal,
          tax: data.tax,
          total: data.total,
          paymentMethod: data.paymentMethod,
          customerName: data.customerName,
          notes: data.notes,
          status: data.status,
          createdBy: data.createdBy,
          createdByName: data.createdByName,
          isPaid: data.isPaid,
          isServed: data.isServed,
          amountReceived: data.amountReceived,
          change: data.change,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          completedAt: data.completedAt?.toDate?.()?.toISOString() || data.completedAt,
          servedAt: data.servedAt?.toDate?.()?.toISOString() || data.servedAt,
        });
      });

      return orders;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }
}
