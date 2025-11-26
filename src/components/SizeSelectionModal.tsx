import React, { useState } from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MenuItem, MenuItemSize } from "../types/cafe";
import Animated, { FadeIn } from "react-native-reanimated";

interface SizeSelectionModalProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onConfirm: (size: MenuItemSize) => void;
}

export default function SizeSelectionModal({
  visible,
  item,
  onClose,
  onConfirm,
}: SizeSelectionModalProps) {
  const [selectedSize, setSelectedSize] = useState<MenuItemSize | null>(null);

  if (!item || !item.sizes || item.sizes.length === 0) {
    return null;
  }

  const handleConfirm = () => {
    if (selectedSize) {
      onConfirm(selectedSize);
      setSelectedSize(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedSize(null);
    onClose();
  };

  const formatCurrency = (amount: number) => `₱${amount.toFixed(2)}`;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <Animated.View
          entering={FadeIn.duration(200)}
          className="bg-white rounded-3xl p-6 w-full max-w-md"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900" style={{ fontFamily: "System", fontWeight: "600" }}>
              Select Size
            </Text>
            <Pressable onPress={handleClose} className="p-2 rounded-lg bg-gray-100 active:opacity-70">
              <Ionicons name="close" size={20} color="#374151" />
            </Pressable>
          </View>

          {/* Item Name */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
            {item.description && (
              <Text className="text-sm text-gray-500 mt-1">{item.description}</Text>
            )}
          </View>

          {/* Size Options */}
          <View className="mb-6 gap-3">
            {item.sizes.map((size) => (
              <Pressable
                key={size.name}
                onPress={() => setSelectedSize(size)}
                className={`flex-row items-center justify-between p-4 rounded-xl border-2 active:opacity-70 ${
                  selectedSize?.name === size.name
                    ? "border-cafe-orange bg-cafe-orange/5"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      selectedSize?.name === size.name
                        ? "border-cafe-orange"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedSize?.name === size.name && (
                      <View className="w-3 h-3 rounded-full bg-cafe-orange" />
                    )}
                  </View>
                  <Text
                    className={`text-base font-semibold ${
                      selectedSize?.name === size.name ? "text-cafe-orange" : "text-gray-900"
                    }`}
                  >
                    {size.name}
                  </Text>
                </View>
                <Text
                  className={`text-lg font-bold ${
                    selectedSize?.name === size.name ? "text-cafe-orange" : "text-gray-900"
                  }`}
                >
                  {formatCurrency(size.price)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              className="flex-1 py-3 rounded-lg bg-gray-100 items-center active:opacity-70"
            >
              <Text className="text-base font-semibold text-gray-700">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              disabled={!selectedSize}
              className={`flex-1 py-3 rounded-lg items-center active:opacity-90 ${
                selectedSize ? "bg-cafe-orange" : "bg-gray-300"
              }`}
              style={{
                shadowColor: selectedSize ? "#FF7A00" : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-base font-bold text-white">Add to Cart</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
