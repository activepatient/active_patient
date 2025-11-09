import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RecentActivity({ paramRecentActivity }: { paramRecentActivity?: any }) {
  // Optionally, make this message dynamic using paramRecentActivity
  // const activityMessage = paramRecentActivity?.message || 'You added "Home_Insurance.pdf" to your Vault.';

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Recent Activity</Text>
      <Text style={styles.message}>
        You added "Home_Insurance.pdf" to your Vault.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    width: "100%",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: "#1e293b",
    marginTop: 2,
  },
});
