// // import { Ionicons } from "@expo/vector-icons";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import DateTimePicker from "@react-native-community/datetimepicker";
// // import * as ImagePicker from "expo-image-picker";
// // import { useLocalSearchParams, useRouter } from "expo-router";
// // import React, { useEffect, useState } from "react";
// // import {
// //   ActivityIndicator,
// //   Image,
// //   Modal,
// //   Platform,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";
// // import Toast from "react-native-root-toast";
// // import { fetchMemberById, updateMember } from "../../../api/memberApi";

// // const BASE_URL = "https://isela-ungrumpy-undiligently.ngrok-free.dev/api/member";

// // export default function EditMember() {
// //   const router = useRouter();
// //   // router.push({ pathname: "/screens/family/EditMember", params: { id: member.id } });
// //   const [loading, setLoading] = useState(false);
// //   const [relationships, setRelationships] = useState<any[]>([]);
// //   const [form, setForm] = useState<any>(null);
// //   const [showGender, setShowGender] = useState(false);
// //   const { memberId } = useLocalSearchParams<{ memberId: string }>();
// //   const [showDOB, setShowDOB] = useState(false);
// //   const [showRelationship, setShowRelationship] = useState(false);

// //   useEffect(() => {
// //     const loadData = async () => {
// //       try {
// //         setLoading(true);
// //         const token = await AsyncStorage.getItem("token");
// //         // Fetch member
// //         const member = await fetchMemberById(memberId);
// //         setForm(member);
// //         // Fetch relationships
// //         const res = await fetch(`${BASE_URL}/relationships/list`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const data = await res.json();
// //         setRelationships(data);
// //       } catch (err) {
// //         console.error("❌ Failed to load member:", err);
// //         Toast.show("Error loading member", { backgroundColor: "#ef4444" });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     loadData();
// //   }, [memberId]);

// //   // Image update
// //   const handlePickImage = async () => {
// //     const result = await ImagePicker.launchImageLibraryAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       base64: true,
// //       quality: 0.6,
// //     });
// //     if (!result.canceled) {
// //       const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
// //       setForm({ ...form, MemberPhoto: base64 });
// //     }
// //   };

// //   // Save changes
// //   const handleSave = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await updateMember(memberId!, form);
// //       if (res.status === "Success") {
// //         Toast.show("Member updated successfully!", { backgroundColor: "#22c55e" });
// //         router.back();
// //       } else {
// //         Toast.show(res.message, { backgroundColor: "#ef4444" });
// //       }
// //     } catch (err) {
// //       console.error("❌ Update error:", err);
// //       Toast.show("Failed to update member", { backgroundColor: "#ef4444" });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (!form)
// //     return (
// //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
// //         <ActivityIndicator size="large" color="#2563eb" />
// //       </View>
// //     );

// //   // Gender options
// //   const genderOptions = [
// //     { label: "Male", value: "M" },
// //     { label: "Female", value: "F" },
// //     { label: "Other", value: "O" },
// //   ];

// //   // Format date for input field
// //   const formatDate = (d?: string | Date) => {
// //     if (!d) return "";
// //     const date = typeof d === "string" ? new Date(d) : d;
// //     const yy = date.getFullYear();
// //     const mm = String(date.getMonth() + 1).padStart(2, "0");
// //     const dd = String(date.getDate()).padStart(2, "0");
// //     return `${yy}-${mm}-${dd}`;
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
// //       <Text style={styles.title}>Edit Member</Text>

// //       {/* Profile Photo */}
// //       <TouchableOpacity style={styles.imageBox} onPress={handlePickImage}>
// //         {form.MemberPhoto ? (
// //           <Image source={{ uri: form.MemberPhoto }} style={styles.avatar} />
// //         ) : (
// //           <Ionicons name="camera-outline" size={40} color="#9ca3af" />
// //         )}
// //       </TouchableOpacity>

