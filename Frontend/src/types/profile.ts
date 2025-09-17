export interface CompanyProfile {
  id?: number;
  userId: number;
  name: string;
  address: string;
  phone: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocietyProfile {
  id?: number;
  userId: number;
  name: string;
  address: string;
  phone: string;
  date_of_birth: string; // YYYY-MM-DD format
  gender: 'Male' | 'Female';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileResponse<T>{
  success: boolean;
  message: string;
  data: T;
}

export interface ValidationErrors {
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  description?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
}
