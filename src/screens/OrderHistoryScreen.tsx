import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useOrderStore } from "../state/orderStore";
import { useAuthStore } from "../state/authStore";
import { format } from "date-fns";

type FilterType = "all" | "paid" | "unpaid" | "served" | "unserved";

export default function OrderHistoryScreen() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const getOrdersByUser = useOrderStore((state) => state.getOrdersByUser);
  const logout = useAuthStore((state) => state.logout);

  const [filter, setFilter] = useState<FilterType>("all");

  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    return getOrdersByUser(currentUser.id);
  }, [currentUser, getOrdersByUser]);

  const filteredOrders = useMemo(() => {
    let filtered = myOrders;

    switch (filter) {
      case "paid":
        filtered = filtered.filter((o) => o.isPaid);
        break;
      case "unpaid":
        filtered = filtered.filter((o) => !o.isPaid);
        break;
      case "served":
        filtered = filtered.filter((o) => o.isServed);
        break;
      case "unserved":
        filtered = filtered.filter((o) => !o.isServed);
        break;
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [myOrders, filter]);

  const formatCurrency = (amount: number) => `₱${amount.toFixed(2)}`;

  const getStatusColor = (order: typeof filteredOrders[0]) => {
    if (order.status === "cancelled") return "bg-red-100 text-red-700";
    if (order.isPaid) return "bg-green-100 text-green-700";
    if (order.isServed) return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusLabel = (order: typeof filteredOrders[0]) => {
    if (order.status === "cancelled") return "Cancelled";
    if (order.isPaid) return "Paid";
    if (order.isServed) return "Served";
    return "Pending";
  };

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
    { value: "served", label: "Served" },
    { value: "unserved", label: "Unserved" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">My Order History</Text>
              <Text className="text-sm text-gray-500 mt-1">
                {filteredOrders.length} {filter !== "all" ? filter : ""} orders
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

        {/* Filters */}
        <View className="px-6 pt-4 bg-white border-b border-gray-200">
          <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-row gap-2 pb-4">
            {filters.map((f) => (
              <Pressable
                key={f.value}
                onPress={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-xl ${
                  filter === f.value ? "bg-cafe-orange" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    filter === f.value ? "text-white" : "text-gray-700"
                  }`}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={true}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <View
                key={order.id}
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-200"
              >
                {/* Order Header */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">{order.orderNumber}</Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {format(new Date(order.createdAt), "MMM dd, yyyy • hh:mm a")}
                    </Text>
                    {order.customerName && (
                      <Text className="text-sm text-gray-500 mt-1">
                        Customer: {order.customerName}
                      </Text>
                    )}
                  </View>
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(order)}`}>
                    <Text className={`text-xs font-semibold ${getStatusColor(order).split(" ")[1]}`}>
                      {getStatusLabel(order)}
                    </Text>
                  </View>
                </View>

                {/* Order Items */}
                <View className="border-t border-gray-100 pt-3 mb-3">
                  {order.items.map((item, idx) => (
                    <View key={idx} className="flex-row justify-between mb-2">
                      <Text className="text-sm text-gray-700">
                        {item.quantity}x {item.menuItemName}
                      </Text>
                      <Text className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.subtotal)}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Order Total & Status */}
                <View className="border-t border-gray-100 pt-3">
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center space-x-4">
                      <View className="flex-row items-center">
                        <Ionicons
                          name={order.isServed ? "checkmark-circle" : "ellipse-outline"}
                          size={16}
                          color={order.isServed ? "#10B981" : "#9CA3AF"}
                        />
                        <Text className={`text-xs ml-1 ${order.isServed ? "text-green-600" : "text-gray-400"}`}>
                          Served
                        </Text>
                      </View>
                      <View className="flex-row items-center ml-3">
                        <Ionicons
                          name={order.isPaid ? "checkmark-circle" : "ellipse-outline"}
                          size={16}
                          color={order.isPaid ? "#10B981" : "#9CA3AF"}
                        />
                        <Text className={`text-xs ml-1 ${order.isPaid ? "text-green-600" : "text-gray-400"}`}>
                          Paid
                        </Text>
                      </View>
                    </View>
                    <View>
                      <Text className="text-xs text-gray-500 text-right">Total</Text>
                      <Text className="text-lg font-bold text-cafe-orange">
                        {formatCurrency(order.total)}
                      </Text>
                    </View>
                  </View>
                  {order.paymentMethod && (
                    <View className="flex-row items-center mt-2">
                      <Ionicons name="card-outline" size={14} color="#6B7280" />
                      <Text className="text-xs text-gray-500 ml-1">{order.paymentMethod}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4 text-center">
                No {filter !== "all" ? filter : ""} orders found
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
