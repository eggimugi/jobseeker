import { SocietyProfile } from "./profile";

export interface JobPosition {
  id: number;
  position_name: string;
  description: string;
  submission_start_date: string;
  submission_end_date: string;
  capacity: number;
  companyId: number;
  createdAt?: string;
  updatedAt?: string;
  company: {
    name: string;
    address: string;
  };
}

export interface dataResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface JobPositionValidationErrors {
  position_name?: string | null;
  description?: string | null;
  submsission_start_date?: string | null;
  submission_end_date?: string | null;
  capacity?: string | null;
}

export interface Application {
  id: number;
  societyId: number;
  availablePositionId: number;
  apply_date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  society: SocietyProfile;
  available_position: JobPosition;
}


