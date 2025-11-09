import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<any>(null);

const defaultPermissions = {
  isViewDashboard: false,
  isViewMemberPotal: false,
  isViewUserManagement: false,
  isAccessReport: false,
  isGeneateBillReview: false,
  isGenerateComplexCaseReports: false,
  isAccessSystemSettings: false,
  isAccessRoleManagement: false,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load session on app start
  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem('authUser');
        const savedToken = await AsyncStorage.getItem('token');
        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        }
      } catch (err) {
        console.log('Auth load error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rolePermission = user?.rolePermission ?? defaultPermissions;

  const canViewDashboard = !!rolePermission.isViewDashboard;
  const canViewMemberPortal = !!rolePermission.isViewMemberPotal;
  const canViewUserManagement = !!rolePermission.isViewUserManagement;
  const canAccessReports = !!rolePermission.isAccessReport;
  const canGenerateBillReview = !!rolePermission.isGeneateBillReview;
  const canGenerateComplexCaseReports = !!rolePermission.isGenerateComplexCaseReports;
  const canAccessSystemSettings = !!rolePermission.isAccessSystemSettings;
  const canAccessRoleManagement = !!rolePermission.isAccessRoleManagement;

  // ✅ Login: Save both token and user
  const login = async (userData: any, userToken: string) => {
    try {
      await AsyncStorage.setItem('authUser', JSON.stringify(userData));
      await AsyncStorage.setItem('token', userToken);
      setUser(userData);
      setToken(userToken);
    } catch (err) {
      console.log('Auth save error', err);
    }
  };

  // ✅ Logout: Clear everything
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authUser');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('profilephoto');
      setUser(null);
      setToken(null);
    } catch (err) {
      console.log('Auth logout error', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        rolePermission,
        canViewDashboard,
        canViewMemberPortal,
        canViewUserManagement,
        canAccessReports,
        canGenerateBillReview,
        canGenerateComplexCaseReports,
        canAccessSystemSettings,
        canAccessRoleManagement,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
