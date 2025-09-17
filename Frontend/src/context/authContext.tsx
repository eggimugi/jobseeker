"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthResponse, RegisterData } from "../types/auth";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:8080";

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem("jobseeker_token");
    const savedUser = localStorage.getItem("jobseeker_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const { data } = await axios.post<AuthResponse>(
        `${API_BASE}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Include credentials for cookies
        }
      );

      if (data.success && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("jobseeker_token", data.token);
        localStorage.setItem("jobseeker_user", JSON.stringify(data.user));
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Network error. Please try again.",
      };
    }
  };

  const register = async (
    registerData: RegisterData
  ): Promise<AuthResponse> => {
    try {
      const { data } = await axios.post<AuthResponse>(
        `${API_BASE}/auth/register`,
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          withCredentials: true, // ganti dari fetch `credentials: 'include'`
        }
      );
      return data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Network error. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jobseeker_token");
    localStorage.removeItem("jobseeker_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
