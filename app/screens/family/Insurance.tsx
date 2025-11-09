// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     Image,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import Toast from "react-native-root-toast";
// import { useAuth } from "../../../components/authContext";

// // import { DeleteMemeberInsurance } from "../../services/api";

// interface InsuranceItem {
//   memInsID: number;
//   benefitType: string;
//   insFrontImgURL?: string;
//   insBackImgURL?: string;
//   status?: string;
//   strActiveDateFromTo?: string;
//   eligibilityChkDate?: string;
//   subscriberName?: string;
//   policyType?: string;
// }

// interface Props {
//   Memberinsurance: InsuranceItem[];
//   memberId: string;
// }

// export default function Insurance({ Memberinsurance, memberId }: Props) {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [deleteId, setDeleteId] = useState<number | null>(null);

//   const handleEdit = (item: InsuranceItem) => {
//     router.push(`/screens/family/AddInsurance?action=edit&memberIds=${item.memInsID}&policyTypes=${item.policyType}`);
//   };

//   const confirmDelete = (id: number) => {
//     Alert.alert(
//       "Delete Insurance",
//       "Are you sure you want to delete this insurance record?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Delete", style: "destructive", onPress: () => handleDelete(id) },
//       ]
//     );
//   };

//   const handleDelete = async (id: number) => {
//     setIsLoading(true);
//     try {
//       console.log("Deleting insurance ID:", id);
//       // const res = await DeleteMemeberInsurance(id, user.Mid);
//       // Example mock response
//       const res = { status: "Success", message: "Insurance deleted successfully" };

//       if (res.status === "Success") {
//         Toast.show(res.message, { backgroundColor: "#22c55e" });
//       } else {
//         Toast.show(res.message, { backgroundColor: "#ef4444" });
//       }
//     } catch (err) {
//       Toast.show("Delete failed, please try again", { backgroundColor: "#ef4444" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const navigateToAddInsurance = (policyType: string) => {
//     router.push(`/screens/family/AddInsurance?action=add&memberIds=${memberId}&policyTypes=${policyType}`);
//   };

//   useEffect(() => {
//     if (Memberinsurance?.length) {
//       console.log("Loaded Member insurance list:", Memberinsurance);
//     }
//   }, [Memberinsurance]);

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
//       {isLoading && (
//         <View style={styles.loaderOverlay}>
//           <ActivityIndicator size="large" color="#2563eb" />
//         </View>
//       )}

//       {Memberinsurance && Memberinsurance.length > 0 ? (
//         Memberinsurance.map((ins) => (
//           <View key={ins.memInsID} style={styles.card}>
//             {/* Header */}
//             <View style={styles.header}>
//               <Text style={styles.title}>{ins.benefitType}</Text>
//               <View style={{ flexDirection: "row" }}>
//                 <TouchableOpacity onPress={() => handleEdit(ins)} style={styles.iconBtn}>
//                   <Text style={styles.iconText}>✏️</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => confirmDelete(ins.memInsID)} style={styles.iconBtn}>
//                   <Text style={styles.iconText}>🗑️</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Images */}
//             <View style={styles.imageRow}>
//               <View style={styles.imageBox}>
//                 {ins.insFrontImgURL ? (
//                   <Image
//                     source={{ uri: ins.insFrontImgURL }}
//                     style={styles.image}
//                     resizeMode="contain"
//                   />
//                 ) : (
//                   <View style={styles.imagePlaceholder}>
//                     <Text style={{ color: "#888" }}>No Front</Text>
//                   </View>
//                 )}
//                 <Text style={styles.imageLabel}>Front</Text>
//               </View>
//               <View style={styles.imageBox}>
//                 {ins.insBackImgURL ? (
//                   <Image
//                     source={{ uri: ins.insBackImgURL }}
//                     style={styles.image}
//                     resizeMode="contain"
//                   />
//                 ) : (
//                   <View style={styles.imagePlaceholder}>
//                     <Text style={{ color: "#888" }}>No Back</Text>
//                   </View>
//                 )}
//                 <Text style={styles.imageLabel}>Back</Text>
//               </View>
//             </View>

