export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  employeeId: string | null;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  specialization?: string;
  avatarUrl?: string;
  createdAt: string;
  _count?: {
    taughtCourses: number;
  };
}

export interface Student {
  id: string;
  name: string;
  email: string;
  registrationNumber: string | null;
  department: string;
  program: string | null;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  avatarUrl?: string;
  createdAt: string;
  _count?: {
    enrollments: number;
  };
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}
