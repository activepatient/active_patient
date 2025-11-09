// // ✅ C:\Users\pavan\mbluser\app\screens\family\FamilyHub.tsx
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Toast from "react-native-root-toast";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Footer from "../../../components/Footer";
// import { fetchMemberInsurance } from "../../api/insuranceApi";
// import { fetchFamilyHierarchy } from "../../api/memberApi";
// import FamilyGroup from "./FamilyGroup";
// import Insurance from "./Insurance";

// export default function FamilyHub() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("family");
//   const [familyGroups, setFamilyGroups] = useState<any[]>([]);
//   const [insuranceList, setInsuranceList] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch Family Hierarchy
//   const fetchFamily = async () => {
//     try {
//       console.log("🔍 Starting family hierarchy fetch...");
//       setLoading(true);

//       const members = await fetchFamilyHierarchy();
//       console.log("📦 Raw API response:", members);

//       if (!Array.isArray(members) || members.length === 0) {
//         setFamilyGroups([]);
//         Toast.show("No family members found", { backgroundColor: "#f87171" });
//         return;
//       }

//       // 🧠 Transform DB data into frontend UI format
//       const formatted = members.map((m: any) => ({
//         id: m.MemberID?.toString(),
//         name: `${m.FirstName || ""} ${m.LastName || ""}`.trim(),
//         relation: m.RelationshipName || "Member",
//         imageUrl:
//           m.MemberPhoto && m.MemberPhoto.startsWith("data:")
//             ? m.MemberPhoto
//             : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//         IsPrimaryMem: m.IsPrimaryMem === true || m.IsPrimaryMem === 1,
//       }));

//       console.log("🎨 Transformed members:", formatted);

//       const primary = formatted.filter((m) => m.IsPrimaryMem);
//       const linked = formatted.filter((m) => !m.IsPrimaryMem);

//       const grouped = [
//         { title: "Head of Household", members: primary },
//         { title: "Family Members", members: linked },
//       ];

//       console.log("📚 Final grouped data:", grouped);
//       setFamilyGroups(grouped);
//     } catch (err) {
//       console.error("❌ Error fetching family hierarchy:", err);
//       Toast.show("Failed to fetch family members", { backgroundColor: "#ef4444" });
//     } finally {
//       setLoading(false);
//       console.log("✅ Family fetch process completed.");
//     }
//   };

//   // ✅ Fetch Insurance for Primary Member
//   const fetchInsurance = async () => {
//     try {
//       setLoading(true);
//       const primaryMember = familyGroups
//         .flatMap((g) => g.members)
//         .find((m) => m.IsPrimaryMem);

//       if (!primaryMember) return;

//       const data = await fetchMemberInsurance(primaryMember.id.toString());
//       setInsuranceList(data);
//     } catch (err) {
//       console.error("❌ Error fetching insurance:", err);
//       Toast.show("Failed to fetch insurance data", { backgroundColor: "#ef4444" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === "family") {
//       fetchFamily();
//     } else if (activeTab === "insurance") {
//       fetchInsurance();
//     }
//   }, [activeTab]);

//   const handleNotify = (msg: string) => {
//     Toast.show(`Family list updated: ${msg}`, {
//       backgroundColor: "#22c55e",
//     });
//   };

//   // ➕ Header Action
//   const handleHeaderAction = () => {
//     if (activeTab === "family") {
//       router.push("/screens/family/MemberDetails");
//     } else {
//       router.push("/screens/family/AddInsurance");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Family Hub</Text>
//         <TouchableOpacity onPress={handleHeaderAction} style={styles.iconButton}>
//           <Ionicons
//             name={activeTab === "family" ? "person-add-outline" : "medkit-outline"}
//             size={28}
//             color="#2563eb"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === "family" && styles.activeTab]}
//           onPress={() => setActiveTab("family")}
//         >
//           <Text style={[styles.tabText, activeTab === "family" && styles.activeText]}>
//             My Family
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.tab, activeTab === "insurance" && styles.activeTab]}
//           onPress={() => setActiveTab("insurance")}
//         >
//           <Text style={[styles.tabText, activeTab === "insurance" && styles.activeText]}>
//             My Insurance
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Content */}
//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {loading ? (
//           <View style={{ marginTop: 60, alignItems: "center" }}>
//             <ActivityIndicator size="large" color="#2563eb" />
//             <Text style={{ marginTop: 10, color: "#6b7280" }}>Loading data...</Text>
//           </View>
//         ) : activeTab === "family" ? (
//           Array.isArray(familyGroups) && familyGroups.length > 0 ? (
//             familyGroups.map((group, i) => (
//               <FamilyGroup
//                 key={i}
//                 title={group.title}
//                 members={group.members || []}
//                 onNotifyFamilyGroup={handleNotify}
//               />
//             ))
//           ) : (
//             <Text style={styles.emptyText}>No family members found.</Text>
//           )
//         ) : (
//           <Insurance Memberinsurance={insuranceList} memberId="1" />
//         )}
//       </ScrollView>