// //       {/* Editable Fields */}
// //       <TextInput
// //         style={styles.input}
// //         placeholder="First Name"
// //         value={form.FirstName || ""}
// //         onChangeText={(v) => setForm({ ...form, FirstName: v })}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Last Name"
// //         value={form.LastName || ""}
// //         onChangeText={(v) => setForm({ ...form, LastName: v })}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Mobile No"
// //         keyboardType="phone-pad"
// //         value={form.MobileNo || ""}
// //         onChangeText={(v) => setForm({ ...form, MobileNo: v })}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Email Address"
// //         keyboardType="email-address"
// //         value={form.EmailID || ""}
// //         onChangeText={(v) => setForm({ ...form, EmailID: v })}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Address Line 1"
// //         value={form.Address1 || ""}
// //         onChangeText={(v) => setForm({ ...form, Address1: v })}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Address Line 2"
// //         value={form.Address2 || ""}
// //         onChangeText={(v) => setForm({ ...form, Address2: v })}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="City"
// //         value={form.City || ""}
// //         onChangeText={(v) => setForm({ ...form, City: v })}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="State"
// //         value={form.State || ""}
// //         onChangeText={(v) => setForm({ ...form, State: v })}
// //       />
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Zip Code"
// //         keyboardType="numeric"
// //         value={form.ZipCode || ""}
// //         onChangeText={(v) => setForm({ ...form, ZipCode: v })}
// //       />

// //       {/* Gender Picker */}
// //       <Text style={styles.label}>Gender</Text>
// //       <TouchableOpacity
// //         style={styles.selectField}
// //         onPress={() => setShowGender(true)}
// //       >
// //         <Text style={styles.selectText}>
// //           {genderOptions.find((g) => g.value === form.Gender)?.label || "Select Gender"}
// //         </Text>
// //         <Ionicons name="chevron-down" size={18} color="#6b7280" />
// //       </TouchableOpacity>
// //       {/* Gender Modal */}
// //       <Modal visible={showGender} transparent animationType="fade">
// //         <TouchableOpacity
// //           style={styles.modalBG}
// //           activeOpacity={1}
// //           onPressOut={() => setShowGender(false)}
// //         >
// //           <View style={styles.modalList}>
// //             {genderOptions.map((g) => (
// //               <TouchableOpacity
// //                 key={g.value}
// //                 style={styles.modalItem}
// //                 onPress={() => {
// //                   setForm({ ...form, Gender: g.value });
// //                   setShowGender(false);
// //                 }}
// //               >
// //                 <Text
// //                   style={[
// //                     styles.modalItemText,
// //                     g.value === form.Gender && { color: "#2563eb", fontWeight: "bold" },
// //                   ]}
// //                 >
// //                   {g.label}
// //                 </Text>
// //               </TouchableOpacity>
// //             ))}
// //           </View>
// //         </TouchableOpacity>
// //       </Modal>

// //       {/* Date of Birth Picker */}
// //       <Text style={styles.label}>Date of Birth</Text>
// //       <TouchableOpacity
// //         style={styles.selectField}
// //         onPress={() => setShowDOB(true)}
// //       >
// //         <Text style={styles.selectText}>{form.DOB ? formatDate(form.DOB) : "Select Date"}</Text>
// //         <Ionicons name="calendar-outline" size={18} color="#6b7280" />
// //       </TouchableOpacity>
// //       {showDOB && (
// //         <DateTimePicker
// //           value={form.DOB ? new Date(form.DOB) : new Date()}
// //           mode="date"
// //           display={Platform.OS === "ios" ? "spinner" : "default"}
// //           maximumDate={new Date()}
// //           onChange={(_, date) => {
// //             setShowDOB(false);
// //             if (date) setForm({ ...form, DOB: formatDate(date) });
// //           }}
// //         />
// //       )}

