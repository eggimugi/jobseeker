import { apiRequest } from "./api";
import { JobPosition, dataResponse } from "@/types/hrd";
import { CompanyProfile, ProfileResponse } from "@/types/profile";

// Api endpoints for managing company profiles
export const companyProfileApi = {
  getCompanyProfileByUser: async (
      userId: number,
      token: string
    ): Promise<ProfileResponse<CompanyProfile>> => {
      return apiRequest(`/company/user/${userId}`, { method: "GET" }, token);
    },
}

// API endpoints for managing job positions
export const jobPositionApi = {
  getJobPositions: async (
    companyId: number,
    token: string
  ): Promise<dataResponse<JobPosition[]>> => {
    return apiRequest(
      `/jobpositions/company/${companyId}`,
      { method: "GET" },
      token
    );
  },
  createJobPosition: async (
    data: Omit<JobPosition, "id" | "createdAt" | "updatedAt" | "companyId">,
    token: string
  ): Promise<dataResponse<JobPosition>> => {
    return apiRequest(
      "/jobpositions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      token
    );
  },
  updateJobPosition: async (
    id: number,
    data: Partial<
      Omit<JobPosition, "id" | "companyId" | "createdAt" | "updatedAt">
    >,
    token: string
  ): Promise<dataResponse<JobPosition>> => {
    return apiRequest(
      `/jobpositions/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
      token
    );
  },
  deleteJobPosition: async (
    id: number,
    token: string
  ): Promise<dataResponse<null>> => {
    return apiRequest(`/jobpositions/${id}`, { method: "DELETE" }, token);
  },
};