//             {/* Info Section */}
//             <View style={styles.infoGrid}>
//               <Text style={styles.label}>Status:</Text>
//               <Text style={styles.value}>{ins.status || "-"}</Text>

//               <Text style={styles.label}>Active Dates:</Text>
//               <Text style={styles.value}>{ins.strActiveDateFromTo || "-"}</Text>

//               {ins.status !== "Inactive" && (
//                 <>
//                   <Text style={styles.label}>Validated On:</Text>
//                   <Text style={styles.value}>{ins.eligibilityChkDate || "-"}</Text>

//                   <Text style={styles.label}>Subscriber:</Text>
//                   <Text style={styles.value}>{ins.subscriberName || "-"}</Text>
//                 </>
//               )}
//             </View>
//           </View>
//         ))
//       ) : (
//         <Text style={styles.empty}>No insurance records found.</Text>
//       )}

//       {/* Add Button */}
//       {/* <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => navigateToAddInsurance("1")}
//       >
//         <Text style={styles.addText}>＋ Add Insurance</Text>
//       </TouchableOpacity> */}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f9fafb" },
//   loaderOverlay: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#ffffff99",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 12,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#2563eb",
//   },
//   iconBtn: {
//     marginLeft: 10,
//   },
//   iconText: {
//     fontSize: 18,
//   },
//   imageRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 8,
//   },
//   imageBox: { flex: 1, alignItems: "center" },
//   image: {
//     width: 140,
//     height: 100,
//     borderRadius: 8,
//     backgroundColor: "#eef2ff",
//   },
//   imagePlaceholder: {
//     width: 140,
//     height: 100,
//     borderRadius: 8,
//     backgroundColor: "#e5e7eb",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   imageLabel: { fontSize: 12, color: "#555", marginTop: 4 },
//   infoGrid: {
//     marginTop: 4,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   label: { width: "48%", color: "#555", fontWeight: "500" },
//   value: { width: "48%", textAlign: "right", color: "#111" },
//   addButton: {
//     backgroundColor: "#2563eb",
//     borderRadius: 10,
//     padding: 14,
//     marginVertical: 20,
//     alignItems: "center",
//   },
//   addText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   empty: { textAlign: "center", color: "#888", marginTop: 50 },
// });








// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Toast from "react-native-root-toast";
// import { deleteMemberInsurance, fetchMemberInsurance } from "../../../api/insuranceApi";
// import { useAuth } from "../../../components/authContext";

// interface InsuranceItem {
//   MemInsID: number;
//   BenefitType: string;
//   InsFrontImgURL?: string;
//   InsBackImgURL?: string;
//   InsFrontImgBase64?: string; // ✅ added
//   InsBackImgBase64?: string;  // ✅ added
//   IsActive?: boolean;
//   SubscriberName?: string;
//   PolicyType?: string;
//   AddDate?: string;
//   ModifiedDate?: string;
// }


// interface Props {
//   Memberinsurance?: InsuranceItem[];
//   memberId: string;
// }

// export default function Insurance({ memberId }: Props) {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [insuranceList, setInsuranceList] = useState<InsuranceItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // ✅ Fetch data
//   const loadInsurance = async () => {
//     try {
//       setIsLoading(true);
//       const data = await fetchMemberInsurance(memberId);
//       setInsuranceList(data);
//     } catch (err) {
//       console.error("❌ Error fetching insurance:", err);
//       Toast.show("Failed to load insurance", { backgroundColor: "#ef4444" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadInsurance();
//   }, [memberId]);

//   // ✏️ Edit insurance
//   const handleEdit = (item: InsuranceItem) => {
//     router.push(`/screens/family/AddInsurance?action=edit&memberIds=${memberId}&insuranceId=${item.MemInsID}`);
//   };

//   // 🗑️ Delete insurance
//   const confirmDelete = (id: number) => {
//     Alert.alert(
//       "Delete Insurance",
//       "Are you sure you want to delete this insurance record?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Delete", style: "destructive", onPress: () => handleDelete(id) },
//       ]
//     );
//   };

