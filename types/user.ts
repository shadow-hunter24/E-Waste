// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  momo_number: string;
  address?: string;
  profile_picture?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  momo_number: string;
  address?: string;
}
