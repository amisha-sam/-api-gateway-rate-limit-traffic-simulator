import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, Activity, ArrowRight, KeyRound } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const fillMasterCredentials = () => {
    setValue('email', 'master@airatelimit.com');
    setValue('password', 'MasterAdmin@2026!');
    toast.success('Master credentials filled!');
  };

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      login(response.token, response.refreshToken, response.user, data.rememberMe);
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Authentication failed. Check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 shadow-sm">
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Sign in to RateScale</h1>
          <p className="text-xs text-zinc-400">
            Adaptive Rate Limiting & Telemetry Platform
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-5">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="master@airatelimit.com"
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-zinc-300">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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
              {errors.password && (
                <p className="text-[11px] text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between py-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-zinc-800 bg-zinc-950 text-white focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-zinc-400">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Master Credentials Quick Fill Helper */}
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <KeyRound className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Demo Master Account</span>
            </div>
            <button
              type="button"
              onClick={fillMasterCredentials}
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline"
            >
              Fill Credentials
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-zinc-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-zinc-300 hover:text-white">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
