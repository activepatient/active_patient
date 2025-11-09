
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as FileSystem from "expo-file-system/legacy";
// import * as ImagePicker from "expo-image-picker";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View
// } from "react-native";
// import { Provider as PaperProvider, Portal } from "react-native-paper";
// import Toast from "react-native-root-toast";

// const BASE_API = "https://active-patient.onrender.com";

// type Option = { label: string; value: string };
// type Dependent = {
//   memberID: string;
//   firstName: string;
//   relationshipType?: string;
//   displayName?: string;
// };

// const INSURANCE_TYPES = ["Medical", "Dental", "Vision"] as const;
// const FREQUENCIES = ["Weekly", "Monthly"] as const;

// const TEXT_DARK = "#111827";
// const PLACEHOLDER = "#4b5563";
// const CARD = "#f9fafb";
// const BORDER = "#e5e7eb";
// const LABEL = "#374151";

// const SelectField = ({
//   label,
//   placeholder,
//   value,
//   options,
//   onChange,
//   style,
// }: {
//   label?: string;
//   placeholder?: string;
//   value?: string | number;
//   options: Option[];
//   onChange: (v: string) => void;
//   style?: any;
// }) => {
//   const [open, setOpen] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
//   const ref = React.useRef<View>(null);

//   const selectedLabel = useMemo(
//     () => options.find((o) => String(o.value) === String(value))?.label,
//     [options, value]
//   );

//   const toggleDropdown = () => {
//     if (open) setOpen(false);
//     else {
//       ref.current?.measureInWindow((x, y, width, height) => {
//         setPosition({ x, y, width, height });
//         setOpen(true);
//       });
//     }
//   };

//   return (
//     <>
//       <View ref={ref} style={[styles.selectWrap, style]}>
//         {label ? <Text style={styles.label}>{label}</Text> : null}

//         <TouchableOpacity
//           style={styles.dropdownBox}
//           activeOpacity={0.8}
//           onPress={toggleDropdown}
//         >
//           <Text
//             style={[
//               styles.dropdownText,
//               !selectedLabel && { color: PLACEHOLDER },
//             ]}
//             numberOfLines={1}
//           >
//             {selectedLabel || placeholder || "Select..."}
//           </Text>
//           <Text style={styles.dropdownArrow}>{open ? "▲" : "▼"}</Text>
//         </TouchableOpacity>
//       </View>

//       {open && (
//         <Portal>
//           <TouchableWithoutFeedback onPress={() => setOpen(false)}>
//             <View style={styles.portalOverlay}>
//               <View
//                 style={[
//                   styles.dropdownMenu,
//                   {
//                     position: "absolute",
//                     top: position.y + position.height,
//                     left: position.x,
//                     width: position.width,
//                   },
//                 ]}
//               >
//                 {options.length === 0 ? (
//                   <Text style={styles.menuText}>No options</Text>
//                 ) : (
//                   options.map((item) => (
//                     <TouchableOpacity
//                       key={String(item.value)}
//                       style={styles.menuItem}
//                       onPress={() => {
//                         onChange(String(item.value));
//                         setOpen(false);
//                       }}
//                     >
//                       <Text style={styles.menuText}>{item.label}</Text>
//                     </TouchableOpacity>
//                   ))
//                 )}
//               </View>
//             </View>
//           </TouchableWithoutFeedback>
//         </Portal>
//       )}
//     </>
//   );
// };
// // ====== Main Component ======
// type UploadImageState = {
//   uri: string | null;
//   name: string | null;
//   type: string | null;
//   base64?: string | null; 
// };

// export default function AddInsurance() {
//   const router = useRouter();
//   const { action, memberIds, policyTypes } = useLocalSearchParams<{
//     action?: string;
//     memberIds?: string;
//     policyTypes?: string;
//   }>();

//   const [title, setTitle] = useState("Add Insurance");
//   const [isLoading, setIsLoading] = useState(false);

//   const [policyTypeList, setPolicyTypeList] = useState<Option[]>([]);
//   const [policyTypeID, setPolicyTypeID] = useState<string>("");

//   const [benefitTypeList, setBenefitTypeList] = useState<Option[]>([]);
//   const [benefitTypeID, setBenefitTypeID] = useState<string>("");

//   const [dependents, setDependents] = useState<Dependent[]>([]);
//   const [memberID, setMemberID] = useState<string>("");
//   const [subscriberID, setSubscriberID] = useState<string>("");

//   const [selectedDependents, setSelectedDependents] = useState<string[]>([]);
//   const [isMemberDisabled, setIsMemberDisabled] = useState(false);

//   const [frontImg, setFrontImg] = useState<UploadImageState>({
//     uri: null,
//     name: null,
//     type: null,
//   });
//   const [backImg, setBackImg] = useState<UploadImageState>({
//     uri: null,
//     name: null,
//     type: null,
//   });

//   // === Questionnaire States ===
//   const [paymentMethod, setPaymentMethod] = useState<string>("");
//   const [otherPayment, setOtherPayment] = useState("");
//   const [coverageTypes, setCoverageTypes] = useState<string[]>([]);
//   const [dontKnow, setDontKnow] = useState(false);

//  const [employeeContrib, setEmployeeContrib] = useState<
//   { type: typeof INSURANCE_TYPES[number]; amount: string; frequency: (typeof FREQUENCIES)[number] }[]
// >(
//   INSURANCE_TYPES.map((type) => ({
//     type,
//     amount: "",
//     frequency: FREQUENCIES[0] as (typeof FREQUENCIES)[number],
//   }))
// );

