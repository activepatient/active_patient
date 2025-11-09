import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/authContext";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

// === Dashboard Modules ===
import CostBreakdown from "../../components/Dashboard/CostBreakdown";
import Credit_Balances from "../../components/Dashboard/Credit_Balances";
import DeductibleProgress from "../../components/Dashboard/DeductibleProgress";
import DueVsPaidChart from "../../components/Dashboard/DueVsPaidChart";
import FamilySpending from "../../components/Dashboard/FamilySpending";
import OwedByTypeChart from "../../components/Dashboard/OwedByTypeChart";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import RiskAnalysis from "../../components/Dashboard/RiskAnalysis";
import TaxDeductionTracker from "../../components/Dashboard/TaxDeductionTracker";
import TotalOwedChart from "../../components/Dashboard/TotalOwedChart";
import UpcomingRenewals from "../../components/Dashboard/UpcomingRenewals";
import WelcomeModule from "../../components/Dashboard/WelcomeModule";

const BASE_API = "https://isela-ungrumpy-undiligently.ngrok-free.dev";
const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<any>({});
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/screens/login");
    }
  }, [loading, token]);

  // ✅ Safe Profile Fetch with JSON fallback
  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      setIsProfileLoading(true);

      const res = await fetch(`${BASE_API}/api/Users/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text(); // get raw response
      try {
        const json = JSON.parse(text);
        setProfile(json);
      } catch (parseErr) {
        console.log("⚠️ Non-JSON response from API:", text.slice(0, 250));
        setProfile({});
      }
    } catch (err) {
      console.log("Profile fetch error:", err);
      setProfile({});
    } finally {
      setIsProfileLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

  const chartData = [
    { label: "Category A", value: 30 },
    { label: "Category B", value: 20 },
    { label: "Category C", value: 50 },
  ];

  const DuevsPaiddata = [
    { name: "Member A", due: 1200, paid: 800 },
    { name: "Member B", due: 1500, paid: 1500 },
    { name: "Member C", due: 1000, paid: 400 },
  ];

  if (loading || isProfileLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        Platform.OS === "ios" && { paddingTop: 0 },
      ]}
      edges={["left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f3f4f6"
        translucent
      />

      <View
        style={[
          styles.container,
          Platform.OS === "android" && { paddingTop: StatusBar.currentHeight || 0 },
        ]}
      >
        <Header title="Dashboard" />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2563eb"]}
              tintColor="#2563eb"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <WelcomeModule paramprofile={profile || {}} />
          </View>

          <View style={styles.section}>
            <UpcomingRenewals paramUpcomingRenewals={profile || {}} />
          </View>

          <View style={styles.section}>
            <RecentActivity paramRecentActivity={profile || {}} />
          </View>

          {/* Charts */}
          <View style={styles.chartSection}>
            <TotalOwedChart
              data={chartData}
              width={screenWidth * 0.8}
              height={220}
            />
          </View>

          <View style={styles.chartSection}>
            <OwedByTypeChart
              data={chartData}
              width={screenWidth * 0.8}
              height={220}
            />
          </View>

          <View style={styles.chartSection}>
            <DueVsPaidChart
              data={DuevsPaiddata}
              width={screenWidth * 0.9}
              height={280}
            />
          </View>

          {/* Other sections */}
          <View style={styles.section}>
            <FamilySpending />
          </View>
          <View style={styles.section}>
            <DeductibleProgress />
          </View>
          <View style={styles.section}>
            <TaxDeductionTracker />
          </View>
          <View style={styles.section}>
            <CostBreakdown />
          </View>
          <View style={styles.section}>
            <Credit_Balances />
          </View>
          <View style={styles.section}>
            <RiskAnalysis />
          </View>

          <View style={{ height: Platform.OS === "android" ? 70 : 20 }} />
        </ScrollView>

        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 60,
  },
  section: {
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chartSection: {
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
