import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "../state/authStore";

// Screens
import DashboardScreen from "../screens/DashboardScreen";
import OrdersScreen from "../screens/OrdersScreen";
import CreateOrderScreen from "../screens/CreateOrderScreen";
import MenuScreen from "../screens/MenuScreen";
import InventoryScreen from "../screens/InventoryScreen";
import PurchasesScreen from "../screens/PurchasesScreen";
import SalesScreen from "../screens/SalesScreen";
import POSScreen from "../screens/POSScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrdersList"
        component={OrdersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateOrder"
        component={CreateOrderScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function DrawerContent({ navigation }: any) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  // Different menu items based on role
  const adminMenuItems = [
    { name: "Dashboard", icon: "home" as const, screen: "Dashboard" },
    { name: "Orders", icon: "receipt" as const, screen: "Orders" },
    { name: "Menu", icon: "restaurant" as const, screen: "Menu" },
    { name: "Inventory", icon: "cube" as const, screen: "Inventory" },
    { name: "Purchases", icon: "cart" as const, screen: "Purchases" },
    { name: "Sales Report", icon: "stats-chart" as const, screen: "Sales" },
  ];

  const staffMenuItems = [
    { name: "POS System", icon: "calculator" as const, screen: "POS" },
    { name: "Orders", icon: "receipt" as const, screen: "Orders" },
    { name: "Order History", icon: "time" as const, screen: "OrderHistory" },
    { name: "Menu (View)", icon: "restaurant" as const, screen: "Menu" },
    { name: "Inventory (View)", icon: "cube" as const, screen: "Inventory" },
  ];

  const menuItems = currentUser?.role === "admin" ? adminMenuItems : staffMenuItems;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-cafe-brown px-6 pt-16 pb-8">
        <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-4">
          <Ionicons name="cafe" size={32} color="#5A3825" />
        </View>
        <Text className="text-white text-xl font-bold">Takipsilim Café</Text>
        <Text className="text-cafe-cream text-sm mt-1">{currentUser?.name}</Text>
        <View className="bg-cafe-dark-brown px-3 py-1 rounded-full mt-2 self-start">
          <Text className="text-cafe-cream text-xs font-semibold">
            {currentUser?.role === "admin" ? "BACK-OFFICE" : "POS STAFF"}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View className="flex-1 py-4">
        {menuItems.map((item) => (
          <Pressable
            key={item.name}
            onPress={() => navigation.navigate(item.screen)}
            className="flex-row items-center px-6 py-4 active:bg-gray-50"
          >
            <View className="w-10 h-10 bg-cafe-cream rounded-xl items-center justify-center mr-4">
              <Ionicons name={item.icon} size={20} color="#5A3825" />
            </View>
            <Text className="text-gray-900 text-base font-semibold">{item.name}</Text>
          </Pressable>
        ))}
      </View>

      {/* Logout */}
      <View className="border-t border-gray-200 px-6 py-4">
        <Pressable
          onPress={logout}
          className="flex-row items-center py-3 active:opacity-70"
        >
          <Ionicons name="log-out-outline" size={24} color="#DC2626" />
          <Text className="text-red-600 text-base font-semibold ml-3">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function MainNavigator() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName={currentUser?.role === "staff" ? "POS" : "Dashboard"}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTintColor: "#374151",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerType: "slide",
      }}
    >
      {/* POS Screen - Staff primary screen */}
      <Drawer.Screen
        name="POS"
        component={POSScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Purchases"
        component={PurchasesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Sales"
        component={SalesScreen}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}
