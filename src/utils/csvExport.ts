import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Order, DailySales, PopularItem } from "../types/cafe";
import { format } from "date-fns";

/**
 * Export sales by day to CSV
 */
export const exportSalesByDay = async (dailySales: DailySales[], startDate: string, endDate: string) => {
  try {
    // Create CSV content
    let csvContent = "Date,Revenue,Orders,Items Sold\n";

    dailySales.forEach((sale) => {
      csvContent += `${sale.date},${sale.revenue.toFixed(2)},${sale.orderCount},${sale.itemsSold}\n`;
    });

    // Create file path
    const filename = `sales_by_day_${format(new Date(startDate), "yyyy-MM-dd")}_to_${format(new Date(endDate), "yyyy-MM-dd")}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    // Write to file
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Share file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Export Sales by Day",
        UTI: "public.comma-separated-values-text",
      });
    }

    return { success: true, filename };
  } catch (error) {
    console.error("Export error:", error);
    return { success: false, error: String(error) };
  }
};

/**
 * Export sales by item to CSV
 */
export const exportSalesByItem = async (popularItems: PopularItem[], startDate: string, endDate: string) => {
  try {
    let csvContent = "Item Name,Quantity Sold,Revenue\n";

    popularItems.forEach((item) => {
      csvContent += `"${item.menuItemName}",${item.quantitySold},${item.revenue.toFixed(2)}\n`;
    });

    const filename = `sales_by_item_${format(new Date(startDate), "yyyy-MM-dd")}_to_${format(new Date(endDate), "yyyy-MM-dd")}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Export Sales by Item",
        UTI: "public.comma-separated-values-text",
      });
    }

    return { success: true, filename };
  } catch (error) {
    console.error("Export error:", error);
    return { success: false, error: String(error) };
  }
};

/**
 * Export sales by payment method to CSV
 */
export const exportSalesByPayment = async (orders: Order[], startDate: string, endDate: string) => {
  try {
    // Group by payment method
    const paymentTotals: Record<string, { count: number; total: number }> = {};

    orders
      .filter((order) => order.status === "completed")
      .forEach((order) => {
        const method = order.paymentMethod || "Unknown";
        if (!paymentTotals[method]) {
          paymentTotals[method] = { count: 0, total: 0 };
        }
        paymentTotals[method].count += 1;
        paymentTotals[method].total += order.total;
      });

    let csvContent = "Payment Method,Order Count,Total Revenue\n";

    Object.entries(paymentTotals).forEach(([method, data]) => {
      csvContent += `${method},${data.count},${data.total.toFixed(2)}\n`;
    });

    const filename = `sales_by_payment_${format(new Date(startDate), "yyyy-MM-dd")}_to_${format(new Date(endDate), "yyyy-MM-dd")}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Export Sales by Payment Method",
        UTI: "public.comma-separated-values-text",
      });
    }

    return { success: true, filename };
  } catch (error) {
    console.error("Export error:", error);
    return { success: false, error: String(error) };
  }
};

/**
 * Export detailed order list to CSV
 */
export const exportOrderList = async (orders: Order[], startDate: string, endDate: string) => {
  try {
    let csvContent = "Order Number,Date,Customer,Status,Payment Method,Items,Subtotal,Tax,Total\n";

    orders.forEach((order) => {
      const dateStr = format(new Date(order.createdAt), "yyyy-MM-dd HH:mm");
      const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
      const customer = order.customerName || "Walk-in";

      csvContent += `"${order.orderNumber}","${dateStr}","${customer}",${order.status},${order.paymentMethod || "N/A"},${itemCount},${order.subtotal.toFixed(2)},${order.tax.toFixed(2)},${order.total.toFixed(2)}\n`;
    });

    const filename = `orders_${format(new Date(startDate), "yyyy-MM-dd")}_to_${format(new Date(endDate), "yyyy-MM-dd")}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Export Orders",
        UTI: "public.comma-separated-values-text",
      });
    }

    return { success: true, filename };
  } catch (error) {
    console.error("Export error:", error);
    return { success: false, error: String(error) };
  }
};
