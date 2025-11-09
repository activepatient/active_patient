

// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Pressable,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Toast from "react-native-root-toast";
// import { useAuth } from "../../components/authContext";

// const BASE_API = "https://isela-ungrumpy-undiligently.ngrok-free.dev";

// export default function LoginScreen() {
//   const [selectedTab, setSelectedTab] = useState<"web" | "mobile">("web");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState<"Success" | "Error" | null>(null);
//   const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

//   const router = useRouter();
//   const { login } = useAuth();

//   // 🟩 Validate Inputs
//   const validateInputs = () => {
//     const newErrors: { [key: string]: boolean } = {};
//     if (selectedTab === "web") {
//       if (!email.trim()) newErrors.email = true;
//       if (!password.trim()) newErrors.password = true;
//     } else {
//       if (!mobile.trim()) newErrors.mobile = true;
//       if (!otp.trim()) newErrors.otp = true;
//     }
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) {
//       Toast.show("Please fill all required fields", { backgroundColor: "#ef4444" });
//       return false;
//     }
//     return true;
//   };

//   // 🟦 Login Handler
//   const handleLogin = async () => {
//     if (!validateInputs()) return;

//     setIsLoading(true);
//     setMessage("");
//     setStatus(null);

//     try {
//       const payload =
//         selectedTab === "web" ? { email, password } : { mobile, otp };

//       const res = await fetch(`${BASE_API}/api/Users/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       console.log("Login response:", data);

//       if (data.status === "Success") {
//         const user = data.user || {};
//         const token = data.token || "";
//         await login(user, token);

//         setStatus("Success");
//         setMessage(data.message || "Login successful!");
//         Toast.show("✅ Login successful", { backgroundColor: "#22c55e" });

//         setTimeout(() => router.replace("/screens/dashboardscreen"), 800);
//       } else {
//         setStatus("Error");
//         setMessage(data.message || "Invalid credentials");
//         Toast.show(data.message || "Invalid credentials", { backgroundColor: "#ef4444" });
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setStatus("Error");
//       setMessage("Login failed, please try again.");
//       Toast.show("Login failed, please try again.", { backgroundColor: "#ef4444" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSocialAuth = (provider: string) => {
//     Alert.alert("Coming Soon", `${provider} login not implemented yet.`);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Active Patient</Text>

//       {/* 🔹 Tabs */}
//       <View style={styles.tabs}>
//         <TouchableOpacity
//           style={[styles.tab, selectedTab === "web" && styles.selectedTab]}
//           onPress={() => setSelectedTab("web")}
//         >
//           <Text
//             style={
//               selectedTab === "web" ? styles.selectedTabText : styles.tabText
//             }
//           >
//             Web
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.tab, selectedTab === "mobile" && styles.selectedTab]}
//           onPress={() => setSelectedTab("mobile")}
//         >
//           <Text
//             style={
//               selectedTab === "mobile"
//                 ? styles.selectedTabText
//                 : styles.tabText
//             }
//           >
//             Mobile
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* 🔹 Login Form */}
//       <View style={styles.form}>
//         {selectedTab === "web" ? (
//           <>
//             <Text style={styles.label}>Email address *</Text>
//             <TextInput
//               style={[styles.input, errors.email && styles.inputError]}
//               value={email}
//               onChangeText={(t) => {
//                 setEmail(t);
//                 setErrors((prev) => ({ ...prev, email: false }));
//               }}
//               placeholder="Enter your email"
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />

//             <View style={styles.row}>
//               <Text style={styles.label}>Password *</Text>
//               <Pressable
//                 onPress={() => router.push("/screens/forgotpassword")}
//                 style={styles.forgotLink}
//               >
//                 <Text style={{ color: "#2563eb" }}>Forgot password?</Text>
//               </Pressable>
//             </View>

