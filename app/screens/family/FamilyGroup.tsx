// import React from "react";
// import { View, Text, FlatList, StyleSheet } from "react-native";
// import FamilyMemberCard from "../family/FamilyMemberCard";

// interface Member {
//   id: string;
//   name: string;
//   relation: string;
//   imageUrl?: string;
// }

// interface Props {
//   title: string;
//   members: Member[];
//   onNotifyFamilyGroup?: (msg: string) => void;
// }

// export default function FamilyGroup({ title, members, onNotifyFamilyGroup }: Props) {
//   const handleNotification = (childMessage: string) => {
//     console.log("Notification from FamilyMemberCard:", childMessage);
//     onNotifyFamilyGroup && onNotifyFamilyGroup("Call_From_FamilyMemberCard!");
//   };

//   return (
//     <View style={styles.groupContainer}>
//       <Text style={styles.title}>{title}</Text>

//       <FlatList
//         data={members}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <FamilyMemberCard
//             member={item.id}
//             name={item.name}
//             relation={item.relation}
//             imageUrl={item.imageUrl}
//             onNotify={handleNotification}
//           />
//         )}
//         ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
//         scrollEnabled={false} // inside ScrollView parent
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   groupContainer: {
//     backgroundColor: "#f3f4f6",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 10,
//   },
// });





// import { useRouter } from "expo-router";
// import React from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Toast from "react-native-root-toast";

// // ✅ Define types for members and props
// interface Member {
//   id: string;
//   name: string;
//   relation: string;
//   imageUrl: string;
// }

// interface FamilyGroupProps {
//   title: string;
//   members: Member[];
//   onNotifyFamilyGroup: (msg: string) => void;
// }

// export default function FamilyGroup({
//   title,
//   members,
//   onNotifyFamilyGroup,
// }: FamilyGroupProps) {
//   const router = useRouter();

//   const notifyParent = () => {
//     onNotifyFamilyGroup("Call_From_FamilyMemberCard!");
//   };

//   const handleEdit = (member: Member) => {
//     console.log("Edit", member.name);
//     Toast.show(`Editing ${member.name}`, { backgroundColor: "#2563eb" });
//     // router.push(`/screens/family/MemberDetails?id=${member.id}`);
//   };

//   const handleDelete = (member: Member) => {
//     console.log("Delete", member.name);
//     Toast.show(`${member.name} deleted`, { backgroundColor: "#ef4444" });
//   };

//   const handleInsurance = (member: Member) => {
//     console.log("Insurance for", member.name);
//     Toast.show(`Insurance details for ${member.name}`, {
//       backgroundColor: "#10b981",
//     });
//   };

//   const handleVault = (member: Member) => {
//     console.log("Vault for", member.name);
//     Toast.show(`Vault opened for ${member.name}`, {
//       backgroundColor: "#6b7280",
//     });
//   };

//   const handleBills = (member: Member) => {
//     console.log("Bills for", member.name);
//     Toast.show(`Bill Review for ${member.name}`, {
//       backgroundColor: "#2563eb",
//     });
//   };

//   return (
//     <View style={styles.groupContainer}>
//       <Text style={styles.groupTitle}>{title}</Text>

//       {members.map((member) => (
//         <View key={member.id} style={styles.card}>
//           {/* Profile Section */}
//           <View style={styles.profileRow}>
//             <Image source={{ uri: member.imageUrl }} style={styles.avatar} />
//             <View style={{ flex: 1 }}>
//               <Text style={styles.name}>{member.name}</Text>
//               <Text style={styles.relation}>{member.relation}</Text>
//             </View>
//           </View>

//           {/* Action Row */}
//           <View style={styles.actionRow}>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => handleEdit(member)}
//             >
//               <Text style={[styles.actionText, { color: "#2563eb" }]}>
//                 Edit
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => handleDelete(member)}
//             >
//               <Text style={[styles.actionText, { color: "#ef4444" }]}>
//                 Delete
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => handleInsurance(member)}
//             >
//               <Text style={[styles.actionText, { color: "#10b981" }]}>
//                 Insurance
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => handleVault(member)}
//             >
//               <Text style={[styles.actionText, { color: "#6b7280" }]}>
//                 Vault
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => handleBills(member)}
//             >
//               <Text style={[styles.actionText, { color: "#111827" }]}>
//                 Bill Review
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   groupContainer: {
//     backgroundColor: "#f9fafb",
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   groupTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 8,
//     color: "#111827",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   profileRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   relation: {
//     fontSize: 14,
//     color: "#6b7280",
//   },
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 10,
//     paddingHorizontal: 4,
//   },
//   actionButton: {
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     borderRadius: 6,
//   },
//   actionText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },
// });






// import { Ionicons } from "@expo/vector-icons";
// import React from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// interface Member {
//   id: string;
//   name: string;
//   relation: string;
//   imageUrl: string;
// }

// interface FamilyGroupProps {
//   title: string;
//   members: Member[];
//   onNotifyFamilyGroup?: (msg: string) => void;
// }

// export default function FamilyGroup({
//   title,
//   members = [],
//   onNotifyFamilyGroup,
// }: FamilyGroupProps) {
//   return (
//     <View style={styles.groupContainer}>
//       <Text style={styles.groupTitle}>{title}</Text>

//       {Array.isArray(members) && members.length > 0 ? (
//         members.map((member) => (
//           <View key={member.id} style={styles.memberCard}>
//             {/* Member Info */}
//             <View style={styles.memberInfo}>
//               <Image source={{ uri: member.imageUrl }} style={styles.avatar} />
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.memberName}>{member.name}</Text>
//                 <Text style={styles.memberRelation}>{member.relation}</Text>
//               </View>
//             </View>

