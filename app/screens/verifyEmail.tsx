import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";

const BASE_API = "https://isela-ungrumpy-undiligently.ngrok-free.dev";

export default function VerifyEmail() {
  const { email } = useLocalSearchParams(); // ✅ get email passed from register
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!otp) {
      Toast.show("Please enter OTP", { backgroundColor: "#ef4444" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_API}/api/Users/verifyEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }), // ✅ send email automatically
      });

      const data = await res.json();
      console.log("Verify response:", data);

      if (data.status === "Success") {
        Toast.show("✅ Email verified successfully!", { backgroundColor: "#22c55e" });
        setTimeout(() => router.replace("/screens/login"), 1200);
      } else {
        Toast.show(data.message || "Invalid OTP", { backgroundColor: "#ef4444" });
      }
    } catch (err) {
      console.error("Verification error:", err);
      Toast.show("Verification failed", { backgroundColor: "#ef4444" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Verify Your Email</Text>

      {/* ✅ Display email as static text, not editable */}
      <View style={styles.emailContainer}>
        <Text style={styles.label}>Email Address</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <Text style={styles.label}>OTP Code</Text>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter 6-digit code"
        keyboardType="number-pad"
        maxLength={6}
      />

      <TouchableOpacity style={[styles.button, isLoading && { opacity: 0.7 }]} onPress={handleVerify} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f8fafc" },
  header: { fontSize: 26, color: "#2563eb", fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  label: { fontSize: 15, fontWeight: "500", color: "#111827" },
  emailContainer: { marginBottom: 15 },
  emailText: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    color: "#374151",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderColor: "#d1d5db",
    borderWidth: 1,
    marginTop: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
