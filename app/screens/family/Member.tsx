import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-root-toast";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Replace these imports with your service API calls
// import { SaveMember, GetRelationshipType, GetZipDatabyCode } from "../../services/api";

export default function MemberScreen({ route }: any) {
  const router = useRouter();
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const [relationship, setRelationship] = useState<any[]>([]);
  const [isPrimaryMem, setIsPrimaryMem] = useState(false);

  const [memberID, setMemberID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("M");
  const [dob, setDob] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [relationshipTypeID, setRelationshipTypeID] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [hasLogin, setHasLogin] = useState(false);
  const [profileUri, setProfileUri] = useState<string | null>(null);

  // 🔹 Load user from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) setUser(JSON.parse(data));
    });

    // Example relationships
    setRelationship([
      { id: 1, type: "Self" },
      { id: 2, type: "Spouse" },
      { id: 3, type: "Child" },
    ]);
  }, []);

  // 🔹 Pick Image (Camera / Gallery)
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileUri(result.assets[0].uri);
    }
  };

  // 🔹 Validate US Mobile Number
  const validatePhone = (value: string) => {
    const phoneRegex = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(value);
  };

  // 🔹 Save Member
  const handleSave = async () => {
    if (!firstName || !lastName || !email) {
      Toast.show("Please fill all required fields", {
        backgroundColor: "#ef4444",
      });
      return;
    }

    if (!validatePhone(mobileNo)) {
      Toast.show("Invalid US phone number", { backgroundColor: "#ef4444" });
      return;
    }

    setIsLoading(true);
    try {
      // const res = await SaveMember({...});
      console.log("Saving Member:", {
        memberID,
        firstName,
        lastName,
        gender,
        dob,
        mobileNo,
        relationshipTypeID,
        email,
        address1,
        address2,
        city,
        state,
        zipCode,
        hasLogin,
        profileUri,
      });

      Toast.show("Member saved successfully!", {
        backgroundColor: "#22c55e",
      });
      setTimeout(() => router.back(), 1500);
    } catch (err) {
      console.error("Save Error:", err);
      Toast.show("Failed to save member", { backgroundColor: "#ef4444" });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Open Camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setProfileUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.header}>Member Details</Text>

      {/* First Name */}
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter first name"
      />

      {/* Last Name */}
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter last name"
      />

      {/* Profile Image */}
      <Text style={styles.label}>Profile Photo</Text>
      {profileUri ? (
        <Image source={{ uri: profileUri }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={{ color: "#999" }}>No photo</Text>
        </View>
      )}
      <View style={styles.imageButtons}>
        <TouchableOpacity style={styles.smallBtn} onPress={pickImage}>
          <Text style={styles.smallBtnText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallBtn} onPress={takePhoto}>
          <Text style={styles.smallBtnText}>Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={gender}
        onValueChange={(v) => setGender(v)}
        style={styles.input}
      >
        <Picker.Item label="Male" value="M" />
        <Picker.Item label="Female" value="F" />
        <Picker.Item label="Other" value="O" />
      </Picker>

      {/* DOB */}
      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={dob}
        onChangeText={setDob}
      />

      {/* Relationship */}
      <Text style={styles.label}>Relationship</Text>
      <Picker
        selectedValue={relationshipTypeID}
        onValueChange={(v) => setRelationshipTypeID(v)}
        style={styles.input}
      >
        <Picker.Item label="-- Choose --" value="" />
        {relationship.map((r) => (
          <Picker.Item key={r.id} label={r.type} value={r.id} />
        ))}
      </Picker>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Enter email"
      />

      {/* Mobile */}
      <Text style={styles.label}>US Mobile #</Text>
      <TextInput
        style={styles.input}
        value={mobileNo}
        onChangeText={setMobileNo}
        placeholder="(555) 555-5555"
        keyboardType="phone-pad"
      />

      {/* Address */}
      <Text style={styles.label}>Address Line 1</Text>
      <TextInput
        style={styles.input}
        value={address1}
        onChangeText={setAddress1}
      />

      <Text style={styles.label}>Address Line 2</Text>
      <TextInput
        style={styles.input}
        value={address2}
        onChangeText={setAddress2}
      />

      <Text style={styles.label}>City</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />

      <Text style={styles.label}>State</Text>
      <TextInput style={styles.input} value={state} onChangeText={setState} />

      <Text style={styles.label}>Zip Code</Text>
      <TextInput
        style={styles.input}
        value={zipCode}
        onChangeText={setZipCode}
        keyboardType="numeric"
      />

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Member</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 12,
    textAlign: "center",
  },
  label: { fontWeight: "500", marginBottom: 4, color: "#111" },
  input: {
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 8,
  },
  avatarPlaceholder: {
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 12,
  },
  smallBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  smallBtnText: { color: "#fff", fontWeight: "600" },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
