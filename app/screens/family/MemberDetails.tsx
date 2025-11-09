

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Modal,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Toast from "react-native-root-toast";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useAuth } from "../../../components/authContext";
// import {
//   addMember,
//   fetchFamilyHierarchy,
//   fetchRelationships,
// } from "../../api/memberApi";

// const BLUE = "#2563eb";
// const BORDER = "#e5e7eb";
// const CARD = "#f9fafb";
// const PLACEHOLDER = "#555";
// const TEXT = "#111827";
// const LABEL = "#374151";

// /** -------- Compact Modal Select -------- */
// type Option = { label: string; value: string };
// const SelectField = ({
//   label,
//   placeholder,
//   value,
//   options,
//   onChange,
// }: {
//   label: string;
//   placeholder?: string;
//   value?: string;
//   options: Option[];
//   onChange: (v: string) => void;
// }) => {
//   const [open, setOpen] = useState(false);
//   const selectedLabel = useMemo(
//     () => options.find((o) => o.value === value)?.label,
//     [options, value]
//   );
//   return (
//     <View style={{ marginBottom: 10 }}>
//       {label ? <Text style={styles.label}>{label}</Text> : null}
//       <TouchableOpacity
//         style={styles.dropdownBox}
//         onPress={() => setOpen(true)}
//         activeOpacity={0.8}
//       >
//         <Text style={[styles.dropdownText, !selectedLabel && { color: PLACEHOLDER }]}>
//           {selectedLabel || placeholder || "Select..."}
//         </Text>
//         <Text style={styles.dropdownArrow}>▼</Text>
//       </TouchableOpacity>

//       <Modal visible={open} animationType="fade" transparent>
//         <View style={styles.modalWrap}>
//           <View style={styles.modalCard}>
//             <View style={styles.modalHead}>
//               <Text style={styles.modalTitle}>{label || "Select"}</Text>
//               <TouchableOpacity onPress={() => setOpen(false)}>
//                 <Text style={{ color: BLUE, fontWeight: "600" }}>Close</Text>
//               </TouchableOpacity>
//             </View>
//             <FlatList
//               data={options}
//               keyExtractor={(item) => item.value}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.modalItem}
//                   onPress={() => {
//                     onChange(item.value);
//                     setOpen(false);
//                   }}
//                 >
//                   <Text style={styles.modalText}>{item.label}</Text>
//                 </TouchableOpacity>
//               )}
//               ItemSeparatorComponent={() => (
//                 <View style={{ height: 1, backgroundColor: BORDER }} />
//               )}
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// /** -------- Input Field -------- */
// const InputField = ({
//   placeholder,
//   value,
//   onChangeText,
//   keyboardType,
// }: {
//   placeholder: string;
//   value: string;
//   onChangeText: (v: string) => void;
//   keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
// }) => (
//   <TextInput
//     style={styles.input}
//     placeholder={placeholder}
//     placeholderTextColor="#444"  // darker grey for visibility
//     value={value}
//     onChangeText={onChangeText}
//     keyboardType={keyboardType || "default"}
//   />
// );

// /** -------- Screen -------- */
// export default function AddMember() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [isLoading, setIsLoading] = useState(false);
//   const [relationshipTypes, setRelationshipTypes] = useState<any[]>([]);
//   const [familyMembers, setFamilyMembers] = useState<any[]>([]);
//   const [selectedMemberId, setSelectedMemberId] = useState("");
//   const [formData, setFormData] = useState({
//     FamilyID: "",
//     FirstName: "",
//     LastName: "",
//     Gender: "",
//     DOB: "",
//     MobileNo: "",
//     EmailID: "",
//     RelationshipTypeID: "",
//     MemberPhoto: "",
//     Address1: "",
//     Address2: "",
//     City: "",
//     State: "",
//     ZipCode: "",
//   });

//   const setVal = (k: string, v: string) => setFormData((p) => ({ ...p, [k]: v }));

//   useEffect(() => {
//     (async () => {
//       const fam = (await AsyncStorage.getItem("FamilyID")) || "";
//       setVal("FamilyID", fam);
//       const [rels, members] = await Promise.all([
//         fetchRelationships(),
//         fetchFamilyHierarchy(),
//       ]);
//       setRelationshipTypes(rels || []);
//       setFamilyMembers(Array.isArray(members) ? members : []);
//     })();
//   }, []);

//   const handleSelectMember = (id: string) => {
//     setSelectedMemberId(id);
//     const m = familyMembers.find((x: any) => String(x.MemberID) === String(id));
//     if (!m) return;
//     setFormData({
//       ...formData,
//       FirstName: m.FirstName || "",
//       LastName: m.LastName || "",
//       Gender: m.Gender || "",
//       DOB: m.DOB ? String(m.DOB).split("T")[0] : "",
//       MobileNo: m.MobileNo || "",
//       EmailID: m.EmailID || "",
//       Address1: m.Address1 || "",
//       Address2: m.Address2 || "",
//       City: m.City || "",
//       State: m.State || "",
//       ZipCode: m.ZipCode || "",
//       RelationshipTypeID: m.RelationshipTypeID ? String(m.RelationshipTypeID) : "",
//       MemberPhoto: m.MemberPhoto || "",
//     });
//   };

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert("Permission required", "Please allow gallery access");
//       return;
//     }
//     const res = await ImagePicker.launchImageLibraryAsync({
//       base64: true,
//       quality: 0.6,
//     });
//     if (!res.canceled && res.assets?.length > 0) {
//       setVal("MemberPhoto", `data:image/jpeg;base64,${res.assets[0].base64}`);
//     }
//   };

//   const memberOpts = familyMembers.map((m: any) => ({
//     label: `${m.FirstName || ""} ${m.LastName || ""}`.trim() || `#${m.MemberID}`,
//     value: String(m.MemberID),
//   }));
//   const relOpts = relationshipTypes.map((r: any) => ({
//     label: r.RelationshipName,
//     value: String(r.RelationshipTypeID),
//   }));
//   const genderOpts = [
//     { label: "Male", value: "M" },
//     { label: "Female", value: "F" },
//     { label: "Other", value: "O" },
//   ];

//   const save = async () => {
//     if (!formData.FirstName || !formData.LastName) {
//       Toast.show("Enter name", { backgroundColor: "#ef4444" });
//       return;
//     }
//     if (!formData.RelationshipTypeID) {
//       Toast.show("Select Relationship", { backgroundColor: "#ef4444" });
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await addMember({ ...formData, AddedBy: user?.username });
//       if (res.status === "Success") {
//         Toast.show("Member added", { backgroundColor: "#22c55e" });
//         router.push("/screens/family/FamilyHub");
//       } else Toast.show(res.message, { backgroundColor: "#ef4444" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.push("/screens/family/FamilyHub")}>
//           <Text style={styles.cancel}>Cancel</Text>
//         </TouchableOpacity>
//         <Text style={styles.headTitle}>Add Member</Text>
//         <View style={{ width: 60 }} />
//       </View>

//       <ScrollView
//         contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* View Member */}
//         <View style={styles.card}>
//           <Text style={styles.section}>View Member</Text>
//           <SelectField
//             label=""
//             placeholder="Select Member..."
//             options={memberOpts}
//             value={selectedMemberId}
//             onChange={handleSelectMember}
//           />
//         </View>

//         {/* Member Details */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Member Details</Text>
//           <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
//             {formData.MemberPhoto ? (
//               <Image source={{ uri: formData.MemberPhoto }} style={styles.photo} />
//             ) : (
//               <Text style={{ color: "#555" }}>📸 Upload Profile Photo</Text>
//             )}
//           </TouchableOpacity>