//   const handleDelete = async (id: number) => {
//     setIsLoading(true);
//     try {
//       const res = await deleteMemberInsurance(id);
//       if (res.status === "Success") {
//         Toast.show(res.message, { backgroundColor: "#22c55e" });
//         loadInsurance();
//       } else {
//         Toast.show(res.message, { backgroundColor: "#ef4444" });
//       }
//     } catch (err) {
//       console.error("❌ Delete error:", err);
//       Toast.show("Delete failed, please try again", { backgroundColor: "#ef4444" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
//       {isLoading && (
//         <View style={styles.loaderOverlay}>
//           <ActivityIndicator size="large" color="#2563eb" />
//         </View>
//       )}

//       {insuranceList.length > 0 ? (
//         insuranceList.map((ins) => (
//           <View key={ins.MemInsID} style={styles.card}>
//             {/* Header */}
//             <View style={styles.header}>
//               <Text style={styles.title}>{ins.BenefitType || "Insurance"}</Text>
//               <View style={{ flexDirection: "row" }}>
//                 <TouchableOpacity onPress={() => handleEdit(ins)} style={styles.iconBtn}>
//                   <Text style={styles.iconText}>✏️</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => confirmDelete(ins.MemInsID)} style={styles.iconBtn}>
//                   <Text style={styles.iconText}>🗑️</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Images */}
//             <View style={styles.imageRow}>
//               <View style={styles.imageBox}>
//                 {ins.InsFrontImgURL ? (
//                   <Image source={{ uri: ins.InsFrontImgURL }} style={styles.image} resizeMode="contain" />
//                 ) : (
//                   <View style={styles.imagePlaceholder}>
//                     <Text style={{ color: "#888" }}>No Front</Text>
//                   </View>
//                 )}
//                 <Text style={styles.imageLabel}>Front</Text>
//               </View>

//               <View style={styles.imageBox}>
//                 {ins.InsBackImgURL ? (
//                   <Image source={{ uri: ins.InsBackImgURL }} style={styles.image} resizeMode="contain" />
//                 ) : (
//                   <View style={styles.imagePlaceholder}>
//                     <Text style={{ color: "#888" }}>No Back</Text>
//                   </View>
//                 )}
//                 <Text style={styles.imageLabel}>Back</Text>
//               </View>
//             </View>

//             {/* Info Section */}
//             <View style={styles.infoGrid}>
//               <Text style={styles.label}>Status:</Text>
//               <Text style={styles.value}>{ins.IsActive ? "Active" : "Inactive"}</Text>

//               <Text style={styles.label}>Subscriber:</Text>
//               <Text style={styles.value}>{ins.SubscriberName || "-"}</Text>

//               <Text style={styles.label}>Policy Type:</Text>
//               <Text style={styles.value}>{ins.PolicyType || "-"}</Text>
//             </View>
//           </View>
//         ))
//       ) : (
//         <Text style={styles.empty}>No insurance records found.</Text>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f9fafb" },
//   loaderOverlay: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#ffffff99",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 12,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#2563eb",
//   },
//   iconBtn: { marginLeft: 10 },
//   iconText: { fontSize: 18 },
//   imageRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 8,
//   },
//   imageBox: { flex: 1, alignItems: "center" },
//   image: {
//     width: 140,
//     height: 100,
//     borderRadius: 8,
//     backgroundColor: "#eef2ff",
//   },
//   imagePlaceholder: {
//     width: 140,
//     height: 100,
//     borderRadius: 8,
//     backgroundColor: "#e5e7eb",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   imageLabel: { fontSize: 12, color: "#555", marginTop: 4 },
//   infoGrid: {
//     marginTop: 4,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   label: { width: "48%", color: "#555", fontWeight: "500" },
//   value: { width: "48%", textAlign: "right", color: "#111" },
//   empty: { textAlign: "center", color: "#888", marginTop: 50 },
// });




// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Toast from "react-native-root-toast";
// import { deleteMemberInsurance, fetchMemberInsurance } from "../../../api/insuranceApi";
// import { useAuth } from "../../../components/authContext";

// interface InsuranceItem {
//   MemInsID: number;
//   BenefitType: string;
//   InsFrontImgURL?: string;
//   InsBackImgURL?: string;
//   InsFrontImgBase64?: string; // ✅ added
//   InsBackImgBase64?: string;  // ✅ added
//   IsActive?: boolean;
//   SubscriberName?: string;
//   PolicyType?: string;
//   AddDate?: string;
//   ModifiedDate?: string;
// }

// interface Props {
//   Memberinsurance?: InsuranceItem[];
//   memberId: string;
// }

// export default function Insurance({ memberId }: Props) {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [insuranceList, setInsuranceList] = useState<InsuranceItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // ✅ Fetch data
//   // const loadInsurance = async () => {
//   //   try {
//   //     setIsLoading(true);
//   //     console.log("🚀 Fetching insurance for memberId:", memberId); // Log memberId
//   //     const data = await fetchMemberInsurance(memberId);
//   //     console.log("✅ Insurance data fetched:", data); // Log the fetched data
//   //     setInsuranceList(data);
//   //   } catch (err) {
//   //     console.error("❌ Error fetching insurance:", err);
//   //     Toast.show("Failed to load insurance", { backgroundColor: "#ef4444" });
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   loadInsurance();
//   // }, [memberId]);

// // Inside the Insurance component, replace loadInsurance and related logic
// useEffect(() => {
//   loadInsurance();
// }, [memberId]);

// const loadInsurance = async () => {
//   try {
//     setIsLoading(true);
//     console.log("🚀 Fetching insurance for FamilyID:", familyId); // Log FamilyID
//     const data = await fetchMemberInsurance(familyId);
//     console.log("✅ Insurance data fetched:", data); // Log the fetched data
//     setInsuranceList(data);
//   } catch (err) {
//     console.error("❌ Error fetching insurance:", err);
//     Toast.show("Failed to load insurance", { backgroundColor: "#ef4444" });
//   } finally {
//     setIsLoading(false);
//   }
// };




//   // ✏️ Edit insurance
//   const handleEdit = (item: InsuranceItem) => {
//     console.log("✏️ Editing insurance for MemInsID:", item.MemInsID); // Log MemInsID being edited
//     router.push(`/screens/family/AddInsurance?action=edit&memberIds=${memberId}&insuranceId=${item.MemInsID}`);
//   };

//   // 🗑️ Delete insurance
//   const confirmDelete = (id: number) => {
//     Alert.alert(
//       "Delete Insurance",
//       "Are you sure you want to delete this insurance record?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Delete", style: "destructive", onPress: () => handleDelete(id) },
//       ]
//     );
//   };

//   const handleDelete = async (id: number) => {
//     setIsLoading(true);
//     try {
//       console.log("🗑️ Deleting insurance with MemInsID:", id); // Log MemInsID being deleted
//       const res = await deleteMemberInsurance(id);
//       if (res.status === "Success") {
//         Toast.show(res.message, { backgroundColor: "#22c55e" });
//         loadInsurance();
//       } else {
//         Toast.show(res.message, { backgroundColor: "#ef4444" });
//       }
//     } catch (err) {
//       console.error("❌ Delete error:", err);
//       Toast.show("Delete failed, please try again", { backgroundColor: "#ef4444" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
//       {isLoading && (
//         <View style={styles.loaderOverlay}>
//           <ActivityIndicator size="large" color="#2563eb" />
//         </View>
//       )}

