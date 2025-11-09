import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScoreCard() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Scorecard</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Section: Patient Details */}
        <View style={[styles.card, { backgroundColor: "#f1f5ff" }]}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Ionicons name="person-outline" size={20} color="#1e3a8a" />
            <Text style={styles.sectionTitle}> Patient Details</Text>
          </View>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Patient Name</Text>
              <Text style={styles.value}>Alex Green</Text>
              <Text style={styles.label}>Reviewer</Text>
              <Text style={styles.value}>John D.</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.label}>DOS Reviewed</Text>
              <Text style={styles.value}>03/15/2024</Text>
              <Text style={styles.label}>Review Status</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section A: Documents Received */}
        <View style={[styles.card, { backgroundColor: "#f0fdf4" }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color="#166534" />
            <Text style={[styles.sectionTitle, { color: "#166534" }]}>
              {"  "}Section A: Documents Received
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableColLeft}>Document Type</Text>
              <Text style={styles.tableColRight}>Count</Text>
            </View>
            {[
              { type: "From Insurance (EOB)", count: 2 },
              { type: "From Provider (Statement)", count: 1 },
              { type: "From Patient (Paid Receipts)", count: 0 },
            ].map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableColLeft}>{row.type}</Text>
                <Text style={styles.tableColRight}>{row.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section B: What We Checked */}
        <View style={[styles.card, { backgroundColor: "#fff7ed" }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-done-outline" size={20} color="#92400e" />
            <Text style={[styles.sectionTitle, { color: "#92400e" }]}>
              {"  "}Section B: What We Checked
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableColLeft}>Checklist</Text>
              <Text style={styles.tableColRight}>Status</Text>
            </View>
            {[
              { type: "Validated documents for DOS", status: "✅" },
              { type: "Verified coverage period", status: "✅" },
            ].map((row, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableColLeft}>{row.type}</Text>
                <Text style={styles.tableColRight}>{row.status}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section C: Recommendations */}
        <View style={[styles.card, { backgroundColor: "#faf5ff" }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#5b21b6" />
            <Text style={[styles.sectionTitle, { color: "#5b21b6" }]}>
              {"  "}Section C: Recommendations
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: "#ecfdf5", marginTop: 8 }]}>
            <Text style={{ textAlign: "center", color: "#166534", fontWeight: "700" }}>
              Pay your provider: $50.00 (Co-pay)
            </Text>
          </View>

          {/* Provider Questions */}
          <Text style={[styles.subHeading, { marginTop: 16 }]}>
            Call your provider with these questions:
          </Text>
          <View style={{ marginLeft: 8, marginTop: 4 }}>
            <Text style={styles.checkbox}>☑ The claim needs reprocessing (code 99999 incorrect).</Text>
            <Text style={styles.checkbox}>☐ Payment Discrepancy.</Text>
          </View>

          {/* Insurance Questions */}
          <Text style={[styles.subHeading, { marginTop: 16 }]}>
            Call your insurance with these questions:
          </Text>
          <View style={{ marginLeft: 8, marginTop: 4 }}>
            <Text style={styles.checkbox}>☑ Claim processed as Out of Network — confirm provider.</Text>
            <Text style={styles.checkbox}>
              ☑ COB issue: primary and secondary insurances not coordinated properly.
            </Text>
          </View>
        </View>

        {/* Upgrade Section */}
        <View style={[styles.card, { backgroundColor: "#fef2f2" }]}>
  <View style={styles.sectionHeader}>
    <Ionicons name="warning-outline" size={20} color="#b91c1c" />
    <Text style={[styles.sectionTitle, { color: "#b91c1c" }]}>
      {"  "}Upgrade Recommended
    </Text>
  </View>

  <Text style={styles.upgradeText}>
    This case is complex and requires professional negotiation. We recommend
    upgrading for our team to handle it for you.
  </Text>

  <TouchableOpacity
  style={styles.upgradeButton}
  onPress={() =>
    router.push({
      pathname: "../bills/upgradepro", 
      params: { source: "scorecard" },
    })
  }
>
  <Text style={styles.upgradeButtonText}>Upgrade to Pro Review ($99)</Text>
</TouchableOpacity>
</View>

      </ScrollView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backText: { color: "#4f46e5", fontWeight: "600", fontSize: 15 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginRight: 30,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1e3a8a" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 13, color: "#555" },
  value: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 6 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4f46e5",
    marginRight: 6,
  },
  statusText: { color: "#4338ca", fontWeight: "600", fontSize: 13 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  table: { marginTop: 6 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  tableColLeft: { flex: 1, fontSize: 14, color: "#111" },
  tableColRight: { width: 60, textAlign: "right", fontWeight: "600", color: "#111" },
  subHeading: { fontWeight: "700", color: "#333", fontSize: 14 },
  checkbox: { fontSize: 13, color: "#333", marginTop: 4 },
  upgradeText: {
    fontSize: 13,
    color: "#444",
    marginTop: 8,
    marginBottom: 14,
    lineHeight: 18,
  },
  upgradeButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
