import { apiRequest } from "./api";
import {
  Portofolio,
  PortofolioResponse,
  dataResponse,
  AvailablePosition,
} from "@/types/society";
import { SocietyProfile, ProfileResponse } from "@/types/profile";

// API endpoints for managing society profiles
export const societyApi = {
  getSocietiesByUser: async (
    userId: number,
    token: string
  ): Promise<ProfileResponse<SocietyProfile | null>> => {
    return apiRequest(`/society/user/${userId}`, { method: "GET" }, token);
  },
};

// API endpoints for managing society portfolios
export const portofolioApi = {
  getPortofolios: async (
    societyId: number,
    token: string
  ): Promise<PortofolioResponse<Portofolio>> => {
    return apiRequest(`/portofolio/${societyId}`, { method: "GET" }, token);
  },
  createPortofolio: async (
    data: Omit<Portofolio, "id" | "createdAt" | "updatedAt">,
    token: string
  ): Promise<PortofolioResponse<Portofolio>> => {
    const formData = new FormData();
    formData.append("skill", data.skill);
    formData.append("description", data.description);
    formData.append("file", data.file as File);

    return apiRequest(
      "/portofolio",
      {
        method: "POST",
        body: formData,
      },
      token
    );
  },
  updatePortofolio: async (
    id: number,
    data: Partial<
      Omit<Portofolio, "id" | "societyId" | "createdAt" | "updatedAt">
    >,
    token: string
  ): Promise<PortofolioResponse<Portofolio>> => {
    const formData = new FormData();
    if (data.skill) formData.append("skill", data.skill);
    if (data.description) formData.append("description", data.description);
    if (data.file) formData.append("file", data.file);
    return apiRequest(
      `/portofolio/${id}`,
      {
        method: "PUT",
        body: formData,
      },
      token
    );
  },
  deletePortofolio: async (
    id: number,
    token: string
  ): Promise<PortofolioResponse<Portofolio>> => {
    return apiRequest(`/portofolio/${id}`, { method: "DELETE" }, token);
  },
};

// Api endpoints for applying to available positions

export const applyPositionApi = {
  getAllJobAvailable: async (
    token: string
  ): Promise<dataResponse<AvailablePosition[]>> => {
    return apiRequest(`/availablePosition`, { method: "GET" }, token);
  },

  applyToPosition: async (
    positionId: number,
    token: string
  ): Promise<dataResponse<null>> => {
    return apiRequest(
      `/positionApplied/apply/${positionId}`,
      { method: "POST" },
      token
    );
  },
};

// Api endpoints for showing applicants history
export const applicantsHistoryApi = {
  getApplicantsHistory: async (token: string): Promise<dataResponse<any[]>> => {
    return apiRequest(
      `/positionApplied/appliedPosition`,
      { method: "GET" },
      token
    );
  },
};
