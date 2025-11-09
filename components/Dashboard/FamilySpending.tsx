import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function FamilySpending() {
  const data = {
    labels: ["apple", "orange", "banana", "mango", "grape"],
    datasets: [
      {
        data: [10, 15, 25, 30, 28],
      },
    ],
  };

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Family Spending</Text>
      <BarChart
        data={data}
        width={screenWidth - 32}
        height={240}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(56,189,248,${opacity})`,
          labelColor: () => "#111827",
          barPercentage: 0.5,
        }}
        showBarTops
        style={{ borderRadius: 16 }}
      />
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
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
});
