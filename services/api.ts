import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// API URL from Expo config or fallback
const API_URL = "https://active-patient.onrender.com/api";
console.log("✅ Loaded API Base URL:", API_URL);

// Auth token helpers
const getToken = async () => await AsyncStorage.getItem("authToken");
const getRefreshToken = async () => await AsyncStorage.getItem("refreshToken");
const setToken = async (token: string, refreshToken?: string) => {
  await AsyncStorage.setItem("authToken", token);
  if (refreshToken) await AsyncStorage.setItem("refreshToken", refreshToken);
};
const clearTokens = async () => {
  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("refreshToken");
};

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptors
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        try {
          const res = await api.post("/auth/refresh", { refreshToken });
          const { token, refreshToken: newRefreshToken } = res.data;
          await setToken(token, newRefreshToken);
          error.config.headers.Authorization = `Bearer ${token}`;
          return api.request(error.config);
        } catch {
          await clearTokens();
        }
      } else {
        await clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

// === API Functions ===

export const getImageBaseUrl = (profilepic: string) => `${API_URL}/Users/photo/${profilepic}`;

export async function loginAPI(data: any) {
  const res = await fetch(`${API_URL}/Users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function register(data: any) {
  const res = await fetch(`${API_URL}/Users/Register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return { status: response.status, message: response.message };
}

export async function SaveMember(data: any) {
  const res = await fetch(`${API_URL}/Users/SaveMember`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return { status: response.status, message: response.message, memberID: response.memberID };
}

export async function GetMemberInsuranceByMemberID(data: any) {
  try {
    const res = await fetch(`${API_URL}/Users/GetMemberInsuranceByMemberID?MemberID=${data}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export async function GetMemberInsuranceById(data: any) {
  const res = await fetch(`${API_URL}/Users/GetMemberInsuranceById?MemInsID=${data}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
}

export async function DeleteMemeberInsurance(deleteMemInsId: any, memberId: any) {
  try {
    const res = await fetch(
      `${API_URL}/Users/DeleteMemberInsurance?MemberInsuranceId=${deleteMemInsId}&memberId=${memberId}`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );
    return await res.json();
  } catch (err) {
    return { message: "Error in Delete Member Insurance API" };
  }
}

export async function ChangePasswordAPI(data: any) {
  const res = await fetch(`${API_URL}/Users/ChangePassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function forgotPassword(data: any) {
  try {
    const res = await fetch(`${API_URL}/Users/ForgotPassword?email=${data.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (err) {
    return { message: "Failed to send reset password email. Please try again." };
  }
}

export async function VerifyTokenAPI(data: any) {
  try {
    const endpoint = data.IsMobile === "1" ? "Verify-Mobile" : "Verify-Email";
    const res = await fetch(`${API_URL}/Users/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (!res.ok) return { status: "Error", message: "Token verification failed." };
    return { status: response.status, message: response.message };
  } catch {
    return { status: "Error", message: "Token verification failed." };
  }
}

export async function GetRelationshipType() {
  const res = await fetch(`${API_URL}/Users/GetCodeType?codeType=Relationship`);
  return await res.json();
}
export async function GetBenifitType() {
  const res = await fetch(`${API_URL}/Users/GetCodeType?codeType=BenefitType`);
  return await res.json();
}
export async function GetUserRole() {
  const res = await fetch(`${API_URL}/Users/GetUserRole`);
  return await res.json();
}
export async function GetRolePermissionByRoleId(roleId: any) {
  const res = await fetch(`${API_URL}/Users/GetRolePermissionByRoleId?roleId=${roleId}`);
  return await res.json();
}
export async function SaveRolePermission(data: any) {
  const res = await fetch(`${API_URL}/Users/SaveRolePermissionAsync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}
export async function SaveRole(id: any, type: any, isActive: any) {
  try {
    const res = await fetch(
      `${API_URL}/Users/SaveRoleAsync?id=${id}&type=${type}&isActive=${isActive}`,
      { method: "POST", headers: { "Content-Type": "application/json" } }
    );
    return await res.json();
  } catch (err) {
    return { message: "Error in Save Role API" };
  }
}
export async function GetPolicyType() {
  const res = await fetch(`${API_URL}/Users/GetCodeType?codeType=PolicyType`);
  return await res.json();
}
export async function GetDistinctState() {
  const res = await fetch(`${API_URL}/Users/GetDistinctState`);
  return await res.json();
}
export async function GetDistinctZipbyState(data: any) {
  const res = await fetch(`${API_URL}/Users/GetDistinctZipbyState?State=${data}`);
  return await res.json();
}
export async function GetZipDatabyCode(data: any) {
  const res = await fetch(`${API_URL}/Users/GetZipDatabyCode?zipcode=${data}`);
  return await res.json();
}
export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/Users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}
export async function GetFamilyDepedentFormattedData(token: string) {
  const res = await fetch(`${API_URL}/Users/GetFamilyDepedentFormattedData`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}
export async function GetFamilyDepedent(token: string) {
  const res = await fetch(`${API_URL}/Users/GetFamilyDepedent`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}
export async function GetMemberById(data: any) {
  const res = await fetch(`${API_URL}/Users/GetMemberById?memberId=${data}`);
  return await res.json();
}
export async function uploadfile(formData: any) {
  try {
    const response = await api.post("/Users/Uploadfile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function DeleteMemeber(data: any) {
  try {
    const res = await fetch(`${API_URL}/Users/DeleteMember?MemberId=${data}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (err) {
    return { message: "Error in DeleteMember API" };
  }
}
export async function UpdatePasswordLinkShow(data: any) {
  try {
    const res = await fetch(`${API_URL}/Users/UpdatePasswordLinkShow?userID=${data}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (err) {
    return { message: "Error in UpdatePasswordLinkShow API" };
  }
}

// Export axios instance for direct axios calls
export default api;