// const [employerContrib, setEmployerContrib] = useState<
//   { type: typeof INSURANCE_TYPES[number]; amount: string; frequency: (typeof FREQUENCIES)[number] }[]
// >(
//   INSURANCE_TYPES.map((type) => ({
//     type,
//     amount: "",
//     frequency: FREQUENCIES[0] as (typeof FREQUENCIES)[number],
//   }))
// );


//   const headerTitle = useMemo(
//     () => `${action === "edit" ? "Edit" : "Add"} Insurance`,
//     [action]
//   );

//   // ===== Media Permissions =====
//   const requestMediaPermissions = async () => {
//     if (Platform.OS !== "web") {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== "granted" && lib.status !== "granted") {
//         Toast.show("Camera or gallery permission is required.", {
//           backgroundColor: "#ef4444",
//         });
//       }
//     }
//   };

//   const pickImage = async (which: "front" | "back") => {
//     await requestMediaPermissions();
//     Alert.alert("Upload Image", "Choose a source", [
//       {
//         text: "Camera",
//         onPress: async () => {
//           const res = await ImagePicker.launchCameraAsync({
//   mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
//   quality: 0.8,
// });
//           if (!res.canceled) {
//             const asset = res.assets[0];
//             const payload = {
//               uri: asset.uri,
//               name: asset.fileName || `${which}-${Date.now()}.jpg`,
//               type: asset.mimeType || "image/jpeg",
//             };
//             which === "front" ? setFrontImg(payload) : setBackImg(payload);
//           }
//         },
//       },
//       {
//         text: "Gallery",
//         onPress: async () => {
//           const res = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
//             quality: 0.8,
//           });
//           if (!res.canceled) {
//             const asset = res.assets[0];
//             const payload = {
//               uri: asset.uri,
//               name: asset.fileName || `${which}-${Date.now()}.jpg`,
//               type: asset.mimeType || "image/jpeg",
//             };
//             which === "front" ? setFrontImg(payload) : setBackImg(payload);
//           }
//         },
//       },
//       { text: "Cancel", style: "cancel" },
//     ]);
//   };

//   // ===== Fetching Data =====
//   const fetchDependents = useCallback(async (token: string) => {
//     try {
//       const res = await fetch(`${BASE_API}/api/member/hierarchy`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (Array.isArray(data)) {
//         setDependents(
//           data.map((item) => ({
//             memberID: item.MemberID?.toString(),
//             firstName: `${item.FirstName}${
//               item.LastName ? " " + item.LastName : ""
//             }`,
//             relationshipType: item.RelationshipName || "",
//             displayName: `${
//               item.RelationshipName ? item.RelationshipName + " - " : ""
//             }${item.FirstName}${item.LastName ? " " + item.LastName : ""}`,
//           }))
//         );
//       }
//     } catch (e) {
//       console.log("Dependents error", e);
//     }
//   }, []);

// const fetchBenefitTypes = useCallback(async () => {
//   try {
//     const res = await fetch(`${BASE_API}/api/insurance/GetBenifitType`);
//     const data = await res.json();
//     console.log("🔹 Benefit types:", data);

//     if (Array.isArray(data)) {
//       setBenefitTypeList(
//         data.map((b: any) => ({
//           label: b.type,
//           value: String(b.id),
//         }))
//       );

//       // auto-select "Medical"
//       const medical = data.find(
//         (b: any) => b.type?.toLowerCase() === "medical"
//       );
//       if (medical) setBenefitTypeID(String(medical.id));
//     }
//   } catch (e) {
//     console.error("❌ Benefit types error:", e);
//   }
// }, []);



// const fetchPolicyTypes = useCallback(async () => {
//   try {
//     const res = await fetch(`${BASE_API}/api/insurance/GetPolicyType`);
//     const data = await res.json();
//     console.log("🔹 Policy types:", data);

//     if (Array.isArray(data)) {
//       setPolicyTypeList(
//         data.map((p: any) => ({
//           label: p.type,
//           value: String(p.id),
//         }))
//       );

//       // auto-select "Primary"
//       const primary = data.find(
//         (p: any) => p.type?.toLowerCase() === "primary"
//       );
//       if (primary) setPolicyTypeID(String(primary.id));
//     }
//   } catch (e) {
//     console.error("❌ Policy types error:", e);
//   }
// }, []);

//   const initScreen = useCallback(async () => {
//     const token = (await AsyncStorage.getItem("token")) || "";
//     const savedUser = (await AsyncStorage.getItem("user")) || "{}";
//     const user = JSON.parse(savedUser || "{}");

//     await Promise.all([
//       fetchDependents(token),
//       fetchBenefitTypes(),
//       fetchPolicyTypes(),
//     ]);

//     if (action === "add") {
//       setTitle("Add Insurance");
//       if (!memberIds || memberIds === "0") {
//         setMemberID(user?.id?.toString?.() || user?.Mid?.toString?.() || "");
//         setSubscriberID(user?.id?.toString?.() || user?.Mid?.toString?.() || "");
//       } else {
//         setMemberID(memberIds.toString());
//         setSubscriberID(
//           user?.id?.toString?.() || user?.Mid?.toString?.() || ""
//         );
//         setIsMemberDisabled(true);
//       }
//     } else {
//       setTitle("Edit Insurance");
//       setIsMemberDisabled(true);
//     }
//   }, [action, memberIds, fetchDependents, fetchBenefitTypes, fetchPolicyTypes]);

