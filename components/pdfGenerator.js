import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy"; // ✅ use legacy import to avoid deprecation warning
import * as Print from "expo-print";
import { generateFilename } from "./helpers";

// 🌐 Your live backend API
const BASE_API = "https://766f0faf6c11.ngrok-free.app"; // 🔄 Update this if ngrok regenerates

/**
 * 🔄 Convert local image URI to base64
 */
async function convertToBase64(uri) {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (err) {
    console.error("❌ Base64 Conversion Error:", err);
    return null;
  }
}

/**
 * 🧾 Generate PDF from captured images and upload them to backend
 */
export async function generatePDF(images, filename = "document") {
  try {
    if (!images || !images.length) throw new Error("No images provided");

    console.log(`🧩 Starting PDF generation for ${images.length} image(s)...`);

    // 🧠 Save scanned images locally for future reference
    await AsyncStorage.setItem("last_scanned_images", JSON.stringify(images));

    // 📤 Upload all images (converted to base64)
    const base64Images = [];
    for (const img of images) {
      const base64 = await convertToBase64(img.uri);
      if (base64) {
        base64Images.push({ uri: img.uri, base64 });

        try {
          await fetch(`${BASE_API}/api/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: generateFilename("scan") + ".jpg",
              imageBase64: base64,
            }),
          });
          console.log(`✅ Uploaded image successfully: ${img.uri}`);
        } catch (uploadErr) {
          console.warn("⚠️ Upload failed for:", img.uri, uploadErr);
        }
      } else {
        console.warn("⚠️ Skipping image (base64 conversion failed):", img.uri);
      }
    }

    // 💡 Build the HTML template for PDF
    const html = `
      <html>
        <body style="margin:0;padding:0;">
          ${base64Images
            .map(
              (img) => `
                <div style="page-break-after: always;">
                  <img src="data:image/jpeg;base64,${img.base64}" style="width:100%;margin-bottom:20px;" />
                </div>
              `
            )
            .join("")}
        </body>
      </html>
    `;

    // 🧾 Generate PDF file
    const { uri } = await Print.printToFileAsync({ html });
    const pdfFilename = `${generateFilename(filename)}.pdf`;
    const pdfPath = `${FileSystem.documentDirectory}${pdfFilename}`;

    // ✅ Use legacy API safely
    await FileSystem.copyAsync({ from: uri, to: pdfPath });

    // 🧹 Optional cleanup
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch (cleanupErr) {
      console.warn("🧹 Cleanup warning:", cleanupErr);
    }

    console.log(`📄 PDF generated successfully: ${pdfPath}`);

    // ✅ Return metadata
    return {
      uri: pdfPath,
      filename: pdfFilename,
      pageCount: base64Images.length,
    };
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}