// //       {/* Relationship Dropdown */}
// //       <Text style={styles.label}>Relationship</Text>
// //       <TouchableOpacity
// //         style={styles.selectField}
// //         onPress={() => setShowRelationship(true)}
// //       >
// //         <Text style={styles.selectText}>
// //           {relationships.find((r) => r.RelationshipTypeID === form.RelationshipTypeID)?.RelationshipName ||
// //             "Select Relationship"}
// //         </Text>
// //         <Ionicons name="chevron-down" size={18} color="#6b7280" />
// //       </TouchableOpacity>
// //       <Modal visible={showRelationship} transparent animationType="fade">
// //         <TouchableOpacity
// //           style={styles.modalBG}
// //           activeOpacity={1}
// //           onPressOut={() => setShowRelationship(false)}
// //         >
// //           <View style={styles.modalList}>
// //             {relationships.map((r) => (
// //               <TouchableOpacity
// //                 key={r.RelationshipTypeID}
// //                 style={styles.modalItem}
// //                 onPress={() => {
// //                   setForm({ ...form, RelationshipTypeID: r.RelationshipTypeID });
// //                   setShowRelationship(false);
// //                 }}
// //               >
// //                 <Text
// //                   style={[
// //                     styles.modalItemText,
// //                     r.RelationshipTypeID === form.RelationshipTypeID && {
// //                       color: "#2563eb",
// //                       fontWeight: "bold",
// //                     },
// //                   ]}
// //                 >
// //                   {r.RelationshipName}
// //                 </Text>
// //               </TouchableOpacity>
// //             ))}
// //           </View>
// //         </TouchableOpacity>
// //       </Modal>

// //       <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={loading}>
// //         {loading ? (
// //           <ActivityIndicator color="#fff" />
// //         ) : (
// //           <Text style={styles.submitText}>Update</Text>
// //         )}
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { padding: 20, backgroundColor: "#fff" },
// //   title: { fontSize: 22, fontWeight: "700", marginBottom: 20, color: "#111827" },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: "#d1d5db",
// //     borderRadius: 10,
// //     padding: 10,
// //     marginBottom: 10,
// //     color: "#111827",
// //     fontSize: 15,
// //   },
// //   imageBox: {
// //     alignSelf: "center",
// //     borderRadius: 50,
// //     width: 100,
// //     height: 100,
// //     backgroundColor: "#f3f4f6",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginBottom: 15,
// //   },
// //   avatar: { width: 100, height: 100, borderRadius: 50 },
// //   label: { marginBottom: 6, color: "#374151", fontWeight: "600", marginTop: 2 },
// //   selectField: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: "#d1d5db",
// //     borderRadius: 10,
// //     padding: 11,
// //     marginBottom: 10,
// //     justifyContent: "space-between",
// //     backgroundColor: "#fafcff",
// //   },
// //   selectText: { color: "#111827", fontSize: 15, flex: 1 },
// //   modalBG: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.14)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   modalList: {
// //     backgroundColor: "#fff",
// //     borderRadius: 13,
// //     minWidth: 270,
// //     paddingVertical: 8,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.10,
// //     shadowRadius: 10,
// //     elevation: 6,
// //     maxHeight: 280,
// //   },
// //   modalItem: {
// //     paddingVertical: 14,
// //     paddingHorizontal: 16,
// //   },
// //   modalItemText: { fontSize: 16, color: "#111827" },
// //   submitBtn: {
// //     backgroundColor: "#2563eb",
// //     padding: 14,
// //     borderRadius: 10,
// //     alignItems: "center",
// //     marginTop: 12,
// //     marginBottom: 30,
// //   },
// //   submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
// // });


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
//   View,
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

// export default function EditMember() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [loading, setLoading] = useState(false);
//   const [relationshipTypes, setRelationshipTypes] = useState<any[]>([]);
//   const [familyMembers, setFamilyMembers] = useState<any[]>([]);
//   const [selectedMemberId, setSelectedMemberId] = useState("");
//   const [formData, setFormData] = useState<any>({
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
//     setFormData((p: any) => ({ ...p, [k]: v }));

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const fam = (await AsyncStorage.getItem("FamilyID")) || "";
//         setVal("FamilyID", fam);

//         const [rels, members] = await Promise.all([
//           fetchRelationships(),
//           fetchFamilyHierarchy(),
//         ]);