//       <Footer />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: StatusBar.currentHeight || 8,
//     paddingBottom: 12,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderColor: "#e5e7eb",
//   },
//   headerTitle: { fontSize: 22, fontWeight: "700", color: "#111827" },
//   iconButton: { backgroundColor: "#f3f4f6", borderRadius: 30, padding: 6 },
//   tabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#f3f4f6",
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginTop: 10,
//   },
//   tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
//   activeTab: { backgroundColor: "#2563eb" },
//   tabText: { color: "#374151", fontWeight: "600" },
//   activeText: { color: "#fff" },
//   scroll: { flex: 1, paddingHorizontal: 12, marginTop: 6 },
//   emptyText: { textAlign: "center", color: "#6b7280", marginTop: 20, fontSize: 15 },
// });




// // ✅ C:\Users\pavan\mbluser\app\screens\family\FamilyHub.tsx

// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Toast from "react-native-root-toast";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Footer from "../../../components/Footer";
// import { fetchMemberInsurance } from "../../api/insuranceApi";
// import { fetchFamilyHierarchy } from "../../api/memberApi";
// import FamilyGroup from "./FamilyGroup";
// import Insurance from "./Insurance";

// interface Member {
//   id: string;
//   name: string;
//   relation: string;
//   imageUrl: string;
//   [key: string]: any; // (add this if member may have more fields)
// }


// export default function FamilyHub() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("family");
//   const [familyGroups, setFamilyGroups] = useState<any[]>([]);
//   const [insuranceList, setInsuranceList] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Handlers for all icon actions
//   const handleEdit = (member : Member) => {
//     router.push({ pathname: "/screens/family/EditMember", params: { id: member.id } });
//   };

//   const handleDelete = (member : Member) => {
//     Alert.alert(
//       "Delete Member",
//       `Are you sure you want to delete ${member.name}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => {
//             // TODO: Implement actual API call
//             Toast.show("Deleted " + member.name, { backgroundColor: "#ef4444" });
//           }
//         }
//       ]
//     );
//   };

//   const handleShield = (member : Member) => {
//     Toast.show("Shield action for " + member.name, { backgroundColor: "#22c55e" });
//   };

//   const handleLock = (member : Member) => {
//     Toast.show("Lock action for " + member.name, { backgroundColor: "#2563eb" });
//   };

//   const handleDocument = (member : Member) => {
//     router.push({ pathname: "/screens/family/MemberEdit", params: { id: member.id } });
//   };

//   // ✅ Fetch Family Hierarchy
//   const fetchFamily = async () => {
//     try {
//       setLoading(true);
//       const members = await fetchFamilyHierarchy();
//       if (!Array.isArray(members) || members.length === 0) {
//         setFamilyGroups([]);
//         Toast.show("No family members found", { backgroundColor: "#f87171" });
//         return;
//       }
//       // 🧠 Transform DB data into frontend UI format
//       const formatted = members.map((m: any) => ({
//         id: m.MemberID?.toString(),
//         name: `${m.FirstName || ""} ${m.LastName || ""}`.trim(),
//         relation: m.RelationshipName || "Member",
//         imageUrl:
//           m.MemberPhoto && m.MemberPhoto.startsWith("data:")
//             ? m.MemberPhoto
//             : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
//         IsPrimaryMem: m.IsPrimaryMem === true || m.IsPrimaryMem === 1,
//       }));

//       const primary = formatted.filter((m) => m.IsPrimaryMem);
//       const linked = formatted.filter((m) => !m.IsPrimaryMem);

//       const grouped = [
//         { title: "Head of Household", members: primary },
//         { title: "Family Members", members: linked },
//       ];

