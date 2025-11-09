


// // import { Ionicons } from "@expo/vector-icons";
// // import DateTimePicker from "@react-native-community/datetimepicker";
// // import { Picker } from "@react-native-picker/picker";
// // import { useRouter } from "expo-router";
// // import React, { useState } from "react";
// // import {
// //   Modal,
// //   Platform,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";

// // // --- Hardcoded demo data ---
// // const dependents = [
// //   { memberID: "0", firstName: "All Family Members" },
// //   { memberID: "1", firstName: "Self - Alex" },
// //   { memberID: "2", firstName: "Spouse - Priya" },
// //   { memberID: "3", firstName: "Child - Neha" },
// // ];
// // const bills = [
// //   {
// //     id: "1",
// //     dos: "2024-05-10",
// //     provider: "City Imaging Center",
// //     claimNo: "CICP-051024",
// //     amount: "$525.50",
// //     status: "reviewed",
// //     actions: ["View Ledger", "Schedule"],
// //   },
// //   {
// //     id: "2",
// //     dos: "2024-03-15",
// //     provider: "Mercy General Hospital",
// //     claimNo: "MG789123",
// //     amount: "$1125.50",
// //     status: "reviewed",
// //     actions: ["View Ledger", "ScoreCard"],
// //   },
// //   {
// //     id: "3",
// //     dos: "2024-04-02",
// //     provider: "Quest Diagnostics",
// //     claimNo: "QD456789",
// //     amount: "$125.50",
// //     status: "pending",
// //     actions: ["View Ledger", "Initiate Review"],
// //   },
// //   {
// //     id: "4",
// //     dos: "2024-03-02",
// //     provider: "Bright Smiles Dental",
// //     claimNo: "QD456789",
// //     amount: "$75.00",
// //     status: "pending_extraction",
// //     actions: ["EOB", "Statement", "Receipts"],
// //   },
// // ];

// // // --- Helper for formatted date ---
// // function formatDate(date: Date | string | null | undefined): string {
// //   if (!date) return "";
// //   const d = typeof date === "string" ? new Date(date) : date;
// //   const day = String(d.getDate()).padStart(2, "0");
// //   const month = String(d.getMonth() + 1).padStart(2, "0");
// //   const year = d.getFullYear();
// //   return `${day}/${month}/${year}`;
// // }

// // export default function MyBills() {
// //   const router = useRouter();

// //   // ---- State ----
// //   const [startDate, setStartDate] = useState(new Date("2024-01-01"));
// //   const [endDate, setEndDate] = useState(new Date("2024-12-31"));
// //   const [selectedMember, setSelectedMember] = useState("0");
// // const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null);
// //   const [tempDate, setTempDate] = useState(new Date());

// //   // --- Handle open/close for pickers ---
// // const openDatePicker = (type: "start" | "end") => {
// //   setTempDate(type === "start" ? startDate : endDate);
// //   setOpenPicker(type);  // <-- No error now!
// // };
// //   const confirmDate = () => {
// //     if (openPicker === "start") setStartDate(tempDate);
// //     else if (openPicker === "end") setEndDate(tempDate);
// //     setOpenPicker(null);
// //   };

// //   return (
// //     <View style={styles.root}>
// //       {/* --- Header --- */}
// //       <View style={styles.header}>
// //         <Text style={styles.title}>My Bills</Text>
// //         <TouchableOpacity
// //   style={styles.addBtn}
// //   onPress={() => router.push("/screens/UplodetoPdf")}
// // >
// //   <Ionicons name="add" size={24} color="#4f46e5" />
// // </TouchableOpacity>

// //       </View>

// //       <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
// //         {/* --- Date Range Row --- */}
// //         <View style={styles.row}>
// //           <TouchableOpacity
// //             style={styles.dateInput}
// //             onPress={() => openDatePicker("start")}
// //             activeOpacity={0.8}
// //           >
// //             <Text style={styles.dateText}>{formatDate(startDate)}</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity
// //             style={styles.dateInput}
// //             onPress={() => openDatePicker("end")}
// //             activeOpacity={0.8}
// //           >
// //             <Text style={styles.dateText}>{formatDate(endDate)}</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* --- Member dropdown (new row) --- */}
// //         <View style={styles.dropdownWrap}>
// //           <Picker
// //             selectedValue={selectedMember}
// //             style={styles.picker}
// //             onValueChange={setSelectedMember}
// //             dropdownIconColor="#4f46e5"
// //           >
// //             {dependents.map((item) => (
// //               <Picker.Item key={item.memberID} label={item.firstName} value={item.memberID} />
// //             ))}
// //           </Picker>
// //         </View>

// //         {/* --- Description --- */}
// //         <View style={{ margin: 16 }}>
// //           <Text style={{ fontWeight: "700", fontSize: 17, marginBottom: 2, color: "#222" }}>
// //             My Bills
// //           </Text>
// //           <Text style={styles.sectionDesc}>
// //             This is your personal Bills. Here we have extracted the data from the Statements, EOBs and Receipts which you have received from your Physicians or Hospitals and which you have uploaded in your vault.
// //           </Text>
// //         </View>

