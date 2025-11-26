import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../state/authStore";
import { useMenuStore } from "../state/menuStore";
import { useInventoryStore } from "../state/inventoryStore";
import { Ionicons } from "@expo/vector-icons";
import { UserRole } from "../types/cafe";

type AuthStep = "google" | "role" | "password" | "setup-password";

export default function LoginScreen() {
  const [step, setStep] = useState<AuthStep>("google");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  // Google account simulation
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  const {
    googleEmail: storedGoogleEmail,
    setGoogleAccount,
    login,
    setupRolePassword,
    isRolePasswordSet,
  } = useAuthStore();

  const initializeMenu = useMenuStore((state) => state.initializeSampleData);
  const initializeInventory = useInventoryStore((state) => state.initializeSampleData);

  // Check if Google account is already connected
  useEffect(() => {
    if (storedGoogleEmail) {
      setStep("role");
    }
  }, [storedGoogleEmail]);

  // Simulated Google Sign-In (Replace with real Google OAuth when ready)
  const handleGoogleSignIn = () => {
    setError("");

    if (!googleEmail.trim() || !googleName.trim()) {
      setError("Please enter your Google email and name");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(googleEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    // Save Google account info
    setGoogleAccount(googleEmail, googleName);
    setStep("role");
  };

  const handleRoleSelection = (role: UserRole) => {
    setError("");
    setSelectedRole(role);
    setPassword("");
    setConfirmPassword("");

    // Check if password is already set for this role
    if (isRolePasswordSet(role)) {
      setStep("password");
    } else {
      setStep("setup-password");
    }
  };

  const handleSetupPassword = () => {
    setError("");

    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!selectedRole) return;

    const success = setupRolePassword(selectedRole, password);
    if (success) {
      Alert.alert(
        "Success",
        `${selectedRole === "admin" ? "Admin" : "Staff"} password has been set. You can now log in.`,
        [
          {
            text: "OK",
            onPress: () => {
              setPassword("");
              setConfirmPassword("");
              setStep("password");
            },
          },
        ]
      );
    } else {
      setError("Failed to setup password. Please connect Google account first.");
    }
  };

  const handleLogin = () => {
    setError("");

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    if (!selectedRole) return;

    const success = login(selectedRole, password);
    if (success) {
      // Initialize sample data on first login
      const menuItems = useMenuStore.getState().items;
      const inventoryItems = useInventoryStore.getState().items;

      if (menuItems.length === 0) {
        console.log("[LoginScreen] Initializing menu and inventory on first login");
        initializeMenu();
        initializeInventory();
      } else if (inventoryItems.length === 0) {
        console.log("[LoginScreen] Menu exists but inventory is empty, initializing inventory");
        initializeInventory();
      }
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const handleBack = () => {
    setError("");
    setPassword("");
    setConfirmPassword("");
    setSelectedRole(null);
    if (step === "password" || step === "setup-password") {
      setStep("role");
    } else if (step === "role") {
      setStep("google");
    }
  };

  // Google Sign-In Step
  if (step === "google") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView contentContainerClassName="flex-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View className="flex-1 px-6 justify-center">
              {/* Logo/Header */}
              <View className="items-center mb-12">
                <Image
                  source={require("../../assets/image-1763001252.jpeg")}
                  style={{ width: 150, height: 150, borderRadius: 75 }}
                  resizeMode="cover"
                />
                <Text className="text-3xl font-bold text-gray-900 mt-6">Takipsilim Café</Text>
                <Text className="text-base text-gray-600 mt-2">Connect with Google to continue</Text>
              </View>

              {/* Google Sign-In Form */}
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-2">Google Email</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                    <Ionicons name="mail-outline" size={20} color="#6B7280" />
                    <TextInput
                      style={{ flex: 1, marginLeft: 12, fontSize: 16, color: "#111827" }}
                      placeholder="your.email@gmail.com"
                      placeholderTextColor="#9CA3AF"
                      cursorColor="#000000"
                      selectionColor="rgba(0, 0, 0, 0.3)"
                      value={googleEmail}
                      onChangeText={setGoogleEmail}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      autoFocus
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-2">Full Name</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                    <Ionicons name="person-outline" size={20} color="#6B7280" />
                    <TextInput
                      style={{ flex: 1, marginLeft: 12, fontSize: 16, color: "#111827" }}
                      placeholder="Your full name"
                      placeholderTextColor="#9CA3AF"
                      cursorColor="#000000"
                      selectionColor="rgba(0, 0, 0, 0.3)"
                      value={googleName}
                      onChangeText={setGoogleName}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {error ? (
                  <View className="bg-red-50 border border-red-300 rounded-xl px-4 py-3">
                    <Text className="text-sm font-semibold text-red-700">{error}</Text>
                  </View>
                ) : null}

                <Pressable onPress={handleGoogleSignIn} className="bg-amber-600 rounded-xl py-4 items-center active:bg-amber-700 mt-2">
                  <View className="flex-row items-center">
                    <Ionicons name="logo-google" size={20} color="white" />
                    <Text className="text-white text-base font-semibold ml-2">Connect with Google</Text>
                  </View>
                </Pressable>
              </View>

              {/* Info Box */}
              <View className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <View className="flex-row items-start">
                  <Ionicons name="information-circle" size={20} color="#1E40AF" />
                  <View className="flex-1 ml-2">
                    <Text className="text-sm font-semibold text-blue-900 mb-1">Secure Authentication</Text>
                    <Text className="text-xs text-blue-700">
                      This simulates Google Sign-In for demo purposes. In production, this will use real Google OAuth authentication.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Role Selection Step
  if (step === "role") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 px-6 justify-center">
          {/* Header */}
          <View className="items-center mb-12">
            <Image
              source={require("../../assets/image-1763001252.jpeg")}
              style={{ width: 120, height: 120, borderRadius: 60 }}
              resizeMode="cover"
            />
            <Text className="text-2xl font-bold text-gray-900 mt-6">Select Your Role</Text>
            <Text className="text-sm text-gray-600 mt-2">{storedGoogleEmail}</Text>
          </View>

          {/* Role Cards */}
          <View className="space-y-4">
            <Pressable
              onPress={() => handleRoleSelection("admin")}
              className="bg-white border-2 border-amber-600 rounded-2xl p-6 active:bg-amber-50"
            >
              <View className="flex-row items-center">
                <View className="bg-amber-100 p-3 rounded-xl">
                  <Ionicons name="shield-checkmark" size={32} color="#D97706" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-xl font-bold text-gray-900">Admin</Text>
                  <Text className="text-sm text-gray-600 mt-1">Full system access and management</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#D97706" />
              </View>
            </Pressable>

            <Pressable
              onPress={() => handleRoleSelection("staff")}
              className="bg-white border-2 border-blue-600 rounded-2xl p-6 active:bg-blue-50"
            >
              <View className="flex-row items-center">
                <View className="bg-blue-100 p-3 rounded-xl">
                  <Ionicons name="people" size={32} color="#2563EB" />
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-xl font-bold text-gray-900">Staff</Text>
                  <Text className="text-sm text-gray-600 mt-1">POS and order management</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#2563EB" />
              </View>
            </Pressable>
          </View>

          {/* Back Button */}
          <Pressable onPress={handleBack} className="mt-8 py-3 items-center active:opacity-70">
            <Text className="text-gray-600 text-base font-medium">Change Google Account</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Setup Password Step
  if (step === "setup-password" && selectedRole) {
    const isAdmin = selectedRole === "admin";

    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView contentContainerClassName="flex-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View className="flex-1 px-6 justify-center">
              {/* Header */}
              <View className="items-center mb-12">
                <View className={`${isAdmin ? "bg-amber-100" : "bg-blue-100"} p-4 rounded-full`}>
                  <Ionicons
                    name={isAdmin ? "shield-checkmark" : "people"}
                    size={48}
                    color={isAdmin ? "#D97706" : "#2563EB"}
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mt-6">
                  Setup {isAdmin ? "Admin" : "Staff"} Password
                </Text>
                <Text className="text-base text-gray-600 mt-2">Create a secure password for {selectedRole} access</Text>
              </View>

              {/* Password Setup Form */}
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-2">Password</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                    <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                    <TextInput
                      style={{ flex: 1, marginLeft: 12, fontSize: 16, color: "#111827" }}
                      placeholder="Enter password (min 6 characters)"
                      placeholderTextColor="#9CA3AF"
                      cursorColor="#000000"
                      selectionColor="rgba(0, 0, 0, 0.3)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoFocus
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6B7280" />
                    </Pressable>
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-2">Confirm Password</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                    <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                    <TextInput
                      style={{ flex: 1, marginLeft: 12, fontSize: 16, color: "#111827" }}
                      placeholder="Re-enter password"
                      placeholderTextColor="#9CA3AF"
                      cursorColor="#000000"
                      selectionColor="rgba(0, 0, 0, 0.3)"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6B7280" />
                    </Pressable>
                  </View>
                </View>

                {error ? (
                  <View className="bg-red-50 border border-red-300 rounded-xl px-4 py-3">
                    <Text className="text-sm font-semibold text-red-700">{error}</Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={handleSetupPassword}
                  className={`${isAdmin ? "bg-amber-600 active:bg-amber-700" : "bg-blue-600 active:bg-blue-700"} rounded-xl py-4 items-center mt-2`}
                >
                  <Text className="text-white text-base font-semibold">Setup Password</Text>
                </Pressable>
              </View>

              {/* Back Button */}
              <Pressable onPress={handleBack} className="mt-8 py-3 items-center active:opacity-70">
                <Text className="text-gray-600 text-base font-medium">Back to Role Selection</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Login with Password Step
  if (step === "password" && selectedRole) {
    const isAdmin = selectedRole === "admin";

    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView contentContainerClassName="flex-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View className="flex-1 px-6 justify-center">
              {/* Header */}
              <View className="items-center mb-12">
                <View className={`${isAdmin ? "bg-amber-100" : "bg-blue-100"} p-4 rounded-full`}>
                  <Ionicons
                    name={isAdmin ? "shield-checkmark" : "people"}
                    size={48}
                    color={isAdmin ? "#D97706" : "#2563EB"}
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mt-6">
                  {isAdmin ? "Admin" : "Staff"} Login
                </Text>
                <Text className="text-base text-gray-600 mt-2">Enter your password</Text>
              </View>

              {/* Password Form */}
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-semibold text-gray-800 mb-2">Password</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
                    <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                    <TextInput
                      style={{ flex: 1, marginLeft: 12, fontSize: 16, color: "#111827" }}
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      cursorColor="#000000"
                      selectionColor="rgba(0, 0, 0, 0.3)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoFocus
                      onSubmitEditing={handleLogin}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6B7280" />
                    </Pressable>
                  </View>
                </View>

                {error ? (
                  <View className="bg-red-50 border border-red-300 rounded-xl px-4 py-3">
                    <Text className="text-sm font-semibold text-red-700">{error}</Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={handleLogin}
                  className={`${isAdmin ? "bg-amber-600 active:bg-amber-700" : "bg-blue-600 active:bg-blue-700"} rounded-xl py-4 items-center mt-2`}
                >
                  <Text className="text-white text-base font-semibold">Sign In</Text>
                </Pressable>
              </View>

              {/* Back Button */}
              <Pressable onPress={handleBack} className="mt-8 py-3 items-center active:opacity-70">
                <Text className="text-gray-600 text-base font-medium">Back to Role Selection</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return null;
}