//       setFamilyGroups(grouped);
//     } catch (err) {
//       Toast.show("Failed to fetch family members", { backgroundColor: "#ef4444" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch Insurance for Primary Member
//   const fetchInsurance = async () => {
//     try {
//       setLoading(true);
//       const primaryMember = familyGroups
//         .flatMap((g) => g.members)
//         .find((m) => m.IsPrimaryMem);

//       if (!primaryMember) return;

//       const data = await fetchMemberInsurance(primaryMember.id.toString());
//       setInsuranceList(data);
//     } catch (err) {
//       Toast.show("Failed to fetch insurance data", { backgroundColor: "#ef4444" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === "family") {
//       fetchFamily();
//     } else if (activeTab === "insurance") {
//       fetchInsurance();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [activeTab]);

//   const handleNotify = (msg: string) => {
//     Toast.show(`Family list updated: ${msg}`, {
//       backgroundColor: "#22c55e",
//     });
//   };

//   // ➕ Header Action
//   const handleHeaderAction = () => {
//     if (activeTab === "family") {
//       router.push("/screens/family/MemberDetails");
//     } else {
//       router.push("/screens/family/AddInsurance");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Family Hub</Text>
//         <TouchableOpacity onPress={handleHeaderAction} style={styles.iconButton}>
//           <Ionicons
//             name={activeTab === "family" ? "person-add-outline" : "medkit-outline"}
//             size={28}
//             color="#2563eb"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === "family" && styles.activeTab]}
//           onPress={() => setActiveTab("family")}
//         >
//           <Text style={[styles.tabText, activeTab === "family" && styles.activeText]}>
//             My Family
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === "insurance" && styles.activeTab]}
//           onPress={() => setActiveTab("insurance")}
//         >
//           <Text style={[styles.tabText, activeTab === "insurance" && styles.activeText]}>
//             My Insurance
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Content */}
//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {loading ? (
//           <View style={{ marginTop: 60, alignItems: "center" }}>
//             <ActivityIndicator size="large" color="#2563eb" />
//             <Text style={{ marginTop: 10, color: "#6b7280" }}>Loading data...</Text>
//           </View>
//         ) : activeTab === "family" ? (
//           Array.isArray(familyGroups) && familyGroups.length > 0 ? (
//             familyGroups.map((group, i) => (
//               <FamilyGroup
//                 key={i}
//                 title={group.title}
//                 members={group.members || []}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 onShield={handleShield}
//                 onLock={handleLock}
//                 onDocument={handleDocument}
//                 onNotifyFamilyGroup={handleNotify}
//               />
//             ))
//           ) : (
//             <Text style={styles.emptyText}>No family members found.</Text>
//           )
//         ) : (
//           <Insurance Memberinsurance={insuranceList} memberId="1" />
//         )}
//       </ScrollView>

//       <Footer />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: StatusBar.currentHeight || 8,
//     paddingBottom: 12,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderColor: "#e5e7eb",
//   },
//   headerTitle: { fontSize: 22, fontWeight: "700", color: "#111827" },
//   iconButton: { backgroundColor: "#f3f4f6", borderRadius: 30, padding: 6 },
//   tabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#f3f4f6",
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginTop: 10,
//   },
//   tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
//   activeTab: { backgroundColor: "#2563eb" },
//   tabText: { color: "#374151", fontWeight: "600" },
//   activeText: { color: "#fff" },
//   scroll: { flex: 1, paddingHorizontal: 12, marginTop: 6 },
//   emptyText: { textAlign: "center", color: "#6b7280", marginTop: 20, fontSize: 15 },
// });



// ✅ C:\Users\pavan\mbluser\app\screens\family\FamilyHub.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchMemberInsurance } from "../../../api/insuranceApi";
import { fetchFamilyHierarchy } from "../../../api/memberApi";
import Footer from "../../../components/Footer";
import FamilyGroup from "./FamilyGroup";
import Insurance from "./Insurance";

