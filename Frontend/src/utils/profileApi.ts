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
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("phone", data.phone);
    formData.append("description", data.description);

    if (data.website) formData.append("website", data.website);
    if (data.foundedYear)
      formData.append("foundedYear", data.foundedYear.toString());
    if (data.industry) formData.append("industry", data.industry);
    if (data.companySize) formData.append("companySize", data.companySize);
    if (data.logo) formData.append("logo", data.logo as File);

    console.log([...formData.entries()]);

    return apiRequest(
      "/company",
      {
        method: "POST",
        body: formData,
      },
      token
    );
  },

  updateCompanyProfile: async (
    id: number,
    data: Partial<CompanyProfile>,
    token: string
  ): Promise<ProfileResponse<CompanyProfile>> => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.address) formData.append("address", data.address);
    if (data.phone) formData.append("phone", data.phone);
    if (data.description) formData.append("description", data.description);

    if (data.website) formData.append("website", data.website);
    if (data.foundedYear)
      formData.append("foundedYear", data.foundedYear.toString());
    if (data.industry) formData.append("industry", data.industry);
    if (data.companySize) formData.append("companySize", data.companySize);
    if (data.logo && data.logo instanceof File) {
      formData.append("logo", data.logo);
    }
    return apiRequest(
      `/company/${id}`,
      {
        method: "PUT",
        body: formData,
      },
      token
    );
  },

  // Society Profile APIs
  getSocietyProfile: async (
    token: string
  ): Promise<ProfileResponse<SocietyProfile>> => {
    return apiRequest(`/society/user/`, { method: "GET" }, token);
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
