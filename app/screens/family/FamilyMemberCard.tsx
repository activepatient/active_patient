import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { deleteMember } from "../../../api/memberApi"; // ✅ actual API import
import { useAuth } from "../../../components/authContext";

interface Props {
  member: string;
  name: string;
  relation: string;
  imageUrl?: string;
  onNotify?: (msg: string) => void;
}

export default function FamilyMemberCard({
  member,
  name,
  relation,
  imageUrl,
  onNotify,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // 🗑️ Delete confirmation handler
  const handleDeleteClick = () => {
    const loginMemberId = user?.Mid;
    if (relation !== "Self" && loginMemberId !== member) {
      Alert.alert(
        "Delete Member",
        "Are you sure you want to delete this family member?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => handleConfirm(),
          },
        ]
      );
    } else {
      Toast.show("You cannot delete your own profile", {
        backgroundColor: "#ef4444",
      });
    }
  };

  // ✅ Confirm delete (connected to DB)
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      console.log("Deleting member:", member);

      const res = await deleteMember(parseInt(member));

      if (res.status === "Success") {
        Toast.show(res.message || "Member deleted successfully", {
          backgroundColor: "#22c55e",
        });
        // 🔁 Notify parent component (FamilyGroup → FamilyHub) to refresh list
        onNotify && onNotify("refresh_from_delete");
      } else {
        Toast.show(res.message || "Failed to delete member", {
          backgroundColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error("❌ Error deleting member:", err);
      Toast.show("Delete failed. Try again.", { backgroundColor: "#ef4444" });
    } finally {
      setIsLoading(false);
    }
  };

  // 🧭 Navigation handlers
  const handleEdit = () =>
    router.push(`/screens/family/MemberEdit?memberId=${member}`);
  const handleInsurance = () =>
    router.push(`/screens/family/Insurance?memberId=${member}`);
  const handleBills = () =>
    router.push(`/screens/bills?memberId=${member}`);
  const handleTimeline = () =>
    router.push(`/screens/family/Timeline?memberId=${member}`);

  return (
    <View style={styles.card}>
      {/* Profile Picture */}
      <Image
        source={
          imageUrl
            ? { uri: imageUrl }
            : require("../../../assets/images/icon.png")
        }
        style={styles.avatar}
      />

      {/* Member Details */}
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.relation}>{relation}</Text>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeleteClick} style={styles.iconButton}>
            <Text style={styles.icon}>🗑️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleInsurance} style={styles.iconButton}>
            <Text style={styles.icon}>🛡️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleTimeline} style={styles.iconButton}>
            <Text style={styles.icon}>📅</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBills} style={styles.iconButton}>
            <Text style={styles.icon}>📄</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loader}>
            <ActivityIndicator color="#2563eb" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e5e7eb",
    marginRight: 12,
  },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#111" },
  relation: { fontSize: 13, color: "#6b7280", marginBottom: 8 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", paddingRight: 10 },
  iconButton: { padding: 6 },
  icon: { fontSize: 18 },
  loader: { marginTop: 8 },
});
