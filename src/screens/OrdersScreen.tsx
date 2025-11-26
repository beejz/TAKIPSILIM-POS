import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useOrderStore } from "../state/orderStore";
import { useAuthStore } from "../state/authStore";
import { format } from "date-fns";
import PaymentModal from "../components/PaymentModal";

export default function OrdersScreen({ navigation }: any) {
  // Use individual selectors for better reactivity
  const orders = useOrderStore((s) => s.orders);
  const deleteOrder = useOrderStore((s) => s.deleteOrder);
  const markAsServed = useOrderStore((s) => s.markAsServed);
  const markAsPaid = useOrderStore((s) => s.markAsPaid);
  const cancelOrder = useOrderStore((s) => s.cancelOrder);
  const logout = useAuthStore((s) => s.logout);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  const handlePaymentClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setPaymentModalVisible(true);
  };

  const handleConfirmPayment = (amountReceived: number) => {
    if (selectedOrderId) {
      markAsPaid(selectedOrderId, amountReceived);
      setSelectedOrderId(null);
    }
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusColor = (order: typeof orders[0]) => {
    if (order.status === "cancelled") return "bg-red-100";
    if (order.isPaid) return "bg-green-100";
    if (order.isServed) return "bg-yellow-100";
    return "bg-gray-100";
  };

  const getStatusTextColor = (order: typeof orders[0]) => {
    if (order.status === "cancelled") return "text-red-700";
    if (order.isPaid) return "text-green-700";
    if (order.isServed) return "text-yellow-700";
    return "text-gray-700";
  };

  const getStatusLabel = (order: typeof orders[0]) => {
    if (order.status === "cancelled") return "Cancelled";
    if (order.isPaid) return "Paid";
    if (order.isServed) return "Served";
    return "Pending";
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">Orders</Text>
              <Text className="text-sm text-gray-500 mt-1">{orders.length} total orders</Text>
            </View>
            <Pressable
              onPress={logout}
              className="ml-3 bg-red-50 px-3 py-2 rounded-xl active:bg-red-100"
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            </Pressable>
          </View>
          <Pressable
            onPress={() => navigation.navigate("CreateOrder")}
            className="bg-amber-600 px-4 py-2 rounded-xl flex-row items-center active:bg-amber-700"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-1">New Order</Text>
          </Pressable>
        </View>

        {/* Orders List */}
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={true}>
          {sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <View
                key={order.id}
                className="bg-white rounded-2xl p-5 mb-4 border-2 border-gray-200"
              >
                {/* Order Header */}
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-gray-900">{order.orderNumber}</Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {format(new Date(order.createdAt), "MMM dd, yyyy • hh:mm a")}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1">
                      Customer: <Text className="font-semibold text-gray-900">{order.customerName || "Walk-in"}</Text>
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">By: {order.createdByName}</Text>
                  </View>
                  <View className={`px-3 py-1.5 rounded-full ${getStatusColor(order)}`}>
                    <Text className={`text-xs font-bold ${getStatusTextColor(order)}`}>
                      {getStatusLabel(order)}
                    </Text>
                  </View>
                </View>

                {/* Order Items List */}
                <View className="bg-gray-50 rounded-xl p-3 mb-4">
                  <Text className="text-sm font-bold text-gray-700 mb-2">Order Items:</Text>
                  {order.items.map((item, idx) => (
                    <View key={idx} className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-gray-900">{item.menuItemName}</Text>
                        <Text className="text-xs text-gray-500">{item.quantity} × {formatCurrency(item.price)}</Text>
                      </View>
                      <Text className="text-sm font-bold text-gray-900">{formatCurrency(item.subtotal)}</Text>
                    </View>
                  ))}
                </View>

                {/* Order Summary */}
                <View className="border-t border-gray-200 pt-3 mb-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-bold text-gray-900">Total:</Text>
                    <Text className="text-2xl font-bold text-cafe-orange">{formatCurrency(order.total)}</Text>
                  </View>
                  {order.paymentMethod && (
                    <View className="flex-row items-center mt-2">
                      <Ionicons name="card-outline" size={16} color="#6B7280" />
                      <Text className="text-xs text-gray-500 ml-1">Payment: {order.paymentMethod}</Text>
                    </View>
                  )}
                  {order.change !== undefined && order.change > 0 && (
                    <View className="bg-green-50 rounded-xl p-3 mt-2 border border-green-200">
                      <View className="flex-row justify-between items-center">
                        <View>
                          <Text className="text-xs text-green-700 font-semibold">Amount Received:</Text>
                          <Text className="text-sm font-bold text-green-900">
                            {formatCurrency(order.amountReceived || 0)}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-xs text-green-700 font-semibold">Change:</Text>
                          <Text className="text-xl font-bold text-green-700">
                            {formatCurrency(order.change)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                {/* Status Indicators */}
                <View className="flex-row items-center space-x-4 mb-4">
                  <View className="flex-row items-center">
                    <Ionicons
                      name={order.isServed ? "checkmark-circle" : "ellipse-outline"}
                      size={18}
                      color={order.isServed ? "#10B981" : "#9CA3AF"}
                    />
                    <Text className={`text-sm ml-1.5 font-semibold ${order.isServed ? "text-green-600" : "text-gray-400"}`}>
                      Served
                    </Text>
                  </View>
                  <View className="flex-row items-center ml-4">
                    <Ionicons
                      name={order.isPaid ? "checkmark-circle" : "ellipse-outline"}
                      size={18}
                      color={order.isPaid ? "#10B981" : "#9CA3AF"}
                    />
                    <Text className={`text-sm ml-1.5 font-semibold ${order.isPaid ? "text-green-600" : "text-gray-400"}`}>
                      Paid
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                {order.status !== "cancelled" && (
                  <View className="flex-row gap-2">
                    {!order.isServed && (
                      <Pressable
                        onPress={() => markAsServed(order.id)}
                        className="flex-1 bg-yellow-500 rounded-xl py-3 items-center flex-row justify-center active:bg-yellow-600"
                      >
                        <Ionicons name="restaurant" size={18} color="white" />
                        <Text className="text-white text-sm font-bold ml-1">Mark Served</Text>
                      </Pressable>
                    )}
                    {!order.isPaid && (
                      <Pressable
                        onPress={() => handlePaymentClick(order.id)}
                        className="flex-1 bg-green-600 rounded-xl py-3 items-center flex-row justify-center active:bg-green-700"
                      >
                        <Ionicons name="cash" size={18} color="white" />
                        <Text className="text-white text-sm font-bold ml-1">Mark Paid</Text>
                      </Pressable>
                    )}
                    {!order.isPaid && (
                      <Pressable
                        onPress={() => cancelOrder(order.id)}
                        className="bg-orange-500 rounded-xl px-4 py-3 items-center justify-center active:bg-orange-600"
                      >
                        <Ionicons name="close-circle" size={18} color="white" />
                      </Pressable>
                    )}
                    {currentUser?.role === "admin" && (
                      <Pressable
                        onPress={() => deleteOrder(order.id)}
                        className="bg-red-600 rounded-xl px-4 py-3 items-center justify-center active:bg-red-700"
                      >
                        <Ionicons name="trash" size={18} color="white" />
                      </Pressable>
                    )}
                  </View>
                )}

                {order.notes && (
                  <View className="bg-blue-50 rounded-lg p-3 mt-3">
                    <Text className="text-xs font-semibold text-blue-900 mb-1">Notes:</Text>
                    <Text className="text-xs text-blue-700">{order.notes}</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View className="bg-white rounded-2xl p-8 border border-gray-200">
              <Ionicons name="receipt-outline" size={48} color="#D1D5DB" style={{ alignSelf: "center" }} />
              <Text className="text-center text-gray-500 mt-4">No orders yet</Text>
              <Text className="text-center text-gray-400 text-sm mt-2">
                Create your first order to get started
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Payment Modal */}
      {selectedOrder && (
        <PaymentModal
          visible={paymentModalVisible}
          onClose={() => {
            setPaymentModalVisible(false);
            setSelectedOrderId(null);
          }}
          orderTotal={selectedOrder.total}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </SafeAreaView>
  );
}
