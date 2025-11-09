import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function UpcomingRenewals({ paramUpcomingRenewals }: { paramUpcomingRenewals?: any }) {
  // Example: You can make this dynamic using paramUpcomingRenewals if needed.
  // const renewalMessage = paramUpcomingRenewals?.renewalMessage || "Your Primary: Athena Medical Insurance policy is due for renewal in 25 days.";

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Upcoming Renewal</Text>
      <Text style={styles.message}>
        Your Primary: Athena Medical Insurance policy is due for renewal in 25 days.
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