// //         {/* --- Bills List --- */}
// //         {bills.map((bill) => (
// //           <View key={bill.id} style={styles.billCard}>
// //             <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
// //               <View>
// //                 <Text style={styles.billDOS}>DOS: {bill.dos}</Text>
// //                 <Text style={styles.billProvider}>
// //                   Provider: <Text style={{ fontWeight: "600", color: "#4f46e5" }}>{bill.provider}</Text>
// //                 </Text>
// //                 <Text style={styles.billClaim}>Claim #: {bill.claimNo}</Text>
// //               </View>
// //               <Text style={styles.billAmount}>{bill.amount}</Text>
// //             </View>
// //             <View style={{ flexDirection: "row", marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
// //               {bill.status === "reviewed" && (
// //                 <View style={styles.statusReviewed}><Text style={styles.statusText}>Reviewed</Text></View>
// //               )}
// //               {bill.status === "pending" && (
// //                 <View style={styles.statusPending}><Text style={styles.statusText}>Pending Review</Text></View>
// //               )}
// //               {bill.status === "pending_extraction" && (
// //                 <View style={styles.statusExtraction}><Text style={styles.statusText}>Pending Data Extraction</Text></View>
// //               )}
// //               {bill.actions?.map((a, idx) => (
// //                 <TouchableOpacity key={a + idx} style={styles.actionBtn}>
// //                   <Text style={styles.actionText}>{a}</Text>
// //                 </TouchableOpacity>
// //               ))}
// //             </View>
// //           </View>
// //         ))}
// //       </ScrollView>

// //       {/* --- Date Picker Modal for iOS only --- */}
// //       {Platform.OS === "ios" && openPicker && (
// //         <Modal transparent visible={!!openPicker} animationType="slide">
// //           <View style={styles.iosModalBg}>
// //             <View style={styles.iosPickerCard}>
// //               <DateTimePicker
// //                 value={tempDate}
// //                 mode="date"
// //                 display="spinner"
// //                 textColor="#fff" // Some expo versions support this; fallback is dark bg.
// //                 onChange={(_, selected) => {
// //                   if (selected) setTempDate(selected);
// //                 }}
// //                 maximumDate={openPicker === "start" ? endDate : undefined}
// //                 minimumDate={openPicker === "end" ? startDate : undefined}
// //                 style={{ backgroundColor: "#222" }}
// //               />
// //               <TouchableOpacity style={styles.iosDoneBtn} onPress={confirmDate}>
// //                 <Text style={styles.iosDoneText}>Done</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </Modal>
// //       )}

// //       {/* --- Android native pickers --- */}
// //       {Platform.OS === "android" && openPicker === "start" && (
// //         <DateTimePicker
// //           value={startDate}
// //           mode="date"
// //           display="default"
// //           onChange={(_, selected) => {
// //             setOpenPicker(null);
// //             if (selected) setStartDate(selected);
// //           }}
// //           maximumDate={endDate}
// //         />
// //       )}
// //       {Platform.OS === "android" && openPicker === "end" && (
// //         <DateTimePicker
// //           value={endDate}
// //           mode="date"
// //           display="default"
// //           onChange={(_, selected) => {
// //             setOpenPicker(null);
// //             if (selected) setEndDate(selected);
// //           }}
// //           minimumDate={startDate}
// //         />
// //       )}

// //       {/* --- Footer Navigation --- */}
// //       <View style={styles.footer}>
// //         <TouchableOpacity style={styles.footerBtn} onPress={() => router.push("/screens/dashboardscreen")}>
// //           <Ionicons name="home-outline" size={24} color="#4f46e5" />
// //           <Text style={styles.footerLabel}>Home</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.footerBtn} onPress={() => router.push("/screens/family/FamilyHub")}>
// //           <Ionicons name="people-outline" size={24} color="#4f46e5" />
// //           <Text style={styles.footerLabel}>My Family</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.footerBtn}>
// //           <Ionicons name="document-text-outline" size={24} color="#4f46e5" />
// //           <Text style={styles.footerLabel}>My Bills</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity style={styles.footerBtn}>
// //           <Ionicons name="time-outline" size={24} color="#4f46e5" />
// //           <Text style={styles.footerLabel}>Timeline</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   root: { flex: 1, backgroundColor: "#f8fafc" },
// //   header: {
// //     paddingTop: Platform.OS === "ios" ? 48 : 28,
// //     paddingHorizontal: 16,
// //     paddingBottom: 12,
// //     backgroundColor: "#fff",
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     borderBottomColor: "#e5e7eb",
// //     borderBottomWidth: 1,
// //   },
// //   title: { fontSize: 26, fontWeight: "700", color: "#111" },
// //   addBtn: { padding: 7, borderRadius: 50, backgroundColor: "#f3f4f6" },

// //   row: { flexDirection: "row", gap: 12, margin: 16, marginBottom: 0 },
// //   dateInput: {
// //     flex: 1,
// //     paddingVertical: 13,
// //     backgroundColor: "#fff",
// //     borderRadius: 10,
// //     borderColor: "#b5b5be",
// //     borderWidth: 1.2,
// //     fontSize: 17,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: 0,
// //   },
// //   dateText: { fontSize: 17, fontWeight: "700", color: "#232323" },

