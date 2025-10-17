export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserBody {
  name: string;
  email: string;
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}
