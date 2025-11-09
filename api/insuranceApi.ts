import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://active-patient.onrender.com/api/insurance"; // 🔗 ngrok backend URL (replace with Azure URL later)

/**
 * ✅ Fetch all insurance records for a given member
 */
// export async function fetchMemberInsurance(memberId: string) {
//   try {
//     const token = await AsyncStorage.getItem("token");
//     const res = await fetch(`${BASE_URL}/${memberId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) {
//       const msg = await res.text();
//       throw new Error(`Failed to fetch insurance: ${msg}`);
//     }

//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.error("❌ fetchMemberInsurance error:", err);
//     return [];
//   }
// }

export async function fetchMemberInsurance(memberId: string) {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/fetchMemberInsurance/${memberId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Failed to fetch insurance: ${msg}`);
    }

    const data = await res.json();
    return data;  // Returns insurance data for all family members
  } catch (err) {
    console.error("❌ fetchMemberInsurance error:", err);
    return [];
  }
}


/**
 * 🗑️ Delete a member's insurance record
 */
export async function deleteMemberInsurance(memInsID: number) {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/${memInsID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete insurance record");
    }

    return data;
  } catch (err) {
    console.error("❌ deleteMemberInsurance error:", err);
    return { status: "Error", message: (err as Error).message };
  }
}

/**
 * ➕ Add or update member insurance record (for AddInsurance.tsx)
 */
export async function saveMemberInsurance(payload: any) {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to save insurance record");
    }

    return data;
  } catch (err) {
    console.error("❌ saveMemberInsurance error:", err);
    return { status: "Error", message: (err as Error).message };
  }
}
