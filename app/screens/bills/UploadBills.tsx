import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { PDFDocument } from "pdf-lib";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { uploadBill } from "../../../api/billsApi";
import { useAuth } from "../../../components/authContext";
import Footer from "../../../components/Footer";

export default function UploadBills() {
  const { user } = useAuth();
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // 📸 Pick multiple images
  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show("Permission denied", { backgroundColor: "#ef4444" });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      setSelectedImages((prev) => [...prev, ...result.assets]);
      setPdfUri(null);
    }
  };

  // 📄 Pick single PDF
  const pickPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setPdfUri(uri);
      setSelectedImages([]);
    }
  };

  // 🧩 Merge multiple images into a single PDF
const mergeImagesToPDF = async () => {
  if (selectedImages.length === 0) return null;

  try {
    const pdfDoc = await PDFDocument.create();

    for (const img of selectedImages) {
      const bytes = await FileSystem.readAsStringAsync(img.uri, {
        encoding: "base64" as const,
      });

      const imageBytes = Uint8Array.from(atob(bytes), (c) => c.charCodeAt(0));
      const pdfImage = img.uri.endsWith(".png")
        ? await pdfDoc.embedPng(imageBytes)
        : await pdfDoc.embedJpg(imageBytes);

      const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
      page.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: pdfImage.width,
        height: pdfImage.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

const dir =
  (FileSystem as any).cacheDirectory ||
  (FileSystem as any).documentDirectory ||
  "";
    const fileUri = dir + "merged.pdf";

    await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
      encoding: "base64" as const,
    });

    setPdfUri(fileUri);
    return pdfBase64;
  } catch (err) {
    console.error("❌ Error merging PDF:", err);
    Toast.show("Failed to merge images into PDF", { backgroundColor: "#ef4444" });
    return null;
  }
};


  // 👁️ View PDF Preview
  const handlePreview = async () => {
    if (!pdfUri && selectedImages.length > 0) {
      await mergeImagesToPDF();
    }
    if (pdfUri || selectedImages.length > 0) setShowPreview(true);
    else Toast.show("Please select photos or PDF first", { backgroundColor: "#ef4444" });
  };

  // 🚀 Upload final PDF
  const handleUpload = async () => {
    try {
      setIsUploading(true);
      let pdfBase64 = "";

      if (pdfUri) {
       pdfBase64 = await FileSystem.readAsStringAsync(pdfUri, {
        encoding: "base64" as any,
        });
      } else if (selectedImages.length > 0) {
        const mergedBase64 = await mergeImagesToPDF();
        if (mergedBase64) pdfBase64 = mergedBase64;
      } else {
        Toast.show("Please select photos or PDF first", { backgroundColor: "#ef4444" });
        return;
      }

      if (!pdfBase64) return;

      const payload = {
        MemberID: user?.Mid,
        BillDate: new Date().toISOString().split("T")[0],
        FileType: "PDF",
        BillFile: `data:application/pdf;base64,${pdfBase64}`,
        AddedBy: user?.username || "System",
      };

      const res = await uploadBill(payload);

      if (res.status === "Success") {
        Toast.show("Bill uploaded successfully", { backgroundColor: "#22c55e" });
        setSelectedImages([]);
        setPdfUri(null);
      } else {
        Toast.show(res.message, { backgroundColor: "#ef4444" });
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      Toast.show("Upload failed", { backgroundColor: "#ef4444" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📤 Upload Bills</Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.pickButton} onPress={pickImages}>
            <Text style={styles.buttonText}>Select Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pickButton} onPress={pickPDF}>
            <Text style={styles.buttonText}>Select PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Files Preview */}
        {selectedImages.length > 0 && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Selected Photos ({selectedImages.length})</Text>
            <ScrollView horizontal>
              {selectedImages.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img.uri }}
                  style={styles.previewImage}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {pdfUri && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>PDF Selected ✅</Text>
            <Text style={styles.pdfName}>{pdfUri.split("/").pop()}</Text>

            <TouchableOpacity style={styles.previewBtn} onPress={handlePreview}>
              <Text style={styles.previewBtnText}>👁️ View PDF</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Upload Button */}
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadText}>Upload Bill</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* PDF Viewer Modal */}
      <Modal visible={showPreview} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <View style={styles.previewHeader}>
            <TouchableOpacity onPress={() => setShowPreview(false)}>
              <Text style={styles.closeText}>✖ Close</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Preview</Text>
          </View>

          {pdfUri ? (
            <WebView
              source={{ uri: pdfUri }}
              style={{ flex: 1 }}
              javaScriptEnabled
              domStorageEnabled
              scalesPageToFit
            />
          ) : (
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
              No PDF available
            </Text>
          )}
        </SafeAreaView>
      </Modal>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9fafb" },
  container: { padding: 20, paddingBottom: 120 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#2563eb",
    marginBottom: 20,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-around" },
  pickButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    minWidth: 140,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  previewContainer: { marginTop: 20 },
  previewTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  previewImage: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
  },
  pdfName: { color: "#374151", fontStyle: "italic" },
  previewBtn: {
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  previewBtnText: { color: "#fff", fontWeight: "600" },
  uploadBtn: {
    marginTop: 30,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111",
    padding: 10,
  },
  closeText: { color: "#f87171", fontSize: 16 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
