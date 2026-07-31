import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, User, Activity, Check, X, ArrowRight } from 'lucide-react';
import { authApi } from '../../api/auth';

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept terms' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormInputs = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as unknown as true,
    },
  });

  const passwordValue = watch('password', '');

  const passwordChecks = [
    { label: 'Min 8 characters', valid: passwordValue.length >= 8 },
    { label: 'One uppercase (A-Z)', valid: /[A-Z]/.test(passwordValue) },
    { label: 'One lowercase (a-z)', valid: /[a-z]/.test(passwordValue) },
    { label: 'One number (0-9)', valid: /[0-9]/.test(passwordValue) },
    { label: 'One special symbol (!@#$%)', valid: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  const onSubmit = async (data: SignupFormInputs) => {
    setIsLoading(true);
    try {
      await authApi.register(data);
      toast.success('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 shadow-sm">
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Create your account</h1>
          <p className="text-xs text-zinc-400">Start managing rate limits with RateScale</p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('fullName')}
                  type="text"
                  placeholder="Alex Morgan"
                  className={`w-full pl-9 pr-3 py-2 bg-zinc-950 border ${
                    errors.fullName ? 'border-red-500' : 'border-zinc-800'
                  } rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors`}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-red-400 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="alex@company.com"
                  className={`w-full pl-9 pr-3 py-2 bg-zinc-950 border ${
                    errors.email ? 'border-red-500' : 'border-zinc-800'
                  } rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-9 py-2 bg-zinc-950 border ${
                    errors.password ? 'border-red-500' : 'border-zinc-800'
                  } rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {passwordValue.length > 0 && (
              <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
                {passwordChecks.map((check, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                    {check.valid ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <X className="w-3 h-3 text-zinc-600" />
                    )}
                    <span className={check.valid ? 'text-emerald-400 font-medium' : 'text-zinc-500'}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-9 py-2 bg-zinc-950 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-zinc-800'
                  } rounded-lg text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  {...register('acceptTerms')}
                  type="checkbox"
                  className="w-3.5 h-3.5 mt-0.5 rounded border-zinc-800 bg-zinc-950 text-white cursor-pointer"
                />
                <span className="text-xs text-zinc-400 leading-snug">
                  I accept the Terms of Service & Privacy Policy
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-[11px] text-red-400 mt-1">{errors.acceptTerms.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-xs text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-zinc-300 hover:text-white">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
