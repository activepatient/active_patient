import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

const BASE_API = "https://isela-ungrumpy-undiligently.ngrok-free.dev";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  // =============================
  // 🟩 1️⃣ Send OTP to Email
  // =============================
  const handleSendOTP = async () => {
    if (!email) {
      Toast.show("Please enter your email", { backgroundColor: "#ef4444" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_API}/api/Users/forgotPassword/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.status === "Success") {
        Toast.show("OTP sent to your email", { backgroundColor: "#22c55e" });
        setStep("otp");
        setShowModal(true);
      } else {
        Toast.show(data.message || "Failed to send OTP", { backgroundColor: "#ef4444" });
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      Toast.show("Server error. Try again.", { backgroundColor: "#ef4444" });
    } finally {
      setIsLoading(false);
    }
  };

  // =============================
  // 🟦 2️⃣ Verify OTP
  // =============================
  const handleVerifyOtp = async () => {
    if (!otp) {
      Toast.show("Please enter OTP", { backgroundColor: "#ef4444" });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(`${BASE_API}/api/Users/forgotPassword/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (data.status === "Success") {
        Toast.show("OTP verified successfully!", { backgroundColor: "#22c55e" });
        setStep("reset");
        setOtp("");
      } else {
        Toast.show(data.message || "Invalid OTP", { backgroundColor: "#ef4444" });
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      Toast.show("Verification failed", { backgroundColor: "#ef4444" });
    } finally {
      setIsVerifying(false);
    }
  };

  // =============================
  // 🟧 3️⃣ Reset Password
  // =============================
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Toast.show("Please fill both password fields", { backgroundColor: "#ef4444" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show("Passwords do not match", { backgroundColor: "#ef4444" });
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch(`${BASE_API}/api/Users/forgotPassword/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();

      if (data.status === "Success") {
        Toast.show("Password reset successful!", { backgroundColor: "#22c55e" });
        setShowModal(false);
        setTimeout(() => router.replace("/screens/login"), 1200);
      } else {
        Toast.show(data.message || "Password reset failed", { backgroundColor: "#ef4444" });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      Toast.show("Server error", { backgroundColor: "#ef4444" });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>

        {/* Step 1: Email Input */}
        {step === "email" && (
          <>
            <Text style={styles.label}>Email address:</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TouchableOpacity
              style={[styles.button, isLoading && { opacity: 0.7 }]}
              onPress={handleSendOTP}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.link}>
          Remembered your password?{" "}
          <Text style={styles.linkText} onPress={() => router.push("/screens/login")}>
            Sign In
          </Text>
        </Text>
      </View>

      {/* OTP & Reset Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {step === "otp" && (
              <>
                <Text style={styles.modalTitle}>Enter OTP</Text>
                <Text style={styles.modalSubtitle}>Sent to {email}</Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="Enter OTP"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                />
                <TouchableOpacity
                  style={[styles.verifyButton, isVerifying && { opacity: 0.7 }]}
                  onPress={handleVerifyOtp}
                  disabled={isVerifying}
                >
                  {isVerifying ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyText}>Verify</Text>}
                </TouchableOpacity>
              </>
            )}

            {step === "reset" && (
              <>
                <Text style={styles.modalTitle}>Set New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={[styles.verifyButton, isResetting && { opacity: 0.7 }]}
                  onPress={handleResetPassword}
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.verifyText}>Reset Password</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// =============================
// 🎨 Styles
// =============================
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    elevation: 4,
    marginVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "center",
    marginBottom: 20,
  },
  label: { color: "#1e293b", fontWeight: "500", marginBottom: 4 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { marginTop: 20, textAlign: "center", color: "#64748b" },
  linkText: { color: "#6366f1", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  modalSubtitle: { color: "#6b7280", marginTop: 6, textAlign: "center" },
  otpInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    width: "80%",
    textAlign: "center",
    marginTop: 16,
    fontSize: 18,
    letterSpacing: 4,
  },
  verifyButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 18,
  },
  verifyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelText: { color: "#ef4444", marginTop: 10, fontWeight: "600" },
});
