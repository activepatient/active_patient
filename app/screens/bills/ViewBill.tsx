import React from "react";
import { View, ActivityIndicator, Alert, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function ViewBill() {
  const { fileUrl } = useLocalSearchParams<{ fileUrl: string }>();
  const router = useRouter();

  // 🧠 fileUrl can be:
  // - Base64: data:application/pdf;base64,XXXX
  // - Base64 image: data:image/jpeg;base64,XXXX
  // - Remote URL: https://...
  // We'll load it directly in WebView.

  if (!fileUrl) {
    Alert.alert("Error", "No file provided!");
    router.back();
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: Platform.OS === "ios" ? 48 : 28,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#4f46e5" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Ionicons name="document-text-outline" size={22} color="#4f46e5" />
        </View>
      </View>

      {/* File Viewer */}
      <WebView
        originWhitelist={["*"]}
        source={{ uri: fileUrl }}
        style={{ flex: 1 }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="#4f46e5"
            style={{ marginTop: 50 }}
          />
        )}
      />
    </View>
  );
}
