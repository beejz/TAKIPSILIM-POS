import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, Modal, TextInput, Alert, Image, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useMenuStore } from "../state/menuStore";
import { useAuthStore } from "../state/authStore";
import { MenuItem, MenuCategory, MenuStatus } from "../types/cafe";
import { Picker } from "@react-native-picker/picker";

// Import ALL images at module level (React Native requirement)
const IMAGE_COFFEE_ALMOND = require("../../assets/image-1763821879.png");
const IMAGE_COFFEE_VANILLA = require("../../assets/image-1763821891.png");
const IMAGE_COFFEE_HAZELNUT = require("../../assets/image-1763821885.png");
const IMAGE_COFFEE_CHOCOLATE = require("../../assets/image-1763821883.png");
const IMAGE_HOTDOG_ULTIMATE = require("../../assets/image-1763850106.png");
const IMAGE_HOTDOG_CLASSIC = require("../../assets/image-1763850102.png");
const IMAGE_HOTDOG_MONSTER = require("../../assets/image-1763850110.png");
const IMAGE_WAFFLE_STRAWBERRY = require("../../assets/image-1763851344.png");
const IMAGE_WAFFLE_CHOCOLATE = require("../../assets/image-1763851337.png");
const IMAGE_WAFFLE_CARAMEL = require("../../assets/image-1763851340.png");
const IMAGE_WAFFLE_PREMIUM = require("../../assets/image-1763851335.png");
const IMAGE_SILOG_HOTSILOG = require("../../assets/image-1763850500.png");
const IMAGE_SILOG_TOCILOG = require("../../assets/image-1763850508.png");
const IMAGE_SILOG_BACONSILOG = require("../../assets/image-1763850504.png");
const IMAGE_SILOG_SPAMSILOG = require("../../assets/image-1763850506.png");
const IMAGE_SILOG_SAUSAGESILOG = require("../../assets/image-1763850502.png");
const IMAGE_SILOG_LONGSILOG = require("../../assets/image-1763850511.png");
const IMAGE_SODA_GREEN_APPLE = require("../../assets/image-1763851287.png");
const IMAGE_SODA_STRAWBERRY = require("../../assets/image-1763851289.png");
const IMAGE_SODA_BLUEBERRY = require("../../assets/image-1763851293.png");
const IMAGE_SODA_LYCHEE = require("../../assets/image-1763851296.png");
const IMAGE_LEMONADE_FRESH_LEMON = require("../../assets/image-1763851285.png");
const IMAGE_LEMONADE_CUCUMBER = require("../../assets/image-1763855293.png");
const IMAGE_LEMONADE_YAKULT = require("../../assets/image-1763855290.png");
const IMAGE_SIOPAO_MINI = require("../../assets/image-1763855282.png");
const IMAGE_SIOPAO_JUMBO = require("../../assets/image-1763855286.png");
const IMAGE_CHICKEN_POPPERS = require("../../assets/image-1763858539.png");
const IMAGE_CHICKEN_FILLET = require("../../assets/image-1763858540.png");
const IMAGE_SHANGHAI_RICE = require("../../assets/image-1763858542.png");
const IMAGE_SIOMAI_RICE = require("../../assets/image-1763858544.png");
const IMAGE_JUNGLE_TWISTER = require("../../assets/image-1763859053.png");
const IMAGE_POTATO_WEDGES = require("../../assets/image-1763859055.png");
const IMAGE_SEA_SALT_POTATO = require("../../assets/image-1763859057.png");
const IMAGE_GARDEN_CRINKLE = require("../../assets/image-1763859062.png");
const IMAGE_CAJUN_CHEESY = require("../../assets/image-1763859064.png");
const IMAGE_BABY_FRIES = require("../../assets/image-1763859066.png");
const IMAGE_WAFFLE_STICK = require("../../assets/image-1763851401.png");
const IMAGE_SIOMAI_ONLY = require("../../assets/image-1763866055.png");

// Image map
const LOCAL_IMAGE_MAP: { [key: string]: any } = {
  "image-1763821879.png": IMAGE_COFFEE_ALMOND,
  "image-1763821891.png": IMAGE_COFFEE_VANILLA,
  "image-1763821885.png": IMAGE_COFFEE_HAZELNUT,
  "image-1763821883.png": IMAGE_COFFEE_CHOCOLATE,
  "image-1763850106.png": IMAGE_HOTDOG_ULTIMATE,
  "image-1763850102.png": IMAGE_HOTDOG_CLASSIC,
  "image-1763850110.png": IMAGE_HOTDOG_MONSTER,
  "image-1763851344.png": IMAGE_WAFFLE_STRAWBERRY,
  "image-1763851337.png": IMAGE_WAFFLE_CHOCOLATE,
  "image-1763851340.png": IMAGE_WAFFLE_CARAMEL,
  "image-1763851335.png": IMAGE_WAFFLE_PREMIUM,
  "image-1763850500.png": IMAGE_SILOG_HOTSILOG,
  "image-1763850508.png": IMAGE_SILOG_TOCILOG,
  "image-1763850504.png": IMAGE_SILOG_BACONSILOG,
  "image-1763850506.png": IMAGE_SILOG_SPAMSILOG,
  "image-1763850502.png": IMAGE_SILOG_SAUSAGESILOG,
  "image-1763850511.png": IMAGE_SILOG_LONGSILOG,
  "image-1763851285.png": IMAGE_LEMONADE_FRESH_LEMON,
  "image-1763851287.png": IMAGE_SODA_GREEN_APPLE,
  "image-1763851289.png": IMAGE_SODA_STRAWBERRY,
  "image-1763851293.png": IMAGE_SODA_BLUEBERRY,
  "image-1763851296.png": IMAGE_SODA_LYCHEE,
  "image-1763855293.png": IMAGE_LEMONADE_CUCUMBER,
  "image-1763855290.png": IMAGE_LEMONADE_YAKULT,
  "image-1763855282.png": IMAGE_SIOPAO_MINI,
  "image-1763855286.png": IMAGE_SIOPAO_JUMBO,
  "image-1763858539.png": IMAGE_CHICKEN_POPPERS,
  "image-1763858540.png": IMAGE_CHICKEN_FILLET,
  "image-1763858542.png": IMAGE_SHANGHAI_RICE,
  "image-1763858544.png": IMAGE_SIOMAI_RICE,
  "image-1763859053.png": IMAGE_JUNGLE_TWISTER,
  "image-1763859055.png": IMAGE_POTATO_WEDGES,
  "image-1763859057.png": IMAGE_SEA_SALT_POTATO,
  "image-1763859062.png": IMAGE_GARDEN_CRINKLE,
  "image-1763859064.png": IMAGE_CAJUN_CHEESY,
  "image-1763859066.png": IMAGE_BABY_FRIES,
  "image-1763851401.png": IMAGE_WAFFLE_STICK,
  "image-1763866055.png": IMAGE_SIOMAI_ONLY,
};

