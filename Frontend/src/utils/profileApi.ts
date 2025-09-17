import { apiRequest } from "./api";
import {
  CompanyProfile,
  SocietyProfile,
  ProfileResponse,
} from "../types/profile";

export const profileApi = {
  // Company Profile APIs
  getCompanyProfile: async (
    userId: number,
    token: string
  ): Promise<ProfileResponse<CompanyProfile>> => {
    return apiRequest(`/company/user/${userId}`, { method: "GET" }, token);
  },

  createCompanyProfile: async (
    data: Omit<CompanyProfile, "id" | "userId" | "createdAt" | "updatedAt">,
    token: string
  ): Promise<ProfileResponse<CompanyProfile>> => {
    return apiRequest(
      "/company",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    );
  },

  updateCompanyProfile: async (
    id: number,
    data: Partial<CompanyProfile>,
    token: string
  ): Promise<ProfileResponse<CompanyProfile>> => {
    return apiRequest(
      `/company/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token
    );
  },

  // Society Profile APIs
  getSocietyProfile: async (
    userId: number,
    token: string
  ): Promise<ProfileResponse<SocietyProfile>> => {
    return apiRequest(`/society/user/${userId}`, { method: "GET" }, token);
  },

  createSocietyProfile: async (
    data: Omit<SocietyProfile, "id" | "createdAt" | "updatedAt" | "userId">,
    token: string
  ): Promise<ProfileResponse<SocietyProfile>> => {
    return apiRequest(
      "/society",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    );
  },

  updateSocietyProfile: async (
    id: number,
    data: Partial<SocietyProfile>,
    token: string
  ): Promise<ProfileResponse<SocietyProfile>> => {
    return apiRequest(
      `/society/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      token
    );
  },
};