// //   dropdownWrap: {
// //     backgroundColor: "#fff",
// //     marginHorizontal: 16,
// //     marginTop: 14,
// //     borderRadius: 10,
// //     borderColor: "#b5b5be",
// //     borderWidth: 1.2,
// //     overflow: "hidden",
// //     marginBottom: 8,
// //   },
// //   picker: { height: 48, color: "#232323" },

// //   sectionDesc: { fontSize: 14, color: "#6b7280", marginTop: 1 },
// //   billCard: {
// //     backgroundColor: "#fff",
// //     borderRadius: 12,
// //     marginHorizontal: 14,
// //     marginTop: 14,
// //     padding: 15,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.08,
// //     shadowRadius: 7,
// //     elevation: 3,
// //   },
// //   billDOS: { fontWeight: "700", color: "#222" },
// //   billProvider: { marginTop: 2, color: "#333" },
// //   billClaim: { color: "#6b7280", fontSize: 13, marginTop: 1 },
// //   billAmount: { fontWeight: "700", fontSize: 19, color: "#10b981", alignSelf: "flex-end" },
// //   statusReviewed: {
// //     backgroundColor: "#d1fae5",
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //     marginRight: 8,
// //   },
// //   statusPending: {
// //     backgroundColor: "#fef9c3",
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //     marginRight: 8,
// //   },
// //   statusExtraction: {
// //     backgroundColor: "#fef3c7",
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //     marginRight: 8,
// //   },
// //   statusText: { color: "#065f46", fontWeight: "700" },
// //   actionBtn: {
// //     backgroundColor: "#eef2ff",
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     borderRadius: 8,
// //     marginLeft: 8,
// //     marginTop: 4,
// //   },
// //   actionText: { color: "#6366f1", fontWeight: "600" },

// //   // iOS Picker modal
// //   iosModalBg: {
// //     flex: 1,
// //     justifyContent: "flex-end",
// //     backgroundColor: "rgba(0,0,0,0.55)",
// //   },
// //   iosPickerCard: {
// //     backgroundColor: "#222",
// //     borderTopLeftRadius: 18,
// //     borderTopRightRadius: 18,
// //     paddingBottom: 32,
// //     paddingTop: 16,
// //     alignItems: "center",
// //   },
// //   iosDoneBtn: {
// //     marginTop: 10,
// //     backgroundColor: "#fff",
// //     borderRadius: 7,
// //     paddingHorizontal: 24,
// //     paddingVertical: 8,
// //   },
// //   iosDoneText: { color: "#6366f1", fontWeight: "700", fontSize: 18 },

// //   footer: {
// //     position: "absolute",
// //     left: 0, right: 0, bottom: 0,
// //     height: 58,
// //     backgroundColor: "#fff",
// //     flexDirection: "row",
// //     borderTopWidth: 1,
// //     borderTopColor: "#ddd",
// //     alignItems: "center",
// //     justifyContent: "space-around",
// //     zIndex: 10,
// //   },
// //   footerBtn: { flex: 1, alignItems: "center", justifyContent: "center" },
// //   footerLabel: { fontSize: 12, color: "#222", marginTop: 2 },
// // });





// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Modal,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { getBillsByMember } from "../../../api/billsApi"; // ✅ your API file

// // --- Helper for formatted date ---
// function formatDate(date: Date | string | null | undefined): string {
//   if (!date) return "";
//   const d = typeof date === "string" ? new Date(date) : date;
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const year = d.getFullYear();
//   return `${day}/${month}/${year}`;
// }

// export default function MyBills() {
//   const router = useRouter();

//   // ---- State ----
//   const [startDate, setStartDate] = useState(new Date("2024-01-01"));
//   const [endDate, setEndDate] = useState(new Date("2024-12-31"));
//   const [dependents, setDependents] = useState<any[]>([]);
//   const [selectedMember, setSelectedMember] = useState<string>("0");
//   const [bills, setBills] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null);
//   const [tempDate, setTempDate] = useState(new Date());

//   // --- Fetch family members ---
//   const fetchMembers = async () => {
//     try {
//       const user = JSON.parse((await AsyncStorage.getItem("user")) || "{}");
//       const res = await fetch(
//         `https://isela-ungrumpy-undiligently.ngrok-free.dev/api/member/list/${user.id}`
//       );
//       const data = await res.json();
//       const formatted = [
//         { memberID: "0", firstName: "All Family Members" },
//         ...data.map((m: any) => ({
//           memberID: String(m.MemberID),
//           firstName: `${m.Relation || "Self"} - ${m.FirstName}`,
//         })),
//       ];
//       setDependents(formatted);
//     } catch (err) {
//       console.error("❌ Error fetching members:", err);
//     }
//   };

//   // --- Fetch bills for selected member ---
//   const fetchBills = async (memberId: string) => {
//     if (memberId === "0") {
//       setBills([]);
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await getBillsByMember(Number(memberId));
//       if (Array.isArray(res)) setBills(res);
//       else Alert.alert("⚠️", res.message || "No bills found");
//     } catch (err) {
//       console.error("❌ Error fetching bills:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- On screen load ---
//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   // --- When selected member changes ---
//   useEffect(() => {
//     if (selectedMember !== "0") fetchBills(selectedMember);
//   }, [selectedMember]);

