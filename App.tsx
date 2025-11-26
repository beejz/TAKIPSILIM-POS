import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "./src/state/authStore";
import { useOrderStore } from "./src/state/orderStore";
import LoginScreen from "./src/screens/LoginScreen";
import MainNavigator from "./src/navigation/MainNavigator";
import { useEffect } from "react";

/*
IMPORTANT NOTICE: DO NOT REMOVE
There are already environment keys in the project.
Before telling the user to add them, check if you already have access to the required keys through bash.
Directly access them with process.env.${key}

Correct usage:
process.env.EXPO_PUBLIC_VIBECODE_{key}
//directly access the key

Incorrect usage:
import { OPENAI_API_KEY } from '@env';
//don't use @env, its depreicated

Incorrect usage:
import Constants from 'expo-constants';
const openai_api_key = Constants.expoConfig.extra.apikey;
//don't use expo-constants, its depreicated

*/

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fixInconsistentOrders = useOrderStore((state) => state.fixInconsistentOrders);

  // Fix inconsistent orders on app startup
  useEffect(() => {
    fixInconsistentOrders();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          {isAuthenticated ? <MainNavigator /> : <LoginScreen />}
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
