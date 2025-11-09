import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const reviewers = [
  "Dr. Emily Carter, RN, BSN",
  "Michael P., CPC",
  "Dr. Smith Johnson",
];

export default function Schedule() {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState("Patient Info");
  const [selectedReviewer, setSelectedReviewer] = useState(reviewers[0]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [appointments, setAppointments] = useState<
    { id: number; date: Date; time: Date }[]
  >([]);

  // 💳 Track Pro status
  const [isPro, setIsPro] = useState(false);

  // 🔁 Check AsyncStorage each time screen focuses
  useFocusEffect(
    useCallback(() => {
      const checkProStatus = async () => {
        const proStatus = await AsyncStorage.getItem("isProUser");
        setIsPro(proStatus === "true");
      };
      checkProStatus();
    }, [])
  );

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (time: Date) =>
    time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ➕ Add Appointment
  const handleAddAppointment = () => {
    if (isPro) return;
    if (appointments.length >= 3) {
      Alert.alert("Limit Reached", "You can only select up to 3 appointments.");
      return;
    }

    const newAppt = {
      id: Date.now(),
      date: selectedDate,
      time: selectedTime,
    };
    setAppointments([...appointments, newAppt]);
  };

  // 🗑 Delete Appointment
  const handleDeleteAppointment = (id: number) => {
    if (isPro) return;
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  // ✏️ Edit Appointment
  const handleEditAppointment = (id: number) => {
    if (isPro) return;
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;
    setSelectedDate(appt.date);
    setSelectedTime(appt.time);
    setAppointments(appointments.filter((a) => a.id !== id));
    Alert.alert("Edit Mode", "Now adjust the date & time, then tap Add again.");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Schedule Appointment</Text>

      {/* Case Details */}
      <View style={styles.cardBlue}>
        <Text style={styles.cardHeader}>📄 Case Details</Text>
        <View style={styles.tabRow}>
          {["Patient Info", "Financials"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTab,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTab === "Patient Info" ? (
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Patient Paid</Text>
            <Text style={styles.infoValue}>$50.00</Text>
            <Text style={styles.infoLabel}>Document ID</Text>
            <Text style={styles.infoValue}>CIC-59842</Text>
            <Text style={styles.infoLabel}>Review Status</Text>
            <Text style={styles.eligibleTag}>Eligible</Text>
          </View>
        ) : (
          <View style={styles.financialsSection}>
            <Text style={styles.finHeader}>Provider</Text>
            <Text>Billed: $1,250</Text>
            <Text>Allowed: $800</Text>
            <Text>Deductible: $100</Text>
            <Text>Patient Owe: $200</Text>
          </View>
        )}
      </View>

      {/* Reviewer */}
      <View style={styles.cardGreen}>
        <Text style={styles.cardHeader}>👤 Select Reviewer</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {reviewers.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.reviewerButton,
                selectedReviewer === item && styles.reviewerSelected,
              ]}
              onPress={() => setSelectedReviewer(item)}
            >
              <Text
                style={[
                  styles.reviewerText,
                  selectedReviewer === item && styles.reviewerTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Date & Time Section */}
      <View style={styles.cardPurple}>
        <Text style={styles.cardHeader}>📅 Select Date & Time</Text>
        {!isPro && (
          <Text style={styles.helperNote}>
            You can select up to <Text style={styles.bold}>3 appointments</Text>.
          </Text>
        )}

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setShowDatePicker(true)}
          disabled={isPro}
        >
          <Text style={styles.inputLabel}>Select Date</Text>
          <Text style={styles.inputValue}>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={(e, d) => {
              setShowDatePicker(false);
              if (d) setSelectedDate(d);
            }}
          />
        )}

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setShowTimePicker(true)}
          disabled={isPro}
        >
          <Text style={styles.inputLabel}>Select Time</Text>
          <Text style={styles.inputValue}>{formatTime(selectedTime)}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour={false}
            display="clock"
            onChange={(e, t) => {
              setShowTimePicker(false);
              if (t) setSelectedTime(t);
            }}
          />
        )}

        {!isPro && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddAppointment}>
            <Text style={styles.addText}>➕ Add Appointment</Text>
          </TouchableOpacity>
        )}

        {appointments.length > 0 && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>🗓 Your Appointments</Text>
            {appointments.map((appt, index) => (
              <View key={appt.id} style={styles.appointmentRow}>
                <Text style={styles.summaryItem}>
                  {index + 1}. {formatDate(appt.date)} at {formatTime(appt.time)}
                </Text>
                {!isPro ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => handleEditAppointment(appt.id)}>
                      <Text style={styles.editBtn}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteAppointment(appt.id)}>
                      <Text style={styles.deleteBtn}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.lockIcon}>🔒</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Upgrade Button */}
     <View style={styles.upgradeContainer}>
  <TouchableOpacity
    style={[
      styles.upgradeButton,
      isPro && { backgroundColor: "#10b981" },
    ]}
    onPress={() =>
      router.push({
        pathname: "/screens/bills/upgradepro",
        params: { source: "schedule" }, 
      })
    }
  >
    <Text style={styles.upgradeText}>
      {isPro ? "✅ You’re Pro" : "⭐ Upgrade to Pro"}
    </Text>
    <Text style={styles.upgradeSubText}>
      {isPro
        ? "Editing locked — Pro mode enabled"
        : "Unlock unlimited appointments & faster scheduling"}
    </Text>
  </TouchableOpacity>
</View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerTitle: { textAlign: "center", fontWeight: "700", fontSize: 18, marginBottom: 10 },
  cardBlue: {
    backgroundColor: "#f5f7ff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#dbe3ff",
  },
  cardGreen: {
    backgroundColor: "#f0fff4",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#c6f6d5",
  },
  cardPurple: {
    backgroundColor: "#faf5ff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 60,
    borderWidth: 1,
    borderColor: "#e9d8fd",
  },
  cardHeader: { fontWeight: "700", fontSize: 16, marginBottom: 8, color: "#4f46e5" },
  tabRow: { flexDirection: "row", marginBottom: 10 },
  tabButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#ede9fe", borderColor: "#4f46e5" },
  tabText: { color: "#555", fontWeight: "600" },
  activeTabText: { color: "#4f46e5" },
  infoSection: { marginTop: 10 },
  infoLabel: { color: "#444", marginTop: 5 },
  infoValue: { fontWeight: "700", color: "#000" },
  eligibleTag: {
    backgroundColor: "#bbf7d0",
    color: "#065f46",
    fontWeight: "700",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  finHeader: { fontWeight: "700", marginBottom: 5, color: "#111" },
  reviewerButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
  },
  reviewerSelected: { backgroundColor: "#4f46e5" },
  reviewerText: { color: "#111" },
  reviewerTextSelected: { color: "#fff", fontWeight: "600" },
  helperNote: { fontSize: 13, color: "#6b7280", marginBottom: 8 },
  inputBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  inputLabel: { color: "#555", fontSize: 13 },
  inputValue: { color: "#111", fontWeight: "600", marginTop: 4 },
  addButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  addText: { color: "#fff", fontWeight: "600" },
  summaryBox: {
    backgroundColor: "#eef2ff",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  summaryTitle: { fontWeight: "700", color: "#4f46e5", marginBottom: 6 },
  appointmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryItem: { color: "#111", flex: 1 },
  actionRow: { flexDirection: "row", gap: 8 },
  editBtn: { fontSize: 16 },
  deleteBtn: { fontSize: 16 },
  lockIcon: { fontSize: 16, color: "#6b7280" },
  upgradeContainer: { alignItems: "center", marginBottom: 40 },
  upgradeButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  upgradeText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  upgradeSubText: { color: "#e0e7ff", fontSize: 12, marginTop: 3 },
  financialsSection: {
    marginTop: 10,
    backgroundColor: "#fefce8",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  bold: { fontWeight: "700", color: "#4f46e5" },
});