//   const openDatePicker = (type: "start" | "end") => {
//     setTempDate(type === "start" ? startDate : endDate);
//     setOpenPicker(type);
//   };
//   const confirmDate = () => {
//     if (openPicker === "start") setStartDate(tempDate);
//     else if (openPicker === "end") setEndDate(tempDate);
//     setOpenPicker(null);
//   };

//   return (
//     <View style={styles.root}>
//       {/* --- Header --- */}
//       <View style={styles.header}>
//         <Text style={styles.title}>My Bills</Text>
//         <TouchableOpacity
//           style={styles.addBtn}
//           onPress={() => router.push("/screens/bills/UplodetoPdf")}
//         >
//           <Ionicons name="add" size={24} color="#4f46e5" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
//         {/* --- Date Range Row --- */}
//         <View style={styles.row}>
//           <TouchableOpacity
//             style={styles.dateInput}
//             onPress={() => openDatePicker("start")}
//           >
//             <Text style={styles.dateText}>{formatDate(startDate)}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.dateInput}
//             onPress={() => openDatePicker("end")}
//           >
//             <Text style={styles.dateText}>{formatDate(endDate)}</Text>
//           </TouchableOpacity>
//         </View>

//         {/* --- Member dropdown --- */}
//         <View style={styles.dropdownWrap}>
//           <Picker
//             selectedValue={selectedMember}
//             style={styles.picker}
//             onValueChange={setSelectedMember}
//             dropdownIconColor="#4f46e5"
//           >
//             {dependents.map((item) => (
//               <Picker.Item
//                 key={item.memberID}
//                 label={item.firstName}
//                 value={item.memberID}
//               />
//             ))}
//           </Picker>
//         </View>

//         {/* --- Description --- */}
//         <View style={{ margin: 16 }}>
//           <Text
//             style={{
//               fontWeight: "700",
//               fontSize: 17,
//               marginBottom: 2,
//               color: "#222",
//             }}
//           >
//             My Bills
//           </Text>
//           <Text style={styles.sectionDesc}>
//             This is your personal Bills section. Here we have extracted the data
//             from the Statements, EOBs, and Receipts which you have uploaded.
//           </Text>
//         </View>

//         {/* --- Bills List --- */}
//         {loading ? (
//           <ActivityIndicator
//             size="large"
//             color="#4f46e5"
//             style={{ marginTop: 40 }}
//           />
//         ) : bills.length ? (
//           bills.map((bill) => (
//             <View key={bill.BillID} style={styles.billCard}>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <View>
//                   <Text style={styles.billDOS}>
//                     Bill Date: {formatDate(bill.BillDate)}
//                   </Text>
//                   <Text style={styles.billProvider}>
//                     Added By:{" "}
//                     <Text
//                       style={{ fontWeight: "600", color: "#4f46e5" }}
//                     >
//                       {bill.AddedBy || "System"}
//                     </Text>
//                   </Text>
//                   <Text style={styles.billClaim}>
//                     File Type: {bill.FileType || "N/A"}
//                   </Text>
//                 </View>
//               </View>

//               <View
//                 style={{
//                   flexDirection: "row",
//                   marginTop: 8,
//                   flexWrap: "wrap",
//                   alignItems: "center",
//                 }}
//               >
//                 <TouchableOpacity
//                   style={styles.actionBtn}
//                   onPress={() =>
//                     router.push({
//                       pathname: "/screens/bills/ViewBill",
//                       params: { fileUrl: bill.BillFile },
//                     })
//                   }
//                 >
//                   <Text style={styles.actionText}>View Bill</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ))
//         ) : (
//           <Text style={{ textAlign: "center", marginTop: 40, color: "#666" }}>
//             No bills found for this member.
//           </Text>
//         )}
//       </ScrollView>

//       {/* --- iOS Picker Modal --- */}
//       {Platform.OS === "ios" && openPicker && (
//         <Modal transparent visible={!!openPicker} animationType="slide">
//           <View style={styles.iosModalBg}>
//             <View style={styles.iosPickerCard}>
//               <DateTimePicker
//                 value={tempDate}
//                 mode="date"
//                 display="spinner"
//                 onChange={(_, selected) => {
//                   if (selected) setTempDate(selected);
//                 }}
//                 maximumDate={openPicker === "start" ? endDate : undefined}
//                 minimumDate={openPicker === "end" ? startDate : undefined}
//                 style={{ backgroundColor: "#222" }}
//               />
//               <TouchableOpacity style={styles.iosDoneBtn} onPress={confirmDate}>
//                 <Text style={styles.iosDoneText}>Done</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}