//           <InputField
//             placeholder="First Name *"
//             value={formData.FirstName}
//             onChangeText={(v) => setVal("FirstName", v)}
//           />
//           <InputField
//             placeholder="Last Name *"
//             value={formData.LastName}
//             onChangeText={(v) => setVal("LastName", v)}
//           />
//           <SelectField
//             label="Gender"
//             placeholder="Select..."
//             options={genderOpts}
//             value={formData.Gender}
//             onChange={(v) => setVal("Gender", v)}
//           />
//           <InputField
//             placeholder="Date of Birth (YYYY-MM-DD)"
//             value={formData.DOB}
//             onChangeText={(v) => setVal("DOB", v)}
//           />
//           <SelectField
//             label="Relationship"
//             placeholder="Select..."
//             options={relOpts}
//             value={formData.RelationshipTypeID}
//             onChange={(v) => setVal("RelationshipTypeID", v)}
//           />
//         </View>

//         {/* Contact */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Contact Details</Text>
//           <InputField
//             placeholder="Email Address"
//             value={formData.EmailID}
//             onChangeText={(v) => setVal("EmailID", v)}
//             keyboardType="email-address"
//           />
//           <InputField
//             placeholder="Mobile Number"
//             value={formData.MobileNo}
//             onChangeText={(v) => setVal("MobileNo", v)}
//             keyboardType="phone-pad"
//           />
//         </View>

//         {/* Address */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Address Details</Text>
//           <InputField
//             placeholder="Address Line 1"
//             value={formData.Address1}
//             onChangeText={(v) => setVal("Address1", v)}
//           />
//           <InputField
//             placeholder="Address Line 2 (Apt, Suite, etc.)"
//             value={formData.Address2}
//             onChangeText={(v) => setVal("Address2", v)}
//           />
//           <InputField
//             placeholder="City"
//             value={formData.City}
//             onChangeText={(v) => setVal("City", v)}
//           />
//           <InputField
//             placeholder="State"
//             value={formData.State}
//             onChangeText={(v) => setVal("State", v)}
//           />
//           <InputField
//             placeholder="Zip Code"
//             value={formData.ZipCode}
//             onChangeText={(v) => setVal("ZipCode", v)}
//             keyboardType="numeric"
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.saveBtn}
//           onPress={save}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.saveTxt}>Save Member</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderColor: BORDER,
//     padding: 15,
//   },
//   headTitle: { fontSize: 18, fontWeight: "700", color: TEXT },
//   cancel: { color: BLUE, fontWeight: "600" },

//   card: {
//     backgroundColor: CARD,
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 14,
//   },
//   section: { fontSize: 16, fontWeight: "700", color: TEXT, marginBottom: 10 },

//   input: {
//   backgroundColor: "#fff",
//   borderColor: BORDER,
//   borderWidth: 1,
//   borderRadius: 10,
//   padding: 12,
//   fontSize: 15,
//   marginBottom: 10,
//   color: "#111", // darker text color
//   fontWeight: "500", // slightly bolder for readability
// },

//   dropdownBox: {
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     height: 45,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   dropdownText: { fontSize: 15, color: TEXT },
//   dropdownArrow: { color: "#777", fontSize: 16 },

//   label: { color: LABEL, fontWeight: "600", marginBottom: 6 },
//   photoBtn: {
//     alignSelf: "center",
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },
//   photo: { width: 90, height: 90, borderRadius: 45 },

//   modalWrap: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "flex-end",
//   },
//   modalCard: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//     maxHeight: "65%",
//   },
//   modalHead: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     borderBottomWidth: 1,
//     borderColor: BORDER,
//     padding: 15,
//   },
//   modalTitle: { fontSize: 16, fontWeight: "700", color: TEXT },
//   modalItem: { padding: 15 },
//   modalText: { fontSize: 16, color: TEXT },

//   saveBtn: {
//     backgroundColor: BLUE,
//     borderRadius: 10,
//     padding: 15,
//     alignItems: "center",
//   },
//   saveTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
// });



// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image, Platform, ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// import Toast from "react-native-root-toast";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useAuth } from "../../../components/authContext";
// import {
//   addMember,
//   fetchFamilyHierarchy,
//   fetchRelationships,
// } from "../../api/memberApi";

// const BLUE = "#2563eb";
// const BORDER = "#e5e7eb";
// const CARD = "#f9fafb";
// const PLACEHOLDER = "#555";
// const TEXT = "#111827";
// const LABEL = "#374151";

// /* ---------- helpers ---------- */
// const formatDate = (d: Date) => {
//   const yy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yy}-${mm}-${dd}`;
// };

// /** -------- Inline Select (dropdown inside the same container) -------- */
// type Option = { label: string; value: string };
// const SelectField = ({
//   label,
//   placeholder,
//   value,
//   options,
//   onChange,
// }: {
//   label?: string;
//   placeholder?: string;
//   value?: string;
//   options: Option[];
//   onChange: (v: string) => void;
// }) => {
//   const [open, setOpen] = useState(false);
//   const selectedLabel = useMemo(
//     () => options.find((o) => o.value === value)?.label,
//     [options, value]
//   );

//   return (
//     <View style={styles.selectWrap}>
//       {label ? <Text style={styles.label}>{label}</Text> : null}

//       <TouchableOpacity
//         style={styles.dropdownBox}
//         activeOpacity={0.8}
//         onPress={() => setOpen((p) => !p)}
//       >
//         <Text
//           style={[
//             styles.dropdownText,
//             !selectedLabel && { color: PLACEHOLDER },
//           ]}
//           numberOfLines={1}
//         >
//           {selectedLabel || placeholder || "Select..."}
//         </Text>
//         <Text style={styles.dropdownArrow}>{open ? "▲" : "▼"}</Text>
//       </TouchableOpacity>

//       {open && (
//         <View style={styles.dropdownMenu}>
//           <FlatList
//             data={options}
//             keyExtractor={(item) => item.value}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => {
//                   onChange(item.value);
//                   setOpen(false);
//                 }}
//               >
//                 <Text style={styles.menuText}>{item.label}</Text>
//               </TouchableOpacity>
//             )}
//             ItemSeparatorComponent={() => (
//               <View style={{ height: 1, backgroundColor: BORDER }} />
//             )}
//             nestedScrollEnabled
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// /** -------- Text Input -------- */
// const InputField = ({
//   placeholder,
//   value,
//   onChangeText,
//   keyboardType,
// }: {
//   placeholder: string;
//   value: string;
//   onChangeText: (v: string) => void;
//   keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
// }) => (
//   <TextInput
//     style={styles.input}
//     placeholder={placeholder}
//     placeholderTextColor="#444"
//     value={value}
//     onChangeText={onChangeText}
//     keyboardType={keyboardType || "default"}
//   />
// );

// /** -------- Date Field (native date picker) -------- */
// const DateField = ({
//   label,
//   placeholder,
//   value,
//   onChange,
// }: {
//   label?: string;
//   placeholder?: string;
//   value?: string;
//   onChange: (v: string) => void;
// }) => {
//   const [show, setShow] = useState(false);
//   const current = value ? new Date(value) : new Date();

//   return (
//     <View style={{ marginBottom: 10 }}>
//       {label ? <Text style={styles.label}>{label}</Text> : null}

//       <TouchableOpacity
//         style={styles.input}
//         activeOpacity={0.8}
//         onPress={() => setShow(true)}
//       >
//         <Text style={{ color: value ? TEXT : PLACEHOLDER, fontSize: 15 }}>
//           {value || placeholder || "Select date"}
//         </Text>
//       </TouchableOpacity>

