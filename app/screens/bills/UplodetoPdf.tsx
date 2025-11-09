
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import * as Sharing from "expo-sharing";
// import { useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Image,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import DocumentScanner from "react-native-document-scanner-plugin";
// import { generateFilename } from "../../../components/helpers";
// import { enhanceImage } from "../../../components/imageUtils";
// import { generatePDF } from "../../../components/pdfGenerator";

// export default function SmartScanner() {
//   const router = useRouter();
//   const [scannedImages, setScannedImages] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);

//   // 🌐 Backend API base URL
//   const BASE_API = "https://766f0faf6c11.ngrok-free.app";

//   // 📸 Scan one or more documents
//   const scanDocument = async () => {
//     try {
//       const { scannedImages: newImages } = await (DocumentScanner as any).scanDocument({
//         maxNumDocuments: 10, // ✅ allow multiple scans
//         croppedImageQuality: 95,
//         responseType: "uri",
//       });

//       if (newImages && newImages.length > 0) {
//         const updated = [...scannedImages, ...newImages];
//         setScannedImages(updated);
//         Alert.alert("✅ Scan complete", `${newImages.length} page(s) added successfully.`);
//       } else {
//         Alert.alert("No document detected");
//       }
//     } catch (error: any) {
//       Alert.alert("Scan failed", error.message);
//     }
//   };

//   // 🧾 Enhance, upload all, and generate PDF
//   const sharePDF = async () => {
//     if (scannedImages.length === 0) {
//       Alert.alert("No pages", "Please scan at least one document.");
//       return;
//     }

//     try {
//       setLoading(true);
//       Alert.alert("⏳ Processing", "Enhancing and uploading your scanned pages...");

//       // Enhance each image
//       const enhancedImages = [];
//       for (const uri of scannedImages) {
//         console.log("🧩 Enhancing image:", uri);
//         const enhanced = await enhanceImage(uri);
//         enhancedImages.push(enhanced);

//         // 📤 Upload each enhanced image
//         try {
//           await fetch(`${BASE_API}/api/upload`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               fileName: generateFilename("scan") + ".jpg",
//               imageBase64: enhanced.base64,
//             }),
//           });
//           console.log(`✅ Uploaded enhanced image: ${uri}`);
//         } catch (err) {
//           console.warn("⚠️ Upload failed for", uri, err);
//         }
//       }

//       // 🧱 Generate a single PDF with all pages
//       const pdf = await generatePDF(enhancedImages, "scanned_document");

//       // 📤 Share the generated PDF
//       await Sharing.shareAsync(pdf.uri);
//     } catch (error: any) {
//       console.error("PDF Error:", error);
//       Alert.alert("Error", "Failed to generate PDF");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔙 Logout or Back handler
//   const handleBackToLogin = async () => {
//     await AsyncStorage.removeItem("userData");
//     router.replace("/screens/login");
//   };

//   return (
//     <View style={styles.container}>
//       {/* 🔙 Back Button */}
//       <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
//         <Text style={styles.backButtonText}>← Back to Login</Text>
//       </TouchableOpacity>

//       <Text style={styles.title}>📄 Smart Document Scanner</Text>

//       {/* 🖼️ Show all scanned images */}
//       {scannedImages.length > 0 && (
//         <FlatList
//           data={scannedImages}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <Image
//               source={{ uri: item }}
//               style={styles.preview}
//             />
//           )}
//           style={{ marginBottom: 20 }}
//         />
//       )}

//       <TouchableOpacity style={styles.button} onPress={scanDocument} disabled={loading}>
//         <Text style={styles.buttonText}>📷 Scan Document(s)</Text>
//       </TouchableOpacity>

//       {scannedImages.length > 0 && (
//         <TouchableOpacity style={styles.button} onPress={sharePDF} disabled={loading}>
//           <Text style={styles.buttonText}>📄 Generate & Share PDF ({scannedImages.length} pages)</Text>
//         </TouchableOpacity>
//       )}

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
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
//   title: { fontSize: 22, fontWeight: "700", marginBottom: 20, marginTop: 60 },
//   preview: {
//     width: 200,
//     height: 300,
//     borderRadius: 10,
//     marginHorizontal: 10,
//     borderWidth: 2,
//     borderColor: "#007aff",
//   },
//   button: {
//     backgroundColor: "#007aff",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 10,
//     width: "80%",
//     alignItems: "center",
//   },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
//   overlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: { color: "#fff", marginTop: 10, fontSize: 16 },
//   backButton: {
//     position: "absolute",
//     top: 40,
//     left: 20,
//     backgroundColor: "#007aff",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   backButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
// });






// import * as DocumentPicker from "expo-document-picker";
// import { useRouter } from "expo-router";
// import * as Sharing from "expo-sharing";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DocumentScanner from "react-native-document-scanner-plugin";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { generateFilename } from "../../../components/helpers";
// import { enhanceImage } from "../../../components/imageUtils";
// import { generatePDF } from "../../../components/pdfGenerator";

// export default function UplodetoPdf() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets(); // 👈 ensures bottom padding for immersive nav

//   const [scannedPDF, setScannedPDF] = useState<any>(null);
//   const [uploadedImage, setUploadedImage] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const BASE_API = "https://766f0faf6c11.ngrok-free.app";

//   // 📸 Open camera → scan document
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
//         Alert.alert("✅ Document scanned", "PDF created successfully.");
//       } else {
//         Alert.alert("No document detected");
//       }
//     } catch (err: any) {
//       Alert.alert("Scan Error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📂 Choose image (only one)
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

//       Alert.alert("✅ File selected", `${file.name} added successfully.`);
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Error", "Unable to pick file.");
//     }
//   };