//   useEffect(() => {
//     initScreen();
//   }, [initScreen]);
  
// const handleSave = async () => {
//   try {
//     setIsLoading(true);
//     if (!memberID || memberID === "0") {
//       Toast.show("Invalid Member selected.", { backgroundColor: "#ef4444" });
//       setIsLoading(false);
//       return;
//     }

//     // ✅ Convert images to Base64 before sending
// // ✅ Convert images to Base64 before sending
// let frontBase64 = "";
// let backBase64 = "";

// if (frontImg.uri) {
//   frontBase64 = await FileSystem.readAsStringAsync(frontImg.uri, {
//     encoding: 'base64' as any,
//   });
// }

// if (backImg.uri) {
//   backBase64 = await FileSystem.readAsStringAsync(backImg.uri, {
//     encoding: 'base64' as any,
//   });
// }


//     // ✅ Prepare JSON payload instead of FormData
//     const payload = {
//       PolicyTypeID: String(policyTypeID),
//       BenefitTypeID: String(benefitTypeID),
//       SubscriberID: String(subscriberID),
//       MemberID: String(memberID),
//       DependentsID: selectedDependents.join(","),
//       PaymentMethodId: paymentMethod || "0",
//       OtherPaymentMethod: otherPayment,
//       CoverageTypeIds: coverageTypes.join(","),
//       IsAssistanceRequired: dontKnow ? "1" : "0",
//       InsFrontImgBase64: frontBase64,
//       InsBackImgBase64: backBase64,
//     };

//     const token = (await AsyncStorage.getItem("token")) || "";

//     const res = await fetch(`${BASE_API}/api/insurance/SaveInsuranceAsync`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json();

//     if (data.status === "Success") {
//       Toast.show(data.message || "Policy saved successfully", {
//         backgroundColor: "#22c55e",
//       });
//       setTimeout(() => router.back(), 1000);
//     } else {
//       Toast.show(data.message || "Failed to save", {
//         backgroundColor: "#ef4444",
//       });
//     }
//   } catch (e) {
//     console.error("Save error", e);
//     Toast.show("Server error while saving policy", {
//       backgroundColor: "#ef4444",
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };


//   return (
//     <PaperProvider>
//       <View style={styles.wrapper}>
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             style={styles.backButton}
//             activeOpacity={0.8}
//           >
//             <Ionicons name="chevron-back" size={26} color="#111827" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>{headerTitle}</Text>
//           <View style={{ width: 30 }} />
//         </View>

//         <ScrollView
//           contentContainerStyle={{ paddingBottom: 28 }}
//           style={{ flex: 1 }}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* === Member Selection === */}
//           <View style={styles.card}>
//             <SelectField
//               label={action === "edit" ? "Edit For" : "Add For"}
//               placeholder="Select member"
//               value={memberID}
//               options={dependents.map((d) => ({
//                 label: d.displayName || d.firstName,
//                 value: d.memberID,
//               }))}
//               onChange={setMemberID}
//               style={isMemberDisabled ? { opacity: 0.6 } : {}}
//             />
//           </View>

//           {/* === Insurance Card Images === */}
// <View style={styles.card}>
//   <Text style={styles.sectionTitle}>Insurance Card Images</Text>

//   <View style={styles.imageRow}>
//     {/* Front Image */}
//     <TouchableOpacity
//       style={styles.imageBox}
//       onPress={() => pickImage("front")}
//     >
//       {frontImg?.uri || frontImg?.base64 ? (
//         <Image
//           source={{
//             uri: frontImg.uri
//               ? frontImg.uri
//               : `data:image/jpeg;base64,${frontImg.base64}`,
//           }}
//           style={styles.image}
//           resizeMode="cover"
//         />
//       ) : (
//         <Text style={styles.imagePlaceholder}>+ Front Image</Text>
//       )}
//     </TouchableOpacity>

//     {/* Back Image */}
//     <TouchableOpacity
//       style={styles.imageBox}
//       onPress={() => pickImage("back")}
//     >
//       {backImg?.uri || backImg?.base64 ? (
//         <Image
//           source={{
//             uri: backImg.uri
//               ? backImg.uri
//               : `data:image/jpeg;base64,${backImg.base64}`,
//           }}
//           style={styles.image}
//           resizeMode="cover"
//         />
//       ) : (
//         <Text style={styles.imagePlaceholder}>+ Back Image</Text>
//       )}
//     </TouchableOpacity>
//   </View>
// </View>


//           {/* === Policy Type === */}
//           <View style={styles.card}>
//             <SelectField
//               label="Policy Type"
//               placeholder="Select policy type"
//               value={policyTypeID}
//               options={policyTypeList}
//               onChange={setPolicyTypeID}
//             />
//           </View>

