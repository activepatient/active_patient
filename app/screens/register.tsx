

import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

const BASE_API = "https://active-patient.onrender.com";

export default function Register() {
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [gender, setGender] = useState("M");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  // OTP modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const router = useRouter();

  // 📅 Date Picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setDob(formatted);
      setErrors((prev) => ({ ...prev, dob: false }));
    }
  };

  // 🟩 Validate Fields
  const validateFields = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!firstName.trim()) newErrors.firstName = true;
    if (!lastName.trim()) newErrors.lastName = true;
    if (!gender) newErrors.gender = true;
    if (!dob) newErrors.dob = true;
    if (!email.trim()) newErrors.email = true;
    if (!password.trim()) newErrors.password = true;
    if (!mobileNo.trim()) newErrors.mobileNo = true;
    if (!acceptTerms) newErrors.acceptTerms = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Toast.show("Please fill all required fields", { backgroundColor: "#ef4444" });
      return false;
    }
    return true;
  };

  // 🟩 Register
  const handleRegister = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_API}/api/Users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          dob,
          mobile: mobileNo,
          gender,
        }),
      });

      const data = await res.json();
      console.log("Register response:", data);

      if (data.status === "Success") {
        Toast.show("OTP sent to your email", { backgroundColor: "#22c55e" });
        setShowOtpModal(true); // ✅ show modal
      } else {
        Toast.show(data.message || "Registration failed", { backgroundColor: "#ef4444" });
      }
    } catch (err) {
      console.error("Register error:", err);
      Toast.show("Registration failed. Try again.", { backgroundColor: "#ef4444" });
    } finally {
      setIsLoading(false);
    }
  };

  // 🟦 Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      Toast.show("Please enter OTP", { backgroundColor: "#ef4444" });
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(`${BASE_API}/api/Users/verifyEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      console.log("Verify response:", data);

      if (data.status === "Success") {
        Toast.show("✅ Email verified successfully!", { backgroundColor: "#22c55e" });
        setShowOtpModal(false);
        setTimeout(() => router.replace("/screens/login"), 1200);
      } else {
        Toast.show(data.message || "Invalid OTP", { backgroundColor: "#ef4444" });
      }
    } catch (err) {
      console.error("Verification error:", err);
      Toast.show("Verification failed", { backgroundColor: "#ef4444" });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Account</Text>
      </View>

      <View style={styles.card}>
        {/* First Name */}
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          value={firstName}
          onChangeText={(t) => {
            setFirstName(t);
            setErrors((prev) => ({ ...prev, firstName: false }));
          }}
          placeholder="First Name"
          style={[styles.input, errors.firstName && styles.inputError]}
          autoCapitalize="words"
        />

        {/* Last Name */}
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          value={lastName}
          onChangeText={(t) => {
            setLastName(t);
            setErrors((prev) => ({ ...prev, lastName: false }));
          }}
          placeholder="Last Name"
          style={[styles.input, errors.lastName && styles.inputError]}
          autoCapitalize="words"
        />

        {/* Gender */}
        <Text style={styles.label}>Gender *</Text>
        <View style={styles.pickerContainer}>
          {["M", "F", "O"].map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.pickerButton, gender === v && styles.pickerButtonActive]}
              onPress={() => {
                setGender(v);
                setErrors((prev) => ({ ...prev, gender: false }));
              }}
            >
              <Text style={gender === v ? styles.pickerTextActive : styles.pickerText}>
                {v === "M" ? "Male" : v === "F" ? "Female" : "Others"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DOB Date Picker */}
        <Text style={styles.label}>Date of Birth *</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <View
            style={[
              styles.input,
              { justifyContent: "center" },
              errors.dob && styles.inputError,
            ]}
          >
            <Text style={{ color: dob ? "#111" : "#9ca3af" }}>
              {dob || "Select Date of Birth"}
            </Text>
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dob ? new Date(dob) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Email */}
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setErrors((prev) => ({ ...prev, email: false }));
          }}
          placeholder="Email"
          style={[styles.input, errors.email && styles.inputError]}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <Text style={styles.label}>Password *</Text>
        <TextInput
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setErrors((prev) => ({ ...prev, password: false }));
          }}
          placeholder="Enter password"
          style={[styles.input, errors.password && styles.inputError]}
          secureTextEntry
        />

        {/* Mobile */}
        <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          value={mobileNo}
          onChangeText={(t) => {
            setMobileNo(t);
            setErrors((prev) => ({ ...prev, mobileNo: false }));
          }}
          placeholder="Mobile Number"
          style={[styles.input, errors.mobileNo && styles.inputError]}
          keyboardType="phone-pad"
          maxLength={10}
        />

        {/* Accept terms */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => {
              setAcceptTerms(!acceptTerms);
              setErrors((prev) => ({ ...prev, acceptTerms: false }));
            }}
            style={[styles.checkboxBox, acceptTerms && styles.checkboxBoxChecked]}
          >
            {acceptTerms && <View style={styles.checkboxTick} />}
          </TouchableOpacity>
          <Text style={{ marginLeft: 8 }}>
            Accept terms and conditions *
          </Text>
        </View>
        {errors.acceptTerms && (
          <Text style={{ color: "#ef4444", fontSize: 13, marginTop: 4 }}>
            You must accept terms to proceed.
          </Text>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Register</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* OTP Modal */}
      <Modal visible={showOtpModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>Sent to {email}</Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter 6-digit OTP"
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
              {isVerifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.verifyText}>Verify</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowOtpModal(false)}>
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
    padding: 12,
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  header: { marginBottom: 24 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    width: "100%",
    maxWidth: 400,
    elevation: 4,
    marginBottom: 16,
  },
  label: { fontWeight: "500", color: "#111827", marginTop: 10 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 4,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  pickerContainer: { flexDirection: "row", gap: 8, marginTop: 4 },
  pickerButton: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  pickerButtonActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  pickerText: { color: "#1e293b" },
  pickerTextActive: { color: "#fff" },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 18,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBoxChecked: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  checkboxTick: { width: 12, height: 12, backgroundColor: "#fff", borderRadius: 2 },
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
  modalSubtitle: { color: "#6b7280", marginTop: 6 },
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