//             {/* 🔒 Password with Eye Toggle */}
//             <View style={styles.passwordContainer}>
//               <TextInput
//                 style={[styles.input, { flex: 1 }, errors.password && styles.inputError]}
//                 value={password}
//                 onChangeText={(t) => {
//                   setPassword(t);
//                   setErrors((prev) => ({ ...prev, password: false }));
//                 }}
//                 placeholder="Enter your password"
//                 secureTextEntry={!showPassword}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 style={styles.eyeIconContainer}
//               >
//                 <Ionicons
//                   name={showPassword ? "eye-outline" : "eye-off-outline"}
//                   size={22}
//                   color="#6b7280"
//                 />
//               </TouchableOpacity>
//             </View>
//           </>
//         ) : (
//           <>
//             <Text style={styles.label}>Mobile Number *</Text>
//             <TextInput
//               style={[styles.input, errors.mobile && styles.inputError]}
//               value={mobile}
//               onChangeText={(t) => {
//                 setMobile(t);
//                 setErrors((prev) => ({ ...prev, mobile: false }));
//               }}
//               placeholder="Enter your mobile number"
//               keyboardType="phone-pad"
//               maxLength={10}
//             />

//             <View style={styles.row}>
//               <Text style={styles.label}>One-Time Password (OTP) *</Text>
//               <Pressable
//                 onPress={() => router.push("/screens/forgotpassword")}
//                 style={styles.forgotLink}
//               >
//                 <Text style={{ color: "#2563eb" }}>Forgot password?</Text>
//               </Pressable>
//             </View>

//             <TextInput
//               style={[styles.input, errors.otp && styles.inputError]}
//               value={otp}
//               onChangeText={(t) => {
//                 setOtp(t);
//                 setErrors((prev) => ({ ...prev, otp: false }));
//               }}
//               placeholder="Enter OTP"
//               keyboardType="number-pad"
//               maxLength={6}
//             />
//           </>
//         )}

//         {/* 🔹 Submit */}
//         <TouchableOpacity
//           style={[styles.button, isLoading && { opacity: 0.7 }]}
//           onPress={handleLogin}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Login</Text>
//           )}
//         </TouchableOpacity>

//         {message ? (
//           <Text
//             style={{
//               color: status === "Success" ? "green" : "red",
//               textAlign: "center",
//               marginTop: 16,
//             }}
//           >
//             {message}
//           </Text>
//         ) : null}
//       </View>

//       {/* 🔹 Social Auth */}
//       <View style={styles.socials}>
//         <Text style={styles.or}>Or continue with</Text>
//         <View style={styles.socialButtons}>
//           {["Google", "LinkedIn", "Twitter"].map((p) => (
//             <TouchableOpacity
//               key={p}
//               onPress={() => handleSocialAuth(p)}
//               style={styles.socialButton}
//             >
//               <Text>{p === "Google" ? "G" : p === "LinkedIn" ? "in" : "Tw"}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* 🔹 Register Link */}
//       <Text style={styles.registerLink}>
//         Not a member?{" "}
//         <Text
//           style={{ color: "#2563eb" }}
//           onPress={() => router.push("/screens/register")}
//         >
//           Create Account
//         </Text>
//       </Text>
//     </View>
//   );
// }

// // =============================
// // 🎨 Styles
// // =============================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#f1f5f9",
//   },
//   header: {
//     fontSize: 26,
//     color: "#2563eb",
//     textAlign: "center",
//     fontWeight: "bold",
//     marginBottom: 24,
//   },
//   tabs: {
//     flexDirection: "row",
//     marginBottom: 18,
//     backgroundColor: "#e5e7eb",
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
//   selectedTab: {
//     backgroundColor: "#fff",
//     borderBottomWidth: 2,
//     borderBottomColor: "#2563eb",
//   },
//   tabText: { color: "#64748b" },
//   selectedTabText: { color: "#2563eb", fontWeight: "bold" },
//   form: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//   },
//   label: {
//     marginTop: 12,
//     marginBottom: 4,
//     color: "#111",
//     fontWeight: "500",
//   },
//   input: {
//     backgroundColor: "#f1f5f9",
//     padding: 10,
//     borderRadius: 8,
//     fontSize: 16,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//   },
//   inputError: { borderColor: "#ef4444" },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     position: "relative",
//   },
//   eyeIconContainer: {
//     position: "absolute",
//     right: 12,
//     padding: 6,
//   },
//   button: {
//     backgroundColor: "#2563eb",
//     padding: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 12,
//   },
//   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   row: { flexDirection: "row", justifyContent: "space-between" },
//   forgotLink: { marginBottom: 4 },
//   socials: { marginTop: 24, alignItems: "center" },
//   or: { color: "#64748b", marginBottom: 10 },
//   socialButtons: { flexDirection: "row", gap: 10 },
//   socialButton: {
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 8,
//     marginHorizontal: 4,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   registerLink: {
//     marginTop: 36,
//     color: "#64748b",
//     textAlign: "center",
//   },
// });