//           {/* === Benefit Type / Subscriber / Dependents === */}
//           <View style={styles.card}>
//             <SelectField
//               label="Benefit Type"
//               placeholder="Select benefit type"
//               value={benefitTypeID}
//               options={benefitTypeList}
//               onChange={setBenefitTypeID}
//             />
//             <SelectField
//               label="Subscriber"
//               placeholder="Select subscriber"
//               value={subscriberID}
//               options={dependents
//                 .filter((d) =>
//                   ["Self", "Spouse"].includes(d.relationshipType || "")
//                 )
//                 .map((d) => ({
//                   label: d.displayName || d.firstName,
//                   value: d.memberID,
//                 }))}
//               onChange={setSubscriberID}
//             />
//             <Text style={[styles.label, { marginTop: 12 }]}>Dependents</Text>
//             <View style={{ rowGap: 8, marginTop: 6 }}>
//               {dependents.map((d) => {
//                 const checked = selectedDependents.includes(d.memberID);
//                 return (
//                   <TouchableOpacity
//                     key={d.memberID}
//                     onPress={() =>
//                       setSelectedDependents((prev) =>
//                         prev.includes(d.memberID)
//                           ? prev.filter((id) => id !== d.memberID)
//                           : [...prev, d.memberID]
//                       )
//                     }
//                     style={[styles.checkRow, checked && styles.checkRowActive]}
//                   >
//                     <View
//                       style={[
//                         styles.checkbox,
//                         checked && styles.checkboxChecked,
//                       ]}
//                     />
//                     <Text style={styles.checkText}>
//                       {d.displayName || d.firstName}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </View>

//           {/* === Questionnaire Section === */}
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>
//               Insurance Coverage Questionnaire: Policy Information
//             </Text>

//             {/* Section 1 */}
//             <Text style={[styles.label, { marginTop: 10 }]}>
//               Section 1 – Payment Method & Coverage Types
//             </Text>
//             <Text style={{ marginTop: 6 }}>
//               1. Are your insurance premiums paid directly by you or through
//               your paycheck?
//             </Text>

//             {[
//               { id: "1", label: "Directly by me" },
//               { id: "2", label: "Through my paycheck" },
//               { id: "3", label: "Other" },
//             ].map((opt) => (
//               <TouchableOpacity
//                 key={opt.id}
//                 style={[
//                   styles.checkRow,
//                   paymentMethod === opt.id && styles.checkRowActive,
//                 ]}
//                 onPress={() => setPaymentMethod(opt.id)}
//               >
//                 <View
//                   style={[
//                     styles.checkbox,
//                     paymentMethod === opt.id && styles.checkboxChecked,
//                   ]}
//                 />
//                 <Text style={styles.checkText}>{opt.label}</Text>
//               </TouchableOpacity>
//             ))}

//             {paymentMethod === "3" && (
//               <TextInput
//                 placeholder="Specify other payment method"
//                 placeholderTextColor="#9ca3af"
//                 value={otherPayment}
//                 onChangeText={setOtherPayment}
//                 style={{
//                   borderWidth: 1,
//                   borderColor: BORDER,
//                   borderRadius: 10,
//                   padding: 10,
//                   marginTop: 8,
//                   backgroundColor: "#fff",
//                 }}
//               />
//             )}

//             <Text style={{ marginTop: 12 }}>
//               2. Which types of insurance do you currently have?
//             </Text>
//             {INSURANCE_TYPES.map((type) => {
//               const checked = coverageTypes.includes(type);
//               return (
//                 <TouchableOpacity
//                   key={type}
//                   onPress={() =>
//                     setCoverageTypes((prev) =>
//                       checked
//                         ? prev.filter((t) => t !== type)
//                         : [...prev, type]
//                     )
//                   }
//                   style={[styles.checkRow, checked && styles.checkRowActive]}
//                 >
//                   <View
//                     style={[
//                       styles.checkbox,
//                       checked && styles.checkboxChecked,
//                     ]}
//                   />
//                   <Text style={styles.checkText}>{type}</Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>

//           {/* Section 2: Employee Contribution */}
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Section 2 – Employee Contribution</Text>
//             <Text style={{ marginTop: 6 }}>
//               3. How much do you pay for insurance premiums?
//             </Text>

//            {employeeContrib.map((item, idx) => (
//   <View key={idx} style={{ marginTop: 10 }}>
//     <Text style={[styles.label, { marginBottom: 4 }]}>
//       {item.type}
//     </Text>
//     <View style={{ flexDirection: "row", gap: 8 }}>
//       <TextInput
//         placeholder="Amount ($)"
//         placeholderTextColor="#6b7280" // 👈 visible gray placeholder
//         keyboardType="numeric"
//         value={item.amount}
//         onChangeText={(val) => {
//           const copy = [...employeeContrib];
//           copy[idx].amount = val;
//           setEmployeeContrib(copy);
//         }}
//         style={{
//           flex: 1,
//           borderWidth: 1,
//           borderColor: BORDER,
//           borderRadius: 10,
//           padding: 10,
//           backgroundColor: "#fff",
//           color: "#111827", // visible input text color
//         }}
//       />
//       <SelectField
//         placeholder="Frequency"
//         value={item.frequency}
//         options={FREQUENCIES.map((f) => ({
//           label: f,
//           value: f,
//         }))}
//         onChange={(val) => {
//           const copy = [...employeeContrib];
//           copy[idx].frequency = val as (typeof FREQUENCIES)[number];
//           setEmployeeContrib(copy);
//         }}
//         style={{ flex: 1 }}
//       />
//     </View>
//   </View>
// ))}

//           </View>