//       {insuranceList.length > 0 ? (
//         insuranceList.map((ins) => (
//           <View key={ins.MemInsID} style={styles.card}>
//             {/* Header */}
//             <View style={styles.header}>
//               <Text style={styles.title}>{ins.BenefitType || "Insurance"}</Text>
//               <View style={{ flexDirection: "row" }}>
//                 <TouchableOpacity onPress={() => handleEdit(ins)} style={styles.iconBtn}>
//                   <Text style={styles.iconText}>✏️</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => confirmDelete(ins.MemInsID)} style={styles.iconBtn}>
//                   <Text style={styles.iconText}>🗑️</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Images */}
//             <View style={styles.imageRow}>
//               <View style={styles.imageBox}>
//                 {ins.InsFrontImgURL ? (
//                   <Image source={{ uri: ins.InsFrontImgURL }} style={styles.image} resizeMode="contain" />
//                 ) : (
//                   <View style={styles.imagePlaceholder}>
//                     <Text style={{ color: "#888" }}>No Front</Text>
//                   </View>
//                 )}
//                 <Text style={styles.imageLabel}>Front</Text>
//               </View>

//               <View style={styles.imageBox}>
//                 {ins.InsBackImgURL ? (
//                   <Image source={{ uri: ins.InsBackImgURL }} style={styles.image} resizeMode="contain" />
//                 ) : (
//                   <View style={styles.imagePlaceholder}>
//                     <Text style={{ color: "#888" }}>No Back</Text>
//                   </View>
//                 )}
//                 <Text style={styles.imageLabel}>Back</Text>
//               </View>
//             </View>

//             {/* Info Section */}
//             <View style={styles.infoGrid}>
//               <Text style={styles.label}>Status:</Text>
//               <Text style={styles.value}>{ins.IsActive ? "Active" : "Inactive"}</Text>

//               <Text style={styles.label}>Subscriber:</Text>
//               <Text style={styles.value}>{ins.SubscriberName || "-"}</Text>

//               <Text style={styles.label}>Policy Type:</Text>
//               <Text style={styles.value}>{ins.PolicyType || "-"}</Text>
//             </View>
//           </View>
//         ))
//       ) : (
//         <Text style={styles.empty}>No insurance records found.</Text>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f9fafb" },
//   loaderOverlay: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#ffffff99",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 12,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#2563eb",
//   },
//   iconBtn: { marginLeft: 10 },
//   iconText: { fontSize: 18 },
//   imageRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 8,
//   },
//   imageBox: { flex: 1, alignItems: "center" },
//   image: {
//     width: 140,
//     height: 100,
//     borderRadius: 8,
//     backgroundColor: "#eef2ff",
//   },
//   imagePlaceholder: {
//     width: 140,
//     height: 100,
//     borderRadius: 8,
//     backgroundColor: "#e5e7eb",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   imageLabel: { fontSize: 12, color: "#555", marginTop: 4 },
//   infoGrid: {
//     marginTop: 4,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   label: { width: "48%", color: "#555", fontWeight: "500" },
//   value: { width: "48%", textAlign: "right", color: "#111" },
//   empty: { textAlign: "center", color: "#888", marginTop: 50 },
// });

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { deleteMemberInsurance, fetchMemberInsurance } from "../../../api/insuranceApi";
import { useAuth } from "../../../components/authContext";

interface InsuranceItem {
  MemInsID: number;
  BenefitType: string;
  InsFrontImgURL?: string;
  InsBackImgURL?: string;
  InsFrontImgBase64?: string;
  InsBackImgBase64?: string;
  IsActive?: boolean;
  SubscriberName?: string;
  PolicyType?: string;
  AddDate?: string;
  ModifiedDate?: string;
}

interface Props {
  memberId: string;
}

