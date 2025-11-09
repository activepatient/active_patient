

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
// import { addMember, fetchRelationships } from "../../../api/memberApi";
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
//       } else {
//         Toast.show(res.message, { backgroundColor: "#ef4444" });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => router.push("/screens/family/FamilyHub")}
//         >
//           <Text style={styles.cancel}>Cancel</Text>
//         </TouchableOpacity>
//         <Text style={styles.headTitle}>Add Member</Text>
//         <View style={{ width: 60 }} />
//       </View>

//       <ScrollView
//         contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
//         showsVerticalScrollIndicator={false}
//       >
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
//   menuItem: { paddingVertical: 12, paddingHorizontal: 14 },
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
  error,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  options: Option[];
  onChange: (v: string) => void;
  error?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label,
    [options, value]
  );

  return (
    <View style={[styles.selectWrap, error && { borderColor: "red" }]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[
          styles.dropdownBox,
          error && { borderColor: "red", borderWidth: 1.5 },
        ]}
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
      {error && <Text style={styles.errorText}>Required field</Text>}
    </View>
  );
};

const InputField = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  error,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  error?: boolean;
}) => (
  <View style={{ marginBottom: 10 }}>
    <TextInput
      style={[
        styles.input,
        error && { borderColor: "red", borderWidth: 1.5 },
      ]}
      placeholder={placeholder}
      placeholderTextColor="#444"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || "default"}
    />
    {error && <Text style={styles.errorText}>Required field</Text>}
  </View>
);

const DateField = ({
  label,
  placeholder,
  value,
  onChange,
  error,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (v: string) => void;
  error?: boolean;
}) => {
  const [show, setShow] = useState(false);
  const current = value ? new Date(value) : new Date();

  return (
    <View style={{ marginBottom: 10 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[styles.input, error && { borderColor: "red", borderWidth: 1.5 }]}
        activeOpacity={0.8}
        onPress={() => setShow(true)}
      >
        <Text style={{ color: value ? TEXT : PLACEHOLDER, fontSize: 15 }}>
          {value || placeholder || "Select date"}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>Required field</Text>}
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
  error,
}: {
  photoUri: string;
  onPick: (uri: string) => void;
  error?: boolean;
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
      <View
        style={[
          styles.photoCircle,
          error && { borderColor: "red", borderWidth: 2 },
        ]}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <Text style={styles.noPhoto}>No photo</Text>
        )}
      </View>
      {error && <Text style={styles.errorText}>Photo is required</Text>}
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
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
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
    const newErrors: { [key: string]: boolean } = {};
    if (!formData.FirstName) newErrors.FirstName = true;
    if (!formData.LastName) newErrors.LastName = true;
    if (!formData.Gender) newErrors.Gender = true;
    if (!formData.DOB) newErrors.DOB = true;
    if (!formData.RelationshipTypeID) newErrors.RelationshipTypeID = true;
    if (!formData.MemberPhoto) newErrors.MemberPhoto = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Toast.show("Please fill all required fields", {
        backgroundColor: "#ef4444",
      });
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
            onPick={(uri) => {
              setVal("MemberPhoto", uri);
              setErrors((p) => ({ ...p, MemberPhoto: false }));
            }}
            error={errors.MemberPhoto}
          />

          <InputField
            placeholder="First Name *"
            value={formData.FirstName}
            onChangeText={(v) => {
              setVal("FirstName", v);
              setErrors((p) => ({ ...p, FirstName: false }));
            }}
            error={errors.FirstName}
          />
          <InputField
            placeholder="Last Name *"
            value={formData.LastName}
            onChangeText={(v) => {
              setVal("LastName", v);
              setErrors((p) => ({ ...p, LastName: false }));
            }}
            error={errors.LastName}
          />
          <SelectField
            label="Gender"
            placeholder="Select..."
            options={genderOpts}
            value={formData.Gender}
            onChange={(v) => {
              setVal("Gender", v);
              setErrors((p) => ({ ...p, Gender: false }));
            }}
            error={errors.Gender}
          />
          <DateField
            label="Date of Birth"
            placeholder="(YYYY-MM-DD)"
            value={formData.DOB}
            onChange={(v) => {
              setVal("DOB", v);
              setErrors((p) => ({ ...p, DOB: false }));
            }}
            error={errors.DOB}
          />
          <SelectField
            label="Relationship"
            placeholder="Select..."
            options={relOpts}
            value={formData.RelationshipTypeID}
            onChange={(v) => {
              setVal("RelationshipTypeID", v);
              setErrors((p) => ({ ...p, RelationshipTypeID: false }));
            }}
            error={errors.RelationshipTypeID}
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
  errorText: { color: "red", fontSize: 12, marginTop: -4, marginBottom: 8 },
});