//           {/* Section 3: Employer Contribution */}
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Section 3 – Employer Contribution</Text>
//             <Text style={{ marginTop: 6 }}>
//               4. Please indicate the amount your employer contributes:
//             </Text>

//             {employerContrib.map((item, idx) => (
//               <View key={idx} style={{ marginTop: 10 }}>
//                 <Text style={[styles.label, { marginBottom: 4 }]}>
//                   {item.type}
//                 </Text>
//                 <View style={{ flexDirection: "row", gap: 8 }}>
//                   <TextInput
//                     placeholder="Amount ($)"
//                     placeholderTextColor="#6b7280"
//                     keyboardType="numeric"
//                     value={item.amount}
//                     onChangeText={(val) => {
//                       const copy = [...employerContrib];
//                       copy[idx].amount = val;
//                       setEmployerContrib(copy);
//                     }}
//                     style={{
//                       flex: 1,
//                       borderWidth: 1,
//                       borderColor: BORDER,
//                       borderRadius: 10,
//                       padding: 10,
//                       backgroundColor: "#fff",
//                     }}
//                   />
//                   <SelectField
//                     placeholder="Frequency"
//                     value={item.frequency}
//                     options={FREQUENCIES.map((f) => ({
//                       label: f,
//                       value: f,
//                     }))}
//                     onChange={(val) => {
//   const copy = [...employerContrib];
//   copy[idx].frequency = val as (typeof FREQUENCIES)[number];
//   setEmployerContrib(copy);
// }}
//                     style={{ flex: 1 }}
//                   />
//                 </View>
//               </View>
//             ))}

//             <TouchableOpacity
//               style={[
//                 styles.checkRow,
//                 dontKnow && styles.checkRowActive,
//                 { marginTop: 12 },
//               ]}
//               onPress={() => setDontKnow(!dontKnow)}
//             >
//               <View
//                 style={[
//                   styles.checkbox,
//                   dontKnow && styles.checkboxChecked,
//                 ]}
//               />
//               <Text style={styles.checkText}>
//                 I don’t know — please complete this section with HR assistance.
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* === Save Button === */}
//           <View style={{ alignItems: "center", marginVertical: 12 }}>
//             <TouchableOpacity
//               onPress={handleSave}
//               disabled={isLoading}
//               style={[styles.saveBtn, isLoading && { opacity: 0.7 }]}
//             >
//               {isLoading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.saveBtnText}>Save Insurance</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </View>
//     </PaperProvider>
//   );
// }

// // ===== Styles =====
// const styles = StyleSheet.create({
//   wrapper: { flex: 1, backgroundColor: "#f3f4f6", paddingTop: 14 },
//   header: {
//     height: 110,
//     paddingHorizontal: 12,
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "#e5e7eb",
//   },
//   backButton: { padding: 6, borderRadius: 20, backgroundColor: "#f3f4f6" },
//   headerTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
//   card: {
//     backgroundColor: CARD,
//     marginHorizontal: 12,
//     marginTop: 12,
//     borderRadius: 14,
//     padding: 14,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 6,
//   },
//   label: { fontSize: 13, fontWeight: "600", color: LABEL },
//   selectWrap: { marginBottom: 10 },
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
//     marginTop: 6,
//   },
//   dropdownText: { fontSize: 15, color: TEXT_DARK, flex: 1, marginRight: 8 },
//   dropdownArrow: { color: "#777", fontSize: 16 },
//   portalOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.05)",
//     zIndex: 9999,
//   },
//   dropdownMenu: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: BORDER,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 12,
//     zIndex: 9999,
//     maxHeight: 250,
//   },
//   menuItem: {
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     backgroundColor: "#fff",
//   },
//   menuText: { fontSize: 16, color: TEXT_DARK },
//   imageRow: { flexDirection: "row", gap: 12, marginTop: 8 },
//   imageBox: {
//     flex: 1,
//     height: 140,
//     borderWidth: 1,
//     borderColor: BORDER,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#fafafa",
//   },
//   image: { width: "100%", height: "100%", borderRadius: 10 },
//   imagePlaceholder: { color: "#6b7280", fontWeight: "600" },
//   sectionTitle: { fontSize: 16, fontWeight: "700", color: TEXT_DARK },
//   checkRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: BORDER,
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 10,
//     marginTop: 6,
//   },
//   checkRowActive: { borderColor: "#8b5cf6", backgroundColor: "#ede9fe" },
//   checkbox: {
//     width: 18,
//     height: 18,
//     borderRadius: 4,
//     borderWidth: 2,
//     borderColor: "#a3a3a3",
//     marginRight: 10,
//   },
//   checkboxChecked: { borderColor: "#8b5cf6", backgroundColor: "#8b5cf6" },
//   checkText: { color: TEXT_DARK, flexShrink: 1 },
//   saveBtn: {
//     backgroundColor: "#4f46e5",
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     minWidth: 200,
//     alignItems: "center",
//   },
//   saveBtnText: { color: "#fff", fontWeight: "700" },
// });








import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Provider as PaperProvider, Portal } from "react-native-paper";
import Toast from "react-native-root-toast";

const BASE_API = "https://active-patient.onrender.com";

type Option = { label: string; value: string };
type Dependent = {
  memberID: string;
  firstName: string;
  relationshipType?: string;
  displayName?: string;
};

const INSURANCE_TYPES = ["Medical", "Dental", "Vision"] as const;
const FREQUENCIES = ["Weekly", "Monthly"] as const;