//       {show && (
//         <DateTimePicker
//           mode="date"
//           value={current}
//           display={Platform.OS === "ios" ? "spinner" : "default"}
//           onChange={(_, picked) => {
//             // Android: _ is event, picked is Date | undefined
//             // iOS: fires on every scroll; keep it open until user taps outside
//             if (Platform.OS === "android") setShow(false);
//             if (picked) onChange(formatDate(picked));
//           }}
//           maximumDate={new Date()}
//         />
//       )}
//     </View>
//   );
// };

// /** -------- Screen -------- */
// export default function AddMember() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [isLoading, setIsLoading] = useState(false);
//   const [relationshipTypes, setRelationshipTypes] = useState<any[]>([]);
//   const [familyMembers, setFamilyMembers] = useState<any[]>([]);
//   const [selectedMemberId, setSelectedMemberId] = useState("");
//   const [formData, setFormData] = useState({
//     FamilyID: "",
//     FirstName: "",
//     LastName: "",
//     Gender: "",
//     DOB: "",
//     MobileNo: "",
//     EmailID: "",
//     RelationshipTypeID: "",
//     MemberPhoto: "",
//     Address1: "",
//     Address2: "",
//     City: "",
//     State: "",
//     ZipCode: "",
//   });

//   const setVal = (k: string, v: string) =>
//     setFormData((p) => ({ ...p, [k]: v }));

//   useEffect(() => {
//     (async () => {
//       const fam = (await AsyncStorage.getItem("FamilyID")) || "";
//       setVal("FamilyID", fam);
//       const [rels, members] = await Promise.all([
//         fetchRelationships(),
//         fetchFamilyHierarchy(),
//       ]);
//       setRelationshipTypes(rels || []);
//       setFamilyMembers(Array.isArray(members) ? members : []);
//     })();
//   }, []);

//   const handleSelectMember = (id: string) => {
//     setSelectedMemberId(id);
//     const m = familyMembers.find((x: any) => String(x.MemberID) === String(id));
//     if (!m) return;
//     setFormData({
//       ...formData,
//       FirstName: m.FirstName || "",
//       LastName: m.LastName || "",
//       Gender: m.Gender || "",
//       DOB: m.DOB ? String(m.DOB).split("T")[0] : "",
//       MobileNo: m.MobileNo || "",
//       EmailID: m.EmailID || "",
//       Address1: m.Address1 || "",
//       Address2: m.Address2 || "",
//       City: m.City || "",
//       State: m.State || "",
//       ZipCode: m.ZipCode || "",
//       RelationshipTypeID: m.RelationshipTypeID
//         ? String(m.RelationshipTypeID)
//         : "",
//       MemberPhoto: m.MemberPhoto || "",
//     });
//   };

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert("Permission required", "Please allow gallery access");
//       return;
//     }
//     const res = await ImagePicker.launchImageLibraryAsync({
//       base64: true,
//       quality: 0.6,
//     });
//     if (!res.canceled && res.assets?.length > 0) {
//       setVal("MemberPhoto", `data:image/jpeg;base64,${res.assets[0].base64}`);
//     }
//   };

//   const memberOpts = familyMembers.map((m: any) => ({
//     label: `${m.FirstName || ""} ${m.LastName || ""}`.trim() || `#${m.MemberID}`,
//     value: String(m.MemberID),
//   }));
//   const relOpts = relationshipTypes.map((r: any) => ({
//     label: r.RelationshipName,
//     value: String(r.RelationshipTypeID),
//   }));
//   const genderOpts = [
//     { label: "Male", value: "M" },
//     { label: "Female", value: "F" },
//     { label: "Other", value: "O" },
//   ];

//   const save = async () => {
//     if (!formData.FirstName || !formData.LastName) {
//       Toast.show("Enter name", { backgroundColor: "#ef4444" });
//       return;
//     }
//     if (!formData.RelationshipTypeID) {
//       Toast.show("Select Relationship", { backgroundColor: "#ef4444" });
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await addMember({ ...formData, AddedBy: user?.username });
//       if (res.status === "Success") {
//         Toast.show("Member added", { backgroundColor: "#22c55e" });
//         router.push("/screens/family/FamilyHub");
//       } else Toast.show(res.message, { backgroundColor: "#ef4444" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.push("/screens/family/FamilyHub")}>
//           <Text style={styles.cancel}>Cancel</Text>
//         </TouchableOpacity>
//         <Text style={styles.headTitle}>Add Member</Text>
//         <View style={{ width: 60 }} />
//       </View>

//       <ScrollView
//         contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* View Member */}
//         <View style={styles.card}>
//           <Text style={styles.section}>View Member</Text>
//           <SelectField
//             placeholder="Select Member..."
//             options={memberOpts}
//             value={selectedMemberId}
//             onChange={handleSelectMember}
//           />
//         </View>

//         {/* Member Details */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Member Details</Text>
//           <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
//             {formData.MemberPhoto ? (
//               <Image source={{ uri: formData.MemberPhoto }} style={styles.photo} />
//             ) : (
//               <Text style={{ color: "#555" }}>📸 Upload Profile Photo</Text>
//             )}
//           </TouchableOpacity>

//           <InputField
//             placeholder="First Name *"
//             value={formData.FirstName}
//             onChangeText={(v) => setVal("FirstName", v)}
//           />
//           <InputField
//             placeholder="Last Name *"
//             value={formData.LastName}
//             onChangeText={(v) => setVal("LastName", v)}
//           />
//           <SelectField
//             label="Gender"
//             placeholder="Select..."
//             options={genderOpts}
//             value={formData.Gender}
//             onChange={(v) => setVal("Gender", v)}
//           />
//           <DateField
//             label="Date of Birth"
//             placeholder="(YYYY-MM-DD)"
//             value={formData.DOB}
//             onChange={(v) => setVal("DOB", v)}
//           />
//           <SelectField
//             label="Relationship"
//             placeholder="Select..."
//             options={relOpts}
//             value={formData.RelationshipTypeID}
//             onChange={(v) => setVal("RelationshipTypeID", v)}
//           />
//         </View>

//         {/* Contact */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Contact Details</Text>
//           <InputField
//             placeholder="Email Address"
//             value={formData.EmailID}
//             onChangeText={(v) => setVal("EmailID", v)}
//             keyboardType="email-address"
//           />
//           <InputField
//             placeholder="Mobile Number"
//             value={formData.MobileNo}
//             onChangeText={(v) => setVal("MobileNo", v)}
//             keyboardType="phone-pad"
//           />
//         </View>

//         {/* Address */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Address Details</Text>
//           <InputField
//             placeholder="Address Line 1"
//             value={formData.Address1}
//             onChangeText={(v) => setVal("Address1", v)}
//           />
//           <InputField
//             placeholder="Address Line 2 (Apt, Suite, etc.)"
//             value={formData.Address2}
//             onChangeText={(v) => setVal("Address2", v)}
//           />
//           <InputField
//             placeholder="City"
//             value={formData.City}
//             onChangeText={(v) => setVal("City", v)}
//           />
//           <InputField
//             placeholder="State"
//             value={formData.State}
//             onChangeText={(v) => setVal("State", v)}
//           />
//           <InputField
//             placeholder="Zip Code"
//             value={formData.ZipCode}
//             onChangeText={(v) => setVal("ZipCode", v)}
//             keyboardType="numeric"
//           />
//         </View>

//         <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={isLoading}>
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.saveTxt}>Save Member</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderColor: BORDER,
//     padding: 15,
//   },
//   headTitle: { fontSize: 18, fontWeight: "700", color: TEXT },
//   cancel: { color: BLUE, fontWeight: "600" },

//   card: {
//     backgroundColor: CARD,
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 14,
//   },
//   section: { fontSize: 16, fontWeight: "700", color: TEXT, marginBottom: 10 },