//             {/* ✅ Icon Row */}
//             <View style={styles.iconRow}>
//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => onNotifyFamilyGroup?.("Edit")}
//               >
//                 <Ionicons name="create-outline" size={22} color="#2563eb" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => onNotifyFamilyGroup?.("Delete")}
//               >
//                 <Ionicons name="trash-outline" size={22} color="#ef4444" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => onNotifyFamilyGroup?.("Insurance")}
//               >
//                 <Ionicons name="shield-checkmark-outline" size={22} color="#059669" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => onNotifyFamilyGroup?.("Vault")}
//               >
//                 <Ionicons name="lock-closed-outline" size={22} color="#374151" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => onNotifyFamilyGroup?.("Bill Review")}
//               >
//                 <Ionicons name="document-text-outline" size={22} color="#374151" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))
//       ) : (
//         <Text style={styles.noMemberText}>No members available</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   groupContainer: {
//     marginBottom: 20,
//   },
//   groupTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 8,
//     paddingHorizontal: 4,
//   },
//   memberCard: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   memberInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   memberName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   memberRelation: {
//     fontSize: 14,
//     color: "#6b7280",
//   },
//   iconRow: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     borderTopWidth: 1,
//     borderColor: "#e5e7eb",
//     paddingTop: 8,
//   },
//   iconButton: {
//     padding: 6,
//   },
//   noMemberText: {
//     textAlign: "center",
//     color: "#6b7280",
//     marginTop: 6,
//   },
// });



// import { Ionicons } from "@expo/vector-icons";
// import React from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// interface Member {
//   id: string;
//   name: string;
//   relation: string;
//   imageUrl: string;
// }

// interface FamilyGroupProps {
//   title: string;
//   members: Member[];
//   onEdit: (member: Member) => void;
//   onDelete: (member: Member) => void;
//   onShield: (member: Member) => void;
//   onLock: (member: Member) => void;
//   onDocument: (member: Member) => void;
//   onNotifyFamilyGroup?: (msg: string) => void;
// }

// export default function FamilyGroup({
//   title,
//   members = [],
//   onEdit,
//   onDelete,
//   onShield,
//   onLock,
//   onDocument,
//   onNotifyFamilyGroup,
// }: FamilyGroupProps) {
//   return (
//     <View style={styles.groupContainer}>
//       <Text style={styles.groupTitle}>{title}</Text>

//       {Array.isArray(members) && members.length > 0 ? (
//         members.map((member) => (
//           <View key={member.id} style={styles.memberCard}>
//             {/* Member Info */}
//             <View style={styles.memberInfo}>
//               <Image source={{ uri: member.imageUrl }} style={styles.avatar} />
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.memberName}>{member.name}</Text>
//                 <Text style={styles.memberRelation}>{member.relation}</Text>
//               </View>
//             </View>

