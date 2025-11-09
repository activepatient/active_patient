import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = Constants.expoConfig?.extra?.API_URL || "http://localhost:5077/api";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await api.post("/auth/refresh", { refreshToken });
          const { token, refreshToken: newRefreshToken } = res.data;
          await AsyncStorage.setItem("authToken", token);
          await AsyncStorage.setItem("refreshToken", newRefreshToken);
          error.config.headers.Authorization = `Bearer ${token}`;
          return api.request(error.config);
        } catch {
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("refreshToken");
        }
      } else {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("refreshToken");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