//   input: {
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 15,
//     marginBottom: 10,
//     color: "#111",
//     fontWeight: "500",
//   },

//   /* Select field wrapper (keeps dropdown inside the container) */
//   selectWrap: {
//     marginBottom: 10,
//     position: "relative",
//     zIndex: 10, // helps it appear above neighbors on iOS
//   },

//   dropdownBox: {
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     height: 45,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   dropdownText: { fontSize: 15, color: TEXT, flex: 1, marginRight: 8 },
//   dropdownArrow: { color: "#777", fontSize: 16 },

//   /* The inline dropdown menu */
//   dropdownMenu: {
//     position: "absolute",
//     top: 47,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     maxHeight: 220,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 6,
//     zIndex: 1000,
//   },
//   menuItem: { paddingVertical: 12, paddingHorizontal: 14, backgroundColor: "#fff" },
//   menuText: { fontSize: 16, color: TEXT },

//   label: { color: LABEL, fontWeight: "600", marginBottom: 6 },
//   photoBtn: {
//     alignSelf: "center",
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//   },
//   photo: { width: 90, height: 90, borderRadius: 45 },

//   saveBtn: {
//     backgroundColor: BLUE,
//     borderRadius: 10,
//     padding: 15,
//     alignItems: "center",
//   },
//   saveTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
// });



// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Modal,
//   Platform,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// import Toast from "react-native-root-toast";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   addMember,
//   fetchFamilyHierarchy,
//   fetchRelationships,
// } from "../../../api/memberApi";
// import { useAuth } from "../../../components/authContext";

// const BLUE = "#2563eb";
// const BORDER = "#e5e7eb";
// const CARD = "#f9fafb";
// const PLACEHOLDER = "#555";
// const TEXT = "#111827";
// const LABEL = "#374151";

// const formatDate = (d: Date) => {
//   const yy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yy}-${mm}-${dd}`;
// };

// type Option = { label: string; value: string };

// const SelectField = ({
//   label,
//   placeholder,
//   value,
//   options,
//   onChange,
// }: {
//   label?: string;
//   placeholder?: string;
//   value?: string;
//   options: Option[];
//   onChange: (v: string) => void;
// }) => {
//   const [open, setOpen] = useState(false);
//   const selectedLabel = useMemo(
//     () => options.find((o) => o.value === value)?.label,
//     [options, value]
//   );

//   return (
//     <View style={styles.selectWrap}>
//       {label ? <Text style={styles.label}>{label}</Text> : null}
//       <TouchableOpacity
//         style={styles.dropdownBox}
//         activeOpacity={0.8}
//         onPress={() => setOpen((p) => !p)}
//       >
//         <Text
//           style={[
//             styles.dropdownText,
//             !selectedLabel && { color: PLACEHOLDER },
//           ]}
//           numberOfLines={1}
//         >
//           {selectedLabel || placeholder || "Select..."}
//         </Text>
//         <Text style={styles.dropdownArrow}>{open ? "▲" : "▼"}</Text>
//       </TouchableOpacity>

//       {open && (
//         <View style={styles.dropdownMenu}>
//           {options.length === 0 && (
//             <Text style={styles.menuText}>No options</Text>
//           )}
//           {options.map((item) => (
//             <TouchableOpacity
//               key={item.value}
//               style={styles.menuItem}
//               onPress={() => {
//                 onChange(item.value);
//                 setOpen(false);
//               }}
//             >
//               <Text style={styles.menuText}>{item.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// const InputField = ({
//   placeholder,
//   value,
//   onChangeText,
//   keyboardType,
// }: {
//   placeholder: string;
//   value: string;
//   onChangeText: (v: string) => void;
//   keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
// }) => (
//   <TextInput
//     style={styles.input}
//     placeholder={placeholder}
//     placeholderTextColor="#444"
//     value={value}
//     onChangeText={onChangeText}
//     keyboardType={keyboardType || "default"}
//   />
// );

// // -------- Date Field with Modal for iOS --------
// const DateField = ({
//   label,
//   placeholder,
//   value,
//   onChange,
// }: {
//   label?: string;
//   placeholder?: string;
//   value?: string;
//   onChange: (v: string) => void;
// }) => {
//   const [show, setShow] = useState(false);
//   const current = value ? new Date(value) : new Date();

//   return (
//     <View style={{ marginBottom: 10 }}>
//       {label ? <Text style={styles.label}>{label}</Text> : null}
//       <TouchableOpacity
//         style={styles.input}
//         activeOpacity={0.8}
//         onPress={() => setShow(true)}
//       >
//         <Text style={{ color: value ? TEXT : PLACEHOLDER, fontSize: 15 }}>
//           {value || placeholder || "Select date"}
//         </Text>
//       </TouchableOpacity>

//       {/* iOS: show modal, Android: dialog */}
//       {show && Platform.OS === "ios" && (
//         <Modal transparent animationType="fade">
//           <TouchableOpacity
//             style={styles.modalBG}
//             activeOpacity={1}
//             onPress={() => setShow(false)}
//           >
//             <View style={styles.iosPickerWrap}>
//               <DateTimePicker
//                 mode="date"
//                 value={current}
//                 display="spinner"
//                 onChange={(_, picked) => {
//                   if (picked) {
//                     onChange(formatDate(picked));
//                   }
//                 }}
//                 maximumDate={new Date()}
//                 textColor={TEXT}
//                 style={{ backgroundColor: "#fff" }}
//               />
//               <TouchableOpacity
//                 style={styles.iosPickerDone}
//                 onPress={() => setShow(false)}
//               >
//                 <Text style={{ color: BLUE, fontWeight: "700" }}>Done</Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         </Modal>
//       )}
//       {show && Platform.OS === "android" && (
//         <DateTimePicker
//           mode="date"
//           value={current}
//           display="default"
//           onChange={(_, picked) => {
//             setShow(false);
//             if (picked) onChange(formatDate(picked));
//           }}
//           maximumDate={new Date()}
//         />
//       )}
//     </View>
//   );
// };

// /** --- Camera+Gallery Profile Photo --- */
// const ProfilePhotoPicker = ({
//   photoUri,
//   onPick,
// }: {
//   photoUri: string;
//   onPick: (uri: string) => void;
// }) => {
//   const pickFromGallery = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert("Permission required", "Please allow gallery access");
//       return;
//     }
//     const res = await ImagePicker.launchImageLibraryAsync({
//       base64: true,
//       quality: 0.6,
//     });
//     if (!res.canceled && res.assets?.length > 0) {
//       onPick(`data:image/jpeg;base64,${res.assets[0].base64}`);
//     }
//   };

//   const pickFromCamera = async () => {
//     const permission = await ImagePicker.requestCameraPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert("Permission required", "Please allow camera access");
//       return;
//     }
//     const res = await ImagePicker.launchCameraAsync({
//       base64: true,
//       quality: 0.6,
//     });
//     if (!res.canceled && res.assets?.length > 0) {
//       onPick(`data:image/jpeg;base64,${res.assets[0].base64}`);
//     }
//   };

//   return (
//     <View style={styles.photoContainer}>
//       <View style={styles.photoCircle}>
//         {photoUri ? (
//           <Image source={{ uri: photoUri }} style={styles.photo} />
//         ) : (
//           <Text style={styles.noPhoto}>No photo</Text>
//         )}
//       </View>
//       <View style={{ flexDirection: "row", marginTop: 10 }}>
//         <TouchableOpacity style={styles.photoBtn} onPress={pickFromGallery}>
//           <Text style={styles.photoBtnText}>Gallery</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.photoBtn} onPress={pickFromCamera}>
//           <Text style={styles.photoBtnText}>Camera</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default function AddMember() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [isLoading, setIsLoading] = useState(false);
//   const [relationshipTypes, setRelationshipTypes] = useState<any[]>([]);
//   const [familyMembers, setFamilyMembers] = useState<any[]>([]);
//   const [selectedMemberId, setSelectedMemberId] = useState("");
//   const [formData, setFormData] = useState({
//     FamilyID: "",
//     FirstName: "",
//     LastName: "",
//     Gender: "",
//     DOB: "",
//     MobileNo: "",
//     EmailID: "",
//     RelationshipTypeID: "",
//     MemberPhoto: "",
//     Address1: "",
//     Address2: "",
//     City: "",
//     State: "",
//     ZipCode: "",
//   });