//       {/* --- Footer Navigation --- */}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={styles.footerBtn}
//           onPress={() => router.push("/screens/dashboardscreen")}
//         >
//           <Ionicons name="home-outline" size={24} color="#4f46e5" />
//           <Text style={styles.footerLabel}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.footerBtn}
//           onPress={() => router.push("/screens/family/FamilyHub")}
//         >
//           <Ionicons name="people-outline" size={24} color="#4f46e5" />
//           <Text style={styles.footerLabel}>My Family</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerBtn}>
//           <Ionicons name="document-text-outline" size={24} color="#4f46e5" />
//           <Text style={styles.footerLabel}>My Bills</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerBtn}>
//           <Ionicons name="time-outline" size={24} color="#4f46e5" />
//           <Text style={styles.footerLabel}>Timeline</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // --- Styles unchanged ---
// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: "#f8fafc" },
//   header: {
//     paddingTop: Platform.OS === "ios" ? 48 : 28,
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomColor: "#e5e7eb",
//     borderBottomWidth: 1,
//   },
//   title: { fontSize: 26, fontWeight: "700", color: "#111" },
//   addBtn: { padding: 7, borderRadius: 50, backgroundColor: "#f3f4f6" },
//   row: { flexDirection: "row", gap: 12, margin: 16, marginBottom: 0 },
//   dateInput: {
//     flex: 1,
//     paddingVertical: 13,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderColor: "#b5b5be",
//     borderWidth: 1.2,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   dateText: { fontSize: 17, fontWeight: "700", color: "#232323" },
//   dropdownWrap: {
//     backgroundColor: "#fff",
//     marginHorizontal: 16,
//     marginTop: 14,
//     borderRadius: 10,
//     borderColor: "#b5b5be",
//     borderWidth: 1.2,
//     overflow: "hidden",
//     marginBottom: 8,
//   },
//   picker: { height: 48, color: "#232323" },
//   sectionDesc: { fontSize: 14, color: "#6b7280", marginTop: 1 },
//   billCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginHorizontal: 14,
//     marginTop: 14,
//     padding: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 7,
//     elevation: 3,
//   },
//   billDOS: { fontWeight: "700", color: "#222" },
//   billProvider: { marginTop: 2, color: "#333" },
//   billClaim: { color: "#6b7280", fontSize: 13, marginTop: 1 },
//   billAmount: {
//     fontWeight: "700",
//     fontSize: 19,
//     color: "#10b981",
//     alignSelf: "flex-end",
//   },
//   actionBtn: {
//     backgroundColor: "#eef2ff",
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8,
//     marginLeft: 8,
//     marginTop: 4,
//   },
//   actionText: { color: "#6366f1", fontWeight: "600" },
//   iosModalBg: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: "rgba(0,0,0,0.55)",
//   },
//   iosPickerCard: {
//     backgroundColor: "#222",
//     borderTopLeftRadius: 18,
//     borderTopRightRadius: 18,
//     paddingBottom: 32,
//     paddingTop: 16,
//     alignItems: "center",
//   },
//   iosDoneBtn: {
//     marginTop: 10,
//     backgroundColor: "#fff",
//     borderRadius: 7,
//     paddingHorizontal: 24,
//     paddingVertical: 8,
//   },
//   iosDoneText: { color: "#6366f1", fontWeight: "700", fontSize: 18 },
//   footer: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: 58,
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//     alignItems: "center",
//     justifyContent: "space-around",
//     zIndex: 10,
//   },
//   footerBtn: { flex: 1, alignItems: "center", justifyContent: "center" },
//   footerLabel: { fontSize: 12, color: "#222", marginTop: 2 },
// });


// anbove is the doc scannner code 









// import * as DocumentPicker from "expo-document-picker";
// import * as Sharing from "expo-sharing";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DocumentScanner from "react-native-document-scanner-plugin";
// import { generateFilename } from "../../../components/helpers";
// import { enhanceImage } from "../../../components/imageUtils";
// import { generatePDF } from "../../../components/pdfGenerator";

// export default function UplodetoPdf() {
//   const [scannedPDF, setScannedPDF] = useState<any>(null);
//   const [uploadedImage, setUploadedImage] = useState<any>(null);
//   const [cloudFile, setCloudFile] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   // 📸 Camera → Scan Document
//   const handleScanDocument = async () => {
//     try {
//       setLoading(true);
//       const { scannedImages } = await (DocumentScanner as any).scanDocument({
//         maxNumDocuments: 5,
//         croppedImageQuality: 95,
//         responseType: "uri",
//       });

//       if (scannedImages && scannedImages.length > 0) {
//         const enhancedImages = [];
//         for (const uri of scannedImages) {
//           const enhanced = await enhanceImage(uri);
//           enhancedImages.push(enhanced);
//         }

//         const pdf = await generatePDF(enhancedImages, generateFilename("scan"));
//         setScannedPDF({
//           name: generateFilename("scan") + ".pdf",
//           uri: pdf.uri,
//         });
//         Alert.alert("✅ Document Scanned", "PDF created successfully.");
//       } else {
//         Alert.alert("No document detected.");
//       }
//     } catch (err: any) {
//       Alert.alert("Scan Error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🖼️ Gallery → Pick Single Image
//   const handleSelectImage = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ["image/*"],
//         copyToCacheDirectory: true,
//       });
//       if (result.canceled) return;

//       const file = result.assets[0];
//       setUploadedImage({
//         name: file.name,
//         uri: file.uri,
//         type: file.mimeType,
//       });

//       Alert.alert("✅ Image Selected", `${file.name} added successfully.`);
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Unable to pick image.");
//     }
//   };

//   // ☁️ Cloud → Pick PDF
//   const handleSelectCloudPDF = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ["application/pdf"],
//         copyToCacheDirectory: true,
//       });
//       if (result.canceled) return;

