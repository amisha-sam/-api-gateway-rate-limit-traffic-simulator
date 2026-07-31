import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Must be a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().min(1, 'Email is required').email('Must be a valid company email'),
  role: z.enum(['Backend Engineer', 'System Architect', 'DevOps Engineer', 'SRE', 'QA Lead']),
  password: z.string().min(10, 'Password must be 10+ characters').regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/, 'Password must include upper, lower and numbers'),
  confirmPassword: z.string().min(1),
  agree: z.literal(true, { required_error: 'You must accept Terms and Privacy Policy' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email required').email('Must be a valid email'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(10, 'Password must be 10+ characters'),
  confirmPassword: z.string().min(1),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });
