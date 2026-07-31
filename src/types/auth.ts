export type Role =
  | 'Backend Engineer'
  | 'System Architect'
  | 'DevOps Engineer'
  | 'SRE'
  | 'QA Lead';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  role?: Role;
  avatarUrl?: string | null;
  createdAt?: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
