import { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["users/me"],
    queryFn: () => apiClient.get("/users/me").then(res => res.data),
    retry: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const logout = async () => {
    try {
      await apiClient.post("/logout");
      queryClient.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};