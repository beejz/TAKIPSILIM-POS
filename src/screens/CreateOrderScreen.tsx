import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMenuStore } from "../state/menuStore";
import { useOrderStore } from "../state/orderStore";
import { useAuthStore } from "../state/authStore";
import { MenuItem, OrderItem, PaymentMethod, MenuItemSize } from "../types/cafe";
import { Picker } from "@react-native-picker/picker";
import SizeSelectionModal from "../components/SizeSelectionModal";

export default function CreateOrderScreen({ navigation }: any) {
  const allMenuItems = useMenuStore((state) => state.items);
  const menuItems = allMenuItems.filter((item) => item.status === "available");
  const createOrder = useOrderStore((state) => state.createOrder);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [selectedItems, setSelectedItems] = useState<Map<string, OrderItem>>(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState("");
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedItemForSize, setSelectedItemForSize] = useState<MenuItem | null>(null);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addItem = (menuItem: MenuItem) => {
    // If item has size options, show size selection modal
    if (menuItem.sizes && menuItem.sizes.length > 0) {
      setSelectedItemForSize(menuItem);
      setShowSizeModal(true);
      return;
    }

    // Otherwise, add directly
    addItemWithSize(menuItem, null);
  };

  const addItemWithSize = (menuItem: MenuItem, size: MenuItemSize | null) => {
    const newItems = new Map(selectedItems);
    const price = size ? size.price : menuItem.price;
    const sizeName = size ? size.name : undefined;
    const cartKey = sizeName ? `${menuItem.id}-${sizeName}` : menuItem.id;

    const existingItem = newItems.get(cartKey);

    if (existingItem) {
      if (existingItem.quantity < menuItem.stockQuantity) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      } else {
        Alert.alert("Stock Limit", `Only ${menuItem.stockQuantity} available in stock`);
        return;
      }
    } else {
      const itemName = sizeName ? `${menuItem.name} (${sizeName})` : menuItem.name;
      newItems.set(cartKey, {
        menuItemId: menuItem.id,
        menuItemName: itemName,
        quantity: 1,
        price: price,
        subtotal: price,
        selectedSize: sizeName,
      });
    }

    setSelectedItems(newItems);
  };

  const handleSizeConfirm = (size: MenuItemSize) => {
    if (selectedItemForSize) {
      addItemWithSize(selectedItemForSize, size);
    }
  };

  const removeItem = (cartKey: string) => {
    const newItems = new Map(selectedItems);
    newItems.delete(cartKey);
    setSelectedItems(newItems);
  };

  const updateQuantity = (cartKey: string, delta: number) => {
    const newItems = new Map(selectedItems);
    const item = newItems.get(cartKey);
    const menuItem = menuItems.find((m) => m.id === item?.menuItemId);

    if (item && menuItem) {
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        newItems.delete(cartKey);
      } else if (newQuantity <= menuItem.stockQuantity) {
        item.quantity = newQuantity;
        item.subtotal = item.quantity * item.price;
      } else {
        Alert.alert("Stock Limit", `Only ${menuItem.stockQuantity} available in stock`);
        return;
      }
      setSelectedItems(newItems);
    }
  };

  const calculateTotal = () => {
    const subtotal = Array.from(selectedItems.values()).reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    const tax = 0; // No tax
    const total = subtotal; // Total equals subtotal (no tax)
    return { subtotal, tax, total };
  };

  const getChange = () => {
    const received = parseFloat(amountReceived) || 0;
    return received - total;
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      Alert.alert("Error", "Please add at least one item to the order");
      return;
    }

    // If payment is Cash, show payment modal for change calculation
    if (paymentMethod === "Cash") {
      setShowPaymentModal(true);
    } else {
      // For other payment methods, create order directly
      createOrderNow();
    }
  };

  const createOrderNow = (cashAmount?: number) => {
    if (!currentUser) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const items = Array.from(selectedItems.values());
    const order = createOrder(
      items,
      customerName || undefined,
      notes || undefined,
      paymentMethod,
      currentUser.id,
      currentUser.name,
      cashAmount
    );

    if (order) {
      Alert.alert("Success", "Order created successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert("Error", "Failed to create order. Please check stock availability.");
    }
  };

  const handleConfirmPayment = () => {
    const received = parseFloat(amountReceived) || 0;
    if (received < total) {
      return; // Don't allow if insufficient payment
    }
    createOrderNow(received);
    setAmountReceived("");
    setShowPaymentModal(false);
  };

  const { subtotal, tax, total } = calculateTotal();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Pressable onPress={() => navigation.goBack()} className="mr-3">
                <Ionicons name="arrow-back" size={24} color="#374151" />
              </Pressable>
              <Text className="text-2xl font-bold text-gray-900">New Order</Text>
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
          {/* Customer Info */}
          <View className="px-6 pt-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Customer Name (Optional)</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholder="Enter customer name"
              placeholderTextColor="#9CA3AF"
              cursorColor="#000000"
              selectionColor="rgba(0, 0, 0, 0.3)"
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>

          {/* Menu Items */}
          <View className="px-6 pt-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Select Items</Text>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4">
              <Ionicons name="search" size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-900"
                placeholder="Search menu items..."
                placeholderTextColor="#9CA3AF"
                cursorColor="#000000"
                selectionColor="rgba(0, 0, 0, 0.3)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView className="bg-white rounded-2xl border border-gray-200" style={{ maxHeight: 300 }} showsVerticalScrollIndicator={true}>
              {filteredMenuItems.map((item, index) => (
                <Pressable
                  key={item.id}
                  onPress={() => addItem(item)}
                  className={`px-4 py-4 flex-row items-center gap-3 active:bg-gray-50 ${
                    index !== filteredMenuItems.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  {item.imageUrl && (
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="w-20 h-20 rounded-xl"
                      resizeMode="contain"
                    />
                  )}
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {formatCurrency(item.price)} • Stock: {item.stockQuantity}
                    </Text>
                  </View>
                  <Ionicons name="add-circle" size={28} color="#D97706" />
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Selected Items */}
          {selectedItems.size > 0 && (
            <View className="px-6 pt-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Selected Items</Text>
              <View className="bg-white rounded-2xl border border-gray-200">
                {Array.from(selectedItems.entries()).map(([cartKey, item], index) => (
                  <View
                    key={cartKey}
                    className={`px-4 py-4 ${index !== selectedItems.size - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-base font-semibold text-gray-900 flex-1">
                        {item.menuItemName}
                      </Text>
                      <Pressable onPress={() => removeItem(cartKey)}>
                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                      </Pressable>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center bg-gray-100 rounded-lg">
                        <Pressable
                          onPress={() => updateQuantity(cartKey, -1)}
                          className="px-3 py-2"
                        >
                          <Ionicons name="remove" size={20} color="#374151" />
                        </Pressable>
                        <Text className="px-4 text-base font-semibold text-gray-900">{item.quantity}</Text>
                        <Pressable
                          onPress={() => updateQuantity(cartKey, 1)}
                          className="px-3 py-2"
                        >
                          <Ionicons name="add" size={20} color="#374151" />
                        </Pressable>
                      </View>
                      <Text className="text-base font-bold text-gray-900">{formatCurrency(item.subtotal)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Notes */}
          <View className="px-6 pt-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholder="Add any special instructions..."
              placeholderTextColor="#9CA3AF"
              cursorColor="#000000"
              selectionColor="rgba(0, 0, 0, 0.3)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Payment Method */}
          <View className="px-6 pt-4 pb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Payment Method</Text>
            <View className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <Picker
                selectedValue={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              >
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="Card" value="Card" />
                <Picker.Item label="GCash" value="GCash" />
                <Picker.Item label="Maya" value="Maya" />
              </Picker>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Summary */}
        {selectedItems.size > 0 && (
          <View className="bg-white border-t border-gray-200 px-6 py-4">
            <View className="flex-row justify-between mb-4">
              <Text className="text-base font-bold text-gray-900">Total:</Text>
              <Text className="text-lg font-bold text-amber-600">{formatCurrency(total)}</Text>
            </View>
            <Pressable
              onPress={handleCheckout}
              className="bg-amber-600 rounded-xl py-4 items-center active:bg-amber-700"
            >
              <Text className="text-white text-base font-semibold">Create Order</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Cash Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-black/50 justify-center items-center px-6">
              <Pressable
                className="absolute inset-0"
                onPress={() => setShowPaymentModal(false)}
              />

              <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-2xl font-bold text-gray-900">Cash Payment</Text>
                  <Pressable
                    onPress={() => setShowPaymentModal(false)}
                    className="bg-gray-100 rounded-full p-2 active:bg-gray-200"
                  >
                    <Ionicons name="close" size={20} color="#374151" />
                  </Pressable>
                </View>

                {/* Order Total */}
                <View className="bg-amber-50 rounded-2xl p-4 mb-6">
                  <Text className="text-sm text-gray-600 mb-1">Order Total</Text>
                  <Text className="text-3xl font-bold text-gray-900">
                    {formatCurrency(total)}
                  </Text>
                </View>

                {/* Amount Received Input */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Amount Received
                  </Text>
                  <TextInput
                    value={amountReceived}
                    onChangeText={setAmountReceived}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    cursorColor="#000000"
                    selectionColor="rgba(0, 0, 0, 0.3)"
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-xl font-semibold text-gray-900"
                  />
                </View>

                {/* Quick Amount Buttons */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Quick Amounts
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {[
                      total,
                      Math.ceil(total / 100) * 100,
                      Math.ceil(total / 500) * 500,
                      Math.ceil(total / 1000) * 1000,
                    ]
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .sort((a, b) => a - b)
                      .map((amount) => (
                        <Pressable
                          key={amount}
                          onPress={() => setAmountReceived(amount.toString())}
                          className="bg-gray-100 px-4 py-2 rounded-xl active:bg-gray-200"
                        >
                          <Text className="text-sm font-bold text-gray-900">
                            {formatCurrency(amount)}
                          </Text>
                        </Pressable>
                      ))}
                  </View>
                </View>

                {/* Change Display */}
                {amountReceived && parseFloat(amountReceived) >= total && (
                  <View className="bg-green-50 rounded-2xl p-4 mb-6 border-2 border-green-200">
                    <Text className="text-sm text-green-700 mb-1">Change</Text>
                    <Text className="text-3xl font-bold text-green-700">
                      {formatCurrency(getChange())}
                    </Text>
                  </View>
                )}

                {/* Error Message */}
                {amountReceived &&
                  parseFloat(amountReceived) < total &&
                  parseFloat(amountReceived) > 0 && (
                    <View className="bg-red-50 rounded-xl p-3 mb-6">
                      <Text className="text-sm font-semibold text-red-700">
                        Insufficient amount. Need{" "}
                        {formatCurrency(total - parseFloat(amountReceived))}{" "}
                        more.
                      </Text>
                    </View>
                  )}

                {/* Confirm Button */}
                <Pressable
                  onPress={handleConfirmPayment}
                  disabled={
                    !amountReceived || parseFloat(amountReceived) < total
                  }
                  className={`rounded-xl py-4 items-center ${
                    !amountReceived || parseFloat(amountReceived) < total
                      ? "bg-gray-300"
                      : "bg-green-600 active:bg-green-700"
                  }`}
                >
                  <Text
                    className={`text-base font-bold ${
                      !amountReceived || parseFloat(amountReceived) < total
                        ? "text-gray-500"
                        : "text-white"
                    }`}
                  >
                    Confirm & Create Order
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Size Selection Modal */}
      <SizeSelectionModal
        visible={showSizeModal}
        item={selectedItemForSize}
        onClose={() => setShowSizeModal(false)}
        onConfirm={handleSizeConfirm}
      />
    </SafeAreaView>
  );
}