//       const file = result.assets[0];
//       setCloudFile({
//         name: file.name,
//         uri: file.uri,
//         type: file.mimeType,
//       });

//       Alert.alert("✅ PDF Selected", `${file.name} added successfully.`);
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Unable to pick document.");
//     }
//   };

//   // 📤 Share any file (preview)
//   const handleShare = async (uri: string) => {
//     await Sharing.shareAsync(uri);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerRow}>
//         <TouchableOpacity>
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Upload Document</Text>
//       </View>

//       {/* Upload Options */}
//       <View style={styles.optionRow}>
//         <TouchableOpacity style={styles.optionCard} onPress={handleScanDocument}>
//           <Image
//             source={require("../../../assets/icons/camera.png")}
//             style={styles.icon}
//           />
//           <Text style={styles.optionText}>Camera</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.optionCard} onPress={handleSelectImage}>
//           <Image
//             source={require("../../../assets/icons/gallery.png")}
//             style={styles.icon}
//           />
//           <Text style={styles.optionText}>Gallery</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.optionCard} onPress={handleSelectCloudPDF}>
//           <Image
//             source={require("../../../assets/icons/cloud.png")}
//             style={styles.icon}
//           />
//           <Text style={styles.optionText}>Cloud</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Selected Files */}
//       <Text style={styles.sectionTitle}>SELECTED FILES</Text>

//       {scannedPDF && (
//         <TouchableOpacity
//           style={styles.fileItem}
//           onPress={() => handleShare(scannedPDF.uri)}
//         >
//           <Text style={styles.fileIcon}>📄</Text>
//           <Text style={styles.fileName}>{scannedPDF.name}</Text>
//         </TouchableOpacity>
//       )}

//       {uploadedImage && (
//         <TouchableOpacity
//           style={styles.fileItem}
//           onPress={() => handleShare(uploadedImage.uri)}
//         >
//           <Text style={styles.fileIcon}>🖼️</Text>
//           <Text style={styles.fileName}>{uploadedImage.name}</Text>
//         </TouchableOpacity>
//       )}

//       {cloudFile && (
//         <TouchableOpacity
//           style={styles.fileItem}
//           onPress={() => handleShare(cloudFile.uri)}
//         >
//           <Text style={styles.fileIcon}>☁️</Text>
//           <Text style={styles.fileName}>{cloudFile.name}</Text>
//         </TouchableOpacity>
//       )}

//       {/* Upload button */}
//       {(scannedPDF || uploadedImage || cloudFile) && (
//         <TouchableOpacity style={styles.uploadButton}>
//           <Text style={styles.uploadText}>
//             Upload{" "}
//             {[
//               scannedPDF && "PDF",
//               uploadedImage && "Image",
//               cloudFile && "File",
//             ]
//               .filter(Boolean)
//               .join(", ")}
//           </Text>
//         </TouchableOpacity>
//       )}

//       {/* Loading overlay */}
//       {loading && (
//         <View style={styles.overlay}>
//           <ActivityIndicator size="large" color="#fff" />
//           <Text style={styles.loadingText}>Processing...</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 50 },
//   headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
//   backText: { color: "#4f46e5", fontSize: 16, fontWeight: "600" },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111",
//     marginRight: 30,
//   },
//   optionRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 20,
//   },
//   optionCard: {
//     alignItems: "center",
//     backgroundColor: "#f9fafb",
//     borderRadius: 10,
//     padding: 20,
//     width: "28%",
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//   },
//   icon: { width: 30, height: 30, marginBottom: 10, tintColor: "#4f46e5" },
//   optionText: { color: "#111", fontWeight: "600" },
//   sectionTitle: {
//     marginTop: 10,
//     fontWeight: "700",
//     color: "#444",
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   fileItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f9fafb",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//   },
//   fileIcon: { fontSize: 20, marginRight: 8 },
//   fileName: { color: "#111", fontSize: 15 },
//   uploadButton: {
//     backgroundColor: "#4f46e5",
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 15,
//     marginTop: 20,
//   },
//   uploadText: { color: "#fff", fontWeight: "700", fontSize: 16 },
//   overlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: { color: "#fff", fontSize: 16, marginTop: 8 },
// });





// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useRouter } from "expo-router";
// import * as Sharing from "expo-sharing";
// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // ✅ Define a type for Vault File
// type VaultFile = {
//   name: string;
//   uri: string;
//   type: "image" | "pdf";
//   uploadedAt?: string;
// };

// export default function Bills() {
//   const router = useRouter();
//   const [images, setImages] = useState<VaultFile[]>([]);
//   const [pdfs, setPdfs] = useState<VaultFile[]>([]);
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);
//   const [startDate, setStartDate] = useState(new Date("2024-01-01"));
//   const [endDate, setEndDate] = useState(new Date("2024-12-31"));

//   // 🧭 Load Vault files from AsyncStorage
//   const loadVaultFiles = async () => {
//     const stored = await AsyncStorage.getItem("mockVault");
//     if (!stored) return;
//     const data: VaultFile[] = JSON.parse(stored);
//     setImages(data.filter((f) => f.type === "image"));
//     setPdfs(data.filter((f) => f.type === "pdf"));
//   };