//         setRelationshipTypes(rels || []);
//         setFamilyMembers(Array.isArray(members) ? members : []);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
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
//     if (!selectedMemberId) {
//       Toast.show("Select a member to edit", { backgroundColor: "#ef4444" });
//       return;
//     }
//     if (!formData.FirstName || !formData.LastName) {
//       Toast.show("Enter name", { backgroundColor: "#ef4444" });
//       return;
//     }
//     if (!formData.RelationshipTypeID) {
//       Toast.show("Select Relationship", { backgroundColor: "#ef4444" });
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await addMember({
//         ...formData,
//         MemberID: selectedMemberId,
//         UpdatedBy: user?.username,
//       });
//       if (res.status === "Success") {
//         Toast.show("Member updated", { backgroundColor: "#22c55e" });
//         router.push("/screens/family/FamilyHub");
//       } else Toast.show(res.message, { backgroundColor: "#ef4444" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.push("/screens/family/FamilyHub")}>
//           <Text style={styles.cancel}>Cancel</Text>
//         </TouchableOpacity>
//         <Text style={styles.headTitle}>Edit Member</Text>
//         <View style={{ width: 60 }} />
//       </View>

//       <ScrollView
//         contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* ✅ View Member Dropdown */}
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

//         <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={loading}>
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.saveTxt}>Update Member</Text>
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


import AsyncStorage from "@react-native-async-storage/async-storage";
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
import {
  fetchFamilyHierarchy,
  fetchRelationships,
  updateMember
} from "../../../api/memberApi";
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

export default function EditMember() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [relationshipTypes, setRelationshipTypes] = useState<any[]>([]);
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [formData, setFormData] = useState<any>({
    FamilyID: "",
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
    setFormData((p: any) => ({ ...p, [k]: v }));

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const fam = (await AsyncStorage.getItem("FamilyID")) || "";
        setVal("FamilyID", fam);
        const [rels, members] = await Promise.all([
          fetchRelationships(),
          fetchFamilyHierarchy(),
        ]);
        setRelationshipTypes(rels || []);
        setFamilyMembers(Array.isArray(members) ? members : []);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSelectMember = (id: string) => {
    setSelectedMemberId(id);
    const m = familyMembers.find((x: any) => String(x.MemberID) === String(id));
    if (!m) return;
    setFormData({
      ...formData,
      FirstName: m.FirstName || "",
      LastName: m.LastName || "",
      Gender: m.Gender || "",
      DOB: m.DOB ? String(m.DOB).split("T")[0] : "",
      MobileNo: m.MobileNo || "",
      EmailID: m.EmailID || "",
      Address1: m.Address1 || "",
      Address2: m.Address2 || "",
      City: m.City || "",
      State: m.State || "",
      ZipCode: m.ZipCode || "",
      RelationshipTypeID: m.RelationshipTypeID
        ? String(m.RelationshipTypeID)
        : "",
      MemberPhoto: m.MemberPhoto || "",
    });
  };

  const memberOpts = familyMembers.map((m: any) => ({
    label: `${m.FirstName || ""} ${m.LastName || ""}`.trim() || `#${m.MemberID}`,
    value: String(m.MemberID),
  }));

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
    if (!selectedMemberId) {
      Toast.show("Select a member to edit", { backgroundColor: "#ef4444" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        UpdatedBy: user?.username,
      };

      const res = await updateMember(selectedMemberId, payload); // ✅ fixed
      if (res.status === "Success") {
        Toast.show("Member updated successfully", { backgroundColor: "#22c55e" });
        router.push("/screens/family/FamilyHub");
      } else {
        Toast.show(res.message || "Update failed", { backgroundColor: "#ef4444" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/screens/family/FamilyHub")}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headTitle}>Edit Member</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.section}>View Member</Text>
          <SelectField
            placeholder="Select Member..."
            options={memberOpts}
            value={selectedMemberId}
            onChange={handleSelectMember}
          />
        </View>

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

        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveTxt}>Update Member</Text>
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
  menuItem: { paddingVertical: 12, paddingHorizontal: 14, backgroundColor: "#fff" },
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  iosPickerDone: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 7,
  },
  saveBtn: { backgroundColor: BLUE, borderRadius: 10, padding: 15, alignItems: "center" },
  saveTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