//   // 📤 Share the PDF (optional)
//   const handleShare = async (uri: string) => {
//     await Sharing.shareAsync(uri);
//   };

//   // 🔙 Handle back button
//   const handleBack = () => {
//     router.back(); // Navigates to previous screen
//   };

//   return (
//     <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
//       {/* Header */}
//       <View style={styles.headerRow}>
//         <TouchableOpacity onPress={handleBack}>
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Upload Document</Text>
//       </View>

//       {/* Options */}
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

//         <TouchableOpacity style={styles.optionCard}>
//           <Image
//             source={require("../../../assets/icons/cloud.png")}
//             style={styles.icon}
//           />
//           <Text style={styles.optionText}>Cloud</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Selected Files Section */}
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

//       {/* Upload button */}
//       {(scannedPDF || uploadedImage) && (
//         <TouchableOpacity
//           style={[
//             styles.uploadButton,
//             Platform.OS === "android" && { marginBottom: insets.bottom + 10 },
//           ]}
//         >
//           <Text style={styles.uploadText}>
//             Upload {scannedPDF && uploadedImage ? "2 Files" : "1 File"}
//           </Text>
//         </TouchableOpacity>
//       )}

//       {/* Loading Overlay */}
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
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
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


import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { generateFilename } from "../../../components/helpers";
import { enhanceImage } from "../../../components/imageUtils";
import { generatePDF } from "../../../components/pdfGenerator";

export default function UplodetoPdf() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [scannedPDF, setScannedPDF] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  // 📸 Scan document
  const handleScanDocument = async () => {
    try {
      setLoading(true);
      const { scannedImages } = await (DocumentScanner as any).scanDocument({
        maxNumDocuments: 5,
        croppedImageQuality: 95,
        responseType: "uri",
      });

      if (scannedImages && scannedImages.length > 0) {
        const enhancedImages = [];
        for (const uri of scannedImages) {
          const enhanced = await enhanceImage(uri);
          enhancedImages.push(enhanced);
        }

        const pdf = await generatePDF(enhancedImages, generateFilename("scan"));
        setScannedPDF({
          name: generateFilename("scan") + ".pdf",
          uri: pdf.uri,
        });
        Alert.alert("✅ Document Scanned", "PDF created successfully.");
      } else {
        Alert.alert("No document detected");
      }
    } catch (err: any) {
      Alert.alert("Scan Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 📂 Pick image
  const handleSelectImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setUploadedImage({
        name: file.name,
        uri: file.uri,
        type: file.mimeType,
      });

      Alert.alert("✅ File Selected", `${file.name} added successfully.`);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to pick file.");
    }
  };

  // 📤 Share file
  const handleShare = async (uri: string) => {
    await Sharing.shareAsync(uri);
  };

  // ✅ Simulate Upload Success
  const handleUpload = () => {
    setSuccessVisible(true);
    setTimeout(() => {
      setSuccessVisible(false);
      // ✅ Redirect back to Bills screen after upload success
      router.push("/screens/bills/bills");
    }, 2000);
  };

  // 🔙 Back button → Go to Bills screen
  const handleBack = () => {
    router.push("/screens/bills/bills");
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={26} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Document</Text>
      </View>

      {/* Options */}
      <View style={styles.optionRow}>
        <TouchableOpacity style={styles.optionCard} onPress={handleScanDocument}>
          <Ionicons name="camera-outline" size={28} color="#4f46e5" />
          <Text style={styles.optionText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={handleSelectImage}>
          <Ionicons name="image-outline" size={28} color="#4f46e5" />
          <Text style={styles.optionText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard}>
          <Ionicons name="cloud-upload-outline" size={28} color="#4f46e5" />
          <Text style={styles.optionText}>Cloud</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Files */}
      <Text style={styles.sectionTitle}>SELECTED FILES</Text>

      {scannedPDF && (
        <TouchableOpacity
          style={styles.fileItem}
          onPress={() => handleShare(scannedPDF.uri)}
        >
          <Ionicons name="document-text-outline" size={22} color="#4f46e5" />
          <Text style={styles.fileName}>{scannedPDF.name}</Text>
        </TouchableOpacity>
      )}

      {uploadedImage && (
        <TouchableOpacity
          style={styles.fileItem}
          onPress={() => handleShare(uploadedImage.uri)}
        >
          <Ionicons name="image-outline" size={22} color="#4f46e5" />
          <Text style={styles.fileName}>{uploadedImage.name}</Text>
        </TouchableOpacity>
      )}

      {/* Upload Button */}
      {(scannedPDF || uploadedImage) && (
        <TouchableOpacity
          style={[
            styles.uploadButton,
            Platform.OS === "android" && { marginBottom: insets.bottom + 10 },
          ]}
          onPress={handleUpload}
        >
          <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
          <Text style={styles.uploadText}>
            Upload {scannedPDF && uploadedImage ? "2 Files" : "1 File"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Loader */}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      {/* ✅ Success Modal */}
      <Modal visible={successVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={70} color="#22c55e" />
            <Text style={styles.successText}>Upload Successful!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 50 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginRight: 30,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  optionCard: {
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 20,
    width: "28%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  optionText: { color: "#111", fontWeight: "600", marginTop: 8 },
  sectionTitle: {
    marginTop: 10,
    fontWeight: "700",
    color: "#444",
    fontSize: 14,
    marginBottom: 8,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 8,
  },
  fileName: { color: "#111", fontSize: 15, flexShrink: 1 },
  uploadButton: {
    backgroundColor: "#4f46e5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 15,
    marginTop: 20,
    gap: 8,
  },
  uploadText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#fff", fontSize: 16, marginTop: 8 },
  successBox: {
    backgroundColor: "#ecfdf5",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    color: "#15803d",
    fontWeight: "700",
    marginTop: 10,
  },
});
