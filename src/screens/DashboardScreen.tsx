import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDashboardSummary } from "../state/salesStore";
import { useAuthStore } from "../state/authStore";
import { useFocusEffect } from "@react-navigation/native";
import { useOrderStore } from "../state/orderStore";

// Dashboard with real-time transaction updates
export default function DashboardScreen() {
  const summary = useDashboardSummary();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const [refreshing, setRefreshing] = useState(false);
  const [, forceUpdate] = useState(0);

  // Subscribe directly to orders store for real-time updates
  const ordersLength = useOrderStore((s) => s.orders.length);
  const paidOrdersCount = useOrderStore((s) =>
    s.orders.filter(o => o.isPaid && o.status === "completed").length
  );
  const fixInconsistentOrders = useOrderStore((s) => s.fixInconsistentOrders);

  // Fix any inconsistent orders when dashboard mounts
  useEffect(() => {
    fixInconsistentOrders();
  }, []);

  // Force re-render when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("[Dashboard] Screen focused, forcing update");
      fixInconsistentOrders(); // Also fix on focus
      forceUpdate(n => n + 1);
    }, [fixInconsistentOrders])
  );

  // Auto-refresh every 2 seconds while dashboard is visible
  useEffect(() => {
    console.log("[Dashboard] Setting up auto-refresh interval");
    const interval = setInterval(() => {
      console.log("[Dashboard] Auto-refresh triggered");
      forceUpdate(n => n + 1);
    }, 2000); // Refresh every 2 seconds

    return () => {
      console.log("[Dashboard] Clearing auto-refresh interval");
      clearInterval(interval);
    };
  }, []);

  // Force update whenever paid orders count changes
  useEffect(() => {
    console.log("[Dashboard] Paid orders count changed:", paidOrdersCount);
    forceUpdate(n => n + 1);
  }, [paidOrdersCount]);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Force a re-render by toggling the state
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["left", "right"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Image
                source={require("../../assets/image-1763001252.jpeg")}
                style={{ width: 50, height: 50, borderRadius: 25 }}
                resizeMode="cover"
              />
              <View className="ml-3 flex-1">
                <Text className="text-2xl font-bold text-gray-900">Takipsilim Café</Text>
                <Text className="text-sm text-gray-500 mt-1">Back-Office Dashboard • {currentUser?.name}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={handleRefresh}
                className="bg-blue-50 px-3 py-2 rounded-xl flex-row items-center active:bg-blue-100"
                disabled={refreshing}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color="#2563EB"
                  style={{ transform: [{ rotate: refreshing ? "360deg" : "0deg" }] }}
                />
                <Text className="text-blue-600 text-sm font-semibold ml-2">Refresh</Text>
              </Pressable>
              <Pressable
                onPress={logout}
                className="bg-red-50 px-3 py-2 rounded-xl flex-row items-center active:bg-red-100"
              >
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                <Text className="text-red-600 text-sm font-semibold ml-2">Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Revenue Cards */}
        <View className="px-6 pt-6">
          <View className="flex-row gap-4">
            <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-500">Today</Text>
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                  <Ionicons name="trending-up" size={16} color="#059669" />
                </View>
              </View>
              <Text className="text-2xl font-bold text-gray-900">{formatCurrency(summary.todayRevenue)}</Text>
              <Text className="text-xs text-gray-500 mt-1">{summary.todayOrders} orders</Text>
            </View>

            <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-500">This Week</Text>
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="calendar-outline" size={16} color="#2563EB" />
                </View>
              </View>
              <Text className="text-2xl font-bold text-gray-900">{formatCurrency(summary.weekRevenue)}</Text>
            </View>
          </View>

          <View className="mt-4 bg-white rounded-2xl p-4 border border-gray-200">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-500">This Month</Text>
              <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center">
                <Ionicons name="stats-chart" size={16} color="#7C3AED" />
              </View>
            </View>
            <Text className="text-2xl font-bold text-gray-900">{formatCurrency(summary.monthRevenue)}</Text>
          </View>
        </View>

        {/* Top Selling Items */}
        <View className="px-6 pt-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Top Selling Items</Text>
          {summary.topSellingItems.length > 0 ? (
            <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {summary.topSellingItems.map((item, index) => (
                <View
                  key={item.menuItemId}
                  className={`px-4 py-3 ${index !== summary.topSellingItems.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900">{item.menuItemName}</Text>
                      <Text className="text-sm text-gray-500">{item.quantitySold} sold</Text>
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

        {/* Low Stock Alerts */}
        {summary.lowStockItems.length > 0 && (
          <View className="px-6 pt-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text className="text-lg font-bold text-gray-900 ml-2">Low Stock Alerts</Text>
            </View>
            <View className="bg-white rounded-2xl border border-red-200 overflow-hidden">
              {summary.lowStockItems.map((item, index) => (
                <View
                  key={item.id}
                  className={`px-4 py-3 ${index !== summary.lowStockItems.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                      <Text className="text-sm text-gray-500">
                        Current: {item.quantity} {item.unit} | Min: {item.minQuantity} {item.unit}
                      </Text>
                    </View>
                    <View className="bg-red-100 px-3 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-red-600">Low</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Orders */}
        <View className="px-6 py-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Recent Orders</Text>
          {summary.recentOrders.length > 0 ? (
            <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {summary.recentOrders.slice(0, 5).map((order, index) => (
                <View
                  key={order.id}
                  className={`px-4 py-3 ${index !== Math.min(4, summary.recentOrders.length - 1) ? "border-b border-gray-100" : ""}`}
                >
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-base font-semibold text-gray-900">{order.orderNumber}</Text>
                    <Text className="text-base font-bold text-gray-900">{formatCurrency(order.total)}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-gray-500">
                      {order.customerName || "Walk-in"} • {order.items.length} items
                    </Text>
                    <View
                      className={`px-3 py-1 rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100"
                          : order.status === "pending"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          order.status === "completed"
                            ? "text-green-700"
                            : order.status === "pending"
                            ? "text-yellow-700"
                            : "text-red-700"
                        }`}
                      >
                        {order.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-6 border border-gray-200">
              <Text className="text-sm text-gray-500 text-center">No orders yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
