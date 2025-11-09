// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import Toast from "react-native-root-toast";
// import { useAuth } from "../../components/authContext";
// import { ChangePasswordAPI } from "../../services/api";

// export default function ChangePasswordScreen() {
//   const { user } = useAuth();
//   const [message, setMessage] = useState<string | null>(null);
//   const [status, setStatus] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordMatchError, setPasswordMatchError] = useState("");
//   const email = user?.email || "";
//   const router = useRouter();

//   const handlePasswordChange = (value: string) => {
//     setNewPassword(value);
//     validatePasswords(value, confirmPassword);
//   };

//   const handleConfirmPasswordChange = (value: string) => {
//     setConfirmPassword(value);
//     validatePasswords(newPassword, value);
//   };

//   const validatePasswords = (pwd: string, confirmPwd: string) => {
//     if (pwd !== confirmPwd) {
//       setPasswordMatchError("Passwords do not match");
//     } else {
//       setPasswordMatchError("");
//     }
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     if (newPassword === confirmPassword && currentPassword !== "") {
//       const res = await ChangePasswordAPI({ email, CurrentPassword: currentPassword, NewPassword: newPassword, ConfirmPassword: confirmPassword });
//       setStatus(res.status);
//       setMessage(res.message);
//       if (res.status === "Success") {
//         Toast.show(res.message, { backgroundColor: "#22c55e" });
//         setCurrentPassword("");
//         setNewPassword("");
//         setConfirmPassword("");
//       } else {
//         Toast.show(res.message, { backgroundColor: "#ef4444" });
//       }
//     } else {
//       setPasswordMatchError("Please ensure passwords match and are not empty.");
//     }
//     setIsLoading(false);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Change Password</Text>
//       </View>
//       <View style={styles.card}>
//         <View>
//           <Text style={styles.label}>Current Password</Text>
//           <TextInput
//             value={currentPassword}
//             onChangeText={setCurrentPassword}
//             placeholder="Enter current password"
//             secureTextEntry
//             style={styles.input}
//           />
//         </View>
//         <View>
//           <Text style={styles.label}>New Password</Text>
//           <TextInput
//             value={newPassword}
//             onChangeText={handlePasswordChange}
//             placeholder="Enter new password"
//             secureTextEntry
//             style={styles.input}
//           />
//         </View>
//         <View>
//           <Text style={styles.label}>Confirm Password</Text>
//           <TextInput
//             value={confirmPassword}
//             onChangeText={handleConfirmPasswordChange}
//             placeholder="Re-enter new password"
//             secureTextEntry
//             style={styles.input}
//           />
//           {passwordMatchError ? (
//             <Text style={{ color: "red", marginTop: 2 }}>{passwordMatchError}</Text>
//           ) : null}
//         </View>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={handleSubmit}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit</Text>
//           )}
//         </TouchableOpacity>
//         <Text style={styles.link}>
//           You can
//           <Text
//             style={styles.linkText}
//             onPress={() => router.push("/screens/login")}
//           > Sign In </Text>
//           to your account.
//         </Text>
//         {message ? (
//           <Text
//             style={{
//               marginTop: 12,
//               color: status === "Success" ? "#22c55e" : "#ef4444",
//               textAlign: "center",
//             }}
//           >
//             {message}
//           </Text>
//         ) : null}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     backgroundColor: "#f3f4f6",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   header: {
//     marginTop: 24,
//     marginBottom: 8,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#2563eb",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 24,
//     width: "100%",
//     maxWidth: 400,
//     alignSelf: "center",
//     elevation: 4,
//     marginTop: 10,
//     marginBottom: 30,
//   },
//   label: {
//     color: "#1e293b",
//     fontWeight: "500",
//     marginBottom: 4,
//   },
//   input: {
//     backgroundColor: "#fff",
//     borderColor: "#d1d5db",
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     marginTop: 4,
//     marginBottom: 16,
//   },
//   button: {
//     backgroundColor: "#4f46e5",
//     borderRadius: 8,
//     padding: 12,
//     alignItems: "center",
//     marginTop: 8,
//   },
//   link: {
//     marginTop: 28,
//     textAlign: "center",
//     color: "#64748b",
//   },
//   linkText: {
//     color: "#6366f1",
//     fontWeight: "bold",
//     marginLeft: 2,
//   },
// });


import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

const BASE_API = "https://isela-ungrumpy-undiligently.ngrok-free.dev";

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  // Unified feedback: haptic + toast + alert
  const notify = (msg: string, success = false) => {
    if (success) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Toast.show(msg, {
      duration: Toast.durations.SHORT,
      backgroundColor: success ? "#22c55e" : "#ef4444",
      textColor: "#fff",
      position: Toast.positions.BOTTOM,
    });

    Alert.alert(success ? "Success" : "Error", msg);
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      notify("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      notify("New password and Confirm password do not match");
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        notify("Session expired, please login again");
        router.replace("/screens/login");
        return;
      }

      const res = await fetch(`${BASE_API}/api/Users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      console.log("Change password response:", data);

      if (data.status === "Success") {
        notify("Password changed successfully!", true);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => router.replace("/screens/login"), 2000);
      } else if (
        data.message?.toLowerCase().includes("old password") ||
        data.status === "Error"
      ) {
        notify("Old password is incorrect");
      } else {
        notify(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Change Password Error:", err);
      notify("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Change Password</Text>

        {/* Old Password */}
        <Text style={styles.label}>Old Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={!showOld}
            placeholder="Enter old password"
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity onPress={() => setShowOld(!showOld)}>
            <Text style={styles.toggle}>{showOld ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        {/* New Password */}
        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={!showNew}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNew(!showNew)}>
            <Text style={styles.toggle}>{showNew ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={!showConfirm}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Text style={styles.toggle}>{showConfirm ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Change Password</Text>
          )}
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity onPress={() => router.push("/screens/forgotpassword")}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// =========================
// 🎨 Styles
// =========================
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "center",
    marginBottom: 20,
  },
  label: { color: "#1e293b", fontWeight: "500", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  toggle: {
    marginLeft: 8,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: {
    color: "#6366f1",
    textAlign: "center",
    marginTop: 18,
    fontWeight: "500",
  },
});