//   const setVal = (k: string, v: string) =>
//     setFormData((p) => ({ ...p, [k]: v }));

//   useEffect(() => {
//     (async () => {
//       const fam = (await AsyncStorage.getItem("FamilyID")) || "";
//       setVal("FamilyID", fam);
//       const [rels, members] = await Promise.all([
//         fetchRelationships(),
//         fetchFamilyHierarchy(),
//       ]);
//       setRelationshipTypes(rels || []);
//       setFamilyMembers(Array.isArray(members) ? members : []);
//     })();
//   }, []);

//   const handleSelectMember = (id: string) => {
//     setSelectedMemberId(id);
//     const m = familyMembers.find((x: any) => String(x.MemberID) === String(id));
//     if (!m) return;
//     setFormData({
//       ...formData,
//       FirstName: m.FirstName || "",
//       LastName: m.LastName || "",
//       Gender: m.Gender || "",
//       DOB: m.DOB ? String(m.DOB).split("T")[0] : "",
//       MobileNo: m.MobileNo || "",
//       EmailID: m.EmailID || "",
//       Address1: m.Address1 || "",
//       Address2: m.Address2 || "",
//       City: m.City || "",
//       State: m.State || "",
//       ZipCode: m.ZipCode || "",
//       RelationshipTypeID: m.RelationshipTypeID
//         ? String(m.RelationshipTypeID)
//         : "",
//       MemberPhoto: m.MemberPhoto || "",
//     });
//   };

//   const memberOpts = familyMembers.map((m: any) => ({
//     label: `${m.FirstName || ""} ${m.LastName || ""}`.trim() || `#${m.MemberID}`,
//     value: String(m.MemberID),
//   }));
//   const relOpts = relationshipTypes.map((r: any) => ({
//     label: r.RelationshipName,
//     value: String(r.RelationshipTypeID),
//   }));
//   const genderOpts = [
//     { label: "Male", value: "M" },
//     { label: "Female", value: "F" },
//     { label: "Other", value: "O" },
//   ];

//   const save = async () => {
//     if (!formData.FirstName || !formData.LastName) {
//       Toast.show("Enter name", { backgroundColor: "#ef4444" });
//       return;
//     }
//     if (!formData.RelationshipTypeID) {
//       Toast.show("Select Relationship", { backgroundColor: "#ef4444" });
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await addMember({ ...formData, AddedBy: user?.username });
//       if (res.status === "Success") {
//         Toast.show("Member added", { backgroundColor: "#22c55e" });
//         router.push("/screens/family/FamilyHub");
//       } else Toast.show(res.message, { backgroundColor: "#ef4444" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.push("/screens/family/FamilyHub")}>
//           <Text style={styles.cancel}>Cancel</Text>
//         </TouchableOpacity>
//         <Text style={styles.headTitle}>Add Member</Text>
//         <View style={{ width: 60 }} />
//       </View>

//       <ScrollView
//         contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* View Member */}
//         <View style={styles.card}>
//           <Text style={styles.section}>View Member</Text>
//           <SelectField
//             placeholder="Select Member..."
//             options={memberOpts}
//             value={selectedMemberId}
//             onChange={handleSelectMember}
//           />
//         </View>

//         {/* Member Details */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Member Details</Text>
//           <ProfilePhotoPicker
//             photoUri={formData.MemberPhoto}
//             onPick={(uri) => setVal("MemberPhoto", uri)}
//           />

//           <InputField
//             placeholder="First Name *"
//             value={formData.FirstName}
//             onChangeText={(v) => setVal("FirstName", v)}
//           />
//           <InputField
//             placeholder="Last Name *"
//             value={formData.LastName}
//             onChangeText={(v) => setVal("LastName", v)}
//           />
//           <SelectField
//             label="Gender"
//             placeholder="Select..."
//             options={genderOpts}
//             value={formData.Gender}
//             onChange={(v) => setVal("Gender", v)}
//           />
//           <DateField
//             label="Date of Birth"
//             placeholder="(YYYY-MM-DD)"
//             value={formData.DOB}
//             onChange={(v) => setVal("DOB", v)}
//           />
//           <SelectField
//             label="Relationship"
//             placeholder="Select..."
//             options={relOpts}
//             value={formData.RelationshipTypeID}
//             onChange={(v) => setVal("RelationshipTypeID", v)}
//           />
//         </View>

//         {/* Contact */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Contact Details</Text>
//           <InputField
//             placeholder="Email Address"
//             value={formData.EmailID}
//             onChangeText={(v) => setVal("EmailID", v)}
//             keyboardType="email-address"
//           />
//           <InputField
//             placeholder="Mobile Number"
//             value={formData.MobileNo}
//             onChangeText={(v) => setVal("MobileNo", v)}
//             keyboardType="phone-pad"
//           />
//         </View>

//         {/* Address */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Address Details</Text>
//           <InputField
//             placeholder="Address Line 1"
//             value={formData.Address1}
//             onChangeText={(v) => setVal("Address1", v)}
//           />
//           <InputField
//             placeholder="Address Line 2 (Apt, Suite, etc.)"
//             value={formData.Address2}
//             onChangeText={(v) => setVal("Address2", v)}
//           />
//           <InputField
//             placeholder="City"
//             value={formData.City}
//             onChangeText={(v) => setVal("City", v)}
//           />
//           <InputField
//             placeholder="State"
//             value={formData.State}
//             onChangeText={(v) => setVal("State", v)}
//           />
//           <InputField
//             placeholder="Zip Code"
//             value={formData.ZipCode}
//             onChangeText={(v) => setVal("ZipCode", v)}
//             keyboardType="numeric"
//           />
//         </View>

//         <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={isLoading}>
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.saveTxt}>Save Member</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderColor: BORDER,
//     padding: 15,
//   },
//   headTitle: { fontSize: 18, fontWeight: "700", color: TEXT },
//   cancel: { color: BLUE, fontWeight: "600" },

//   card: {
//     backgroundColor: CARD,
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 14,
//   },
//   section: { fontSize: 16, fontWeight: "700", color: TEXT, marginBottom: 10 },

//   input: {
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 15,
//     marginBottom: 10,
//     color: "#111",
//     fontWeight: "500",
//   },

//   /* Select field wrapper (keeps dropdown inside the container) */
//   selectWrap: {
//     marginBottom: 10,
//     position: "relative",
//     zIndex: 10,
//   },

//   dropdownBox: {
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     height: 45,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   dropdownText: { fontSize: 15, color: TEXT, flex: 1, marginRight: 8 },
//   dropdownArrow: { color: "#777", fontSize: 16 },

// dropdownMenu: {
//   position: "absolute",
//   top: 47,
//   left: 0,
//   right: 0,
//   backgroundColor: "#fff",
//   borderColor: BORDER,
//   borderWidth: 1,
//   borderRadius: 10,
//   maxHeight: 220,  // ❌ limits visible items
//   overflow: "hidden",
//   shadowColor: "#000",
//   shadowOpacity: 0.1,
//   shadowRadius: 8,
//   shadowOffset: { width: 0, height: 4 },
//   elevation: 6,
//   zIndex: 1000,
// },