// Helper function to get image source
const getImageSource = (imageUrl: string | undefined) => {
  if (!imageUrl) return null;

  // If it starts with http/https, it's a URL
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return { uri: imageUrl };
  }

  // If it starts with file://, ph://, or content:// it's a local file URI from image picker
  if (imageUrl.startsWith("file://") || imageUrl.startsWith("ph://") || imageUrl.startsWith("content://")) {
    return { uri: imageUrl };
  }

  // Check if it's a local image filename in our map
  if (LOCAL_IMAGE_MAP[imageUrl]) {
    return LOCAL_IMAGE_MAP[imageUrl];
  }

  return null;
};

export default function MenuScreen() {
  // Use individual selectors for better reactivity
  const menuItems = useMenuStore((s) => s.items);
  const categories = useMenuStore((s) => s.categories); // Now properly migrated by store
  const addItem = useMenuStore((s) => s.addItem);
  const updateItem = useMenuStore((s) => s.updateItem);
  const deleteItem = useMenuStore((s) => s.deleteItem);
  const updateStock = useMenuStore((s) => s.updateStock);
  const addCategory = useMenuStore((s) => s.addCategory);
  const deleteCategory = useMenuStore((s) => s.deleteCategory);
  const initializeSampleData = useMenuStore((s) => s.initializeSampleData);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);

  // Debug: Log categories on mount and when they change
  React.useEffect(() => {
    console.log("[MenuScreen] Categories loaded:", categories, "Length:", categories?.length);
    console.log("[MenuScreen] Full categories array:", JSON.stringify(categories));

    // If categories are corrupted or empty, force initialization
    if (!categories || categories.length === 0) {
      console.log("[MenuScreen] Categories are empty! Force initializing...");
      initializeSampleData();
    }
  }, [categories]);

  // Debug: Log when menuItems changes
  React.useEffect(() => {
    console.log("[MenuScreen] menuItems changed, total count:", menuItems.length);
    if (menuItems.length > 0) {
      console.log("[MenuScreen] First 3 items:", menuItems.slice(0, 3).map(i => ({ id: i.id, name: i.name, category: i.category })));
    }
  }, [menuItems]);

  // Check if current user is admin
  const isAdmin = currentUser?.role === "admin";

  const [showModal, setShowModal] = useState(false);
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [showQuickPriceModal, setShowQuickPriceModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCategoryPickerModal, setShowCategoryPickerModal] = useState(false);
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "Coffee",
    price: "",
    stockQuantity: "",
    description: "",
    imageUrl: "",
  });
  const [bulkPriceData, setBulkPriceData] = useState({
    type: "percentage" as "percentage" | "fixed",
    value: "",
    action: "increase" as "increase" | "decrease",
    category: "all" as MenuCategory | "all",
  });
  const [quickPriceData, setQuickPriceData] = useState({
    item: null as MenuItem | null,
    newPrice: "",
  });
  const [editStockData, setEditStockData] = useState({
    item: null as MenuItem | null,
    newStock: "",
  });

  const formatCurrency = (amount: number) => {
    return `₱${amount.toFixed(2)}`;
  };

  // Use useMemo to ensure groupedItems updates when menuItems changes
  const groupedItems = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = menuItems.filter((item) => item.category === category);
      return acc;
    }, {} as Record<MenuCategory, MenuItem[]>);
  }, [menuItems, categories]);

  // Sub-group items for better organization across all categories
  const getSubgroups = (category: MenuCategory, items: MenuItem[]) => {
    if (category === "Waffle") {
      const subgroups: Record<string, MenuItem[]> = {
        "Classic Waffles": [],
        "Premium Waffles": [],
      };

      items.forEach((item) => {
        if (item.description?.includes("Classic Waffles")) {
          subgroups["Classic Waffles"].push(item);
        } else if (item.description?.includes("Premium Waffles")) {
          subgroups["Premium Waffles"].push(item);
        }
      });

      return subgroups;
    }

    if (category === "Snack") {
      const subgroups: Record<string, MenuItem[]> = {
        "Waffle Sticks": [],
        "Siopao": [],
        "Sandwiches": [],
        "Fries & Potatoes": [],
      };

      items.forEach((item) => {
        if (item.name.includes("Waffle Stick")) {
          subgroups["Waffle Sticks"].push(item);
        } else if (item.name.includes("Siopao")) {
          subgroups["Siopao"].push(item);
        } else if (item.name.includes("Sandwich") || item.name.includes("Hotdog")) {
          subgroups["Sandwiches"].push(item);
        } else if (item.name.includes("Fries") || item.name.includes("Potato")) {
          subgroups["Fries & Potatoes"].push(item);
        }
      });

      return subgroups;
    }

    if (category === "Coffee") {
      const subgroups: Record<string, MenuItem[]> = {
        "Hot Coffee": [],
        "Iced Coffee": [],
      };

      items.forEach((item) => {
        if (item.name.includes("Iced") || item.description?.includes("Iced Coffee") || item.description?.includes("22oz")) {
          subgroups["Iced Coffee"].push(item);
        } else {
          subgroups["Hot Coffee"].push(item);
        }
      });

      return subgroups;
    }

    if (category === "Beverage") {
      const subgroups: Record<string, MenuItem[]> = {
        "Fresh Lemonade Series": [],
        "Other Beverages": [],
      };

      items.forEach((item) => {
        if (item.description?.includes("Fresh Lemonade Series")) {
          subgroups["Fresh Lemonade Series"].push(item);
        } else {
          subgroups["Other Beverages"].push(item);
        }
      });

      return subgroups;
    }

    if (category === "Soda") {
      const subgroups: Record<string, MenuItem[]> = {
        "Soda Fruit Series": [],
      };

      items.forEach((item) => {
        subgroups["Soda Fruit Series"].push(item);
      });

      return subgroups;
    }

    if (category === "Rice Meal") {
      const subgroups: Record<string, MenuItem[]> = {
        "Chicken Meals": [],
        "Siomai Meals": [],
        "Shanghai Meals": [],
        "Silog Meals": [],
      };

      items.forEach((item) => {
        if (item.name.includes("Chicken")) {
          subgroups["Chicken Meals"].push(item);
        } else if (item.name.includes("Siomai")) {
          subgroups["Siomai Meals"].push(item);
        } else if (item.name.includes("Shanghai")) {
          subgroups["Shanghai Meals"].push(item);
        } else if (item.name.includes("silog")) {
          subgroups["Silog Meals"].push(item);
        }
      });

      return subgroups;
    }

    // No subgroups for other categories
    return null;
  };

  const handleAdd = () => {
    if (!isAdmin) {
      Alert.alert("Access Denied", "Only administrators can add new menu items.");
      return;
    }
    setEditingItem(null);
    setFormData({
      name: "",
      category: categories.length > 0 ? categories[0] : "Coffee",
      price: "",
      stockQuantity: "",
      description: "",
      imageUrl: "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    Keyboard.dismiss();
    setShowModal(false);
    setShowCategoryPickerModal(false);
  };

  const handleEdit = (item: MenuItem) => {
    if (!isAdmin) {
      Alert.alert("Access Denied", "Only administrators can edit menu items and prices.");
      return;
    }
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      stockQuantity: item.stockQuantity.toString(),
      description: item.description || "",
      imageUrl: item.imageUrl || "",
    });
    setShowModal(true);
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need permission to access your photos.");
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData({ ...formData, imageUrl: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    console.log("[MenuScreen] handleSave called - editingItem:", editingItem ? "editing" : "adding new");
    console.log("[MenuScreen] formData:", JSON.stringify(formData));

    if (!formData.name.trim() || !formData.price || !formData.stockQuantity) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const price = parseFloat(formData.price);
    const stockQuantity = parseInt(formData.stockQuantity);

    if (isNaN(price) || price <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    if (isNaN(stockQuantity) || stockQuantity < 0) {
      Alert.alert("Error", "Please enter a valid stock quantity");
      return;
    }

    if (editingItem) {
      console.log("[MenuScreen] Updating existing item:", editingItem.id);
      updateItem(editingItem.id, {
        name: formData.name.trim(),
        category: formData.category,
        price,
        stockQuantity,
        description: formData.description.trim(),
        status: (stockQuantity > 0 ? "available" : "out_of_stock") as MenuStatus,
        imageUrl: formData.imageUrl || undefined,
      });
    } else {
      console.log("[MenuScreen] Adding new item with category:", formData.category);
      const newItem = addItem({
        name: formData.name.trim(),
        category: formData.category,
        price,
        stockQuantity,
        status: (stockQuantity > 0 ? "available" : "out_of_stock") as MenuStatus,
        description: formData.description.trim() || undefined,
        ingredients: [],
        imageUrl: formData.imageUrl || undefined,
      });
      console.log("[MenuScreen] Item added, returned item:", newItem);
    }

    console.log("[MenuScreen] Closing modal");
    setShowModal(false);
  };

  const handleDelete = (item: MenuItem) => {
    if (!isAdmin) {
      Alert.alert("Access Denied", "Only administrators can delete menu items.");
      return;
    }
    Alert.alert("Delete Item", `Are you sure you want to delete "${item.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteItem(item.id),
      },
    ]);
  };

  const handleBulkPriceChange = () => {
    if (!bulkPriceData.value || parseFloat(bulkPriceData.value) <= 0) {
      Alert.alert("Error", "Please enter a valid value");
      return;
    }

    const value = parseFloat(bulkPriceData.value);
    const itemsToUpdate = bulkPriceData.category === "all"
      ? menuItems
      : menuItems.filter(item => item.category === bulkPriceData.category);

    let updatedCount = 0;
    itemsToUpdate.forEach(item => {
      let newPrice = item.price;

      if (bulkPriceData.type === "percentage") {
        const changeAmount = (item.price * value) / 100;
        newPrice = bulkPriceData.action === "increase"
          ? item.price + changeAmount
          : item.price - changeAmount;
      } else {
        newPrice = bulkPriceData.action === "increase"
          ? item.price + value
          : item.price - value;
      }

      // Ensure price doesn't go below 0
      if (newPrice > 0) {
        updateItem(item.id, { price: Math.round(newPrice * 100) / 100 });
        updatedCount++;
      }
    });

    setShowBulkPriceModal(false);
    setBulkPriceData({
      type: "percentage",
      value: "",
      action: "increase",
      category: "all",
    });

    Alert.alert(
      "Success",
      `Updated ${updatedCount} item${updatedCount !== 1 ? "s" : ""} successfully!`
    );
  };

  const handleQuickPriceEdit = (item: MenuItem) => {
    if (!isAdmin) {
      Alert.alert("Access Denied", "Only administrators can edit prices.");
      return;
    }
    setQuickPriceData({
      item,
      newPrice: item.price.toString(),
    });
    setShowQuickPriceModal(true);
  };

  const handleQuickPriceSave = () => {
    if (!quickPriceData.item) return;

    const newPrice = parseFloat(quickPriceData.newPrice);

    if (isNaN(newPrice) || newPrice <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    updateItem(quickPriceData.item.id, {
      price: Math.round(newPrice * 100) / 100
    });

    setShowQuickPriceModal(false);
    setQuickPriceData({ item: null, newPrice: "" });

    Alert.alert("Success", `Price updated to ${formatCurrency(newPrice)}`);
  };

  const handleEditStock = (item: MenuItem) => {
    if (!isAdmin) {
      Alert.alert("Access Denied", "Only administrators can edit stock.");
      return;
    }
    setEditStockData({
      item,
      newStock: item.stockQuantity.toString(),
    });
    setShowEditStockModal(true);
  };

  const handleEditStockSave = () => {
    if (!editStockData.item) return;

    const newStock = parseInt(editStockData.newStock);

    if (isNaN(newStock) || newStock < 0) {
      Alert.alert("Error", "Please enter a valid stock quantity (0 or greater)");
      return;
    }

    updateStock(editStockData.item.id, newStock);

    setShowEditStockModal(false);
    setEditStockData({ item: null, newStock: "" });

    Alert.alert("Success", `Stock updated to ${newStock} units`);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    if (categories.includes(newCategoryName.trim())) {
      Alert.alert("Error", "This category already exists");
      return;
    }

    addCategory(newCategoryName.trim());
    setNewCategoryName("");
    setShowCategoryModal(false);
    Alert.alert("Success", `Category "${newCategoryName.trim()}" added successfully!`);
  };

  const handleDeleteCategory = (category: string) => {
    const hasItems = menuItems.some((item) => item.category === category);

    if (hasItems) {
      Alert.alert(
        "Cannot Delete",
        `Category "${category}" cannot be deleted because it has menu items. Please delete or move all items first.`
      );
      return;
    }

    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete the "${category}" category?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteCategory(category);
            Alert.alert("Success", `Category "${category}" deleted successfully!`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">Menu</Text>
              <Text className="text-sm text-gray-500 mt-1">{menuItems.length} items</Text>
            </View>
            <View className="flex-row items-center gap-2">
              {isAdmin && (
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      "Load Full Menu",
                      "This will reload the complete menu and refresh all images. Your custom prices will be preserved. Continue?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Load Menu",
                          onPress: () => {
                            initializeSampleData(true); // Pass true to force reload images
                            // Small delay to ensure state updates complete
                            setTimeout(() => {
                              Alert.alert("Success", "Menu reloaded! All images have been refreshed.");
                            }, 100);
                          },
                        },
                      ]
                    );
                  }}
                  className="bg-blue-50 px-3 py-2 rounded-xl active:bg-blue-100"
                >
                  <Ionicons name="refresh" size={20} color="#2563EB" />
                </Pressable>
              )}
              <Pressable
                onPress={logout}
                className="bg-red-50 px-3 py-2 rounded-xl active:bg-red-100"
              >
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              </Pressable>
            </View>
          </View>
          {isAdmin && (
            <View className="space-y-2">
              <View className="flex-row gap-2">
                <Pressable
                  onPress={handleAdd}
                  className="flex-1 bg-amber-600 px-4 py-2 rounded-xl flex-row items-center justify-center active:bg-amber-700"
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text className="text-white font-semibold ml-1">Add Item</Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowBulkPriceModal(true)}
                  className="flex-1 bg-orange-600 px-4 py-2 rounded-xl flex-row items-center justify-center active:bg-orange-700"
                >
                  <Ionicons name="pricetag" size={20} color="white" />
                  <Text className="text-white font-semibold ml-1">Bulk Price</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => setShowCategoryModal(true)}
                className="bg-purple-600 px-4 py-2 rounded-xl flex-row items-center justify-center active:bg-purple-700"
              >
                <Ionicons name="grid" size={20} color="white" />
                <Text className="text-white font-semibold ml-1">Manage Categories</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Menu Items by Category */}
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={true}>
          {categories.map((category) => {
            const items = groupedItems[category];
            if (items.length === 0) return null;

            // Check if category has subgroups
            const subgroups = getSubgroups(category, items);

            if (subgroups) {
              // Render with subgroups
              return (
                <View key={category} className="mb-6">
                  <Text className="text-lg font-bold text-gray-900 mb-3">{category}</Text>
                  {Object.entries(subgroups).map(([subgroupName, subgroupItems]) => {
                    if (subgroupItems.length === 0) return null;
                    return (
                      <View key={subgroupName} className="mb-4">
                        <Text className="text-sm font-semibold text-amber-600 mb-2 ml-2">{subgroupName}</Text>
                        <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                          {subgroupItems.map((item, index) => (
                            <View
                              key={item.id}
                              className={`px-4 py-4 ${index !== subgroupItems.length - 1 ? "border-b border-gray-100" : ""}`}
                            >
                              <View className="flex-row items-start gap-3">
                                {item.imageUrl && getImageSource(item.imageUrl) && (
                                  <Image
                                    source={getImageSource(item.imageUrl)!}
                                    className="w-24 h-24 rounded-xl"
                                    resizeMode="contain"
                                  />
                                )}
                                <View className="flex-1">
                                  <View className="flex-row items-start justify-between mb-2">
                                    <View className="flex-1">
                                      <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                                      {item.description && (
                                        <Text className="text-sm text-gray-500 mt-1">{item.description}</Text>
                                      )}
                                    </View>
                                    <View
                                      className={`px-3 py-1 rounded-full ml-2 ${
                                        item.status === "available" ? "bg-green-100" : "bg-red-100"
                                      }`}
                                    >
                                      <Text
                                        className={`text-xs font-semibold ${
                                          item.status === "available" ? "text-green-700" : "text-red-700"
                                        }`}
                                      >
                                        {item.status === "available" ? "Available" : "Out of Stock"}
                                      </Text>
                                    </View>
                                  </View>

                                  <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                      <Text className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</Text>
                                      <Text className="text-sm text-gray-500 mt-1">Stock: {item.stockQuantity}</Text>
                                    </View>
                                    {isAdmin && (
                                      <View className="flex-row gap-2">
                                        <Pressable
                                          onPress={() => handleEditStock(item)}
                                          className="bg-purple-50 px-3 py-2 rounded-lg active:bg-purple-100"
                                        >
                                          <Ionicons name="cube" size={18} color="#7C3AED" />
                                        </Pressable>
                                        <Pressable
                                          onPress={() => handleQuickPriceEdit(item)}
                                          className="bg-orange-50 px-3 py-2 rounded-lg active:bg-orange-100"
                                        >
                                          <Ionicons name="cash" size={18} color="#EA580C" />
                                        </Pressable>
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
                                    )}
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            }

            // Regular category display (no subgroups)
            return (
              <View key={category} className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-3">{category}</Text>
                <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {items.map((item: MenuItem, index: number) => (
                    <View
                      key={item.id}
                      className={`px-4 py-4 ${index !== items.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <View className="flex-row items-start gap-3">
                        {item.imageUrl && getImageSource(item.imageUrl) && (
                          <Image
                            source={getImageSource(item.imageUrl)!}
                            className="w-24 h-24 rounded-xl"
                            resizeMode="contain"
                          />
                        )}
                        <View className="flex-1">
                          <View className="flex-row items-start justify-between mb-2">
                            <View className="flex-1">
                              <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                              {item.description && (
                                <Text className="text-sm text-gray-500 mt-1">{item.description}</Text>
                              )}
                            </View>
                            <View
                              className={`px-3 py-1 rounded-full ml-2 ${
                                item.status === "available" ? "bg-green-100" : "bg-red-100"
                              }`}
                            >
                              <Text
                                className={`text-xs font-semibold ${
                                  item.status === "available" ? "text-green-700" : "text-red-700"
                                }`}
                              >
                                {item.status === "available" ? "Available" : "Out of Stock"}
                              </Text>
                            </View>
                          </View>

                          <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                              <Text className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</Text>
                              <Text className="text-sm text-gray-500 mt-1">Stock: {item.stockQuantity}</Text>
                            </View>
                            {isAdmin && (
                              <View className="flex-row gap-2">
                                <Pressable
                                  onPress={() => handleEditStock(item)}
                                  className="bg-purple-50 px-3 py-2 rounded-lg active:bg-purple-100"
                                >
                                  <Ionicons name="cube" size={18} color="#7C3AED" />
                                </Pressable>
                                <Pressable
                                  onPress={() => handleQuickPriceEdit(item)}
                                  className="bg-orange-50 px-3 py-2 rounded-lg active:bg-orange-100"
                                >
                                  <Ionicons name="cash" size={18} color="#EA580C" />
                                </Pressable>
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
                            )}
                          </View>
                        </View>
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
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-gray-900">
                  {editingItem ? "Edit Item" : "Add Item"}
                </Text>
                <Pressable onPress={handleCloseModal}>
                  <Ionicons name="close" size={28} color="#374151" />
                </Pressable>
              </View>
            </View>

            <ScrollView
              className="flex-1 px-6 pt-6"
              showsVerticalScrollIndicator={true}
              bounces={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 100 }}
            >
            <View className="space-y-4">
              {/* Image Upload Section */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Product Image</Text>
                {formData.imageUrl ? (
                  <View className="bg-white border border-gray-200 rounded-xl p-4">
                    <Image
                      source={getImageSource(formData.imageUrl) || { uri: formData.imageUrl }}
                      className="w-full h-48 rounded-lg mb-3"
                      resizeMode="contain"
                    />
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={pickImage}
                        className="flex-1 bg-blue-50 py-3 rounded-lg active:bg-blue-100"
                      >
                        <Text className="text-blue-600 font-semibold text-center">Change Image</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setFormData({ ...formData, imageUrl: "" })}
                        className="flex-1 bg-red-50 py-3 rounded-lg active:bg-red-100"
                      >
                        <Text className="text-red-600 font-semibold text-center">Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Pressable
                    onPress={pickImage}
                    className="bg-white border-2 border-dashed border-gray-300 rounded-xl py-8 items-center active:bg-gray-50"
                  >
                    <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                    <Text className="text-gray-600 font-semibold mt-3">Upload Product Image</Text>
                    <Text className="text-gray-400 text-sm mt-1">Tap to select from gallery</Text>
                  </Pressable>
                )}
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Name *</Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: '#111827',
                  }}
                  placeholder="Item name"
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  autoFocus={true}
                />
              </View>

              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-semibold text-gray-700">Category *</Text>
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowModal(false);
                      setTimeout(() => setShowCategoryModal(true), 300);
                    }}
                    className="flex-row items-center"
                  >
                    <Ionicons name="add-circle" size={16} color="#9333EA" />
                    <Text className="text-purple-600 text-xs font-semibold ml-1">Add New</Text>
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => {
                    console.log("Opening category picker, current category:", formData.category);
                    Keyboard.dismiss();
                    // Close main modal first, then open category picker
                    setShowModal(false);
                    setTimeout(() => {
                      setShowCategoryPickerModal(true);
                    }, 300);
                  }}
                  className="bg-white border-2 border-purple-400 rounded-xl px-4 py-3 flex-row items-center justify-between active:bg-gray-50"
                >
                  <Text className="text-base text-gray-900 font-medium">
                    {formData.category || "Select Category"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </Pressable>
                <Text className="text-xs text-purple-600 mt-1 font-semibold">
                  Current: {formData.category} • Tap to change
                </Text>
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Price *</Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: '#111827',
                  }}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: '#111827',
                  }}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={formData.stockQuantity}
                  onChangeText={(text) => setFormData({ ...formData, stockQuantity: text })}
                  keyboardType="number-pad"
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Description</Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: '#111827',
                  }}
                  placeholder="Item description..."
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
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
      </KeyboardAvoidingView>
      </Modal>

      {/* Bulk Price Change Modal */}
      <Modal
        visible={showBulkPriceModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBulkPriceModal(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900">Bulk Price Change</Text>
              <Pressable onPress={() => setShowBulkPriceModal(false)}>
                <Ionicons name="close" size={28} color="#374151" />
              </Pressable>
            </View>
            <Text className="text-sm text-gray-500 mt-2">Adjust prices for multiple items at once</Text>
          </View>

          <ScrollView
            className="flex-1 px-6 pt-6"
            showsVerticalScrollIndicator={true}
            bounces={true}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View className="space-y-4">
              {/* Category Selection */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Apply to Category</Text>
                <View className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <Picker
                    selectedValue={bulkPriceData.category}
                    onValueChange={(value) => setBulkPriceData({ ...bulkPriceData, category: value as MenuCategory | "all" })}
                  >
                    <Picker.Item label="All Categories" value="all" />
                    {categories.map((cat) => (
                      <Picker.Item key={cat} label={cat} value={cat} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Action Type */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Action</Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setBulkPriceData({ ...bulkPriceData, action: "increase" })}
                    className={`flex-1 py-3 rounded-xl ${
                      bulkPriceData.action === "increase" ? "bg-green-600" : "bg-gray-200"
                    }`}
                  >
                    <Text className={`text-center font-semibold ${
                      bulkPriceData.action === "increase" ? "text-white" : "text-gray-700"
                    }`}>
                      Increase
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setBulkPriceData({ ...bulkPriceData, action: "decrease" })}
                    className={`flex-1 py-3 rounded-xl ${
                      bulkPriceData.action === "decrease" ? "bg-red-600" : "bg-gray-200"
                    }`}
                  >
                    <Text className={`text-center font-semibold ${
                      bulkPriceData.action === "decrease" ? "text-white" : "text-gray-700"
                    }`}>
                      Decrease
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Change Type */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Change By</Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setBulkPriceData({ ...bulkPriceData, type: "percentage" })}
                    className={`flex-1 py-3 rounded-xl ${
                      bulkPriceData.type === "percentage" ? "bg-orange-600" : "bg-gray-200"
                    }`}
                  >
                    <Text className={`text-center font-semibold ${
                      bulkPriceData.type === "percentage" ? "text-white" : "text-gray-700"
                    }`}>
                      Percentage (%)
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setBulkPriceData({ ...bulkPriceData, type: "fixed" })}
                    className={`flex-1 py-3 rounded-xl ${
                      bulkPriceData.type === "fixed" ? "bg-orange-600" : "bg-gray-200"
                    }`}
                  >
                    <Text className={`text-center font-semibold ${
                      bulkPriceData.type === "fixed" ? "text-white" : "text-gray-700"
                    }`}>
                      Fixed Amount (₱)
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Value Input */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  {bulkPriceData.type === "percentage" ? "Percentage" : "Amount (₱)"}
                </Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  placeholder={bulkPriceData.type === "percentage" ? "e.g., 10 for 10%" : "e.g., 5 for ₱5"}
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={bulkPriceData.value}
                  onChangeText={(text) => setBulkPriceData({ ...bulkPriceData, value: text })}
                  keyboardType="decimal-pad"
                />
              </View>

              {/* Preview */}
              <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <Text className="text-sm font-semibold text-blue-900 mb-1">Preview</Text>
                <Text className="text-sm text-blue-700">
                  {bulkPriceData.action === "increase" ? "Increase" : "Decrease"} prices{" "}
                  {bulkPriceData.category === "all" ? "for all items" : `in ${bulkPriceData.category} category`} by{" "}
                  {bulkPriceData.type === "percentage"
                    ? `${bulkPriceData.value || "0"}%`
                    : `₱${bulkPriceData.value || "0"}`
                  }
                </Text>
              </View>
            </View>

            <View className="py-6">
              <Pressable
                onPress={handleBulkPriceChange}
                className="bg-orange-600 rounded-xl py-4 items-center active:bg-orange-700"
              >
                <Text className="text-white text-base font-semibold">Apply Price Change</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Quick Price Edit Modal */}
      <Modal
        visible={showQuickPriceModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowQuickPriceModal(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900">Edit Price</Text>
              <Pressable onPress={() => setShowQuickPriceModal(false)}>
                <Ionicons name="close" size={28} color="#374151" />
              </Pressable>
            </View>
            {quickPriceData.item && (
              <Text className="text-sm text-gray-500 mt-2">{quickPriceData.item.name}</Text>
            )}
          </View>

          <View className="flex-1 px-6 pt-6">
            {quickPriceData.item && (
              <View>
                {/* Current Price Display */}
                <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <Text className="text-sm font-semibold text-blue-900 mb-1">Current Price</Text>
                  <Text className="text-3xl font-bold text-blue-700">
                    {formatCurrency(quickPriceData.item.price)}
                  </Text>
                </View>

                {/* New Price Input */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">New Price (₱)</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-2xl font-bold text-gray-900"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    cursorColor="#000000"
                    selectionColor="rgba(0, 0, 0, 0.3)"
                    value={quickPriceData.newPrice}
                    onChangeText={(text) => setQuickPriceData({ ...quickPriceData, newPrice: text })}
                    keyboardType="decimal-pad"
                    autoFocus
                  />
                </View>

                {/* Quick Amount Buttons */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-3">Quick Adjustments</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {[5, 10, 20, 50].map((amount) => (
                      <Pressable
                        key={`add-${amount}`}
                        onPress={() => {
                          const newPrice = quickPriceData.item!.price + amount;
                          setQuickPriceData({ ...quickPriceData, newPrice: newPrice.toString() });
                        }}
                        className="bg-green-100 px-4 py-3 rounded-xl active:bg-green-200"
                      >
                        <Text className="text-green-700 font-semibold">+₱{amount}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <View className="flex-row flex-wrap gap-2 mt-2">
                    {[5, 10, 20, 50].map((amount) => (
                      <Pressable
                        key={`sub-${amount}`}
                        onPress={() => {
                          const newPrice = Math.max(0, quickPriceData.item!.price - amount);
                          setQuickPriceData({ ...quickPriceData, newPrice: newPrice.toString() });
                        }}
                        className="bg-red-100 px-4 py-3 rounded-xl active:bg-red-200"
                      >
                        <Text className="text-red-700 font-semibold">-₱{amount}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Price Change Preview */}
                {quickPriceData.newPrice && !isNaN(parseFloat(quickPriceData.newPrice)) && (
                  <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <Text className="text-sm font-semibold text-amber-900 mb-1">Price Change</Text>
                    <Text className="text-lg font-bold text-amber-700">
                      {parseFloat(quickPriceData.newPrice) > quickPriceData.item.price ? "+" : ""}
                      {formatCurrency(parseFloat(quickPriceData.newPrice) - quickPriceData.item.price)}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Save Button */}
            <Pressable
              onPress={handleQuickPriceSave}
              className="bg-orange-600 rounded-xl py-4 items-center active:bg-orange-700"
            >
              <Text className="text-white text-base font-semibold">Update Price</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Stock Modal */}
      <Modal
        visible={showEditStockModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditStockModal(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900">Edit Stock</Text>
              <Pressable onPress={() => setShowEditStockModal(false)}>
                <Ionicons name="close" size={28} color="#374151" />
              </Pressable>
            </View>
            {editStockData.item && (
              <Text className="text-sm text-gray-500 mt-2">{editStockData.item.name}</Text>
            )}
          </View>

          <View className="flex-1 px-6 pt-6">
            {editStockData.item && (
              <View>
                {/* Current Stock Display */}
                <View className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                  <Text className="text-sm font-semibold text-purple-900 mb-1">Current Stock</Text>
                  <View className="flex-row items-baseline">
                    <Text className="text-3xl font-bold text-purple-700">
                      {editStockData.item.stockQuantity}
                    </Text>
                    <Text className="text-lg font-semibold text-purple-600 ml-2">units</Text>
                  </View>
                </View>

                {/* New Stock Input */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">New Stock Quantity</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-2xl font-bold text-gray-900"
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    cursorColor="#000000"
                    selectionColor="rgba(0, 0, 0, 0.3)"
                    value={editStockData.newStock}
                    onChangeText={(text) => setEditStockData({ ...editStockData, newStock: text })}
                    keyboardType="number-pad"
                    autoFocus
                  />
                </View>

                {/* Quick Adjustment Buttons */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-3">Quick Adjustments</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {[5, 10, 20, 50].map((amount) => (
                      <Pressable
                        key={`add-${amount}`}
                        onPress={() => {
                          const newStock = editStockData.item!.stockQuantity + amount;
                          setEditStockData({ ...editStockData, newStock: newStock.toString() });
                        }}
                        className="bg-green-100 px-4 py-3 rounded-xl active:bg-green-200"
                      >
                        <Text className="text-green-700 font-semibold">+{amount}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <View className="flex-row flex-wrap gap-2 mt-2">
                    {[5, 10, 20, 50].map((amount) => (
                      <Pressable
                        key={`sub-${amount}`}
                        onPress={() => {
                          const newStock = Math.max(0, editStockData.item!.stockQuantity - amount);
                          setEditStockData({ ...editStockData, newStock: newStock.toString() });
                        }}
                        className="bg-red-100 px-4 py-3 rounded-xl active:bg-red-200"
                      >
                        <Text className="text-red-700 font-semibold">-{amount}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Stock Change Preview */}
                {editStockData.newStock && !isNaN(parseInt(editStockData.newStock)) && (
                  <View className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <Text className="text-sm font-semibold text-amber-900 mb-1">Stock Change</Text>
                    <Text className="text-lg font-bold text-amber-700">
                      {parseInt(editStockData.newStock) > editStockData.item.stockQuantity ? "+" : ""}
                      {parseInt(editStockData.newStock) - editStockData.item.stockQuantity} units
                    </Text>
                  </View>
                )}

                {/* Info Box */}
                <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <View className="flex-row items-start">
                    <Ionicons name="information-circle" size={20} color="#2563EB" style={{ marginTop: 2, marginRight: 8 }} />
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-blue-900 mb-1">Independent Stock Management</Text>
                      <Text className="text-sm text-blue-700">
                        This updates menu item stock only. It does not affect your main inventory ingredient quantities.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Save Button */}
            <Pressable
              onPress={handleEditStockSave}
              className="bg-purple-600 rounded-xl py-4 items-center active:bg-purple-700"
            >
              <Text className="text-white text-base font-semibold">Update Stock</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Category Management Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900">Manage Categories</Text>
              <Pressable onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={28} color="#374151" />
              </Pressable>
            </View>
            <Text className="text-sm text-gray-500 mt-2">Add or remove menu categories</Text>
          </View>

          <ScrollView
            className="flex-1 px-6 pt-6"
            showsVerticalScrollIndicator={true}
            bounces={true}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Add New Category */}
            <View className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
              <Text className="text-base font-bold text-gray-900 mb-3">Add New Category</Text>
              <View className="flex-row gap-2">
                <TextInput
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900"
                  placeholder="Category name (e.g., Smoothies)"
                  placeholderTextColor="#9CA3AF"
                  cursorColor="#000000"
                  selectionColor="rgba(0, 0, 0, 0.3)"
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                />
                <Pressable
                  onPress={handleAddCategory}
                  className="bg-purple-600 px-5 rounded-xl items-center justify-center active:bg-purple-700"
                >
                  <Ionicons name="add" size={24} color="white" />
                </Pressable>
              </View>
            </View>

            {/* Existing Categories */}
            <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
              <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <Text className="text-base font-bold text-gray-900">Existing Categories</Text>
              </View>
              {categories.map((category, index) => {
                const itemCount = menuItems.filter((item) => item.category === category).length;
                return (
                  <View
                    key={category}
                    className={`px-4 py-4 flex-row items-center justify-between ${
                      index !== categories.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900">{category}</Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleDeleteCategory(category)}
                      className="bg-red-50 px-3 py-2 rounded-lg active:bg-red-100"
                    >
                      <Ionicons name="trash" size={18} color="#DC2626" />
                    </Pressable>
                  </View>
                );
              })}
            </View>

            {/* Info Box */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#2563EB" style={{ marginTop: 2, marginRight: 8 }} />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-blue-900 mb-1">Note</Text>
                  <Text className="text-sm text-blue-700">
                    Categories with menu items cannot be deleted. Remove or reassign all items first.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPickerModal}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => {
          setShowCategoryPickerModal(false);
          setTimeout(() => setShowModal(true), 300);
        }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}>Select Category</Text>
              <TouchableOpacity onPress={() => {
                setShowCategoryPickerModal(false);
                setTimeout(() => setShowModal(true), 300);
              }}>
                <Ionicons name="close" size={28} color="#374151" />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 8 }}>Choose a category for this menu item</Text>
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={true}>
            {/* Debug Info */}
            <View style={{ backgroundColor: "#EFF6FF", borderWidth: 1, borderColor: "#BFDBFE", borderRadius: 12, padding: 12, marginBottom: 16 }}>
              <Text style={{ fontSize: 12, color: "#1E40AF", fontWeight: "600" }}>
                Available: {categories.join(", ")} ({categories.length} total)
              </Text>
              <Text style={{ fontSize: 10, color: "#1E40AF", marginTop: 4 }}>
                Current selection: {formData.category}
              </Text>
            </View>

            {/* Category List */}
            {categories.length === 0 ? (
              <View style={{ backgroundColor: "white", borderRadius: 12, padding: 24, alignItems: "center", marginBottom: 16 }}>
                <Ionicons name="alert-circle" size={48} color="#9CA3AF" />
                <Text style={{ fontSize: 16, color: "#6B7280", marginTop: 12, textAlign: "center" }}>
                  No categories found
                </Text>
                <Text style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4, textAlign: "center" }}>
                  Please create a category first
                </Text>
              </View>
            ) : (
              categories.map((category, index) => {
                const isSelected = formData.category === category;
                return (
                  <TouchableOpacity
                    key={`category-${index}-${category}`}
                    activeOpacity={0.7}
                    onPress={() => {
                      console.log(`>>> TAPPED: ${category}`);
                      setFormData({ ...formData, category: category });
                      setTimeout(() => {
                        console.log(`>>> CLOSING PICKER AND REOPENING MAIN MODAL`);
                        setShowCategoryPickerModal(false);
                        setTimeout(() => setShowModal(true), 300);
                      }, 200);
                    }}
                    style={{
                      backgroundColor: isSelected ? "#F3E8FF" : "white",
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isSelected ? "#9333EA" : "#E5E7EB",
                      padding: 16,
                      marginBottom: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: isSelected ? "#9333EA" : "#111827" }}>
                      {category}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={28} color="#9333EA" />}
                  </TouchableOpacity>
                );
              })
            )}

            {/* Create New Category Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                console.log(">>> CREATE NEW TAPPED");
                setShowCategoryPickerModal(false);
                setTimeout(() => {
                  setShowModal(false);
                  setTimeout(() => setShowCategoryModal(true), 300);
                }, 300);
              }}
              style={{
                backgroundColor: "#9333EA",
                borderRadius: 12,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8
              }}
            >
              <Ionicons name="add-circle" size={20} color="white" />
              <Text style={{ color: "white", fontWeight: "600", marginLeft: 8, fontSize: 16 }}>
                Create New Category
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
