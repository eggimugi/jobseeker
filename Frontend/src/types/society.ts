export interface Portofolio {
    id?: number;
    societyId: number;
    skill: string;
    description: string;
    file: string | File;
    createdAt?: string;
    updatedAt?: string;
}

export interface PortofolioResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export interface PortofolioValidationErrors {
    skill?: string | null;
    description?: string | null;
    file?: string | null;
}

export interface AvailablePosition {
  id: number;
  position_name: string;
  capacity: number;
  description: string;
  submission_start_date: string;
  submission_end_date: string;
  companyId: number;
  company?: { 
    name: string;
    address: string;
  };
}

export interface PositionApplied {
  id: number;
  societyId: number;
  society?: {
    name: string;
    email: string;
    phone: string;
  };
  positionId: number;
  available_position?: AvailablePosition;
  apply_date: string;
  status: "Pending" | "Accepted" | "Rejected";
}

export interface dataResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}