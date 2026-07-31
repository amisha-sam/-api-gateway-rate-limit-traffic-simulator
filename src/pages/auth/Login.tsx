import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validators';
import type { z } from 'zod';
import { PasswordInput } from '../../components/Form/PasswordInput';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

type LoginData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await authService.login(data.email, data.password);
      const tokens = res.tokens;
      setTokens(tokens);

      // fetch user
      const user = await authService.getCurrentUser();
      setUser(user);

      // redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Login failed';
      // lightweight notification
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {/* Pulse line background could be implemented here */}
      </div>
      <div className="p-6">
        <div className="max-w-lg mx-auto">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-extrabold">Pulsegate</h2>
            <p className="text-sm text-gray-400 mt-1">Network Operations Platform</p>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Company Email" placeholder="you@company.com" {...register('email')} error={errors.email?.message as string | undefined} />
              <PasswordInput label="Password" placeholder="Enter your password" {...register('password')} error={errors.password?.message as string | undefined} />

              <div className="flex items-center justify-between text-sm text-gray-300">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" {...register('remember')} /> Remember me
                </label>
                <Link to="/forgot-password" className="text-indigo-400 hover:underline">Forgot password?</Link>
              </div>

              <div className="pt-4">
                <Button type="submit" loading={isSubmitting} className="w-full">Sign in</Button>
              </div>

              <p className="text-center text-sm text-gray-400">Don’t have an account? <Link to="/register" className="text-indigo-400 hover:underline">Create account</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