//   menuItem: {
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     backgroundColor: "#fff",
//   },
//   menuText: { fontSize: 16, color: TEXT },

//   label: { color: LABEL, fontWeight: "600", marginBottom: 6 },

//   photoContainer: {
//     alignItems: "center",
//     marginBottom: 14,
//   },
//   photoCircle: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     backgroundColor: "#e5e7eb",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   photo: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     resizeMode: "cover",
//   },
//   noPhoto: {
//     color: "#888",
//     fontSize: 15,
//   },
//   photoBtn: {
//     flex: 1,
//     backgroundColor: "#2563eb",
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginHorizontal: 6,
//     minWidth: 95,
//     alignItems: "center",
//   },
//   photoBtnText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 15,
//   },

//   /* iOS modal date picker styles */
//   modalBG: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.15)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   iosPickerWrap: {
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 18,
//     width: 320,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 8 },
//   },
//   iosPickerDone: {
//     marginTop: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     alignSelf: "center",
//     backgroundColor: "#f3f4f6",
//     borderRadius: 7,
//   },

//   saveBtn: {
//     backgroundColor: BLUE,
//     borderRadius: 10,
//     padding: 15,
//     alignItems: "center",
//   },
//   saveTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
// });



// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Modal,
//   Platform,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// import Toast from "react-native-root-toast";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   addMember,
//   fetchRelationships
// } from "../../../api/memberApi";
// import { useAuth } from "../../../components/authContext";

// const BLUE = "#2563eb";
// const BORDER = "#e5e7eb";
// const CARD = "#f9fafb";
// const PLACEHOLDER = "#555";
// const TEXT = "#111827";
// const LABEL = "#374151";

// const formatDate = (d: Date) => {
//   const yy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yy}-${mm}-${dd}`;
// };

// type Option = { label: string; value: string };

// const SelectField = ({
//   label,
//   placeholder,
//   value,
//   options,
//   onChange,
// }: {
//   label?: string;
//   placeholder?: string;
//   value?: string;
//   options: Option[];
//   onChange: (v: string) => void;
// }) => {
//   const [open, setOpen] = useState(false);
//   const selectedLabel = useMemo(
//     () => options.find((o) => o.value === value)?.label,
//     [options, value]
//   );

//   return (
//     <View style={styles.selectWrap}>
//       {label ? <Text style={styles.label}>{label}</Text> : null}
//       <TouchableOpacity
//         style={styles.dropdownBox}
//         activeOpacity={0.8}
//         onPress={() => setOpen((p) => !p)}
//       >
//         <Text
//           style={[
//             styles.dropdownText,
//             !selectedLabel && { color: PLACEHOLDER },
//           ]}
//           numberOfLines={1}
//         >
//           {selectedLabel || placeholder || "Select..."}
//         </Text>
//         <Text style={styles.dropdownArrow}>{open ? "▲" : "▼"}</Text>
//       </TouchableOpacity>

//       {open && (
//         <View style={styles.dropdownMenu}>
//           {options.length === 0 && (
//             <Text style={styles.menuText}>No options</Text>
//           )}
//           {options.map((item) => (
//             <TouchableOpacity
//               key={item.value}
//               style={styles.menuItem}
//               onPress={() => {
//                 onChange(item.value);
//                 setOpen(false);
//               }}
//             >
//               <Text style={styles.menuText}>{item.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// const InputField = ({
//   placeholder,
//   value,
//   onChangeText,
//   keyboardType,
// }: {
//   placeholder: string;
//   value: string;
//   onChangeText: (v: string) => void;
//   keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
// }) => (
//   <TextInput
//     style={styles.input}
//     placeholder={placeholder}
//     placeholderTextColor="#444"
//     value={value}
//     onChangeText={onChangeText}
//     keyboardType={keyboardType || "default"}
//   />
// );

// const DateField = ({
//   label,
//   placeholder,
//   value,
//   onChange,
// }: {
//   label?: string;
//   placeholder?: string;
//   value?: string;
//   onChange: (v: string) => void;
// }) => {
//   const [show, setShow] = useState(false);
//   const current = value ? new Date(value) : new Date();

//   return (
//     <View style={{ marginBottom: 10 }}>
//       {label ? <Text style={styles.label}>{label}</Text> : null}
//       <TouchableOpacity
//         style={styles.input}
//         activeOpacity={0.8}
//         onPress={() => setShow(true)}
//       >
//         <Text style={{ color: value ? TEXT : PLACEHOLDER, fontSize: 15 }}>
//           {value || placeholder || "Select date"}
//         </Text>
//       </TouchableOpacity>

//       {show && Platform.OS === "ios" && (
//         <Modal transparent animationType="fade">
//           <TouchableOpacity
//             style={styles.modalBG}
//             activeOpacity={1}
//             onPress={() => setShow(false)}
//           >
//             <View style={styles.iosPickerWrap}>
//               <DateTimePicker
//                 mode="date"
//                 value={current}
//                 display="spinner"
//                 onChange={(_, picked) => {
//                   if (picked) onChange(formatDate(picked));
//                 }}
//                 maximumDate={new Date()}
//               />
//               <TouchableOpacity
//                 style={styles.iosPickerDone}
//                 onPress={() => setShow(false)}
//               >
//                 <Text style={{ color: BLUE, fontWeight: "700" }}>Done</Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         </Modal>
//       )}
//       {show && Platform.OS === "android" && (
//         <DateTimePicker
//           mode="date"
//           value={current}
//           display="default"
//           onChange={(_, picked) => {
//             setShow(false);
//             if (picked) onChange(formatDate(picked));
//           }}
//           maximumDate={new Date()}
//         />
//       )}
//     </View>
//   );
// };

// const ProfilePhotoPicker = ({
//   photoUri,
//   onPick,
// }: {
//   photoUri: string;
//   onPick: (uri: string) => void;
// }) => {
//   const pickFromGallery = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert("Permission required", "Please allow gallery access");
//       return;
//     }
//     const res = await ImagePicker.launchImageLibraryAsync({
//       base64: true,
//       quality: 0.6,
//     });
//     if (!res.canceled && res.assets?.length > 0) {
//       onPick(`data:image/jpeg;base64,${res.assets[0].base64}`);
//     }
//   };

//   const pickFromCamera = async () => {
//     const permission = await ImagePicker.requestCameraPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert("Permission required", "Please allow camera access");
//       return;
//     }
//     const res = await ImagePicker.launchCameraAsync({
//       base64: true,
//       quality: 0.6,
//     });
//     if (!res.canceled && res.assets?.length > 0) {
//       onPick(`data:image/jpeg;base64,${res.assets[0].base64}`);
//     }
//   };

//   return (
//     <View style={styles.photoContainer}>
//       <View style={styles.photoCircle}>
//         {photoUri ? (
//           <Image source={{ uri: photoUri }} style={styles.photo} />
//         ) : (
//           <Text style={styles.noPhoto}>No photo</Text>
//         )}
//       </View>
//       <View style={{ flexDirection: "row", marginTop: 10 }}>
//         <TouchableOpacity style={styles.photoBtn} onPress={pickFromGallery}>
//           <Text style={styles.photoBtnText}>Gallery</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.photoBtn} onPress={pickFromCamera}>
//           <Text style={styles.photoBtnText}>Camera</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default function AddMember() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [isLoading, setIsLoading] = useState(false);
//   const [relationshipTypes, setRelationshipTypes] = useState<any[]>([]);
//   const [formData, setFormData] = useState({
//     FamilyID: "",
//     FirstName: "",
//     LastName: "",
//     Gender: "",
//     DOB: "",
//     MobileNo: "",
//     EmailID: "",
//     RelationshipTypeID: "",
//     MemberPhoto: "",
//     Address1: "",
//     Address2: "",
//     City: "",
//     State: "",
//     ZipCode: "",
//   });