//   useEffect(() => {
//     loadVaultFiles();
//     const interval = setInterval(loadVaultFiles, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // 🖼️ Open or share document
//   const handleOpenFile = async (uri: string) => {
//     await Sharing.shareAsync(uri);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <Text style={styles.title}>My Bills</Text>

//       {/* Filter Section */}
//       <View style={styles.filterRow}>
//         <TouchableOpacity
//           style={styles.dateBox}
//           onPress={() => setShowStartPicker(true)}
//         >
//           <Text style={styles.dateText}>
//             {startDate.toLocaleDateString("en-US")}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.dateBox}
//           onPress={() => setShowEndPicker(true)}
//         >
//           <Text style={styles.dateText}>
//             {endDate.toLocaleDateString("en-US")}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {showStartPicker && (
//         <DateTimePicker
//           value={startDate}
//           mode="date"
//           display="default"
//           onChange={(e, date) => {
//             setShowStartPicker(false);
//             if (date) setStartDate(date);
//           }}
//         />
//       )}

//       {showEndPicker && (
//         <DateTimePicker
//           value={endDate}
//           mode="date"
//           display="default"
//           onChange={(e, date) => {
//             setShowEndPicker(false);
//             if (date) setEndDate(date);
//           }}
//         />
//       )}

//       {/* Family Member Dropdown Placeholder */}
//       <View style={styles.dropdownBox}>
//         <Text style={styles.dropdownText}>All Family Members</Text>
//       </View>

//       {/* My Vault Section */}
//       <View style={styles.vaultCard}>
//         <Text style={styles.vaultTitle}>My Vault - Alex!</Text>
//         <Text style={styles.vaultDesc}>
//           This is your personal Vault. Click + icon to upload documents or
//           images like Statements, EOBs, and Receipts.
//         </Text>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Images Section */}
//         {images.length > 0 && (
//           <>
//             <Text style={styles.sectionTitle}>Images</Text>
//             <FlatList
//               data={images}
//               numColumns={2}
//               keyExtractor={(_, i) => i.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.fileCard}
//                   onPress={() => handleOpenFile(item.uri)}
//                 >
//                   <Image
//                     source={{ uri: item.uri }}
//                     style={styles.thumbnail}
//                     resizeMode="cover"
//                   />
//                   <View style={styles.fileFooter}>
//                     <Text style={styles.fileName} numberOfLines={1}>
//                       {item.name}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </>
//         )}

//         {/* PDFs Section */}
//         {pdfs.length > 0 && (
//           <>
//             <Text style={styles.sectionTitle}>PDFs</Text>
//             <FlatList
//               data={pdfs}
//               numColumns={2}
//               keyExtractor={(_, i) => i.toString()}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.fileCard}
//                   onPress={() => handleOpenFile(item.uri)}
//                 >
//                   <Image
//                     source={require("../../../assets/icons/pdf.png")}
//                     style={styles.pdfIcon}
//                   />
//                   <View style={styles.fileFooter}>
//                     <Text style={styles.fileName} numberOfLines={1}>
//                       {item.name}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </>
//         )}
//       </ScrollView>

//       {/* Floating Upload Button */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push("/screens/bills/UplodetoPdf")}
//       >
//         <Text style={styles.fabText}>＋</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 50 },
//   title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 20 },
//   filterRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
//   dateBox: {
//     flex: 0.48,
//     backgroundColor: "#f3f4f6",
//     borderRadius: 8,
//     padding: 12,
//   },
//   dateText: { color: "#111", fontWeight: "600", textAlign: "center" },
//   dropdownBox: {
//     backgroundColor: "#f3f4f6",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 20,
//   },
//   dropdownText: { color: "#555", textAlign: "center" },
//   vaultCard: {
//     backgroundColor: "#f9fafb",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//   },
//   vaultTitle: { fontWeight: "700", fontSize: 16, color: "#111", marginBottom: 4 },
//   vaultDesc: { color: "#555", fontSize: 13 },
//   sectionTitle: { fontWeight: "700", fontSize: 16, marginVertical: 10, color: "#111" },
//   fileCard: {
//     width: "47%",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     margin: 5,
//     overflow: "hidden",
//     elevation: 2,
//   },
//   thumbnail: { width: "100%", height: 120 },
//   pdfIcon: { width: "100%", height: 120, resizeMode: "contain", tintColor: "#6366f1" },
//   fileFooter: {
//     backgroundColor: "#f3f4f6",
//     paddingVertical: 6,
//     paddingHorizontal: 8,
//     alignItems: "center",
//   },
//   fileName: { fontSize: 12, fontWeight: "600", color: "#111" },
//   fab: {
//     position: "absolute",
//     right: 20,
//     bottom: 30,
//     backgroundColor: "#4f46e5",
//     width: 55,
//     height: 55,
//     borderRadius: 30,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 4,
//   },
//   fabText: { color: "#fff", fontSize: 28, lineHeight: 28 },
// });


import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Define a type for Vault File
type VaultFile = {
  name: string;
  uri: string;
  type: "image" | "pdf";
  uploadedAt?: string;
};

