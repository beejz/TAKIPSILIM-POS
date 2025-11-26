import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useSalesReport } from "../state/salesStore";
import { useOrderStore } from "../state/orderStore";
import { useAuthStore } from "../state/authStore";
import { format, subDays, startOfWeek, startOfMonth } from "date-fns";
import { DailySales, PopularItem } from "../types/cafe";
import { exportSalesByDay, exportSalesByItem, exportSalesByPayment, exportOrderList } from "../utils/csvExport";

type PeriodType = "today" | "week" | "month" | "custom";

export default function SalesScreen() {
  const [period, setPeriod] = useState<PeriodType>("week");
  const [isExporting, setIsExporting] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const allOrders = useOrderStore((state) => state.orders);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  const getDateRange = () => {
    const now = new Date();
    switch (period) {
      case "today":
        return { start: format(now, "yyyy-MM-dd"), end: format(now, "yyyy-MM-dd") };
      case "week":
        return { start: format(startOfWeek(now), "yyyy-MM-dd"), end: format(now, "yyyy-MM-dd") };
      case "month":
        return { start: format(startOfMonth(now), "yyyy-MM-dd"), end: format(now, "yyyy-MM-dd") };
      default:
        return { start: format(subDays(now, 30), "yyyy-MM-dd"), end: format(now, "yyyy-MM-dd") };
    }
  };

  const { start, end } = getDateRange();
  const report = useSalesReport(start, end);

  const chartData = report.dailySales.map((sale: DailySales) => ({
    x: format(new Date(sale.date), "MMM dd"),
    y: sale.revenue,
  }));

  const handleExport = async (type: "day" | "item" | "payment" | "orders") => {
    setIsExporting(true);
    try {
      const ordersInRange = allOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(start) && orderDate <= new Date(end);
      });

      let result;
      switch (type) {
        case "day":
          result = await exportSalesByDay(report.dailySales, start, end);
          break;
        case "item":
          result = await exportSalesByItem(report.popularItems, start, end);
          break;
        case "payment":
          result = await exportSalesByPayment(ordersInRange, start, end);
          break;
        case "orders":
          result = await exportOrderList(ordersInRange, start, end);
          break;
      }

      if (result.success) {
        Alert.alert("Export Successful", `File: ${result.filename}`);
      } else {
        Alert.alert("Export Failed", result.error);
      }
    } catch (error) {
      Alert.alert("Export Error", String(error));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">Sales Report</Text>
              <Text className="text-sm text-gray-500 mt-1">
                {format(new Date(start), "MMM dd")} - {format(new Date(end), "MMM dd, yyyy")}
              </Text>
            </View>
            <Pressable
              onPress={logout}
              className="ml-3 bg-red-50 px-3 py-2 rounded-xl active:bg-red-100"
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
          {/* Period Selector */}
          <View className="px-6 pt-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-row gap-2 mb-4">
              {(["today", "week", "month"] as PeriodType[]).map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-xl ${
                    period === p ? "bg-cafe-orange" : "bg-white border border-gray-200"
                  }`}
                >
                  <Text
                    className={`font-semibold ${period === p ? "text-white" : "text-gray-700"}`}
                  >
                    {p === "today" ? "Today" : p === "week" ? "This Week" : "This Month"}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Export Buttons */}
            <View className="bg-white rounded-2xl p-4 border border-gray-200">
              <Text className="text-base font-bold text-gray-900 mb-3">Export Reports (CSV)</Text>
              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => handleExport("day")}
                  disabled={isExporting}
                  className={`flex-row items-center bg-cafe-cream px-3 py-2 rounded-lg active:opacity-70 ${isExporting ? "opacity-50" : ""}`}
                >
                  <Ionicons name="download-outline" size={16} color="#5A3825" />
                  <Text className="text-cafe-brown text-sm font-semibold ml-2">By Day</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleExport("item")}
                  disabled={isExporting}
                  className={`flex-row items-center bg-cafe-cream px-3 py-2 rounded-lg active:opacity-70 ${isExporting ? "opacity-50" : ""}`}
                >
                  <Ionicons name="download-outline" size={16} color="#5A3825" />
                  <Text className="text-cafe-brown text-sm font-semibold ml-2">By Item</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleExport("payment")}
                  disabled={isExporting}
                  className={`flex-row items-center bg-cafe-cream px-3 py-2 rounded-lg active:opacity-70 ${isExporting ? "opacity-50" : ""}`}
                >
                  <Ionicons name="download-outline" size={16} color="#5A3825" />
                  <Text className="text-cafe-brown text-sm font-semibold ml-2">By Payment</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleExport("orders")}
                  disabled={isExporting}
                  className={`flex-row items-center bg-cafe-cream px-3 py-2 rounded-lg active:opacity-70 ${isExporting ? "opacity-50" : ""}`}
                >
                  <Ionicons name="download-outline" size={16} color="#5A3825" />
                  <Text className="text-cafe-brown text-sm font-semibold ml-2">Orders List</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Summary Cards */}
          <View className="px-6 pt-6">
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-500">Revenue</Text>
                  <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                    <Ionicons name="cash" size={16} color="#059669" />
                  </View>
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {formatCurrency(report.totalRevenue)}
                </Text>
              </View>

              <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-500">Orders</Text>
                  <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                    <Ionicons name="receipt" size={16} color="#2563EB" />
                  </View>
                </View>
                <Text className="text-2xl font-bold text-gray-900">{report.totalOrders}</Text>
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-500">Avg Order</Text>
                  <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center">
                    <Ionicons name="stats-chart" size={16} color="#7C3AED" />
                  </View>
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {formatCurrency(report.averageOrderValue)}
                </Text>
              </View>

              <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-500">Items Sold</Text>
                  <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center">
                    <Ionicons name="cube" size={16} color="#EA580C" />
                  </View>
                </View>
                <Text className="text-2xl font-bold text-gray-900">{report.totalItemsSold}</Text>
              </View>
            </View>
          </View>

          {/* Daily Revenue */}
          {report.dailySales.length > 0 && (
            <View className="px-6 pt-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">Daily Revenue</Text>
              <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {report.dailySales.slice(-7).map((sale: DailySales, index: number) => {
                  const maxRevenue = Math.max(...report.dailySales.map((s: DailySales) => s.revenue));
                  const barWidth = maxRevenue > 0 ? (sale.revenue / maxRevenue) * 100 : 0;

                  return (
                    <View
                      key={sale.date}
                      className={`px-4 py-3 ${
                        index !== Math.min(6, report.dailySales.length - 1) ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-semibold text-gray-900">
                          {format(new Date(sale.date), "MMM dd")}
                        </Text>
                        <Text className="text-sm font-bold text-amber-600">
                          {formatCurrency(sale.revenue)}
                        </Text>
                      </View>
                      <View className="w-full bg-gray-100 rounded-full h-2">
                        <View
                          className="bg-amber-600 h-2 rounded-full"
                          style={{ width: `${barWidth}%` }}
                        />
                      </View>
                      <Text className="text-xs text-gray-500 mt-1">
                        {sale.orderCount} orders • {sale.itemsSold} items
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Top Selling Items */}
          <View className="px-6 pt-6 pb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">Top Selling Items</Text>
            {report.popularItems.length > 0 ? (
              <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {report.popularItems.slice(0, 10).map((item: PopularItem, index: number) => (
                  <View
                    key={item.menuItemId}
                    className={`px-4 py-4 ${
                      index !== Math.min(9, report.popularItems.length - 1) ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <View className="flex-row items-center justify-between mb-1">
                      <View className="flex-row items-center flex-1">
                        <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-3">
                          <Text className="text-sm font-bold text-amber-700">{index + 1}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-gray-900">{item.menuItemName}</Text>
                          <Text className="text-sm text-gray-500">{item.quantitySold} sold</Text>
                        </View>
                      </View>
                      <Text className="text-base font-bold text-amber-600">{formatCurrency(item.revenue)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-white rounded-2xl p-6 border border-gray-200">
                <Text className="text-sm text-gray-500 text-center">No sales data available</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
