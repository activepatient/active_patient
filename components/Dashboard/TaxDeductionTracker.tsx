import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TaxDeductionTracker({ paramUpcomingRenewals }: { paramUpcomingRenewals?: any }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Upcoming Renewal</Text>
      {/* Add actual tracking info here if needed */}
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
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
});
