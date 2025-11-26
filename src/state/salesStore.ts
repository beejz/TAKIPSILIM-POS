import { useOrderStore } from "./orderStore";
import { useMenuStore } from "./menuStore";
import { useInventoryStore } from "./inventoryStore";
import { DashboardSummary, SalesReport, PopularItem, DailySales } from "../types/cafe";
import { startOfDay, startOfWeek, startOfMonth, format, eachDayOfInterval } from "date-fns";
import { useMemo } from "react";

// Takipsilim Café Sales Data Hooks - Real-time dashboard metrics with automatic updates
// Dashboard Summary Hook - provides real-time dashboard metrics
export const useDashboardSummary = (): DashboardSummary => {
  // Use individual selectors to ensure proper reactivity
  const orders = useOrderStore((s) => s.orders);
  const inventoryItems = useInventoryStore((s) => s.items);

  // Memoize the entire calculation to ensure proper reactivity
  return useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    console.log("[Dashboard] Total orders:", orders.length);
    console.log("[Dashboard] Today start:", todayStart.toISOString());

    // Debug: Log ALL orders to see full picture
    console.log("[Dashboard] ALL orders summary:",
      orders.map(o => ({
        id: o.id,
        isPaid: o.isPaid,
        status: o.status,
        completedAt: o.completedAt ? o.completedAt.substring(0, 19) : null,
        total: o.total
      }))
    );

    // Filter completed AND paid orders only
    const completedOrders = orders.filter((order) => order.isPaid && order.status === "completed");
    console.log("[Dashboard] Completed & paid orders:", completedOrders.length);

    // Debug: Show what orders are being filtered out
    const paidButNotCompleted = orders.filter((order) => order.isPaid && order.status !== "completed");
    if (paidButNotCompleted.length > 0) {
      console.log("[Dashboard] WARNING: Found paid orders with wrong status:",
        paidButNotCompleted.map(o => ({ id: o.id, status: o.status, isPaid: o.isPaid }))
      );
    }

    if (completedOrders.length > 0) {
      console.log("[Dashboard] Sample completed order:", {
        id: completedOrders[0].id,
        isPaid: completedOrders[0].isPaid,
        status: completedOrders[0].status,
        completedAt: completedOrders[0].completedAt,
        createdAt: completedOrders[0].createdAt,
        total: completedOrders[0].total
      });
    }

    // Today's revenue - use completedAt (when paid) instead of createdAt
    const todayOrdersFiltered = completedOrders.filter((order) => {
      const hasCompletedAt = !!order.completedAt;
      const completedDate = order.completedAt ? new Date(order.completedAt) : null;
      const isToday = completedDate ? completedDate >= todayStart : false;

      if (hasCompletedAt) {
        console.log("[Dashboard] Order check:", {
          orderId: order.id,
          completedAt: order.completedAt,
          completedDate: completedDate?.toISOString(),
          todayStart: todayStart.toISOString(),
          isToday,
          total: order.total
        });
      }

      return hasCompletedAt && isToday;
    });

    const todayRevenue = todayOrdersFiltered.reduce((sum, order) => sum + order.total, 0);
    console.log("[Dashboard] Today's orders count:", todayOrdersFiltered.length);
    console.log("[Dashboard] Today's revenue:", todayRevenue);

    // Week revenue - use completedAt (when paid) instead of createdAt
    const weekRevenue = completedOrders
      .filter((order) => order.completedAt && new Date(order.completedAt) >= weekStart)
      .reduce((sum, order) => sum + order.total, 0);

    // Month revenue - use completedAt (when paid) instead of createdAt
    const monthRevenue = completedOrders
      .filter((order) => order.completedAt && new Date(order.completedAt) >= monthStart)
      .reduce((sum, order) => sum + order.total, 0);

    // Today's orders count - use completedAt (when paid) instead of createdAt
    const todayOrders = completedOrders.filter(
      (order) => order.completedAt && new Date(order.completedAt) >= todayStart
    ).length;

    // Top selling items (last 30 days) - use completedAt (when paid) instead of createdAt
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>();

    completedOrders
      .filter((order) => order.completedAt && new Date(order.completedAt) >= last30Days)
      .forEach((order) => {
        order.items.forEach((item) => {
          const existing = itemSales.get(item.menuItemId);
          if (existing) {
            existing.quantity += item.quantity;
            existing.revenue += item.subtotal;
          } else {
            itemSales.set(item.menuItemId, {
              name: item.menuItemName,
              quantity: item.quantity,
              revenue: item.subtotal,
            });
          }
        });
      });

    const topSellingItems: PopularItem[] = Array.from(itemSales.entries())
      .map(([id, data]) => ({
        menuItemId: id,
        menuItemName: data.name,
        quantitySold: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    // Recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Low stock items
    const lowStockItems = inventoryItems.filter((item) => item.quantity <= item.minQuantity);

    return {
      todayRevenue,
      weekRevenue,
      monthRevenue,
      todayOrders,
      lowStockItems,
      topSellingItems,
      recentOrders,
    };
  }, [orders, inventoryItems]); // Re-calculate when orders or inventory changes
};

export const useSalesReport = (startDate: string, endDate: string): SalesReport => {
  const orders = useOrderStore((state) => state.orders);

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Filter by completedAt (when paid) instead of createdAt
  const completedOrders = orders.filter(
    (order) =>
      order.isPaid &&
      order.status === "completed" &&
      order.completedAt &&
      new Date(order.completedAt) >= start &&
      new Date(order.completedAt) <= end
  );

  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = completedOrders.length;
  const totalItemsSold = completedOrders.reduce(
    (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
    0
  );

  // Daily sales
  const dailySalesMap = new Map<string, DailySales>();
  const days = eachDayOfInterval({ start, end });

  days.forEach((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    dailySalesMap.set(dateStr, {
      date: dateStr,
      revenue: 0,
      orderCount: 0,
      itemsSold: 0,
    });
  });

  // Use completedAt (when paid) for daily sales grouping
  completedOrders.forEach((order) => {
    const dateStr = format(new Date(order.completedAt!), "yyyy-MM-dd");
    const dailySale = dailySalesMap.get(dateStr);
    if (dailySale) {
      dailySale.revenue += order.total;
      dailySale.orderCount += 1;
      dailySale.itemsSold += order.items.reduce((s, item) => s + item.quantity, 0);
    }
  });

  const dailySales = Array.from(dailySalesMap.values());

  // Popular items
  const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>();

  completedOrders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = itemSales.get(item.menuItemId);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.subtotal;
      } else {
        itemSales.set(item.menuItemId, {
          name: item.menuItemName,
          quantity: item.quantity,
          revenue: item.subtotal,
        });
      }
    });
  });

  const popularItems: PopularItem[] = Array.from(itemSales.entries())
    .map(([id, data]) => ({
      menuItemId: id,
      menuItemName: data.name,
      quantitySold: data.quantity,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.quantitySold - a.quantitySold);

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    startDate,
    endDate,
    totalRevenue,
    totalOrders,
    totalItemsSold,
    dailySales,
    popularItems,
    averageOrderValue,
  };
};
