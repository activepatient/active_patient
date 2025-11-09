import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function DueVsPaidChart({
  data,
  width = screenWidth - 32,
  height = 260,
}: {
  data: any[];
  width?: number;
  height?: number;
}) {
  const labels = data.map((d) => d.name);
  const dueData = data.map((d) => d.due);
  const paidData = data.map((d) => d.paid);

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Due vs Paid</Text>
      <BarChart
      yAxisSuffix=""
        data={{
          labels,
          datasets: [
            { data: dueData, color: (opacity = 1) => `rgba(37,99,235,${opacity})` },
            { data: paidData, color: (opacity = 1) => `rgba(56,189,248,${opacity})` },
          ],
          // legend: ["Due", "Paid"], // ❌ Remove this line!
        }}
        width={width}
        height={height}
        yAxisLabel="₹"
        fromZero
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(30,41,59,${opacity})`,
          labelColor: () => "#111827",
          barPercentage: 0.44,
        }}
        showBarTops
        withHorizontalLabels
        style={{ borderRadius: 16 }}
        withCustomBarColorFromData={true}
        flatColor={true}
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
