import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Pass user and paramprofile from parent (DashboardScreen)
export default function WelcomeModule({ paramprofile, user, navigation }: any) {
  // Save profile photo in AsyncStorage when component mounts
  useEffect(() => {
    if (paramprofile?.imageUrl) {
      AsyncStorage.setItem("profilephoto", paramprofile.imageUrl);
    }
  }, [paramprofile?.imageUrl]);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        Welcome, {user?.fname || ""} {user?.lname || ""}!
      </Text>

      {user?.isPasswordlinkShow ? (
        <TouchableOpacity
          onPress={() => navigation && navigation.navigate
            ? navigation.navigate("ChangePasswordScreen")
            : null
          }
        >
          <Text style={styles.changePasswordLink}>
            Change your password
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  changePasswordLink: {
    fontWeight: "bold",
    color: "#2563eb",
    fontSize: 16,
    marginTop: 2,
    textDecorationLine: "underline",
  },
});