//   const setVal = (k: string, v: string) =>
//     setFormData((p) => ({ ...p, [k]: v }));

//   useEffect(() => {
//     (async () => {
//       const fam = (await AsyncStorage.getItem("FamilyID")) || "";
//       setVal("FamilyID", fam);
//       const rels = await fetchRelationships();
//       setRelationshipTypes(rels || []);
//     })();
//   }, []);

//   const relOpts = relationshipTypes.map((r: any) => ({
//     label: r.RelationshipName,
//     value: String(r.RelationshipTypeID),
//   }));
//   const genderOpts = [
//     { label: "Male", value: "M" },
//     { label: "Female", value: "F" },
//     { label: "Other", value: "O" },
//   ];

//   const save = async () => {
//     if (!formData.FirstName || !formData.LastName) {
//       Toast.show("Enter name", { backgroundColor: "#ef4444" });
//       return;
//     }
//     if (!formData.RelationshipTypeID) {
//       Toast.show("Select Relationship", { backgroundColor: "#ef4444" });
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const res = await addMember({ ...formData, AddedBy: user?.username });
//       if (res.status === "Success") {
//         Toast.show("Member added", { backgroundColor: "#22c55e" });
//         router.push("/screens/family/FamilyHub");
//       } else Toast.show(res.message, { backgroundColor: "#ef4444" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.push("/screens/family/FamilyHub")}>
//           <Text style={styles.cancel}>Cancel</Text>
//         </TouchableOpacity>
//         <Text style={styles.headTitle}>Add Member</Text>
//         <View style={{ width: 60 }} />
//       </View>

//       <ScrollView
//         contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* ❌ View Member Dropdown Removed */}
//         {/* 
//         <View style={styles.card}>
//           <Text style={styles.section}>View Member</Text>
//           <SelectField
//             placeholder="Select Member..."
//             options={memberOpts}
//             value={selectedMemberId}
//             onChange={handleSelectMember}
//           />
//         </View>
//         */}

//         {/* Member Details */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Member Details</Text>
//           <ProfilePhotoPicker
//             photoUri={formData.MemberPhoto}
//             onPick={(uri) => setVal("MemberPhoto", uri)}
//           />

//           <InputField
//             placeholder="First Name *"
//             value={formData.FirstName}
//             onChangeText={(v) => setVal("FirstName", v)}
//           />
//           <InputField
//             placeholder="Last Name *"
//             value={formData.LastName}
//             onChangeText={(v) => setVal("LastName", v)}
//           />
//           <SelectField
//             label="Gender"
//             placeholder="Select..."
//             options={genderOpts}
//             value={formData.Gender}
//             onChange={(v) => setVal("Gender", v)}
//           />
//           <DateField
//             label="Date of Birth"
//             placeholder="(YYYY-MM-DD)"
//             value={formData.DOB}
//             onChange={(v) => setVal("DOB", v)}
//           />
//           <SelectField
//             label="Relationship"
//             placeholder="Select..."
//             options={relOpts}
//             value={formData.RelationshipTypeID}
//             onChange={(v) => setVal("RelationshipTypeID", v)}
//           />
//         </View>

//         {/* Contact */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Contact Details</Text>
//           <InputField
//             placeholder="Email Address"
//             value={formData.EmailID}
//             onChangeText={(v) => setVal("EmailID", v)}
//             keyboardType="email-address"
//           />
//           <InputField
//             placeholder="Mobile Number"
//             value={formData.MobileNo}
//             onChangeText={(v) => setVal("MobileNo", v)}
//             keyboardType="phone-pad"
//           />
//         </View>

//         {/* Address */}
//         <View style={styles.card}>
//           <Text style={styles.section}>Address Details</Text>
//           <InputField
//             placeholder="Address Line 1"
//             value={formData.Address1}
//             onChangeText={(v) => setVal("Address1", v)}
//           />
//           <InputField
//             placeholder="Address Line 2 (Apt, Suite, etc.)"
//             value={formData.Address2}
//             onChangeText={(v) => setVal("Address2", v)}
//           />
//           <InputField
//             placeholder="City"
//             value={formData.City}
//             onChangeText={(v) => setVal("City", v)}
//           />
//           <InputField
//             placeholder="State"
//             value={formData.State}
//             onChangeText={(v) => setVal("State", v)}
//           />
//           <InputField
//             placeholder="Zip Code"
//             value={formData.ZipCode}
//             onChangeText={(v) => setVal("ZipCode", v)}
//             keyboardType="numeric"
//           />
//         </View>

//         <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={isLoading}>
//           {isLoading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.saveTxt}>Save Member</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderColor: BORDER,
//     padding: 15,
//   },
//   headTitle: { fontSize: 18, fontWeight: "700", color: TEXT },
//   cancel: { color: BLUE, fontWeight: "600" },

//   card: {
//     backgroundColor: CARD,
//     borderRadius: 12,
//     padding: 15,
//     marginBottom: 14,
//   },
//   section: { fontSize: 16, fontWeight: "700", color: TEXT, marginBottom: 10 },

//   input: {
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 15,
//     marginBottom: 10,
//     color: "#111",
//     fontWeight: "500",
//   },

//   selectWrap: { marginBottom: 10, position: "relative", zIndex: 10 },
//   dropdownBox: {
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     height: 45,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   dropdownText: { fontSize: 15, color: TEXT, flex: 1, marginRight: 8 },
//   dropdownArrow: { color: "#777", fontSize: 16 },
//   dropdownMenu: {
//     position: "absolute",
//     top: 47,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     borderColor: BORDER,
//     borderWidth: 1,
//     borderRadius: 10,
//     maxHeight: 220,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 6,
//     zIndex: 1000,
//   },
//   menuItem: { paddingVertical: 12, paddingHorizontal: 14, backgroundColor: "#fff" },
//   menuText: { fontSize: 16, color: TEXT },
//   label: { color: LABEL, fontWeight: "600", marginBottom: 6 },
//   photoContainer: { alignItems: "center", marginBottom: 14 },
//   photoCircle: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     backgroundColor: "#e5e7eb",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   photo: { width: 90, height: 90, borderRadius: 45, resizeMode: "cover" },
//   noPhoto: { color: "#888", fontSize: 15 },
//   photoBtn: {
//     flex: 1,
//     backgroundColor: "#2563eb",
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginHorizontal: 6,
//     minWidth: 95,
//     alignItems: "center",
//   },
//   photoBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
//   modalBG: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.15)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   iosPickerWrap: {
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 18,
//     width: 320,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 8 },
//   },
//   iosPickerDone: {
//     marginTop: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     alignSelf: "center",
//     backgroundColor: "#f3f4f6",
//     borderRadius: 7,
//   },
//   saveBtn: { backgroundColor: BLUE, borderRadius: 10, padding: 15, alignItems: "center" },
//   saveTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
// });



import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { addMember, fetchRelationships } from "../../../api/memberApi";
import { useAuth } from "../../../components/authContext";

const BLUE = "#2563eb";
const BORDER = "#e5e7eb";
const CARD = "#f9fafb";
const PLACEHOLDER = "#555";
const TEXT = "#111827";
const LABEL = "#374151";

const formatDate = (d: Date) => {
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
};

type Option = { label: string; value: string };