export default function FamilyHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("family");
  const [familyGroups, setFamilyGroups] = useState<any[]>([]);
  const [insuranceList, setInsuranceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Family Hierarchy
  const fetchFamily = async () => {
    try {
      setLoading(true);
      const members = await fetchFamilyHierarchy();
      if (!Array.isArray(members) || members.length === 0) {
        setFamilyGroups([]);
        Toast.show("No family members found", { backgroundColor: "#f87171" });
        return;
      }
      const formatted = members.map((m: any) => ({
        id: m.MemberID?.toString(),
        name: `${m.FirstName || ""} ${m.LastName || ""}`.trim(),
        relation: m.RelationshipName || "Member",
        imageUrl:
          m.MemberPhoto && m.MemberPhoto.startsWith("data:")
            ? m.MemberPhoto
            : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        IsPrimaryMem: m.IsPrimaryMem === true || m.IsPrimaryMem === 1,
      }));
      const primary = formatted.filter((m) => m.IsPrimaryMem);
      const linked = formatted.filter((m) => !m.IsPrimaryMem);

      const grouped = [
        { title: "Head of Household", members: primary },
        { title: "Family Members", members: linked },
      ];
      setFamilyGroups(grouped);
    } catch (err) {
      Toast.show("Failed to fetch family members", { backgroundColor: "#ef4444" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Insurance for Primary Member
  const fetchInsurance = async () => {
    try {
      setLoading(true);
      const primaryMember = familyGroups
        .flatMap((g) => g.members)
        .find((m) => m.IsPrimaryMem);
      if (!primaryMember) return;
      const data = await fetchMemberInsurance(primaryMember.id.toString());
      setInsuranceList(data);
    } catch (err) {
      Toast.show("Failed to fetch insurance data", { backgroundColor: "#ef4444" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "family") {
      fetchFamily();
    } else if (activeTab === "insurance") {
      fetchInsurance();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const handleNotify = (msg: string) => {
    Toast.show(`Family list updated: ${msg}`, {
      backgroundColor: "#22c55e",
    });
  };

  // ➕ Header Action
  const handleHeaderAction = () => {
    if (activeTab === "family") {
      router.push("/screens/family/MemberDetails");
    } else {
      router.push("/screens/family/AddInsurance");
    }
  };

  // --- ICON HANDLERS ---
  const handleEdit = (member: any) => {
    router.push({
      pathname: "/screens/family/EditMember",
      params: { memberId: member.id },
    });
  };

  const handleDelete = (member: any) => {
    Alert.alert(
      "Delete Member",
      `Are you sure you want to delete ${member.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Call delete API here!
            Toast.show("Deleted " + member.name, { backgroundColor: "#ef4444" });
          }
        }
      ]
    );
  };

  const handleShield = (member: any) => {
    Toast.show("Insurance for " + member.name, { backgroundColor: "#22c55e" });
    // Optionally, you can route to insurance details.
  };

  const handleLock = (member: any) => {
    Toast.show("Vault clicked for " + member.name, { backgroundColor: "#2563eb" });
    // Optionally, you can navigate to a vault/documents page.
  };

  const handleDocument = (member: any) => {
    router.push({
      pathname: "/screens/family/MemberDocs",
      params: { memberId: member.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Hub</Text>
        <TouchableOpacity onPress={handleHeaderAction} style={styles.iconButton}>
          <Ionicons
            name={activeTab === "family" ? "person-add-outline" : "medkit-outline"}
            size={28}
            color="#2563eb"
          />
        </TouchableOpacity>
      </View>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "family" && styles.activeTab]}
          onPress={() => setActiveTab("family")}
        >
          <Text style={[styles.tabText, activeTab === "family" && styles.activeText]}>
            My Family
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "insurance" && styles.activeTab]}
          onPress={() => setActiveTab("insurance")}
        >
          <Text style={[styles.tabText, activeTab === "insurance" && styles.activeText]}>
            My Insurance
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ marginTop: 60, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={{ marginTop: 10, color: "#6b7280" }}>Loading data...</Text>
          </View>
        ) : activeTab === "family" ? (
          Array.isArray(familyGroups) && familyGroups.length > 0 ? (
            familyGroups.map((group, i) => (
              <FamilyGroup
                key={i}
                title={group.title}
                members={group.members || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShield={handleShield}
                onLock={handleLock}
                onDocument={handleDocument}
                onNotifyFamilyGroup={handleNotify}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No family members found.</Text>
          )
        ) : (
          <Insurance Memberinsurance={insuranceList} memberId="1" />
        )}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#111827" },
  iconButton: { backgroundColor: "#f3f4f6", borderRadius: 30, padding: 6 },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 10,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  activeTab: { backgroundColor: "#2563eb" },
  tabText: { color: "#374151", fontWeight: "600" },
  activeText: { color: "#fff" },
  scroll: { flex: 1, paddingHorizontal: 12, marginTop: 6 },
  emptyText: { textAlign: "center", color: "#6b7280", marginTop: 20, fontSize: 15 },
});
