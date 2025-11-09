import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

const useAuth = () => ({
  user: { fname: "John", lname: "Doe", LoginUserId: 1 },
  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("profilephoto");
  },
});

export default function Header({ title }: { title: string }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [Profilephoto, setProfilephoto] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("profilephoto").then(setProfilephoto);
  }, []);

  const handleChangePassword = () => {
    setModalVisible(false);
    router.push("/screens/ChangePassword");
  };

  const handleLogout = async () => {
    try {
      await logout();
      Toast.show("Logged out successfully", { backgroundColor: "#22c55e" });
    } catch {
      Toast.show("Logout failed", { backgroundColor: "#ef4444" });
    } finally {
      setModalVisible(false);
      router.replace("/screens/login");
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://www.clipartmax.com/png/middle/54-546012_health-care-healthcare-png-icon.png",
            }}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.actions}>
          <Text style={styles.bell}>🔔</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={
                Profilephoto
                  ? { uri: Profilephoto }
                  : require("../assets/images/avatar-default.png")
              }
              style={styles.avatar}
            />
          </TouchableOpacity>

          {/* Modal Menu */}
          <Modal transparent animationType="fade" visible={modalVisible}>
            <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
              <View style={styles.menu}>
                <TouchableOpacity onPress={handleChangePassword} style={styles.menuItem}>
                  <Text style={styles.menuText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                  <Text style={[styles.menuText, { color: "#ef4444" }]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    zIndex: 20,
  },
  logoContainer: { paddingRight: 10 },
  logo: { height: 38, width: 38, borderRadius: 8, backgroundColor: "#e0e7ff" },
  title: { fontWeight: "bold", fontSize: 18, color: "#2563eb", flex: 1, textAlign: "center" },
  actions: { flexDirection: "row", alignItems: "center", gap: 14 },
  bell: { fontSize: 20, marginRight: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#e0e7ff", marginRight: 5
  },
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.2)", justifyContent: "flex-end", alignItems: "flex-end"
  },
  menu: {
    backgroundColor: "#fff", borderRadius: 12, padding: 10, width: 180, margin: 16,
    elevation: 8, shadowColor: "#000", shadowOpacity: 0.14, shadowRadius: 8,
  },
  menuItem: {
    paddingVertical: 12, borderBottomColor: "#eee", borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16, color: "#1e293b", fontWeight: "500",
  },
});