const TEXT_DARK = "#111827";
const PLACEHOLDER = "#4b5563";
const CARD = "#f9fafb";
const BORDER = "#e5e7eb";
const LABEL = "#374151";

const SelectField = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  style,
}: {
  label?: string;
  placeholder?: string;
  value?: string | number;
  options: Option[];
  onChange: (v: string) => void;
  style?: any;
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const ref = React.useRef<View>(null);

  const selectedLabel = useMemo(
    () => options.find((o) => String(o.value) === String(value))?.label,
    [options, value]
  );

  const toggleDropdown = () => {
    if (open) setOpen(false);
    else {
      ref.current?.measureInWindow((x, y, width, height) => {
        setPosition({ x, y, width, height });
        setOpen(true);
      });
    }
  };

  return (
    <>
      <View ref={ref} style={[styles.selectWrap, style]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}

        <TouchableOpacity
          style={styles.dropdownBox}
          activeOpacity={0.8}
          onPress={toggleDropdown}
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
      </View>

      {open && (
        <Portal>
          <TouchableWithoutFeedback onPress={() => setOpen(false)}>
            <View style={styles.portalOverlay}>
              <View
                style={[
                  styles.dropdownMenu,
                  {
                    position: "absolute",
                    top: position.y + position.height,
                    left: position.x,
                    width: position.width,
                  },
                ]}
              >
                {options.length === 0 ? (
                  <Text style={styles.menuText}>No options</Text>
                ) : (
                  options.map((item) => (
                    <TouchableOpacity
                      key={String(item.value)}
                      style={styles.menuItem}
                      onPress={() => {
                        onChange(String(item.value));
                        setOpen(false);
                      }}
                    >
                      <Text style={styles.menuText}>{item.label}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Portal>
      )}
    </>
  );
};

type UploadImageState = {
  uri: string | null;
  name: string | null;
  type: string | null;
  base64?: string | null;
};

export default function AddInsurance() {
  const router = useRouter();
  const { action, memberIds, policyTypes } = useLocalSearchParams<{
    action?: string;
    memberIds?: string;
    policyTypes?: string;
  }>();

  const [title, setTitle] = useState("Add Insurance");
  const [isLoading, setIsLoading] = useState(false);

  const [policyTypeList, setPolicyTypeList] = useState<Option[]>([]);
  const [policyTypeID, setPolicyTypeID] = useState<string>("");

  const [benefitTypeList, setBenefitTypeList] = useState<Option[]>([]);
  const [benefitTypeID, setBenefitTypeID] = useState<string>("");

  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [memberID, setMemberID] = useState<string>("");
  const [subscriberID, setSubscriberID] = useState<string>("");

  const [selectedDependents, setSelectedDependents] = useState<string[]>([]);
  const [isMemberDisabled, setIsMemberDisabled] = useState(false);

  const [frontImg, setFrontImg] = useState<UploadImageState>({
    uri: null,
    name: null,
    type: null,
  });
  const [backImg, setBackImg] = useState<UploadImageState>({
    uri: null,
    name: null,
    type: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [otherPayment, setOtherPayment] = useState("");
  const [coverageTypes, setCoverageTypes] = useState<string[]>([]);
  const [dontKnow, setDontKnow] = useState(false);

  const [employeeContrib, setEmployeeContrib] = useState<
    { type: typeof INSURANCE_TYPES[number]; amount: string; frequency: (typeof FREQUENCIES)[number] }[]
  >(
    INSURANCE_TYPES.map((type) => ({
      type,
      amount: "",
      frequency: FREQUENCIES[0] as (typeof FREQUENCIES)[number],
    }))
  );

  const fetchBenefitTypes = useCallback(async () => {
  try {
    const res = await fetch(`${BASE_API}/api/insurance/GetBenifitType`);
    const data = await res.json();
    console.log("🔹 Benefit types:", data);

    if (Array.isArray(data)) {
      setBenefitTypeList(
        data.map((b: any) => ({
          label: b.type,
          value: String(b.id),
        }))
      );

      // auto-select "Medical" if exists
      const medical = data.find(
        (b: any) => b.type?.toLowerCase() === "medical"
      );
      if (medical) setBenefitTypeID(String(medical.id));
    } else {
      console.warn("⚠️ Invalid response format for benefit types");
    }
  } catch (e) {
    console.error("❌ Benefit types error:", e);
  }
}, []);

useEffect(() => {
  fetchBenefitTypes();
}, [fetchBenefitTypes]);


  const [employerContrib, setEmployerContrib] = useState<
    { type: typeof INSURANCE_TYPES[number]; amount: string; frequency: (typeof FREQUENCIES)[number] }[]
  >(
    INSURANCE_TYPES.map((type) => ({
      type,
      amount: "",
      frequency: FREQUENCIES[0] as (typeof FREQUENCIES)[number],
    }))
  );

  const headerTitle = useMemo(
    () => `${action === "edit" ? "Edit" : "Add"} Insurance`,
    [action]
  );

  const requestMediaPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted" && lib.status !== "granted") {
        Toast.show("Camera or gallery permission is required.", {
          backgroundColor: "#ef4444",
        });
      }
    }
  };

  const pickImage = async (which: "front" | "back") => {
    await requestMediaPermissions();
    Alert.alert("Upload Image", "Choose a source", [
      {
        text: "Camera",
        onPress: async () => {
          const res = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
            quality: 0.8,
          });
          if (!res.canceled) {
            const asset = res.assets[0];
            const payload = {
              uri: asset.uri,
              name: asset.fileName || `${which}-${Date.now()}.jpg`,
              type: asset.mimeType || "image/jpeg",
            };
            which === "front" ? setFrontImg(payload) : setBackImg(payload);
            setErrors((prev) => ({ ...prev, [`${which}Img`]: false }));
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
            quality: 0.8,
          });
          if (!res.canceled) {
            const asset = res.assets[0];
            const payload = {
              uri: asset.uri,
              name: asset.fileName || `${which}-${Date.now()}.jpg`,
              type: asset.mimeType || "image/jpeg",
            };
            which === "front" ? setFrontImg(payload) : setBackImg(payload);
            setErrors((prev) => ({ ...prev, [`${which}Img`]: false }));
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const newErrors: { [key: string]: boolean } = {};

      if (!memberID) newErrors.memberID = true;
      if (!policyTypeID) newErrors.policyTypeID = true;
      if (!benefitTypeID) newErrors.benefitTypeID = true;
      if (!subscriberID) newErrors.subscriberID = true;
      if (selectedDependents.length === 0) newErrors.dependents = true;
      if (!paymentMethod) newErrors.paymentMethod = true;
      if (!frontImg.uri) newErrors.frontImg = true;
      if (!backImg.uri) newErrors.backImg = true;

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        Toast.show("Please fill all required fields.", { backgroundColor: "#ef4444" });
        setIsLoading(false);
        return;
      }

      let frontBase64 = "";
      let backBase64 = "";

      if (frontImg.uri) {
        frontBase64 = await FileSystem.readAsStringAsync(frontImg.uri, {
          encoding: "base64" as any,
        });
      }

      if (backImg.uri) {
        backBase64 = await FileSystem.readAsStringAsync(backImg.uri, {
          encoding: "base64" as any,
        });
      }

      const payload = {
        PolicyTypeID: String(policyTypeID),
        BenefitTypeID: String(benefitTypeID),
        SubscriberID: String(subscriberID),
        MemberID: String(memberID),
        DependentsID: selectedDependents.join(","),
        PaymentMethodId: paymentMethod || "0",
        OtherPaymentMethod: otherPayment,
        CoverageTypeIds: coverageTypes.join(","),
        IsAssistanceRequired: dontKnow ? "1" : "0",
        InsFrontImgBase64: frontBase64,
        InsBackImgBase64: backBase64,
      };

      const token = (await AsyncStorage.getItem("token")) || "";

      const res = await fetch(`${BASE_API}/api/insurance/SaveInsuranceAsync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "Success") {
        Toast.show(data.message || "Policy saved successfully", {
          backgroundColor: "#22c55e",
        });
        setTimeout(() => router.back(), 1000);
      } else {
        Toast.show(data.message || "Failed to save", {
          backgroundColor: "#ef4444",
        });
      }
    } catch (e) {
      console.error("Save error", e);
      Toast.show("Server error while saving policy", { backgroundColor: "#ef4444" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={26} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 28 }}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* === Member Selection === */}
          <View style={styles.card}>
            <SelectField
              label={action === "edit" ? "Edit For" : "Add For"}
              placeholder="Select member"
              value={memberID}
              options={dependents.map((d) => ({
                label: d.displayName || d.firstName,
                value: d.memberID,
              }))}
              onChange={(v) => {
                setMemberID(v);
                setErrors((p) => ({ ...p, memberID: false }));
              }}
              style={[
                isMemberDisabled ? { opacity: 0.6 } : {},
                errors.memberID && { borderColor: "red", borderWidth: 1 },
              ]}
            />
            {errors.memberID && (
              <Text style={styles.errorText}>Please select a member.</Text>
            )}
          </View>

          {/* === Insurance Card Images === */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Insurance Card Images</Text>

            <View style={styles.imageRow}>
              {/* Front Image */}
              <TouchableOpacity
                style={[
                  styles.imageBox,
                  errors.frontImg && { borderColor: "red", borderWidth: 2 },
                ]}
                onPress={() => pickImage("front")}
              >
                {frontImg?.uri || frontImg?.base64 ? (
                  <Image
                    source={{
                      uri: frontImg.uri
                        ? frontImg.uri
                        : `data:image/jpeg;base64,${frontImg.base64}`,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.imagePlaceholder}>+ Front Image</Text>
                )}
              </TouchableOpacity>

              {/* Back Image */}
              <TouchableOpacity
                style={[
                  styles.imageBox,
                  errors.backImg && { borderColor: "red", borderWidth: 2 },
                ]}
                onPress={() => pickImage("back")}
              >
                {backImg?.uri || backImg?.base64 ? (
                  <Image
                    source={{
                      uri: backImg.uri
                        ? backImg.uri
                        : `data:image/jpeg;base64,${backImg.base64}`,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.imagePlaceholder}>+ Back Image</Text>
                )}
              </TouchableOpacity>
            </View>

            {errors.frontImg && (
              <Text style={styles.errorText}>Front image is required.</Text>
            )}
            {errors.backImg && (
              <Text style={styles.errorText}>Back image is required.</Text>
            )}
          </View>

          {/* === Policy Type === */}
          <View style={styles.card}>
            <SelectField
              label="Policy Type"
              placeholder="Select policy type"
              value={policyTypeID}
              options={policyTypeList}
              onChange={(v) => {
                setPolicyTypeID(v);
                setErrors((p) => ({ ...p, policyTypeID: false }));
              }}
              style={errors.policyTypeID && { borderColor: "red", borderWidth: 1 }}
            />
            {errors.policyTypeID && (
              <Text style={styles.errorText}>Please select policy type.</Text>
            )}
          </View>

          {/* === Benefit Type / Subscriber / Dependents === */}
          <View style={styles.card}>
            <SelectField
              label="Benefit Type"
              placeholder="Select benefit type"
              value={benefitTypeID}
              options={benefitTypeList}
              onChange={(v) => {
                setBenefitTypeID(v);
                setErrors((p) => ({ ...p, benefitTypeID: false }));
              }}
              style={errors.benefitTypeID && { borderColor: "red", borderWidth: 1 }}
            />
            {errors.benefitTypeID && (
              <Text style={styles.errorText}>Please select benefit type.</Text>
            )}

            <SelectField
              label="Subscriber"
              placeholder="Select subscriber"
              value={subscriberID}
              options={dependents
                .filter((d) =>
                  ["Self", "Spouse"].includes(d.relationshipType || "")
                )
                .map((d) => ({
                  label: d.displayName || d.firstName,
                  value: d.memberID,
                }))}
              onChange={(v) => {
                setSubscriberID(v);
                setErrors((p) => ({ ...p, subscriberID: false }));
              }}
              style={errors.subscriberID && { borderColor: "red", borderWidth: 1 }}
            />
            {errors.subscriberID && (
              <Text style={styles.errorText}>Please select subscriber.</Text>
            )}

            <Text style={[styles.label, { marginTop: 12 }]}>Dependents</Text>
            <View style={{ rowGap: 8, marginTop: 6 }}>
              {dependents.map((d) => {
                const checked = selectedDependents.includes(d.memberID);
                return (
                  <TouchableOpacity
                    key={d.memberID}
                    onPress={() => {
                      setSelectedDependents((prev) =>
                        prev.includes(d.memberID)
                          ? prev.filter((id) => id !== d.memberID)
                          : [...prev, d.memberID]
                      );
                      setErrors((p) => ({ ...p, dependents: false }));
                    }}
                    style={[
                      styles.checkRow,
                      checked && styles.checkRowActive,
                      errors.dependents && { borderColor: "red", borderWidth: 1 },
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        checked && styles.checkboxChecked,
                      ]}
                    />
                    <Text style={styles.checkText}>
                      {d.displayName || d.firstName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.dependents && (
              <Text style={styles.errorText}>
                Please select at least one dependent.
              </Text>
            )}
          </View>

          {/* === Payment Method === */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Insurance Coverage Questionnaire: Policy Information
            </Text>
            <Text style={[styles.label, { marginTop: 10 }]}>
              Section 1 – Payment Method & Coverage Types
            </Text>
            <Text style={{ marginTop: 6 }}>
              1. Are your insurance premiums paid directly by you or through
              your paycheck?
            </Text>

            {[
              { id: "1", label: "Directly by me" },
              { id: "2", label: "Through my paycheck" },
              { id: "3", label: "Other" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.checkRow,
                  paymentMethod === opt.id && styles.checkRowActive,
                  errors.paymentMethod && { borderColor: "red", borderWidth: 1 },
                ]}
                onPress={() => {
                  setPaymentMethod(opt.id);
                  setErrors((p) => ({ ...p, paymentMethod: false }));
                }}
              >
                <View
                  style={[
                    styles.checkbox,
                    paymentMethod === opt.id && styles.checkboxChecked,
                  ]}
                />
                <Text style={styles.checkText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            {errors.paymentMethod && (
              <Text style={styles.errorText}>Please select a payment method.</Text>
            )}
          </View>

          {/* === Save Button === */}
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              style={[styles.saveBtn, isLoading && { opacity: 0.7 }]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Insurance</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f3f4f6", paddingTop: 14 },
  header: {
    height: 110,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  backButton: { padding: 6, borderRadius: 20, backgroundColor: "#f3f4f6" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  card: {
    backgroundColor: CARD,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 14,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  label: { fontSize: 13, fontWeight: "600", color: LABEL },
  selectWrap: { marginBottom: 10 },
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
    marginTop: 6,
  },
  dropdownText: { fontSize: 15, color: TEXT_DARK, flex: 1, marginRight: 8 },
  dropdownArrow: { color: "#777", fontSize: 16 },
  portalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)",
    zIndex: 9999,
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 9999,
    maxHeight: 250,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 14, backgroundColor: "#fff" },
  menuText: { fontSize: 16, color: TEXT_DARK },
  imageRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  imageBox: {
    flex: 1,
    height: 140,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  imagePlaceholder: { color: "#6b7280", fontWeight: "600" },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: TEXT_DARK },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  checkRowActive: { borderColor: "#8b5cf6", backgroundColor: "#ede9fe" },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#a3a3a3",
    marginRight: 10,
  },
  checkboxChecked: { borderColor: "#8b5cf6", backgroundColor: "#8b5cf6" },
  checkText: { color: TEXT_DARK, flexShrink: 1 },
  saveBtn: {
    backgroundColor: "#4f46e5",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 200,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "700" },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

