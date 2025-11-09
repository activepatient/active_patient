import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function OwedByTypeChart({ data, width = screenWidth - 48, height = 200 }: { data: any[], width?: number, height?: number }) {
  const colors = ["#a21caf", "#38bdf8", "#2563eb", "#f59e42", "#e11d48"];
  const chartData = data.map((item, i) => ({
    name: item.label,
    population: item.value,
    color: colors[i % colors.length],
    legendFontColor: "#1e293b",
    legendFontSize: 15,
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Owed by Type</Text>
      <PieChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(162,28,175,${opacity})`,
          labelColor: () => "#111827",
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"10"}
        absolute
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