const SelectField = ({
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  options: Option[];
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label,
    [options, value]
  );

  return (
    <View style={styles.selectWrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={styles.dropdownBox}
        activeOpacity={0.8}
        onPress={() => setOpen((p) => !p)}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedLabel && { color: PLACEHOLDER },
          ]}
          numberOfLines={1}
        >
          {selectedLabel || placeholder || "Select..."}
        </Text>
        <Text style={styles.dropdownArrow}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownMenu}>
          {options.length === 0 && (
            <Text style={styles.menuText}>No options</Text>
          )}
          {options.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.menuItem}
              onPress={() => {
                onChange(item.value);
                setOpen(false);
              }}
            >
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const InputField = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
}) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#444"
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType || "default"}
  />
);

const DateField = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (v: string) => void;
}) => {
  const [show, setShow] = useState(false);
  const current = value ? new Date(value) : new Date();

  return (
    <View style={{ marginBottom: 10 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={styles.input}
        activeOpacity={0.8}
        onPress={() => setShow(true)}
      >
        <Text style={{ color: value ? TEXT : PLACEHOLDER, fontSize: 15 }}>
          {value || placeholder || "Select date"}
        </Text>
      </TouchableOpacity>

      {show && Platform.OS === "ios" && (
        <Modal transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalBG}
            activeOpacity={1}
            onPress={() => setShow(false)}
          >
            <View style={styles.iosPickerWrap}>
              <DateTimePicker
                mode="date"
                value={current}
                display="spinner"
                onChange={(_, picked) => {
                  if (picked) onChange(formatDate(picked));
                }}
                maximumDate={new Date()}
              />
              <TouchableOpacity
                style={styles.iosPickerDone}
                onPress={() => setShow(false)}
              >
                <Text style={{ color: BLUE, fontWeight: "700" }}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      {show && Platform.OS === "android" && (
        <DateTimePicker
          mode="date"
          value={current}
          display="default"
          onChange={(_, picked) => {
            setShow(false);
            if (picked) onChange(formatDate(picked));
          }}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const ProfilePhotoPicker = ({
  photoUri,
  onPick,
}: {
  photoUri: string;
  onPick: (uri: string) => void;
}) => {
  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow gallery access");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.6,
    });
    if (!res.canceled && res.assets?.length > 0) {
      onPick(`data:image/jpeg;base64,${res.assets[0].base64}`);
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow camera access");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.6,
    });
    if (!res.canceled && res.assets?.length > 0) {
      onPick(`data:image/jpeg;base64,${res.assets[0].base64}`);
    }
  };

  return (
    <View style={styles.photoContainer}>
      <View style={styles.photoCircle}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <Text style={styles.noPhoto}>No photo</Text>
        )}
      </View>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TouchableOpacity style={styles.photoBtn} onPress={pickFromGallery}>
          <Text style={styles.photoBtnText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoBtn} onPress={pickFromCamera}>
          <Text style={styles.photoBtnText}>Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AddMember() {
  const router = useRouter();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [relationshipTypes, setRelationshipTypes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Gender: "",
    DOB: "",
    MobileNo: "",
    EmailID: "",
    RelationshipTypeID: "",
    MemberPhoto: "",
    Address1: "",
    Address2: "",
    City: "",
    State: "",
    ZipCode: "",
  });

  const setVal = (k: string, v: string) =>
    setFormData((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      const rels = await fetchRelationships();
      setRelationshipTypes(rels || []);
    })();
  }, []);

  const relOpts = relationshipTypes.map((r: any) => ({
    label: r.RelationshipName,
    value: String(r.RelationshipTypeID),
  }));
  const genderOpts = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Other", value: "O" },
  ];

  const save = async () => {
    if (!formData.FirstName || !formData.LastName) {
      Toast.show("Enter name", { backgroundColor: "#ef4444" });
      return;
    }
    if (!formData.RelationshipTypeID) {
      Toast.show("Select Relationship", { backgroundColor: "#ef4444" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await addMember({ ...formData, AddedBy: user?.username });
      if (res.status === "Success") {
        Toast.show("Member added", { backgroundColor: "#22c55e" });
        router.push("/screens/family/FamilyHub");
      } else {
        Toast.show(res.message, { backgroundColor: "#ef4444" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/screens/family/FamilyHub")}
        >
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headTitle}>Add Member</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.section}>Member Details</Text>
          <ProfilePhotoPicker
            photoUri={formData.MemberPhoto}
            onPick={(uri) => setVal("MemberPhoto", uri)}
          />

          <InputField
            placeholder="First Name *"
            value={formData.FirstName}
            onChangeText={(v) => setVal("FirstName", v)}
          />
          <InputField
            placeholder="Last Name *"
            value={formData.LastName}
            onChangeText={(v) => setVal("LastName", v)}
          />
          <SelectField
            label="Gender"
            placeholder="Select..."
            options={genderOpts}
            value={formData.Gender}
            onChange={(v) => setVal("Gender", v)}
          />
          <DateField
            label="Date of Birth"
            placeholder="(YYYY-MM-DD)"
            value={formData.DOB}
            onChange={(v) => setVal("DOB", v)}
          />
          <SelectField
            label="Relationship"
            placeholder="Select..."
            options={relOpts}
            value={formData.RelationshipTypeID}
            onChange={(v) => setVal("RelationshipTypeID", v)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Contact Details</Text>
          <InputField
            placeholder="Email Address"
            value={formData.EmailID}
            onChangeText={(v) => setVal("EmailID", v)}
            keyboardType="email-address"
          />
          <InputField
            placeholder="Mobile Number"
            value={formData.MobileNo}
            onChangeText={(v) => setVal("MobileNo", v)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Address Details</Text>
          <InputField
            placeholder="Address Line 1"
            value={formData.Address1}
            onChangeText={(v) => setVal("Address1", v)}
          />
          <InputField
            placeholder="Address Line 2 (Apt, Suite, etc.)"
            value={formData.Address2}
            onChangeText={(v) => setVal("Address2", v)}
          />
          <InputField
            placeholder="City"
            value={formData.City}
            onChangeText={(v) => setVal("City", v)}
          />
          <InputField
            placeholder="State"
            value={formData.State}
            onChangeText={(v) => setVal("State", v)}
          />
          <InputField
            placeholder="Zip Code"
            value={formData.ZipCode}
            onChangeText={(v) => setVal("ZipCode", v)}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={save}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveTxt}>Save Member</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: BORDER,
    padding: 15,
  },
  headTitle: { fontSize: 18, fontWeight: "700", color: TEXT },
  cancel: { color: BLUE, fontWeight: "600" },
  card: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 15,
    marginBottom: 14,
  },
  section: { fontSize: 16, fontWeight: "700", color: TEXT, marginBottom: 10 },
  input: {
    backgroundColor: "#fff",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 10,
    color: "#111",
    fontWeight: "500",
  },
  selectWrap: { marginBottom: 10, position: "relative", zIndex: 10 },
  dropdownBox: {
    backgroundColor: "#fff",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: { fontSize: 15, color: TEXT, flex: 1, marginRight: 8 },
  dropdownArrow: { color: "#777", fontSize: 16 },
  dropdownMenu: {
    position: "absolute",
    top: 47,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 10,
    maxHeight: 220,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 1000,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 14 },
  menuText: { fontSize: 16, color: TEXT },
  label: { color: LABEL, fontWeight: "600", marginBottom: 6 },
  photoContainer: { alignItems: "center", marginBottom: 14 },
  photoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: { width: 90, height: 90, borderRadius: 45, resizeMode: "cover" },
  noPhoto: { color: "#888", fontSize: 15 },
  photoBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 6,
    minWidth: 95,
    alignItems: "center",
  },
  photoBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  modalBG: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  iosPickerWrap: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    width: 320,
    alignItems: "center",
  },
  iosPickerDone: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 7,
  },
  saveBtn: {
    backgroundColor: BLUE,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  saveTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
