import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useInventoryStore } from "../state/inventoryStore";
import { useAuthStore } from "../state/authStore";
import { InventoryItem, IngredientCategory } from "../types/cafe";

export default function InventoryScreen() {
  const items = useInventoryStore((state) => state.items);
  const addItem = useInventoryStore((state) => state.addItem);
  const updateItem = useInventoryStore((state) => state.updateItem);
  const deleteItem = useInventoryStore((state) => state.deleteItem);
  const getLowStockItems = useInventoryStore((state) => state.getLowStockItems);
  const initializeSampleData = useInventoryStore((state) => state.initializeSampleData);
  const lowStockItems = getLowStockItems();
  const logout = useAuthStore((state) => state.logout);

  // Initialize inventory with sample data on first load
  React.useEffect(() => {
    console.log("[InventoryScreen] Current items count:", items.length);
    if (items.length === 0) {
      console.log("[InventoryScreen] Inventory is empty, initializing with 85+ items...");
      initializeSampleData();
    }
  }, [items.length, initializeSampleData]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Coffee Beans" as IngredientCategory,
    unit: "",
    quantity: "",
    minQuantity: "",
    costPerUnit: "",
    supplier: "",
  });

  const categories: IngredientCategory[] = [
    "Coffee Beans",
    "Dairy",
    "Syrups",
    "Basics",
    "Waffle Ingredients",
    "Fresh Fruits",
    "Fresh Vegetables",
    "Toppings",
    "Beverages",
    "Frozen Foods",
    "Meats",
    "Bakery",
    "Condiments",
    "Canned Goods",
    "Packaging",
    "Seasonings",
  ];

  // Organized categories by type for easier selection
  const categoryGroups = {
    "Ingredients": [
      "Coffee Beans",
      "Dairy",
      "Syrups",
      "Waffle Ingredients",
      "Fresh Fruits",
      "Fresh Vegetables",
      "Toppings",
      "Frozen Foods",
      "Meats",
      "Bakery",
      "Canned Goods",
      "Condiments",
      "Seasonings",
    ],
    "Beverages": [
      "Beverages",
    ],
    "Supplies": [
      "Basics",
      "Packaging",
    ],
  };

  // Group items by category
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, InventoryItem[]> = {};
    items.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [items]);

  // Get sorted category names
  const sortedCategories = React.useMemo(() => {
    return Object.keys(groupedItems).sort();
  }, [groupedItems]);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "Coffee Beans",
      unit: "",
      quantity: "",
      minQuantity: "",
      costPerUnit: "",
      supplier: "",
    });
    setShowModal(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      quantity: item.quantity.toString(),
      minQuantity: item.minQuantity.toString(),
      costPerUnit: item.costPerUnit.toString(),
      supplier: item.supplier || "",
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.unit.trim() || !formData.quantity || !formData.minQuantity || !formData.costPerUnit) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const quantity = parseFloat(formData.quantity);
    const minQuantity = parseFloat(formData.minQuantity);
    const costPerUnit = parseFloat(formData.costPerUnit);

    if (isNaN(quantity) || quantity < 0 || isNaN(minQuantity) || minQuantity < 0 || isNaN(costPerUnit) || costPerUnit <= 0) {
      Alert.alert("Error", "Please enter valid numbers");
      return;
    }

    if (editingItem) {
      updateItem(editingItem.id, {
        name: formData.name.trim(),
        category: formData.category,
        unit: formData.unit.trim(),
        quantity,
        minQuantity,
        costPerUnit,
        supplier: formData.supplier.trim() || undefined,
      });
    } else {
      addItem({
        name: formData.name.trim(),
        category: formData.category,
        unit: formData.unit.trim(),
        quantity,
        minQuantity,
        costPerUnit,
        supplier: formData.supplier.trim() || undefined,
      });
    }

    setShowModal(false);
  };

  const handleDelete = (item: InventoryItem) => {
    Alert.alert("Delete Item", `Are you sure you want to delete "${item.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteItem(item.id),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">Inventory</Text>
              <Text className="text-sm text-gray-500 mt-1">
                {items.length} items • {lowStockItems.length} low stock
              </Text>
            </View>
            <Pressable
              onPress={logout}
              className="ml-3 bg-red-50 px-3 py-2 rounded-xl active:bg-red-100"
            >
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            </Pressable>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={handleAdd}
              className="flex-1 bg-amber-600 px-4 py-2 rounded-xl flex-row items-center justify-center active:bg-amber-700"
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-semibold ml-1">Add Item</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Load Full Inventory",
                  "This will load all 85+ ingredients needed for the menu. Your custom items will be preserved.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Load",
                      onPress: () => {
                        initializeSampleData();
                        Alert.alert("Success", "Inventory loaded with all menu ingredients!");
                      },
                    },
                  ]
                );
              }}
              className="bg-purple-600 px-4 py-2 rounded-xl flex-row items-center active:bg-purple-700"
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text className="text-white font-semibold ml-1">Load Inventory</Text>
            </Pressable>
          </View>
        </View>

        {/* Inventory List */}
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={true}>
          {lowStockItems.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <Text className="text-lg font-bold text-gray-900 ml-2">Low Stock Alert</Text>
              </View>
              <View className="bg-white rounded-2xl border border-red-200 overflow-hidden">
                {lowStockItems.map((item, index) => (
                  <View
                    key={item.id}
                    className={`px-4 py-4 ${index !== lowStockItems.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                        <Text className="text-sm text-amber-600 font-medium mt-1">{item.category}</Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          {item.quantity} {item.unit} (Min: {item.minQuantity} {item.unit})
                        </Text>
                        {item.supplier && (
                          <Text className="text-sm text-gray-500">Supplier: {item.supplier}</Text>
                        )}
                      </View>
                      <View className="bg-red-100 px-3 py-1 rounded-full ml-2">
                        <Text className="text-xs font-semibold text-red-600">Low</Text>
                      </View>
                    </View>
                    <View className="flex-row gap-2 mt-2">
                      <Pressable
                        onPress={() => handleEdit(item)}
                        className="bg-blue-50 px-3 py-2 rounded-lg active:bg-blue-100"
                      >
                        <Ionicons name="pencil" size={18} color="#2563EB" />
                      </Pressable>
                      <Pressable
                        onPress={() => handleDelete(item)}
                        className="bg-red-50 px-3 py-2 rounded-lg active:bg-red-100"
                      >
                        <Ionicons name="trash" size={18} color="#DC2626" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Items Grouped by Category */}
          {sortedCategories.map((category) => {
            const categoryItems = groupedItems[category];
            if (!categoryItems || categoryItems.length === 0) return null;

            return (
              <View key={category} className="mb-6">
                {/* Category Header */}
                <View className="mb-3">
                  <Text className="text-lg font-bold text-gray-900">{category}</Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {categoryItems.length} item{categoryItems.length !== 1 ? "s" : ""}
                  </Text>
                </View>

                {/* Category Items */}
                <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {categoryItems.map((item, index) => (
                    <View
                      key={item.id}
                      className={`px-4 py-4 ${index !== categoryItems.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                          <Text className="text-sm text-gray-500 mt-1">
                            {item.quantity} {item.unit} • ₱{item.costPerUnit.toFixed(2)}/{item.unit}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            Min: {item.minQuantity} {item.unit}
                          </Text>
                          {item.supplier && (
                            <Text className="text-sm text-gray-500">Supplier: {item.supplier}</Text>
                          )}
                        </View>
                        <View
                          className={`px-3 py-1 rounded-full ml-2 ${
                            item.quantity > item.minQuantity ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              item.quantity > item.minQuantity ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {item.quantity > item.minQuantity ? "OK" : "Low"}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row gap-2">
                        <Pressable
                          onPress={() => handleEdit(item)}
                          className="bg-blue-50 px-3 py-2 rounded-lg active:bg-blue-100"
                        >
                          <Ionicons name="pencil" size={18} color="#2563EB" />
                        </Pressable>
                        <Pressable
                          onPress={() => handleDelete(item)}
                          className="bg-red-50 px-3 py-2 rounded-lg active:bg-red-100"
                        >
                          <Ionicons name="trash" size={18} color="#DC2626" />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900">
                {editingItem ? "Edit Item" : "Add Item"}
              </Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={28} color="#374151" />
              </Pressable>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={true}>
            <View className="space-y-4">
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Name *</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  placeholder="Item name"
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Category *</Text>
                <Text className="text-xs text-gray-500 mb-3">
                  Selected: {formData.category || "Not selected"}
                </Text>

                {/* Ingredients Section */}
                <View className="mb-4">
                  <Text className="text-xs font-bold text-amber-600 mb-2">INGREDIENTS</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {categoryGroups.Ingredients.map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() => {
                          console.log("[InventoryScreen] Category changed to:", cat);
                          setFormData({ ...formData, category: cat });
                        }}
                        className={`px-3 py-2 rounded-lg border ${
                          formData.category === cat
                            ? "bg-amber-600 border-amber-600"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            formData.category === cat ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Beverages Section */}
                <View className="mb-4">
                  <Text className="text-xs font-bold text-amber-600 mb-2">BEVERAGES</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {categoryGroups.Beverages.map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() => {
                          console.log("[InventoryScreen] Category changed to:", cat);
                          setFormData({ ...formData, category: cat });
                        }}
                        className={`px-3 py-2 rounded-lg border ${
                          formData.category === cat
                            ? "bg-amber-600 border-amber-600"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            formData.category === cat ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Supplies Section */}
                <View className="mb-4">
                  <Text className="text-xs font-bold text-amber-600 mb-2">SUPPLIES</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {categoryGroups.Supplies.map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() => {
                          console.log("[InventoryScreen] Category changed to:", cat);
                          setFormData({ ...formData, category: cat });
                        }}
                        className={`px-3 py-2 rounded-lg border ${
                          formData.category === cat
                            ? "bg-amber-600 border-amber-600"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            formData.category === cat ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Unit *</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  placeholder="e.g., kg, liters, pieces"
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={formData.unit}
                  onChangeText={(text) => setFormData({ ...formData, unit: text })}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Quantity *</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={formData.quantity}
                  onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Minimum Quantity *</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={formData.minQuantity}
                  onChangeText={(text) => setFormData({ ...formData, minQuantity: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Cost Per Unit *</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={formData.costPerUnit}
                  onChangeText={(text) => setFormData({ ...formData, costPerUnit: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Supplier</Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  placeholder="Supplier name"
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={formData.supplier}
                  onChangeText={(text) => setFormData({ ...formData, supplier: text })}
                />
              </View>
            </View>

            <View className="py-6">
              <Pressable
                onPress={handleSave}
                className="bg-amber-600 rounded-xl py-4 items-center active:bg-amber-700"
              >
                <Text className="text-white text-base font-semibold">
                  {editingItem ? "Update Item" : "Add Item"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
