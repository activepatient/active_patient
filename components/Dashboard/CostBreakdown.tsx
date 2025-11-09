import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CostBreakdown({ paramCostBreakdown }: { paramCostBreakdown?: any }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Cost Breakdown (ROI)</Text>
      {/* Add cost breakdown data here */}
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
