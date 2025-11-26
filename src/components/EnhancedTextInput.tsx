import React from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";

interface EnhancedTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

/**
 * Enhanced TextInput component with prominent white blinking cursor
 * Features:
 * - Bright white blinking cursor for maximum visibility
 * - Clean modern design
 * - Optional label and error message support
 * - Consistent styling across the app
 */
export const EnhancedTextInput: React.FC<EnhancedTextInputProps> = ({
  label,
  error,
  containerClassName = "",
  className = "",
  ...textInputProps
}) => {
  return (
    <View className={containerClassName}>
      {label && (
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          {label}
        </Text>
      )}
      <TextInput
        className={`bg-white border ${error ? "border-red-500" : "border-gray-200"} rounded-xl px-4 py-3 text-base text-gray-900 ${className}`}
        placeholderTextColor="#9CA3AF"
        cursorColor="#FFFFFF"
        selectionColor="rgba(59, 130, 246, 0.3)"
        {...textInputProps}
      />
      {error && (
        <Text className="text-xs text-red-600 mt-1">{error}</Text>
      )}
    </View>
  );
};

export default EnhancedTextInput;
