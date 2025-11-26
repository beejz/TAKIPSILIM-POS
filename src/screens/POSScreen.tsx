import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMenuStore } from "../state/menuStore";
import { useOrderStore } from "../state/orderStore";
import { useAuthStore } from "../state/authStore";
import { useThemeStore } from "../state/themeStore";
import { MenuItem, MenuCategory, OrderItem, PaymentMethod, MenuItemSize, MenuItemFlavor } from "../types/cafe";
import { Picker } from "@react-native-picker/picker";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import PaymentModal from "../components/PaymentModal";
import SizeSelectionModal from "../components/SizeSelectionModal";
import FlavorSelectionModal from "../components/FlavorSelectionModal";

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

export default function POSScreen({ navigation }: any) {
  // Use individual selectors for better reactivity
  const allMenuItems = useMenuStore((s) => s.items);
  const menuItems = useMemo(() => allMenuItems, [allMenuItems]); // Show all items including out of stock
  const initializeSampleData = useMenuStore((s) => s.initializeSampleData);
  const updateStock = useMenuStore((s) => s.updateStock);
  const createOrder = useOrderStore((s) => s.createOrder);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "All">("All");
  const [cart, setCart] = useState<Map<string, OrderItem>>(new Map());
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedItemForSize, setSelectedItemForSize] = useState<MenuItem | null>(null);
  const [showFlavorModal, setShowFlavorModal] = useState(false);
  const [selectedItemForFlavor, setSelectedItemForFlavor] = useState<MenuItem | null>(null);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [selectedItemForStock, setSelectedItemForStock] = useState<MenuItem | null>(null);
  const [stockToAdd, setStockToAdd] = useState("");
  const [longPressInterval, setLongPressInterval] = useState<NodeJS.Timeout | null>(null);

  const categories: (MenuCategory | "All")[] = [
    "All",
    "Coffee",
    "Waffle",
    "Beverage",
    "Soda",
    "Snack",
    "Rice Meal",
  ];

  const formatCurrency = (amount: number) => `₱${amount.toFixed(2)}`;

  const filteredItems = useMemo(() => {
    let filtered = menuItems;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [menuItems, selectedCategory, searchQuery]);

  const cartTotal = useMemo(() => {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.subtotal;
    });
    const tax = 0; // No tax
    return { subtotal, tax, total: subtotal };
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    // If item has flavor options, show flavor selection modal
    if (item.flavors && item.flavors.length > 0) {
      setSelectedItemForFlavor(item);
      setShowFlavorModal(true);
      return;
    }

    // If item has size options, show size selection modal
    if (item.sizes && item.sizes.length > 0) {
      setSelectedItemForSize(item);
      setShowSizeModal(true);
      return;
    }

    // Otherwise, add directly to cart
    addToCartWithOptions(item, null, null);
  };

  const addToCartWithOptions = (item: MenuItem, size: MenuItemSize | null, flavor: MenuItemFlavor | null) => {
    const newCart = new Map(cart);
    const price = flavor ? flavor.price : (size ? size.price : item.price);
    const sizeName = size ? size.name : undefined;
    const flavorName = flavor ? flavor.name : undefined;

    // Create a unique cart key based on item id, size, and flavor
    let cartKey = item.id;
    if (sizeName) cartKey += `-${sizeName}`;
    if (flavorName) cartKey += `-${flavorName}`;

    const existing = newCart.get(cartKey);

    if (existing) {
      // Check stock before adding more
      if (existing.quantity + 1 > item.stockQuantity) {
        return; // Out of stock
      }
      existing.quantity += 1;
      existing.subtotal = existing.quantity * existing.price;
    } else {
      if (item.stockQuantity < 1) {
        return; // Out of stock
      }
      let itemName = item.name;
      if (flavorName) itemName += ` (${flavorName})`;
      if (sizeName) itemName += ` - ${sizeName}`;

      newCart.set(cartKey, {
        menuItemId: item.id,
        menuItemName: itemName,
        quantity: 1,
        price: price,
        subtotal: price,
        selectedSize: sizeName,
        selectedFlavor: flavorName,
      });
    }
    setCart(newCart);
  };

  const handleSizeConfirm = (size: MenuItemSize) => {
    if (selectedItemForSize) {
      addToCartWithOptions(selectedItemForSize, size, null);
    }
  };

  const handleFlavorConfirm = (flavor: MenuItemFlavor) => {
    if (selectedItemForFlavor) {
      addToCartWithOptions(selectedItemForFlavor, null, flavor);
    }
  };

  const updateQuantity = (cartKey: string, delta: number) => {
    const newCart = new Map(cart);
    const cartItem = newCart.get(cartKey);
    if (!cartItem) return;

    const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);
    if (!menuItem) return;

    const newQuantity = cartItem.quantity + delta;

    if (newQuantity <= 0) {
      newCart.delete(cartKey);
    } else if (newQuantity <= menuItem.stockQuantity) {
      cartItem.quantity = newQuantity;
      cartItem.subtotal = cartItem.quantity * cartItem.price;
    }

    setCart(newCart);
  };

  const removeFromCart = (cartKey: string) => {
    const newCart = new Map(cart);
    newCart.delete(cartKey);
    setCart(newCart);
  };

  const handleCheckout = async () => {
    if (cart.size === 0) return;
    if (!currentUser) return;

    setIsProcessing(true);

    try {
      // Final stock check before creating order
      const cartItems = Array.from(cart.values());
      for (const cartItem of cartItems) {
        const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);
        if (!menuItem || menuItem.stockQuantity < cartItem.quantity) {
          Alert.alert("Stock Error", `Insufficient stock for ${cartItem.menuItemName}`);
          setIsProcessing(false);
          return;
        }
      }

      // Create the order (unpaid)
      const order = createOrder(
        cartItems,
        customerName.trim() || undefined,
        notes.trim() || undefined,
        paymentMethod,
        currentUser.id,
        currentUser.name
      );

      if (order) {
        // Store the order ID and show payment modal
        setCreatedOrderId(order.id);
        setShowCheckout(false); // Close checkout modal
        setShowPaymentModal(true); // Show payment modal
      } else {
        Alert.alert("Error", "Failed to create order. Please check stock availability.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = (amountReceived: number) => {
    if (!createdOrderId) return;

    // Mark the order as paid
    const markAsPaid = useOrderStore.getState().markAsPaid;
    markAsPaid(createdOrderId, amountReceived);

    // Store the order ID before clearing (for success message)
    const orderId = createdOrderId;

    // Clear all state immediately and synchronously
    setCreatedOrderId(null);
    setShowPaymentModal(false);
    setShowCheckout(false);
    setCart(new Map());
    setCustomerName("");
    setNotes("");
    setPaymentMethod("Cash");

    // Show success message after a small delay
    setTimeout(() => {
      Alert.alert("Success", "Order completed and payment received!");
    }, 300);
  };

  const handleCancelPayment = () => {
    // If user cancels payment, delete the unpaid order
    if (createdOrderId) {
      const deleteOrder = useOrderStore.getState().deleteOrder;
      deleteOrder(createdOrderId);
      setCreatedOrderId(null);
    }

    // Reopen checkout modal so user can try again
    setShowPaymentModal(false);
    setShowCheckout(true);
  };

  const handleOpenAddStock = (item: MenuItem) => {
    setSelectedItemForStock(item);
    setStockToAdd("");
    setShowAddStockModal(true);
  };

  const handleAddStock = () => {
    if (!selectedItemForStock) return;

    const amountToAdd = parseInt(stockToAdd);
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid number greater than 0");
      return;
    }

    const newStock = selectedItemForStock.stockQuantity + amountToAdd;
    updateStock(selectedItemForStock.id, newStock);

    Alert.alert(
      "Stock Updated",
      `${selectedItemForStock.name} stock updated from ${selectedItemForStock.stockQuantity} to ${newStock}`
    );

    setShowAddStockModal(false);
    setSelectedItemForStock(null);
    setStockToAdd("");
  };

  // Long press handlers for quantity buttons
  const startLongPress = (cartKey: string, delta: number) => {
    // Clear any existing interval
    if (longPressInterval) {
      clearInterval(longPressInterval);
    }

    // Start incrementing/decrementing rapidly
    const interval = setInterval(() => {
      updateQuantity(cartKey, delta);
    }, 100); // Update every 100ms for fast increment

    setLongPressInterval(interval);
  };

  const stopLongPress = () => {
    if (longPressInterval) {
      clearInterval(longPressInterval);
      setLongPressInterval(null);
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (longPressInterval) {
        clearInterval(longPressInterval);
      }
    };
  }, [longPressInterval]);

  const bgClass = isDark ? "bg-dark-bg" : "bg-gray-50";
  const cardBgClass = isDark ? "bg-dark-card" : "bg-white";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-gray-400" : "text-gray-500";
  const borderClass = isDark ? "border-dark-border" : "border-gray-200";
  const inputBgClass = isDark ? "bg-gray-800" : "bg-gray-100";

  return (
    <SafeAreaView className={`flex-1 ${bgClass}`} edges={["top", "left", "right"]}>
      <View className="flex-1">
        {/* Header */}
        <View className={`px-6 py-4 ${cardBgClass}`}>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <Image
                source={require("../../assets/image-1763001252.jpeg")}
                style={{ width: 50, height: 50, borderRadius: 25 }}
                resizeMode="cover"
              />
              <View className="ml-3 flex-1">
                <Text className={`text-2xl font-bold ${textClass}`} style={{ fontFamily: "System", fontWeight: "600" }}>
                  Takipsilim Café
                </Text>
                <Text className={`text-sm ${textSecondaryClass} mt-1`}>POS System • {currentUser?.name}</Text>
              </View>
            </View>
            <View className="flex-row items-center space-x-3">
              <Pressable
                onPress={async () => {
                  Alert.alert(
                    "Load Full Menu",
                    "This will reload the complete menu with all images. Continue?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Load Menu",
                        onPress: async () => {
                          // Clear the persisted menu data first
                          const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
                          await AsyncStorage.removeItem("menu-storage");

                          // Then reinitialize with force reload images
                          initializeSampleData(true);

                          Alert.alert("Success", "Full menu reloaded with all images!");
                        },
                      },
                    ]
                  );
                }}
                className={`p-2 rounded-lg ${inputBgClass} active:opacity-70`}
              >
                <Ionicons name="refresh" size={20} color="#2563EB" />
              </Pressable>
              <Pressable
                onPress={toggleTheme}
                className={`p-2 rounded-lg ${inputBgClass} active:opacity-70`}
              >
                <Ionicons name={isDark ? "sunny" : "moon"} size={20} color={isDark ? "#FF7A00" : "#6B7280"} />
              </Pressable>
              <Pressable onPress={logout} className="bg-red-500/10 px-3 py-2 rounded-lg active:bg-red-500/20">
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              </Pressable>
            </View>
          </View>

          {/* Search Bar */}
          <View className={`flex-row items-center ${inputBgClass} rounded-lg px-4 py-3`}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search menu items..."
              placeholderTextColor="#9CA3AF"
              cursorColor="#FFFFFF"
              className={`flex-1 ml-3 text-base ${textClass}`}
            />
          </View>
        </View>

        {/* Category Tabs - Clean Text Only */}
        <View className={`${cardBgClass} border-b ${borderClass}`}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerClassName="px-6 py-4 gap-6"
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                className="relative pb-2"
              >
                <Text
                  className={`text-base font-medium ${
                    selectedCategory === category ? "text-cafe-orange" : textSecondaryClass
                  }`}
                  style={{ fontFamily: "System", fontWeight: selectedCategory === category ? "600" : "500" }}
                >
                  {category}
                </Text>
                {/* Active underline indicator */}
                {selectedCategory === category && (
                  <Animated.View
                    entering={FadeIn.duration(200)}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cafe-orange"
                    style={{
                      shadowColor: "#FF7A00",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                    }}
                  />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="flex-1 flex-row">
          {/* Menu Grid */}
          <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={true}>
            <Animated.View
              className="flex-row flex-wrap gap-4 pb-6"
              layout={Layout.duration(300)}
            >
              {filteredItems.map((item) => (
                <Animated.View
                  key={item.id}
                  entering={FadeIn.duration(300)}
                  exiting={FadeOut.duration(200)}
                  style={{ width: "48%" }}
                >
                  <View className={`${cardBgClass} rounded-lg p-4 border ${borderClass} ${item.stockQuantity === 0 ? "opacity-60" : ""}`}
                    style={{
                      shadowColor: isDark ? "#000" : "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0.3 : 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Pressable
                      onPress={() => item.stockQuantity > 0 ? addToCart(item) : null}
                      className="active:opacity-70"
                      disabled={item.stockQuantity === 0}
                    >
                      {item.imageUrl && getImageSource(item.imageUrl) ? (
                        <Image
                          source={getImageSource(item.imageUrl)!}
                          className="w-full h-40 rounded-lg mb-3"
                          resizeMode="contain"
                        />
                      ) : (
                        <View className={`w-full h-40 ${inputBgClass} rounded-lg mb-3 items-center justify-center`}>
                          <Ionicons name="cafe-outline" size={40} color="#9CA3AF" />
                        </View>
                      )}

                      {/* Out of Stock Badge Overlay */}
                      {item.stockQuantity === 0 && (
                        <View className="absolute top-2 right-2 bg-red-500 px-3 py-1 rounded-full">
                          <Text className="text-white text-xs font-bold">OUT OF STOCK</Text>
                        </View>
                      )}

                      <Text className={`text-base font-semibold ${textClass} mb-1`} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className={`text-xs ${textSecondaryClass} mb-3`}>{item.category}</Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-cafe-orange">{formatCurrency(item.price)}</Text>
                        <View className={`flex-row items-center px-2 py-1 rounded ${
                          item.stockQuantity === 0 ? "bg-red-500/20" : item.stockQuantity < 10 ? "bg-red-500/10" : "bg-green-500/10"
                        }`}>
                          <Ionicons
                            name="cube-outline"
                            size={12}
                            color={item.stockQuantity === 0 ? "#EF4444" : item.stockQuantity < 10 ? "#EF4444" : "#10B981"}
                          />
                          <Text
                            className={`text-xs ml-1 font-medium ${
                              item.stockQuantity === 0 ? "text-red-500 font-bold" : item.stockQuantity < 10 ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {item.stockQuantity}
                          </Text>
                        </View>
                      </View>
                    </Pressable>

                    {/* Add Stock Button - Show for low stock items */}
                    {item.stockQuantity <= 10 && (
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleOpenAddStock(item);
                        }}
                        className="mt-3 bg-cafe-orange rounded-lg py-2 px-3 flex-row items-center justify-center active:opacity-70"
                      >
                        <Ionicons name="add-circle" size={18} color="white" />
                        <Text className="text-white font-semibold ml-1 text-sm">Add Stock</Text>
                      </Pressable>
                    )}
                  </View>
                </Animated.View>
              ))}
            </Animated.View>
          </ScrollView>

          {/* Cart Summary (Right Sidebar) */}
          <View className={`w-96 ${cardBgClass} border-l ${borderClass} p-6`}>
            <Text className={`text-xl font-bold ${textClass} mb-6`} style={{ fontFamily: "System", fontWeight: "600" }}>
              Order Summary
            </Text>

            {cart.size === 0 ? (
              <View className="flex-1 items-center justify-center">
                <View className={`w-20 h-20 rounded-full ${inputBgClass} items-center justify-center mb-4`}>
                  <Ionicons name="cart-outline" size={40} color="#9CA3AF" />
                </View>
                <Text className={`${textClass} font-medium text-center`}>Cart is empty</Text>
                <Text className={`${textSecondaryClass} text-sm text-center mt-2`}>
                  Tap on menu items to add them to your order
                </Text>
              </View>
            ) : (
              <>
                <ScrollView className="flex-1 mb-6" showsVerticalScrollIndicator={true}>
                  {Array.from(cart.entries()).map(([cartKey, item]) => (
                    <Animated.View
                      key={cartKey}
                      entering={FadeIn.duration(300)}
                      exiting={FadeOut.duration(200)}
                      layout={Layout.duration(300)}
                      className={`p-4 rounded-lg ${inputBgClass} mb-3`}
                    >
                      <View className="flex-row items-start justify-between mb-3">
                        <Text className={`flex-1 font-semibold ${textClass} mr-2`}>
                          {item.menuItemName}
                        </Text>
                        <Pressable onPress={() => removeFromCart(cartKey)}>
                          <Ionicons name="close-circle" size={22} color="#EF4444" />
                        </Pressable>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center space-x-3">
                          <Pressable
                            onPress={() => updateQuantity(cartKey, -1)}
                            onLongPress={() => startLongPress(cartKey, -1)}
                            onPressOut={stopLongPress}
                            delayLongPress={300}
                            className="w-8 h-8 bg-cafe-orange rounded-lg items-center justify-center active:opacity-70"
                          >
                            <Ionicons name="remove" size={16} color="white" />
                          </Pressable>
                          <Text className={`text-base font-bold ${textClass} min-w-[28px] text-center`}>
                            {item.quantity}
                          </Text>
                          <Pressable
                            onPress={() => updateQuantity(cartKey, 1)}
                            onLongPress={() => startLongPress(cartKey, 1)}
                            onPressOut={stopLongPress}
                            delayLongPress={300}
                            className="w-8 h-8 bg-cafe-orange rounded-lg items-center justify-center active:opacity-70"
                          >
                            <Ionicons name="add" size={16} color="white" />
                          </Pressable>
                        </View>
                        <Text className="text-base font-bold text-cafe-orange">
                          {formatCurrency(item.subtotal)}
                        </Text>
                      </View>
                    </Animated.View>
                  ))}
                </ScrollView>

                {/* Totals */}
                <View className={`border-t ${borderClass} pt-4 mb-6`}>
                  <View className="flex-row justify-between mb-3">
                    <Text className={`${textSecondaryClass} text-sm`}>Subtotal</Text>
                    <Text className={`${textClass} font-medium`}>{formatCurrency(cartTotal.subtotal)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className={`text-lg font-bold ${textClass}`}>Total</Text>
                    <Text className="text-xl font-bold text-cafe-orange">
                      {formatCurrency(cartTotal.total)}
                    </Text>
                  </View>
                </View>

                {/* Checkout Button */}
                <Pressable
                  onPress={() => setShowCheckout(true)}
                  className="bg-cafe-orange py-4 rounded-lg items-center active:opacity-90"
                  style={{
                    shadowColor: "#FF7A00",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text className="text-white text-base font-bold" style={{ fontFamily: "System", fontWeight: "600" }}>
                    Proceed to Checkout
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Checkout Modal - Only show if payment modal is not visible */}
      <Modal visible={showCheckout && !showPaymentModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 bg-black/70 justify-end"
        >
          <Animated.View
            entering={FadeIn.duration(300)}
            className={`${cardBgClass} rounded-t-3xl p-6 max-h-[80%]`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-6">
              <Text className={`text-2xl font-bold ${textClass}`} style={{ fontFamily: "System", fontWeight: "600" }}>
                Checkout
              </Text>
              <Pressable
                onPress={() => setShowCheckout(false)}
                className={`p-2 rounded-lg ${inputBgClass} active:opacity-70`}
              >
                <Ionicons name="close" size={24} color={isDark ? "#FFF" : "#374151"} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={true}>
              {/* Customer Name */}
              <Text className={`text-sm font-semibold ${textClass} mb-2`}>Customer Name (Optional)</Text>
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Enter customer name"
                placeholderTextColor="#9CA3AF"
                cursorColor="#FFFFFF"
                className={`${inputBgClass} rounded-lg px-4 py-3 text-base ${textClass} mb-4`}
              />

              {/* Payment Method */}
              <Text className={`text-sm font-semibold ${textClass} mb-2`}>Payment Method</Text>
              <View className={`${isDark ? 'bg-gray-800' : 'bg-white border-2 border-gray-300'} rounded-lg mb-4 overflow-hidden`}>
                <Picker
                  selectedValue={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  style={{
                    color: isDark ? "#FFF" : "#000",
                    backgroundColor: isDark ? "#1F2937" : "#FFFFFF"
                  }}
                  dropdownIconColor={isDark ? "#FFF" : "#000"}
                >
                  <Picker.Item label="Cash" value="Cash" color={isDark ? "#FFF" : "#000"} />
                  <Picker.Item label="Card" value="Card" color={isDark ? "#FFF" : "#000"} />
                  <Picker.Item label="GCash" value="GCash" color={isDark ? "#FFF" : "#000"} />
                  <Picker.Item label="Maya" value="Maya" color={isDark ? "#FFF" : "#000"} />
                </Picker>
              </View>

              {/* Notes */}
              <Text className={`text-sm font-semibold ${textClass} mb-2`}>Notes (Optional)</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Add special instructions"
                placeholderTextColor="#9CA3AF"
                cursorColor="#FFFFFF"
                multiline
                numberOfLines={3}
                className={`${inputBgClass} rounded-lg px-4 py-3 text-base ${textClass} mb-6`}
              />

              {/* Order Summary */}
              <View className={`${inputBgClass} rounded-lg p-4 mb-6`}>
                <Text className={`text-base font-bold ${textClass} mb-3`}>Order Summary</Text>
                {Array.from(cart.values()).map((item) => (
                  <View key={item.menuItemId} className="flex-row justify-between mb-2">
                    <Text className={`${textSecondaryClass} flex-1`}>
                      {item.quantity}x {item.menuItemName}
                    </Text>
                    <Text className={`${textClass} font-medium`}>{formatCurrency(item.subtotal)}</Text>
                  </View>
                ))}
                <View className={`border-t ${borderClass} pt-3 mt-3`}>
                  <View className="flex-row justify-between mb-2">
                    <Text className={`${textSecondaryClass} text-sm`}>Subtotal</Text>
                    <Text className={`${textClass} font-medium`}>{formatCurrency(cartTotal.subtotal)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className={`text-lg font-bold ${textClass}`}>Total</Text>
                    <Text className="text-xl font-bold text-cafe-orange">
                      {formatCurrency(cartTotal.total)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Confirm Button */}
              <Pressable
                onPress={handleCheckout}
                disabled={isProcessing}
                className={`bg-cafe-orange py-4 rounded-lg items-center active:opacity-90 ${
                  isProcessing ? "opacity-50" : ""
                }`}
                style={{
                  shadowColor: "#FF7A00",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text className="text-white text-base font-bold" style={{ fontFamily: "System", fontWeight: "600" }}>
                  {isProcessing ? "Processing..." : `Confirm Order - ${formatCurrency(cartTotal.total)}`}
                </Text>
              </Pressable>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Payment Modal */}
      <PaymentModal
        visible={showPaymentModal && createdOrderId !== null}
        onClose={handleCancelPayment}
        orderTotal={cartTotal.total}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Size Selection Modal */}
      <SizeSelectionModal
        visible={showSizeModal}
        item={selectedItemForSize}
        onClose={() => setShowSizeModal(false)}
        onConfirm={handleSizeConfirm}
      />

      {/* Flavor Selection Modal */}
      <FlavorSelectionModal
        visible={showFlavorModal}
        item={selectedItemForFlavor}
        onClose={() => setShowFlavorModal(false)}
        onConfirm={handleFlavorConfirm}
      />

      {/* Add Stock Modal */}
      <Modal
        visible={showAddStockModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddStockModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-6">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={`${cardBgClass} rounded-2xl w-full max-w-md`}
          >
            <View className="p-6">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className={`text-xl font-bold ${textClass}`}>Add Stock</Text>
                <Pressable onPress={() => setShowAddStockModal(false)}>
                  <Ionicons name="close" size={28} color={isDark ? "#FFF" : "#374151"} />
                </Pressable>
              </View>

              {/* Item Info */}
              {selectedItemForStock && (
                <View className="mb-6">
                  <Text className={`text-base font-semibold ${textClass} mb-2`}>
                    {selectedItemForStock.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className={`text-sm ${textSecondaryClass}`}>Current Stock: </Text>
                    <View className={`flex-row items-center px-2 py-1 rounded ml-2 ${
                      selectedItemForStock.stockQuantity < 10 ? "bg-red-500/10" : "bg-green-500/10"
                    }`}>
                      <Ionicons
                        name="cube-outline"
                        size={14}
                        color={selectedItemForStock.stockQuantity < 10 ? "#EF4444" : "#10B981"}
                      />
                      <Text
                        className={`text-sm ml-1 font-bold ${
                          selectedItemForStock.stockQuantity < 10 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {selectedItemForStock.stockQuantity}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Input */}
              <View className="mb-6">
                <Text className={`text-sm font-semibold ${textClass} mb-2`}>
                  Amount to Add *
                </Text>
                <TextInput
                  className={`${inputBgClass} rounded-xl px-4 py-3 text-base ${textClass}`}
                  placeholder="Enter quantity"
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  cursorColor={isDark ? "#FFFFFF" : "#000000"}
                  selectionColor={isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"}
                  keyboardType="number-pad"
                  value={stockToAdd}
                  onChangeText={setStockToAdd}
                  autoFocus
                />
              </View>

              {/* Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setShowAddStockModal(false)}
                  className={`flex-1 py-3 rounded-xl border ${borderClass} active:opacity-70`}
                >
                  <Text className={`text-center font-semibold ${textClass}`}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleAddStock}
                  className="flex-1 bg-cafe-orange py-3 rounded-xl active:opacity-70"
                >
                  <Text className="text-center font-semibold text-white">Add Stock</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