export default function Bills() {
  const router = useRouter();
  const [images, setImages] = useState<VaultFile[]>([]);
  const [pdfs, setPdfs] = useState<VaultFile[]>([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date("2024-12-31"));

  // 🧭 Load Vault files from AsyncStorage
  const loadVaultFiles = async () => {
    const stored = await AsyncStorage.getItem("mockVault");
    if (!stored) return;
    const data: VaultFile[] = JSON.parse(stored);
    setImages(data.filter((f) => f.type === "image"));
    setPdfs(data.filter((f) => f.type === "pdf"));
  };

  useEffect(() => {
    loadVaultFiles();
    const interval = setInterval(loadVaultFiles, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🖼️ Open or share document
  const handleOpenFile = async (uri: string) => {
    await Sharing.shareAsync(uri);
  };

  // 🔹 Mock bills for display
  const mockBills = [
    {
      id: "1",
      provider: "Apollo Hospital",
      claimNo: "CHM-10234",
      amount: "₹ 8,250",
      date: "12 Oct 2024",
      status: "Approved",
    },
    {
      id: "2",
      provider: "Fortis Health",
      claimNo: "FRT-45128",
      amount: "₹ 5,670",
      date: "05 Sep 2024",
      status: "Pending",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>My Bills</Text>

      {/* Filter Section */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.dateText}>
            {startDate.toLocaleDateString("en-US")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.dateText}>
            {endDate.toLocaleDateString("en-US")}
          </Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {/* Family Member Dropdown Placeholder */}
      <View style={styles.dropdownBox}>
        <Text style={styles.dropdownText}>All Family Members</Text>
      </View>

      {/* My Vault Section */}
      <View style={styles.vaultCard}>
        <Text style={styles.vaultTitle}>My Vault - Alex!</Text>
        <Text style={styles.vaultDesc}>
          This is your personal Vault. Click + icon to upload documents or
          images like Statements, EOBs, and Receipts.
        </Text>
      </View>

      {/* 🔹 Bills Section */}
      {mockBills.map((bill) => (
        <View key={bill.id} style={styles.billCard}>
          <View style={styles.billHeader}>
            <Text style={styles.billTitle}>
              {bill.claimNo} - {bill.provider}
            </Text>
            <Text
              style={[
                styles.billStatus,
                {
                  backgroundColor:
                    bill.status === "Approved" ? "#dcfce7" : "#fef9c3",
                  color: bill.status === "Approved" ? "#166534" : "#854d0e",
                },
              ]}
            >
              {bill.status}
            </Text>
          </View>

          <Text style={styles.billDetail}>Amount: {bill.amount}</Text>
          <Text style={styles.billDetail}>Date: {bill.date}</Text>

          <View style={styles.billButtonsRow}>
            <TouchableOpacity style={styles.billBtn}>
              <Text style={styles.billBtnText}>EOB</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.billBtn}>
              <Text style={styles.billBtnText}>Statement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.billBtn}>
              <Text style={styles.billBtnText}>Receipts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.billBtn}>
              <Text style={styles.billBtnText}>View Ledger</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.billBtn}>
              <Text style={styles.billBtnText}>Scorecard</Text>
            </TouchableOpacity>

            {/* ✅ Schedule Button */}
            <TouchableOpacity
              style={[styles.billBtn, { backgroundColor: "#4f46e5" }]}
              onPress={() => router.push("/screens/bills/schedule")}
            >
              <Text style={[styles.billBtnText, { color: "#fff" }]}>
                Schedule
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Images Section */}
        {images.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Images</Text>
            <FlatList
              data={images}
              numColumns={2}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.fileCard}
                  onPress={() => handleOpenFile(item.uri)}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.fileFooter}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* PDFs Section */}
        {pdfs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>PDFs</Text>
            <FlatList
              data={pdfs}
              numColumns={2}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.fileCard}
                  onPress={() => handleOpenFile(item.uri)}
                >
                  <View style={styles.pdfIconContainer}>
                    <Ionicons
                      name="document-text-outline"
                      size={60}
                      color="#4f46e5"
                    />
                  </View>
                  <View style={styles.fileFooter}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </ScrollView>

      {/* Floating Upload Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/screens/bills/UplodetoPdf")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateBox: {
    flex: 0.48,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
  },
  dateText: { color: "#111", fontWeight: "600", textAlign: "center" },
  dropdownBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  dropdownText: { color: "#555", textAlign: "center" },
  vaultCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  vaultTitle: { fontWeight: "700", fontSize: 16, color: "#111", marginBottom: 4 },
  vaultDesc: { color: "#555", fontSize: 13 },

  // 🔹 Bills section
  billCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
  },
  billHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  billTitle: { fontWeight: "700", color: "#111", fontSize: 15 },
  billStatus: {
    fontWeight: "600",
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  billDetail: { color: "#555", fontSize: 13, marginBottom: 2 },
  billButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 8,
  },
  billBtn: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  billBtnText: { color: "#111", fontWeight: "600", fontSize: 13 },

  // Vault section
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginVertical: 10,
    color: "#111",
  },
  fileCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    margin: 5,
    overflow: "hidden",
    elevation: 2,
  },
  thumbnail: { width: "100%", height: 120 },
  pdfIconContainer: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef2ff",
  },
  fileFooter: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  fileName: { fontSize: 12, fontWeight: "600", color: "#111" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#4f46e5",
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 28 },
});
