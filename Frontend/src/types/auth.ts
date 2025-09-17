export interface User {
  id: number;
  name: string;
  email: string;
  role: 'HRD' | 'Society';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: '' | 'HRD' | 'Society';
}