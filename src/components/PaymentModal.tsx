import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  orderTotal: number;
  onConfirmPayment: (amountReceived: number) => void;
}

export default function PaymentModal({
  visible,
  onClose,
  orderTotal,
  onConfirmPayment,
}: PaymentModalProps) {
  const [amountReceived, setAmountReceived] = useState("");

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  const getChange = () => {
    const received = parseFloat(amountReceived) || 0;
    return received - orderTotal;
  };

  const handleConfirm = () => {
    const received = parseFloat(amountReceived) || 0;
    if (received < orderTotal) {
      return; // Don't allow if insufficient payment
    }
    setAmountReceived(""); // Clear input
    onConfirmPayment(received); // Only call onConfirmPayment, not onClose
  };

  const handleClose = () => {
    setAmountReceived("");
    onClose();
  };

  const quickAmounts = [
    orderTotal,
    Math.ceil(orderTotal / 100) * 100, // Round up to nearest 100
    Math.ceil(orderTotal / 500) * 500, // Round up to nearest 500
    Math.ceil(orderTotal / 1000) * 1000, // Round up to nearest 1000
  ];

  // Remove duplicates and sort
  const uniqueQuickAmounts = Array.from(new Set(quickAmounts)).sort(
    (a, b) => a - b
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-black/50 justify-center items-center px-6">
            <Pressable
              className="absolute inset-0"
              onPress={handleClose}
            />

            <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-2xl font-bold text-gray-900">Payment</Text>
                <Pressable
                  onPress={handleClose}
                  className="bg-gray-100 rounded-full p-2 active:bg-gray-200"
                >
                  <Ionicons name="close" size={20} color="#374151" />
                </Pressable>
              </View>

              {/* Order Total */}
              <View className="bg-amber-50 rounded-2xl p-4 mb-6">
                <Text className="text-sm text-gray-600 mb-1">Order Total</Text>
                <Text className="text-3xl font-bold text-gray-900">
                  {formatCurrency(orderTotal)}
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
                  {uniqueQuickAmounts.map((amount) => (
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
              {amountReceived && parseFloat(amountReceived) >= orderTotal && (
                <View className="bg-green-50 rounded-2xl p-4 mb-6 border-2 border-green-200">
                  <Text className="text-sm text-green-700 mb-1">Change</Text>
                  <Text className="text-3xl font-bold text-green-700">
                    {formatCurrency(getChange())}
                  </Text>
                </View>
              )}

              {/* Error Message */}
              {amountReceived &&
                parseFloat(amountReceived) < orderTotal &&
                parseFloat(amountReceived) > 0 && (
                  <View className="bg-red-50 rounded-xl p-3 mb-6">
                    <Text className="text-sm font-semibold text-red-700">
                      Insufficient amount. Need{" "}
                      {formatCurrency(orderTotal - parseFloat(amountReceived))}{" "}
                      more.
                    </Text>
                  </View>
                )}

              {/* Confirm Button */}
              <Pressable
                onPress={handleConfirm}
                disabled={
                  !amountReceived || parseFloat(amountReceived) < orderTotal
                }
                className={`rounded-xl py-4 items-center ${
                  !amountReceived || parseFloat(amountReceived) < orderTotal
                    ? "bg-gray-300"
                    : "bg-green-600 active:bg-green-700"
                }`}
              >
                <Text
                  className={`text-base font-bold ${
                    !amountReceived || parseFloat(amountReceived) < orderTotal
                      ? "text-gray-500"
                      : "text-white"
                  }`}
                >
                  Confirm Payment
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
