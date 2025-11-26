import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePurchaseStore } from "../state/purchaseStore";
import { useInventoryStore } from "../state/inventoryStore";
import { useAuthStore } from "../state/authStore";
import { format } from "date-fns";
import { Picker } from "@react-native-picker/picker";

export default function PurchasesScreen() {
  const purchases = usePurchaseStore((state) => state.purchases);
  const createPurchase = usePurchaseStore((state) => state.createPurchase);
  const deletePurchase = usePurchaseStore((state) => state.deletePurchase);
  const inventoryItems = useInventoryStore((state) => state.items);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [formData, setFormData] = useState({
    supplierName: "",
    notes: "",
  });

  const [selectedItems, setSelectedItems] = useState<Map<string, { quantity: string; cost: string }>>(
    new Map()
  );

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const sortedPurchases = [...purchases].sort(
    (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  const handleAddPurchase = () => {
    if (!formData.supplierName.trim()) {
      Alert.alert("Error", "Please enter supplier name");
      return;
    }

    if (selectedItems.size === 0) {
      Alert.alert("Error", "Please add at least one item");
      return;
    }

    if (!currentUser) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const items = Array.from(selectedItems.entries()).map(([id, data]) => {
      const inventoryItem = inventoryItems.find((i) => i.id === id);
      const quantity = parseFloat(data.quantity);
      const costPerUnit = parseFloat(data.cost);
      return {
        inventoryItemId: id,
        itemName: inventoryItem?.name || "",
        quantity,
        costPerUnit,
        total: quantity * costPerUnit,
      };
    });

    createPurchase(formData.supplierName.trim(), items, formData.notes || undefined, currentUser.id, currentUser.name);

    setFormData({ supplierName: "", notes: "" });
    setSelectedItems(new Map());
    setShowAddModal(false);
    Alert.alert("Success", "Purchase recorded successfully");
  };

  const updateSelectedItem = (id: string, field: "quantity" | "cost", value: string) => {
    const newItems = new Map(selectedItems);
    const item = newItems.get(id) || { quantity: "", cost: "" };
    item[field] = value;
    newItems.set(id, item);
    setSelectedItems(newItems);
  };

  const removeSelectedItem = (id: string) => {
    const newItems = new Map(selectedItems);
    newItems.delete(id);
    setSelectedItems(newItems);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">Purchases</Text>
              <Text className="text-sm text-gray-500 mt-1">{purchases.length} total purchases</Text>
            </View>
            <Pressable
              onPress={logout}
              className="ml-3 bg-red-50 px-3 py-2 rounded-xl active:bg-red-100"
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            </Pressable>
          </View>
          <Pressable
            onPress={() => {
              setFormData({ supplierName: "", notes: "" });
              setSelectedItems(new Map());
              setShowAddModal(true);
            }}
            className="bg-amber-600 px-4 py-2 rounded-xl flex-row items-center active:bg-amber-700"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-1">New Purchase</Text>
          </Pressable>
        </View>

        {/* Purchases List */}
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={true}>
          {sortedPurchases.length > 0 ? (
            sortedPurchases.map((purchase) => (
              <Pressable
                key={purchase.id}
                onPress={() => {
                  setSelectedPurchase(purchase);
                  setShowDetailsModal(true);
                }}
                className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 active:bg-gray-50"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">{purchase.purchaseNumber}</Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {format(new Date(purchase.purchaseDate), "MMM dd, yyyy")}
                    </Text>
                  </View>
                  <Text className="text-lg font-bold text-amber-600">{formatCurrency(purchase.totalCost)}</Text>
                </View>

                <View className="border-t border-gray-100 pt-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-gray-600">Supplier:</Text>
                    <Text className="text-sm font-semibold text-gray-900">{purchase.supplierName}</Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-sm text-gray-600">Items:</Text>
                    <Text className="text-sm font-semibold text-gray-900">{purchase.items.length}</Text>
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View className="bg-white rounded-2xl p-8 border border-gray-200">
              <Ionicons name="cart-outline" size={48} color="#D1D5DB" style={{ alignSelf: "center" }} />
              <Text className="text-center text-gray-500 mt-4">No purchases yet</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Add Purchase Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900">New Purchase</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={28} color="#374151" />
              </Pressable>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={true}>
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Supplier Name *</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 mb-4"
                placeholder="Enter supplier name"
                placeholderTextColor="#9CA3AF"
                cursorColor="#000000"
                selectionColor="rgba(0, 0, 0, 0.3)"
                value={formData.supplierName}
                onChangeText={(text) => setFormData({ ...formData, supplierName: text })}
              />

              <Text className="text-sm font-semibold text-gray-700 mb-2">Add Items</Text>
              {inventoryItems.map((item) => {
                const selected = selectedItems.get(item.id);
                return (
                  <View key={item.id} className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-base font-semibold text-gray-900 flex-1">{item.name}</Text>
                      {selected ? (
                        <Pressable onPress={() => removeSelectedItem(item.id)}>
                          <Ionicons name="close-circle" size={24} color="#EF4444" />
                        </Pressable>
                      ) : null}
                    </View>
                    <View className="flex-row gap-3">
                      <View className="flex-1">
                        <Text className="text-xs text-gray-600 mb-1">Quantity ({item.unit})</Text>
                        <TextInput
                          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                          placeholder="0"
                          placeholderTextColor="#9CA3AF"
                          cursorColor="#000000"
                          selectionColor="rgba(0, 0, 0, 0.3)"
                          value={selected?.quantity || ""}
                          onChangeText={(text) => updateSelectedItem(item.id, "quantity", text)}
                          keyboardType="decimal-pad"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs text-gray-600 mb-1">Cost per {item.unit}</Text>
                        <TextInput
                          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                          placeholder="0.00"
                          placeholderTextColor="#9CA3AF"
                          cursorColor="#000000"
                          selectionColor="rgba(0, 0, 0, 0.3)"
                          value={selected?.cost || ""}
                          onChangeText={(text) => updateSelectedItem(item.id, "cost", text)}
                          keyboardType="decimal-pad"
                        />
                      </View>
                    </View>
                  </View>
                );
              })}

              <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">Notes</Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 mb-4"
                placeholder="Add notes..."
                placeholderTextColor="#9CA3AF"
                cursorColor="#000000"
                selectionColor="rgba(0, 0, 0, 0.3)"
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <Pressable
                onPress={handleAddPurchase}
                className="bg-amber-600 rounded-xl py-4 items-center active:bg-amber-700 mb-6"
              >
                <Text className="text-white text-base font-semibold">Record Purchase</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Details Modal */}
      {selectedPurchase && (
        <Modal
          visible={showDetailsModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowDetailsModal(false)}
        >
          <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-gray-900">Purchase Details</Text>
                <Pressable onPress={() => setShowDetailsModal(false)}>
                  <Ionicons name="close" size={28} color="#374151" />
                </Pressable>
              </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={true}>
              <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
                <Text className="text-lg font-bold text-gray-900 mb-3">{selectedPurchase.purchaseNumber}</Text>
                <View className="space-y-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Date:</Text>
                    <Text className="text-sm font-semibold text-gray-900">
                      {format(new Date(selectedPurchase.purchaseDate), "MMM dd, yyyy")}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Supplier:</Text>
                    <Text className="text-sm font-semibold text-gray-900">{selectedPurchase.supplierName}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">Created by:</Text>
                    <Text className="text-sm font-semibold text-gray-900">{selectedPurchase.createdByName}</Text>
                  </View>
                </View>
              </View>

              <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
                <Text className="text-lg font-bold text-gray-900 mb-3">Items</Text>
                {selectedPurchase.items.map((item: any, index: number) => (
                  <View
                    key={index}
                    className={`py-3 ${index !== selectedPurchase.items.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <View className="flex-row justify-between items-start mb-1">
                      <Text className="text-base font-semibold text-gray-900 flex-1">{item.itemName}</Text>
                      <Text className="text-base font-bold text-gray-900">{formatCurrency(item.total)}</Text>
                    </View>
                    <Text className="text-sm text-gray-500">
                      {item.quantity} × {formatCurrency(item.costPerUnit)}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
                <View className="flex-row justify-between">
                  <Text className="text-base font-bold text-gray-900">Total Cost:</Text>
                  <Text className="text-lg font-bold text-amber-600">
                    {formatCurrency(selectedPurchase.totalCost)}
                  </Text>
                </View>
              </View>

              {selectedPurchase.notes && (
                <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Notes:</Text>
                  <Text className="text-sm text-gray-600">{selectedPurchase.notes}</Text>
                </View>
              )}

              <Pressable
                onPress={() => {
                  Alert.alert("Delete Purchase", "Are you sure you want to delete this purchase?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        deletePurchase(selectedPurchase.id);
                        setShowDetailsModal(false);
                      },
                    },
                  ]);
                }}
                className="bg-red-600 rounded-xl py-4 items-center active:bg-red-700 mb-6"
              >
                <Text className="text-white text-base font-semibold">Delete Purchase</Text>
              </Pressable>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}