//             {/* ✅ Icon Row */}
//             <View style={styles.iconRow}>
//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => onEdit(member)}
//               >
//                 <Ionicons name="create-outline" size={22} color="#2563eb" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => onDelete(member)}
//               >
//                 <Ionicons name="trash-outline" size={22} color="#ef4444" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => onShield(member)}
//               >
//                 <Ionicons name="shield-checkmark-outline" size={22} color="#059669" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => onLock(member)}
//               >
//                 <Ionicons name="lock-closed-outline" size={22} color="#374151" />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => onDocument(member)}
//               >
//                 <Ionicons name="document-text-outline" size={22} color="#374151" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))
//       ) : (
//         <Text style={styles.noMemberText}>No members available</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   groupContainer: {
//     marginBottom: 20,
//   },
//   groupTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 8,
//     paddingHorizontal: 4,
//   },
//   memberCard: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   memberInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   memberName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   memberRelation: {
//     fontSize: 14,
//     color: "#6b7280",
//   },
//   iconRow: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     borderTopWidth: 1,
//     borderColor: "#e5e7eb",
//     paddingTop: 8,
//   },
//   iconButton: {
//     padding: 6,
//   },
//   noMemberText: {
//     textAlign: "center",
//     color: "#6b7280",
//     marginTop: 6,
//   },
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

// export default function FamilyHub() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("family");
//   const [familyGroups, setFamilyGroups] = useState<any[]>([]);
//   const [insuranceList, setInsuranceList] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

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
//     // eslint-disable-next-line
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

//   // --- ICON HANDLERS ---
//   const handleEdit = (member: any) => {
//     router.push({
//       pathname: "/screens/family/EditMember",
//       params: { memberId: member.id },
//     });
//   };

//   const handleDelete = (member: any) => {
//     Alert.alert(
//       "Delete Member",
//       `Are you sure you want to delete ${member.name}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => {
//             // TODO: Call delete API here!
//             Toast.show("Deleted " + member.name, { backgroundColor: "#ef4444" });
//           }
//         }
//       ]
//     );
//   };

//   const handleShield = (member: any) => {
//     Toast.show("Insurance for " + member.name, { backgroundColor: "#22c55e" });
//     // Optionally, you can route to insurance details.
//   };

//   const handleLock = (member: any) => {
//     Toast.show("Vault clicked for " + member.name, { backgroundColor: "#2563eb" });
//     // Optionally, you can navigate to a vault/documents page.
//   };

//   const handleDocument = (member: any) => {
//     router.push({
//       pathname: "/screens/family/MemberDocs",
//       params: { memberId: member.id },
//     });
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



import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Member {
  id: string;
  name: string;
  relation: string;
  imageUrl: string;
}

interface FamilyGroupProps {
  title: string;
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onShield: (member: Member) => void;
  onLock: (member: Member) => void;
  onDocument: (member: Member) => void;
  onNotifyFamilyGroup?: (msg: string) => void;
}

export default function FamilyGroup({
  title,
  members = [],
  onEdit,
  onDelete,
  onShield,
  onLock,
  onDocument,
  onNotifyFamilyGroup,
}: FamilyGroupProps) {
  return (
    <View style={styles.groupContainer}>
      <Text style={styles.groupTitle}>{title}</Text>

      {Array.isArray(members) && members.length > 0 ? (
        members.map((member, index) => (
          // ✅ Unique key fix: combine id + relation + index
          <View key={`${member.id}_${member.relation || "none"}_${index}`} style={styles.memberCard}>
            {/* Member Info */}
            <View style={styles.memberInfo}>
              <Image
                source={{ uri: member.imageUrl }}
                style={styles.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRelation}>{member.relation}</Text>
              </View>
            </View>

            {/* ✅ Icon Row */}
            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onEdit(member)}
              >
                <Ionicons name="create-outline" size={22} color="#2563eb" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onDelete(member)}
              >
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onShield(member)}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color="#059669"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onLock(member)}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#374151"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onDocument(member)}
              >
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color="#374151"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noMemberText}>No members available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  memberCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  memberRelation: {
    fontSize: 14,
    color: "#6b7280",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingTop: 8,
  },
  iconButton: {
    padding: 6,
  },
  noMemberText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 6,
  },
});
