import AsyncStorage from "@react-native-async-storage/async-storage";

// 🌐 Update this to your actual backend route
const BASE_URL = "https://active-patient.onrender.com/api/member/bills/upload";

export interface BillUploadPayload {
  MemberID: number;
  BillDate: string;
  FileType: string;        // "PDF" or "IMAGE"
  BillFile: string;        // base64 string
  AddedBy?: string;
}

/**
 * 📤 Upload Bill (Base64 JSON Mode)
 */
export async function uploadBill(payload: BillUploadPayload) {
  try {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");

    return data;
  } catch (err) {
    console.error("❌ uploadBill error:", err);
    return { status: "Error", message: (err as Error).message };
  }
}

/**
 * 📥 Fetch Bills by Member
 */
export async function getBillsByMember(memberId: number) {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(
      `https://active-patient.onrender.com/api/member/bills/${memberId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Fetch failed");
    return data;
  } catch (err) {
    console.error("❌ getBillsByMember error:", err);
    return { status: "Error", message: (err as Error).message };
  }
}