export default function Insurance({ memberId }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [insuranceList, setInsuranceList] = useState<InsuranceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get familyId from authenticated user
  const familyId = user?.familyId;

  // Fetch insurance data based on familyId and all memberIds
  const loadInsurance = async () => {
    try {
      setIsLoading(true);

      if (familyId) {
        // Fetch all member IDs for the given family
        const memberIds = await fetchFamilyMembers(familyId);
        if (memberIds.length > 0) {
          console.log("🚀 Fetching insurance for MemberIDs:", memberIds);
          const data = await fetchMemberInsurance(memberIds);  // Pass member IDs to fetch insurance
          console.log("✅ Insurance data fetched:", data);
          setInsuranceList(data);
        } else {
          Toast.show("No family members found", { backgroundColor: "#ef4444" });
        }
      } else {
        Toast.show("Family ID is missing", { backgroundColor: "#ef4444" });
      }
    } catch (err) {
      console.error("❌ Error fetching insurance:", err);
      Toast.show("Failed to load insurance", { backgroundColor: "#ef4444" });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch family members based on familyId
  const fetchFamilyMembers = async (familyId: string) => {
    try {
      const response = await fetch(`/api/member/GetFamilyDepedent?familyId=${familyId}`);
      const members = await response.json();
      return members.map((member: any) => member.memberID);  // Return array of member IDs
    } catch (err) {
      console.error("❌ Error fetching family members:", err);
      Toast.show("Failed to load family members", { backgroundColor: "#ef4444" });
      return [];
    }
  };

  // Trigger loading when familyId is updated or on component mount
  useEffect(() => {
    if (familyId) {
      loadInsurance();
    }
  }, [familyId]);

  // ✏️ Edit insurance
  const handleEdit = (item: InsuranceItem) => {
    console.log("✏️ Editing insurance for MemInsID:", item.MemInsID);
    router.push(`/screens/family/AddInsurance?action=edit&memberIds=${memberId}&insuranceId=${item.MemInsID}`);
  };

  // 🗑️ Delete insurance
  const confirmDelete = (id: number) => {
    Alert.alert(
      "Delete Insurance",
      "Are you sure you want to delete this insurance record?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDelete(id) },
      ]
    );
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      console.log("🗑️ Deleting insurance with MemInsID:", id);
      const res = await deleteMemberInsurance(id);
      if (res.status === "Success") {
        Toast.show(res.message, { backgroundColor: "#22c55e" });
        loadInsurance();
      } else {
        Toast.show(res.message, { backgroundColor: "#ef4444" });
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      Toast.show("Delete failed, please try again", { backgroundColor: "#ef4444" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      )}

      {insuranceList.length > 0 ? (
        insuranceList.map((ins) => (
          <View key={ins.MemInsID} style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{ins.BenefitType || "Insurance"}</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => handleEdit(ins)} style={styles.iconBtn}>
                  <Text style={styles.iconText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(ins.MemInsID)} style={styles.iconBtn}>
                  <Text style={styles.iconText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Images */}
            <View style={styles.imageRow}>
              <View style={styles.imageBox}>
                {ins.InsFrontImgURL ? (
                  <Image source={{ uri: ins.InsFrontImgURL }} style={styles.image} resizeMode="contain" />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={{ color: "#888" }}>No Front</Text>
                  </View>
                )}
                <Text style={styles.imageLabel}>Front</Text>
              </View>

              <View style={styles.imageBox}>
                {ins.InsBackImgURL ? (
                  <Image source={{ uri: ins.InsBackImgURL }} style={styles.image} resizeMode="contain" />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={{ color: "#888" }}>No Back</Text>
                  </View>
                )}
                <Text style={styles.imageLabel}>Back</Text>
              </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoGrid}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{ins.IsActive ? "Active" : "Inactive"}</Text>

              <Text style={styles.label}>Subscriber:</Text>
              <Text style={styles.value}>{ins.SubscriberName || "-"}</Text>

              <Text style={styles.label}>Policy Type:</Text>
              <Text style={styles.value}>{ins.PolicyType || "-"}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>No insurance records found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff99",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2563eb",
  },
  iconBtn: { marginLeft: 10 },
  iconText: { fontSize: 18 },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  imageBox: { flex: 1, alignItems: "center" },
  image: {
    width: 140,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#eef2ff",
  },
  imagePlaceholder: {
    width: 140,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  imageLabel: { fontSize: 12, color: "#555", marginTop: 4 },
  infoGrid: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  label: { width: "48%", color: "#555", fontWeight: "500" },
  value: { width: "48%", textAlign: "right", color: "#111" },
  empty: { textAlign: "center", color: "#888", marginTop: 50 },
});
