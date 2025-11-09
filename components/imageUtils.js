// import * as ImageManipulator from 'expo-image-manipulator';

// export async function enhanceImage(uri) {
//   try {
//     const manipulatedImage = await ImageManipulator.manipulateAsync(
//       uri,
//       [
//         { rotate: 0 },
//         { contrast: 1.1 },
//         { sharpen: 0.1 },
//         { brightness: 0.05 },
//       ],
//       { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: false }
//     );
//     return manipulatedImage;
//   } catch (error) {
//     console.warn('Image enhancement failed, using original:', error);
//     return { uri };
//   }
// }


import * as FileSystem from "expo-file-system/legacy"; // ✅ safer legacy import for readAsStringAsync
import * as ImageManipulator from "expo-image-manipulator";

/**
 * 🧠 Enhance scanned document clarity before upload or PDF generation
 * - Removes unsupported actions (contrast, brightness, sharpen)
 * - Performs minimal rotation and compression
 * - Returns both enhanced URI and base64 (ready for upload)
 */
export async function enhanceImage(uri) {
  try {
    if (!uri) throw new Error("No image URI provided");

    console.log("🧩 Enhancing image:", uri);

    // ✅ Step 1: Perform minimal safe manipulation (rotation/compression only)
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ rotate: 0 }], // trigger re-encode
      {
        compress: 0.8, // balances size and quality
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    // ✅ Step 2: Convert to base64 for upload
    const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // ✅ Step 3: Return both file URI and base64 string
    return {
      uri: manipulatedImage.uri,
      base64,
    };
  } catch (error) {
    console.warn("⚠️ Image enhancement failed, using original image:", error);

    // 🔁 Fallback: return original image as-is
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return { uri, base64 };
    } catch (fallbackError) {
      console.error("⚠️ Fallback conversion failed:", fallbackError);
      return { uri, base64: null };
    }
  }
}
