import { apiRequest } from "./api";
import { Application, JobPosition, dataResponse } from "@/types/hrd";
import { CompanyProfile, ProfileResponse } from "@/types/profile";

// Api endpoints for managing company profiles
export const companyProfileApi = {
  getCompanyProfileByUser: async (
    userId: number,
    token: string
  ): Promise<ProfileResponse<CompanyProfile>> => {
    return apiRequest(`/company/user/${userId}`, { method: "GET" }, token);
  },
};

// API endpoints for managing job positions
export const jobPositionApi = {
  getJobPositions: async (
    token: string
  ): Promise<dataResponse<JobPosition[]>> => {
    return apiRequest(`/availablePosition`, { method: "GET" }, token);
  },
  getAllJobPositions: async (
    token: string
  ): Promise<dataResponse<JobPosition[]>> => {
    return apiRequest(`/availablePosition/all`, { method: "GET" }, token);
  },
  createJobPosition: async (
    data: Omit<JobPosition, "id" | "createdAt" | "updatedAt" | "companyId">,
    token: string
  ): Promise<dataResponse<JobPosition>> => {
    return apiRequest(
      "/availablePosition",
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
      `/availablePosition/${id}`,
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
    return apiRequest(`/availablePosition/${id}`, { method: "DELETE" }, token);
  },
};

// API endpoints for managing applications to job positions
export const applicationApi = {
  getApplications: async (
    token: string
  ): Promise<dataResponse<Application[]>> => {
    return apiRequest(`/positionApplied/company`, { method: "GET" }, token);
  },
  updateApplicationStatus: async (
    id: number,
    status: string,
    token: string
  ): Promise<dataResponse<Application>> => {
    return apiRequest(
      `/positionApplied/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      },
      token
    );
  },
};