import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { useAuth } from "../../components/authContext";

// ✅ Must be called once per app for proper OAuth redirect handling
WebBrowser.maybeCompleteAuthSession();

const BASE_API = "https://isela-ungrumpy-undiligently.ngrok-free.dev";

export default function LoginScreen() {
  const [selectedTab, setSelectedTab] = useState<"web" | "mobile">("web");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"Success" | "Error" | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();
  const { login } = useAuth();

  // 🔍 Log actual redirect URI (copy this to Google Cloud if needed)
  const redirectUri = AuthSession.makeRedirectUri({
  // @ts-ignore
  useProxy: true,
  path: "redirect",
  preferLocalhost: false,
});
console.log("🔍 Expo Redirect URI:", redirectUri);
console.log("🔍 Expo Redirect URI:", redirectUri);

  // 🟩 Google OAuth Config
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "681125360497-co0v2ca98u07ohetjs9n5qp4ipdelc32a.apps.googleusercontent.com",
    iosClientId:
      "681125360497-co0v2ca98u07ohetjs9n5qp4ipdelc32a.apps.googleusercontent.com",
    androidClientId:
      "681125360497-co0v2ca98u07ohetjs9n5qp4ipdelc32a.apps.googleusercontent.com",
    redirectUri, // ✅ use the actual generated redirect
  });

  // 🟦 Handle Google OAuth response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (!authentication?.accessToken) return;

      // Fetch Google user info
      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      })
        .then((res) => res.json())
        .then(async (user) => {
          console.log("👤 Google User:", user);

          // Send user info to backend
          const res = await fetch(`${BASE_API}/api/Users/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              picture: user.picture,
              googleId: user.id,
            }),
          });

          const data = await res.json();
          console.log("Backend Response:", data);

          if (data.status === "Success") {
            const token = data.token || "";
            await login(data.user, token);
            Toast.show("✅ Google login successful", {
              backgroundColor: "#22c55e",
            });
            router.replace("/screens/dashboardscreen");
          } else {
            Toast.show(data.message || "Google login failed", {
              backgroundColor: "#ef4444",
            });
          }
        })
        .catch((err) => {
          console.error("Google user fetch error:", err);
          Toast.show("Google login failed", { backgroundColor: "#ef4444" });
        });
    }
  }, [response]);

  // 🟩 Validate Inputs
  const validateInputs = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (selectedTab === "web") {
      if (!email.trim()) newErrors.email = true;
      if (!password.trim()) newErrors.password = true;
    } else {
      if (!mobile.trim()) newErrors.mobile = true;
      if (!otp.trim()) newErrors.otp = true;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Toast.show("Please fill all required fields", {
        backgroundColor: "#ef4444",
      });
      return false;
    }
    return true;
  };

  // 🟦 Login Handler
  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setMessage("");
    setStatus(null);

    try {
      const payload =
        selectedTab === "web" ? { email, password } : { mobile, otp };

      const res = await fetch(`${BASE_API}/api/Users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (data.status === "Success") {
        const user = data.user || {};
        const token = data.token || "";
        await login(user, token);

        setStatus("Success");
        setMessage(data.message || "Login successful!");
        Toast.show("✅ Login successful", { backgroundColor: "#22c55e" });

        setTimeout(() => router.replace("/screens/dashboardscreen"), 800);
      } else {
        setStatus("Error");
        setMessage(data.message || "Invalid credentials");
        Toast.show(data.message || "Invalid credentials", {
          backgroundColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setStatus("Error");
      setMessage("Login failed, please try again.");
      Toast.show("Login failed, please try again.", {
        backgroundColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🟦 Social Auth Button
  const handleSocialAuth = (provider: string) => {
    if (provider === "Google") {
      promptAsync();
    } else {
      Alert.alert("Coming Soon", `${provider} login not implemented yet.`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Active Patient</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "web" && styles.selectedTab]}
          onPress={() => setSelectedTab("web")}
        >
          <Text
            style={
              selectedTab === "web" ? styles.selectedTabText : styles.tabText
            }
          >
            Web
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "mobile" && styles.selectedTab]}
          onPress={() => setSelectedTab("mobile")}
        >
          <Text
            style={
              selectedTab === "mobile"
                ? styles.selectedTabText
                : styles.tabText
            }
          >
            Mobile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Form */}
      <View style={styles.form}>
        {selectedTab === "web" ? (
          <>
            <Text style={styles.label}>Email address *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setErrors((prev) => ({ ...prev, email: false }));
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.row}>
              <Text style={styles.label}>Password *</Text>
              <Pressable
                onPress={() => router.push("/screens/forgotpassword")}
                style={styles.forgotLink}
              >
                <Text style={{ color: "#2563eb" }}>Forgot password?</Text>
              </Pressable>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1 },
                  errors.password && styles.inputError,
                ]}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setErrors((prev) => ({ ...prev, password: false }));
                }}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconContainer}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={[styles.input, errors.mobile && styles.inputError]}
              value={mobile}
              onChangeText={(t) => {
                setMobile(t);
                setErrors((prev) => ({ ...prev, mobile: false }));
              }}
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              maxLength={10}
            />

            <View style={styles.row}>
              <Text style={styles.label}>One-Time Password (OTP) *</Text>
              <Pressable
                onPress={() => router.push("/screens/forgotpassword")}
                style={styles.forgotLink}
              >
                <Text style={{ color: "#2563eb" }}>Forgot password?</Text>
              </Pressable>
            </View>

            <TextInput
              style={[styles.input, errors.otp && styles.inputError]}
              value={otp}
              onChangeText={(t) => {
                setOtp(t);
                setErrors((prev) => ({ ...prev, otp: false }));
              }}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
            />
          </>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {message ? (
          <Text
            style={{
              color: status === "Success" ? "green" : "red",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            {message}
          </Text>
        ) : null}
      </View>

      {/* Social Auth */}
      <View style={styles.socials}>
        <Text style={styles.or}>Or continue with</Text>
        <View style={styles.socialButtons}>
          {["Google", "LinkedIn", "Twitter"].map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => handleSocialAuth(p)}
              style={styles.socialButton}
            >
              <Text>{p === "Google" ? "G" : p === "LinkedIn" ? "in" : "Tw"}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.registerLink}>
        Not a member?{" "}
        <Text
          style={{ color: "#2563eb" }}
          onPress={() => router.push("/screens/register")}
        >
          Create Account
        </Text>
      </Text>
    </View>
  );
}

// =============================
// 🎨 Styles
// =============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f1f5f9",
  },
  header: {
    fontSize: 26,
    color: "#2563eb",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 24,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 18,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  selectedTab: {
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
  },
  tabText: { color: "#64748b" },
  selectedTabText: { color: "#2563eb", fontWeight: "bold" },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    color: "#111",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  inputError: { borderColor: "#ef4444" },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  eyeIconContainer: {
    position: "absolute",
    right: 12,
    padding: 6,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  forgotLink: { marginBottom: 4 },
  socials: { marginTop: 24, alignItems: "center" },
  or: { color: "#64748b", marginBottom: 10 },
  socialButtons: { flexDirection: "row", gap: 10 },
  socialButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  registerLink: {
    marginTop: 36,
    color: "#64748b",
    textAlign: "center",
  },
});
